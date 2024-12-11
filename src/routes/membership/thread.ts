import express from "express";
import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { StateGraph } from "@langchain/langgraph";
import { MemorySaver, Annotation } from "@langchain/langgraph";
import { RunnableConfig } from "@langchain/core/runnables";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import tools from "@/tools";

const router = express.Router();

// const claimCheck = claimIncludes("membershipStatus", "active");

const toolNode = new ToolNode(tools);

const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
  approved: Annotation<boolean>(),
});

function shouldContinue(state: typeof StateAnnotation.State) {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1] as AIMessage;

  // If the LLM makes a tool call, then we route to the "tools" node
  if (lastMessage.tool_calls?.length) {
    return "tools";
  }
  // Otherwise, we stop (reply to the user)
  return "__end__";
}

// Define the function that calls the model
async function callModel(
  state: typeof StateAnnotation.State,
  config?: RunnableConfig,
) {
  const modelName = config?.configurable?.model;

  const model = new ChatOpenAI({
    model: modelName,
    streaming: true,
    configuration: {
      baseURL: process.env["OPENAI_BASE_URL"],
    },
  }).bindTools(tools);

  const messages = state.messages;
  const response = await model.invoke(messages);

  // We return a list, because this will get added to the existing list
  return { messages: [response] };
}

// Define a new graph
const workflow = new StateGraph(StateAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", shouldContinue)
  .addEdge("tools", "agent");

const checkpointer = new MemorySaver();

const graph = workflow.compile({ checkpointer });

router.post("/", async (req, res) => {
  const { message, threadId, approved } = req.body;

  console.log("thread request:", req.body);
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

  if (approved) {
    await graph.updateState(config, { approved: true });

    const streamX = graph.streamEvents(null, config);
    for await (const event of streamX) {
      const eventKind = event.event;
      const eventName = event.name;
      await graph.updateState(config, { approved: true });

      console.log(
        "--------------------------------- APPROVED START -------------------------------",
      );
      console.dir(event, { depth: null });
      console.log(
        "--------------------------------- APPROVED END -------------------------------",
      );

      if (eventKind === "on_chain_end" && eventName === "LangGraph") {
        res.end();
      }

      if (
        event.metadata.langgraph_node === "tools" &&
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
        JSON.stringify({
          type: "message",
          content: event.data.chunk?.content,
        }),
      );
    }
    await graph.updateState(config, { approved: false });
  } else {
    console.log("Not Approved!!!!!!!!!!!!!!!!!!!!!!!");
    const stream = graph.streamEvents(
      { messages: [new HumanMessage(message)] },
      config,
    );

    for await (const event of stream) {
      const eventKind = event.event;
      const eventName = event.name;

      console.dir(event, { depth: null });

      if (eventKind === "on_chain_end" && eventName === "LangGraph") {
        res.end();
      }

      if (
        event.metadata.langgraph_node === "tools" &&
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

    // const isHumanApproved = (await graph.getState(config)).values.approved;

    // console.log("is human approved: ", isHumanApproved);

    // if (!isHumanApproved) {
    //   res.write(
    //     JSON.stringify({
    //       type: "human-in-the-loop",
    //     }),
    //   );
    // }
  }
});

export default router;
