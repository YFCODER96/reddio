import superagent from "superagent";
import { SocksProxyAgent } from "socks-proxy-agent";

interface User {
  ipProxy: string;
  walletAddress: string;
  userAgent: string;
  usedInvitationCode: string;
}

interface UserInfo {
  status: "Error" | "OK";
  error: string | "";
  data: null | {
    invitation_code: string;
    lottery_counts: number;
    lottery_rewards: [];
    points: number;
    task_points: number;
    twitter_handle: string;
    uuid: string;
    wallet_address: string;
  };
}

class ReddioApi {
  baseURL = "https://points-mainnet.reddio.com";
  ipProxy: string;
  walletAddress: string;
  userAgent: string;
  invitationCode: string;

  constructor(props: User) {
    this.ipProxy = props.ipProxy;
    this.walletAddress = props.walletAddress;
    this.userAgent = props.userAgent;
    this.invitationCode = props.usedInvitationCode;
  }

  // 查询用户信息
  async getUserInfo() {
    const res = await superagent
      .get(`${this.baseURL}/v1/userinfo`)
      .query({ wallet_address: this.walletAddress })
      .agent(new SocksProxyAgent(this.ipProxy))
      .set("User-Agent", this.userAgent)
      .then((res) => res.body)
      .catch((err) => err.response.body)
      .then((res: UserInfo) => res);
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
  async register(invitationCode: string) {
    const res = await superagent
      .post(`${this.baseURL}/v1/register`)
      .send({
        wallet_address: this.walletAddress,
        invitation_code: invitationCode,
      })
      .agent(new SocksProxyAgent(this.ipProxy))
      .set("User-Agent", this.userAgent)
      .then((res) => res.body)
      .catch((err) => err.response.body);

    return res;
  }

  // Tasks
  async getTasks() {
    const res = await superagent
      .get(`${this.baseURL}/v1/tasks`)
      .agent(new SocksProxyAgent(this.ipProxy))
      .set("User-Agent", this.userAgent)
      .then((res) => res.body)
      .catch((err) => err.response.body);

    return res.data;
  }

  // TaskVerify /v1/points/verify
  async taskVerify(taskUuid: string) {
    const res = await superagent
      .post(`${this.baseURL}/v1/points/verify`)
      .send({
        wallet_address: this.walletAddress,
        task_uuid: taskUuid,
      })
      .agent(new SocksProxyAgent(this.ipProxy))
      .set("User-Agent", this.userAgent)
      .then((res) => res.body)
      .catch((err) => err.response.body);

    return res;
  }
}

export default ReddioApi;
