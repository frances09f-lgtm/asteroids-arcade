const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
 for(const device of [{name:'desktop',viewport:{width:1280,height:900},hasTouch:false},{name:'mobile',viewport:{width:390,height:844},hasTouch:true,isMobile:true}]){
  const context=await browser.newContext({viewport:device.viewport,hasTouch:device.hasTouch,isMobile:!!device.isMobile});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8765/',{waitUntil:'load'});
  assert.equal(await page.locator('#start').isVisible(),true,device.name+' launch overlay');
  assert.equal(await page.locator('.dock').isVisible(),device.hasTouch,device.name+' touch dock');
  assert.equal(await page.locator('#pause-mobile').isVisible(),device.hasTouch,device.name+' mobile pause');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,device.name+' horizontal fit');
  await page.locator('#launch').click();assert.equal(await page.locator('#countdown').textContent(),'3');
  await page.waitForTimeout(1050);assert.equal(await page.locator('#countdown').textContent(),'2');
  await page.waitForTimeout(1050);assert.equal(await page.locator('#countdown').textContent(),'1');
  await page.waitForTimeout(1400);assert.equal(await page.locator('#countdown').isVisible(),false);
  await page.evaluate(()=>{ship.inv=600;rocks=[];waveDelay=0});
  if(device.hasTouch)await page.locator('#pause-mobile').click();else await page.keyboard.press('p');
  assert.equal(await page.locator('#pause-screen').isVisible(),true,device.name+' pause');
  await page.locator('#resume').click();assert.equal(await page.locator('#countdown').textContent(),'3');
  await page.waitForTimeout(3450);
  await page.locator('#mute').click();assert.equal(await page.locator('#mute').textContent(),'SOUND OFF');
  await page.locator('#mute').click();assert.equal(await page.locator('#mute').textContent(),'SOUND ON');
  await page.evaluate(()=>{ship.inv=600;ship.x=400;ship.y=500;ship.a=-Math.PI/2;ship.vx=0;ship.vy=0;rocks=[rock(400,365,42)];spawnUfo=1000;spawnComet=10000;fireCool=0});
  if(device.hasTouch){let b=page.locator('#fire');await b.dispatchEvent('pointerdown',{pointerId:3});await page.waitForTimeout(1200);await b.dispatchEvent('pointerup',{pointerId:3})}
  else{await page.keyboard.down('Space');await page.waitForTimeout(1200);await page.keyboard.up('Space')}
  await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>score>0),true,device.name+' shot or charged beam score');
  await page.evaluate(()=>{wave=5;spawnWave()});assert.equal(await page.evaluate(()=>!!boss&&boss.max===43),true,device.name+' boss wave');
  await page.evaluate(()=>{spawnCometNow();ship.triple=120;ship.rapid=120;ship.shield=120;ship.slow=120});
  assert.equal(await page.evaluate(()=>!!comet&&ship.triple>0&&ship.rapid>0&&ship.shield>0&&ship.slow>0),true,device.name+' comet and powers');
  await page.evaluate(()=>{ship.shield=0;ship.inv=0;ship.x=12;update()});assert.equal(await page.locator('#lives').textContent(),'LIVES 2',device.name+' deadly border');
  assert.deepEqual(errors,[],device.name+' uncaught errors');
  console.log(device.name+' launch countdown, controls, pause, mute, shooting, boss, comet, power-ups, deadly border: PASS');await context.close();
 }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});