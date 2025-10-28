# Block Blast Game

A fully-featured Block Blast clone built with React Native and Expo.

## Features

- **Drag & Drop Mechanics**: Drag blocks from the selection area and place them on the 8x8 grid
- **Visual Preview**: See exactly where your block will land with a green preview overlay
- **Random Block Generation**: Get 3 random blocks at a time, with new sets appearing when all are used
- **Smart Scoring System**:
  - Points for each block placed based on size
  - Bonus points for clearing full rows and columns
  - Combo multipliers for consecutive line clears
- **Game Over Detection**: Automatically detects when no more moves are possible
- **Undo Feature**: Take back your last move if you make a mistake
- **High Score Persistence**: Saves your scores to Supabase database
- **Global Leaderboard**: View top scores from all players
- **Modern UI**: Dark theme with smooth animations and visual effects
- **Statistics Tracking**: Tracks blocks placed and lines cleared

## Database Setup

The game uses Supabase for high score persistence. To set up the database:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL script from `database_schema.sql`

This will create:
- `high_scores` table with proper schema
- Row Level Security policies for public read/write
- Indexes for efficient leaderboard queries

## Installation

```bash
npm install
```

## Running the App

```bash
npm start
```

Then scan the QR code with Expo Go app on your mobile device.

## How to Play

1. Drag any of the 3 available blocks onto the grid
2. Place blocks strategically to fill complete rows or columns
3. When a row or column is completely filled, it clears and you earn bonus points
4. Clear multiple lines in succession to build combos for even higher scores
5. Game ends when none of the available blocks can be placed
6. Save your score and compete on the global leaderboard

## Technologies Used

- React Native
- Expo
- React Native Reanimated (for smooth animations)
- React Native Gesture Handler (for drag & drop)
- Supabase (for database and high scores)

## Block Varieties

The game includes 19 different block shapes:
- Single blocks (1x1)
- Lines (2-5 cells)
- Squares (2x2, 3x3)
- L-shapes and their rotations
- T-shapes
- Z-shapes
- Corner pieces