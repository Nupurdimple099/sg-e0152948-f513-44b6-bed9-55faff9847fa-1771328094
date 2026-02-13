import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SpeakingPractice() {
  const [part, setPart] = useState("part1");
  const [difficulty, setDifficulty] = useState("6.5-7.5");
  const [topic, setTopic] = useState("");
  const [generatedQuestions, setGeneratedQuestions] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const part1Topics = [
    "Home and Accommodation",
    "Work and Studies",
    "Hometown and City",
    "Hobbies and Interests",
    "Daily Routine",
    "Food and Cooking",
    "Technology and Gadgets",
    "Travel and Holidays"
  ];

  const part2Topics = [
    "Describe a person who influenced you",
    "Describe a place you visited",
    "Describe an important event",
    "Describe a skill you learned",
    "Describe a book or film",
    "Describe a memorable experience",
    "Describe an achievement",
    "Describe a problem you solved"
  ];

  const part3Topics = [
    "Education and Learning Methods",
    "Technology and Society",
    "Environmental Issues",
    "Work-Life Balance",
    "Cultural Traditions",
    "Media and Communication",
    "Health and Lifestyle",
    "Urban Development"
  ];

  const getTopics = () => {
    switch (part) {
      case "part1": return part1Topics;
      case "part2": return part2Topics;
      case "part3": return part3Topics;
      default: return part1Topics;
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const questions = part === "part1" 
        ? generatePart1Questions(difficulty, topic)
        : part === "part2"
        ? generatePart2Questions(difficulty, topic)
        : generatePart3Questions(difficulty, topic);
      setGeneratedQuestions(questions);
      setIsGenerating(false);
    }, 1500);
  };

  const generatePart1Questions = (level: string, selectedTopic: string) => {
    return `# IELTS Speaking Part 1
**Topic:** ${selectedTopic}
**Target Band Score:** ${level}
**Duration:** 4-5 minutes

---

## Instructions

In Part 1, the examiner will ask you questions about yourself and familiar topics. Answer naturally and expand your responses beyond simple yes/no answers. Aim for 2-3 sentences per answer.

---

## Questions

### Opening Questions (General Introduction)

1. Good morning/afternoon. My name is [Examiner]. Can you tell me your full name, please?

2. Can I see your identification, please?

3. Where are you from? / What city do you come from?

---

### Main Topic Questions: ${selectedTopic}

**Question Set 1: Basic Information**

4. Can you describe your home to me?
   
5. How long have you lived there?

6. What do you like most about your home?

**Question Set 2: Preferences and Habits**

7. Do you prefer living in a house or an apartment? Why?

8. What changes would you like to make to your home?

9. Do you think you will move to a different home in the future?

**Question Set 3: Deeper Exploration**

10. How important is it for you to have your own space at home?

11. In your country, do most people prefer to rent or buy their homes? Why do you think that is?

12. How has the concept of 'home' changed in recent years?

---

## Model Answers (Band 7.0+ Examples)

### Question 4: Can you describe your home to me?

**Band 7.0+ Response:**
"I currently live in a two-bedroom apartment on the outskirts of the city. It's a modern building with excellent natural lighting, which I particularly appreciate. The apartment has an open-plan living and dining area, which creates a spacious feel, and there's a small balcony where I grow some herbs and flowers. Overall, it's a comfortable space that suits my lifestyle quite well."

**Key Features:**
- Specific details (two-bedroom, outskirts, modern building)
- Descriptive vocabulary (open-plan, spacious, outskirts)
- Personal perspective (I particularly appreciate, suits my lifestyle)
- Natural flow with cohesive devices (Overall, and there's)

---

### Question 7: Do you prefer living in a house or an apartment? Why?

**Band 7.0+ Response:**
"I'd say I prefer apartments, primarily for practical reasons. They're generally more secure and require less maintenance than houses, which is important given my busy schedule. Additionally, apartments in my city tend to be closer to public transport and amenities, which makes daily life more convenient. That said, I can see the appeal of houses for families who need more space and privacy."

**Key Features:**
- Clear position with reasoning (prefer apartments, primarily for practical reasons)
- Multiple supporting points (security, maintenance, location)
- Comparative language (more secure than, less maintenance than)
- Balanced view (That said, I can see the appeal)
- Advanced vocabulary (amenities, appeal, privacy)

---

### Question 11: In your country, do most people prefer to rent or buy their homes?

**Band 7.0+ Response:**
"In my country, there's definitely a cultural preference for home ownership. Most people aspire to buy property because it's seen as a secure investment and a marker of financial stability. However, this trend is gradually changing, especially among younger generations in urban areas. Rising property prices have made ownership increasingly difficult, so renting has become more common and socially acceptable than it was in the past. I think we're seeing a significant shift in attitudes toward renting."

**Key Features:**
- Cultural context (cultural preference, marker of financial stability)
- Trend analysis (gradually changing, increasingly difficult)
- Generational comparison (younger generations)
- Cause and effect (Rising property prices have made...)
- Sophisticated vocabulary (aspire, marker, socially acceptable, significant shift)

---

## Assessment Criteria

### Band 7.0+ Features:
✓ **Fluency:** Speaks at length without noticeable effort, self-corrects occasionally
✓ **Vocabulary:** Uses less common vocabulary naturally, with some flexibility
✓ **Grammar:** Uses complex structures with good control, makes few errors
✓ **Pronunciation:** Clear accent, natural word and sentence stress

### Band 6.5 Features:
✓ **Fluency:** Maintains flow despite some hesitation
✓ **Vocabulary:** Adequate range with some less common items
✓ **Grammar:** Mix of simple and complex structures, some errors don't impede communication
✓ **Pronunciation:** Generally clear despite some L1 influence

### Band 6.0 Features:
✓ **Fluency:** Develops responses but with noticeable pauses
✓ **Vocabulary:** Adequate for familiar topics, some inaccuracy
✓ **Grammar:** Basic structures used accurately, attempts complex forms
✓ **Pronunciation:** Generally intelligible despite mispronunciation

---

## Examiner's Tips

### Expanding Your Answers:
1. **Add reasons:** "I prefer X because..."
2. **Give examples:** "For instance, last week I..."
3. **Compare/contrast:** "Unlike Y, X is..."
4. **Show change over time:** "In the past... but now..."

### Common Mistakes to Avoid:
❌ One-word answers ("Yes." "No." "Maybe.")
❌ Memorized responses (examiners can tell)
❌ Long silences or saying "I don't know"
❌ Over-using simple vocabulary (good, bad, nice)
❌ Speaking too fast and making careless errors

### Useful Language Patterns:

**Expressing Preferences:**
- I'd say I prefer... mainly because...
- I tend to lean towards... given that...
- If I had to choose, I'd go with...

**Giving Examples:**
- For instance, just last week...
- To give you an example...
- In my experience...

**Hedging (showing uncertainty naturally):**
- I suppose...
- I'd say...
- It seems to me that...
- From what I understand...

**Showing Change:**
- In the past... but nowadays...
- Traditionally... however, recently...
- It used to be that... but now...

---

## Practice Strategy

1. **Record yourself** answering these questions
2. **Listen back** and identify areas for improvement
3. **Time yourself** - aim for 2-3 sentences (20-30 seconds) per answer
4. **Vary your vocabulary** - don't repeat the same adjectives
5. **Practice natural intonation** - don't sound robotic
6. **Extend your answers** using the patterns above
`;
  };

  const generatePart2Questions = (level: string, selectedTopic: string) => {
    return `# IELTS Speaking Part 2
**Topic:** ${selectedTopic}
**Target Band Score:** ${level}
**Duration:** 3-4 minutes (1 minute preparation + 2 minutes speaking)

---

## Instructions

You will be given a topic card. You have exactly 1 minute to prepare notes, then you must speak for 1-2 minutes. The examiner will not interrupt you during this time. After you finish, the examiner may ask 1-2 brief follow-up questions.

---

## Topic Card

**Describe a person who has had a significant influence on your life.**

**You should say:**
- who this person is and how you know them
- what they did that influenced you
- how your life changed because of their influence
- and explain why this person's influence was so important to you

---

## Preparation Notes Template

Use your 1-minute preparation time to jot down key points:

```
WHO: _______________________
HOW I KNOW THEM: _______________________
WHAT THEY DID: _______________________
CHANGES IN MY LIFE: _______________________
WHY IMPORTANT: _______________________
```

---

## Model Answer (Band 7.5+)

I'd like to talk about my former English teacher, Mrs. Chen, who taught me during my final year of high school. She was quite different from other teachers I'd had—more demanding but also more genuinely invested in her students' success.

What made Mrs. Chen particularly influential was her approach to teaching. Rather than simply following the textbook, she encouraged us to think critically and express our own opinions. I remember one specific incident that really changed my perspective. We were studying literature, and instead of telling us what the author meant, she asked us to form our own interpretations and defend them with evidence. Initially, I found this terrifying because I was used to being given the "correct" answers. However, this experience taught me to trust my analytical abilities.

The influence of her teaching extended well beyond the classroom. Because of her encouragement, I became much more confident in expressing my ideas, which ultimately influenced my decision to pursue a career in communications. Before meeting her, I was quite shy and reluctant to speak up in class. She created an environment where making mistakes was seen as part of the learning process, which was liberating for someone like me who had always been afraid of being wrong.

Why was her influence so profound? I think it's because she didn't just teach me English—she taught me how to think independently and communicate effectively. These are skills I use every single day in my professional and personal life. Even now, years after graduation, I find myself applying the lessons she taught me. Her belief in my potential gave me the confidence to take risks and pursue opportunities I might otherwise have avoided.

Looking back, I realize that Mrs. Chen appeared in my life at exactly the right moment, when I was forming my identity and considering my future path. Her influence helped shape not just my career choice but my entire approach to learning and personal growth.

---

## Analysis of Model Answer

### Structure:
✓ **Introduction** (Who + How I know them): 2 sentences establishing the person
✓ **Main Body 1** (What they did): Specific example with details
✓ **Main Body 2** (Changes in my life): Clear before/after comparison
✓ **Main Body 3** (Why important): Deeper reflection and lasting impact
✓ **Conclusion**: Brief reflection tying everything together

### Language Features:

**Advanced Vocabulary:**
- genuinely invested
- form interpretations
- analytical abilities
- liberating experience
- profound influence
- pursue opportunities

**Complex Grammar:**
- Past perfect: "I'd had," "I had always been"
- Conditional: "opportunities I might otherwise have avoided"
- Relative clauses: "who taught me," "which ultimately influenced"
- Participle clauses: "Before meeting her," "Looking back"

**Cohesive Devices:**
- Time markers: Initially, However, Even now, Looking back
- Reason/Result: Because of, which ultimately, so profound
- Addition: Rather than, also, not just... but
- Emphasis: quite, particularly, exactly, entire

**Personal Engagement:**
- First-person reflection throughout
- Specific memories ("I remember one specific incident")
- Emotional language ("terrifying," "liberating," "profound")
- Present relevance ("Even now," "every single day")

---

## Band Score Guidelines

### Band 7.5-8.0:
✓ Speaks fluently for 2 minutes with minimal hesitation
✓ Develops topic fully with relevant details
✓ Uses sophisticated vocabulary naturally
✓ Complex grammar with consistent accuracy
✓ Clear pronunciation with natural intonation

### Band 7.0:
✓ Maintains speech without obvious effort
✓ Addresses all bullet points adequately
✓ Less common vocabulary used flexibly
✓ Range of complex structures, mostly accurate
✓ Pronunciation clear throughout

### Band 6.5:
✓ Develops topic but may lack some detail
✓ All bullet points covered
✓ Adequate vocabulary with some flexibility
✓ Mix of simple and complex grammar
✓ Generally clear pronunciation

---

## Common Mistakes to Avoid

❌ **Stopping after 1 minute** - You must speak for at least 1.5-2 minutes
❌ **Not addressing all bullet points** - Make sure you cover everything on the card
❌ **Memorizing answers** - Examiners detect this and may give lower scores
❌ **Using overly simple language** - "She was nice" instead of "She was genuinely caring"
❌ **Lack of specific details** - General statements without examples
❌ **No personal reflection** - Not explaining why something matters to you

---

## Useful Language Patterns

### Introducing the Topic:
- I'd like to talk about...
- The person I want to describe is...
- I've chosen to speak about...

### Describing People:
- What struck me most about [person] was...
- [Person] had a real talent for...
- I was particularly impressed by...
- [Person] stood out because...

### Explaining Influence:
- Thanks to [person], I...
- Because of their influence, I...
- Their guidance helped me to...
- I credit [person] with...

### Reflecting on Importance:
- Looking back, I realize...
- What made this so significant was...
- To this day, I still...
- The lasting impact has been...

---

## Practice Strategy

1. **Set a timer** for 1 minute preparation, 2 minutes speaking
2. **Record yourself** to check timing and fluency
3. **Use all 4 bullet points** as your structure
4. **Add specific examples** and details
5. **Practice different topics** to build flexibility
6. **Focus on pronunciation** and natural intonation
7. **Reflect personally** - don't just describe, explain why it matters

---

## Follow-up Questions (Rounding Off)

After your 2-minute speech, the examiner may ask brief questions like:

- Do you still keep in touch with this person?
- Have you influenced anyone in a similar way?
- Would you like to have the same kind of influence on others?

Keep these answers brief (2-3 sentences) as you're transitioning to Part 3.
`;
  };

  const generatePart3Questions = (level: string, selectedTopic: string) => {
    return `# IELTS Speaking Part 3
**Topic:** ${selectedTopic}
**Target Band Score:** ${level}
**Duration:** 4-5 minutes

---

## Instructions

In Part 3, the examiner will ask more abstract questions related to the topic from Part 2. You should give longer, more developed answers that demonstrate your ability to discuss complex ideas. Think of this as an academic discussion rather than personal experience sharing.

---

## Questions

### Theme: ${selectedTopic}

**Question Set 1: General Issues**

1. How have teaching methods changed in your country over the past few decades?

2. Do you think technology has improved education, or has it created new problems?

3. Why do some students succeed academically while others struggle, even with similar opportunities?

**Question Set 2: Societal Impact**

4. Should universities prioritize practical skills or theoretical knowledge?

5. How important is formal education compared to life experience in today's job market?

6. What role should governments play in making education more accessible?

**Question Set 3: Future Trends**

7. How do you think education will change in the next 20-30 years?

8. Will traditional classroom-based learning become obsolete with advances in online education?

9. What skills do you think will be most important for future generations to learn?

---

## Model Answers (Band 7.5+ Examples)

### Question 1: How have teaching methods changed in your country?

**Band 7.5+ Response:**

"Teaching methods in my country have undergone quite dramatic transformations, particularly in the last two decades. Traditionally, education was very teacher-centered, with students expected to passively absorb information through lectures and memorization. The emphasis was heavily on rote learning and examination performance rather than genuine understanding.

However, there's been a significant shift toward more interactive and student-centered approaches. Many schools now incorporate project-based learning, group discussions, and hands-on activities. This reflects a broader recognition that education should develop critical thinking skills rather than just knowledge retention. Additionally, technology has played a major role—interactive whiteboards, online learning platforms, and educational apps have transformed how material is delivered and assessed.

That said, the transition hasn't been uniform across the country. While urban schools in affluent areas have embraced these innovations, rural and underfunded schools often still rely on traditional methods simply due to resource constraints. This creates a concerning educational divide that policymakers are increasingly trying to address."

**Key Features:**
- Temporal comparison (Traditionally vs. However, there's been)
- Specific examples (project-based learning, interactive whiteboards)
- Critical analysis (reflects a broader recognition, creates a concerning divide)
- Balanced view (acknowledges variations)
- Sophisticated vocabulary (undergone, passive absorption, uniform, constraints)

---

### Question 4: Should universities prioritize practical skills or theoretical knowledge?

**Band 7.5+ Response:**

"This is quite a contentious issue in educational policy debates. I'd argue that universities need to strike a balance between the two, though the ideal balance might vary depending on the field of study.

On one hand, theoretical knowledge provides the foundational understanding necessary for innovation and advanced problem-solving. Without a solid grasp of underlying principles, graduates may struggle to adapt when technologies or industry practices change. For instance, a computer science graduate who only learns specific programming languages without understanding algorithms and data structures will find themselves at a disadvantage as the field evolves.

On the other hand, practical skills ensure graduates are immediately employable and can contribute productively from day one. Employers frequently complain about the 'theory-practice gap,' where new graduates have impressive academic credentials but lack basic professional competencies. Internships, case studies, and applied projects can bridge this gap effectively.

Ideally, universities should integrate both approaches. Perhaps the first years could focus more on theoretical foundations, with later years incorporating increasingly practical applications. This progressive model would produce graduates who are both adaptable thinkers and capable practitioners. Ultimately, the goal should be creating well-rounded professionals who can both understand and apply their knowledge in real-world contexts."

**Key Features:**
- Clear thesis (need to strike a balance)
- Both-sides argument structure (On one hand... On the other hand)
- Concrete examples (computer science, programming languages)
- Use of reported speech (Employers frequently complain)
- Proposed solution (Ideally, universities should integrate)
- Academic discourse markers (However, Ultimately, For instance)

---

### Question 7: How do you think education will change in the next 20-30 years?

**Band 7.5+ Response:**

"I imagine education will be almost unrecognizable compared to today's model, driven primarily by technological advancement and changing workforce demands.

First, I anticipate artificial intelligence will play a central role in personalized learning. Rather than one-size-fits-all curricula, AI systems could adapt content and pacing to individual students' learning styles, abilities, and progress. This could potentially address some of the persistent inequalities in education outcomes we see today.

Second, the physical classroom might become less central to the learning experience. We're already seeing this trend with online and hybrid models, but I think it will accelerate. Students might spend less time in traditional lectures and more time in collaborative problem-solving sessions, while accessing content asynchronously through sophisticated digital platforms.

Third, the boundaries between education and work will likely blur. Rather than 'front-loading' all education in youth and then working for decades, we might see continuous learning throughout people's careers as a necessity. Micro-credentials and just-in-time learning could replace traditional degrees for many professions.

However, I don't think technology will completely replace human teachers. The social and emotional aspects of education—mentorship, motivation, character development—require human connection. The teacher's role might shift from information delivery to facilitation and coaching, but it will remain essential.

One potential concern is that these advances could exacerbate educational inequality if access to technology remains uneven. Policymakers will need to ensure that technological progress doesn't create a two-tier system where only wealthy students benefit from these innovations."

**Key Features:**
- Future speculation with appropriate hedging (I imagine, I anticipate, might)
- Organized points (First, Second, Third)
- Causal reasoning (driven by, Rather than, as a necessity)
- Balanced perspective (However, One potential concern)
- Sophisticated vocabulary (unrecognizable, asynchronously, micro-credentials, exacerbate)
- Social awareness (persistent inequalities, two-tier system)

---

## Assessment Criteria

### Band 7.5-8.0:
✓ Develops complex ideas with supporting arguments
✓ Uses sophisticated vocabulary precisely
✓ Complex grammar with flexibility and accuracy
✓ Discusses abstract concepts comfortably
✓ Provides balanced, nuanced perspectives

### Band 7.0:
✓ Extends responses with relevant ideas
✓ Less common vocabulary used flexibly
✓ Range of complex structures with good control
✓ Can discuss abstract topics with some sophistication
✓ Maintains coherent argument

### Band 6.5:
✓ Produces extended responses
✓ Adequate vocabulary with some flexibility
✓ Mix of simple and complex grammar
✓ Can discuss familiar abstract topics
✓ Generally coherent with some development

---

## Advanced Language Patterns

### Presenting Arguments:
- One could argue that...
- From a [economic/social/practical] perspective...
- It's worth considering that...
- The prevailing view is that... however...

### Giving Examples:
- Take [X] as a case in point...
- This is exemplified by...
- To illustrate this, consider...
- A notable example would be...

### Showing Cause and Effect:
- This has led to / resulted in...
- Consequently, / As a consequence...
- This stems from / is rooted in...
- The upshot of this is...

### Contrasting Ideas:
- Conversely, / By contrast...
- While it's true that... it's also the case that...
- This stands in stark contrast to...
- Notwithstanding these benefits...

### Speculating About the Future:
- It's conceivable that...
- We're likely to see...
- The trajectory suggests...
- All indications point to...

### Expressing Uncertainty/Hedging:
- To some extent...
- It could be argued that...
- There's a strong possibility that...
- One might speculate that...

---

## Common Mistakes to Avoid

❌ **Being too personal** - Part 3 requires more general, analytical responses
❌ **Yes/No answers** - Always expand with reasons and examples
❌ **Oversimplifying** - These are complex questions requiring nuanced answers
❌ **Repeating Part 2** - Don't just retell personal experiences
❌ **Contradicting yourself** - Stay consistent unless explicitly changing view
❌ **Not taking a stance** - It's okay to have an opinion; avoid fence-sitting

---

## Practice Strategy

1. **Think before speaking** - Take 2-3 seconds to organize your thoughts
2. **Structure your answer**: Point → Reason → Example → Conclusion
3. **Practice abstract thinking** - Move from specific to general concepts
4. **Develop both sides** of arguments before concluding
5. **Use discourse markers** to guide the examiner through your reasoning
6. **Record and analyze** your responses for vocabulary and grammar range
7. **Engage with current affairs** to have relevant examples ready

---

## Examiner's Tips

### Demonstrating Higher Band Scores:

**Vocabulary:**
- Don't just use advanced words—use them accurately and appropriately
- Paraphrase the examiner's questions rather than repeating exact words
- Show range across different semantic fields

**Grammar:**
- Use a variety of complex structures naturally (conditionals, relative clauses, passive voice)
- Don't force complicated grammar if it causes errors
- Maintain accuracy while showing range

**Discourse Management:**
- Signal your answer structure to the examiner
- Use appropriate academic discourse markers
- Maintain coherence across multiple speaking turns

**Critical Thinking:**
- Acknowledge complexity and different perspectives
- Qualify statements appropriately (often, generally, in some cases)
- Show awareness of broader social/economic/cultural factors

---

## Time Management

Part 3 typically has 9-11 questions total, though you won't answer all of them. The examiner will select based on:
- Your performance so far
- Available time
- Natural flow of conversation

Aim for **30-45 second responses** - long enough to develop ideas but not so long that the examiner can't ask enough questions.
`;
  };

  return (
    <>
      <SEO 
        title="IELTS Speaking Practice Test Generator"
        description="Generate authentic IELTS speaking practice questions with model answers and examiner feedback criteria for all three parts."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/">
            <Button variant="ghost" className="mb-6 group">
              <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Button>
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900">Speaking Practice</h1>
            </div>
            <p className="text-lg text-slate-600">
              Generate speaking practice questions with model answers and detailed examiner feedback
            </p>
          </div>

          <Card className="p-8 bg-white/90 backdrop-blur shadow-xl">
            <Tabs value={part} onValueChange={(value) => {
              setPart(value);
              setTopic("");
            }} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="part1">Part 1</TabsTrigger>
                <TabsTrigger value="part2">Part 2</TabsTrigger>
                <TabsTrigger value="part3">Part 3</TabsTrigger>
              </TabsList>

              <TabsContent value="part1" className="space-y-6">
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-800">
                    <strong>Part 1 Format:</strong> 4-5 minutes of questions about familiar topics. 
                    Practice giving natural, extended answers (2-3 sentences each).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty-part1" className="text-base font-semibold">Target Band Score</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger id="difficulty-part1">
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

                  <div className="space-y-2">
                    <Label htmlFor="topic-part1" className="text-base font-semibold">Topic Area</Label>
                    <Select value={topic} onValueChange={setTopic}>
                      <SelectTrigger id="topic-part1">
                        <SelectValue placeholder="Choose a topic area" />
                      </SelectTrigger>
                      <SelectContent>
                        {getTopics().map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleGenerate}
                  disabled={!topic || isGenerating}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-lg py-6"
                >
                  {isGenerating ? (
                    <>Generating Part 1 Questions...</>
                  ) : (
                    <>
                      <Sparkles className="mr-2 w-5 h-5" />
                      Generate Part 1 Questions
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="part2" className="space-y-6">
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-800">
                    <strong>Part 2 Format:</strong> 1 minute preparation + 1-2 minutes speaking. 
                    You must speak continuously on the topic card without interruption.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty-part2" className="text-base font-semibold">Target Band Score</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger id="difficulty-part2">
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

                  <div className="space-y-2">
                    <Label htmlFor="topic-part2" className="text-base font-semibold">Topic Card</Label>
                    <Select value={topic} onValueChange={setTopic}>
                      <SelectTrigger id="topic-part2">
                        <SelectValue placeholder="Choose a topic card" />
                      </SelectTrigger>
                      <SelectContent>
                        {getTopics().map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleGenerate}
                  disabled={!topic || isGenerating}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-lg py-6"
                >
                  {isGenerating ? (
                    <>Generating Part 2 Topic Card...</>
                  ) : (
                    <>
                      <Sparkles className="mr-2 w-5 h-5" />
                      Generate Part 2 Topic Card
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="part3" className="space-y-6">
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-800">
                    <strong>Part 3 Format:</strong> 4-5 minutes of abstract questions related to Part 2. 
                    Give longer, more developed answers with analysis and examples.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty-part3" className="text-base font-semibold">Target Band Score</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger id="difficulty-part3">
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

                  <div className="space-y-2">
                    <Label htmlFor="topic-part3" className="text-base font-semibold">Discussion Topic</Label>
                    <Select value={topic} onValueChange={setTopic}>
                      <SelectTrigger id="topic-part3">
                        <SelectValue placeholder="Choose a discussion topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {getTopics().map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleGenerate}
                  disabled={!topic || isGenerating}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-lg py-6"
                >
                  {isGenerating ? (
                    <>Generating Part 3 Questions...</>
                  ) : (
                    <>
                      <Sparkles className="mr-2 w-5 h-5" />
                      Generate Part 3 Questions
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </Card>

          {generatedQuestions && (
            <Card className="mt-8 p-8 bg-white shadow-xl">
              <div className="prose prose-slate max-w-none">
                <div className="mb-6 p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
                  <p className="text-sm font-medium text-orange-900 mb-2">
                    🎤 Speaking Practice Instructions
                  </p>
                  <p className="text-sm text-orange-800">
                    Practice answering these questions out loud. Record yourself if possible, 
                    and compare your responses to the model answers provided. Focus on fluency, 
                    vocabulary range, grammatical accuracy, and pronunciation.
                  </p>
                </div>
                
                <div className="whitespace-pre-wrap font-sans leading-relaxed">
                  {generatedQuestions.split('\n').map((line, index) => {
                    if (line.startsWith('# ')) {
                      return <h1 key={index} className="text-3xl font-bold text-slate-900 mt-8 mb-4">{line.substring(2)}</h1>;
                    } else if (line.startsWith('## ')) {
                      return <h2 key={index} className="text-2xl font-bold text-slate-800 mt-6 mb-3 pb-2 border-b-2 border-orange-200">{line.substring(3)}</h2>;
                    } else if (line.startsWith('### ')) {
                      return <h3 key={index} className="text-xl font-semibold text-slate-700 mt-5 mb-2">{line.substring(4)}</h3>;
                    } else if (line.startsWith('**') && line.endsWith('**')) {
                      return <p key={index} className="font-bold text-slate-900 mt-3">{line.replace(/\*\*/g, '')}</p>;
                    } else if (line.startsWith('✓ ') || line.startsWith('❌ ')) {
                      return <p key={index} className="text-slate-700 mb-2 pl-2">{line}</p>;
                    } else if (line.trim().startsWith('```')) {
                      return null;
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
                  Generate Another Set of Questions
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}