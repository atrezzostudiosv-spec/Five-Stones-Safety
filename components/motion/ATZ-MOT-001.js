import {mountPattern} from "./runtime.js";
export const id="ATZ-MOT-001";
export function mount(host){
 return mountPattern(host,id,({node,onVisible,cleanup,reduced})=>{
  const text=node.querySelector("[data-am-text]");
  if(!text)return;
  const source=text.textContent;
  if(!source.trim()||text.querySelector("a,button,input,svg,img")||reduced)return;
  const visual=document.createElement("span");visual.className="am-text__visual";visual.setAttribute("aria-hidden","true");
  let index=0;
  for(const part of source.match(/\S+|\s+/gu)||[]){
   if(/^\s+$/u.test(part)){visual.append(document.createTextNode(part));continue;}
   const word=document.createElement("span");word.className="am-word";
   for(const char of [...part]){const c=document.createElement("span");c.className="am-char";c.textContent=char;c.style.setProperty("--am-delay",Math.min(index++,500)*5+"ms");word.append(c);}
   visual.append(word);
  }
  text.setAttribute("aria-label",source.trim());text.replaceChildren(visual);text.setAttribute("data-am-ready","");
  onVisible([text],el=>requestAnimationFrame(()=>el.classList.add("am-inview")));
  cleanup(()=>{text.replaceChildren(document.createTextNode(source));text.removeAttribute("aria-label");text.removeAttribute("data-am-ready");text.classList.remove("am-inview");});
 });
}