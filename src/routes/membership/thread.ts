import express from "express";
import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { StateGraph } from "@langchain/langgraph";
import { MemorySaver, Annotation } from "@langchain/langgraph";
import { RunnableConfig } from "@langchain/core/runnables";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import tools from "@/tools";
import { claimIncludes } from "express-oauth2-jwt-bearer";

const router = express.Router();

// const claimCheck = claimIncludes("membershipStatus", "active");

const toolNode = new ToolNode(tools);

const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
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
  const { message, model, threadId } = req.body;

  const stream = graph.streamEvents(
    { messages: [new HumanMessage(message)] },
    {
      configurable: { thread_id: threadId, model: "gpt-4o" },
      streamMode: "updates",
      version: "v2",
    },
  );

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  for await (const event of stream) {
    const eventKind = event.event;
    const eventName = event.name;

    if (eventKind === "on_chain_end" && eventName === "LangGraph") {
      res.end();
    }

    if (event.data.chunk?.content === undefined) {
      continue;
    }
    res.write(event.data.chunk?.content);
  }
});

export default router;
