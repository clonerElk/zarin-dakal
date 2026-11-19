import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  ASSEMBLY_STAGES,
  computeAssemblyTelemetry,
  remap,
  smoothstep01,
  type AssemblyTelemetry,
} from '../utils/engineeringCalc';
import {
  createBlueprintGroundTexture,
  createConcreteTexture,
  createContactShadowTexture,
  createGalvanizedBumpTexture,
  createGlowSpriteTexture,
  createSkyDome,
  createStudioEnvironment,
  detectSoftwareGl,
  scheduleAfterDraw,
} from '../three/webglUtils';
import {
  buildAnchorBlock,
  buildApexAndBeacon,
  buildCentralFoundation,
  buildGuyedLatticeSection,
  buildLaserPlumbLine,
  buildRFEquipment,
  buildWindFlowRibbons,
  createTowerMaterials,
} from '../three/towerGeometry';

gsap.registerPlugin(ScrollTrigger);

interface CameraKeyframe {
  p: number;
  pos: [number, number, number];
  look: [number, number, number];
}

// Cinematic camera keyframes: Low-angle foundation -> mid lattice -> guy tensioning -> craning ascent -> RF dishes -> wide heroic dusk silhouette
const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  { p: 0.0, pos: [9.4, 3.3, 10.8], look: [0, 0.9, 0] },
  { p: 0.16, pos: [7.2, 4.0, 9.2], look: [0, 1.5, 0] },
  { p: 0.34, pos: [10.4, 7.8, 8.8], look: [0, 5.4, 0] },
  { p: 0.52, pos: [-9.2, 6.2, 13.4], look: [0, 4.8, 0] },
  { p: 0.72, pos: [-12.4, 18.0, 13.8], look: [0, 14.8, 0] },
  { p: 0.88, pos: [11.8, 22.4, 12.2], look: [0, 20.8, 0] },
  { p: 1.0, pos: [28.5, 21.0, 32.5], look: [0, 16.0, 0] },
];

function sampleCameraTrack(
  progress: number,
  outPos: THREE.Vector3,
  outLook: THREE.Vector3,
): void {
  const p = Math.max(0, Math.min(1, progress));
  let i = 0;
  while (i < CAMERA_KEYFRAMES.length - 2 && p > CAMERA_KEYFRAMES[i + 1].p) {
    i++;
  }
  const a = CAMERA_KEYFRAMES[i];
  const b = CAMERA_KEYFRAMES[i + 1];
  const localT = smoothstep01(remap(p, a.p, b.p));

  outPos.set(
    THREE.MathUtils.lerp(a.pos[0], b.pos[0], localT),
    THREE.MathUtils.lerp(a.pos[1], b.pos[1], localT),
    THREE.MathUtils.lerp(a.pos[2], b.pos[2], localT),
  );
  outLook.set(
    THREE.MathUtils.lerp(a.look[0], b.look[0], localT),
    THREE.MathUtils.lerp(a.look[1], b.look[1], localT),
    THREE.MathUtils.lerp(a.look[2], b.look[2], localT),
  );
}

export function ScrollytellingAssembly() {
  const trackRef = useRef<HTMLElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const targetProgressRef = useRef<number>(0);
  const smoothProgressRef = useRef<number>(0);
  const lastHudUpdateRef = useRef<number>(0);

  const [telemetry, setTelemetry] = useState<AssemblyTelemetry>(() => computeAssemblyTelemetry(0));
  const [hudCollapsed, setHudCollapsed] = useState(false);

  // Jump cleanly to any stage along the 550vh scroll container
  const scrollToStage = (stageIndex: number) => {
    const track = trackRef.current;
    if (!track) return;
    const stage = ASSEMBLY_STAGES[stageIndex];
    if (!stage) return;
    const midProgress = stageIndex === 0 ? 0.06 : stageIndex === ASSEMBLY_STAGES.length - 1 ? 0.96 : (stage.start + stage.end) * 0.5;
    const scrollable = Math.max(1, track.offsetHeight - window.innerHeight);
    const targetY = track.offsetTop + midProgress * scrollable;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  useEffect(() => {
    const track = trackRef.current;
    const mount = canvasMountRef.current;
    if (!track || !mount) return;

    // GSAP ScrollTrigger driving 0..1 progress across the 600vh assembly track
    const st = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.0,
      onUpdate: (self) => {
        targetProgressRef.current = self.progress;
      },
    });

    const isSoftwareGl = detectSoftwareGl();
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.14;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(Math.max(1, mount.clientWidth), Math.max(1, mount.clientHeight));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const bgColor = new THREE.Color(0x050911);
    const duskColor = new THREE.Color(0x111526);
    scene.background = bgColor.clone();
    scene.fog = new THREE.FogExp2(0x07101f, 0.0135);

    // Procedural atmospheric gradient sky dome (twilight-blueprint -> deep dusk with crimson-cobalt rim)
    const skyDome = createSkyDome(125);
    scene.add(skyDome.mesh);

    const envTex = createStudioEnvironment(renderer);
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(
      44,
      Math.max(1, mount.clientWidth) / Math.max(1, mount.clientHeight),
      0.1,
      220,
    );
    camera.position.set(9.2, 3.2, 10.6);

    // Three-point studio/outdoor lighting rig
    const hemi = new THREE.HemisphereLight(0x8ec5ff, 0x0f172a, 0.9);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff1dc, 2.0);
    keyLight.position.set(16, 32, 18);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 2;
      keyLight.shadow.camera.far = 75;
      keyLight.shadow.camera.left = -22;
      keyLight.shadow.camera.right = 22;
      keyLight.shadow.camera.top = 30;
      keyLight.shadow.camera.bottom = -12;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00e5ff, 1.05);
    rimLight.position.set(-18, 16, -14);
    scene.add(rimLight);

    // Procedural PBR textures & shared material set
    const galvBump = createGalvanizedBumpTexture(renderer);
    const concreteTex = createConcreteTexture(renderer);
    const groundGridTex = createBlueprintGroundTexture(renderer);
    const contactShadowTex = createContactShadowTexture();
    const beaconGlowTex = createGlowSpriteTexture();
    const mats = createTowerMaterials(galvBump, concreteTex);

    // Terrain with CAD blueprint coordinate grid + central translucent soil cutaway
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: groundGridTex,
      roughness: 0.85,
      metalness: 0.12,
      transparent: true,
      opacity: 0.92,
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(140, 140), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.02;
    ground.receiveShadow = true;
    scene.add(ground);

    // Contact shadow grounding disc beneath central pedestal
    const contactShadowMat = new THREE.MeshBasicMaterial({
      map: contactShadowTex,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const contactShadow = new THREE.Mesh(new THREE.CircleGeometry(3.2, 32), contactShadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.015;
    scene.add(contactShadow);

    // Subtle radial engineering blueprint compass ring on ground
    const compassMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const anchorRadius = 11.4;
    const anchorRing = new THREE.Mesh(new THREE.RingGeometry(anchorRadius - 0.06, anchorRadius + 0.06, 72), compassMat);
    anchorRing.rotation.x = -Math.PI / 2;
    anchorRing.position.y = 0.025;
    scene.add(anchorRing);

    // Stage 1: Foundation, 3-Arm IPE Baseplate & Copper Earthing Cutaway
    const { foundationGroup, basePlateGroup, earthingGroup } = buildCentralFoundation(mats);
    scene.add(foundationGroup);
    scene.add(basePlateGroup);
    scene.add(earthingGroup);

    // 3 Radial Anchor Blocks at exact 120° intervals
    const anchorAngles = [Math.PI / 6, Math.PI / 6 + (Math.PI * 2) / 3, Math.PI / 6 + (Math.PI * 4) / 3];
    const anchors = anchorAngles.map((angle) => {
      const a = buildAnchorBlock(angle, anchorRadius, mats);
      scene.add(a.group);
      return a;
    });

    // Tower Mast Root (pivots slightly during Stage 2 before Stage 3 guy wires pull it plumb)
    const mastPivotGroup = new THREE.Group();
    mastPivotGroup.position.y = 0.72;
    scene.add(mastPivotGroup);

    // 16 Modular Triangular Lattice Sections (16 × 1.5 scene units = 24 units = 48.0m real scale)
    const TOTAL_SECTIONS = 16;
    const SECTION_H = 1.5;
    const FACE_RADIUS = 0.44;
    const sections: Array<{
      group: THREE.Group;
      flangeRing: THREE.Mesh;
      targetY: number;
      tier: 'lower' | 'upper';
    }> = [];

    // 7 alternating ICAO bands across upper 10 sections (sections 6..15)
    for (let i = 0; i < TOTAL_SECTIONS; i++) {
      const isUpper = i >= 6;
      let secMat: THREE.Material = mats.galvanized;
      if (isUpper) {
        const bandIdx = Math.floor((i - 6) / 1.45);
        secMat = bandIdx % 2 === 0 ? mats.icaoRed : mats.icaoWhite;
      }
      const { group: secGroup, flangeRing } = buildGuyedLatticeSection(
        SECTION_H,
        FACE_RADIUS,
        secMat,
        mats.galvanizedDark,
        mats.flangeHighlight,
      );
      const targetY = i * SECTION_H;
      secGroup.position.y = targetY;
      secGroup.visible = false;
      mastPivotGroup.add(secGroup);
      sections.push({
        group: secGroup,
        flangeRing,
        targetY,
        tier: isUpper ? 'upper' : 'lower',
      });
    }

    // 3 Tiers of Guy Cables (Tier 1 at 15m -> y=7.5; Tier 2 at 30m -> y=15.0; Tier 3 at 43.5m -> y=21.75)
    const guyTierHeights = [7.5, 15.0, 21.75];
    interface GuyCableRef {
      mesh: THREE.Mesh;
      tierIndex: number;
      collarPos: THREE.Vector3;
      anchorPos: THREE.Vector3;
    }
    const guyCables: GuyCableRef[] = [];
    const cableUnitGeo = new THREE.CylinderGeometry(0.02, 0.02, 1, 6);
    // Shift cylinder origin to top end so scale.y extends from collar downward toward anchor!
    cableUnitGeo.translate(0, -0.5, 0);

    guyTierHeights.forEach((tierY, tierIndex) => {
      // Triangular mast guy collar ring at this elevation
      const collar = new THREE.Mesh(new THREE.TorusGeometry(FACE_RADIUS * 1.15, 0.035, 6, 3), mats.galvanizedDark);
      collar.rotation.x = Math.PI / 2;
      collar.rotation.z = Math.PI / 6;
      collar.position.y = tierY;
      mastPivotGroup.add(collar);

      anchors.forEach((anchor, anchorIdx) => {
        const angle = anchorAngles[anchorIdx];
        const collarPos = new THREE.Vector3(
          Math.cos(angle) * FACE_RADIUS,
          tierY + 0.72,
          Math.sin(angle) * FACE_RADIUS,
        );
        const anchorPos = anchor.attachmentPoints[tierIndex].clone();
        const mesh = new THREE.Mesh(cableUnitGeo, mats.cable);
        mesh.position.copy(collarPos);
        const dir = new THREE.Vector3().subVectors(anchorPos, collarPos).normalize();
        // Local -Y aligns with dir because geometry extends from 0 to -1
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir);
        mesh.visible = false;
        scene.add(mesh);
        guyCables.push({ mesh, tierIndex, collarPos, anchorPos });
      });
    });

    // Stage 3: Vertical Cyan Laser Plumb-Line + Scanning Ring along mast spine
    const totalMastH = TOTAL_SECTIONS * SECTION_H;
    const laserPlumb = buildLaserPlumbLine(11.5, FACE_RADIUS);
    laserPlumb.group.position.y = 0.72;
    laserPlumb.group.visible = false;
    scene.add(laserPlumb.group);

    // Stage 5: RF Equipment (Parabolic microwave dishes, sector antennas, climbing ladder & waveguide)
    const rfEquipment = buildRFEquipment(totalMastH, FACE_RADIUS, mats);
    rfEquipment.visible = false;
    mastPivotGroup.add(rfEquipment);

    // Stage 6: Apex Lightning Rod, Volumetric Red Aviation Beacon Halo & Cyan RF Wave Rings
    const { apexGroup, beaconLight, beaconHalo, beaconHaloMat, rfRings } = buildApexAndBeacon(
      totalMastH,
      mats,
      beaconGlowTex,
    );
    apexGroup.visible = false;
    mastPivotGroup.add(apexGroup);

    // Stage 6: Translucent Aerodynamic Wind-Flow Ribbons sweeping past the tower
    const windFlow = buildWindFlowRibbons(totalMastH);
    windFlow.group.visible = false;
    scene.add(windFlow.group);

    // Subtle distant night sky stars for Stage 6 atmospheric silhouette
    const starCount = 160;
    const starPositions = new Float32Array(starCount * 3);
    let seed = 9091;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < starCount; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = rand() * Math.PI * 0.42;
      const r = 75 + rand() * 35;
      starPositions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      starPositions[i * 3 + 1] = Math.cos(phi) * r + 8;
      starPositions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xcbd5e1,
      size: 0.45,
      transparent: true,
      opacity: 0.35,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Pre-allocated scratch vectors (Zero GC inside render loop)
    const _desiredCamPos = new THREE.Vector3();
    const _desiredLook = new THREE.Vector3();
    const _currentLook = new THREE.Vector3(0, 0.8, 0);
    const _tmpDir = new THREE.Vector3();

    let isVisible = true;
    const io = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.01 },
    );
    io.observe(track);

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

    const applyAssemblyState = (p: number, elapsed: number) => {
      // --- STAGE 1 (0.00 - 0.16): Foundation, Baseplate, 120° Anchors & Copper Earthing ---
      const foundT = smoothstep01(remap(p, 0.0, 0.09));
      foundationGroup.position.y = THREE.MathUtils.lerp(-0.9, 0, foundT);
      foundationGroup.visible = foundT > 0.01;

      const baseT = smoothstep01(remap(p, 0.05, 0.13));
      basePlateGroup.position.y = THREE.MathUtils.lerp(1.4, 0.52, baseT);
      basePlateGroup.scale.setScalar(0.3 + baseT * 0.7);
      basePlateGroup.visible = baseT > 0.01;

      const anchorT = smoothstep01(remap(p, 0.06, 0.15));
      anchors.forEach((a, idx) => {
        const staggered = smoothstep01(remap(anchorT, idx * 0.15, 0.7 + idx * 0.15));
        a.group.position.y = THREE.MathUtils.lerp(-1.2, 0, staggered);
        a.group.visible = staggered > 0.01;
      });

      // Underground earthing cutaway glows softly during Stage 1, fades cleanly as mast rises
      const earthShow = smoothstep01(remap(p, 0.02, 0.12)) * (1 - smoothstep01(remap(p, 0.22, 0.34)) * 0.78);
      earthingGroup.visible = earthShow > 0.02;
      mats.copper.emissiveIntensity = 0.25 + earthShow * (0.55 + Math.sin(elapsed * 3.5) * 0.25);
      groundMat.opacity = 0.96 - earthShow * 0.34;

      // --- STAGE 2 (0.16 - 0.34): Lower 6 Galvanized Lattice Sections ---
      for (let i = 0; i < 6; i++) {
        const sec = sections[i];
        const segStart = 0.16 + (i / 6) * 0.15;
        const segEnd = segStart + 0.045;
        const t = smoothstep01(remap(p, segStart, segEnd));
        sec.group.visible = t > 0.01;
        sec.group.position.y = sec.targetY + (1 - t) * 4.2;
        const ringMat = sec.flangeRing.material as THREE.MeshBasicMaterial;
        ringMat.opacity = t > 0.7 && t < 0.995 ? (1 - t) * 3.0 : 0;
      }

      // --- STAGE 3 (0.34 - 0.52): Tier 1 Guy Wires + Amber Turnbuckles + Plumb Straightening ---
      const leanIn = smoothstep01(remap(p, 0.20, 0.34));
      const straighten = smoothstep01(remap(p, 0.38, 0.50));
      const leanAngle = THREE.MathUtils.degToRad(leanIn * (1 - straighten) * 1.45);
      mastPivotGroup.rotation.z = leanAngle;

      // Turnbuckle Caution Amber glow peaks prominently during Stage 3 tensioning
      const amberPulse = smoothstep01(remap(p, 0.34, 0.41)) * (1 - smoothstep01(remap(p, 0.51, 0.58)));
      mats.turnbuckle.emissiveIntensity = amberPulse * (2.1 + Math.sin(elapsed * 6.5) * 0.6);

      // Stage 3 Translucent Vertical Cyan Laser Plumb-Line & Sweeping Alignment Disc
      const laserFade = smoothstep01(remap(p, 0.34, 0.38)) * (1 - smoothstep01(remap(p, 0.50, 0.55)));
      laserPlumb.group.visible = laserFade > 0.02;
      if (laserFade > 0.02) {
        const pulse = 0.8 + Math.sin(elapsed * 8.0) * 0.2;
        laserPlumb.coreMat.opacity = laserFade * 0.92 * pulse;
        laserPlumb.sheathMat.opacity = laserFade * 0.28 * pulse;
        const scanNorm = (elapsed * 0.48) % 1;
        laserPlumb.scanRing.position.y = 0.6 + scanNorm * 9.2;
        const ringScale = 0.95 + Math.sin(elapsed * 5.0) * 0.08;
        laserPlumb.scanRing.scale.setScalar(ringScale);
        laserPlumb.scanRingMat.opacity = laserFade * 0.68 * Math.sin(scanNorm * Math.PI);
      }

      // --- STAGE 4 (0.52 - 0.72): Upper 10 ICAO Red & White Lattice Sections + Tiers 2 & 3 Guy Wires ---
      for (let i = 6; i < TOTAL_SECTIONS; i++) {
        const sec = sections[i];
        const localIdx = i - 6;
        const segStart = 0.52 + (localIdx / 10) * 0.165;
        const segEnd = segStart + 0.035;
        const t = smoothstep01(remap(p, segStart, segEnd));
        sec.group.visible = t > 0.01;
        sec.group.position.y = sec.targetY + (1 - t) * 4.6;
        const ringMat = sec.flangeRing.material as THREE.MeshBasicMaterial;
        ringMat.opacity = t > 0.72 && t < 0.995 ? (1 - t) * 3.2 : 0;
      }

      // Update all 3 tiers of guy wires shooting diagonally from mast collar to anchor turnbuckle
      const tierWindows: Array<[number, number]> = [
        [0.35, 0.46],
        [0.57, 0.65],
        [0.64, 0.72],
      ];
      guyCables.forEach((cable) => {
        const [wStart, wEnd] = tierWindows[cable.tierIndex];
        const ct = smoothstep01(remap(p, wStart, wEnd));
        cable.mesh.visible = ct > 0.01;
        if (ct > 0.01) {
          const fullLen = cable.collarPos.distanceTo(cable.anchorPos);
          cable.mesh.scale.set(1, Math.max(0.01, fullLen * ct), 1);
        }
      });

      // --- STAGE 5 (0.72 - 0.88): Microwave Dishes, Sector Antennas, Climbing Ladder & Waveguides ---
      const rfT = smoothstep01(remap(p, 0.72, 0.86));
      rfEquipment.visible = rfT > 0.01;
      rfEquipment.scale.setScalar(0.2 + rfT * 0.8);
      rfEquipment.position.y = (1 - rfT) * 2.2;

      // --- STAGE 6 (0.88 - 1.00): Apex Lightning Rod, Volumetric Beacon Halo, RF Waves & Wind Ribbons ---
      const apexT = smoothstep01(remap(p, 0.87, 0.94));
      apexGroup.visible = apexT > 0.01;
      apexGroup.position.y = totalMastH + (1 - apexT) * 2.4;

      const liveT = smoothstep01(remap(p, 0.89, 0.96));
      // Realistic ICAO red aviation obstruction beacon flash cadence + volumetric sprite halo
      const beaconFlash = liveT * (0.28 + 0.72 * Math.pow(0.5 + 0.5 * Math.sin(elapsed * 3.2), 4));
      mats.beaconRed.emissiveIntensity = 0.25 + beaconFlash * 4.8;
      beaconLight.intensity = beaconFlash * 6.5;
      beaconHaloMat.opacity = liveT * (0.35 + beaconFlash * 0.65);
      const haloScale = 1.9 + beaconFlash * 1.9;
      beaconHalo.scale.set(haloScale, haloScale, 1);

      // Concentric Cyan RF signal wave rings radiating outward
      rfRings.forEach((ring, idx) => {
        const mat = ring.material as THREE.MeshBasicMaterial;
        if (liveT <= 0.02) {
          mat.opacity = 0;
          ring.visible = false;
          return;
        }
        ring.visible = true;
        const cycle = (elapsed * 0.55 + idx / rfRings.length) % 1;
        const scale = 1.2 + cycle * 12.0;
        ring.scale.setScalar(scale);
        mat.opacity = liveT * (1 - cycle) * 0.58;
      });

      // Aerodynamic translucent wind-flow ribbons sweeping past the completed tower
      windFlow.group.visible = liveT > 0.04;
      if (liveT > 0.04) {
        windFlow.ribbons.forEach((r, idx) => {
          const cycle = (elapsed * r.speed + r.phase) % 1;
          r.mesh.position.x = THREE.MathUtils.lerp(-6.5, 6.5, cycle);
          r.mesh.position.y = r.baseY + Math.sin(elapsed * 1.6 + idx) * 0.22;
          const envelope = Math.sin(cycle * Math.PI);
          r.material.opacity = liveT * envelope * 0.34;
        });
      }

      // Dynamic Sky Dome & Fog transition from twilight-blueprint (Stage 1) to deep dusk rim (Stage 6)
      const skyMix = smoothstep01(remap(p, 0.15, 0.98));
      skyDome.update(skyMix);
      (scene.background as THREE.Color).copy(bgColor).lerp(duskColor, skyMix);
      (scene.fog as THREE.FogExp2).color.copy(scene.background as THREE.Color);
      rimLight.color.setHex(skyMix > 0.72 ? 0xe63946 : 0x00e5ff);
      rimLight.intensity = 1.05 + skyMix * 0.35;
      starMat.opacity = 0.22 + skyMix * 0.6;
    };

    const tick = () => {
      if (disposed) return;
      const nowMs = performance.now();
      const dt = Math.min((nowMs - prevTimeMs) / 1000, 0.1);
      prevTimeMs = nowMs;
      const elapsed = (nowMs - startTimeMs) / 1000;

      if (isVisible) {
        smoothProgressRef.current = THREE.MathUtils.damp(
          smoothProgressRef.current,
          targetProgressRef.current,
          9.0,
          dt,
        );
        const p = smoothProgressRef.current;

        applyAssemblyState(p, elapsed);

        // Smooth cinematic camera orbit & crane
        sampleCameraTrack(p, _desiredCamPos, _desiredLook);
        const orbitSway = Math.sin(elapsed * 0.28) * 0.55;
        _desiredCamPos.x += orbitSway;
        camera.position.x = THREE.MathUtils.damp(camera.position.x, _desiredCamPos.x, 5.2, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, _desiredCamPos.y, 5.2, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, _desiredCamPos.z, 5.2, dt);

        _currentLook.x = THREE.MathUtils.damp(_currentLook.x, _desiredLook.x, 5.2, dt);
        _currentLook.y = THREE.MathUtils.damp(_currentLook.y, _desiredLook.y, 5.2, dt);
        _currentLook.z = THREE.MathUtils.damp(_currentLook.z, _desiredLook.z, 5.2, dt);
        _tmpDir.copy(_currentLook);
        camera.lookAt(_tmpDir);

        renderer.render(scene, camera);

        // Throttle React HUD state updates to <= 12Hz
        const now = performance.now();
        if (now - lastHudUpdateRef.current > 85) {
          lastHudUpdateRef.current = now;
          setTelemetry(computeAssemblyTelemetry(p));
        }
      }

      if (isSoftwareGl) {
        scheduleAfterDraw(
          renderer,
          tick,
          (id) => {
            frameId = id;
          },
          85,
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
      st.kill();
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      io.disconnect();
      ro.disconnect();
      cableUnitGeo.dispose();
      skyDome.dispose();
      laserPlumb.dispose();
      windFlow.dispose();
      beaconHaloMat.dispose();
      beaconGlowTex.dispose();
      starGeo.dispose();
      starMat.dispose();
      groundMat.dispose();
      contactShadowMat.dispose();
      compassMat.dispose();
      mats.dispose();
      galvBump.dispose();
      concreteTex.dispose();
      groundGridTex.dispose();
      contactShadowTex.dispose();
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section
      id="assembly"
      ref={trackRef}
      data-testid="scrollytelling-section"
      data-stage={telemetry.stage.id}
      className="relative h-[600vh] bg-[#050911] border-t border-slate-800/80"
    >
      {/* Sticky full-viewport pinned frame */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col md:block">
        {/* Top Minimal Section Title Overlay (non-obstructing) */}
        <div className="hidden md:flex items-center justify-between absolute top-20 inset-x-8 z-20 pointer-events-none">
          <div className="hud-panel px-4 py-2.5 rounded pointer-events-auto">
            <div className="flex items-center gap-3 text-xs">
              <span className="font-telemetry text-[#00E5FF] font-semibold">
                {telemetry.stage.code} / 06
              </span>
              <span aria-hidden="true" className="text-slate-600">|</span>
              <span className="text-slate-200 font-semibold">
                شبیه‌ساز سه‌بعدی مونتاژ دکل مهاری G45
              </span>
            </div>
          </div>

          <div className="hud-panel px-4 py-2.5 rounded flex items-center gap-5 text-xs pointer-events-auto">
            <div>
              <span className="text-slate-400 ml-2">ارتفاع مونتاژ:</span>
              <span className="font-telemetry text-white font-bold text-sm">
                {telemetry.assembledHeightM.toFixed(1)}m
              </span>
            </div>
            <span aria-hidden="true" className="text-slate-700">|</span>
            <div>
              <span className="text-slate-400 ml-2">کشش مهار:</span>
              <span className="font-telemetry text-[#FFB703] font-bold text-sm">
                {telemetry.guyTensionKn.toFixed(1)} kN
              </span>
            </div>
            <span aria-hidden="true" className="text-slate-700">|</span>
            <div>
              <span className="text-slate-400 ml-2">پایداری:</span>
              <span className="font-telemetry text-[#00E5FF] font-bold text-sm">
                {telemetry.stabilityPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Dedicated Empty WebGL Canvas Mount (Top 52% on mobile, full 100% on desktop) */}
        <div
          ref={canvasMountRef}
          data-testid="assembly-3d-canvas"
          className="relative w-full h-[52vh] md:h-full bg-[#050911]"
        />

        {/* Compact Interactive Stage Progress Rail (Left edge on Desktop) */}
        <aside
          aria-label="مراحل نصب دکل"
          className="hidden md:flex flex-col gap-1.5 absolute left-6 top-1/2 -translate-y-1/2 z-20"
        >
          {ASSEMBLY_STAGES.map((stage, idx) => {
            const active = telemetry.stageIndex === idx;
            const passed = telemetry.stageIndex > idx;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => scrollToStage(idx)}
                aria-current={active ? 'step' : undefined}
                className={`group flex items-center gap-2.5 px-3 py-2 rounded text-right transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#0D1422] border border-[#00E5FF]/80 text-white'
                    : 'bg-[#080E1A]/85 border border-slate-700/40 text-slate-400 hover:text-slate-100 hover:border-slate-500/70'
                }`}
              >
                <span
                  className={`font-telemetry text-xs font-bold w-6 text-center ${
                    active ? 'text-[#00E5FF]' : passed ? 'text-[#E63946]' : 'text-slate-500'
                  }`}
                >
                  0{stage.id}
                </span>
                <span className="text-xs font-medium">{stage.shortTitle}</span>
              </button>
            );
          })}
        </aside>

        {/* Bottom Dock Live Telemetry HUD + Stage Narrative (Zero Center Occlusion on Desktop; Clean Bottom Half on Mobile) */}
        <div className="relative md:absolute md:bottom-5 md:inset-x-0 z-20 flex-1 md:flex-none flex flex-col justify-end md:items-center bg-[#060A12] md:bg-transparent border-t border-slate-800 md:border-t-0">
          {/* Desktop Cinema/Zen Collapse Toggle */}
          <button
            type="button"
            onClick={() => setHudCollapsed((prev) => !prev)}
            className="hidden md:inline-flex items-center gap-1.5 mb-2 px-3.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-[#0A101C]/90 border border-slate-700/60 rounded cursor-pointer transition-colors"
          >
            {hudCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>نمایش پنل تله‌متری</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>نمای کامل سازه</span>
              </>
            )}
          </button>

          {!hudCollapsed && (
            <div className="relative w-full md:w-[min(920px,92vw)] hud-panel md:rounded-md p-4 sm:p-5 h-full md:h-auto flex flex-col justify-between">
              {/* Subtle corner registration crosshairs */}
              <span aria-hidden="true" className="hidden md:block absolute top-1.5 right-2 font-telemetry text-[10px] text-[#00E5FF]/60">+</span>
              <span aria-hidden="true" className="hidden md:block absolute top-1.5 left-2 font-telemetry text-[10px] text-[#00E5FF]/60">+</span>

              {/* Mobile Stage Step Switcher */}
              <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-2 mb-2 border-b border-slate-800">
                {ASSEMBLY_STAGES.map((stage, idx) => (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => scrollToStage(idx)}
                    className={`px-2.5 py-1 text-xs font-telemetry rounded shrink-0 cursor-pointer ${
                      telemetry.stageIndex === idx
                        ? 'bg-[#00E5FF] text-[#060A12] font-bold'
                        : 'bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    0{stage.id}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Stage Narrative */}
                <div className="md:col-span-7 space-y-1.5">
                  <div className="flex items-center gap-2.5 text-xs">
                    <span className="font-telemetry text-[#E63946] font-bold whitespace-nowrap shrink-0">
                      STAGE 0{telemetry.stage.id}
                    </span>
                    <span aria-hidden="true" className="text-slate-600 shrink-0">·</span>
                    <span className="text-slate-400 truncate">{telemetry.stage.subtitle}</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-extrabold text-white">
                    {telemetry.stage.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-6">
                    {telemetry.stage.description}
                  </p>
                </div>

                {/* Live Numerical Telemetry Readouts */}
                <div className="md:col-span-5 grid grid-cols-2 gap-2.5 border-t md:border-t-0 md:border-r border-slate-700/50 pt-3 md:pt-0 md:pr-4">
                  <div className="bg-[#060A12]/80 border border-slate-800 rounded px-3 py-2">
                    <div className="text-[11px] text-slate-400">ارتفاع فعلی</div>
                    <div className="font-telemetry text-base font-bold text-white mt-0.5">
                      {telemetry.assembledHeightM.toFixed(1)}m <span className="text-xs text-slate-500">/ 48m</span>
                    </div>
                  </div>
                  <div className="bg-[#060A12]/80 border border-slate-800 rounded px-3 py-2">
                    <div className="text-[11px] text-slate-400">کشش سیم مهار</div>
                    <div className="font-telemetry text-base font-bold text-[#FFB703] mt-0.5">
                      {telemetry.guyTensionKn.toFixed(1)} kN
                    </div>
                  </div>
                  <div className="bg-[#060A12]/80 border border-slate-800 rounded px-3 py-2">
                    <div className="text-[11px] text-slate-400">مقاومت باد / شاقول</div>
                    <div className="font-telemetry text-sm font-semibold text-[#00E5FF] mt-0.5">
                      {telemetry.windResistanceKmh} km/h · {telemetry.plumbErrorDeg.toFixed(2)}°
                    </div>
                  </div>
                  <div className="bg-[#060A12]/80 border border-slate-800 rounded px-3 py-2">
                    <div className="text-[11px] text-slate-400">مقاومت چاه ارت</div>
                    <div className="font-telemetry text-sm font-semibold text-slate-100 mt-0.5">
                      {telemetry.groundingResistanceOhm.toFixed(2)} Ω{' '}
                      <span className="text-[11px] text-slate-400">(&lt; 2 Ω)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Continuous Progress Bar */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/90 flex items-center justify-between gap-4 text-xs">
                <span className="text-slate-400 truncate">{telemetry.stage.keyCheck}</span>
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="w-28 sm:w-40 h-2 bg-[#060A12] border border-slate-700/75 rounded overflow-hidden">
                    <div
                      className="h-full bg-[#00E5FF] transition-transform duration-150 origin-right"
                      style={{
                        transform: `scaleX(${Math.max(0.03, telemetry.progress)})`,
                      }}
                    />
                  </div>
                  <span className="font-telemetry text-slate-200 font-semibold w-9 text-left">
                    {Math.round(telemetry.progress * 100)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
