import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { updatePassword, isPasswordRecovery } from "@/services/authService";

export default function ResetPassword() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    // Check if user has valid password recovery token
    const checkToken = async () => {
      const isRecovery = await isPasswordRecovery();
      setIsValidToken(isRecovery);
      
      if (!isRecovery) {
        setMessage({ 
          type: "error", 
          text: "Invalid or expired reset link. Please request a new password reset." 
        });
      }
    };
    
    checkToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const result = await updatePassword(newPassword);

    setIsLoading(false);

    if (result.success) {
      setMessage({ 
        type: "success", 
        text: "Password updated successfully! Redirecting to home..." 
      });
      
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } else {
      setMessage({ 
        type: "error", 
        text: result.error || "Failed to update password" 
      });
    }
  };

  return (
    <>
      <SEO 
        title="Reset Password - IELTS Practice Platform"
        description="Reset your password to regain access to your IELTS practice account"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Reset Your Password
            </CardTitle>
            <CardDescription className="text-center">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {message && (
              <Alert variant={message.type === "error" ? "destructive" : "default"} className="mb-4">
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            {isValidToken ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Must be at least 6 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  This reset link is invalid or has expired.
                </p>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-blue-600 hover:text-blue-700">
                Return to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}