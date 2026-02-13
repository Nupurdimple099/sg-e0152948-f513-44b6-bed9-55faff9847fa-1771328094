import { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { AuthModal } from "@/components/AuthModal";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  FileText, 
  Headphones, 
  MessageSquare, 
  PenTool,
  TrendingUp,
  Filter,
  Search,
  Eye,
  Download,
  Trash2,
  Info,
  BarChart3,
  CheckCircle,
  XCircle
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import type { PracticeAttempt } from "@/services/practiceHistoryService";
import { 
  getPracticeHistory, 
  deletePracticeAttempt,
  getPracticeStats 
} from "@/services/practiceHistoryService";

type ModuleFilter = "all" | "reading" | "writing" | "listening" | "speaking";
type SortOption = "recent" | "oldest" | "score-high" | "score-low";

interface PracticeStats {
  total: number;
  reading: number;
  writing: number;
  listening: number;
  speaking: number;
  averageBandScore: number;
}

const moduleIcons = {
  reading: FileText,
  writing: PenTool,
  listening: Headphones,
  speaking: MessageSquare,
};

const moduleColors = {
  reading: "bg-blue-500",
  writing: "bg-purple-500",
  listening: "bg-green-500",
  speaking: "bg-orange-500",
};

const difficultyColors = {
  "5.5": "bg-gray-500",
  "6.0": "bg-blue-500",
  "6.5": "bg-cyan-500",
  "7.0": "bg-green-500",
  "7.5": "bg-yellow-500",
  "8.0": "bg-red-500",
};

export default function History() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [attempts, setAttempts] = useState<PracticeAttempt[]>([]);
  const [filteredAttempts, setFilteredAttempts] = useState<PracticeAttempt[]>([]);
  const [stats, setStats] = useState<PracticeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [moduleFilter, setModuleFilter] = useState<ModuleFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAttempt, setSelectedAttempt] = useState<PracticeAttempt | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadHistory();
      loadStats();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortAttempts();
  }, [attempts, moduleFilter, sortOption, searchQuery]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsAuthModalOpen(true);
      setLoading(false);
    } else {
      setUser(user);
    }
  };

  const loadHistory = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const history = await getPracticeHistory();
      setAttempts(history as PracticeAttempt[]);
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    if (!user) return;
    
    try {
      const statistics = await getPracticeStats();
      setStats(statistics);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const filterAndSortAttempts = () => {
    let filtered = [...attempts];

    if (moduleFilter !== "all") {
      filtered = filtered.filter(a => a.module_type === moduleFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(a => 
        a.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.test_type?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      switch (sortOption) {
        case "recent":
          return new Date(b.completed_at || "").getTime() - new Date(a.completed_at || "").getTime();
        case "oldest":
          return new Date(a.completed_at || "").getTime() - new Date(b.completed_at || "").getTime();
        case "score-high":
          return (b.band_score || 0) - (a.band_score || 0);
        case "score-low":
          return (a.band_score || 0) - (b.band_score || 0);
        default:
          return 0;
      }
    });

    setFilteredAttempts(filtered);
  };

  const handleViewDetails = (attempt: PracticeAttempt) => {
    setSelectedAttempt(attempt);
    setIsDetailOpen(true);
  };

  const handleDelete = async (attemptId: string) => {
    if (!confirm("Are you sure you want to delete this practice attempt?")) {
      return;
    }

    setDeleteLoading(true);
    try {
      await deletePracticeAttempt(attemptId);
      await loadHistory();
      await loadStats();
      setIsDetailOpen(false);
    } catch (error) {
      console.error("Error deleting attempt:", error);
      alert("Failed to delete attempt. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  const getModuleIcon = (module: string) => {
    const Icon = moduleIcons[module as keyof typeof moduleIcons];
    return Icon ? <Icon className="w-4 h-4" /> : <FileText className="w-4 h-4" />;
  };

  const getModuleColor = (module: string) => {
    return moduleColors[module as keyof typeof moduleColors] || "bg-gray-500";
  };

  const getDifficultyColor = (difficulty: string) => {
    return difficultyColors[difficulty as keyof typeof difficultyColors] || "bg-gray-500";
  };

  const exportToPDF = () => {
    alert("PDF export feature coming soon!");
  };

  if (loading) {
    return (
      <>
        <SEO title="Practice History - IELTS Practice" description="View your IELTS practice history" />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex items-center gap-4 mb-8">
              <Skeleton className="h-10 w-10 rounded" />
              <Skeleton className="h-8 w-48" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-32 rounded-lg" />
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-40 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Practice History - IELTS Practice" 
        description="View and track your IELTS practice attempts with detailed statistics and progress insights"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Practice History
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Track your progress and review past attempts
                </p>
              </div>
            </div>
            <Button onClick={exportToPDF} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
          </div>

          {/* Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Attempts</CardDescription>
                  <CardTitle className="text-3xl">{stats.total}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span>View your progress</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Average Band Score</CardDescription>
                  <CardTitle className="text-3xl">
                    {stats.averageBandScore > 0 ? stats.averageBandScore : "N/A"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span>Across all modules</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Reading & Listening</CardDescription>
                  <CardTitle className="text-3xl">
                    {stats.reading + stats.listening}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3 h-3 text-blue-500" />
                      <span>{stats.reading} reading</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Headphones className="w-3 h-3 text-green-500" />
                      <span>{stats.listening} listening</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Writing & Speaking</CardDescription>
                  <CardTitle className="text-3xl">
                    {stats.writing + stats.speaking}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <PenTool className="w-3 h-3 text-purple-500" />
                      <span>{stats.writing} writing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-3 h-3 text-orange-500" />
                      <span>{stats.speaking} speaking</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Module
                  </label>
                  <Select value={moduleFilter} onValueChange={(v) => setModuleFilter(v as ModuleFilter)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Modules</SelectItem>
                      <SelectItem value="reading">Reading</SelectItem>
                      <SelectItem value="writing">Writing</SelectItem>
                      <SelectItem value="listening">Listening</SelectItem>
                      <SelectItem value="speaking">Speaking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Sort By
                  </label>
                  <Select value={sortOption} onValueChange={(v) => setSortOption(v as SortOption)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="score-high">Highest Score</SelectItem>
                      <SelectItem value="score-low">Lowest Score</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Search by topic..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attempts List */}
          {filteredAttempts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Info className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Practice Attempts Found</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  {searchQuery || moduleFilter !== "all" 
                    ? "Try adjusting your filters or search query"
                    : "Start practicing to see your history here"}
                </p>
                <Link href="/">
                  <Button>Start Practicing</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredAttempts.map((attempt) => (
                <Card key={attempt.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-3 rounded-lg ${getModuleColor(attempt.module_type)}`}>
                          {getModuleIcon(attempt.module_type)}
                          <span className="sr-only">{attempt.module_type}</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg truncate">
                              {attempt.topic || "Untitled Practice"}
                            </h3>
                            <Badge variant="outline" className="capitalize">
                              {attempt.module_type}
                            </Badge>
                            {attempt.test_type && (
                              <Badge variant="secondary" className="capitalize">
                                {attempt.test_type}
                              </Badge>
                            )}
                            {attempt.difficulty && (
                              <Badge className={getDifficultyColor(attempt.difficulty)}>
                                Band {attempt.difficulty}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(attempt.completed_at || "")}</span>
                            </div>
                            
                            {attempt.band_score !== null && attempt.band_score !== undefined && (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Score: {attempt.band_score}/9.0</span>
                              </div>
                            )}
                            
                            {attempt.word_count && (
                              <div className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                <span>{attempt.word_count} words</span>
                              </div>
                            )}
                            
                            {attempt.duration && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{attempt.duration}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleViewDetails(attempt)}
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Detail Modal */}
          <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              {selectedAttempt && (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <div className={`p-2 rounded ${getModuleColor(selectedAttempt.module_type)}`}>
                        {getModuleIcon(selectedAttempt.module_type)}
                      </div>
                      {selectedAttempt.topic || "Practice Attempt"}
                    </DialogTitle>
                    <DialogDescription>
                      {formatDate(selectedAttempt.completed_at || "")}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6 mt-4">
                    {/* Metadata */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="capitalize">
                        {selectedAttempt.module_type}
                      </Badge>
                      {selectedAttempt.test_type && (
                        <Badge variant="secondary" className="capitalize">
                          {selectedAttempt.test_type}
                        </Badge>
                      )}
                      {selectedAttempt.difficulty && (
                        <Badge className={getDifficultyColor(selectedAttempt.difficulty)}>
                          Band {selectedAttempt.difficulty}
                        </Badge>
                      )}
                      {selectedAttempt.band_score !== null && selectedAttempt.band_score !== undefined && (
                        <Badge variant="default">
                          Score: {selectedAttempt.band_score}/9.0
                        </Badge>
                      )}
                    </div>

                    {/* User Answer */}
                    {selectedAttempt.user_answer && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Your Answer
                          {selectedAttempt.word_count && (
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              ({selectedAttempt.word_count} words)
                            </span>
                          )}
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg whitespace-pre-wrap text-sm">
                          {selectedAttempt.user_answer}
                        </div>
                      </div>
                    )}

                    {/* User Responses (for Reading/Listening) */}
                    {selectedAttempt.evaluation_data && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Feedback
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                           <Alert>
                            <AlertDescription className="text-sm">
                              <pre className="whitespace-pre-wrap overflow-x-auto font-sans">
                                {typeof selectedAttempt.evaluation_data === 'string' 
                                  ? selectedAttempt.evaluation_data 
                                  : JSON.stringify(selectedAttempt.evaluation_data, null, 2)}
                              </pre>
                            </AlertDescription>
                          </Alert>
                        </div>
                      </div>
                    )}

                    {/* Test Data */}
                    {selectedAttempt.test_data && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Info className="w-4 h-4" />
                          Test Details
                        </h4>
                        <Alert>
                          <AlertDescription className="text-sm">
                            <pre className="whitespace-pre-wrap overflow-x-auto">
                              {JSON.stringify(selectedAttempt.test_data, null, 2)}
                            </pre>
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-between pt-4 border-t">
                      <Button
                        onClick={() => handleDelete(selectedAttempt.id)}
                        variant="destructive"
                        size="sm"
                        disabled={deleteLoading}
                        className="gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        {deleteLoading ? "Deleting..." : "Delete Attempt"}
                      </Button>
                      <Button onClick={() => setIsDetailOpen(false)} variant="outline">
                        Close
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          checkUser();
        }}
      />
    </>
  );
}