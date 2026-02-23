import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause } from 'lucide-react';

interface PlaybackControlsProps {
    totalTime: number;
    currentTime: number;
    setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
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
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, totalTime, setCurrentTime, setIsPlaying]);

    const togglePlay = () => setIsPlaying(!isPlaying);
    const reset = () => {
        setIsPlaying(false);
        setCurrentTime(0);
    };
    const stepBack = () => {
        setIsPlaying(false);
        setCurrentTime((t) => Math.max(0, t - 1));
    };
    const stepForward = () => {
        setIsPlaying(false);
        setCurrentTime((t) => Math.min(totalTime, t + 1));
    };

    return (
        <div className="bg-gray-900/40 p-3 rounded-lg border border-gray-700/50 mb-0 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-4 w-full">
                {/* Step & Play Controls */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={reset}
                        className="p-1.5 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
                        title="Reset"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={stepBack}
                        disabled={currentTime <= 0}
                        className="p-1.5 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Step Backward"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={togglePlay}
                        className="p-2 rounded-full bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 border border-blue-500/30 transition-all"
                        title={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={stepForward}
                        disabled={currentTime >= totalTime}
                        className="p-1.5 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Step Forward"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Scrubber */}
                <div className="flex-1 flex items-center gap-3">
                    <span className="text-xs font-mono text-cyan-500 w-8 text-right">{currentTime}s</span>
                    <input
                        type="range"
                        min="0"
                        max={totalTime}
                        value={currentTime}
                        onChange={(e) => setCurrentTime(Number(e.target.value))}
                        className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                    />
                    <span className="text-xs font-mono text-gray-500 w-8">{totalTime}s</span>
                </div>
            </div>
        </div>
    );
}
