import ReddioApi from "../apis/ReddioApi.js";
import User from "../models/userModel.js";
import puppeteer from "puppeteer-core";
import BitBrowserApi from "../apis/BitBrowserApi.js";
/* 全局 */
const waitForBrowserGroupId = "2c9bc04794f8157c0194f9250fab245d";
const bindedBrowserGroupId = "2c9bc06194f8165b0194f9b33e6b37c3";
// 未登录推特的浏览器分组
const unLoginTwitterBrowserGroupId = "2c9bc0589511d2ec019517117ac208ff";
const register = async () => {
    console.log("register");
    // 查询空邀请码
    const user = await User.findOne({ isTwitterAuth: { $ne: true } });
    if (!user) {
        return;
    }
    console.log(user.walletAddress);
    // 实例化 ReddioApi
    const reddioApi = new ReddioApi(user);
    // 查询用户信息
    const userInfo = await reddioApi.getUserInfo();
    console.log(userInfo);
    if (userInfo.error === "User not registered") {
        await reddioApi.preRegister().then((res) => console.log(res.message));
    }
    else if (userInfo.error === "User pre registered, twitter bind") {
        console.log(`已绑定twitter,不需要再次绑定`);
        return;
    }
    // 推特授权
    const { url: twitterAuthUrl } = await reddioApi.getTwitterAuth();
    console.log(twitterAuthUrl);
    // 启动浏览器
    const pageIndex = 0;
    const pageSize = 1;
    const browserList = await BitBrowserApi.getBrowserList(pageIndex, pageSize, waitForBrowserGroupId);
    if (browserList.length === 0) {
        console.log("没有可用的浏览器");
        process.exit(0);
    }
    // 查询该窗口编号是否绑定
    const { seq, id } = browserList[0];
    const bindedUser = await User.findOne({ twitterBindedBrowserSeq: seq });
    if (bindedUser) {
        console.log(`该浏览器编号:${seq}已绑定过`);
        return await BitBrowserApi.updateBrowserGroup(bindedBrowserGroupId, [id]);
    }
    // 启动浏览器开始绑定
    const bitBrowser = await BitBrowserApi.openBrowser(id);
    if (!bitBrowser)
        return console.log("浏览器启动失败");
    // 连接浏览器
    const browser = await puppeteer.connect({
        browserWSEndpoint: bitBrowser.ws,
        slowMo: 100, // 速度设置
    });
    const page = await browser.newPage();
    // 设置页面全屏
    await page.setViewport({
        width: 1920,
        height: 1080,
    });
    await page.goto(twitterAuthUrl);
    // 点击授权 Authorize app
    /* const element = await page
      .waitForSelector('::-p-xpath(//div[text()="Authorize app"])')
      .catch(() => null); */
    try {
        await page.locator('button ::-p-text("授权应用")').setTimeout(8000).click();
        // 等待授权完成
        await new Promise((resolve) => setTimeout(resolve, 5000));
        // 移动浏览器到绑定分组
        await BitBrowserApi.updateBrowserGroup(bindedBrowserGroupId, [id]);
        console.log("finish");
    }
    catch (error) {
        console.log("授权按钮不存在或者未登录twitter");
        // 移动浏览器到绑定分组
        await BitBrowserApi.updateBrowserGroup(unLoginTwitterBrowserGroupId, [id]);
    }
    finally {
        await page.close();
        // 关闭浏览器
        await BitBrowserApi.closeBrowser(id);
    }
};
export default register;
