'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

/**
 * Procedural concrete floor with shader-based variation.
 * Replaces the flat-color floor plane with one that has:
 * - Subtle color variation (darker/lighter patches)
 * - Roughness variation (some areas more polished)
 * - Faint crack-like patterns
 * Uses a custom ShaderMaterial for zero texture cost.
 */

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`

const fragmentShader = `
  uniform vec3 uBaseColor;
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vWorldPos;

  // Simple hash-based noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 pos = vWorldPos.xz;

    // Large-scale color variation (dark/light patches)
    float largeNoise = fbm(pos * 0.008);

    // Medium-scale variation (concrete pour lines)
    float medNoise = fbm(pos * 0.03);

    // Fine detail (surface texture)
    float fineNoise = noise(pos * 0.15);

    // Combine
    float variation = largeNoise * 0.12 + medNoise * 0.06 + fineNoise * 0.03;

    // Subtle crack pattern (sharp lines)
    float crack = smoothstep(0.48, 0.5, noise(pos * 0.05));
    crack *= 0.08;

    vec3 color = uBaseColor;
    color += variation - 0.08; // center the variation
    color -= crack; // darken at cracks

    // Slight warm tint in brighter areas
    color += vec3(0.02, 0.01, 0.0) * largeNoise;

    gl_FragColor = vec4(color, 1.0);
  }
`

export function ProceduralFloor() {
  const uniforms = useMemo(() => ({
    uBaseColor: { value: new THREE.Color(COLORS.floor) },
    uTime: { value: 0 },
  }), [])

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
      <planeGeometry args={[500, 450, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.FrontSide}
      />
    </mesh>
  )
}
