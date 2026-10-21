import * as ort from 'onnxruntime-web/wasm';
import wasmUrl from 'onnxruntime-web/ort-wasm-simd-threaded.wasm?url';
import mjsUrl from 'onnxruntime-web/ort-wasm-simd-threaded.mjs?url';
import config from './neural-config.json';
let session:Promise<ort.InferenceSession>|undefined;
export async function synthesizeNeural(phones:string,modelUrl:string){
 ort.env.wasm.numThreads=1;ort.env.wasm.proxy=false;ort.env.wasm.wasmPaths={wasm:wasmUrl,mjs:mjsUrl};
 session||=ort.InferenceSession.create(modelUrl,{executionProviders:['wasm']}).catch(e=>{session=undefined;throw e;});
 const model=await session,map=config.phoneme_id_map as Record<string,number[]>;
 const ids=[...map['^'],...map['_']];for(const phone of phones.trim().replace(/\s+/g,' ')){if(map[phone])ids.push(...map[phone],...map['_']);}ids.push(...map['$']);
 if(ids.length<8)throw new Error('未能识别有效的法语音素');
 const result=await model.run({input:new ort.Tensor('int64',BigInt64Array.from(ids.map(BigInt)),[1,ids.length]),input_lengths:new ort.Tensor('int64',BigInt64Array.from([BigInt(ids.length)]),[1]),scales:new ort.Tensor('float32',Float32Array.from([.667,1.05,.8]),[3])});
 const samples=result[model.outputNames[0]].data as Float32Array;
 let peak=0;for(const x of samples)if(Math.abs(x)>peak)peak=Math.abs(x);if(!samples.length||peak<.0001)throw new Error('自然音源未生成有效声音');
 const wav=new ArrayBuffer(44+samples.length*2),view=new DataView(wav);const str=(offset:number,s:string)=>{for(let i=0;i<s.length;i++)view.setUint8(offset+i,s.charCodeAt(i));};
 str(0,'RIFF');view.setUint32(4,wav.byteLength-8,true);str(8,'WAVE');str(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,22050,true);view.setUint32(28,44100,true);view.setUint16(32,2,true);view.setUint16(34,16,true);str(36,'data');view.setUint32(40,samples.length*2,true);for(let i=0;i<samples.length;i++)view.setInt16(44+i*2,Math.round(Math.max(-1,Math.min(1,samples[i]*.9/peak))*32767),true);
 for(const value of Object.values(result))value.dispose();return wav;
}
