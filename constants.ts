import { Track, Service } from './types';
import { Disc, Gamepad2, Mic2, Layers, Radio } from 'lucide-react';

// Updated to the user-provided track
export const INTRO_AUDIO_URL = "/vanilla.mp3"; 
export const TRANSITION_SFX = "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3?filename=whoosh-cinematic-10278.mp3"; 

export const TRACKS: Track[] = [
  {
    id: '0',
    title: 'Vanilla',
    genre: 'Original Track',
    duration: '3:30',
    url: '/vanilla.mp3',
    coverArt: 'https://picsum.photos/id/1/200/200'
  },
  {
    id: '1',
    title: 'Neon Overdrive',
    genre: 'Cyberpunk / Mid-Tempo',
    duration: '3:45',
    url: 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3?filename=cyberpunk-city-127501.mp3',
    coverArt: 'https://picsum.photos/id/134/200/200'
  },
  {
    id: '2',
    title: 'Void Walker',
    genre: 'Dark Ambient',
    duration: '4:12',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=dark-cyberpunk-9549.mp3',
    coverArt: 'https://picsum.photos/id/34/200/200'
  },
  {
    id: '3',
    title: 'Boss Fight: Stage 1',
    genre: 'Orchestral Hybrid',
    duration: '2:58',
    url: 'https://cdn.pixabay.com/download/audio/2023/09/06/audio_9217979326.mp3?filename=action-cyberpunk-165896.mp3',
    coverArt: 'https://picsum.photos/id/234/200/200'
  }
];

export const SERVICES: Service[] = [
  {
    id: 's1',
    title: 'Game Scoring',
    description: 'Full original soundtracks adaptive to gameplay loops. From 8-bit retro to high-fidelity orchestral hybrid.',
    icon: 'Gamepad2'
  },
  {
    id: 's2',
    title: 'Film Scoring',
    description: 'Cinematic compositions for films, documentaries, and visual storytelling.',
    icon: 'MonitorPlay'
  },
  {
    id: 's3',
    title: 'Music Producing',
    description: 'Professional music production from concept to final master. Industry-ready quality.',
    icon: 'Disc'
  },
  {
    id: 's4',
    title: 'Mixing & Mastering',
    description: 'Industry standard loudness and clarity. Get your tracks ready for Spotify and Steam.',
    icon: 'Disc'
  }
];

export const CONTACT_EMAIL = "andreagogrichiani@gmail.com";
export const DISCORD_LINK = "https://discord.gg/gogrichiani-placeholder"; // Update with real link
export const SOUNDCLOUD_LINK = "https://soundcloud.com/gogrichiani-placeholder"; // Update with real link