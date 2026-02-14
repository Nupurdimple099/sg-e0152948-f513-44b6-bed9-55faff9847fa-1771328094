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
import { fetchReadingTest, type ReadingTest, type ReadingPassage, type ReadingQuestion } from "@/services/ieltsPapersService";

export default function ReadingPractice() {
  const router = useRouter();
  const { testId } = router.query;

  // State management
  const [test, setTest] = useState<ReadingTest | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes
  const [currentPassage, setCurrentPassage] = useState(0);

  // Load test on mount
  useEffect(() => {
    if (!testId || typeof testId !== "string") {
      console.error("Invalid testId:", testId);
      setError("No test ID provided");
      setIsLoading(false);
      return;
    }

    loadTest(testId);
  }, [testId]);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted || !test) return;

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
  }, [test, isSubmitted]);

  const loadTest = async (id: string) => {
    console.log("=== LOADING READING TEST ===");
    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await fetchReadingTest(id);

    if (fetchError) {
      console.error("Failed to load test:", fetchError);
      setError(fetchError);
      setIsLoading(false);
      return;
    }

    if (!data) {
      setError("Test not found");
      setIsLoading(false);
      return;
    }

    console.log("Test loaded successfully:", data);
    setTest(data);
    setTimeRemaining(data.timeLimit || 3600);
    setIsLoading(false);
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    if (!test) return;

    let correctCount = 0;
    test.questions.forEach((question) => {
      const userAnswer = userAnswers[question.id];
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
    if (!test) return [];
    return test.questions.filter(
      (q) => q.questionNumber >= passage.questionRange.start && 
             q.questionNumber <= passage.questionRange.end
    );
  };

  const renderQuestion = (question: ReadingQuestion) => {
    const userAnswer = userAnswers[question.id];
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
  if (isLoading) {
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
  if (error || !test) {
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
                <li>• Test ID: {testId || "Not provided"}</li>
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
    const percentage = Math.round((score / test.totalQuestions) * 100);
    const bandScore = percentage >= 90 ? 9 : percentage >= 80 ? 8 : percentage >= 70 ? 7 : percentage >= 60 ? 6 : percentage >= 50 ? 5 : 4;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <SEO title={`Results - ${test.testTitle} - IELTS Practice`} />
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Test Results</CardTitle>
              <CardDescription>{test.testTitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Score</p>
                    <p className="text-3xl font-bold text-primary">{score}/{test.totalQuestions}</p>
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
              {test.passages.map((passage, idx) => (
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
  const currentPassageData = test.passages[currentPassage];
  const currentQuestions = currentPassageData ? getPassageQuestions(currentPassageData) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <SEO title={`${test.testTitle} - IELTS Reading Practice`} />
      
      {/* Header with Timer */}
      <div className="max-w-7xl mx-auto mb-6">
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-xl font-bold">{test.testTitle}</h1>
              <p className="text-sm text-muted-foreground">
                {test.examType} • {test.difficulty} • {test.totalQuestions} questions
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
          {test.passages.map((passage, idx) => (
            <Button
              key={passage.id}
              variant={currentPassage === idx ? "default" : "outline"}
              onClick={() => setCurrentPassage(idx)}
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
                <CardTitle>Passage {currentPassage + 1}</CardTitle>
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
                <CardDescription>Answer the questions based on Passage {currentPassage + 1}</CardDescription>
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
                {Object.keys(userAnswers).length}/{test.totalQuestions} answered
              </span>
            </div>
            <Progress 
              value={(Object.keys(userAnswers).length / test.totalQuestions) * 100} 
              className="h-2"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}