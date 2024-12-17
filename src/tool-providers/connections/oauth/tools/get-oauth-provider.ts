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
      {
        id: "ce2cd7ce-f104-4690-8991-13e55a3b2bd6",
        name: "GitHub",
        scopes: ["repo"],
        description: "This provider will allow you to connect to GitHub",
      },
      {
        id: "1b612fd5-a6bb-4a7d-96bb-15498ab8475e",
        name: "Zoom",
        scopes: ["meeting:write:meeting"],
        description: "This provider will allow you to connect to Zoom",
      },
    ]);
  },
});

export default getOAuthProviders;
