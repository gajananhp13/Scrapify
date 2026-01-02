# **App Name**: AetherScrape

## Core Features:

- Chat Input: Chatbot-style input for URL submission, featuring real-time validation to ensure correct formatting.
- Web Scraping: Comprehensive scraping of web page content, extracting titles, meta descriptions, headings (H1-H6), paragraphs, links, and images (including src and alt attributes), and JSON-LD data.
- AI Summarization: AI-powered content summarization using the OpenAI API, to produce concise summaries of scraped web pages. The tool may consider titles, meta descriptions, headings (H1-H6), paragraphs and JSON-LD.
- AI Content Classification: AI-driven content type classification using the OpenAI API, to automatically determine the type of content on a scraped web page (e.g., blog, product, news). The tool may consider titles, meta descriptions, headings (H1-H6), paragraphs and JSON-LD.
- JSON API: API endpoint (/api/scrape?url=...) returning structured JSON for easy data retrieval.
- Scrape History: History tab displaying a log of past scrapes with timestamps.
- Theme Switch: Allows the ability to switch between dark and light themes.

## Style Guidelines:

- Primary color: Deep Indigo (#4B0082) to create a professional and modern aesthetic.
- Background color: Very light gray (#F5F5F5), almost white, for a clean backdrop.
- Accent color: Golden Yellow (#FFD700) to highlight interactive elements and important information.
- Body font: 'Inter', a sans-serif font providing a modern and neutral look for both headlines and body text.
- Code font: 'Source Code Pro' for displaying code snippets.
- Crisp and simple icons from a library such as Phosphor to maintain a clean and modern look.
- Subtle loading animations and toast notifications to provide feedback to the user without being distracting.