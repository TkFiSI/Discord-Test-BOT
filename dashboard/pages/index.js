import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from 'react';

export default function Home() {
  const { data: session, status } = useSession();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
      {/* Background effects (kleiner und dezenter) */}
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="absolute inset-0">
        <div className="absolute top-16 left-8 w-36 h-36 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-15"></div>
        <div className="absolute top-32 right-8 w-44 h-44 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-15"></div>
        <div className="absolute -bottom-6 left-24 w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-15"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-2">
        <div className="text-center max-w-2xl mx-auto fade-in">
          {/* Logo */}
          <div className="mb-1.5">
            <img 
              src="/logo.png" 
              alt="Discord Bot Logo" 
              className="w-3 h-3 mx-auto mb-1 rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Title */}
          <h1 className="text-sm font-bold text-white mb-0.5 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent tracking-tight">
            Discord Bot Dashboard
          </h1>
          
          <p className="text-[11px] text-gray-300 mb-2 max-w-xl mx-auto leading-snug">
            Professionelle Server-Verwaltung
          </p>

          {!session && (
            <div className="space-y-1.5">
              <div className="bg-gray-800 bg-opacity-60 backdrop-blur-lg rounded-lg p-1.5 border border-gray-700">
                <h2 className="text-xs font-semibold text-white mb-0.5">Willkommen zurück!</h2>
                <p className="text-gray-300 mb-1.5 text-[11px] leading-snug">
                  Melde dich mit Discord an, um deine Server zu verwalten.
                </p>
                <button
                  onClick={() => signIn('discord')}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="btn-primary w-full sm:w-auto px-1.5 py-0.5 text-[11px] font-semibold flex items-center justify-center gap-1 mx-auto"
                >
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418z"/>
                  </svg>
                  Mit Discord einloggen
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 mt-1.5">
                <div className="card p-1.5">
                  <div className="w-3 h-3 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center mb-0.5">
                    <svg className="w-1.5 h-1.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <h3 className="text-[11px] font-semibold text-white mb-0.5">Auto-Moderation</h3>
                  <p className="text-gray-400 text-[10px]">Intelligente Moderation</p>
                </div>

                <div className="card p-1.5">
                  <div className="w-3 h-3 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center mb-0.5">
                    <svg className="w-1.5 h-1.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                  </div>
                  <h3 className="text-[11px] font-semibold text-white mb-0.5">Welcome System</h3>
                  <p className="text-gray-400 text-[10px]">Automatische Begrüßung</p>
                </div>

                <div className="card p-1.5">
                  <div className="w-3 h-3 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center mb-0.5">
                    <svg className="w-1.5 h-1.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                  </div>
                  <h3 className="text-[11px] font-semibold text-white mb-0.5">Analytics</h3>
                  <p className="text-gray-400 text-[10px]">Detaillierte Statistiken</p>
                </div>
              </div>
            </div>
          )}

          {session && (
            <div className="space-y-1.5 fade-in">
              <div className="bg-gray-800 bg-opacity-60 backdrop-blur-lg rounded-lg p-1.5 border border-gray-700">
                <div className="flex items-center gap-1.5 mb-1.5">
                  {session.user?.image && (
                    <img 
                      src={session.user.image} 
                      alt={session.user.name}
                      className="w-3 h-3 rounded-full border border-blue-500"
                    />
                  )}
                  <div>
                    <h2 className="text-xs font-semibold text-white">
                      Willkommen zurück, {session.user?.name}!
                    </h2>
                    <p className="text-gray-300 text-[11px]">Bereit deine Server zu verwalten?</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-1">
                  <a href="/dashboard" className="btn-primary flex items-center justify-center gap-1 py-0.5 px-1.5 text-[11px]">
                    <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                    </svg>
                    Server-Übersicht
                  </a>
                  <button 
                    onClick={() => signOut()}
                    className="btn-secondary flex items-center justify-center gap-1 py-0.5 px-1.5 text-[11px]"
                  >
                    <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
