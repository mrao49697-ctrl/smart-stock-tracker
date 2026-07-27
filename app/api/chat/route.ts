import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    messages,
    system: "You are a helpful, professional AI assistant for a stock and inventory tracking application called StockSathi AI. Keep your answers concise and focused on helping users manage their store, inventory, sales, and supplies.",
  });

  return result.toTextStreamResponse();
}
