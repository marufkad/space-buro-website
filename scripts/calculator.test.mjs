import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateEstimate, formatAed } from '../app/calculatorMath.ts';

const defaults = {
  calculatorType: 'renovation', area: 100, propertyType: 'apartment',
  renovationLevel: 'standard', furnitureMeters: 12, furnitureLevel: 'standard', includeVat: false,
};
const estimate = changes => calculateEstimate({ ...defaults, ...changes });
const displayed = result => result.range.map(value => formatAed(value, 'en'));

test('apartment, villa and commercial estimates retain the agreed rates and VAT', () => {
  assert.deepEqual(displayed(estimate()), ['111,000', '163,000']);
  assert.deepEqual(displayed(estimate({ includeVat: true })), ['116,000', '171,000']);
  assert.deepEqual(displayed(estimate({ propertyType: 'villa' })), ['124,000', '182,000']);
  assert.deepEqual(displayed(estimate({ propertyType: 'commercial' })), ['119,000', '176,000']);
  assert.deepEqual(estimate().weeks, [8, 14]);
});

test('renovation limits preserve both prices and duration', () => {
  const minimum = estimate({ area: 30, renovationLevel: 'cosmetic' });
  assert.deepEqual(displayed(minimum), ['11,000', '17,000']);
  assert.deepEqual(minimum.weeks, [4, 8]);
  const maximum = estimate({ area: 600, propertyType: 'villa', renovationLevel: 'premium', includeVat: true });
  assert.deepEqual(displayed(maximum), ['1,376,000', '2,110,000']);
  assert.deepEqual(maximum.weeks, [16, 24]);
  assert.deepEqual(estimate({ area: 150 }).weeks, [8, 14]);
  assert.deepEqual(estimate({ area: 160 }).weeks, [9, 15]);
  assert.deepEqual(estimate({ area: 270 }).weeks, [9, 15]);
  assert.deepEqual(estimate({ area: 280 }).weeks, [10, 16]);
});

test('furniture estimates preserve material class, VAT, limits and duration', () => {
  const standard = estimate({ calculatorType: 'furniture' });
  assert.deepEqual(displayed(standard), ['22,000', '40,000']);
  assert.deepEqual(standard.weeks, [5, 9]);
  assert.deepEqual(displayed(estimate({ calculatorType: 'furniture', furnitureMeters: 2 })), ['4,000', '7,000']);
  const premium = estimate({ calculatorType: 'furniture', furnitureMeters: 60, furnitureLevel: 'premium', includeVat: true });
  assert.deepEqual(displayed(premium), ['153,000', '281,000']);
  assert.deepEqual(premium.weeks, [8, 13]);
});

test('rounding and both languages remain consistent at thousand boundaries', () => {
  assert.equal(formatAed(110499, 'en'), '110,000');
  assert.equal(formatAed(110500, 'en'), '111,000');
  assert.equal(formatAed(110500, 'ru'), '111\u00a0000');
});
