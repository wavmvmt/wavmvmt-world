#!/usr/bin/env node
/**
 * Reproduce the standalone HTML alpha assets in wavmvmt-world from one canonical
 * WAVMVMT-owned source: the sibling wavmvmt-world-game/prototype folder.
 *
 * Review-only tool: --check (default) compares bytes, --write stages local files.
 * Never commits, deploys, mutates the external source, or touches WAVMVMT CORE.
 * Uses Node built-ins only. The source repository must already be checked out.
 *
 * Usage (from wavmvmt-world root):
 *   node scripts/sync-game-alpha.mjs --check
 *   node scripts/sync-game-alpha.mjs --write
 *   WAVMVMT_GAME_PROTOTYPE_DIR=/path/to/prototype node scripts/sync-game-alpha.mjs --check
 */
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve, join, dirname } from 'node:path'

const modes = process.argv.filter(x => x === '--check' || x === '--write')
if (modes.length > 1 || process.argv.slice(2).some(x => !['--check','--write'].includes(x))) {
  throw new Error('Choose --check or --write; other arguments are unsupported')
}
const write = modes[0] === '--write'
const worldRoot = process.cwd()
const sourceDir = resolve(process.env.WAVMVMT_GAME_PROTOTYPE_DIR ??
  join(worldRoot, '..', 'wavmvmt-world-game', 'prototype'))
const destinationDir = join(worldRoot, 'public', 'alpha')
const files = [
  ['playable-alpha.html', 'music-quest.html'],
  ['photo-quest.html', 'photo-quest.html'],
  ['movement-quest.html', 'movement-quest.html'],
  ['energy-quest.html', 'energy-quest.html'],
  ['passport.html', 'passport.html'],
  ['progression-v2.js', 'progression-v2.js'],
]

function exactlyOnce(text, before, after) {
  const at = text.indexOf(before)
  if (at === -1 || text.indexOf(before, at + before.length) !== -1) {
    throw new Error('Expected one world navigation insertion point')
  }
  return text.slice(0, at) + after + text.slice(at + before.length)
}

function compile(filename, original) {
  if (filename === 'playable-alpha.html') {
    return exactlyOnce(original, '</nav></div></header>',
      '<a href="/world" style="font-size:13px;padding:8px 11px;border:1px solid #8a2c23;border-radius:6px;text-decoration:none;white-space:nowrap;">← Back to 3D Center</a>\n</nav></div></header>')
  }
  if (filename === 'progression-v2.js') return original
  if (!original.includes('./playable-alpha.html')) {
    throw new Error('Expected game hub links in ' + filename)
  }
  return original.replaceAll('./playable-alpha.html', './music-quest.html')
}

function hash(s) {
  return createHash('sha256').update(s, 'utf8').digest('hex').slice(0, 14)
}

let mismatch = false
for (const [sourceName, outputName] of files) {
  const source = join(sourceDir, sourceName)
  const destination = join(destinationDir, outputName)
  if (!existsSync(source)) throw new Error('Missing canonical file: ' + source)
  const expected = compile(sourceName, readFileSync(source, 'utf8'))
  const existing = existsSync(destination) ? readFileSync(destination, 'utf8') : null
  const same = existing === expected
  if (!same) {
    mismatch = true
    if (write) {
      mkdirSync(dirname(destination), { recursive: true })
      writeFileSync(destination, expected, 'utf8')
    }
  }
  console.log((same ? 'MATCH' : write ? 'WRITTEN' : 'DIFF') +
    ' ' + sourceName + ' → ' + outputName + ' (expected ' + hash(expected) + ')')
}
if (mismatch && !write) {
  console.error('World preview assets differ from the canonical World Game source.')
  console.error('Inspect changes before using --write; do not auto-merge.');
  process.exitCode = 1
} else {
  console.log(write ? 'Staged current alpha assets locally; review the diff.' : 'All six assets match.')
}
