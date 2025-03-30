import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import fs from "fs/promises";
import { QUICKCHART_BASE_URL } from "../config/constants.js";
import { ChartConfig, ChartType, VALID_CHART_TYPES } from "../types/index.js";
import { ErrorHandler } from "../utils/errors.js";

/**
 * Service for handling chart generation and operations
 */
export class ChartService {
  /**
   * Validates that the chart type is supported
   */
  private static validateChartType(type: string): void {
    if (!VALID_CHART_TYPES.includes(type as ChartType)) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid chart type. Must be one of: ${VALID_CHART_TYPES.join(", ")}`
      );
    }
  }

  /**
   * Generates a chart configuration object from input arguments
   */
  static generateChartConfig(args: any): ChartConfig {
    const { type, labels, datasets, title, options = {} } = args;

    this.validateChartType(type);

    const config: ChartConfig = {
      type: type as ChartType,
      data: {
        labels: labels || [],
        datasets: datasets.map((dataset: any) => {
          // Extract known properties
          const { label, data, backgroundColor, borderColor, borderWidth, additionalConfig = {} } = dataset;
          
          // Create dataset with known properties
          const chartDataset: any = {
            label: label || "",
            data: data,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
          };
          
          // Add borderWidth if provided
          if (borderWidth !== undefined) {
            chartDataset.borderWidth = borderWidth;
          }
          
          // Add any additional properties from additionalConfig
          return {
            ...chartDataset,
            ...additionalConfig,
          };
        }),
      },
      options: {
        ...options,
        ...(title && {
          title: {
            display: true,
            text: title,
          },
        }),
      },
    };

    // Special handling for specific chart types
    switch (type) {
      case "radialGauge":
      case "speedometer":
        if (!datasets?.[0]?.data?.[0]) {
          throw ErrorHandler.createInvalidParamsError(
            `${type} requires a single numeric value`
          );
        }
        config.options = {
          ...config.options,
          plugins: {
            datalabels: {
              display: true,
              formatter: (value: number) => value,
            },
          },
        };
        break;

      case "scatter":
      case "bubble":
        datasets.forEach((dataset: any) => {
          if (!Array.isArray(dataset.data[0])) {
            throw ErrorHandler.createInvalidParamsError(
              `${type} requires data points in [x, y${
                type === "bubble" ? ", r" : ""
              }] format`
            );
          }
        });
        break;
    }

    return config;
  }

  /**
   * Generates a QuickChart URL from a chart configuration
   */
  static async generateChartUrl(config: ChartConfig): Promise<string> {
    const encodedConfig = encodeURIComponent(JSON.stringify(config));
    return `${QUICKCHART_BASE_URL}&c=${encodedConfig}`;
  }

  /**
   * Downloads a chart image to a local file
   */
  static async downloadChart(config: ChartConfig, outputPath: string): Promise<string> {
    try {
      const url = await this.generateChartUrl(config);
      const response = await axios.get(url, { responseType: "arraybuffer" });
      await fs.writeFile(outputPath, response.data);
      return outputPath;
    } catch (error) {
      throw ErrorHandler.handleError(error, "Failed to download chart");
    }
  }
}
