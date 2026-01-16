import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit,
  Trash2,
  FlaskConical,
  IndianRupee,
  Tag,
  Clock,
  Search,
  ArrowLeft,
  Bell,
  User,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LabTest {
  id: string;
  test_name: string;
  description: string | null;
  price: number;
  offer_price: number | null;
  category: string | null;
  turnaround_time: string | null;
  is_active: boolean;
}

const categories = [
  "Blood Test",
  "Urine Test",
  "Imaging",
  "Cardiac",
  "Thyroid",
  "Diabetes",
  "Liver Function",
  "Kidney Function",
  "Lipid Profile",
  "Vitamin",
  "Hormone",
  "Infection",
  "Other",
];

const LabTests = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tests, setTests] = useState<LabTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<LabTest | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const [formData, setFormData] = useState({
    test_name: "",
    description: "",
    price: "",
    offer_price: "",
    category: "",
    turnaround_time: "",
    is_active: true,
  });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/");
        return;
      }

      const { data, error } = await supabase
        .from("lab_tests")
        .select("*")
        .eq("lab_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTests(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const testData = {
        lab_id: user.id,
        test_name: formData.test_name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        offer_price: formData.offer_price ? parseFloat(formData.offer_price) : null,
        category: formData.category || null,
        turnaround_time: formData.turnaround_time || null,
        is_active: formData.is_active,
      };

      if (editingTest) {
        const { error } = await supabase
          .from("lab_tests")
          .update(testData)
          .eq("id", editingTest.id);

        if (error) throw error;
        toast({ title: "Test updated successfully" });
      } else {
        const { error } = await supabase
          .from("lab_tests")
          .insert([testData]);

        if (error) throw error;
        toast({ title: "Test added successfully" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchTests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (test: LabTest) => {
    setEditingTest(test);
    setFormData({
      test_name: test.test_name,
      description: test.description || "",
      price: test.price.toString(),
      offer_price: test.offer_price?.toString() || "",
      category: test.category || "",
      turnaround_time: test.turnaround_time || "",
      is_active: test.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this test?")) return;

    try {
      const { error } = await supabase
        .from("lab_tests")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Test deleted successfully" });
      fetchTests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (test: LabTest) => {
    try {
      const { error } = await supabase
        .from("lab_tests")
        .update({ is_active: !test.is_active })
        .eq("id", test.id);

      if (error) throw error;
      fetchTests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingTest(null);
    setFormData({
      test_name: "",
      description: "",
      price: "",
      offer_price: "",
      category: "",
      turnaround_time: "",
      is_active: true,
    });
  };

  const filteredTests = tests.filter((test) => {
    const matchesSearch = test.test_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || test.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 page-enter">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/lab")}
              className="p-2 rounded-xl bg-card shadow-card border border-border/50 hover:shadow-elevated transition-shadow"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <p className="text-sm lg:text-base text-muted-foreground">Diagnostic Center</p>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Manage Tests</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <button className="relative p-3 rounded-xl bg-card shadow-card border border-border/50 hover:shadow-elevated transition-shadow">
              <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <button 
              onClick={() => navigate("/lab/profile")}
              className="p-3 rounded-xl bg-card shadow-card border border-border/50 hover:shadow-elevated transition-shadow"
            >
              <User className="w-5 h-5 lg:w-6 lg:h-6 text-foreground" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Actions Bar */}
          <GlassCard className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full md:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Test
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingTest ? "Edit Test" : "Add New Test"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="test_name">Test Name *</Label>
                      <div className="relative">
                        <FlaskConical className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="test_name"
                          placeholder="e.g., Complete Blood Count"
                          value={formData.test_name}
                          onChange={(e) => setFormData({ ...formData, test_name: e.target.value })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description of the test..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (₹) *</Label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="500"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="offer_price">Offer Price (₹)</Label>
                        <div className="relative">
                          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="offer_price"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="450"
                            value={formData.offer_price}
                            onChange={(e) => setFormData({ ...formData, offer_price: e.target.value })}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="turnaround_time">Turnaround Time</Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="turnaround_time"
                            placeholder="e.g., 24 hours"
                            value={formData.turnaround_time}
                            onChange={(e) => setFormData({ ...formData, turnaround_time: e.target.value })}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                      />
                      <Label htmlFor="is_active">Active (available for booking)</Label>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => {
                        setIsDialogOpen(false);
                        resetForm();
                      }}>
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1">
                        {editingTest ? "Update Test" : "Add Test"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </GlassCard>

          {/* Tests Table */}
          <GlassCard>
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading tests...
              </div>
            ) : filteredTests.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                {tests.length === 0
                  ? "No tests added yet. Click 'Add Test' to get started."
                  : "No tests match your search criteria."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Offer Price</TableHead>
                      <TableHead>Turnaround</TableHead>
                      <TableHead className="text-center">Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTests.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{test.test_name}</p>
                            {test.description && (
                              <p className="text-sm text-muted-foreground truncate max-w-xs">
                                {test.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {test.category && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              {test.category}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{test.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {test.offer_price ? (
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              ₹{test.offer_price.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {test.turnaround_time || "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={test.is_active}
                            onCheckedChange={() => toggleActive(test)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(test)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(test.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </GlassCard>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FlaskConical className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Tests</p>
                  <p className="text-2xl font-bold">{tests.length}</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Tag className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Tests</p>
                  <p className="text-2xl font-bold">{tests.filter(t => t.is_active).length}</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <IndianRupee className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Price</p>
                  <p className="text-2xl font-bold">
                    ₹{tests.length > 0
                      ? (tests.reduce((sum, t) => sum + t.price, 0) / tests.length).toFixed(0)
                      : "0"}
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabTests;
