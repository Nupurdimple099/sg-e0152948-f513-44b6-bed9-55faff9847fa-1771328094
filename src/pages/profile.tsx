import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AuthModal } from "@/components/AuthModal";
import { Dashboard } from "@/components/Dashboard";
import {
  User,
  Mail,
  Lock,
  ArrowLeft,
  Save,
  Trash2,
  BookOpen,
  PenTool,
  Headphones,
  MessageSquare,
  TrendingUp,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { updateProfile, updatePassword, deleteAccount } from "@/services/authService";
import { getPracticeHistory, getUserStatistics } from "@/services/practiceHistoryService";
import { UserMenu } from "@/components/UserMenu";

interface UserStats {
  totalAttempts: number;
  averageBandScore: number;
  readingCount: number;
  writingCount: number;
  listeningCount: number;
  speakingCount: number;
  lastPracticeDate: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Profile form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Statistics state
  const [stats, setStats] = useState<UserStats>({
    totalAttempts: 0,
    averageBandScore: 0,
    readingCount: 0,
    writingCount: 0,
    listeningCount: 0,
    speakingCount: 0,
    lastPracticeDate: null,
  });
  
  // Delete account state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState("");

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/");
        return;
      }

      setUser(user);
      setEmail(user.email || "");
      setFullName(user.user_metadata?.full_name || "");
      
      // Load statistics
      await loadStatistics(user.id);
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error checking user:", error);
      router.push("/");
    }
  };

  const loadStatistics = async (userId: string) => {
    try {
      const userStats = await getUserStatistics(userId);
      setStats(userStats);
    } catch (error) {
      console.error("Error loading statistics:", error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const result = await updateProfile({ full_name: fullName });
      
      if (result.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        
        // Update local user state
        setUser((prev: any) => ({
          ...prev,
          user_metadata: { ...prev.user_metadata, full_name: fullName }
        }));
        
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: "error", text: result.error || "Failed to update profile" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    setIsSaving(true);

    try {
      const result = await updatePassword(newPassword);
      
      if (result.success) {
        setMessage({ type: "success", text: "Password updated successfully!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: "error", text: result.error || "Failed to update password" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmEmail !== email) {
      setMessage({ type: "error", text: "Email does not match" });
      return;
    }

    setIsSaving(true);

    try {
      const result = await deleteAccount();
      
      if (result.success) {
        router.push("/");
      } else {
        setMessage({ type: "error", text: result.error || "Failed to delete account" });
        setShowDeleteDialog(false);
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred" });
      setShowDeleteDialog(false);
    } finally {
      setIsSaving(false);
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case "reading": return <BookOpen className="h-4 w-4" />;
      case "writing": return <PenTool className="h-4 w-4" />;
      case "listening": return <Headphones className="h-4 w-4" />;
      case "speaking": return <MessageSquare className="h-4 w-4" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <>
        <SEO title="Profile - IELTS Practice Platform" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="Profile Management - IELTS Practice Platform" />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <Separator orientation="vertical" className="h-6" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Profile Management
                </h1>
              </div>
              <UserMenu onSignOut={() => router.push('/')} />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {message && (
            <Alert className={`mb-6 ${message.type === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
              {message.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Statistics Cards */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-blue-900 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Total Practice Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{stats.totalAttempts}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-purple-900 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Average Band Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {stats.averageBandScore > 0 ? stats.averageBandScore.toFixed(1) : "N/A"}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-900 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Last Practice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold text-green-600">
                  {stats.lastPracticeDate
                    ? new Date(stats.lastPracticeDate).toLocaleDateString()
                    : "No practice yet"}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Module Statistics */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Practice by Module</CardTitle>
              <CardDescription>Your practice distribution across all four IELTS modules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Reading</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.readingCount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <PenTool className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Writing</p>
                    <p className="text-2xl font-bold text-green-600">{stats.writingCount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 border border-purple-200">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Headphones className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Listening</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.listeningCount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg bg-orange-50 border border-orange-200">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Speaking</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.speakingCount}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Management Tabs */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your profile, security settings, and view your progress</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="dashboard" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="danger">Danger Zone</TabsTrigger>
                </TabsList>

                {/* Dashboard Tab */}
                <TabsContent value="dashboard" className="space-y-4 mt-6">
                  {user && <Dashboard userId={user.id} />}
                </TabsContent>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-4 mt-6">
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="fullName"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-10"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          disabled
                          className="pl-10 bg-gray-50"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <p className="text-sm text-gray-500">Email cannot be changed at this time</p>
                    </div>

                    <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-4 mt-6">
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        Choose a strong password with at least 6 characters
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="pl-10"
                          placeholder="Enter new password"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>

                    <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
                      <Lock className="h-4 w-4 mr-2" />
                      {isSaving ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </TabsContent>

                {/* Danger Zone Tab */}
                <TabsContent value="danger" className="space-y-4 mt-6">
                  <Alert className="bg-red-50 border-red-200">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>Warning:</strong> Deleting your account is permanent and cannot be undone. 
                      All your practice history and data will be permanently deleted.
                    </AlertDescription>
                  </Alert>

                  <div className="pt-4">
                    <Button
                      variant="destructive"
                      onClick={() => setShowDeleteDialog(true)}
                      className="w-full sm:w-auto"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Delete Account Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="space-y-4">
                <p>
                  This action cannot be undone. This will permanently delete your account
                  and remove all your data from our servers.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="deleteConfirmEmail">
                    Type your email <strong>{email}</strong> to confirm:
                  </Label>
                  <Input
                    id="deleteConfirmEmail"
                    type="email"
                    value={deleteConfirmEmail}
                    onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteConfirmEmail("")}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                disabled={deleteConfirmEmail !== email || isSaving}
                className="bg-red-600 hover:bg-red-700"
              >
                {isSaving ? "Deleting..." : "Delete Account"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}