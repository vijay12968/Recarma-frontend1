import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { AuthResponse, CreateVehicleRequest, SchedulePickupRequest, UpdateStatusRequest, Vehicle, Pickup, Role } from '../types';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    // Don't send token for auth endpoints to avoid issues with stale tokens
    if (token && !config.url?.includes('/auth/')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper to recursively normalize _id to id
const normalizeData = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(normalizeData);
  }
  if (data !== null && typeof data === 'object') {
    // If it has _id and no id, map it
    if (data._id && !data.id) {
      data.id = data._id;
    }
    // Recursively normalize all properties of the object
    Object.keys(data).forEach(key => {
      // Avoid circular references or excessively deep recursion if necessary, 
      // though typically JSON data from API is a tree.
      if (typeof data[key] === 'object' && data[key] !== null) {
        data[key] = normalizeData(data[key]);
      }
    });
  }
  return data;
};

// Response interceptor to handle 401 and normalize _id
api.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = normalizeData(response.data);
    }
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('API Request Timed Out');
    }

    // Only redirect if we are sure it's an auth error on a protected route
    if (error.response?.status === 401) {
      const isAuthPage = window.location.hash.includes('/login') || window.location.hash.includes('/register');
      
      // If we are NOT on an auth page, clear and redirect
      if (!isAuthPage) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('user');
          window.location.hash = '#/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (data: any) => {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },
  login: async (data: any) => {
    console.log("Attempting login to:", `${API_BASE_URL}/api/auth/login`);
    const response = await api.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  }
};

export const vehicleService = {
  create: async (data: CreateVehicleRequest) => {
    const response = await api.post<Vehicle>('/api/vehicles', data);
    return response.data;
  },
  getMyVehicles: async () => {
    const response = await api.get<Vehicle[]>('/api/vehicles/my');
    return response.data;
  },
  // Helper to get single vehicle based on role
  getById: async (id: string) => {
    const role = localStorage.getItem('role');
    
    if (role === Role.DEALER) {
      // For dealers, we find the vehicle inside the pickups list
      const pickups = await pickupService.getAll();
      const pickup = pickups.find(p => p.vehicle?.id === id || p.vehicleId === id);
      
      if (pickup?.vehicle) {
        // IMPORTANT: Inject pickupDate from the pickup object into the vehicle object
        // because the vehicle object embedded in the pickup response might not have it.
        return {
            ...pickup.vehicle,
            pickupDate: pickup.pickupDate
        };
      }
      
      // Fallback: Try to fetch vehicle directly if endpoint exists, or throw
      // Since backend might not expose GET /vehicles/:id for dealers directly in this spec, 
      // we rely on the pickup list.
      throw new Error("Vehicle not found in assigned pickups");
    } else {
      // For owners, we look in their vehicle list
      const vehicles = await vehicleService.getMyVehicles();
      const vehicle = vehicles.find(v => v.id === id);
      if (!vehicle) throw new Error("Vehicle not found");
      return vehicle;
    }
  },
  updateStatus: async (id: string, data: UpdateStatusRequest) => {
    const response = await api.patch<Vehicle>(`/api/vehicles/${id}/status`, data);
    return response.data;
  }
};

export const pickupService = {
  schedule: async (data: SchedulePickupRequest) => {
    const response = await api.post<Pickup>('/api/pickups', data);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get<Pickup[]>('/api/pickups');
    return response.data;
  }
};

export const documentService = {
  upload: async (vehicleId: string, type: string, file: File) => {
    const formData = new FormData();
    formData.append('vehicleId', vehicleId);
    formData.append('type', type);
    formData.append('document', file);
    
    const response = await api.post('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export default api;