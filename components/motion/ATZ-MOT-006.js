import {mountPattern} from "./runtime.js";
export const id="ATZ-MOT-006";
export function mount(host){
 return mountPattern(host,id,({node,onScroll,cleanup})=>{
  const root=node.querySelector("[data-am-journey]");
  if(!root)return;
  const steps=[...root.querySelectorAll("[data-am-journey-step]")];
  const frames=[...root.querySelectorAll("[data-am-journey-frame]")];
  const counter=root.querySelector("[data-am-journey-counter]");
  if(!steps.length||steps.length!==frames.length)throw Error(id+": steps and frames must align");
  root.setAttribute("data-am-ready","");
  onScroll(()=>{
   if(!matchMedia("(min-width: 1101px)").matches)return;
   let active=0,score=Infinity;
   steps.forEach((el,i)=>{const r=el.getBoundingClientRect(),distance=Math.abs(r.top-innerHeight*.4);if(distance<score){score=distance;active=i;}});
   frames.forEach((f,i)=>{f.classList.toggle("am-active",i===active);f.setAttribute("aria-hidden",String(i!==active));});
   if(counter)counter.textContent=String(active+1).padStart(2,"0");
  });
  cleanup(()=>{root.removeAttribute("data-am-ready");frames.forEach((f,i)=>{f.classList.toggle("am-active",i===0);f.setAttribute("aria-hidden",String(i!==0));});if(counter)counter.textContent="01";});
 });
}