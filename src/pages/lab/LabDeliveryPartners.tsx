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
  Plus,
  Edit,
  Trash2,
  Truck,
  Phone,
  Search,
  ArrowLeft,
  Bell,
  User,
  Star,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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

interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  vehicle_type: string;
  license_number: string;
  is_active: boolean;
  rating: number;
  total_deliveries: number;
  completed_deliveries: number;
}

const LabDeliveryPartners = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<DeliveryPartner | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    vehicle_type: "",
    license_number: "",
    is_active: true,
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setIsLoading(true);
      // Mock data for demonstration
      const mockPartners: DeliveryPartner[] = [
        {
          id: "1",
          name: "Ramesh Kumar",
          phone: "+91 98765 43210",
          email: "ramesh@example.com",
          address: "123, MG Road, Gurgaon",
          vehicle_type: "Bike",
          license_number: "DL-01AB1234",
          is_active: true,
          rating: 4.8,
          total_deliveries: 145,
          completed_deliveries: 142,
        },
        {
          id: "2",
          name: "Sunil Sharma",
          phone: "+91 87654 32109",
          email: "sunil@example.com",
          address: "45, Lajpat Nagar, Delhi",
          vehicle_type: "Car",
          license_number: "DL-02CD5678",
          is_active: true,
          rating: 4.6,
          total_deliveries: 128,
          completed_deliveries: 125,
        },
        {
          id: "3",
          name: "Vikash Verma",
          phone: "+91 76543 21098",
          email: "vikash@example.com",
          address: "78, Koramangala, Bangalore",
          vehicle_type: "Bike",
          license_number: "KA-03EF9012",
          is_active: false,
          rating: 4.2,
          total_deliveries: 89,
          completed_deliveries: 87,
        },
      ];
      setPartners(mockPartners);
    } catch (error) {
      console.error("Error fetching delivery partners:", error);
      toast({
        title: "Error",
        description: "Failed to fetch delivery partners",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPartner = () => {
    setEditingPartner(null);
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      vehicle_type: "",
      license_number: "",
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const handleEditPartner = (partner: DeliveryPartner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      phone: partner.phone,
      email: partner.email,
      address: partner.address,
      vehicle_type: partner.vehicle_type,
      license_number: partner.license_number,
      is_active: partner.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSavePartner = async () => {
    if (!formData.name || !formData.phone || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingPartner) {
        // Update existing partner
        setPartners(
          partners.map((p) =>
            p.id === editingPartner.id
              ? {
                  ...p,
                  ...formData,
                }
              : p
          )
        );
        toast({
          title: "Success",
          description: "Delivery partner updated successfully",
        });
      } else {
        // Add new partner
        const newPartner: DeliveryPartner = {
          id: Date.now().toString(),
          ...formData,
          rating: 0,
          total_deliveries: 0,
          completed_deliveries: 0,
        };
        setPartners([...partners, newPartner]);
        toast({
          title: "Success",
          description: "Delivery partner added successfully",
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving delivery partner:", error);
      toast({
        title: "Error",
        description: "Failed to save delivery partner",
        variant: "destructive",
      });
    }
  };

  const handleDeletePartner = async () => {
    if (!partnerToDelete) return;

    try {
      setPartners(partners.filter((p) => p.id !== partnerToDelete));
      toast({
        title: "Success",
        description: "Delivery partner deleted successfully",
      });
      setDeleteDialogOpen(false);
      setPartnerToDelete(null);
    } catch (error) {
      console.error("Error deleting delivery partner:", error);
      toast({
        title: "Error",
        description: "Failed to delete delivery partner",
        variant: "destructive",
      });
    }
  };

  const filteredPartners = partners.filter((partner) =>
    partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    partner.phone.includes(searchQuery) ||
    partner.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 page-enter">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/lab")}
              className="p-2 rounded-lg bg-card shadow-card border border-border/50 hover:shadow-elevated transition-shadow"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Delivery Partners</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage your delivery staff</p>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
          <GlassCard className="p-4 lg:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Active Partners</p>
                <p className="text-2xl lg:text-3xl font-bold text-foreground">
                  {partners.filter((p) => p.is_active).length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4 lg:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Total Partners</p>
                <p className="text-2xl lg:text-3xl font-bold text-foreground">{partners.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <Truck className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4 lg:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Avg. Rating</p>
                <p className="text-2xl lg:text-3xl font-bold text-foreground">
                  {(
                    partners.reduce((sum, p) => sum + p.rating, 0) / (partners.length || 1)
                  ).toFixed(1)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Search and Add Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleAddPartner} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Partner
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPartner ? "Edit Delivery Partner" : "Add New Delivery Partner"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicle_type">Vehicle Type</Label>
                    <Input
                      id="vehicle_type"
                      value={formData.vehicle_type}
                      onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                      placeholder="e.g., Bike, Car, Van"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="license_number">License Number</Label>
                    <Input
                      id="license_number"
                      value={formData.license_number}
                      onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                      placeholder="e.g., DL-01AB1234"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="is_active">Active Status</Label>
                    <div className="flex items-center gap-3 pt-2">
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, is_active: checked })
                        }
                      />
                      <span className="text-sm text-muted-foreground">
                        {formData.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter full address"
                    className="resize-none"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSavePartner}>
                  {editingPartner ? "Update Partner" : "Add Partner"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <GlassCard className="overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading delivery partners...</p>
            </div>
          ) : filteredPartners.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Truck className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                {searchQuery ? "No partners found matching your search" : "No delivery partners added yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Rating</TableHead>
                    <TableHead className="text-center">Deliveries</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPartners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell className="font-medium">{partner.name}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{partner.phone}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">{partner.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{partner.vehicle_type}</div>
                        <div className="text-xs text-muted-foreground">{partner.license_number}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {partner.is_active ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-green-600">Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-500" />
                              <span className="text-sm text-red-600">Inactive</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium">{partner.rating.toFixed(1)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-sm">
                          <span className="font-medium">{partner.completed_deliveries}</span>
                          <span className="text-muted-foreground">/{partner.total_deliveries}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditPartner(partner)}
                            className="p-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <Edit className="w-4 h-4 text-foreground" />
                          </button>
                          <button
                            onClick={() => {
                              setPartnerToDelete(partner.id);
                              setDeleteDialogOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Delivery Partner</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this delivery partner? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePartner} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LabDeliveryPartners;
