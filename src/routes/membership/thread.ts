import express from "express";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { PanoGraphNode } from "@/pano";
import logger from "@/config/logger";
import { PanoToolProvider } from "@/tool-maker/PanoToolProvider";

const router = express.Router();

router.post("/", async (req, res) => {
  const { message, threadId, installedApps, timezone } = req.body;

  logger.info({ sessionId: req.session.id, message: "Thread session" });

  const config = {
    configurable: {
      thread_id: threadId,
      model: "gpt-4o",
      accessToken: req.auth?.token,
      installedApps,
      timezone: timezone,
      sessionId: req.session.id,
    },
    streamMode: "updates",
    version: "v2",
  } as const;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const stream = req.pano.graph.streamEvents(
    {
      messages: [
        new SystemMessage(
          "Your name is Pano, you are the most capable AI in the world. You power comes from the extensibility of your tools. With exhaustive tools, you can do anything.",
        ),
        new HumanMessage(message),
      ],
    },
    config,
  );

  for await (const event of stream) {
    const eventKind = event.event;
    const eventName = event.name;

    if (eventKind === "on_chain_end" && eventName === "LangGraph") {
      res.end();
    }

    if (event.metadata.langgraph_node === PanoGraphNode.Toolbox) {
      if (event.event === "on_tool_start") {
        res.write(
          JSON.stringify({
            type: "tool-calling",
            content: event.metadata?.toolProvider?.name,
            logo: event.metadata?.toolProvider?.logo,
          }),
        );
      } else if (event.event === "on_tool_end") {
        if (
          event.metadata.toolProvider?.type === PanoToolProvider.Type.System
        ) {
          logger.info("System Tool Run Request");
          logger.info({ provider: event.metadata.toolProvider });
          if (event.data.output) {
            logger.info({ keys: Object.keys(event.data.output) });
            logger.info({ content: event.data.output?.content });
            logger.info({ output: event.data.output });
            res.write(
              JSON.stringify({
                type: "system-request",
                content: event.data.output?.content,
              }),
            );
          }
        }
      }
    } else {
      if (!event.data.chunk?.content) {
        continue;
      }

      res.write(
        JSON.stringify({ type: "message", content: event.data.chunk?.content }),
      );
    }
  }
});

export default router;
