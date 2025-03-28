import { DownloadChartTool } from "./downloadChartTool.js";
import { GenerateChartTool } from "./generateChartTool.js";
import { GenerateTableTool } from "./generateTableTool.js";
import { SearchHubbleTool } from "./searchHubbleTool.js";

/**
 * Registry for all available tools
 */
export class ToolRegistry {
  private searchHubbleTool: SearchHubbleTool;
  private generateChartTool: GenerateChartTool;
  private downloadChartTool: DownloadChartTool;
  private generateTableTool: GenerateTableTool;

  constructor() {
    this.searchHubbleTool = new SearchHubbleTool();
    this.generateChartTool = new GenerateChartTool();
    this.downloadChartTool = new DownloadChartTool();
    this.generateTableTool = new GenerateTableTool();
  }

  /**
   * Gets all tool definitions for the MCP server
   */
  getAllToolDefinitions() {
    return [
      this.searchHubbleTool.getDefinition(),
      this.generateChartTool.getDefinition(),
      this.downloadChartTool.getDefinition(),
      this.generateTableTool.getDefinition(),
    ];
  }

  /**
   * Executes a tool by name with the provided arguments
   */
  async executeTool(name: string, args: unknown): Promise<any> {
    switch (name) {
      case this.searchHubbleTool.getDefinition().name:
        return this.searchHubbleTool.execute(args);
      
      case this.generateChartTool.getDefinition().name:
        return this.generateChartTool.execute(args);
      
      case this.downloadChartTool.getDefinition().name:
        return this.downloadChartTool.execute(args);
      
      case this.generateTableTool.getDefinition().name:
        return this.generateTableTool.execute(args);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }
}
