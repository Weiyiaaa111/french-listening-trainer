import type { Exercise, Module } from './data';
type Row = [string,string,string];
function lesson(id:string,module:Module,title:string,translation:string,rows:Row[],tags:string[]):Exercise{return {id,module,date:'2026-10-20',title,translation,chunks:rows.map(([text,role,tip])=>({text,role,tip})),tags,sample:true};}
export const extraSeeds:Exercise[]=[
lesson('eng-meeting-long','engineering','长篇示例｜雨季施工协调会（12 句）','会议开场：本次会议主要讨论营地供水和设备进场。我们昨天要等到道路恢复通行后才能查看现场。监理希望开工前收到详细进度表。供应商曾答应周一送到的水泵仍未到场。我们暂时把它替换为租来的设备，但费用尚未获批。问题在于井的出水量低于预期。技术员将到现场再次测量，我们会请他提交书面报告。如果结果合格，营地后天就可以接通供水。不过，应先检查水质，再供厨房使用。至于人员，各班组负责人应确认明天到岗的人数。我尚未收到合同草案；承包商一发来，我就转给你们。最后，我们周五再开会，确定哪些已完成、哪些还需要处理。',[
['Bonjour à tous, cette réunion porte principalement sur l’alimentation en eau du camp et l’arrivée des engins.','会议开场','porter sur 表示涉及；两个名词组并列。'],
['Hier, nous ne pouvions pas accéder au site tant que la voie n’était pas remise en état.','未完成过去时 · 否定','ne pouvions pas 描述过去的限制；tant que 表示只要……还。'],
['Le contrôleur souhaite que nous lui transmettions un planning détaillé avant le démarrage des travaux.','lui · 虚拟式','souhaiter que + 虚拟式；lui 指监理。'],
['La pompe que le fournisseur avait promis de livrer lundi n’est toujours pas arrivée.','关系从句 · 愈过去时','avait promis 表示先前的承诺；toujours pas 仍未。'],
['Nous l’avons remplacée provisoirement par une pompe louée, mais les frais n’ont pas encore été approuvés.','la · 被动式','l’ 指 la pompe；remplacée 与置前直接宾语配合。'],
['Ce qui pose problème, c’est que le débit du forage est inférieur à ce que nous avions prévu.','ce qui / ce que','ce qui 作 pose 的主语；ce que 作 avions prévu 的宾语。'],
['Le technicien va s’y rendre pour effectuer de nouvelles mesures, et nous lui demanderons un rapport écrit.','y / lui','y 指现场；se rendre à 表示前往。'],
['Si les résultats sont satisfaisants, le camp pourra être raccordé au réseau après-demain.','条件句 · 将来时','si + 现在时，主句使用将来时 pourra。'],
['Il faudra toutefois vérifier la qualité de l’eau avant de l’utiliser pour la cuisine.','转折 · la','toutefois 表示不过；l’ 指 eau。'],
['En ce qui concerne le personnel, chaque chef d’équipe doit confirmer le nombre d’ouvriers qui seront présents demain.','话题引入 · qui','en ce qui concerne 表示至于；qui 是关系从句主语。'],
['Je n’ai pas encore reçu le projet de contrat ; dès que l’entrepreneur me l’enverra, je vous le transmettrai.','否定 · 双代词','me le 和 vous le 的顺序；dès que 后可用将来时。'],
['Enfin, nous nous réunirons vendredi pour faire le point sur ce qui a été réalisé et sur ce qui reste à régler.','总结 · 被动式','faire le point 表示盘点情况；a été réalisé 为复合过去时被动式。']
],['长篇材料','监理会议','12 句']),
lesson('c1-interview-long','c1','长篇示例｜公共交通与社会公平（12 句）','主持人询问公共交通免费是否能改变出行习惯。研究者认为，首先需要明确我们期待这一政策实现什么。如果目的是减少汽车出行，票价只是影响因素之一。以前一些居民开车，因为公交服务太少。他们真正要求的是可靠的班次和合理的通勤时间。然而，免费可以减轻低收入家庭的负担。这是支持该措施的协会经常提出的论点。他们还提醒我们，增加供给必须配合长期投入。记者追问，如何在不削减其他预算的前提下筹资。研究者回答，需要地方政府和国家层面的选择。尽管有些城市取得了进展，但很难把所有变化都归因于免费。因此，应同时评估使用率、服务质量和社会影响。',[
['Journaliste : La gratuité des transports publics peut-elle vraiment modifier nos habitudes de déplacement ?','访谈提问','peut-elle：主谓倒装；修饰语 public 与 transports 配合。'],
['Chercheuse : Il faut d’abord préciser ce que l’on attend de cette politique.','ce que','attendre quelque chose de：期待某事；ce que 作 attend 的宾语。'],
['Si l’objectif est de réduire l’usage de la voiture, le prix du billet n’est qu’un facteur parmi d’autres.','限制式 ne…que','n’est qu’un 表示只是一个；parmi d’autres 表示诸多因素之一。'],
['Auparavant, certains habitants prenaient leur voiture parce que les bus ne passaient pas assez souvent.','未完成过去时','prenaient 和 passaient 表示过去的习惯。'],
['Ce qu’ils demandaient avant tout, c’était une fréquence fiable et un temps de trajet raisonnable.','ce que · 强调结构','avant tout：首先、最重要的是；c’était 呼应过去情况。'],
['Cependant, la gratuité peut alléger les dépenses des ménages dont les revenus sont modestes.','dont · 逻辑转折','dont les revenus 相当于 les revenus des ménages。'],
['C’est un argument que les associations favorables à cette mesure mettent régulièrement en avant.','宾语关系从句','mettre en avant：突出、提出；que 指 argument。'],
['Elles nous rappellent aussi que l’amélioration de l’offre doit s’accompagner d’investissements durables.','间接宾语 · 从句','rappeler à quelqu’un que；nous 是间接宾语。'],
['Journaliste : Comment peut-on les financer sans réduire les budgets consacrés à d’autres services ?','les · sans + 不定式','les 指 investissements；consacrés à：用于……的。'],
['Chercheuse : Cela suppose des choix à la fois au niveau des collectivités et à celui de l’État.','并列结构','à la fois…et…：既……又……；celui 代替 niveau。'],
['Bien que certaines villes aient enregistré des progrès, il reste difficile de les attribuer entièrement à la gratuité.','让步 · 虚拟式过去时','bien que + aient enregistré；les 指 progrès。'],
['Il convient donc d’évaluer ensemble la fréquentation, la qualité du service et les effets sociaux de la mesure.','论证结论','il convient de：应当；donc 引出结论。']
],['长篇材料','社会议题','12 句']),
lesson('daily-dialogue-long','daily','长篇示例｜送货、付款与改约（12 句）','客户打电话询问昨天已确认的送货。供应商解释卡车在路上出了故障。客户提醒，工地在等这些材料，需要知道何时收到。供应商可以先送一部分，其余明天送。客户同意，但要求提前收到司机电话。供应商表示，拿到后会发给他。客户说还没收到修改后的发票。供应商说会请同事重发。客户希望租赁费用单独列明，以便会计核对。供应商会注明金额和使用期限。客户说确认后会发付款证明。最后双方约定，若卡车出发前再有问题就互相联系。',[
['Client : Bonjour, je vous appelle au sujet de la livraison que nous avions confirmée hier.','通话开场 · 愈过去时','au sujet de：关于；avions confirmée 表示此前已确认。'],
['Fournisseur : Je suis désolé, le camion est tombé en panne en cours de route.','复合过去时','tomber en panne：发生故障；en cours de route：途中。'],
['Client : Le chantier attend ces matériaux, et nous avons besoin de savoir quand nous les recevrons.','les · 间接疑问句','les 指 matériaux；quand 引导间接疑问。'],
['Fournisseur : Nous pouvons vous en livrer une partie cet après-midi et le reste demain matin.','en · 数量表达','en 代指 ces matériaux，une partie 表示其中一部分。'],
['Client : D’accord, mais envoyez-moi le numéro du chauffeur avant son départ, s’il vous plaît.','命令式 · 代词','肯定命令式代词置后：envoyez-moi。'],
['Fournisseur : Dès que je l’aurai, je vous le transmettrai par message.','le · 双代词','l’ 和 le 均指 numéro；vous le 的代词顺序。'],
['Client : Par ailleurs, je n’ai toujours pas reçu la facture corrigée.','否定 · 话题转换','par ailleurs 引出另一件事；toujours pas 仍未。'],
['Fournisseur : Je vais demander à ma collègue de vous la renvoyer immédiatement.','vous la','demander à quelqu’un de faire；la 指 facture。'],
['Client : Pourriez-vous y faire apparaître les frais de location séparément afin que notre comptable puisse les vérifier ?','y · 虚拟式','y 指在发票上；afin que + puisse 表示目的。'],
['Fournisseur : Bien sûr, nous y préciserons le montant et la durée d’utilisation.','y · 将来时','préciser：明确说明；y 仍指发票上。'],
['Client : Une fois les informations confirmées, je vous enverrai le justificatif de paiement.','时间状语','une fois + 过去分词：一经……；enverrai 是将来时。'],
['Fournisseur : Très bien, nous nous recontacterons si un problème survient avant le départ du camion.','条件句','si + 现在时 survient，主句用将来时。']
],['长篇材料','生活对话','12 句']),
lesson('eng-5','engineering','营地选址：排水风险','我们考察过的地块看起来合适，但应先检查雨季时雨水是否容易排走。',[
['Le terrain que nous avons visité semble convenir,','关系从句','que 代指 terrain，作 visité 的宾语。'],['mais il faut d’abord vérifier','转折 · 必要性','il faut + 不定式。'],['si l’eau de pluie s’y évacue facilement pendant la saison des pluies.','y · 间接疑问','si 表示是否；y 指这块地。']],['营地建设','y']),
lesson('eng-6','engineering','设备进场：证件核对','在允许卡车进入之前，请检查司机是否带齐监理要求的证件。',[
['Avant d’autoriser l’entrée des camions,','时间状语','avant de + 不定式。'],['vérifiez que les chauffeurs disposent de tous les documents','命令式 · disposer de','disposer de：拥有、具备。'],['dont le contrôleur a demandé la présentation.','dont','la présentation des documents → dont。']],['设备进场','dont']),
lesson('eng-7','engineering','人员管理：安全交底','昨天我们讲解安全指令时，有些工人不在场；必须在他们开工前再向他们说明一次。',[
['Certains ouvriers étaient absents quand nous avons présenté les consignes hier ;','过去时对照','étaient 描述状态；avons présenté 是事件。'],['il faut les leur expliquer à nouveau','双宾语代词','les 指 consignes；leur 指 ouvriers。'],['avant qu’ils ne commencent à travailler.','时间 · 虚拟式','avant que + 虚拟式；ne 为赘词。']],['leur','人员管理']),
lesson('eng-8','engineering','合同：明确租赁条件','合同里我想修改的是租期，因为设备还没交付。',[
['Ce que je voudrais modifier dans le contrat,','ce que · 条件式','voudrais 用于委婉提出要求。'],['c’est la période de location,','强调结构','c’est 引出要求修改的内容。'],['puisque le matériel n’a pas encore été livré.','原因 · 被动式','puisque 说明已知原因；n’a pas été livré 为否定被动式。']],['合同','ce que']),
lesson('c1-3','c1','数字化：谁被排除在外','令这些居民担忧的，是公共服务正在搬到网上，而他们还不掌握使用这些工具所需的技能。',[
['Ce qui inquiète ces habitants,','ce qui','ce qui 作 inquiète 的主语。'],['c’est que les services publics se déplacent en ligne,','名词性从句','c’est que 引出具体担忧。'],['alors qu’ils ne maîtrisent pas encore les outils nécessaires pour y accéder.','对比 · y','alors que 表示而；y 指公共服务。']],['ce qui','y']),
lesson('c1-4','c1','新闻：就业数字的局限','政府引以为据的就业数字并不能说明一切，因为它们没有反映新建岗位的质量。',[
['Les chiffres de l’emploi sur lesquels le gouvernement s’appuie','介词 + 关系代词','s’appuyer sur：依据；sur lesquels 指 chiffres。'],['ne disent pas tout,','否定式','ne…pas tout 表示并非一切。'],['car ils ne rendent pas compte de la qualité des postes créés.','原因连接词','rendre compte de：反映、说明。']],['逻辑连接词','否定式']),
lesson('c1-5','c1','环境政策：理解反对意见','有些企业反对这项改革，但这并不意味着它们否认减少排放的必要性。',[
['Certaines entreprises s’opposent à cette réforme ;','动词介词搭配','s’opposer à：反对。'],['cela ne signifie pourtant pas','转折 · 否定','pourtant 表示然而。'],['qu’elles nient la nécessité de réduire les émissions.','宾语从句','nier：否认；不是所有 ne 都能单独表示否定。']],['论证','否定式']),
lesson('c1-6','c1','教育：论证中的让步','诚然，线上课程能让更多人受益；不过，还应确保他们有合适的学习条件。',[
['Certes, les cours en ligne permettent à davantage de personnes de se former ;','让步论证','certes 提出承认的事实。'],['encore faut-il s’assurer','倒装 · 附加条件','encore faut-il：还必须……。'],['qu’elles disposent de conditions d’apprentissage adaptées.','宾语从句','elles 指 personnes；adaptées 修饰 conditions。']],['逻辑连接词','长句']),
lesson('daily-3','daily','找路：去办事处','我以前从没去过那个办事处；你能告诉我怎么过去吗？',[
['Je ne suis jamais allé dans ce bureau ;','复合过去时否定','ne…jamais 表示从未；女性说话者用 allée。'],['pourrais-tu m’expliquer','条件式请求','pourrais-tu 用于礼貌请求。'],['comment on peut s’y rendre ?','y · 间接疑问','se rendre à：前往；y 指那个办事处。']],['y','否定式']),
lesson('daily-4','daily','会议后：转发纪要','我把纪要发给了同事们，但其中一些人说他们没收到。',[
['J’ai envoyé le compte rendu à mes collègues,','复合过去时','compte rendu：纪要。'],['mais certains d’entre eux m’ont dit','部分表达','certains d’entre eux：他们中的一些人。'],['qu’ils ne l’avaient pas reçu.','愈过去时否定','l’ 指 compte rendu；收到在告知之前。']],['le','会议表达']),
lesson('daily-5','daily','采购：确认数量','你订的那些瓶装水，已经给你送了六箱；还需要一些吗？',[
['Les bouteilles d’eau que tu avais commandées,','关系从句 · 配合','commandées 与置前阴性复数宾语配合。'],['on t’en a déjà livré six cartons ;','en · 数量','en 指瓶装水，six cartons 是数量。'],['est-ce qu’il t’en faut encore ?','en · 需要','il te faut：你需要。']],['en','复合过去时']),
lesson('daily-6','daily','临时改约','我们本来要在八点见面，但我得先去工地；你介意把约会推迟一小时吗？',[
['Nous devions nous retrouver à huit heures,','未完成过去时','devions 表示原定计划。'],['mais je dois d’abord passer sur le chantier ;','转折','passer sur le chantier：去一下工地。'],['cela te dérangerait-il de décaler le rendez-vous d’une heure ?','条件式 · 倒装','cela te dérangerait-il de：你介意……吗。']],['未完成过去时','礼貌表达'])
];
