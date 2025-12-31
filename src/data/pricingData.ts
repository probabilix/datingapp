export const pricingData = [
  {
    id: 'free',
    name: 'Free',
    price: '0',
    period: '/forever',
    description: 'Perfect for trying out LoveWise',
    features: ['3 chat messages per day', 'Access to 3 advisors', 'Basic dating tips', 'Email support'],
    isPopular: false,
    buttonText: 'Start Free',
    buttonVariant: 'outline'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '19',
    period: '/per month',
    description: 'For those serious about improving',
    features: ['Unlimited chat messages', 'Access to all 12 advisors', 'Voice conversations', 'Personalized advice', 'Priority support', 'Weekly insights report'],
    isPopular: true,
    buttonText: 'Get Premium',
    buttonVariant: 'solid'
  },
  {
    id: 'vip',
    name: 'VIP',
    price: '49',
    period: '/per month',
    description: 'Maximum support & features',
    features: ['Everything in Premium', 'Extended voice sessions', '1-on-1 strategy sessions', 'Exclusive dating guides', 'Profile review service', '24/7 priority support'],
    isPopular: false,
    buttonText: 'Go VIP',
    buttonVariant: 'dark'
  }
];