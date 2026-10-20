import {describe,it,expect} from 'vitest';
import {suggestProsody} from './prosody';
import {seeds} from './data';
describe('句内语调朗读建议',()=>{
 it('手动边界均有符号，条件从句可上扬，主句下沉',()=>{const p=suggestProsody('Si le fournisseur arrive demain, / nous pourrons commencer les travaux.');expect(p.map(s=>s.tone)).toEqual(['↗','↘']);expect(p.every(s=>s.note.startsWith('朗读建议'))).toBe(true);});
 it('确认疑问与问词疑问采用不同建议，箭头不混入法语文本',()=>{expect(suggestProsody('Vous confirmez la livraison ?').at(-1)?.tone).toBe('↗');expect(suggestProsody('Comment pouvons-nous procéder ?').at(-1)?.tone).toBe('↘');expect(suggestProsody('Bonjour, comment allez-vous ?').every(p=>!/[↗↘→]/.test(p.text))).toBe(true);});
 it('每个模块均有20句完整材料且不缺内部标注',()=>{for(const module of ['c1','engineering','daily']){const e=seeds.find(e=>e.module===module&&e.sample&&e.chunks.length>=20)!;expect(e).toBeDefined();expect(e.chunks).toHaveLength(20);expect(e.chunks.every(c=>c.prosody&&c.prosody.length>0)).toBe(true);expect(e.chunks.filter(c=>(c.prosody?.length||0)>1).length).toBeGreaterThanOrEqual(10);}});
 it('不接受不完整的导入语调数据',async()=>{const {mergeExercises}=await import('./data');expect(()=>mergeExercises([],[{...seeds[1],chunks:[{text:'Bonjour.',role:'',tip:'',prosody:[{text:'Bonjour.',tone:'bad',note:''}]}]}])).toThrow('语调');});
});
