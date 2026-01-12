import React, { useState } from 'react';

interface ClassroomViewProps {
  onLeave: () => void;
}

export const ClassroomView: React.FC<ClassroomViewProps> = ({ onLeave }) => {
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);

  return (
    <div className="fixed inset-0 z-50 bg-[#101622] flex flex-col h-screen text-white">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center gap-3">
          <button onClick={onLeave} className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20">
             <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h3 className="font-bold text-sm">Physics - High School</h3>
            <span className="text-xs text-green-400 flex items-center gap-1">
               <span className="w-2 h-2 rounded-full bg-green-400"></span> 00:15:30
            </span>
          </div>
        </div>
        <button className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20">
           <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>

      {/* Main Video Area (Tutor) */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZ-tn9gbXD7SlBn2seqoY1mlvDLYgfQ9nIJT8rOK6YSg9_DKZWYO9iE7qvUkRc6-3SKw_vsdNznRDSjwhubAgxCK35VYcyvHBCZhpwETLPnO2tXnih3sUoEo7-EfZZ_zZi5X9UgoXaUZROx7pkasrq39Aj0UaEid_qW0Elb-xCM9DpvBkNPVj0dwrpiiDVnuQFzOIu2U5Ly4Mosf3zuWvkAV7QJlCXFUPbt-rFowCyLSXofboeyh2Ou5T1g_pLLjLUSWFKZTzAjBvP" 
            alt="Tutor" 
            className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute bottom-32 left-4 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-medium">
            Mr. Johnson
        </div>
      </div>

      {/* Self View (PIP) */}
      <div className="absolute top-20 right-4 w-32 h-48 bg-gray-800 rounded-xl overflow-hidden shadow-lg border-2 border-white/20 z-10">
         <div className="w-full h-full bg-slate-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-slate-500">person</span>
         </div>
      </div>

      {/* Controls */}
      <div className="bg-[#1c2333] p-6 pb-8 rounded-t-3xl flex items-center justify-center gap-6">
        <button 
            onClick={() => setMicOn(!micOn)}
            className={`p-4 rounded-full transition-all ${micOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white text-black'}`}
        >
            <span className="material-symbols-outlined text-2xl">{micOn ? 'mic' : 'mic_off'}</span>
        </button>
        
        <button 
            onClick={() => setVideoOn(!videoOn)}
            className={`p-4 rounded-full transition-all ${videoOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white text-black'}`}
        >
            <span className="material-symbols-outlined text-2xl">{videoOn ? 'videocam' : 'videocam_off'}</span>
        </button>

        <button className="p-4 rounded-full bg-white/10 text-white hover:bg-white/20">
            <span className="material-symbols-outlined text-2xl">chat</span>
        </button>

        <button onClick={onLeave} className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30">
            <span className="material-symbols-outlined text-2xl">call_end</span>
        </button>
      </div>
    </div>
  );
};