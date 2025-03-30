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
      description:
        "Generate a chart using QuickChart API. Supports basic chart types (bar, line, pie). Customizable with colors, labels, and advanced chart options.",
      inputSchema: {
        type: "object",
        properties: {
          type: {
            type: "string",
            description:
              "Chart type. Basic types: bar (vertical/stacked), line (smooth/straight), pie (regular/donut)",
          },
          labels: {
            type: "array",
            items: { type: "string" },
            description:
              "Category labels for the x-axis or data points. For pie/doughnut charts, these are the segment labels",
          },
          datasets: {
            type: "array",
            items: {
              type: "object",
              properties: {
                label: {
                  type: "string",
                  description: "Legend label for this dataset",
                },
                data: {
                  type: "array",
                  description:
                    "Data values. For basic charts: array of numbers",
                },
                backgroundColor: {
                  oneOf: [
                    { type: "string" },
                    { type: "array", items: { type: "string" } },
                  ],
                  description:
                    "Fill color(s) for the dataset. Can be a single color or array of colors. Supports RGB, RGBA, and named colors",
                },
                borderColor: {
                  oneOf: [
                    { type: "string" },
                    { type: "array", items: { type: "string" } },
                  ],
                  description:
                    "Border/line color(s) for the dataset. Can be a single color or array of colors. Supports RGB, RGBA, and named colors",
                },
                borderWidth: {
                  type: "number",
                  description: "Width of the border around each data element",
                },
                additionalConfig: {
                  type: "object",
                  description:
                    "Additional chart.js configuration options specific to the chart type (e.g. tension, fill)",
                },
              },
              required: ["data"],
            },
          },
          title: {
            type: "string",
            description: "Chart title displayed at the top of the chart",
          },
          options: {
            type: "object",
            description:
              "Advanced chart.js options for customizing scales, legends, tooltips, and other chart features",
          },
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

      return {
        content: [
          {
            type: "text",
            text: url,
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
