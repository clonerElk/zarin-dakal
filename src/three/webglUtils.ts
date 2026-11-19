import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

let cachedSoftwareGl: boolean | null = null;

/**
 * Detects CPU/software WebGL renderers (SwiftShader, llvmpipe, WARP) from the
 * actual WebGL renderer string rather than user-agent sniffing.
 */
export function detectSoftwareGl(): boolean {
  if (cachedSoftwareGl !== null) return cachedSoftwareGl;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) {
      cachedSoftwareGl = true;
      return true;
    }
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    cachedSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    return cachedSoftwareGl;
  } catch {
    cachedSoftwareGl = true;
    return true;
  }
}

export function createStudioEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  return envTexture;
}

/**
 * Procedural hot-dip galvanized zinc steel spangle bump texture (grayscale linear).
 */
export function createGalvanizedBumpTexture(renderer: THREE.WebGLRenderer): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  // Subtle metallic zinc spangle facets + brushed grain
  let seed = 1337;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < 420; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const w = 6 + rand() * 18;
    const h = 4 + rand() * 14;
    const shade = Math.floor(105 + rand() * 50);
    ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y + (rand() - 0.5) * 6);
    ctx.lineTo(x + w * 0.7, y + h);
    ctx.lineTo(x - w * 0.2, y + h * 0.8);
    ctx.closePath();
    ctx.fill();
  }

  ctx.strokeStyle = 'rgba(220,220,220,0.08)';
  ctx.lineWidth = 1;
  for (let y = 0; y < size; y += 3) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 4);
  texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  return texture;
}

/**
 * Procedural reinforced concrete texture (sRGB albedo).
 */
export function createConcreteTexture(renderer: THREE.WebGLRenderer): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#5f6773';
  ctx.fillRect(0, 0, size, size);

  let seed = 4242;
  const rand = () => {
    seed = (seed * 48271) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < 2400; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 1 + rand() * 2.5;
    const v = Math.floor(72 + rand() * 48);
    ctx.fillStyle = `rgba(${v},${v + 3},${v + 8},0.35)`;
    ctx.fillRect(x, y, r, r);
  }

  // Formwork seam lines
  ctx.strokeStyle = 'rgba(30,36,46,0.28)';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, size - 2, size - 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  return texture;
}

/**
 * Procedural CAD engineering grid texture for terrain surface.
 */
export function createBlueprintGroundTexture(renderer: THREE.WebGLRenderer): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#070C16';
  ctx.fillRect(0, 0, size, size);

  // Minor grid
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
  ctx.lineWidth = 1;
  const step = size / 16;
  for (let i = 0; i <= 16; i++) {
    const pos = i * step;
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, pos);
    ctx.lineTo(size, pos);
    ctx.stroke();
  }

  // Major grid
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.22)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i <= 4; i++) {
    const pos = (i * size) / 4;
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, pos);
    ctx.lineTo(size, pos);
    ctx.stroke();
  }

  // Registration crosshairs at major intersections
  ctx.strokeStyle = 'rgba(203, 213, 225, 0.35)';
  ctx.lineWidth = 1.5;
  for (let ix = 1; ix < 4; ix++) {
    for (let iy = 1; iy < 4; iy++) {
      const cx = (ix * size) / 4;
      const cy = (iy * size) / 4;
      ctx.beginPath();
      ctx.moveTo(cx - 5, cy);
      ctx.lineTo(cx + 5, cy);
      ctx.moveTo(cx, cy - 5);
      ctx.lineTo(cx, cy + 5);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(14, 14);
  texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return texture;
}

/**
 * Soft radial contact shadow disc texture so towers sit flush on terrain.
 */
export function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 4, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
  grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.28)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Soft radial glow texture for additive volumetric lighting sprites (e.g. ICAO aviation beacon halo).
 */
export function createGlowSpriteTexture(
  coreRgba = 'rgba(255, 110, 120, 1)',
  midRgba = 'rgba(230, 57, 70, 0.55)',
  edgeRgba = 'rgba(230, 57, 70, 0)',
): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const half = size / 2;
  const grad = ctx.createRadialGradient(half, half, 2, half, half, half);
  grad.addColorStop(0, coreRgba);
  grad.addColorStop(0.28, midRgba);
  grad.addColorStop(0.68, 'rgba(230, 57, 70, 0.14)');
  grad.addColorStop(1, edgeRgba);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export interface DynamicSkyDome {
  mesh: THREE.Mesh;
  update: (duskMix: number) => void;
  dispose: () => void;
}

/**
 * Procedural gradient sky dome transitioning smoothly from crisp twilight-blueprint blue (Stage 1)
 * to deep obsidian dusk with subtle crimson-cobalt horizon rim lighting (Stage 6).
 */
export function createSkyDome(radius = 120): DynamicSkyDome {
  const geo = new THREE.SphereGeometry(radius, 32, 20);
  const posAttr = geo.attributes.position;
  const vertexCount = posAttr.count;
  const colors = new Float32Array(vertexCount * 3);
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
  });

  const mesh = new THREE.Mesh(geo, mat);

  // Twilight blueprint palette (Stage 1)
  const zenithBlueprint = new THREE.Color(0x050911);
  const midBlueprint = new THREE.Color(0x0b162a);
  const horizonBlueprint = new THREE.Color(0x132946);

  // Deep dusk + warm crimson/cobalt horizon rim palette (Stage 6)
  const zenithDusk = new THREE.Color(0x04070f);
  const midDusk = new THREE.Color(0x0c1428);
  const horizonDusk = new THREE.Color(0x2a1426);

  const zenith = new THREE.Color();
  const mid = new THREE.Color();
  const horizon = new THREE.Color();
  const tmp = new THREE.Color();

  let lastMix = -1;

  const update = (duskMix: number) => {
    const m = Math.max(0, Math.min(1, duskMix));
    if (Math.abs(m - lastMix) < 0.004) return;
    lastMix = m;

    zenith.copy(zenithBlueprint).lerp(zenithDusk, m);
    mid.copy(midBlueprint).lerp(midDusk, m);
    horizon.copy(horizonBlueprint).lerp(horizonDusk, m);

    const colAttr = geo.attributes.color as THREE.BufferAttribute;
    for (let i = 0; i < vertexCount; i++) {
      const ny = Math.max(0, Math.min(1, posAttr.getY(i) / radius));
      if (ny < 0.28) {
        tmp.copy(horizon).lerp(mid, ny / 0.28);
      } else {
        tmp.copy(mid).lerp(zenith, Math.pow((ny - 0.28) / 0.72, 0.85));
      }
      colAttr.setXYZ(i, tmp.r, tmp.g, tmp.b);
    }
    colAttr.needsUpdate = true;
  };

  update(0);

  return {
    mesh,
    update,
    dispose: () => {
      geo.dispose();
      mat.dispose();
    },
  };
}

/**
 * Software-WebGL fenceSync frame pacer so headless Chromium / CPU WebGL never stalls the main thread.
 */
export function scheduleAfterDraw(
  renderer: THREE.WebGLRenderer,
  cb: () => void,
  onTimerId: (id: number) => void,
  delayMs = 80,
): void {
  const gl = renderer.getContext();
  if ('fenceSync' in gl && typeof gl.fenceSync === 'function') {
    const gl2 = gl as WebGL2RenderingContext;
    const sync = gl2.fenceSync(gl2.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl2.flush();
    const poll = () => {
      const state = sync ? gl2.getSyncParameter(sync, gl2.SYNC_STATUS) : gl2.SIGNALED;
      if (state === gl2.UNSIGNALED) {
        onTimerId(window.setTimeout(poll, 5));
      } else {
        if (sync) gl2.deleteSync(sync);
        onTimerId(window.setTimeout(cb, delayMs));
      }
    };
    onTimerId(window.setTimeout(poll, 5));
  } else {
    onTimerId(window.setTimeout(cb, delayMs));
  }
}
