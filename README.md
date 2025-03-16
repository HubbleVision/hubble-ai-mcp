# Hubble AI MCP Server

Hubble is a solana MCP server that can do data analysis and visualization for transactions on pumpfun and DEXs with natrual language.

## Overview

This MCP server provides tools to query Pumpfun blockchain data and generate visualizations through the Hubble API. It integrates with AI assistants that support the Model Context Protocol, allowing them to fetch real-time Pumpfun data and create charts based on that data.

## Installation

Add the Hubble MCP server to your MCP configuration file:

```json
{
  "mcpServers": {
    "hubble-tool": {
      "command": "npx",
      "args": ["-y", "hubble-mcp-tool"]
    }
  }
}
```

## Available Tools

### 1. search-hubble

Query the Hubble API for Pumpfun blockchain data.

**Example queries:**

- "latest pumpfun txn"
- "show me the latest 10 pumpfun transactions"
- "get the latest 5 pumpfun transactions and generate a chart"
- "what is the current pumpfun price"
- "top pumpfun holders"

### 2. generate_chart

Generate charts to visualize Pumpfun data using QuickChart.

Supports various chart types:

- Bar charts
- Line charts
- Pie charts
- Doughnut charts
- Radar charts
- And more

### 3. download_chart

Download generated chart images to a local file.

## Usage Examples

### Basic Query

Ask about recent Pumpfun transactions:

```
get the latest 5 pumpfun transactions and generate a chart
```

### Query with Specific Count

Request a specific number of transactions:

```
show me the latest 10 pumpfun transactions
```

### Query with Chart Generation

Request transactions and generate a visualization in one query:

```
get the latest 5 pumpfun transactions and generate a chart
```

### Data Visualization Examples

- Transaction volume over time: `generate chart of pumpfun transaction volume for the last 7 days`
- Price trends: `create a line chart of pumpfun price for the past month`
- Transaction distribution: `show pie chart of top 10 pumpfun transactions by value`

## Development

Built with:

- TypeScript
- Model Context Protocol SDK
- Mastra Client for Hubble API integration
- QuickChart for data visualization

## License

MIT
