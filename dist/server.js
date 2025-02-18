import mongoose from "mongoose";
import app from "./app.js";
//
// 连接数据库
mongoose
    .connect("mongodb://localhost:27017/", {
    dbName: "reddio",
})
    .then(() => {
    console.log("✅ 数据库连接成功");
    if (process.argv[2] === "--bind") {
        import("./controllers/bindController.js").then(async (module) => {
            while (true) {
                await module.default().catch((err) => console.error(err));
            }
        });
    }
    if (process.argv[2] === "--run") {
        app();
    }
})
    .catch((err) => console.error(`❌ 数据库连接失败:${err}`));
