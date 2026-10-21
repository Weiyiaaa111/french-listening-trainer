import {seeds,type Exercise} from './data';
import {checkpointScene,isCheckpointInput,checkpointTranslations,textKey} from './airport-checkpoint';
import {listeningNotes} from './ListeningNotes';
import {buildReviewQuestions} from './review-questions';
import {spokenFrench,suggestProsody} from './prosody';
import {trainingSentences} from './training-model';
export function automaticAnalysis(text:string){
 const grammar=listeningNotes(text).map(n=>`${n.term}：${n.note}`);
 const extra:[RegExp,string][]=[
 [/\bsi\b/i,'si：可能引出条件或间接疑问；根据后面的主语和时态判断是“如果”还是“是否”。'],
 [/\b(?:je|tu|il|elle|on|nous|vous|ils|elles)\s+(?:me|te|se|le|la|les|lui|leur|en|y)\b/i,'动词前的短代词要连起来听：先确定谁做，再确认动作作用于谁或什么。'],
 [/\b(?:que|qui)\b/i,'que / qui：标记从句的连接处。qui 常作从句主语；que 后若另有主语，留意它是否充当宾语或连接宾语从句。'],
 [/\b(?:avant|après|demain|hier|aujourd’hui|dès que|quand|lorsque)\b/i,'时间信息：先听清动作发生的先后；在时间表达前后分开复述。'],
 [/\b(?:peux|peut|pouvez|pourriez|voudrais|souhaite|faut)\b/i,'动作意图：能力、请求、愿望或必要性后，通常紧接真正要做的动作。'],
 [/\b(?:est|sont|a été|sera|seront)\s+\S+(?:é|ée|és|ées)\b/i,'被动结构提示：être 的形式后接过去分词时，留意是否表示某事被安排、被完成；需结合上下文判断。'],
 ];
 for(const [pattern,note] of extra)if(pattern.test(text)&&grammar.length<4)grammar.push(note);
 const terms=buildReviewQuestions([{text,role:'',tip:'',chunks:[{text,role:'',tip:''}]}]).filter(q=>q.meaning&&q.direction==='meaning'&&!grammar.some(g=>g.toLocaleLowerCase().includes(q.term.toLocaleLowerCase()))).slice(0,3).map(q=>`${q.term}：${q.meaning}`);
 return [...new Set([...grammar,...terms])].join('\n')||'当前未匹配到可靠词义或句型。可先按标出的停顿跟读；这部分仍需补充人工解析。';
}
export function knownTranslation(text:string):string|undefined{
 const key=textKey(spokenFrench(text)),direct=checkpointTranslations.get(key);if(direct)return direct;
 for(const seed of seeds){for(const c of seed.chunks)if(textKey(spokenFrench(c.text))===key&&c.translation&&!/暂未|未提供/.test(c.translation))return c.translation;}
 return undefined;
}
export function enrichExercise(e:Exercise):Exercise{
 const chunks=e.chunks.map(c=>({...c,translation:c.translation&&!/暂未|未提供/.test(c.translation)?c.translation:knownTranslation(c.text),tip:(!c.tip||/未单独提供|语调为朗读建议|未经过人工校对/.test(c.tip))?automaticAnalysis(c.text):c.tip,role:/^第 \d+ 句|意群 \d+$/.test(c.role)?(listeningNotes(c.text)[0]?.term||'句子结构与表达'):c.role}));
 return {...e,chunks,translation:(!e.translation||/暂未|未提供/.test(e.translation))&&chunks.every(c=>c.translation)?chunks.map(c=>c.translation).join(' '):e.translation};
}
const scenes=[
 {re:/loyer|logement|appartement|propriétaire|chambre/i,opening:['Bonjour, je vous appelle au sujet du logement. Est-ce que vous avez un moment ?','您好，我想就住房的事和您确认一下，现在方便吗？'],question:['Oui, bien sûr. Vous avez une question sur le paiement ou sur l’appartement ?','当然。您想问付款还是房子方面的问题？'],reply:['Je vais vérifier les conditions du contrat et vous envoyer une confirmation écrite.','我会核对合同条款，再发给您书面确认。']},
 {re:/aéroport|avion|vol\b|bagage|valise/i,opening:['Bonjour, j’aurais besoin d’un renseignement concernant mon voyage.','您好，我想咨询一下这次行程的安排。'],question:['Bien sûr. Est-ce qu’il s’agit du vol, des bagages ou du transport à l’arrivée ?','当然，是航班、行李还是到达后的交通问题？'],reply:['Nous allons vérifier votre dossier. En attendant, gardez vos documents à portée de main.','我们会核实您的情况，请先把证件放在方便取用的地方。']},
 {re:/facture|virement|paiement|commande|livraison|fournisseur|matériel|engin/i,opening:['Bonjour, je vous contacte pour faire le point sur notre dossier.','您好，我联系您是想核对一下我们这笔业务的进展。'],question:['Oui, je vous écoute. Qu’est-ce que vous souhaitez confirmer ?','好的，您说，想确认哪些事项？'],reply:['Je vais en parler au responsable et lui demander de vous confirmer les détails.','我会和负责人沟通，请他向您确认细节。']},
 {re:/forage|eau|camp|chantier|contrôleur|travaux|réunion/i,opening:['Bonjour, peut-on prendre quelques minutes pour préparer la réunion du projet ?','您好，能用几分钟准备一下项目会议吗？'],question:['Oui. Quel est le point que vous souhaitez clarifier en priorité ?','可以，您最想先澄清哪一点？'],reply:['Nous allons le vérifier sur le terrain et noter la réponse dans le compte rendu.','我们会到现场核实，并把答复写入会议纪要。']},
 {re:/.*/,opening:['Bonjour, est-ce que vous avez un instant ? J’aurais besoin d’une précision.','您好，现在有空吗？我想确认一个问题。'],question:['Bien sûr, dites-moi ce que vous souhaitez éclaircir.','当然，请告诉我您想弄清楚什么。'],reply:['D’accord. Je vais vérifier ce point avant de vous répondre précisément.','好的，我先核实这一点，再给您准确答复。']},
];
export function prepareImported(e:Exercise,expand:boolean,people:'auto'|'2'|'3'='auto'):Exercise{
 if(expand&&isCheckpointInput(e))return enrichExercise(checkpointScene(e));
 e=enrichExercise(e);
 const sentences=trainingSentences(e),hasSpeakers=e.chunks.some(c=>/^\s*[\p{L}][\p{L}\s'-]{0,25}\s*:/u.test(c.text));
 if(!expand||sentences.length>3||hasSpeakers)return enrichExercise(e);
 const text=sentences.map(s=>s.text).join(' '),scene=scenes.find(s=>s.re.test(text))!;
 const three=people==='3'||(people==='auto'&&e.module==='engineering');
 const originalRows=sentences.map(s=>({text:s.text,translation:s.translation,role:'A · 输入的原句',tip:automaticAnalysis(s.text),prosody:s.chunks.flatMap(c=>c.prosody||suggestProsody(c.text))}));
 const before=[scene.opening,scene.question],after=[scene.reply,['Merci. Pour être sûr de bien comprendre, pourriez-vous préciser la prochaine étape ?','谢谢。为确保我理解正确，能再说明一下下一步吗？'],['Je vous enverrai un récapitulatif dès que les informations auront été confirmées.','信息一经确认，我就给您发一份简要说明。'],['Très bien. S’il y a un changement entre-temps, prévenez-moi, s’il vous plaît.','好的。在这期间如果有变化，请通知我。'],['Bien sûr, nous restons en contact et nous referons le point demain.','当然，我们保持联系，明天再核对进展。']];
 if(three)after[2]=['Bonjour, je suis la personne chargée de ce dossier. Je vous confirmerai les détails dès que la vérification sera terminée.','您好，我是这件事的负责人，核实完毕后会向您确认细节。'];
 const row=(v:string[],i:number)=>({text:v[0],translation:v[1],role:(i%2?'B':'A')+' · 场景示例',tip:automaticAnalysis(v[0]),prosody:suggestProsody(v[0])});
 return {...e,sample:true,format:'passage',title:'场景练习｜'+e.title,tags:['由输入扩写的示例',...e.tags],notes:[e.notes,'保留输入原句；其余台词由本地场景模板补充，需结合实际情境调整，不是历史对话。'].filter(Boolean).join('\n'),chunks:[...before.map(row),...originalRows,...after.map((v,i)=>({...row(v,i+3),role:three&&i===2?'C · 现场负责人':row(v,i+3).role}))]};
}
