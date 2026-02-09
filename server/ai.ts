import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";

// Initialize OpenAI Chat Model
const model = new ChatOpenAI({
  model: "gpt-4o", // Or gpt-5.1 if available via proxy, sticking to standard for LangChain compatibility
  temperature: 0,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  configuration: {
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  }
});

// --- JOB MATCHING ---

export async function calculateMatchScoreLangChain(jobDescription: string, resumeText: string) {
  const prompt = `
    You are an expert HR AI. Compare the following Job Description with the User's Resume.
    
    JOB DESCRIPTION:
    ${jobDescription}

    RESUME:
    ${resumeText.slice(0, 3000)} // Truncate to avoid context limits if huge

    Output a JSON object with:
    - score: a number between 0 and 100 indicating the match percentage.
    - explanation: a concise 1-2 sentence explanation of why this score was given, highlighting key matching skills or missing requirements.

    JSON ONLY.
  `;

  const response = await model.invoke([
    new SystemMessage("You are a helpful assistant that outputs JSON."),
    new HumanMessage(prompt)
  ]);

  try {
    const content = response.content as string;
    // Strip markdown if present
    const cleanContent = content.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanContent);
  } catch (e) {
    console.error("AI Matching Error:", e);
    return { score: 0, explanation: "AI analysis failed." };
  }
}

// --- AI ASSISTANT (LangGraph) ---

// Define the tools
const updateFiltersTool = tool(
  async (input) => {
    return JSON.stringify(input); // Just return the input as the "action" payload
  },
  {
    name: "update_filters",
    description: "Update the job search filters. Use this when the user asks to filter jobs by role, skills, date, type, work mode, or location.",
    schema: z.object({
      search: z.string().optional().describe("Search keywords for role or title"),
      location: z.string().optional(),
      type: z.enum(["Full-time", "Part-time", "Contract", "Internship"]).optional(),
      workMode: z.enum(["Remote", "Hybrid", "On-site"]).optional(),
      minMatchScore: z.number().optional().describe("Minimum match score (0-100)"),
    })
  }
);

const navigateTool = tool(
  async (input) => {
    return JSON.stringify(input);
  },
  {
    name: "navigate",
    description: "Navigate to a different page in the application.",
    schema: z.object({
      path: z.enum(["/applications", "/profile", "/"]).describe("The path to navigate to. /applications for dashboard, /profile for resume, / for job feed."),
    })
  }
);

const tools = [updateFiltersTool, navigateTool];
const toolNode = new ToolNode(tools);

const modelWithTools = model.bindTools(tools);

// Define the graph
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", async (state) => {
    const response = await modelWithTools.invoke(state.messages);
    return { messages: [response] };
  })
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", (state) => {
    const lastMessage = state.messages[state.messages.length - 1] as any;
    if (lastMessage.tool_calls?.length > 0) {
      return "tools";
    }
    return "__end__";
  })
  .addEdge("tools", "__end__");

const app = workflow.compile();

export async function processChatIntent(userMessage: string) {
  const result = await app.invoke({
    messages: [new HumanMessage(userMessage)],
  });

  const lastMessage = result.messages[result.messages.length - 1];
  
  // Check if a tool was called and we have a tool output
  // In LangGraph, the tool output message comes after the AI message with tool_calls.
  // We need to parse the history to find the action.
  
  // Simplify for this specific "Assistant Control" use case:
  // We check if the AI *wanted* to call a tool.
  const allMessages = result.messages;
  const aiMessage = allMessages.find((m: any) => m.tool_calls?.length > 0) as any;
  
  let action = undefined;
  let message = lastMessage.content as string;

  if (aiMessage) {
    const toolCall = aiMessage.tool_calls[0];
    if (toolCall.name === "update_filters") {
      action = { type: "UPDATE_FILTERS", payload: toolCall.args };
      message = "I've updated the filters for you.";
    } else if (toolCall.name === "navigate") {
      action = { type: "NAVIGATE", payload: toolCall.args };
      message = "Navigating now.";
    }
  }

  return { message, action };
}
