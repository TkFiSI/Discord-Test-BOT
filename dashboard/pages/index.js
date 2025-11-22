import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  return (
    <main style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',gap:16,padding:24}}>
      <img src="/logo.png" alt="Logo" style={{width:160,height:'auto'}} />
      <h1 style={{fontSize:28,fontWeight:700}}>Discord Bot Dashboard</h1>
      {!session && !loading && (
        <>
          <p>Bitte melde dich mit Discord an.</p>
          <button onClick={() => signIn('discord')} style={{padding:'8px 14px',border:'1px solid #ccc',borderRadius:8,cursor:'pointer'}}>Mit Discord einloggen</button>
        </>
      )}
      {session && (
        <>
          <p>Eingeloggt als {session.user?.name}</p>
          <div style={{display:'flex',gap:12}}>
            <a href="/dashboard" style={{padding:'8px 14px',border:'1px solid #ccc',borderRadius:8}}>Zur Gildenauswahl</a>
            <button onClick={() => signOut()} style={{padding:'8px 14px',border:'1px solid #ccc',borderRadius:8,cursor:'pointer'}}>Logout</button>
          </div>
        </>
      )}
    </main>
  );
}
