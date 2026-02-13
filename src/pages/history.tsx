import { SEO } from "@/components/SEO";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, BookOpen, PenTool, Headphones, Mic, Calendar, Clock, Target, Trash2, AlertCircle, TrendingUp, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { AuthModal } from "@/components/AuthModal";
import { UserMenu } from "@/components/UserMenu";
import { supabase } from "@/integrations/supabase/client";
import { 
  getPracticeHistory, 
  getPracticeStats, 
  deletePracticeAttempt,
  clearModuleHistory 
} from "@/services/practiceHistoryService";

interface PracticeAttempt {
  id: string;
  module_type: "reading" | "writing" | "listening" | "speaking";
  test_type?: string;
  topic: string;
  difficulty: string;
  completed_at: string;
  duration?: string;
  word_count?: number;
  band_score?: number;
  is_evaluated?: boolean;
}

export default function History() {
  const [history, setHistory] = useState<PracticeAttempt[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    checkUserAndLoadHistory();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadHistory();
      } else {
        setHistory([]);
        setStats(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserAndLoadHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user) {
      await loadHistory();
    } else {
      setIsLoading(false);
    }
  };

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const [historyData, statsData] = await Promise.all([
        getPracticeHistory(),
        getPracticeStats()
      ]);
      setHistory(historyData as PracticeAttempt[]);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this practice attempt?")) {
      try {
        await deletePracticeAttempt(id);
        await loadHistory();
      } catch (error) {
        console.error("Error deleting attempt:", error);
      }
    }
  };

  const handleClearModule = async (moduleType: string) => {
    if (confirm(`Are you sure you want to clear all ${moduleType} practice history?`)) {
      try {
        await clearModuleHistory(moduleType);
        await loadHistory();
      } catch (error) {
        console.error("Error clearing history:", error);
      }
    }
  };

  const handleAuthSuccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      await loadHistory();
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case "reading": return <BookOpen className="h-5 w-5" />;
      case "writing": return <PenTool className="h-5 w-5" />;
      case "listening": return <Headphones className="h-5 w-5" />;
      case "speaking": return <Mic className="h-5 w-5" />;
      default: return null;
    }
  };

  const getModuleColor = (module: string) => {
    switch (module) {
      case "reading": return "bg-blue-100 text-blue-700 border-blue-200";
      case "writing": return "bg-purple-100 text-purple-700 border-purple-200";
      case "listening": return "bg-green-100 text-green-700 border-green-200";
      case "speaking": return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const filterByModule = (moduleType: string) => {
    return history.filter(item => item.module_type === moduleType);
  };

  const renderAttempts = (attempts: PracticeAttempt[], moduleType: string) => {
    if (attempts.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            {getModuleIcon(moduleType)}
          </div>
          <p className="text-gray-600 mb-4">No {moduleType} practice history yet</p>
          <Link href={`/practice/${moduleType}`}>
            <Button>Start Practicing</Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleClearModule(moduleType)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
        {attempts.map((attempt) => (
          <Card key={attempt.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getModuleColor(attempt.module_type)}>
                    {getModuleIcon(attempt.module_type)}
                    <span className="ml-1 capitalize">{attempt.module_type}</span>
                  </Badge>
                  {attempt.test_type && (
                    <Badge variant="outline" className="capitalize">
                      {attempt.test_type}
                    </Badge>
                  )}
                  {attempt.is_evaluated && (
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      Evaluated
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2">{attempt.topic}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    <span className="capitalize">{attempt.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(attempt.completed_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(attempt.completed_at).toLocaleTimeString()}</span>
                  </div>
                  {attempt.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{attempt.duration}</span>
                    </div>
                  )}
                  {attempt.word_count && (
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{attempt.word_count} words</span>
                    </div>
                  )}
                  {attempt.band_score && (
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4 text-yellow-600" />
                      <span className="font-semibold text-yellow-600">Band {attempt.band_score}</span>
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(attempt.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  if (!user) {
    return (
      <>
        <SEO 
          title="Practice History - IELTS Practice Platform"
          description="View your IELTS practice history and track your progress"
        />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <Button onClick={() => setIsAuthModalOpen(true)} size="sm">
                  Sign In
                </Button>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-4 py-12">
            <Card className="max-w-2xl mx-auto p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                <AlertCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
              <p className="text-gray-600 mb-6">
                Create an account or sign in to view your practice history and track your progress across devices.
              </p>
              <Button onClick={() => setIsAuthModalOpen(true)} size="lg">
                Sign In / Create Account
              </Button>
            </Card>
          </div>

          <AuthModal 
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onSuccess={handleAuthSuccess}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Practice History - IELTS Practice Platform"
        description="View your IELTS practice history and track your progress"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <UserMenu onSignOut={() => setUser(null)} />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Practice History
            </h1>
            <p className="text-gray-600">Track your IELTS preparation progress</p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your history...</p>
            </div>
          ) : (
            <>
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Total</span>
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-blue-600">Reading</span>
                      <BookOpen className="h-4 w-4 text-blue-400" />
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{stats.reading}</p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-purple-600">Writing</span>
                      <PenTool className="h-4 w-4 text-purple-400" />
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{stats.writing}</p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-green-600">Listening</span>
                      <Headphones className="h-4 w-4 text-green-400" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">{stats.listening}</p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-orange-600">Speaking</span>
                      <Mic className="h-4 w-4 text-orange-400" />
                    </div>
                    <p className="text-2xl font-bold text-orange-600">{stats.speaking}</p>
                  </Card>
                </div>
              )}

              {stats && stats.averageBandScore > 0 && (
                <Alert className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                  <Award className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <span className="font-semibold">Average Band Score: {stats.averageBandScore}</span>
                    {stats.averageBandScore >= 7 && " - Excellent progress! Keep it up!"}
                    {stats.averageBandScore >= 6 && stats.averageBandScore < 7 && " - Good work! You're on track."}
                    {stats.averageBandScore < 6 && " - Keep practicing to improve your score."}
                  </AlertDescription>
                </Alert>
              )}

              <Card className="p-6">
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-5 mb-6">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="reading">Reading</TabsTrigger>
                    <TabsTrigger value="writing">Writing</TabsTrigger>
                    <TabsTrigger value="listening">Listening</TabsTrigger>
                    <TabsTrigger value="speaking">Speaking</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all">
                    {history.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                          <AlertCircle className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-600 mb-4">No practice history yet</p>
                        <Link href="/">
                          <Button>Start Practicing</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {history.map((attempt) => (
                          <Card key={attempt.id} className="p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={getModuleColor(attempt.module_type)}>
                                    {getModuleIcon(attempt.module_type)}
                                    <span className="ml-1 capitalize">{attempt.module_type}</span>
                                  </Badge>
                                  {attempt.test_type && (
                                    <Badge variant="outline" className="capitalize">
                                      {attempt.test_type}
                                    </Badge>
                                  )}
                                  {attempt.is_evaluated && (
                                    <Badge className="bg-green-100 text-green-700 border-green-200">
                                      Evaluated
                                    </Badge>
                                  )}
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{attempt.topic}</h3>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Target className="h-4 w-4" />
                                    <span className="capitalize">{attempt.difficulty}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(attempt.completed_at).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{new Date(attempt.completed_at).toLocaleTimeString()}</span>
                                  </div>
                                  {attempt.duration && (
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      <span>{attempt.duration}</span>
                                    </div>
                                  )}
                                  {attempt.word_count && (
                                    <div className="flex items-center gap-1">
                                      <span className="font-medium">{attempt.word_count} words</span>
                                    </div>
                                  )}
                                  {attempt.band_score && (
                                    <div className="flex items-center gap-1">
                                      <Award className="h-4 w-4 text-yellow-600" />
                                      <span className="font-semibold text-yellow-600">Band {attempt.band_score}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(attempt.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="reading">
                    {renderAttempts(filterByModule("reading"), "reading")}
                  </TabsContent>

                  <TabsContent value="writing">
                    {renderAttempts(filterByModule("writing"), "writing")}
                  </TabsContent>

                  <TabsContent value="listening">
                    {renderAttempts(filterByModule("listening"), "listening")}
                  </TabsContent>

                  <TabsContent value="speaking">
                    {renderAttempts(filterByModule("speaking"), "speaking")}
                  </TabsContent>
                </Tabs>
              </Card>
            </>
          )}
        </div>

        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      </div>
    </>
  );
}