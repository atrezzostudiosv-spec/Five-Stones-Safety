import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const base = 'http://127.0.0.1:4173/';
const output = 'artifacts/qa';
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [];

try {
  for (const width of [375, 768, 1024, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(width + ': ' + error.message));
    await page.goto(base + 'index.html', { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.locator('[data-atz-id="ATZ-SVC-001"]').waitFor();
    assert.equal(await page.locator('[data-svc-card]').count(), 5, 'Five ATREZZO service cards at ' + width);
    assert.equal(await page.locator('[data-atz-id="ATZ-MOT-001"]').count(), 1);
    assert.equal(await page.locator('.atz-transition-layer').count(), 1, 'Veil runtime active at ' + width);
    const overflow = await page.evaluate(() => ({ total: document.documentElement.scrollWidth, viewport: innerWidth }));
    assert.ok(overflow.total <= overflow.viewport + 3, 'Horizontal document overflow at ' + width + ': ' + JSON.stringify(overflow));
    await page.screenshot({ path: path.join(output, 'home-first-screen-' + width + '.png'), animations: 'disabled' });
    await page.locator('[data-atz-id="ATZ-SVC-001"]').scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(output, 'home-bento-' + width + '.png'), animations: 'disabled' });
    if (width === 375 || width === 1440) {
      await page.locator('.clarity-delivery').scrollIntoViewIfNeeded();
      await page.screenshot({path: path.join(output, 'home-delivery-' + width + '.png'), animations:'disabled'});
      assert.equal(await page.locator('.clarity-delivery__rail li').count(), 5);
      assert.equal(await page.locator('.clarity-delivery img').count(), 0, 'Do not insert unrelated photo into delivery');
    }
    if (width === 375) {
      const rail = page.locator('[data-svc-rail]');
      await rail.focus();
      const before = await rail.evaluate(node => node.scrollLeft);
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(450);
      const after = await rail.evaluate(node => node.scrollLeft);
      assert.ok(after > before, 'ATZ-SVC-001 keyboard carousel does not move');
    }
    if (width === 1440) {
      const link = page.locator('.desktop-nav a[href*="safety-platform"]').first();
      await link.click();
      await page.waitForURL('**/safety-platform/index.html', { timeout: 15000 });
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.locator('.atz-transition-layer').count(), 1);
      await page.goto(base + 'our-approach/index.html', { waitUntil: 'domcontentloaded' });
      assert.equal(await page.locator('[data-atz-id="ATZ-MOT-006"]').count(), 1);
      await page.goto(base + 'videos/index.html', { waitUntil: 'domcontentloaded' });
      assert.ok(await page.locator('[data-play-video]').count() > 0, 'Video library lost in-page playback');
    }
    if(width===375 || width===1440){
      await page.goto(base + 'safety-platform/index.html',{waitUntil:'domcontentloaded'});
      await page.locator('.clarity-response').scrollIntoViewIfNeeded();
      assert.equal(await page.locator('.clarity-response__stage').count(),3);
      assert.equal(await page.locator('.mini-case').count(),0);
      await page.screenshot({path:path.join(output,'platform-response-'+width+'.png'),animations:'disabled'});
      await page.goto(base + 'our-approach/index.html',{waitUntil:'domcontentloaded'});
      assert.equal(await page.locator('[data-am-journey-step]').count(),5);
      assert.equal(await page.locator('[data-am-journey-frame]').count(),5);
      assert.equal(await page.locator('.capability-band').count(),0,'Duplicative yellow band must be removed');
      assert.equal(await page.locator('[data-am-journey-step] img').count(),0,'Unrelated stock photos removed from mobile stages');
      if(width===375){
        const h=await page.locator('[data-am-journey-step]').last().evaluate(e=>e.getBoundingClientRect().height);
        assert.ok(h<490,'Mobile support step too tall: '+h);
      }
      await page.locator('[data-am-journey-step]').last().scrollIntoViewIfNeeded();
      await page.waitForTimeout(1250);
      if(width===1440) assert.equal(await page.locator('[data-am-journey-frame].am-active').last().getAttribute('aria-hidden'),'false');
      assert.equal(await page.locator('[data-am-journey-counter]:visible').count(),0,'No double counters over visuals');
      await page.screenshot({path:path.join(output,'approach-support-'+width+'.png'),animations:'disabled'});
      const pageOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
      assert.ok(pageOverflow<=3,'Approach overflows viewport at '+width);
    }
    await context.close();
  }
  const reduced = await browser.newContext({ viewport: {width: 375, height: 812}, reducedMotion: 'reduce' });
  const reducedPage = await reduced.newPage();
  reducedPage.on('pageerror', error => errors.push('reduced: ' + error.message));
  await reducedPage.goto(base + 'index.html', {waitUntil:'domcontentloaded'});
  await reducedPage.locator('[data-atz-id="ATZ-SVC-001"]').waitFor();
  await reducedPage.screenshot({ path: path.join(output, 'home-reduced-motion.png'), animations: 'disabled' });
  assert.equal(await reducedPage.locator('[data-svc-card]').count(), 5);
  await reduced.close();
  assert.deepEqual(errors, [], 'Uncaught browser JavaScript errors');
  console.log('PASS — responsive Home, 4 Atrezzo components, mobile keyboard carousel, multi-page Veil and reduced motion');
} finally {
  await browser.close();
}
