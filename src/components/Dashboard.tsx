import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, PenTool, Headphones, Mic, Clock, Target, TrendingUp, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (selectedModule) {
      loadAvailableTests();
    }
  }, [selectedModule, examType, difficulty]);

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

      // Cast data to any[] to bypass type checking for now
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
    
    console.log("=== LOAD TESTS DEBUG ===");
    console.log("1. Selected module:", selectedModule);
    console.log("2. Exam type:", examType);
    console.log("3. Difficulty:", difficulty);
    
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

      console.log("4. Query result:", { data, error });

      if (error) {
        console.error("5. Database error:", error);
        throw error;
      }

      const testsData = data as any[];
      console.log("6. Tests data:", testsData);

      if (!testsData || testsData.length === 0) {
        console.log("7. No tests found");
        toast({
          title: "No tests available",
          description: `No ${difficulty} ${examType} ${selectedModule} tests found.`,
          variant: "destructive"
        });
        return;
      }

      console.log("8. Setting available tests:", testsData.length);
      setAvailableTests(testsData);
      
      // Auto-select first test
      if (testsData.length > 0) {
        console.log("9. Auto-selecting first test:", testsData[0].test_id);
        setSelectedTestId(testsData[0].test_id);
      }

    } catch (error: any) {
      console.error("10. Error loading tests:", error);
      toast({
        title: "Error loading tests",
        description: error.message || "Failed to load available tests",
        variant: "destructive"
      });
    } finally {
      setIsLoadingTests(false);
      console.log("11. Loading complete");
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

    // Navigate to the appropriate practice page with test ID as query parameter
    const practiceRoutes = {
      reading: "/practice/reading",
      writing: "/practice/writing",
      listening: "/practice/listening",
      speaking: "/practice/speaking",
    };

    const route = practiceRoutes[selectedModule];
    if (route) {
      // Pass the test ID as a query parameter
      router.push(`${route}?id=${selectedTestId}`);
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