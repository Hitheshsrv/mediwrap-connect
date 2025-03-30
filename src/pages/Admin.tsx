
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { 
  Users, 
  UserCog, 
  PieChart, 
  Calendar, 
  Settings, 
  Search, 
  PlusCircle, 
  Pill, 
  Droplet, 
  MessagesSquare, 
  AlertCircle,
  CheckCircle2,
  XCircle
} from "lucide-react";

const Admin = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data for demonstration
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Patient", status: "Active" },
    { id: 2, name: "Sarah Johnson", email: "sarah@example.com", role: "Doctor", status: "Active" },
    { id: 3, name: "Michael Brown", email: "michael@example.com", role: "Patient", status: "Inactive" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", role: "Admin", status: "Active" },
  ]);

  const [tickets, setTickets] = useState([
    { id: 1, user: "John Doe", issue: "Cannot book appointment", status: "Open", priority: "High", date: "2024-03-28" },
    { id: 2, user: "Sarah Johnson", issue: "Payment not processed", status: "In Progress", priority: "Medium", date: "2024-03-27" },
    { id: 3, user: "Robert Smith", issue: "Missing prescription", status: "Closed", priority: "Low", date: "2024-03-25" },
  ]);

  const [appointments, setAppointments] = useState([
    { id: 1, patient: "John Doe", doctor: "Dr. Sarah Johnson", date: "2024-03-30", time: "10:00 AM", status: "Confirmed" },
    { id: 2, patient: "Michael Brown", doctor: "Dr. Robert Adams", date: "2024-03-29", time: "2:30 PM", status: "Cancelled" },
    { id: 3, patient: "Emily Davis", doctor: "Dr. Sarah Johnson", date: "2024-03-31", time: "9:15 AM", status: "Pending" },
  ]);

  const updateTicketStatus = (id: number, newStatus: string) => {
    setTickets(tickets.map(ticket => 
      ticket.id === id ? { ...ticket, status: newStatus } : ticket
    ));
    
    toast({
      title: "Ticket Updated",
      description: `Ticket #${id} status changed to ${newStatus}`,
    });
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Dashboard Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <h3 className="text-2xl font-bold">1,248</h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Calendar className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Appointments</p>
                <h3 className="text-2xl font-bold">156</h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Pill className="h-6 w-6 text-purple-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Medications</p>
                <h3 className="text-2xl font-bold">839</h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Droplet className="h-6 w-6 text-red-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Blood Donations</p>
                <h3 className="text-2xl font-bold">86</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="users">
          <TabsList className="mb-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>Support Tickets</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Appointments</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>User Management</span>
                  <Button className="bg-mediwrap-blue hover:bg-mediwrap-blue-light flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    <span>Add User</span>
                  </Button>
                </CardTitle>
                <CardDescription>
                  Manage all registered users in the system
                </CardDescription>
                <div className="flex items-center mt-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search users..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.id}</TableCell>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === "Admin" ? "outline" : "secondary"}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.status === "Active" ? "default" : "destructive"}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">Edit</Button>
                              <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tickets Tab */}
          <TabsContent value="tickets">
            <Card>
              <CardHeader>
                <CardTitle>Support Tickets</CardTitle>
                <CardDescription>
                  Manage user support tickets and inquiries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Issue</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell>{ticket.id}</TableCell>
                          <TableCell>{ticket.user}</TableCell>
                          <TableCell>{ticket.issue}</TableCell>
                          <TableCell>
                            <Badge variant={
                              ticket.status === "Open" ? "destructive" : 
                              ticket.status === "In Progress" ? "outline" : 
                              "default"
                            }>
                              {ticket.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              ticket.priority === "High" ? "destructive" : 
                              ticket.priority === "Medium" ? "outline" : 
                              "secondary"
                            }>
                              {ticket.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>{ticket.date}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="icon" onClick={() => updateTicketStatus(ticket.id, "In Progress")}>
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" className="text-green-500" onClick={() => updateTicketStatus(ticket.id, "Closed")}>
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-500" onClick={() => updateTicketStatus(ticket.id, "Cancelled")}>
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Appointments Management</CardTitle>
                <CardDescription>
                  View and manage all appointments in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>{appointment.id}</TableCell>
                          <TableCell>{appointment.patient}</TableCell>
                          <TableCell>{appointment.doctor}</TableCell>
                          <TableCell>{appointment.date}</TableCell>
                          <TableCell>{appointment.time}</TableCell>
                          <TableCell>
                            <Badge variant={
                              appointment.status === "Confirmed" ? "default" : 
                              appointment.status === "Pending" ? "outline" : 
                              "destructive"
                            }>
                              {appointment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">Edit</Button>
                              <Button variant="ghost" size="sm" className="text-red-500">Cancel</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab - Placeholder */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>System Analytics</CardTitle>
                <CardDescription>
                  View system usage and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center p-12 border-2 border-dashed rounded-md">
                  <div className="text-center">
                    <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-muted-foreground">Analytics dashboard content would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab - Placeholder */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center p-12 border-2 border-dashed rounded-md">
                  <div className="text-center">
                    <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-muted-foreground">System settings configuration would appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
