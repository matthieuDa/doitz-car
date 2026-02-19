export interface TestimonialType {
  id: number;
  name: string;
  role: string;
  car: string;
  savings: string;
  quote: string;
  image: string;
}

export interface ServiceStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export type FormStep = 'INTENT' | 'CRITERIA' | 'CONTACT';

export interface FormData {
  intent: 'SPECIFIC' | 'ADVICE' | null;
  budget: string;
  carType: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}