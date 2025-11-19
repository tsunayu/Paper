"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { SearchResultPaper, PaperSearchResponse } from "@/lib/types";
import { PaperCard } from "@/components/PaperCard";
import {
  loadFavoritePapers,
  addFavoritePaper,
  removeFavoritePaper,
  isFavorite as checkIsFavorite
} from "@/lib/localStorageService";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResultPaper[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [clarification, setClarification] = useState<{
    message: string;
    suggestions: string[];
  } | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // Load favorites on mount
  useEffect(() => {
    const favorites = loadFavoritePapers();
    setFavoriteIds(new Set(favorites.map(f => f.id)));
  }, []);

  const handleToggleFavorite = (paper: SearchResultPaper) => {
    const isFav = favoriteIds.has(paper.id);

    if (isFav) {
      removeFavoritePaper(paper.id);
      setFavoriteIds(prev => {
        const next = new Set(prev);
        next.delete(paper.id);
        return next;
      });
    } else {
      addFavoritePaper(paper);
      setFavoriteIds(prev => new Set(prev).add(paper.id));
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      setError("Please enter a search query");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);
    setClarification(null);
    setHasSearched(true);

    try {
      const response = await fetch("/api/papers/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data: PaperSearchResponse = await response.json();

      if (data.status === "error") {
        setError(data.message || "An error occurred while searching");
      } else if (data.status === "needs_clarification") {
        setClarification({
          message: data.message || "Your query needs clarification",
          suggestions: data.suggestedQuestions || [],
        });
      } else if (data.status === "ok" && data.papers) {
        setResults(data.papers);
      }
    } catch (err) {
      setError("Failed to connect to the server. Please try again.");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Search header */}
        <div className="max-w-3xl mx-auto mb-8">
          <h1 className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Search Academic Papers
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Search across millions of research papers from Semantic Scholar (English & Japanese supported)
          </p>

          {/* Search form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Search papers... (e.g., 'machine learning' or '機械学習')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 h-12 text-base"
              disabled={loading}
            />
            <Button type="submit" size="lg" disabled={loading} className="gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Searching
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Search
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Error message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-900">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Clarification needed */}
        {clarification && (
          <div className="max-w-3xl mx-auto mb-6">
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-amber-900 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Please clarify your search
                </CardTitle>
                <CardDescription className="text-amber-700">
                  {clarification.message}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-amber-800 mb-3 font-medium">
                  Consider adding more detail about:
                </p>
                <ul className="space-y-2">
                  {clarification.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-amber-900">
                      <span className="text-amber-600 mt-0.5">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-amber-700 mt-4">
                  Please refine your query above and search again.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results */}
        {hasSearched && !loading && !error && !clarification && (
          <div className="max-w-5xl mx-auto">
            {results.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-600">
                    No papers found. Try a different search query.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="mb-4 text-gray-600">
                  Found {results.length} paper{results.length !== 1 ? "s" : ""}
                </div>
                <div className="space-y-4">
                  {results.map((paper) => (
                    <PaperCard
                      key={paper.id}
                      paper={paper}
                      isFavorite={favoriteIds.has(paper.id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
