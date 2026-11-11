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
async function mountAtrezzo(){for(const id of ['ATZ-MOT-001','ATZ-MOT-006']){
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
 {text:'Our goal is to empower teachers to get help quickly and easily in any type of incident.',author:'Dr. Trig Overbo',role:'Superintendent, Glen Rose ISD'},
 {text:'CrisisAlert enables teachers to focus on the learning environment and gives them the confidence to respond in any situation.',author:'Tommy Corcoran',role:'Assistant Superintendent, Glen Rose ISD'},
 {text:'This is the next step in Friendswood ISD’s efforts to create the safest learning environments possible for students and staff.',author:'Thad Roher',role:'Superintendent, Friendswood ISD'},
 {text:'We have 30 different layers of security protocols in our District and the CENTEGIX Safety Platform is our number 1.',author:'Ty Morrow',role:'Executive Director of Safety, Security & Emergency Management, Brazosport ISD'}
];
const quoteHost=document.querySelector('[data-quote-carousel]');let quoteIndex=0;
const updateQuote=()=>{if(!quoteHost)return;const q=quotes[quoteIndex];quoteHost.querySelector('[data-quote-text]').textContent=q.text;quoteHost.querySelector('[data-quote-author]').textContent=q.author;quoteHost.querySelector('[data-quote-role]').textContent=q.role;};
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
