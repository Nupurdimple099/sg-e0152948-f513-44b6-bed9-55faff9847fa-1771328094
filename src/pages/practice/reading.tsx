import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { savePracticeAttempt } from "@/services/practiceHistoryService";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: number;
  type: "multiple_choice" | "true_false_not_given" | "matching_headings" | "sentence_completion" | "matching_information";
  question: string;
  options?: string[];
  correctAnswer: string;
  passage?: number;
}

interface Passage {
  title: string;
  content: string;
  wordCount: number;
}

interface ReadingTest {
  test_id: string;
  test_title: string;
  exam_type: string;
  difficulty: string;
  passages: Passage[];
  questions: Question[];
  timeLimit: number;
}

export default function ReadingPractice() {
  const router = useRouter();
  const { testId } = router.query;
  const { toast } = useToast();
  
  const [test, setTest] = useState<ReadingTest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // Test state
  const [hasStarted, setHasStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(3600);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Simplified auth check - no network calls on load
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load test data immediately when testId is available
  useEffect(() => {
    if (!router.isReady) return;
    if (!testId) {
      console.log("No testId provided");
      setIsLoading(false);
      return;
    }
    loadTest();
  }, [router.isReady, testId]);

  // Timer countdown
  useEffect(() => {
    if (hasStarted && !isSubmitted && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [hasStarted, isSubmitted, timeRemaining]);

  const loadTest = async () => {
    console.log("=== LOAD TEST DEBUG ===");
    console.log("1. router.query:", router.query);
    console.log("2. testId value:", testId);
    
    setIsLoading(true);
    try {
      // Handle testId being array or undefined
      const currentTestId = Array.isArray(testId) ? testId[0] : testId;
      
      console.log("3. currentTestId after processing:", currentTestId);
      
      if (!currentTestId) {
        console.log("4. ERROR: No currentTestId found");
        toast({
          title: "Error",
          description: "No test ID provided. Please select a test from the dashboard.",
          variant: "destructive",
        });
        router.push("/");
        setIsLoading(false);
        return;
      }

      console.log("5. Querying Supabase with test_id:", currentTestId);

      const { data, error } = await supabase
        .from("ielts_papers")
        .select("*")
        .eq("test_id", currentTestId)
        .eq("category", "reading")
        .single();

      console.log("6. Supabase query result:", { data, error });

      if (error) {
        console.error("7. Supabase error details:", error);
        throw error;
      }

      if (!data) {
        console.log("8. ERROR: No data returned from query");
        throw new Error("Test not found in database");
      }

      if (!data.content_json) {
        console.log("9. ERROR: content_json is null/undefined");
        throw new Error("Test data is incomplete");
      }

      console.log("10. content_json structure:", data.content_json);

      // Type assertion for content_json
      const content = data.content_json as any;
      
      console.log("11. Parsed content:", {
        test_title: content.test_title,
        passages_count: content.passages?.length,
        questions_count: content.questions?.length,
        timeLimit: content.timeLimit
      });

      if (!content.passages || !Array.isArray(content.passages)) {
        console.log("12. ERROR: passages missing or not an array");
        throw new Error("Test passages are missing");
      }

      if (!content.questions || !Array.isArray(content.questions)) {
        console.log("13. ERROR: questions missing or not an array");
        throw new Error("Test questions are missing");
      }

      const testData: ReadingTest = {
        test_id: data.test_id,
        test_title: content.test_title || "IELTS Reading Test",
        exam_type: data.exam_type,
        difficulty: data.difficulty,
        passages: content.passages || [],
        questions: content.questions || [],
        timeLimit: content.timeLimit || 3600
      };
      
      console.log("14. Final testData:", testData);
      console.log("15. Setting test state...");
      
      setTest(testData);
      setTimeRemaining(testData.timeLimit);
      
      console.log("16. Test loaded successfully!");
    } catch (error: any) {
      console.error("17. ERROR in loadTest:", error);
      console.error("18. Error message:", error.message);
      console.error("19. Error details:", error);
      
      toast({
        title: "Error Loading Test",
        description: error.message || "Failed to load test. Please try again.",
        variant: "destructive",
      });
      
      // Don't redirect immediately - let user see the error
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } finally {
      console.log("20. Setting isLoading to false");
      setIsLoading(false);
    }
  };

  const handleStartTest = () => {
    setHasStarted(true);
    toast({
      title: "Test Started",
      description: "Good luck! Remember, you have 60 minutes.",
      duration: 3000,
    });
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setIsSubmitted(true);

    // Calculate score
    let correctCount = 0;
    test?.questions.forEach(q => {
      if (userAnswers[q.id]?.toLowerCase() === q.correctAnswer.toLowerCase()) {
        correctCount++;
      }
    });

    const totalQuestions = test?.questions.length || 40;
    const percentage = (correctCount / totalQuestions) * 100;
    
    // Convert to band score (simplified mapping)
    let bandScore = 0;
    if (percentage >= 90) bandScore = 9.0;
    else if (percentage >= 87.5) bandScore = 8.5;
    else if (percentage >= 82.5) bandScore = 8.0;
    else if (percentage >= 75) bandScore = 7.5;
    else if (percentage >= 67.5) bandScore = 7.0;
    else if (percentage >= 60) bandScore = 6.5;
    else if (percentage >= 52.5) bandScore = 6.0;
    else if (percentage >= 45) bandScore = 5.5;
    else if (percentage >= 37.5) bandScore = 5.0;
    else if (percentage >= 30) bandScore = 4.5;
    else bandScore = 4.0;

    setScore(bandScore);

    // Save to history
    const timeTaken = test?.timeLimit ? test.timeLimit - timeRemaining : 0;
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;

    try {
      if (user) {
        await savePracticeAttempt({
          module_type: "reading",
          test_type: test?.exam_type || "academic",
          topic: test?.test_title || "Reading Test",
          difficulty: test?.difficulty || "medium",
          band_score: bandScore,
          is_evaluated: true,
          duration: `${minutes}m ${seconds}s`,
          test_data: {
            test_id: test?.test_id,
            correct: correctCount,
            total: totalQuestions,
            percentage: percentage.toFixed(1)
          }
        });
      } else {
        // Save to localStorage for non-logged-in users
        const history = JSON.parse(localStorage.getItem("ielts_practice_history") || "[]");
        history.unshift({
          id: Date.now().toString(),
          module_type: "reading",
          test_type: test?.exam_type || "academic",
          topic: test?.test_title || "Reading Test",
          difficulty: test?.difficulty || "medium",
          band_score: bandScore,
          is_evaluated: true,
          duration: `${minutes}m ${seconds}s`,
          completed_at: new Date().toISOString(),
          test_data: {
            test_id: test?.test_id,
            correct: correctCount,
            total: totalQuestions,
            percentage: percentage.toFixed(1)
          }
        });
        localStorage.setItem("ielts_practice_history", JSON.stringify(history));
      }

      toast({
        title: "Test Submitted",
        description: `You scored Band ${bandScore.toFixed(1)} (${correctCount}/${totalQuestions} correct)`,
        duration: 5000,
      });
    } catch (error) {
      console.error("Error saving test results:", error);
    }

    // Scroll to results
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "multiple_choice": return "Multiple Choice";
      case "true_false_not_given": return "True / False / Not Given";
      case "matching_headings": return "Matching Headings";
      case "sentence_completion": return "Sentence Completion";
      case "matching_information": return "Matching Information";
      default: return type;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <SEO title="Loading Test - IELTS Reading" description="Loading your IELTS Reading test" />
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-lg text-slate-600">Loading your test...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <SEO title="Test Not Found - IELTS Reading" description="Test not found" />
        <Card className="p-8 max-w-md">
          <div className="text-center space-y-4">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Test Not Found</h2>
            <p className="text-gray-600">The requested test could not be loaded.</p>
            <Link href="/">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <>
        <SEO title={`${test.test_title} - IELTS Reading`} description="IELTS Reading Practice Test" />
        
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </header>

          <div className="max-w-4xl mx-auto px-4 py-12">
            <Card className="p-8">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{test.test_title}</h1>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
                      {test.exam_type}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium capitalize">
                      {test.difficulty}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {test.questions.length} Questions
                    </span>
                  </div>
                </div>

                <div className="p-6 bg-amber-50 border-2 border-amber-200 rounded-lg">
                  <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Test Instructions
                  </h3>
                  <ul className="space-y-2 text-sm text-amber-800">
                    <li>• You have <strong>60 minutes</strong> to complete this test</li>
                    <li>• There are <strong>{test.passages.length} passages</strong> with <strong>{test.questions.length} questions</strong> in total</li>
                    <li>• Read each passage carefully before answering the questions</li>
                    <li>• You can scroll through all passages and questions</li>
                    <li>• The timer will start when you click "Start Test"</li>
                    <li>• Your test will auto-submit when time runs out</li>
                    <li>• Make sure to answer all questions before submitting</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {test.passages.map((passage, index) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <h4 className="font-semibold text-slate-900 mb-2">Passage {index + 1}</h4>
                      <p className="text-sm text-slate-600">{passage.title}</p>
                      <p className="text-xs text-slate-500 mt-2">~{passage.wordCount} words</p>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={handleStartTest}
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg py-6"
                >
                  <Clock className="w-5 h-5 mr-2" />
                  Start Test (60 Minutes)
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title={`${test.test_title} - In Progress`} description="IELTS Reading Practice Test" />
      
      <div className="min-h-screen bg-slate-50">
        {/* Sticky Timer Header */}
        <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{test.test_title}</h2>
                <p className="text-sm text-slate-600">
                  {Object.keys(userAnswers).length} / {test.questions.length} answered
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  timeRemaining <= 300 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                }`}>
                  <Clock className="w-5 h-5" />
                  <span className="text-xl font-bold font-mono">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                
                {!isSubmitted && (
                  <Button 
                    onClick={handleSubmit}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Submit Test
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Results Banner (if submitted) */}
        {isSubmitted && score !== null && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-8">
            <div className="container mx-auto px-4 text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Test Completed!</h2>
              <p className="text-xl mb-4">Your Band Score: <strong>{score.toFixed(1)}</strong></p>
              <div className="flex justify-center gap-4">
                <Link href="/history">
                  <Button variant="secondary">View History</Button>
                </Link>
                <Link href="/">
                  <Button variant="secondary">Back to Dashboard</Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Test Content - Vertical Scroll Layout */}
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {test.passages.map((passage, passageIndex) => {
            // Get questions for this passage
            const passageQuestions = test.questions.filter(q => q.passage === passageIndex + 1);
            const startQuestionNum = passageIndex * 13 + 1;

            return (
              <div key={passageIndex} className="mb-12">
                {/* Passage Section */}
                <Card className="mb-8 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4">
                    <h2 className="text-2xl font-bold">Passage {passageIndex + 1}</h2>
                    <p className="text-blue-100">{passage.title}</p>
                  </div>
                  
                  <div className="p-8">
                    <div className="prose prose-slate max-w-none">
                      {passage.content.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4 text-slate-700 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-slate-200 text-sm text-slate-600">
                      Word count: {passage.wordCount} words
                    </div>
                  </div>
                </Card>

                {/* Questions Section for this Passage */}
                <Card className="p-8">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Questions {startQuestionNum} - {startQuestionNum + passageQuestions.length - 1}
                    </h3>
                    <p className="text-slate-600">Answer the questions below based on Passage {passageIndex + 1}</p>
                  </div>

                  <div className="space-y-8">
                    {passageQuestions.map((question, qIndex) => {
                      const questionNum = startQuestionNum + qIndex;
                      const isCorrect = isSubmitted && userAnswers[question.id]?.toLowerCase() === question.correctAnswer.toLowerCase();
                      const isWrong = isSubmitted && userAnswers[question.id] && userAnswers[question.id]?.toLowerCase() !== question.correctAnswer.toLowerCase();

                      return (
                        <div 
                          key={question.id}
                          className={`p-6 rounded-lg border-2 ${
                            isCorrect ? "bg-green-50 border-green-300" :
                            isWrong ? "bg-red-50 border-red-300" :
                            "bg-white border-slate-200"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              isCorrect ? "bg-green-600 text-white" :
                              isWrong ? "bg-red-600 text-white" :
                              "bg-blue-600 text-white"
                            }`}>
                              {questionNum}
                            </div>
                            
                            <div className="flex-grow">
                              <div className="mb-4">
                                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium mb-3">
                                  {getQuestionTypeLabel(question.type)}
                                </span>
                                <p className="text-slate-900 font-medium">{question.question}</p>
                              </div>

                              {question.type === "multiple_choice" && question.options ? (
                                <RadioGroup
                                  value={userAnswers[question.id] || ""}
                                  onValueChange={(value) => handleAnswerChange(question.id, value)}
                                  disabled={isSubmitted}
                                >
                                  <div className="space-y-3">
                                    {question.options.map((option, idx) => (
                                      <div key={idx} className="flex items-center space-x-3">
                                        <RadioGroupItem value={option} id={`q${question.id}-${idx}`} />
                                        <Label 
                                          htmlFor={`q${question.id}-${idx}`}
                                          className="cursor-pointer flex-grow"
                                        >
                                          {option}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </RadioGroup>
                              ) : question.type === "true_false_not_given" ? (
                                <RadioGroup
                                  value={userAnswers[question.id] || ""}
                                  onValueChange={(value) => handleAnswerChange(question.id, value)}
                                  disabled={isSubmitted}
                                >
                                  <div className="space-y-3">
                                    {["TRUE", "FALSE", "NOT GIVEN"].map((option) => (
                                      <div key={option} className="flex items-center space-x-3">
                                        <RadioGroupItem value={option} id={`q${question.id}-${option}`} />
                                        <Label 
                                          htmlFor={`q${question.id}-${option}`}
                                          className="cursor-pointer flex-grow"
                                        >
                                          {option}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </RadioGroup>
                              ) : (
                                <Input
                                  value={userAnswers[question.id] || ""}
                                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                  placeholder="Type your answer here..."
                                  disabled={isSubmitted}
                                  className="max-w-md"
                                />
                              )}

                              {/* Show correct answer after submission */}
                              {isSubmitted && (
                                <div className="mt-4 pt-4 border-t border-slate-200">
                                  <div className="flex items-center gap-2 text-sm">
                                    {isCorrect ? (
                                      <>
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span className="font-medium text-green-700">Correct!</span>
                                      </>
                                    ) : (
                                      <>
                                        <AlertCircle className="w-4 h-4 text-red-600" />
                                        <span className="font-medium text-red-700">
                                          Correct answer: <strong>{question.correctAnswer}</strong>
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            );
          })}

          {/* Submit Button at Bottom */}
          {!isSubmitted && (
            <div className="sticky bottom-6 z-40">
              <Card className="p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">
                      Progress: {Object.keys(userAnswers).length} / {test.questions.length} questions answered
                    </p>
                  </div>
                  <Button 
                    onClick={handleSubmit}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Submit Test
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
}