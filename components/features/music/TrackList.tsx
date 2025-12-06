
import React from 'react';
import { Track } from '../../../types';

interface TrackListProps {
  tracks: Track[];
  currentTrackId?: string;
  isPlaying: boolean;
  onTrackSelect: (track: Track) => void;
}

export const TrackList: React.FC<TrackListProps> = ({
  tracks,
  currentTrackId,
  isPlaying,
  onTrackSelect
}) => {
  return (
    <div className="space-y-1">
      {tracks.map((track, index) => {
        const isActive = currentTrackId === track.id;
        const trackNumber = track.order !== undefined ? track.order + 1 : index + 1;

        return (
          <div
            key={track.id}
            onClick={() => onTrackSelect(track)}
            className={`
              flex items-center justify-between p-4 cursor-pointer border-b border-white/5
              hover:bg-white/5
              ${isActive ? 'bg-white/5 border-l-4 border-l-cyan-400' : 'border-l-4 border-l-transparent'}
            `}
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 flex items-center justify-center ${isActive ? 'text-cyan-400' : 'text-gray-600'}`}>
                <span className="font-mono text-sm">{String(trackNumber).padStart(2, '0')}</span>
              </div>
              <div>
                <h4 className={`font-bold font-rajdhani text-lg ${isActive ? 'text-cyan-400' : 'text-gray-300'}`}>
                  {track.title}
                </h4>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{track.genre}</p>
              </div>
            </div>
            <div className="text-sm font-mono text-gray-500">
              {track.duration}
            </div>
          </div>
        );
      })}
    </div>
  );
};
