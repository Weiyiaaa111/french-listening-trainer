import sampleAudio from './sample-audio.json';
const canonical=(text:string)=>text.normalize('NFC').replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
const aliases=new Map(Object.entries(sampleAudio).map(([text,url])=>[canonical(text),url]));
export function sampleAudioUrl(text:string){return (sampleAudio as Record<string,string>)[text]||aliases.get(canonical(text));}
