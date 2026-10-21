import {describe,it,expect} from 'vitest';
import {seeds} from './data';
import {trainingSentences} from './training-model';
import {buildReviewQuestions,shuffledIndices} from './review-questions';
describe('词汇、词组与表达复习出题',()=>{
 it('只从当前材料匹配词条，选项唯一且包含标准含义',()=>{const q=buildReviewQuestions(trainingSentences(seeds.find(e=>e.id==='eng-1')!));expect(q.some(q=>q.term==='remise en état')).toBe(true);expect(new Set(q.map(q=>q.kind)).size).toBe(3);expect(q.some(q=>q.term==='facture')).toBe(false);for(const item of q){expect(item.options.filter(o=>o===item.answer)).toHaveLength(1);expect(new Set(item.options).size).toBe(item.options.length);if(item.direction!=='cloze')expect(item.context.text).toContain(item.audio.text);}});
 it('一份材料生成更多不同练法而非只出几题',()=>{const q=buildReviewQuestions(trainingSentences(seeds.find(e=>e.id==='eng-1')!));expect(q.length).toBeGreaterThanOrEqual(18);expect(new Set(q.map(q=>q.direction))).toEqual(new Set(['meaning','recall','cloze']));});
 it('支持法语省音写法与大小写',()=>{const s=trainingSentences(seeds.find(e=>e.id==='eng-1')!);s[0].text="CE QU'IL VEUT, c'est la vérité.";s[0].chunks=[{text:s[0].text,role:'',tip:''}];const q=buildReviewQuestions(s);expect(q.some(q=>q.term==='ce que')).toBe(true);expect(q.some(q=>q.term==='vérité')).toBe(true);});
 it('未知导入语料不伪造词义，回退到原句识别',()=>{const q=buildReviewQuestions([{text:'Xylophone azur métallique.',role:'',tip:'',chunks:[{text:'Xylophone azur métallique.',role:'',tip:''}]}]);expect(q[0].meaning).toBeUndefined();expect(q[0].context.text).toContain('____');expect(q[0].context.text).not.toContain(q[0].answer);});
 it('排序打乱但不丢失或重复意群',()=>{for(let n=2;n<=8;n++){const order=shuffledIndices(n,13);expect([...order].sort((a,b)=>a-b)).toEqual(Array.from({length:n},(_,i)=>i));expect(order.some((v,i)=>v!==i)).toBe(true);}});
});
