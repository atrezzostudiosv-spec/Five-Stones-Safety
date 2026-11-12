import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium,webkit,devices} from 'playwright';
const origin='http://127.0.0.1:4173/';
const audit=JSON.parse(fs.readFileSync('seo/audit.json','utf8'));
const siteBase='https://atrezzostudiosv-spec.github.io/Five-Stones-Safety/';
const output='artifacts/seo-qa';fs.mkdirSync(output,{recursive:true});
assert.equal(audit.pages,77);assert.equal(audit.canonical_urls,36);assert.equal(audit.aliases,41);
assert.equal(audit.missing_local_links.length,0);assert.equal(audit.missing_alt.length,0);assert.equal(audit.h1_issues.length,0);
for(const entry of audit.routes){
 const source=fs.readFileSync(entry.path,'utf8');
 assert.ok(source.includes('<meta name="robots" content="noindex,follow">'),entry.path+' preview safety');
 assert.equal((source.match(/<link rel="canonical"/g)||[]).length,1,entry.path+' canonical');
 assert.ok(source.includes('href="'+entry.canonical+'"'),entry.path+' canonical target');
 assert.ok(source.includes('property="og:image" content="'+siteBase+'assets/seo/five-stones-social.jpg"'),entry.path+' OG image');
 assert.ok(source.includes('name="twitter:card" content="summary_large_image"'),entry.path+' X card');
 assert.ok(source.includes('rel="apple-touch-icon"'),entry.path+' Apple icon');
 const visible=source.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<!--[\s\S]*?-->/g,'').replace(/<[^>]+>/g,'');
 assert.ok(!/[↗→←↑↓●▶Ⅱ✓✕✖✗✔➜★\uFE0F]|[\u{1F300}-\u{1FAFF}]/u.test(visible),entry.path+' contains a platform-sensitive UI glyph');
}
for(const [name,engine,opts] of [
 ['chromium-desktop',chromium,{viewport:{width:1440,height:900}}],
 ['webkit-iphone',webkit,{...devices['iPhone 13']}],
 ['webkit-tablet',webkit,{...devices['iPad Mini']}]
]){
 const browser=await engine.launch({headless:true});
 try{
 const page=await browser.newPage({...opts,reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin,{waitUntil:'domcontentloaded',timeout:30000});
 assert.equal(await page.locator('h1').count(),1);
 const url=await page.locator('meta[property="og:image"]').getAttribute('content');
 const rel=url.replace(siteBase,origin);const img=await page.request.get(rel);assert.ok(img.ok());assert.match(img.headers()['content-type'],/image\/jpeg/);
 for(const p of ['assets/seo/icon-32.png','assets/seo/apple-touch-icon.png','favicon.ico'])assert.ok((await page.request.get(origin+p)).ok(),p);
 assert.ok(await page.locator('.fss-ui-icon').count()>10);
 assert.ok(await page.locator('body').evaluate(e=>!/[↗→←↑↓●▶Ⅱ✓✕✖✗✔➜★\uFE0F]|[\u{1F300}-\u{1FAFF}]/u.test(e.innerText)),'Visible glyph '+name);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth<=3),'Overflow '+name);
 await page.screenshot({path:output+'/'+name+'-home.png',animations:'disabled'});
 const toggle=page.locator('[data-quote-toggle]');await toggle.scrollIntoViewIfNeeded();
 assert.equal(await toggle.getAttribute('data-quote-paused'),'true');
 assert.equal(await toggle.locator('.fss-ui-play:visible').count(),1);
 await toggle.click();assert.equal(await toggle.locator('.fss-ui-pause:visible').count(),1);
 await page.locator('[data-quote-next]').click();assert.equal(await page.locator('[data-quote-count]').textContent(),'02 / 06');
 await page.screenshot({path:output+'/'+name+'-testimonials.png',animations:'disabled'});
 for(const route of ['safety-platform/','our-approach/','customer-stories/','resources/','techsupport/','contactus/']){
  await page.goto(origin+route,{waitUntil:'domcontentloaded',timeout:30000});
  assert.equal(await page.locator('h1').count(),1,route);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth<=3),'Overflow '+name+' '+route);
  assert.ok(await page.locator('body').evaluate(e=>!/[↗→←↑↓●▶Ⅱ✓✕✖✗✔➜★\uFE0F]|[\u{1F300}-\u{1FAFF}]/u.test(e.innerText)),name+' '+route+' glyph');
 }
 assert.deepEqual(errors,[],name+' JavaScript errors');
 }finally{await browser.close()}
}
console.log('PASS: 77 route metadata, local image/icon URLs, canonical aliases, SVG controls, Chromium desktop and WebKit iPhone/iPad emulation');
