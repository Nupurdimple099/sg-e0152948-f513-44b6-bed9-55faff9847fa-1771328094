import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, PenTool, Headphones, Mic, Clock, Target, TrendingUp, Calendar, Upload, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { upsertMultipleTests, type LocalTestData } from "@/services/testSyncService";

type ModuleType = "reading" | "writing" | "listening" | "speaking";
type ExamType = "academic" | "general";
type Difficulty = "easy" | "medium" | "hard";

interface TestOption {
  test_id: string;
  test_title: string;
  difficulty: string;
}

interface PracticeStats {
  totalTests: number;
  averageScore: number;
  lastPracticeDate: string | null;
}

const moduleConfig = {
  reading: {
    icon: BookOpen,
    title: "Reading",
    description: "Academic & General Training passages",
    color: "bg-blue-500",
    route: "/practice/reading"
  },
  writing: {
    icon: PenTool,
    title: "Writing",
    description: "Task 1 & Task 2 essays",
    color: "bg-green-500",
    route: "/practice/writing"
  },
  listening: {
    icon: Headphones,
    title: "Listening",
    description: "4 sections with audio",
    color: "bg-purple-500",
    route: "/practice/listening"
  },
  speaking: {
    icon: Mic,
    title: "Speaking",
    description: "Part 1, 2 & 3 practice",
    color: "bg-orange-500",
    route: "/practice/speaking"
  }
};

export function Dashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedModule, setSelectedModule] = useState<ModuleType | null>(null);
  const [examType, setExamType] = useState<ExamType>("academic");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [availableTests, setAvailableTests] = useState<TestOption[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<string>("");
  const [isLoadingTests, setIsLoadingTests] = useState(false);
  const [stats, setStats] = useState<PracticeStats>({
    totalTests: 0,
    averageScore: 0,
    lastPracticeDate: null
  });

  // Admin sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStatus, setSyncStatus] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadStats();
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (selectedModule) {
      loadAvailableTests();
    }
  }, [selectedModule, examType, difficulty]);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", user.id)
        .single();

      // Set admin status (you can customize this logic)
      // For now, checking if email contains "admin" or specific email
      const adminEmails = ["admin@ielts.com", "dev@ielts.com"];
      setIsAdmin(adminEmails.includes(profile?.email || "") || profile?.email?.includes("admin"));
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  const loadStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("practice_history")
        .select("score, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const historyData = data as any[];

      if (historyData && historyData.length > 0) {
        const totalScore = historyData.reduce((sum, record) => sum + (record.score || 0), 0);
        const avgScore = totalScore / historyData.length;
        
        setStats({
          totalTests: historyData.length,
          averageScore: Math.round(avgScore * 10) / 10,
          lastPracticeDate: historyData[0].created_at
        });
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadAvailableTests = async () => {
    if (!selectedModule) return;
    
    setIsLoadingTests(true);
    setAvailableTests([]);
    setSelectedTestId("");

    try {
      const { data, error } = await supabase
        .from("ielts_papers")
        .select("test_id, test_title, difficulty")
        .eq("category", selectedModule)
        .eq("exam_type", examType)
        .eq("difficulty", difficulty)
        .order("test_title");

      if (error) throw error;

      const testsData = data as any[];

      if (!testsData || testsData.length === 0) {
        toast({
          title: "No tests available",
          description: `No ${difficulty} ${examType} ${selectedModule} tests found.`,
          variant: "destructive"
        });
        return;
      }

      setAvailableTests(testsData);
      
      if (testsData.length > 0) {
        setSelectedTestId(testsData[0].test_id);
      }

    } catch (error: any) {
      console.error("Error loading tests:", error);
      toast({
        title: "Error loading tests",
        description: error.message || "Failed to load available tests",
        variant: "destructive"
      });
    } finally {
      setIsLoadingTests(false);
    }
  };

  const handleStartPractice = () => {
    if (!selectedTestId) {
      toast({
        title: "No test selected",
        description: "Please select a test before starting practice",
        variant: "destructive",
      });
      return;
    }

    const practiceRoutes = {
      reading: "/practice/reading",
      writing: "/practice/writing",
      listening: "/practice/listening",
      speaking: "/practice/speaking",
    };

    const route = practiceRoutes[selectedModule!];
    if (route) {
      router.push(`${route}?id=${selectedTestId}`);
    }
  };

  const handlePushTestsToSupabase = async () => {
    setIsSyncing(true);
    setSyncProgress(0);
    setSyncStatus("Preparing tests...");

    try {
      // Sample test data - Replace with your actual test data source
      const sampleTests: LocalTestData[] = [
        {
          test_title: "Academic Reading Test 1 - Climate Change",
          category: "reading",
          exam_type: "academic",
          difficulty: "medium",
          content_json: {
            passages: [
              {
                title: "The Impact of Climate Change on Global Agriculture",
                text: "Climate change is one of the most pressing challenges facing humanity today. Rising temperatures, changing precipitation patterns, and increased frequency of extreme weather events are already affecting agricultural productivity worldwide...",
                questions: [
                  {
                    type: "true_false_not_given",
                    question: "Climate change affects agricultural productivity globally.",
                    answer: "TRUE"
                  }
                ]
              }
            ]
          }
        },
        {
          test_title: "Academic Writing Task 2 - Technology in Education",
          category: "writing",
          exam_type: "academic",
          difficulty: "medium",
          content_json: {
            task_type: "task_2",
            prompt: "Some people believe that technology has made children less creative than they were in the past. To what extent do you agree or disagree?",
            word_count: 250,
            time_limit: 40
          }
        },
        {
          test_title: "Academic Listening Test 1 - University Life",
          category: "listening",
          exam_type: "academic",
          difficulty: "medium",
          content_json: {
            sections: [
              {
                section_number: 1,
                context: "A conversation between a student and an accommodation officer",
                questions: [
                  {
                    type: "form_completion",
                    question: "Student's name: Sarah ______"
                  }
                ]
              }
            ]
          },
          audio_url: "https://example.com/audio/listening-test-1.mp3"
        },
        {
          test_title: "Academic Speaking Test 1 - Personal Experience",
          category: "speaking",
          exam_type: "academic",
          difficulty: "medium",
          content_json: {
            part_1: {
              topic: "Daily Routine",
              questions: [
                "What time do you usually wake up?",
                "Do you prefer morning or evening activities?"
              ]
            },
            part_2: {
              topic_card: "Describe a memorable journey you have made",
              prompts: [
                "Where you went",
                "When you went there",
                "Who you went with",
                "Why it was memorable"
              ]
            },
            part_3: {
              topic: "Travel and Tourism",
              questions: [
                "How has tourism changed in your country?",
                "What are the benefits of international travel?"
              ]
            }
          }
        }
      ];

      const result = await upsertMultipleTests(
        sampleTests,
        (current, total, testTitle) => {
          const progress = Math.round((current / total) * 100);
          setSyncProgress(progress);
          setSyncStatus(`Syncing: ${testTitle} (${current}/${total})`);
        }
      );

      if (result.failed > 0) {
        toast({
          title: "Sync completed with errors",
          description: `${result.successful} succeeded, ${result.failed} failed`,
          variant: "destructive"
        });
        console.error("Failed tests:", result.errors);
      } else {
        toast({
          title: "Sync successful!",
          description: `Successfully synced ${result.successful} tests to Supabase`,
        });
      }

      setSyncStatus(`Complete: ${result.successful} synced, ${result.failed} failed`);
      
      // Reload available tests if a module is selected
      if (selectedModule) {
        await loadAvailableTests();
      }

    } catch (error: any) {
      console.error("Error syncing tests:", error);
      toast({
        title: "Sync failed",
        description: error.message || "Failed to sync tests to Supabase",
        variant: "destructive"
      });
      setSyncStatus("Sync failed");
    } finally {
      setIsSyncing(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
            IELTS Practice Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Choose a module to begin your practice session
          </p>
        </div>

        {/* Admin Tools Section */}
        {isAdmin && (
          <Card className="border-2 border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Admin Tools
              </CardTitle>
              <CardDescription>
                Manage and sync IELTS test content to Supabase database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handlePushTestsToSupabase}
                disabled={isSyncing}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isSyncing ? "Syncing..." : "Push Tests to Supabase"}
              </Button>

              {isSyncing && (
                <div className="space-y-2">
                  <Progress value={syncProgress} className="w-full" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                    {syncStatus}
                  </p>
                </div>
              )}

              {syncStatus && !isSyncing && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Sync Status</AlertTitle>
                  <AlertDescription>{syncStatus}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4" />
                Total Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTests}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Last Practice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDate(stats.lastPracticeDate)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Module Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(moduleConfig) as ModuleType[]).map((module) => {
            const config = moduleConfig[module];
            const Icon = config.icon;
            const isSelected = selectedModule === module;

            return (
              <Card
                key={module}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  isSelected ? "ring-2 ring-primary shadow-lg" : ""
                }`}
                onClick={() => setSelectedModule(module)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${config.color} flex items-center justify-center mb-2`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>{config.title}</CardTitle>
                  <CardDescription>{config.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Test Configuration */}
        {selectedModule && (
          <Card>
            <CardHeader>
              <CardTitle>Configure Your Test</CardTitle>
              <CardDescription>
                Select exam type, difficulty level, and specific test
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Exam Type</label>
                  <Select value={examType} onValueChange={(value) => setExamType(value as ExamType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="general">General Training</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty Level</label>
                  <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy (Band 5.0-6.0)</SelectItem>
                      <SelectItem value="medium">Medium (Band 6.5-7.0)</SelectItem>
                      <SelectItem value="hard">Hard (Band 7.5-8.5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Select Test</label>
                <Select 
                  value={selectedTestId} 
                  onValueChange={setSelectedTestId}
                  disabled={isLoadingTests || availableTests.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      isLoadingTests 
                        ? "Loading tests..." 
                        : availableTests.length === 0 
                        ? "No tests available" 
                        : "Choose a test"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTests.map((test) => (
                      <SelectItem key={test.test_id} value={test.test_id}>
                        {test.test_title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button
                  onClick={handleStartPractice}
                  disabled={!selectedTestId || isLoadingTests}
                  className="flex-1"
                  size="lg"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Start Practice Test
                </Button>
              </div>

              {availableTests.length > 0 && (
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {availableTests.length} test{availableTests.length !== 1 ? "s" : ""} available
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}