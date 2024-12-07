import { initSupabaseClient } from "@/middlewares/supabase";
import createOauth2Client from "./oauth2Client";
import { jwtDecode } from "jwt-decode";

const saveCredentials = async (code: string, authToken: string) => {
  const oauth2Client = createOauth2Client();
  const supabaseClient = initSupabaseClient(authToken);

  const decoded = jwtDecode(authToken);

  let data = await oauth2Client.getToken(code);
  const tokens = data.tokens;

  const accessToken = tokens.access_token;
  const refreshToken = tokens.refresh_token;

  const { data: dbData, error } = await supabaseClient
    .from("oauth_tokens")
    .insert({
      user_id: decoded.sub,
      scope: data.tokens.scope,
      access_token: accessToken,
      resource_server_name: "google" + Date.now(),
    });

  console.log("supabase data: ", dbData, error);

  return tokens;
};

export default saveCredentials;
