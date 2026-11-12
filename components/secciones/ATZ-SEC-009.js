/* ATZ-SEC-009 — Split Narrative; original native-scroll progress math retained. */
import {mountAts3} from './ats3-engine.js';
export const id='ATZ-SEC-009';
export const variant='split';
export function mount(host){
  if(!(host instanceof Element))throw new TypeError('ATZ-SEC-009: Element required');
  const selector='[data-atz-id="ATZ-SEC-009"]';
  const root=host.matches(selector)?host:host.querySelector(selector);
  if(!root)throw new Error('ATZ-SEC-009: HTML scope missing');
  return mountAts3(root);
}
