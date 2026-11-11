/* Five Stones Safety — ATREZZO meeting prototype. All behavior local, no analytics or form requests. */
(function(){
  'use strict';
  const q=(s,base=document)=>base.querySelector(s);
  const qa=(s,base=document)=>Array.from(base.querySelectorAll(s));
  const nav=q('#site-nav');
  const menu=q('#mobile-menu');
  const trigger=q('#menu-trigger');
  const progress=q('#scroll-progress');
  let ticking=false;
  function onScroll(){
    if(ticking) return;
    ticking=true;
    requestAnimationFrame(()=>{
      const y=window.scrollY||document.documentElement.scrollTop;
      if(nav) nav.classList.toggle('is-scrolled',y>30);
      if(progress){
        const total=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
        progress.style.width=Math.min(100,Math.max(0,100*y/total))+'%';
      }
      ticking=false;
    });
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  function setMenu(open){
    if(!menu || !trigger)return;
    menu.classList.toggle('is-open',open);
    trigger.setAttribute('aria-expanded',String(open));
    trigger.setAttribute('aria-label',open?'Close menu':'Open menu');
    document.body.classList.toggle('no-scroll',open);
  }
  trigger?.addEventListener('click',()=>setMenu(trigger.getAttribute('aria-expanded')!=='true'));
  qa('#mobile-menu a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  window.addEventListener('resize',()=>{if(innerWidth>940)setMenu(false)},{passive:true});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){setMenu(false);closeDialog()}});
  const hero=q('.hero');if(hero){requestAnimationFrame(()=>setTimeout(()=>hero.classList.add('is-ready'),80))}
  const visible=qa('.reveal, .reveal-zoom');
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('visible');io.unobserve(entry.target)}
    }),{threshold:.09,rootMargin:'0px 0px -45px 0px'});
    visible.forEach(el=>io.observe(el));
  }else visible.forEach(el=>el.classList.add('visible'));
  const dots=qa('[data-quote-dot]');const slides=qa('[data-quote-slide]');
  dots.forEach(dot=>dot.addEventListener('click',()=>{
    const selected=dot.dataset.quoteDot;
    dots.forEach(d=>d.setAttribute('aria-pressed',String(d===dot)));
    slides.forEach(s=>s.classList.toggle('is-hidden',s.dataset.quoteSlide!==selected));
  }));
  const contactForm=q('#concept-form');
  const dialog=q('#concept-dialog');
  const closeBtn=q('#close-dialog');
  function closeDialog(){if(dialog){dialog.classList.remove('is-open');dialog.setAttribute('aria-hidden','true')}}
  function openDialog(){if(dialog){dialog.classList.add('is-open');dialog.setAttribute('aria-hidden','false');closeBtn?.focus()}}
  contactForm?.addEventListener('submit',e=>{e.preventDefault();openDialog()});
  closeBtn?.addEventListener('click',closeDialog);
  q('#dialog-close-action')?.addEventListener('click',closeDialog);
  dialog?.addEventListener('click',e=>{if(e.target===dialog)closeDialog()});
})();