import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ReadingQuestion {
  id: string;
  questionNumber: number;
  type: string;
  questionText: string;
  options?: string[];
  correctAnswer: string;
  passageId?: string;
}

interface ReadingPassage {
  id: string | number;
  title: string;
  content: string;
  questionRange: { start: number; end: number };
  questions: ReadingQuestion[];
}

interface ReadingTest {
  id: string;
  testTitle: string;
  examType: string;
  difficulty: string;
  passages: ReadingPassage[];
  questions: ReadingQuestion[]; // Added flattened questions array
  timeLimit: number;
  totalQuestions: number;
}

export default function ReadingPractice() {
  const router = useRouter();
  const [testData, setTestData] = useState<ReadingTest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(3600);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Fetch test data on component mount
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Extract test ID from URL query parameter
        const testId = router.query.id as string;

        // Validation: If no ID provided, redirect back to dashboard
        if (!testId) {
          console.error("❌ No test ID provided in URL");
          toast({
            title: "No test selected",
            description: "Please select a test first.",
            variant: "destructive",
          });
          router.push("/");
          return;
        }

        console.log("🔍 Fetching reading test with ID:", testId);

        // Fetch the test from Supabase using the exact column name 'test_id'
        const { data: testPaper, error: fetchError } = await supabase
          .from("ielts_papers")
          .select("*")
          .eq("test_id", testId)
          .eq("category", "reading")
          .single();

        if (fetchError) {
          console.error("❌ Supabase fetch error:", fetchError);
          throw new Error(fetchError.message || "Failed to fetch test data");
        }

        if (!testPaper) {
          console.error("❌ No test found with ID:", testId);
          throw new Error("Test not found");
        }

        console.log("✅ Test fetched successfully:", testPaper.test_title);

        // Parse the content_json field
        const contentJson = testPaper.content_json as any;

        // Validate 3-passage structure
        if (!contentJson.passages || contentJson.passages.length !== 3) {
          throw new Error("Invalid test structure: Expected 3 passages");
        }

        if (!contentJson.questions || contentJson.questions.length !== 40) {
          throw new Error("Invalid test structure: Expected 40 questions");
        }

        // Transform to ReadingTest format
        const transformedTest: ReadingTest = {
          id: testPaper.test_id,
          testTitle: testPaper.test_title || "IELTS Reading Test",
          examType: testPaper.exam_type || "Academic",
          difficulty: testPaper.difficulty || "Medium",
          passages: contentJson.passages.map((p: any, index: number) => ({
            id: index + 1,
            title: p.title || `Passage ${index + 1}`,
            content: p.content || "",
            questionRange: p.questionRange || { start: index * 13 + 1, end: (index + 1) * 13 },
            questions: contentJson.questions.slice(
              index * 13,
              index === 2 ? 40 : (index + 1) * 13
            ),
          })),
          questions: contentJson.questions, // Populate the flattened questions array
          timeLimit: contentJson.timeLimit || 3600,
          totalQuestions: contentJson.totalQuestions || 40,
        };

        setTestData(transformedTest);
        setTimeRemaining(transformedTest.timeLimit);
      } catch (err: any) {
        console.error("❌ Error loading test:", err);
        const errorMessage = err.message || "Failed to load test. Please try again.";
        setError(errorMessage);
        toast({
          title: "Error loading test",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if router is ready
    if (router.isReady) {
      fetchTestData();
    }
  }, [router.isReady, router.query.id]);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted || !testData) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testData, isSubmitted]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    if (!testData) return;

    let correctCount = 0;
    testData.questions.forEach((question) => {
      const userAnswer = answers[question.id];
      if (userAnswer && userAnswer.toLowerCase() === question.correctAnswer.toLowerCase()) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setIsSubmitted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getPassageQuestions = (passage: ReadingPassage) => {
    if (!testData) return [];
    return testData.questions.filter(
      (q) => q.questionNumber >= passage.questionRange.start && 
             q.questionNumber <= passage.questionRange.end
    );
  };

  const renderQuestion = (question: ReadingQuestion) => {
    const userAnswer = answers[question.id];
    const isCorrect = userAnswer?.toLowerCase() === question.correctAnswer.toLowerCase();

    return (
      <div key={question.id} className="mb-6 p-4 border rounded-lg">
        <div className="flex items-start gap-3">
          <div className="font-bold text-primary min-w-[2rem]">
            {question.questionNumber}.
          </div>
          <div className="flex-1">
            <p className="font-medium mb-3">{question.questionText}</p>

            {question.type === "true-false-not-given" && (
              <RadioGroup
                value={userAnswer || ""}
                onValueChange={(value) => handleAnswerChange(question.id, value)}
                disabled={isSubmitted}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="TRUE" id={`${question.id}-true`} />
                  <Label htmlFor={`${question.id}-true`}>TRUE</Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="FALSE" id={`${question.id}-false`} />
                  <Label htmlFor={`${question.id}-false`}>FALSE</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="NOT GIVEN" id={`${question.id}-ng`} />
                  <Label htmlFor={`${question.id}-ng`}>NOT GIVEN</Label>
                </div>
              </RadioGroup>
            )}

            {question.type === "multiple-choice" && question.options && (
              <RadioGroup
                value={userAnswer || ""}
                onValueChange={(value) => handleAnswerChange(question.id, value)}
                disabled={isSubmitted}
              >
                {question.options.map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value={option} id={`${question.id}-${idx}`} />
                    <Label htmlFor={`${question.id}-${idx}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {question.type === "gap-fill" && (
              <Input
                type="text"
                placeholder="Type your answer here"
                value={userAnswer || ""}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                disabled={isSubmitted}
                className="max-w-md"
              />
            )}

            {isSubmitted && (
              <div className={`mt-3 p-2 rounded ${isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {isCorrect ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Correct!</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>Incorrect</span>
                    </div>
                    <p className="text-sm">Correct answer: <strong>{question.correctAnswer}</strong></p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <SEO title="Loading Reading Test - IELTS Practice" />
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Loading Reading Test...</p>
            <p className="text-sm text-muted-foreground mt-2">Please wait</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error || !testData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <SEO title="Error - IELTS Practice" />
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <CardTitle>Error Loading Test</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription className="text-base">
                {error || "Test not found or failed to load"}
              </AlertDescription>
            </Alert>

            <div className="bg-muted p-4 rounded-lg">
              <p className="font-medium mb-2">Debug Information:</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Test ID: {router.query.id || "Not provided"}</li>
                <li>• Category: Reading</li>
                <li>• Error: {error || "Unknown error"}</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => router.push("/")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
              <Button variant="outline" onClick={() => router.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Results view
  if (isSubmitted) {
    const percentage = Math.round((score / testData.totalQuestions) * 100);
    const bandScore = percentage >= 90 ? 9 : percentage >= 80 ? 8 : percentage >= 70 ? 7 : percentage >= 60 ? 6 : percentage >= 50 ? 5 : 4;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <SEO title={`Results - ${testData.testTitle} - IELTS Practice`} />
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Test Results</CardTitle>
              <CardDescription>{testData.testTitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Score</p>
                    <p className="text-3xl font-bold text-primary">{score}/{testData.totalQuestions}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Percentage</p>
                    <p className="text-3xl font-bold text-green-600">{percentage}%</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Est. Band Score</p>
                    <p className="text-3xl font-bold text-blue-600">{bandScore}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => router.push("/")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
                <Button variant="outline" onClick={() => router.reload()}>
                  Try Another Test
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Show all questions with answers */}
          <Card>
            <CardHeader>
              <CardTitle>Answer Review</CardTitle>
            </CardHeader>
            <CardContent>
              {testData.passages.map((passage, idx) => (
                <div key={passage.id} className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Passage {idx + 1}: {passage.title}</h3>
                  {getPassageQuestions(passage).map(renderQuestion)}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Test view - Cambridge 3-passage format
  const currentPassageData = testData.passages[currentPassageIndex];
  const currentQuestions = currentPassageData ? getPassageQuestions(currentPassageData) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <SEO title={`${testData.testTitle} - IELTS Reading Practice`} />
      
      {/* Header with Timer */}
      <div className="max-w-7xl mx-auto mb-6">
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-xl font-bold">{testData.testTitle}</h1>
              <p className="text-sm text-muted-foreground">
                {testData.examType} • {testData.difficulty} • {testData.totalQuestions} questions
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-lg font-mono font-bold">
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <Button onClick={handleSubmit}>Submit Test</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Passage Navigation */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex gap-2">
          {testData.passages.map((passage, idx) => (
            <Button
              key={passage.id}
              variant={currentPassageIndex === idx ? "default" : "outline"}
              onClick={() => setCurrentPassageIndex(idx)}
            >
              Passage {idx + 1}
            </Button>
          ))}
        </div>
      </div>

      {/* Content - Cambridge Format */}
      <div className="max-w-7xl mx-auto">
        {currentPassageData ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Passage (Left/Top) */}
            <Card className="lg:sticky lg:top-4 h-fit">
              <CardHeader>
                <CardTitle>Passage {currentPassageIndex + 1}</CardTitle>
                <CardDescription>{currentPassageData.title}</CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-justify leading-relaxed">
                  {currentPassageData.content}
                </div>
              </CardContent>
            </Card>

            {/* Questions (Right/Bottom) */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Questions {currentPassageData.questionRange.start}-{currentPassageData.questionRange.end}
                </CardTitle>
                <CardDescription>Answer the questions based on Passage {currentPassageIndex + 1}</CardDescription>
              </CardHeader>
              <CardContent>
                {currentQuestions.length > 0 ? (
                  currentQuestions.map(renderQuestion)
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Questions are loading... Please wait or try another passage.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-lg font-medium">Content Loading...</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Passage data is being prepared
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="max-w-7xl mx-auto mt-6">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium">
                {Object.keys(answers).length}/{testData.totalQuestions} answered
              </span>
            </div>
            <Progress 
              value={(Object.keys(answers).length / testData.totalQuestions) * 100} 
              className="h-2"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}