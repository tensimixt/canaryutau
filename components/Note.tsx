// components/Note.tsx
import React from 'react';
import dynamic from 'next/dynamic';
const Rect = dynamic(() => import('react-konva').then((mod) => mod.Rect), { ssr: false });
const Line = dynamic(() => import('react-konva').then((mod) => mod.Line), { ssr: false });
import PitchCurve from './PitchCurve';
import { NoteData } from '../types';

interface NoteProps {
  note: NoteData;
  onDragMove: (e: any) => void;
  onClick: (e: any) => void;
  onPitchPointDragMove: (e: any, noteId: number, pointIndex: number) => void;
  onResize: (e: any, noteId: number) => void;
}

const Note: React.FC<NoteProps> = ({ note, onDragMove, onClick, onPitchPointDragMove, onResize }) => {
  const handleWidth = 5;

  return (
    <>
      <Rect
        x={note.x}
        y={note.y}
        width={note.width}
        height={note.height}
        fill={note.selected ? '#0080FF' : '#00AAFF'}
        stroke='#000000'
        strokeWidth={1}
        draggable
        dragBoundFunc={(pos) => ({
          x: pos.x < 80 ? 80 : pos.x,
          y: pos.y,
        })}
        onDragMove={onDragMove}
        onClick={onClick}
      />
      {/* Resizing Handle */}
      <Rect
        x={note.x + note.width - handleWidth}
        y={note.y}
        width={handleWidth}
        height={note.height}
        fill='#888888'
        stroke='#000000'
        strokeWidth={1}
        draggable
        dragBoundFunc={(pos) => ({
          x: pos.x,
          y: note.y,
        })}
        onDragMove={(e) => onResize(e, note.id)}
        onClick={(e) => e.cancelBubble = true}
      />
      {/* Pitch Curve */}
      <PitchCurve note={note} onPitchPointDragMove={onPitchPointDragMove} />
    </>
  );
};

export default Note;