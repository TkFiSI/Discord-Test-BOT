import { getSession, useSession } from "next-auth/react";
import { useState } from "react";

export default function Dashboard({ guilds }) {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGuilds = guilds?.filter((guild) =>
    guild.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-3">
        <div className="max-w-sm w-full bg-gray-900/90 border border-gray-800 rounded-2xl p-3 text-center space-y-2">
          <h1 className="text-sm font-semibold text-white">Bitte einloggen</h1>
          <p className="text-[11px] text-gray-400">
            Du musst dich zuerst einloggen, um auf das Dashboard zugreifen zu können.
          </p>
          <a
            href="/"
            className="btn-primary inline-flex items-center justify-center px-2 py-1 text-[11px] gap-1"
          >
            Zur Startseite
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Header */}
      <header className="bg-gray-900/90 border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-3 h-9 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <img src="/logo.png" alt="Logo" className="w-4 h-4 rounded-lg" />
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-white leading-tight truncate">
                Deine Server
              </h1>
              <p className="text-[10px] text-gray-400 truncate">
                Kompakte Übersicht deiner Discord-Guilds
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Server suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 text-white px-2 py-1 pl-5 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 w-32 text-[11px]"
              />
              <svg
                className="absolute left-1 top-1.5 w-3 h-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {session.user?.image && (
              <img
                src={session.user.image}
                alt={session.user.name}
                className="w-5 h-5 rounded-full border border-blue-500"
              />
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-3 py-3 space-y-2">
        {filteredGuilds?.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-xs text-gray-400">
              {searchTerm
                ? "Keine Server gefunden. Bitte Suchbegriff anpassen."
                : "Noch keine Server verfügbar. Lade den Bot auf deine Server ein."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {filteredGuilds.map((guild) => (
              <div
                key={guild.id}
                className="bg-gray-900/80 border border-gray-800 rounded-xl p-2 flex flex-col items-center text-center gap-1 hover:border-blue-500/70 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center mb-1 overflow-hidden">
                  {guild.icon ? (
                    <img
                      src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                      alt={guild.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[11px] font-semibold text-white">
                      {guild.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <p
                  className="text-[11px] font-medium text-white truncate w-full"
                  title={guild.name}
                >
                  {guild.name}
                </p>

                <a
                  href={`/guild/${guild.id}`}
                  className="mt-0.5 inline-flex items-center justify-center px-2 py-0.5 text-[10px] rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors w-full"
                >
                  Konfigurieren
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return { redirect: { destination: '/', permanent: false } };
  }
  
  // Fetch Discord guilds using the access token from NextAuth session
  const res = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: {
      Authorization: `Bearer ${session.accessToken}`
    }
  });
  const guilds = res.ok ? await res.json() : [];
  
  // For debugging: Show ALL guilds (no permission filter)
  const filteredGuilds = guilds;
  
  console.log('User guilds with manage permissions:', filteredGuilds.length);
  console.log('Bot token available:', !!process.env.DISCORD_TOKEN);
  
  return { props: { guilds: filteredGuilds } };
}
