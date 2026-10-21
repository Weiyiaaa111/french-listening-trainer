import type {Exercise} from './data';
import {suggestProsody} from './prosody';
export const checkpointRows:[string,string,string][]=[
["À l’aéroport, ils ne nous laissent pas passer.",'在机场，他们不让我们通过。','A · 旅客'],
["Qu’est-ce qu’on peut faire ?",'我们能怎么办？','B · 同行同事'],
["Demandons à l’agent ce qui manque dans notre dossier.",'我们问问工作人员，材料里缺了什么。','A · 旅客'],
["Pourquoi on ne peut pas passer ?",'请问，为什么我们不能通过？','A · 向工作人员询问'],
["Il manque une confirmation de votre hébergement ; nous devons la vérifier avant de vous laisser passer.",'缺少一份住宿确认，我们需要核实后才能让您通过。','C · 工作人员'],
["Nous avons une réservation. Quel document faut-il vous présenter exactement ?",'我们有预订，具体需要向您出示哪份材料？','A · 旅客'],
["Une confirmation indiquant le nom de l’établissement et les dates du séjour nous permettra de vérifier les informations.",'一份注明住宿地点名称和入住日期的确认材料，可以帮助我们核对信息。','C · 工作人员'],
["Est-ce qu’on peut vous la montrer sur le téléphone ?",'可以在手机上给您看吗？','A · 旅客'],
["Oui, pour cette vérification, l’important est que les informations soient lisibles.",'可以，就这次核对而言，重要的是信息清晰可读。','C · 工作人员'],
["Je vais appeler notre collègue pour qu’il nous envoie la confirmation.",'我给同事打个电话，让他把确认材料发给我们。','B · 同行同事'],
["Pourquoi on ne peut pas passer ? C’est seulement à cause de ce document ?",'我们为什么不能通过？只是因为这份材料吗？','A · 再次确认原因'],
["À ce stade, c’est le document qui manque. Je pourrai vous répondre après l’avoir vérifié.",'目前缺的是这份材料，核对后我才能答复您。','C · 工作人员'],
["Nous venons de la recevoir. Pourriez-vous vérifier si elle convient ?",'我们刚收到了，您能核对一下这份是否符合要求吗？','A · 旅客'],
["Merci, les informations correspondent à votre dossier. Vous pouvez passer maintenant.",'谢谢，信息与您的材料相符，现在可以通过了。','C · 工作人员'],
["Très bien, merci de nous avoir expliqué ce qu’il fallait faire.",'好的，谢谢您向我们说明了该怎么办。','A · 旅客'],
];
export function textKey(text:string){return text.normalize('NFC').toLocaleLowerCase('fr').replace(/[’‘]/g,"'").replace(/\s*\/\s*/g,' ').replace(/[.!?,;:]/g,'').replace(/\s+/g,' ').trim();}
const originals:[string,string][]=[
["À l'aéroport, ils ne nous laissent pas passer.",'在机场，他们不让我们通过。'],
["Qu'est-ce qu'on peut faire ?",'我们能怎么办？'],
["Pourquoi on ne peut pas passer ?",'为什么我们不能通过？'],
];
export const checkpointTranslations=new Map([...checkpointRows.map(([fr,zh])=>[textKey(fr),zh] as const),...originals.map(([fr,zh])=>[textKey(fr),zh] as const)]);
export function checkpointScene(source?:Exercise):Exercise{
 const rows=checkpointRows.map(row=>[...row] as [string,string,string]);
 // Retain the user's exact original wording and any supplied translation.
 for(const c of source?.chunks||[]){const key=textKey(c.text);const index=key===textKey(originals[0][0])?0:key===textKey(originals[1][0])?1:key===textKey(originals[2][0])?3:-1;if(index>=0){rows[index][0]=c.text;if(c.translation&&!/暂未|未提供/.test(c.translation))rows[index][1]=c.translation;}}
 return {id:source?.id||'daily-airport-checkpoint',module:source?.module||'daily',date:source?.date||'2026-10-21',title:'情景对话｜机场被拦下，询问原因并补充材料',sample:true,format:'passage',translation:rows.map(r=>r[1]).join(' '),tags:['15轮三人对话','逐句中文','由表达改编的示例'],notes:[source?.notes,'根据输入表达改编的虚构练习场景，不是用户真实经历。住宿材料仅为本场景设定，不代表任何机场的通行规定。原句保留，其他台词为教学编写。'].filter(Boolean).join('\n'),chunks:rows.map(([text,translation,role])=>({text,translation,role,tip:'',prosody:suggestProsody(text)}))};
}
export function isCheckpointInput(e:Exercise){return !e.lesson&&!e.audioUrl&&e.chunks.length<=3&&e.chunks.some(c=>textKey(c.text)===textKey(originals[0][0]))&&e.chunks.every(c=>checkpointTranslations.has(textKey(c.text)));}
