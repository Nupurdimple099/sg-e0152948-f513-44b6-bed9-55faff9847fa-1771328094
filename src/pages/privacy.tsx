import { SEO } from "@/components/SEO";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Database, UserCheck, Mail, Home } from "lucide-react";

export default function Privacy() {
  return (
    <>
      <SEO 
        title="Privacy Policy - IELTS Practice Platform"
        description="Learn how we protect your privacy and handle your data on our IELTS practice platform."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  IELTS Practice
                </h1>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          {/* Privacy Overview Card */}
          <Card className="mb-8 border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                Your Privacy Matters
              </CardTitle>
              <CardDescription>
                We are committed to protecting your personal information and being transparent about our data practices.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                This privacy policy explains how we collect, use, and protect your personal information when you use our IELTS Practice Platform. We believe in transparency and want you to understand exactly what data we collect and why.
              </p>
            </CardContent>
          </Card>

          {/* Data Collection Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                What Data We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  Email Addresses
                </h3>
                <p className="text-gray-700">
                  We collect your email address when you create an account. This is the only personal information we require from you.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Additional Information (Optional)</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                  <li>Full name (optional, for personalization)</li>
                  <li>Practice test results and history</li>
                  <li>Account preferences and settings</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Data Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-600" />
                How We Use Your Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We use your email address and account information for the following purposes:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
                <li><strong>Account Management:</strong> Creating and managing your user account</li>
                <li><strong>Authentication:</strong> Securely logging you in and out of the platform</li>
                <li><strong>Password Recovery:</strong> Sending password reset emails when requested</li>
                <li><strong>Practice History:</strong> Saving and synchronizing your test results across devices</li>
                <li><strong>Service Updates:</strong> Notifying you about important changes to our service (only when necessary)</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Storage Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Data Storage & Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Secure Infrastructure</h3>
                <p className="text-gray-700">
                  Your data is securely stored using <strong>Supabase</strong>, a trusted and secure database platform. Supabase provides enterprise-grade security with:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2 mt-2">
                  <li>End-to-end encryption for data in transit and at rest</li>
                  <li>Row-level security policies to protect your information</li>
                  <li>Regular security audits and compliance certifications</li>
                  <li>Automatic backups and disaster recovery</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Sharing Section */}
          <Card className="mb-8 border-2 border-red-100">
            <CardHeader>
              <CardTitle className="text-red-700">We Do NOT Share Your Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                <p className="text-gray-900 font-semibold mb-2">
                  Your privacy is our priority. We explicitly state:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                  <li>We do <strong>NOT</strong> sell your personal information to third parties</li>
                  <li>We do <strong>NOT</strong> share your email address with advertisers</li>
                  <li>We do <strong>NOT</strong> provide your data to marketing companies</li>
                  <li>We do <strong>NOT</strong> use your information for purposes other than running this platform</li>
                </ul>
              </div>
              <p className="text-gray-700 text-sm">
                <strong>Exception:</strong> We may disclose your information only if required by law or to protect the rights, property, or safety of our users.
              </p>
            </CardContent>
          </Card>

          {/* User Rights Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Rights & Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                You have complete control over your personal information:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h3 className="font-semibold text-blue-900 mb-2">Access Your Data</h3>
                  <p className="text-sm text-gray-700">
                    View and download all your practice history and account information from your profile page.
                  </p>
                </div>
                <div className="border rounded-lg p-4 bg-green-50">
                  <h3 className="font-semibold text-green-900 mb-2">Update Information</h3>
                  <p className="text-sm text-gray-700">
                    Edit your profile details, including your name and preferences, at any time.
                  </p>
                </div>
                <div className="border rounded-lg p-4 bg-purple-50">
                  <h3 className="font-semibold text-purple-900 mb-2">Delete History</h3>
                  <p className="text-sm text-gray-700">
                    Clear individual practice attempts or all history for specific modules whenever you want.
                  </p>
                </div>
                <div className="border rounded-lg p-4 bg-red-50">
                  <h3 className="font-semibold text-red-900 mb-2">Delete Account</h3>
                  <p className="text-sm text-gray-700">
                    Permanently delete your account and all associated data from the Danger Zone in your profile settings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookies Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Cookies & Local Storage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We use minimal cookies and browser storage for essential functionality:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                <li><strong>Authentication Cookies:</strong> To keep you logged in between sessions</li>
                <li><strong>Local Storage:</strong> To temporarily store practice data for guest users (before account creation)</li>
                <li><strong>Theme Preferences:</strong> To remember your dark/light mode preference</li>
              </ul>
              <p className="text-gray-700 text-sm">
                We do <strong>NOT</strong> use tracking cookies, analytics cookies, or advertising cookies.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Policy Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We may update this privacy policy from time to time to reflect changes in our practices or for legal reasons. When we make changes:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                <li>We will update the "Last updated" date at the top of this page</li>
                <li>Significant changes will be communicated via email to registered users</li>
                <li>Continued use of the platform after changes constitutes acceptance of the updated policy</li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="border-2 border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardHeader>
              <CardTitle>Questions or Concerns?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                If you have any questions about this privacy policy or how we handle your data, please don't hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/" className="flex-1">
                  <Button className="w-full" variant="outline">
                    <Home className="w-4 h-4 mr-2" />
                    Return to Home
                  </Button>
                </Link>
                <Link href="/profile" className="flex-1">
                  <Button className="w-full" variant="default">
                    <UserCheck className="w-4 h-4 mr-2" />
                    Manage Your Data
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Footer Note */}
          <div className="mt-12 text-center text-sm text-gray-500">
            <p>
              By using our IELTS Practice Platform, you agree to this privacy policy.
            </p>
            <p className="mt-2">
              Thank you for trusting us with your IELTS preparation journey! 🎓
            </p>
          </div>
        </div>
      </div>
    </>
  );
}