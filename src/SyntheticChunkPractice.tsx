import type {Exercise} from './data';
import {suggestProsody} from './prosody';
import ChunkPracticeBank from './ChunkPracticeBank';
export default function SyntheticChunkPractice({exercise,index,hideText,onPlay,onBeforeRecord}:{exercise:Exercise;index:number|null;hideText:boolean;onPlay:(text:string)=>void;onBeforeRecord:()=>void}){
 if(index===null)return null;
 const lesson={sentences:exercise.chunks.map(c=>({chunks:(c.prosody||suggestProsody(c.text)).map((p,i)=>({text:p.text,tone:p.tone,role:`句内意群 ${i+1}`,tip:p.note}))}))};
 const shown=Object.fromEntries(lesson.sentences.map((s,i)=>[i,s.chunks.length]));
 return <section className="synthetic-chunk-practice" aria-label="句内意群跟读与复述"><h3>再听句内的意群，直接跟读或复述</h3><p className="muted">以下各意群可单独播放、录音和回听。先隐藏文字，不用填写听写；意群音源为浏览器合成音。</p><ChunkPracticeBank lesson={lesson} selected={index} shown={shown} hiddenByDefault={hideText} onPlay={c=>onPlay(c.text)} onBeforeRecord={onBeforeRecord}/></section>;
}
