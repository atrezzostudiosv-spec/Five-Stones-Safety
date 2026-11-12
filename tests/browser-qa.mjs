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
 assert.equal(await root.locator('.fss-original-service-icon').count(),5,'Five original service graphics');assert.equal(await root.locator('img:not(.fss-original-service-icon)').count(),0,'No unrelated imagery');
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
  const product=page.locator('[data-atz-id="ATZ-MOT-003"]');
  assert.equal(await product.count(),1);
  assert.equal(await product.locator('.feature-lines>div').count(),3);
  assert.equal(await product.locator('a').count(),3);
  assert.equal(await product.locator('.platform-photo-label').count(),0);
  const productPhoto=product.locator('[data-am-parallax]>.fss-product__image');
  await productPhoto.scrollIntoViewIfNeeded();
  await product.locator('[data-am-parallax][data-am-ready]').waitFor({state:'attached'});
  await page.waitForFunction(()=>{const img=document.querySelector('.fss-product__image');return img.complete&&img.naturalWidth>0});
  const startY=await product.evaluate(e=>e.getBoundingClientRect().top+scrollY);
  await page.evaluate(y=>window.scrollTo({top:Math.max(0,y-innerHeight*.65),behavior:'instant'}),startY);await page.waitForTimeout(220);
  const scaleA=Number(await productPhoto.evaluate(e=>e.style.getPropertyValue('--am-scale')));
  await page.evaluate(y=>window.scrollTo({top:y+Math.min(300,innerHeight*.32),behavior:'instant'}),startY);await page.waitForTimeout(250);
  const scaleB=Number(await productPhoto.evaluate(e=>e.style.getPropertyValue('--am-scale')));
  assert.ok(scaleA>=1&&scaleB>scaleA&&scaleB<=1.2,'Original ATZ-MOT-003 progressive scale at '+width+' '+scaleA+'/'+scaleB);
  await page.evaluate(y=>window.scrollTo({top:y-85,behavior:'instant'}),startY);await page.waitForTimeout(300);
  await page.screenshot({path:path.join(output,'home-product-'+width+'.png'),animations:'disabled'});
  await product.screenshot({path:path.join(output,'home-product-full-'+width+'.png'),animations:'disabled'});
  await overflow(page,'home product '+width);
  assert.equal(await page.locator('#platform-capabilities .fss-info-lines li').count(),12);
  assert.equal(await page.locator('#tangible-results .fss-info-lines li').count(),8);
  assert.equal(await page.locator('#home-compare-spat .fss-spat-option').count(),3);
  assert.equal(await page.locator('.credentials-grid .fss-credential-badge').count(),4);
  assert.equal(await page.locator('[data-play-video="MkLO21JZ0A0"]').count(),1);
  assert.equal(await page.locator('[data-play-video="qrxofVMK2aY"]').count(),1);
  assert.ok(await page.locator('.fss-hero-requirements').textContent().then(s=>s.includes('Alyssa')));
  assert.equal(await page.locator('.fss-capability-icon img').count(),12);
  assert.equal(await page.locator('.fss-platform-diagram img').count(),1);
  assert.equal(await page.locator('.fss-tangible-figure img').count(),1);
  assert.equal(await page.locator('.fss-video-split .video-tile').count(),2);
  const capIcons=page.locator('.fss-capability-icons');await capIcons.scrollIntoViewIfNeeded();
  assert.equal(await capIcons.evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length),width<=760?2:4);
  await shot(page,'.fss-capability-icons','home-capabilities-'+width);
  await shot(page,'.fss-film-editorial .fss-video-split','home-meade-film-'+width);
  const compare=page.locator('#home-compare-spat');
  await compare.locator('summary').nth(1).click();assert.equal(await compare.locator('details[open]').count(),1);
  assert.ok(await compare.locator('details').nth(1).evaluate(e=>e.open));
  await page.locator('.fss-result-details summary').click();assert.equal(await page.locator('.fss-result-details[open] .fss-result-grid li').count(),8);
  await page.locator('.fss-result-details summary').click();
  await shot(page,'#home-compare-spat','home-comparison-'+width);
  await shot(page,'#tangible-results','home-results-'+width);
  await shot(page,'.fss-trust-video','home-trust-video-'+width);
  await shot(page,'.credentials-grid','home-credentials-'+width);
  await shot(page,'.fss-quote-editorial','home-testimonials-'+width);
  assert.equal(await page.locator('[data-quote-select]').count(),6);
  if(width===1440){await page.mouse.move(0,0);await page.locator('.fss-quote-editorial').scrollIntoViewIfNeeded();await page.waitForTimeout(500);const initial=await page.locator('[data-quote-author]').textContent();await page.waitForFunction(a=>document.querySelector('[data-quote-author]').textContent!==a,initial,{timeout:18000});}
  await page.locator('[data-quote-toggle]').click();assert.equal(await page.locator('[data-quote-toggle]').getAttribute('aria-label'),'Play automatic testimonials');
  const authors=new Set();
  for(let i=0;i<6;i++){authors.add(await page.locator('[data-quote-author]').textContent());await page.locator('[data-quote-next]').click();}
  assert.equal(authors.size,6,'Six original district perspectives');
  await overflow(page,'home restored commercial sections '+width);


  if(width===375){const el=page.locator('[data-svc-rail]');await el.focus();const before=await el.evaluate(n=>n.scrollLeft);await page.keyboard.press('ArrowRight');await page.waitForTimeout(550);assert.ok(await el.evaluate(n=>n.scrollLeft)>before);}
  await shot(page,'#home-delivery-implementation','home-delivery-'+width);
  await rail(page,'home-delivery');
  if(width===1440){await page.locator('.desktop-nav a[href*="safety-platform"]').first().click();await page.waitForURL('**/safety-platform/index.html');}else await goto(page,'safety-platform/index.html');
  await page.waitForTimeout(650);await overflow(page,'platform '+width);
  const split=page.locator('[data-atz-id="ATZ-SEC-009"]');assert.equal(await split.locator('.ss03__chapter').count(),3);
  assert.ok(await split.evaluate(e=>!!e.__atrezzoSS03),'Real Split Narrative runtime mounted');
  assert.equal(await page.locator('#compare-spat tbody tr').count(),3);if(width===375){assert.ok(await page.locator('#compare-spat caption').evaluate(e=>e.getBoundingClientRect().width)>250,'Mobile comparison caption must use full width');}
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
  await goto(page,'index.html');assert.equal(await page.locator('[data-atz-id="ATZ-MOT-003"] .feature-lines>div').count(),3);
  assert.equal(await page.locator('.fss-product__image').evaluate(e=>getComputedStyle(e).transform),'none','Reduced motion / no JS must not animate product');
  await goto(page,'our-approach/index.html');assert.equal(await page.locator('.atz-chapter-block').count(),5);
  await goto(page,'safety-platform/index.html');assert.equal(await page.locator('.ss03__chapter').count(),3);assert.equal(await page.locator('#compare-spat tbody tr').count(),3);
  if(javaScriptEnabled)assert.equal(await page.locator('[data-atz-id="ATZ-SEC-009"]').evaluate(e=>e.__atrezzoSS03.mode),'static');
  await context.close();
 }
 assert.deepEqual(errors,[],'Uncaught browser/component errors');
 console.log('PASS — 77 routes retained, exact Atrezzo Chapter Rail/Split Narrative, four responsive widths, 5 delivery stages, 3 response chapters, SPAT comparison, real case anchors and reduced/no-JS');
}finally{await browser.close();}
