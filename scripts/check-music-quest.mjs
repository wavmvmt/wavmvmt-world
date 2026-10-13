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
const overlay = readFileSync('src/components/UIOverlay.tsx', 'utf8')
const gateway = readFileSync('src/components/StudioQuestGateway.tsx', 'utf8')

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
assert.doesNotMatch(html, /<script[^>]+src=/i)

const inlineScript = html.match(/<script>\s*([\s\S]*?)<\/script>/)
assert.ok(inlineScript, 'Inline quest script not found')
new Script(inlineScript[1], { filename: 'music-quest.inline.js' })

// Smoke-test core challenge criteria directly from the declared game function.
const source = inlineScript[1].match(/function patternOK\(\)\{[^\r\n]*\}/)
assert.ok(source, 'patternOK implementation not found')
const start = [
  [1, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
]
function check(pattern) {
  return runInNewContext(`(${source[0]})()`, { state: { pattern } })
}
assert.equal(check(start), true, 'Qualifying groove must pass')
for (const [track, step] of [[0, 0], [0, 4], [1, 2], [1, 6], [2, 0]]) {
  const pattern = start.map(row => row.slice())
  pattern[track][step] = 0
  assert.equal(check(pattern), false, `Missing track ${track} step ${step} should fail`)
}
assert.match(inlineScript[1], /stepsPlayed===8/)
assert.match(inlineScript[1], /state\.playedBar=true/)
assert.match(inlineScript[1], /state\.completed=true/)
assert.match(inlineScript[1], /if\(!patternOK\(\)\|\|!state\.playedBar\)return/)

// The 3D bridge is optional: no shared account, no network or cross-site data.
assert.match(overlay, /<StudioQuestGateway\s*\/>/)
assert.match(gateway, /addEventListener\('playerMove'/)
assert.match(gateway, /\/alpha\/music-quest\.html\?from=world/)
assert.match(gateway, /wavmvmt-world-alpha-v1/)
assert.match(gateway, /MUSIC_STUDIO\.x/)
assert.doesNotMatch(gateway, /\bfetch\s*\(/)

console.log('WAVMVMT World playable alpha: static + quest-rule checks passed.')
console.log('Still required: Next.js build, mobile browser smoke, accessibility, and optional audio playback tests.')
