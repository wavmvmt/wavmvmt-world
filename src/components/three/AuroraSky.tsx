'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS } from '@/lib/roomConfig'

/**
 * Aurora sky dome — a massive hemisphere above the warehouse
 * with slowly shifting color bands. Creates an ethereal,
 * otherworldly atmosphere above the construction site.
 *
 * Like the Northern Lights are watching over the build.
 */
let _fs_AuroraSk = 0
export function AuroraSky() {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useRef({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color(COLORS.sage).multiplyScalar(0.15) },
    uColor2: { value: new THREE.Color(COLORS.lavender).multiplyScalar(0.1) },
    uColor3: { value: new THREE.Color(COLORS.sky).multiplyScalar(0.08) },
  })

  useFrame((state) => {
    if ((_fs_AuroraSk = (_fs_AuroraSk + 1) % 4) !== 0) return
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <mesh position={[0, -20, 0]} rotation={[0, 0, 0]}>
      <sphereGeometry args={[500, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <shaderMaterial
        ref={matRef}
        transparent
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={uniforms.current}
        vertexShader={`
          varying vec2 vUv;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          uniform vec3 uColor3;
          varying vec2 vUv;
          varying vec3 vPosition;

          void main() {
            float y = vUv.y;

            // Aurora bands — shifting sine waves
            float band1 = sin(y * 8.0 + uTime * 2.0 + sin(vUv.x * 3.0) * 0.5) * 0.5 + 0.5;
            float band2 = sin(y * 12.0 + uTime * 3.0 + cos(vUv.x * 5.0) * 0.3) * 0.5 + 0.5;
            float band3 = sin(y * 6.0 + uTime * 1.5 + sin(vUv.x * 2.0) * 0.7) * 0.5 + 0.5;

            // Mix colors based on bands
            vec3 color = uColor1 * band1 + uColor2 * band2 + uColor3 * band3;

            // Fade toward horizon (stronger at top)
            float fade = smoothstep(0.0, 0.6, y) * smoothstep(1.0, 0.7, y);

            // Very subtle — atmospheric, not overwhelming
            float alpha = fade * 0.12;

            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </mesh>
  )
}
