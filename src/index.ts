#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { MastraClient } from "@mastra/client-js";

// Create server instance
const server = new Server(
  {
    name: "hubble-tool",
    version: "1.0.1",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search-hubble",
        description: "Get pumpfun data from Hubble",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query",
            },
          },
          required: ["query"],
        },
      },
    ],
  };
});

// Define the schema for search-hubble arguments
const searchHubbleArgsSchema = z.object({
  query: z.string(),
});

// Type inference from the schema
type SearchHubbleArgs = z.infer<typeof searchHubbleArgsSchema>;

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "search-hubble") {
      // Validate and parse the arguments with Zod
      if (!args) {
        throw new Error("Arguments are required for search-hubble");
      }

      const validatedArgs = searchHubbleArgsSchema.parse(args);
      const { query } = validatedArgs;

      const client = new MastraClient({
        baseUrl: "http://ai-api.hubble-rpc.xyz", // Default Mastra server port
      });

      const workflow = client.getWorkflow("hubbleWorkflow");

      // Start a new workflow run
      const result = await workflow.execute({
        message: query,
      });

      console.log(JSON.stringify(result));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result),
          },
        ],
      };
    } else {
      throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Invalid arguments: ${error.errors
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(", ")}`
      );
    }
    throw error;
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
