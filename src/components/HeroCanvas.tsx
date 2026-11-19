import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  createGalvanizedBumpTexture,
  createConcreteTexture,
  createStudioEnvironment,
  detectSoftwareGl,
  scheduleAfterDraw,
} from '../three/webglUtils';
import { buildGuyedLatticeSection, createTowerMaterials } from '../three/towerGeometry';

/**
 * Interactive Hero backdrop rendering a procedural wireframe-to-solid guyed lattice tower
 * with gentle pointer parallax, studio PBR environment reflections, and software-WebGL pacing.
 */
export function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareGl();
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);

    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060a12, 0.036);
    const envTex = createStudioEnvironment(renderer);
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(
      42,
      (container.clientWidth || 1) / (container.clientHeight || 1),
      0.1,
      120,
    );
    camera.position.set(5.4, 8.8, 12.2);
    camera.lookAt(0, 7.2, 0);

    // Balanced warm/cool lighting
    const hemi = new THREE.HemisphereLight(0x94c5ff, 0x0f172a, 0.85);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff1dc, 1.9);
    keyLight.position.set(10, 18, 12);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00e5ff, 1.15);
    rimLight.position.set(-12, 10, -8);
    scene.add(rimLight);

    // Build wireframe-to-solid vertical guyed mast silhouette
    const galvBump = createGalvanizedBumpTexture(renderer);
    const concTex = createConcreteTexture(renderer);
    const mats = createTowerMaterials(galvBump, concTex);

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.36,
    });

    const mastGroup = new THREE.Group();
    const sectionH = 1.65;
    const totalSections = 9;
    for (let i = 0; i < totalSections; i++) {
      // Lower 3 wireframe blueprint -> mid galvanized -> upper ICAO red/white solid
      let mat: THREE.Material = mats.galvanized;
      if (i < 2) mat = wireMat;
      else if (i >= 5) mat = i % 2 === 1 ? mats.icaoRed : mats.icaoWhite;

      const { group: sec } = buildGuyedLatticeSection(sectionH, 0.48, mat, mats.galvanizedDark, mats.flangeHighlight);
      sec.position.y = i * sectionH;
      mastGroup.add(sec);
    }

    // Subtle radiating blueprint guy lines
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.28,
    });
    const guyHeights = [5.2, 10.1, 13.8];
    const lineGeos: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 3; i++) {
      const a = (i * Math.PI * 2) / 3 + Math.PI / 6;
      const ax = Math.cos(a) * 9.5;
      const az = Math.sin(a) * 9.5;
      guyHeights.forEach((h) => {
        const g = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(Math.cos(a) * 0.48, h, Math.sin(a) * 0.48),
          new THREE.Vector3(ax, 0, az),
        ]);
        lineGeos.push(g);
        mastGroup.add(new THREE.Line(g, lineMat));
      });
    }

    // Pulsing aviation beacon at apex
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 12), mats.beaconRed);
    beacon.position.set(0.24, totalSections * sectionH + 0.35, 0);
    mastGroup.add(beacon);

    // Offset slightly to the left side of screen (RTL hero copy sits on the right)
    mastGroup.position.set(-2.2, -1.2, -1.5);
    scene.add(mastGroup);

    // Pointer parallax state
    let pointerX = 0;
    let pointerY = 0;
    const onPointerMove = (e: PointerEvent) => {
      pointerX = (e.clientX / window.innerWidth - 0.5) * 2;
      pointerY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let isVisible = true;
    const io = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.02 },
    );
    io.observe(container);

    const ro = new ResizeObserver(() => {
      if (!container) return;
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(container);

    const onContextLost = (e: Event) => {
      e.preventDefault();
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    let frameId = 0;
    let disposed = false;
    let prevTimeMs = performance.now();
    const startTimeMs = prevTimeMs;
    const lookTarget = new THREE.Vector3(-1.4, 7.2, 0);

    const tick = () => {
      if (disposed) return;
      const nowMs = performance.now();
      const dt = Math.min((nowMs - prevTimeMs) / 1000, 0.1);
      prevTimeMs = nowMs;
      const elapsed = (nowMs - startTimeMs) / 1000;

      if (isVisible) {
        mastGroup.rotation.y += dt * 0.14;
        camera.position.x = THREE.MathUtils.damp(camera.position.x, 5.4 + pointerX * 1.1, 3.2, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, 8.8 - pointerY * 0.7, 3.2, dt);
        camera.lookAt(lookTarget);

        const pulse = 0.35 + Math.pow(Math.max(0, Math.sin(elapsed * 2.4)), 6) * 2.8;
        mats.beaconRed.emissiveIntensity = pulse;

        renderer.render(scene, camera);
      }

      if (isSoftwareGl) {
        scheduleAfterDraw(renderer, tick, (id) => {
          frameId = id;
        }, 120);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      io.disconnect();
      ro.disconnect();
      lineGeos.forEach((g) => g.dispose());
      lineMat.dispose();
      wireMat.dispose();
      mats.dispose();
      galvBump.dispose();
      concTex.dispose();
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      data-testid="hero-3d-canvas"
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none opacity-80"
    />
  );
}
