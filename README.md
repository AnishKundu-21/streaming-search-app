# StreamFinder

StreamFinder is a modern web application built with Next.js that helps users discover movies and TV shows available for streaming in India. It integrates with the TMDB API to provide search functionality, detailed content information, streaming provider details, and personalized features like watchlists and recommendations. The app includes user authentication, a responsive design, and a clean interface for browsing trending content.

## Features

- **Search Functionality**: Search for movies and TV shows with real-time results, including posters, release years, and media type indicators.
- **Content Details**: Dedicated pages for movies and TV shows with overviews, cast lists, genres, runtime/episode info, and available streaming providers in India.
- **User Authentication**: Secure sign-in with Google OAuth or email/password. Custom sign-in and sign-up pages with success messaging.
- **Watchlist**: Add/remove items to a personal watchlist. View and manage your "To Watch" list.
- **Already Watched Tracking**: Mark content as watched, with optional ratings. Separate tab for viewed items.
- **Personalized Recommendations**: Generates suggestions based on your watched history using TMDB's recommendation algorithms.
- **Homepage Browsing**: Horizontal scrollable sections for Trending, Top-Rated, Upcoming, Now Playing, and more – all with smooth scrolling and navigation buttons.
- **Responsive Design**: Mobile-friendly layout with dark mode support via Tailwind CSS.
- **Protected Routes**: API endpoints require authentication for user-specific data.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Frontend**: React, Tailwind CSS
- **Authentication**: NextAuth.js v5 (with Prisma adapter)
- **Database**: MongoDB with Prisma ORM
- **API Integrations**: TMDB API for content data
- **State Management**: React hooks, SWR for data fetching/caching
- **Other**: bcrypt for password hashing, TypeScript for type safety

## Prerequisites

- Node.js 18+ 
- MongoDB instance (local or cloud like MongoDB Atlas)
- TMDB API key (free from [themoviedb.org](https://www.themoviedb.org/))
- Google OAuth credentials (for Google sign-in)

## Installation

1. **Clone the Repository**:
   ```
   git clone https://github.com/yourusername/streamfinder.git
   cd streamfinder
   ```

2. **Install Dependencies**:
   ```
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env.local` file in the root directory and add the following:
   ```
   # Database
   DATABASE_URL="mongodb://localhost:27017/streamfinder"  # Or your MongoDB connection string

   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_super_secret_key  # Generate with `openssl rand -base64 32`

   # Providers
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # TMDB
   TMDB_API_KEY=your_tmdb_api_key
   ```
   - Replace placeholders with your actual values.

4. **Initialize Prisma**:
   ```
   npx prisma generate
   npx prisma db push  # Applies schema to your database
   ```

## Running the Project

1. **Development Server**:
   ```
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

2. **Build for Production**:
   ```
   npm run build
   npm start
   ```

## Usage

- **Homepage**: Search for content or browse sections like "Trending This Week" or "Top-Rated Movies".
- **Sign In/Up**: Use `/auth/signin` or `/auth/signup` to create an account.
- **Watchlist**: Navigate to `/watchlist` to manage your lists (requires sign-in).
- **Content Pages**: Click on any item to view details at `/movie/[id]` or `/tv/[id]`.
- **Recommendations**: Appear on the homepage after marking items as "Already Watched".

## Deployment

- **Vercel**: Recommended for Next.js apps. Set environment variables in Vercel dashboard and deploy from GitHub.
- **MongoDB**: Use a hosted service like MongoDB Atlas for production.
- **Notes**: Ensure `NEXTAUTH_URL` is set to your production domain. For Google OAuth, add the domain to authorized redirect URIs in Google Console.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/new-feature`).
3. Commit changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a Pull Request.

We welcome contributions! Please follow the code style and add tests for new features.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

Built with ❤️ by Anish in 2025. For questions, open an issue on GitHub.