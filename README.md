# Paper Explorer

A modern, AI-powered academic paper search application built with Next.js, TypeScript, and Anthropic Claude. Search millions of research papers, get AI-generated summaries, and manage your favorites—all with a beautiful, responsive interface.

![Paper Explorer](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)

## Features

### 🔍 Smart Paper Search
- Search across millions of academic papers via Semantic Scholar API
- AI-powered query validation to help you refine broad searches
- Up to 50 results per search with rich metadata (authors, year, venue, citations)

### ✨ AI-Powered Summaries
- Generate detailed paper summaries with Anthropic Claude
- Structured summaries include: research problem, methodology, findings, significance, and limitations
- Summaries are cached for quick re-access

### ⭐ Favorites Management
- Save papers to your personal library
- Search within your favorites
- All data stored locally in your browser (no database needed!)

### 👤 User Profile
- Manage your personal information and research interests
- Set default search keywords for quick access
- Complete privacy—data never leaves your browser

### 🎨 Modern UI
- Clean, responsive design that works on desktop and tablet
- Gradient backgrounds and smooth animations
- Accessible components built with Tailwind CSS

## Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** components

### Backend
- **Next.js API Routes** for serverless functions
- **Anthropic Claude API** for AI features
- **Semantic Scholar API** for paper search

### Storage
- **Browser localStorage** (no server-side database)
- TypeScript-based service layer for type-safe data management

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- An Anthropic API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Paper
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your API keys:
   ```bash
   # Required for AI features (query validation and summarization)
   ANTHROPIC_API_KEY=your_anthropic_api_key_here

   # Optional: Semantic Scholar API key for higher rate limits
   # SEMANTIC_SCHOLAR_API_KEY=your_semantic_scholar_api_key_here
   ```

   **Getting an Anthropic API key:**
   1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
   2. Sign up or log in
   3. Navigate to API Keys
   4. Create a new API key

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
Paper/
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes
│   │   └── papers/
│   │       ├── search/          # Paper search endpoint
│   │       └── summary/         # AI summarization endpoint
│   ├── search/                  # Search page
│   ├── favorites/               # Favorites page
│   ├── profile/                 # User profile page
│   ├── layout.tsx               # Root layout with navigation
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── components/                  # React components
│   ├── ui/                      # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   └── ...
│   ├── navigation.tsx           # Main navigation bar
│   └── PaperCard.tsx            # Reusable paper card component
├── lib/                         # Utility functions and services
│   ├── types.ts                 # TypeScript type definitions
│   ├── utils.ts                 # General utilities
│   ├── localStorageService.ts   # localStorage CRUD operations
│   ├── semanticScholarClient.ts # Semantic Scholar API client
│   └── claudeClient.ts          # Anthropic Claude API client
├── .env.example                 # Example environment variables
└── README.md                    # This file
```

## Key Architectural Decisions

### No Server-Side Database
All user data (favorites and profile) is stored in browser localStorage. This provides:
- **Privacy**: Your data never leaves your browser
- **Simplicity**: No database setup or management required
- **Instant access**: No network latency for local data

### API Integration
- **Semantic Scholar**: Free academic paper database, no API key required for basic usage
- **Anthropic Claude**: Powers AI features (requires API key)

### Type Safety
Full TypeScript coverage with well-defined interfaces for all data models:
- `UserProfile`: User information
- `FavoritePaper`: Saved papers with metadata
- `SearchResultPaper`: Paper search results
- `PaperSearchResponse`: API response types

## API Documentation

### POST /api/papers/search

Search for academic papers with AI-powered query validation.

**Request Body:**
```json
{
  "query": "machine learning for climate prediction"
}
```

**Response (Success):**
```json
{
  "status": "ok",
  "papers": [
    {
      "id": "paper_id",
      "title": "Paper Title",
      "authors": ["Author 1", "Author 2"],
      "year": 2024,
      "venue": "Conference Name",
      "abstract": "Full abstract...",
      "abstractSnippet": "Shortened abstract...",
      "externalUrl": "https://doi.org/...",
      "citationCount": 42
    }
  ],
  "total": 50
}
```

**Response (Needs Clarification):**
```json
{
  "status": "needs_clarification",
  "message": "Your search query seems too broad.",
  "suggestedQuestions": [
    "Specify the climate domain (temperature, precipitation, etc.)",
    "Add methodological constraints (neural networks, ensemble methods)",
    "Include a time range or geographic region"
  ]
}
```

### POST /api/papers/summary

Generate an AI-powered summary of a research paper.

**Request Body:**
```json
{
  "paperId": "paper_id",
  "title": "Paper Title",
  "authors": ["Author 1", "Author 2"],
  "abstract": "Full abstract text...",
  "year": 2024
}
```

**Response:**
```json
{
  "status": "ok",
  "summary": "Detailed AI-generated summary including research problem, methodology, findings, significance, and limitations..."
}
```

## Features in Detail

### Search Flow

1. User enters a query
2. (If AI configured) Query is validated by Claude
   - If too vague, suggestions are shown
   - User refines query
3. Semantic Scholar API is called
4. Results are displayed with full metadata

### Favorites System

- Click the star icon on any paper to save it
- Access your favorites from the Favorites page
- Search within your saved papers
- Remove papers from favorites with one click
- Data persists across browser sessions

### AI Summaries

- Click "Summary" on any paper
- Claude generates a structured summary (~300 words)
- Summary is cached for that session
- Modal display with formatted content

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

localStorage is required for favorites and profile features.

## Development

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Limitations

- **localStorage Capacity**: Limited to ~5-10MB (hundreds of papers)
- **No Cloud Sync**: Data is per-browser, no cross-device sync
- **API Rate Limits**:
  - Semantic Scholar: 100 requests per 5 minutes (public API)
  - Anthropic: Based on your API plan

## Future Enhancements

Potential features for future development:
- Export favorites to BibTeX/RIS
- Cloud sync with optional backend
- Advanced filtering (by year, citations, venue type)
- Citation graph visualization
- Browser extension for quick paper saving
- PDF annotation integration

## Troubleshooting

### AI features not working
- Verify `ANTHROPIC_API_KEY` is set in `.env`
- Check API key permissions in Anthropic console
- Ensure you have API credits available

### Search returns no results
- Try broader search terms
- Check your internet connection
- Semantic Scholar may be temporarily unavailable

### Favorites not persisting
- Check if localStorage is enabled in your browser
- Ensure you're not in private/incognito mode
- Check browser storage quota

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for learning or as a base for your own applications.

## Acknowledgments

- [Semantic Scholar](https://www.semanticscholar.org/) for the academic paper API
- [Anthropic](https://www.anthropic.com/) for Claude AI
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Lucide](https://lucide.dev/) for icons

---

**Built with ❤️ using Next.js, TypeScript, and Claude AI**
