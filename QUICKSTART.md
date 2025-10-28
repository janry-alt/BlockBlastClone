# Quick Start Guide

Get your Block Blast game running in 3 simple steps!

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Database (Optional but Recommended)

To enable high scores and leaderboard:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Open SQL Editor
3. Copy the SQL from `database_schema.sql`
4. Run it in the SQL Editor

See `DATABASE_SETUP.md` for detailed instructions.

## 3. Run the Game

```bash
npm start
```

Then:
- Scan the QR code with **Expo Go** app on your phone
- Or press `a` for Android emulator
- Or press `i` for iOS simulator

## Playing the Game

1. **Drag blocks** from the bottom onto the 8x8 grid
2. **Fill rows or columns** to clear them and earn bonus points
3. **Build combos** by clearing lines consecutively
4. **Game ends** when no blocks can be placed
5. **Save your score** and compete on the leaderboard!

## Controls

- **Drag**: Touch and drag any available block
- **Undo**: Take back your last move
- **New Game**: Start fresh anytime
- **Leaderboard**: View top scores

## Tips

- Watch the green preview to see where blocks will land
- Plan ahead to create multiple line clears
- Use the undo feature to experiment with strategies
- Larger blocks give more points but are harder to place
- Combos multiply your score - try to chain line clears!

## Troubleshooting

**Blocks won't drag?**
- Make sure you're dragging an unused block (not faded out)

**Preview not showing?**
- Drag over the grid area
- Preview only shows for valid placements

**Scores not saving?**
- Check that you've run the database setup SQL
- Verify your Supabase credentials in `.env`

**App won't start?**
- Run `npm install` again
- Make sure Expo CLI is installed: `npm install -g expo-cli`
- Check that your device is on the same network

## Need Help?

- Check `README.md` for full documentation
- See `FEATURES.md` for complete feature list
- Read `DATABASE_SETUP.md` for database instructions
