import { HubbleService } from '../services/hubbleService.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Ensure HUBBLE_API_KEY is set
if (!process.env.HUBBLE_API_KEY) {
  console.error('HUBBLE_API_KEY environment variable is not set');
  process.exit(1);
}

async function testHubbleSearch() {
  const hubbleService = new HubbleService();
  
  try {
    // Test query
    const query = 'Show me the latest transactions on Solana';
    console.log(`Testing HubbleService.search with query: "${query}"`);
    
    const result = await hubbleService.search(query);
    console.log('Search result:', JSON.stringify(result, null, 2));
    
    return result;
  } catch (error) {
    console.error('Error testing HubbleService.search:', error);
    throw error;
  }
}

// Run the test
testHubbleSearch()
  .then(() => console.log('Test completed successfully'))
  .catch((error) => console.error('Test failed:', error));
