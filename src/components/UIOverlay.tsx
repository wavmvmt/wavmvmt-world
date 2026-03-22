'use client'

import { useState, useEffect } from 'react'
import { HUD } from './HUD'
import { Minimap } from './Minimap'
import { FPSCounter } from './FPSCounter'
import { SettingsPanel } from './SettingsPanel'
import { TimelapseMode } from './TimelapsMode'
import { SuggestionBox } from './SuggestionBox'
import { AchievementTracker } from './AchievementTracker'
import { WelcomeTour } from './WelcomeTour'
import { PhotoMode } from './PhotoMode'
import { CompletionReward } from './CompletionReward'
import { KeyboardHelp } from './KeyboardHelp'
import { ParkourTimer } from './ParkourTimer'
import { QuestTracker } from './QuestTracker'
import { VisitorLogger } from './VisitorLogger'
import { EmojiReactions } from './EmojiReactions'
import { GuestBook } from './GuestBook'
import { FullscreenToggle } from './FullscreenToggle'
import { RoomNotification } from './RoomNotification'
import { BuildLog } from './BuildLog'
import { ShareCard } from './ShareCard'
import { SessionSummary } from './SessionSummary'

const menuStyle = {
  background: 'rgba(26,21,32,0.85)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,200,120,0.12)',
  boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
}

/**
 * UI Overlay — handles mobile vs desktop layout.
 * On mobile: most tools hidden behind a "Menu" button to prevent clutter.
 * On desktop: everything visible as before.
 */
export function UIOverlay() {
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <>
      {/* === ALWAYS VISIBLE === */}
      <HUD />
      <QuestTracker />
      <RoomNotification />
      <ParkourTimer />
      <PhotoMode />
      <CompletionReward />
      <WelcomeTour />
      <VisitorLogger />
      <SessionSummary />
      <KeyboardHelp />
      <ShareCard />

      {/* === DESKTOP: show everything === */}
      {!isMobile && (
        <>
          <Minimap />
          <FPSCounter />
          <SettingsPanel />
          <FullscreenToggle />
          <TimelapseMode />
          <SuggestionBox />
          <AchievementTracker />
          <EmojiReactions />
          <GuestBook />
          <BuildLog />
        </>
      )}

      {/* === MOBILE: menu button for extra tools === */}
      {isMobile && !menuOpen && (
        <button
          onClick={() => setMenuOpen(true)}
          className="fixed top-14 right-3 pointer-events-auto z-20 px-3 py-1.5 rounded-xl text-[0.55rem] tracking-wider uppercase cursor-pointer"
          style={{ ...menuStyle, color: 'rgba(255,220,180,0.5)' }}
        >
          Menu
        </button>
      )}

      {/* Mobile menu overlay */}
      {isMobile && menuOpen && (
        <div className="fixed inset-0 z-40 pointer-events-auto" onClick={() => setMenuOpen(false)}>
          <div className="absolute top-12 right-3 left-3 p-4 rounded-2xl" style={menuStyle}
            onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[0.6rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,220,180,0.4)' }}>
                Tools
              </span>
              <button onClick={() => setMenuOpen(false)} className="text-sm cursor-pointer" style={{ color: 'rgba(255,220,180,0.3)' }}>×</button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Map', action: () => { setMenuOpen(false); /* minimap handled separately */ } },
                { label: 'Suggest', action: () => { setMenuOpen(false) } },
                { label: 'Guest Book', action: () => { setMenuOpen(false) } },
                { label: 'Build Log', action: () => { setMenuOpen(false) } },
                { label: 'Timelapse', action: () => { setMenuOpen(false) } },
                { label: 'Emojis', action: () => { setMenuOpen(false) } },
                { label: 'Settings', action: () => { setMenuOpen(false) } },
                { label: 'Photo (P)', action: () => { setMenuOpen(false) } },
                { label: 'Share (X)', action: () => { setMenuOpen(false); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'x' })) } },
              ].map(item => (
                <button key={item.label} onClick={item.action}
                  className="py-2.5 rounded-xl text-[0.55rem] tracking-wider cursor-pointer"
                  style={{
                    background: 'rgba(240,198,116,0.05)',
                    border: '1px solid rgba(240,198,116,0.1)',
                    color: 'rgba(255,220,180,0.5)',
                  }}>
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-3 pt-3 flex justify-between text-[0.5rem]" style={{ borderTop: '1px solid rgba(255,200,120,0.06)' }}>
              <span style={{ color: 'rgba(255,220,180,0.2)' }}>WASD: Move · Shift: Sprint</span>
              <span style={{ color: 'rgba(255,220,180,0.2)' }}>E: Interact · Space: Jump</span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile: show minimap + achievement counter (small, non-intrusive) */}
      {isMobile && (
        <>
          <Minimap />
          <AchievementTracker />
        </>
      )}
    </>
  )
}
