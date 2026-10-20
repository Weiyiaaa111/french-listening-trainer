import {test,expect} from '@playwright/test';
import {openDetail} from './helpers';
import lesson from '../src/lessons/piste37.json' with {type:'json'};
test('跳转前后多句原音确实推进，而不只是定位到时间',async({page})=>{await openDetail(page,'piste37-complot');const a=page.locator('audio[aria-label="完整真人原音"]');for(const i of [34,0,28,1,20,4]){await page.getByRole('button',{name:`播放第 ${i+1} 句`,exact:true}).click();await expect.poll(()=>a.evaluate((a:HTMLAudioElement)=>({time:a.currentTime,paused:a.paused}))).toMatchObject({paused:false});await expect.poll(()=>a.evaluate((a:HTMLAudioElement)=>a.currentTime)).toBeGreaterThan(lesson.sentences[i].start+.08);}await expect(page.getByRole('alert')).toHaveCount(0);});
