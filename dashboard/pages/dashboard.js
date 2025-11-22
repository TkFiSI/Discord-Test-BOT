import { getSession, useSession } from "next-auth/react";

export default function Dashboard({ guilds }) {
  const { data: session } = useSession();
  return (
    <main style={{padding:24}}>
      <h1>Gildenauswahl</h1>
      {!session && <p>Bitte zuerst auf der Startseite einloggen.</p>}
      {session && (
        <ul style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))',gap:12,marginTop:16}}>
          {guilds?.map(g => (
            <li key={g.id} style={{border:'1px solid #e5e7eb',borderRadius:8,padding:12}}>
              <div style={{fontWeight:600}}>{g.name}</div>
              <div style={{fontSize:12,color:'#6b7280'}}>ID: {g.id}</div>
              <a href={`/guild/${g.id}`} style={{display:'inline-block',marginTop:8,padding:'6px 10px',border:'1px solid #ccc',borderRadius:8}}>Konfigurieren</a>
            </li>
          ))}
        </ul>
      )}
    </main>
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
