// Custom hook for fetching tracks from Firestore
// Duration is auto-detected from the audio file, not stored in Firestore!
import { useState, useEffect } from 'react';
import { Track } from '../types';
import { fetchTracks } from '../services/tracksService';
import { TRACKS as FALLBACK_TRACKS } from '../constants';

interface UseTracksResult {
    tracks: Track[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Format seconds to MM:SS
 */
function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Load audio duration from URL
 */
function getAudioDuration(url: string): Promise<string> {
    return new Promise((resolve) => {
        const audio = new Audio();
        audio.addEventListener('loadedmetadata', () => {
            resolve(formatDuration(audio.duration));
        });
        audio.addEventListener('error', () => {
            resolve('--:--'); // Fallback if can't load
        });
        audio.src = url;
    });
}

/**
 * Hook to fetch tracks from Firestore with auto-detected durations
 */
export function useTracks(): UseTracksResult {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadTracks = async () => {
        setLoading(true);
        setError(null);

        try {
            let firestoreTracks = await fetchTracks();

            // If Firestore has tracks, use them; otherwise fall back to constants
            if (firestoreTracks.length === 0) {
                console.log('No tracks in Firestore, using fallback tracks');
                firestoreTracks = FALLBACK_TRACKS;
            }

            // Auto-detect duration for each track from the audio file
            const tracksWithDuration = await Promise.all(
                firestoreTracks.map(async (track) => {
                    // Only fetch duration if not already set or if we want to override
                    const duration = await getAudioDuration(track.url);
                    return { ...track, duration };
                })
            );

            setTracks(tracksWithDuration);
        } catch (err) {
            console.error('Error loading tracks:', err);
            setError('Failed to load tracks from cloud');
            setTracks(FALLBACK_TRACKS);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTracks();
    }, []);

    return {
        tracks,
        loading,
        error,
        refetch: loadTracks
    };
}
