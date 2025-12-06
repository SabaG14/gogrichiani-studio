
import React from 'react';
import { Mail } from 'lucide-react';
import { CONTACT_EMAIL, DISCORD_LINK, SOUNDCLOUD_LINK } from '../../constants';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-black pt-16 pb-8">
      <div className="container mx-auto px-6 text-center">
        <h2 className="font-orbitron text-3xl md:text-5xl mb-8">
          INITIALIZE <span className="text-fuchsia-500">CONTACT</span>
        </h2>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-16">
          <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400 transition-all group rounded-sm w-full md:w-auto justify-center">
            <Mail className="text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="font-mono text-lg">{CONTACT_EMAIL}</span>
          </a>
        </div>

        <div className="flex justify-center gap-12 mb-12">
          <SocialButton href={DISCORD_LINK} label="Discord" letter="D" color="fuchsia" />
          <SocialButton href={SOUNDCLOUD_LINK} label="SoundCloud" letter="S" color="orange" />
        </div>

        <div className="text-gray-800 font-mono text-xs">
          <p>© 2024 GOGRICHIANI. ALL RIGHTS RESERVED.</p>
          <p className="mt-2">SYSTEM VERSION 2.4.1</p>
        </div>
      </div>
    </footer>
  );
};

// Helper component for local use
const SocialButton: React.FC<{ href: string; label: string; letter: string; color: 'fuchsia' | 'orange' }> = ({ href, label, letter, color }) => {
    const borderColor = color === 'fuchsia' ? 'group-hover:border-fuchsia-500' : 'group-hover:border-orange-500';
    const shadowColor = color === 'fuchsia' ? 'group-hover:shadow-[0_0_15px_#d946ef]' : 'group-hover:shadow-[0_0_15px_#f97316]';
    
    return (
        <a href={href} target="_blank" rel="noreferrer" className="group flex flex-col items-center gap-2 text-gray-500 hover:text-white transition-colors">
            <div className={`w-12 h-12 rounded-full border border-gray-700 ${borderColor} flex items-center justify-center ${shadowColor} transition-all`}>
                <span className="font-bold text-xl">{letter}</span>
            </div>
            <span className="text-xs tracking-widest uppercase">{label}</span>
        </a>
    )
}
