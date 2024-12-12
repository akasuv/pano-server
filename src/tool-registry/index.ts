import { extensions, connections, system } from "@/tool-providers";

const installedExtensions = extensions
  .map((extension) => extension.install())
  .flat();

const installedConnections = connections
  .map((connection) => connection.install())
  .flat();

const installedSystem = system.install();

const tools = [
  ...installedExtensions,
  ...installedConnections,
  ...installedSystem,
];

export default tools;
