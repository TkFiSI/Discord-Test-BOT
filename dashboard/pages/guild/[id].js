import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function GuildSettings() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    logChannelId: '',
    modLogEnabled: true,
    auditLogEnabled: true,
    autoRoles: '',
    welcomeMessage: '',
    goodbyeMessage: ''
  })

  useEffect(() => {
    if (id && session) {
      fetchSettings()
    }
  }, [id, session])

  const fetchSettings = async () => {
    try {
      const res = await fetch(`/api/guilds/${id}/settings`)
      if (res.ok) {
        const data = await res.json()
        setSettings({
          logChannelId: data.logChannelId || '',
          modLogEnabled: data.modLogEnabled ?? true,
          auditLogEnabled: data.auditLogEnabled ?? true,
          autoRoles: data.autoRoles || '',
          welcomeMessage: data.welcomeMessage || '',
          goodbyeMessage: data.goodbyeMessage || ''
        })
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/guilds/${id}/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      if (res.ok) {
        alert('Einstellungen gespeichert!')
      } else {
        alert('Fehler beim Speichern')
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Fehler beim Speichern')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return <div style={{ padding: 24 }}>Laden...</div>
  }

  if (!session) {
    return <div style={{ padding: 24 }}>Bitte einloggen</div>
  }

  return (
    <main style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h1>Server-Einstellungen</h1>
      <p>Guild ID: {id}</p>

      <div style={{ marginTop: 32 }}>
        <h2>Logging</h2>
        
        <div style={{ marginBottom: 16 }}>
          <label>
            Log Channel ID:
            <input
              type="text"
              value={settings.logChannelId}
              onChange={(e) => setSettings({ ...settings, logChannelId: e.target.value })}
              style={{ marginLeft: 8, padding: 4, width: 200 }}
              placeholder="1397869920401883188"
            />
          </label>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>
            <input
              type="checkbox"
              checked={settings.modLogEnabled}
              onChange={(e) => setSettings({ ...settings, modLogEnabled: e.target.checked })}
              style={{ marginRight: 8 }}
            />
            Mod-Log aktivieren
          </label>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>
            <input
              type="checkbox"
              checked={settings.auditLogEnabled}
              onChange={(e) => setSettings({ ...settings, auditLogEnabled: e.target.checked })}
              style={{ marginRight: 8 }}
            />
            Audit-Log aktivieren
          </label>
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <h2>Auto-Roles</h2>
        <div style={{ marginBottom: 16 }}>
          <label>
            Rollen-IDs (komma-getrennt):
            <input
              type="text"
              value={settings.autoRoles}
              onChange={(e) => setSettings({ ...settings, autoRoles: e.target.value })}
              style={{ marginLeft: 8, padding: 4, width: 300 }}
              placeholder="123456789,987654321"
            />
          </label>
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <h2>Nachrichten</h2>
        <div style={{ marginBottom: 16 }}>
          <label>
            Willkommensnachricht:
            <textarea
              value={settings.welcomeMessage}
              onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
              style={{ marginLeft: 8, padding: 4, width: 400, height: 80 }}
              placeholder="Willkommen {user} auf dem Server!"
            />
          </label>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>
            Abschiedsnachricht:
            <textarea
              value={settings.goodbyeMessage}
              onChange={(e) => setSettings({ ...settings, goodbyeMessage: e.target.value })}
              style={{ marginLeft: 8, padding: 4, width: 400, height: 80 }}
              placeholder="Auf Wiedersehen {user}!"
            />
          </label>
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <button
          onClick={saveSettings}
          disabled={saving}
          style={{
            padding: '12px 24px',
            backgroundColor: '#5865F2',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: saving ? 'not-allowed' : 'pointer',
            fontSize: 16
          }}
        >
          {saving ? 'Speichern...' : 'Speichern'}
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <a href="/dashboard" style={{ color: '#5865F2', textDecoration: 'none' }}>
          ← Zurück zur Gildenauswahl
        </a>
      </div>
    </main>
  )
}
