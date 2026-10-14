import { createContext, useContext, useState, useCallback } from 'react';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [bookingModal, setBookingModal] = useState({ isOpen: false, tour: null, tourDate: null });

  const openBooking = useCallback((tour, tourDate = null) => {
    const fallbackTourDate =
      tourDate ||
      (Array.isArray(tour?.next_dates) && tour.next_dates.length > 0 ? tour.next_dates[0] : null) ||
      (Array.isArray(tour?.dates) && tour.dates.length > 0 ? tour.dates[0] : null);
    setBookingModal({ isOpen: true, tour, tourDate: fallbackTourDate });
  }, []);

  const closeBooking = useCallback(() => {
    setBookingModal({ isOpen: false, tour: null, tourDate: null });
  }, []);

  const value = {
    bookingModal,
    openBooking,
    closeBooking,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}