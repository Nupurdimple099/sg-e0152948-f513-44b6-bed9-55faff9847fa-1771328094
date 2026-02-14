import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Filter,
  ArrowUpDown,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Download,
  Plus,
  RefreshCw,
  FileText,
  CheckSquare,
  Square,
} from "lucide-react";

type IELTSTest = Database["public"]["Tables"]["ielts_papers"]["Row"];

type SortField = "test_title" | "created_at" | "difficulty" | "category";
type SortDirection = "asc" | "desc";

interface EditingTest {
  test_id: string;
  test_title: string;
  category: string;
  difficulty: string;
  exam_type: string;
  prompt_text: string | null;
  audio_url: string | null;
}

export default function TestManagement() {
  const router = useRouter();
  const { toast } = useToast();

  // State management
  const [tests, setTests] = useState<IELTSTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [examTypeFilter, setExamTypeFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedTests, setSelectedTests] = useState<Set<string>>(new Set());
  const [editingTest, setEditingTest] = useState<EditingTest | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [testToDelete, setTestToDelete] = useState<string | null>(null);

  // Fetch tests from Supabase
  const fetchTests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("ielts_papers")
        .select("*")
        .order(sortField, { ascending: sortDirection === "asc" });

      if (error) throw error;

      setTests(data || []);
    } catch (error) {
      console.error("Error fetching tests:", error);
      toast({
        title: "Error",
        description: "Failed to load tests. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [sortField, sortDirection]);

  // Filtered and sorted tests
  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      const matchesSearch = test.test_title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || test.category === categoryFilter;
      const matchesDifficulty =
        difficultyFilter === "all" || test.difficulty === difficultyFilter;
      const matchesExamType =
        examTypeFilter === "all" || test.exam_type === examTypeFilter;

      return (
        matchesSearch && matchesCategory && matchesDifficulty && matchesExamType
      );
    });
  }, [tests, searchQuery, categoryFilter, difficultyFilter, examTypeFilter]);

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedTests.size === filteredTests.length) {
      setSelectedTests(new Set());
    } else {
      setSelectedTests(new Set(filteredTests.map((t) => t.test_id)));
    }
  };

  const toggleSelectTest = (testId: string) => {
    const newSelected = new Set(selectedTests);
    if (newSelected.has(testId)) {
      newSelected.delete(testId);
    } else {
      newSelected.add(testId);
    }
    setSelectedTests(newSelected);
  };

  // Edit handlers
  const openEditDialog = (test: IELTSTest) => {
    setEditingTest({
      test_id: test.test_id,
      test_title: test.test_title,
      category: test.category,
      difficulty: test.difficulty,
      exam_type: test.exam_type,
      prompt_text: test.prompt_text,
      audio_url: test.audio_url,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingTest) return;

    try {
      const { error } = await supabase
        .from("ielts_papers")
        .update({
          test_title: editingTest.test_title,
          category: editingTest.category,
          difficulty: editingTest.difficulty,
          exam_type: editingTest.exam_type,
          prompt_text: editingTest.prompt_text,
          audio_url: editingTest.audio_url,
        })
        .eq("test_id", editingTest.test_id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Test updated successfully",
      });

      setIsEditDialogOpen(false);
      setEditingTest(null);
      fetchTests();
    } catch (error) {
      console.error("Error updating test:", error);
      toast({
        title: "Error",
        description: "Failed to update test. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Delete handlers
  const openDeleteDialog = (testId: string) => {
    setTestToDelete(testId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteTest = async () => {
    if (!testToDelete) return;

    try {
      const { error } = await supabase
        .from("ielts_papers")
        .delete()
        .eq("test_id", testToDelete);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Test deleted successfully",
      });

      setIsDeleteDialogOpen(false);
      setTestToDelete(null);
      fetchTests();
    } catch (error) {
      console.error("Error deleting test:", error);
      toast({
        title: "Error",
        description: "Failed to delete test. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTests.size === 0) return;

    try {
      const { error } = await supabase
        .from("ielts_papers")
        .delete()
        .in("test_id", Array.from(selectedTests));

      if (error) throw error;

      toast({
        title: "Success",
        description: `Deleted ${selectedTests.size} tests successfully`,
      });

      setSelectedTests(new Set());
      fetchTests();
    } catch (error) {
      console.error("Error deleting tests:", error);
      toast({
        title: "Error",
        description: "Failed to delete tests. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Export handler
  const handleExportTests = () => {
    const selectedTestData = tests.filter((t) => selectedTests.has(t.test_id));
    const dataStr = JSON.stringify(selectedTestData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ielts-tests-export-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: `Exported ${selectedTests.size} tests`,
    });
  };

  // Sort handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Badge color helpers
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      reading: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      writing: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      listening: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      speaking: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return colors[difficulty] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-lg font-medium">Loading tests...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Test Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage, filter, and organize your IELTS practice tests
              </p>
            </div>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              size="lg"
            >
              Back to Dashboard
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Tests
                    </p>
                    <p className="text-2xl font-bold">{tests.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Filtered
                    </p>
                    <p className="text-2xl font-bold">{filteredTests.length}</p>
                  </div>
                  <Filter className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Selected
                    </p>
                    <p className="text-2xl font-bold">{selectedTests.size}</p>
                  </div>
                  <CheckSquare className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Button
                  onClick={fetchTests}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
            <CardDescription>
              Find and organize tests by category, difficulty, and more
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <Label htmlFor="search">Search Tests</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="reading">Reading</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                    <SelectItem value="listening">Listening</SelectItem>
                    <SelectItem value="speaking">Speaking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={difficultyFilter}
                  onValueChange={setDifficultyFilter}
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Exam Type Filter */}
              <div>
                <Label htmlFor="examType">Exam Type</Label>
                <Select
                  value={examTypeFilter}
                  onValueChange={setExamTypeFilter}
                >
                  <SelectTrigger id="examType">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedTests.size > 0 && (
              <div className="mt-4 flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-medium">
                  {selectedTests.size} test{selectedTests.size !== 1 ? "s" : ""}{" "}
                  selected
                </p>
                <div className="ml-auto flex gap-2">
                  <Button
                    onClick={handleExportTests}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    onClick={handleBulkDelete}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Selected
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tests Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          selectedTests.size === filteredTests.length &&
                          filteredTests.length > 0
                        }
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("test_title")}
                        className="hover:bg-transparent"
                      >
                        Test Title
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("category")}
                        className="hover:bg-transparent"
                      >
                        Category
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("difficulty")}
                        className="hover:bg-transparent"
                      >
                        Difficulty
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Exam Type</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("created_at")}
                        className="hover:bg-transparent"
                      >
                        Created
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center space-y-2">
                          <FileText className="h-12 w-12 text-gray-400" />
                          <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                            No tests found
                          </p>
                          <p className="text-sm text-gray-500">
                            Try adjusting your filters or create a new test
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTests.map((test) => (
                      <TableRow key={test.test_id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedTests.has(test.test_id)}
                            onCheckedChange={() => toggleSelectTest(test.test_id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {test.test_title}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getCategoryColor(test.category)}
                          >
                            {test.category.charAt(0).toUpperCase() +
                              test.category.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getDifficultyColor(test.difficulty)}
                          >
                            {test.difficulty.charAt(0).toUpperCase() +
                              test.difficulty.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {test.exam_type.charAt(0).toUpperCase() +
                              test.exam_type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(test.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(
                                    `/practice/${test.category}?id=${test.test_id}`
                                  )
                                }
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Test
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openEditDialog(test)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog(test.test_id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Test
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Test Details</DialogTitle>
              <DialogDescription>
                Update test information and metadata
              </DialogDescription>
            </DialogHeader>
            {editingTest && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Test Title</Label>
                  <Input
                    id="edit-title"
                    value={editingTest.test_title}
                    onChange={(e) =>
                      setEditingTest({
                        ...editingTest,
                        test_title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <Select
                      value={editingTest.category}
                      onValueChange={(value) =>
                        setEditingTest({ ...editingTest, category: value })
                      }
                    >
                      <SelectTrigger id="edit-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reading">Reading</SelectItem>
                        <SelectItem value="writing">Writing</SelectItem>
                        <SelectItem value="listening">Listening</SelectItem>
                        <SelectItem value="speaking">Speaking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-difficulty">Difficulty</Label>
                    <Select
                      value={editingTest.difficulty}
                      onValueChange={(value) =>
                        setEditingTest({ ...editingTest, difficulty: value })
                      }
                    >
                      <SelectTrigger id="edit-difficulty">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-examtype">Exam Type</Label>
                    <Select
                      value={editingTest.exam_type}
                      onValueChange={(value) =>
                        setEditingTest({ ...editingTest, exam_type: value })
                      }
                    >
                      <SelectTrigger id="edit-examtype">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {editingTest.category === "writing" && (
                  <div className="grid gap-2">
                    <Label htmlFor="edit-prompt">Writing Prompt</Label>
                    <Textarea
                      id="edit-prompt"
                      value={editingTest.prompt_text || ""}
                      onChange={(e) =>
                        setEditingTest({
                          ...editingTest,
                          prompt_text: e.target.value,
                        })
                      }
                      rows={4}
                    />
                  </div>
                )}
                {editingTest.category === "listening" && (
                  <div className="grid gap-2">
                    <Label htmlFor="edit-audio">Audio URL</Label>
                    <Input
                      id="edit-audio"
                      value={editingTest.audio_url || ""}
                      onChange={(e) =>
                        setEditingTest({
                          ...editingTest,
                          audio_url: e.target.value,
                        })
                      }
                      placeholder="https://example.com/audio.mp3"
                    />
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this test? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteTest}>
                Delete Test
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}