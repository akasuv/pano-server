import oauth2Client from "./oauth2Client";

const setCredentials = async (code: string) => {
  let data = await oauth2Client.getToken(code);
  const tokens = data.tokens;
  console.log("data", data);

  const accessToken = tokens.access_token;
  const refreshToken = tokens.refresh_token;

  console.log("accessToken", accessToken);

  oauth2Client.setCredentials(tokens);
};

export default setCredentials;
