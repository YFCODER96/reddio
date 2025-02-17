import mongoose from "mongoose";
//
// 连接数据库
mongoose
    .connect("mongodb://localhost:27017/", {
    dbName: "reddio",
})
    .then(() => {
    console.log("✅ 数据库连接成功");
    if (process.argv[2] === "--register") {
        import("./controllers/registerController.js").then((module) => {
            module.default();
        });
    }
})
    .catch((err) => console.error(`❌ 数据库连接失败:${err}`));
