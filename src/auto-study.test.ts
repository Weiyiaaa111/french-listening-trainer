import {it,expect} from 'vitest';
import {automaticAnalysis,prepareImported} from './auto-study';
import {parsePaste,exerciseFromPaste} from './paste-parser';
function input(text:string){return exerciseFromPaste(parsePaste(text,{module:'engineering',date:'2026-10-21'}));}
it('只有法语也自动生成中文句型和词组解析',()=>{const e=prepareImported(input('标题：设备\n法语：Ce que le fournisseur a expliqué, c’est que la livraison est retardée.'),false);expect(e.chunks.map(c=>c.tip).join(' ')).toContain('ce qui / ce que');expect(e.chunks.map(c=>c.tip).join(' ')).toContain('交货');});
it('孤立表达保留并扩为三人场景，新增台词明确标为示例',()=>{const e=prepareImported(input('标题：进度\n法语：Pourriez-vous confirmer la livraison ?'),true,'3');expect(e.sample).toBe(true);expect(e.chunks.length).toBeGreaterThanOrEqual(8);expect(e.chunks.some(c=>c.text==='Pourriez-vous confirmer la livraison ?')).toBe(true);expect(e.chunks.some(c=>c.role.startsWith('C'))).toBe(true);expect(e.notes).toContain('模板');});
it('已有说话人的对话不强行改写',()=>{const e=input('标题：约定\n法语：Paul : Bonjour.\n法语：Marie : Je vous écoute.');const p=prepareImported(e,true);expect(p.chunks.map(c=>c.text)).toEqual(e.chunks.map(c=>c.text));expect(p.sample).toBe(false);});
it('未知词义不伪造翻译',()=>{expect(automaticAnalysis('Xylophone azur.')).toContain('未匹配');});
it('机场的三个孤立表达直接成为逐句中文的三人情景，保留原句',()=>{const source=input("标题：机场\n法语：À l'aéroport, ils ne nous laissent pas passer.\n法语：Qu'est-ce qu'on peut faire ?\n法语：Pourquoi on ne peut pas passer ?");const e=prepareImported(source,true);expect(e.id).toBe(source.id);expect(e.chunks).toHaveLength(15);expect(e.chunks.every(c=>c.translation)).toBe(true);for(const c of source.chunks)expect(e.chunks.some(row=>row.text===c.text)).toBe(true);expect(e.chunks.some(c=>c.role.startsWith('C'))).toBe(true);});

it('已收录单句的中文传入扩写后的原句位置',()=>{const e=prepareImported(input("标题：机场提问\n法语：Qu'est-ce qu'on peut faire ?"),true);expect(e.chunks.find(c=>c.text==="Qu'est-ce qu'on peut faire ?")?.translation).toBe('我们能怎么办？');});
