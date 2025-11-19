import { NextRequest, NextResponse } from 'next/server';
import { summarizePaper } from '@/lib/claudeClient';
import { SummarizeRequest, SummarizeResponse } from '@/lib/types';

/**
 * API endpoint for generating AI-powered paper summaries
 * Uses Claude to generate detailed summaries from paper metadata
 */
export async function POST(request: NextRequest) {
  try {
    const paperData: SummarizeRequest = await request.json();

    // Validate required fields
    if (!paperData.title || !paperData.authors || paperData.authors.length === 0) {
      const response: SummarizeResponse = {
        status: 'error',
        error: 'Paper title and authors are required',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      const response: SummarizeResponse = {
        status: 'error',
        error: 'AI summarization is not configured. Please set ANTHROPIC_API_KEY.',
      };
      return NextResponse.json(response, { status: 503 });
    }

    // Generate summary using Claude
    const summary = await summarizePaper({
      title: paperData.title,
      authors: paperData.authors,
      abstract: paperData.abstract,
      year: paperData.year,
    });

    const response: SummarizeResponse = {
      status: 'ok',
      summary,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in /api/papers/summary:', error);

    const response: SummarizeResponse = {
      status: 'error',
      error: error instanceof Error ? error.message : 'Internal server error',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
