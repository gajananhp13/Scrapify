
## 🎯 What is Scrapify?

Scrapify is a modern web scraping tool that combines the power of **Next.js 15** with **Google's Gemini AI** to extract, analyze, and understand web content. Unlike traditional scrapers, Scrapify doesn't just grab data—it intelligently processes and summarizes it for you.

### ✨ Key Features

- 🤖 **AI-Powered Analysis** - Automatic content summarization and classification using Gemini 2.0 Flash
- 📊 **Structured Data Extraction** - Extract headings, paragraphs, links, images, tables, and JSON-LD
- 📥 **Multiple Export Formats** - Download as JSON, CSV, Excel, or ZIP archives
- 🎨 **Beautiful UI** - Modern, responsive design with dark/light theme support
- 💾 **Privacy-First History** - Local storage—no database, no tracking
- ⚡ **Lightning Fast** - Optimized with React Server Components and serverless architecture
- 📈 **Real-Time Stats** - Live visitor count and scraping statistics
- 🔒 **Type-Safe** - Built with TypeScript for reliability and maintainability

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **pnpm** or **yarn**
- **Firebase Account** (for deployment and stats tracking)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/scrapify.git
   cd scrapify
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your API keys:
   - **GOOGLE_GENAI_API_KEY**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **UPSTASH_REDIS_REST_URL**: Get from [Upstash Console](https://console.upstash.com/)
   - **UPSTASH_REDIS_REST_TOKEN**: Get from [Upstash Console](https://console.upstash.com/)

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:9002](http://localhost:9002) in your browser
