import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ASSEMBLY_STAGES,
  COMPANY_NAME,
  COMPANY_PHONE,
  computeAssemblyTelemetry,
} from './engineeringCalc';

test('brand identity constants match زرین دکل سازان سلمانی and phone 0914730091', () => {
  assert.equal(COMPANY_NAME, 'زرین دکل سازان سلمانی');
  assert.equal(COMPANY_PHONE, '0914730091');
});

test('scrollytelling telemetry starts grounded, activates laser scan in Stage 3, and reaches 48m full operation in Stage 6', () => {
  const start = computeAssemblyTelemetry(0);
  assert.equal(start.stageIndex, 0);
  assert.equal(start.assembledHeightM, 0);
  assert.equal(start.activeGuyTiers, 0);
  assert.equal(start.laserScanActive, false);
  assert.equal(start.rfActive, false);
  assert.equal(start.windFlowActive, false);

  const stage3Mid = computeAssemblyTelemetry(0.45);
  assert.equal(stage3Mid.stageIndex, 2);
  assert.equal(stage3Mid.assembledHeightM, 18);
  assert.equal(stage3Mid.activeGuyTiers, 1);
  assert.equal(stage3Mid.laserScanActive, true);
  assert.ok(stage3Mid.guyTensionKn > 0);

  const stage3End = computeAssemblyTelemetry(0.51);
  assert.equal(stage3End.plumbErrorDeg, 0);

  const end = computeAssemblyTelemetry(1);
  assert.equal(end.stageIndex, ASSEMBLY_STAGES.length - 1);
  assert.equal(end.assembledHeightM, 48);
  assert.equal(end.activeGuyTiers, 3);
  assert.equal(end.windResistanceKmh, 160);
  assert.ok(end.groundingResistanceOhm < 2);
  assert.equal(end.plumbErrorDeg, 0);
  assert.equal(end.rfActive, true);
  assert.equal(end.windFlowActive, true);
});

test('scrollytelling telemetry safely clamps out-of-bounds and NaN progress values', () => {
  const low = computeAssemblyTelemetry(-0.4);
  assert.equal(low.progress, 0);
  assert.equal(low.stageIndex, 0);

  const high = computeAssemblyTelemetry(1.8);
  assert.equal(high.progress, 1);
  assert.equal(high.assembledHeightM, 48);

  const nan = computeAssemblyTelemetry(Number.NaN);
  assert.equal(nan.progress, 0);
});
