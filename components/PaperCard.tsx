"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal, ModalHeader, ModalBody } from "@/components/ui/modal";
import { ExternalLink, Star, Loader2, Sparkles } from "lucide-react";
import { SearchResultPaper, SummarizeResponse } from "@/lib/types";

interface PaperCardProps {
  paper: SearchResultPaper;
  isFavorite?: boolean;
  onToggleFavorite?: (paper: SearchResultPaper) => void;
}

export function PaperCard({ paper, isFavorite = false, onToggleFavorite }: PaperCardProps) {
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const handleSummaryClick = async () => {
    if (summary) {
      // If we already have the summary, just show it
      setShowSummary(true);
      return;
    }

    // Fetch the summary
    setLoadingSummary(true);
    setSummaryError(null);

    try {
      const response = await fetch("/api/papers/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paperId: paper.id,
          title: paper.title,
          authors: paper.authors,
          abstract: paper.abstract,
          year: paper.year,
        }),
      });

      const data: SummarizeResponse = await response.json();

      if (data.status === "ok" && data.summary) {
        setSummary(data.summary);
        setShowSummary(true);
      } else {
        setSummaryError(data.error || "Failed to generate summary");
      }
    } catch (error) {
      setSummaryError("Failed to connect to the server. Please try again.");
      console.error("Summary error:", error);
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{paper.title}</CardTitle>
              <CardDescription className="text-base">
                <div className="space-y-1">
                  <div>
                    <span className="font-medium">Authors:</span>{" "}
                    {paper.authors.length > 0 ? paper.authors.join(", ") : "Unknown"}
                  </div>
                  {paper.year && (
                    <div>
                      <span className="font-medium">Year:</span> {paper.year}
                    </div>
                  )}
                  {paper.venue && (
                    <div>
                      <span className="font-medium">Venue:</span> {paper.venue}
                    </div>
                  )}
                  {paper.citationCount !== undefined && (
                    <div>
                      <span className="font-medium">Citations:</span> {paper.citationCount}
                    </div>
                  )}
                </div>
              </CardDescription>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2">
              {onToggleFavorite && (
                <Button
                  variant={isFavorite ? "default" : "outline"}
                  size="sm"
                  onClick={() => onToggleFavorite(paper)}
                  className="gap-2"
                >
                  <Star className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                  {isFavorite ? "Saved" : "Save"}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSummaryClick}
                disabled={loadingSummary}
                className="gap-2"
              >
                {loadingSummary ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Summary
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {paper.abstractSnippet && (
            <p className="text-gray-700 mb-4">{paper.abstractSnippet}</p>
          )}
          {summaryError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {summaryError}
            </div>
          )}
          {paper.externalUrl && (
            <a
              href={paper.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              View paper
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </CardContent>
      </Card>

      {/* Summary Modal */}
      <Modal open={showSummary} onClose={() => setShowSummary(false)}>
        <ModalHeader>
          <h2 className="text-2xl font-bold text-gray-900 pr-8">AI Summary</h2>
          <p className="text-sm text-gray-600 mt-2">{paper.title}</p>
        </ModalHeader>
        <ModalBody>
          {summary ? (
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {summary}
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No summary available.</p>
          )}
        </ModalBody>
      </Modal>
    </>
  );
}
