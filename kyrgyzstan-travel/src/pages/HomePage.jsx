import Hero from '../components/Hero';
import TopLocations from '../components/TopLocations';
import DestinationsMap from '../components/DestinationsMap';
import ToursActivities from '../components/ToursActivities';
import ReviewsSection from '../components/ReviewsSection';
import EventsSection from '../components/EventsSection';
import { useBooking } from '../context/BookingContext';
import { useSearch } from '../context/SearchContext';

export default function HomePage() {
  const { openBooking } = useBooking();
  const { openSearch, setQuery } = useSearch();

  const handleSearch = ({ region, category, dates, guests }) => {
    const queryParts = [region?.name, category?.name, dates, guests ? `${guests} guests` : '']
      .filter(Boolean)
      .join(' ');

    setQuery(queryParts);
    openSearch();
  };

  return (
    <>
      <Hero onSearch={handleSearch} />
      <TopLocations />
      <DestinationsMap />
      <ToursActivities />
      <ReviewsSection />
      <EventsSection />
    </>
  );
}