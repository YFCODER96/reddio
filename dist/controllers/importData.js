import mongoose from "mongoose";
import { randomGeneratorUserAgent } from "../utils/etherUtil.js";
async function importData() {
    try {
        // 生成随机 User-Agent
        const userAgent = randomGeneratorUserAgent();
        // 连接数据库
        mongoose
            .connect("mongodb://localhost:27017/", {
            dbName: "reddio",
        })
            .then(() => console.log("✅ 数据库连接成功"))
            .catch((err) => console.error(`❌ 数据库连接失败:${err}`));
    }
    finally {
    }
}
