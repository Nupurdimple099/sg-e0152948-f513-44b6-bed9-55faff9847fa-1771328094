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
  Award
} from "lucide-react";
import { getStudyStreak, getBandScoreHistory, getRecentPractice } from "@/services/practiceHistoryService";

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
    <div className="space-y-6">
      {/* Study Streak and Latest Score */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Study Streak Card */}
        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Flame className="w-5 h-5" />
              Study Streak
            </CardTitle>
            <CardDescription>Keep the momentum going!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-orange-600">{studyStreak}</span>
              <span className="text-2xl text-orange-500">{studyStreak === 1 ? "day" : "days"}</span>
            </div>
            {studyStreak > 0 ? (
              <p className="mt-4 text-sm text-gray-600">
                {studyStreak >= 7 
                  ? "🔥 Amazing! You're on fire!" 
                  : studyStreak >= 3 
                    ? "💪 Great consistency!" 
                    : "👍 Keep it up!"}
              </p>
            ) : (
              <p className="mt-4 text-sm text-gray-600">
                Start practicing today to begin your streak!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Latest Band Score */}
        <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-700">
              <Award className="w-5 h-5" />
              Latest Band Score
            </CardTitle>
            <CardDescription>Your most recent evaluation</CardDescription>
          </CardHeader>
          <CardContent>
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Band Score Progress
          </CardTitle>
          <CardDescription>
            Track your improvement over time
          </CardDescription>
        </CardHeader>
        <CardContent>
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent Practice Activity
          </CardTitle>
          <CardDescription>Your last 5 practice sessions</CardDescription>
        </CardHeader>
        <CardContent>
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
    </div>
  );
}