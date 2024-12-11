import z from "zod";
import PanoTool, { Schema } from "./PanoTool";
import {
  DynamicStructuredTool,
  tool as LangChainTool,
} from "@langchain/core/tools";

export type InstalledTool = DynamicStructuredTool<Schema>;

export class PanoToolProvider<T extends PanoTool<z.infer<Schema>>> {
  type: PanoToolProvider.Type;
  name: string;
  description: string;
  logoUrl?: string;
  tools: T[] = [];
  installedTools: InstalledTool[] = [];

  constructor(config: {
    type: PanoToolProvider.Type;
    name: string;
    description: string;
    logoUrl?: string;
  }) {
    this.name = config.name;
    this.type = config.type;
    this.description = config.description;
    this.logoUrl = config.logoUrl;
  }

  addTool(tool: T) {
    this.tools.push(tool);
  }

  addTools(tools: T[]) {
    this.tools.concat(tools);
  }

  transformToLangChainTool(tool: PanoTool) {
    return LangChainTool(tool.runner, {
      name: tool.name,
      description: tool.description,
      schema: tool.schema,
      metadata: {
        toolProvider: {
          name: this.name,
          logo: this.logoUrl,
        },
      },
    });
  }

  install() {
    console.log("Installing tools for", this.name);
    let installedTools = this.tools.map((tool) =>
      this.transformToLangChainTool(tool),
    );

    this.installedTools = installedTools;

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
