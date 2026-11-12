/* FIVE STONES SAFETY — ATREZZO accessible interaction layer.
   No form submission, storage, analytics, location or global scroll hijacking. */
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const header=document.querySelector('.site-header');
const onScroll=()=>header?.classList.toggle('is-scrolled',window.scrollY>12);
window.addEventListener('scroll',onScroll,{passive:true});onScroll();
const menu=document.querySelector('.menu-button');
const mobile=document.querySelector('#mobile-menu');
function closeMenu(){document.body.classList.remove('menu-open');menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Open menu');mobile?.setAttribute('inert','');}
menu?.addEventListener('click',()=>{const next=!document.body.classList.contains('menu-open');document.body.classList.toggle('menu-open',next);menu.setAttribute('aria-expanded',String(next));menu.setAttribute('aria-label',next?'Close menu':'Open menu');if(next){mobile?.removeAttribute('inert');mobile?.querySelector('a')?.focus();}else{mobile?.setAttribute('inert','');}});
mobile?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
window.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&document.body.classList.contains('menu-open')){closeMenu();menu?.focus();}});
window.addEventListener('resize',()=>{if(window.innerWidth>1040)closeMenu();});
// Original ATREZZO components: mount exact IDs with original isolated modules.
async function mountAtrezzo(){for(const id of ['ATZ-MOT-001','ATZ-MOT-003','ATZ-MOT-006']){
 const roots=[...document.querySelectorAll(`[data-atz-id="${id}"]`)];if(!roots.length)continue;
 try{const mod=await import(`../components/motion/${id}.js`);roots.forEach(root=>mod.mount(root));}
 catch(e){console.warn('ATREZZO component not available:',id,e);}
}}
mountAtrezzo();
// Lazy, click-to-play YouTube embeds. The visitor stays on this page.
document.querySelectorAll('[data-play-video]').forEach(button=>button.addEventListener('click',()=>{
 const id=button.dataset.playVideo;
 if(!/^[A-Za-z0-9_-]{11}$/.test(id))return;
 const screen=button.closest('.video-screen');if(!screen)return;
 const frame=document.createElement('iframe');
 frame.title='Video player';frame.allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share';frame.allowFullscreen=true;
 frame.loading='lazy';frame.src=`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`;
 screen.replaceChildren(frame);
}));
// Non-functional demo form: inputs are validated by browser, never submitted or serialized.
document.querySelectorAll('[data-demo-form]').forEach(form=>form.addEventListener('submit',ev=>{
 ev.preventDefault();
 if(!form.reportValidity())return;
 const status=form.querySelector('.form-status');
 if(status){status.hidden=false;status.textContent='Design preview only. This form demonstrates the expected interaction. No request has been sent, saved, or delivered.';status.scrollIntoView({block:'nearest',behavior:reduced?'instant':'smooth'});}
}));
// Home testimonial controls, real source-grounded quotations.
const quotes=[
  {
    "author": "Dr. Trig Overbo",
    "role": "Superintendent, Glen Rose ISD",
    "text": "Our goal is to empower teachers to get help quickly and easily in any type of incident.",
    "context": ""
  },
  {
    "author": "Tommy Corcoran",
    "role": "Assistant Superintendent, Glen Rose ISD",
    "text": "CrisisAlert enables teachers to focus on the learning environment and gives them the confidence to respond in any situation.",
    "context": ""
  },
  {
    "author": "Dr. Telena Wright",
    "role": "Former Superintendent, Argyle ISD",
    "text": "CENTEGIX provides a distinctive approach to safety and security solutions to school districts. It meets the rapid communication needs of school leaders.",
    "context": "She also emphasizes responding to everyday emergencies and protecting students and employees as part of the district’s broader school safety efforts."
  },
  {
    "author": "Rick Hoover",
    "role": "Director of Special Programs, Marble Falls ISD",
    "text": "99% of the time this system will not be used for the worst case scenario. But God forbid you need it, that one time, that is why you have it.",
    "context": ""
  },
  {
    "author": "Thad Roher",
    "role": "Superintendent, Friendswood ISD",
    "text": "This is the next step in Friendswood ISD’s efforts to create the safest learning environments possible for students and staff.",
    "context": "He connects the district’s safety investment to the peace of mind that students and teachers need in order to learn and teach."
  },
  {
    "author": "Ty Morrow",
    "role": "Executive Director of Safety, Security & Emergency Management, Brazosport ISD",
    "text": "We have 30 different layers of security protocols in our District and the CENTEGIX Safety Platform is our number 1. The system expanded my safety and security team of 40 to 2,000 because each Brazosport ISD employee now has a badge.",
    "context": "Morrow describes broader campus awareness as a key benefit when employees are equipped to call for help."
  }
];
const quoteHost=document.querySelector('[data-quote-carousel]');let quoteIndex=0;
const updateQuote=()=>{if(!quoteHost)return;const q=quotes[quoteIndex];quoteHost.querySelector('[data-quote-text]').textContent=q.text;quoteHost.querySelector('[data-quote-author]').textContent=q.author;quoteHost.querySelector('[data-quote-role]').textContent=q.role;const context=quoteHost.querySelector('[data-quote-context]');if(context){context.textContent=q.context||'';context.hidden=!q.context;}};
quoteHost?.querySelector('[data-quote-prev]')?.addEventListener('click',()=>{quoteIndex=(quoteIndex-1+quotes.length)%quotes.length;updateQuote();});
quoteHost?.querySelector('[data-quote-next]')?.addEventListener('click',()=>{quoteIndex=(quoteIndex+1)%quotes.length;updateQuote();});
// Search is entirely local, operates on four reconstructed source articles.
const search=document.getElementById('blog-search');search?.addEventListener('input',()=>{
 const q=search.value.toLocaleLowerCase().trim();let shown=0;
 document.querySelectorAll('.post-card').forEach(card=>{const match=(card.dataset.articleTitle+' '+card.dataset.tags).toLocaleLowerCase().includes(q);card.hidden=!match;if(match)shown++;});
 const empty=document.getElementById('empty-results');if(empty)empty.hidden=shown!==0;
});
// Local fallback in offline ZIP: source website images are remotely hosted on GitHub Pages concept.
document.querySelectorAll('img[data-fallback]').forEach(img=>{
 const fallback=()=>{const local=img.dataset.fallback;if(local&&img.src!==new URL(local,location.href).href){img.removeAttribute('data-fallback');img.src=local;}};img.addEventListener('error',fallback,{once:true});if(img.complete && img.naturalWidth===0)fallback();
});
// Original ATREZZO Service Bento: layout, viewport reveal and mobile scroll-snap.
const atzService=document.querySelector('[data-atz-id="ATZ-SVC-001"]');
if(atzService)import('../components/servicios/ATZ-SVC-001.js')
 .then(({mount})=>mount(atzService))
 .catch(error=>console.warn('ATZ-SVC-001 unavailable; static content remains visible',error));


/* ATZ-PGT-001 — original ATREZZO Veil motor shared by all 77 document routes.
   Animate meaningful internal navigation only. Keep anchors, form submits,
   external links, downloads and browser history native. */
if(window.AtrezzoTransitions){
 const atrezzoLinks=document.querySelectorAll([
  '.brand','.desktop-nav a','.mobile-menu a','.header-cta',
  '.site-footer .footer-column a','.site-footer .footer-bottom a',
  '.editorial-card','.post-card','.btn[href]','.inline-arrow[href]',
  '.atz-svc__card a','.atz-svc__bottom a'
 ].join(','));
 atrezzoLinks.forEach(link=>{
  if(link.hasAttribute('download')||(link.target&&link.target!=='_self'))return;
  try{
   const destination=new URL(link.href,location.href);
   if(!['https:','http:','file:'].includes(destination.protocol))return;
   if(destination.origin!==location.origin)return;
   if(destination.pathname===location.pathname&&destination.search===location.search)return;
   link.dataset.atzLink='';
   link.dataset.atzEffect='veil';
  }catch(_){/* Native navigation remains available. */}
 });
 window.fiveStonesPageTransition=new window.AtrezzoTransitions({
  defaultEffect:'veil',coverColor:'#102e30',coverMs:480,
  revealMs:560,showLabel:false
 });
}

// Use the actual video thumbnail for each recovered original video ID.
// If unavailable, keep a branded neutral preview instead of showing an unrelated school.
document.querySelectorAll('.video-poster').forEach(img=>{
 img.addEventListener('error',()=>{
  img.closest('.video-screen')?.classList.add('video-screen--fallback');
  img.hidden=true;
 },{once:true});
 if(img.complete && img.naturalWidth===0){
  img.closest('.video-screen')?.classList.add('video-screen--fallback');
  img.hidden=true;
 }
});

// Original ATREZZO library modules. Use the native source runtime, not a clone.
for(const [id,path] of [['ATZ-NAV-002','../components/navegacion/ATZ-NAV-002.js'],['ATZ-SEC-009','../components/secciones/ATZ-SEC-009.js']]){const roots=[...document.querySelectorAll('[data-atz-id="'+id+'"]')];if(roots.length)import(path).then(m=>roots.forEach(root=>m.mount(root))).catch(e=>console.warn(id+' static fallback',e));}

// A failed remote video still remains a neutral, unillustrated panel, never a different school.
document.querySelectorAll('[data-video-still]').forEach(img=>{const hide=()=>{img.hidden=true;};img.addEventListener('error',hide,{once:true});if(img.complete&&!img.naturalWidth)hide();});
