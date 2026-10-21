import {checkpointScene,isCheckpointInput} from './airport-checkpoint';
import {enrichExercise} from './auto-study';
import {mergeExercises,seeds,type Exercise} from './data';
export function validDeletedIds(value:unknown):string[]{if(value===undefined)return [];if(!Array.isArray(value)||!value.every(id=>typeof id==='string'))throw new Error('已删除材料记录无效');return [...new Set(value)];}
export function restoreLibrary(input:unknown,deletedIds:string[]):Exercise[]{const saved=mergeExercises([],input).items.map(e=>isCheckpointInput(e)?enrichExercise(checkpointScene(e)):enrichExercise(e)),removed=new Set(deletedIds),byId=new Map(saved.map(e=>[e.id,e]));const builtins=seeds.filter(e=>!removed.has(e.id)&&!(e.id==='daily-airport-checkpoint'&&saved.some(p=>p.id!==e.id&&p.title===e.title))).map(e=>({...e,module:byId.get(e.id)?.module||e.module}));return mergeExercises(builtins,saved.filter(e=>!removed.has(e.id))).items;}
