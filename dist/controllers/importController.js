import fs from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import { JSONFilePreset } from "lowdb/node";
import User from "../models/userModel.js";
import { randomGeneratorUserAgent } from "../utils/util.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
const db = await JSONFilePreset(`${__dirname}/addresses_10000_2.json`, []);
/* 全局变量 */
const ipFileName = "socks5_ip_510.txt";
const walletFileName = "wallet_address_510.txt";
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
        const addressesArray = walletAddressArr.map((wallet, index) => {
            const ipdata = ipProxyArr[index];
            return {
                walletAddress: wallet.trim(),
                ipProxy: ipdata.trim(),
                userAgent: userAgent,
                invitationCode: "",
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
