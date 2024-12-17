import z from "zod";
import PanoTool, { Schema } from "./PanoTool";
import {
  DynamicStructuredTool,
  tool as LangChainTool,
} from "@langchain/core/tools";
import { LangGraphRunnableConfig } from "@langchain/langgraph";
import logger from "@/config/logger";
import { OAuthProviders } from "@/oauth/oauth.type";

export type InstalledTool = DynamicStructuredTool<Schema>;

type Config<K extends PanoToolProvider.Type, O> = {
  type: K;
  name: string;
  description: string;
  logoUrl?: string;
} & (K extends PanoToolProvider.Type.Connection
  ? { oauthProvider: O } // Required for Connection type
  : { oauthProvider?: undefined }); // Optional otherwise

export class PanoToolProvider<
  T extends PanoTool<z.infer<Schema>, Config<K, O>["oauthProvider"]>,
  O extends OAuthProviders,
  K extends PanoToolProvider.Type = PanoToolProvider.Type,
> {
  type: PanoToolProvider.Type;
  name: string;
  description: string;
  logoUrl?: string;
  tools: T[] = [];
  installedTools: InstalledTool[] = [];
  oauthProvider: Config<K, O>["oauthProvider"];

  constructor(config: Config<K, O>) {
    this.name = config.name;
    this.type = config.type;
    this.description = config.description;
    this.logoUrl = config.logoUrl;
    this.oauthProvider = config.oauthProvider;
  }

  addTool(tool: T) {
    this.tools.push(tool);
  }

  addTools(tools: T[]) {
    this.tools = tools;
  }

  async authCheckWrapper<I, C extends LangGraphRunnableConfig>(
    input: I,
    config: C,
    tool: T,
  ) {
    logger.info({ message: "Auth check wrapper", input });
    if (this.type === PanoToolProvider.Type.Connection) {
      if (!this.oauthProvider) {
        throw new Error(
          "oauthProvider is required but missing for Connection type.",
        );
      }

      const oauth = await this.oauthProvider?.loadAuth(
        config.configurable!.accessToken,
      );

      logger.info({
        message: "Auth check wrapper check result: ",
        authed: !!oauth?.isAuthed,
      });

      if (!oauth?.isAuthed) {
        return "Not Authed";
      }

      return await tool.runner(input, config, this.oauthProvider);
    }

    return await tool.runner(input, config, undefined);
  }

  transformToLangChainTool(tool: T) {
    return LangChainTool(
      async (input, config) => await this.authCheckWrapper(input, config, tool),
      {
        name: tool.name,
        description: tool.description,
        schema: tool.schema,
        metadata: {
          toolProvider: {
            name: this.name,
            logo: this.logoUrl,
            type: this.type,
          },
        },
      },
    );
  }

  install() {
    logger.info(`Installing ToolProvider: ${this.name}`);
    let installedTools = this.tools.map((tool) =>
      this.transformToLangChainTool(tool),
    );

    this.installedTools = installedTools as unknown as InstalledTool[];

    return installedTools;
  }
}

export namespace PanoToolProvider {
  export enum Type {
    Connection,
    System,
    Extension,
  }
}
