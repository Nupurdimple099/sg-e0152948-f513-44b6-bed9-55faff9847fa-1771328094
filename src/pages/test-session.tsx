import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, ArrowLeft, BookOpen, PenTool, Headphones, MessageSquare } from "lucide-react";
import { getRandomPaper, type IELTSPaper } from "@/services/ieltsPapersService";
import { useToast } from "@/hooks/use-toast";

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
      // 1. Try to get an existing paper from the database
      const existingPaper = await getRandomPaper({
        category: module as any,
        exam_type: examType as any,
        difficulty: difficulty as any
      });

      if (existingPaper) {
        setPaper(existingPaper);
        // In a real app, we might redirect to a specific runner component here
        // based on the module type
      } else {
        // 2. If no paper exists, we would typically call the AI generation API here
        // For now, we'll show a message that generation is required
        setError(`No ${difficulty} ${examType} ${module} tests found. AI generation would trigger here.`);
        
        // Example of how we'd trigger generation for writing:
        /*
        if (module === 'writing') {
          const res = await fetch('/api/generate-writing-task', { ... });
          const newPaper = await res.json();
          setPaper(newPaper);
        }
        */
      }
    } catch (err) {
      console.error("Error loading test:", err);
      setError("Failed to load test session");
    } finally {
      setIsLoading(false);
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Generating Your Test...</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Preparing {difficulty} {examType} {module} materials
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <SEO 
        title={`${module ? module.toString().charAt(0).toUpperCase() + module.toString().slice(1) : 'Test'} Session - IELTS Practice`}
        description="Active IELTS practice session"
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">{examType}</Badge>
            <Badge className="capitalize">{difficulty}</Badge>
          </div>
        </div>

        {error ? (
          <Card className="border-red-200 dark:border-red-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="w-5 h-5" />
                Unable to Start Session
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">{error}</p>
              <div className="flex gap-4">
                <Button onClick={() => router.back()}>Return to Dashboard</Button>
                <Button variant="outline" onClick={loadTest}>Try Again</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg text-purple-600 dark:text-purple-400">
                  {getModuleIcon()}
                </div>
                <div>
                  <CardTitle className="capitalize">{module} Test Session</CardTitle>
                  <CardDescription>
                    ID: {paper?.test_id || "New Session"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Instructions</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                  <li>This is a practice mode session.</li>
                  <li>Timing will begin as soon as you click Start.</li>
                  <li>Your answers will be evaluated automatically.</li>
                </ul>
              </div>

              <div className="flex justify-end">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => {
                    // Navigate to the specific practice page with the paper ID or test parameters
                    // For now, we'll route to the existing practice pages, passing the config
                    router.push({
                      pathname: `/practice/${module}`,
                      query: { 
                        examType, 
                        difficulty,
                        testId: paper?.test_id
                      }
                    });
                  }}
                >
                  Start {module} Test
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}