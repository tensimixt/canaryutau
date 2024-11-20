'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const PianoRoll = dynamic(() => import('../components/PianoRoll'), { ssr: false });

export default function Home() {
  return (
    <div>
      <PianoRoll />
    </div>
  );
}