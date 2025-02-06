import { useEffect } from 'react';

const GoogleCustomerReviews = ({ orderId, email, deliveryCountry, estimatedDeliveryDate, products }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js?onload=renderOptIn';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    
    window.renderOptIn = function() {
      window.gapi.load('surveyoptin', function() {
        window.gapi.surveyoptin.render({
          merchant_id: 768663231,
          order_id: orderId,
          email: email,
          delivery_country: deliveryCountry,
          estimated_delivery_date: estimatedDeliveryDate,
          products: products,
        });
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [orderId, email, deliveryCountry, estimatedDeliveryDate, products]);

  return null;
};

export default GoogleCustomerReviews;
