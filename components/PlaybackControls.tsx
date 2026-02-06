import React, { useEffect, useState } from 'react';

interface PlaybackControlsProps {
    totalTime: number;
    currentTime: number;
    setCurrentTime: React.Dispatch<React.SetStateAction<number>>; // Allow functional update
    isPlaying: boolean;
    setIsPlaying: (playing: boolean) => void;
}

export default function PlaybackControls({
    totalTime,
    currentTime,
    setCurrentTime,
    isPlaying,
    setIsPlaying
}: PlaybackControlsProps) {

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentTime((prev: number) => {
                    if (prev >= totalTime) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1000); // 1 second per time unit for visibility
        }
        return () => clearInterval(interval);
    }, [isPlaying, totalTime, setCurrentTime, setIsPlaying]);

    const togglePlay = () => setIsPlaying(!isPlaying);
    const reset = () => {
        setIsPlaying(false);
        setCurrentTime(0);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 sticky top-4 z-10">
            <div className="flex flex-col md:flex-row items-center gap-4">

                {/* Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={reset}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                        title="Reset"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" /><path d="M3 3v9h9" /></svg>
                    </button>

                    <button
                        onClick={togglePlay}
                        className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-transform transform active:scale-95"
                        title={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                        )}
                    </button>
                </div>

                {/* Scrubber */}
                <div className="flex-1 w-full flex items-center gap-4">
                    <span className="text-sm font-mono text-gray-500 w-12 text-right">{currentTime}s</span>
                    <input
                        type="range"
                        min="0"
                        max={totalTime}
                        value={currentTime}
                        onChange={(e) => setCurrentTime(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <span className="text-sm font-mono text-gray-500 w-12">{totalTime}s</span>
                </div>
            </div>
        </div>
    );
}
