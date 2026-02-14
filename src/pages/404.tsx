import { SEO } from "@/components/SEO";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Search, BookOpen, AlertCircle } from "lucide-react";

export default function Custom404() {
  return (
    <>
      <SEO
        title="Page Not Found - IELTS Practice"
        description="The page you're looking for doesn't exist."
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900 flex items-center justify-center px-4">
        <Card className="max-w-2xl w-full shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-12 w-12 text-white" />
            </div>
            <CardTitle className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              404 - Page Not Found
            </CardTitle>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                What can you do?
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Check the URL for typos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Go back to the homepage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Start practicing IELTS tests</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Contact support if you believe this is an error</span>
                </li>
              </ul>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/">
                <Button className="w-full" size="lg">
                  <Home className="mr-2 h-5 w-5" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/practice/reading">
                <Button variant="outline" className="w-full" size="lg">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Start Practicing
                </Button>
              </Link>
            </div>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
              Need help? Contact us at{" "}
              <a
                href="mailto:nupurielts@gmail.com"
                className="text-blue-600 hover:underline"
              >
                nupurielts@gmail.com
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}