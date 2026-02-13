import { supabase } from "@/integrations/supabase/client";

export type ExamType = "academic" | "general";
export type Difficulty = "easy" | "medium" | "hard";
export type Category = "reading" | "writing" | "listening" | "speaking";

export interface IELTSPaper {
  test_id: string;
  category: Category;
  exam_type: ExamType;
  difficulty: Difficulty;
  content_json: any;
  audio_url?: string;
  created_at: string;
  updated_at: string;
}

export interface GetPapersFilters {
  category?: Category;
  exam_type?: ExamType;
  difficulty?: Difficulty;
}

/**
 * Fetch IELTS papers with optional filters
 */
export async function getIELTSPapers(filters?: GetPapersFilters): Promise<IELTSPaper[]> {
  try {
    let query = supabase
      .from("ielts_papers")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    if (filters?.exam_type) {
      query = query.eq("exam_type", filters.exam_type);
    }

    if (filters?.difficulty) {
      query = query.eq("difficulty", filters.difficulty);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching IELTS papers:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in getIELTSPapers:", error);
    return [];
  }
}

/**
 * Get a specific IELTS paper by ID
 */
export async function getIELTSPaperById(testId: string): Promise<IELTSPaper | null> {
  try {
    const { data, error } = await supabase
      .from("ielts_papers")
      .select("*")
      .eq("test_id", testId)
      .single();

    if (error) {
      console.error("Error fetching IELTS paper:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in getIELTSPaperById:", error);
    return null;
  }
}

/**
 * Create a new IELTS paper
 */
export async function createIELTSPaper(paper: Omit<IELTSPaper, "test_id" | "created_at" | "updated_at">): Promise<IELTSPaper | null> {
  try {
    const { data, error } = await supabase
      .from("ielts_papers")
      .insert([paper])
      .select()
      .single();

    if (error) {
      console.error("Error creating IELTS paper:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in createIELTSPaper:", error);
    return null;
  }
}

/**
 * Update an existing IELTS paper
 */
export async function updateIELTSPaper(testId: string, updates: Partial<Omit<IELTSPaper, "test_id" | "created_at">>): Promise<IELTSPaper | null> {
  try {
    const { data, error } = await supabase
      .from("ielts_papers")
      .update(updates)
      .eq("test_id", testId)
      .select()
      .single();

    if (error) {
      console.error("Error updating IELTS paper:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in updateIELTSPaper:", error);
    return null;
  }
}

/**
 * Delete an IELTS paper
 */
export async function deleteIELTSPaper(testId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("ielts_papers")
      .delete()
      .eq("test_id", testId);

    if (error) {
      console.error("Error deleting IELTS paper:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteIELTSPaper:", error);
    return false;
  }
}

/**
 * Get random paper for practice with filters
 */
export async function getRandomPaper(filters: GetPapersFilters): Promise<IELTSPaper | null> {
  try {
    const papers = await getIELTSPapers(filters);
    
    if (papers.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * papers.length);
    return papers[randomIndex];
  } catch (error) {
    console.error("Error in getRandomPaper:", error);
    return null;
  }
}

/**
 * Count papers by filters
 */
export async function countPapers(filters?: GetPapersFilters): Promise<number> {
  try {
    let query = supabase
      .from("ielts_papers")
      .select("test_id", { count: "exact", head: true });

    if (filters?.category) {
      query = query.eq("category", filters.category);
    }

    if (filters?.exam_type) {
      query = query.eq("exam_type", filters.exam_type);
    }

    if (filters?.difficulty) {
      query = query.eq("difficulty", filters.difficulty);
    }

    const { count, error } = await query;

    if (error) {
      console.error("Error counting papers:", error);
      throw error;
    }

    return count || 0;
  } catch (error) {
    console.error("Error in countPapers:", error);
    return 0;
  }
}