import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { TowerType } from '../utils/engineeringCalc';
import {
  createBlueprintGroundTexture,
  createConcreteTexture,
  createGalvanizedBumpTexture,
  createStudioEnvironment,
  detectSoftwareGl,
  scheduleAfterDraw,
} from '../three/webglUtils';
import {
  buildCompactGuyedTower,
  buildSelfSupportingTower,
  createTowerMaterials,
} from '../three/towerGeometry';

interface ComparisonCanvasProps {
  activeType: TowerType;
}

export function ComparisonCanvas({ activeType }: ComparisonCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const activeTypeRef = useRef<TowerType>(activeType);
  activeTypeRef.current = activeType;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isSoftwareGl = detectSoftwareGl();
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(Math.max(1, mount.clientWidth), Math.max(1, mount.clientHeight));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080e1a);
    scene.fog = new THREE.FogExp2(0x080e1a, 0.024);

    const envTex = createStudioEnvironment(renderer);
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(
      40,
      Math.max(1, mount.clientWidth) / Math.max(1, mount.clientHeight),
      0.1,
      140,
    );
    camera.position.set(12.5, 9.5, 14.5);
    camera.lookAt(0, 6.4, 0);

    const hemi = new THREE.HemisphereLight(0x94c5ff, 0x0f172a, 0.95);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff1dc, 1.9);
    keyLight.position.set(14, 22, 14);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00e5ff, 1.1);
    rimLight.position.set(-14, 12, -12);
    scene.add(rimLight);

    const galvBump = createGalvanizedBumpTexture(renderer);
    const concreteTex = createConcreteTexture(renderer);
    const groundTex = createBlueprintGroundTexture(renderer);
    const mats = createTowerMaterials(galvBump, concreteTex);

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: groundTex,
      roughness: 0.88,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.02;
    scene.add(ground);

    // Footprint indicator rings (distinct diameter per tower class)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const guyedFootprint = new THREE.Mesh(new THREE.RingGeometry(5.15, 5.28, 64), ringMat);
    guyedFootprint.rotation.x = -Math.PI / 2;
    guyedFootprint.position.y = 0.02;

    const ss3Footprint = new THREE.Mesh(new THREE.RingGeometry(2.0, 2.12, 3), ringMat);
    ss3Footprint.rotation.x = -Math.PI / 2;
    ss3Footprint.rotation.z = Math.PI / 6;
    ss3Footprint.position.y = 0.02;

    const ss4Footprint = new THREE.Mesh(new THREE.RingGeometry(2.25, 2.38, 4), ringMat);
    ss4Footprint.rotation.x = -Math.PI / 2;
    ss4Footprint.rotation.z = Math.PI / 4;
    ss4Footprint.position.y = 0.02;

    // Build all 3 procedural models once and toggle visibility cleanly
    const turretPivot = new THREE.Group();
    scene.add(turretPivot);

    const guyedModel = buildCompactGuyedTower(mats);
    guyedModel.add(guyedFootprint);
    turretPivot.add(guyedModel);

    const ss3Model = buildSelfSupportingTower(3, mats);
    ss3Model.add(ss3Footprint);
    turretPivot.add(ss3Model);

    const ss4Model = buildSelfSupportingTower(4, mats);
    ss4Model.add(ss4Footprint);
    turretPivot.add(ss4Model);

    // Simple drag-to-orbit horizontal rotation
    let dragging = false;
    let lastX = 0;
    let targetYaw = 0.35;
    let currentYaw = 0.35;

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      targetYaw += dx * 0.008;
    };
    const onPointerUp = () => {
      dragging = false;
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });

    let isVisible = false;
    const io = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0.02 },
    );
    io.observe(mount);

    const ro = new ResizeObserver(() => {
      if (!mount) return;
      const w = Math.max(1, mount.clientWidth);
      const h = Math.max(1, mount.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(mount);

    const onContextLost = (e: Event) => {
      e.preventDefault();
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    let prevTimeMs = performance.now();
    const startTimeMs = prevTimeMs;
    let frameId = 0;
    let disposed = false;

    const tick = () => {
      if (disposed) return;
      const nowMs = performance.now();
      const dt = Math.min((nowMs - prevTimeMs) / 1000, 0.1);
      prevTimeMs = nowMs;
      const elapsed = (nowMs - startTimeMs) / 1000;

      const mode = activeTypeRef.current;
      guyedModel.visible = mode === 'guyed';
      ss3Model.visible = mode === 'self_supporting_3';
      ss4Model.visible = mode === 'self_supporting_4';

      if (isVisible) {
        if (!dragging) {
          targetYaw += dt * 0.24;
        }
        currentYaw = THREE.MathUtils.damp(currentYaw, targetYaw, 6, dt);
        turretPivot.rotation.y = currentYaw;
        mats.beaconRed.emissiveIntensity = 0.4 + Math.pow(0.5 + 0.5 * Math.sin(elapsed * 3.0), 5) * 3.2;

        renderer.render(scene, camera);
      }

      if (isSoftwareGl) {
        scheduleAfterDraw(
          renderer,
          tick,
          (id) => {
            frameId = id;
          },
          110,
        );
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      io.disconnect();
      ro.disconnect();
      ringMat.dispose();
      groundMat.dispose();
      mats.dispose();
      galvBump.dispose();
      concreteTex.dispose();
      groundTex.dispose();
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      data-testid="comparison-3d-canvas"
      data-tower-type={activeType}
      className="w-full h-[360px] sm:h-[430px] cursor-grab active:cursor-grabbing bg-[#080E1A]"
    />
  );
}
