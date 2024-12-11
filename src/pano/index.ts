// import { ChatOpenAI } from "@langchain/openai";
// import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
// import { LastValue, StateGraph } from "@langchain/langgraph";
// import { MemorySaver, Annotation } from "@langchain/langgraph";
// import { RunnableConfig } from "@langchain/core/runnables";
// import { ToolNode } from "@langchain/langgraph/prebuilt";
// import tools from "@/tool-registry";

// type StateDefinition = {
//   messages: ReturnType<typeof Annotation<BaseMessage[]>>;
//   approved: LastValue<boolean>;
// };

// class Pano {
//   stateAnnotation: ReturnType<typeof Annotation.Root<StateDefinition>>;
//   graph: StateGraph<
//     typeof this.stateAnnotation,
//     StateDefinition,
//     StateDefinition,
//     "__start__" | "agent"
//   >;

//   constructor() {
//     this.stateAnnotation = Annotation.Root({
//       messages: Annotation<BaseMessage[]>({
//         reducer: (x, y) => x.concat(y),
//       }),
//       approved: Annotation<boolean>(),
//     });

//     // Define a new graph
//     this.graph = new StateGraph(this.stateAnnotation).addNode(
//       "agent",
//       this.callModel,
//     );
//     // .addNode("tools", toolNode)
//     // .addEdge("__start__", "agent")
//     // .addConditionalEdges("agent", shouldContinue)
//     // .addEdge("tools", "agent");
//   }

//   async callModel(
//     state: typeof this.stateAnnotation.State,
//     config?: RunnableConfig,
//   ) {
//     const modelName = config?.configurable?.model;

//     const model = new ChatOpenAI({
//       model: modelName,
//       streaming: true,
//       configuration: {
//         baseURL: process.env["OPENAI_BASE_URL"],
//       },
//     }).bindTools(tools);

//     const messages = state.messages;
//     const response = await model.invoke(messages);

//     return { messages: [response] };
//   }
// }
