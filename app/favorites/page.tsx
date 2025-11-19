"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, BookmarkX } from "lucide-react";
import { FavoritePaper } from "@/lib/types";
import { loadFavoritePapers, removeFavoritePaper } from "@/lib/localStorageService";
import { PaperCard } from "@/components/PaperCard";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoritePaper[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load favorites from localStorage
    const loadedFavorites = loadFavoritePapers();
    // Sort by addedAt date (newest first)
    loadedFavorites.sort((a, b) =>
      new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    );
    setFavorites(loadedFavorites);
  }, []);

  const handleRemoveFavorite = (paper: FavoritePaper) => {
    removeFavoritePaper(paper.id);
    setFavorites(prev => prev.filter(fav => fav.id !== paper.id));
  };

  // Filter favorites based on search query
  const filteredFavorites = searchQuery.trim()
    ? favorites.filter(paper =>
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.authors.some(author =>
          author.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : favorites;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-5xl mx-auto mb-8">
          <h1 className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Favorite Papers
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Your saved research papers, stored locally in your browser
          </p>

          {/* Search within favorites */}
          {favorites.length > 0 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search your favorites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
          )}
        </div>

        {/* Favorites list */}
        <div className="max-w-5xl mx-auto">
          {favorites.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <BookmarkX className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No favorites yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Papers you save will appear here. Start by searching for papers!
                </p>
              </CardContent>
            </Card>
          ) : filteredFavorites.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-600">
                  No favorites match your search query.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-4 text-gray-600">
                {filteredFavorites.length} saved paper{filteredFavorites.length !== 1 ? "s" : ""}
                {searchQuery && ` (filtered from ${favorites.length})`}
              </div>
              <div className="space-y-4">
                {filteredFavorites.map((paper) => (
                  <PaperCard
                    key={paper.id}
                    paper={paper}
                    isFavorite={true}
                    onToggleFavorite={handleRemoveFavorite}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
