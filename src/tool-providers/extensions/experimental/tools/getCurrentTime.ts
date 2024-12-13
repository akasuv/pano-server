import { z } from "zod";
import PanoTool from "@/tool-maker/PanoTool";
import { LangGraphRunnableConfig } from "@langchain/langgraph";

const getCurrentTimeData = async (
  _: unknown,
  config: LangGraphRunnableConfig,
) => {
  const timezone = config.configurable!.timezone;
  const options = { timeZone: timezone, hour12: false };
  const currentTime = new Date();
  const localTime = new Intl.DateTimeFormat("en-US", {
    ...options,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(currentTime);

  return JSON.stringify({
    iso: new Date(currentTime.toLocaleString("en-US", options)).toISOString(),
    local: localTime,
    unix: Math.floor(
      new Date(currentTime.toLocaleString("en-US", options)).getTime() / 1000,
    ),
    timezone,
  });
};

const getCurrentTime = new PanoTool({
  name: "get_current_time",
  description:
    "This tool fetches the current time in ISO, local, and UNIX timestamp formats. Use this tool to obtain the current date and time for time-sensitive operations.",
  schema: z.object({}), // No input required
  runner: getCurrentTimeData,
});

export default getCurrentTime;
