import { jwtDecode } from "jwt-decode";
import { Auth } from "googleapis";

interface OAuth {
  client: Auth.OAuth2Client;
  credentials?: Auth.Credentials;
  getTokens: (code: string) => Promise<Auth.Credentials>;
  saveTokensToDB: (tokens: Auth.Credentials) => Promise<Auth.Credentials>;
  loadTokensFromDB: (userId: string) => Promise<Auth.Credentials | undefined>;
  setCredentials: (credentials: Auth.Credentials) => void;
  getAuthServerUrl: ({
    state,
    scope,
  }: {
    state: string;
    scope: string[];
  }) => String;
}

// class OAuthSlack implements OAuth {

// }
