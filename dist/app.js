import User from "./models/userModel.js";
import ReddioApi from "./apis/ReddioApi.js";
import { claimTestCoin, } from "./controllers/taskController.js";
async function app() {
    // 取数据库用户资料
    /*  const user = await User.findOne({
      walletAddress: "0x777b9D0bf2ae4fEb6C9B3Eb412eb02b43e561C55",
    }); */
    // 获取当前时间并减去12小时
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    const user = await User.findOne({
        updatedAt: { $lt: twelveHoursAgo },
        walletAddress: "0x777b9D0bf2ae4fEb6C9B3Eb412eb02b43e561C55",
    });
    if (!user) {
        return console.error(`❌ 用户不存在`);
    }
    console.log(`🫱·选择:${user.walletAddress}`);
    // 实例化 ReddioApi
    const reddioApi = new ReddioApi(user);
    // 查询用户信息
    const userInfo = await reddioApi.getUserInfo();
    console.log("⌛·更新用户");
    // 更新用户状态
    if (userInfo.status === "OK") {
        // 更新用户信息
        user.isTwitterAuth = true;
        user.userInfo = userInfo;
    }
    else if (userInfo.status === "Error") {
        // 用户未注册
        console.warn(`用户未注册:${user.walletAddress} 消息：${userInfo.error}`);
        if (userInfo.error === "User pre registered, twitter bind") {
            user.isTwitterAuth = true;
            // 开始注册
            const userArr = await User.aggregate([
                {
                    $match: {
                        userInfo: { $ne: null },
                    },
                },
                { $sample: { size: 1 } },
            ]);
            if (userArr.length > 0) {
                const invitationCodeUser = userArr[0];
                const invitationCode = invitationCodeUser.userInfo.data.invitation_code;
                user.usedInvitationCode = invitationCode;
                // 注册
                const result = await reddioApi.register(invitationCode);
                console.log(`注册结果:${result.status}`);
            }
        }
        else {
            user.isTwitterAuth = false;
            console.log(`⚡·用户还未注册`);
            return await user.save();
        }
    }
    // 保存用户
    await user.save();
    console.log("✅·保存用户");
    // 查询任务
    const taskInfos = await reddioApi.getTasks();
    // 需要做的任务
    const todoTaskNames = [
        "Daily Task: Claim RED tokens from the Testnet Faucet",
        "Daily Task: Complete one Testnet transfer on your wallet",
    ];
    // 开始做任务
    // #TODO 做任务
    // console.log(`🫱·选择任务:${task} uuid:${taskInfo.uuid}`);
    for (const taskname of todoTaskNames) {
        const taskInfo = taskInfos.find((item) => item.name === taskname);
        // console.log(taskInfo);
        if (!taskInfo) {
            console.warn(`任务不存在:${taskname}`);
            continue;
        }
        if (taskname === "Daily Task: Claim RED tokens from the Testnet Faucet") {
            // 领取测试币
            await claimTestCoin(reddioApi.walletAddress).catch((err) => {
                console.error(`⚡领取测试币可能失败或重复: ${err}`);
            });
            // 验证任务结果
            await reddioApi
                .taskVerify(taskInfo.uuid)
                .then((res) => console.log(`✅·验证任务结果:${res.status}`));
        } /*  else if (
          taskname === "Daily Task: Complete one Testnet transfer on your wallet"
        ) {
          sendTransaction(
            reddioApi.walletPrivateKey,
            reddioApi.walletAddress,
            "0.01"
          ).catch((err) => {
            console.error(`❌ 发送交易的错误：`, err);
          });
        } */
    }
}
export default app;
