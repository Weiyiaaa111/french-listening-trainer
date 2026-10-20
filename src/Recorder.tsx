import { useEffect, useRef, useState } from 'react';
import { Mic, Square, Trash2 } from 'lucide-react';
export default function Recorder({onBeforeRecord}:{onBeforeRecord?:()=>void}){
 const [status,setStatus]=useState<'idle'|'requesting'|'recording'>('idle'); const [url,setUrl]=useState(''); const [error,setError]=useState('');
 const rec=useRef<MediaRecorder|null>(null),stream=useRef<MediaStream|null>(null),alive=useRef(true),currentUrl=useRef(''),timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 const player=useRef<HTMLAudioElement|null>(null);
 function deleteRecording(){player.current?.pause();URL.revokeObjectURL(currentUrl.current);currentUrl.current='';setUrl('');setError('');}
 const release=()=>{stream.current?.getTracks().forEach(t=>t.stop());stream.current=null;clearTimeout(timer.current);};
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;if(rec.current?.state==='recording')rec.current.stop();release();URL.revokeObjectURL(currentUrl.current);};},[]);
 async function start(){
 onBeforeRecord?.();
 setError('');
 if(!window.isSecureContext){setError('录音需要 HTTPS 安全连接，或在本机 localhost 运行。');return;}
 if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==='undefined'){setError('此浏览器不支持录音，请使用新版 Chrome、Edge、Safari 或 Firefox。');return;}
 setStatus('requesting');
 try{const s=await navigator.mediaDevices.getUserMedia({audio:true});if(!alive.current){s.getTracks().forEach(t=>t.stop());return;}stream.current=s;
 const mime=['audio/webm;codecs=opus','audio/mp4','audio/ogg;codecs=opus'].find(t=>MediaRecorder.isTypeSupported(t));
 const r=new MediaRecorder(s,mime?{mimeType:mime}:undefined);rec.current=r;const chunks:BlobPart[]=[];
 r.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
 r.onerror=()=>{if(alive.current){setError('录音中断，请检查麦克风后重试。');setStatus('idle');}release();};
 r.onstop=()=>{release();if(!alive.current)return;setStatus('idle');const blob=new Blob(chunks,{type:r.mimeType});if(!blob.size){setError('没有录到音频，请检查输入设备后重试。');return;}URL.revokeObjectURL(currentUrl.current);currentUrl.current=URL.createObjectURL(blob);setUrl(currentUrl.current);};
 r.start();setStatus('recording');timer.current=setTimeout(()=>{if(r.state==='recording')r.stop();},300000);
 }catch(e){release();if(!alive.current)return;setStatus('idle');const name=(e as DOMException).name;setError(name==='NotAllowedError'?'麦克风权限被拒绝。请在地址栏的网站设置中允许麦克风，再重试。':name==='NotFoundError'?'没有找到麦克风，请连接输入设备。':name==='NotReadableError'?'麦克风被占用或不可用，请关闭其他录音应用后重试。':'无法开始录音，请检查浏览器权限和麦克风。');}
 }
 return <div className="recorder"><div><strong>跟读，让表达成为自己的</strong><p>听原音 → 录下复述 → 对照回听 · 不提供自动评分</p></div><button className={status==='recording'?'record active':'record'} disabled={status==='requesting'} onClick={()=>status==='recording'?rec.current?.stop():void start()}>{status==='recording'?<Square size={16}/>:<Mic size={17}/>} {status==='recording'?'停止录音':status==='requesting'?'等待麦克风授权…':'开始录音'}</button>{status==='recording'&&<small role="status">● 正在录音，最长 5 分钟</small>}{error&&<p role="alert" className="error">{error}</p>}{url&&<div className="record-result"><audio ref={player} aria-label="我的跟读录音" controls src={url}/><a href={url} download="ecoute-recording">下载录音</a><button className="secondary delete-recording" onClick={deleteRecording}><Trash2 size={15}/>删除录音</button></div>}</div>;
}
