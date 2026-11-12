import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';
const base='http://127.0.0.1:4173/', output='artifacts/qa';
fs.mkdirSync(output,{recursive:true});
const browser=await chromium.launch({headless:true});
const errors=[];
const sizes=[375,768,1024,1440];
const routeFiles=[];
function walk(dir){for(const x of fs.readdirSync(dir,{withFileTypes:true})){if(x.name.startsWith('.')||['node_modules','artifacts','components'].includes(x.name))continue;const p=path.join(dir,x.name);if(x.isDirectory())walk(p);else if(x.name==='index.html')routeFiles.push(p.replaceAll('\\','/'));}}
walk('.');
assert.equal(routeFiles.length,77,'All original site route files must remain');
const overflow=async(page,label)=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=3,'Horizontal overflow '+label);
const goto=async(page,route)=>{const r=await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:30000});assert.ok(r?.ok(),route+' HTTP response');await page.waitForTimeout(450);};
const shot=async(page,loc,name)=>{await page.locator(loc).first().scrollIntoViewIfNeeded();await page.waitForTimeout(450);await page.screenshot({path:path.join(output,name+'.png'),animations:'disabled'});};
const rail=async(page,prefix)=>{
 const root=page.locator('[data-atz-id="ATZ-NAV-002"]');
 assert.equal(await root.count(),1);assert.equal(await root.locator('.atz-chapter-block').count(),5);
 assert.equal(await root.locator('[data-azn1-rail] a').count(),5);
 for(const id of ['implementation','communications','training','testing','support'])assert.equal(await page.locator('#'+prefix+'-'+id).count(),1);
 await root.locator('[data-azn1-rail] a').last().click();
 await page.waitForTimeout(850);
 assert.equal(await page.evaluate(()=>location.hash),'#'+prefix+'-support','Native chapter anchor');
 assert.equal(await root.locator('[data-azn1-rail] a[aria-current="location"]').count(),1);
 assert.equal(await root.locator('[data-azn1-rail] a[aria-current="location"]').getAttribute('href'),'#'+prefix+'-support','Original rail tracks selected chapter');
 assert.equal(await root.locator('img').count(),0,'No unrelated imagery');
};
try{
 for(const width of sizes){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'no-preference'});const page=await context.newPage();
  page.on('pageerror',e=>errors.push(width+': '+e.message));
  page.on('console',m=>{if(m.type()==='warning'&&/ATZ-NAV-002 static fallback|ATZ-SEC-009 static fallback/.test(m.text()))errors.push(m.text());});
  await goto(page,'index.html');await overflow(page,'home '+width);
  assert.equal(await page.locator('[data-atz-id="ATZ-SVC-001"] [data-svc-card]').count(),5);
  assert.equal(await page.locator('[data-atz-id="ATZ-MOT-001"]').count(),1);
  assert.equal(await page.locator('.atz-transition-layer').count(),1);
  assert.equal(await page.locator('.fss-original-case-icon').count(),4);
  assert.ok(await page.locator('a[href="resources/document/centegix-platform-overview/index.html"]').count()>0);
  assert.ok(await page.locator('a[href="safety-platform/index.html#compare-spat"]').count()>0);
  assert.ok(await page.locator('a[href="resources/document/finding-value-in-spat/index.html"]').count()>0);
  assert.ok(await page.locator('a[href="resources/document/client-list/index.html"]').count()>0);
  await page.screenshot({path:path.join(output,'home-first-screen-'+width+'.png')});
  await shot(page,'[data-svc-rail]','home-bento-'+width);
  if(width===375){const el=page.locator('[data-svc-rail]');await el.focus();const before=await el.evaluate(n=>n.scrollLeft);await page.keyboard.press('ArrowRight');await page.waitForTimeout(550);assert.ok(await el.evaluate(n=>n.scrollLeft)>before);}
  await shot(page,'#home-delivery-implementation','home-delivery-'+width);
  await rail(page,'home-delivery');
  if(width===1440){await page.locator('.desktop-nav a[href*="safety-platform"]').first().click();await page.waitForURL('**/safety-platform/index.html');}else await goto(page,'safety-platform/index.html');
  await page.waitForTimeout(650);await overflow(page,'platform '+width);
  const split=page.locator('[data-atz-id="ATZ-SEC-009"]');assert.equal(await split.locator('.ss03__chapter').count(),3);
  assert.ok(await split.evaluate(e=>!!e.__atrezzoSS03),'Real Split Narrative runtime mounted');
  assert.equal(await page.locator('#compare-spat tbody tr').count(),3);
  assert.equal(await page.locator('.clarity-response').count(),0);
  await shot(page,'#scene-1-title','platform-request-'+width);
  await shot(page,'#scene-2-title','platform-mapping-'+width);
  await shot(page,'#compare-spat','platform-comparison-'+width);
  await goto(page,'our-approach/index.html');await overflow(page,'approach '+width);
  assert.equal(await page.locator('.capability-band,.clarity-journey-visual').count(),0);
  await shot(page,'#approach-implementation','approach-first-'+width);
  await rail(page,'approach');await shot(page,'#approach-support','approach-support-'+width);
  if(width===375){const h=await page.locator('#approach-support').evaluate(e=>e.getBoundingClientRect().height);assert.ok(h<480,'Mobile support step too tall: '+h);}
  await goto(page,'use-cases/index.html');for(const id of ['medical-emergencies','student-elopement','campus-altercations','inclement-weather','critical-threats'])assert.equal(await page.locator('#'+id).count(),1);
  if(width===1440){await goto(page,'videos/index.html');assert.ok(await page.locator('[data-play-video]').count()>0);}
  await context.close();
 }
 for(const javaScriptEnabled of [true,false]){
  const context=await browser.newContext({viewport:{width:375,height:812},reducedMotion:'reduce',javaScriptEnabled});const page=await context.newPage();
  await goto(page,'our-approach/index.html');assert.equal(await page.locator('.atz-chapter-block').count(),5);
  await goto(page,'safety-platform/index.html');assert.equal(await page.locator('.ss03__chapter').count(),3);assert.equal(await page.locator('#compare-spat tbody tr').count(),3);
  if(javaScriptEnabled)assert.equal(await page.locator('[data-atz-id="ATZ-SEC-009"]').evaluate(e=>e.__atrezzoSS03.mode),'static');
  await context.close();
 }
 assert.deepEqual(errors,[],'Uncaught browser/component errors');
 console.log('PASS — 77 routes retained, exact Atrezzo Chapter Rail/Split Narrative, four responsive widths, 5 delivery stages, 3 response chapters, SPAT comparison, real case anchors and reduced/no-JS');
}finally{await browser.close();}
