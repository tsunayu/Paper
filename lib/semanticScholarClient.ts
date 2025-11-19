/**
 * Client for the Semantic Scholar Academic Graph API
 * Documentation: https://api.semanticscholar.org/api-docs/
 *
 * No API key required for basic usage (rate limited to 100 requests per 5 minutes)
 * For higher rate limits, you can provide an API key via environment variable
 */

import { SearchResultPaper } from './types';

const SEMANTIC_SCHOLAR_BASE_URL = 'https://api.semanticscholar.org/graph/v1';
const API_KEY = process.env.SEMANTIC_SCHOLAR_API_KEY;

// Fields to request from the API
const PAPER_FIELDS = [
  'paperId',
  'title',
  'authors',
  'year',
  'venue',
  'abstract',
  'externalIds',
  'url',
  'citationCount',
  'influentialCitationCount',
].join(',');

/**
 * Search for papers by query
 * @param query Search query string
 * @param limit Maximum number of results (default 50, max 100)
 * @returns Array of papers matching the query
 */
export async function searchPapers(
  query: string,
  limit: number = 50
): Promise<SearchResultPaper[]> {
  try {
    // Encode the query for URL
    const encodedQuery = encodeURIComponent(query);
    const url = `${SEMANTIC_SCHOLAR_BASE_URL}/paper/search?query=${encodedQuery}&limit=${Math.min(limit, 100)}&fields=${PAPER_FIELDS}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add API key if available
    if (API_KEY) {
      headers['x-api-key'] = API_KEY;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Semantic Scholar API allows 100 requests per 5 minutes. Please wait a few minutes before searching again.');
      }
      throw new Error(`Semantic Scholar API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Transform API response to our internal format
    const papers: SearchResultPaper[] = (data.data || []).map((paper: any) => {
      // Build external URL (prefer DOI, fallback to Semantic Scholar URL)
      let externalUrl = paper.url || '';
      if (paper.externalIds?.DOI) {
        externalUrl = `https://doi.org/${paper.externalIds.DOI}`;
      } else if (paper.externalIds?.ArXiv) {
        externalUrl = `https://arxiv.org/abs/${paper.externalIds.ArXiv}`;
      }

      // Extract author names
      const authors = (paper.authors || []).map((author: any) => author.name);

      // Create abstract snippet (first 200 characters)
      const abstract = paper.abstract || '';
      const abstractSnippet = abstract.length > 200
        ? abstract.substring(0, 200) + '...'
        : abstract;

      return {
        id: paper.paperId,
        title: paper.title || 'Untitled',
        authors,
        year: paper.year,
        venue: paper.venue,
        abstract,
        abstractSnippet,
        externalUrl,
        citationCount: paper.citationCount,
        influentialCitationCount: paper.influentialCitationCount,
      };
    });

    return papers;
  } catch (error) {
    console.error('Error searching papers:', error);
    throw error;
  }
}

/**
 * Get paper details by ID
 * @param paperId Semantic Scholar paper ID
 * @returns Paper details
 */
export async function getPaperById(paperId: string): Promise<SearchResultPaper | null> {
  try {
    const url = `${SEMANTIC_SCHOLAR_BASE_URL}/paper/${paperId}?fields=${PAPER_FIELDS}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (API_KEY) {
      headers['x-api-key'] = API_KEY;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Semantic Scholar API allows 100 requests per 5 minutes. Please wait a few minutes before searching again.');
      }
      throw new Error(`Semantic Scholar API error: ${response.status} ${response.statusText}`);
    }

    const paper = await response.json();

    // Transform to our format (same logic as searchPapers)
    let externalUrl = paper.url || '';
    if (paper.externalIds?.DOI) {
      externalUrl = `https://doi.org/${paper.externalIds.DOI}`;
    } else if (paper.externalIds?.ArXiv) {
      externalUrl = `https://arxiv.org/abs/${paper.externalIds.ArXiv}`;
    }

    const authors = (paper.authors || []).map((author: any) => author.name);
    const abstract = paper.abstract || '';
    const abstractSnippet = abstract.length > 200
      ? abstract.substring(0, 200) + '...'
      : abstract;

    return {
      id: paper.paperId,
      title: paper.title || 'Untitled',
      authors,
      year: paper.year,
      venue: paper.venue,
      abstract,
      abstractSnippet,
      externalUrl,
      citationCount: paper.citationCount,
      influentialCitationCount: paper.influentialCitationCount,
    };
  } catch (error) {
    console.error('Error fetching paper:', error);
    throw error;
  }
}
