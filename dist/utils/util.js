import UserAgent from "user-agents";
// 生成随机 User-Agent
const randomGeneratorUserAgent = () => new UserAgent({
    deviceCategory: "desktop", // 仅生成桌面设备的 User-Agent
}).toString();
/**
 * Checks if twelve hours have passed since the given time.
 * @param givenTimeString - A string representing the given time in a format
 *                          that can be parsed by the Date constructor.
 * @returns A boolean indicating whether twelve or more hours have passed
 *          since the given time.
 */
function hasTwelveHoursPassed(givenTimeString) {
    // 将给定的时间字符串转换为 Date 对象
    const givenTime = new Date(givenTimeString);
    // 获取当前时间
    const currentTime = new Date();
    // 计算时间差（以毫秒为单位）
    const timeDifference = currentTime.getTime() - givenTime.getTime();
    // 将时间差转换为小时
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    // 返回是否超过12小时
    return hoursDifference >= 12;
}
export { randomGeneratorUserAgent, hasTwelveHoursPassed };
