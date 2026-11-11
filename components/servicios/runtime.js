/* ATREZZO SERVICE BENTO 01 — isolated, optional reveal and mobile keyboard navigation.
 * Authored from the tested Tri-Lane Home composition; no client-wide selectors,
 * scroll locks, galleries, FontAwesome or framework dependencies.
 */
export function mountBento(host,id) {
  if (!(host instanceof Element)) throw new TypeError(id+": expected an Element host");
  const root=host.matches("[data-atz-id='"+id+"']")?host:host.querySelector("[data-atz-id='"+id+"']");
  if (!root) throw Error(id+": isolated bento root not found");
  const rail=root.querySelector("[data-svc-rail]");
  const cards=[...root.querySelectorAll("[data-svc-card]")];
  if(!rail||cards.length!==5)throw Error(id+": expected one featured and four secondary service cards");
  if(root.dataset.svcMounted==="true")throw Error(id+": already mounted");
  const reduce=matchMedia("(prefers-reduced-motion: reduce)");
  const mobile=matchMedia("(max-width: 767px)");
  let destroyed=false,observer=null,visible=new Set();
  const stage=()=>{
    if(observer){observer.disconnect();observer=null;}
    if(reduce.matches || !("IntersectionObserver" in window)){
      root.classList.remove("atz-svc--reveal");
      cards.forEach(card=>card.classList.remove("atz-svc--waiting","atz-svc--visible"));
      return;
    }
    observer=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(!entry.isIntersecting)continue;
        visible.add(entry.target);
        entry.target.classList.remove("atz-svc--waiting");
        entry.target.classList.add("atz-svc--visible");
        observer.unobserve(entry.target);
      }
    },{threshold:0.07,rootMargin:"0px 0px -4% 0px"});
    // Assign delays only within the component; no body mutation.
    root.classList.add("atz-svc--reveal");
    cards.forEach((card,i)=>{
      card.style.setProperty("--atz-svc-delay",(mobile.matches?Math.min(i*60,120):i===0?0:Math.min((i-1)%2*160,160))+"ms");
      if(visible.has(card)||card.getBoundingClientRect().bottom<0){
        card.classList.remove("atz-svc--waiting");card.classList.add("atz-svc--visible");
      }else{
        card.classList.add("atz-svc--waiting");
        observer.observe(card);
      }
    });
  };
  const onKey=event=>{
    if(!mobile.matches||event.target!==rail||!["ArrowRight","ArrowLeft","Home","End"].includes(event.key))return;
    const center=rail.scrollLeft+rail.clientWidth*.5;
    let nearest=0,dist=Infinity;
    cards.forEach((card,i)=>{
      const midpoint=card.offsetLeft-rail.offsetLeft+card.offsetWidth*.5;
      const diff=Math.abs(midpoint-center);
      if(diff<dist){dist=diff;nearest=i;}
    });
    const target=event.key==="Home"?0:event.key==="End"?cards.length-1:
      Math.max(0,Math.min(cards.length-1,nearest+(event.key==="ArrowRight"?1:-1)));
    const left=cards[target].getBoundingClientRect().left-rail.getBoundingClientRect().left+rail.scrollLeft;
    rail.scrollTo({left,behavior:reduce.matches?"instant":"smooth"});
    event.preventDefault();
  };
  rail.addEventListener("keydown",onKey);
  reduce.addEventListener?.("change",stage);
  mobile.addEventListener?.("change",stage);
  const onRestore=()=>{stage();};
  window.addEventListener("pageshow",onRestore);
  root.dataset.svcMounted="true";
  stage();
  return {
    id, get mode(){return reduce.matches?"static":"revealed";},
    refresh:stage,
    destroy(){
      if(destroyed)return;destroyed=true;
      observer?.disconnect();rail.removeEventListener("keydown",onKey);
      reduce.removeEventListener?.("change",stage);
      mobile.removeEventListener?.("change",stage);
      window.removeEventListener("pageshow",onRestore);
      root.classList.remove("atz-svc--reveal");
      delete root.dataset.svcMounted;
      cards.forEach(card=>{
        card.classList.remove("atz-svc--waiting","atz-svc--visible");
        card.style.removeProperty("--atz-svc-delay");
      });
    }
  };
}
