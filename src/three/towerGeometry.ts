import * as THREE from 'three';

export interface TowerMaterialSet {
  galvanized: THREE.MeshStandardMaterial;
  galvanizedDark: THREE.MeshStandardMaterial;
  icaoRed: THREE.MeshStandardMaterial;
  icaoWhite: THREE.MeshStandardMaterial;
  concrete: THREE.MeshStandardMaterial;
  rebar: THREE.MeshStandardMaterial;
  copper: THREE.MeshStandardMaterial;
  turnbuckle: THREE.MeshStandardMaterial;
  cable: THREE.MeshStandardMaterial;
  dishWhite: THREE.MeshStandardMaterial;
  dishShroud: THREE.MeshStandardMaterial;
  antennaPanel: THREE.MeshStandardMaterial;
  cyanGlow: THREE.MeshBasicMaterial;
  beaconRed: THREE.MeshStandardMaterial;
  flangeHighlight: THREE.MeshBasicMaterial;
  dispose: () => void;
}

export function createTowerMaterials(
  galvBump: THREE.Texture,
  concreteTex: THREE.Texture,
): TowerMaterialSet {
  const galvanized = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    metalness: 0.86,
    roughness: 0.28,
    bumpMap: galvBump,
    bumpScale: 0.015,
  });

  const galvanizedDark = new THREE.MeshStandardMaterial({
    color: 0x8a99ad,
    metalness: 0.88,
    roughness: 0.34,
    bumpMap: galvBump,
    bumpScale: 0.018,
  });

  const icaoRed = new THREE.MeshStandardMaterial({
    color: 0xe63946,
    metalness: 0.22,
    roughness: 0.36,
  });

  const icaoWhite = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    metalness: 0.16,
    roughness: 0.34,
  });

  const concrete = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: concreteTex,
    roughness: 0.88,
    metalness: 0.04,
  });

  const rebar = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    metalness: 0.78,
    roughness: 0.45,
  });

  const copper = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    emissive: 0x92400e,
    emissiveIntensity: 0.45,
    metalness: 0.88,
    roughness: 0.24,
  });

  const turnbuckle = new THREE.MeshStandardMaterial({
    color: 0xdbe4ee,
    emissive: 0xffb703,
    emissiveIntensity: 0.0,
    metalness: 0.85,
    roughness: 0.22,
  });

  const cable = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.9,
    roughness: 0.22,
  });

  const dishWhite = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.2,
    roughness: 0.32,
  });

  const dishShroud = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.45,
    roughness: 0.48,
  });

  const antennaPanel = new THREE.MeshStandardMaterial({
    color: 0xdbe4ee,
    metalness: 0.18,
    roughness: 0.42,
  });

  const cyanGlow = new THREE.MeshBasicMaterial({
    color: 0x00e5ff,
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const beaconRed = new THREE.MeshStandardMaterial({
    color: 0xe63946,
    emissive: 0xff1e2d,
    emissiveIntensity: 0.2,
    roughness: 0.18,
    metalness: 0.1,
  });

  const flangeHighlight = new THREE.MeshBasicMaterial({
    color: 0x00e5ff,
    transparent: true,
    opacity: 0.0,
    depthWrite: false,
  });

  const all: THREE.Material[] = [
    galvanized,
    galvanizedDark,
    icaoRed,
    icaoWhite,
    concrete,
    rebar,
    copper,
    turnbuckle,
    cable,
    dishWhite,
    dishShroud,
    antennaPanel,
    cyanGlow,
    beaconRed,
    flangeHighlight,
  ];

  return {
    galvanized,
    galvanizedDark,
    icaoRed,
    icaoWhite,
    concrete,
    rebar,
    copper,
    turnbuckle,
    cable,
    dishWhite,
    dishShroud,
    antennaPanel,
    cyanGlow,
    beaconRed,
    flangeHighlight,
    dispose: () => {
      all.forEach((m) => m.dispose());
    },
  };
}

/**
 * Helper: Creates a cylindrical strut connecting point A to point B.
 */
function createStrut(
  a: THREE.Vector3,
  b: THREE.Vector3,
  radius: number,
  material: THREE.Material,
  radialSegments = 6,
): THREE.Mesh {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const geo = new THREE.CylinderGeometry(radius, radius, len, radialSegments);
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return mesh;
}

/**
 * Builds a single authentic modular triangular guyed lattice section (3m real -> 1.5 scene units).
 * Replicates the exact 3 vertical pipes + continuous zig-zag serpentine bracing + bolted flange ring
 * observed in the reference photography.
 */
export function buildGuyedLatticeSection(
  height: number,
  faceRadius: number,
  material: THREE.Material,
  boltMaterial: THREE.Material,
  flangeGlowMaterial: THREE.Material,
): { group: THREE.Group; flangeRing: THREE.Mesh } {
  const group = new THREE.Group();
  const legRadius = 0.042;
  const braceRadius = 0.017;
  const bays = 4;

  const corners: THREE.Vector3[] = [];
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3 + Math.PI / 6;
    corners.push(new THREE.Vector3(Math.cos(angle) * faceRadius, 0, Math.sin(angle) * faceRadius));
  }

  // 3 vertical tubular steel legs
  const legGeo = new THREE.CylinderGeometry(legRadius, legRadius, height, 8);
  const collarGeo = new THREE.CylinderGeometry(legRadius * 1.65, legRadius * 1.65, 0.045, 8);

  for (let i = 0; i < 3; i++) {
    const leg = new THREE.Mesh(legGeo, material);
    leg.position.set(corners[i].x, height / 2, corners[i].z);
    leg.castShadow = true;
    group.add(leg);

    // Bottom & top flange sleeve collars + bolts
    const botCollar = new THREE.Mesh(collarGeo, boltMaterial);
    botCollar.position.set(corners[i].x, 0.025, corners[i].z);
    group.add(botCollar);

    const topCollar = new THREE.Mesh(collarGeo, boltMaterial);
    topCollar.position.set(corners[i].x, height - 0.025, corners[i].z);
    group.add(topCollar);
  }

  // Horizontal base & top perimeter ties + zig-zag serpentine bracing on all 3 faces
  const bayH = height / bays;
  for (let face = 0; face < 3; face++) {
    const c1 = corners[face];
    const c2 = corners[(face + 1) % 3];

    // Bottom & top horizontal rung
    group.add(createStrut(new THREE.Vector3(c1.x, 0.04, c1.z), new THREE.Vector3(c2.x, 0.04, c2.z), braceRadius * 1.1, material, 5));
    group.add(createStrut(new THREE.Vector3(c1.x, height - 0.04, c1.z), new THREE.Vector3(c2.x, height - 0.04, c2.z), braceRadius * 1.1, material, 5));

    // Serpentine zig-zag diagonals
    for (let b = 0; b < bays; b++) {
      const y0 = b * bayH + 0.04;
      const y1 = (b + 1) * bayH - 0.04;
      const startCorner = b % 2 === 0 ? c1 : c2;
      const endCorner = b % 2 === 0 ? c2 : c1;
      group.add(
        createStrut(
          new THREE.Vector3(startCorner.x, y0, startCorner.z),
          new THREE.Vector3(endCorner.x, y1, endCorner.z),
          braceRadius,
          material,
          5,
        ),
      );
    }
  }

  // Subtle joint flange pulse ring (lights up cyan when section snaps into position)
  const flangeRing = new THREE.Mesh(
    new THREE.RingGeometry(faceRadius * 0.85, faceRadius * 1.25, 3),
    flangeGlowMaterial.clone(),
  );
  flangeRing.rotation.x = -Math.PI / 2;
  flangeRing.rotation.z = Math.PI / 6;
  flangeRing.position.y = 0.02;
  group.add(flangeRing);

  return { group, flangeRing };
}

/**
 * Builds the central reinforced concrete foundation pedestal, rebar cage cutaway,
 * 3-arm galvanized I-beam (IPE) baseplate (matching IMG_20240311_165917_55f89877.jpg),
 * and central base pivot pin.
 */
export function buildCentralFoundation(mats: TowerMaterialSet): {
  foundationGroup: THREE.Group;
  basePlateGroup: THREE.Group;
  earthingGroup: THREE.Group;
} {
  const foundationGroup = new THREE.Group();

  // Concrete pedestal (bottom-centered at y=0)
  const pedestal = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.52, 2.1), mats.concrete);
  pedestal.position.y = 0.26;
  pedestal.receiveShadow = true;
  pedestal.castShadow = true;
  foundationGroup.add(pedestal);

  // Sub-grade concrete footing outline (visible in cutaway)
  const subFooting = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.75, 2.5),
    new THREE.MeshStandardMaterial({
      color: 0x334155,
      transparent: true,
      opacity: 0.35,
      roughness: 0.9,
      depthWrite: false,
    }),
  );
  subFooting.position.y = -0.38;
  foundationGroup.add(subFooting);

  // Steel Rebar Cage inside foundation pit (matching IMG_20240313_120102_aaab0c4a.jpg)
  const rebarGeoH = new THREE.CylinderGeometry(0.018, 0.018, 2.15, 5);
  const rebarGeoV = new THREE.CylinderGeometry(0.018, 0.018, 0.85, 5);
  for (let i = -2; i <= 2; i++) {
    const offset = i * 0.45;
    const barX = new THREE.Mesh(rebarGeoH, mats.rebar);
    barX.rotation.z = Math.PI / 2;
    barX.position.set(0, -0.18, offset);
    foundationGroup.add(barX);

    const barZ = new THREE.Mesh(rebarGeoH, mats.rebar);
    barZ.rotation.x = Math.PI / 2;
    barZ.position.set(offset, -0.18, 0);
    foundationGroup.add(barZ);

    const vert = new THREE.Mesh(rebarGeoV, mats.rebar);
    vert.position.set(offset, -0.35, i % 2 === 0 ? 0.9 : -0.9);
    foundationGroup.add(vert);
  }

  // 3-Arm Galvanized I-Beam Baseplate (matching IMG_20240311_165917_55f89877.jpg)
  const basePlateGroup = new THREE.Group();
  basePlateGroup.position.y = 0.52;

  // Triangular central plate
  const triShape = new THREE.Shape();
  const rTri = 0.65;
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI * 2) / 3 + Math.PI / 6;
    const x = Math.cos(a) * rTri;
    const y = Math.sin(a) * rTri;
    if (i === 0) triShape.moveTo(x, y);
    else triShape.lineTo(x, y);
  }
  triShape.closePath();

  const plateGeo = new THREE.ExtrudeGeometry(triShape, {
    depth: 0.06,
    bevelEnabled: true,
    bevelSize: 0.01,
    bevelThickness: 0.01,
    bevelSegments: 2,
  });
  plateGeo.rotateX(-Math.PI / 2);
  const centralPlate = new THREE.Mesh(plateGeo, mats.galvanized);
  centralPlate.position.y = 0.09;
  centralPlate.castShadow = true;
  basePlateGroup.add(centralPlate);

  // 3 Radiating IPE I-Beam outriggers at 120°
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3 + Math.PI / 6;
    const ipeGroup = new THREE.Group();
    ipeGroup.rotation.y = -angle;

    const web = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.14, 0.025), mats.galvanizedDark);
    web.position.set(0.58, 0.08, 0);
    const topFlange = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.022, 0.14), mats.galvanized);
    topFlange.position.set(0.58, 0.15, 0);
    const botFlange = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.022, 0.14), mats.galvanized);
    botFlange.position.set(0.58, 0.01, 0);

    ipeGroup.add(web, topFlange, botFlange);
    basePlateGroup.add(ipeGroup);
  }

  // Central tapered pivot pin / socket
  const pivotPin = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 0.24, 10), mats.galvanizedDark);
  pivotPin.position.y = 0.22;
  basePlateGroup.add(pivotPin);

  // Underground Copper Earthing Well & Radial Mesh
  const earthingGroup = new THREE.Group();
  const mainRod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.2, 8), mats.copper);
  mainRod.position.set(1.8, -1.5, 1.2);
  earthingGroup.add(mainRod);

  const copperPlate = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.04), mats.copper);
  copperPlate.position.set(1.8, -2.7, 1.2);
  earthingGroup.add(copperPlate);

  // Radial copper earthing mesh lines + pulse rings
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x00e5ff,
    transparent: true,
    opacity: 0.45,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  for (let r = 1; r <= 3; r++) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(r * 1.1, r * 1.1 + 0.045, 36), ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -0.12;
    earthingGroup.add(ring);
  }

  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI * 2) / 6;
    const strip = createStrut(
      new THREE.Vector3(0, -0.1, 0),
      new THREE.Vector3(Math.cos(a) * 3.4, -0.1, Math.sin(a) * 3.4),
      0.022,
      mats.copper,
      5,
    );
    earthingGroup.add(strip);
  }

  return { foundationGroup, basePlateGroup, earthingGroup };
}

export interface AnchorAssembly {
  group: THREE.Group;
  attachmentPoints: THREE.Vector3[];
  turnbuckleMeshes: THREE.Mesh[];
}

/**
 * Builds a concrete guy-anchor block with rebar formwork, angled anchor rod,
 * trapezoidal 4-bolt equalizer fan plate, and 3 forged turnbuckles (مهارکش)
 * matching IMG_20240311_165901_64857ae2.jpg & ________________eb6e39a1.jpg.
 */
export function buildAnchorBlock(
  angleRad: number,
  radius: number,
  mats: TowerMaterialSet,
): AnchorAssembly {
  const group = new THREE.Group();
  const x = Math.cos(angleRad) * radius;
  const z = Math.sin(angleRad) * radius;
  group.position.set(x, 0, z);
  // Face inward toward tower center (0, 0, 0)
  group.lookAt(0, 0, 0);

  // Concrete anchor block
  const block = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.56, 1.35), mats.concrete);
  block.position.y = 0.28;
  block.castShadow = true;
  block.receiveShadow = true;
  group.add(block);

  // Formwork steel edge trim
  const edgeTrim = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.06, 1.4), mats.galvanizedDark);
  edgeTrim.position.y = 0.57;
  group.add(edgeTrim);

  // Angled embedded steel anchor rod
  const shaft = createStrut(
    new THREE.Vector3(0, 0.35, -0.15),
    new THREE.Vector3(0, 1.02, 0.32),
    0.036,
    mats.galvanized,
    8,
  );
  group.add(shaft);

  // Trapezoidal Equalizer Fan Plate (matching photo 5)
  const fanShape = new THREE.Shape();
  fanShape.moveTo(-0.14, 0);
  fanShape.lineTo(0.14, 0);
  fanShape.lineTo(0.32, 0.36);
  fanShape.lineTo(-0.32, 0.36);
  fanShape.closePath();

  const fanGeo = new THREE.ExtrudeGeometry(fanShape, {
    depth: 0.04,
    bevelEnabled: true,
    bevelSize: 0.008,
    bevelThickness: 0.008,
    bevelSegments: 2,
  });
  const fanPlate = new THREE.Mesh(fanGeo, mats.galvanized);
  fanPlate.position.set(0, 0.92, 0.26);
  fanPlate.rotation.x = 0.52;
  group.add(fanPlate);

  // 3 Forged Turnbuckles (مهارکش) fanning out for the 3 guy tiers
  const turnbuckleMeshes: THREE.Mesh[] = [];
  const attachmentPoints: THREE.Vector3[] = [];
  const offsetsX = [-0.2, 0, 0.2];
  const tbGeo = new THREE.CylinderGeometry(0.038, 0.038, 0.44, 6);

  // Compute world attachment points accurately
  group.updateMatrixWorld(true);

  offsetsX.forEach((ox, idx) => {
    const tb = new THREE.Mesh(tbGeo, mats.turnbuckle);
    tb.position.set(ox, 1.24 + idx * 0.04, 0.46);
    tb.rotation.x = 0.62 - idx * 0.14;
    group.add(tb);
    turnbuckleMeshes.push(tb);

    // Local tip of turnbuckle in anchor's local coordinates
    const tipLocal = new THREE.Vector3(ox, 1.38 + idx * 0.05, 0.56);
    tipLocal.applyMatrix4(group.matrixWorld);
    attachmentPoints.push(tipLocal);
  });

  return { group, attachmentPoints, turnbuckleMeshes };
}

/**
 * Builds RF equipment payload (Stage 5):
 * - Large black shrouded parabolic microwave dish (matching IMG-20250908-WA0029_cc57b079.jpg)
 * - White parabolic microwave dish with feed horn
 * - 3 Rectangular cellular sector panel antennas
 * - Vertical cable ladder & coax waveguide
 */
export function buildRFEquipment(
  towerHeight: number,
  faceRadius: number,
  mats: TowerMaterialSet,
): THREE.Group {
  const rfGroup = new THREE.Group();

  // 1. Large black shrouded parabolic microwave dish
  const shroudedDish = new THREE.Group();
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.64, 0.46, 24, 1, true), mats.dishShroud);
  drum.rotation.z = Math.PI / 2;
  const radome = new THREE.Mesh(new THREE.CircleGeometry(0.68, 24), mats.dishWhite);
  radome.rotation.y = Math.PI / 2;
  radome.position.x = 0.23;
  const backCap = new THREE.Mesh(new THREE.CylinderGeometry(0.64, 0.22, 0.22, 20), mats.dishShroud);
  backCap.rotation.z = Math.PI / 2;
  backCap.position.x = -0.34;
  const mountArm = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.6, 8), mats.galvanizedDark);
  mountArm.rotation.z = Math.PI / 2;
  mountArm.position.x = -0.55;
  shroudedDish.add(drum, radome, backCap, mountArm);
  shroudedDish.position.set(faceRadius + 0.62, towerHeight * 0.84, 0.15);
  rfGroup.add(shroudedDish);

  // 2. White parabolic dish (opposite azimuth) using LatheGeometry for authentic parabolic curve
  const dishCurve: THREE.Vector2[] = [];
  for (let i = 0; i <= 10; i++) {
    const r = (i / 10) * 0.56;
    const depth = r * r * 0.62;
    dishCurve.push(new THREE.Vector2(r, depth));
  }
  const whiteDishGroup = new THREE.Group();
  const reflector = new THREE.Mesh(new THREE.LatheGeometry(dishCurve, 24), mats.dishWhite);
  reflector.rotation.z = -Math.PI / 2;
  const feedRod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.48, 8), mats.galvanizedDark);
  feedRod.rotation.z = Math.PI / 2;
  feedRod.position.x = 0.24;
  const feedTip = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.05, 0.08, 12), mats.icaoRed);
  feedTip.rotation.z = Math.PI / 2;
  feedTip.position.x = 0.48;
  whiteDishGroup.add(reflector, feedRod, feedTip);
  whiteDishGroup.rotation.y = Math.PI * 0.72;
  whiteDishGroup.position.set(-faceRadius - 0.36, towerHeight * 0.76, -0.25);
  rfGroup.add(whiteDishGroup);

  // 3. Three Cellular Sector Panel Antennas at 120° around the top mast collar
  const panelGeo = new THREE.BoxGeometry(0.22, 1.35, 0.11);
  const bracketGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.48, 6);
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3;
    const sector = new THREE.Group();
    const panel = new THREE.Mesh(panelGeo, mats.antennaPanel);
    panel.position.set(faceRadius + 0.42, 0, 0);
    const brkTop = new THREE.Mesh(bracketGeo, mats.galvanizedDark);
    brkTop.rotation.z = Math.PI / 2;
    brkTop.position.set(faceRadius + 0.18, 0.42, 0);
    const brkBot = new THREE.Mesh(bracketGeo, mats.galvanizedDark);
    brkBot.rotation.z = Math.PI / 2;
    brkBot.position.set(faceRadius + 0.18, -0.42, 0);
    sector.add(panel, brkTop, brkBot);
    sector.rotation.y = angle;
    sector.position.y = towerHeight * 0.91;
    rfGroup.add(sector);
  }

  // 4. Vertical climbing ladder (rails + horizontal rungs) & coaxial waveguide running along the mast
  const ladderH = towerHeight * 0.92;
  const railGeo = new THREE.CylinderGeometry(0.016, 0.016, ladderH, 6);
  const rail1 = new THREE.Mesh(railGeo, mats.galvanizedDark);
  rail1.position.set(-faceRadius * 0.58, ladderH / 2 + 0.7, faceRadius * 0.86);
  const rail2 = new THREE.Mesh(railGeo, mats.galvanizedDark);
  rail2.position.set(-faceRadius * 0.22, ladderH / 2 + 0.7, faceRadius * 0.96);
  const coax = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, ladderH, 6), mats.dishShroud);
  coax.position.set(-faceRadius * 0.4, ladderH / 2 + 0.7, faceRadius * 0.92);
  rfGroup.add(rail1, rail2, coax);

  // Horizontal climbing ladder rungs every 0.55 units
  const rungCount = Math.floor(ladderH / 0.55);
  const rungStart = new THREE.Vector3(-faceRadius * 0.58, 0, faceRadius * 0.86);
  const rungEnd = new THREE.Vector3(-faceRadius * 0.22, 0, faceRadius * 0.96);
  const rungDir = new THREE.Vector3().subVectors(rungEnd, rungStart);
  const rungLen = rungDir.length();
  const rungGeo = new THREE.CylinderGeometry(0.01, 0.01, rungLen, 5);
  const rungQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), rungDir.normalize());
  const rungMidX = (rungStart.x + rungEnd.x) * 0.5;
  const rungMidZ = (rungStart.z + rungEnd.z) * 0.5;
  for (let r = 0; r < rungCount; r++) {
    const rung = new THREE.Mesh(rungGeo, mats.galvanized);
    rung.position.set(rungMidX, 0.9 + r * 0.55, rungMidZ);
    rung.quaternion.copy(rungQuat);
    rfGroup.add(rung);
  }

  return rfGroup;
}

export interface LaserPlumbAssembly {
  group: THREE.Group;
  coreMat: THREE.MeshBasicMaterial;
  sheathMat: THREE.MeshBasicMaterial;
  scanRing: THREE.Mesh;
  scanRingMat: THREE.MeshBasicMaterial;
  dispose: () => void;
}

/**
 * Builds Stage 3 translucent cyan vertical laser plumb-line + horizontal scanning alignment ring
 * that sweeps along the tower spine confirming exact 0.00° verticality.
 */
export function buildLaserPlumbLine(
  beamHeight: number,
  faceRadius: number,
): LaserPlumbAssembly {
  const group = new THREE.Group();

  const coreGeo = new THREE.CylinderGeometry(0.025, 0.025, beamHeight, 10);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x67f5ff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const coreBeam = new THREE.Mesh(coreGeo, coreMat);
  coreBeam.position.y = beamHeight / 2;
  group.add(coreBeam);

  const sheathGeo = new THREE.CylinderGeometry(0.09, 0.09, beamHeight, 12);
  const sheathMat = new THREE.MeshBasicMaterial({
    color: 0x00e5ff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const sheathBeam = new THREE.Mesh(sheathGeo, sheathMat);
  sheathBeam.position.y = beamHeight / 2;
  group.add(sheathBeam);

  const scanGeo = new THREE.RingGeometry(faceRadius * 1.15, faceRadius * 1.95, 36);
  const scanRingMat = new THREE.MeshBasicMaterial({
    color: 0x00e5ff,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const scanRing = new THREE.Mesh(scanGeo, scanRingMat);
  scanRing.rotation.x = -Math.PI / 2;
  scanRing.position.y = 2.0;
  group.add(scanRing);

  return {
    group,
    coreMat,
    sheathMat,
    scanRing,
    scanRingMat,
    dispose: () => {
      coreGeo.dispose();
      coreMat.dispose();
      sheathGeo.dispose();
      sheathMat.dispose();
      scanGeo.dispose();
      scanRingMat.dispose();
    },
  };
}

export interface WindFlowAssembly {
  group: THREE.Group;
  ribbons: Array<{
    mesh: THREE.Mesh;
    material: THREE.MeshBasicMaterial;
    baseY: number;
    speed: number;
    phase: number;
  }>;
  dispose: () => void;
}

/**
 * Builds Stage 6 translucent aerodynamic wind-flow ribbons sweeping past the tower structure
 * to visually communicate 160 km/h structural wind stability.
 */
export function buildWindFlowRibbons(towerHeight: number): WindFlowAssembly {
  const group = new THREE.Group();
  const ribbons: WindFlowAssembly['ribbons'] = [];
  const geometries: THREE.BufferGeometry[] = [];

  const ribbonSpecs = [
    { y: towerHeight * 0.28, z: -2.4, amp: 0.9, speed: 0.42, phase: 0.0 },
    { y: towerHeight * 0.45, z: 2.1, amp: -1.1, speed: 0.48, phase: 0.22 },
    { y: towerHeight * 0.62, z: -1.6, amp: 0.85, speed: 0.54, phase: 0.45 },
    { y: towerHeight * 0.76, z: 1.8, amp: -0.95, speed: 0.58, phase: 0.68 },
    { y: towerHeight * 0.88, z: -1.1, amp: 0.75, speed: 0.62, phase: 0.84 },
    { y: towerHeight * 0.96, z: 1.2, amp: -0.7, speed: 0.66, phase: 0.35 },
  ];

  ribbonSpecs.forEach((spec, idx) => {
    const pts = [
      new THREE.Vector3(-12, 0, spec.z),
      new THREE.Vector3(-5, 0.35, spec.z + spec.amp * 0.7),
      new THREE.Vector3(0, 0.1, spec.z + spec.amp * 1.15),
      new THREE.Vector3(5.5, -0.25, spec.z + spec.amp * 0.45),
      new THREE.Vector3(12, 0.15, spec.z - spec.amp * 0.2),
    ];
    const curve = new THREE.CatmullRomCurve3(pts);
    const geo = new THREE.TubeGeometry(curve, 28, 0.045, 6, false);
    geometries.push(geo);

    const material = new THREE.MeshBasicMaterial({
      color: idx % 2 === 0 ? 0x00e5ff : 0x94a3b8,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.y = spec.y;
    group.add(mesh);

    ribbons.push({
      mesh,
      material,
      baseY: spec.y,
      speed: spec.speed,
      phase: spec.phase,
    });
  });

  return {
    group,
    ribbons,
    dispose: () => {
      geometries.forEach((g) => g.dispose());
      ribbons.forEach((r) => r.material.dispose());
    },
  };
}

/**
 * Builds Stage 6 Apex Lightning Arrestor, Dual ICAO Red LED Aviation Beacon with
 * additive volumetric halo sprite, and Concentric Cyan RF Signal Wave Rings.
 */
export function buildApexAndBeacon(
  towerTopY: number,
  mats: TowerMaterialSet,
  beaconGlowTexture?: THREE.Texture,
): {
  apexGroup: THREE.Group;
  beaconLight: THREE.PointLight;
  beaconGlobe: THREE.Mesh;
  beaconHalo: THREE.Sprite;
  beaconHaloMat: THREE.SpriteMaterial;
  rfRings: THREE.Mesh[];
} {
  const apexGroup = new THREE.Group();
  apexGroup.position.y = towerTopY;

  // Apex mounting cap
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.26, 0.14, 6), mats.galvanizedDark);
  cap.position.y = 0.07;
  apexGroup.add(cap);

  // Tall Lightning Arrestor Spike (صاعقه‌گیر)
  const mastRod = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.042, 2.2, 8), mats.galvanized);
  mastRod.position.y = 1.15;
  apexGroup.add(mastRod);

  const copperTip = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.34, 8), mats.copper);
  copperTip.position.y = 2.38;
  apexGroup.add(copperTip);

  // ICAO Aviation Obstruction Beacon Arm & Red LED Dome
  const beaconArm = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.04, 0.04), mats.galvanizedDark);
  beaconArm.position.set(0.22, 0.42, 0);
  apexGroup.add(beaconArm);

  const beaconBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.1, 12), mats.dishShroud);
  beaconBase.position.set(0.38, 0.49, 0);
  apexGroup.add(beaconBase);

  const beaconGlobe = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 12), mats.beaconRed);
  beaconGlobe.position.set(0.38, 0.6, 0);
  apexGroup.add(beaconGlobe);

  const beaconHaloMat = new THREE.SpriteMaterial({
    map: beaconGlowTexture ?? null,
    color: 0xff3b4a,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const beaconHalo = new THREE.Sprite(beaconHaloMat);
  beaconHalo.position.set(0.38, 0.61, 0);
  beaconHalo.scale.set(2.2, 2.2, 1);
  apexGroup.add(beaconHalo);

  const beaconLight = new THREE.PointLight(0xff2438, 0, 14, 1.8);
  beaconLight.position.set(0.38, 0.62, 0);
  apexGroup.add(beaconLight);

  // 3 Concentric RF Signal Wave Rings
  const rfRings: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.92, 1.0, 48), ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -1.6;
    apexGroup.add(ring);
    rfRings.push(ring);
  }

  return { apexGroup, beaconLight, beaconGlobe, beaconHalo, beaconHaloMat, rfRings };
}

/**
 * Builds tapered Self-Supporting Lattice Tower (3-Legged or 4-Legged) for the Interactive Comparison Canvas.
 */
export function buildSelfSupportingTower(
  legs: 3 | 4,
  mats: TowerMaterialSet,
): THREE.Group {
  const group = new THREE.Group();
  const totalHeight = 13.5;
  const segments = 9;
  const baseRadius = legs === 4 ? 2.15 : 1.95;
  const topRadius = 0.45;
  const segH = totalHeight / segments;

  const cornerAt = (segIdx: number, legIdx: number): THREE.Vector3 => {
    const t = segIdx / segments;
    // Authentic slight Eiffel-style parabolic taper
    const radius = THREE.MathUtils.lerp(baseRadius, topRadius, Math.pow(t, 0.82));
    const angle = (legIdx * Math.PI * 2) / legs + (legs === 4 ? Math.PI / 4 : Math.PI / 6);
    return new THREE.Vector3(Math.cos(angle) * radius, t * totalHeight, Math.sin(angle) * radius);
  };

  // Concrete foundation pads under each leg
  for (let l = 0; l < legs; l++) {
    const p0 = cornerAt(0, l);
    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.45, 0.75), mats.concrete);
    pad.position.set(p0.x, 0.22, p0.z);
    group.add(pad);
  }

  for (let s = 0; s < segments; s++) {
    const mat = s >= 5 ? (s % 2 === 0 ? mats.icaoWhite : mats.icaoRed) : mats.galvanized;
    const legR = THREE.MathUtils.lerp(0.085, 0.042, s / segments);
    const braceR = THREE.MathUtils.lerp(0.032, 0.018, s / segments);

    for (let l = 0; l < legs; l++) {
      const a0 = cornerAt(s, l);
      const a1 = cornerAt(s + 1, l);
      const b0 = cornerAt(s, (l + 1) % legs);
      const b1 = cornerAt(s + 1, (l + 1) % legs);

      // Leg segment
      group.add(createStrut(a0, a1, legR, mat, 7));
      // Horizontal tie
      group.add(createStrut(a1, b1, braceR * 1.05, mat, 5));
      // X-bracing
      group.add(createStrut(a0, b1, braceR, mat, 5));
      group.add(createStrut(b0, a1, braceR, mat, 5));
    }
  }

  // Maintenance platform near top
  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(topRadius * 1.9, topRadius * 1.9, 0.08, legs === 4 ? 4 : 6),
    mats.galvanizedDark,
  );
  platform.position.y = totalHeight - segH * 0.7;
  group.add(platform);

  // Antennas & Lightning rod
  const rf = buildRFEquipment(totalHeight, topRadius, mats);
  rf.scale.setScalar(0.78);
  rf.position.y = totalHeight * 0.2;
  group.add(rf);

  const lightning = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.035, 1.5, 6), mats.copper);
  lightning.position.y = totalHeight + 0.75;
  group.add(lightning);

  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), mats.beaconRed);
  beacon.position.set(0.24, totalHeight + 0.35, 0);
  group.add(beacon);

  return group;
}

/**
 * Builds a compact Guyed Tower (G45) with 120° guy cables & concrete anchor pads
 * for the Interactive Comparison Canvas.
 */
export function buildCompactGuyedTower(mats: TowerMaterialSet): THREE.Group {
  const group = new THREE.Group();
  const totalHeight = 14.0;
  const sections = 8;
  const secH = totalHeight / sections;
  const faceRadius = 0.36;
  const anchorRadius = 5.2;

  // Central pad
  const pad = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.32, 1.1), mats.concrete);
  pad.position.y = 0.16;
  group.add(pad);

  for (let s = 0; s < sections; s++) {
    const mat = s >= 3 ? (s % 2 === 1 ? mats.icaoRed : mats.icaoWhite) : mats.galvanized;
    const { group: sec } = buildGuyedLatticeSection(secH, faceRadius, mat, mats.galvanizedDark, mats.flangeHighlight);
    sec.position.y = 0.32 + s * secH;
    group.add(sec);
  }

  // 3 Anchor blocks + 3 tiers of guy cables
  const tiers = [0.32 + secH * 2.8, 0.32 + secH * 5.4, 0.32 + secH * 7.6];
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3 + Math.PI / 6;
    const ax = Math.cos(angle) * anchorRadius;
    const az = Math.sin(angle) * anchorRadius;

    const anchorPad = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.36, 0.7), mats.concrete);
    anchorPad.position.set(ax, 0.18, az);
    group.add(anchorPad);

    const anchorTip = new THREE.Vector3(ax, 0.42, az);
    tiers.forEach((tierY) => {
      const mastPt = new THREE.Vector3(Math.cos(angle) * faceRadius, tierY, Math.sin(angle) * faceRadius);
      group.add(createStrut(mastPt, anchorTip, 0.016, mats.cable, 5));
    });
  }

  // Dishes + apex
  const rf = buildRFEquipment(totalHeight, faceRadius, mats);
  rf.scale.setScalar(0.68);
  rf.position.y = totalHeight * 0.28;
  group.add(rf);

  const lightning = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.032, 1.4, 6), mats.copper);
  lightning.position.y = totalHeight + 0.9;
  group.add(lightning);

  return group;
}
