import { SEO } from "@/components/SEO";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { BookOpen, PenTool, Headphones, Mic, Calendar, Clock, TrendingUp, Award, Trash2, Eye } from "lucide-react";

interface HistoryItem {
  id: string;
  module: "reading" | "writing" | "listening" | "speaking";
  type: string;
  topic: string;
  difficulty: string;
  score?: number;
  completedAt: string;
  duration?: number;
  details?: any;
}

export default function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedModule, setSelectedModule] = useState<string>("all");

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem("ielts_practice_history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const getModuleIcon = (module: string) => {
    switch (module) {
      case "reading":
        return <BookOpen className="w-5 h-5" />;
      case "writing":
        return <PenTool className="w-5 h-5" />;
      case "listening":
        return <Headphones className="w-5 h-5" />;
      case "speaking":
        return <Mic className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getModuleColor = (module: string) => {
    switch (module) {
      case "reading":
        return "bg-blue-500";
      case "writing":
        return "bg-green-500";
      case "listening":
        return "bg-purple-500";
      case "speaking":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const getBandScoreColor = (score: number) => {
    if (score >= 8.0) return "text-green-600 dark:text-green-400";
    if (score >= 7.0) return "text-blue-600 dark:text-blue-400";
    if (score >= 6.0) return "text-yellow-600 dark:text-yellow-400";
    return "text-orange-600 dark:text-orange-400";
  };

  const filteredHistory = selectedModule === "all" 
    ? history 
    : history.filter(item => item.module === selectedModule);

  const calculateStats = () => {
    const stats = {
      totalAttempts: history.length,
      readingAttempts: history.filter(h => h.module === "reading").length,
      writingAttempts: history.filter(h => h.module === "writing").length,
      listeningAttempts: history.filter(h => h.module === "listening").length,
      speakingAttempts: history.filter(h => h.module === "speaking").length,
      averageScore: history.filter(h => h.score).reduce((acc, h) => acc + (h.score || 0), 0) / (history.filter(h => h.score).length || 1),
    };
    return stats;
  };

  const deleteHistoryItem = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem("ielts_practice_history", JSON.stringify(updatedHistory));
  };

  const clearAllHistory = () => {
    if (confirm("Are you sure you want to clear all practice history? This action cannot be undone.")) {
      setHistory([]);
      localStorage.removeItem("ielts_practice_history");
    }
  };

  const stats = calculateStats();

  return (
    <>
      <SEO
        title="Practice History - IELTS Test Generator"
        description="View your IELTS practice history and track your progress across Reading, Writing, Listening, and Speaking modules."
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  IELTS Generator
                </span>
              </Link>
              <Button asChild variant="outline">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-3">
              <TrendingUp className="w-10 h-10 text-blue-600" />
              Practice History
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Track your progress and review past attempts
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <Badge variant="secondary" className="text-lg font-bold">
                  {stats.totalAttempts}
                </Badge>
              </div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Attempts</h3>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">All Modules</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <Badge variant="secondary" className="text-lg font-bold">
                  {stats.averageScore.toFixed(1)}
                </Badge>
              </div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Average Score</h3>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">Band Score</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500 rounded-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <Badge variant="secondary" className="text-lg font-bold">
                  {history.length > 0 ? "Active" : "Start"}
                </Badge>
              </div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Practice Status</h3>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">Keep Going!</p>
            </Card>
          </div>

          {/* Module Breakdown */}
          <Card className="p-6 mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Module Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">Reading</span>
                  </div>
                  <Badge variant="outline">{stats.readingAttempts}</Badge>
                </div>
                <Progress value={(stats.readingAttempts / stats.totalAttempts) * 100 || 0} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PenTool className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">Writing</span>
                  </div>
                  <Badge variant="outline">{stats.writingAttempts}</Badge>
                </div>
                <Progress value={(stats.writingAttempts / stats.totalAttempts) * 100 || 0} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Headphones className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">Listening</span>
                  </div>
                  <Badge variant="outline">{stats.listeningAttempts}</Badge>
                </div>
                <Progress value={(stats.listeningAttempts / stats.totalAttempts) * 100 || 0} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-5 h-5 text-orange-600" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">Speaking</span>
                  </div>
                  <Badge variant="outline">{stats.speakingAttempts}</Badge>
                </div>
                <Progress value={(stats.speakingAttempts / stats.totalAttempts) * 100 || 0} className="h-2" />
              </div>
            </div>
          </Card>

          {/* History List */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Practice Sessions</h3>
              {history.length > 0 && (
                <Button variant="destructive" size="sm" onClick={clearAllHistory}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>

            <Tabs value={selectedModule} onValueChange={setSelectedModule} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="reading">Reading</TabsTrigger>
                <TabsTrigger value="writing">Writing</TabsTrigger>
                <TabsTrigger value="listening">Listening</TabsTrigger>
                <TabsTrigger value="speaking">Speaking</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedModule} className="space-y-4">
                {filteredHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                      No practice history yet
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      Start practicing to see your progress here
                    </p>
                    <Button asChild>
                      <Link href="/">Start Practicing</Link>
                    </Button>
                  </div>
                ) : (
                  filteredHistory.map((item) => (
                    <Card key={item.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`p-3 ${getModuleColor(item.module)} rounded-lg`}>
                            {getModuleIcon(item.module)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold text-slate-900 dark:text-white capitalize">
                                {item.module} - {item.type}
                              </h4>
                              <Badge variant="secondary">{item.difficulty}</Badge>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                              {item.topic}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(item.completedAt).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {new Date(item.completedAt).toLocaleTimeString()}
                              </div>
                              {item.duration && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {item.duration} min
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {item.score && (
                            <div className="text-right">
                              <div className={`text-3xl font-bold ${getBandScoreColor(item.score)}`}>
                                {item.score.toFixed(1)}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">Band Score</div>
                            </div>
                          )}
                          <div className="flex flex-col gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <Link href={`/practice/${item.module}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                Review
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteHistoryItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </>
  );
}