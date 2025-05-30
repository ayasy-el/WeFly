import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { format } from 'date-fns';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Calendar, MapPin, Users, ArrowRightLeft } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { COLORS, SPACING } from '@/constants/theme';
import { FlightSearchQuery } from '@/types';
import { useApp } from '@/context/AppContext';

interface FlightSearchFormProps {
  onSearch: (searchParams: FlightSearchQuery) => void;
  loading?: boolean;
}

export function FlightSearchForm({ onSearch, loading = false }: FlightSearchFormProps) {
  const { addRecentSearch } = useApp();
  const [searchParams, setSearchParams] = useState<FlightSearchQuery>({
    origin_city: 'CGK',
    destination_city: 'DPS',
    departure_date: format(new Date(), 'yyyy-MM-dd'),
    num_passengers: 1,
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof FlightSearchQuery, string>>>({});
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const handleInputChange = (field: keyof FlightSearchQuery, value: string | number) => {
    setSearchParams({ ...searchParams, [field]: value });
    
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const swapCities = () => {
    setSearchParams({
      ...searchParams,
      origin_city: searchParams.destination_city,
      destination_city: searchParams.origin_city,
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FlightSearchQuery, string>> = {};
    
    if (!searchParams.origin_city.trim()) {
      newErrors.origin_city = 'Origin city is required';
    }
    
    if (!searchParams.destination_city.trim()) {
      newErrors.destination_city = 'Destination city is required';
    }
    
    if (searchParams.origin_city === searchParams.destination_city) {
      newErrors.destination_city = 'Destination must be different from origin';
    }

    if (!searchParams.departure_date) {
      newErrors.departure_date = 'Departure date is required';
    }
    
    if (!searchParams.num_passengers || searchParams.num_passengers < 1) {
      newErrors.num_passengers = 'At least 1 passenger is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = () => {
    if (validateForm()) {
      addRecentSearch(searchParams);
      onSearch(searchParams);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleDateConfirm = (date: Date) => {
    handleInputChange('departure_date', format(date, 'yyyy-MM-dd'));
    hideDatePicker();
  };

  return (
    <Card style={styles.card} elevation="small">
      <Typography variant="h3" style={styles.title}>Find Your Flight</Typography>
      
      <View style={styles.cityInputContainer}>
        <View style={styles.cityInput}>
          <Input
            label="From"
            placeholder="Origin city (e.g., CGK)"
            value={searchParams.origin_city}
            onChangeText={(text) => handleInputChange('origin_city', text)}
            error={errors.origin_city}
            leftIcon={<MapPin size={20} color={COLORS.primary.main} />}
            autoCapitalize="characters"
            maxLength={3}
          />
        </View>
        
        <TouchableOpacity style={styles.swapButton} onPress={swapCities}>
          <ArrowRightLeft size={20} color={COLORS.primary.main} />
        </TouchableOpacity>
        
        <View style={styles.cityInput}>
          <Input
            label="To"
            placeholder="Destination city (e.g., DPS)"
            value={searchParams.destination_city}
            onChangeText={(text) => handleInputChange('destination_city', text)}
            error={errors.destination_city}
            leftIcon={<MapPin size={20} color={COLORS.primary.main} />}
            autoCapitalize="characters"
            maxLength={3}
          />
        </View>
      </View>
      
      <TouchableOpacity onPress={showDatePicker}>
        <Input
          label="Departure Date"
          value={format(new Date(searchParams.departure_date), 'MMM dd, yyyy')}
          error={errors.departure_date}
          leftIcon={<Calendar size={20} color={COLORS.primary.main} />}
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
      />
      
      <Input
        label="Passengers"
        placeholder="Number of passengers"
        value={searchParams.num_passengers.toString()}
        onChangeText={(text) => {
          const value = parseInt(text, 10);
          if (isNaN(value)) {
            handleInputChange('num_passengers', 1);
          } else {
            handleInputChange('num_passengers', value);
          }
        }}
        error={errors.num_passengers}
        leftIcon={<Users size={20} color={COLORS.primary.main} />}
        keyboardType="number-pad"
      />
      
      <Button 
        title="Search Flights" 
        variant="primary" 
        size="large"
        fullWidth 
        onPress={handleSearch}
        loading={loading}
        style={styles.searchButton}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginBottom: SPACING.l,
  },
  title: {
    marginBottom: SPACING.m,
    textAlign: 'center',
  },
  cityInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cityInput: {
    flex: 1,
  },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SPACING.s,
    marginTop: SPACING.l,
  },
  searchButton: {
    marginTop: SPACING.m,
  },
});