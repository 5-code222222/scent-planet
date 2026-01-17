varying vec2 vUv;
varying float vDisplacement;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;
uniform vec3 uColors[13]; // Array of RGB colors
uniform float uWeights[13]; // Array of weights (0.0 to 1.0) for each scent category

// Simple rim lighting for atmosphere effect
float rim(vec3 normal, vec3 viewDir) {
  float d = dot(normal, viewDir);
  return 1.0 - max(d, 0.0);
}

void main() {
  // Normalize weights sum to avoiding blowing out colors
  float totalWeight = 0.0;
  for(int i = 0; i < 13; i++) {
    totalWeight += uWeights[i];
  }
  
  // Guard against divide by zero if completely empty
  if (totalWeight < 0.001) totalWeight = 1.0;

  // Mix colors based on weights
  // To make it organic, we modify the weight influence by noise/position
  // so colors aren't just a flat average, but appear in patches
  
  vec3 finalColor = vec3(0.0);
  
  for(int i = 0; i < 13; i++) {
    float weight = uWeights[i] / totalWeight;
    
    // Skip if weight is negligible
    if (weight < 0.01) continue;

    // Use sine waves based on position to create "zones" for each color
    // Each color gets a different frequency/phase so they interweave
    float phase = float(i) * 123.45;
    float freq = 2.0 + float(i) * 0.1;
    
    float noisePattern = sin(vPosition.y * freq + uTime * 0.1 + phase) * 
                         cos(vPosition.x * freq + uTime * 0.15 + phase) * 
                         sin(vPosition.z * freq * 0.5 + phase);
                         
    // Remap noise to 0..1 roughly, and favor higher weights
    float localInfluence = smoothstep(-0.5, 0.5, noisePattern) * weight * 5.0; // Boost weight to make colors popup
    
    // Accumulate
    finalColor += uColors[i] * max(0.0, localInfluence);
  }

  // Base mix to ensure the planet isn't pitch black in gaps
  vec3 averageColor = vec3(0.0);
  for(int i = 0; i < 13; i++) {
     averageColor += uColors[i] * (uWeights[i] / totalWeight);
  }
  
  // Blend accumulated detailed color with average base color
  finalColor = mix(averageColor, finalColor, 0.6);

  // Add atmosphere/rim effect
  vec3 viewDir = normalize(cameraPosition - vPosition); // Approximate view direction in world space (rough)
  // Actually in standard ShaderMaterial without 'cameraPosition' uniform passed explicitly, this might fail unless shaderMaterial provides it.
  // R3F shaderMaterial usually allows access to viewMatrix/etc.
  // Let's use a simpler Rim based on vNormal and Z axis if viewDir isn't perfect, 
  // OR rely on built-in uniforms if using R3F's <shaderMaterial> which passes uniforms automatically? No, it doesn't pass cameraPos by default unless asked.
  // We'll calculate Fresnel approximation using vNormal.z (view space normal would be better but we have world/object space here depends on vertex shader output).
  // Actually vNormal from vertex shader is typically object space or world space. 
  // Let's assume standard object space. For rim, we want view space normal.
  // Simpler approach: Tint with displacement to show depth.
  
  // Add glow based on displacement peaks
  float glow = smoothstep(0.0, 0.2, vDisplacement);
  finalColor += vec3(glow * 0.2);

  gl_FragColor = vec4(finalColor, 0.9); // Slight transparency
  
  // Optional: Tonal correction
  gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.0/2.2)); // Gamma correction
}
