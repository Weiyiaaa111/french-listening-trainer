"""Generate static French sample audio; no runtime speech package required for samples.
Input is exported by Vite SSR (see command in README). Requires ffmpeg and eSpeak C ABI.
"""
import argparse,ctypes,hashlib,json,subprocess,tempfile,wave
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--input',required=True);p.add_argument('--engine',required=True);p.add_argument('--data',required=True);a=p.parse_args()
lib=ctypes.CDLL(a.engine);lib.espeak_Initialize.argtypes=[ctypes.c_int,ctypes.c_int,ctypes.c_char_p,ctypes.c_int];rate=lib.espeak_Initialize(2,0,a.data.encode(),0)
lib.espeak_SetVoiceByName.argtypes=[ctypes.c_char_p]
assert rate>0 and lib.espeak_SetVoiceByName(b'fr')==0,'French voice unavailable'
lib.espeak_SetParameter(1,165,0)
samples=[]
@ctypes.CFUNCTYPE(ctypes.c_int,ctypes.POINTER(ctypes.c_short),ctypes.c_int,ctypes.c_void_p)
def callback(data,count,events):
 if data and count:samples.append(ctypes.string_at(data,count*2))
 return 0
lib.espeak_SetSynthCallback(callback);lib.espeak_Synth.argtypes=[ctypes.c_char_p,ctypes.c_size_t,ctypes.c_uint,ctypes.c_int,ctypes.c_uint,ctypes.c_uint,ctypes.c_void_p,ctypes.c_void_p]
out=Path('public/audio/samples');out.mkdir(parents=True,exist_ok=True);mapping={}
for text,spoken in json.loads(Path(a.input).read_text()).items():
 name=hashlib.sha256(spoken.encode()).hexdigest()[:20]+'.mp3';dest=out/name;mapping[text]='./audio/samples/'+name
 if dest.exists():continue
 samples.clear();encoded=spoken.encode();assert lib.espeak_Synth(encoded,len(encoded)+1,0,1,0,1,None,None)==0
 with tempfile.NamedTemporaryFile(suffix='.wav') as f:
  with wave.open(f.name,'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate);w.writeframes(b''.join(samples))
  subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',f.name,'-codec:a','libmp3lame','-b:a','48k',str(dest)],check=True)
Path('src/sample-audio.json').write_text(json.dumps(mapping,ensure_ascii=False,separators=(',',':')))
print('Audio clips:',len(mapping),'total bytes:',sum(f.stat().st_size for f in out.glob('*.mp3')))
