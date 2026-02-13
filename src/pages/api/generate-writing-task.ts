import type { NextApiRequest, NextApiResponse } from "next";

type TaskType = "task1" | "task2";
type Task1Type = "bar" | "line" | "pie" | "table" | "process" | "map";
type Difficulty = "5.5" | "6.0" | "6.5" | "7.0" | "7.5" | "8.0";

interface GenerateRequest {
  taskType: TaskType;
  topic?: string;
  difficulty?: Difficulty;
  task1Type?: Task1Type;
}

interface Task1Response {
  type: "task1";
  chartType: Task1Type;
  title: string;
  description: string;
  chartData: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
    }>;
  };
  taskPrompt: string;
  sampleAnswer: string;
  wordCount: number;
  bandScore: string;
  examinerComments: string;
}

interface Task2Response {
  type: "task2";
  essayType: string;
  topic: string;
  prompt: string;
  sampleAnswer: string;
  wordCount: number;
  bandScore: string;
  examinerComments: string;
}

type ApiResponse = Task1Response | Task2Response | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { taskType, topic, difficulty = "6.5", task1Type = "bar" }: GenerateRequest = req.body;

  if (!taskType || (taskType !== "task1" && taskType !== "task2")) {
    return res.status(400).json({ error: "Invalid task type" });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey === "your_openai_api_key_here") {
    return res.status(500).json({ 
      error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables." 
    });
  }

  try {
    if (taskType === "task1") {
      const systemPrompt = `You are a certified IELTS examiner with 15 years of experience. Generate a complete IELTS Academic Writing Task 1 test following Cambridge standards.

Chart type: ${task1Type}
Difficulty: Band ${difficulty}
${topic ? `Topic area: ${topic}` : "Choose an appropriate academic topic"}

Generate a realistic data visualization scenario with:
1. A clear, academic title
2. Detailed description of what the chart shows
3. Realistic data points (6-8 categories for bar/line, 4-6 slices for pie, appropriate rows/columns for tables)
4. A proper IELTS Task 1 prompt (150+ words requirement)
5. A band ${difficulty} model answer (170-190 words)
6. Examiner comments on why this achieves band ${difficulty}

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "type": "task1",
  "chartType": "${task1Type}",
  "title": "Chart title here",
  "description": "What the chart represents",
  "chartData": {
    "labels": ["Category1", "Category2", ...],
    "datasets": [{"label": "Data series name", "data": [numbers]}]
  },
  "taskPrompt": "The [chart type] shows... Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
  "sampleAnswer": "The [chart type] illustrates... [Full model answer]",
  "wordCount": 180,
  "bandScore": "${difficulty}",
  "examinerComments": "Detailed feedback on task achievement, coherence, vocabulary, and grammar"
}`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: "Generate the IELTS Writing Task 1 test now." }
          ],
          temperature: 0.8,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API error:", errorData);
        throw new Error(`OpenAI API error: ${errorData.error?.message || "Unknown error"}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content.trim();
      
      let jsonContent = content;
      if (content.startsWith("```json")) {
        jsonContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      } else if (content.startsWith("```")) {
        jsonContent = content.replace(/```\n?/g, "").trim();
      }

      const result = JSON.parse(jsonContent) as Task1Response;
      return res.status(200).json(result);

    } else {
      const systemPrompt = `You are a certified IELTS examiner with 15 years of experience. Generate a complete IELTS Academic Writing Task 2 essay test following Cambridge standards.

Difficulty: Band ${difficulty}
${topic ? `Topic area: ${topic}` : "Choose a common IELTS topic (education, technology, environment, society, health, etc.)"}

Generate a realistic essay prompt with:
1. A clear opinion/discussion/problem-solution/advantage-disadvantage question
2. A proper IELTS Task 2 format (250+ words requirement)
3. A band ${difficulty} model essay (280-320 words)
4. Clear paragraph structure (Introduction, Body 1, Body 2, Conclusion)
5. Examiner comments on why this achieves band ${difficulty}

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "type": "task2",
  "essayType": "opinion/discussion/problem-solution/advantages-disadvantages",
  "topic": "Brief topic name",
  "prompt": "Some people believe that... Others think... Discuss both views and give your own opinion. Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
  "sampleAnswer": "Introduction paragraph\\n\\nBody paragraph 1\\n\\nBody paragraph 2\\n\\nConclusion paragraph",
  "wordCount": 295,
  "bandScore": "${difficulty}",
  "examinerComments": "Detailed feedback on task response, coherence and cohesion, lexical resource, and grammatical range and accuracy"
}`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: "Generate the IELTS Writing Task 2 essay test now." }
          ],
          temperature: 0.8,
          max_tokens: 2500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API error:", errorData);
        throw new Error(`OpenAI API error: ${errorData.error?.message || "Unknown error"}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content.trim();
      
      let jsonContent = content;
      if (content.startsWith("```json")) {
        jsonContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      } else if (content.startsWith("```")) {
        jsonContent = content.replace(/```\n?/g, "").trim();
      }

      const result = JSON.parse(jsonContent) as Task2Response;
      return res.status(200).json(result);
    }
  } catch (error) {
    console.error("Error generating writing task:", error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : "Failed to generate writing task" 
    });
  }
}