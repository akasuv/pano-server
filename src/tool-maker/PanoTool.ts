import OAuth from "@/oauth/oauth";
import Google from "@/oauth/providers/google";
import Slack from "@/oauth/providers/slack";
import { LangGraphRunnableConfig } from "@langchain/langgraph";
import { z } from "zod";

type ZodObjectAny = z.ZodObject<any, any, any, any>;

export type Schema = ZodObjectAny | z.ZodString;

class PanoTool<
  T extends Schema = Schema,
  O extends
    | InstanceType<typeof Google>
    | InstanceType<typeof Slack>
    | undefined = undefined,
> {
  name: string;
  description: string;
  schema?: T;
  runner: (
    input: z.infer<T>,
    config: LangGraphRunnableConfig,
    oAuthProvider: O,
  ) => Promise<unknown> | unknown;

  constructor(config: {
    name: string;
    description: string;
    schema?: T;
    runner: (
      input: z.infer<T>,
      config: LangGraphRunnableConfig,
      oAuthProvider: O,
    ) => Promise<unknown> | unknown;
  }) {
    this.name = config.name;
    this.description = config.description;
    this.schema = config.schema;
    this.runner = config.runner;
  }
}

export default PanoTool;
