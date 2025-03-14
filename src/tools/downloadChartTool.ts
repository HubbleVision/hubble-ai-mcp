import { z } from "zod";
import { TOOL_NAMES } from "../config/constants.js";
import { ChartService } from "../services/chartService.js";
import { downloadChartArgsSchema } from "../types/index.js";
import { ErrorHandler } from "../utils/errors.js";

/**
 * Tool implementation for downloading charts
 */
export class DownloadChartTool {
  /**
   * Gets the tool definition for the MCP server
   */
  getDefinition() {
    return {
      name: TOOL_NAMES.DOWNLOAD_CHART,
      description: "Download a chart image to a local file",
      inputSchema: {
        type: "object",
        properties: {
          config: {
            type: "object",
            description: "Chart configuration object",
          },
          outputPath: {
            type: "string",
            description: "Path where the chart image should be saved",
          },
        },
        required: ["config", "outputPath"],
      },
    };
  }

  /**
   * Executes the download_chart tool
   */
  async execute(args: unknown): Promise<any> {
    try {
      if (!args) {
        throw ErrorHandler.createInvalidParamsError("Arguments are required for download_chart");
      }

      // Validate and parse the arguments with Zod
      const validatedArgs = downloadChartArgsSchema.parse(args);
      const chartConfig = ChartService.generateChartConfig(validatedArgs.config);
      const outputPath = await ChartService.downloadChart(chartConfig, validatedArgs.outputPath);

      return {
        content: [
          {
            type: "text",
            text: `Chart saved to ${outputPath}`,
          },
        ],
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw ErrorHandler.handleZodError(error);
      }
      throw ErrorHandler.handleError(error, "Failed to download chart");
    }
  }
}
