import { extensions, connections } from "@/tool-providers";

const installedExtensions = extensions
  .map((extension) => extension.install())
  .flat();

const installedConnections = connections
  .map((connection) => connection.install())
  .flat();

const tools = [...installedExtensions, ...installedConnections];

export default tools;
