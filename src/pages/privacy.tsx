import { SEO } from "@/components/SEO";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Lock, Database, FileText, Mail } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <>
      <SEO
        title="Privacy Policy - IELTS Practice"
        description="Privacy Policy for IELTS Academic Practice app. Learn how we collect, use, and protect your data using Supabase for secure authentication and storage."
        url="https://yourdomain.com/privacy"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="mb-4 gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Privacy Policy
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Last Updated: February 2026
                </p>
              </div>
            </div>
          </div>

          {/* Content Cards */}
          <div className="space-y-6">
            {/* Introduction */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  1. Introduction
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300">
                  This Privacy Policy explains how our <strong>IELTS Academic Practice app</strong> collects, uses, and protects your information. By using the app, you agree to the terms outlined here.
                </p>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  2. Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li>
                    <strong>Account Information:</strong> We use <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">Supabase</a> for authentication. When you sign up, we collect your email address to manage your account and save your practice history.
                  </li>
                  <li>
                    <strong>User Content:</strong> We store your IELTS Writing responses and Listening test scores so you can track your progress via the &apos;History&apos; feature.
                  </li>
                  <li>
                    <strong>Device Information:</strong> We may collect basic technical data (e.g., device type, OS version) to ensure the app runs smoothly.
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* How We Use Your Data */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                  3. How We Use Your Data
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>To provide and maintain your practice history.</li>
                  <li>To generate AI-based feedback on your writing tasks.</li>
                  <li>To allow you to export your results as a PDF.</li>
                  <li>To improve the app experience and fix technical issues.</li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Storage and Security */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
                  4. Data Storage and Security
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300">
                  Your data is securely stored using <strong>Supabase</strong>, which utilizes industry-standard encryption and security practices. We do not sell your personal data to third parties. All data transmission is encrypted using HTTPS/TLS protocols.
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-3">
                  Supabase provides enterprise-grade security including:
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 mt-2">
                  <li>Row-level security (RLS) to isolate user data</li>
                  <li>Encrypted data at rest and in transit</li>
                  <li>Regular security audits and compliance certifications</li>
                  <li>ISO 27001 and SOC 2 Type II compliance</li>
                </ul>
              </CardContent>
            </Card>

            {/* User Rights & Data Deletion */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  5. User Rights & Data Deletion
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300">
                  You have the right to access, correct, or delete your data at any time. To delete your account and all associated data, please contact us at the email address below.
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-3">
                  <strong>Your rights include:</strong>
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 mt-2">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update or correct your information</li>
                  <li><strong>Deletion:</strong> Request complete removal of your account and data</li>
                  <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                  <li><strong>Objection:</strong> Object to certain processing activities</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 mt-3">
                  Data deletion requests will be processed within <strong>30 days</strong>. Once deleted, your data cannot be recovered.
                </p>
              </CardContent>
            </Card>

            {/* Third-Party Services */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  6. Third-Party Services
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300">
                  We use <strong>Supabase</strong> for database and authentication services. Supabase is our primary backend provider and handles all user data storage and authentication.
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-3">
                  For more information about how Supabase handles your data, please refer to:
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 mt-2">
                  <li>
                    <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">
                      Supabase Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="https://supabase.com/security" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">
                      Supabase Security Practices
                    </a>
                  </li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 mt-3">
                  We do not use any advertising networks, analytics trackers, or sell your data to third parties.
                </p>
              </CardContent>
            </Card>

            {/* Children's Privacy */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Shield className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  7. Children&apos;s Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300">
                  Our app is intended for users aged 13 and above. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
                </p>
              </CardContent>
            </Card>

            {/* Changes to This Policy */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  8. Changes to This Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300">
                  We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated &quot;Last Updated&quot; date. We encourage you to review this policy periodically for any updates.
                </p>
              </CardContent>
            </Card>

            {/* Contact Us */}
            <Card className="border-2 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  9. Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  If you have questions about this policy or wish to exercise your data rights, please contact us:
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <a 
                      href="mailto:nupurielts@gmail.com" 
                      className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                    >
                      nupurielts@gmail.com
                    </a>
                  </div>
                  <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <a href="mailto:nupurielts@gmail.com">
                      Contact Support
                    </a>
                  </Button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                  We typically respond to all inquiries within 48 hours.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center pb-8">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              By using our IELTS Academic Practice app, you acknowledge that you have read and understood this Privacy Policy.
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <Link href="/">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}