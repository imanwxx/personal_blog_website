'use client';

import { useEffect, useState } from 'react';

export default function MouseGlow() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Main glow effect */}
      <div
        className="fixed pointer-events-none z-10 rounded-full blur-[100px]"
        style={{
          left: mousePosition.x - 150,
          top: mousePosition.y - 150,
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(100, 100, 255, 0.15) 0%, rgba(150, 50, 200, 0.1) 50%, transparent 70%)',
        }}
      />
      {/* Secondary glow */}
      <div
        className="fixed pointer-events-none z-10 rounded-full blur-[60px]"
        style={{
          left: mousePosition.x - 50,
          top: mousePosition.y - 50,
          width: 100,
          height: 100,
          background: 'radial-gradient(circle, rgba(100, 200, 255, 0.2) 0%, transparent 70%)',
        }}
      />
    </>
  );
}
