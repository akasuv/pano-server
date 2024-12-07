import { google } from "googleapis";
import setCredentials from "./setCredentials";

const createGoogleOauth2Client = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL,
  );

  google.options({
    auth: oauth2Client,
  });

  return oauth2Client;
};

export default createGoogleOauth2Client;
