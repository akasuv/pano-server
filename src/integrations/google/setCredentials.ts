import { initSupabaseClient } from "@/middlewares/supabase";
import { jwtDecode } from "jwt-decode";
import createGoogleOauth2Client from "./oauth2Client";

const setCredentials = async (
  oauth2Client: ReturnType<typeof createGoogleOauth2Client>,
  authToken: string,
) => {
  const supabaseClient = initSupabaseClient(authToken);
  const decoded = jwtDecode(authToken);
  const userId = decoded.sub;

  console.log("user id", userId);

  const { data, error } = await supabaseClient
    .from("oauth_tokens")
    .select()
    .eq("user_id", userId);

  const first = data?.[0];
  const accessToken = first?.access_token;
  console.log("first: ", first);

  if (accessToken) {
    console.log("Access token loaded success");
    oauth2Client.setCredentials({
      access_token: first.access_token,
      scope: first.scope,
    });
    console.log("Oauth2 client set success");
  }
};

export default setCredentials;
