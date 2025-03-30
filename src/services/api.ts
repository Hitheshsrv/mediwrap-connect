
/**
 * API service for handling all backend requests
 */

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
  reviews: number;
  image: string;
  available: boolean;
  nextAvailable: string;
  fee: string;
  education: string;
  experience: string;
  location: string;
  online: boolean;
}

// Mock data for doctors - in a real app, this would come from an API
const mockDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    hospital: "City Medical Center",
    rating: 4.9,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    available: true,
    nextAvailable: "Today, 3:00 PM",
    fee: "$150",
    education: "Harvard Medical School",
    experience: "15 years",
    location: "Downtown Medical Plaza",
    online: true
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Neurology",
    hospital: "University Hospital",
    rating: 4.8,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    available: true,
    nextAvailable: "Tomorrow, 10:00 AM",
    fee: "$180",
    education: "Stanford University",
    experience: "12 years",
    location: "University Medical Center",
    online: true
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrics",
    hospital: "Children's Hospital",
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    available: true,
    nextAvailable: "Today, 4:30 PM",
    fee: "$120",
    education: "Johns Hopkins University",
    experience: "10 years",
    location: "Westside Medical Building",
    online: true
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Orthopedics",
    hospital: "Sports Medicine Center",
    rating: 4.7,
    reviews: 87,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    available: true,
    nextAvailable: "Friday, 1:00 PM",
    fee: "$160",
    education: "UCLA Medical School",
    experience: "18 years",
    location: "Eastside Sports Clinic",
    online: false
  },
];

export interface Appointment {
  id: number;
  doctorId: number;
  patientId: number;
  date: string;
  time: string;
  type: "video" | "in-person";
  status: "confirmed" | "pending" | "canceled";
}

// Mock data for appointments
let mockAppointments: Appointment[] = [
  {
    id: 1001,
    doctorId: 1,
    patientId: 1,
    date: "2023-06-10",
    time: "3:00 PM",
    type: "video",
    status: "confirmed"
  },
  {
    id: 1002,
    doctorId: 3,
    patientId: 1,
    date: "2023-06-15",
    time: "10:30 AM",
    type: "in-person",
    status: "pending"
  },
  {
    id: 1003,
    doctorId: 2,
    patientId: 2,
    date: "2023-06-12",
    time: "2:00 PM",
    type: "video",
    status: "pending"
  }
];

// Mock data for products
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  stock: number;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    price: 5.99,
    category: "Pain Relief",
    description: "Effective pain relief for headaches, toothaches, and fever reduction.",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    stock: 100
  },
  {
    id: 2,
    name: "Vitamin C 1000mg",
    price: 12.49,
    category: "Vitamins",
    description: "High-strength vitamin C supplement to support immune system health.",
    image: "https://images.unsplash.com/photo-1616671276441-2f2c2a9b1b30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    stock: 50
  },
  {
    id: 3,
    name: "Digital Blood Pressure Monitor",
    price: 45.99,
    category: "Medical Devices",
    description: "Accurate and easy to use blood pressure monitoring device for home use.",
    image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    stock: 20
  },
  {
    id: 4,
    name: "Omega-3 Fish Oil",
    price: 18.99,
    category: "Supplements",
    description: "High-quality omega-3 supplement for heart and brain health.",
    image: "https://images.unsplash.com/photo-1577086664693-а8d2c8f5a449?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    stock: 75
  }
];

// API client class to handle all backend requests
export class ApiClient {
  // Base URL for API requests - would come from environment variables in a real app
  private baseUrl: string = "/api";

  // Get all doctors
  async getDoctors(): Promise<Doctor[]> {
    // In a real app, this would make an actual API call
    // return await fetch(`${this.baseUrl}/doctors`).then(res => res.json());
    
    // For now, return mock data
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockDoctors), 500); // Simulate network delay
    });
  }

  // Get a single doctor by ID
  async getDoctor(id: number): Promise<Doctor | undefined> {
    // In a real app, this would make an actual API call
    // return await fetch(`${this.baseUrl}/doctors/${id}`).then(res => res.json());
    
    // For now, return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const doctor = mockDoctors.find(doc => doc.id === id);
        resolve(doctor);
      }, 300);
    });
  }

  // Book an appointment
  async bookAppointment(doctorId: number, appointmentData: Partial<Appointment>): Promise<Appointment> {
    // In a real app, this would make an API call with POST
    /* 
    return await fetch(`${this.baseUrl}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ doctorId, ...appointmentData }),
    }).then(res => res.json());
    */

    // For now, return mock response
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAppointment = {
          id: Math.floor(Math.random() * 10000),
          doctorId,
          patientId: 1, // Would come from auth in a real app
          date: appointmentData.date || new Date().toISOString().split('T')[0],
          time: appointmentData.time || "10:00 AM",
          type: appointmentData.type || "video",
          status: "pending"
        };
        
        // Add to mock appointments
        mockAppointments.push(newAppointment);
        
        resolve(newAppointment);
      }, 500);
    });
  }

  // Update appointment status (for doctor/admin)
  async updateAppointmentStatus(id: number, status: "confirmed" | "pending" | "canceled"): Promise<Appointment> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockAppointments.findIndex(app => app.id === id);
        
        if (index !== -1) {
          mockAppointments[index].status = status;
          resolve(mockAppointments[index]);
        } else {
          reject(new Error("Appointment not found"));
        }
      }, 300);
    });
  }

  // Get all appointments (for admin)
  async getAllAppointments(): Promise<Appointment[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockAppointments]), 500);
    });
  }

  // Get appointments for a doctor
  async getDoctorAppointments(doctorId: number): Promise<Appointment[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const appointments = mockAppointments.filter(app => app.doctorId === doctorId);
        resolve(appointments);
      }, 500);
    });
  }

  // Search doctors by name, specialty or hospital
  async searchDoctors(searchTerm: string): Promise<Doctor[]> {
    // In a real app, this would make an API call
    // return await fetch(`${this.baseUrl}/doctors/search?term=${encodeURIComponent(searchTerm)}`).then(res => res.json());
    
    // For now, filter mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = mockDoctors.filter(doctor => 
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase())
        );
        resolve(results);
      }, 300);
    });
  }

  // Get appointments for a patient
  async getPatientAppointments(patientId: number): Promise<Appointment[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const appointments = mockAppointments.filter(app => app.patientId === patientId);
        resolve(appointments);
      }, 500);
    });
  }

  // Get all products (for pharmacy)
  async getProducts(): Promise<Product[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockProducts), 500);
    });
  }

  // Get a single product by ID
  async getProduct(id: number): Promise<Product | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const product = mockProducts.find(prod => prod.id === id);
        resolve(product);
      }, 300);
    });
  }
}

// Create a singleton instance
const apiClient = new ApiClient();

export default apiClient;
