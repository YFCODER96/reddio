import { ethers } from "ethers";

import UserAgent from "user-agents";

/**
 * 发送交易
 * @param privateKey 私钥
 * @param toAddress 交易目的地址
 * @param amountInEther 交易金额，以太坊单位
 */
async function sendTransaction(
  privateKey: string,
  toAddress: string,
  amountInEther: string
) {
  try {
    // 设置提供者
    const provider = new ethers.JsonRpcProvider(
      "https://reddio-dev.reddio.com"
    );
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
  } catch (error) {
    console.error("❌ 发送交易的错误：", error);
  }
}

// 生成随机 User-Agent
const randomGeneratorUserAgent = () =>
  new UserAgent({
    deviceCategory: "desktop", // 仅生成桌面设备的 User-Agent
  }).toString();

export { sendTransaction, randomGeneratorUserAgent };
