import type {Exercise} from './data';
import {suggestProsody} from './prosody';
type Line=[string,string,string];
function scene(id:string,title:string,rows:Line[]):Exercise{return {id,module:'daily',format:'passage',date:'2026-10-20',title:`场景示例｜${title}（8 句）`,sample:true,tags:['完整对话','日常示例'],translation:rows.map(r=>r[1]).join(' '),chunks:rows.map(([text,zh,note],i)=>({text:text.replaceAll(' / ',' '),role:`第 ${i+1} 句`,tip:`${zh} ${note}`,prosody:suggestProsody(text)}))};}
export const dailyScenes:Exercise[]=[
scene('daily-rent-scene','和房东确认租金与维修',[
['Bonjour, je vous appelle au sujet du loyer / et de la fuite que nous vous avons signalée hier.','您好，我想问一下房租，以及我们昨天向您反映的漏水。','que 作 signalée 的宾语。'],
['Oui, j’ai bien reçu votre message ; / le plombier peut passer demain matin.','我收到了您的消息，水管工明天上午可以来。','passer 在这里表示上门。'],
['Pourriez-vous lui demander de venir avant dix heures ? / Je dois ensuite me rendre sur le chantier.','能请他十点前来吗？我之后要去工地。','lui 指水管工；条件式用于礼貌请求。'],
['Je vais le lui préciser ; / en attendant, pouvez-vous fermer le robinet d’arrivée ?','我会向他说明；在此期间，您能关闭进水阀吗？','le 指时间要求，lui 指水管工。'],
['C’est déjà fait, / mais nous n’avons presque plus d’eau dans la cuisine.','已经关了，但厨房几乎没有水了。','ne…presque plus 表示几乎不再有。'],
['Je comprends ; / s’il ne peut pas intervenir demain, / je chercherai un autre technicien.','我理解；如果他明天不能处理，我会找另一位技术员。','si + 现在时，主句用将来时。'],
['Merci ; / pour le loyer, souhaitez-vous que je vous l’envoie par virement ?','谢谢；房租您希望我通过银行转账给您吗？','que 引导宾语从句；vous l’ 的代词顺序。'],
['Oui, utilisez les coordonnées habituelles / et transmettez-moi le justificatif dès que le paiement sera effectué.','是的，用原来的账户信息，付款完成后把凭证发给我。','dès que 后将来时，sera effectué 为被动式。']]),
scene('daily-clinic-scene','预约看诊与描述症状',[
['Bonjour, je voudrais prendre rendez-vous / parce que j’ai de la fièvre depuis hier soir.','您好，我想预约，因为从昨晚开始发烧。','depuis 与现在时连用表示症状延续到现在。'],
['Avez-vous d’autres symptômes, / par exemple des douleurs ou des difficultés à respirer ?','还有其他症状吗，比如疼痛或呼吸困难？','倒装 avez-vous 提问。'],
['J’ai surtout mal à la tête / et je me sens très fatigué.','主要是头痛，感觉很疲惫。','avoir mal à；女性说话者用 fatiguée。'],
['Le médecin peut vous recevoir à quinze heures ; / cela vous convient-il ?','医生可以下午三点接诊，这个时间合适吗？','recevoir 表示接诊；cela…il 倒装。'],
['Oui, pourriez-vous m’indiquer les documents / dont j’aurai besoin à mon arrivée ?','可以，能告诉我到时需要哪些证件吗？','avoir besoin de → dont。'],
['Apportez une pièce d’identité / et les résultats d’examens que vous avez déjà.','请带身份证件和已有的检查结果。','que 引导宾语关系从句。'],
['D’accord ; / si mon état s’aggrave avant le rendez-vous, / dois-je vous rappeler ?','好的，如果预约前病情加重，需要再打电话吗？','si 引出条件；dois-je 倒装。'],
['En cas d’aggravation ou de signe inquiétant, / faites-vous évaluer rapidement par un professionnel / sans attendre ce rendez-vous.','如果加重或出现令人担忧的症状，请尽快让专业人员评估，不要等到预约时间。','语言学习场景示例，不提供诊断；sans attendre 表示不要等待。']]),
scene('daily-transfer-scene','核对转账与付款凭证',[
['Bonjour, j’ai effectué un virement ce matin, / mais le bénéficiaire dit qu’il ne l’a pas encore reçu.','您好，我今天早上转了账，但收款人说还没收到。','l’ 指转账款项；ne…pas encore。'],
['Pouvez-vous me communiquer la référence de l’opération / afin que je vérifie son statut ?','能提供交易编号，以便我查看状态吗？','afin que + 虚拟式。'],
['Bien sûr, la voici ; / j’ai aussi conservé le justificatif sur mon téléphone.','当然，在这里；我手机里也保存了凭证。','la voici 指 référence。'],
['Merci, l’opération apparaît en cours de traitement ; / elle n’est donc pas encore finalisée.','谢谢，显示正在处理中，所以尚未完成。','en cours de；donc 表示因此。'],
['Est-ce que les coordonnées que j’ai saisies sont correctes, / ou dois-je les vérifier avec le bénéficiaire ?','我输入的账户信息正确吗，还是需要和收款人核对？','les 指 coordonnées。'],
['Vérifiez-les avec lui, / surtout le nom et le numéro du compte, / avant d’envisager une nouvelle opération.','请和他核对，尤其是姓名和账号，然后再考虑新的操作。','肯定命令式 vérifiez-les；lui 指收款人。'],
['Je vais le contacter ; / pouvez-vous me préciser à quel moment je devrais vous rappeler ?','我会联系他；能说明什么时候该再联系您吗？','间接疑问 à quel moment；devrais 为条件式。'],
['Si le statut ne change pas dans le délai indiqué sur votre reçu, / recontactez-nous avec cette référence.','如果在回执注明的期限内状态未变，请带着这个编号再联系我们。','条件句；具体期限需以实际机构信息为准。']]),
scene('daily-clarify-scene','会议里请求澄清与复述',[
['Excusez-moi, je n’ai pas bien saisi la dernière partie ; / pourriez-vous la reformuler ?','抱歉，我没听清最后一部分，可以换个说法吗？','la 指 dernière partie；条件式礼貌请求。'],
['Je disais que la livraison serait reportée / si nous ne recevions pas l’autorisation aujourd’hui.','我是说，如果今天收不到许可，送货就会延期。','过去语境下，条件式 serait 与未完成过去时 recevions 呼应。'],
['Si je comprends bien, / vous attendez d’abord la confirmation du contrôleur ?','如果我理解正确，您是在等监理先确认吗？','用 si je comprends bien 确认理解。'],
['Exactement ; / ce qui nous manque, / c’est son accord écrit sur le plan modifié.','没错，我们缺的是他对修改后图纸的书面同意。','ce qui 作 manque 的主语。'],
['Pour éviter un malentendu, / puis-je résumer les deux actions à mener ?','为避免误解，我可以总结需要做的两件事吗？','puis-je 是 pouvoir 的礼貌倒装形式。'],
['Oui, nous devons lui transmettre le plan / puis lui demander de confirmer sa décision par message.','可以，我们应先发图纸，再请他通过消息确认决定。','两个 lui 都指监理。'],
['C’est noté ; / je vous enverrai le compte rendu après la réunion / pour que chacun puisse le vérifier.','记下了，我会在会后发送纪要，让大家核对。','pour que + puisse；le 指 compte rendu。'],
['Merci ; / s’il reste un point ambigu, / signalez-le avant que nous validions le document.','谢谢，如果还有不清楚的地方，请在我们确认文件前指出。','signalez-le；avant que + 虚拟式。']]),
scene('daily-journey-scene','安排车辆与临时改时间',[
['Bonjour, le départ pour le chantier est-il toujours prévu à sept heures ?','您好，去工地还是定在七点出发吗？','est-il… 倒装；prévu 表示计划中的。'],
['Oui, mais le véhicule que nous utilisons habituellement n’est pas disponible ; / j’en ai réservé un autre.','是，但常用车辆不可用，我另外订了一辆。','en 代替 véhicule，un autre 保留数量含义。'],
['Pouvez-vous demander au chauffeur / de nous retrouver devant le bureau plutôt qu’au camp ?','能请司机到办公室前接我们，而不是到营地吗？','demander à quelqu’un de；plutôt que 表示改为。'],
['Je vais le lui indiquer ; / combien de personnes doivent monter dans le véhicule ?','我会告诉他，需要坐几个人？','le 指接人地点的安排；lui 指司机。'],
['Nous serons quatre, / dont deux collègues qui doivent assister à la réunion de contrôle.','我们四个人，其中两位同事要参加监理会议。','dont 在此表示其中；qui 作 doivent 的主语。'],
['D’accord, je vérifierai qu’il reste assez de places / et que les ceintures sont en bon état.','好的，我会确认座位足够，安全带状态良好。','并列宾语从句 que…et que…。'],
['S’il y a un retard, / prévenez-moi dès que vous le saurez ; / je dois prévenir les participants.','如果晚点，请一知道就通知我，我得告知参会人员。','dès que + 将来时 saurez；le 指晚点情况。'],
['Bien reçu ; / je vous confirmerai le numéro du véhicule ce soir / et nous referons le point avant le départ.','收到，今晚确认车号，出发前我们再核对一次。','faire le point 表示核对进展。']])
];
