// Flight types
export interface Flight {
  id: number;
  flight_code: string;
  airline_name: string;
  origin_city: string;
  destination_city: string;
  departure_datetime: string;
  arrival_datetime: string;
  price: number;
  available_seats: number;
}

export type FlightSearchQuery = {
  origin_city: string;
  destination_city: string;
  departure_date: string;
  num_passengers: number;
};

// Booking types
export interface PassengerDetail {
  name: string;
  seat_preference?: string;
}

export interface BookingRequest {
  flight_code: string;
  user_id: string;
  num_tickets: number;
  passenger_details?: PassengerDetail[];
}

export interface UpdateBookingRequest {
  num_tickets?: number;
  passenger_details?: PassengerDetail[];
  status?: 'CONFIRMED' | 'PENDING_PAYMENT';
}

export interface BookingSummary {
  booking_id: string;
  flight_code: string;
  user_id: string;
  status: string;
  booking_date: string;
  total_price: number;
}

export interface BookingDetail extends BookingSummary {
  flight_details: Flight;
  num_tickets: number;
  passenger_details?: PassengerDetail[];
  created_at: string;
  updated_at: string;
}

export interface BookingResponse {
  message: string;
  booking_id: string;
  flight_details: {
    id: number;
    flight_code: string;
    origin_city: string;
    destination_city: string;
    price: number;
    available_seats: number;
  };
}

// API response types
export interface ErrorResponse {
  error: string;
  details?: string;
  reason?: string;
}