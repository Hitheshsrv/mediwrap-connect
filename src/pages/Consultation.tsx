import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Video, Users, MapPin, Calendar, Clock, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiClient, { Doctor } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Consultation = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [consultationType, setConsultationType] = useState("all");
  const { toast } = useToast();

  const { data: doctors = [], isLoading, refetch } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => apiClient.getDoctors(),
  });

  useEffect(() => {
    const channel = supabase
      .channel('public:doctors')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'doctors' 
      }, () => {
        refetch();
      })
      .subscribe();
      
    return () => {
      channel.unsubscribe();
    };
  }, [refetch]);

  const handleBookAppointment = (doctorId: string, doctorName: string, type: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to book an appointment.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    toast({
      title: "Appointment Requested",
      description: `Your ${type} appointment with ${doctorName} has been requested. We'll confirm shortly.`,
    });
    
    apiClient.bookAppointment(doctorId, {
      type: type === "video" ? "video" : "in-person",
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
    });
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (consultationType === "online" && !doctor.online) return false;
    if (consultationType === "in-person" && doctor.online) return false;
    
    return matchesSearch;
  });

  return (
    <Layout>
      <div className="bg-gradient-to-br from-mediwrap-blue/10 to-mediwrap-green/10 dark:from-mediwrap-blue/5 dark:to-mediwrap-green/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Find and Book Doctor Appointments
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Connect with top healthcare professionals for online or in-person consultations
            </p>
          </div>
          
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <Input
                  type="text"
                  placeholder="Search by doctor name, specialty, or hospital"
                  className="w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="bg-mediwrap-blue hover:bg-mediwrap-blue-light text-white">
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger 
              value="all" 
              onClick={() => setConsultationType("all")}
            >
              All Consultations
            </TabsTrigger>
            <TabsTrigger 
              value="online" 
              onClick={() => setConsultationType("online")}
              className="flex items-center"
            >
              <Video className="w-4 h-4 mr-2" />
              Online
            </TabsTrigger>
            <TabsTrigger 
              value="in-person" 
              onClick={() => setConsultationType("in-person")}
              className="flex items-center"
            >
              <Users className="w-4 h-4 mr-2" />
              In-Person
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 gap-6">
              {isLoading ? (
                <div className="text-center py-16">
                  <p className="text-xl text-gray-500 dark:text-gray-400">Loading doctors...</p>
                </div>
              ) : filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <Card key={doctor.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 p-6 flex flex-col items-center justify-center border-r border-gray-200 dark:border-gray-800">
                        <div className="relative">
                          <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="w-32 h-32 rounded-full object-cover border-2 border-mediwrap-blue/30"
                          />
                          {doctor.available && (
                            <span className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                          )}
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-center">{doctor.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-center">{doctor.specialty}</p>
                        <div className="flex items-center mt-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="ml-1 text-gray-700 dark:text-gray-300">{doctor.rating}</span>
                          <span className="ml-1 text-gray-500">({doctor.reviews} reviews)</span>
                        </div>
                      </div>
                      
                      <div className="md:w-3/4 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Hospital</p>
                            <p className="font-medium">{doctor.hospital}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Next Available</p>
                            <p className="font-medium text-green-600 dark:text-green-400">
                              {doctor.next_available ? new Date(doctor.next_available).toLocaleString() : 'Not available'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Consultation Fee</p>
                            <p className="font-medium">₹{doctor.fee}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Education</p>
                            <p className="font-medium">{doctor.education}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Experience</p>
                            <p className="font-medium">{doctor.experience}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                            <p className="font-medium">{doctor.location}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
                          {doctor.online && (
                            <Button
                              variant="outline"
                              className="flex items-center border-mediwrap-blue text-mediwrap-blue hover:bg-mediwrap-blue/10"
                              onClick={() => handleBookAppointment(doctor.id, doctor.name, "video")}
                            >
                              <Video className="mr-2 h-4 w-4" />
                              Book Video Consultation
                            </Button>
                          )}
                          <Button
                            variant={doctor.online ? "outline" : "default"}
                            className={doctor.online ? "flex items-center border-mediwrap-green text-mediwrap-green hover:bg-mediwrap-green/10" : "flex items-center bg-mediwrap-blue hover:bg-mediwrap-blue-light text-white"}
                            onClick={() => handleBookAppointment(doctor.id, doctor.name, "in-person")}
                          >
                            <MapPin className="mr-2 h-4 w-4" />
                            Book In-Person Visit
                          </Button>
                          <Button
                            variant="outline"
                            className="flex items-center"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            View Schedule
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-16">
                  <p className="text-xl text-gray-500 dark:text-gray-400">No doctors found matching your criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="online">
            {/* Content will be shown through filtering */}
          </TabsContent>
          
          <TabsContent value="in-person">
            {/* Content will be shown through filtering */}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Consultation;
