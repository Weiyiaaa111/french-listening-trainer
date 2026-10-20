import {describe,it,expect} from 'vitest';
import {seeds} from './data';
import {trainingSentences} from './training-model';
describe('统一材料层级',()=>{
 it('真人时间轴与35句保持不变',()=>{const e=seeds.find(e=>e.id==='piste37-complot')!,s=trainingSentences(e);expect(s).toHaveLength(35);expect(s[28].chunks).toHaveLength(4);expect(s[28].chunks).toEqual(e.lesson!.sentences[28].chunks);});
 it('单句专项不会误当成三个句子',()=>{const s=trainingSentences(seeds.find(e=>e.id==='eng-1')!);expect(s).toHaveLength(1);expect(s[0].chunks).toHaveLength(3);expect(s[0].translation).toContain('设备');});
 it('完整合成材料保留20句及句内意群',()=>{const s=trainingSentences(seeds.find(e=>e.id==='eng-meeting-long')!);expect(s).toHaveLength(20);expect(s[7].chunks.length).toBeGreaterThan(1);});
});
