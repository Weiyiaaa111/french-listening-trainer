import { describe, it, expect } from 'vitest';
import { seeds, mergeExercises, normalize } from './data';
describe('题库导入',()=>{
 it('内置题库通过格式校验',()=>expect(mergeExercises([],seeds).added).toBe(23));
 it('按 ID 与文本去重，包含同一文件内重复',()=>expect(mergeExercises(seeds,[seeds[0],{...seeds[0],id:'duplicate'}]).added).toBe(0));
 it('支持后续按日期添加',()=>expect(mergeExercises(seeds,[{...seeds[0],id:'new',chunks:[{text:'Bonjour.',role:'问候',tip:'自然表达'}]}]).added).toBe(1));
 it('拒绝损坏结构、非法音频及无效日期',()=>{for(const v of [{...seeds[0],chunks:[]},{...seeds[0],audioUrl:'javascript:alert(1)'},{...seeds[0],date:'2026-02-30'}])expect(()=>mergeExercises(seeds,[v])).toThrow();});
 it('不修改原题库且整份校验失败不会部分导入',()=>{const before=JSON.stringify(seeds);expect(()=>mergeExercises(seeds,[{...seeds[0],id:'x',chunks:[{text:'Nouveau.',role:'',tip:''}]},{}])).toThrow();expect(JSON.stringify(seeds)).toBe(before);});
 it('听写对照容忍重音、标点和省音差异',()=>expect(normalize("J’ai écouté." )).toBe(normalize('j ai ecoute')));
});
