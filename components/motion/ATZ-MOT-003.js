import {mountPattern} from "./runtime.js";
export const id="ATZ-MOT-003";
export function mount(host){
 return mountPattern(host,id,({node,onScroll,cleanup,desktop,clamp,mix})=>{
  const el=node.querySelector("[data-am-parallax]");
  if(!el||!el.firstElementChild)return;
  const child=el.firstElementChild;el.setAttribute("data-am-ready","");
  onScroll(()=>{
   const r=el.getBoundingClientRect(),t=clamp((innerHeight-r.top)/Math.max(1,innerHeight+r.height));
   const range=matchMedia("(min-width: 1101px)").matches?80:20;
   child.style.setProperty("--am-y",mix(-range,range,t).toFixed(2)+"px");
   child.style.setProperty("--am-scale",mix(1,1.2,t).toFixed(4));
  });
  cleanup(()=>{child.style.removeProperty("--am-y");child.style.removeProperty("--am-scale");el.removeAttribute("data-am-ready");});
 });
}
