
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { User, CalendarDays, FileText, Clock, Settings } from "lucide-react";

const Profile = () => {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8901",
    address: "123 Medical Drive, Health City, 56789",
  });

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctorName: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "2024-04-15",
      time: "10:00 AM",
      status: "Upcoming",
    },
    {
      id: 2,
      doctorName: "Dr. Michael Chen",
      specialty: "Dermatologist",
      date: "2024-03-28",
      time: "3:30 PM",
      status: "Completed",
    },
  ]);

  const [medicalRecords, setMedicalRecords] = useState([
    {
      id: 1,
      title: "Annual Checkup",
      date: "2024-02-10",
      doctor: "Dr. Sarah Johnson",
      type: "Report",
    },
    {
      id: 2,
      title: "Blood Test",
      date: "2024-01-15",
      doctor: "Dr. Robert Adams",
      type: "Laboratory",
    },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <Tabs defaultValue="profile">
          <TabsList className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>Appointments</span>
            </TabsTrigger>
            <TabsTrigger value="records" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Medical Records</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSaveProfile}
                  className="mt-4 bg-mediwrap-blue hover:bg-mediwrap-blue-light"
                >
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>My Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">
                    You don't have any appointments yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <Card key={appointment.id}>
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div className="space-y-1">
                              <h3 className="font-medium">{appointment.doctorName}</h3>
                              <p className="text-sm text-gray-500">{appointment.specialty}</p>
                            </div>
                            <div className="flex items-center mt-2 md:mt-0 gap-4">
                              <div className="flex items-center text-sm">
                                <CalendarDays className="mr-1 h-4 w-4 text-gray-500" />
                                <span>{appointment.date}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Clock className="mr-1 h-4 w-4 text-gray-500" />
                                <span>{appointment.time}</span>
                              </div>
                              <span
                                className={`text-sm px-2 py-1 rounded-full ${
                                  appointment.status === "Upcoming"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {appointment.status}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="records">
            <Card>
              <CardHeader>
                <CardTitle>Medical Records</CardTitle>
              </CardHeader>
              <CardContent>
                {medicalRecords.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">
                    You don't have any medical records yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {medicalRecords.map((record) => (
                      <Card key={record.id}>
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div className="space-y-1">
                              <h3 className="font-medium">{record.title}</h3>
                              <p className="text-sm text-gray-500">Doctor: {record.doctor}</p>
                            </div>
                            <div className="flex items-center mt-2 md:mt-0 gap-4">
                              <div className="flex items-center text-sm">
                                <CalendarDays className="mr-1 h-4 w-4 text-gray-500" />
                                <span>{record.date}</span>
                              </div>
                              <span className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                {record.type}
                              </span>
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notificationSettings">Notification Preferences</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="emailNotifications" defaultChecked />
                      <label htmlFor="emailNotifications">Email notifications</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="smsNotifications" defaultChecked />
                      <label htmlFor="smsNotifications">SMS notifications</label>
                    </div>
                  </div>
                </div>
                <Button
                  className="mt-4 bg-mediwrap-blue hover:bg-mediwrap-blue-light"
                >
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
