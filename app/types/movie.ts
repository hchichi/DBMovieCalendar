export interface Movie {
  title: string;
  calendar: string;
  pic: {
    normal: string;
  };
  description?: string;
  rating?: string;
  duration?: string;
  genre?: string[];
} 
