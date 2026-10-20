import {it,expect} from 'vitest';
import {existsSync,statSync} from 'node:fs';
import {seeds} from './data';
import {trainingSentences} from './training-model';
import clips from './sample-audio.json';
it('每份示例的整篇、单句、意群都有实际音频文件',()=>{for(const e of seeds.filter(e=>e.sample)){const s=trainingSentences(e),texts=[s.map(s=>s.text).join(' '),...s.flatMap(s=>[s.text,...s.chunks.map(c=>c.text)])];for(const text of texts){const url=(clips as Record<string,string>)[text];expect(url,`${e.id}: ${text}`).toBeTruthy();const file='public/'+url.slice(2);expect(existsSync(file)).toBe(true);expect(statSync(file).size).toBeGreaterThan(100);}}});
