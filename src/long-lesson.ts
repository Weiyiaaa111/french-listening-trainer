export type TimedChunk = {text:string;translation:string;role:string;tip:string;tone:'↗'|'↘'|'→';start:number;end:number};
export type TimedSentence = {speaker:string;section:string;text:string;translation:string;start:number;end:number;chunks:TimedChunk[]};
export type LongLesson = {title:string;source:string;duration:number;audioUrl:string;transcriptNote:string;intonationNote:string;sentences:TimedSentence[]};
export const clock = (seconds:number) => `${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;
export function validTiming(start:number,end:number,duration:number){return Number.isFinite(start)&&Number.isFinite(end)&&start>=0&&end>start&&end<=duration;}
