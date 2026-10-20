import {describe,it,expect} from 'vitest';
import {listeningNotes} from './ListeningNotes';
describe('简短听辨提示',()=>{
 it('识别关系结构而不是只给语调',()=>{expect(listeningNotes("Tu as demandé ce qu’il faut faire ?").map(n=>n.term)).toContain('ce qui / ce que');});
 it('代词和否定式最多显示两个重点',()=>{const notes=listeningNotes('Je ne lui en ai pas parlé parce que je travaillais.');expect(notes).toHaveLength(2);expect(notes[0].term).toBe('lui / leur');});
 it('不凭空生成词义',()=>{expect(listeningNotes('Bonjour monsieur.')).toEqual([]);});
});
