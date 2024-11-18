import express from "express";
import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { StateGraph } from "@langchain/langgraph";
import { MemorySaver, Annotation } from "@langchain/langgraph";
import { RunnableConfig } from "@langchain/core/runnables";

const router = express.Router();

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
    configuration: {
      baseURL: process.env["OPENAI_BASE_URL"],
    },
  });

  const messages = state.messages;
  const response = await model.invoke(messages);

  // We return a list, because this will get added to the existing list
  return { messages: [response] };
}

// Define a new graph
const workflow = new StateGraph(StateAnnotation)
  .addNode("agent", callModel)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", shouldContinue);

const checkpointer = new MemorySaver();

const graph = workflow.compile({ checkpointer });

router.post("/", async (req, res) => {
  const { message, model, threadId } = req.body;

  console.log({
    model,
    threadId,
  });
  const finalState = await graph.invoke(
    { messages: [new HumanMessage(message)] },
    { configurable: { thread_id: threadId, model } },
  );

  res.json({
    message: finalState.messages[finalState.messages.length - 1].content,
  });
});

export default router;
