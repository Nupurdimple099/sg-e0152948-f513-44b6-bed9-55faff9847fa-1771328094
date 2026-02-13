import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Headphones, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ListeningPractice() {
  const [section, setSection] = useState("section1");
  const [difficulty, setDifficulty] = useState("6.5-7.5");
  const [context, setContext] = useState("");
  const [generatedTest, setGeneratedTest] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const section1Contexts = [
    "Hotel Booking and Accommodation",
    "Course Enrollment and Registration",
    "Travel Arrangements and Transportation",
    "Event Registration and Ticketing",
    "Insurance Inquiry and Application",
    "Library Membership and Services"
  ];

  const section2Contexts = [
    "Campus Facilities Tour",
    "Local Museum Exhibition",
    "Community Center Activities",
    "Public Transport System",
    "City Park and Recreation",
    "Emergency Procedures"
  ];

  const section3Contexts = [
    "Academic Project Discussion",
    "Research Methodology Planning",
    "Assignment Requirements Review",
    "Study Group Organization",
    "Laboratory Experiment Setup",
    "Literature Review Discussion"
  ];

  const section4Contexts = [
    "Archaeological Discoveries",
    "Renewable Energy Technologies",
    "Marine Biology Research",
    "Urban Planning Strategies",
    "Historical Architecture",
    "Psychological Studies"
  ];

  const getContexts = () => {
    switch (section) {
      case "section1": return section1Contexts;
      case "section2": return section2Contexts;
      case "section3": return section3Contexts;
      case "section4": return section4Contexts;
      default: return section1Contexts;
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const test = generateListeningTest(section, difficulty, context);
      setGeneratedTest(test);
      setIsGenerating(false);
    }, 1500);
  };

  const generateListeningTest = (sectionType: string, level: string, selectedContext: string) => {
    const sectionNumber = sectionType.replace("section", "");
    
    return `# IELTS Listening Practice Test - Section ${sectionNumber}
**Context:** ${selectedContext}
**Target Band Score:** ${level}
**Time Allowed:** ~10 minutes

---

## Instructions

You will hear ${sectionNumber === "1" ? "a conversation between two speakers" : 
                    sectionNumber === "2" ? "a monologue in a social context" :
                    sectionNumber === "3" ? "a conversation between up to four people in an academic context" :
                    "a monologue on an academic subject"}.

First, you have some time to look at questions 1-10.
[30-second pause]
Now listen carefully and answer questions 1-10.

---

## Audio Transcript

${sectionNumber === "1" ? generateSection1Transcript(selectedContext) :
  sectionNumber === "2" ? generateSection2Transcript(selectedContext) :
  sectionNumber === "3" ? generateSection3Transcript(selectedContext) :
  generateSection4Transcript(selectedContext)}

---

## Questions (10 marks)

${sectionNumber === "1" ? generateSection1Questions() :
  sectionNumber === "2" ? generateSection2Questions() :
  sectionNumber === "3" ? generateSection3Questions() :
  generateSection4Questions()}

---

## Answer Key

${sectionNumber === "1" ? generateSection1Answers() :
  sectionNumber === "2" ? generateSection2Answers() :
  sectionNumber === "3" ? generateSection3Answers() :
  generateSection4Answers()}

---

## Examiner's Notes

**Common Mistakes to Avoid:**
- Writing more than the word limit (e.g., three words when only two are allowed)
- Spelling errors (both UK and US spelling accepted, but must be consistent)
- Not using exact words from the recording
- Missing plural forms or articles when they're in the recording
- Writing illegible answers

**Tips for Success:**
- Use the preparation time to predict possible answers
- Listen for signpost language (however, although, in fact)
- Be aware of distractors (information given but then corrected)
- Check grammar (plural/singular, verb forms)
- Transfer answers carefully to the answer sheet

**Band Score Guidelines:**
- Band 7.0+: 8-10 correct answers
- Band 6.5: 7-8 correct answers
- Band 6.0: 6-7 correct answers
- Band 5.5: 5-6 correct answers
`;
  };

  const generateSection1Transcript = (context: string) => {
    return `**Woman:** Good morning, Riverside Hotel. How may I assist you?

**Man:** Hello, I'd like to make a reservation for next month, please.

**Woman:** Certainly. Let me take down some details. Could I have your name, please?

**Man:** Yes, it's David Thompson. That's T-H-O-M-P-S-O-N.

**Woman:** Thank you, Mr. Thompson. And when would you like to check in?

**Man:** I'll be arriving on the 15th of March, and I need to stay for five nights.

**Woman:** So that's checking out on the 20th of March. Now, what type of room would you prefer?

**Man:** Well, I was hoping for a single room, but I need one with a good workspace because I'll be working during my stay.

**Woman:** I'd recommend our executive single room then. It has a large desk, ergonomic chair, and complimentary high-speed internet. The rate is £89 per night.

**Man:** That sounds perfect. Does the price include breakfast?

**Woman:** Yes, it does. Breakfast is served in the Riverside Restaurant from 6:30 to 10:00 AM. We offer both continental and full English breakfast options.

**Man:** Excellent. Is there parking available?

**Woman:** Yes, we have both underground and outdoor parking. Underground parking is £15 per day, while outdoor parking is £8 per day.

**Man:** I'll take the outdoor parking, please.

**Woman:** Noted. Now, would you like to guarantee the reservation with a credit card?

**Man:** Yes. Actually, can I pay the full amount now to avoid any issues?

**Woman:** Of course. The total comes to £485 for five nights, including the parking. May I have your card number?

**Man:** It's 4929 3871 6543 2190.

**Woman:** Thank you. And the expiry date?

**Man:** 08/27. The security code is 742.

**Woman:** Perfect. Your booking is confirmed, Mr. Thompson. You'll receive a confirmation email shortly at... what email address should I use?

**Man:** It's d.thompson@globaltech.com.

**Woman:** Excellent. Is there anything else I can help you with?

**Man:** Yes, actually. I'm arriving quite early—around 6 AM. Would it be possible to check in then?

**Woman:** Standard check-in is at 2 PM, but I'll note your early arrival. We'll do our best to have your room ready, and if not, you're welcome to store your luggage and use our business lounge.

**Man:** That would be great, thank you.

**Woman:** You're welcome. Have a safe journey, and we look forward to welcoming you at Riverside Hotel.`;
  };

  const generateSection2Transcript = (context: string) => {
    return `Good afternoon, everyone, and welcome to Greenfield Community Center. My name's Sarah Martinez, and I'm the activities coordinator here. I'm delighted to give you a tour of our facilities today and tell you about the various programs we offer.

Let me start by giving you a brief history. The community center was established in 1995 with funding from the local council and private donations. Originally, it was just a small building with one multipurpose room, but over the years, we've expanded significantly. Our most recent addition, completed just six months ago, is the state-of-the-art fitness center you can see through these windows.

Now, let's talk about our facilities. On the ground floor, where we are now, we have the main reception area, a café that serves light meals and refreshments from 8 AM to 6 PM, and two activity rooms. The larger room, which can accommodate up to 80 people, is primarily used for yoga classes, dance sessions, and community meetings. The smaller room is perfect for more intimate workshops and is particularly popular with our art classes.

If we head upstairs—and don't worry, there's a lift available—you'll find our library and computer suite. The library has approximately 5,000 books, including a substantial collection of local history materials. Members can borrow up to six books at a time for three weeks. The computer suite has twelve workstations with internet access, and we offer free basic computer courses every Tuesday and Thursday evening.

The third floor houses our childcare facilities. We run a breakfast club from 7:30 to 9 AM and an after-school club from 3:30 to 6 PM during term time. During school holidays, we offer a full-day program from 8 AM to 6 PM. These services are very popular, so I'd recommend registering early if you're interested.

Outside, we have a community garden where members can rent plots for £25 per year. It's become quite a social hub, with gardeners often sharing tips and produce. We also have a children's playground with modern, safety-certified equipment suitable for ages 2 to 12.

Now, regarding membership: there are several options available. Individual membership costs £45 per year and gives you access to all facilities except the fitness center. Family membership is £120 per year and covers two adults and up to three children under 16. If you want to include fitness center access, add £60 to either membership type.

We pride ourselves on offering an incredibly diverse range of activities. For fitness enthusiasts, we have aerobics, pilates, spin classes, and a running club that meets twice weekly. Our arts program includes painting, pottery, creative writing, and photography. We also run language courses in Spanish, French, and Mandarin Chinese.

One program I'm particularly excited about is our "Skills Exchange" initiative, launching next month. This allows members to teach others their skills—anything from cooking traditional recipes to basic home repairs—in exchange for learning something new themselves. It's a wonderful way to build community connections.

Before I take you on the actual tour, I should mention that we're always looking for volunteers. Whether you can spare an hour a week or a day a month, we'd love to hear from you. Current opportunities include helping in the library, assisting with children's activities, and supporting our elderly visitors program.

Right, shall we start the tour? Please follow me, and feel free to ask any questions as we go.`;
  };

  const generateSection3Transcript = (context: string) => {
    return `**Tutor:** Good morning, Emma and James. Thanks for coming to discuss your group project on sustainable urban development. Have you both had a chance to review the assignment brief?

**Emma:** Yes, Dr. Patel. We've read through it several times, but we're a bit unclear about the scope. Should we focus on one city or compare multiple cities?

**Tutor:** That's a good question. I'd recommend focusing on one city as a case study, but you should reference other cities' approaches for context. The key is depth rather than breadth. What city were you thinking of examining?

**James:** We were considering Copenhagen because of its reputation for sustainable planning, but we're worried it might be too commonly chosen.

**Tutor:** Interesting concern. Actually, Copenhagen is fine if you bring a fresh perspective. What specific aspect of sustainability are you planning to focus on?

**Emma:** We thought about concentrating on transportation and its integration with residential zoning. Copenhagen's cycling infrastructure is obviously well-known, but we want to analyze how it actually affects housing patterns and community development.

**Tutor:** Excellent—that's a much more specific angle. That will set your project apart. Now, have you thought about your research methodology?

**James:** We've identified some academic journals and government reports. There's particularly good data from Copenhagen's municipal planning department covering the last 20 years.

**Emma:** We're also hoping to conduct some primary research. Would it be possible to interview local urban planners or residents? Or is that beyond the scope?

**Tutor:** It's ambitious but certainly doable if you manage your time well. However, I'd suggest limiting interviews to perhaps three or four key informants rather than trying for a large sample. Given your six-week timeline, you'll need to reach out soon—within the next week ideally.

**James:** That makes sense. Should we prepare our interview questions before contacting people?

**Tutor:** Absolutely. In fact, I'd like you to submit your interview protocol to me for approval before you contact anyone. This should include your consent form, your questions, and an explanation of how you'll analyze the responses. Can you have that to me by next Friday?

**Emma:** Yes, definitely. Um, regarding the final presentation—is there a specific format you want us to follow?

**Tutor:** The presentation should be 15 minutes with an additional 5 minutes for questions. I'm looking for a clear structure: introduction, methodology, findings, analysis, and conclusions. You should both speak roughly equally, showing collaborative work.

**James:** And the written report—what's the word limit again?

**Tutor:** 3,500 words, excluding references and appendices. But don't just aim to hit the word count. Quality of analysis is far more important than quantity. I've seen excellent 3,200-word papers and poor 3,600-word ones.

**Emma:** Should we include all our raw interview data in the appendices?

**Tutor:** Transcripts of interviews can go in appendices, yes, but summarize the key points in your main text. Remember, your readers shouldn't have to wade through appendices to understand your argument.

**James:** Dr. Patel, one last thing—we've found some conflicting data about cycling rates in Copenhagen. One source says 62% of residents cycle daily, another says 49%. How should we handle that?

**Tutor:** Good question. Acknowledge the discrepancy in your report and explain possible reasons—different survey methodologies, different years, different definitions of "daily cycling." Then clearly state which figure you're using and why. That kind of critical thinking is exactly what I'm looking for.

**Emma:** That's really helpful, thank you. So, just to confirm our next steps: finalize our research questions this week, submit the interview protocol by Friday, and begin reaching out to potential interviewees?

**Tutor:** Perfect. And I'd like to see a draft outline of your report structure in three weeks. Just bullet points showing how you'll organize your argument. Does that all sound manageable?

**James:** Yes, it does. Thank you, Dr. Patel.

**Tutor:** You're welcome. I think you've got a really interesting project here. Just stay organized and don't leave everything until the last week!`;
  };

  const generateSection4Transcript = (context: string) => {
    return `Good afternoon. Today, I'll be discussing recent archaeological discoveries in the Amazon rainforest that are fundamentally changing our understanding of pre-Columbian civilizations in South America.

For over a century, scholars believed that the Amazon basin was sparsely populated before European contact in the 16th century. The prevailing theory held that the rainforest environment was simply too challenging for large-scale settlement. Its poor soil quality, dense vegetation, and lack of large domesticable animals appeared to preclude the development of complex societies. This view, championed by archaeologists throughout the 20th century, seemed supported by the rapid disappearance of indigenous populations after European diseases arrived.

However, recent technological advances have revolutionized archaeological investigation in the Amazon. Specifically, LiDAR technology—which stands for Light Detection and Ranging—allows researchers to create detailed three-dimensional maps of the ground surface, even beneath dense forest canopy. LiDAR works by sending out laser pulses from aircraft and measuring the time they take to bounce back. Sophisticated software can then filter out vegetation, revealing features on the ground that would be invisible to the naked eye.

Using this technology, researchers have identified thousands of previously unknown earthworks across the Amazon basin. These include massive geometric enclosures, some over 300 meters in diameter, as well as raised agricultural fields, causeways, and even what appear to be entire planned cities. The scale of these discoveries is truly remarkable. In the Brazilian state of Acre alone, archaeologists have documented over 450 geometric earthworks, collectively covering an area of approximately 13,000 square kilometers.

One of the most significant sites is located in Bolivia, in the Llanos de Moxos region. Here, researchers have found evidence of a sophisticated water management system dating back over 2,000 years. The inhabitants constructed raised fields—essentially artificial islands for agriculture—connected by an extensive network of canals. This system served multiple purposes: it controlled flooding during the rainy season, provided water during dry periods, and likely supported fish farming. Analysis of soil samples from these raised fields shows they were significantly more fertile than surrounding areas, suggesting the inhabitants deliberately enhanced soil quality, possibly by incorporating charcoal and organic waste.

The organizational capacity required to build these structures implies large, coordinated populations. Conservative estimates suggest that parts of the Amazon may have supported populations of over one million people before European contact. This is ten times higher than previous estimates. Such population density would have required sophisticated agricultural techniques, which brings us to another fascinating discovery: terra preta, or Amazonian dark earth.

Terra preta is a type of very dark, highly fertile soil found in patches throughout the Amazon. Unlike the typically nutrient-poor soils of the rainforest, terra preta contains high concentrations of charcoal, pottery fragments, and organic matter. Radiocarbon dating indicates this soil was created intentionally over many centuries through a process we still don't fully understand. The enhanced fertility of terra preta persists today, two thousand years after its creation, making it of great interest to modern sustainable agriculture researchers.

These discoveries force us to reconsider the relationship between humans and the Amazon rainforest. Rather than an untouched wilderness, the Amazon we see today is, in many ways, a cultural landscape—shaped by millennia of human management. The prevalence of certain tree species, for instance, may reflect ancient cultivation practices. Brazil nut trees, for example, are far more common near archaeological sites, suggesting they were deliberately planted or encouraged by indigenous peoples.

What, then, led to the collapse of these societies? The answer appears to be the catastrophic impact of European diseases. Smallpox, measles, and influenza, against which indigenous peoples had no immunity, spread through populations with devastating speed, often ahead of the European colonizers themselves. It's estimated that up to 90% of indigenous populations died within the first 150 years of contact. The sophisticated agricultural systems fell into disuse, and within a few generations, the jungle reclaimed the landscape.

This research has profound implications. It demonstrates the resilience and ingenuity of pre-Columbian societies and challenges Euro-centric narratives about human civilization. It also provides valuable insights for modern conservation. If the Amazon supported large populations sustainably for millennia, perhaps we can learn from these ancient practices to develop more sustainable land management strategies today.

However, there's an urgency to this work. Modern deforestation threatens these archaeological sites before they can be properly studied. Every year, more of this invaluable historical record is lost to logging, cattle ranching, and agricultural expansion. As we race to document these discoveries, we're simultaneously fighting to preserve what remains of both the ancient heritage and the rainforest itself.`;
  };

  const generateSection1Questions = () => {
    return `### Questions 1-4: Form Completion

Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.

**Hotel Reservation Form**
Guest Name: David (1) _______
Check-in Date: (2) _______
Duration: Five nights
Room Type: (3) _______ single room
Price per night: (4) £_______

### Questions 5-7: Multiple Choice

Choose the correct letter, A, B, or C.

5. Breakfast is available
   A. from 6:00 to 10:30 AM
   B. from 6:30 to 10:00 AM
   C. from 7:00 to 10:00 AM

6. The guest chose outdoor parking because
   A. it's more convenient
   B. it's cheaper
   C. underground parking is full

7. If the room is not ready at 6 AM, the guest can
   A. check in at 2 PM as normal
   B. wait in the reception area
   C. use the business lounge

### Questions 8-10: Note Completion

Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.

**Additional Details**
Total cost including parking: (8) £_______
Confirmation email will be sent to: (9) _______@globaltech.com
Standard check-in time: (10) _______ PM`;
  };

  const generateSection2Questions = () => {
    return `### Questions 1-5: Note Completion

Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.

**Greenfield Community Center**
- Established in: (1) _______
- Latest addition: fitness center (completed (2) _______ ago)
- Café opening hours: 8 AM to (3) _______ PM
- Library: approximately (4) _______ books available
- Members can borrow up to (5) _______ books for three weeks

### Questions 6-8: Multiple Choice

Choose the correct letter, A, B, or C.

6. The large activity room can hold
   A. 60 people
   B. 80 people
   C. 100 people

7. The computer suite offers free courses on
   A. Monday and Wednesday evenings
   B. Tuesday and Thursday evenings
   C. Wednesday and Friday evenings

8. Community garden plots cost
   A. £15 per year
   B. £20 per year
   C. £25 per year

### Questions 9-10: Matching

Match the membership types with the correct prices.

9. Individual membership _______
10. Family membership _______

A. £45
B. £60
C. £105
D. £120
E. £180`;
  };

  const generateSection3Questions = () => {
    return `### Questions 1-4: Note Completion

Complete the notes below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.

**Project Discussion Notes**
- Focus city: Copenhagen
- Specific topic: (1) _______ and residential zoning
- Number of interviews recommended: (2) _______ key informants
- Interview protocol deadline: next (3) _______
- Presentation length: (4) _______ minutes plus 5 minutes Q&A

### Questions 5-7: Multiple Choice

Choose the correct letter, A, B, or C.

5. The tutor recommends focusing on one city because
   A. it's easier to research
   B. depth is more important than breadth
   C. comparing cities is too difficult

6. Students should submit their interview protocol
   A. after conducting the interviews
   B. before contacting potential interviewees
   C. with their final report

7. The written report word limit is
   A. 3,200 words
   B. 3,500 words
   C. 3,600 words

### Questions 8-10: Classification

Classify the following statements according to whether they relate to:
A. The presentation
B. The written report
C. Both presentation and report

8. Should demonstrate collaborative work _______
9. Can include interview transcripts in appendices _______
10. Quality is more important than length _______`;
  };

  const generateSection4Questions = () => {
    return `### Questions 1-5: Sentence Completion

Complete the sentences below. Write NO MORE THAN TWO WORDS for each answer.

1. For over a century, scholars believed the Amazon was _______ before European arrival.
2. _______ technology allows researchers to map the ground beneath forest vegetation.
3. In Brazil's Acre state, archaeologists found over 450 geometric _______.
4. The water management system in Bolivia dates back over _______ years.
5. Terra preta soil contains high levels of charcoal, pottery, and _______.

### Questions 6-8: Multiple Choice

Choose the correct letter, A, B, or C.

6. The raised fields in Bolivia were used for
   A. agriculture only
   B. water storage only
   C. multiple purposes including farming and fish production

7. Population estimates for pre-Columbian Amazon are now
   A. the same as before
   B. five times higher than before
   C. ten times higher than before

8. Brazil nut trees are common near archaeological sites because
   A. they grow naturally there
   B. the soil is better quality
   C. they may have been deliberately cultivated

### Questions 9-10: Yes / No / Not Given

9. LiDAR technology was specifically developed for Amazon archaeology.
10. Up to 90% of indigenous populations died within 150 years of European contact.`;
  };

  const generateSection1Answers = () => {
    return `### Answers 1-10

1. **Thompson** - Spelled out in conversation
2. **15th March** (or "March 15th" or "15 March") - All formats acceptable
3. **executive** - Specified as "executive single room"
4. **89** - Stated as "£89 per night"
5. **B** - "6:30 to 10:00 AM" explicitly stated
6. **B** - £8 vs £15 makes it cheaper
7. **C** - "Welcome to use our business lounge"
8. **485** - Total for 5 nights including parking
9. **d.thompson** - Email address given (accept with or without @globaltech.com)
10. **2** (or "two") - "Standard check-in is at 2 PM"

**Examiner Note:** Pay attention to number formats and spelling variations.`;
  };

  const generateSection2Answers = () => {
    return `### Answers 1-10

1. **1995** - Year explicitly stated
2. **six months** (or "6 months") - "Completed just six months ago"
3. **6** (or "six") - "8 AM to 6 PM"
4. **5,000** (or "five thousand") - "Approximately 5,000 books"
5. **six** (or "6") - "Up to six books at a time"
6. **B** - "Accommodate up to 80 people"
7. **B** - "Tuesday and Thursday evening"
8. **C** - "£25 per year"
9. **A** - Individual membership: £45
10. **D** - Family membership: £120

**Examiner Note:** Watch for distractors—other numbers mentioned in different contexts.`;
  };

  const generateSection3Answers = () => {
    return `### Answers 1-10

1. **transportation** (or "transport") - "Transportation and its integration"
2. **three or four** (accept "3 or 4" or "three to four") - "Three or four key informants"
3. **Friday** - "By next Friday"
4. **15** (or "fifteen") - "15 minutes with an additional 5 minutes"
5. **B** - "Depth rather than breadth" = depth is more important
6. **B** - "Submit...before you contact anyone"
7. **B** - "3,500 words, excluding references"
8. **A** - "You should both speak roughly equally"
9. **B** - "Transcripts...can go in appendices"
10. **B** - "Quality of analysis is far more important than quantity"

**Examiner Note:** Question 2 requires exact phrasing from recording.`;
  };

  const generateSection4Answers = () => {
    return `### Answers 1-10

1. **sparsely populated** - "Sparsely populated before European contact"
2. **LiDAR** - Explicitly named technology
3. **earthworks** - "Over 450 geometric earthworks"
4. **2,000** (or "two thousand") - Dating back timeframe
5. **organic matter** - Third component listed with charcoal and pottery
6. **C** - Multiple purposes explicitly listed (flooding control, water provision, fish farming)
7. **C** - "Ten times higher than previous estimates"
8. **C** - "May reflect ancient cultivation practices" / "deliberately planted"
9. **Not Given** - LiDAR's original purpose not discussed
10. **Yes** - "Up to 90% of indigenous populations died within the first 150 years"

**Examiner Note:** Distinguish between "Not Given" (information absent) and "No" (information contradicted).`;
  };

  return (
    <>
      <SEO 
        title="IELTS Listening Practice Test Generator"
        description="Generate authentic IELTS listening practice tests with transcripts and Cambridge-standard question types for all four sections."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/">
            <Button variant="ghost" className="mb-6 group">
              <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Button>
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900">Listening Practice</h1>
            </div>
            <p className="text-lg text-slate-600">
              Generate Cambridge-standard listening tests with full transcripts and diverse question types
            </p>
          </div>

          <Card className="p-8 bg-white/90 backdrop-blur shadow-xl">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="section" className="text-base font-semibold">Test Section</Label>
                  <Select value={section} onValueChange={(value) => {
                    setSection(value);
                    setContext("");
                  }}>
                    <SelectTrigger id="section">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="section1">Section 1 (Social - Conversation)</SelectItem>
                      <SelectItem value="section2">Section 2 (Social - Monologue)</SelectItem>
                      <SelectItem value="section3">Section 3 (Academic - Conversation)</SelectItem>
                      <SelectItem value="section4">Section 4 (Academic - Monologue)</SelectItem>
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
                <Label htmlFor="context" className="text-base font-semibold">Context Selection</Label>
                <Select value={context} onValueChange={setContext}>
                  <SelectTrigger id="context">
                    <SelectValue placeholder="Choose a context for the listening passage" />
                  </SelectTrigger>
                  <SelectContent>
                    {getContexts().map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>Note:</strong> This practice test includes the full audio transcript. 
                  In the actual IELTS exam, you only hear the recording once, so practice reading the questions 
                  before "listening" to maximize your score.
                </p>
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={!context || isGenerating}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg py-6"
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
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                  <p className="text-sm font-medium text-green-900 mb-2">
                    🎧 Instructions
                  </p>
                  <p className="text-sm text-green-800">
                    Read through the questions first, then "listen" by reading the transcript. 
                    Try to complete the questions as you would during the actual exam. 
                    Check your answers against the key at the end.
                  </p>
                </div>
                
                <div className="whitespace-pre-wrap font-sans leading-relaxed">
                  {generatedTest.split('\n').map((line, index) => {
                    if (line.startsWith('# ')) {
                      return <h1 key={index} className="text-3xl font-bold text-slate-900 mt-8 mb-4">{line.substring(2)}</h1>;
                    } else if (line.startsWith('## ')) {
                      return <h2 key={index} className="text-2xl font-bold text-slate-800 mt-6 mb-3 pb-2 border-b-2 border-green-200">{line.substring(3)}</h2>;
                    } else if (line.startsWith('### ')) {
                      return <h3 key={index} className="text-xl font-semibold text-slate-700 mt-5 mb-2">{line.substring(4)}</h3>;
                    } else if (line.startsWith('**') && line.endsWith('**')) {
                      const content = line.replace(/\*\*/g, '');
                      if (content.endsWith(':')) {
                        return <p key={index} className="font-bold text-slate-900 mt-4 mb-1">{content}</p>;
                      }
                      return <p key={index} className="font-bold text-slate-900 mt-3">{content}</p>;
                    } else if (line.trim() === '---') {
                      return <hr key={index} className="my-6 border-slate-200" />;
                    } else if (line.trim() === '') {
                      return <br key={index} />;
                    } else {
                      return <p key={index} className="text-slate-700 mb-2 leading-relaxed">{line}</p>;
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