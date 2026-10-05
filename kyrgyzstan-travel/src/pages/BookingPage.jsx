import { useParams, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTour } from '../hooks/useApi';
import { useBooking } from '../context/BookingContext';
import BookingModal from '../components/BookingModal';
import { Link } from 'react-router-dom';

export default function BookingPage() {
  const { t } = useTranslation();
  const { tourSlug } = useParams();
  const { openBooking, closeBooking, bookingModal } = useBooking();
  const { data: tour, loading } = useTour(tourSlug);

  useEffect(() => {
    if (tour) {
      openBooking(tour);
    } else {
      closeBooking();
    }
  }, [tour, openBooking, closeBooking]);

  if (loading) {
    return (
      <div className="py-20 lg:py-32 bg-graphite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-pulse">
            <div className="h-8 bg-white/5 rounded w-1/2 mx-auto mb-4" />
            <div className="h-4 bg-white/5 rounded w-1/3 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="py-20 lg:py-32 bg-graphite text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-white/60 mb-4">Tour not found</div>
          <Link to="/tours" className="btn-primary">Back to Tours</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 lg:py-32 bg-graphite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="glass-card p-12 max-w-2xl mx-auto">
          <p className="text-white/60 mb-4">Redirecting to booking...</p>
          <p className="font-display text-xl font-bold text-white">{tour.title}</p>
        </div>
      </div>
    </div>
  );
}