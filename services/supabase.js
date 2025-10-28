import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const saveHighScore = async (playerName, score, blocksPlaced, linesCleared) => {
  try {
    const { data, error } = await supabase
      .from('high_scores')
      .insert([
        {
          player_name: playerName || 'Anonymous',
          score: score,
          blocks_placed: blocksPlaced,
          lines_cleared: linesCleared,
        },
      ])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error saving high score:', error);
    return { success: false, error };
  }
};

export const getTopScores = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('high_scores')
      .select('*')
      .order('score', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching high scores:', error);
    return { success: false, error, data: [] };
  }
};

export const getPlayerRank = async (score) => {
  try {
    const { count, error } = await supabase
      .from('high_scores')
      .select('*', { count: 'exact', head: true })
      .gt('score', score);

    if (error) throw error;
    return { success: true, rank: (count || 0) + 1 };
  } catch (error) {
    console.error('Error getting player rank:', error);
    return { success: false, rank: null };
  }
};
