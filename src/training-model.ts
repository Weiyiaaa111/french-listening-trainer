import {fullText,isPassage,type Exercise} from './data';
import {suggestProsody,type ProsodyPart} from './prosody';
export type Unit={text:string;translation?:string;role:string;tip:string;tone?:'↗'|'↘'|'→';start?:number;end?:number;audioUrl?:string;prosody?:ProsodyPart[]};
export type TrainingSentence=Unit&{chunks:Unit[];speaker?:string};
export function trainingSentences(e:Exercise):TrainingSentence[]{
 if(e.lesson)return e.lesson.sentences.map(s=>({...s,role:s.section,tip:''}));
 if(!isPassage(e))return [{text:fullText(e),translation:e.translation,role:'完整句',tip:e.notes||'',chunks:e.chunks.flatMap<Unit>(c=>{if((c as Unit).start!==undefined||(c as Unit).end!==undefined)return [c];const parts=c.prosody?.length&&c.prosody.every(p=>p.note.startsWith('朗读建议'))?suggestProsody(c.text):c.prosody||suggestProsody(c.text);return parts.length===1?[{...c,text:parts[0].text,tone:parts[0].tone}]:parts.map(p=>({text:p.text,tone:p.tone,role:'句内意群',tip:p.note}));})}];
 return e.chunks.map(c=>{const parts=c.prosody?.length&&c.prosody.every(p=>p.note.startsWith('朗读建议'))?suggestProsody(c.text):c.prosody||suggestProsody(c.text);return {...c,speaker:/^[ABC] ·/.test(c.role)?c.role:undefined,chunks:parts.map(p=>({text:p.text,tone:p.tone,role:'句内意群',tip:parts.length===1?c.tip:p.note,translation:parts.length===1?c.translation:undefined}))};});
}
