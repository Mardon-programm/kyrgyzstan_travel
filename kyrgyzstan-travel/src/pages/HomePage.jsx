import Hero from '../components/Hero';
import TopLocations from '../components/TopLocations';
import DestinationsMap from '../components/DestinationsMap';
import ToursActivities from '../components/ToursActivities';
import ReviewsSection from '../components/ReviewsSection';
import EventsSection from '../components/EventsSection';
import { useBooking } from '../context/BookingContext';

export default function HomePage() {
  const { openBooking } = useBooking();

  return (
    <>
      <Hero onSearch={() => {}} />
      <TopLocations />
      <DestinationsMap />
      <ToursActivities />
      <ReviewsSection />
      <EventsSection />
    </>
  );
}