
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
        resolve({
          id: Math.floor(Math.random() * 10000),
          doctorId,
          patientId: 1, // Would come from auth in a real app
          date: appointmentData.date || new Date().toISOString().split('T')[0],
          time: appointmentData.time || "10:00 AM",
          type: appointmentData.type || "video",
          status: "pending"
        });
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
    // In a real app, this would make an API call
    // return await fetch(`${this.baseUrl}/patients/${patientId}/appointments`).then(res => res.json());
    
    // For now, return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1001,
            doctorId: 1,
            patientId,
            date: "2023-06-10",
            time: "3:00 PM",
            type: "video",
            status: "confirmed"
          },
          {
            id: 1002,
            doctorId: 3,
            patientId,
            date: "2023-06-15",
            time: "10:30 AM",
            type: "in-person",
            status: "pending"
          }
        ]);
      }, 500);
    });
  }
}

// Create a singleton instance
const apiClient = new ApiClient();

export default apiClient;
