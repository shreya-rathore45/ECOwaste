
import React, { useRef, useEffect, useState } from 'react';

interface CameraViewProps {
  onCapture: (base64Image: string) => void;
  isProcessing: boolean;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, isProcessing }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        setError("Camera access is required for detection.");
      }
    };
    startCamera();
    return () => stream?.getTracks().forEach(track => track.stop());
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && !isProcessing) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        onCapture(canvas.toDataURL('image/jpeg', 0.8).split(',')[1]);
      }
    }
  };

  if (error) return (
    <div className="bg-red-50 p-6 rounded-2xl text-center">
      <p className="text-red-600 font-bold text-sm">{error}</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block px-1">
        Capture Waste Item
      </label>
      <div className="relative group overflow-hidden rounded-[2rem] bg-slate-100 border-2 border-dashed border-slate-200 aspect-[4/3] flex items-center justify-center">
        <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
        <canvas ref={canvasRef} className="hidden" />
        
        {isProcessing && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-20 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-slate-800 font-black text-xs uppercase tracking-widest animate-pulse">Processing...</p>
          </div>
        )}

        <div className="absolute inset-0 pointer-events-none border-[1.5rem] border-black/5" />
        
        <button
          onClick={handleCapture}
          disabled={isProcessing}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur shadow-xl px-8 py-3 rounded-2xl flex items-center space-x-2 active:scale-95 transition-all group-hover:bg-emerald-500 group-hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          </svg>
          <span className="font-black text-xs uppercase tracking-widest">Capture Photo</span>
        </button>
      </div>
    </div>
  );
};

export default CameraView;
