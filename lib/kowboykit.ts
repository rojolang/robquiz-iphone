import axios from 'axios';

export async function trackKowboyKitEvent(eventType: 'lead' | 'add_to_cart' | 'purchase', clickId: string, price?: number) {
  try {
    const response = await axios.post('/api/kowboykit', {
      eventType,
      clickId,
      price,
    });
    return response.data;
  } catch (error) {
    console.error('Error tracking KowboyKit event:', error);
    throw error;
  }
}
