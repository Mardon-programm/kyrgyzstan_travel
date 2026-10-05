import { useState, useEffect, useCallback } from 'react';

export function useApi(apiCall, deps = [], options = {}) {
  const { immediate = true, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall(...args);
      setData(response.data);
      onSuccess?.(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'An error occurred';
      setError(errorMessage);
      onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, execute, refetch: execute };
}

export function useRegions(params) {
  return useApi(
    () => import('../services/api').then(({ regionsApi }) => regionsApi.list(params)),
    [JSON.stringify(params)]
  );
}

export function useCategories(params) {
  return useApi(
    () => import('../services/api').then(({ categoriesApi }) => categoriesApi.list(params)),
    [JSON.stringify(params)]
  );
}

export function useLocations(params) {
  return useApi(
    () => import('../services/api').then(({ locationsApi }) => locationsApi.list(params)),
    [JSON.stringify(params)]
  );
}

export function useFeaturedLocations() {
  return useApi(
    () => import('../services/api').then(({ locationsApi }) => locationsApi.featured()),
    []
  );
}

export function useDestinations(params) {
  return useApi(
    () => import('../services/api').then(({ destinationsApi }) => destinationsApi.list(params)),
    [JSON.stringify(params)]
  );
}

export function useFeaturedDestinations() {
  return useApi(
    () => import('../services/api').then(({ destinationsApi }) => destinationsApi.featured()),
    []
  );
}

export function useTours(params) {
  return useApi(
    () => import('../services/api').then(({ toursApi }) => toursApi.list(params)),
    [JSON.stringify(params)]
  );
}

export function useFeaturedTours() {
  return useApi(
    () => import('../services/api').then(({ toursApi }) => toursApi.featured()),
    []
  );
}

export function useTour(slug) {
  return useApi(
    () => import('../services/api').then(({ toursApi }) => toursApi.get(slug)),
    [slug]
  );
}

export function useBookingCreate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createBooking = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const { bookingsApi } = await import('../services/api');
      const response = await bookingsApi.create(data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Booking failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createBooking, loading, error };
}

export function useItineraries(params) {
  return useApi(
    () => import('../services/api').then(({ itinerariesApi }) => itinerariesApi.list(params)),
    [JSON.stringify(params)]
  );
}

export function useItinerary(slug) {
  return useApi(
    () => import('../services/api').then(({ itinerariesApi }) => itinerariesApi.get(slug)),
    [slug]
  );
}

export function useGuides(params) {
  return useApi(
    () => import('../services/api').then(({ servicesApi }) => servicesApi.guides.list(params)),
    [JSON.stringify(params)]
  );
}

export function useGuide(slug) {
  return useApi(
    () => import('../services/api').then(({ servicesApi }) => servicesApi.guides.get(slug)),
    [slug]
  );
}

export function useVehicles(params) {
  return useApi(
    () => import('../services/api').then(({ servicesApi }) => servicesApi.vehicles.list(params)),
    [JSON.stringify(params)]
  );
}

export function useVehicle(slug) {
  return useApi(
    () => import('../services/api').then(({ servicesApi }) => servicesApi.vehicles.get(slug)),
    [slug]
  );
}

export function useYurtCamps(params) {
  return useApi(
    () => import('../services/api').then(({ servicesApi }) => servicesApi.yurtCamps.list(params)),
    [JSON.stringify(params)]
  );
}

export function useYurtCamp(slug) {
  return useApi(
    () => import('../services/api').then(({ servicesApi }) => servicesApi.yurtCamps.get(slug)),
    [slug]
  );
}

export function useGuideCategories(params) {
  return useApi(
    () => import('../services/api').then(({ guideApi }) => guideApi.categories.list(params)),
    [JSON.stringify(params)]
  );
}

export function useGuideArticles(params) {
  return useApi(
    () => import('../services/api').then(({ guideApi }) => guideApi.articles.list(params)),
    [JSON.stringify(params)]
  );
}

export function useGuideArticle(slug) {
  return useApi(
    () => import('../services/api').then(({ guideApi }) => guideApi.articles.get(slug)),
    [slug]
  );
}

export function useFAQs(params) {
  return useApi(
    () => import('../services/api').then(({ guideApi }) => guideApi.faqs.list(params)),
    [JSON.stringify(params)]
  );
}

export function useFAQ(id) {
  return useApi(
    () => import('../services/api').then(({ guideApi }) => guideApi.faqs.get(id)),
    [id]
  );
}

export function useReviews(params) {
  return useApi(
    () => import('../services/api').then(({ reviewsApi }) => reviewsApi.list(params)),
    [JSON.stringify(params)]
  );
}

export function useFeaturedReviews() {
  return useApi(
    () => import('../services/api').then(({ reviewsApi }) => reviewsApi.list({ featured: true, limit: 6 })),
    []
  );
}

export function useEvents(params) {
  return useApi(
    () => import('../services/api').then(({ eventsApi }) => eventsApi.list(params)),
    [JSON.stringify(params)]
  );
}

export function useFeaturedEvents() {
  return useApi(
    () => import('../services/api').then(({ eventsApi }) => eventsApi.featured()),
    []
  );
}

export function useUpcomingEvents() {
  return useApi(
    () => import('../services/api').then(({ eventsApi }) => eventsApi.upcoming()),
    []
  );
}

export function useOngoingEvents() {
  return useApi(
    () => import('../services/api').then(({ eventsApi }) => eventsApi.ongoing()),
    []
  );
}