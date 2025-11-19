import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Star, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Paper Explorer
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Search across global research papers with AI-powered insights.
            Discover, summarize, and save your favorite academic papers.
            <span className="block mt-2 text-base text-gray-500">
              🌐 English & Japanese queries supported
            </span>
          </p>
          <Link href="/search">
            <Button size="lg" className="gap-2">
              <Search className="h-5 w-5" />
              Start Searching
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Smart Search</CardTitle>
              <CardDescription>
                Search across millions of academic papers with AI-powered query validation. Supports English and Japanese queries.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl">AI Summaries</CardTitle>
              <CardDescription>
                Get detailed, AI-generated summaries of research papers in seconds
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-amber-600" />
              </div>
              <CardTitle className="text-xl">Save Favorites</CardTitle>
              <CardDescription>
                Bookmark important papers and build your personal research library
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </main>
  );
}
