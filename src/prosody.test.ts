import {describe,it,expect} from 'vitest';
import {suggestProsody} from './prosody';
import {seeds} from './data';
describe('句内语调朗读建议',()=>{
 it('手动边界均有符号，条件从句可上扬，主句下沉',()=>{const p=suggestProsody('Si le fournisseur arrive demain, / nous pourrons commencer les travaux.');expect(p.map(s=>s.tone)).toEqual(['↗','↘']);expect(p.every(s=>s.note.startsWith('朗读建议'))).toBe(true);});
 it('确认疑问与问词疑问采用不同建议，箭头不混入法语文本',()=>{expect(suggestProsody('Vous confirmez la livraison ?').at(-1)?.tone).toBe('↗');expect(suggestProsody('Comment pouvons-nous procéder ?').at(-1)?.tone).toBe('↘');expect(suggestProsody('Bonjour, comment allez-vous ?').every(p=>!/[↗↘→]/.test(p.text))).toBe(true);});
 it('每个模块均有20句完整材料且不缺内部标注',()=>{for(const module of ['c1','engineering','daily']){const e=seeds.find(e=>e.module===module&&e.sample&&e.chunks.length>=20)!;expect(e).toBeDefined();expect(e.chunks).toHaveLength(20);expect(e.chunks.every(c=>c.prosody&&c.prosody.length>0)).toBe(true);expect(e.chunks.filter(c=>(c.prosody?.length||0)>1).length).toBeGreaterThanOrEqual(10);}});
 it('没有逗号也可按从句拆分，保留人工边界与短句',()=>{expect(suggestProsody("Tu as demandé ce qu’il faut faire ?").map(p=>p.text)).toEqual(['Tu as demandé',"ce qu’il faut faire ?"]);expect(suggestProsody('Ce que tu dis.')).toHaveLength(1);expect(suggestProsody("Tu as demandé ce qu’il faut faire / demain ?")).toHaveLength(2);});
 it('不接受不完整的导入语调数据',async()=>{const {mergeExercises}=await import('./data');expect(()=>mergeExercises([],[{...seeds[1],chunks:[{text:'Bonjour.',role:'',tip:'',prosody:[{text:'Bonjour.',tone:'bad',note:''}]}]}])).toThrow('语调');});
});

describe('按意义与句法划分，避免单词孤岛和超长整块',()=>{
 it('调查例句按主句、从句主语、动词搭配与补语分开',()=>{expect(suggestProsody("Les enquêtes montrent que les jeunes d’aujourd’hui accordent une grande importance à l’équilibre entre vie professionnelle et vie personnelle.").map(p=>p.text)).toEqual(['Les enquêtes montrent','que les jeunes d’aujourd’hui','accordent une grande importance','à l’équilibre entre vie professionnelle et vie personnelle.']);});
 it('短问候和时间状语不机械独立，独立回应保留',()=>{expect(suggestProsody('Bonjour, je vous appelle pour confirmer la date.')).toHaveLength(1);expect(suggestProsody('Hier, nous lui avons envoyé les documents.')).toHaveLength(1);expect(suggestProsody('Oui.')).toHaveLength(1);});
 it('代词助动词与从句连接词不从内部切断',()=>{for(const text of ['Je lui ai donné les documents parce que le contrôleur les attendait.','Ce qui compte, c’est ce que vous avez compris.']){const p=suggestProsody(text).map(p=>p.text);expect(p.some(v=>/^(lui|leur|ai|que|qui)$/.test(v))).toBe(false);expect(p.join(' ')).toBe(text);}expect(suggestProsody('Je lui ai donné les documents parce que le contrôleur les attendait.')[0].text).toContain('Je lui ai donné');});
 it('长补语可按明确的介词补语细分，歧义处不按字数硬切',()=>{const p=suggestProsody('Cette réunion porte principalement sur l’alimentation en eau du camp et l’arrivée des engins.');expect(p.length).toBeGreaterThan(1);expect(p.every(c=>c.text.split(/\s+/).length>=3)).toBe(true);expect(p.map(c=>c.text).join(' ')).toBe('Cette réunion porte principalement sur l’alimentation en eau du camp et l’arrivée des engins.');});
});
