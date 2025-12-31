export interface Coupon {
  code: string;
  type: 'flat' | 'percent';
  value: number;
  description: string;
  isEnabled: boolean;
}

export const couponData: Coupon[] = [
  { 
    code: 'SAVE10', 
    type: 'flat', 
    value: 10, 
    description: '$10 off your first purchase', 
    isEnabled: true 
  },
  { 
    code: 'LOVE20', 
    type: 'percent', 
    value: 20, 
    description: '20% discount on all plans', 
    isEnabled: true 
  },
  { 
    code: 'ADMIN50', 
    type: 'percent', 
    value: 50, 
    description: 'Special 50% off - Internal Use', 
    isEnabled: true // Turn on/off here
  }
];