import React from 'react';
import SimpleStripePayment from '../StripePayment/SimpleStripePayment';

interface PaymentMethodSelectorProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  customerInfo: {
    name: string;
    email: string;
  };
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  clientSecret,
  onSuccess,
  onError,
  customerInfo
}) => {
  return (
    <SimpleStripePayment
      clientSecret={clientSecret}
      onSuccess={onSuccess}
      onError={onError}
      customerInfo={customerInfo}
    />
  );
};

export default PaymentMethodSelector; 