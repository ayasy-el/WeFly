import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { 
  FlightSearchQuery, 
  Flight, 
  BookingRequest, 
  UpdateBookingRequest,
  BookingSummary,
  BookingDetail,
  BookingResponse
} from '@/types';

// In a real app, these would come from environment variables
const API_BASE_URL = Platform.OS === 'web' 
  ? 'http://localhost:5000' 
  : 'http://10.0.2.2:5000'; // For Android emulator

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flights API
export const searchFlights = async (params: FlightSearchQuery): Promise<Flight[]> => {
  const response = await api.get('/api/flights', { params });
  return response.data;
};

// Bookings API
export const createBooking = async (bookingData: BookingRequest): Promise<BookingResponse> => {
  const response = await api.post('/api/bookings', bookingData);
  return response.data;
};

export const getBookings = async (userId?: string, status?: string): Promise<BookingSummary[]> => {
  const params: Record<string, string> = {};
  if (userId) params.user_id = userId;
  if (status) params.status = status;
  
  const response = await api.get('/api/bookings', { params });
  return response.data;
};

export const getBookingById = async (bookingId: string): Promise<BookingDetail> => {
  const response = await api.get(`/api/bookings/${bookingId}`);
  return response.data;
};

export const updateBooking = async (
  bookingId: string, 
  updateData: UpdateBookingRequest
): Promise<BookingDetail> => {
  const response = await api.put(`/api/bookings/${bookingId}`, updateData);
  return response.data;
};

export const cancelBooking = async (bookingId: string): Promise<void> => {
  await api.delete(`/api/bookings/${bookingId}`);
};

// Mock API for development (when real API is not available)
export const mockSearchFlights = async (params: FlightSearchQuery): Promise<Flight[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: 101,
      flight_code: 'GA204',
      airline_name: 'Garuda Indonesia',
      origin_city: params.origin_city,
      destination_city: params.destination_city,
      departure_datetime: `${params.departure_date}T08:00:00Z`,
      arrival_datetime: `${params.departure_date}T10:50:00Z`,
      price: 1650000,
      available_seats: 35,
    },
    {
      id: 102,
      flight_code: 'LA303',
      airline_name: 'Lion Air',
      origin_city: params.origin_city,
      destination_city: params.destination_city,
      departure_datetime: `${params.departure_date}T10:30:00Z`,
      arrival_datetime: `${params.departure_date}T13:20:00Z`,
      price: 985000,
      available_seats: 12,
    },
    {
      id: 103,
      flight_code: 'BA505',
      airline_name: 'Batik Air',
      origin_city: params.origin_city,
      destination_city: params.destination_city,
      departure_datetime: `${params.departure_date}T14:15:00Z`,
      arrival_datetime: `${params.departure_date}T17:00:00Z`,
      price: 1250000,
      available_seats: 28,
    }
  ];
};

export const mockCreateBooking = async (bookingData: BookingRequest): Promise<BookingResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    message: 'Booking created successfully',
    booking_id: `booking-${Math.random().toString(36).substring(2, 9)}`,
    flight_details: {
      id: 101,
      flight_code: bookingData.flight_code,
      origin_city: 'CGK',
      destination_city: 'DPS',
      price: 1650000,
      available_seats: 34,
    },
  };
};

export const mockGetBookings = async (userId?: string): Promise<BookingSummary[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (!userId) return [];
  
  return [
    {
      booking_id: 'booking-abc123',
      flight_code: 'GA204',
      user_id: userId,
      status: 'CONFIRMED',
      booking_date: '2025-12-15T12:30:00Z',
      total_price: 1650000,
    },
    {
      booking_id: 'booking-def456',
      flight_code: 'LA303',
      user_id: userId,
      status: 'PENDING_PAYMENT',
      booking_date: '2025-12-10T09:45:00Z',
      total_price: 985000,
    }
  ];
};

export const mockGetBookingById = async (bookingId: string): Promise<BookingDetail> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    booking_id: bookingId,
    flight_code: 'GA204',
    user_id: 'user_test_001',
    status: 'CONFIRMED',
    booking_date: '2025-12-15T12:30:00Z',
    total_price: 1650000,
    flight_details: {
      id: 101,
      flight_code: 'GA204',
      airline_name: 'Garuda Indonesia',
      origin_city: 'CGK',
      destination_city: 'DPS',
      departure_datetime: '2025-12-20T08:00:00Z',
      arrival_datetime: '2025-12-20T10:50:00Z',
      price: 1650000,
      available_seats: 35,
    },
    num_tickets: 1,
    passenger_details: [
      {
        name: 'John Doe',
        seat_preference: 'Window',
      }
    ],
    created_at: '2025-12-15T12:30:00Z',
    updated_at: '2025-12-15T12:30:00Z',
  };
};