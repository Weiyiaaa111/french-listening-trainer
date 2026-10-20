import type {Exercise,Module} from './data';
import {suggestProsody} from './prosody';
export type ParsedPaste={title:string;module:Module;date:string;french:string[];chinese:string[];notes:string;warnings:string[]};
const han=/[\u3400-\u9fff]/u,latin=/[a-zÀ-ÿœŒ]/i;
function clean(s:string){return s.replace(/\*\*|__/g,'').replace(/^\s*(?:#{1,6}\s*|[-•]\s+|\d+[.)、]\s*|[一二三四五六七八九十]+、\s*)/u,'').trim();}
function sentences(text:string,lang:string){return [...new Intl.Segmenter(lang,{granularity:'sentence'}).segment(text)].map(s=>s.segment.trim()).filter(Boolean);}
export function parsePaste(raw:string,defaults:{module:Module;date:string}):ParsedPaste{
 if(raw.length>100000)throw new Error('内容超过10万字符，请分批粘贴。');
 const result:ParsedPaste={title:'',module:defaults.module,date:defaults.date,french:[],chinese:[],notes:'',warnings:[]};
 let mode:'auto'|'fr'|'zh'|'notes'='auto';const fr:string[]=[],zh:string[]=[],notes:string[]=[];
 const lines=raw.replace(/\r\n?/g,'\n').replace(/(?<=[^\n])(?=(?:标题|法语(?:原文|内容)?|中文(?:意思|翻译)?|日期|模块|解析|备注)\s*[:：])/gu,'\n').split('\n').map(clean).filter(Boolean);
 for(let line of lines){
  let m:RegExpMatchArray|null;
  if((m=line.match(/^(?:标题|主题|题目|titre|title)\s*[:：]\s*(.*)$/iu))){result.title=m[1];continue;}
  if((m=line.match(/^(?:(?:日期|date)\s*[:：]\s*)?(\d{4})[年/.-](\d{1,2})[月/.-](\d{1,2})日?\s*$/iu))){const date=`${m[1]}-${m[2].padStart(2,'0')}-${m[3].padStart(2,'0')}`;if(Number.isNaN(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date)throw new Error('识别到的日期无效，请在粘贴框修改。');result.date=date;continue;}
  if(/^(?:DALF C1|工程法语|日常法语)$/i.test(line)){result.module=/工程/.test(line)?'engineering':/日常/.test(line)?'daily':'c1';continue;}
  if((m=line.match(/^(?:模块|分类|module)\s*[:：]\s*(.*)$/iu))){if(/工程|engineering/i.test(m[1]))result.module='engineering';else if(/C1|DALF/i.test(m[1]))result.module='c1';else if(/日常|daily/i.test(m[1]))result.module='daily';else result.warnings.push('未识别模块，暂用当前模块。');continue;}
  const labels:[RegExp,'auto'|'fr'|'zh'|'notes'][]=[[/^(?:法语(?:原文|内容|全文|完整文稿)?|原文|français|francais|french|transcription)(?:\s*[（(][^）)]*[）)])?(?:\s*[:：]\s*(.*)|\s*$)/iu,'fr'],[/^(?:中文(?:意思|翻译|译文)?|意思|翻译|译文|chinois|traduction(?:\s+chinoise)?|translation)(?:\s*[:：]\s*(.*)|\s*$)/iu,'zh'],[/^(?:解析|解释|语法(?:说明|解析)?|备注|使用场景|analyse|explication)(?:\s*[:：]\s*(.*)|\s*$)/iu,'notes']];
  let labeled=false;for(const [regex,next] of labels){const match=line.match(regex);if(match){mode=next;line=match[1]?.trim()||'';labeled=true;break;}}
  if(labeled&&!line)continue;
  if(mode==='notes'){notes.push(line);continue;}
  if(/^(?:Source|来源)\s*[:：]/i.test(line)){notes.push(line);continue;}
  if(mode==='zh'&&han.test(line)){zh.push(line);continue;}
  if(!result.title&&!fr.length&&han.test(line)&&!labeled){result.title=line;continue;}
  if(han.test(line)&&latin.test(line)&&latin.test(line[0])){
   const at=line.search(han);const a=line.slice(0,at).trim(),b=line.slice(at).trim();if(a){fr.push(a);zh.push(b);continue;}
  }
  if(han.test(line)&&(!latin.test(line)||mode==='auto')){zh.push(line);continue;}
  if(latin.test(line)){
   if(!result.title&&!fr.length&&!labeled&&line.length<70&&!/[.!?]/.test(line)&&lines.some(v=>v!==line&&latin.test(v))){result.title=line;result.warnings.push('首行暂识别为标题，请查看预览是否正确。');continue;}
   if(fr.length&&!/[.!?;…]$/.test(fr.at(-1)!)&&/^[a-zà-ÿœ]/.test(line)&&mode==='fr')fr[fr.length-1]+=' '+line;else fr.push(line);
  }else result.warnings.push(`未能识别这一行：${line.slice(0,60)}`);
 }
 result.french=fr.flatMap(line=>sentences(line,'fr'));result.chinese=zh.flatMap(line=>sentences(line,'zh'));result.notes=notes.join('\n');
 if(!result.french.length)throw new Error('没有识别到法语。请将法语原句一起粘贴进来。');
 if(result.french.length>200)throw new Error('一次最多识别200句，请分批添加。');
 if(!result.title)result.title=result.french[0].replace(/\s*\/\s*/g,' ').slice(0,36);
 if(!result.chinese.length)result.warnings.push('未找到中文，保存后暂不显示中文译文。');
 else if(result.chinese.length!==result.french.length)result.warnings.push('中法句数不同：中文暂按整段保留，不会错误地分配给某一句。');
 return result;
}
export function exerciseFromPaste(p:ParsedPaste):Exercise{
 const passage=p.french.length>1;const chunks=passage?p.french:p.french[0].split(' / ').filter(Boolean);
 const paired=p.french.length===p.chinese.length;const singleChinese=!passage&&p.chinese.length===1?p.chinese[0].split(' / '):[];
 return {id:'personal-'+crypto.randomUUID(),module:p.module,date:p.date,title:p.title,sample:false,format:passage?'passage':'single',tags:['整段粘贴识别',`${p.french.length} 句`],translation:p.chinese.join(' ')||'暂未添加中文。',notes:p.notes||undefined,chunks:chunks.map((text,i)=>({text:text.replaceAll(' / ',' '),role:passage?`第 ${i+1} 句`:`意群 ${i+1}`,translation:passage&&paired?p.chinese[i]:singleChinese.length===chunks.length?singleChinese[i]:undefined,tip:p.notes&&p.french.length===1?p.notes:'本句未单独提供语法说明；语调为朗读建议。',prosody:suggestProsody(text)}))};
}
