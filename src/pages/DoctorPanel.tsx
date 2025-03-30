
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import apiClient, { Appointment, Doctor } from "@/services/api";
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle,
  PhoneCall,
  Video,
  Calendar as CalendarIcon
} from "lucide-react";

const DoctorPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctorInfo, setDoctorInfo] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not authenticated or not a doctor
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user && user.role !== 'doctor') {
      navigate("/");
      toast({
        title: "Access denied",
        description: "Only doctors can access this page",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, user, navigate, toast]);

  // Fetch doctor appointments
  useEffect(() => {
    const fetchData = async () => {
      if (user && user.role === 'doctor') {
        setIsLoading(true);
        try {
          // In a real app, this would fetch appointments for the logged-in doctor
          // For demo, we're using ID 2 as example
          const doctorId = 2; // Would be user.id in a real app
          const appointmentsData = await apiClient.getDoctorAppointments(doctorId);
          setAppointments(appointmentsData);
          
          // Fetch doctor info
          const doctor = await apiClient.getDoctor(doctorId);
          if (doctor) {
            setDoctorInfo(doctor);
          }
        } catch (error) {
          console.error("Failed to fetch appointments:", error);
          toast({
            title: "Error",
            description: "Failed to fetch appointments",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [user, toast]);

  // Update appointment status
  const updateAppointmentStatus = async (id: number, status: "confirmed" | "pending" | "canceled") => {
    try {
      await apiClient.updateAppointmentStatus(id, status);
      
      // Update local state
      setAppointments(prev => 
        prev.map(app => app.id === id ? { ...app, status } : app)
      );
      
      toast({
        title: "Status updated",
        description: `Appointment status changed to ${status}`,
      });
    } catch (error) {
      console.error("Failed to update appointment status:", error);
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive",
      });
    }
  };

  const getPendingAppointments = () => appointments.filter(app => app.status === "pending");
  const getConfirmedAppointments = () => appointments.filter(app => app.status === "confirmed");
  const getCanceledAppointments = () => appointments.filter(app => app.status === "canceled");

  if (!isAuthenticated || (user && user.role !== 'doctor')) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
          <Button onClick={() => navigate("/profile")} variant="outline">My Profile</Button>
        </div>

        {/* Doctor Info Card */}
        {doctorInfo && (
          <Card className="mb-8">
            <CardContent className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                <img 
                  src={doctorInfo.image} 
                  alt={doctorInfo.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{doctorInfo.name}</h2>
                <p className="text-gray-500">{doctorInfo.specialty}</p>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center">
                    <Badge className="mr-2">{doctorInfo.rating} ★</Badge>
                    <span className="text-sm text-gray-500">({doctorInfo.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{doctorInfo.experience} experience</span>
                  </div>
                </div>
              </div>
              <div className="md:text-right space-y-2">
                <p className="font-medium">{doctorInfo.hospital}</p>
                <p className="text-sm text-gray-500">{doctorInfo.location}</p>
                <Badge variant={doctorInfo.available ? "default" : "outline"}>
                  {doctorInfo.available ? "Available Now" : `Next: ${doctorInfo.nextAvailable}`}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Appointments Section */}
        <Card>
          <CardHeader>
            <CardTitle>My Appointments</CardTitle>
            <CardDescription>
              Manage your patient appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList className="mb-4">
                <TabsTrigger value="pending">Pending ({getPendingAppointments().length})</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmed ({getConfirmedAppointments().length})</TabsTrigger>
                <TabsTrigger value="canceled">Canceled ({getCanceledAppointments().length})</TabsTrigger>
                <TabsTrigger value="all">All Appointments</TabsTrigger>
              </TabsList>
              
              {/* Pending Appointments Tab */}
              <TabsContent value="pending">
                {isLoading ? (
                  <div className="py-8 text-center text-gray-500">Loading appointments...</div>
                ) : getPendingAppointments().length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getPendingAppointments().map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            <div className="font-medium">Patient #{appointment.patientId}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                              {appointment.date}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-gray-500" />
                              {appointment.time}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {appointment.type === "video" ? (
                                <><Video className="mr-1 h-3 w-3" /> Video</>
                              ) : (
                                <><User className="mr-1 h-3 w-3" /> In-person</>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => updateAppointmentStatus(appointment.id, "confirmed")}
                              >
                                <CheckCircle className="mr-1 h-4 w-4" /> Confirm
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => updateAppointmentStatus(appointment.id, "canceled")}
                              >
                                <XCircle className="mr-1 h-4 w-4" /> Cancel
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No pending appointments.
                  </div>
                )}
              </TabsContent>

              {/* Confirmed Appointments Tab */}
              <TabsContent value="confirmed">
                {isLoading ? (
                  <div className="py-8 text-center text-gray-500">Loading appointments...</div>
                ) : getConfirmedAppointments().length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getConfirmedAppointments().map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            <div className="font-medium">Patient #{appointment.patientId}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                              {appointment.date}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-gray-500" />
                              {appointment.time}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {appointment.type === "video" ? (
                                <><Video className="mr-1 h-3 w-3" /> Video</>
                              ) : (
                                <><User className="mr-1 h-3 w-3" /> In-person</>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {appointment.type === "video" && (
                                <Button size="sm" className="bg-green-500 hover:bg-green-600">
                                  <PhoneCall className="mr-1 h-4 w-4" /> Start Call
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => updateAppointmentStatus(appointment.id, "canceled")}
                              >
                                <XCircle className="mr-1 h-4 w-4" /> Cancel
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No confirmed appointments.
                  </div>
                )}
              </TabsContent>

              {/* Canceled Appointments Tab */}
              <TabsContent value="canceled">
                {isLoading ? (
                  <div className="py-8 text-center text-gray-500">Loading appointments...</div>
                ) : getCanceledAppointments().length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getCanceledAppointments().map((appointment) => (
                        <TableRow key={appointment.id} className="text-gray-500">
                          <TableCell>
                            <div className="font-medium">Patient #{appointment.patientId}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                              {appointment.date}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-gray-500" />
                              {appointment.time}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {appointment.type === "video" ? (
                                <><Video className="mr-1 h-3 w-3" /> Video</>
                              ) : (
                                <><User className="mr-1 h-3 w-3" /> In-person</>
                              )}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No canceled appointments.
                  </div>
                )}
              </TabsContent>

              {/* All Appointments Tab */}
              <TabsContent value="all">
                {isLoading ? (
                  <div className="py-8 text-center text-gray-500">Loading appointments...</div>
                ) : appointments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            <div className="font-medium">Patient #{appointment.patientId}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                              {appointment.date}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-gray-500" />
                              {appointment.time}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {appointment.type === "video" ? (
                                <><Video className="mr-1 h-3 w-3" /> Video</>
                              ) : (
                                <><User className="mr-1 h-3 w-3" /> In-person</>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              appointment.status === "confirmed" ? "default" : 
                              appointment.status === "pending" ? "outline" : 
                              "destructive"
                            }>
                              {appointment.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No appointments found.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DoctorPanel;
