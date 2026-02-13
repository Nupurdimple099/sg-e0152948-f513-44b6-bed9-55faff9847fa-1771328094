import { useState, useEffect, useRef } from "react";
import { SEO } from "@/components/SEO";
import Link from "next/link";
import { ArrowLeft, Play, Pause, Volume2, FileText, CheckCircle, XCircle, Award, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getAllListeningTests,
  getListeningTestById,
  evaluateListeningTest,
  saveListeningTestResult,
  type ListeningTestData,
  type ListeningQuestion,
  type UserAnswer,
  type EvaluationResult
} from "@/services/listeningService";
import { supabase } from "@/integrations/supabase/client";

export default function ListeningPractice() {
  const [tests, setTests] = useState<any[]>([]);
  const [selectedTest, setSelectedTest] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Map<number, string>>(new Map());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState<{
    results: EvaluationResult[];
    totalPoints: number;
    earnedPoints: number;
    bandScore: number;
  } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [audioError, setAudioError] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Check if audio URL is missing or invalid
  const hasValidAudio = selectedTest?.audio_url && selectedTest.audio_url.trim() !== "" && !selectedTest.audio_url.includes("placeholder");

  // Sample transcript for when audio is missing
  const SAMPLE_TRANSCRIPT = `Welcome to this IELTS Listening practice test. This is a sample transcript that demonstrates how the interface works.

Section 1: You will hear a conversation between a student and a university administrator about accommodation options.

Administrator: Good morning! How can I help you today?
Student: Hi, I'm looking for information about student accommodation for next semester.
Administrator: Certainly! We have several options available. Are you interested in on-campus or off-campus housing?
Student: I think I'd prefer on-campus housing if possible.

Section 2: You will hear a guide describing the features of a new science museum.

Guide: Welcome everyone to the opening of our new Interactive Science Museum. The museum features four main zones: The Discovery Zone, Space Exploration, Marine Biology, and the Innovation Lab. Each zone has been designed to provide hands-on learning experiences for visitors of all ages.

Section 3: You will hear a discussion between two students and their professor about a research project.

Professor: So, tell me about your progress on the renewable energy project.
Student 1: We've been focusing on solar panel efficiency in different weather conditions.
Student 2: Yes, and we've collected data from three different locations over the past month.

Section 4: You will hear a lecture about urban planning and sustainable cities.

Lecturer: Today, we'll explore how modern urban planning incorporates sustainability principles. Successful sustainable cities balance economic growth, environmental protection, and social equity. Let's examine three key strategies that cities worldwide are implementing...`;

  // Fetch user session
  useEffect(() => {
    async function fetchUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
      }
    }
    fetchUser();
  }, []);

  // Fetch listening tests
  useEffect(() => {
    async function fetchTests() {
      try {
        const data = await getAllListeningTests();
        setTests(data);
        if (data.length > 0) {
          setSelectedTest(data[0]);
        }
      } catch (error) {
        console.error("Error loading tests:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTests();
  }, []);

  // Audio player controls
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !hasValidAudio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      setAudioError(true);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [selectedTest, hasValidAudio]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !hasValidAudio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        setAudioError(true);
        setIsPlaying(false);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (questionNumber: number, answer: string) => {
    setUserAnswers(new Map(userAnswers.set(questionNumber, answer)));
  };

  const handleSubmit = async () => {
    if (!selectedTest) return;

    const questionsData: ListeningTestData = selectedTest.questions_json;
    const userAnswerArray: UserAnswer[] = Array.from(userAnswers.entries()).map(([question_number, user_answer]) => ({
      question_number,
      user_answer
    }));

    const results = evaluateListeningTest(questionsData, userAnswerArray);
    setEvaluationResults(results);
    setIsSubmitted(true);

    // Save to database if user is logged in
    if (userId) {
      try {
        await saveListeningTestResult(
          userId,
          selectedTest.test_title,
          selectedTest.difficulty,
          results,
          userAnswerArray,
          questionsData
        );
      } catch (error) {
        console.error("Error saving results:", error);
      }
    }

    // Scroll to results
    setTimeout(() => {
      document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const resetTest = () => {
    setUserAnswers(new Map());
    setIsSubmitted(false);
    setEvaluationResults(null);
    setCurrentTime(0);
    setShowTranscript(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
      setIsPlaying(false);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <>
        <SEO
          title="IELTS Listening Practice - Interactive Audio Tests"
          description="Practice IELTS Listening with authentic audio materials and automatic scoring"
        />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <Skeleton className="h-8 w-48 mb-6" />
            <Skeleton className="h-64 w-full mb-6" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </>
    );
  }

  if (!selectedTest) {
    return (
      <>
        <SEO title="IELTS Listening Practice" />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <Alert>
              <AlertDescription>No listening tests available. Please check back later.</AlertDescription>
            </Alert>
          </div>
        </div>
      </>
    );
  }

  const questionsData: ListeningTestData = selectedTest.questions_json;

  return (
    <>
      <SEO
        title={`IELTS Listening Practice - ${selectedTest.test_title}`}
        description="Practice IELTS Listening with authentic audio materials and automatic scoring"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
        {/* Sticky Audio Player */}
        <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-4 max-w-6xl">
            <div className="flex items-center gap-4 flex-wrap">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              
              {!hasValidAudio || audioError ? (
                <Alert className="flex-1 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <AlertDescription className="text-amber-800 dark:text-amber-200">
                    <strong>Audio content is being updated, check back soon!</strong>
                    <br />
                    <span className="text-sm">You can still explore the interface and see a sample transcript below.</span>
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={togglePlayPause}
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    
                    <div className="flex-1 flex items-center gap-2">
                      <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[35px]">
                        {formatTime(currentTime)}
                      </span>
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, rgb(99, 102, 241) 0%, rgb(99, 102, 241) ${(currentTime / duration) * 100}%, rgb(229, 231, 235) ${(currentTime / duration) * 100}%, rgb(229, 231, 235) 100%)`
                        }}
                      />
                      <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[35px]">
                        {formatTime(duration)}
                      </span>
                    </div>
                    
                    <Volume2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hidden audio element */}
        {hasValidAudio && !audioError && (
          <audio ref={audioRef} src={selectedTest.audio_url} preload="metadata" />
        )}

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Test Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {selectedTest.test_title}
            </h1>
            <div className="flex items-center gap-4 flex-wrap text-sm text-gray-600 dark:text-gray-400">
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                Band Score: {selectedTest.difficulty}
              </span>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                {selectedTest.test_type}
              </span>
              {(!hasValidAudio || audioError) && (
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Demo Mode
                </span>
              )}
            </div>
          </div>

          {/* Transcript Toggle */}
          <Card className="mb-8">
            <CardHeader>
              <Button
                variant="ghost"
                className="w-full justify-between p-4 h-auto"
                onClick={() => setShowTranscript(!showTranscript)}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  <span className="font-semibold">
                    {(!hasValidAudio || audioError) ? "View Sample Transcript" : "View Transcript"}
                  </span>
                  {(!hasValidAudio || audioError) && (
                    <span className="text-xs text-amber-600 dark:text-amber-400">(Demo)</span>
                  )}
                </div>
                {showTranscript ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </Button>
            </CardHeader>
            {showTranscript && (
              <CardContent>
                {(!hasValidAudio || audioError) && (
                  <Alert className="mb-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                    <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
                      This is a sample transcript to demonstrate the interface. Actual test content will include synchronized audio.
                    </AlertDescription>
                  </Alert>
                )}
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {(!hasValidAudio || audioError) ? SAMPLE_TRANSCRIPT : selectedTest.transcript_text}
                  </p>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Questions */}
          <div className="space-y-8">
            {questionsData.sections.map((section) => (
              <Card key={section.section_number}>
                <CardHeader>
                  <CardTitle>Section {section.section_number}: {section.title}</CardTitle>
                  <CardDescription>{section.instructions}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {section.questions.map((question) => (
                    <div
                      key={question.question_number}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        isSubmitted
                          ? evaluationResults?.results.find(r => r.question_number === question.question_number)?.is_correct
                            ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                            : "border-red-500 bg-red-50 dark:bg-red-950/20"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-bold text-lg text-purple-600 dark:text-purple-400 min-w-[30px]">
                          {question.question_number}.
                        </span>
                        <div className="flex-1">
                          <p className="text-gray-900 dark:text-white mb-3 font-medium">
                            {question.question_text}
                          </p>

                          {question.question_type === "gap_fill" && (
                            <Input
                              value={userAnswers.get(question.question_number) || ""}
                              onChange={(e) => handleAnswerChange(question.question_number, e.target.value)}
                              disabled={isSubmitted}
                              placeholder="Type your answer here"
                              className="max-w-md"
                            />
                          )}

                          {question.question_type === "multiple_choice" && question.options && (
                            <RadioGroup
                              value={userAnswers.get(question.question_number) || ""}
                              onValueChange={(value) => handleAnswerChange(question.question_number, value)}
                              disabled={isSubmitted}
                            >
                              {question.options.map((option, index) => {
                                const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                                return (
                                  <div key={index} className="flex items-center space-x-2 mb-2">
                                    <RadioGroupItem value={optionLetter} id={`q${question.question_number}-${index}`} />
                                    <Label htmlFor={`q${question.question_number}-${index}`} className="cursor-pointer">
                                      {optionLetter}. {option}
                                    </Label>
                                  </div>
                                );
                              })}
                            </RadioGroup>
                          )}

                          {isSubmitted && (
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                              {evaluationResults?.results.find(r => r.question_number === question.question_number)?.is_correct ? (
                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                  <CheckCircle className="w-5 h-5" />
                                  <span className="font-medium">Correct!</span>
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                    <XCircle className="w-5 h-5" />
                                    <span className="font-medium">Incorrect</span>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Your answer: <span className="font-medium">{userAnswers.get(question.question_number) || "(No answer)"}</span>
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Correct answer: <span className="font-medium text-green-600 dark:text-green-400">{question.correct_answer}</span>
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Submit Button */}
          {!isSubmitted && (
            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleSubmit}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-8"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Check Answers
              </Button>
            </div>
          )}

          {/* Results Section */}
          {isSubmitted && evaluationResults && (
            <div id="results-section" className="mt-8">
              <Card className="border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-600 rounded-full">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Test Results</CardTitle>
                      <CardDescription>Your performance summary</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Band Score</p>
                      <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                        {evaluationResults.bandScore.toFixed(1)}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Correct Answers</p>
                      <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                        {evaluationResults.results.filter(r => r.is_correct).length}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Questions</p>
                      <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                        {evaluationResults.results.length}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 pt-4">
                    <Button
                      onClick={resetTest}
                      variant="outline"
                      size="lg"
                    >
                      Try Again
                    </Button>
                    <Link href="/history">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      >
                        View History
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
}