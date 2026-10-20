let worker:Worker|undefined,id=0;
const jobs=new Map<number,{resolve:(blob:Blob)=>void;reject:(err:Error)=>void;cleanup:()=>void}>(),cache=new Map<string,Blob>();
export function basicFrenchAudio(text:string,signal:AbortSignal):Promise<Blob>{
 if(signal.aborted)return Promise.reject(new DOMException('已取消','AbortError'));
 const saved=cache.get(text);if(saved)return Promise.resolve(saved);
 if(!worker){worker=new Worker(new URL('./fallback-worker.ts',import.meta.url),{type:'module'});worker.onmessage=e=>{const job=jobs.get(e.data.id);if(!job)return;jobs.delete(e.data.id);job.cleanup();if(e.data.error)job.reject(new Error(e.data.error));else job.resolve(new Blob([e.data.buffer],{type:'audio/wav'}));};worker.onerror=()=>{for(const job of jobs.values()){job.cleanup();job.reject(new Error('基础法语音源加载失败，请检查网络后重试。'));}jobs.clear();worker?.terminate();worker=undefined;};}
 return new Promise<Blob>((resolve,reject)=>{const key=++id;const abort=()=>{jobs.delete(key);clearTimeout(timer);reject(new DOMException('已取消','AbortError'));};const timer=setTimeout(()=>{jobs.delete(key);signal.removeEventListener('abort',abort);reject(new Error('基础音源加载超时，请检查网络后重试。'));},45000);signal.addEventListener('abort',abort,{once:true});jobs.set(key,{cleanup:()=>{clearTimeout(timer);signal.removeEventListener('abort',abort);},reject,resolve:blob=>{if(cache.size>=32)cache.delete(cache.keys().next().value!);cache.set(text,blob);resolve(blob);}});worker!.postMessage({id:key,text});});
}
