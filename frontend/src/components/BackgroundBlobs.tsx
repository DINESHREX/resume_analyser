import React from 'react';

const BackgroundBlobs: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Primary blob */}
      <div 
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-60 animate-blob"
        style={{
          background: 'radial-gradient(circle, hsl(202 100% 88% / 0.6) 0%, hsl(210 40% 70% / 0.3) 50%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      
      {/* Secondary blob */}
      <div 
        className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full opacity-50 animate-blob-delayed"
        style={{
          background: 'radial-gradient(circle, hsl(210 40% 70% / 0.5) 0%, hsl(202 100% 88% / 0.2) 50%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      
      {/* Accent blob */}
      <div 
        className="absolute bottom-20 right-1/4 w-[400px] h-[400px] rounded-full opacity-40 animate-blob"
        style={{
          background: 'radial-gradient(circle, hsl(202 100% 88% / 0.4) 0%, transparent 60%)',
          filter: 'blur(70px)',
          animationDelay: '10s',
        }}
      />
    </div>
  );
};

export default BackgroundBlobs;
