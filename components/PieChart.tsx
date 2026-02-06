'use client';

import React, { useState, useEffect } from 'react';
import { GanttChartBlock } from '@/lib/types';

interface PieChartProps {
    blocks: GanttChartBlock[];
}

interface SliceData {
    processId: string;
    duration: number;
    percentage: number;
    startAngle: number;
    endAngle: number;
    color: string;
}

const COLORS: Record<string, string> = {
    'P1': '#3b82f6',
    'P2': '#22c55e',
    'P3': '#eab308',
    'P4': '#ef4444',
    'P5': '#a855f7',
    'P6': '#ec4899',
    'P7': '#6366f1',
    'P8': '#14b8a6',
    'P9': '#f97316',
    'P10': '#06b6d4',
    'IDLE': '#374151'
};

const getProcessColor = (id: string): string => {
    return COLORS[id] || '#64748b';
};

export default function PieChart({ blocks }: PieChartProps) {
    const [animationProgress, setAnimationProgress] = useState(0);
    const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

    useEffect(() => {
        // Animate from 0 to 1 over 1.5 seconds
        const duration = 1500;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic function for smooth animation
            const eased = 1 - Math.pow(1 - progress, 3);
            setAnimationProgress(eased);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }, [blocks]);

    if (blocks.length === 0) return null;

    // Calculate time distribution
    const processTimeMap = new Map<string, number>();
    blocks.forEach(block => {
        const duration = block.endTime - block.startTime;
        const current = processTimeMap.get(block.processId) || 0;
        processTimeMap.set(block.processId, current + duration);
    });

    const totalTime = Array.from(processTimeMap.values()).reduce((a, b) => a + b, 0);

    // Create slice data
    const slices: SliceData[] = [];
    let currentAngle = -90; // Start from top

    processTimeMap.forEach((duration, processId) => {
        const percentage = (duration / totalTime) * 100;
        const angleSpan = (duration / totalTime) * 360;

        slices.push({
            processId,
            duration,
            percentage,
            startAngle: currentAngle,
            endAngle: currentAngle + angleSpan,
            color: getProcessColor(processId)
        });

        currentAngle += angleSpan;
    });

    // SVG dimensions
    const size = 400;
    const center = size / 2;
    const radius = 140;
    const hoverRadius = 150;

    // Create SVG path for pie slice
    const createSlicePath = (slice: SliceData, isHovered: boolean, progress: number) => {
        const r = isHovered ? hoverRadius : radius;
        const startAngle = slice.startAngle;
        const endAngle = slice.startAngle + (slice.endAngle - slice.startAngle) * progress;

        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;

        const x1 = center + r * Math.cos(startRad);
        const y1 = center + r * Math.sin(startRad);
        const x2 = center + r * Math.cos(endRad);
        const y2 = center + r * Math.sin(endRad);

        const largeArc = endAngle - startAngle > 180 ? 1 : 0;

        return `M ${center} ${center} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    };

    // Calculate label position
    // We need external labels with connecting lines
    const getLabelData = (slice: SliceData, isHovered: boolean) => {
        const startRad = (slice.startAngle * Math.PI) / 180;
        const endRad = (slice.endAngle * Math.PI) / 180;
        const midAngle = (slice.startAngle + slice.endAngle) / 2;
        const midRad = (midAngle * Math.PI) / 180;

        // Position on the edge of the slice
        const edgeX = center + radius * Math.cos(midRad);
        const edgeY = center + radius * Math.sin(midRad);

        // Elbow position (slightly outside)
        const elbowRadius = radius + 20;
        const elbowX = center + elbowRadius * Math.cos(midRad);
        const elbowY = center + elbowRadius * Math.sin(midRad);

        // Final label position (further out, aligned horizontally somewhat)
        // We'll push it left or right based on the side
        const isRightSide = Math.cos(midRad) >= 0;
        const labelRadius = radius + 40;
        // Simple radial extension for now to avoid complex collision logic, 
        // but with a horizontal check

        let labelX = center + labelRadius * Math.cos(midRad);
        let labelY = center + labelRadius * Math.sin(midRad);

        // Adjust X to allow for horizontal line text anchor
        // If we want the "bent line" look:
        // center -> elbow -> labelText

        const finalX = isRightSide ? center + radius + 50 : center - radius - 50;

        // Actually, let's stick to a radial extension with a small horizontal dash if needed
        // Or just a straight line to a point.
        // User screenshot shows lines going to text.

        return {
            edge: { x: edgeX, y: edgeY },
            elbow: { x: elbowX, y: elbowY },
            label: { x: labelX, y: labelY },
            midAngle,
            isRightSide
        };
    };

    return (
        <div className="w-full flex flex-col items-center">
            {/* SVG Pie Chart - Increased size for external labels */}
            <div className="relative">
                <svg
                    width={size + 150} // Add horizontal padding
                    height={size + 50}
                    viewBox={`-${75} -${25} ${size + 150} ${size + 50}`}
                    className="filter drop-shadow-2xl"
                    style={{ transition: 'all 0.5s ease-out' }}
                >
                    {/* Rotatable Group for Pie Slices Only */}
                    <g style={{ transform: `rotate(${animationProgress * 360 * 0.1}deg)`, transformOrigin: `${center}px ${center}px`, transition: 'transform 1.5s ease-out' }}>
                        {/* Outer glow */}
                        <defs>
                            {slices.map((slice, index) => (
                                <radialGradient key={`gradient-${index}`} id={`gradient-${slice.processId}-${index}`}>
                                    <stop offset="0%" stopColor={slice.color} stopOpacity="0.9" />
                                    <stop offset="50%" stopColor={slice.color} stopOpacity="0.7" />
                                    <stop offset="100%" stopColor={slice.color} stopOpacity="0.5" />
                                </radialGradient>
                            ))}

                            {/* Glossy overlay gradient */}
                            <radialGradient id="glossy" cx="30%" cy="30%">
                                <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                                <stop offset="50%" stopColor="white" stopOpacity="0.1" />
                                <stop offset="100%" stopColor="white" stopOpacity="0" />
                            </radialGradient>

                            {/* Shadow filter */}
                            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
                                <feOffset dx="0" dy="8" result="offsetblur" />
                                <feComponentTransfer>
                                    <feFuncA type="linear" slope="0.3" />
                                </feComponentTransfer>
                                <feMerge>
                                    <feMergeNode />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            {/* Inner shadow for depth */}
                            <filter id="innerShadow">
                                <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                                <feOffset dx="0" dy="2" />
                                <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
                            </filter>
                        </defs>

                        {/* Base shadow circle */}
                        <circle
                            cx={center}
                            cy={center + 12}
                            r={radius}
                            fill="black"
                            opacity="0.3"
                            filter="url(#shadow)"
                        />

                        {/* Pie slices with 3D depth */}
                        {slices.map((slice, index) => {
                            const isHovered = hoveredSlice === slice.processId;
                            const path = createSlicePath(slice, isHovered, animationProgress);
                            const depthPath = createSlicePath(
                                { ...slice, startAngle: slice.startAngle, endAngle: slice.endAngle },
                                isHovered,
                                animationProgress
                            );

                            return (
                                <g key={index}>
                                    {/* 3D depth layer (darker) */}
                                    <path
                                        d={depthPath}
                                        fill={slice.color}
                                        opacity="0.6"
                                        transform="translate(0, 6)"
                                        filter="url(#innerShadow)"
                                    />

                                    {/* Main slice */}
                                    <path
                                        d={path}
                                        fill={`url(#gradient-${slice.processId}-${index})`}
                                        stroke="#1f2937"
                                        strokeWidth="2"
                                        className="transition-all duration-300 cursor-pointer"
                                        style={{
                                            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                                            transformOrigin: `${center}px ${center}px`,
                                            filter: isHovered ? 'brightness(1.2)' : 'brightness(1)'
                                        }}
                                        onMouseEnter={() => setHoveredSlice(slice.processId)}
                                        onMouseLeave={() => setHoveredSlice(null)}
                                    />
                                </g>
                            );
                        })}

                        {/* Glossy overlay for realism */}
                        <circle
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="url(#glossy)"
                            pointerEvents="none"
                        />
                    </g>

                    {/* External Labels & Lines (Static, do not rotate with chart for readability) */}
                    {/* However, the slices rotate. So we need to rotate these points OR calculate based on rotated angles.
                        The chart rotates by `animationProgress * 360 * 0.1` degrees.
                        It's easier to rotate the group if we want them to stick to slices, 
                        BUT text shouldn't be upside down. 
                        
                        Better: Use the slice's visual angle (taking rotation into account).
                    */}
                    {animationProgress > 0.5 && slices.map((slice, index) => {
                        const isHovered = hoveredSlice === slice.processId;
                        const rotationOffset = animationProgress * 360 * 0.1;

                        // Calculate actual visuals angles
                        const midAngle = (slice.startAngle + slice.endAngle) / 2 + rotationOffset;
                        const midRad = (midAngle * Math.PI) / 180;

                        // Points
                        const r = isHovered ? hoverRadius : radius;
                        const edgeX = center + r * Math.cos(midRad);
                        const edgeY = center + r * Math.sin(midRad);

                        const elbowRadius = radius + 30;
                        const elbowX = center + elbowRadius * Math.cos(midRad);
                        const elbowY = center + elbowRadius * Math.sin(midRad);

                        const isRightSide = Math.cos(midRad) >= 0;
                        const labelX = elbowX + (isRightSide ? 20 : -20);
                        const labelY = elbowY;

                        return (
                            <g key={`label-${index}`} style={{ opacity: (animationProgress - 0.5) * 2 }}>
                                {/* Connecting Line */}
                                <polyline
                                    points={`${edgeX},${edgeY} ${elbowX},${elbowY} ${labelX},${labelY}`}
                                    fill="none"
                                    stroke={isHovered ? slice.color : "#9ca3af"}
                                    strokeWidth="1.5"
                                    className="transition-colors duration-300"
                                />

                                {/* Label Text */}
                                <text
                                    x={labelX + (isRightSide ? 5 : -5)}
                                    y={labelY + 4}
                                    textAnchor={isRightSide ? "start" : "end"}
                                    className="font-mono text-xs font-bold"
                                    fill={isHovered ? slice.color : "#e5e7eb"}
                                    style={{
                                        textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                                        filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))'
                                    }}
                                >
                                    {slice.processId}: {slice.percentage.toFixed(1)}%
                                </text>
                            </g>
                        );
                    })}

                    {/* Center hole for donut effect */}
                    <circle
                        cx={center}
                        cy={center}
                        r={50}
                        fill="#0f172a"
                        stroke="#1f2937"
                        strokeWidth="3"
                    />

                    {/* Center label */}
                    <text
                        x={center}
                        y={center - 5}
                        textAnchor="middle"
                        className="font-mono text-xs fill-gray-400 uppercase tracking-wider"
                    >
                        CPU
                    </text>
                    <text
                        x={center}
                        y={center + 10}
                        textAnchor="middle"
                        className="font-mono text-xs fill-gray-400 uppercase tracking-wider"
                    >
                        TIME
                    </text>
                </svg>
            </div>

            {/* Legend - Keeping it as supplemental info */}
            <div className="mt-4 flex flex-wrap gap-4 justify-center max-w-md">
                {slices.map((slice, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer ${hoveredSlice === slice.processId
                                ? 'bg-gray-700/50 scale-105'
                                : 'bg-gray-800/30'
                            }`}
                        onMouseEnter={() => setHoveredSlice(slice.processId)}
                        onMouseLeave={() => setHoveredSlice(null)}
                    >
                        <div
                            className="w-3 h-3 rounded-full shadow-lg"
                            style={{ backgroundColor: slice.color }}
                        />
                        <span className="text-xs text-gray-400 font-mono">
                            {slice.processId} ({slice.duration}ms)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
