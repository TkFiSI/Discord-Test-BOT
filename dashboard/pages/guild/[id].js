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
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
          <div className="flex items-center justify-between h-8">
            <div className="flex items-center gap-2">
              <a href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </a>
              <h1 className="text-sm font-semibold text-white">Server-Einstellungen</h1>
              <span className="text-gray-400 text-xs">Guild ID: {id}</span>
            </div>
            
            <button
              onClick={saveSettings}
              disabled={saving}
              className="btn-primary flex items-center gap-1 py-1 px-2 text-xs"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-2 w-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Speichern...
                </>
              ) : (
                <>
                  <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2"/>
                  </svg>
                  Speichern
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-2">
        <div className="flex gap-2">
          {/* Sidebar */}
          <div className="w-12 flex-shrink-0">
            <div className="card p-1">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex flex-col items-center px-1 py-1 text-left rounded-lg transition-colors text-xs ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                    title={tab.name}
                  >
                    <span className="text-xs">{tab.icon}</span>
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="card p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                        <span className="text-lg">📊</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">Status</h3>
                        <p className="text-gray-400 text-xs">Bot online</p>
                      </div>
                    </div>
                  </div>

                  <div className="card p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                        <span className="text-lg">✅</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">Module</h3>
                        <p className="text-gray-400 text-xs">8 aktiv</p>
                      </div>
                    </div>
                  </div>

                  <div className="card p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                        <span className="text-lg">🎯</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">Performance</h3>
                        <p className="text-gray-400 text-xs">Optimal</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Schnell-Aktionen</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <button className="btn-secondary py-2 px-3 text-sm">Bot neustarten</button>
                    <button className="btn-secondary py-2 px-3 text-sm">Cache leeren</button>
                    <button className="btn-secondary py-2 px-3 text-sm">Export</button>
                    <button className="btn-secondary py-2 px-3 text-sm">Backup</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'logging' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-4">Logging</h2>
                
                <div className="card p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Log Channel ID
                      </label>
                      <input
                        type="text"
                        value={settings.logChannelId}
                        onChange={(e) => setSettings({ ...settings, logChannelId: e.target.value })}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 text-sm"
                        placeholder="1397869920401883188"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm">Mod-Log</span>
                        <button
                          onClick={() => setSettings({ ...settings, modLogEnabled: !settings.modLogEnabled })}
                          className={`toggle ${settings.modLogEnabled ? 'active' : ''}`}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm">Audit-Log</span>
                        <button
                          onClick={() => setSettings({ ...settings, auditLogEnabled: !settings.auditLogEnabled })}
                          className={`toggle ${settings.auditLogEnabled ? 'active' : ''}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'welcome' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-4">Welcome System</h2>
                
                <div className="card p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm">Welcome System</span>
                      <button
                        onClick={() => setSettings({ ...settings, welcomeEnabled: !settings.welcomeEnabled })}
                        className={`toggle ${settings.welcomeEnabled ? 'active' : ''}`}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Welcome Channel ID
                        </label>
                        <input
                          type="text"
                          value={settings.welcomeChannelId}
                          onChange={(e) => setSettings({ ...settings, welcomeChannelId: e.target.value })}
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 text-sm"
                          placeholder="#welcome"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Auto-Roles
                        </label>
                        <input
                          type="text"
                          value={settings.autoRoles.join(', ')}
                          onChange={(e) => setSettings({ ...settings, autoRoles: e.target.value.split(',').map(r => r.trim()).filter(r => r) })}
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 text-sm"
                          placeholder="123456789, 987654321"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Welcome Message
                      </label>
                      <textarea
                        value={settings.welcomeMessage}
                        onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 h-20 text-sm"
                        placeholder="Willkommen {user} auf dem Server! 🎉"
                      />
                      <p className="text-gray-400 text-xs mt-1">
                        Variablen: {'{user}'}, {'{server}'}, {'{count}'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'moderation' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-4">Auto-Moderation</h2>
                
                <div className="card p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Anti-Spam Empfindlichkeit
                      </label>
                      <select
                        value={settings.antiSpamSensitivity}
                        onChange={(e) => setSettings({ ...settings, antiSpamSensitivity: e.target.value })}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 text-sm"
                      >
                        <option value="low">Niedrig</option>
                        <option value="medium">Mittel</option>
                        <option value="high">Hoch</option>
                      </select>
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
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-xs">Anti-Spam</span>
                      <button
                        onClick={() => setSettings({ ...settings, antiSpamEnabled: !settings.antiSpamEnabled })}
                        className={`toggle ${settings.antiSpamEnabled ? 'active' : ''}`}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white text-xs">Anti-Invite</span>
                      <button
                        onClick={() => setSettings({ ...settings, antiInviteEnabled: !settings.antiInviteEnabled })}
                        className={`toggle ${settings.antiInviteEnabled ? 'active' : ''}`}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white text-xs">Anti-Link</span>
                      <button
                        onClick={() => setSettings({ ...settings, antiLinkEnabled: !settings.antiLinkEnabled })}
                        className={`toggle ${settings.antiLinkEnabled ? 'active' : ''}`}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white text-xs">Anti-Caps</span>
                      <button
                        onClick={() => setSettings({ ...settings, antiCapsEnabled: !settings.antiCapsEnabled })}
                        className={`toggle ${settings.antiCapsEnabled ? 'active' : ''}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'levels' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-4">Level System</h2>
                
                <div className="card p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm">Level System</span>
                      <button
                        onClick={() => setSettings({ ...settings, levelSystemEnabled: !settings.levelSystemEnabled })}
                        className={`toggle ${settings.levelSystemEnabled ? 'active' : ''}`}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Level Up Channel ID
                        </label>
                        <input
                          type="text"
                          value={settings.levelUpChannelId}
                          onChange={(e) => setSettings({ ...settings, levelUpChannelId: e.target.value })}
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 text-sm"
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
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 h-20 text-sm"
                          placeholder="{user} hat Level {level} erreicht! 🎊"
                        />
                        <p className="text-gray-400 text-xs mt-1">
                          Variablen: {'{user}'}, {'{level}'}, {'{xp}'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'commands' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-4">Custom Commands</h2>
                <div className="card p-4">
                  <p className="text-gray-400 text-sm">Bald verfügbar...</p>
                </div>
              </div>
            )}

            {activeTab === 'reaction' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-4">Reaction Roles</h2>
                <div className="card p-4">
                  <p className="text-gray-400 text-sm">Bald verfügbar...</p>
                </div>
              </div>
            )}

            {activeTab === 'giveaway' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-4">Giveaways</h2>
                <div className="card p-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Giveaway Channel ID
                    </label>
                    <input
                      type="text"
                      value={settings.giveawayChannelId}
                      onChange={(e) => setSettings({ ...settings, giveawayChannelId: e.target.value })}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 text-sm"
                      placeholder="#giveaways"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'music' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-4">Music Settings</h2>
                <div className="card p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Standard Lautstärke: {settings.musicDefaultVolume}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.musicDefaultVolume}
                        onChange={(e) => setSettings({ ...settings, musicDefaultVolume: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm">Auto Leave</span>
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
