
import { useQuery } from '@tanstack/react-query';
import { quoteService, Quote } from '@/services/QuoteService';

export const useQuoteOfTheDay = () => {
  return useQuery({
    queryKey: ['quote-of-the-day'],
    queryFn: async () => {
      console.log('📜 useQuoteOfTheDay: Fetching quote');
      const quote = await quoteService.getQuoteOfTheDay();
      console.log('📜 useQuoteOfTheDay: Quote fetched:', quote.author);
      return quote;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: 1,
    retryDelay: 2000,
  });
};
