import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Flight, BookingSummary } from '@/types';

type AppContextType = {
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  recentSearches: FlightSearchParams[];
  addRecentSearch: (search: FlightSearchParams) => void;
  selectedFlight: Flight | null;
  setSelectedFlight: React.Dispatch<React.SetStateAction<Flight | null>>;
  bookings: BookingSummary[];
  setBookings: React.Dispatch<React.SetStateAction<BookingSummary[]>>;
};

type UserProfile = {
  id: string;
  name: string;
  email: string;
};

export type FlightSearchParams = {
  origin_city: string;
  destination_city: string;
  departure_date: string;
  num_passengers: number;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>({
    id: 'user_test_001',
    name: 'John Doe',
    email: 'john@example.com',
  });
  
  const [recentSearches, setRecentSearches] = useState<FlightSearchParams[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [bookings, setBookings] = useState<BookingSummary[]>([]);

  const addRecentSearch = (search: FlightSearchParams) => {
    setRecentSearches(prev => {
      // Remove duplicates
      const filtered = prev.filter(
        item => !(item.origin_city === search.origin_city && 
                 item.destination_city === search.destination_city && 
                 item.departure_date === search.departure_date)
      );
      // Add new search at beginning and keep only the last 5 searches
      return [search, ...filtered].slice(0, 5);
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        recentSearches,
        addRecentSearch,
        selectedFlight,
        setSelectedFlight,
        bookings,
        setBookings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}