export interface Track {
  id: string;
  title: string;
  genre: string;
  duration: string;
  url: string; // URL to the audio file
  coverArt?: string;
  order?: number; // For ordering tracks in Firestore
  isBackgroundSong?: boolean; // If true, this track plays as the intro/background music
  backgroundStartTime?: number; // Seconds to start from (default: 0). Currently using 53.5
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  priceRange?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: React.ElementType;
}