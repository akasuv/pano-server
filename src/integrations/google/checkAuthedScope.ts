import oauth2Client from "./oauth2Client";

const checkAuthedScope = () => {
  const res = oauth2Client.credentials.scope?.includes(
    "https://www.googleapis.com/auth/calendar.readonly",
  );

  return !!res;
};

export default checkAuthedScope;
