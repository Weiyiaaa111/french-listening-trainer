import {useEffect,useState} from 'react';
import Recorder from './Recorder';
export default function SentenceShadowing({index,unit='句',onPlay,onBeforeRecord}:{index:number|null;unit?:string;onPlay:(index:number)=>void;onBeforeRecord:()=>void}){
 const [visited,setVisited]=useState<number[]>(index===null?[]:[index]);
 useEffect(()=>{if(index!==null)setVisited(old=>old.includes(index)?old:[...old,index]);},[index]);
 return <section className="sentence-shadowing" aria-label={`${unit==='句'?'单句':'意群'}跟读区`}><h3>{unit==='句'?'单句':'意群'}跟读与口头复述</h3>{index===null?<p className="muted">先点上方编号选一个{unit}，这里就能单独跟读、录音和回放。</p>:<><p className="muted">第 {index+1} {unit}：先听这一{unit}，可以跟着说，也可以不看原文用自己的话复述，不必先写答案。它和上方整篇录音分别保存；切换编号会保留本题中已录的声音。</p><button className="secondary" onClick={()=>onPlay(index)}>播放本{unit}原音</button></>}{visited.map(i=><div hidden={index!==i} key={i}><Recorder heading={`第 ${i+1} ${unit}跟读录音`} unit={unit} active={index===i} onBeforeRecord={onBeforeRecord}/></div>)}<p className="muted">录音在本题内临时保留，离开题目或刷新前请下载需要的录音。</p></section>;
}
