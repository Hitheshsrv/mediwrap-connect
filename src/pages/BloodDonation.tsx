
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Calendar, Bell, Heart, Clock, Check, X } from "lucide-react";

// Mock data for blood donation centers
const donationCenters = [
  {
    id: 1,
    name: "City General Hospital",
    address: "123 Main Street, Downtown",
    distance: "1.2 miles",
    bloodNeeded: ["A+", "O+", "B-"],
    slots: ["9:00 AM", "11:30 AM", "2:00 PM"],
    image: "https://images.unsplash.com/photo-1587351021759-3772687a4d9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    urgent: true
  },
  {
    id: 2,
    name: "Community Blood Center",
    address: "456 Park Avenue, Westside",
    distance: "2.5 miles",
    bloodNeeded: ["AB+", "O-"],
    slots: ["10:00 AM", "1:00 PM", "3:30 PM"],
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    urgent: false
  },
  {
    id: 3,
    name: "University Medical Center",
    address: "789 College Blvd, Eastside",
    distance: "3.7 miles",
    bloodNeeded: ["A-", "B+", "O+"],
    slots: ["8:30 AM", "12:00 PM", "4:00 PM"],
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    urgent: true
  },
  {
    id: 4,
    name: "Regional Medical Center",
    address: "101 Health Way, Northside",
    distance: "4.1 miles",
    bloodNeeded: ["AB-", "O+"],
    slots: ["9:30 AM", "1:30 PM", "3:00 PM"],
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    urgent: false
  }
];

// Mock data for recent requests
const recentRequests = [
  {
    id: 1,
    name: "John D.",
    bloodType: "A+",
    hospital: "City General Hospital",
    urgency: "Urgent",
    dateNeeded: "Today",
    reason: "Surgery"
  },
  {
    id: 2,
    name: "Sarah M.",
    bloodType: "O-",
    hospital: "University Medical Center",
    urgency: "Critical",
    dateNeeded: "Today",
    reason: "Accident"
  },
  {
    id: 3,
    name: "Michael R.",
    bloodType: "B+",
    hospital: "Community Blood Center",
    urgency: "Medium",
    dateNeeded: "Tomorrow",
    reason: "Surgery"
  }
];

const BloodDonation = () => {
  const [bloodType, setBloodType] = useState("");
  const [location, setLocation] = useState("");
  const { toast } = useToast();
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);

  const handleScheduleDonation = (centerName: string, slot: string) => {
    if (!isRegistered) {
      setShowRegistration(true);
      return;
    }
    
    toast({
      title: "Donation Scheduled",
      description: `Your blood donation at ${centerName} for ${slot} has been scheduled.`,
    });
  };

  const handleRegisterAsDonor = () => {
    setIsRegistered(true);
    setShowRegistration(false);
    
    toast({
      title: "Registration Successful",
      description: "You've been registered as a blood donor. You'll receive notifications about donation opportunities near you.",
    });
  };

  const handleNotifyMe = (bloodType: string) => {
    if (!isRegistered) {
      setShowRegistration(true);
      return;
    }
    
    toast({
      title: "Notification Set",
      description: `You'll be notified when ${bloodType} blood type is needed near you.`,
    });
  };

  return (
    <Layout>
      {/* Hero section */}
      <div className="bg-gradient-to-br from-mediwrap-red/10 to-mediwrap-blue/10 dark:from-mediwrap-red/5 dark:to-mediwrap-blue/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Blood Donation Network
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Join our network of donors and help save lives by donating blood when and where it's needed
            </p>
          </div>
          
          <div className="mt-8 max-w-3xl mx-auto bg-white dark:bg-card shadow-md rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="blood-type">Blood Type</Label>
                <Select value={bloodType} onValueChange={setBloodType}>
                  <SelectTrigger id="blood-type" className="w-full">
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  placeholder="Enter your location" 
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button className="w-full bg-mediwrap-red hover:bg-mediwrap-red/90 text-white">
                  Find Donation Centers
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Donation Centers */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Nearby Donation Centers</h2>
            <div className="space-y-6">
              {donationCenters.map((center) => (
                <Card key={center.id} className={`overflow-hidden border ${center.urgent ? 'border-mediwrap-red/50' : ''}`}>
                  {center.urgent && (
                    <div className="bg-mediwrap-red text-white px-4 py-1 text-sm font-medium">
                      Urgent Need for {center.bloodNeeded.join(", ")} Blood Types
                    </div>
                  )}
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3">
                      <img 
                        src={center.image} 
                        alt={center.name}
                        className="w-full h-full object-cover"
                        style={{ maxHeight: '200px' }}
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <CardHeader className="p-0 pb-4">
                        <CardTitle>{center.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 space-y-3">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{center.address} ({center.distance})</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Heart className="w-4 h-4 mr-2" />
                          <span>Blood Types Needed: {center.bloodNeeded.join(", ")}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Available Slots: {center.slots.join(", ")}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-0 pt-4 flex flex-wrap gap-2">
                        {center.slots.map((slot) => (
                          <Button
                            key={slot}
                            variant="outline"
                            className="flex items-center border-mediwrap-blue text-mediwrap-blue hover:bg-mediwrap-blue/10"
                            onClick={() => handleScheduleDonation(center.name, slot)}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {slot}
                          </Button>
                        ))}
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Right column - Recent Requests & Registration */}
          <div>
            {/* Donor Registration */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Become a Blood Donor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Register as a blood donor to receive notifications when your blood type is needed in your area.
                </p>
                {isRegistered ? (
                  <div className="flex items-center bg-green-500/10 text-green-600 dark:text-green-400 p-4 rounded-md mb-4">
                    <Check className="w-5 h-5 mr-2" />
                    <span>You are registered as a blood donor!</span>
                  </div>
                ) : (
                  <Button 
                    className="w-full bg-mediwrap-red hover:bg-mediwrap-red/90 text-white"
                    onClick={() => setShowRegistration(true)}
                  >
                    Register as Donor
                  </Button>
                )}
              </CardContent>
            </Card>
            
            {/* Recent Blood Requests */}
            <h2 className="text-2xl font-bold mb-4">Recent Blood Requests</h2>
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <Card key={request.id} className={`${request.urgency === "Critical" ? "border-mediwrap-red" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{request.bloodType} Blood Needed</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{request.hospital}</p>
                      </div>
                      <div className={`text-xs font-medium px-2 py-1 rounded ${
                        request.urgency === "Critical" ? "bg-mediwrap-red/10 text-mediwrap-red" :
                        request.urgency === "Urgent" ? "bg-orange-500/10 text-orange-500" :
                        "bg-yellow-500/10 text-yellow-500"
                      }`}>
                        {request.urgency}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Needed by:</span> {request.dateNeeded}
                    </div>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Reason:</span> {request.reason}
                    </div>
                    <Button 
                      className="w-full mt-4 bg-mediwrap-red hover:bg-mediwrap-red/90 text-white flex items-center justify-center"
                      onClick={() => handleNotifyMe(request.bloodType)}
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      Notify Me
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Registration Modal */}
      {showRegistration && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Blood Donor Registration</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowRegistration(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input id="full-name" placeholder="Enter your full name" />
                </div>
                <div>
                  <Label htmlFor="blood-type-reg">Blood Type</Label>
                  <Select>
                    <SelectTrigger id="blood-type-reg">
                      <SelectValue placeholder="Select your blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="Enter your phone number" />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Enter your address" />
                </div>
                <div className="pt-4">
                  <Button 
                    className="w-full bg-mediwrap-red hover:bg-mediwrap-red/90 text-white"
                    onClick={handleRegisterAsDonor}
                  >
                    Complete Registration
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Layout>
  );
};

export default BloodDonation;
