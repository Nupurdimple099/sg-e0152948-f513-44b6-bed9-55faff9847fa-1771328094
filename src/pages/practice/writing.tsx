import { SEO } from "@/components/SEO";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Target,
  ChevronDown,
  Maximize2,
  Minimize2,
  AlertCircle,
  History,
  Info
} from "lucide-react";
import { useState, useEffect } from "react";
import { AuthModal } from "@/components/AuthModal";
import { UserMenu } from "@/components/UserMenu";
import { supabase } from "@/integrations/supabase/client";

export default function WritingPractice() {
  const [selectedTask, setSelectedTask] = useState<"task1" | "task2">("task1");
  const [userAnswer, setUserAnswer] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [imageCollapsed, setImageCollapsed] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  
  // Auth state
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Check auth status
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Word count effect
  useEffect(() => {
    const words = userAnswer.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    
    // Auto-collapse image when user starts typing (only for Task 1)
    if (selectedTask === "task1" && userAnswer.length > 10 && !hasStartedTyping) {
      setHasStartedTyping(true);
      setImageCollapsed(true);
    }
  }, [userAnswer, selectedTask, hasStartedTyping]);

  // Reset states when switching tasks
  useEffect(() => {
    setUserAnswer("");
    setWordCount(0);
    setTimeElapsed(0);
    setIsTimerRunning(false);
    setShowFeedback(false);
    setImageCollapsed(false);
    setHasStartedTyping(false);
  }, [selectedTask]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartTimer = () => {
    setIsTimerRunning(true);
  };

  const handleSubmit = () => {
    setIsTimerRunning(false);
    setShowFeedback(true);
    // Scroll to feedback section
    setTimeout(() => {
      document.getElementById("feedback-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const toggleImageCollapse = () => {
    setImageCollapsed(!imageCollapsed);
  };

  const task1Prompt = {
    title: "Academic Task 1: Bar Chart Analysis",
    description: "The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011.",
    instructions: "Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    minWords: 150,
    timeLimit: 20
  };

  const task2Prompt = {
    title: "Task 2: Opinion Essay",
    description: "Some people believe that unpaid community service should be a compulsory part of high school programmes (for example working for a charity, improving the neighbourhood or teaching sports to younger children).",
    question: "To what extent do you agree or disagree?",
    instructions: "Give reasons for your answer and include any relevant examples from your own knowledge or experience.",
    minWords: 250,
    timeLimit: 40
  };

  const currentPrompt = selectedTask === "task1" ? task1Prompt : task2Prompt;
  const isTask1 = selectedTask === "task1";

  return (
    <>
      <SEO
        title="IELTS Writing Practice - Academic & General Training"
        description="Practice IELTS Writing Task 1 and Task 2 with detailed feedback and band score assessment"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Back to Home</span>
                  </Button>
                </Link>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    IELTS Writing Practice
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Academic Writing Test
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/history">
                  <Button variant="outline" size="sm">
                    <History className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">History</span>
                  </Button>
                </Link>
                {user ? (
                  <UserMenu onSignOut={() => setUser(null)} />
                ) : (
                  <Button onClick={() => setIsAuthModalOpen(true)} size="sm">
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-5xl">
          <Alert className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-900 dark:text-blue-100">
              <strong>Writing Module:</strong> Practice with authentic prompts and get instant feedback on your writing performance.
            </AlertDescription>
          </Alert>

          {/* Task Selection */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={selectedTask === "task1" ? "default" : "outline"}
              onClick={() => setSelectedTask("task1")}
              className="flex-1"
            >
              Task 1
            </Button>
            <Button
              variant={selectedTask === "task2" ? "default" : "outline"}
              onClick={() => setSelectedTask("task2")}
              className="flex-1"
            >
              Task 2
            </Button>
          </div>

          {/* Task Instructions */}
          <Card className="mb-6 px-4 sm:px-6">
            <CardHeader className="px-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-base sm:text-lg mb-2">{currentPrompt.title}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentPrompt.description}
                  </p>
                  {isTask1 === false && (
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-2">
                      {task2Prompt.question}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Badge variant="secondary" className="gap-1 whitespace-nowrap">
                    <BookOpen className="w-3 h-3" />
                    {currentPrompt.minWords}+ words
                  </Badge>
                  <Badge variant="secondary" className="gap-1 whitespace-nowrap">
                    <Clock className="w-3 h-3" />
                    {currentPrompt.timeLimit} min
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {currentPrompt.instructions}
              </p>

              {/* Collapsible Image for Task 1 */}
              {isTask1 && (
                <div className="relative">
                  {/* Collapsed State */}
                  {imageCollapsed && (
                    <div className="border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-950/20">
                      <button
                        onClick={toggleImageCollapse}
                        className="w-full flex items-center justify-between gap-3 hover:bg-blue-100 dark:hover:bg-blue-900/30 p-3 rounded-lg transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded bg-blue-200 dark:bg-blue-800 flex items-center justify-center flex-shrink-0">
                            <Maximize2 className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                              Chart Minimized
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                              Tap to expand and view the data visualization
                            </p>
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  )}

                  {/* Expanded State */}
                  {!imageCollapsed && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Reference Chart
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleImageCollapse}
                          className="gap-2 text-xs"
                        >
                          <Minimize2 className="w-3 h-3" />
                          Minimize
                        </Button>
                      </div>
                      <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img
                          src={task1Prompt.imageUrl}
                          alt="Chart for IELTS Writing Task 1"
                          className="w-full h-auto"
                        />
                      </div>
                      {hasStartedTyping && (
                        <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                          <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <AlertDescription className="text-xs text-blue-800 dark:text-blue-200">
                            <strong>Tip:</strong> Click "Minimize" above to give your writing area more space. You can always expand it again.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Writing Area */}
          <Card className="mb-6 px-4 sm:px-6">
            <CardHeader className="px-0">
              <CardTitle className="text-base sm:text-lg flex items-center justify-between">
                <span>Your Answer</span>
                <div className="flex items-center gap-2">
                  {!isTimerRunning && wordCount === 0 && (
                    <Button onClick={handleStartTimer} size="sm" variant="outline">
                      Start Timer
                    </Button>
                  )}
                  {wordCount < currentPrompt.minWords && (
                    <Badge variant="secondary" className="text-xs">
                      {currentPrompt.minWords - wordCount} words needed
                    </Badge>
                  )}
                  {wordCount >= currentPrompt.minWords && (
                    <Badge className="bg-green-500 text-xs">
                      ✓ Minimum met
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <Textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Start writing your answer here..."
                className="min-h-[400px] text-sm sm:text-base resize-none"
                onFocus={() => {
                  if (!isTimerRunning && wordCount === 0) {
                    handleStartTimer();
                  }
                }}
              />
              <div className="mt-4 flex justify-between items-center">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Word count: <strong>{wordCount}</strong> / {currentPrompt.minWords} minimum
                </p>
                <Button
                  onClick={handleSubmit}
                  disabled={wordCount < currentPrompt.minWords}
                  size="sm"
                >
                  Submit Answer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Feedback Section */}
          {showFeedback && (
            <Card id="feedback-section" className="border-2 border-blue-200 dark:border-blue-800 px-4 sm:px-6">
              <CardHeader className="px-0">
                <CardTitle className="text-base sm:text-lg">Assessment & Feedback</CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-6">
                  {/* Band Score */}
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Estimated Band Score</p>
                    <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      7.0
                    </p>
                  </div>

                  {/* Criteria Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <p className="text-sm font-medium mb-1">Task Achievement</p>
                      <p className="text-2xl font-bold text-blue-600">7.0</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Good coverage of key features with relevant details
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <p className="text-sm font-medium mb-1">Coherence & Cohesion</p>
                      <p className="text-2xl font-bold text-blue-600">7.0</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Well-organized with clear progression
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <p className="text-sm font-medium mb-1">Lexical Resource</p>
                      <p className="text-2xl font-bold text-blue-600">7.0</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Good range of vocabulary with flexibility
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <p className="text-sm font-medium mb-1">Grammatical Range</p>
                      <p className="text-2xl font-bold text-blue-600">7.0</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Variety of structures with good control
                      </p>
                    </div>
                  </div>

                  {/* Detailed Feedback */}
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                        ✓ Strengths
                      </p>
                      <ul className="text-sm text-green-700 dark:text-green-300 space-y-1 list-disc list-inside">
                        <li>Clear overview with main trends identified</li>
                        <li>Good use of comparative language</li>
                        <li>Logical organization of information</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
                        ⚡ Areas for Improvement
                      </p>
                      <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1 list-disc list-inside">
                        <li>Include more specific data from the chart</li>
                        <li>Vary sentence structures more</li>
                        <li>Ensure all time periods are covered</li>
                      </ul>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setUserAnswer("");
                        setShowFeedback(false);
                        setTimeElapsed(0);
                        setIsTimerRunning(false);
                        setImageCollapsed(false);
                        setHasStartedTyping(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="flex-1"
                    >
                      Try Again
                    </Button>
                    <Link href="/history" className="flex-1">
                      <Button variant="default" className="w-full">
                        View History
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => {
            const checkUser = async () => {
              const { data: { user } } = await supabase.auth.getUser();
              setUser(user);
            };
            checkUser();
          }}
        />
      </div>
    </>
  );
}