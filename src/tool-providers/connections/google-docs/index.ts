import { PanoToolProvider } from "@/tool-maker/PanoToolProvider";
import createGoogleDocs from "./tools/create-docs";
import Google from "@/oauth/providers/google";

const googleDocs = new PanoToolProvider({
  type: PanoToolProvider.Type.Connection,
  name: "Google Docs",
  description:
    "This tool provider will provide tools to connect to Google services.",
  logoUrl:
    "https://lh3.googleusercontent.com/1DECuhPQ1y2ppuL6tdEqNSuObIm_PW64w0mNhm3KGafi40acOJkc4nvsZnThoDKTH8gWyxAnipJmvCiszX8R6UAUu1UyXPfF13d7",
  oauthProvider: new Google(),
});

googleDocs.addTools([createGoogleDocs]);

export default googleDocs;
