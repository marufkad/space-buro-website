import assert from 'node:assert/strict';
import test from 'node:test';
import { pathFor, projectPath } from '../app/site.ts';

test('canonical paths keep the language, query and fragment with one trailing slash', () => {
  assert.equal(pathFor('ru'), '/');
  assert.equal(pathFor('en'), '/en/');
  assert.equal(pathFor('ru', '/calculator/'), '/calculator/');
  assert.equal(pathFor('en', '/privacy'), '/en/privacy/');
  assert.equal(pathFor('en', '/#contact'), '/en/#contact');
  assert.equal(pathFor('ru', '/calculator?source=instagram#calculator'), '/calculator/?source=instagram#calculator');
  assert.equal(projectPath('en', { id: 'al-furjan-villa', status: 'completed' }), '/en/projects/al-furjan-villa/');
  assert.equal(projectPath('ru', { id: 'china-furniture-sourcing', status: 'service' }), '/china-furniture/');
});
