import type {Exercise} from './data';
import {suggestProsody} from './prosody';
export function expandShortSample(e:Exercise):Exercise{
 if(!e.sample||e.format==='passage'||e.chunks.length>4)return e;
 const original={text:e.chunks.map(c=>c.text).join(' '),translation:e.translation,role:'说明情况',tip:'先抓住动作与条件，再复述关键信息。',prosody:e.chunks.flatMap(c=>c.prosody||suggestProsody(c.text))};
 const rows=e.module==='engineering'?[
 ['Bonjour, est-ce que vous avez quelques minutes pour faire le point sur ce dossier ?','您好，您有几分钟时间梳理一下这件事吗？'],
 ['Oui, je vous écoute. Où en sommes-nous aujourd’hui ?','有，请说。今天进展到哪一步了？'],
 [original.text,original.translation],
 ['D’accord. Ce que je voudrais savoir, c’est qui doit intervenir en premier.','好的。我想知道的是，谁需要先采取行动。'],
 ['Je vais le vérifier avec le responsable et lui demander de nous confirmer les prochaines étapes.','我会和负责人核实，请他确认接下来的步骤。'],
 ['Et s’il y a un retard, pouvez-vous nous en informer avant la réunion ?','如果有延误，您能在会议前通知我们吗？'],
 ['Bien sûr. Je vous enverrai un message dès que j’aurai reçu sa réponse.','当然。我一收到他的回复就给您发消息。'],
 ['Merci. Nous reprendrons ce point demain matin pour vérifier que tout est bien organisé.','谢谢。我们明早再核对这件事，确保都安排妥当。']
 ]:e.module==='daily'?[
 ['Bonjour, je vous appelle parce que j’aurais besoin d’une précision.','您好，我打电话是想再确认一件事。'],
 ['Bien sûr, dites-moi ce qui vous pose problème.','当然，请告诉我您遇到了什么问题。'],
 [original.text,original.translation],
 ['D’accord, mais pouvez-vous me confirmer ce que je dois faire en premier ?','好的，不过您能确认一下我首先该做什么吗？'],
 ['Commencez par vérifier les informations que je vous ai envoyées.','请先核对我发给您的信息。'],
 ['Je les ai bien reçues, mais il y a un détail que je ne suis pas sûr d’avoir compris.','我收到了，但其中有一个细节我不确定是否理解对了。'],
 ['Pas de problème, je vous le réexplique et je vous envoie un petit récapitulatif.','没问题，我再给您解释一下，并发一份简要说明。'],
 ['Merci beaucoup, ce sera plus clair pour moi. Je vous rappelle si j’ai une autre question.','非常感谢，这样我就清楚多了。如果还有问题，我再联系您。']
 ]:[
 ['Pour commencer, pourriez-vous préciser le problème qui est au cœur de ce débat ?','首先，您能说明一下这场讨论的核心问题吗？'],
 ['Oui, il faut distinguer les faits observés des conclusions que l’on en tire.','可以。必须区分观察到的事实和从中得出的结论。'],
 [original.text,original.translation],
 ['Qu’est-ce qui vous permet de soutenir cette interprétation ?','什么依据让您支持这一解释？'],
 ['Ce sont les éléments disponibles, même s’ils ne permettent pas de répondre à toutes les questions.','依据是现有材料，尽管它们还不足以回答所有问题。'],
 ['Certains auditeurs pourraient y voir une contradiction. Comment leur répondriez-vous ?','有些听众可能认为这存在矛盾。您会怎样回应他们？'],
 ['Je leur dirais qu’une explication doit pouvoir être discutée et révisée lorsque de nouveaux faits apparaissent.','我会说，出现新事实时，一种解释应当允许被讨论和修正。'],
 ['Merci pour ces précisions. Nous retiendrons surtout la nécessité de vérifier les arguments.','感谢您的说明。我们尤其要记住核查论据的必要性。']
 ];
 return {...e,format:'passage',title:'场景对话｜'+e.title,chunks:rows.map(([text,translation],i)=>i===2?original:{text,translation,role:i%2?'回应':'提问 / 说明',tip:'示例对话：听清代词回指及连接词；可以用自己的话复述。',prosody:suggestProsody(text)}),tags:['8轮场景对话',...e.tags]};
}
export const airportDialogue:Exercise={id:'daily-airport-arrival',module:'daily',date:'2026-10-21',title:'场景对话｜抵达杜阿拉机场，确认行李与接机',sample:true,format:'passage',tags:['机场','12轮对话','示例'],translation:'示例场景：一名中国旅客在机场询问行李，并联系项目司机确认接机地点。',chunks:[
 ['Bonjour madame, je viens d’arriver et je ne trouve pas ma valise sur le tapis.','您好，我刚到，但是在传送带上没找到我的箱子。'],
 ['Vous êtes arrivé par quel vol ? Avez-vous gardé votre étiquette de bagage ?','您乘哪趟航班到的？您还留着行李标签吗？'],
 ['Oui, la voici. On m’avait dit que mes bagages seraient enregistrés jusqu’à Douala.','留着，在这里。之前有人告诉我，行李会直接托运到杜阿拉。'],
 ['Je vais vérifier. En attendant, pourriez-vous me montrer votre passeport et votre carte d’embarquement ?','我查一下。与此同时，请您出示护照和登机牌。'],
 ['Bien sûr. Est-ce qu’il faut remplir une déclaration si la valise n’arrive pas aujourd’hui ?','当然。如果箱子今天没到，需要填写申报单吗？'],
 ['Oui, mais ne vous inquiétez pas : nous vous contacterons dès que nous aurons des nouvelles.','需要，不过别担心，我们一有消息就联系您。'],
 ['Merci. Je dois aussi prévenir le chauffeur qui m’attend à la sortie.','谢谢。我还得通知在出口等我的司机。'],
 ['Bonjour, c’est le chauffeur du projet. Vous avez déjà récupéré tous vos bagages ?','您好，我是项目司机。您已经取到全部行李了吗？'],
 ['Pas encore. Il me manque une valise, et je suis en train de faire une déclaration.','还没有。我少了一个箱子，正在办理申报。'],
 ['D’accord, je vous attends devant la sortie des arrivées, près du panneau des taxis.','好的，我在到达出口、出租车标牌附近等您。'],
 ['Très bien. Dès que j’aurai terminé, je vous appellerai pour que vous puissiez me repérer.','好。我一办完就给您打电话，方便您找到我。'],
 ['Prenez votre temps. Si vous ne me voyez pas, envoyez-moi votre position et je viendrai vous chercher.','您慢慢来。如果看不到我，就把定位发给我，我过去接您。']
].map(([text,translation],i)=>({text,translation,role:i%2?'回应':'说明 / 提问',tip:'示例对话，非用户历史经历；注意先前安排、当前进展与后续行动的时态变化。',prosody:suggestProsody(text)}))};
