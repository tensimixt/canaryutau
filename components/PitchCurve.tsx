'use client';
// Rest of your imports...
// components/PitchCurve.tsx
import React from 'react';
import dynamic from 'next/dynamic';

const Line = dynamic(() => import('react-konva').then((mod) => mod.Line), { ssr: false });
const Circle = dynamic(() => import('react-konva').then((mod) => mod.Circle), { ssr: false });
import { NoteData } from '../types';

interface PitchCurveProps {
  note: NoteData;
  onPitchPointDragMove: (e: any, noteId: number, pointIndex: number) => void;
}

const PitchCurve: React.FC<PitchCurveProps> = ({ note, onPitchPointDragMove }) => {
  const points = note.pitchPoints.map((point) => ({
    x: note.x + point.x * note.width,
    y: note.y + (0.5 - point.y / 2) * note.height,
  }));

  const linePoints = points.flatMap((point) => [point.x, point.y]);

  return (
    <>
      <Line
        points={linePoints}
        stroke='red'
        strokeWidth={2}
        lineJoin='round'
        // tension={0.5} // Uncomment for curved lines
      />
      {points.map((point, index) => (
        <Circle
          key={index}
          x={point.x}
          y={point.y}
          radius={4}
          fill='white'
          stroke='red'
          strokeWidth={1}
          draggable
          onDragMove={(e) => onPitchPointDragMove(e, note.id, index)}
          onClick={(e) => e.cancelBubble = true}
        />
      ))}
    </>
  );
};

export default PitchCurve;