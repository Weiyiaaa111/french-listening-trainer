export type Tone = '↗'|'↘'|'→';
export type ProsodyPart = {text:string;tone:Tone;note:string};
export const toneNames:Record<Tone,string>={'↗':'上扬','↘':'下沉','→':'延续'};
// Teaching suggestions from syntax, never an acoustic analysis of the recording.
export function suggestProsody(text:string, ending?:Tone):ProsodyPart[]{
 const speakerless=spokenFrench(text);
 const explicit=/\s\/\s/.test(speakerless);
 // Explicit slash boundaries are user supplied. Automatic boundaries use phrase
 // structure, never equal word counts. Ambiguous long phrases stay intact.
 const wordCount=(v:string)=>v.trim().split(/\s+/).length;
 const splitStructure=(part:string):string[]=>{
  const patterns=[
   /\s+(?=(?:ce qu[’']|ce que\b|ce qui\b|parce que\b|puisque\b|alors que\b|pour que\b|afin de\b|mais\b|dont\b|tant que\b|dès que\b|qu[’']après\b))/giu,
   /\s+(?=que\s+(?:les?|la|un|une|je|tu|il|elle|on|nous|vous|ils|elles)\b)/giu,
  ];
  // A long subject can be practised separately from its predicate; the
  // pronoun + auxiliary + participle chain always remains in the predicate.
  if(wordCount(part)>=10)patterns.push(
   /\s+(?=(?:accordent|accorde|représentent|représente|considèrent|considère|souhaitent|souhaite|doivent|devrait|doit|peuvent|peut)\b)/giu,
   /\s+(?=(?:à l[’']équilibre|entre vie|sur l[’']alimentation|et l[’']arrivée|avant de|après avoir|en raison de|à condition de|à partir de|dans le cadre de)\b)/giu,
  );
  for(const pattern of patterns)for(const match of part.matchAll(pattern)){
   const left=part.slice(0,match.index).trim(),right=part.slice(match.index!+match[0].length).trim();
   if(wordCount(left)<3||wordCount(right)<3)continue;
   // Avoid leaving a connective, preposition, article or clitic hanging.
   if(/(?:\b(?:de|du|des|à|au|aux|que|qui|ce|le|la|les|un|une|je|tu|il|elle|nous|vous|lui|leur|en|y)|[’'])$/iu.test(left))continue;
   return [...splitStructure(left),...splitStructure(right)];
  }
  return [part];
 };
 const raw=explicit?speakerless.split(/\s\/\s/):speakerless.split(/(?<=[,;:!?。])\s+(?!»)/u);
 const parts:string[]=[];
 for(const segment of raw.map(s=>s.trim()).filter(Boolean)){
  const candidates=explicit?[segment]:splitStructure(segment);
  for(const candidate of candidates){
   const previous=parts.at(-1);
   // An isolated answer (Oui.) is meaningful. A comma by itself is not a
   // reason to turn Bonjour / Hier / Pourtant into a separate audio exercise.
   if(!explicit&&previous&&wordCount(previous)<3&&!/[.!?。]$/.test(previous))parts[parts.length-1]=previous+' '+candidate;
   else if(!explicit&&wordCount(candidate)<3&&previous&&!/[.!?。]$/.test(previous))parts[parts.length-1]=previous+' '+candidate;
   else parts.push(candidate);
  }
 }
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
