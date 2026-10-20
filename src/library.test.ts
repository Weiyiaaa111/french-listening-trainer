import {describe,it,expect} from 'vitest';
import {seeds} from './data';
import {restoreLibrary,validDeletedIds} from './library';
describe('所有材料的移动与删除持久化',()=>{
 it('内置示例删除后刷新不会重建',()=>{expect(restoreLibrary(seeds,[seeds[1].id]).some(e=>e.id===seeds[1].id)).toBe(false);});
 it('内置材料移动模块后刷新不恢复默认分类',()=>{const changed=seeds.map(e=>e.id===seeds[1].id?{...e,module:'daily' as const}:e);expect(restoreLibrary(changed,[]).find(e=>e.id===seeds[1].id)?.module).toBe('daily');});
 it('旧备份兼容，无效删除记录不静默接受',()=>{expect(validDeletedIds(undefined)).toEqual([]);expect(()=>validDeletedIds([123])).toThrow();expect(restoreLibrary(seeds,[])).toHaveLength(seeds.length);});
});
