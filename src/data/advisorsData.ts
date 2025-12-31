export interface Advisor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  image: string;
  isOnline: boolean;
  gender: 'male' | 'female';
}

export const advisorsData: Advisor[] = [
  // --- 6 Female Advisors ---
  { id: 'f1', name: 'Sophia', specialty: 'Communication Expert', rating: 4.9, gender: 'female', isOnline: true, image: 'https://i.pravatar.cc/150?u=f1' },
  { id: 'f2', name: 'Elena', specialty: 'First Date Strategy', rating: 4.8, gender: 'female', isOnline: true, image: 'https://i.pravatar.cc/150?u=f2' },
  { id: 'f3', name: 'Aria', specialty: 'Self-Love & Confidence', rating: 4.9, gender: 'female', isOnline: false, image: 'https://i.pravatar.cc/150?u=f3' },
  { id: 'f4', name: 'Chloe', specialty: 'Attachment Styles', rating: 4.7, gender: 'female', isOnline: true, image: 'https://i.pravatar.cc/150?u=f4' },
  { id: 'f5', name: 'Maya', specialty: 'Dating Profile Audit', rating: 4.9, gender: 'female', isOnline: true, image: 'https://i.pravatar.cc/150?u=f5' },
  { id: 'f6', name: 'Zara', specialty: 'Red Flag Detection', rating: 4.8, gender: 'female', isOnline: true, image: 'https://i.pravatar.cc/150?u=f6' },

  // --- 6 Male Advisors ---
  { id: 'm1', name: 'Marcus', specialty: 'Confidence Building', rating: 4.9, gender: 'male', isOnline: true, image: 'https://i.pravatar.cc/150?u=m1' },
  { id: 'm2', name: 'James', specialty: 'Long-term Growth', rating: 4.7, gender: 'male', isOnline: true, image: 'https://i.pravatar.cc/150?u=m2' },
  { id: 'm3', name: 'Daniel', specialty: 'Modern Texting Etiquette', rating: 4.8, gender: 'male', isOnline: true, image: 'https://i.pravatar.cc/150?u=m3' },
  { id: 'm4', name: 'Leo', specialty: 'Conflict Resolution', rating: 4.9, gender: 'male', isOnline: false, image: 'https://i.pravatar.cc/150?u=m4' },
  { id: 'm5', name: 'Ethan', specialty: 'Body Language Expert', rating: 4.6, gender: 'male', isOnline: true, image: 'https://i.pravatar.cc/150?u=m5' },
  { id: 'm6', name: 'Noah', specialty: 'Emotional Intelligence', rating: 4.9, gender: 'male', isOnline: true, image: 'https://i.pravatar.cc/150?u=m6' }
];