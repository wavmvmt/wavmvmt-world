/**
 * WAVMVMT World playable alpha smoke tests.
 *
 * Run from repository root: node scripts/check-music-quest.mjs
 * Built-in Node.js only. This is source-level QA, not a browser/E2E test.
 */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { Script, runInNewContext } from 'node:vm'

const html = readFileSync('public/alpha/music-quest.html', 'utf8')
const photo = readFileSync('public/alpha/photo-quest.html', 'utf8')
const overlay = readFileSync('src/components/UIOverlay.tsx', 'utf8')
const gateway = readFileSync('src/components/StudioQuestGateway.tsx', 'utf8')
const progressionJs = readFileSync('public/alpha/progression-v2.js', 'utf8')

assert.match(html, /<!doctype html>/i)
assert.match(html, /<meta name="viewport"/)
assert.match(html, /href="\/world"/)
assert.match(html, /from'\)===\s*'world'\)view\('studio'\)/)
assert.match(html, /aria-label="Interactive skill network"/)
assert.match(html, /id="sequencer"/)
assert.match(html, /id="sound"/)
assert.match(html, /id="reset"/)
assert.match(html, /id="export"/)
assert.match(html, /prefers-reduced-motion:reduce/)
assert.match(html, /localStorage/)

// The static demo must not send data or require any external runtime APIs.
assert.doesNotMatch(html, /\bfetch\s*\(/)
assert.doesNotMatch(html, /\bXMLHttpRequest\b/)
assert.doesNotMatch(html, /\bnavigator\.sendBeacon\b/)
assert.match(html, /<script src="\.\/progression-v2\.js"><\/script>/)
assert.doesNotMatch(html, /<script[^>]+src="https?:/i)

const inlineScript = html.match(/<script>\s*([\s\S]*?)<\/script>/)
assert.ok(inlineScript, 'Inline quest script not found')
new Script(inlineScript[1], { filename: 'music-quest.inline.js' })
const photoScript = photo.match(/<script>\s*([\s\S]*?)<\/script>/)
assert.ok(photoScript, 'Photo challenge script missing')
new Script(photoScript[1], { filename: 'photo-quest.inline.js' })
assert.match(photo, /href="\.\/music-quest\.html\?view=palace"/)
assert.match(photo, /<script src="\.\/progression-v2\.js"><\/script>/)
assert.doesNotMatch(photo, /\bfetch\s*\(/)

// V2 progression is the only source of truth for quest qualification.
const vmContext = {}
runInNewContext(progressionJs, vmContext, { filename: 'progression-v2.js' })
const progress = vmContext.WAVMVMTProgression
assert.ok(progress, 'Progression script did not expose its API')
const validPattern = [
  [1, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 1, 0],
  [1, 0, 1, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
]
validPattern[2][4] = 1
assert.equal(progress.qualifiedPattern(validPattern), true, 'Qualifying groove must pass')
for (const [track, step] of [[0, 0], [0, 4], [1, 2], [1, 6], [2, 0]]) {
  const pattern = validPattern.map(row => row.slice())
  pattern[track][step] = 0
  assert.equal(progress.qualifiedPattern(pattern), false)
}
assert.match(inlineScript[1], /PROGRESS\.qualifiedPattern\(state\.pattern\)/)
const photoDraft = { placement:'upper-right', lighting:'side', previewed:true }
assert.equal(progress.qualifiedPhotoDraft(photoDraft), true)
assert.equal(progress.qualifiedPhotoDraft({...photoDraft, placement:'center'}), false)
assert.equal(progress.qualifiedPhotoDraft({...photoDraft, previewed:false}), false)
const photoDone = progress.completePhoto(progress.newProgress(), photoDraft, () => '2026-10-12T00:00:00Z')
assert.equal(progress.isCompleted(photoDone, progress.PHOTO_ID),true)
assert.equal(progress.isCompleted(photoDone, progress.QUEST_ID),false)
assert.match(photoScript[1], /engine\.completePhoto\(progress,draft\)/)
assert.match(inlineScript[1], /PROGRESS\.completeMusic\(progress,state\)/)
assert.match(inlineScript[1], /PROGRESS\.persist\(localStorage,progress\)/)
assert.match(inlineScript[1], /stepsPlayed===8/)
assert.match(inlineScript[1], /state\.playedBar=true/)
assert.match(inlineScript[1], /state\.completed=PROGRESS\.isCompleted\(progress\)/)
assert.match(inlineScript[1], /if\(!patternOK\(\)\|\|!state\.playedBar\)return/)

// The 3D bridge is optional: no shared account, no network or cross-site data.
assert.match(overlay, /<StudioQuestGateway\s*\/>/)
assert.match(gateway, /addEventListener\('playerMove'/)
assert.match(gateway, /\/alpha\/music-quest\.html\?from=world/)
assert.match(gateway, /wavmvmt-world-progress-v2/)
assert.match(gateway, /music_producer_001/)
assert.match(gateway, /wavmvmt-world-alpha-v1/)
assert.match(gateway, /MUSIC_STUDIO\.x/)
assert.match(gateway, /PHOTO_STUDIO\.x/)
assert.match(gateway, /photo-quest\.html/)
assert.doesNotMatch(gateway, /\bfetch\s*\(/)

console.log('WAVMVMT World alpha: source + multi-quest V2 checks passed.')
console.log('Still required: Next.js build, mobile browser smoke, accessibility, and optional audio playback tests.')
