/**
 * Type definitions for the Paper Explorer application
 * All data is stored in browser localStorage (no server-side database)
 */

/**
 * User profile information stored in localStorage
 */
export interface UserProfile {
  name: string;
  email: string;
  affiliation?: string;
  researchInterests?: string;
  defaultKeywords?: string[];
}

/**
 * Paper data structure for search results
 */
export interface SearchResultPaper {
  id: string; // Unique identifier from the API (e.g., Semantic Scholar paperId)
  title: string;
  authors: string[]; // Array of author names
  year?: number;
  venue?: string; // Journal or conference name
  abstract?: string; // Full abstract
  abstractSnippet?: string; // Shortened version for display
  externalUrl: string; // Link to the paper (PDF, DOI, etc.)
  citationCount?: number;
  influentialCitationCount?: number;
}

/**
 * Favorite paper stored in localStorage
 * Extends SearchResultPaper with additional metadata
 */
export interface FavoritePaper extends SearchResultPaper {
  addedAt: string; // ISO timestamp when the paper was favorited
}

/**
 * Response from the AI query validation
 */
export interface QueryValidationResult {
  status: 'ok' | 'needs_clarification';
  message?: string;
  suggestedQuestions?: string[];
}

/**
 * Response from the paper search API
 */
export interface PaperSearchResponse {
  status: 'ok' | 'needs_clarification' | 'error';
  message?: string;
  suggestedQuestions?: string[];
  papers?: SearchResultPaper[];
  total?: number;
}

/**
 * Request payload for paper summarization
 */
export interface SummarizeRequest {
  paperId: string;
  title: string;
  authors: string[];
  abstract?: string;
  year?: number;
}

/**
 * Response from the paper summarization API
 */
export interface SummarizeResponse {
  status: 'ok' | 'error';
  summary?: string;
  error?: string;
}
