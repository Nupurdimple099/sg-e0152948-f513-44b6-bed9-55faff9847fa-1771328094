import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ListeningTest = Database["public"]["Tables"]["listening_tests"]["Row"];

export interface ListeningQuestion {
  question_number: number;
  question_text: string;
  question_type: "gap_fill" | "multiple_choice" | "matching" | "true_false_not_given";
  correct_answer: string;
  options?: string[];
  points: number;
}

export interface ListeningSection {
  section_number: number;
  title: string;
  instructions: string;
  questions: ListeningQuestion[];
}

export interface ListeningTestData {
  sections: ListeningSection[];
}

export interface UserAnswer {
  question_number: number;
  user_answer: string;
}

export interface EvaluationResult {
  question_number: number;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  points_earned: number;
}

/**
 * Fetch all listening tests
 */
export async function getAllListeningTests(): Promise<ListeningTest[]> {
  const { data, error } = await supabase
    .from("listening_tests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching listening tests:", error);
    throw error;
  }

  return data || [];
}

/**
 * Fetch a specific listening test by ID
 */
export async function getListeningTestById(testId: string): Promise<ListeningTest | null> {
  const { data, error } = await supabase
    .from("listening_tests")
    .select("*")
    .eq("id", testId)
    .single();

  if (error) {
    console.error("Error fetching listening test:", error);
    return null;
  }

  return data;
}

/**
 * Fetch listening tests by difficulty
 */
export async function getListeningTestsByDifficulty(difficulty: string): Promise<ListeningTest[]> {
  const { data, error } = await supabase
    .from("listening_tests")
    .select("*")
    .eq("difficulty", difficulty)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching listening tests by difficulty:", error);
    throw error;
  }

  return data || [];
}

/**
 * Evaluate user answers and calculate score
 */
export function evaluateListeningTest(
  questionsData: ListeningTestData,
  userAnswers: UserAnswer[]
): {
  results: EvaluationResult[];
  totalPoints: number;
  earnedPoints: number;
  bandScore: number;
} {
  const results: EvaluationResult[] = [];
  let totalPoints = 0;
  let earnedPoints = 0;

  // Create a map of user answers for quick lookup
  const answerMap = new Map(
    userAnswers.map(ua => [ua.question_number, ua.user_answer])
  );

  // Iterate through all questions
  questionsData.sections.forEach(section => {
    section.questions.forEach(question => {
      const userAnswer = answerMap.get(question.question_number) || "";
      const correctAnswer = question.correct_answer;
      
      // Normalize answers for comparison (trim, lowercase)
      const normalizedUserAnswer = userAnswer.trim().toLowerCase();
      const normalizedCorrectAnswer = correctAnswer.trim().toLowerCase();
      
      const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
      const pointsEarned = isCorrect ? question.points : 0;

      totalPoints += question.points;
      earnedPoints += pointsEarned;

      results.push({
        question_number: question.question_number,
        user_answer: userAnswer,
        correct_answer: correctAnswer,
        is_correct: isCorrect,
        points_earned: pointsEarned
      });
    });
  });

  // Calculate band score based on percentage (IELTS-like scoring)
  const percentage = (earnedPoints / totalPoints) * 100;
  let bandScore: number;

  if (percentage >= 90) bandScore = 9.0;
  else if (percentage >= 82) bandScore = 8.5;
  else if (percentage >= 75) bandScore = 8.0;
  else if (percentage >= 68) bandScore = 7.5;
  else if (percentage >= 60) bandScore = 7.0;
  else if (percentage >= 52) bandScore = 6.5;
  else if (percentage >= 45) bandScore = 6.0;
  else if (percentage >= 38) bandScore = 5.5;
  else if (percentage >= 30) bandScore = 5.0;
  else if (percentage >= 23) bandScore = 4.5;
  else if (percentage >= 16) bandScore = 4.0;
  else bandScore = 3.5;

  return {
    results,
    totalPoints,
    earnedPoints,
    bandScore
  };
}

/**
 * Save listening test results to practice history
 */
export async function saveListeningTestResult(
  userId: string,
  testTitle: string,
  difficulty: string,
  evaluationResults: {
    results: EvaluationResult[];
    totalPoints: number;
    earnedPoints: number;
    bandScore: number;
  },
  userAnswers: UserAnswer[],
  testData: ListeningTestData
): Promise<void> {
  // Prepare evaluation data object
  const evaluationData = {
    results: evaluationResults.results,
    total_points: evaluationResults.totalPoints,
    earned_points: evaluationResults.earnedPoints,
    band_score: evaluationResults.bandScore
  };

  const { error } = await supabase
    .from("practice_history")
    .insert({
      user_id: userId,
      module_type: "listening",
      test_type: "Academic",
      topic: testTitle,
      difficulty: difficulty,
      band_score: evaluationResults.bandScore,
      is_evaluated: true,
      user_answer: JSON.stringify(userAnswers),
      evaluation_data: evaluationData as any,
      test_data: testData as any
    });

  if (error) {
    console.error("Error saving listening test result:", error);
    throw error;
  }
}