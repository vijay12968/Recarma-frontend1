export enum Role {
  OWNER = 'OWNER',
  DEALER = 'DEALER',
  ADMIN = 'ADMIN'
}

export enum VehicleStatus {
  CREATED = 'CREATED',
  PICKUP_SCHEDULED = 'PICKUP_SCHEDULED',
  IN_TRANSIT = 'IN_TRANSIT',
  RECEIVED = 'RECEIVED',
  DISMANTLED = 'DISMANTLED',
  COD_ISSUED = 'COD_ISSUED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  role: Role;
  user: User;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  conditionScore: number;
  status: VehicleStatus;
  pickupDate?: string; // ISO Date string
  userId: string;
}

export interface Pickup {
  id: string;
  vehicleId: string;
  pickupDate: string;
  slot: string;
  vehicle?: Vehicle;
  user?: User;
}

export interface CreateVehicleRequest {
  make: string;
  model: string;
  year: number;
  conditionScore: number;
}

export interface SchedulePickupRequest {
  vehicleId: string;
  pickupDate: string;
  slot: string;
}

export interface UpdateStatusRequest {
  status: VehicleStatus;
}