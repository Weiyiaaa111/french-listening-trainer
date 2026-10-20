import {dailyScenes} from './daily-scenes';
import type { ProsodyPart } from './prosody';
import piste37 from './lessons/piste37.json';
import {validTiming,type LongLesson} from './long-lesson';
import { extraSeeds } from './extra-data';
export type Module = 'c1' | 'engineering' | 'daily';
export type Chunk = { text: string; role: string; tip: string; audioUrl?: string; prosody?: ProsodyPart[] };
export type Exercise = { id: string; module: Module; date: string; title: string; translation: string; chunks: Chunk[]; tags: string[]; sample: boolean; audioUrl?: string; lesson?: LongLesson; format?: 'passage'|'single' };
const make = (id:string,module:Module,date:string,title:string,translation:string,chunks:[string,string,string][],tags:string[]):Exercise => ({id,module,date,title,translation,chunks:chunks.map(([text,role,tip])=>({text,role,tip})),tags,sample:true});
export const seeds: Exercise[] = [
{id:'piste37-complot',module:'c1',date:'2026-10-20',title:'真人原音｜阴谋论访谈 · 4 分钟',translation:'根据你提供的 France Inter 访谈音频与文稿，逐句精听、识别论证结构。',chunks:piste37.sentences.map(s=>({text:s.text,role:s.section,tip:s.speaker})),tags:['真人原音','35 句','语调建议'],sample:false,audioUrl:piste37.audioUrl,lesson:piste37 as unknown as LongLesson},
...extraSeeds,
...dailyScenes,
make('eng-1','engineering','2026-10-20','协调设备进场','昨天监理告诉我们的情况是，设备只有在通道修复以后才能进场。',[["Ce que le contrôleur nous a expliqué hier,","宾语关系从句 · 复合过去时","ce que 引导名词性从句，作 expliquer 的宾语；nous 是间接宾语。"],["c’est que les engins ne pourront entrer sur le chantier","否定式 · 简单将来时","ne…que 与后面的 après 组合，表示只有……之后才……。"],["qu’après la remise en état de la voie d’accès.","时间限制","qu’après 连读；remise en état 指恢复原状、修复。"]],['ce que','否定式','复合过去时']),
make('eng-2','engineering','2026-10-20','监理会议：供水安排','如果钻井队明天到了，我们会请他们在营地安装之前检查水量。',[["Si l’équipe de forage arrive demain,","条件从句","si + 现在时，主句用将来时。"],["nous lui demanderons de vérifier le débit","间接宾语代词 lui","lui 指代 l’équipe，demander à quelqu’un de faire。"],["avant que le camp ne soit installé.","时间从句 · 虚拟式","avant que + 虚拟式；这里的 ne 是赘词，不表示否定。"]],['lui','从句','供水']),
make('eng-3','engineering','2026-10-19','租赁与合同','我们需要的那台挖掘机昨天还不可用，所以我请供应商给我们提供另一台。',[["La pelle dont nous avions besoin n’était pas disponible hier ;","dont · 未完成过去时","avoir besoin de → dont；était 描述过去的状态。"],["j’ai donc demandé au fournisseur","复合过去时 · 逻辑连接","donc 表示因此，j’ai demandé 是已完成的动作。"],["de nous en proposer une autre.","代词 en","en 代替 une pelle，une autre 保留数量含义。"]],['dont','en','未完成过去时']),
make('eng-4','engineering','2026-10-18','物资采购与人员安排','在我们等待水泥送到的时候，工地负责人把工人们召集起来，向他们说明了新的安排。',[["Pendant que nous attendions la livraison du ciment,","时间状语 · 未完成过去时","attendions 表示当时持续的背景动作。"],["le chef de chantier a réuni les ouvriers","复合过去时","a réuni 是背景中发生的已完成事件。"],["et leur a expliqué la nouvelle organisation.","间接宾语代词 leur","leur 指代 aux ouvriers；不要与 les 直接宾语混淆。"]],['leur','复合过去时','人员管理']),
make('c1-1','c1','2026-10-20','城市转型与公共交通','这场讨论所揭示的，是居民们不愿放弃汽车，除非他们有一个可靠的替代方案。',[["Ce qui ressort de ce débat,","主语关系从句 ce qui","qui 在从句内作 ressort 的主语。"],["c’est que les habitants ne veulent pas renoncer à leur voiture","否定式 · 论点","renoncer à：放弃；ne veulent pas 包围变位动词。"],["à moins qu’ils ne disposent d’une solution fiable.","条件 · 虚拟式","à moins que 表示除非，ne 为赘词。"]],['ce qui','否定式','逻辑连接词']),
make('c1-2','c1','2026-10-19','访谈：政策的实际效果','虽然这项措施让一些家庭得到了帮助，但它仍不足以减少不平等，这正是协会们所批评的。',[["Bien que cette mesure ait permis d’aider certaines familles,","让步 · 虚拟式过去时","bien que + 虚拟式；ait permis 表示先于主句的事实。"],["elle reste insuffisante pour réduire les inégalités,","论证主句","insuffisante 与阴性名词 mesure 呼应。"],["ce que les associations lui reprochent.","ce que · lui","reprocher quelque chose à quelqu’un；lui 指向措施。"]],['ce que','lui','逻辑连接词']),
make('daily-1','daily','2026-10-20','把文件带到办公室','你给我的那些文件，我放在办公室了；如果你今天下午去那里，你可以把它们取回来。',[["Les documents que tu m’as donnés,","关系从句 · 过去分词配合","que 指 documents，置前直接宾语使 donnés 加 s。"],["je les ai laissés au bureau ;","直接宾语 les","les 代替 documents，laissés 与其配合。"],["si tu y passes cet après-midi, tu peux les récupérer.","地点代词 y","y 代替 au bureau；les 仍指文件。"]],['les','y','复合过去时']),
make('daily-2','daily','2026-10-19','确认付款与送货','我还没有收到发票。你一收到，就能把它发给我吗？我需要它来确认订单。',[["Je n’ai pas encore reçu la facture.","复合过去时否定","ne…pas encore 表示还没有。"],["Dès que tu la reçois, peux-tu me l’envoyer ?","时间连接词 · 双代词","me 在 le/la 前；la 在元音前省音为 l’。"],["J’en ai besoin pour confirmer la commande.","代词 en","en 替代 de la facture，与 avoir besoin de 呼应。"]],['la','en','否定式'])
];
export const fullText = (e:Exercise) => e.chunks.map(c=>c.text).join(' ');
export function normalize(s:string){return s.toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’']/g,' ').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();}
export function mergeExercises(existing:Exercise[], input:unknown):{items:Exercise[];added:number} {
 if(!Array.isArray(input)||input.length>2000) throw new Error('题库必须是数组，单次最多 2000 题。');
 const validUrl=(s:unknown)=>s===undefined||(typeof s==='string'&&(/^https?:\/\//.test(s)||/^\.\/audio\/[a-zA-Z0-9_-]+\.(mp3|m4a|ogg|wav)$/.test(s)));
 const result=[...existing]; const ids=new Set(existing.map(e=>e.id)); const texts=new Set(existing.map(e=>normalize(fullText(e))));
 for(const v of input){
 if(!v||typeof v!=='object')throw new Error('题目格式不正确。');
 const e=v as Exercise;
 if(typeof e.id!=='string'||!e.id.trim()||!['c1','engineering','daily'].includes(e.module)||typeof e.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(e.date)||Number.isNaN(Date.parse(e.date))||new Date(e.date).toISOString().slice(0,10)!==e.date||typeof e.title!=='string'||typeof e.translation!=='string'||typeof e.sample!=='boolean'||!Array.isArray(e.tags)||!e.tags.every(t=>typeof t==='string')||!Array.isArray(e.chunks)||!e.chunks.length||!validUrl(e.audioUrl)||!e.chunks.every(c=>c&&typeof c.text==='string'&&c.text.trim()&&typeof c.role==='string'&&typeof c.tip==='string'&&validUrl(c.audioUrl)))throw new Error('题目字段不完整或无效，请参照示例 JSON（音频需为 HTTP/HTTPS 地址）。');
 if(e.format!==undefined&&!['passage','single'].includes(e.format))throw new Error('材料类型无效。');
 if(e.lesson!==undefined&&!validLesson(e.lesson))throw new Error('长篇原音题库的时间轴或意群数据无效。');
 if(e.chunks.some(c=>c.prosody!==undefined&&(!Array.isArray(c.prosody)||!c.prosody.length||!c.prosody.every(p=>p&&typeof p.text==='string'&&typeof p.note==='string'&&['↗','↘','→'].includes(p.tone)))))throw new Error('语调标注格式无效。');
 const key=normalize(fullText(e)); if(!ids.has(e.id)&&!texts.has(key)){result.push(e);ids.add(e.id);texts.add(key);}
 }
 return {items:result,added:result.length-existing.length};
}

function validLesson(l:LongLesson){
 if(!l||typeof l!=='object'||!['title','source','audioUrl','transcriptNote','intonationNote'].every(k=>typeof l[k as keyof LongLesson]==='string')||!(l.duration>0)||!Number.isFinite(l.duration)||!(/^(https?:\/\/|\.\/audio\/[a-zA-Z0-9_-]+\.(mp3|m4a|ogg|wav)$)/.test(l.audioUrl))||!Array.isArray(l.sentences)||!l.sentences.length)return false;
 return l.sentences.every((s,i)=>s&&validTiming(s.start,s.end,l.duration)&&(!i||s.start>=l.sentences[i-1].end)&&['speaker','section','text','translation'].every(k=>typeof s[k as keyof typeof s]==='string')&&Array.isArray(s.chunks)&&s.chunks.length&&s.chunks.every((c,j)=>c&&validTiming(c.start,c.end,l.duration)&&c.start>=s.start&&c.end<=s.end&&(!j||c.start>=s.chunks[j-1].end)&&['text','translation','role','tip'].every(k=>typeof c[k as keyof typeof c]==='string')&&['↗','↘','→'].includes(c.tone)));
}

export const isPassage = (e:Exercise) => e.format==='passage'||!!e.lesson||(e.format!=='single'&&e.chunks.length>=8);
