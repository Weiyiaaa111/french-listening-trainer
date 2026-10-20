export function waitForMetadata(audio:HTMLAudioElement,signal:AbortSignal):Promise<void>{
 if(signal.aborted)return Promise.reject(new DOMException('播放已取消','AbortError'));
 if(audio.readyState>=1)return Promise.resolve();
 return new Promise((resolve,reject)=>{const cleanup=()=>{clearTimeout(timer);audio.removeEventListener('loadedmetadata',loaded);audio.removeEventListener('error',failed);signal.removeEventListener('abort',aborted);};const loaded=()=>{cleanup();resolve();};const failed=()=>{cleanup();reject(new Error('原音加载失败，请检查网络后重试。'));};const aborted=()=>{cleanup();reject(new DOMException('播放已取消','AbortError'));};const timer=setTimeout(()=>{cleanup();reject(new Error('原音加载超时，请稍后重试。'));},10000);audio.addEventListener('loadedmetadata',loaded);audio.addEventListener('error',failed);signal.addEventListener('abort',aborted,{once:true});if(audio.networkState===0)audio.load();});
}
export async function playTimedAudio(audio:HTMLAudioElement,start:number,rate:number,signal:AbortSignal){await waitForMetadata(audio,signal);if(signal.aborted)throw new DOMException('播放已取消','AbortError');if(!Number.isFinite(start)||start<0||(Number.isFinite(audio.duration)&&start>=audio.duration))throw new Error('这个片段的时间超出了原音范围。');audio.playbackRate=rate;audio.currentTime=start;await audio.play();}
export async function frenchVoices(signal:AbortSignal):Promise<SpeechSynthesisVoice[]>{
 const synth=window.speechSynthesis;if(!synth||signal.aborted)return [];
 const read=()=>synth.getVoices().filter(v=>v.lang.startsWith('fr'));const now=read();if(now.length)return now;
 return new Promise(resolve=>{const finish=()=>{clearTimeout(timer);clearInterval(poll);synth.removeEventListener('voiceschanged',changed);signal.removeEventListener('abort',finish);resolve(signal.aborted?[]:read());};const changed=()=>{if(read().length)finish();};const timer=setTimeout(finish,1800),poll=setInterval(changed,100);synth.addEventListener('voiceschanged',changed);signal.addEventListener('abort',finish,{once:true});});
}
