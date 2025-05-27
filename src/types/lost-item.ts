export interface LostItem {
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  foundAt: Date;
} 