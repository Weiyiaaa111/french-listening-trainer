import {describe,it,expect} from 'vitest';
import {seeds} from './data';
import {restoreLibrary,validDeletedIds} from './library';
describe('所有材料的移动与删除持久化',()=>{
 it('内置示例删除后刷新不会重建',()=>{expect(restoreLibrary(seeds,[seeds[1].id]).some(e=>e.id===seeds[1].id)).toBe(false);});
 it('内置材料移动模块后刷新不恢复默认分类',()=>{const changed=seeds.map(e=>e.id===seeds[1].id?{...e,module:'daily' as const}:e);expect(restoreLibrary(changed,[]).find(e=>e.id===seeds[1].id)?.module).toBe('daily');});
 it('旧备份兼容，无效删除记录不静默接受',()=>{expect(validDeletedIds(undefined)).toEqual([]);expect(()=>validDeletedIds([123])).toThrow();expect(restoreLibrary(seeds,[])).toHaveLength(seeds.length);});
});
it('旧机场积累自动补为情景，保留原ID、分类、日期，刷新不重复扩写',()=>{const old={id:'personal-old-airport',module:'engineering' as const,date:'2026-10-19',title:'旧机场材料',sample:false,format:'passage' as const,translation:'暂未添加中文。',tags:[],chunks:["À l'aéroport, ils ne nous laissent pas passer.","Qu'est-ce qu'on peut faire ?","Pourquoi on ne peut pas passer ?"].map(text=>({text,role:'',tip:''}))};const once=restoreLibrary([old],[]),result=once.find(e=>e.id===old.id)!;expect(result.chunks).toHaveLength(15);expect(result.chunks.every(c=>c.translation)).toBe(true);expect(result.module).toBe(old.module);expect(result.date).toBe(old.date);expect(restoreLibrary(once,[]).find(e=>e.id===old.id)?.chunks).toHaveLength(15);expect(restoreLibrary([old],[old.id]).some(e=>e.id===old.id)).toBe(false);});
