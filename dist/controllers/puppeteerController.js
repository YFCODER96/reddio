import { connect } from "puppeteer-real-browser";
// 领取测试币
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
    await new Promise((resolve) => setTimeout(resolve, 3500));
    await browser.close();
};
claimTestCoin("0x4988fF8d766275AcAb4d77C6a4599e3B56Dd7e0F");
export { claimTestCoin };
