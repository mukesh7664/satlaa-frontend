import { useState, useEffect } from 'react';
import Script from 'next/script';

function RazorpayAffordability({ amount, currency, key, orderId, prefill, notes, theme }) {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (scriptLoaded) {
      const options = {
        amount,
        currency,
        key,
        order_id: orderId,
        prefill,
        notes,
        theme,
        container: 'razorpay-affordability-widget-container',
      };
      const handler = new window.Razorpay.affordability(options);
      handler.mount();
    }
  }, [scriptLoaded, amount, currency, key, orderId, prefill, notes, theme]);

  return (
    <>
      <Script
        id="razorpay-affordability-js"
        src="https://cdn.razorpay.com/widgets/affordability/affordability.js"
        onLoad={() => setScriptLoaded(true)}
      />
      <div id="razorpay-affordability-widget-container">
        <p>Loading Razorpay Affordability Widget...</p>
      </div>
    </>
  );
}

export default RazorpayAffordability;
