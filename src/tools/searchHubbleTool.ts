import { z } from "zod";
import { TOOL_NAMES } from "../config/constants.js";
import { HubbleService } from "../services/hubbleService.js";
import { SearchHubbleArgs, searchHubbleArgsSchema } from "../types/index.js";
import { ErrorHandler } from "../utils/errors.js";

/**
 * Tool implementation for searching Hubble
 */
export class SearchHubbleTool {
  private hubbleService: HubbleService;

  constructor() {
    this.hubbleService = new HubbleService();
  }

  /**
   * Gets the tool definition for the MCP server
   */
  getDefinition() {
    return {
      name: TOOL_NAMES.SEARCH_HUBBLE,
      description: "Get pumpfun data and solana DEX data from Hubble",
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
    };
  }

  /**
   * Executes the search-hubble tool
   */
  async execute(args: unknown): Promise<any> {
    try {
      if (!args) {
        throw ErrorHandler.createInvalidParamsError("Arguments are required for search-hubble");
      }

      // Validate and parse the arguments with Zod
      const validatedArgs = searchHubbleArgsSchema.parse(args);
      const result = await this.hubbleService.search(validatedArgs.query);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result),
          },
        ],
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw ErrorHandler.handleZodError(error);
      }
      throw ErrorHandler.handleError(error, "Failed to execute search-hubble");
    }
  }
}
