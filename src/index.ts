#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { SERVER_CONFIG } from "./config/constants.js";
import { ToolRegistry } from "./tools/toolRegistry.js";
import { ErrorHandler } from "./utils/errors.js";
import { GenerateChartTool } from "./tools/generateChartTool.js";

// Create server instance
const server = new Server(SERVER_CONFIG, {
  capabilities: {
    tools: {},
  },
});

// Initialize tool registry
const toolRegistry = new ToolRegistry();

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: toolRegistry.getAllToolDefinitions(),
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    return await toolRegistry.executeTool(name, args);
  } catch (error) {
    throw ErrorHandler.handleError(error, `Error executing tool ${name}`);
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("Hubble MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);

  process.exit(1);
});
