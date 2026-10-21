import ESpeakNG from 'espeak-ng';
import wasmUrl from 'espeak-ng/dist/espeak-ng.wasm?url';
// Independent synthesis worker: text in, WAV bytes out. No text leaves the browser.
self.onmessage=async(event:MessageEvent<{id:number;text:string;mode:'neural'|'basic';modelUrl:string}>)=>{const {id,text,mode,modelUrl}=event.data;try{
 const args=mode==='neural'?['-v','fr','-q','--ipa=3','--phonout','/phones.txt',text]:['-v','fr','-s','165','-w','/speech.wav',text];
 const engine=await ESpeakNG({locateFile:()=>wasmUrl,arguments:args,print:()=>{},printErr:()=>{}});
 let buffer:ArrayBuffer;
 if(mode==='neural'){const phones=new TextDecoder().decode(engine.FS.readFile('/phones.txt'));const {synthesizeNeural}=await import('./neural-synthesis');buffer=await synthesizeNeural(phones,modelUrl);}
 else{const bytes=engine.FS.readFile('/speech.wav') as Uint8Array;const wav=new Uint8Array(bytes);if(wav.length<44)throw new Error('未生成有效音频');const view=new DataView(wav.buffer);view.setUint32(4,wav.length-8,true);for(let at=12;at+8<=wav.length;){const type=String.fromCharCode(...wav.slice(at,at+4));if(type==='data'){view.setUint32(at+4,wav.length-at-8,true);break;}const size=view.getUint32(at+4,true);at+=8+size+(size%2);}buffer=wav.buffer;}
 self.postMessage({id,buffer},{transfer:[buffer]});
 }catch(err){self.postMessage({id,error:(err as Error).message||'语音生成失败'});}};
