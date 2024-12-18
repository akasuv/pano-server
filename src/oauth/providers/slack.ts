import axios from "axios";
import logger from "@/config/logger";
import { WebClient } from "@slack/web-api";
import OAuth from "../oauth";

class Slack extends OAuth {
  providerId = "31eefcd7-278c-47ab-ab7b-fdc6603c3d76";

  async getAuthServerUrl({
    state,
    scopes,
  }: {
    state: string;
    scopes: string[];
  }) {
    const queryString = (await import("query-string")).default;
    const query = {
      client_id: "8133099718854.8139725898754",
      redirect_uri: process.env.PANO_ENDPOINT + "/oauth/redirect",
      user_scope: scopes.join(" "),
      state,
    };

    const stringifiedUrl = queryString.stringifyUrl({
      url: "https://slack.com/oauth/v2/authorize",
      query,
    });

    return stringifiedUrl;
  }

  async getTokens(code: string) {
    const endpoint = "https://slack.com/api/oauth.v2.access";
    const res = await axios.post<{
      authed_user: { access_token: string; scope: string };
    }>(
      endpoint,
      {
        client_id: "8133099718854.8139725898754",
        client_secret: process.env.SLACK_CLIENT_SECRET,
        code,
        redirectUri: process.env.PANO_ENDPOINT + "/oauth/redirect",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    logger.info({
      message: "Slack: Getting Tokens response",
      data: res.data,
    });

    const scopes = res.data.authed_user.scope.split(",");

    return {
      access_token: res.data.authed_user.access_token,
      scopes,
    };
  }

  async getChannelMessages() {
    if (!this.credentials) {
      return;
    }

    logger.info("Getting channel messages");

    let channelId = "C08466S2J1J";

    const client = new WebClient(this.credentials.access_token!);
    const result = await client.conversations.history({
      channel: channelId,
    });

    logger.info({
      message: "Got channel messages",
      data: result.messages,
    });

    return result.messages?.map((item) => ({
      text: item.text,
    }));
  }

  async getUsers() {
    const client = new WebClient(this.credentials!.access_token!);

    try {
      logger.info("Getting Slack Users...");
      const result = await client.users.list({});

      logger.info(result.members);

      return result.members?.map((member) => member.real_name);
    } catch (err) {
      logger.error(err);
      return JSON.stringify(err);
    }
  }

  async sendMessage({ text }: { text: string }) {
    let channelId = "C08466S2J1J";

    const client = new WebClient(this.credentials!.access_token!);

    const result = await client.chat.postMessage({
      channel: channelId,
      text,
    });

    return result.ok;
  }
}

export default Slack;
