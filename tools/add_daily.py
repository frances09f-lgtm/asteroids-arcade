from pathlib import Path
import hashlib
p=Path('index.html');raw=p.read_bytes();s=raw.decode()
if '<script src="daily.js"></script>' in s:
    print('Daily integration already present');raise SystemExit(0)
assert hashlib.sha1(('blob '+str(len(raw))+'\0').encode()+raw).hexdigest()=='94919fe848a3159fce73534f379dfa1251583dcd','Game source changed; re-review before patch'
s=s.replace('<script>','<script src="daily.js"></script>\n<script>',1).replace('Math.random()', 'gameRandom()')
s=s.replace('const W=800',"let runType='classic',runDate='',gameRandom=Math.random;\nconst fxRnd=(a,b)=>a+Math.random()*(b-a);\nconst W=800",1)
a=s.index('function burst(');b=s.index('function rock(',a);s=s[:a]+s[a:b].replace('rnd(', 'fxRnd(')+s[b:]
a=s.index('function draw(');s=s[:a]+s[a:].replace('rnd(', 'fxRnd(')
s=s.replace('Math.cos(a)*rnd(2,4)','Math.cos(a)*fxRnd(2,4)').replace('Math.sin(a)*rnd(2,4)','Math.sin(a)*fxRnd(2,4)').replace('color:gameRandom()<.5?', 'color:Math.random()<.5?')
s=s.replace('function start(){audio();',"function start(kind='classic'){runType=kind;runDate=kind==='daily'?DailyArcade.today():'';gameRandom=kind==='daily'?DailyArcade.rng(DailyArcade.seed(runDate)):Math.random;for(const p of ['shield','rapid','triple','slow'])ship[p]=0;clearControls();$('daily-result').hidden=true;refreshDaily();audio();")
s=s.replace("$('launch').onclick=start;$('retry').onclick=start;","$('launch').onclick=()=>start('classic');$('retry').onclick=()=>start(runType);$('daily-launch').onclick=()=>start('daily');")
s=s.replace("$('over').hidden=false}else", "$('over').hidden=false;if(runType==='daily')finishDaily()}else")
s=s.replace('</style>', '\n#daily-info{font-size:11px;color:#b4d7e8;margin:5px 0 8px;text-align:center}#daily-result{width:min(430px,100%)}#daily-result[hidden]{display:none}#score-card{width:100%;min-height:72px;resize:none;background:#0a1923;color:#b4d7e8;border:1px solid #237b79;padding:5px;font:11px monospace}#copy-status{font-size:11px;min-height:16px}.overlay{overflow-y:auto}.overlay button{min-height:36px}@media(max-height:580px){.overlay{gap:5px}.overlay h1{font-size:22px}.overlay p{font-size:10px}#score-card{min-height:54px}}\n</style>')
s=s.replace('<div id="stage">','<div id="daily-info" aria-live="polite"></div><div id="stage">')
s=s.replace('<button id="launch" type="button">LAUNCH MISSION</button>','<button id="launch" type="button">LAUNCH MISSION</button><button id="daily-launch" type="button">PLAY DAILY RUN</button>')
s=s.replace('<button id="retry" type="button">RETRY</button>','<div id="daily-result" hidden><textarea id="score-card" readonly aria-label="Daily score card"></textarea><button id="copy-score" type="button">COPY SCORE CARD</button><div id="copy-status" role="status"></div></div><button id="retry" type="button">RETRY</button>')
s=s.replace('function status(s){',"function refreshDaily(){const day=runType==='daily'?runDate:DailyArcade.today(),info=DailyArcade.streak(day);$('daily-info').textContent=(runType==='daily'?'DAILY RUN ':'DAILY ')+day+' UTC | STREAK '+info.streak+(info.playedToday?' | COMPLETED':'')+(info.persistent?'':' | storage unavailable');}\nfunction finishDaily(){const info=DailyArcade.complete(runDate);$('score-card').value=DailyArcade.card({date:runDate,score,wave,streak:info.streak});$('daily-result').hidden=false;$('copy-status').textContent=info.persistent?'':'streak stays only in this tab, storage unavailable';refreshDaily();}\n$('copy-score').onclick=async()=>{$('copy-status').textContent=await DailyArcade.copy($('score-card'))?'COPIED':'SELECTED, copy the highlighted card';};refreshDaily();\nfunction status(s){",1)
p.write_text(s)
print('Daily integration written: original gameplay retained, seeded RNG isolated from visual effects')
