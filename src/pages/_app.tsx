import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useRouter } from "next/router";

// Vercel Integrations (optional - uncomment to enable)
// import { Analytics } from '@vercel/analytics/react';
// import { SpeedInsights } from '@vercel/speed-insights/next';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Log page views in development
    if (process.env.NODE_ENV === "development") {
      const handleRouteChange = (url: string) => {
        console.log(`Page view: ${url}`);
      };

      router.events.on("routeChangeComplete", handleRouteChange);
      return () => {
        router.events.off("routeChangeComplete", handleRouteChange);
      };
    }
  }, [router.events]);

  return (
    <ErrorBoundary>
      <Component {...pageProps} />
      <Toaster />
      {/* Uncomment to enable Vercel Analytics */}
      {/* <Analytics /> */}
      {/* Uncomment to enable Speed Insights */}
      {/* <SpeedInsights /> */}
    </ErrorBoundary>
  );
}
