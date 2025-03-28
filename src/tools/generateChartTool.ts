import { z } from "zod";
import { TOOL_NAMES } from "../config/constants.js";
import { ChartService } from "../services/chartService.js";
import { generateChartArgsSchema } from "../types/index.js";
import { ErrorHandler } from "../utils/errors.js";

/**
 * Tool implementation for generating charts
 */
export class GenerateChartTool {
  /**
   * Gets the tool definition for the MCP server
   */
  getDefinition() {
    return {
      name: TOOL_NAMES.GENERATE_CHART,
      description: "Generate a chart using QuickChart",
      inputSchema: {
        type: "object",
        properties: {
          type: {
            type: "string",
            description:
              "Chart type (bar, line, pie, doughnut, radar, polarArea, scatter, bubble, radialGauge, speedometer)",
          },
          labels: {
            type: "array",
            items: { type: "string" },
            description: "Labels for data points",
          },
          datasets: {
            type: "array",
            items: {
              type: "object",
              properties: {
                label: { type: "string" },
                data: { type: "array" },
                backgroundColor: {
                  oneOf: [
                    { type: "string" },
                    { type: "array", items: { type: "string" } },
                  ],
                },
                borderColor: {
                  oneOf: [
                    { type: "string" },
                    { type: "array", items: { type: "string" } },
                  ],
                },
                additionalConfig: { type: "object" },
              },
              required: ["data"],
            },
          },
          title: { type: "string" },
          options: { type: "object" },
        },
        required: ["type", "datasets"],
      },
    };
  }

  /**
   * Executes the generate_chart tool
   */
  async execute(args: unknown): Promise<any> {
    try {
      if (!args) {
        throw ErrorHandler.createInvalidParamsError(
          "Arguments are required for generate_chart"
        );
      }

      // Validate and parse the arguments with Zod
      const validatedArgs = generateChartArgsSchema.parse(args);
      const config = ChartService.generateChartConfig(validatedArgs);
      const url = await ChartService.generateChartUrl(config);

      const markdownImage = `![Chart](${url})`;
      return {
        content: [
          {
            type: "markdown",
            content: markdownImage,
          },
        ],
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw ErrorHandler.handleZodError(error);
      }
      throw ErrorHandler.handleError(error, "Failed to generate chart");
    }
  }
}
