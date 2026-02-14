import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Type aliases for easier use
export type ExamType = "academic" | "general";
export type Difficulty = "easy" | "medium" | "hard";
export type Category = "reading" | "writing" | "listening" | "speaking";

export interface ReadingPassage {
  id: string;
  title: string;
  content: string;
  questionRange: { start: number; end: number };
}

export interface ReadingQuestion {
  id: string;
  questionNumber: number;
  type: "true-false-not-given" | "multiple-choice" | "matching" | "gap-fill";
  questionText: string;
  options?: string[];
  correctAnswer: string;
  passageId: string;
}

export interface ReadingTest {
  testId: string;
  testTitle: string;
  category: string;
  examType: string;
  difficulty: string;
  passages: ReadingPassage[];
  questions: ReadingQuestion[];
  timeLimit: number;
  totalQuestions: number;
}

// Generic IELTS Paper type (used by test-session.tsx)
export interface IELTSPaper {
  test_id: string;
  test_title: string;
  category: string;
  exam_type: string;
  difficulty: string;
  content_json: any;
  audio_url: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch a specific Reading test by ID from Supabase
 */
export async function fetchReadingTest(testId: string): Promise<{
  data: ReadingTest | null;
  error: string | null;
}> {
  console.log("=== FETCH READING TEST DEBUG ===");
  console.log("1. Test ID:", testId);

  try {
    // Fetch test from Supabase
    const { data, error } = await supabase
      .from("ielts_papers")
      .select("*")
      .eq("test_id", testId)
      .eq("category", "reading")
      .single();

    console.log("2. Supabase Query Response:", { data, error });

    if (error) {
      console.error("3. Supabase Error:", error);
      return {
        data: null,
        error: `Database Error: ${error.message} (Code: ${error.code || "unknown"})`
      };
    }

    if (!data) {
      console.error("4. No test found for ID:", testId);
      return {
        data: null,
        error: "Test not found in database"
      };
    }

    console.log("5. Raw content_json:", data.content_json);

    // Parse test content (content_json is the correct column name)
    let testContent: any;
    try {
      testContent = typeof data.content_json === "string" 
        ? JSON.parse(data.content_json) 
        : data.content_json;
      console.log("6. Parsed content_json:", testContent);
    } catch (parseError) {
      console.error("7. JSON Parse Error:", parseError);
      return {
        data: null,
        error: "Invalid test data format - unable to parse JSON"
      };
    }

    // Extract passages and questions from content_json
    const passages: ReadingPassage[] = testContent.passages || [];
    const questions: ReadingQuestion[] = testContent.questions || [];

    console.log("8. Extracted Passages:", passages.length);
    console.log("9. Extracted Questions:", questions.length);

    // Validate structure
    if (passages.length === 0) {
      console.warn("10. No passages found in test content");
      return {
        data: null,
        error: "Test content is incomplete - no passages found"
      };
    }

    if (questions.length === 0) {
      console.warn("11. No questions found in test content");
      return {
        data: null,
        error: "Test content is incomplete - no questions found"
      };
    }

    // Build complete test object
    const readingTest: ReadingTest = {
      testId: data.test_id,
      testTitle: data.test_title || "Reading Test",
      category: data.category,
      examType: data.exam_type,
      difficulty: data.difficulty,
      passages,
      questions,
      timeLimit: testContent.timeLimit || 3600,
      totalQuestions: questions.length
    };

    console.log("12. Final ReadingTest Object:", readingTest);

    return {
      data: readingTest,
      error: null
    };

  } catch (error: any) {
    console.error("13. Unexpected Error:", error);
    return {
      data: null,
      error: `Unexpected error: ${error.message || "Unknown error occurred"}`
    };
  }
}

/**
 * Get a random paper from Supabase based on filters
 * Used by test-session.tsx
 */
export async function getRandomPaper(filters: {
  category: Category;
  exam_type: ExamType;
  difficulty: Difficulty;
}): Promise<IELTSPaper | null> {
  console.log("=== GET RANDOM PAPER DEBUG ===");
  console.log("Filters:", filters);

  try {
    const { data, error } = await supabase
      .from("ielts_papers")
      .select("*")
      .eq("category", filters.category)
      .eq("exam_type", filters.exam_type)
      .eq("difficulty", filters.difficulty)
      .limit(50); // Get up to 50 matching tests

    console.log("Query result:", { data, error });

    if (error) {
      console.error("Supabase error:", error);
      return null;
    }

    if (!data || data.length === 0) {
      console.warn("No tests found matching filters");
      return null;
    }

    // Return a random test from the results
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex] as IELTSPaper;

  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
}