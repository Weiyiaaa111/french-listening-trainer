"""Generate French neural sample MP3s with a downloaded Piper/SIWIS model.
Models stay outside the repository; only licensed audio output is published.
Requires sherpa-onnx, numpy, ffmpeg. See README for sources and attribution.
"""
import argparse,concurrent.futures,hashlib,json,subprocess,tempfile,wave,time
from pathlib import Path
import numpy as np
_tts=None

def init(model_dir):
 import sherpa_onnx
 global _tts
 p=Path(model_dir)
 cfg=sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(vits=sherpa_onnx.OfflineTtsVitsModelConfig(model=str(p/'fr_FR-siwis-medium.onnx'),tokens=str(p/'tokens.txt'),data_dir=str(p/'espeak-ng-data')),num_threads=1,provider='cpu'),max_num_sentences=1)
 _tts=sherpa_onnx.OfflineTts(cfg)

def generate(job):
 spoken,path=job
 dest=Path(path)
 if dest.exists():return
 audio=_tts.generate(spoken,sid=0,speed=1.0)
 samples=np.asarray(audio.samples,dtype=np.float32)
 if len(samples)<200 or not np.isfinite(samples).all() or np.max(np.abs(samples))<.001:raise RuntimeError('Empty or invalid speech: '+spoken[:60])
 peak=float(np.max(np.abs(samples)));samples=samples*(.9/peak)
 with tempfile.NamedTemporaryFile(suffix='.wav') as f:
  with wave.open(f.name,'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(audio.sample_rate);w.writeframes((samples.clip(-1,1)*32767).astype('<i2').tobytes())
  subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',f.name,'-codec:a','libmp3lame','-b:a','64k',str(dest)],check=True)

if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--input',required=True);p.add_argument('--model-dir',required=True);p.add_argument('--workers',type=int,default=4);a=p.parse_args()
 out=Path('public/audio/neural-fr');out.mkdir(parents=True,exist_ok=True)
 model_hash=hashlib.sha256((Path(a.model_dir)/'fr_FR-siwis-medium.onnx').read_bytes()).hexdigest()
 mapping={};jobs={}
 for text,spoken in json.loads(Path(a.input).read_text()).items():
  name=hashlib.sha256(('siwis-neural-v1:'+model_hash+':'+spoken).encode()).hexdigest()[:20]+'.mp3';mapping[text]='./audio/neural-fr/'+name;jobs[str(out/name)]=spoken
 started=time.monotonic()
 with concurrent.futures.ProcessPoolExecutor(max_workers=a.workers,initializer=init,initargs=(a.model_dir,)) as pool:
  futures=[pool.submit(generate,(spoken,path)) for path,spoken in jobs.items()]
  for n,future in enumerate(concurrent.futures.as_completed(futures),1):
   future.result()
   if n%25==0 or n==len(futures):print(f'{n}/{len(futures)} clips complete; {time.monotonic()-started:.1f}s',flush=True)
 Path('src/sample-audio.json').write_text(json.dumps(mapping,ensure_ascii=False,separators=(',',':')))
 Path('src/sample-audio-info.json').write_text(json.dumps({'engine':'Piper VITS / sherpa-onnx','voice':'fr_FR-siwis-medium','type':'pretrained-neural','modelSha256':model_hash,'clips':len(jobs),'license':'CC-BY-4.0','source':'https://github.com/k2-fsa/sherpa-onnx/releases/tag/tts-models'},indent=2))
 print('Complete: neural manifest published.',flush=True)
