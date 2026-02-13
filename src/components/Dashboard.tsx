import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import {
  Flame,
  TrendingUp,
  BookOpen,
  PenTool,
  Headphones,
  MessageSquare,
  Calendar,
  Award,
  Shield
} from "lucide-react";
import { getStudyStreak, getBandScoreHistory, getRecentPractice } from "@/services/practiceHistoryService";
import Link from "next/link";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardProps {
  userId: string;
}

interface BandScoreData {
  completed_at: string;
  band_score: number;
  module_type: string;
}

interface RecentPractice {
  id: string;
  module_type: string;
  test_type: string;
  completed_at: string;
  band_score: number | null;
  is_evaluated: boolean;
}

export function Dashboard({ userId }: DashboardProps) {
  const [studyStreak, setStudyStreak] = useState<number>(0);
  const [bandScoreData, setBandScoreData] = useState<BandScoreData[]>([]);
  const [recentPractice, setRecentPractice] = useState<RecentPractice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [streak, scoreHistory, recent] = await Promise.all([
        getStudyStreak(userId),
        getBandScoreHistory(userId),
        getRecentPractice(userId, 5)
      ]);

      setStudyStreak(streak);
      setBandScoreData(scoreHistory);
      setRecentPractice(recent);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare chart data
  const chartData = {
    labels: bandScoreData.map(item => 
      new Date(item.completed_at).toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric" 
      })
    ),
    datasets: [
      {
        label: "Band Score",
        data: bandScoreData.map(item => item.band_score),
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: "rgb(99, 102, 241)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
          weight: "bold" as const
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context: any) {
            return `Band Score: ${context.parsed.y.toFixed(1)}`;
          }
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 9,
        ticks: {
          stepSize: 1,
          callback: function(value: any) {
            return value.toFixed(1);
          }
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)"
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case "reading": return <BookOpen className="w-4 h-4" />;
      case "writing": return <PenTool className="w-4 h-4" />;
      case "listening": return <Headphones className="w-4 h-4" />;
      case "speaking": return <MessageSquare className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getModuleColor = (module: string) => {
    switch (module) {
      case "reading": return "bg-blue-100 text-blue-700";
      case "writing": return "bg-green-100 text-green-700";
      case "listening": return "bg-purple-100 text-purple-700";
      case "speaking": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Study Streak and Latest Score */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Study Streak Card */}
        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 px-4 sm:px-6">
          <CardHeader className="px-0">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
              <span className="text-sm sm:text-base">Study Streak</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="text-center">
              <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                {studyStreak}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {studyStreak === 1 ? "day" : "days"} in a row
              </p>
              {studyStreak >= 7 && (
                <p className="text-xs sm:text-sm font-semibold text-orange-600 dark:text-orange-400 mt-2">
                  🔥 Amazing! You&apos;re on fire!
                </p>
              )}
              {studyStreak >= 3 && studyStreak < 7 && (
                <p className="text-xs sm:text-sm font-semibold text-orange-600 dark:text-orange-400 mt-2">
                  💪 Great consistency!
                </p>
              )}
              {studyStreak > 0 && studyStreak < 3 && (
                <p className="text-xs sm:text-sm font-semibold text-orange-600 dark:text-orange-400 mt-2">
                  👍 Keep it up!
                </p>
              )}
              {studyStreak === 0 && (
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Start practicing today!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Latest Band Score */}
        <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 px-4 sm:px-6">
          <CardHeader className="px-0">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm sm:text-base">Latest Band Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            {bandScoreData.length > 0 ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-indigo-600">
                    {bandScoreData[bandScoreData.length - 1].band_score.toFixed(1)}
                  </span>
                  <span className="text-2xl text-indigo-500">/ 9.0</span>
                </div>
                <p className="mt-4 text-sm text-gray-600 capitalize">
                  {bandScoreData[bandScoreData.length - 1].module_type} • {new Date(bandScoreData[bandScoreData.length - 1].completed_at).toLocaleDateString()}
                </p>
              </>
            ) : (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-400">--</span>
                  <span className="text-2xl text-gray-400">/ 9.0</span>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Complete an evaluated test to see your score
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Band Score Progress Chart */}
      <Card className="md:col-span-2 lg:col-span-3 px-4 sm:px-6">
        <CardHeader className="px-0">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
            <span className="text-sm sm:text-base">Band Score Progress</span>
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Track your improvement over time
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          {bandScoreData.length > 0 ? (
            <div className="h-[300px]">
              <Line data={chartData} options={chartOptions} />
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No band score data yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Complete evaluated tests to see your progress
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Practice Activity */}
      <Card className="md:col-span-2 lg:col-span-3 px-4 sm:px-6">
        <CardHeader className="px-0">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
            <span className="text-sm sm:text-base">Recent Activity</span>
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Your latest practice sessions
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          {recentPractice.length > 0 ? (
            <div className="space-y-3">
              {recentPractice.map((practice) => (
                <div 
                  key={practice.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getModuleColor(practice.module_type)}`}>
                      {getModuleIcon(practice.module_type)}
                    </div>
                    <div>
                      <p className="font-medium capitalize">
                        {practice.module_type} - {practice.test_type}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(practice.completed_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {practice.is_evaluated && practice.band_score !== null ? (
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-indigo-500" />
                        <span className="font-semibold text-indigo-600">
                          {practice.band_score.toFixed(1)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Not evaluated</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No practice history yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Start practicing to see your activity here
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Logo and Copyright */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">IE</span>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  IELTS Practice
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  © 2026 All rights reserved
                </p>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link 
                href="/privacy" 
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                <Shield className="w-4 h-4" />
                Privacy Policy
              </Link>
              <a 
                href="mailto:nupurielts@gmail.com" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-center text-gray-500 dark:text-gray-500">
              Your data is securely stored using <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">Supabase</a> with industry-standard encryption
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}