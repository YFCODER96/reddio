import ReddioApi from "../apis/ReddioApi.js";
import User from "../models/userModel.js";
import puppeteer from "puppeteer-core";
import BitBrowserApi from "../apis/BitBrowserApi.js";
/* 全局 */
const bindedBrowserGroupId = "2c9bc06194f8165b0194f9b33e6b37c3";
const register = async () => {
    console.log("register");
    // 查询空邀请码
    const user = await User.findOne({
        invitationCode: "",
    });
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
    // 推特授权
    const { url: twitterAuthUrl } = await reddioApi.getTwitterAuth();
    console.log(twitterAuthUrl);
    // 启动浏览器
    const pageIndex = 0;
    const pageSize = 1;
    const browserList = await BitBrowserApi.getBrowserList(pageIndex, pageSize);
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
    const element = await page.waitForSelector('::-p-xpath(//div[text()="Authorize app"])');
    if (element) {
        await element.click();
    }
    else {
        console.log("授权按钮不存在或者未登录twitter");
        await BitBrowserApi.updateBrowserGroup(bindedBrowserGroupId, [id]);
        return;
    }
    // 等待授权完成
    await new Promise((resolve) => setTimeout(resolve, 5000));
    // 关闭浏览器
    await BitBrowserApi.closeBrowser(id);
    // 移动浏览器到绑定分组
    await BitBrowserApi.updateBrowserGroup(bindedBrowserGroupId, [id]);
    // 更新绑定信息
    await User.findOneAndUpdate({ walletAddress: user.walletAddress }, { twitterBindedBrowserSeq: seq });
    console.log("finish");
};
export default register;
