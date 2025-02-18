import { connect } from "puppeteer-real-browser";
import { ethers } from "ethers";
// 文档
/**
 * 领取测试币
 * @param walletAddress 钱包地址
 */
const claimTestCoin = async (walletAddress) => {
    const { browser, page } = await connect({
        headless: false,
        args: ["--window-size=800,600"],
        customConfig: {},
        turnstile: true,
        connectOption: {},
        disableXvfb: false,
        ignoreAllFlags: false,
        // proxy:{
        //     host:'<proxy-host>',
        //     port:'<proxy-port>',
        //     username:'<proxy-username>',
        //     password:'<proxy-password>'
        // }
    });
    await page.goto("https://testnet-faucet.reddio.com/");
    await page.waitForNavigation();
    await page.locator('input[type="text"]').fill(walletAddress);
    await page.locator("button ::-p-text(Claim)").click();
    await new Promise((resolve) => setTimeout(() => {
        resolve(browser.close());
    }, 10000));
};
/**
 * 发送交易
 * @param privateKey 私钥
 * @param toAddress 交易目的地址
 * @param amountInEther 交易金额，以太坊单位
 */
async function sendTransaction(privateKey, toAddress, amountInEther) {
    try {
        // 设置提供者
        const provider = new ethers.JsonRpcProvider("https://reddio-dev.reddio.com");
        const wallet = new ethers.Wallet(privateKey, provider);
        // 创建交易对象
        const tx = {
            to: toAddress,
            value: ethers.parseEther(amountInEther),
        };
        // 发送交易
        const transactionResponse = await wallet.sendTransaction(tx);
        console.log("✅ 交易发送！哈希:", transactionResponse.hash);
        // 等待交易被确认
        const receipt = await transactionResponse.wait();
        console.log("✅ 交易在块中确认：", receipt?.blockNumber);
    }
    catch (error) {
        console.error("❌ 发送交易的错误：", error);
    }
}
export { claimTestCoin, sendTransaction };
