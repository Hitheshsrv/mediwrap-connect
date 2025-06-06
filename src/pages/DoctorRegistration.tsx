import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DoctorService } from "@/services/api/doctor-service";
import { supabase } from "@/integrations/supabase/client";

// Define the form schema with Zod
const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  specialty: z.string().min(1, "Specialty is required"),
  experience: z.string().min(1, "Years of experience is required"),
  qualification: z.string().min(1, "Qualification is required"),
  licenseNumber: z.string().min(3, "License number is required"),
  consultationType: z.enum(["online", "in-person", "both"]),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  pincode: z.string().min(5, "Pincode/ZIP code is required"),
  bio: z.string().min(10, "Please provide a brief bio"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const DoctorRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialty: "",
      experience: "",
      qualification: "",
      licenseNumber: "",
      consultationType: "both",
      address: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      bio: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Function to change tab
  const changeTab = (tabId: string) => {
    setActiveTab(tabId);
  };

  // Submit handler
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // 1. Create user account first with email confirmation
      const { data: userData, error: userError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            role: 'doctor',
            name: `${values.firstName} ${values.lastName}`,
          },
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (userError) throw new Error(userError.message);

      if (!userData.user) throw new Error('Failed to create user account');
      
      // Check if email confirmation was sent
      if (userData.user && !userData.user.confirmed_at) {
        // 2. Create doctor profile
        const doctorService = new DoctorService();
        const doctorData = {
          name: `${values.firstName} ${values.lastName}`,
          specialty: values.specialty,
          hospital: "", // Can be updated later
          location: `${values.city}, ${values.state}, ${values.country}`,
          education: values.qualification,
          experience: values.experience,
          fee: 0, // Default value, can be updated later
          available: true,
          online: values.consultationType === "online" || values.consultationType === "both",
          image: "", // Can be updated later
          next_available: new Date().toISOString().split('T')[0],
          user_id: userData.user.id,
          rating: 4.5,
          reviews: 0,
        };
        
        const result = await doctorService.addDoctor(doctorData);
        
        if (!result) throw new Error("Failed to create doctor profile");

        // Show success message with email confirmation instructions
        toast({
          title: "Registration successful",
          description: "Please check your email for a confirmation link. You need to verify your email before logging in.",
          duration: 6000,
        });
        
        // Redirect to login page
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        throw new Error("Email confirmation could not be sent");
      }
      
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "There was a problem with your registration. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Doctor Registration
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Join our network of healthcare professionals and help patients across the country
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Apply as a Doctor</CardTitle>
            <CardDescription>
              Please complete the following form to register as a doctor in our platform.
              Your application will be reviewed by our team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal Information</TabsTrigger>
                <TabsTrigger value="professional">Professional Details</TabsTrigger>
                <TabsTrigger value="account">Account Setup</TabsTrigger>
              </TabsList>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <TabsContent value="personal" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="doctor@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="New York" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="NY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input placeholder="USA" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pincode/ZIP</FormLabel>
                            <FormControl>
                              <Input placeholder="10001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button type="button" onClick={() => changeTab("professional")}>
                        Next: Professional Details
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="professional" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="specialty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Medical Specialty</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select specialty" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Cardiology">Cardiology</SelectItem>
                                <SelectItem value="Dermatology">Dermatology</SelectItem>
                                <SelectItem value="Endocrinology">Endocrinology</SelectItem>
                                <SelectItem value="Gastroenterology">Gastroenterology</SelectItem>
                                <SelectItem value="Neurology">Neurology</SelectItem>
                                <SelectItem value="Oncology">Oncology</SelectItem>
                                <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                                <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                                <SelectItem value="Pulmonology">Pulmonology</SelectItem>
                                <SelectItem value="Radiology">Radiology</SelectItem>
                                <SelectItem value="Surgery">Surgery</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Years of Experience</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select experience" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="0-2">0-2 years</SelectItem>
                                <SelectItem value="3-5">3-5 years</SelectItem>
                                <SelectItem value="6-10">6-10 years</SelectItem>
                                <SelectItem value="11-15">11-15 years</SelectItem>
                                <SelectItem value="16+">16+ years</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="qualification"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Highest Qualification</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select qualification" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="MBBS">MBBS</SelectItem>
                                <SelectItem value="MD">MD</SelectItem>
                                <SelectItem value="MS">MS</SelectItem>
                                <SelectItem value="DM">DM</SelectItem>
                                <SelectItem value="MCh">MCh</SelectItem>
                                <SelectItem value="DNB">DNB</SelectItem>
                                <SelectItem value="PhD">PhD</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="licenseNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Medical License Number</FormLabel>
                            <FormControl>
                              <Input placeholder="ML12345678" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="consultationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Consultation Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="online">Online Only</SelectItem>
                              <SelectItem value="in-person">In-Person Only</SelectItem>
                              <SelectItem value="both">Both Online and In-Person</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Professional Bio</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Please provide a brief description of your professional background, expertise, and approach to patient care."
                              {...field}
                              rows={5}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => changeTab("personal")}>
                        Back: Personal Information
                      </Button>
                      <Button type="button" onClick={() => changeTab("account")}>
                        Next: Account Setup
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="account" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-6 space-y-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        By submitting this form, you agree to our terms and conditions and privacy policy.
                      </p>
                      
                      <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={() => changeTab("professional")}>
                          Back: Professional Details
                        </Button>
                        <Button 
                          type="submit"
                          className="bg-mediwrap-blue hover:bg-mediwrap-blue-light text-white"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="mr-2">Submitting...</span>
                              <svg
                                className="animate-spin h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            </>
                          ) : (
                            "Submit Application"
                          )}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </form>
              </Form>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DoctorRegistration;