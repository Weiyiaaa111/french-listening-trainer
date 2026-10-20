import {describe,it,expect} from 'vitest';
import {parsePaste,exerciseFromPaste} from './paste-parser';
const defaults={module:'daily' as const,date:'2026-10-20'};
describe('整段混排粘贴识别',()=>{
 it('识别标签、日期、模块、标题和中法内容',()=>{const p=parsePaste('标题：确认设备\n模块：工程法语\n日期：2026/10/21\n法语：Le matériel est arrivé.\n中文意思：设备已到场。\n解析：复合过去时。',defaults);expect(p.title).toBe('确认设备');expect(p.module).toBe('engineering');expect(p.date).toBe('2026-10-21');expect(p.french).toEqual(['Le matériel est arrivé.']);expect(p.chinese).toEqual(['设备已到场。']);expect(exerciseFromPaste(p).chunks[0].translation).toBe('设备已到场。');});
 it('识别无标签的中法交替行',()=>{const p=parsePaste('确认送货\nBonjour, avez-vous reçu la facture ?\n您好，收到发票了吗？\nOui, je vous la renvoie.\n是的，我重新发给您。',defaults);expect(p.title).toBe('确认送货');expect(p.french).toHaveLength(2);expect(p.chinese).toHaveLength(2);expect(exerciseFromPaste(p).chunks[1].translation).toBe('是的，我重新发给您。');});
 it('支持法语一段内多个句子和中文整段，歧义保留并提醒',()=>{const p=parsePaste('标题：跟进\n法语：Bonjour. Je vous rappelle demain.\n中文：这是整体中文说明。',defaults);expect(p.french).toHaveLength(2);expect(p.warnings.join(' ')).toContain('中法句数不同');const e=exerciseFromPaste(p);expect(e.chunks[0].translation).toBeUndefined();expect(e.translation).toBe('这是整体中文说明。');});
 it('支持Markdown和同一行的标签',()=>{const p=parsePaste('## 标题：测试\n**法语：** Merci. 中文意思：谢谢。',defaults);expect(p.title).toBe('测试');expect(p.french).toEqual(['Merci.']);expect(p.chinese).toEqual(['谢谢。']);});
 it('中文标签后仍识别交替出现的法语',()=>{const p=parsePaste('标题：致谢\n法语：Bonjour.\n中文：您好。\nMerci beaucoup.\n非常感谢。',defaults);expect(p.french).toEqual(['Bonjour.','Merci beaucoup.']);expect(p.chinese).toEqual(['您好。','非常感谢。']);});
 it('没有法语、日期无效时不会伪造内容',()=>{expect(()=>parsePaste('标题：只有标题',defaults)).toThrow('没有识别到法语');expect(()=>parsePaste('日期：2026-02-30\n法语：Bonjour.',defaults)).toThrow('日期无效');});
 it('有斜杠的单句保持意群和对应译文',()=>{const p=parsePaste('标题：条件句\n法语：Si tu viens, / je serai là.\n中文：如果你来， / 我会在。',defaults);const e=exerciseFromPaste(p);expect(e.chunks).toHaveLength(2);expect(e.chunks[0].text).toBe('Si tu viens,');expect(e.chunks[0].translation).toBe('如果你来，');});
});
