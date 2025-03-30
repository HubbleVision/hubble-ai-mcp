import { z } from "zod";

// Chart types
export const VALID_CHART_TYPES = [
  "bar",
  "line",
  "pie",
  "doughnut",
  "radar",
  "polarArea",
  "scatter",
  "bubble",
  "radialGauge",
  "speedometer",
] as const;

export type ChartType = typeof VALID_CHART_TYPES[number];

// Chart configuration interfaces
export interface ChartDataset {
  label?: string;
  data: number[] | Array<number[]>;
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  [key: string]: any;
}

export interface ChartData {
  labels?: string[];
  datasets: ChartDataset[];
  [key: string]: any;
}

export interface ChartOptions {
  title?: {
    display: boolean;
    text: string;
  };
  scales?: {
    y?: {
      beginAtZero?: boolean;
    };
  };
  plugins?: {
    datalabels?: {
      display: boolean;
      formatter: (value: number) => any;
    };
  };
  [key: string]: any;
}

export interface ChartConfig {
  type: ChartType;
  data: ChartData;
  options?: ChartOptions;
}

// Tool input schemas
export const searchHubbleArgsSchema = z.object({
  query: z.string(),
});

export type SearchHubbleArgs = z.infer<typeof searchHubbleArgsSchema>;

export const generateChartArgsSchema = z.object({
  type: z.enum(VALID_CHART_TYPES),
  labels: z.array(z.string()).optional(),
  datasets: z.array(
    z.object({
      label: z.string().optional(),
      data: z.array(z.union([z.number(), z.array(z.number())])),
      backgroundColor: z.union([
        z.string(),
        z.array(z.string()),
      ]).optional(),
      borderColor: z.union([
        z.string(),
        z.array(z.string()),
      ]).optional(),
      borderWidth: z.number().optional(),
      additionalConfig: z.record(z.any()).optional(),
    })
  ),
  title: z.string().optional(),
  options: z.record(z.any()).optional(),
});

export type GenerateChartArgs = z.infer<typeof generateChartArgsSchema>;

export const downloadChartArgsSchema = z.object({
  config: z.record(z.unknown()),
  outputPath: z.string(),
});

export type DownloadChartArgs = z.infer<typeof downloadChartArgsSchema>;
