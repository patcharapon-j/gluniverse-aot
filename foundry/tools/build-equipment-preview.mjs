import fs from 'node:fs';
import {compile} from 'svelte/compiler';
import {createRequire} from 'node:module';
const {build}=createRequire(import.meta.resolve('tsx'))('esbuild');
const names=['EquipmentRig','Dots','HealthTrack','StressTrack','Vitals','Header'];
const stub=`
import { getContext as proofGetContext } from 'svelte';
const t=(...args)=>globalThis.proofT(...args);
const sheetContext=()=>proofGetContext('equipment-proof');
const motionMode=()=>globalThis.proofMotion();
const icon=name=>'../static/assets/icons/'+name+'.webp';
const tooltip=()=>({}), contextMenu=()=>({});
const jolt=()=>{}, pulse=()=>{}, inkIn=()=>{}, inkOut=()=>{};
const spendGas=a=>a.update({'system.gas_rating':Math.max(0,a.system.gas_rating-1)});
const fitCanister=(a,i)=>{if(i<0||i>=a.system.spare_canisters.length)return null; const rest=a.system.spare_canisters.filter((_,j)=>j!==i);if(a.system.gas_rating>0)rest.push(a.system.gas_rating);return a.update({'system.gas_rating':a.system.spare_canisters[i],'system.spare_canisters':rest})};
const ruinBladeInHandles=a=>a.ruin(); const fitBladeSet=a=>a.fit();
const setField=(a,k,v)=>a.update({[k]:v});
const openItem=()=>{}, deleteItem=()=>{}, clickHealthBox=()=>{},clickStressBox=()=>{},stepStress=()=>{};
`;
for(const name of names){let s=fs.readFileSync(`src/sheets/components/${name}.svelte`,'utf8');s=s.replace(/^\s*import .*? from ['"]([^'"]+)['"];\r?$/gm,(all,path)=>path==='svelte'?all:path.endsWith('.svelte')?all.replace(path,'./.proof-'+path.split('/').at(-1).replace('.svelte','.js')):'');s=s.replace('<script lang="ts">','<script lang="ts">'+stub);fs.writeFileSync('.proof-'+name+'.js',compile(s,{generate:'client'}).js.code)}
const harness=`<script>
import {setContext} from 'svelte';
import Header from './.proof-Header.js';
import Vitals from './.proof-Vitals.js';
let mode=$state('full'); globalThis.proofMotion=()=>mode;
const make=()=>({id:'survey001',name:'Mara Weiss',img:'../static/assets/portraits/portrait-flier.webp',editable:true,system:{pinned:{active:false},attributes:{instinct:3,empathy:3},scars:[],grief:0,spare_canisters:[3,1],gas_rating:2,haven:'The family farm',canon_tie:'',rank:'private',class_rank:null,next_roll_penalty:0},derived:{current_health:4,health:5,stress_effective:2,minimum_stress:0,resolve:3,resolve_unclamped:3},health:Array.from({length:5},(_,i)=>({state:i<4?'clean':'damaged'})),injuries:[],responses:[],talents:[],gear:[{subtype:'odm',current:2,rating:3},{id:'held',subtype:'blade-set',inHandles:true,rating:2},{id:'spare1',subtype:'blade-set',inHandles:false,rating:2},{id:'spare2',subtype:'blade-set',inHandles:false,rating:2}],fullGas:3,comrades:[]});
let view=$state(make());let width=$state(1080);let compact=$state(false);
const actor={get system(){return view.system},async update(patch){for(const [k,v] of Object.entries(patch)){if(k.startsWith('system.'))view.system[k.slice(7)]=v;else view[k]=v}return actor},async ruin(){view.gear=view.gear.filter(g=>!g.inHandles);return actor},async fit(){const pick=view.gear.find(g=>g.subtype==='blade-set'&&!g.inHandles);if(pick)pick.inHandles=true;return pick}};
setContext('equipment-proof',{actor,state:{},sheet:{},uid:'proof'});
globalThis.proof={derived(data){Object.assign(view.derived,data)},compact(v){compact=v},reset(){view=make()},set(data){for(const [k,v] of Object.entries(data))view.system[k]=v},readonly(v){view.editable=!v},state(){return JSON.parse(JSON.stringify(view))},motion(v){mode=v},width(v){width=v}};
</script>
<div class="proof-toolbar"><label>Sheet width <select bind:value={width}><option value={1080}>1080px</option><option value={860}>860px</option><option value={640}>640px</option><option value={480}>480px</option><option value={400}>400px</option></select></label><label>Motion <select bind:value={mode}><option>full</option><option>reduced</option><option>off</option></select></label><button onclick={()=>view=make()}>Reset equipment</button><label><input type="checkbox" checked={!view.editable} onchange={e=>view.editable=!e.currentTarget.checked}/>Read only</label></div>
<div class="application wof-app" style:width={width+'px'}><div class="window-content wof-content"><div class="wof-sheet" class:compact data-motion={mode}><Header {view}/><Vitals {view} {compact}/><nav class="tabs"><span>Soldier</span><span>Kit</span><span>Wounds</span><span>Record</span></nav></div></div></div>
`;
fs.writeFileSync('.proof-Harness.js',compile(harness,{generate:'client'}).js.code);
const lang=JSON.parse(fs.readFileSync('dist/lang/en.json','utf8'));
fs.writeFileSync('.proof-entry.js',`import {mount} from 'svelte';import Harness from './.proof-Harness.js';const lang=${JSON.stringify(lang)};globalThis.proofT=(key,data={})=>{let v=lang[key]??key.split('.').reduce((v,k)=>v?.[k],lang)??key;for(const [k,x]of Object.entries(data))v=v.replaceAll('{'+k+'}',x);return v};mount(Harness,{target:document.querySelector('#proof')});`);
await build({entryPoints:['.proof-entry.js'],bundle:true,conditions:['browser'],format:'iife',outfile:'design/equipment-preview.js',minify:true});
fs.writeFileSync('design/equipment-preview.html',`<!doctype html><html><meta charset="utf-8"><title>ODM equipment workbench</title><link rel="stylesheet" href="../static/styles/fonts.css"><link rel="stylesheet" href="../static/styles/sheet.css"><style>*{box-sizing:border-box}body{margin:24px;background:#292b28;color:#ded8c9;font:13px Georgia}h1{font-size:24px}.application{position:relative;margin:20px 0}.wof-content{padding:10px!important}.wof-sheet{padding-bottom:16px}.tabs span{padding:8px}.proof-toolbar{display:flex;align-items:center;gap:18px;margin:25px 0;font:12px monospace}.proof-toolbar label{display:flex;align-items:center;gap:8px}.proof-toolbar button,.proof-toolbar select{padding:7px;background:#ded3b5;color:#282e23;border:1px solid #8b896c}</style><h1>ODM equipment workbench</h1><p>Production header and equipment components with sample data. Spend gas, select a spare cap, ruin a blade, or fit a replacement. Changes stay in this preview.</p><div id="proof"></div><script src="equipment-preview.js"></script></html>`);
for(const name of [...names,'Harness','entry'])fs.unlinkSync('.proof-'+name+'.js');

