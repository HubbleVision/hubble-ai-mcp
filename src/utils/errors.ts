import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

/**
 * Handles and transforms errors into standardized MCP errors
 */
export class ErrorHandler {
  /**
   * Handles Zod validation errors
   */
  static handleZodError(error: z.ZodError): McpError {
    const message = error.errors
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    
    return new McpError(ErrorCode.InvalidParams, `Invalid arguments: ${message}`);
  }

  /**
   * Handles general errors and converts them to MCP errors if needed
   */
  static handleError(error: unknown, context: string): McpError {
    if (error instanceof McpError) {
      return error;
    }
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Unknown error";
    
    return new McpError(
      ErrorCode.InternalError,
      `${context}: ${errorMessage}`
    );
  }

  /**
   * Creates an invalid parameters error
   */
  static createInvalidParamsError(message: string): McpError {
    return new McpError(ErrorCode.InvalidParams, message);
  }
}
