import {test,expect} from '@playwright/test';
async function microphone(page:import('@playwright/test').Page){await page.addInitScript(()=>{navigator.mediaDevices.getUserMedia=async()=>{const ctx=new AudioContext(),source=ctx.createOscillator(),out=ctx.createMediaStreamDestination();source.connect(out);source.start();return out.stream;};});}
for(const lesson of ['eng-meeting-long','piste37-complot'])test(`${lesson} 两部分流程，选择意群才打开录音和简短解析`,async({page})=>{
 if(lesson==='piste37-complot')await page.setViewportSize({width:390,height:844});await microphone(page);await page.goto('/?lesson='+lesson);
 await expect(page.getByRole('button',{name:'开始录音',exact:true})).toBeVisible();
 await expect(page.getByRole('region',{name:'意群选择与跟读'})).toBeHidden();
 await page.getByRole('button',{name:'开始听音辨写',exact:true}).click();
 if(lesson==='eng-meeting-long')await page.getByRole('button',{name:'盲听片段 08',exact:true}).click();
 const bank=page.getByRole('region',{name:'意群选择与跟读'});
 await expect(bank.getByRole('button',{name:'开始本意群录音',exact:true})).toHaveCount(0);
 await bank.getByRole('button',{name:'选择意群 1',exact:true}).click();
 await expect(bank.getByRole('button',{name:'开始本意群录音',exact:true})).toBeVisible();
 await expect(bank.getByRole('region',{name:'本意群解析'})).toHaveCount(0);
 await bank.getByRole('button',{name:'开始本意群录音',exact:true}).click();await page.waitForTimeout(250);await bank.getByRole('button',{name:'停止本意群录音',exact:true}).click();
 const audio=bank.locator('audio');await expect(audio).toBeVisible();const src=await audio.getAttribute('src');
 await bank.getByRole('button',{name:'查看本意群解析',exact:true}).click();await expect(bank.getByRole('region',{name:'本意群解析'})).toContainText('听辨重点');
 await bank.getByRole('button',{name:'选择意群 2',exact:true}).click();await expect(bank.getByRole('region',{name:'本意群解析'})).toHaveCount(0);
 await expect(bank.locator('article:visible')).toHaveCount(1);
 await bank.getByRole('button',{name:'选择意群 1',exact:true}).click();await expect(bank.locator('audio:visible')).toHaveAttribute('src',src!);
 await bank.locator('audio:visible').evaluate(async(a:HTMLAudioElement)=>a.play());await expect.poll(()=>bank.locator('audio:visible').evaluate((a:HTMLAudioElement)=>a.currentTime)).toBeGreaterThan(0);
 await bank.getByRole('button',{name:'删除本意群录音',exact:true}).click();await expect(bank.locator('audio:visible')).toHaveCount(0);
 await expect(page.getByRole('button',{name:'开始录音',exact:true})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();await page.screenshot({path:`test-results/${lesson}-two-parts.png`,fullPage:true});
});

test('短句专项同样在录音下单独展开听辨重点',async({page})=>{await page.goto('/?lesson=eng-1');await page.getByRole('button',{name:'开始听音辨写',exact:true}).click();await page.getByRole('button',{name:'盲听片段 01',exact:true}).click();await expect(page.getByRole('region',{name:'本意群解析'})).toHaveCount(0);await page.getByRole('button',{name:'查看本意群解析',exact:true}).click();await expect(page.getByRole('region',{name:'本意群解析'})).toContainText('ce qui / ce que');await page.getByRole('button',{name:'盲听片段 02',exact:true}).click();await expect(page.getByRole('region',{name:'本意群解析'})).toHaveCount(0);});
