/* ATREZZO Motion v1 — shared lifecycle for isolated visual patterns.
 * Source: user-supplied ATREZZO_MOTION_LIBRARY_V1, adaptation without global page control.
 * No modal, menu, scroll-lock, page-wipe or client imagery in this collection.
 */
export const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
export const mix=(a,b,t)=>a+(b-a)*t;
export function mountPattern(host,id,install){
  if(!(host instanceof Element))throw new TypeError(id+": host must be an Element");
  const node=host.matches('[data-atz-id="'+id+'"]')?host:host.querySelector('[data-atz-id="'+id+'"]');
  if(!node)throw Error(id+": component root missing");
  const media=matchMedia("(prefers-reduced-motion: reduce)");
  const desktop=matchMedia("(min-width: 1101px)");
  const cleanups=[],scrollTasks=[];
  let frame=0,destroyed=false;
  const on=(target,type,listener,options)=>{
    target.addEventListener(type,listener,options);
    cleanups.push(()=>target.removeEventListener(type,listener,options));
  };
  const cleanup=(fn)=>cleanups.push(fn);
  const onScroll=(fn)=>scrollTasks.push(fn);
  const render=()=>{
    frame=0;if(destroyed||media.matches)return;
    for(const fn of scrollTasks)fn();
  };
  const schedule=()=>{if(!destroyed&&!frame)frame=requestAnimationFrame(render);};
  const onVisible=(nodes,action)=>{
    if(media.matches||!("IntersectionObserver" in window)){nodes.forEach(action);return;}
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries)if(entry.isIntersecting){action(entry.target);observer.unobserve(entry.target);}
    },{rootMargin:"0px 0px -15% 0px",threshold:0});
    nodes.forEach(el=>observer.observe(el));
    cleanup(()=>observer.disconnect());
  };
  const context={node,on,cleanup,onScroll,onVisible,schedule,clamp,mix,
    get reduced(){return media.matches;},get desktop(){return desktop.matches;}};
  install(context);
  on(window,"scroll",schedule,{passive:true});
  on(window,"resize",schedule,{passive:true});
  const mediaChange=()=>{if(media.matches){node.classList.add("am-reduced");}else node.classList.remove("am-reduced");schedule();};
  on(media,"change",mediaChange);
  on(desktop,"change",schedule);
  mediaChange();schedule();
  return {get mode(){return media.matches?"static":"animated";},
    refresh:schedule,
    destroy(){
      if(destroyed)return;
      destroyed=true;cancelAnimationFrame(frame);
      cleanups.reverse().forEach(fn=>fn());cleanups.length=0;
      node.classList.remove("am-reduced");
    }};
}