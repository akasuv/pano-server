import Google from "./providers/google";
import Slack from "./providers/slack";
import Github from "./providers/github";
import Zoom from "./providers/zoom";

export interface Credentials {
  refresh_token?: string | null;
  expiry_date?: number | null;
  access_token?: string | null;
  token_type?: string | null;
  id_token?: string | null;
  scopes?: string[];
}

export interface PanoOAuth {
  isAuthed: boolean;
  credentials?: Credentials;
  setCredentials(credentials: Credentials): Promise<void>;
  getAuthServerUrl({
    state,
    scopes,
  }: {
    state: string;
    scopes: string[];
  }): Promise<string>;
}

export type OAuthProviders =
  | InstanceType<typeof Google>
  | InstanceType<typeof Slack>
  | InstanceType<typeof Github>
  | InstanceType<typeof Zoom>;
