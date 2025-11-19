/**
 * Claude AI client for query validation and paper summarization
 * Uses Anthropic's Claude API
 */

import Anthropic from '@anthropic-ai/sdk';

const API_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
  console.warn('ANTHROPIC_API_KEY not set. AI features will not work.');
}

const client = API_KEY ? new Anthropic({ apiKey: API_KEY }) : null;

/**
 * Check if a search query is specific enough for academic paper search
 * Returns validation result with suggestions if the query is too vague
 */
export async function validateSearchQuery(query: string): Promise<{
  isValid: boolean;
  message?: string;
  suggestions?: string[];
}> {
  if (!client) {
    throw new Error('Claude API client not initialized. Please set ANTHROPIC_API_KEY.');
  }

  try {
    const prompt = `You are an expert assistant that evaluates whether an academic paper search query is specific enough. The query can be in any language (English, Japanese, etc.).

Given the following search query, determine if it is sufficiently specific for finding relevant academic papers:

Query: "${query}"

Respond in the following JSON format (always use English for the response):
{
  "isValid": true/false,
  "message": "brief explanation in English",
  "suggestions": ["suggestion 1 in English", "suggestion 2 in English", "suggestion 3 in English"]
}

A query is valid if it:
- Contains specific technical terms, research areas, or concepts
- Has clear research direction (e.g., methods, applications, domains)
- Is not overly broad (e.g., just "AI", "機械学習", "physics", or "物理学")

If the query is too vague, provide 2-3 specific suggestions for clarification in English, such as:
- Specify the domain or subfield
- Add methodological constraints
- Include time range or specific aspects

Keep your response concise and actionable. Accept queries in any language but respond in English.`;

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Parse JSON response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from Claude response');
    }

    const result = JSON.parse(jsonMatch[0]);
    return result;
  } catch (error) {
    console.error('Error validating query with Claude:', error);
    // Fallback: assume query is valid if AI fails
    return { isValid: true };
  }
}

/**
 * Generate a detailed summary of an academic paper using Claude
 */
export async function summarizePaper(params: {
  title: string;
  authors: string[];
  abstract?: string;
  year?: number;
}): Promise<string> {
  if (!client) {
    throw new Error('Claude API client not initialized. Please set ANTHROPIC_API_KEY.');
  }

  try {
    const { title, authors, abstract, year } = params;

    const prompt = `You are an expert research assistant. Generate a clear, detailed summary of the following academic paper. The paper information may be in English, Japanese, or other languages.

Paper Information:
- Title: ${title}
- Authors: ${authors.join(', ')}
${year ? `- Year: ${year}` : ''}
${abstract ? `- Abstract: ${abstract}` : ''}

Please provide a comprehensive summary in English (250-350 words) that includes:

1. **Research Problem/Question**: What problem does this paper address?
2. **Methodology/Approach**: What methods or techniques do the authors use?
3. **Key Findings/Results**: What are the main discoveries or contributions?
4. **Significance/Impact**: Why is this work important? What are its implications?
5. **Limitations** (if identifiable from the abstract): What are potential constraints or areas for future work?

Write in clear, accessible English suitable for graduate students and researchers. Be concise but thorough. If the paper information is in a non-English language, translate the key concepts to English in your summary.`;

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    return content.text.trim();
  } catch (error) {
    console.error('Error summarizing paper with Claude:', error);
    throw error;
  }
}
