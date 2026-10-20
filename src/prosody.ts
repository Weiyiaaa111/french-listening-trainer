export type Tone = '↗'|'↘'|'→';
export type ProsodyPart = {text:string;tone:Tone;note:string};
export const toneNames:Record<Tone,string>={'↗':'上扬','↘':'下沉','→':'延续'};
// Teaching suggestions from syntax, never an acoustic analysis of the recording.
export function suggestProsody(text:string, ending?:Tone):ProsodyPart[]{
 const speakerless=spokenFrench(text);
 const raw=speakerless.includes(' / ')?speakerless.split(' / '):speakerless.split(/(?<=[,;:!?。])\s+(?!»)/u);
 // Split clear subordinate/logic links when a sentence has no written pause.
 // Keep explicit user boundaries and short expressions intact.
 const splitLinks=(part:string):string[]=>{
  const link=/\s+(?=(?:ce qu[’']|ce que\b|ce qui\b|parce que\b|alors que\b|pour que\b|afin de\b|mais\b|dont\b))/giu;
  for(const match of part.matchAll(link)){
   const left=part.slice(0,match.index).trim(),right=part.slice(match.index+match[0].length).trim();
   if(left.split(/\s+/).length>=3&&right.split(/\s+/).length>=3)return [left,...splitLinks(right)];
  }
  return [part];
 };
 const parts=raw.map(s=>s.trim()).filter(Boolean).flatMap(part=>speakerless.includes(' / ')?[part]:splitLinks(part));
 return parts.map((part,i)=>{
  let tone:Tone='→';
  if(i===parts.length-1){tone=ending||(/\?\s*[»”]?$/.test(part)&&! /^(Quels?|Quelles?|Pourquoi|Comment|Quand|Où|Combien)\b/i.test(speakerless)?'↗':'↘');}
  else if(/^(Si |Quand |Lorsque |Dès que |Bien que |Pendant que |Une fois |Avant de |En ce qui concerne )/i.test(part))tone='↗';
  return {text:part,tone,note:tone==='↗'?'朗读建议：条件或话题尚待展开时可轻微上扬；确认式疑问也可上扬。':tone==='↘'?'朗读建议：陈述完成或问词疑问收束时可下沉；实际说法以原音为准。':'朗读建议：话语仍在延续，保持衔接，不急着落调。'};
 });
}

export function spokenFrench(text:string){
 return text.replace(/(^|(?<=[.!?])\s+)(?:Journaliste|Chercheuse|Client|Fournisseur|Chef de chantier|Responsable des achats|Responsable du camp|Contrôleur|Interprète)\s*:\s*/gu,'$1');
}
