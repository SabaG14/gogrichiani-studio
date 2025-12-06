// Tracks Service - Fetch tracks from Firestore (read-only)
// You manage all tracks directly in Firebase Console!
import {
    collection,
    getDocs,
    orderBy,
    query
} from 'firebase/firestore';
import { db } from '../firebase';
import { Track } from '../types';

const TRACKS_COLLECTION = 'tracks';

/**
 * Fetch all tracks from Firestore
 * Tracks are ordered by the 'order' field (ascending)
 */
export async function fetchTracks(): Promise<Track[]> {
    try {
        const tracksRef = collection(db, TRACKS_COLLECTION);
        const q = query(tracksRef, orderBy('order', 'asc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Track));
    } catch (error) {
        console.error('Error fetching tracks:', error);
        return [];
    }
}
