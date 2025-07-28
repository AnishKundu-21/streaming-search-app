# StreamFinder: Your Ultimate Streaming Guide

StreamFinder is a modern, full-stack web application designed to help you discover and track movies and TV shows. Built with Next.js and powered by the TMDB API, it offers a seamless experience for finding where to watch your favorite content, managing your viewing history, and getting personalized recommendations.

## Features

  * **Universal Search**: Instantly search for any movie or TV show with real-time results.
  * **Global Streaming Availability**: Find where to watch titles across the globe with an easy-to-use country selector for streaming, rent, and buy options.
  * **Per-Season TV Show Tracking**: Mark individual seasons as "watched" or "to watch," giving you granular control over your viewing progress.
  * **Dedicated Discovery Page**: Explore new content with a dedicated "Discover" page, allowing you to filter by genre for both movies and TV shows.
  * **Personalized Recommendations**: Get tailored movie and TV show recommendations on your homepage based on your viewing history.
  * **User Authentication**: Secure sign-in with Google OAuth or email and password.
  * **Watchlist & Watched History**: Easily manage your "To Watch" and "Already Watched" lists.
  * **Rich Content Details**: View detailed information for any title, including IMDb ratings, cast and crew, genres, and more.
  * **Fully Responsive Design**: Enjoy a seamless experience on any device, from mobile phones to desktops, with a clean and modern dark mode.

## Tech Stack

  * **Framework**: Next.js 15 (App Router)
  * **Frontend**: React 19, Tailwind CSS
  * **Authentication**: NextAuth.js v5
  * **Database**: MongoDB with Prisma ORM
  * **API**: TMDB for all movie and TV show data
  * **Data Fetching**: SWR for efficient, cached data fetching on the client-side
  * **Other**: TypeScript, bcrypt

## Prerequisites

  * Node.js 18+
  * A MongoDB instance (local or a free cloud instance from MongoDB Atlas)
  * TMDB API Key (available for free from [themoviedb.org](https://www.themoviedb.org/))
  * Google OAuth credentials (for Google sign-in functionality)

## Installation

1.  **Clone the Repository**:

    ```bash
    git clone https://github.com/your-username/streamfinder.git
    cd streamfinder
    ```

2.  **Install Dependencies**:

    ```bash
    npm install
    ```

3.  **Set Up Environment Variables**:
    Create a `.env.local` file in the root of your project and add the following variables:

    ```
    # Database (replace with your MongoDB connection string)
    DATABASE_URL="mongodb+srv://..."

    # NextAuth.js
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET= # Generate a secret with: openssl rand -base64 32

    # API Keys
    GOOGLE_CLIENT_ID= # Your Google Client ID
    GOOGLE_CLIENT_SECRET= # Your Google Client Secret
    TMDB_API_KEY= # Your TMDB API Key
    ```

4.  **Sync the Database Schema**:
    Run the following command to apply the schema to your database:

    ```bash
    npx prisma db push
    ```

## Running the Project

1.  **Start the Development Server**:

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser to see the application.

2.  **Build for Production**:

    ```bash
    npm run build
    npm start
    ```

## License

This project is protected by a proprietary license.

  * **Personal Use**: You are free to use this software for personal, non-commercial purposes.
  * **Commercial Use**: Commercial use of this software is strictly prohibited without a separate, written license agreement from the copyright holder, Anish Kundu.

Please see the `LICENSE` file for full details.