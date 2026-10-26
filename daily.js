/* Original implementation inspired by daily-challenge-js patterns, no dependency.
   All players share one date that resets at midnight UTC. */
(function(root){'use strict';
const KEY='retro_asteroids_daily_v1',DAY=86400000;let memory={},persistent=true;
function today(date=new Date()){return date.toISOString().slice(0,10);}
function seed(date){let value=2166136261;for(const c of 'asteroids-daily-v1:'+date)value=Math.imul(value^c.charCodeAt(0),16777619);return value>>>0;}
function rng(value){let state=value>>>0;return function(){state=(state+0x6D2B79F5)>>>0;let t=state;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}
function read(){try{const raw=localStorage.getItem(KEY);if(raw){const p=JSON.parse(raw);if(p&&typeof p==='object'&&!Array.isArray(p))memory=p;}}catch(e){persistent=false;}return memory;}
function previous(date){return today(new Date(Date.parse(date+'T00:00:00Z')-DAY));}
function count(records,date){let n=0;while(records[date]===true&&n<100000){n++;date=previous(date);}return n;}
function streak(date=today()){const r=read(),playedToday=r[date]===true;return {streak:count(r,playedToday?date:previous(date)),playedToday,persistent};}
function complete(date=today()){const r=read();r[date]=true;try{localStorage.setItem(KEY,JSON.stringify(r));}catch(e){persistent=false;}return {streak:count(r,date),playedToday:true,persistent};}
function card({date,score,wave,streak}){return 'Asteroids Arcade Daily '+date+' UTC\nSCORE '+score+' | WAVE '+wave+' | STREAK '+streak+'\nhttps://frances09f-lgtm.github.io/asteroids-arcade/';}
async function copy(field){try{if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(field.value);return true;}}catch(e){}field.focus();field.select();field.setSelectionRange(0,field.value.length);try{return !!document.execCommand('copy');}catch(e){return false;}}
root.DailyArcade={today,seed,rng,streak,complete,card,copy};
})(typeof window==='undefined'?globalThis:window);
