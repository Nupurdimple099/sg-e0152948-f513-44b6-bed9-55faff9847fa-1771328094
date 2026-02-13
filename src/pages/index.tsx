import { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, PenTool, Headphones, MessageSquare, TrendingUp, Award, Users, ArrowRight, CheckCircle2, ArrowUp } from "lucide-react";
import { AuthModal } from "@/components/AuthModal";
import { UserMenu } from "@/components/UserMenu";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Home() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrolled / windowHeight) * 100;
      
      setScrollProgress(progress);
      setShowScrollTop(scrolled > 500);

      // Detect active section
      const sections = ["hero", "modules", "features", "about"];
      const sectionElements = sections.map(id => document.getElementById(id));
      
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i];
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80; // Account for sticky header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const modules = [
    {
      icon: BookOpen,
      title: "Reading",
      description: "Generate academic and general training reading passages with authentic IELTS question types",
      color: "from-blue-500 to-cyan-500",
      borderColor: "border-blue-500",
      href: "/practice/reading",
    },
    {
      icon: PenTool,
      title: "Writing",
      description: "Practice Task 1 and Task 2 with detailed model answers and band score breakdowns",
      color: "from-green-500 to-emerald-500",
      borderColor: "border-green-500",
      href: "/practice/writing",
    },
    {
      icon: Headphones,
      title: "Listening",
      description: "Complete listening tests with all 4 sections and comprehensive audio scripts",
      color: "from-purple-500 to-pink-500",
      borderColor: "border-purple-500",
      href: "/practice/listening",
    },
    {
      icon: MessageSquare,
      title: "Speaking",
      description: "Prepare for all 3 parts with model answers and examiner assessment criteria",
      color: "from-orange-500 to-red-500",
      borderColor: "border-orange-500",
      href: "/practice/speaking",
    },
  ];

  const features = [
    {
      icon: Award,
      title: "Cambridge Standard Quality",
      description: "All content follows official IELTS examination standards and difficulty levels",
    },
    {
      icon: TrendingUp,
      title: "Band Score Targeting",
      description: "Customize difficulty from 5.0 to 8.5 to match your target band score",
    },
    {
      icon: Users,
      title: "Expert Examiner Feedback",
      description: "Detailed model answers with examiner commentary and assessment criteria",
    },
  ];

  return (
    <>
      <SEO
        title="IELTS Practice Test Generator - Cambridge Standard Quality"
        description="Generate authentic IELTS practice tests for Reading, Writing, Listening, and Speaking. Customizable topics, band score targeting, and expert examiner feedback."
        image="/og-image.png"
        url="/"
      />

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                IELTS Prep Pro
              </h1>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => scrollToSection("hero")}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  activeSection === "hero" ? "text-blue-600" : "text-gray-600 dark:text-gray-300"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("modules")}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  activeSection === "modules" ? "text-blue-600" : "text-gray-600 dark:text-gray-300"
                }`}
              >
                Modules
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  activeSection === "features" ? "text-blue-600" : "text-gray-600 dark:text-gray-300"
                }`}
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  activeSection === "about" ? "text-blue-600" : "text-gray-600 dark:text-gray-300"
                }`}
              >
                About
              </button>
            </nav>

            <div className="flex items-center gap-4">
              {user ? (
                <UserMenu onSignOut={handleSignOut} />
              ) : (
                <Button onClick={() => setShowAuthModal(true)}>Sign In</Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
        {/* Hero Section */}
        <section id="hero" className="pt-20 pb-32 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 mb-6 animate-fade-in">
              <Award className="h-5 w-5" />
              <span className="text-sm font-medium">15 Years of IELTS Expertise</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-fade-in-up">
              Master IELTS with
              <br />
              Expert Practice Tests
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
              Generate authentic Cambridge-standard IELTS practice tests with customizable topics,
              band score targeting, and expert examiner feedback.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
              <Button
                size="lg"
                className="text-lg px-8 py-6"
                onClick={() => scrollToSection("modules")}
              >
                Start Practicing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6"
                onClick={() => scrollToSection("features")}
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Modules Section */}
        <section id="modules" className="py-20 px-4 bg-white dark:bg-gray-900">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Practice All Four Modules
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Comprehensive practice for Reading, Writing, Listening, and Speaking with authentic IELTS content
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {modules.map((module, index) => {
                const Icon = module.icon;
                return (
                  <Card
                    key={module.title}
                    className={`group hover:shadow-2xl transition-all duration-300 border-t-4 ${module.borderColor} hover:-translate-y-2 animate-fade-in-up`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader>
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl">{module.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        {module.description}
                      </p>
                      <Link href={module.href}>
                        <Button className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600">
                          Start {module.title} Practice
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Why Choose IELTS Prep Pro?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Professional tools designed to help you achieve your target band score
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={feature.title}
                    className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <CardHeader>
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-16 text-center">
              <Card className="inline-block p-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                <div className="flex items-center gap-4 mb-4">
                  <CheckCircle2 className="h-12 w-12" />
                  <div className="text-left">
                    <h3 className="text-2xl font-bold mb-2">Ready to Start?</h3>
                    <p className="text-blue-100">Join thousands of successful IELTS candidates</p>
                  </div>
                </div>
                <Button
                  size="lg"
                  variant="secondary"
                  className="mt-4"
                  onClick={() => user ? scrollToSection("modules") : setShowAuthModal(true)}
                >
                  {user ? "Start Practicing Now" : "Sign Up Free"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-4 bg-white dark:bg-gray-900">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              About IELTS Prep Pro
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              With 15 years of experience as Senior IELTS Examiners, we understand exactly what it takes
              to achieve your target band score. Our practice tests are designed to match the exact
              standards of Cambridge IELTS examinations.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Every test, every question, and every model answer is crafted with the same attention to
              detail and quality that you&apos;ll encounter in the real IELTS examination.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
                <div className="text-gray-600 dark:text-gray-400">Years Experience</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">1000+</div>
                <div className="text-gray-600 dark:text-gray-400">Practice Tests</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-pink-600 mb-2">95%</div>
                <div className="text-gray-600 dark:text-gray-400">Success Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-6 w-6 text-blue-400" />
                  <span className="text-xl font-bold">IELTS Prep Pro</span>
                </div>
                <p className="text-gray-400">
                  Professional IELTS practice tests with Cambridge-standard quality.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <button onClick={() => scrollToSection("modules")} className="text-gray-400 hover:text-white transition-colors">
                      Practice Modules
                    </button>
                  </li>
                  <li>
                    <button onClick={() => scrollToSection("features")} className="text-gray-400 hover:text-white transition-colors">
                      Features
                    </button>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Practice</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/practice/reading" className="text-gray-400 hover:text-white transition-colors">
                      Reading
                    </Link>
                  </li>
                  <li>
                    <Link href="/practice/writing" className="text-gray-400 hover:text-white transition-colors">
                      Writing
                    </Link>
                  </li>
                  <li>
                    <Link href="/practice/listening" className="text-gray-400 hover:text-white transition-colors">
                      Listening
                    </Link>
                  </li>
                  <li>
                    <Link href="/practice/speaking" className="text-gray-400 hover:text-white transition-colors">
                      Speaking
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} IELTS Prep Pro. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 animate-fade-in"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    </>
  );
}