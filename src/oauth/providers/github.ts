import logger from "@/config/logger";
import OAuth from "../oauth";
import axios from "axios";

class GitHub extends OAuth {
  providerId = "ce2cd7ce-f104-4690-8991-13e55a3b2bd6";

  async getAuthServerUrl({
    state,
    scopes,
  }: {
    state: string;
    scopes: string[];
  }) {
    const queryString = (await import("query-string")).default;

    const query = {
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: process.env.PANO_ENDPOINT + "/oauth/redirect",
      scope: scopes.join(" "),
      state,
    };

    const stringifiedUrl = queryString.stringifyUrl({
      url: "https://github.com/login/oauth/authorize",
      query,
    });

    return stringifiedUrl;
  }

  async getTokens(code: string) {
    const endpoint = "https://github.com/login/oauth/access_token";
    const res = await axios.post<{
      access_token: string;
      scope: string;
    }>(
      endpoint,
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirectUri: process.env.PANO_ENDPOINT + "/oauth/redirect",
      },
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    logger.info({ message: "GitHub get tokens", data: res.data });

    return {
      access_token: res.data.access_token,
      scopes: res.data.scope.split(","),
    };
  }

  async createNewRepo({ name }: { name: string }) {
    const Octokit = (await import("octokit")).Octokit;

    const octokit = new Octokit({ auth: this.credentials?.access_token });

    const res = await octokit.request("POST /user/repos", {
      name,
      description: "This is your first repo!",
      private: true,
    });

    return { status: res.status, url: res.data.html_url };
  }
}

export default GitHub;
