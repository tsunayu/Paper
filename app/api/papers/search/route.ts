import { NextRequest, NextResponse } from 'next/server';
import { searchPapers } from '@/lib/semanticScholarClient';
import { validateSearchQuery } from '@/lib/claudeClient';
import { PaperSearchResponse } from '@/lib/types';

/**
 * API endpoint for searching academic papers
 * Uses AI to validate query sufficiency, then searches Semantic Scholar
 */
export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    // Basic validation
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      const response: PaperSearchResponse = {
        status: 'error',
        message: 'Query is required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const trimmedQuery = query.trim();

    // AI-powered query validation (optional, gracefully degrades if AI unavailable)
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const validation = await validateSearchQuery(trimmedQuery);

        if (!validation.isValid) {
          const response: PaperSearchResponse = {
            status: 'needs_clarification',
            message: validation.message || 'Your search query seems too broad. Please provide more details.',
            suggestedQuestions: validation.suggestions || [
              'Try specifying the research domain or subfield',
              'Add methodological constraints or specific techniques',
              'Include a time range or specific aspects you\'re interested in',
            ],
          };
          return NextResponse.json(response);
        }
      } catch (aiError) {
        // If AI validation fails, log but continue with search
        console.warn('AI query validation failed, proceeding with search:', aiError);
      }
    }

    // Search for papers using Semantic Scholar
    const papers = await searchPapers(trimmedQuery, 50);

    const response: PaperSearchResponse = {
      status: 'ok',
      papers,
      total: papers.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in /api/papers/search:', error);

    const response: PaperSearchResponse = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Internal server error',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
