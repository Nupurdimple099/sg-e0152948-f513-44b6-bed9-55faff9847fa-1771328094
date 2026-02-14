import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, ArrowLeft, BookOpen, PenTool, Headphones, MessageSquare, CheckCircle } from "lucide-react";
import { getRandomPaper, type IELTSPaper, type ExamType, type Difficulty } from "@/services/ieltsPapersService";
import { useToast } from "@/hooks/use-toast";

type ModuleType = "reading" | "writing" | "listening" | "speaking";

export default function TestSession() {
  const router = useRouter();
  const { toast } = useToast();
  const { module, examType, difficulty } = router.query;
  
  const [isLoading, setIsLoading] = useState(true);
  const [paper, setPaper] = useState<IELTSPaper | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;

    if (!module || !examType || !difficulty) {
      setError("Missing test configuration parameters");
      setIsLoading(false);
      return;
    }

    loadTest();
  }, [router.isReady, module, examType, difficulty]);

  const loadTest = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("🔍 Querying ielts_papers table with filters:", {
        category: module,
        exam_type: examType,
        difficulty: difficulty
      });

      // Query ielts_papers table with filters and randomize
      const randomPaper = await getRandomPaper({
        category: module as any,
        exam_type: examType as ExamType,
        difficulty: difficulty as Difficulty
      });

      console.log("📊 Query result:", randomPaper ? "Test found" : "No tests found");

      if (randomPaper) {
        setPaper(randomPaper);
        
        toast({
          title: "Test Loaded Successfully",
          description: `${difficulty.toString().charAt(0).toUpperCase() + difficulty.toString().slice(1)} ${examType.toString().charAt(0).toUpperCase() + examType.toString().slice(1)} ${module.toString().charAt(0).toUpperCase() + module.toString().slice(1)} test is ready!`,
          duration: 3000,
        });
      } else {
        // No matching tests found in database
        const formattedModule = module.toString().charAt(0).toUpperCase() + module.toString().slice(1);
        const formattedExamType = examType.toString().charAt(0).toUpperCase() + examType.toString().slice(1);
        const formattedDifficulty = difficulty.toString().charAt(0).toUpperCase() + difficulty.toString().slice(1);
        
        setError(`No ${formattedDifficulty} ${formattedExamType} ${formattedModule} tests available yet. Please try a different configuration or check back later.`);
        
        toast({
          title: "No Tests Available",
          description: "Preparing more tests for this category. Please try a different difficulty or exam type.",
          variant: "destructive",
          duration: 5000,
        });
        
        console.log("💡 Suggestion: You can generate tests by calling the AI API endpoints");
      }
    } catch (err) {
      console.error("❌ Error loading test:", err);
      setError("Failed to load test session. Please try again.");
      
      toast({
        title: "Error",
        description: "Failed to load test. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTest = () => {
    if (!paper) return;

    // Navigate to the specific practice page with the paper data
    router.push({
      pathname: `/practice/${module}`,
      query: { 
        examType, 
        difficulty,
        testId: paper.test_id
      }
    });
  };

  const getModuleIcon = () => {
    switch (module) {
      case "reading": return <BookOpen className="w-6 h-6" />;
      case "writing": return <PenTool className="w-6 h-6" />;
      case "listening": return <Headphones className="w-6 h-6" />;
      case "speaking": return <MessageSquare className="w-6 h-6" />;
      default: return <BookOpen className="w-6 h-6" />;
    }
  };

  const getModuleColor = (mod: string) => {
    switch (mod) {
      case "reading": return "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400";
      case "writing": return "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400";
      case "listening": return "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400";
      case "speaking": return "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400";
      default: return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400";
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "hard": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <SEO 
          title="Loading Test - IELTS Practice"
          description="Loading your IELTS practice test"
        />
        <div className="text-center space-y-6 p-8">
          <div className="relative">
            <Loader2 className="w-16 h-16 animate-spin text-purple-600 dark:text-purple-400 mx-auto" />
            <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full bg-purple-200 dark:bg-purple-900 opacity-20 animate-ping"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Loading Your Test...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Fetching {difficulty && difficulty.toString().charAt(0).toUpperCase() + difficulty.toString().slice(1)} {examType && examType.toString().charAt(0).toUpperCase() + examType.toString().slice(1)} {module && module.toString().charAt(0).toUpperCase() + module.toString().slice(1)} test
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <SEO 
        title={`${module ? module.toString().charAt(0).toUpperCase() + module.toString().slice(1) : 'Test'} Session - IELTS Practice`}
        description="Active IELTS practice session"
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => router.back()} 
            className="gap-2 hover:bg-purple-100 dark:hover:bg-purple-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize border-purple-300 dark:border-purple-700">
              {examType && examType.toString().charAt(0).toUpperCase() + examType.toString().slice(1)}
            </Badge>
            <Badge className="capitalize flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${getDifficultyColor(difficulty as string)}`}></div>
              {difficulty && difficulty.toString().charAt(0).toUpperCase() + difficulty.toString().slice(1)}
            </Badge>
          </div>
        </div>

        {error ? (
          // Error State
          <Card className="border-2 border-red-200 dark:border-red-900 bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="w-5 h-5" />
                Unable to Load Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">{error}</p>
              
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">What you can do:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                  <li>Try a different difficulty level</li>
                  <li>Switch between Academic and General Training</li>
                  <li>Choose a different module</li>
                  <li>Check back later for new tests</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={() => router.back()}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Return to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  onClick={loadTest}
                  className="border-purple-300 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-900"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Success State - Test Loaded
          <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${getModuleColor(module as string)}`}>
                  {getModuleIcon()}
                </div>
                <div>
                  <CardTitle className="capitalize text-xl">
                    {module && module.toString().charAt(0).toUpperCase() + module.toString().slice(1)} Test Session
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    Test ID: {paper?.test_id.substring(0, 8)}...
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Test Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Module</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">
                    {paper?.category}
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Exam Type</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">
                    {paper?.exam_type}
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Difficulty</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getDifficultyColor(paper?.difficulty || "")}`}></div>
                    {paper?.difficulty}
                  </p>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg">
                <h3 className="font-bold text-yellow-800 dark:text-yellow-200 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Important Instructions
                </h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <li>This is a practice mode session - your results will be saved</li>
                  <li>Timing will begin as soon as you click &quot;Start Test&quot;</li>
                  <li>You can pause and resume at any time</li>
                  <li>Your answers will be evaluated automatically upon submission</li>
                  <li>Try to complete the test in one sitting for best results</li>
                  {module === "listening" && paper?.audio_url && (
                    <li className="font-semibold">Audio will play automatically - ensure your volume is adjusted</li>
                  )}
                  {module === "speaking" && (
                    <li className="font-semibold">Microphone access will be required for recording your responses</li>
                  )}
                </ul>
              </div>

              {/* Audio Preview (for Listening tests) */}
              {module === "listening" && paper?.audio_url && (
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Headphones className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">Audio Available</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Audio file is ready for playback
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Test Content Preview */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Test Content</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {paper?.content_json?.description || 
                   paper?.content_json?.prompt || 
                   "Your test content is ready to begin"}
                </p>
                {paper?.content_json?.wordCount && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    Approximately {paper.content_json.wordCount} words
                  </p>
                )}
              </div>

              {/* Start Test Button */}
              <div className="flex justify-end pt-4">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
                  onClick={handleStartTest}
                >
                  <span className="text-lg">Start {module && module.toString().charAt(0).toUpperCase() + module.toString().slice(1)} Test</span>
                  <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}