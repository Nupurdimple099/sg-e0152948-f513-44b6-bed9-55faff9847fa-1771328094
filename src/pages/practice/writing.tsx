import { SEO } from "@/components/SEO";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, FileText, PenTool, CheckCircle2, Clock, AlertCircle, ChevronDown, Minimize2, Sparkles, Loader2, Brain } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { savePracticeAttempt } from "@/services/practiceHistoryService";
import { AuthModal } from "@/components/AuthModal";

type TaskType = "task1" | "task2";
type Task1Type = "bar" | "line" | "pie" | "table" | "process" | "map";
type Difficulty = "5.5" | "6.0" | "6.5" | "7.0" | "7.5" | "8.0";

interface Task1Data {
  type: "task1";
  chartType: Task1Type;
  title: string;
  description: string;
  chartData: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
    }>;
  };
  taskPrompt: string;
  sampleAnswer: string;
  wordCount: number;
  bandScore: string;
  examinerComments: string;
}

interface Task2Data {
  type: "task2";
  essayType: string;
  topic: string;
  prompt: string;
  sampleAnswer: string;
  wordCount: number;
  bandScore: string;
  examinerComments: string;
}

export default function WritingPractice() {
  const [selectedTask, setSelectedTask] = useState<TaskType>("task1");
  const [task1Type, setTask1Type] = useState<Task1Type>("bar");
  const [difficulty, setDifficulty] = useState<Difficulty>("6.5");
  const [customTopic, setCustomTopic] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [showSample, setShowSample] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [task1Data, setTask1Data] = useState<Task1Data | null>(null);
  const [task2Data, setTask2Data] = useState<Task2Data | null>(null);
  const [imageCollapsed, setImageCollapsed] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Check user session - but don't block if not logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.log("User not logged in (optional):", error.message);
          setUser(null);
        } else {
          setUser(user);
        }
      } catch (error) {
        console.log("Auth check failed (optional):", error);
        setUser(null);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedTask === "task1" && userAnswer.length > 10 && !hasStartedTyping) {
      setHasStartedTyping(true);
      setImageCollapsed(true);
    }
  }, [userAnswer, selectedTask, hasStartedTyping]);

  useEffect(() => {
    setUserAnswer("");
    setShowSample(false);
    setIsSubmitted(false);
    setImageCollapsed(false);
    setHasStartedTyping(false);
    setTask1Data(null);
    setTask2Data(null);
    setGenerationError(null);
  }, [selectedTask]);

  const wordCount = userAnswer.trim().split(/\s+/).filter(word => word.length > 0).length;
  const minWords = selectedTask === "task1" ? 150 : 250;
  const meetsRequirement = wordCount >= minWords;

  const toggleImageCollapse = () => {
    setImageCollapsed(!imageCollapsed);
  };

  const generateNewTest = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    setTask1Data(null);
    setTask2Data(null);
    setUserAnswer("");
    setShowSample(false);
    setIsSubmitted(false);

    try {
      const response = await fetch("/api/generate-writing-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskType: selectedTask,
          topic: customTopic || undefined,
          difficulty,
          task1Type: selectedTask === "task1" ? task1Type : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate test");
      }

      const data = await response.json();

      if (data.type === "task1") {
        setTask1Data(data as Task1Data);
      } else {
        setTask2Data(data as Task2Data);
      }
    } catch (error) {
      console.error("Error generating test:", error);
      setGenerationError(error instanceof Error ? error.message : "Failed to generate test. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!meetsRequirement) {
      alert(`Please write at least ${minWords} words before submitting.`);
      return;
    }

    setIsSubmitted(true);

    const currentTaskData = selectedTask === "task1" ? task1Data : task2Data;
    let topicToSave = customTopic || "General Writing Practice";
    
    if (currentTaskData) {
      if (selectedTask === "task1") {
        topicToSave = (currentTaskData as Task1Data).title;
      } else {
        topicToSave = (currentTaskData as Task2Data).topic || topicToSave;
      }
    }

    try {
      await savePracticeAttempt({
        user_id: user.id,
        module_type: "writing",
        test_type: selectedTask,
        topic: topicToSave,
        difficulty: difficulty,
        user_answer: userAnswer,
        word_count: wordCount,
        test_data: currentTaskData,
        completed_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error saving practice history:", error);
    }
  };

  const currentData = selectedTask === "task1" ? task1Data : task2Data;
  const hasGeneratedTest = currentData !== null;

  return (
    <>
      <SEO
        title="Writing Practice - IELTS Practice"
        description="Practice IELTS Academic Writing Task 1 and Task 2 with AI-generated prompts and model answers"
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                <PenTool className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Writing Practice
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  AI-Powered IELTS Academic Writing Tests
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-6">
            <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => setSelectedTask("task1")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Task 1
                  {selectedTask === "task1" && <Badge>Selected</Badge>}
                </CardTitle>
                <CardDescription>
                  Describe visual information (charts, graphs, diagrams)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Minimum 150 words • 20 minutes
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => setSelectedTask("task2")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenTool className="w-5 h-5" />
                  Task 2
                  {selectedTask === "task2" && <Badge>Selected</Badge>}
                </CardTitle>
                <CardDescription>
                  Write an essay responding to a point of view or argument
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Minimum 250 words • 40 minutes
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-2 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  AI Generation
                </CardTitle>
                <CardDescription>
                  Cambridge-standard tests powered by AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Unique tests • Model answers • Band scores
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Generate New {selectedTask === "task1" ? "Task 1" : "Task 2"} Test
              </CardTitle>
              <CardDescription>
                Create a unique Cambridge-standard IELTS writing test with AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {selectedTask === "task1" && (
                  <div className="space-y-2">
                    <Label htmlFor="chart-type">Chart Type</Label>
                    <Select value={task1Type} onValueChange={(value) => setTask1Type(value as Task1Type)}>
                      <SelectTrigger id="chart-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                        <SelectItem value="line">Line Graph</SelectItem>
                        <SelectItem value="pie">Pie Chart</SelectItem>
                        <SelectItem value="table">Table</SelectItem>
                        <SelectItem value="process">Process Diagram</SelectItem>
                        <SelectItem value="map">Map</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Target Band Score</Label>
                  <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                    <SelectTrigger id="difficulty">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5.5">Band 5.5</SelectItem>
                      <SelectItem value="6.0">Band 6.0</SelectItem>
                      <SelectItem value="6.5">Band 6.5</SelectItem>
                      <SelectItem value="7.0">Band 7.0</SelectItem>
                      <SelectItem value="7.5">Band 7.5</SelectItem>
                      <SelectItem value="8.0">Band 8.0</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic">Topic (Optional)</Label>
                  <input
                    id="topic"
                    type="text"
                    placeholder={selectedTask === "task1" ? "e.g., Energy consumption" : "e.g., Education, Technology"}
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  />
                </div>
              </div>

              <Button
                onClick={generateNewTest}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Cambridge-Standard Test...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate New Test
                  </>
                )}
              </Button>

              {generationError && (
                <Alert variant="destructive">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>{generationError}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {hasGeneratedTest && (
            <div className="space-y-6">
              {selectedTask === "task1" && task1Data && (
                <>
                  {imageCollapsed ? (
                    <Card 
                      className="cursor-pointer transition-all hover:bg-blue-100 dark:hover:bg-blue-900/30 border-2 border-dashed border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/20"
                      onClick={toggleImageCollapse}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4 group">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Chart Minimized</h3>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              Tap to expand and view the data visualization
                            </p>
                          </div>
                          <ChevronDown className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Reference Chart</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleImageCollapse}
                          className="gap-2"
                        >
                          <Minimize2 className="w-4 h-4" />
                          Minimize
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                          <div className="bg-white dark:bg-gray-800 p-6">
                            <h3 className="text-xl font-bold text-center mb-4">{task1Data.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
                              {task1Data.description}
                            </p>
                            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded">
                              <p className="text-gray-500 dark:text-gray-400">
                                {task1Data.chartType.charAt(0).toUpperCase() + task1Data.chartType.slice(1)} chart visualization would appear here
                              </p>
                            </div>
                          </div>
                        </div>
                        {hasStartedTyping && (
                          <Alert>
                            <AlertCircle className="w-4 h-4" />
                            <AlertDescription>
                              <strong>Tip:</strong> Click "Minimize" above to give your writing area more space. You can always expand it again.
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle>Task Instructions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {task1Data.taskPrompt}
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}

              {selectedTask === "task2" && task2Data && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Essay Question</CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline">{task2Data.essayType}</Badge>
                        <Badge>Band {task2Data.bandScore}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Topic:</span>
                      <span className="ml-2 text-gray-800 dark:text-gray-200">{task2Data.topic}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {task2Data.prompt}
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Your Answer</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={meetsRequirement ? "default" : "secondary"}>
                        {wordCount} / {minWords} words
                      </Badge>
                      {meetsRequirement && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Write your response below. Aim for {selectedTask === "task1" ? "150-180" : "250-300"} words.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Start writing your answer here..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="min-h-[300px] text-base"
                    disabled={isSubmitted}
                  />
                  <div className="flex items-center gap-2 mt-4">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Suggested time: {selectedTask === "task1" ? "20" : "40"} minutes
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitted || !meetsRequirement}
                  className="flex-1"
                  size="lg"
                >
                  {isSubmitted ? "Submitted" : "Submit Answer"}
                </Button>
                <Button
                  onClick={() => setShowSample(!showSample)}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  {showSample ? "Hide" : "View"} Model Answer
                </Button>
              </div>

              {isSubmitted && (
                <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    <strong>Answer submitted!</strong> Your response has been saved to your practice history.
                    Review the model answer below to compare your writing.
                  </AlertDescription>
                </Alert>
              )}

              {showSample && currentData && (
                <Card className="border-2 border-purple-200 dark:border-purple-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-600" />
                      Model Answer (Band {currentData.bandScore})
                    </CardTitle>
                    <CardDescription>
                      {currentData.wordCount} words
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {currentData.sampleAnswer}
                      </p>
                    </div>
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2">Examiner Comments:</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                        {currentData.examinerComments}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {!hasGeneratedTest && !isGenerating && (
            <Card className="border-2 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Sparkles className="w-16 h-16 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ready to Practice?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                  Click "Generate New Test" above to create a unique Cambridge-standard IELTS writing test.
                  Each test includes detailed model answers and examiner feedback.
                </p>
                <Badge variant="outline">AI-Powered • Instant Generation • Band Score Analysis</Badge>
              </CardContent>
            </Card>
          )}
        </div>
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
    </>
  );
}