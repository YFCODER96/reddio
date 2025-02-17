import superagent from "superagent";
import { SocksProxyAgent } from "socks-proxy-agent";
class ReddioApi {
    baseURL = "https://points-mainnet.reddio.com";
    ipProxy;
    walletAddress;
    userAgent;
    invitationCode;
    constructor(props) {
        this.ipProxy = props.ipProxy;
        this.walletAddress = props.walletAddress;
        this.userAgent = props.userAgent;
        this.invitationCode = props.invitationCode;
    }
    // 查询用户信息
    async getUserInfo() {
        const res = await superagent
            .get(`${this.baseURL}/v1/userinfo`)
            .query({ wallet_address: this.walletAddress })
            .agent(new SocksProxyAgent(this.ipProxy))
            .set("User-Agent", this.userAgent)
            .then((res) => res.body)
            .catch((err) => err.response.body);
        return res;
    }
    // Twitter Auth
    async getTwitterAuth() {
        const res = await superagent
            .get(`${this.baseURL}/v1/login/twitter`)
            .query({ wallet_address: this.walletAddress })
            .agent(new SocksProxyAgent(this.ipProxy))
            .set("User-Agent", this.userAgent)
            .then((res) => res.body)
            .catch((err) => err.response.body);
        return res.data;
    }
    // PreRegister
    async preRegister() {
        const res = await superagent
            .post(`${this.baseURL}/v1/pre_register`)
            .send({
            wallet_address: this.walletAddress,
        })
            .agent(new SocksProxyAgent(this.ipProxy))
            .set("User-Agent", this.userAgent)
            .then((res) => res.body)
            .catch((err) => err.response.body);
        return res.data;
    }
    // Register
    async register() {
        const res = await superagent
            .post(`${this.baseURL}/v1/register`)
            .send({
            wallet_address: this.walletAddress,
            invitation_code: this.invitationCode,
        })
            .agent(new SocksProxyAgent(this.ipProxy))
            .set("User-Agent", this.userAgent)
            .then((res) => res.body)
            .catch((err) => err.response.body);
        return res.data;
    }
}
export default ReddioApi;
