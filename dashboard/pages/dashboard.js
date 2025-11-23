import { getSession, useSession } from "next-auth/react";
import { useState } from 'react';

export default function Dashboard({ guilds }) {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredGuilds = guilds?.filter(guild => 
    guild.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Bitte einloggen</h1>
          <p className="text-gray-300">Du musst dich zuerst einloggen um auf die Dashboard zugreifen zu können.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Header */}
      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-6 h-6 rounded-lg" />
              <h1 className="text-lg font-semibold text-white">Server-Übersicht</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Server suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-700 text-white px-3 py-1 pl-8 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 w-48 text-sm"
                />
                <svg className="absolute left-2 top-1.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              
              {session.user?.image && (
                <img 
                  src={session.user.image} 
                  alt={session.user.name}
                  className="w-8 h-8 rounded-full border-2 border-blue-500"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white mb-1">Deine Server</h2>
          <p className="text-gray-300 text-sm">Verwalte deine Discord Server mit professionellen Tools</p>
        </div>

        {filteredGuilds?.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
              <h3 className="text-lg font-semibold text-white mb-2">
                {searchTerm ? 'Keine Server gefunden' : 'Keine Server verfügbar'}
              </h3>
              <p className="text-gray-400 text-sm">
                {searchTerm ? 'Versuche einen anderen Suchbegriff' : 'Lade den Bot auf deinen Server um ihn hier zu sehen'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
            {filteredGuilds?.map((guild) => (
              <div key={guild.id} className="card hover:scale-105 transition-all duration-300 p-2">
                <div className="flex flex-col items-center text-center">
                  {/* Server Icon */}
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-1 shadow-lg">
                    {guild.icon ? (
                      <img 
                        src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                        alt={guild.name}
                        className="w-full h-full rounded-full"
                      />
                    ) : (
                      <span className="text-xs font-bold text-white">
                        {guild.name.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Server Info */}
                  <h3 className="text-xs font-semibold text-white mb-1 truncate w-full">
                    {guild.name}
                  </h3>

                  {/* Action Button */}
                  <a 
                    href={`/guild/${guild.id}`}
                    className="btn-primary w-full flex items-center justify-center gap-1 py-1 px-1 text-xs"
                  >
                    <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{guilds?.length || 0}</h3>
                <p className="text-gray-400 text-xs">Gesamte Server</p>
              </div>
            </div>
          </div>

          <div className="card p-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Aktiv</h3>
                <p className="text-gray-400 text-xs">Bot Status</p>
              </div>
            </div>
          </div>

          <div className="card p-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">24/7</h3>
                <p className="text-gray-400 text-xs">Uptime</p>
              </div>
            </div>
          </div>
        </div>
      </div>
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
