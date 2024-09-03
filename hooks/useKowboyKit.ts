import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface KowboyKitEvent {
  eventType: 'lead' | 'add_to_cart' | 'purchase';
  price?: number;
}

export function useKowboyKit() {
  const [kkclid, setKkclid] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setKkclid(urlParams.get('kkclid'));
  }, []);

  const trackEvent = useCallback(async (event: KowboyKitEvent) => {
    if (!kkclid) return;

    try {
      await axios.post('/api/kowboykit', {
        eventType: event.eventType,
        clickId: kkclid,
        price: event.price,
      });
    } catch (error) {
      console.error('Error tracking KowboyKit event:', error);
    }
  }, [kkclid]);

  return { trackEvent };
}
