/**
 * Binance WebSocket Service
 * Creates a WebSocket connection to Binance streams and calls callback on messages
 */

export interface BinanceTickerData {
  s: string; // symbol
  c: string; // last price
  h?: string; // high price
  l?: string; // low price
  v?: string; // volume
  P?: string; // price change percent
  [key: string]: any; // allow other fields
}

export interface BinanceStreamMessage {
  stream: string;
  data: BinanceTickerData;
}

/**
 * Creates a WebSocket connection to Binance ticker streams
 * @param symbols - Array of trading symbols (e.g., ["ETHBTC", "BTCUSDT"])
 * @param callback - Function called with parsed message data on each update
 * @returns Cleanup function to close the WebSocket connection
 */
export function createBinanceWebSocket(
  symbols: string[],
  callback: (data: BinanceStreamMessage) => void
): () => void {
  const streams = symbols
    .map(symbol => `${symbol.toLowerCase()}@ticker`)
    .join("/");

  const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;

  const ws = new WebSocket(wsUrl);

  ws.onmessage = (event) => {
    try {
      const message: BinanceStreamMessage = JSON.parse(event.data);
      callback(message);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed');
  };

  // Return cleanup function
  return () => {
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      ws.close();
    }
  };
}
