import express from "express";
import { HumanMessage } from "@langchain/core/messages";
import { PanoGraphNode } from "@/pano";

const router = express.Router();

router.post("/", async (req, res) => {
  req.log.info(req.body);

  const { message, threadId } = req.body;

  const config = {
    configurable: {
      thread_id: threadId,
      model: "gpt-4o",
      accessToken: req.auth?.token,
    },
    streamMode: "updates",
    version: "v2",
  } as const;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const stream = req.pano.graph.streamEvents(
    { messages: [new HumanMessage(message)] },
    config,
  );

  for await (const event of stream) {
    const eventKind = event.event;
    const eventName = event.name;

    if (eventKind === "on_chain_end" && eventName === "LangGraph") {
      res.end();
    }

    if (
      event.metadata.langgraph_node === PanoGraphNode.Toolbox &&
      event.event === "on_tool_start"
    ) {
      res.write(
        JSON.stringify({
          type: "tool-calling",
          content: event.metadata?.toolProvider?.name,
          logo: event.metadata?.toolProvider?.logo,
        }),
      );
    }

    if (!event.data.chunk?.content) {
      continue;
    }

    res.write(
      JSON.stringify({ type: "message", content: event.data.chunk?.content }),
    );
  }
});

export default router;
