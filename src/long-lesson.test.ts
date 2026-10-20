import {describe,it,expect} from 'vitest';
import lesson from './lessons/piste37.json';
import {validTiming,clock} from './long-lesson';
import {seeds,mergeExercises} from './data';
describe('真人长篇时间轴',()=>{
 it('所有句子和意群时间均递增、非空且在原音范围内',()=>{let last=0;expect(lesson.sentences).toHaveLength(35);for(const s of lesson.sentences){expect(validTiming(s.start,s.end,lesson.duration)).toBe(true);expect(s.start).toBeGreaterThanOrEqual(last);last=s.end;let cLast=s.start;for(const c of s.chunks){expect(validTiming(c.start,c.end,lesson.duration)).toBe(true);expect(c.start).toBeGreaterThanOrEqual(cLast);expect(c.end).toBeLessThanOrEqual(s.end);cLast=c.end;}expect(cLast).toBe(s.end);}});
 it('无效时间不进入导入题库',()=>{const original=seeds.find(e=>e.id==='piste37-complot')!;const bad=structuredClone(original);bad.lesson!.sentences[0].end=0;expect(()=>mergeExercises([],[bad])).toThrow('时间轴');});
 it('非法原音地址被拒绝',()=>{const bad=structuredClone(seeds.find(e=>e.id==='piste37-complot')!);bad.lesson!.audioUrl='javascript:alert(1)';expect(()=>mergeExercises([],[bad])).toThrow();});
 it('明确标记语调来源，保留文稿省略，真人材料非示例',()=>{expect(lesson.intonationNote).toContain('朗读建议');expect(lesson.transcriptNote).toContain('未经逐句人工听校');expect(lesson.sentences.some(s=>s.text.includes('[...]'))).toBe(true);expect(seeds.find(e=>e.id==='piste37-complot')?.sample).toBe(false);});
 it('边界校验拒绝 NaN、倒序、越界',()=>{expect(validTiming(NaN,3,4)).toBe(false);expect(validTiming(3,2,4)).toBe(false);expect(validTiming(0,5,4)).toBe(false);expect(clock(243.52)).toBe('4:03');});
});
