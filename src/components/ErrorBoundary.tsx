import React, { Component, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by boundary:", error, errorInfo);
    }

    // In production, you could send to an error reporting service
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-red-50 dark:from-gray-900 dark:to-slate-900 flex items-center justify-center px-4">
          <Card className="max-w-2xl w-full shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Something Went Wrong
              </CardTitle>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                An unexpected error occurred. Please try again.
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 overflow-auto max-h-48">
                  <p className="font-mono text-sm text-red-800 dark:text-red-200">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="mt-2 text-xs text-red-700 dark:text-red-300">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}

              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-orange-600" />
                  What can you do?
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Try refreshing the page</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Go back to the homepage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Contact support if the issue persists</span>
                  </li>
                </ul>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Button onClick={this.handleReset} className="w-full" size="lg">
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Try Again
                </Button>
                <Link href="/">
                  <Button variant="outline" className="w-full" size="lg">
                    <Home className="mr-2 h-5 w-5" />
                    Back to Home
                  </Button>
                </Link>
              </div>

              <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                Need help? Contact us at{" "}
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
      );
    }

    return this.props.children;
  }
}