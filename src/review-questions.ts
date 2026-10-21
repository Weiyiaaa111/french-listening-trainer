import type {TrainingSentence,Unit} from './training-model';
export type ReviewQuestion={id:string;kind:'单词'|'词组'|'表达';term:string;meaning?:string;prompt:string;options:string[];answer:string;context:TrainingSentence;audio:Unit;direction?:'meaning'|'recall'|'cloze'};
type Entry={term:string;meaning:string;kind:ReviewQuestion['kind'];forms?:string[]};
const entries:Entry[]=[
 {term:'ailleurs',meaning:'在别处',kind:'单词'},
 {term:'vérité',meaning:'真相；真实',kind:'单词'},
 {term:'théorie du complot',forms:['théories du complot','théorie du complot'],meaning:'阴谋论',kind:'词组'},
 {term:'bien sûr',meaning:'当然',kind:'表达'},
 {term:'en fait',meaning:'事实上；其实',kind:'表达'},
 {term:'se rendre compte',forms:['se rendre compte','rend compte','rendent compte'],meaning:'意识到；发现',kind:'词组'},
 {term:'en revanche',meaning:'相反；另一方面',kind:'表达'},
 {term:'ce qui',meaning:'……的事情（在从句中作主语）',kind:'表达'},
 {term:'ce que',forms:['ce que','ce qu’'],meaning:'……的事情（在从句中作宾语）',kind:'表达'},
 {term:'dont',meaning:'关系代词，承接带 de 的内容',kind:'单词'},
 {term:'parce que',meaning:'因为',kind:'表达'},
 {term:'pourtant',meaning:'然而；可是',kind:'单词'},
 {term:'cependant',meaning:'然而；不过',kind:'单词'},
 {term:'bien que',meaning:'虽然；尽管',kind:'表达'},
 {term:'en attendant',meaning:'在此期间；与此同时',kind:'表达'},
 {term:'au sujet de',forms:['au sujet de','au sujet du'],meaning:'关于……',kind:'词组'},
 {term:'avoir besoin de',forms:['ai besoin de','avons besoin de','a besoin de','besoin de','besoin d’'],meaning:'需要……',kind:'词组'},
 {term:'mettre en place',forms:['mettre en place','mise en place'],meaning:'建立；落实；安排到位',kind:'词组'},
 {term:'remise en état',meaning:'修复；恢复原状',kind:'词组'},
 {term:'voie d’accès',meaning:'进场通道；通路',kind:'词组'},
 {term:'chantier',meaning:'工地；施工现场',kind:'单词'},
 {term:'engin',forms:['engins','engin'],meaning:'工程机械；设备',kind:'单词'},
 {term:'contrôleur',meaning:'检查人员；监理人员',kind:'单词'},
 {term:'expliquer',forms:['expliqué','expliquer','explique'],meaning:'解释；说明',kind:'单词'},
 {term:'forage',meaning:'钻孔；钻井',kind:'单词'},
 {term:'débit',meaning:'流量；出水量',kind:'单词'},
 {term:'fournisseur',meaning:'供应商',kind:'单词'},
 {term:'matériel',meaning:'设备；器材',kind:'单词'},
 {term:'livraison',meaning:'交货；配送',kind:'单词'},
 {term:'confirmer',forms:['confirmer','confirmez','confirme'],meaning:'确认',kind:'单词'},
 {term:'délai',forms:['délais','délai'],meaning:'期限；所需时间',kind:'单词'},
 {term:'réunion',meaning:'会议',kind:'单词'},
 {term:'facture',meaning:'发票；账单',kind:'单词'},
 {term:'loyer',meaning:'房租',kind:'单词'},
 {term:'commande',meaning:'订单；订购',kind:'单词'},
 {term:'document',forms:['documents','document'],meaning:'文件',kind:'单词'},
 {term:'bureau',meaning:'办公室；办公桌',kind:'单词'},
 {term:'récupérer',meaning:'取回；拿回',kind:'单词'},
 {term:'rendez-vous',meaning:'预约；约会',kind:'词组'},
 {term:'s’il vous plaît',meaning:'请（礼貌用语）',kind:'表达'},
 {term:'pourriez-vous',meaning:'您能否……（委婉请求）',kind:'表达'},
 {term:'je vous remercie',meaning:'谢谢您（较正式）',kind:'表达'},
 {term:'merci',meaning:'谢谢',kind:'表达'},
 {term:'bonjour',meaning:'您好；你好',kind:'表达'},
];
function fold(s:string){return s.toLocaleLowerCase('fr').replaceAll('’',"'");}
function contains(text:string,form:string){const at=fold(text).indexOf(fold(form));if(at<0)return false;const before=text[at-1]||'',after=text[at+form.length]||'';return !/[\p{L}\p{N}]/u.test(before)&&(!/[\p{L}\p{N}]/u.test(after)||/[’']$/.test(form));}
function mix<T>(items:T[],seed:number):T[]{const result=[...items];let n=seed+1;for(let i=result.length-1;i>0;i--){n=(n*1664525+1013904223)>>>0;const j=n%(i+1);[result[i],result[j]]=[result[j],result[i]];}return result;}
export function buildReviewQuestions(sentences:TrainingSentence[]):ReviewQuestion[]{
 const found=entries.flatMap((entry,index)=>{const context=sentences.find(s=>(entry.forms||[entry.term]).some(f=>contains(s.text,f)));if(!context)return [];const source=context.chunks.find(c=>(entry.forms||[entry.term]).some(f=>contains(c.text,f)))||context;const distractors=mix(entries.filter(e=>e.meaning!==entry.meaning),index).slice(0,3).map(e=>e.meaning);return [{id:'term-'+index,kind:entry.kind,term:entry.term,meaning:entry.meaning,prompt:`「${entry.term}」在材料中的意思是？`,options:mix([entry.meaning,...distractors],index+7),answer:entry.meaning,context,audio:source}];});
 const balanced:ReviewQuestion[]=[];for(let n=0;n<found.length;n++)for(const kind of ['单词','词组','表达'] as const){const q=found.filter(q=>q.kind===kind)[n];if(q)balanced.push(q);}
 if(balanced.length)return balanced.slice(0,40).flatMap((q,i)=>{
 const other=entries.filter(e=>e.term!==q.term).map(e=>e.term);
 const result:ReviewQuestion[]=[{...q,direction:'meaning'},{...q,id:q.id+'-recall',direction:'recall',prompt:'根据中文，选择对应的法语表达。',options:mix([q.term,...mix(other,i+11).slice(0,3)],i+19),answer:q.term}];
 const entry=entries.find(e=>e.term===q.term)!;const form=(entry.forms||[entry.term]).find(f=>contains(q.context.text,f));
 if(form){const at=fold(q.context.text).indexOf(fold(form));const actual=q.context.text.slice(at,at+form.length);result.push({...q,id:q.id+'-cloze',direction:'cloze',prompt:'原句空缺处用了哪个词或表达？',context:{...q.context,text:q.context.text.slice(0,at)+'____'+q.context.text.slice(at+form.length)},options:mix([actual,...mix(other.filter(v=>fold(v)!==fold(actual)),i+29).slice(0,3)],i+43),answer:actual});}
 return result;
 });
 // Unknown imported text: test source recognition rather than invent a translation.
 return sentences.slice(0,3).flatMap((context,i)=>{const words=context.text.trim().split(/\s+/);if(words.length<2)return [];const term=words.slice(-2).join(' ');return [{id:'context-'+i,kind:'表达' as const,term,prompt:'原句空缺处用了哪个表达？',options:mix([term,'en attendant','bien sûr','en revanche'].filter((v,i,a)=>a.indexOf(v)===i),i+3),answer:term,context:{...context,text:words.slice(0,-2).join(' ')+' ____'},audio:context}];});
}
export function orderingQuestions(sentences:TrainingSentence[]){return sentences.filter(s=>s.chunks.length>1&&s.chunks.length<=8).slice(0,12);}
export function shuffledIndices(length:number,seed:number){const result=mix(Array.from({length},(_,i)=>i),seed);return result.every((v,i)=>v===i)?result.slice(1).concat(result[0]):result;}
