import {it,expect} from 'vitest';
import {expressionNotes} from './ExpressionNotes';
it('真实句型搭配与近义辨析，不以通用听辨提示充数',()=>{const notes=expressionNotes('Bonjour, je vous appelle parce que j’aurais besoin d’une précision.');expect(notes.some(n=>n.term.includes('appeler'))).toBe(true);expect(notes.some(n=>n.kind==='近义辨析')).toBe(true);expect(notes.some(n=>n.detail.includes('条件式'))).toBe(true);expect(JSON.stringify(notes)).not.toContain('先抓动作和对象');expect(expressionNotes('Xylophone azur.')).toEqual([]);});
