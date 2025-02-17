import superagent from "superagent";
class BitBrowserApi {
    static baseURL = "http://127.0.0.1:54345";
    // 检查运行服务是否可用
    static healthCheck = () => superagent
        .post(`${this.baseURL}/health`)
        .then((res) => console.log(`✅ 比特浏览器服务状态:${res.body.data}`))
        .catch((err) => {
        console.error(`❌ 比特浏览器服务状态:${err}`);
        process.exit(1);
    });
    // 打开浏览器
    static openBrowser = (id) => superagent
        .post(`${this.baseURL}/browser/open`)
        .send({ id, args: ["--window-size=1920,1080"] })
        .then((res) => res.body.data)
        .then((data) => data)
        .catch((err) => console.error(`❌ 打开浏览器:${err}`));
    // 关闭浏览器
    static closeBrowser = (id) => superagent
        .post(`${this.baseURL}/browser/close`)
        .send({ id })
        .then((res) => console.log(`✅ 关闭浏览器:${res.body.data}`))
        .catch((err) => console.error(`❌ 关闭浏览器:${err}`));
    // 批量修改浏览器窗口分组 /browser/group/update
    static updateBrowserGroup = (groupId, browserIds) => superagent
        .post(`${this.baseURL}/browser/group/update`)
        .send({ groupId, browserIds })
        .then((res) => console.log(`✅ 批量修改浏览器窗口分组:${res.body.data}`))
        .catch((err) => console.error(`❌ 批量修改浏览器窗口分组:${err}`));
    // 分页获取浏览器窗口列表 /browser/list
    static getBrowserList = (page, pageSize) => superagent
        .post(`${this.baseURL}/browser/list`)
        .send({ page, pageSize })
        .then((res) => res.body.data.list)
        .catch((err) => console.error(`❌ 分页获取浏览器窗口列表:${err}`));
}
export default BitBrowserApi;
