# Database Setup Instructions

To enable high scores and leaderboard functionality, you need to set up the Supabase database table.

## Steps:

1. **Go to your Supabase Dashboard**
   - Visit: https://app.supabase.com
   - Select your project: `cwinjlwevdjarcjaebuf`

2. **Open the SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and paste the SQL from `database_schema.sql`**
   - Open the file `database_schema.sql` in this project
   - Copy all the SQL code
   - Paste it into the SQL Editor in Supabase

4. **Run the SQL**
   - Click the "Run" button in the SQL Editor
   - You should see a success message

5. **Verify the Setup**
   - Go to "Table Editor" in the left sidebar
   - You should now see a `high_scores` table
   - The table should have columns: id, player_name, score, blocks_placed, lines_cleared, created_at

## What This Creates:

- **high_scores table**: Stores all game scores
- **RLS Policies**: Allows anyone to read scores (for leaderboard) and insert new scores
- **Performance Index**: Optimizes leaderboard queries by score

## Testing:

Once the table is created:
1. Play a game
2. When game ends, click "Save Score"
3. Enter your name and save
4. Click "Leaderboard" to see your score appear

## Troubleshooting:

If scores aren't saving:
- Check that the SQL was run successfully in Supabase
- Verify the table exists in Table Editor
- Check that RLS policies are enabled (should show a green shield icon)
- Make sure your `.env` file has the correct Supabase credentials
