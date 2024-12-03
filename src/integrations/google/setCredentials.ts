import oauth2Client from "./oauth2Client";

const setCredentials = async (code: string) => {
  let { tokens } = await oauth2Client.getToken(code);
  console.log("tokens", tokens);
  oauth2Client.setCredentials(tokens);
};

export default setCredentials;
