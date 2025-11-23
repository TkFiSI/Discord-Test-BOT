import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-3">
      <div className="w-full max-w-sm bg-gray-900/90 border border-gray-800 rounded-2xl shadow-xl p-3 space-y-2">
        {/* Logo & Titel */}
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Discord Bot Logo"
            className="w-4 h-4 rounded-lg"
          />
          <div>
            <h1 className="text-sm font-semibold text-white leading-tight">Discord Bot Dashboard</h1>
            <p className="text-[11px] text-gray-400">Kleine, schnelle Server-Verwaltung</p>
          </div>
        </div>

        {/* Inhalt */}
        {!session && (
          <div className="space-y-2">
            <div className="bg-gray-800/80 rounded-xl p-2 border border-gray-700">
              <p className="text-[11px] text-gray-300 mb-1">
                Melde dich mit Discord an, um deine Server kompakt im Dashboard zu verwalten.
              </p>
              <button
                onClick={() => signIn("discord")}
                className="btn-primary w-full px-2 py-1 text-[11px] font-semibold flex items-center justify-center gap-1"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418z" />
                </svg>
                Mit Discord einloggen
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1 text-left text-[10px] text-gray-300">
              <div className="bg-gray-800/60 rounded-lg p-1">
                <p className="font-semibold text-[10px] text-white">Auto-Mod</p>
                <p className="text-[10px] text-gray-400">Spam & Filter</p>
              </div>
              <div className="bg-gray-800/60 rounded-lg p-1">
                <p className="font-semibold text-[10px] text-white">Welcome</p>
                <p className="text-[10px] text-gray-400">Begrüßungen</p>
              </div>
              <div className="bg-gray-800/60 rounded-lg p-1">
                <p className="font-semibold text-[10px] text-white">Logs</p>
                <p className="text-[10px] text-gray-400">Übersicht</p>
              </div>
            </div>
          </div>
        )}

        {session && (
          <div className="space-y-2">
            <div className="bg-gray-800/80 rounded-xl p-2 border border-gray-700 flex items-center gap-2">
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name}
                  className="w-5 h-5 rounded-full border border-blue-500"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  Willkommen zurück, {session.user?.name}
                </p>
                <p className="text-[11px] text-gray-400 truncate">
                  Öffne dein kompaktes Dashboard, um deine Server zu verwalten.
                </p>
              </div>
            </div>

            <div className="flex gap-1">
              <a
                href="/dashboard"
                className="btn-primary flex-1 flex items-center justify-center gap-1 py-1 px-2 text-[11px]"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a 2 2 0 012 2v6a 2 2 0 01-2 2H5a 2 2 0 01-2-2v-6a 2 2 0 012-2m14 0V9a 2 2 0 00-2-2M5 11V9a 2 2 0 012-2m0 0V5a 2 2 0 012-2h6a 2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                Dashboard öffnen
              </a>
              <button
                onClick={() => signOut()}
                className="btn-secondary flex items-center justify-center gap-1 py-1 px-2 text-[11px]"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a 3 3 0 01-3 3H6a 3 3 0 01-3-3V7a 3 3 0 013-3h4a 3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
