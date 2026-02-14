import { SEO } from "@/components/SEO";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, RefreshCw, AlertTriangle } from "lucide-react";
import { useRouter } from "next/router";

export default function Custom500() {
  const router = useRouter();

  const handleRefresh = () => {
    router.reload();
  };

  return (
    <>
      <SEO
        title="Server Error - IELTS Practice"
        description="An error occurred on our server."
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-red-50 dark:from-gray-900 dark:to-slate-900 flex items-center justify-center px-4">
        <Card className="max-w-2xl w-full shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-12 w-12 text-white" />
            </div>
            <CardTitle className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              500 - Server Error
            </CardTitle>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Something went wrong on our end. We&apos;re working to fix it!
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-red-600" />
                What happened?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Our server encountered an unexpected error while processing your request.
                This issue has been automatically logged and our team will investigate.
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Try refreshing the page</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Check back in a few minutes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Contact support if the issue persists</span>
                </li>
              </ul>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Button onClick={handleRefresh} className="w-full" size="lg">
                <RefreshCw className="mr-2 h-5 w-5" />
                Refresh Page
              </Button>
              <Link href="/">
                <Button variant="outline" className="w-full" size="lg">
                  <Home className="mr-2 h-5 w-5" />
                  Back to Home
                </Button>
              </Link>
            </div>

            <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
              Error persisting? Contact us at{" "}
              <a
                href="mailto:nupurielts@gmail.com"
                className="text-red-600 hover:underline"
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