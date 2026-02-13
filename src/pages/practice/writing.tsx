import { SEO } from "@/components/SEO";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, FileText, Target, Sparkles, Info, Maximize2, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Task1Data {
  type: 'line' | 'bar' | 'pie' | 'table' | 'process' | 'map';
  title: string;
  prompt: string;
  chartData?: any;
}

export default function WritingPractice() {
  const [testType, setTestType] = useState<"academic" | "general">("academic");
  const [taskType, setTaskType] = useState<"task1" | "task2">("task1");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("6.5-7.0");
  const [generatedTest, setGeneratedTest] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const topics = [
    "Urbanization and Housing",
    "Technology and Communication",
    "Education Systems",
    "Environmental Issues",
    "Health and Lifestyle",
    "Employment and Careers",
    "Transportation",
    "Energy Consumption",
    "Tourism and Travel",
    "Demographics and Population"
  ];

  const difficultyLevels = [
    { value: "5.0-5.5", label: "Band 5.0-5.5 (Intermediate)" },
    { value: "6.0-6.5", label: "Band 6.0-6.5 (Upper-Intermediate)" },
    { value: "6.5-7.0", label: "Band 6.5-7.0 (Advanced)" },
    { value: "7.0-7.5", label: "Band 7.0-7.5 (Proficient)" },
    { value: "7.5-8.0", label: "Band 7.5-8.0 (Expert)" }
  ];

  const generateTask1Data = (selectedTopic: string): Task1Data => {
    const chartTypes: Task1Data['type'][] = ['line', 'bar', 'pie', 'table', 'process', 'map'];
    const randomType = chartTypes[Math.floor(Math.random() * chartTypes.length)];

    // Generate data based on topic and chart type
    if (randomType === 'line') {
      return {
        type: 'line',
        title: `Trends in ${selectedTopic} (2015-2024)`,
        prompt: `The line graph below shows trends in ${selectedTopic.toLowerCase()} over a 10-year period from 2015 to 2024.\n\nSummarize the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.`,
        chartData: {
          labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
          datasets: [
            {
              label: 'Country A',
              data: [45, 52, 58, 65, 72, 68, 75, 82, 88, 95],
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.3,
              fill: true
            },
            {
              label: 'Country B',
              data: [62, 58, 55, 52, 48, 45, 50, 55, 60, 65],
              borderColor: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              tension: 0.3,
              fill: true
            }
          ]
        }
      };
    } else if (randomType === 'bar') {
      return {
        type: 'bar',
        title: `Comparison of ${selectedTopic} Across Regions`,
        prompt: `The bar chart below compares ${selectedTopic.toLowerCase()} across different regions in 2024.\n\nSummarize the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.`,
        chartData: {
          labels: ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'],
          datasets: [
            {
              label: '2023',
              data: [85, 72, 95, 48, 35, 42],
              backgroundColor: 'rgba(59, 130, 246, 0.7)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 2
            },
            {
              label: '2024',
              data: [92, 78, 105, 55, 42, 48],
              backgroundColor: 'rgba(16, 185, 129, 0.7)',
              borderColor: 'rgb(16, 185, 129)',
              borderWidth: 2
            }
          ]
        }
      };
    } else if (randomType === 'pie') {
      return {
        type: 'pie',
        title: `Distribution of ${selectedTopic} by Category`,
        prompt: `The pie chart below shows the distribution of ${selectedTopic.toLowerCase()} across different categories in 2024.\n\nSummarize the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.`,
        chartData: {
          labels: ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'],
          datasets: [
            {
              data: [35, 25, 20, 12, 8],
              backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)',
                'rgba(168, 85, 247, 0.8)'
              ],
              borderColor: [
                'rgb(59, 130, 246)',
                'rgb(16, 185, 129)',
                'rgb(245, 158, 11)',
                'rgb(239, 68, 68)',
                'rgb(168, 85, 247)'
              ],
              borderWidth: 2
            }
          ]
        }
      };
    } else if (randomType === 'table') {
      return {
        type: 'table',
        title: `${selectedTopic} Statistics Table`,
        prompt: `The table below presents data on ${selectedTopic.toLowerCase()} across three different years.\n\n| Year | Urban Areas | Rural Areas | National Average |\n|------|-------------|-------------|------------------|\n| 2020 | 72% | 45% | 58% |\n| 2022 | 78% | 52% | 65% |\n| 2024 | 85% | 58% | 72% |\n\nSummarize the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.`
      };
    } else if (randomType === 'process') {
      return {
        type: 'process',
        title: `${selectedTopic} Process Diagram`,
        prompt: `The diagram below illustrates the process involved in ${selectedTopic.toLowerCase()}.\n\nSummarize the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.\n\n[Process Stages]\n1. Initial Stage → 2. Development Phase → 3. Implementation → 4. Evaluation → 5. Final Outcome`
      };
    } else {
      return {
        type: 'map',
        title: `${selectedTopic} - Location Map Comparison`,
        prompt: `The maps below show the changes in ${selectedTopic.toLowerCase()} between 2010 and 2024.\n\nSummarize the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.\n\n[Map descriptions would typically show spatial changes, development areas, and infrastructure modifications]`
      };
    }
  };

  const generateTask1Academic = (level: string, selectedTopic: string) => {
    const task1Data = generateTask1Data(selectedTopic);
    
    return {
      taskType: "task1",
      testType: "academic",
      topic: selectedTopic,
      difficulty: level,
      chartData: task1Data,
      prompt: task1Data.prompt,
      requirements: [
        "Write at least 150 words",
        "Spend about 20 minutes on this task",
        "Describe the main features and trends",
        "Make relevant comparisons",
        "Use appropriate vocabulary and grammar"
      ],
      modelAnswer: {
        introduction: "Begin by paraphrasing the question and stating what the visual data shows overall.",
        overview: "Provide 2-3 sentences summarizing the most significant trends or features without specific data.",
        bodyParagraph1: "Describe the first main feature or trend in detail, using specific figures and making comparisons.",
        bodyParagraph2: "Describe the second main feature or trend, again with specific data and comparisons.",
        conclusion: "Task 1 does not require a conclusion. End with the final body paragraph.",
        sampleOpening: `The ${task1Data.type} chart illustrates ${selectedTopic.toLowerCase()} over a specific time period. Overall, it is evident that...`,
        examinerTip: "Focus on accuracy of data description and clear organization. Avoid giving opinions or reasons for the trends."
      },
      assessmentCriteria: {
        taskAchievement: "Clear overview of main trends/features, appropriate selection of key information, accurate data description",
        coherenceCohesion: "Logical organization, clear progression, appropriate paragraphing, effective use of cohesive devices",
        lexicalResource: "Appropriate vocabulary for data description, accurate word choice, some flexibility and precision",
        grammaticalRange: "Mix of simple and complex sentence structures, good control of grammar, minimal errors"
      },
      bandScoreGuidance: {
        "5.0-5.5": "Basic description with some inaccuracies, limited range of vocabulary and structures",
        "6.0-6.5": "Clear overview with relevant details, adequate vocabulary, generally good grammar with some errors",
        "6.5-7.0": "Clear, well-organized response covering key features, good vocabulary range, mostly accurate grammar",
        "7.0-7.5": "Detailed, accurate description with clear trends, flexible vocabulary use, wide range of structures",
        "7.5-8.0": "Highly detailed and accurate, sophisticated vocabulary, full range of structures with rare errors"
      }
    };
  };

  const generateTask1General = (level: string, selectedTopic: string) => {
    const situations = [
      {
        topic: "Complaint to landlord",
        prompt: "You are experiencing problems with the heating system in your rented apartment. Write a letter to your landlord. In your letter:\n\n• Explain the problem with the heating\n• Describe the inconvenience this is causing\n• Request immediate action to resolve the issue"
      },
      {
        topic: "Request to manager",
        prompt: "You need to take time off work to attend a family event. Write a letter to your manager. In your letter:\n\n• Explain the reason for your absence\n• State the dates you need off\n• Offer to complete urgent tasks before leaving"
      },
      {
        topic: "Thank you letter",
        prompt: "You recently attended a training course for work and found it very useful. Write a letter to your friend who is also interested in the course. In your letter:\n\n• Describe what the course was about\n• Explain why it was useful to you\n• Recommend the course to your friend"
      }
    ];

    const situation = situations[Math.floor(Math.random() * situations.length)];

    return {
      taskType: "task1",
      testType: "general",
      topic: situation.topic,
      difficulty: level,
      prompt: situation.prompt,
      requirements: [
        "Write at least 150 words",
        "Spend about 20 minutes on this task",
        "Use appropriate tone and register",
        "Address all three bullet points",
        "Use proper letter format"
      ],
      modelAnswer: {
        format: "Dear [Name/Sir/Madam],\n\n[Opening paragraph]\n\n[Body paragraphs addressing each bullet point]\n\n[Closing paragraph]\n\nYours [sincerely/faithfully],\n[Your name]",
        tone: "The tone should be appropriate to the relationship (formal, semi-formal, or informal).",
        examinerTip: "Make sure to address all three bullet points clearly and use appropriate letter conventions."
      },
      assessmentCriteria: {
        taskAchievement: "All bullet points addressed, appropriate tone, clear purpose, adequate length",
        coherenceCohesion: "Logical organization, clear paragraphing, appropriate cohesive devices",
        lexicalResource: "Appropriate vocabulary for the task, correct word choice, some range and flexibility",
        grammaticalRange: "Mix of sentence structures, good grammar control, minimal errors"
      }
    };
  };

  const generateTask2 = (level: string, selectedTopic: string) => {
    const prompts = [
      {
        topic: "Technology and Society",
        question: "Some people believe that technology has made our lives more complex, while others think it has simplified our daily routines. Discuss both views and give your own opinion."
      },
      {
        topic: "Education",
        question: "Many people argue that traditional classroom learning is becoming obsolete in the digital age. To what extent do you agree or disagree with this statement?"
      },
      {
        topic: "Environment",
        question: "Some people think that environmental problems are too big for individuals to solve, and that only governments and large companies can make a difference. To what extent do you agree or disagree?"
      },
      {
        topic: "Work and Career",
        question: "In many countries, people are working longer hours and taking fewer holidays. Discuss the advantages and disadvantages of this trend."
      },
      {
        topic: "Health",
        question: "Prevention is better than cure. Out of a country's health budget, a large proportion should be diverted from treatment to spending on health education and preventative measures. To what extent do you agree or disagree with this statement?"
      }
    ];

    const selectedPrompt = prompts.find(p => p.topic.toLowerCase().includes(selectedTopic.toLowerCase())) 
                          || prompts[Math.floor(Math.random() * prompts.length)];

    return {
      taskType: "task2",
      topic: selectedPrompt.topic,
      difficulty: level,
      prompt: selectedPrompt.question,
      requirements: [
        "Write at least 250 words",
        "Spend about 40 minutes on this task",
        "Present a clear position throughout",
        "Support ideas with relevant examples",
        "Use formal academic style"
      ],
      modelAnswer: {
        structure: "Introduction (2-3 sentences) → Body Paragraph 1 (main argument) → Body Paragraph 2 (counter-argument or second point) → Conclusion (2-3 sentences)",
        introduction: "Paraphrase the question and clearly state your position/thesis.",
        bodyParagraphs: "Each paragraph should have: Topic sentence → Explanation → Example/Evidence → Link to question",
        conclusion: "Summarize main points and restate your position clearly.",
        sampleOpening: "In recent years, there has been considerable debate regarding... While some argue that..., I believe that...",
        examinerTip: "Develop your ideas fully with specific examples. Avoid listing points without explanation."
      },
      assessmentCriteria: {
        taskResponse: "Clear position throughout, all parts of question addressed, well-developed ideas, relevant examples",
        coherenceCohesion: "Logical organization, clear progression, effective paragraphing, skillful use of cohesive devices",
        lexicalResource: "Wide range of vocabulary, accurate word choice, appropriate style, skillful use of collocations",
        grammaticalRange: "Wide range of structures, full flexibility and accuracy, error-free sentences"
      },
      bandScoreGuidance: {
        "5.0-5.5": "Basic position stated, limited development, repetitive vocabulary, frequent grammatical errors",
        "6.0-6.5": "Clear position with relevant ideas, adequate vocabulary, generally accurate grammar with some errors",
        "6.5-7.0": "Well-developed position, good vocabulary range, variety of structures, mostly error-free",
        "7.0-7.5": "Fully developed position with sophisticated ideas, flexible vocabulary, wide range of structures",
        "7.5-8.0": "Highly sophisticated argumentation, precise vocabulary, full grammatical control, rare minor errors"
      }
    };
  };

  const generateTest = () => {
    if (!topic) {
      alert("Please select a topic");
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      let test;
      if (taskType === "task1") {
        test = testType === "academic" 
          ? generateTask1Academic(difficulty, topic)
          : generateTask1General(difficulty, topic);
      } else {
        test = generateTask2(difficulty, topic);
      }
      
      setGeneratedTest(test);
      setIsGenerating(false);
    }, 1500);
  };

  const renderChart = () => {
    if (!generatedTest?.chartData || generatedTest.testType !== 'academic' || generatedTest.taskType !== 'task1') {
      return null;
    }

    const { type, title, chartData } = generatedTest.chartData;

    const commonOptions = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            font: {
              size: 12,
              family: 'Inter'
            }
          }
        },
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
            weight: 'bold' as const,
            family: 'Inter'
          },
          padding: 20
        }
      }
    };

    if (type === 'line') {
      return (
        <Line 
          data={chartData} 
          options={{
            ...commonOptions,
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)'
                }
              },
              x: {
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)'
                }
              }
            }
          }} 
        />
      );
    } else if (type === 'bar') {
      return (
        <Bar 
          data={chartData} 
          options={{
            ...commonOptions,
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)'
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            }
          }} 
        />
      );
    } else if (type === 'pie') {
      return (
        <Pie 
          data={chartData} 
          options={{
            ...commonOptions,
            plugins: {
              ...commonOptions.plugins,
              legend: {
                position: 'right' as const,
                labels: {
                  font: {
                    size: 12,
                    family: 'Inter'
                  },
                  padding: 15
                }
              }
            }
          }} 
        />
      );
    }

    return null;
  };

  const exportChartAsImage = () => {
    if (chartRef.current) {
      const canvas = chartRef.current.querySelector('canvas');
      if (canvas) {
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'ielts-task1-chart.png';
        link.href = url;
        link.click();
      }
    }
  };

  const openFullScreen = () => {
    setIsFullScreen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
  };

  return (
    <>
      <SEO 
        title="IELTS Writing Practice Test Generator - Academic & General Training"
        description="Generate authentic IELTS Writing practice tests with Task 1 (Academic/General) and Task 2 essay prompts. Includes dynamic charts, model answers, and expert examiner feedback."
      />

      {/* Full-Screen Chart Modal */}
      {isFullScreen && generatedTest?.chartData && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeFullScreen}
        >
          <div className="relative max-w-7xl w-full max-h-[90vh] bg-white rounded-xl shadow-2xl p-8">
            <button
              onClick={closeFullScreen}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-all hover:rotate-90 duration-300"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {generatedTest.chartData.title}
              </h3>
              <p className="text-sm text-gray-500 mt-2">Full-Screen View - Click outside to close</p>
            </div>
            
            <div 
              className="bg-gray-50 rounded-lg p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {renderChart()}
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Writing Practice
                  </h1>
                  <p className="text-sm text-gray-500">Task 1 & Task 2 Generator</p>
                </div>
              </div>
              <Link
                href="/"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              <strong>Senior IELTS Examiner:</strong> Generate authentic IELTS Writing tasks with detailed model answers and assessment criteria. Task 1 Academic includes dynamic charts that match the question data.
            </AlertDescription>
          </Alert>

          {/* Test Configuration */}
          <Card className="p-6 mb-6 bg-white shadow-lg border-0 ring-1 ring-gray-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Configure Your Writing Test
            </h2>

            <Tabs value={testType} onValueChange={(v) => setTestType(v as "academic" | "general")} className="mb-4">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="general">General Training</TabsTrigger>
              </TabsList>
            </Tabs>

            <Tabs value={taskType} onValueChange={(v) => setTaskType(v as "task1" | "task2")} className="mb-4">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="task1">Task 1 (150 words)</TabsTrigger>
                <TabsTrigger value="task2">Task 2 (250 words)</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Topic Category
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a topic...</option>
                  {topics.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Target Band Score
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {difficultyLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              onClick={generateTest}
              disabled={isGenerating || !topic}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all"
            >
              {isGenerating ? (
                <>Generating Test...</>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate {taskType === "task1" ? "Task 1" : "Task 2"} Test
                </>
              )}
            </Button>
          </Card>

          {/* Generated Test */}
          {generatedTest && (
            <Card className="p-6 bg-white shadow-lg border-0 ring-1 ring-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    IELTS {generatedTest.testType === "academic" ? "Academic" : "General Training"} Writing {generatedTest.taskType === "task1" ? "Task 1" : "Task 2"}
                  </h2>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="border-blue-200 text-blue-700">
                      {generatedTest.topic}
                    </Badge>
                    <Badge variant="outline" className="border-green-200 text-green-700">
                      Band {generatedTest.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Chart Display for Academic Task 1 */}
              {generatedTest.chartData && generatedTest.testType === 'academic' && generatedTest.taskType === 'task1' && (
                <div className="mb-6">
                  <Alert className="mb-4 border-blue-200 bg-blue-50">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-900">
                      The chart below has been generated to match the data described in your Task 1 prompt. Click on the chart to view it in full-screen mode for detailed analysis.
                    </AlertDescription>
                  </Alert>

                  <div 
                    ref={chartRef}
                    className="bg-white border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-blue-400 transition-all hover:shadow-xl group relative"
                    onClick={openFullScreen}
                  >
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Maximize2 className="w-4 h-4" />
                        <span className="font-medium">Click to expand</span>
                      </div>
                    </div>
                    {renderChart()}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600/10 to-transparent p-4 rounded-b-lg">
                      <p className="text-sm text-gray-600 font-medium">
                        {generatedTest.chartData.type.charAt(0).toUpperCase() + generatedTest.chartData.type.slice(1)} Chart - IELTS Academic Writing Task 1
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Task Prompt */}
              <div className="bg-gray-50 border-l-4 border-blue-600 p-6 rounded-r-lg mb-6">
                <h3 className="font-semibold text-lg mb-3 text-gray-900">Task Instructions:</h3>
                <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                  {generatedTest.prompt}
                </p>
              </div>

              {/* Requirements */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Requirements:
                </h3>
                <ul className="space-y-2">
                  {generatedTest.requirements.map((req: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Model Answer Structure */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-lg mb-6">
                <h3 className="font-semibold text-lg mb-4 text-blue-900">Model Answer Structure:</h3>
                <div className="space-y-4">
                  {Object.entries(generatedTest.modelAnswer).map(([key, value]) => (
                    <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-medium text-blue-800 mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{value as string}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assessment Criteria */}
              <div className="bg-white border border-gray-200 p-6 rounded-lg mb-6">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">Assessment Criteria:</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(generatedTest.assessmentCriteria).map(([criterion, description]) => (
                    <div key={criterion} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-700 mb-2 capitalize">
                        {criterion.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <p className="text-gray-600 text-sm">{description as string}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Band Score Guidance */}
              {generatedTest.bandScoreGuidance && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-4 text-green-900">Band Score Guidance:</h3>
                  <div className="space-y-3">
                    {Object.entries(generatedTest.bandScoreGuidance).map(([band, guidance]) => (
                      <div key={band} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-green-700">Band {band}</span>
                          <Badge variant="outline" className="border-green-300 text-green-700">
                            {band === difficulty ? "Your Target" : "Reference"}
                          </Badge>
                        </div>
                        <p className="text-gray-700 text-sm">{guidance as string}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </>
  );
}