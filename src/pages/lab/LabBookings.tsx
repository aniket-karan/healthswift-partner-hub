import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  Search,
  User,
  Phone,
  Mail,
  Calendar,
  IndianRupee,
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeft,
  Bell,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface LabTest {
  id: string;
  test_name: string;
  price: number;
  offer_price: number | null;
}

interface TestBooking {
  id: string;
  test_id: string;
  patient_name: string;
  patient_phone: string | null;
  patient_email: string | null;
  booking_date: string;
  amount_paid: number;
  status: string;
  notes: string | null;
  created_at: string;
  lab_tests?: LabTest;
}

const LabBookings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<TestBooking[]>([]);
  const [tests, setTests] = useState<LabTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [formData, setFormData] = useState({
    test_id: "",
    patient_name: "",
    patient_phone: "",
    patient_email: "",
    booking_date: format(new Date(), "yyyy-MM-dd"),
    notes: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/");
        return;
      }

      // Fetch tests
      const { data: testsData, error: testsError } = await supabase
        .from("lab_tests")
        .select("id, test_name, price, offer_price")
        .eq("lab_id", user.id)
        .eq("is_active", true);

      if (testsError) throw testsError;
      setTests(testsData || []);

      // Fetch bookings with test details
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("test_bookings")
        .select(`
          *,
          lab_tests (id, test_name, price, offer_price)
        `)
        .eq("lab_id", user.id)
        .order("created_at", { ascending: false });

      if (bookingsError) throw bookingsError;
      setBookings(bookingsData || []);
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

      const selectedTest = tests.find(t => t.id === formData.test_id);
      if (!selectedTest) return;

      const amountPaid = selectedTest.offer_price || selectedTest.price;

      // Create booking
      const { data: bookingData, error: bookingError } = await supabase
        .from("test_bookings")
        .insert([{
          lab_id: user.id,
          test_id: formData.test_id,
          patient_name: formData.patient_name,
          patient_phone: formData.patient_phone || null,
          patient_email: formData.patient_email || null,
          booking_date: formData.booking_date,
          amount_paid: amountPaid,
          notes: formData.notes || null,
          status: "confirmed",
        }])
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Create transaction (credit)
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert([{
          user_id: user.id,
          user_role: "diagnostic_center",
          type: "credit",
          amount: amountPaid,
          description: `Booking: ${selectedTest.test_name} - ${formData.patient_name}`,
          reference_id: bookingData.id,
        }]);

      if (transactionError) throw transactionError;

      toast({ title: "Booking created and amount credited successfully" });
      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("test_bookings")
        .update({ status: newStatus })
        .eq("id", bookingId);

      if (error) throw error;
      toast({ title: `Booking ${newStatus}` });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      test_id: "",
      patient_name: "",
      patient_phone: "",
      patient_email: "",
      booking_date: format(new Date(), "yyyy-MM-dd"),
      notes: "",
    });
  };

  const getSelectedTestPrice = () => {
    const test = tests.find(t => t.id === formData.test_id);
    if (!test) return null;
    return test.offer_price || test.price;
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = 
      booking.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.lab_tests?.test_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"><Clock className="h-3 w-3 mr-1" /> Confirmed</Badge>;
      case "completed":
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20"><CheckCircle className="h-3 w-3 mr-1" /> Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20"><XCircle className="h-3 w-3 mr-1" /> Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

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
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Test Bookings</h1>
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
                    placeholder="Search bookings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="gap-2" disabled={tests.length === 0}>
                    <Plus className="h-4 w-4" />
                    New Booking
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Booking</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="test_id">Select Test *</Label>
                      <Select
                        value={formData.test_id}
                        onValueChange={(value) => setFormData({ ...formData, test_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a test" />
                        </SelectTrigger>
                        <SelectContent>
                          {tests.map((test) => (
                            <SelectItem key={test.id} value={test.id}>
                              {test.test_name} - ₹{test.offer_price || test.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formData.test_id && (
                        <p className="text-sm text-muted-foreground">
                          Amount to be credited: <span className="font-medium text-green-600">₹{getSelectedTestPrice()}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="patient_name">Patient Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="patient_name"
                          placeholder="Enter patient name"
                          value={formData.patient_name}
                          onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="patient_phone">Phone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="patient_phone"
                            placeholder="Phone number"
                            value={formData.patient_phone}
                            onChange={(e) => setFormData({ ...formData, patient_phone: e.target.value })}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="booking_date">Date *</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="booking_date"
                            type="date"
                            value={formData.booking_date}
                            onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="patient_email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="patient_email"
                          type="email"
                          placeholder="patient@example.com"
                          value={formData.patient_email}
                          onChange={(e) => setFormData({ ...formData, patient_email: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any additional notes..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={2}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => {
                        setIsDialogOpen(false);
                        resetForm();
                      }}>
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1">
                        Create Booking
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </GlassCard>

          {/* Info message if no tests */}
          {tests.length === 0 && !isLoading && (
            <GlassCard className="p-4 bg-amber-500/10 border-amber-500/20">
              <p className="text-amber-600 dark:text-amber-400">
                You need to add tests first before creating bookings. <Button variant="link" className="p-0 h-auto text-amber-600 dark:text-amber-400 underline" onClick={() => navigate("/lab/tests")}>Add tests now</Button>
              </p>
            </GlassCard>
          )}

          {/* Bookings Table */}
          <GlassCard>
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading bookings...
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                {bookings.length === 0
                  ? "No bookings yet. Create your first booking to get started."
                  : "No bookings match your search criteria."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Test</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.patient_name}</p>
                            {booking.patient_phone && (
                              <p className="text-sm text-muted-foreground">{booking.patient_phone}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{booking.lab_tests?.test_name || "Unknown"}</TableCell>
                        <TableCell>{format(new Date(booking.booking_date), "dd MMM yyyy")}</TableCell>
                        <TableCell className="text-right font-medium">
                          <span className="text-green-600 dark:text-green-400">
                            ₹{booking.amount_paid.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {booking.status === "confirmed" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateStatus(booking.id, "completed")}
                                  className="text-green-600 hover:text-green-600"
                                >
                                  Complete
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateStatus(booking.id, "cancelled")}
                                  className="text-red-600 hover:text-red-600"
                                >
                                  Cancel
                                </Button>
                              </>
                            )}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <GlassCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">{bookings.length}</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Confirmed</p>
                  <p className="text-2xl font-bold">{bookings.filter(b => b.status === "confirmed").length}</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{bookings.filter(b => b.status === "completed").length}</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <IndianRupee className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    ₹{bookings.filter(b => b.status !== "cancelled").reduce((sum, b) => sum + b.amount_paid, 0).toFixed(0)}
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

export default LabBookings;
