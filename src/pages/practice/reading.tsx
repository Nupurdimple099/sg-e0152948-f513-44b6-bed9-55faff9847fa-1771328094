import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, ArrowLeft, Target, Clock, CheckCircle2, XCircle, AlertCircle, Award, History, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ReadingPractice() {
  const [testType, setTestType] = useState("academic");
  const [difficulty, setDifficulty] = useState("6.5-7.5");
  const [topic, setTopic] = useState("");
  const [generatedTest, setGeneratedTest] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const topics = [
    "Urbanization and City Planning",
    "Climate Change and Environmental Issues",
    "Modern Education Systems",
    "Technology and Society",
    "Healthcare and Medical Advances",
    "Cultural Heritage and Preservation",
    "Economic Development",
    "Space Exploration",
    "Artificial Intelligence",
    "Sustainable Agriculture"
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const test = generateReadingTest(testType, difficulty, topic);
      setGeneratedTest(test);
      setIsGenerating(false);

      // Save to history
      const historyItem = {
        id: Date.now().toString(),
        module: "reading" as const,
        type: "Reading Passage",
        topic: topic,
        difficulty: difficulty,
        completedAt: new Date().toISOString(),
        duration: 60,
      };
      
      const savedHistory = localStorage.getItem("ielts_practice_history");
      const history = savedHistory ? JSON.parse(savedHistory) : [];
      history.unshift(historyItem);
      localStorage.setItem("ielts_practice_history", JSON.stringify(history));
    }, 1500);
  };

  const generateReadingTest = (type: string, level: string, selectedTopic: string) => {
    return `# IELTS ${type === "academic" ? "Academic" : "General Training"} Reading Practice Test
**Topic:** ${selectedTopic}
**Target Band Score:** ${level}
**Time Allowed:** 20 minutes

---

## Reading Passage

### The Evolution of Urban Green Spaces

Urban green spaces have undergone a remarkable transformation over the past century, evolving from mere aesthetic additions to essential components of sustainable city planning. In the early 20th century, parks and gardens were primarily designed as recreational areas for the affluent, offering respite from industrial pollution. However, contemporary urban planners now recognize these spaces as multifunctional infrastructures that address numerous environmental, social, and economic challenges.

The concept of "urban ecology" emerged in the 1970s, fundamentally shifting perspectives on city greenery. Researchers discovered that vegetation in cities performs critical ecosystem services beyond their obvious visual appeal. Trees act as natural air filters, removing particulate matter and absorbing carbon dioxide at rates that can significantly reduce urban heat island effects. A study conducted in Melbourne demonstrated that strategically planted trees along streets could lower surface temperatures by up to 7 degrees Celsius during summer months, substantially reducing energy consumption for air conditioning.

Moreover, green spaces serve as vital corridors for biodiversity in increasingly fragmented urban landscapes. Cities like Singapore have pioneered "vertical gardens" and "sky parks" that create continuous habitats for various species, from insects to birds. This approach, known as the "City in a Garden" vision, has resulted in Singapore maintaining over 350 species of birds despite its dense urban development. The integration of nature into urban architecture demonstrates how cities can coexist with wildlife rather than displace it entirely.

The social benefits of urban green spaces are equally compelling. Numerous studies have established strong correlations between access to parks and improved mental health outcomes. A longitudinal study in the United Kingdom tracked 10,000 individuals over five years, revealing that those living within 300 meters of green spaces reported 15% lower stress levels and 20% higher life satisfaction scores compared to those without such access. Furthermore, community gardens have emerged as powerful tools for social cohesion, bringing together diverse populations and fostering neighbourhood connections.

Economic arguments for urban greenery have also gained traction among policymakers. Properties adjacent to well-maintained parks command premiums of 8-20% compared to similar properties elsewhere, generating substantial tax revenues for municipalities. Additionally, green infrastructure often proves more cost-effective than traditional "grey" infrastructure for managing stormwater. Philadelphia's Green City, Clean Waters initiative, which incorporates rain gardens and permeable surfaces, is projected to save the city $5.6 billion over 25 years compared to conventional sewage system upgrades.

Despite these benefits, implementing comprehensive urban greening strategies faces significant challenges. Land scarcity in densely populated cities makes acquiring space for new parks financially prohibitive. Tokyo addresses this through innovative "pocket parks"—tiny green spaces of 50-100 square meters integrated into existing urban fabric. These micro-parks, while modest in size, collectively contribute to the city's green canopy and provide neighbourhood gathering spots.

Climate change introduces another layer of complexity. Urban planners must now select plant species that can withstand more extreme weather patterns while continuing to deliver ecosystem services. Native species, traditionally preferred for their ecological compatibility, may become unsuitable as local climates shift. Some cities are experimenting with "assisted migration," deliberately introducing species from warmer regions that are predicted to thrive under future climate scenarios.

The future of urban green spaces likely involves technological integration. "Smart parks" equipped with sensors can monitor air quality, soil moisture, and foot traffic, enabling data-driven maintenance decisions. Barcelona's Park Güell utilizes such systems to optimize irrigation and identify areas requiring intervention before visible deterioration occurs. This marriage of nature and technology exemplifies the sophisticated approach necessary for 21st-century urban planning.

---

## Questions (13 marks)

### Questions 1-5: True / False / Not Given

1. In the early 1900s, urban parks were accessible to all social classes.
2. Trees in Melbourne can reduce street surface temperatures by 7 degrees Celsius.
3. Singapore has more bird species than any other Asian city.
4. Living near green spaces can reduce stress levels by 15%.
5. Tokyo's pocket parks are each at least 100 square meters in size.

### Questions 6-9: Matching Headings

Match the following headings to paragraphs C-F:

A. Financial advantages of green infrastructure
B. Technological innovations in park management
C. Challenges of implementing urban greening
D. Social and psychological impacts
E. Wildlife preservation in cities

6. Paragraph C: _____
7. Paragraph D: _____
8. Paragraph E: _____
9. Paragraph F: _____

### Questions 10-13: Summary Completion

Complete the summary below using NO MORE THAN TWO WORDS from the passage.

Urban green spaces provide multiple benefits beyond aesthetics. They function as natural (10) _____ that remove pollutants from the air. In terms of biodiversity, cities like Singapore have created (11) _____ to maintain wildlife habitats. The economic value is evident as properties near parks can sell for (12) _____ compared to others. However, challenges include land scarcity and selecting plants that can survive (13) _____ due to climate change.

---

## Answer Key

### Answers 1-5: True/False/Not Given
1. **FALSE** - The passage states parks were "primarily designed as recreational areas for the affluent"
2. **TRUE** - The passage explicitly mentions "lower surface temperatures by up to 7 degrees Celsius"
3. **NOT GIVEN** - The passage mentions Singapore has 350+ species but doesn't compare to other cities
4. **TRUE** - The UK study showed "15% lower stress levels"
5. **FALSE** - Pocket parks are described as "50-100 square meters," not "at least 100"

### Answers 6-9: Matching Headings
6. Paragraph C: **E** (Wildlife preservation in cities)
7. Paragraph D: **D** (Social and psychological impacts)
8. Paragraph E: **A** (Financial advantages of green infrastructure)
9. Paragraph F: **C** (Challenges of implementing urban greening)

### Answers 10-13: Summary Completion
10. **air filters**
11. **vertical gardens** (or "sky parks" - both acceptable)
12. **premiums** (accept "8-20% premiums")
13. **extreme weather** (or "weather patterns")

---

## Band Score Guidelines

**Band 7.0+:** 10-13 correct answers
**Band 6.5:** 8-9 correct answers
**Band 6.0:** 7-8 correct answers
**Band 5.5:** 5-6 correct answers

### Examiner Notes:
- Pay careful attention to qualifiers (all, some, most)
- NOT GIVEN means the information is neither confirmed nor contradicted
- For summary completion, answers must be grammatically correct in context
- Spelling must be correct (UK or US spelling accepted)
`;
  };

  return (
    <>
      <SEO 
        title="IELTS Reading Practice Test Generator"
        description="Generate authentic IELTS Academic and General Training reading practice tests with Cambridge-standard passages and question types."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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
              <div className="flex items-center gap-2">
                <Button asChild variant="outline">
                  <Link href="/history">
                    <History className="w-4 h-4 mr-2" />
                    History
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900">Reading Practice</h1>
            </div>
            <p className="text-lg text-slate-600">
              Generate Cambridge-standard reading passages with authentic question types
            </p>
          </div>

          <Card className="p-8 bg-white/90 backdrop-blur shadow-xl">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="test-type" className="text-base font-semibold">Test Type</Label>
                  <Select value={testType} onValueChange={setTestType}>
                    <SelectTrigger id="test-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">Academic Reading</SelectItem>
                      <SelectItem value="general">General Training Reading</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty" className="text-base font-semibold">Target Band Score</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger id="difficulty">
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
                <Label htmlFor="topic" className="text-base font-semibold">Topic Selection</Label>
                <Select value={topic} onValueChange={setTopic}>
                  <SelectTrigger id="topic">
                    <SelectValue placeholder="Choose a topic for your reading passage" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={!topic || isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg py-6"
              >
                {isGenerating ? (
                  <>Generating Your Test...</>
                ) : (
                  <>
                    <Sparkles className="mr-2 w-5 h-5" />
                    Generate Practice Test
                  </>
                )}
              </Button>
            </div>
          </Card>

          {generatedTest && (
            <Card className="mt-8 p-8 bg-white shadow-xl">
              <div className="prose prose-slate max-w-none">
                <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    📋 Instructions
                  </p>
                  <p className="text-sm text-blue-800">
                    Read the passage carefully and answer all questions. You should spend about 20 minutes on this section. 
                    Scroll down to see the answer key with detailed explanations after attempting the questions.
                  </p>
                </div>
                
                <div className="whitespace-pre-wrap font-sans leading-relaxed">
                  {generatedTest.split('\n').map((line, index) => {
                    if (line.startsWith('# ')) {
                      return <h1 key={index} className="text-3xl font-bold text-slate-900 mt-8 mb-4">{line.substring(2)}</h1>;
                    } else if (line.startsWith('## ')) {
                      return <h2 key={index} className="text-2xl font-bold text-slate-800 mt-6 mb-3 pb-2 border-b-2 border-blue-200">{line.substring(3)}</h2>;
                    } else if (line.startsWith('### ')) {
                      return <h3 key={index} className="text-xl font-semibold text-slate-700 mt-5 mb-2">{line.substring(4)}</h3>;
                    } else if (line.startsWith('**') && line.endsWith('**')) {
                      return <p key={index} className="font-bold text-slate-900 mt-3">{line.replace(/\*\*/g, '')}</p>;
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
                  Generate Another Test
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}