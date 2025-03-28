import { z } from "zod";
import { TOOL_NAMES } from "../config/constants.js";
import { ErrorHandler } from "../utils/errors.js";
import { generateTableArgsSchema, GenerateTableArgs } from "../types/index.js";

/**
 * Tool implementation for generating markdown tables
 */
export class GenerateTableTool {
  /**
   * Gets the tool definition for the MCP server
   */
  getDefinition() {
    return {
      name: TOOL_NAMES.GENERATE_TABLE,
      description: "Generate a markdown table visualization from data",
      inputSchema: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: {
              type: "array",
              items: {
                oneOf: [
                  { type: "string" },
                  { type: "number" },
                  { type: "null" }
                ]
              }
            },
            description: "2D array of data for the table. First row can be used as headers if columns not provided. Use ['-'] for separator rows."
          },
          columns: {
            type: "array",
            items: { type: "string" },
            description: "Optional column headers. If not provided, first row of data will be used as headers."
          },
          title: {
            type: "string",
            description: "Optional title for the table"
          },
          tableOptions: {
            type: "object",
            properties: {
              alignment: {
                type: "array",
                items: {
                  type: "string",
                  enum: ["left", "center", "right"]
                },
                description: "Optional alignment for each column"
              },
              compact: {
                type: "boolean",
                description: "Whether to generate a compact table with less whitespace"
              },
              showTitle: {
                type: "boolean",
                description: "Whether to show the title above the table"
              }
            },
            description: "Optional styling options for the markdown table"
          }
        },
        required: ["data"]
      }
    };
  }

  /**
   * Executes the generate_table tool
   */
  async execute(args: unknown): Promise<any> {
    try {
      if (!args) {
        throw ErrorHandler.createInvalidParamsError("Arguments are required for generate_table");
      }

      // Validate and parse the arguments with Zod
      const validatedArgs = generateTableArgsSchema.parse(args);
      const { data, columns, title, tableOptions = {} } = validatedArgs;

      // Generate markdown table
      let markdownTable = "";

      // Add title if provided and showTitle is not false
      if (title && tableOptions?.showTitle !== false) {
        markdownTable += `# ${title}\n\n`;
      }

      // Determine headers - use provided columns or first row of data
      const headers = columns || (data.length > 0 ? data[0] : []);
      const startDataRow = columns ? 0 : 1; // Skip first row if using it as headers

      if (!headers || headers.length === 0) {
        throw ErrorHandler.createInvalidParamsError("No headers available for table generation");
      }

      // Create header row
      markdownTable += "| " + headers.join(" | ") + " |\n";

      // Create separator row with alignment if specified
      const alignment = tableOptions.alignment || [];
      if (alignment.length > 0) {
        markdownTable += "| " + headers.map((_, index) => {
          const align = index < alignment.length ? alignment[index] : "left";
          if (align === "center") return ":---:";
          if (align === "right") return "---:";
          return "---"; // default left alignment
        }).join(" | ") + " |\n";
      } else {
        markdownTable += "| " + headers.map(() => "---").join(" | ") + " |\n";
      }

      // Create data rows
      for (let i = startDataRow; i < data.length; i++) {
        const row = data[i];

        // Check if row is a separator
        if (row.length === 1 && row[0] === "-") {
          // Add a visual separator in markdown (empty row with different formatting)
          markdownTable += "| " + headers.map(() => "   ").join(" | ") + " |\n";
          continue;
        }

        // Ensure row has same number of columns as headers
        const formattedRow = [];
        for (let j = 0; j < headers.length; j++) {
          formattedRow.push(j < row.length ? (row[j] === null ? "" : row[j]) : "");
        }

        markdownTable += "| " + formattedRow.join(" | ") + " |\n";
      }

      return {
        content: [
          {
            type: "markdown",
            content: markdownTable,
            title: title || "Table",
          },
        ],
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw ErrorHandler.handleZodError(error);
      }
      throw ErrorHandler.handleError(error, "Failed to generate table");
    }
  }
}
