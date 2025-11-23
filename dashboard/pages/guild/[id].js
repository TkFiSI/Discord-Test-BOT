import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function GuildSettings() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [settings, setSettings] = useState({
    // Logging
    logChannelId: '',
    modLogEnabled: true,
    auditLogEnabled: true,
    
    // Welcome System
    welcomeEnabled: true,
    welcomeMessage: 'Willkommen {user} auf dem Server! 🎉',
    welcomeChannelId: '',
    autoRoles: [],
    
    // Auto-Moderation
    antiSpamEnabled: true,
    antiSpamSensitivity: 'medium',
    antiInviteEnabled: true,
    antiLinkEnabled: false,
    antiCapsEnabled: true,
    capsThreshold: 70,
    
    // Level System
    levelSystemEnabled: true,
    levelUpMessage: '{user} hat Level {level} erreicht! 🎊',
    levelUpChannelId: '',
    
    // Custom Commands
    customCommands: [],
    
    // Reaction Roles
    reactionRoles: [],
    
    // Giveaways
    giveawayChannelId: '',
    
    // Music
    musicDefaultVolume: 50,
    musicAutoLeave: true,
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
          ...settings,
          logChannelId: data.logChannelId || '1397869920401883188',
          modLogEnabled: data.modLogEnabled ?? true,
          auditLogEnabled: data.auditLogEnabled ?? true,
          welcomeEnabled: data.welcomeEnabled ?? true,
          welcomeMessage: data.welcomeMessage || 'Willkommen {user} auf dem Server! 🎉',
          welcomeChannelId: data.welcomeChannelId || '',
          autoRoles: data.autoRoles ? JSON.parse(data.autoRoles) : [],
          antiSpamEnabled: data.antiSpamEnabled ?? true,
          antiSpamSensitivity: data.antiSpamSensitivity || 'medium',
          antiInviteEnabled: data.antiInviteEnabled ?? true,
          antiLinkEnabled: data.antiLinkEnabled ?? false,
          antiCapsEnabled: data.antiCapsEnabled ?? true,
          capsThreshold: data.capsThreshold || 70,
          levelSystemEnabled: data.levelSystemEnabled ?? true,
          levelUpMessage: data.levelUpMessage || '{user} hat Level {level} erreicht! 🎊',
          levelUpChannelId: data.levelUpChannelId || '',
          customCommands: data.customCommands ? JSON.parse(data.customCommands) : [],
          reactionRoles: data.reactionRoles ? JSON.parse(data.reactionRoles) : [],
          giveawayChannelId: data.giveawayChannelId || '',
          musicDefaultVolume: data.musicDefaultVolume || 50,
          musicAutoLeave: data.musicAutoLeave ?? true,
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
        body: JSON.stringify({
          ...settings,
          autoRoles: JSON.stringify(settings.autoRoles),
          customCommands: JSON.stringify(settings.customCommands),
          reactionRoles: JSON.stringify(settings.reactionRoles),
        })
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Laden...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Bitte einloggen</h1>
          <p className="text-gray-300">Du musst eingeloggt sein um diese Seite zu sehen.</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', name: 'Übersicht', icon: '🏠' },
    { id: 'logging', name: 'Logging', icon: '📝' },
    { id: 'welcome', name: 'Welcome', icon: '👋' },
    { id: 'moderation', name: 'Moderation', icon: '🔨' },
    { id: 'levels', name: 'Level System', icon: '⭐' },
    { id: 'commands', name: 'Commands', icon: '⚡' },
    { id: 'reaction', name: 'Reaction Roles', icon: '🎭' },
    { id: 'giveaway', name: 'Giveaways', icon: '🎁' },
    { id: 'music', name: 'Music', icon: '🎵' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Header */}
      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <a href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </a>
              <h1 className="text-xl font-semibold text-white">Server-Einstellungen</h1>
              <span className="text-gray-400">Guild ID: {id}</span>
            </div>
            
            <button
              onClick={saveSettings}
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Speichern...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2"/>
                  </svg>
                  Speichern
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="card">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Server-Übersicht</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="card">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📊</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Status</h3>
                        <p className="text-gray-400">Bot ist online</p>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">✅</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Module</h3>
                        <p className="text-gray-400">8 von 8 aktiv</p>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🎯</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Performance</h3>
                        <p className="text-gray-400">Optimal</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-xl font-semibold text-white mb-4">Schnell-Aktionen</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="btn-secondary">Bot neu starten</button>
                    <button className="btn-secondary">Cache leeren</button>
                    <button className="btn-secondary">Statistiken exportieren</button>
                    <button className="btn-secondary">Backup erstellen</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'logging' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Logging-Einstellungen</h2>
                
                <div className="card">
                  <h3 className="text-lg font-semibold text-white mb-4">Log-Channel</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Log Channel ID
                      </label>
                      <input
                        type="text"
                        value={settings.logChannelId}
                        onChange={(e) => setSettings({ ...settings, logChannelId: e.target.value })}
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                        placeholder="1397869920401883188"
                      />
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-white mb-4">Log-Typen</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Mod-Log</h4>
                        <p className="text-gray-400 text-sm">Aktionen von Moderatoren protokollieren</p>
                      </div>
                      <button
                        onClick={() => setSettings({ ...settings, modLogEnabled: !settings.modLogEnabled })}
                        className={`toggle ${settings.modLogEnabled ? 'active' : ''}`}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Audit-Log</h4>
                        <p className="text-gray-400 text-sm">Server-Änderungen protokollieren</p>
                      </div>
                      <button
                        onClick={() => setSettings({ ...settings, auditLogEnabled: !settings.auditLogEnabled })}
                        className={`toggle ${settings.auditLogEnabled ? 'active' : ''}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'welcome' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Welcome System</h2>
                
                <div className="card">
                  <h3 className="text-lg font-semibold text-white mb-4">Allgemein</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Welcome System</h4>
                        <p className="text-gray-400 text-sm">Neue Mitglieder begrüßen</p>
                      </div>
                      <button
                        onClick={() => setSettings({ ...settings, welcomeEnabled: !settings.welcomeEnabled })}
                        className={`toggle ${settings.welcomeEnabled ? 'active' : ''}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Welcome Channel ID
                      </label>
                      <input
                        type="text"
                        value={settings.welcomeChannelId}
                        onChange={(e) => setSettings({ ...settings, welcomeChannelId: e.target.value })}
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                        placeholder="#welcome"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Welcome Message
                      </label>
                      <textarea
                        value={settings.welcomeMessage}
                        onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 h-32"
                        placeholder="Willkommen {user} auf dem Server! 🎉"
                      />
                      <p className="text-gray-400 text-sm mt-2">
                        Variablen: {'{user}'}, {'{server}'}, {'{count}'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-white mb-4">Auto-Roles</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Auto-Roles (Komma-getrennt)
                      </label>
                      <input
                        type="text"
                        value={settings.autoRoles.join(', ')}
                        onChange={(e) => setSettings({ ...settings, autoRoles: e.target.value.split(',').map(r => r.trim()).filter(r => r) })}
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                        placeholder="123456789, 987654321"
                      />
                      <p className="text-gray-400 text-sm mt-2">
                        Diese Rollen werden neuen Mitgliedern automatisch zugewiesen
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'moderation' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Auto-Moderation</h2>
                
                <div className="card">
                  <h3 className="text-lg font-semibold text-white mb-4">Spam-Schutz</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Anti-Spam</h4>
                        <p className="text-gray-400 text-sm">Automatische Spam-Erkennung</p>
                      </div>
                      <button
                        onClick={() => setSettings({ ...settings, antiSpamEnabled: !settings.antiSpamEnabled })}
                        className={`toggle ${settings.antiSpamEnabled ? 'active' : ''}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Empfindlichkeit
                      </label>
                      <select
                        value={settings.antiSpamSensitivity}
                        onChange={(e) => setSettings({ ...settings, antiSpamSensitivity: e.target.value })}
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                      >
                        <option value="low">Niedrig</option>
                        <option value="medium">Mittel</option>
                        <option value="high">Hoch</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-white mb-4">Content Filter</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Anti-Invite</h4>
                        <p className="text-gray-400 text-sm">Discord-Invites blockieren</p>
                      </div>
                      <button
                        onClick={() => setSettings({ ...settings, antiInviteEnabled: !settings.antiInviteEnabled })}
                        className={`toggle ${settings.antiInviteEnabled ? 'active' : ''}`}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Anti-Link</h4>
                        <p className="text-gray-400 text-sm">Externe Links blockieren</p>
                      </div>
                      <button
                        onClick={() => setSettings({ ...settings, antiLinkEnabled: !settings.antiLinkEnabled })}
                        className={`toggle ${settings.antiLinkEnabled ? 'active' : ''}`}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Anti-Caps</h4>
                        <p className="text-gray-400 text-sm">Großschreibung limitieren</p>
                      </div>
                      <button
                        onClick={() => setSettings({ ...settings, antiCapsEnabled: !settings.antiCapsEnabled })}
                        className={`toggle ${settings.antiCapsEnabled ? 'active' : ''}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Caps Threshold (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={settings.capsThreshold}
                        onChange={(e) => setSettings({ ...settings, capsThreshold: parseInt(e.target.value) })}
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'levels' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Level System</h2>
                
                <div className="card">
                  <h3 className="text-lg font-semibold text-white mb-4">Allgemein</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Level System</h4>
                        <p className="text-gray-400 text-sm">XP für Nachrichten vergeben</p>
                      </div>
                      <button
                        onClick={() => setSettings({ ...settings, levelSystemEnabled: !settings.levelSystemEnabled })}
                        className={`toggle ${settings.levelSystemEnabled ? 'active' : ''}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Level Up Channel ID
                      </label>
                      <input
                        type="text"
                        value={settings.levelUpChannelId}
                        onChange={(e) => setSettings({ ...settings, levelUpChannelId: e.target.value })}
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                        placeholder="#level-ups"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Level Up Message
                      </label>
                      <textarea
                        value={settings.levelUpMessage}
                        onChange={(e) => setSettings({ ...settings, levelUpMessage: e.target.value })}
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 h-32"
                        placeholder="{user} hat Level {level} erreicht! 🎊"
                      />
                      <p className="text-gray-400 text-sm mt-2">
                        Variablen: {'{user}'}, {'{level}'}, {'{xp}'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'commands' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Custom Commands</h2>
                
                <div className="card">
                  <h3 className="text-lg font-semibold text-white mb-4">Commands verwalten</h3>
                  <p className="text-gray-400 mb-4">Bald verfügbar...</p>
                </div>
              </div>
            )}

            {activeTab === 'reaction' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Reaction Roles</h2>
                
                <div className="card">
                  <h3 className="text-lg font-semibold text-white mb-4">Reaction Roles verwalten</h3>
                  <p className="text-gray-400 mb-4">Bald verfügbar...</p>
                </div>
              </div>
            )}

            {activeTab === 'giveaway' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Giveaways</h2>
                
                <div className="card">
                  <h3 className="text-lg font-semibold text-white mb-4">Giveaway Channel</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Giveaway Channel ID
                      </label>
                      <input
                        type="text"
                        value={settings.giveawayChannelId}
                        onChange={(e) => setSettings({ ...settings, giveawayChannelId: e.target.value })}
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                        placeholder="#giveaways"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'music' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Music Settings</h2>
                
                <div className="card">
                  <h3 className="text-lg font-semibold text-white mb-4">Music Einstellungen</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Standard Lautstärke
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.musicDefaultVolume}
                        onChange={(e) => setSettings({ ...settings, musicDefaultVolume: parseInt(e.target.value) })}
                        className="w-full"
                      />
                      <div className="text-center text-white">{settings.musicDefaultVolume}%</div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Auto Leave</h4>
                        <p className="text-gray-400 text-sm">Kanal bei Inaktivität verlassen</p>
                      </div>
                      <button
                        onClick={() => setSettings({ ...settings, musicAutoLeave: !settings.musicAutoLeave })}
                        className={`toggle ${settings.musicAutoLeave ? 'active' : ''}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
