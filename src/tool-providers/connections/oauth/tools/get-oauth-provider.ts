import PanoTool from "@/tool-maker/PanoTool";

const getOAuthProviders = new PanoTool({
  name: "get_oauth_providers",
  description: "This tool will get the list of available oauth providers",
  runner: async () => {
    return JSON.stringify([
      {
        id: "31eefcd7-278c-47ab-ab7b-fdc6603c3d76",
        name: "Slack",
        scopes: ["users:read", "chat:write", "channels:history"],
        description: "This provider will allow you to connect to slack",
      },
      {
        id: "95b82967-65bb-4e71-9129-20114a23150d",
        name: "Google",
        scopes: [
          "https://mail.google.com/",
          "https://www.googleapis.com/auth/documents",
          "https://www.googleapis.com/auth/drive",
          "https://www.googleapis.com/auth/calendar",
        ],
        description: "This provider will allow you to connect to Google",
      },
    ]);
  },
});

export default getOAuthProviders;
