import {createNavigationLifecycle,listenFrame} from "./runtime.js";
export const id="ATZ-NAV-002";
export function mount(host){
  if(!(host instanceof Element))throw new TypeError("ATZ-NAV-002: host must be Element");
  const root=host.querySelector('[data-atz-id="ATZ-NAV-002"]')||(host.matches('[data-atz-id="ATZ-NAV-002"]')?host:null);
  if(!root)throw Error("ATZ-NAV-002: fragment missing");
  const rail=root.querySelector("[data-azn1-rail]");
  const region=root.querySelector("[data-azn1-rail-region]");
  if(!rail||!region)throw Error("ATZ-NAV-002: required hooks missing");
  const links=[...rail.querySelectorAll('a[href^="#"]')];
  const sections=links.map(a=>document.getElementById(decodeURIComponent(a.hash.slice(1))));
  if(!links.length||sections.some(s=>!s||!root.contains(s)))throw Error("ATZ-NAV-002: chapter anchors incomplete");
  const fill=rail.querySelector("[data-azn1-rail-fill]");
  const life=createNavigationLifecycle();
  let active=-1;
  const update=()=>{
    const point=innerHeight*.39;
    let current=0;
    sections.forEach((section,i)=>{if(section.getBoundingClientRect().top<=point)current=i;});
    if(active!==current){
      active=current;
      links.forEach((a,i)=>{a.classList.toggle("is-active",i===active);if(i===active)a.setAttribute("aria-current","location");else a.removeAttribute("aria-current");});
      sections.forEach((s,i)=>s.classList.toggle("is-current",i===active));
    }
    if(fill){
      const r=region.getBoundingClientRect();
      const length=Math.max(1,r.height-innerHeight);
      const fraction=Math.max(0,Math.min(1,-r.top/length));
      fill.style.width=(fraction*100).toFixed(2)+"%";
    }
  };
  listenFrame(life,update);
  return {get mode(){return "interactive"},refresh:update,destroy:()=>life.destroy()};
}
