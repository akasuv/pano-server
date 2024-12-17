import GitHub from "@/oauth/providers/github";
import { PanoToolProvider } from "@/tool-maker/PanoToolProvider";
import createNewRepo from "./tools/createNewRepo";

const github = new PanoToolProvider({
  name: "GitHub",
  description: "This tool provider is from GitHub",
  type: PanoToolProvider.Type.Connection,
  oauthProvider: new GitHub(),
});

github.addTool(createNewRepo);

export default github;
