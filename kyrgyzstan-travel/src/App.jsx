import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { LanguageProvider } from './context/LanguageContext';
import { BookingProvider } from './context/BookingContext';
import { SearchProvider } from './context/SearchContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TopLocations from './components/TopLocations';
import DestinationsMap from './components/DestinationsMap';
import ToursActivities from './components/ToursActivities';
import BookingModal from './components/BookingModal';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ToursPage from './pages/ToursPage';
import TourDetailPage from './pages/TourDetailPage';
import DestinationsPage from './pages/DestinationsPage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import BookingPage from './pages/BookingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import ItinerariesPage from './pages/ItinerariesPage';
import ItineraryDetailPage from './pages/ItineraryDetailPage';
import ServicesPage from './pages/ServicesPage';
import GuidePage from './pages/GuidePage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import ReviewsPage from './pages/ReviewsPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        <BookingProvider>
          <SearchProvider>
            <AuthProvider>
              <BrowserRouter>
                <div className="min-h-screen bg-graphite">
                  <Navbar />
                  <main id="main-content">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/tours" element={<ToursPage />} />
                      <Route path="/tours/:slug" element={<TourDetailPage />} />
                      <Route path="/destinations" element={<DestinationsPage />} />
                      <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
                      <Route path="/booking/:tourSlug" element={<BookingPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/guide" element={<GuidePage />} />
                      <Route path="/guide/article/:slug" element={<ArticleDetailPage />} />
                      <Route path="/itineraries" element={<ItinerariesPage />} />
                      <Route path="/itineraries/:slug" element={<ItineraryDetailPage />} />
                      <Route path="/services" element={<ServicesPage />} />
                      <Route path="/reviews" element={<ReviewsPage />} />
                      <Route path="/events" element={<EventsPage />} />
                      <Route path="/events/:slug" element={<EventDetailPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </main>
                  <Footer />
                  <BookingModal />
                </div>
              </BrowserRouter>
            </AuthProvider>
          </SearchProvider>
        </BookingProvider>
      </LanguageProvider>
    </I18nextProvider>
  );
}

export default App;