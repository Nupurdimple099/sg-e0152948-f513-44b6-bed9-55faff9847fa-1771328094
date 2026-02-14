import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Clock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface WritingTest {
  id: string;
  testTitle: string;
  examType: string;
  difficulty: string;
  imageUrl: string | null;
  promptText: string | null;
  task1Question: string;
  task2Question: string;
  modelAnswer: string;
  timeLimit: number;
}

export default function WritingPractice() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [testData, setTestData] = useState<WritingTest | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(1200); // 20 minutes = 1200 seconds
  const [wordCount, setWordCount] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  // Fetch test data on component mount
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Extract test ID from URL query parameter
        const testId = router.query.id as string;

        // Validation: If no ID, redirect back to Dashboard
        if (!testId) {
          toast({
            title: "No test selected",
            description: "Please select a test first.",
            variant: "destructive",
          });
          router.push("/");
          return;
        }

        console.log("=== WRITING TEST DEBUG ===");
        console.log("Test ID from URL:", testId);

        // Fetch test from Supabase using test_id
        const { data: testPaper, error: fetchError } = await supabase
          .from("ielts_papers")
          .select("*")
          .eq("test_id", testId)
          .eq("category", "writing")
          .single();

        if (fetchError) {
          console.error("Supabase fetch error:", fetchError);
          setError(`Failed to load test: ${fetchError.message}`);
          return;
        }

        if (!testPaper) {
          setError("Test not found. Please try selecting another test.");
          return;
        }

        console.log("Test paper loaded:", testPaper.test_title);
        console.log("Exam type:", testPaper.exam_type);
        console.log("Has image URL:", !!testPaper.image_url);
        console.log("Has prompt text:", !!testPaper.prompt_text);

        // Transform test data
        const contentJson = testPaper.content_json as any;
        
        const transformedTest: WritingTest = {
          id: testPaper.test_id,
          testTitle: testPaper.test_title,
          examType: testPaper.exam_type,
          difficulty: testPaper.difficulty,
          imageUrl: testPaper.image_url,
          promptText: testPaper.prompt_text,
          task1Question: contentJson?.task1?.question || "Write about the given chart/prompt.",
          task2Question: contentJson?.task2?.question || "Write an essay on the given topic.",
          modelAnswer: contentJson?.task1?.modelAnswer || "",
          timeLimit: 1200, // 20 minutes for Task 1
        };

        setTestData(transformedTest);
        setTimeRemaining(transformedTest.timeLimit);
        setIsLoading(false);

      } catch (error) {
        console.error("Unexpected error:", error);
        setError(`Unexpected error: ${error instanceof Error ? error.message : "Unknown error"}`);
        setIsLoading(false);
      }
    };

    if (router.isReady) {
      fetchTestData();
    }
  }, [router.isReady, router.query.id, toast, router]);

  // Timer countdown
  useEffect(() => {
    if (isLoading || showResults || !testData) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, showResults, testData]);

  // Word count tracker
  useEffect(() => {
    const words = userAnswer.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [userAnswer]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAutoSubmit = () => {
    toast({
      title: "Time's up!",
      description: "Your answer has been automatically submitted.",
      variant: "default",
    });
    handleSubmit();
  };

  const handleSubmit = async () => {
    if (wordCount < 150) {
      toast({
        title: "Word count too low",
        description: "Task 1 requires at least 150 words. You have written " + wordCount + " words.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simple scoring: Check word count and completeness
      let calculatedScore = 0;
      
      // Word count criteria (0-3 points)
      if (wordCount >= 150 && wordCount < 170) calculatedScore += 1;
      else if (wordCount >= 170 && wordCount < 200) calculatedScore += 2;
      else if (wordCount >= 200) calculatedScore += 3;

      // Completeness criteria (0-3 points)
      if (userAnswer.length > 100) calculatedScore += 1;
      if (userAnswer.length > 300) calculatedScore += 1;
      if (userAnswer.length > 500) calculatedScore += 1;

      // Length bonus (0-3 points)
      if (userAnswer.length > 700) calculatedScore += 1;
      if (userAnswer.length > 900) calculatedScore += 1;
      if (userAnswer.length > 1100) calculatedScore += 1;

      setScore(calculatedScore);
      setShowResults(true);

      toast({
        title: "Test submitted!",
        description: "Your writing has been evaluated.",
      });

    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Submission failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBandScore = (score: number): string => {
    if (score >= 8) return "8.0-9.0";
    if (score >= 7) return "7.0-7.5";
    if (score >= 6) return "6.5-7.0";
    if (score >= 5) return "6.0-6.5";
    if (score >= 4) return "5.5-6.0";
    if (score >= 3) return "5.0-5.5";
    return "4.0-5.0";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Loading Writing Task 1...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Test</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">
                  <strong>Debug Information:</strong>
                </p>
                <p className="text-xs text-red-700 dark:text-red-300 mt-2 font-mono">
                  {error}
                </p>
              </div>
              <Button onClick={() => router.push("/")} className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Results view
  if (showResults && testData && score !== null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Test Complete!</CardTitle>
                  <CardDescription>{testData.testTitle}</CardDescription>
                </div>
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-600">{score}/9</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Word Count</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-600">{wordCount}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {wordCount >= 150 ? "✓ Meets requirement" : "✗ Below 150 words"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Estimated Band Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-purple-600">{getBandScore(score)}</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-blue-50 dark:bg-blue-900/20">
                <CardHeader>
                  <CardTitle className="text-lg">Your Answer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg max-h-64 overflow-y-auto">
                    <p className="text-sm whitespace-pre-wrap">{userAnswer}</p>
                  </div>
                </CardContent>
              </Card>

              {testData.modelAnswer && (
                <Card className="bg-green-50 dark:bg-green-900/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Model Answer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg max-h-64 overflow-y-auto">
                      <p className="text-sm whitespace-pre-wrap">{testData.modelAnswer}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-4">
                <Button onClick={() => router.push("/")} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
                <Button onClick={() => router.reload()} variant="outline" className="flex-1">
                  Try Another Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main test view
  if (!testData) return null;

  const isAcademic = testData.examType === "academic";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">{testData.testTitle}</CardTitle>
                <CardDescription className="mt-2">
                  <Badge variant="outline" className="mr-2">
                    {testData.examType === "academic" ? "Academic" : "General Training"}
                  </Badge>
                  <Badge variant="outline" className="mr-2">
                    Task 1
                  </Badge>
                  <Badge variant="outline">
                    {testData.difficulty.charAt(0).toUpperCase() + testData.difficulty.slice(1)}
                  </Badge>
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <span className="text-2xl font-bold text-blue-600">{formatTime(timeRemaining)}</span>
                </div>
                <Button onClick={() => router.push("/")} variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Time Progress</span>
                <span className="text-sm text-gray-600">
                  {Math.round((1 - timeRemaining / 1200) * 100)}%
                </span>
              </div>
              <Progress value={(1 - timeRemaining / 1200) * 100} className="h-2" />
            </div>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Side: Question and Image/Prompt */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Task 1 Question</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Question Text */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm font-medium">{testData.task1Question}</p>
              </div>

              {/* Academic: Display Chart Image */}
              {isAcademic && testData.imageUrl && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Study the chart below:
                  </p>
                  <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white">
                    <img
                      src={testData.imageUrl}
                      alt="IELTS Task 1 Chart"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              )}

              {/* General: Display Letter Prompt */}
              {!isAcademic && testData.promptText && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Letter Situation:
                  </p>
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border-l-4 border-amber-500">
                    <p className="text-sm whitespace-pre-line">{testData.promptText}</p>
                  </div>
                </div>
              )}

              {/* Requirements */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Requirements:
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                  <li>Write at least <strong>150 words</strong></li>
                  <li>Complete the task in <strong>20 minutes</strong></li>
                  {isAcademic ? (
                    <>
                      <li>Summarize the key features of the chart</li>
                      <li>Make relevant comparisons where appropriate</li>
                    </>
                  ) : (
                    <>
                      <li>Address all three bullet points</li>
                      <li>Use an appropriate letter format</li>
                    </>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Right Side: Writing Area */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Answer</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={wordCount >= 150 ? "default" : "destructive"}>
                    {wordCount} words
                  </Badge>
                  {wordCount >= 150 && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                </div>
              </div>
              <CardDescription>
                {wordCount < 150
                  ? `You need ${150 - wordCount} more words to meet the minimum requirement.`
                  : "You have met the minimum word count requirement."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={
                  isAcademic
                    ? "Begin your response here. Describe the main features of the chart and make comparisons where relevant..."
                    : "Begin your letter here. Remember to use an appropriate greeting and closing..."
                }
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="min-h-[500px] resize-none font-mono text-sm"
              />

              <div className="flex gap-4">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || wordCount < 150}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Submit Test
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Your test will be automatically submitted when the timer reaches zero.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}