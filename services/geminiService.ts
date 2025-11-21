
import { GoogleGenAI } from "@google/genai";
import { SearchResponse } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

interface SearchFilters {
  authors?: string;
  journal?: string;
  yearStart?: string;
  yearEnd?: string;
}

const performSearch = async (
  query: string,
  filters: SearchFilters,
  targetCount: number
): Promise<SearchResponse> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const { authors, journal, yearStart, yearEnd } = filters;
  const modelId = 'gemini-2.5-flash'; 

  let specificConstraints = "";
  if (authors?.trim()) {
    specificConstraints += `\n- STRICTLY restrict results to papers authored by (or co-authored by): "${authors}".`;
  }
  if (journal?.trim()) {
    specificConstraints += `\n- STRICTLY restrict results to papers published in the journal/platform: "${journal}".`;
  }
  if (yearStart || yearEnd) {
    const start = yearStart?.trim() || "earliest available";
    const end = yearEnd?.trim() || "present";
    specificConstraints += `\n- STRICTLY restrict results to papers published between years ${start} and ${end} inclusive.`;
  }

  const prompt = `
    You are a distinguished Research Economist Assistant. 
    Perform a rigorous search for academic papers related to the following topic: "${query}".
    
    Constraints:
    - Focus on peer-reviewed journals (AER, QJE, JPE, etc.) or high-quality working papers (NBER, CEPR).
    ${specificConstraints}
    - Provide exactly ${targetCount} distinct papers if available.
    - Prioritize seminal works or high-impact recent studies.
    
    For each paper, you must extract/generate:
    1. Title
    2. Authors
    3. Year
    4. Journal/Platform
    5. Executive Summary (concise, academic tone)
    6. Key Findings (bullet points)
    7. Policy Implementations (practical applications for policymakers)
    8. Similar search topics or related paper titles.
    9. Citation Count (approximate integer or range, e.g., "1200+", "45")
    10. URL (Direct link to the paper or publisher page)
    11. Paper ID (DOI, NBER Number, ArXiv ID, or similar identifier)

    Additionally, suggest 2-3 "Clarification Queries" to help refine the search if the current topic is too broad.

    IMPORTANT: You strictly must output a valid JSON object wrapped in a code block \`\`\`json ... \`\`\`.
    The JSON structure must be:
    {
      "papers": [
        {
          "title": "String",
          "authors": "String",
          "year": "String",
          "journal": "String",
          "summary": "String",
          "keyFindings": ["String", "String"],
          "policyImplementations": ["String", "String"],
          "similarTopics": ["String"],
          "citationCount": "String",
          "url": "String",
          "paperId": "String"
        }
      ],
      "clarifications": ["String", "String"],
      "totalResultsEstimate": "String (e.g. '200+ matches')"
    }
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }], // Enable grounding to find real papers
      temperature: 0.3, // Low temperature for factual precision
    }
  });

  const text = response.text;
  
  // Extract JSON from code block
  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```json([\s\S]*?)```/) || text.match(/{[\s\S]*}/);
  
  if (!jsonMatch) {
    console.error("Failed to parse JSON from model response:", text);
    throw new Error("The system retrieved data but could not format it strictly. Please refine your query.");
  }

  const jsonString = jsonMatch[1] || jsonMatch[0];
  const parsedData = JSON.parse(jsonString);
  
  const papersWithIds = parsedData.papers.map((p: any, index: number) => ({
      ...p,
      id: `paper-${Date.now()}-${index}`
  }));

  return {
    papers: papersWithIds,
    clarifications: parsedData.clarifications || [],
    totalResultsEstimate: parsedData.totalResultsEstimate
  };
};

export const searchEconomicsPapers = async (
  query: string,
  filters: SearchFilters = {}
): Promise<SearchResponse> => {
  try {
    // First attempt: try to fetch 10 results
    return await performSearch(query, filters, 10);
  } catch (error) {
    console.warn("Failed to fetch 10 results. Retrying with 5 results.", error);
    // Fallback attempt: fetch 5 results
    try {
      return await performSearch(query, filters, 5);
    } catch (fallbackError) {
      console.error("Fallback search failed.", fallbackError);
      throw fallbackError;
    }
  }
};
