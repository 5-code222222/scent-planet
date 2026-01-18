'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { shaderMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';
import { ScentProfile } from '@/lib/types';
import { SCENT_CATEGORIES, SCENT_COLORS, SCENT_VECTORS, SCENT_CATEGORY_LABELS_JP, hexToRgbNormalized } from '@/lib/constants';

// --- Shader Definitions ---

const planetVertexShader = `
varying vec2 vUv;
varying float vDisplacement;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;
uniform float uComplexity;
uniform float uWeights[14];

// 14 fixed directions for the categories (axes + corners)
const vec3 directions[14] = vec3[](
    vec3(0.0, 1.0, 0.0),    // Up
    vec3(1.0, 0.0, 0.0),    // Right
    vec3(0.0, 0.0, 1.0),    // Forward
    vec3(0.0, -1.0, 0.0),   // Down
    vec3(-1.0, 0.0, 0.0),   // Left
    vec3(0.0, 0.0, -1.0),   // Backward
    vec3(0.577, 0.577, 0.577),   // C1
    vec3(-0.577, 0.577, 0.577),  // C2
    vec3(0.577, -0.577, 0.577),  // C3
    vec3(0.577, 0.577, -0.577),  // C4
    vec3(-0.577, -0.577, 0.577), // C5
    vec3(-0.577, 0.577, -0.577), // C6
    vec3(0.577, -0.577, -0.577), // C7
    vec3(-0.577, -0.577, -0.577) // C8
);

// Simplex Noise (Minimal)
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  vUv = uv;
  vNormal = normal;
  vPosition = position;
  float time = uTime * 0.3;

  float totalDisplacement = 0.0;
  
  for (int i = 0; i < 14; i++) {
      float weight = uWeights[i];
      if (weight > 1.0) {
          float alignment = dot(normalize(position), directions[i]);
          float spike = pow(max(0.0, alignment), 20.0); 
          float pulse = 1.0 + 0.1 * sin(time * 2.0 + float(i));
          totalDisplacement += spike * (weight / 25.0) * pulse; 
      }
  }

  float noise = snoise(vec3(position.x + time, position.y + time, position.z));
  float organicBase = noise * 0.1;

  vec3 newPosition = position + normal * (totalDisplacement + organicBase);
  vDisplacement = totalDisplacement;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

const planetFragmentShader = `
varying vec2 vUv;
varying float vDisplacement;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;
uniform vec3 uColors[14];
uniform float uWeights[14];

const vec3 directions[14] = vec3[](
    vec3(0.0, 1.0, 0.0), vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), vec3(0.0, -1.0, 0.0),
    vec3(-1.0, 0.0, 0.0), vec3(0.0, 0.0, -1.0), vec3(0.577, 0.577, 0.577), vec3(-0.577, 0.577, 0.577),
    vec3(0.577, -0.577, 0.577), vec3(0.577, 0.577, -0.577), vec3(-0.577, -0.577, 0.577),
    vec3(-0.577, 0.577, -0.577), vec3(0.577, -0.577, -0.577), vec3(-0.577, -0.577, -0.577)
);

void main() {
  vec3 averageColor = vec3(0.0);
  float totalWeightSum = 0.0;
  for(int i = 0; i < 14; i++) {
     averageColor += uColors[i] * uWeights[i];
     totalWeightSum += uWeights[i];
  }
  
  if(totalWeightSum > 0.0) averageColor /= totalWeightSum;
  else averageColor = vec3(0.5);

  vec3 finalColor = averageColor;

  for(int i = 0; i < 14; i++) {
    float weight = uWeights[i];
    if (weight < 1.0) continue;

    float alignment = dot(normalize(vPosition), directions[i]);
    float colorAlignment = pow(max(0.0, alignment), 2.5);
    float tipFactor = smoothstep(0.0, 1.2, vDisplacement);
    float strength = pow(colorAlignment * tipFactor, 0.8);
    
    finalColor = mix(finalColor, uColors[i] * 1.3, strength);
  }

  float tipHighlight = smoothstep(1.5, 3.5, vDisplacement);
  finalColor += vec3(tipHighlight * 0.4);

  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fresnel = pow(1.0 - dot(viewDir, vNormal), 2.5);
  finalColor += vec3(fresnel * 0.1); 
  
  float gray = dot(finalColor, vec3(0.299, 0.587, 0.114));
  finalColor = mix(vec3(gray), finalColor, 1.2);

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

// --- Material Definition ---

const PlanetMaterial = shaderMaterial(
    {
        uTime: 0,
        uColors: new Array(14).fill(new THREE.Vector3(1, 1, 1)),
        uWeights: new Array(14).fill(0),
        uComplexity: 0,
    },
    planetVertexShader,
    planetFragmentShader
);

extend({ PlanetMaterial });

// Global Type Override - Simplified to 'any' to prevent "Problem" indications in IDE
declare global {
    namespace JSX {
        interface IntrinsicElements {
            planetMaterial: any;
        }
    }
}

interface PlanetProps {
    scentProfile: ScentProfile | null;
}

const Planet: React.FC<PlanetProps> = ({ scentProfile }) => {
    // Explicitly cast the ref to ShaderMaterial to access uniforms
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    useFrame(({ clock }) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
        }
    });

    const { colors, weights, complexity } = useMemo(() => {
        const colorsArr = new Array(14).fill(new THREE.Vector3(0, 0, 0));
        const weightsArr = new Array(14).fill(0);
        let complexityVal = 0;

        if (scentProfile) {
            SCENT_CATEGORIES.forEach((cat, index) => {
                const val = scentProfile.elements[cat] || 0;
                const [r, g, b] = hexToRgbNormalized(SCENT_COLORS[cat]);
                colorsArr[index] = new THREE.Vector3(r, g, b);
                weightsArr[index] = val;

                if (val > 5) complexityVal += 1;
            });
        } else {
            // Initial state: Blue/Pink placeholder
            colorsArr[0] = new THREE.Vector3(0.5, 0.5, 1.0);
            weightsArr[0] = 50;
            colorsArr[1] = new THREE.Vector3(1.0, 0.8, 0.9);
            weightsArr[1] = 50;
            complexityVal = 2;
        }

        const normComplexity = Math.min(complexityVal / 8, 1.0);
        return { colors: colorsArr, weights: weightsArr, complexity: normComplexity };
    }, [scentProfile]);

    return (
        <group>
            <mesh>
                <sphereGeometry args={[2, 128, 128]} />
                {/* @ts-ignore - Required because R3F dynamic elements confuse strict linters sometimes, despite global decl */}
                <planetMaterial
                    ref={materialRef}
                    key={scentProfile?.id || 'initial'}
                    transparent
                    uColors={colors}
                    uWeights={weights}
                    uComplexity={complexity}
                />
            </mesh>

            {/* Render Labels for active spikes */}
            {scentProfile && SCENT_CATEGORIES.map((cat, index) => {
                const weight = scentProfile.elements[cat] || 0;
                if (weight < 15) return null;

                const vec = SCENT_VECTORS[cat];
                const color = SCENT_COLORS[cat];
                const distance = 2.2 + (weight / 30.0) * 1.5;
                const position: [number, number, number] = [
                    vec[0] * distance,
                    vec[1] * distance,
                    vec[2] * distance
                ];

                // Scent-specific effect classes
                let effectClass = "";
                if (['Floral', 'Musk', 'Gourmand'].includes(cat)) effectClass = "animate-pulse shadow-[0_0_20px_rgba(255,255,255,0.3)]";
                if (['Citrus', 'Fruity', 'Marine'].includes(cat)) effectClass = "animate-bounce-subtle";
                if (['Spice', 'Smoky'].includes(cat)) effectClass = "animate-waver";

                return (
                    <Html key={cat} position={position} center distanceFactor={10}>
                        <div className="flex flex-col items-center pointer-events-none select-none group">
                            {/* Stylish Label */}
                            <div className={`relative flex flex-col items-center p-2 transition-all duration-500`}>
                                {/* Scent-specific animated background/glow */}
                                <div
                                    className={`absolute inset-0 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity ${effectClass}`}
                                    style={{ backgroundColor: color }}
                                ></div>

                                <span
                                    className="text-white font-bold text-sm tracking-widest whitespace-nowrap drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]"
                                    style={{
                                        fontFamily: 'var(--font-jost)',
                                        textShadow: `0 0 10px ${color}, 0 0 20px ${color}44`
                                    }}
                                >
                                    {SCENT_CATEGORY_LABELS_JP[cat].toUpperCase()}
                                </span>
                                <span
                                    className="text-cyan-400 font-bold text-[10px] mt-0.5 tabular-nums opacity-80"
                                    style={{ fontFamily: 'var(--font-jost)' }}
                                >
                                    {weight}<span className="text-[8px] ml-0.5">%</span>
                                </span>

                                {/* SF UI Decor Accents */}
                                <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-white/40 group-hover:border-white/80 transition-colors"></div>
                                <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-white/40 group-hover:border-white/80 transition-colors"></div>
                            </div>

                            {/* Custom CSS for animations if not in tailwind */}
                            <style jsx>{`
                                @keyframes bounce-subtle {
                                    0%, 100% { transform: translateY(0); }
                                    50% { transform: translateY(-4px); }
                                }
                                .animate-bounce-subtle {
                                    animation: bounce-subtle 2s ease-in-out infinite;
                                }
                                @keyframes waver {
                                    0%, 100% { transform: skew(0deg) scale(1); filter: blur(0px); }
                                    50% { transform: skew(2deg) scale(1.05); filter: blur(1px); }
                                }
                                .animate-waver {
                                    animation: waver 3s ease-in-out infinite;
                                }
                            `}</style>
                        </div>
                    </Html>
                );
            })}
        </group>
    );
};

export default Planet;