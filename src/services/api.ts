
/**
 * API service for handling all backend requests using Supabase
 */
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface Doctor {
  id: string;
  user_id?: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  reviews: number;
  image: string;
  available: boolean;
  next_available: string; // Changed from Date to string to match Supabase's output
  fee: number;
  education: string;
  experience: string;
  location: string;
  online: boolean;
}

export interface Appointment {
  id: string;
  doctor_id: string;
  patient_id: string;
  date: string;
  time: string;
  type: "video" | "in-person";
  status: "confirmed" | "pending" | "canceled";
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  stock: number;
}

// API client class to handle all backend requests
export class ApiClient {
  // Get all doctors
  async getDoctors(): Promise<Doctor[]> {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*');
      
      if (error) {
        console.error('Error fetching doctors:', error);
        toast({
          title: "Error",
          description: "Failed to fetch doctors",
          variant: "destructive",
        });
        return [];
      }
      
      return data as Doctor[];
    } catch (error) {
      console.error('Error in getDoctors:', error);
      return [];
    }
  }

  // Get a single doctor by ID
  async getDoctor(id: string): Promise<Doctor | undefined> {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching doctor:', error);
        return undefined;
      }
      
      return data as Doctor;
    } catch (error) {
      console.error('Error in getDoctor:', error);
      return undefined;
    }
  }

  // Add a new doctor
  async addDoctor(doctorData: Omit<Doctor, "id">): Promise<Doctor | null> {
    try {
      // Process next_available field properly
      const processedData = {
        ...doctorData,
        // Convert to string if it's not already a string
        next_available: typeof doctorData.next_available !== 'string'
          ? (doctorData.next_available ? doctorData.next_available.toString() : null)
          : doctorData.next_available
      };

      const { data, error } = await supabase
        .from('doctors')
        .insert([processedData])
        .select()
        .single();
      
      if (error) {
        console.error('Error adding doctor:', error);
        toast({
          title: "Error",
          description: "Failed to add doctor",
          variant: "destructive",
        });
        return null;
      }
      
      return data as Doctor;
    } catch (error) {
      console.error('Error in addDoctor:', error);
      return null;
    }
  }

  // Update a doctor
  async updateDoctor(id: string, updates: Partial<Doctor>): Promise<Doctor | undefined> {
    try {
      // Process next_available field properly
      const processedUpdates = {
        ...updates,
        // Only process next_available if it exists in updates
        ...(updates.next_available !== undefined && {
          next_available: typeof updates.next_available !== 'string'
            ? (updates.next_available ? updates.next_available.toString() : null)
            : updates.next_available
        })
      };

      const { data, error } = await supabase
        .from('doctors')
        .update(processedUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating doctor:', error);
        toast({
          title: "Error",
          description: "Failed to update doctor",
          variant: "destructive",
        });
        return undefined;
      }
      
      return data as Doctor;
    } catch (error) {
      console.error('Error in updateDoctor:', error);
      return undefined;
    }
  }

  // Book an appointment
  async bookAppointment(doctorId: string, appointmentData: Partial<Appointment>): Promise<Appointment | null> {
    try {
      // Get current user ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to book an appointment",
          variant: "destructive",
        });
        return null;
      }

      const newAppointment = {
        doctor_id: doctorId,
        patient_id: user.id,
        date: appointmentData.date || new Date().toISOString().split('T')[0],
        time: appointmentData.time || "10:00 AM",
        type: appointmentData.type || "video",
        status: "pending"
      };
      
      const { data, error } = await supabase
        .from('appointments')
        .insert([newAppointment])
        .select()
        .single();
      
      if (error) {
        console.error('Error booking appointment:', error);
        toast({
          title: "Error",
          description: "Failed to book appointment",
          variant: "destructive",
        });
        return null;
      }
      
      return data as Appointment;
    } catch (error) {
      console.error('Error in bookAppointment:', error);
      return null;
    }
  }

  // Update appointment status
  async updateAppointmentStatus(id: string, status: "confirmed" | "pending" | "canceled"): Promise<Appointment | null> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating appointment status:', error);
        toast({
          title: "Error",
          description: "Failed to update appointment status",
          variant: "destructive",
        });
        return null;
      }
      
      return data as Appointment;
    } catch (error) {
      console.error('Error in updateAppointmentStatus:', error);
      return null;
    }
  }

  // Get all appointments
  async getAllAppointments(): Promise<Appointment[]> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*');
      
      if (error) {
        console.error('Error fetching appointments:', error);
        return [];
      }
      
      return data as Appointment[];
    } catch (error) {
      console.error('Error in getAllAppointments:', error);
      return [];
    }
  }

  // Get appointments for a doctor
  async getDoctorAppointments(doctorId: string): Promise<Appointment[]> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', doctorId);
      
      if (error) {
        console.error('Error fetching doctor appointments:', error);
        return [];
      }
      
      return data as Appointment[];
    } catch (error) {
      console.error('Error in getDoctorAppointments:', error);
      return [];
    }
  }

  // Search doctors by name, specialty or hospital
  async searchDoctors(searchTerm: string): Promise<Doctor[]> {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,specialty.ilike.%${searchTerm}%,hospital.ilike.%${searchTerm}%`);
      
      if (error) {
        console.error('Error searching doctors:', error);
        return [];
      }
      
      return data as Doctor[];
    } catch (error) {
      console.error('Error in searchDoctors:', error);
      return [];
    }
  }

  // Get appointments for a patient
  async getPatientAppointments(patientId: string): Promise<Appointment[]> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId);
      
      if (error) {
        console.error('Error fetching patient appointments:', error);
        return [];
      }
      
      return data as Appointment[];
    } catch (error) {
      console.error('Error in getPatientAppointments:', error);
      return [];
    }
  }

  // Get all products
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }
      
      return data as Product[];
    } catch (error) {
      console.error('Error in getProducts:', error);
      return [];
    }
  }

  // Get a single product by ID
  async getProduct(id: string): Promise<Product | undefined> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching product:', error);
        return undefined;
      }
      
      return data as Product;
    } catch (error) {
      console.error('Error in getProduct:', error);
      return undefined;
    }
  }

  // Add a new product
  async addProduct(productData: Omit<Product, "id">): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();
      
      if (error) {
        console.error('Error adding product:', error);
        toast({
          title: "Error",
          description: "Failed to add product",
          variant: "destructive",
        });
        return null;
      }
      
      return data as Product;
    } catch (error) {
      console.error('Error in addProduct:', error);
      return null;
    }
  }

  // Update product stock
  async updateProductStock(id: string, newStock: number): Promise<Product | undefined> {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating product stock:', error);
        toast({
          title: "Error",
          description: "Failed to update product stock",
          variant: "destructive",
        });
        return undefined;
      }
      
      return data as Product;
    } catch (error) {
      console.error('Error in updateProductStock:', error);
      return undefined;
    }
  }
}

// Create a singleton instance
const apiClient = new ApiClient();

export default apiClient;
