import fs from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import { randomGeneratorUserAgent } from "../utils/util.js";
import { ethers } from "ethers";
const __dirname = dirname(fileURLToPath(import.meta.url));
/* 全局变量 */
const ipFileName = "socks5_ip_1490.txt";
const walletFileName = "privateKeys_1490.txt";
const count = 510; // 导入个数
async function importData() {
    try {
        // 生成随机 User-Agent
        const userAgent = randomGeneratorUserAgent();
        const ipProxyArr = fs
            .readFileSync(`${__dirname}/../../data/${ipFileName}`, "utf-8")
            .split("\n");
        const walletAddressArr = fs
            .readFileSync(`${__dirname}/../../data/${walletFileName}`, "utf-8")
            .split("\n");
        const addressesArray = ipProxyArr.map((ipdata, index) => {
            const wallet = walletAddressArr[index];
            return {
                walletAddress: new ethers.Wallet(wallet.trim()).address,
                privateKey: wallet.trim(),
                ipProxy: ipdata.trim(),
                userAgent: userAgent,
                usedInvitationCode: "",
                remark: count,
            };
        });
        // 插入数据
        await User.insertMany(addressesArray);
        // finish
        console.log("✅ 数据导入完成");
    }
    catch (error) {
        console.log("❌ 数据导入失败" + error);
    }
}
// 连接数据库
mongoose
    .connect("mongodb://localhost:27017/", {
    dbName: "reddio",
})
    .then(() => {
    console.log("✅ 数据库连接成功");
    importData();
})
    .catch((err) => console.error(`❌ 数据库连接失败:${err}`));
