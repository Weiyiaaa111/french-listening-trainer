import type {Exercise} from './data';
import {suggestProsody} from './prosody';
import SentenceShadowing from './SentenceShadowing';
import ChunkPracticeBank from './ChunkPracticeBank';
export default function SyntheticChunkPractice({exercise,index,active=true,onPlay,onBeforeRecord}:{exercise:Exercise;index:number|null;active?:boolean;onPlay:(text:string)=>void;onBeforeRecord:()=>void}){
 if(index===null)return null;
 const lesson={sentences:exercise.chunks.map(c=>({chunks:(c.prosody||suggestProsody(c.text)).map((p,i)=>({text:p.text,tone:p.tone,role:`句内意群 ${i+1}`,tip:(c.prosody||suggestProsody(c.text)).length===1?c.tip:p.note}))}))};
 return <section className="synthetic-chunk-practice" aria-label="句内意群跟读与复述"><h3>选择本句意群</h3><p className="muted">先选意群，再重复听、录音复述；解析需单独点击。</p><ChunkPracticeBank lesson={lesson} selected={index} active={active} onPlay={c=>onPlay(c.text)} onBeforeRecord={onBeforeRecord}/><details><summary>跟读整句（可选）</summary><SentenceShadowing index={index} onPlay={i=>onPlay(exercise.chunks[i].text)} onBeforeRecord={onBeforeRecord}/></details></section>;
}
