/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import { motion, AnimatePresence } from 'motion/react';
import { useMusicPlayer } from './hooks/useMusicPlayer';
import { Play, Pause, SkipForward, SkipBack, Music, Terminal, Radio } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const music = useMusicPlayer();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-screen h-screen bg-[#050510] text-[#00fff9] flex flex-col font-cryptic overflow-hidden relative selection:bg-[#ff00c1]/40">
      {/* Glitch Infrastructure */}
      <div className="static-noise animate-noise"></div>
      <div className="crt-overlay"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,0,193,0.1),transparent_80%)] pointer-events-none"></div>

      {/* Navigation */}
      <nav className="h-16 border-b border-[#00fff9]/20 flex items-center justify-between px-8 bg-black/80 backdrop-blur-sm z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#ff00c1] rounded-none shadow-[0_0_20px_rgba(255,0,193,0.8)] rotate-0 flex items-center justify-center animate-glitch">
            <div className="w-2 h-6 bg-black"></div>
          </div>
          <span className="font-digital tracking-normal text-3xl uppercase animate-glitch">DATA<span className="text-[#ff00c1]">HARVESTER</span></span>
        </div>
        
        <div className="hidden md:flex gap-12 text-xs font-bold tracking-[0.4em] uppercase text-[#00fff9]/40">
          <span className="text-[#ff00c1] cursor-wait animate-pulse">TERMINAL:ACTIVE</span>
          <span className="hover:text-white transition-colors cursor-crosshair">SYNTH:V2.4</span>
          <span className="hover:text-white transition-colors cursor-help">NEURAL:LINK</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] uppercase text-[#ff00c1]/60 leading-none font-bold tracking-widest animate-glitch">PACKETS_COLLECTED</p>
            <p className="text-4xl font-digital text-[#00fff9] animate-glitch drop-shadow-[0_0_15px_rgba(0,255,249,0.5)] tabular-nums">
                {score.toString().padStart(8, '0')}
            </p>
          </div>
          <div className="w-10 h-10 border border-[#ff00c1]/40 bg-black flex items-center justify-center overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-[#ff00c1] animate-scanline"></div>
            <Radio className="w-6 h-6 text-[#ff00c1] z-10 animate-glitch" />
          </div>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 border-r border-[#00fff9]/10 bg-black/60 p-6 flex flex-col gap-6 z-30">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-[#00fff9]/20 pb-2">
                <h3 className="text-[10px] uppercase tracking-widest text-[#00fff9]/60 font-bold italic">AUDIO_MANIFEST</h3>
                <Terminal className="w-4 h-4 text-[#ff00c1]" />
            </div>
            <div className="space-y-2 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {music.tracks.map((track, idx) => (
                <button 
                  key={track.id}
                  onClick={() => {
                      music.setCurrentTrackIndex(idx);
                      music.setProgress(0);
                      music.setIsPlaying(true);
                  }}
                  className={`w-full p-3 rounded-none text-left transition-all border flex items-center gap-3 group ${idx === music.currentTrackIndex ? 'bg-[#ff00c1]/10 border-[#ff00c1]/50' : 'hover:bg-[#00fff9]/5 border-transparent'}`}
                >
                  <div className={`w-3 h-3 ${idx === music.currentTrackIndex ? 'bg-[#ff00c1] animate-glitch' : 'border border-[#00fff9]/30'}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-digital truncate ${idx === music.currentTrackIndex ? 'text-[#ff00c1]' : 'text-[#00fff9]/70'}`}>{track.title.toUpperCase()}</p>
                    <p className="text-[10px] text-[#00fff9]/30 font-mono">SECTOR_{idx+1}:808</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-auto p-4 border border-[#ff00c1]/30 bg-black group relative overflow-hidden">
            <div className="absolute inset-0 bg-[#ff00c1]/5 animate-pulse"></div>
            <p className="text-[10px] uppercase tracking-widest text-[#ff00c1] mb-2 font-black">LOG:PROTOCOL</p>
            <p className="text-[11px] text-[#00fff9]/60 leading-tight font-mono border-l-2 border-[#ff00c1] pl-3">
                SYSTEM: HARVEST_REQUIRED // WALLS: TERMINAL // COLLISION: FATAL
            </p>
          </div>
        </aside>

        {/* Main Game Area */}
        <main className="flex-1 bg-black flex items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none animate-noise" style={{ backgroundImage: 'radial-gradient(#ff00c1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          
          <motion.div 
            className="z-10 animate-tear"
          >
            <SnakeGame onScoreUpdate={setScore} />
          </motion.div>
        </main>
      </div>

      {/* Footer Player */}
      <footer className="h-24 bg-black border-t border-[#ff00c1]/30 flex items-center px-8 gap-12 z-50">
        <div className="flex items-center gap-4 w-64">
          <div className="relative w-12 h-12 bg-black border border-[#00fff9]/20 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[#00fff9]/10 animate-noise"></div>
            <div className="w-8 h-8 bg-[#ff00c1] z-10 shadow-[0_0_20px_rgba(255,0,193,0.6)] animate-glitch"></div>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-digital text-[#00fff9] truncate animate-glitch">{music.currentTrack.title.toUpperCase()}</p>
            <p className="text-[10px] text-[#ff00c1]/60 font-mono italic truncate">AUTHOR: {music.currentTrack.artist.toUpperCase()}</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center gap-3">
          <div className="flex items-center gap-12">
            <button onClick={music.handlePrev} className="text-[#00fff9]/40 hover:text-[#00fff9] transition-all hover:scale-110 active:skew-x-12">
              <SkipBack className="w-6 h-6" />
            </button>
            <button 
                onClick={() => music.setIsPlaying(!music.isPlaying)}
                className="w-14 h-14 bg-[#00fff9] text-black rounded-none flex items-center justify-center hover:bg-[#ff00c1] hover:text-white transition-all shadow-[0_0_30px_rgba(0,255,249,0.4)] animate-glitch"
            >
              {music.isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
            </button>
            <button onClick={music.handleNext} className="text-[#00fff9]/40 hover:text-[#00fff9] transition-all hover:scale-110 active:-skew-x-12">
              <SkipForward className="w-6 h-6" />
            </button>
          </div>
          <div className="w-full flex items-center gap-4 max-w-2xl">
            <span className="text-[10px] font-digital text-[#ff00c1] w-12">{formatTime(music.progress)}</span>
            <div className="flex-1 h-3 bg-[#00fff9]/10 border border-[#00fff9]/20 relative overflow-hidden">
              <motion.div 
                initial={false}
                animate={{ width: `${(music.progress / music.currentTrack.duration) * 100}%` }}
                className="absolute top-0 left-0 h-full bg-[#ff00c1] shadow-[0_0_15px_rgba(255,0,193,1)]" 
              />
            </div>
            <span className="text-[10px] font-digital text-[#00fff9] w-12">{formatTime(music.currentTrack.duration)}</span>
          </div>
        </div>

        <div className="w-64 flex justify-end items-center gap-4">
           <Music className="w-5 h-5 text-[#ff00c1] animate-pulse" />
           <div className="w-32 h-2 bg-black border border-[#00fff9]/20 relative overflow-hidden group">
              <div className="absolute top-0 left-0 h-full w-[80%] bg-[#00fff9]/30 group-hover:bg-[#ff00c1] transition-colors"></div>
           </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: black; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ff00c1; }
      `}} />
    </div>
  );
}
