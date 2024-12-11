import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import {
  MemorySaver,
  Annotation,
  StateGraph,
  StateType,
  UpdateType,
  START,
  END,
  BinaryOperatorAggregate,
  CompiledStateGraph,
} from "@langchain/langgraph";
import { RunnableConfig } from "@langchain/core/runnables";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import tools from "@/tool-registry";
import logger from "@/config/logger";

export enum PanoGraphNode {
  MindEngine = "MindEngine",
  Toolbox = "Toolbox",
}

type SD = {
  messages: BinaryOperatorAggregate<BaseMessage[], BaseMessage[]>;
};

class Pano {
  stateAnnotation: ReturnType<typeof Annotation.Root<SD>>;
  graph: InstanceType<
    typeof CompiledStateGraph<StateType<SD>, UpdateType<SD>, string, SD, SD>
  >;

  constructor() {
    logger.info("Pano initialized");
    const stateDefinition: SD = {
      messages: Annotation<BaseMessage[]>({
        reducer: (x, y) => x.concat(y),
      }),
    };

    const checkpointer = new MemorySaver();
    const toolsNode = new ToolNode(tools);

    this.stateAnnotation = Annotation.Root(stateDefinition);

    this.graph = new StateGraph(this.stateAnnotation)
      .addNode(PanoGraphNode.MindEngine, this.mindEngineNode)
      .addNode(PanoGraphNode.Toolbox, toolsNode)
      .addEdge(START, PanoGraphNode.MindEngine)
      .addEdge(PanoGraphNode.Toolbox, PanoGraphNode.MindEngine)
      .addConditionalEdges(PanoGraphNode.MindEngine, this.shouldContinue)
      .compile({ checkpointer });
  }

  shouldContinue(state: typeof this.stateAnnotation.State) {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1] as AIMessage;

    if (lastMessage.tool_calls?.length) {
      return "Toolbox";
    }
    return END;
  }

  async mindEngineNode(
    state: typeof this.stateAnnotation.State,
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

    return { messages: [response] };
  }
}

export default Pano;
