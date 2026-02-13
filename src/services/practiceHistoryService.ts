import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type PracticeHistory = Database["public"]["Tables"]["practice_history"]["Row"];
type PracticeHistoryInsert = Database["public"]["Tables"]["practice_history"]["Insert"];

export interface PracticeAttempt {
  id?: string;
  user_id?: string;
  module_type: "reading" | "writing" | "listening" | "speaking";
  test_type?: string;
  topic: string;
  difficulty: string;
  completed_at?: string;
  duration?: string;
  word_count?: number;
  band_score?: number;
  is_evaluated?: boolean;
  user_answer?: string;
  evaluation_data?: any;
  test_data?: any;
}

/**
 * Save a practice attempt to Supabase
 */
export async function savePracticeAttempt(attempt: PracticeAttempt) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User must be logged in to save practice history");
  }

  const insertData: PracticeHistoryInsert = {
    user_id: user.id,
    module_type: attempt.module_type,
    test_type: attempt.test_type,
    topic: attempt.topic,
    difficulty: attempt.difficulty,
    duration: attempt.duration,
    word_count: attempt.word_count,
    band_score: attempt.band_score,
    is_evaluated: attempt.is_evaluated || false,
    user_answer: attempt.user_answer,
    evaluation_data: attempt.evaluation_data,
    test_data: attempt.test_data,
  };

  const { data, error } = await supabase
    .from("practice_history")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error("Error saving practice attempt:", error);
    throw error;
  }

  return data;
}

/**
 * Get all practice history for the current user
 */
export async function getPracticeHistory(moduleType?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return [];
  }

  let query = supabase
    .from("practice_history")
    .select("*")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false });

  if (moduleType) {
    query = query.eq("module_type", moduleType);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching practice history:", error);
    return [];
  }

  return data || [];
}

/**
 * Get practice statistics for the current user
 */
export async function getPracticeStats() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return {
      total: 0,
      reading: 0,
      writing: 0,
      listening: 0,
      speaking: 0,
      averageBandScore: 0,
    };
  }

  const { data, error } = await supabase
    .from("practice_history")
    .select("module_type, band_score")
    .eq("user_id", user.id);

  if (error || !data) {
    console.error("Error fetching practice stats:", error);
    return {
      total: 0,
      reading: 0,
      writing: 0,
      listening: 0,
      speaking: 0,
      averageBandScore: 0,
    };
  }

  const stats = {
    total: data.length,
    reading: data.filter(d => d.module_type === "reading").length,
    writing: data.filter(d => d.module_type === "writing").length,
    listening: data.filter(d => d.module_type === "listening").length,
    speaking: data.filter(d => d.module_type === "speaking").length,
    averageBandScore: 0,
  };

  const scoresWithValues = data.filter(d => d.band_score !== null && d.band_score !== undefined);
  if (scoresWithValues.length > 0) {
    const totalScore = scoresWithValues.reduce((sum, d) => sum + (d.band_score || 0), 0);
    stats.averageBandScore = parseFloat((totalScore / scoresWithValues.length).toFixed(1));
  }

  return stats;
}

/**
 * Get user practice statistics
 */
export async function getUserStatistics(userId: string) {
  try {
    const { data, error } = await supabase
      .from("practice_history")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;

    const stats = {
      totalAttempts: data?.length || 0,
      averageBandScore: 0,
      readingCount: 0,
      writingCount: 0,
      listeningCount: 0,
      speakingCount: 0,
      lastPracticeDate: null as string | null,
    };

    if (data && data.length > 0) {
      // Calculate module counts
      stats.readingCount = data.filter((item) => item.module_type === "reading").length;
      stats.writingCount = data.filter((item) => item.module_type === "writing").length;
      stats.listeningCount = data.filter((item) => item.module_type === "listening").length;
      stats.speakingCount = data.filter((item) => item.module_type === "speaking").length;

      // Calculate average band score (only for evaluated attempts)
      const evaluatedAttempts = data.filter((item) => item.band_score && item.band_score > 0);
      if (evaluatedAttempts.length > 0) {
        const totalScore = evaluatedAttempts.reduce((sum, item) => sum + (item.band_score || 0), 0);
        stats.averageBandScore = totalScore / evaluatedAttempts.length;
      }

      // Get last practice date
      const sortedData = [...data].sort((a, b) => 
        new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
      );
      stats.lastPracticeDate = sortedData[0].completed_at;
    }

    return stats;
  } catch (error) {
    console.error("Error getting user statistics:", error);
    return {
      totalAttempts: 0,
      averageBandScore: 0,
      readingCount: 0,
      writingCount: 0,
      listeningCount: 0,
      speakingCount: 0,
      lastPracticeDate: null,
    };
  }
}

/**
 * Calculate user's study streak (consecutive days of practice)
 */
export async function getStudyStreak(userId: string) {
  try {
    const { data, error } = await supabase
      .from("practice_history")
      .select("completed_at")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return 0;

    // Get unique practice dates (ignoring time)
    const practiceDates = Array.from(
      new Set(
        data.map(item => new Date(item.completed_at).toDateString())
      )
    ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (practiceDates.length === 0) return 0;

    let streak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    // Check if user practiced today or yesterday to start counting
    if (practiceDates[0] !== today && practiceDates[0] !== yesterday) {
      return 0; // Streak broken
    }

    // Count consecutive days
    let currentDate = new Date();
    for (const practiceDate of practiceDates) {
      const checkDate = new Date(currentDate);
      checkDate.setHours(0, 0, 0, 0);
      
      const practice = new Date(practiceDate);
      practice.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((checkDate.getTime() - practice.getTime()) / 86400000);
      
      if (diffDays === 0 || diffDays === 1) {
        streak++;
        currentDate = practice;
      } else {
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error("Error calculating study streak:", error);
    return 0;
  }
}

/**
 * Get band score history for chart visualization
 */
export async function getBandScoreHistory(userId: string) {
  try {
    const { data, error } = await supabase
      .from("practice_history")
      .select("completed_at, band_score, module_type")
      .eq("user_id", userId)
      .not("band_score", "is", null)
      .order("completed_at", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error fetching band score history:", error);
    return [];
  }
}

/**
 * Get recent practice sessions
 */
export async function getRecentPractice(userId: string, limit: number = 5) {
  try {
    const { data, error } = await supabase
      .from("practice_history")
      .select("*")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error fetching recent practice:", error);
    return [];
  }
}

/**
 * Delete a practice attempt
 */
export async function deletePracticeAttempt(id: string) {
  const { error } = await supabase
    .from("practice_history")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting practice attempt:", error);
    throw error;
  }
}

/**
 * Delete all practice history for a specific module
 */
export async function clearModuleHistory(moduleType: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User must be logged in");
  }

  const { error } = await supabase
    .from("practice_history")
    .delete()
    .eq("user_id", user.id)
    .eq("module_type", moduleType);

  if (error) {
    console.error("Error clearing module history:", error);
    throw error;
  }
}

/**
 * Migrate localStorage history to Supabase
 */
export async function migrateLocalStorageHistory() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { migrated: 0, failed: 0 };
  }

  const localHistory = localStorage.getItem("ielts_practice_history");
  if (!localHistory) {
    return { migrated: 0, failed: 0 };
  }

  try {
    const history: PracticeAttempt[] = JSON.parse(localHistory);
    let migrated = 0;
    let failed = 0;

    for (const attempt of history) {
      try {
        await savePracticeAttempt(attempt);
        migrated++;
      } catch (error) {
        console.error("Failed to migrate attempt:", error);
        failed++;
      }
    }

    // Clear localStorage after successful migration
    if (migrated > 0) {
      localStorage.removeItem("ielts_practice_history");
    }

    return { migrated, failed };
  } catch (error) {
    console.error("Error migrating history:", error);
    return { migrated: 0, failed: 0 };
  }
}