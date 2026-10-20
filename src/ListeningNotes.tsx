const patterns:[RegExp,string,string][]=[
 [/\b(?:s[’']occuper de|m[’']en occupe|m[’']en occuper)\b/i,"s’occuper de → s’en occuper","负责、处理某事；de 引出的事情可以用 en 回指。"],
 [/\bau sujet d[eu]\b/i,'au sujet de','关于……；后面通常紧接本次沟通的主题。'],
 [/\ben attendant\b/i,'en attendant','在此期间、与此同时；留意接下来的临时安排。'],
 [/\bavoir besoin de|\bavons besoin|\bbesoin d[eu]\b/i,'avoir besoin de','需要……；de 后面的对象常可用 en 代替。'],
 [/\bmettre en place|\bmise en place\b/i,'mettre en place','安排、建立、落实；工程交流中留意具体要落实什么。'],
 [/\bconfirmer|\bconfirmation\b/i,'confirmer','确认；后面留意日期、数量或安排等关键信息。'],
 [/\bdélai|\bdélais\b/i,'délai','期限、所需时间；注意与日期和延期表达一起听。'],

 [/\bce qu[ie’']|\bce qui\b/i,'ce qui / ce que','ce qui 后接动词，指“……的事情”；ce que 后已有主语，充当宾语。'],
 [/\bdont\b/i,'dont','承接带 de 的关系：听到 dont，留意后面说明的是谁或什么。'],
 [/\b(?:lui|leur)\b/i,'lui / leur','通常代替“给他/她、给他们”；先听清动作，再找接受动作的人。'],
 [/\b(?:en|y)\b/i,'en / y','en 常回指 de 引出的内容或数量；y 常回指地点或 à 引出的事物。'],
 [/\b(?:ne|n[’'])[^.!?]*\b(?:pas|plus|jamais|rien)\b/i,'否定式','抓住 pas / plus / jamais 等否定词；口语里的 ne 可能很弱。'],
 [/\b(?:parce que|puisque|donc|pourtant|cependant|en revanche|bien que|alors que)\b/i,'逻辑连接','连接词后留意原因、结果、转折或让步，先抓观点之间的关系。'],
 [/\b(?:a|ont|ai|avons|avez|est|sont)\s+(?:\w+é|\w+i|fait|dit|été|eu|pris|reçu|venu|arrivé)/i,'复合过去时','助动词常读得很轻，与后面的过去分词连起来听，表示已发生的动作。'],
 [/\b\w+(?:ait|aient|ions|iez)\b/i,'过去时听辨','留意 -ait / -aient 等词尾；是否为未完成过去时，要结合主语和上下文判断。'],
 [/\b(?:pourriez|voudrais|faudrait)\b/i,'委婉请求','条件式常用于礼貌请求；听清请求的动作和对象。'],
 [/\b(?:le|la|les)\s+(?:ai|as|a|avons|avez|ont|lui|leur|envoie|renvoie|vois|voit)/i,'宾语代词','动词前的 le / la / les 回指前面的人或事，注意不要漏听。'],
];
export function listeningNotes(text:string){return patterns.filter(([r])=>r.test(text)).slice(0,2).map(([,term,note])=>({term,note}));}
export default function ListeningNotes({text,tip,role}:{text:string;tip?:string;role?:string}){const notes=listeningNotes(text);return <div className="listening-notes"><strong>听辨重点</strong>{notes.map(n=><p key={n.term}><b>{n.term}</b> · {n.note}</p>)}{tip&&!/朗读建议|语调为|未单独提供/.test(tip)&&<p>{role&&!/^第|句内|意群/.test(role)&&<b>{role} · </b>}{tip}</p>}{!notes.length&&(!tip||/朗读建议|语调为|未单独提供/.test(tip))&&<p>先抓动作和对象，再用自己的话复述；在 / 处短停，别把一句话拆成孤立单词。</p>}</div>;}
