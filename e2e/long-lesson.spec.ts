import {test,expect} from '@playwright/test';
import lesson from '../src/lessons/piste37.json' with {type:'json'};
async function open(page:import('@playwright/test').Page){await page.goto('/');await page.getByRole('button',{name:'DALF C1',exact:true}).click();await page.locator('.lesson').filter({hasText:'真人原音｜阴谋论访谈'}).click();await page.getByRole('button',{name:'开始跟读听辨',exact:true}).click();}
test('上传原音具有真实时长，逐句和意群播放使用同一个原音',async({page})=>{
 await open(page);const audio=page.getByLabel('完整真人原音');await expect.poll(()=>audio.evaluate((a:HTMLAudioElement)=>a.duration)).toBeGreaterThan(240);
 await expect(page.getByRole('button',{name:/播放原音第 \d+ 句/})).toHaveCount(35);
 await expect(page.locator('.revealed-chunk')).toHaveCount(0);
 await page.getByRole('button',{name:'播放完整原音',exact:true}).click();await expect.poll(()=>audio.evaluate((a:HTMLAudioElement)=>a.currentTime)).toBeGreaterThan(0);
 await page.getByRole('button',{name:'播放原音第 2 句',exact:true}).click();await expect.poll(()=>audio.evaluate((a:HTMLAudioElement)=>a.currentTime)).toBeGreaterThanOrEqual(lesson.sentences[1].start);
 await expect(page.locator('.revealed-chunk')).toHaveCount(0);await page.getByRole('button',{name:'选择意群 1',exact:true}).click();await expect(page.locator('.revealed-chunk')).toHaveCount(1);await page.getByRole('button',{name:'查看本意群解析',exact:true}).click();await expect(page.locator('.revealed-chunk')).toContainText('Bien sûr,');await expect(page.getByText('on est fans,',{exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'重复播放此意群',exact:true}).click();await expect.poll(()=>audio.evaluate((a:HTMLAudioElement)=>a.currentTime)).toBeGreaterThanOrEqual(lesson.sentences[1].chunks[0].start);
 await expect(page.getByLabel('完整真人原音')).toHaveAttribute('src','./audio/piste37.mp3');await page.getByRole('button',{name:'收起本意群解析'}).click();await expect(page.locator('.revealed-chunk .chunk-text')).toHaveCount(0);
 await page.getByLabel('原音播放速度').selectOption('0.75');expect(await audio.evaluate((a:HTMLAudioElement)=>a.playbackRate)).toBe(.75);
});
test('原音在句末停止，循环只重放当前句，切换模块停止',async({page})=>{await open(page);const audio=page.getByLabel('完整真人原音');await page.getByRole('button',{name:'播放原音第 2 句',exact:true}).click();
 // Seek just before the boundary, preserving the chosen range.
 await page.getByRole('button',{name:'播放原音第 2 句',exact:true}).click();await audio.evaluate((a:HTMLAudioElement,end:number)=>{a.currentTime=end-.04;},lesson.sentences[1].end);await expect.poll(()=>audio.evaluate((a:HTMLAudioElement)=>a.paused)).toBeTruthy();
 await page.getByRole('button',{name:'循环当前原音'}).click();await page.getByRole('button',{name:'播放原音第 2 句',exact:true}).click();await audio.evaluate((a:HTMLAudioElement,end:number)=>{a.currentTime=end-.04;},lesson.sentences[1].end);await expect.poll(()=>audio.evaluate((a:HTMLAudioElement)=>a.currentTime)).toBeLessThan(lesson.sentences[1].start+.8);
 await page.getByRole('button',{name:'工程法语',exact:true}).click();await expect(audio).toHaveCount(0);
});
test('原音题手机适配和听写保存',async({page})=>{await page.setViewportSize({width:390,height:844});await open(page);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();await page.getByLabel('记录你听到的内容或论证结构').fill('共同特征 / 心理需求');await page.getByRole('button',{name:'记录本次听写'}).click();await expect(page.getByRole('button',{name:'本次练习已记录'})).toBeDisabled();await page.screenshot({path:'test-results/piste37-mobile.png',fullPage:true});});

test('材料专属链接直接打开真人原音课程',async({page})=>{await page.goto('/?lesson=piste37-complot');await expect(page.getByLabel('完整真人原音')).toBeVisible();await expect(page.locator('.revealed-chunk')).toHaveCount(0);});
