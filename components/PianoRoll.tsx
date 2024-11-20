import React, { useState } from 'react';
import { Stage, Layer, Rect, Line, Text } from 'react-konva';
import Note from './Note';
import { NoteData } from '../types';

const PianoRoll: React.FC = () => {
  // Constants
  const width = window.innerWidth;
  const height = window.innerHeight;
  const keyWidth = 80;
  const noteHeight = 20;
  const totalKeys = 88;

  const [notes, setNotes] = useState<NoteData[]>([]);

  // Functions to generate piano keys and grid
  const drawGrid = () => {
    const grid = [];
    for (let i = 0; i < totalKeys; i++) {
      const y = i * noteHeight;
      // Piano key
      grid.push(
        <Rect
          key={`key-${i}`}
          x={0}
          y={y}
          width={keyWidth}
          height={noteHeight}
          fill={isBlackKey(i) ? '#4a4a4a' : '#ffffff'}
          stroke='#cccccc'
        />
      );
      // Note label
      grid.push(
        <Text
          key={`label-${i}`}
          x={5}
          y={y + 5}
          fontSize={12}
          text={getKeyLabel(i)}
          fill={isBlackKey(i) ? '#ffffff' : '#000000'}
        />
      );
      // Horizontal grid line
      grid.push(
        <Line
          key={`line-${i}`}
          points={[keyWidth, y, width, y]}
          stroke='#e0e0e0'
          strokeWidth={1}
        />
      );
    }
    return grid;
  };

  // Helper functions
  const isBlackKey = (keyIndex: number): boolean => {
    const noteInOctave = (totalKeys - keyIndex - 1) % 12;
    return [1, 3, 6, 8, 10].includes(noteInOctave);
  };

  const getKeyLabel = (keyIndex: number): string => {
    const keyNumber = totalKeys - keyIndex - 1;
    const octave = Math.floor(keyNumber / 12) - 1;
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F',
      'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const noteName = noteNames[keyNumber % 12];
    return `${noteName}${octave}`;
  };

  // Event handlers
  const handleGridClick = (e: any) => {
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    const x = pointerPosition.x;
    const y = Math.floor(pointerPosition.y / noteHeight) * noteHeight;
    if (x < keyWidth) return;
    const newNote: NoteData = {
      id: Date.now(),
      x: x,
      y: y,
      width: 60,
      height: noteHeight,
      selected: false,
      pitchPoints: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
      ],
    };
    setNotes([...notes, newNote]);
  };

  const handleNoteDragMove = (e: any, id: number) => {
    const { x, y } = e.target.position();
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id
          ? { ...note, x: x, y: Math.floor(y / noteHeight) * noteHeight }
          : note
      )
    );
  };

  const handleNoteClick = (e: any, id: number) => {
    e.cancelBubble = true;
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id
          ? { ...note, selected: !note.selected }
          : note
      )
    );
  };

  const handlePitchPointDragMove = (e: any, noteId: number, pointIndex: number) => {
    const { x, y } = e.target.position();
    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id !== noteId) return note;
        const relativeX = (x - note.x) / note.width;
        const relativeY = 2 * (0.5 - (y - note.y) / noteHeight);
        const updatedPitchPoints = [...note.pitchPoints];
        updatedPitchPoints[pointIndex] = {
          x: Math.max(0, Math.min(1, relativeX)),
          y: Math.max(-1, Math.min(1, relativeY)),
        };
        return { ...note, pitchPoints: updatedPitchPoints };
      })
    );
  };

  const handleNoteResize = (e: any, noteId: number) => {
    const { x } = e.target.position();
    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id !== noteId) return note;
        const newWidth = x - note.x + 5;
        return { ...note, width: Math.max(20, newWidth) };
      })
    );
  };

  return (
    <Stage width={width} height={height} onMouseDown={handleGridClick}>
      <Layer>
        {drawGrid()}
        {notes.map((note) => (
          <Note
            key={note.id}
            note={note}
            onDragMove={(e) => handleNoteDragMove(e, note.id)}
            onClick={(e) => handleNoteClick(e, note.id)}
            onPitchPointDragMove={handlePitchPointDragMove}
            onResize={handleNoteResize}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default PianoRoll;