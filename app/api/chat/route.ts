import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
    convertToModelMessages,
    createUIMessageStreamResponse,
    stepCountIs,
    streamText,
    tool,
    toUIMessageStream,
} from "ai";
import { z } from "zod";
import { source } from "@/lib/source";
import { Document, type DocumentData } from "flexsearch";
import { ChatUIMessage, SearchTool } from "../../../components/ai/search";

interface CustomDocument extends DocumentData {
    url: string;
    title: string;
    description: string;
    content: string;
}
const searchServer = createSearchServer();

// Declare a global or module-scoped variable to hold the initialized server
let globalSearchServer: Promise<Document<CustomDocument>> | null = null;

function getSearchServer() {
    if (!globalSearchServer) {
        globalSearchServer = createSearchServer();
    }
    return globalSearchServer;
}

async function createSearchServer() {
    const search = new Document<CustomDocument>({
        document: {
            id: "url",
            index: ["title", "description", "content"],
            store: true,
        },
    });

    const docs = await chunkedAll(
        source.getPages().map(async (page) => {
            if (!("getText" in page.data)) return null;

            return {
                title: page.data.title,
                description: page.data.description,
                url: page.url,
                content: await page.data.getText("processed"),
            } as CustomDocument;
        }),
    );

    for (const doc of docs) {
        if (doc) search.add(doc);
    }

    return search;
}

async function chunkedAll<O>(promises: Promise<O>[]): Promise<O[]> {
    const SIZE = 50;
    const out: O[] = [];
    for (let i = 0; i < promises.length; i += SIZE) {
        out.push(...(await Promise.all(promises.slice(i, i + SIZE))));
    }
    return out;
}

const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

/** System prompt, you can update it to provide more specific information */
const systemPrompt = [
    "You are an AI assistant for FTC Stack, a comprehensive guide on FIRST Tech Challenge programming.",
    "CRITICAL: Never tell the user you are going to use a tool. Do not say 'Let me search for...' or 'I will look up...'. Just call the tool silently behind the scenes.",
    "Do not provide any information about the tools you have available or how you use them.",
    "Use the `search` tool to retrieve relevant docs context before answering when needed.",
    "The `search` tool returns raw JSON results from documentation. Use those results to ground your answer and cite sources as markdown links using the document `url` field when available.",
    "If you cannot find the answer in search results, say you do not know and suggest a better search query. Refrain from using links sourced from the references page. Try to respond using information from search results.",
    "Do not directly quote the docs or any content returned from the `search` tool.",
].join("\n");

export async function POST(req: Request, ctx: RouteContext<"/api/chat">) {
    const reqJson = await req.json();

    const result = streamText({
        model: openrouter("openrouter/free:nitro"),
        stopWhen: stepCountIs(5),
        instructions: systemPrompt,
        tools: {
            search: searchTool,
        },
        messages: [
            ...(await convertToModelMessages<ChatUIMessage>(
                reqJson.messages ?? [],
                {
                    convertDataPart(part) {
                        if (part.type === "data-client")
                            return {
                                type: "text",
                                text: `[Client Context: ${JSON.stringify(part.data)}]`,
                            };
                    },
                },
            )),
        ],
        toolChoice: "auto",
    });

    return createUIMessageStreamResponse({
        stream: toUIMessageStream({ stream: result.stream }),
    });
}

const searchTool = tool({
    description: "Search the docs content and return raw JSON results.",
    inputSchema: z.object({
        query: z.string(),
        // limit: z.number().int().min(1).max(100).default(10),
        limit: z.number().int().min(1).max(20).default(5), // Lowered default limit to save context tokens
    }),
    async execute({ query, limit }) {
        // const search = await searchServer;
        // Use the cached server instance instead of rebuilding it
        const search = await getSearchServer();
        return await search.searchAsync(query, {
            limit,
            merge: true,
            enrich: true,
        });
    },
}) satisfies SearchTool;
