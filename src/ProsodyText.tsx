import {suggestProsody,toneNames,type Tone,type ProsodyPart} from './prosody';
export default function ProsodyText({text,parts,ending}:{text:string;parts?:ProsodyPart[];ending?:Tone}){
 return <>{(parts||suggestProsody(text,ending)).map((part,i)=><span className="prosody-part" key={i}>{i>0&&<span className="prosody-slash"> / </span>}<span>{part.text}</span>{' '}<span className="tone" title={part.note} aria-label={`朗读建议：${toneNames[part.tone]}`}>{part.tone}</span></span>)}</>;
}
export function ProsodyLegend(){return <p className="intonation-legend">语调朗读建议：↗ 上扬 · ↘ 下沉 · → 延续；/ 为练习分段建议，不代表原音必然停顿。箭头基于句法提供，不是原音音高测量，也不会改变合成音的实际语调。</p>;}
