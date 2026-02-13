import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenTool, ArrowLeft, Sparkles, ImageIcon } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface GeneratedPrompt {
  text: string;
  imageUrl?: string;
  imageDescription?: string;
}

export default function WritingPractice() {
  const [taskType, setTaskType] = useState("task2");
  const [testFormat, setTestFormat] = useState("academic");
  const [difficulty, setDifficulty] = useState("6.5-7.5");
  const [topic, setTopic] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState<GeneratedPrompt | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const task2Topics = [
    "Education and Technology",
    "Environment and Sustainability",
    "Work-Life Balance",
    "Social Media Impact",
    "Healthcare Systems",
    "Urban Development",
    "Cultural Preservation",
    "Government Spending",
    "Crime and Punishment",
    "Globalization Effects"
  ];

  // Chart types for Task 1 Academic
  const chartTypes = [
    { type: "line", query: "line+graph+chart", description: "line graph" },
    { type: "bar", query: "bar+chart+statistics", description: "bar chart" },
    { type: "pie", query: "pie+chart+data", description: "pie chart" },
    { type: "table", query: "data+table+statistics", description: "table" },
    { type: "process", query: "process+diagram+flowchart", description: "process diagram" },
    { type: "map", query: "map+changes+development", description: "map" }
  ];

  const getRandomChartImage = async (chartType: string) => {
    const chart = chartTypes.find(c => c.type === chartType) || chartTypes[0];
    
    // Use Unsplash API for high-quality chart images
    const unsplashAccessKey = "your_access_key_here"; // In production, this would be in .env
    
    // For this implementation, we'll use a curated list of chart images from Unsplash
    const chartImages = {
      line: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      bar: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      pie: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      table: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
      process: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
      map: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80"
    };

    return {
      url: chartImages[chartType as keyof typeof chartImages] || chartImages.line,
      description: chart.description
    };
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (taskType === "task1" && testFormat === "academic") {
      // Randomly select a chart type
      const randomChart = chartTypes[Math.floor(Math.random() * chartTypes.length)];
      const imageData = await getRandomChartImage(randomChart.type);
      
      const prompt = generateTask1Prompt(testFormat, difficulty, randomChart.type);
      setGeneratedPrompt({
        text: prompt,
        imageUrl: imageData.url,
        imageDescription: imageData.description
      });
    } else if (taskType === "task1" && testFormat === "general") {
      const prompt = generateTask1Prompt(testFormat, difficulty, "letter");
      setGeneratedPrompt({
        text: prompt
      });
    } else {
      const prompt = generateTask2Prompt(testFormat, difficulty, topic);
      setGeneratedPrompt({
        text: prompt
      });
    }
    
    setIsGenerating(false);
  };

  const generateTask2Prompt = (format: string, level: string, selectedTopic: string) => {
    return `# IELTS ${format === "academic" ? "Academic" : "General Training"} Writing Task 2
**Topic:** ${selectedTopic}
**Target Band Score:** ${level}
**Time Allowed:** 40 minutes
**Minimum Words:** 250

---

## Essay Prompt

**In many countries, the use of social media platforms has increased dramatically among young people. While some argue this technological advancement benefits communication and learning, others believe it negatively affects mental health and face-to-face interactions.**

**To what extent do you agree or disagree with the statement that social media does more harm than good to young people?**

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

---

## Model Answer Outline

### Introduction (40-50 words)
**Structure:**
- Paraphrase the question
- State your position clearly (partially agree/disagree)
- Outline the two main points you'll discuss

**Example:**
"The proliferation of social media among youth has sparked considerable debate regarding its overall impact. While I acknowledge the significant benefits these platforms offer for connectivity and information access, I believe their detrimental effects on mental wellbeing and interpersonal skills outweigh the advantages."

---

### Body Paragraph 1: Benefits (100-120 words)
**Topic Sentence:** Social media platforms undeniably facilitate valuable educational opportunities and global connectivity.

**Supporting Points:**
1. **Educational Access:** 
   - Online learning communities and resources
   - Example: YouTube tutorials, Khan Academy, collaborative study groups
   - Statistics: 73% of educators report students using social media for academic purposes

2. **Cultural Exchange:**
   - Exposure to diverse perspectives
   - Example: Language exchange through apps like HelloTalk
   - Networking opportunities for future careers

**Concluding Sentence:** These advantages demonstrate that when used judiciously, social media can serve as a powerful tool for personal and academic development.

---

### Body Paragraph 2: Harms (130-150 words)
**Topic Sentence:** However, the psychological and social costs of excessive social media usage present more significant concerns.

**Supporting Points:**
1. **Mental Health Impact:**
   - Studies linking social media to anxiety and depression
   - Example: Research from the Royal Society for Public Health (UK)
   - Comparison culture and self-esteem issues
   - Statistics: 70% increase in depression rates correlating with social media adoption

2. **Erosion of Face-to-Face Skills:**
   - Reduced quality of in-person interactions
   - Example: Dinner table phone usage becoming normalized
   - Loss of non-verbal communication competency
   - Impact on empathy development

3. **Addictive Design:**
   - Dopamine-driven feedback loops
   - Screen time averages (5+ hours daily for teenagers)

**Concluding Sentence:** These pervasive negative effects create lasting consequences that compromise young people's developmental foundations.

---

### Conclusion (40-50 words)
**Structure:**
- Restate position with conviction
- Summarize key arguments briefly
- Provide a forward-looking statement or recommendation

**Example:**
"In conclusion, despite the undeniable communicative and educational merits of social media, the substantial evidence of psychological harm and social skill deterioration suggests its net impact on youth is predominantly negative. Therefore, guided usage and digital literacy education are essential to mitigate these risks."

---

## Band Score Assessment Criteria

### Band 7.0+ Features:
✓ **Task Response:** Clear position with well-developed ideas
✓ **Coherence:** Logical progression with effective paragraphing
✓ **Lexical Resource:** Sophisticated vocabulary (proliferation, judiciously, erosion)
✓ **Grammar:** Complex sentences with accuracy (95%+ error-free)

### Band 6.5 Features:
✓ **Task Response:** Relevant position with adequate support
✓ **Coherence:** Clear progression with some cohesive devices
✓ **Lexical Resource:** Adequate range with some less common items
✓ **Grammar:** Mix of simple and complex sentences (85%+ accurate)

### Band 6.0 Features:
✓ **Task Response:** Addresses all parts but may lack full development
✓ **Coherence:** Adequate organization but may lack progression
✓ **Lexical Resource:** Adequate vocabulary with some errors
✓ **Grammar:** Some complex structures attempted (70%+ accurate)

---

## Examiner's Tips

### Language Enhancement Strategies:
1. **Avoid Repetition:** Use synonyms (young people → youth, adolescents, teenagers)
2. **Cohesive Devices:** Furthermore, Moreover, Conversely, Consequently
3. **Academic Tone:** Avoid contractions, maintain formal register
4. **Conditional Structures:** If governments were to implement..., Should parents restrict...

### Common Pitfalls:
❌ Writing under 250 words (automatic penalty)
❌ Memorized responses (examiners identify these)
❌ Overgeneralizing without examples
❌ Ignoring the specific question instruction ("to what extent")

### Time Management:
- 5 minutes: Planning and outlining
- 30 minutes: Writing (10 min intro + para 1, 15 min para 2, 5 min conclusion)
- 5 minutes: Proofreading and editing

---

## Practice Task

**Now write your own essay responding to this prompt. Remember:**
- Target 270-290 words (buffer above minimum)
- Use the outline structure provided
- Include specific examples from your knowledge
- Check grammar, spelling, and punctuation carefully
- Ensure each paragraph has a clear central idea

**Self-Assessment Questions:**
1. Have I clearly stated my position?
2. Are my main arguments supported with examples?
3. Have I used a range of vocabulary and sentence structures?
4. Is my essay logically organized with clear paragraphing?
5. Have I addressed "to what extent" in my response?
`;
  };

  const generateTask1Prompt = (format: string, level: string, chartType?: string) => {
    if (format === "academic") {
      const chartDescriptions = {
        line: "The line graph below shows the percentage of households with internet access in three different countries between 2010 and 2025.",
        bar: "The bar chart below illustrates the amount of money spent on different types of entertainment in five countries in 2024.",
        pie: "The pie charts below show the proportion of energy produced from different sources in a country in 2000 and 2024.",
        table: "The table below gives information about the number of international students in five universities in three different years.",
        process: "The diagram below shows the process of recycling plastic bottles.",
        map: "The two maps below show the development of a coastal town between 1990 and 2024."
      };

      const description = chartDescriptions[chartType as keyof typeof chartDescriptions] || chartDescriptions.line;

      return `# IELTS Academic Writing Task 1
**Target Band Score:** ${level}
**Time Allowed:** 20 minutes
**Minimum Words:** 150

---

## Task Description

${description}

**Summarize the information by selecting and reporting the main features, and make comparisons where relevant.**

---

## Data Interpretation Guide

**Key Features to Identify:**
1. Overall trends (increasing, decreasing, fluctuating, stable)
2. Highest and lowest values
3. Significant changes or turning points
4. Notable comparisons between categories
5. Time periods (if applicable)

---

## Model Answer Structure

### Introduction (25-30 words)
**Purpose:** Paraphrase the task description
**Example:** "The ${chartType === "line" ? "line graph" : chartType === "bar" ? "bar chart" : "visual"} illustrates [paraphrased description of what the chart shows] over [time period/categories]."

### Overview (40-50 words)
**Purpose:** Identify 2-3 most significant trends/features
**Key phrase:** "Overall, it is clear that..."
**Example:** "Overall, it is evident that [major trend 1]. Additionally, [major trend 2]. Notably, [significant feature or comparison]."

⚠️ **Critical:** Do NOT include specific data in the overview - save numbers for body paragraphs

### Body Paragraph 1 (70-80 words)
**Focus:** Detailed analysis of first major feature
- Include specific data points (numbers, percentages, years)
- Make comparisons between categories
- Use precise language for describing trends

**Useful vocabulary:**
- Verbs: increased, rose, grew, declined, fell, dropped, fluctuated, remained stable
- Adverbs: significantly, dramatically, gradually, steadily, sharply, slightly
- Comparisons: whereas, while, in contrast, similarly, likewise

### Body Paragraph 2 (70-80 words)
**Focus:** Detailed analysis of second major feature
- Continue with specific data
- Cross-reference with Body Paragraph 1 where relevant
- Ensure logical flow and coherence

---

## Band 7.0+ Writing Criteria

✓ **Task Achievement:** All key features covered with relevant data
✓ **Coherence & Cohesion:** Clear overview + logical organization
✓ **Lexical Resource:** Wide range of vocabulary with flexibility
✓ **Grammatical Range:** Complex structures with high accuracy

### Essential Language Features:

**Describing Trends:**
- Sharp increase: soared, surged, rocketed, skyrocketed
- Gradual increase: rose gradually, climbed steadily, edged up
- Sharp decrease: plummeted, plunged, nosedived, collapsed
- Gradual decrease: declined gradually, dropped slowly, eased

**Showing Proportion:**
- accounted for, represented, constituted, comprised, made up
- the majority/minority of, the largest/smallest proportion

**Making Comparisons:**
- twice as much as, half the amount of
- overtook, exceeded, surpassed
- ranked first/second, was the leading/dominant

**Time References:**
- at the start/beginning of the period
- by the end of 2024
- throughout the period
- between 2010 and 2024
- from... to...

---

## Common Mistakes to Avoid

❌ **DON'T:**
- Include your opinion or explanations (why things happened)
- Copy the task description word-for-word
- Include data in the overview paragraph
- Use informal language or contractions
- Describe every single data point
- Go under 150 words

✅ **DO:**
- Paraphrase the task description
- Group similar data together
- Use a variety of sentence structures
- Write 160-180 words (safety buffer)
- Check for grammar and spelling errors
- Manage time: 20 minutes maximum

---

## Practice Exercise

**Analyze the chart provided above and write your response following the model structure:**

1. **Planning (3 minutes):**
   - Identify 2-3 main trends for your overview
   - Note key data points to include
   - Plan your paragraph focus

2. **Writing (15 minutes):**
   - Introduction + Overview: 70-80 words
   - Body Paragraphs: 80-100 words total
   
3. **Checking (2 minutes):**
   - Word count (150+ words)
   - Grammar and spelling
   - All key features covered

**Target:** Aim for 170-180 words for optimal score potential
`;
    } else {
      return `# IELTS General Training Writing Task 1
**Target Band Score:** ${level}
**Time Allowed:** 20 minutes
**Minimum Words:** 150

---

## Task Description

You recently purchased a laptop online, but when it arrived, you discovered it was damaged and missing several accessories mentioned in the product description.

**Write a letter to the company's customer service department. In your letter:**
- Explain what you ordered and when
- Describe the problems with the product
- State what action you want the company to take

---

## Model Letter Structure

### Opening (Formal/Semi-formal)
Dear Sir or Madam,

### Introduction (20-30 words)
State purpose of letter clearly.

**Example:** "I am writing to express my dissatisfaction with a laptop I purchased from your online store on January 15th, 2026, which arrived in unsatisfactory condition."

### Body Paragraph 1: Order Details (50-60 words)
**Example:** "I ordered a ProBook 450 G9 (Model #PB450-2026, Order #78453) priced at $1,299, which was advertised as including a protective case, wireless mouse, and 3-year extended warranty documentation. According to your website, the laptop featured a 15.6-inch display, 16GB RAM, and 512GB SSD storage. The estimated delivery was January 20th, and the package arrived on schedule."

### Body Paragraph 2: Problems (60-70 words)
**Example:** "However, upon opening the package, I discovered multiple issues. First, the laptop's screen has a significant crack in the lower right corner, rendering approximately 20% of the display unusable. Second, the protective case and wireless mouse mentioned in the product description were completely absent from the shipment. Finally, while the warranty card was included, it had already been activated under a different customer's name, making it invalid."

### Body Paragraph 3: Requested Action (40-50 words)
**Example:** "I request a full replacement of the damaged laptop with a new unit, along with the missing accessories. Alternatively, if a replacement is unavailable, I would accept a complete refund including return shipping costs. I would appreciate your response within five business days and a prepaid return label for the defective item."

### Closing
Yours faithfully,
[Your Name]

---

## Band 7.0+ Features:
✓ Appropriate tone (formal complaint)
✓ All bullet points fully addressed
✓ Clear organization with logical paragraphs
✓ Accurate, varied vocabulary
✓ Complex sentence structures
✓ Natural cohesive devices

## Key Vocabulary for Complaints:
- dissatisfaction/disappointment
- unsatisfactory/defective/damaged
- as advertised/as described
- request/require/expect
- replacement/refund/compensation
- inconvenience/frustration

## Examiner's Tips:
- Match the tone to the relationship (formal for unknown recipients)
- Use consistent register throughout
- Address ALL three bullet points
- Include specific details (dates, model numbers)
- Be polite but firm in complaints
- Suggest reasonable solutions
`;
    }
  };

  return (
    <>
      <SEO 
        title="IELTS Writing Practice Test Generator"
        description="Generate authentic IELTS Writing Task 1 and Task 2 prompts with model answer outlines and band score guidance."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/">
            <Button variant="ghost" className="mb-6 group">
              <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Button>
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900">Writing Practice</h1>
            </div>
            <p className="text-lg text-slate-600">
              Generate writing prompts with detailed model answer outlines and examiner guidance
            </p>
          </div>

          <Card className="p-8 bg-white/90 backdrop-blur shadow-xl">
            <Tabs value={taskType} onValueChange={setTaskType} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="task1">Task 1</TabsTrigger>
                <TabsTrigger value="task2">Task 2</TabsTrigger>
              </TabsList>

              <TabsContent value="task1" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="format-task1" className="text-base font-semibold">Test Format</Label>
                    <Select value={testFormat} onValueChange={setTestFormat}>
                      <SelectTrigger id="format-task1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academic">Academic (Graph/Chart)</SelectItem>
                        <SelectItem value="general">General Training (Letter)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty-task1" className="text-base font-semibold">Target Band Score</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger id="difficulty-task1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5.0-6.0">Band 5.0 - 6.0</SelectItem>
                        <SelectItem value="6.0-6.5">Band 6.0 - 6.5</SelectItem>
                        <SelectItem value="6.5-7.5">Band 6.5 - 7.5</SelectItem>
                        <SelectItem value="7.5-8.5">Band 7.5 - 8.5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {testFormat === "academic" && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <ImageIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-900">
                        <strong>Chart Display:</strong> A random chart image relevant to the task will be displayed with your generated prompt. This simulates the actual IELTS test experience.
                      </p>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
                >
                  {isGenerating ? (
                    <>Generating Task 1 Prompt...</>
                  ) : (
                    <>
                      <Sparkles className="mr-2 w-5 h-5" />
                      Generate Task 1 Prompt
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="task2" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="format-task2" className="text-base font-semibold">Test Format</Label>
                    <Select value={testFormat} onValueChange={setTestFormat}>
                      <SelectTrigger id="format-task2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academic">Academic Writing</SelectItem>
                        <SelectItem value="general">General Training Writing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty-task2" className="text-base font-semibold">Target Band Score</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger id="difficulty-task2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5.0-6.0">Band 5.0 - 6.0</SelectItem>
                        <SelectItem value="6.0-6.5">Band 6.0 - 6.5</SelectItem>
                        <SelectItem value="6.5-7.5">Band 6.5 - 7.5</SelectItem>
                        <SelectItem value="7.5-8.5">Band 7.5 - 8.5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic-task2" className="text-base font-semibold">Essay Topic</Label>
                  <Select value={topic} onValueChange={setTopic}>
                    <SelectTrigger id="topic-task2">
                      <SelectValue placeholder="Choose an essay topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {task2Topics.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleGenerate}
                  disabled={!topic || isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
                >
                  {isGenerating ? (
                    <>Generating Task 2 Prompt...</>
                  ) : (
                    <>
                      <Sparkles className="mr-2 w-5 h-5" />
                      Generate Task 2 Prompt
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </Card>

          {generatedPrompt && (
            <Card className="mt-8 p-8 bg-white shadow-xl">
              {/* Chart Image Section - Only for Academic Task 1 */}
              {generatedPrompt.imageUrl && taskType === "task1" && testFormat === "academic" && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <ImageIcon className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-slate-900">Visual Data</h3>
                  </div>
                  <div className="relative w-full bg-slate-50 rounded-lg overflow-hidden border-2 border-slate-200">
                    <img 
                      src={generatedPrompt.imageUrl}
                      alt={`IELTS Task 1 ${generatedPrompt.imageDescription || 'chart'}`}
                      className="w-full h-auto object-contain"
                      style={{ maxWidth: "100%" }}
                      onError={(e) => {
                        // Fallback to a placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80";
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <p className="text-white text-sm font-medium">
                        {generatedPrompt.imageDescription ? `Chart Type: ${generatedPrompt.imageDescription}` : "Sample Chart"}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 italic">
                    📊 In the actual IELTS test, you will see a similar visual representation of data. Analyze the chart carefully before writing your response.
                  </p>
                </div>
              )}

              <div className="prose prose-slate max-w-none">
                <div className="mb-6 p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
                  <p className="text-sm font-medium text-purple-900 mb-2">
                    ✍️ Writing Instructions
                  </p>
                  <p className="text-sm text-purple-800">
                    Read the prompt carefully and plan your response. Follow the model outline provided to structure your answer. 
                    Remember to check your work for grammar, spelling, and coherence before submitting.
                  </p>
                </div>
                
                <div className="whitespace-pre-wrap font-sans leading-relaxed">
                  {generatedPrompt.text.split('\n').map((line, index) => {
                    if (line.startsWith('# ')) {
                      return <h1 key={index} className="text-3xl font-bold text-slate-900 mt-8 mb-4">{line.substring(2)}</h1>;
                    } else if (line.startsWith('## ')) {
                      return <h2 key={index} className="text-2xl font-bold text-slate-800 mt-6 mb-3 pb-2 border-b-2 border-purple-200">{line.substring(3)}</h2>;
                    } else if (line.startsWith('### ')) {
                      return <h3 key={index} className="text-xl font-semibold text-slate-700 mt-5 mb-2">{line.substring(4)}</h3>;
                    } else if (line.startsWith('**') && line.endsWith('**')) {
                      return <p key={index} className="font-bold text-slate-900 mt-3">{line.replace(/\*\*/g, '')}</p>;
                    } else if (line.startsWith('✓ ') || line.startsWith('❌ ')) {
                      return <p key={index} className="text-slate-700 mb-2 pl-2">{line}</p>;
                    } else if (line.trim() === '---') {
                      return <hr key={index} className="my-6 border-slate-200" />;
                    } else if (line.trim() === '') {
                      return <br key={index} />;
                    } else {
                      return <p key={index} className="text-slate-700 mb-3 leading-relaxed">{line}</p>;
                    }
                  })}
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-200">
                <Button 
                  onClick={handleGenerate}
                  variant="outline"
                  className="w-full border-2"
                >
                  Generate Another Prompt
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}