import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, PenTool, Headphones, Mic, Award, TrendingUp, Zap, Target, CheckCircle2, ArrowRight, History, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { AuthModal } from "@/components/AuthModal";
import { UserMenu } from "@/components/UserMenu";
import { supabase } from "@/integrations/supabase/client";
import { migrateLocalStorageHistory } from "@/services/practiceHistoryService";

export default function Home() {
  const testTypes = [
    {
      icon: BookOpen,
      title: "Reading",
      description: "700-800 word passages with 13 mixed question types",
      color: "from-blue-500 to-cyan-500",
      href: "/practice/reading"
    },
    {
      icon: PenTool,
      title: "Writing",
      description: "Task 1 & Task 2 prompts with model answer outlines",
      color: "from-purple-500 to-pink-500",
      href: "/practice/writing"
    },
    {
      icon: Headphones,
      title: "Listening",
      description: "Audio transcripts with diverse question formats",
      color: "from-green-500 to-emerald-500",
      href: "/practice/listening"
    },
    {
      icon: MessageSquare,
      title: "Speaking",
      description: "Part 1, 2, 3 questions with examiner feedback criteria",
      color: "from-orange-500 to-red-500",
      href: "/practice/speaking"
    }
  ];

  const features = [
    {
      icon: Award,
      title: "Cambridge Standards",
      description: "All materials follow official IELTS examination patterns"
    },
    {
      icon: Target,
      title: "Targeted Practice",
      description: "Choose difficulty levels from 5.0 to 8.5 band scores"
    },
    {
      icon: TrendingUp,
      title: "Detailed Feedback",
      description: "Comprehensive answer keys with examiner explanations"
    }
  ];

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check current user session
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // Auto-migrate localStorage history when user logs in
      if (user) {
        const { migrated } = await migrateLocalStorageHistory();
        if (migrated > 0) {
          console.log(`Migrated ${migrated} practice attempts to Supabase`);
        }
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthSuccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    // Migrate history after successful auth
    if (user) {
      await migrateLocalStorageHistory();
    }
  };

  return (
    <>
      <SEO 
        title="IELTS Practice Test Generator | Professional Exam Preparation"
        description="Generate authentic IELTS practice tests created by a Senior Examiner with 15 years of experience. Cambridge-standard materials for Reading, Writing, Listening, and Speaking."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  IELTS Practice
                </span>
              </div>
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

        {/* Hero Section */}
        <header className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
            <div className="text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <Award className="w-4 h-4" />
                Senior IELTS Examiner · 15 Years Experience
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Master IELTS
                </span>
                <br />
                <span className="text-slate-900">with Authentic Practice</span>
              </h1>
              
              <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 leading-relaxed">
                Generate Cambridge-standard practice tests tailored to your target band score. 
                Each test is crafted with examiner-level precision and official IELTS patterns.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/practice/reading">
                  <Button size="lg" className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-6">
                    Start Practice Test
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 bg-white/80 backdrop-blur border-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Test Types Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Choose Your Practice Module
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Select from our four comprehensive modules, each designed to replicate 
              authentic IELTS examination conditions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testTypes.map((test, index) => (
              <Link key={index} href={test.href}>
                <Card className="group h-full p-6 bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-200">
                  <div className="space-y-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${test.color} p-3 group-hover:scale-110 transition-transform`}>
                      <test.icon className="w-full h-full text-white" />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{test.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{test.description}</p>
                    </div>
                    
                    <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform">
                      Start Practice <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold mb-2">15+</div>
                <div className="text-blue-100">Years of Examining</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">1000+</div>
                <div className="text-blue-100">Practice Tests Created</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">95%</div>
                <div className="text-blue-100">Student Success Rate</div>
              </div>
            </div>
          </Card>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white/50 backdrop-blur mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-center text-slate-600">
              © 2026 IELTS Practice Test Generator. All materials follow official Cambridge IELTS standards.
            </p>
          </div>
        </footer>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}