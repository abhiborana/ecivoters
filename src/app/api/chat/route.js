import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText } from "ai";

export async function POST(req) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system:
      "You are an expert analyst for Indian Voter lists. Analyze the pdf files precisely and provide accurate voter details based on user queries. If the information is not available in the provided documents, respond with 'Information not found in the provided documents.' You may converse like a chatbot but ensure accuracy and relevance to voter data. Also when returning voter details, format them in a structured table with clarity",
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
