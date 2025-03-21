# Hubble AI for Solana

Hubble is an AI-powered analytics tool that provides data analysis and visualization for Solana blockchain transactions with natural language queries.

## Overview

Hubble enables you to query blockchain data and generate visualizations through a simple interface. It integrates with AI assistants to deliver real-time blockchain insights and create visual representations of that data.

## Installation

Add Hubble to your configuration:

```json
{
  "mcpServers": {
    "hubble-tool": {
      "command": "npx",
      "args": ["-y", "hubble-mcp-tool"],
      "env": {
        "HUBBLE_API_KEY": "your_api_key"
      }
    }
  }
}
```

## Features

### Data Querying

Access blockchain data with natural language queries:

- View recent transactions
- Check current prices
- Identify top token holders
- Analyze transaction patterns

### Data Visualization

Generate charts to visualize blockchain data:

- Transaction volume trends
- Price movements over time
- Distribution analytics
- Custom visualizations based on your queries

## Usage Examples

### Basic Queries

```
"Show me the latest blockchain transactions"
"What is the current token price?"
"Who are the top token holders?"
```

### Visualization Queries

```
"Generate a chart of transaction volume for the last week"
"Create a line chart of price trends for the past month"
"Show a pie chart of top transactions by value"
```

## License

MIT
