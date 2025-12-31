export const gatewayConfigs = [
  {
    id: 'stripe',
    name: 'Stripe',
    isEnabled: true, // Admin can toggle this
    description: 'Pay securely with Credit/Debit Card',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    isEnabled: true, // Currently off - Admin can turn on later
    description: 'Secure payment via PayPal wallet',
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    isEnabled: false, // Currently off - Admin can turn on later
    description: 'Secure payment for Indian users',
  }
];