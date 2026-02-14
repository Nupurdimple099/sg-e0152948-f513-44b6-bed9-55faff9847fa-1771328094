import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type IELTSPaper = Database["public"]["Tables"]["ielts_papers"]["Insert"];

export interface LocalTestData {
  test_title: string;
  category: "reading" | "writing" | "listening" | "speaking";
  exam_type: "academic" | "general";
  difficulty: "easy" | "medium" | "hard";
  content_json: Record<string, unknown>;
  audio_url?: string;
  image_url?: string;
  prompt_text?: string;
}

/**
 * Sync a single test to Supabase
 */
export async function syncTestToSupabase(testData: LocalTestData): Promise<{ success: boolean; error?: string; test_id?: string }> {
  try {
    const paperData: IELTSPaper = {
      test_title: testData.test_title,
      category: testData.category,
      exam_type: testData.exam_type,
      difficulty: testData.difficulty,
      content_json: testData.content_json,
      audio_url: testData.audio_url || null,
      image_url: testData.image_url || null,
      prompt_text: testData.prompt_text || null,
    };

    const { data, error } = await supabase
      .from("ielts_papers")
      .insert(paperData)
      .select("test_id")
      .single();

    if (error) {
      console.error("Error syncing test:", error);
      return { success: false, error: error.message };
    }

    return { success: true, test_id: data?.test_id };
  } catch (error) {
    console.error("Exception syncing test:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Sync multiple tests to Supabase with progress tracking
 */
export async function syncMultipleTests(
  tests: LocalTestData[],
  onProgress?: (current: number, total: number, testTitle: string) => void
): Promise<{ 
  total: number; 
  successful: number; 
  failed: number; 
  errors: Array<{ test_title: string; error: string }> 
}> {
  const results = {
    total: tests.length,
    successful: 0,
    failed: 0,
    errors: [] as Array<{ test_title: string; error: string }>,
  };

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    
    if (onProgress) {
      onProgress(i + 1, tests.length, test.test_title);
    }

    const result = await syncTestToSupabase(test);

    if (result.success) {
      results.successful++;
    } else {
      results.failed++;
      results.errors.push({
        test_title: test.test_title,
        error: result.error || "Unknown error",
      });
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
}

/**
 * Upsert a test (insert or update if exists based on test_title)
 */
export async function upsertTest(testData: LocalTestData): Promise<{ success: boolean; error?: string; test_id?: string }> {
  try {
    // First, check if a test with this title already exists
    const { data: existing, error: searchError } = await supabase
      .from("ielts_papers")
      .select("test_id")
      .eq("test_title", testData.test_title)
      .eq("category", testData.category)
      .maybeSingle();

    if (searchError) {
      console.error("Error searching for existing test:", searchError);
      return { success: false, error: searchError.message };
    }

    if (existing) {
      // Update existing test
      const { data, error } = await supabase
        .from("ielts_papers")
        .update({
          exam_type: testData.exam_type,
          difficulty: testData.difficulty,
          content_json: testData.content_json,
          audio_url: testData.audio_url || null,
          image_url: testData.image_url || null,
          prompt_text: testData.prompt_text || null,
          updated_at: new Date().toISOString(),
        })
        .eq("test_id", existing.test_id)
        .select("test_id")
        .single();

      if (error) {
        console.error("Error updating test:", error);
        return { success: false, error: error.message };
      }

      return { success: true, test_id: data?.test_id };
    } else {
      // Insert new test
      return await syncTestToSupabase(testData);
    }
  } catch (error) {
    console.error("Exception upserting test:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Upsert multiple tests with progress tracking
 */
export async function upsertMultipleTests(
  tests: LocalTestData[],
  onProgress?: (current: number, total: number, testTitle: string) => void
): Promise<{ 
  total: number; 
  successful: number; 
  failed: number; 
  errors: Array<{ test_title: string; error: string }> 
}> {
  const results = {
    total: tests.length,
    successful: 0,
    failed: 0,
    errors: [] as Array<{ test_title: string; error: string }>,
  };

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    
    if (onProgress) {
      onProgress(i + 1, tests.length, test.test_title);
    }

    const result = await upsertTest(test);

    if (result.success) {
      results.successful++;
    } else {
      results.failed++;
      results.errors.push({
        test_title: test.test_title,
        error: result.error || "Unknown error",
      });
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
}

/**
 * Fetch all tests from Supabase
 */
export async function fetchAllTests() {
  const { data, error } = await supabase
    .from("ielts_papers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tests:", error);
    return { success: false, error: error.message, data: null };
  }

  return { success: true, data, error: null };
}

/**
 * Delete a test from Supabase
 */
export async function deleteTest(testId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("ielts_papers")
      .delete()
      .eq("test_id", testId);

    if (error) {
      console.error("Error deleting test:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Exception deleting test:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}