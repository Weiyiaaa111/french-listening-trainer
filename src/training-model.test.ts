import {describe,it,expect} from 'vitest';
import {seeds} from './data';
import {trainingSentences} from './training-model';
describe('统一材料层级',()=>{
 it('真人时间轴与35句保持不变',()=>{const e=seeds.find(e=>e.id==='piste37-complot')!,s=trainingSentences(e);expect(s).toHaveLength(35);expect(s[28].chunks).toHaveLength(4);expect(s[28].chunks).toEqual(e.lesson!.sentences[28].chunks);});
 it('短示例扩成多轮对话，同时保留原句的意群',()=>{const s=trainingSentences(seeds.find(e=>e.id==='eng-1')!);expect(s).toHaveLength(8);expect(s[2].chunks.length).toBeGreaterThanOrEqual(3);expect(s[2].translation).toContain('设备');expect(seeds.filter(e=>e.sample).every(e=>trainingSentences(e).length>=8)).toBe(true);});
 it('完整合成材料保留20句及句内意群',()=>{const s=trainingSentences(seeds.find(e=>e.id==='eng-meeting-long')!);expect(s).toHaveLength(20);expect(s[7].chunks.length).toBeGreaterThan(1);});
});

it('旧的单句自动分段也更新，已有时间轴不按文字重切',()=>{const text="Les enquêtes montrent que les jeunes d’aujourd’hui accordent une grande importance à l’équilibre entre vie professionnelle et vie personnelle.";const e={...seeds[0],lesson:undefined,format:'single' as const,chunks:[{text,role:'',tip:'',prosody:[{text,tone:'↘' as const,note:'朗读建议：旧自动长段'}]}]};expect(trainingSentences(e)[0].chunks).toHaveLength(4);const timed={...e,chunks:[{...e.chunks[0],start:0,end:10}]};expect(trainingSentences(timed)[0].chunks).toHaveLength(1);});
