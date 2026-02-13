import { SEO } from "@/components/SEO";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  PenTool,
  ArrowLeft,
  FileText,
  Clock,
  Award,
  BookOpen,
  History,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Target,
  ArrowRight,
  Maximize2,
  X,
  BarChart3,
  LineChart,
  PieChart,
  Table as TableIcon,
  MapIcon,
  GitBranch,
  Shuffle,
  Info
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
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
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { AuthModal } from "@/components/AuthModal";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

import { UserMenu } from "@/components/UserMenu";
import { supabase } from "@/integrations/supabase/client";
import { savePracticeAttempt } from "@/services/practiceHistoryService";

interface Task1Data {
  type: 'line' | 'bar' | 'pie' | 'table' | 'process' | 'map';
  title: string;
  prompt: string;
  chartData?: any;
}

export default function WritingPractice() {
  const [testType, setTestType] = useState<"academic" | "general">("academic");
  const [taskNumber, setTaskNumber] = useState<"1" | "2">("1");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("6.5-7.5");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTest, setGeneratedTest] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [chartType, setChartType] = useState<string>("random");
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (userAnswer.trim().split(/\s+/).filter(w => w.length > 0).length < (taskNumber === "1" ? 150 : 250)) {
      setShowEvaluation(false);
    }
  }, [userAnswer, taskNumber]);

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

  const generateTask1Data = (selectedType?: string) => {
    const types = ["line", "bar", "pie", "table", "process", "map"];
    const chartType = selectedType && selectedType !== "random" 
      ? selectedType 
      : types[Math.floor(Math.random() * types.length)];

    if (chartType === "line") {
      return {
        type: 'line',
        title: `Trends in ${topic} (2015-2024)`,
        prompt: `The line graph below shows trends in ${topic.toLowerCase()} over a 10-year period from 2015 to 2024.\n\nSummarize the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.`,
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
    } else if (chartType === 'bar') {
      return {
        type: 'bar',
        title: `Comparison of ${topic} Across Regions`,
        prompt: `The bar chart below compares ${topic.toLowerCase()} across different regions in 2024.\n\nSummarize the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.`,
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
    } else if (chartType === 'pie') {
      return {
        type: 'pie',
        title: `Distribution of ${topic} by Category`,
        prompt: `The pie chart below shows the distribution of ${topic.toLowerCase()} across different categories in 2024.\n\nSummarize the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.`,
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
    } else if (chartType === 'table') {
      return {
        type: 'table',
        title: `${topic} Statistics Table`,
        prompt: `The table below presents data on ${topic.toLowerCase()} across three different years.\n\n| Year | Urban Areas | Rural Areas | National Average |\n|------|-------------|-------------|------------------|\n| 2020 | 72% | 45% | 58% |\n| 2022 | 78% | 52% | 65% |\n| 2024 | 85% | 58% | 72% |\n\nSummarize the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.`
      };
    } else if (chartType === 'process') {
      return {
        type: 'process',
        title: `${topic} Process Diagram`,
        prompt: `The diagram below illustrates the process involved in ${topic.toLowerCase()}.\n\nSummarize the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.\n\n[Process Stages]\n1. Initial Stage → 2. Development Phase → 3. Implementation → 4. Evaluation → 5. Final Outcome`
      };
    } else {
      return {
        type: 'map',
        title: `${topic} - Location Map Comparison`,
        prompt: `The maps below show the changes in ${topic.toLowerCase()} between 2010 and 2024.\n\nSummarize the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.\n\n[Map descriptions would typically show spatial changes, development areas, and infrastructure modifications]`
      };
    }
  };

  const generateTask1Academic = (level: string, selectedTopic: string) => {
    const task1Data = generateTask1Data();
    
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
      alert("Please enter a topic");
      return;
    }

    setIsGenerating(true);
    setShowEvaluation(false);
    setUserAnswer("");
    setEvaluation(null);

    setTimeout(() => {
      if (taskNumber === "1") {
        const task1Data = generateTask1Data(chartType);
        setGeneratedTest({
          taskType: "task1",
          testType: "academic",
          topic: topic,
          difficulty: difficulty,
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
            sampleOpening: `The ${task1Data.type} chart illustrates ${topic.toLowerCase()} over a specific time period. Overall, it is evident that...`,
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
        });
      } else {
        setGeneratedTest(generateTask2(difficulty, topic));
      }
      setIsGenerating(false);

      // Save to history
      if (user) {
        savePracticeAttempt({
          module_type: "writing",
          test_type: taskNumber === "1" ? "task1" : "task2",
          topic: topic,
          difficulty: difficulty,
          test_data: generatedTest
        }).catch(error => console.error("Error saving to Supabase:", error));
      } else {
        const history = JSON.parse(localStorage.getItem("ielts_practice_history") || "[]");
        history.unshift({
          id: Date.now().toString(),
          module_type: "writing",
          test_type: taskNumber === "1" ? "task1" : "task2",
          topic: topic,
          difficulty: difficulty,
          completed_at: new Date().toISOString(),
        });
        localStorage.setItem("ielts_practice_history", JSON.stringify(history));
      }
    }, 1500);
  };

  const evaluateAnswer = () => {
    if (!userAnswer.trim()) {
      alert("Please write your answer before evaluation.");
      return;
    }

    if (userAnswer.trim().split(/\s+/).filter(w => w.length > 0).length < (taskNumber === "1" ? 150 : 250)) {
      alert("Your answer should be at least 150 words for Task 1 or 250 words for Task 2.");
      return;
    }

    setIsEvaluating(true);
    setShowEvaluation(false);

    // Simulate AI evaluation with comprehensive feedback
    setTimeout(() => {
      const wordCount = userAnswer.trim().split(/\s+/).filter(w => w.length > 0).length;
      const sentences = userAnswer.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const avgWordsPerSentence = wordCount / sentences.length;
      
      // Analyze vocabulary sophistication
      const commonWords = ["the", "a", "an", "is", "are", "was", "were", "have", "has", "had", "do", "does", "did"];
      const words = userAnswer.toLowerCase().match(/\b[a-z]+\b/g) || [];
      const uniqueWords = new Set(words.filter(w => !commonWords.includes(w)));
      const lexicalDiversity = (uniqueWords.size / words.length) * 100;
      
      // Detect sophisticated vocabulary
      const sophisticatedWords = [
        "furthermore", "moreover", "consequently", "nevertheless", "notwithstanding",
        "substantial", "significant", "considerable", "demonstrate", "illustrate",
        "infrastructure", "phenomenon", "paramount", "mitigate", "comprehensive"
      ];
      const usedSophisticated = words.filter(w => sophisticatedWords.includes(w));
      
      // Calculate estimated band scores
      const taskScore = wordCount >= (taskNumber === "1" ? 150 : 250) ? 7.0 : 6.0;
      const coherenceScore = avgWordsPerSentence > 15 && avgWordsPerSentence < 25 ? 7.0 : 6.5;
      const lexicalScore = lexicalDiversity > 40 ? 7.0 : lexicalDiversity > 30 ? 6.5 : 6.0;
      const grammarScore = sentences.length > 8 ? 7.0 : 6.5;
      const overallScore = ((taskScore + coherenceScore + lexicalScore + grammarScore) / 4).toFixed(1);

      const evaluationResult = {
        overallBand: parseFloat(overallScore),
        wordCount,
        criteria: {
          taskAchievement: {
            score: taskScore,
            feedback: wordCount >= (taskNumber === "1" ? 150 : 250)
              ? "You have adequately addressed the task requirements with sufficient detail."
              : "Your response is slightly under the recommended word count. Aim to provide more detailed examples and explanations.",
            strengths: [
              "Clear understanding of the task",
              "Relevant content provided"
            ],
            improvements: [
              "Add more specific examples to support your arguments",
              "Ensure all parts of the question are fully addressed"
            ]
          },
          coherenceCohesion: {
            score: coherenceScore,
            feedback: avgWordsPerSentence > 15 && avgWordsPerSentence < 25
              ? "Your writing flows logically with good use of cohesive devices."
              : "Consider varying your sentence length for better readability.",
            strengths: [
              "Logical progression of ideas",
              "Appropriate paragraphing"
            ],
            improvements: [
              "Use more transitional phrases (Furthermore, In addition, However)",
              "Ensure clear topic sentences in each paragraph",
              "Link ideas between paragraphs more explicitly"
            ]
          },
          lexicalResource: {
            score: lexicalScore,
            feedback: lexicalDiversity > 40
              ? "Good range of vocabulary with some sophisticated words used appropriately."
              : "Your vocabulary is adequate but could be more varied. Try to use more synonyms and less common words.",
            strengths: usedSophisticated.length > 0
              ? [`Good use of words like: ${usedSophisticated.slice(0, 3).join(", ")}`]
              : ["Basic vocabulary used correctly"],
            improvements: [
              "Replace common words with more academic alternatives (e.g., 'show' → 'demonstrate', 'important' → 'significant')",
              "Use more topic-specific vocabulary",
              "Incorporate collocations (e.g., 'make progress', 'take measures', 'raise awareness')",
              "Avoid repetition by using synonyms"
            ],
            vocabularySuggestions: {
              basic: ["good", "bad", "big", "small", "many", "some"],
              advanced: ["beneficial/advantageous", "detrimental/adverse", "substantial/considerable", "minimal/negligible", "numerous/abundant", "certain/particular"]
            }
          },
          grammaticalRange: {
            score: grammarScore,
            feedback: sentences.length > 8
              ? "You demonstrate a good range of grammatical structures."
              : "Try to use more complex sentence structures to demonstrate grammatical range.",
            strengths: [
              "Generally accurate use of basic structures",
              "Good control of simple and compound sentences"
            ],
            improvements: [
              "Use more complex sentences (relative clauses, conditionals)",
              "Vary sentence beginnings (e.g., start with adverbs, participles)",
              "Include passive voice where appropriate",
              "Use perfect tenses to show time relationships"
            ]
          }
        },
        detailedSuggestions: [
          "📚 **Vocabulary Enhancement**: Replace common words with academic alternatives. For example, use 'substantial' instead of 'big', 'demonstrate' instead of 'show'.",
          "🔗 **Cohesive Devices**: Add more linking words like 'Furthermore', 'Moreover', 'Consequently' to connect your ideas smoothly.",
          "📝 **Sentence Variety**: Mix simple, compound, and complex sentences. Start some sentences with dependent clauses or phrases.",
          "🎯 **Task Response**: Ensure you address all parts of the question. Provide specific examples to support your points.",
          "✅ **Grammar Practice**: Work on using conditional sentences, relative clauses, and passive constructions to show grammatical range."
        ],
        nextSteps: [
          "Practice writing with a timer to improve speed",
          "Read sample band 8-9 essays to see advanced structures",
          "Build your academic vocabulary list",
          "Focus on topic-specific vocabulary for common IELTS themes"
        ]
      };

      setEvaluation(evaluationResult);
      setShowEvaluation(true);
      setIsEvaluating(false);

      // Save evaluation to history
      const history = JSON.parse(localStorage.getItem("ielts_practice_history") || "[]");
      history.unshift({
        id: Date.now(),
        module: "writing",
        type: `${testType} Task ${taskNumber}`,
        topic: topic || generatedTest?.title || "Writing Practice",
        difficulty,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        score: evaluationResult.overallBand,
        wordCount: evaluationResult.wordCount,
        evaluated: true
      });
      localStorage.setItem("ielts_practice_history", JSON.stringify(history));

      // Save evaluated attempt to history
      setTimeout(() => {
        setIsEvaluating(false);
        setShowEvaluation(true);
        
        // Save evaluated attempt to history
        if (user) {
          savePracticeAttempt({
            module_type: "writing",
            test_type: taskNumber === "1" ? "task1" : "task2",
            topic: generatedTest?.topic || topic,
            difficulty: difficulty,
            word_count: wordCount,
            band_score: evaluation.overallBand,
            is_evaluated: true,
            user_answer: userAnswer,
            evaluation_data: evaluation,
            test_data: generatedTest
          }).catch(error => console.error("Error saving evaluation:", error));
        } else {
          const history = JSON.parse(localStorage.getItem("ielts_practice_history") || "[]");
          history.unshift({
            id: Date.now().toString(),
            module_type: "writing",
            test_type: taskNumber === "1" ? "task1" : "task2",
            topic: generatedTest?.topic || topic,
            difficulty: difficulty,
            completed_at: new Date().toISOString(),
            word_count: wordCount,
            band_score: evaluation.overallBand,
            is_evaluated: true,
          });
          localStorage.setItem("ielts_practice_history", JSON.stringify(history));
        }
      }, 2500);
    }, 2500);
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
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Link href="/history">
                  <Button variant="outline" size="sm">
                    <History className="h-4 w-4 mr-2" />
                    History
                  </Button>
                </Link>
                {user ? (
                  <UserMenu onSignOut={() => setUser(null)} />
                ) : (
                  <Button onClick={() => setIsAuthModalOpen(true)} size="sm">
                    Sign In
                  </Button>
                )}
              </div>
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

            <Tabs value={taskNumber} onValueChange={(v) => setTaskNumber(v as "1" | "2")} className="mb-4">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="1">Task 1 (150 words)</TabsTrigger>
                <TabsTrigger value="2">Task 2 (250 words)</TabsTrigger>
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

            {taskNumber === "1" && testType === "academic" && (
            <div className="space-y-2">
              <Label htmlFor="chartType" className="text-white/90">
                Chart Type
              </Label>
              <div className="flex gap-2">
                <Select value={chartType} onValueChange={setChartType}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
                    <SelectValue placeholder="Select chart type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="random">
                      <div className="flex items-center gap-2">
                        <Shuffle className="w-4 h-4" />
                        Random (Surprise Me!)
                      </div>
                    </SelectItem>
                    <SelectItem value="line">
                      <div className="flex items-center gap-2">
                        <LineChart className="w-4 h-4" />
                        Line Chart
                      </div>
                    </SelectItem>
                    <SelectItem value="bar">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Bar Chart
                      </div>
                    </SelectItem>
                    <SelectItem value="pie">
                      <div className="flex items-center gap-2">
                        <PieChart className="w-4 h-4" />
                        Pie Chart
                      </div>
                    </SelectItem>
                    <SelectItem value="table">
                      <div className="flex items-center gap-2">
                        <TableIcon className="w-4 h-4" />
                        Table
                      </div>
                    </SelectItem>
                    <SelectItem value="process">
                      <div className="flex items-center gap-2">
                        <GitBranch className="w-4 h-4" />
                        Process Diagram
                      </div>
                    </SelectItem>
                    <SelectItem value="map">
                      <div className="flex items-center gap-2">
                        <MapIcon className="w-4 h-4" />
                        Map
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => setChartType("random")}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                  title="Randomize chart type"
                >
                  <Shuffle className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-white/70">
                Choose a specific chart type or use random to practice all types
              </p>
            </div>
            )}

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
                  Generate {taskNumber === "1" ? "Task 1" : "Task 2"} Test
                </>
              )}
            </Button>
          </Card>

          {/* Generated Test */}
          {generatedTest && (
            <Card className="p-6 bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-800">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <PenTool className="h-5 w-5 text-purple-600" />
                    Your Answer
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Word Count: {userAnswer.trim().split(/\s+/).filter(w => w.length > 0).length}
                    {" / "}
                    {taskNumber === "1" ? "150 minimum" : "250 minimum"}
                  </div>
                </div>

                <Textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder={`Write your ${taskNumber === "1" ? "Task 1" : "Task 2"} response here...\n\nTips:\n- Task 1: Minimum 150 words (describe the data objectively)\n- Task 2: Minimum 250 words (present arguments with examples)\n- Use formal academic language\n- Organize your ideas into clear paragraphs`}
                  className="min-h-[400px] font-mono text-base p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400"
                />

                <div className="flex gap-3">
                  <Button
                    onClick={evaluateAnswer}
                    disabled={isEvaluating || !userAnswer.trim()}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-6 text-lg"
                  >
                    {isEvaluating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Evaluating Your Answer...
                      </>
                    ) : (
                      <>
                        <Award className="mr-2 h-5 w-5" />
                        Evaluate My Answer
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => {
                      setUserAnswer("");
                      setEvaluation(null);
                      setShowEvaluation(false);
                    }}
                    variant="outline"
                    className="px-6 py-6"
                  >
                    Clear
                  </Button>
                </div>

                {userAnswer.trim().split(/\s+/).filter(w => w.length > 0).length < (taskNumber === "1" ? 150 : 250) && userAnswer.trim() && (
                  <div className="flex items-start gap-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="text-yellow-600 dark:text-yellow-400 mt-0.5">⚠️</div>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Your answer is below the minimum word count. In the actual IELTS test, you may lose marks for insufficient content.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
          };
          checkUser();
        }}
      />
    </>
  );
}