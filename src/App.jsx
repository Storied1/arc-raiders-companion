import { useState, useEffect, useCallback, useRef } from "react";

// ════════════════════════════════════════════════════════
// ARC RAIDERS COMPANION V5 — API + ACHIEVEMENTS + SURPRISES
// Data enrichment via ardb.app & arcdata.mahcks.com
// ════════════════════════════════════════════════════════

const WEAPONS = [
  { name:"Ferro", type:"Rifle", rarity:"Common", tier:"S", ammo:"Heavy", aap:"Strong", pvp:3, pve:5, wt:8, craft:"5 Metal, 2 Rubber", notes:"Budget sniper king. One-shot reload. Free loadout. 40dmg, Strong AAP." },
  { name:"Anvil", type:"Hand Cannon", rarity:"Uncommon", tier:"S", ammo:"Heavy", aap:"Strong", pvp:5, pve:5, wt:5, craft:"Blueprint + workshop", notes:"Best all-round. 40dmg/shot, 6-round mag. Two-taps Raiders. Cheap." },
  { name:"Kettle", type:"Semi-Auto Rifle", rarity:"Common", tier:"S", ammo:"Medium", aap:"Weak", pvp:4, pve:3, wt:4, craft:"Basic", notes:"Tap-fire king. 11-round mag. Fast trigger. Quiet. Free loadout." },
  { name:"Vulcano", type:"Shotgun", rarity:"Rare", tier:"S", ammo:"Shotgun", aap:"Moderate", pvp:5, pve:3, wt:7, craft:"Blueprint required", notes:"Room-clearing beast. Highest burst damage in game. Indoor king." },
  { name:"Bettina", type:"Assault Rifle", rarity:"Epic", tier:"A", ammo:"Medium", aap:"Strong", pvp:4, pve:5, wt:6, craft:"Blueprint required", notes:"22-round mag (buffed). Best for long raids. Strong AAP." },
  { name:"Venator", type:"Pistol", rarity:"Rare", tier:"A", ammo:"Light", aap:"Moderate", pvp:5, pve:3, wt:5, craft:"Blueprint required", notes:"Two-shot burst. Nerfed weight (2kg>5kg) but still deadly CQC." },
  { name:"Osprey", type:"Sniper", rarity:"Rare", tier:"A", ammo:"Heavy", aap:"Strong", pvp:5, pve:4, wt:9, craft:"Blueprint (key rooms)", notes:"Highest per-shot dmg non-shotgun. Built-in scope. PvP headshot king." },
  { name:"Bobcat", type:"SMG", rarity:"Uncommon", tier:"A", ammo:"Light", aap:"Weak", pvp:4, pve:3, wt:3, craft:"Blueprint + workshop", notes:"Close-range shredder. Needs grip+barrel mods. Light ammo efficient." },
  { name:"Renegade", type:"Lever-Action", rarity:"Rare", tier:"A", ammo:"Medium", aap:"Strong", pvp:4, pve:5, wt:6, craft:"Blueprint required", notes:"Chunk reload. Heavy damage. Great ARC armor piercing." },
  { name:"Stitcher", type:"SMG", rarity:"Common", tier:"A", ammo:"Light", aap:"Weak", pvp:3, pve:2, wt:2, craft:"Basic", notes:"Free loadout CQC. Ultra cheap. Decent TTK close range." },
  { name:"Arpeggio", type:"Burst Rifle", rarity:"Uncommon", tier:"B", ammo:"Medium", aap:"Moderate", pvp:3, pve:4, wt:5, craft:"Gunsmith Lv2", notes:"Burst-fire AR. Great mid-range workhorse. Gunsmith 2 unlock." },
  { name:"Il Toro", type:"Shotgun", rarity:"Uncommon", tier:"B", ammo:"Shotgun", aap:"Moderate", pvp:5, pve:2, wt:5, craft:"Blueprint (Confiscation)", notes:"2-shot kill light shield. PvP CQC beast. Confiscation Room BP." },
  { name:"Tempest", type:"SMG", rarity:"Uncommon", tier:"B", ammo:"Light", aap:"Weak", pvp:3, pve:2, wt:3, craft:"Blueprint + workshop", notes:"Reliable spray. Good fire rate. Accessible mid-tier." },
  { name:"Hullcracker", type:"Grenade Launcher", rarity:"Epic", tier:"B", ammo:"Heavy", aap:"Strong", pvp:2, pve:5, wt:10, craft:"Blueprint required", notes:"AoE grenades. Best pure PvE vs groups. Heavy though." },
  { name:"Jupiter", type:"Energy Sniper", rarity:"Legendary", tier:"B", ammo:"Energy", aap:"Strong", pvp:3, pve:5, wt:12, craft:"Gunsmith Lv3 + BP", notes:"Highest raw damage. Charge-up delay. Harvester farming." },
  { name:"Equalizer", type:"Rifle", rarity:"Legendary", tier:"B", ammo:"Heavy", aap:"Strong", pvp:3, pve:5, wt:10, craft:"Blueprint (Harvester)", notes:"Queen/Harvester farming essential. Strong ARC shredder." },
  { name:"Aphelion", type:"Energy Burst", rarity:"Legendary", tier:"B", ammo:"Energy", aap:"Strong", pvp:3, pve:4, wt:8, craft:"Blueprint required", notes:"Fixed blinding visuals. Punishing misses. Shield-stripping." },
  { name:"Rattler", type:"Assault Rifle", rarity:"Uncommon", tier:"C", ammo:"Medium", aap:"Moderate", pvp:3, pve:3, wt:5, craft:"Blueprint + workshop", notes:"Low base mag. Better at Lv4. Average overall." },
  { name:"Drago", type:"Pistol", rarity:"Common", tier:"C", ammo:"Light", aap:"Weak", pvp:2, pve:1, wt:2, craft:"Basic", notes:"Starter pistol. Outclassed fast." },
  { name:"Burletta", type:"Pistol", rarity:"Uncommon", tier:"C", ammo:"Light", aap:"Weak", pvp:2, pve:2, wt:3, craft:"Basic", notes:"OK sidearm. Easy to get." },
  { name:"Hairpin", type:"Pistol", rarity:"Common", tier:"D", ammo:"Light", aap:"Weak", pvp:1, pve:1, wt:1, craft:"Basic", notes:"Suppressed but too weak. Last resort only." },
];

const WORKSHOP = [
  { id:"gunsmith", name:"Gunsmith", icon:"\uD83D\uDD2B", desc:"Weapons & mods", lvls:[
    { l:1, mats:[{n:"Metal Parts",q:20},{n:"Rubber Parts",q:30}], unlock:"Basic weapons" },
    { l:2, mats:[{n:"Rusted Tools",q:3},{n:"Mechanical Components",q:5},{n:"Wasp Drivers",q:8}], unlock:"Arpeggio, silencers" },
    { l:3, mats:[{n:"Rusted Gears",q:3},{n:"Adv Mechanical Components",q:5},{n:"Sentinel Firing Cores",q:4}], unlock:"Jupiter, advanced mods" }
  ]},
  { id:"gear", name:"Gear Bench", icon:"\uD83D\uDEE1\uFE0F", desc:"Shields & augments", lvls:[
    { l:1, mats:[{n:"Plastic Parts",q:25},{n:"Fabric",q:30}], unlock:"Light Shield, basic augments" },
    { l:2, mats:[{n:"Power Cables",q:3},{n:"Electrical Components",q:5},{n:"Hornet Drivers",q:5}], unlock:"Heavy Shield" },
    { l:3, mats:[{n:"Bastion Cells",q:3},{n:"Adv Electrical Components",q:5},{n:"Leaper Pulse Units",q:4}], unlock:"Looting Mk.3 Augment" }
  ]},
  { id:"medical", name:"Medical Lab", icon:"\uD83D\uDC8A", desc:"Healing items", lvls:[
    { l:1, mats:[{n:"Chemicals",q:30},{n:"Plastic Parts",q:20}], unlock:"Basic bandages/stims" },
    { l:2, mats:[{n:"Cracked Bioscanners",q:2},{n:"Durable Cloth",q:5},{n:"Tick Pods",q:8}], unlock:"Advanced healing" },
    { l:3, mats:[{n:"Surveyor Vaults",q:3},{n:"Adv Chemicals",q:5},{n:"Baron Husks",q:4}], unlock:"Instant HP recovery" }
  ]},
  { id:"utility", name:"Utility Station", icon:"\uD83D\uDD27", desc:"Tactical gear", lvls:[
    { l:1, mats:[{n:"Plastic Parts",q:50},{n:"ARC Alloy",q:6}], unlock:"Ziplines, Door Blockers" },
    { l:2, mats:[{n:"Damaged Heat Sinks",q:2},{n:"Electrical Components",q:5},{n:"Snitch Scanners",q:6}], unlock:"Lure Grenade" },
    { l:3, mats:[{n:"Fried Motherboards",q:3},{n:"Adv Electrical Components",q:5},{n:"Leaper Pulse Units",q:4}], unlock:"Photoelectric Cloak, Snap Hook" }
  ]},
  { id:"refiner", name:"Refiner", icon:"\u2697\uFE0F", desc:"Material conversion", lvls:[
    { l:1, mats:[{n:"Metal Parts",q:60},{n:"ARC Powercells",q:5}], unlock:"Basic refining" },
    { l:2, mats:[{n:"Toasters",q:3},{n:"ARC Motion Cores",q:5},{n:"Fireball Burners",q:8}], unlock:"Advanced Components" },
    { l:3, mats:[{n:"Motors",q:3},{n:"ARC Circuitry",q:10},{n:"Bombardier Cells",q:6}], unlock:"Rare component crafting" }
  ]},
  { id:"explosives", name:"Explosives", icon:"\uD83D\uDCA3", desc:"Grenades & mines", lvls:[
    { l:1, mats:[{n:"Metal Parts",q:30},{n:"Chemicals",q:20}], unlock:"Basic grenades" },
    { l:2, mats:[{n:"Damaged Coils",q:3},{n:"ARC Powercells",q:5},{n:"Pop Rollers",q:6}], unlock:"Jolt Mines, Impact Grenades" },
    { l:3, mats:[{n:"Shredder Blades",q:3},{n:"ARC Alloy",q:5},{n:"Rocketeer Drivers",q:4}], unlock:"Advanced explosives" }
  ]},
  { id:"scrappy", name:"Scrappy", icon:"\uD83D\uDC13", desc:"Passive resources", lvls:[
    { l:1, mats:[], unlock:"Basic material drops" },
    { l:2, mats:[{n:"Dog Collar",q:1}], unlock:"Better drop rate" },
    { l:3, mats:[{n:"Lemons",q:3},{n:"Apricots",q:3}], unlock:"More materials" },
    { l:4, mats:[{n:"Prickly Pears",q:6},{n:"Olives",q:6},{n:"Cat Bed",q:1}], unlock:"Even more materials" },
    { l:5, mats:[{n:"Mushrooms",q:12},{n:"Apricots",q:12},{n:"Very Comfortable Pillows",q:3}], unlock:"Master Hoarder" }
  ]}
];

const KEYS_DB = [
  { id:"dam_surv", name:"Dam Surveillance", map:"Dam BG", tier:"B+", tc:"#3b82f6", loc:"Water Treatment Control, south", route:"South entrance > right > right > corner", loot:"~40K+ coin swing. Lockers, bags, dashboards.", quest:"Greasing Her Palms", icon:"\uD83D\uDD10", coinEst:40000 },
  { id:"bg_comm", name:"Comm Tower", map:"Blue Gate", tier:"A", tc:"#22c55e", loc:"Pilgrim's Peak basement", route:"Tower > zipline down > LEFT > metal door", loot:"Server racks, weapon boxes, high-value tech.", icon:"\uD83D\uDCE1", coinEst:55000 },
  { id:"patrol", name:"Patrol Car", map:"Blue Gate", tier:"C+", tc:"#f59e0b", loc:"Checkpoint tunnel", route:"Checkpoint > north > Traffic Tunnel > locked van", loot:"1 weapon case. Osprey potential.", quest:"Armored Transports", icon:"\uD83D\uDE94", coinEst:15000 },
  { id:"sp_warehouse", name:"SP Warehouse", map:"Spaceport", tier:"B", tc:"#3b82f6", loc:"Shipping Warehouse NW, 2nd floor", route:"Warehouse > stairs > catwalk > locked door (red light)", loot:"Red lockers, weapon case, epic weapons.", quest:"Switching The Supply", icon:"\uD83C\uDFED", coinEst:35000 },
  { id:"confiscation", name:"Confiscation", map:"Blue Gate", tier:"B", tc:"#3b82f6", loc:"Reinforced Reception underground", route:"Headhouse > zip > LEFT > yellow signs", loot:"Il Toro BP, Heavy Gun Parts BP, weapon cases.", icon:"\uD83D\uDD11", coinEst:45000 },
  { id:"dam_staff", name:"Dam Staff Room", map:"Dam BG", tier:"C", tc:"#f59e0b", loc:"R&A Building", route:"Enelica Admin entrance > straight", loot:"Multiple epic items possible.", icon:"\uD83D\uDDDD\uFE0F", coinEst:20000 },
  { id:"dam_annex", name:"Dam Annex", map:"Dam BG", tier:"C", tc:"#f59e0b", loc:"Testing Annex", route:"Opens 2 doors in Testing Annex", loot:"Mid-tier mixed.", icon:"\uD83E\uDDEA", coinEst:15000 },
  { id:"raider_hatch", name:"Raider Hatch", map:"Any", tier:"S", tc:"#ef4444", loc:"Hatch points everywhere", route:"Any Raider Hatch = instant extract", loot:"No loot. SAVES YOUR LIFE.", icon:"\uD83D\uDEAA", coinEst:0 },
  { id:"sp_trench", name:"SP Trench Tower", map:"Spaceport", tier:"B+", tc:"#3b82f6", loc:"North/South Trench Towers", route:"8 doors across both towers", loot:"Multi-room. Two buildings.", quest:"Turnabout", icon:"\uD83D\uDDFC", coinEst:50000 },
];

const QUESTS = [
  { id:"q1", name:"Picking up the Pieces", trader:"Shani", map:"Dam BG", obj:"Visit loot icon area, open 3 containers", reward:"Basic gear", phase:"early" },
  { id:"q2", name:"What We Left Behind", trader:"Shani", map:"Dam BG", obj:"Collect 6 Wires and 1 Battery", reward:"Supplies", phase:"early" },
  { id:"q3", name:"First Contact", trader:"Shani", map:"Dam BG", obj:"Destroy 3 ARC enemies, collect 3 ARC Alloys", reward:"Hiker Backpack, 3 Bandages, Light Shield", phase:"early" },
  { id:"q4", name:"The Surveyor", trader:"Shani", map:"Dam BG", obj:"Destroy ARC Surveyor, loot Surveyor Vault", reward:"Key items", phase:"early" },
  { id:"q5", name:"Signal Boost", trader:"Shani", map:"Dam BG", obj:"Visit Field Depot, repair rooftop antenna", reward:"Buried City Town Hall Key, Raider Hatch Key, 3 Jolt Mines", phase:"mid" },
  { id:"q6", name:"Rocketeer Down", trader:"Shani", map:"Dam BG", obj:"Destroy Rocketeer, loot Rocketeer Driver", reward:"Weapon + supplies", phase:"mid" },
  { id:"q7", name:"A Reveal in Ruins", trader:"Shani", map:"Buried City", obj:"Photograph highway, follow destruction trail", reward:"Binoculars, Zipline, 3 Barricade Kits, 3 Door Blockers", phase:"mid" },
  { id:"q8", name:"The Trifecta", trader:"Shani", map:"Multi", obj:"Destroy Wasp, Hornet, Snitch + collect parts", reward:"Origin Camo, Raider Hatch Key, 2 Defibs, Dam Control Tower Key", phase:"mid" },
  { id:"q9", name:"Greasing Her Palms", trader:"Celeste", map:"Dam BG", obj:"Visit Dam Surveillance Room (key provided)", reward:"Dam Surveillance Key (given on accept)", phase:"early" },
  { id:"q10", name:"Switching The Supply", trader:"Celeste", map:"Spaceport", obj:"Use Spaceport Warehouse Key", reward:"Spaceport Warehouse Key", phase:"mid" },
  { id:"q11", name:"Armored Transports", trader:"Tian Wen", map:"Blue Gate", obj:"Find Patrol Car Key, open armored van", reward:"Patrol Car Key, weapon", phase:"mid" },
  { id:"q12", name:"A New Type Of Plant", trader:"Tian Wen", map:"Blue Gate", obj:"Locate and investigate plant specimens", reward:"Unlocks Armored Transports", phase:"mid" },
  { id:"q13", name:"Turnabout", trader:"Various", map:"Spaceport", obj:"Use Trench Tower Key", reward:"Progression", phase:"late" },
  { id:"q14", name:"LiDAR Installation", trader:"Shani", map:"Multi", obj:"Install LiDAR on 3 tall structures", reward:"Late-game gear", phase:"late" },
  { id:"q15", name:"Cold Storage", trader:"Various", map:"Stella Montis", obj:"Stella Montis quest chain", reward:"Cold Snap content", phase:"late" },
];

const RUN_PLANS = [
  { name:"Blue Gate Mega Run", map:"Blue Gate", cond:"Night Raid", keys:["bg_comm","patrol"], freeStops:["Breach Room","Village loot","Warehouse vents"], steps:["Spawn NE to Pilgrim's Peak","Comm Tower basement (use key)","Rotate south to Checkpoint tunnel","Patrol Car weapon case (use key)","Breach Room (free, no key)","Extract via airshaft"], est:"15-20min", coinEst:80000 },
  { name:"BG Underground", map:"Blue Gate", cond:"Night Raid", keys:["confiscation","patrol"], freeStops:["Breach Room"], steps:["Headhouse zipline down","Confiscation Room (use key)","Breach Room upstairs (free)","Checkpoint tunnel patrol car","Extract"], est:"12-18min", coinEst:70000 },
  { name:"Dam Coin Printer", map:"Dam BG", cond:"Any", keys:["dam_surv"], freeStops:["R&A Building","Ruby Residence"], steps:["Sprint to Water Treatment Control","South > right > right > corner room","Loot everything","Extract via nearest"], est:"5-8min", coinEst:40000 },
  { name:"Spaceport Score", map:"Spaceport", cond:"Night Raid", keys:["sp_warehouse"], freeStops:["Security Breaches","Container Storage"], steps:["Shipping Warehouse (NW)","Catwalk up > 2nd floor door","Weapon case + red lockers","Sweep nearby Security Breaches","Extract"], est:"10-15min", coinEst:45000 },
  { name:"Free Loot Sprint", map:"Any", cond:"Any", keys:[], freeStops:["Breach Room","Village","Warehouse vents"], steps:["Spawn > Reinforced Reception","Breach Room (no key needed)","Village for attachment BPs","Warehouse Complex vents","Extract"], est:"10-15min", coinEst:25000 },
];

const SKILL_BUILDS = [
  { name:"Balanced Core", rec:true, desc:"Best all-round. Mobility first, Survival second, Conditioning last.", branch:"Mixed", skills:["Marathon Runner 5/5","Youthful Lungs 5/5","Effortless Roll 5/5","Slip and Slide","Nimble Climber","Silent Scavenger","In-Round Crafting","Looter's Instincts","Security Breach","Used to the Weight 5/5","Fight Or Flight 5/5","Proficient Pryer 3/5"] },
  { name:"Speed Runner", desc:"Maximum movement. Sprint maps, outrun everyone.", branch:"Mobility", skills:["Marathon Runner 5/5","Youthful Lungs 5/5","Effortless Roll 5/5","Carry the Momentum","Vaults on Vaults","Vault Spring","Heroic Leap","Calming Stroll","Slip and Slide"] },
  { name:"Loot Goblin", desc:"Maximum carry + loot quality.", branch:"Survival", skills:["In-Round Crafting","Looter's Instincts","Silent Scavenger","Security Breach","Loaded Arms 5/5","A Little Extra","Marathon Runner 5/5","Youthful Lungs 5/5","Used to the Weight 5/5"] },
  { name:"PvP Tank", desc:"Maximum survivability for aggression.", branch:"Conditioning", skills:["Used to the Weight 5/5","Fight Or Flight 5/5","Survivor's Stamina","Blast-Born","Loaded Arms 5/5","Marathon Runner 5/5","Effortless Roll 5/5","Heroic Leap","Proficient Pryer"] },
];
const SKIP_SKILLS = ["Sky Clearing Swing","Fly Sweater","Back on Your Feet","One Raider Scraps","Three Deep Breaths"];

const UPGRADE_ORDER = [
  { step:1, id:"gunsmith", lvl:2, what:"Gunsmith Lv2", why:"Arpeggio + silencers" },
  { step:2, id:"scrappy", lvl:2, what:"Scrappy Lv2", why:"1 Dog Collar. Passive income." },
  { step:3, id:"gear", lvl:2, what:"Gear Bench Lv2", why:"Heavy Shield. Survive more." },
  { step:4, id:"refiner", lvl:2, what:"Refiner Lv2", why:"Adv components. No bottlenecks." },
  { step:5, id:"utility", lvl:2, what:"Utility Lv2", why:"Lure Grenade. Gamechanging." },
  { step:6, id:"gear", lvl:3, what:"Gear Bench Lv3", why:"Looting Mk.3. Max profit." },
  { step:7, id:"gunsmith", lvl:3, what:"Gunsmith Lv3", why:"Jupiter sniper. Endgame." },
  { step:8, id:"utility", lvl:3, what:"Utility Lv3", why:"Cloak + Snap Hook." },
];

const LOADOUT_TEMPLATES = [
  { name:"Budget Coin Run", cost:0, primary:"Ferro", secondary:"Stitcher", shield:"Light Shield", augment:"Any", items:"Safe Pocket, 3 Bandages, Door Blocker", use:"Zero risk sprint.", icon:"\uD83D\uDCB0" },
  { name:"Night Raid Sweeper", cost:1, primary:"Anvil", secondary:"Stitcher", shield:"Heavy Shield", augment:"Looting Mk.2+", items:"Safe Pocket, 3 Bandages, 2 Door Blockers, Noisemaker", use:"Balanced key + loot.", icon:"\uD83C\uDF19" },
  { name:"PvP Hunter", cost:2, primary:"Anvil", secondary:"Vulcano", shield:"Heavy Shield", augment:"Combat", items:"Safe Pocket, Defib, 2 Shield Rechargers, Smoke", use:"Pop shields > finish.", icon:"\u2694\uFE0F" },
  { name:"ARC Farm / Queen", cost:3, primary:"Jupiter", secondary:"Ferro", shield:"Heavy Shield", augment:"Looting Mk.3", items:"Safe Pocket, 5 Bandages, 3 Shield Rechargers, Ziplines", use:"Harvester farming.", icon:"\uD83D\uDC1B" },
  { name:"Blue Gate Keys", cost:1, primary:"Ferro", secondary:"Stitcher", shield:"Heavy Shield", augment:"Looting Mk.2+", items:"Safe Pocket, KEYS, 3 Door Blockers, 2 Noisemakers", use:"Key rooms priority.", icon:"\uD83D\uDD11" },
];

const FORTUNES = [
  "Green raid. Play fast and leave early.",
  "Your next fight is winnable\u2014take it on your terms.",
  "Loot is temporary. Extraction is forever.",
  "If you hear shots, a third party is already rotating.",
  "One more room is how raids end. Cash out.",
  "Silence is information. Keep it.",
  "The exit is always closer than you think.",
  "If your heart says run\u2014trust it.",
  "A Ferro and clean movement beats a Jupiter and panic.",
  "Never re-peek the same angle twice.",
  "The ARC remembers your routes. Change them.",
  "Tonight's loot is tomorrow's loadout. Think ahead.",
  "You don't need the kill. You need the extract.",
  "Three bandages is the minimum. Five is insurance.",
];

const TIPS = [
  "Prioritize stamina and a clean disengage before committing.",
  "If you win a fight, reposition\u2014don't loot where you killed.",
  "Mark extracts early and rotate with cover, not roads.",
  "Audio bait works: stop for 2 seconds and listen.",
  "Door Blockers buy you 8 seconds of safety. Use them.",
  "If the lobby feels quiet, someone is watching you.",
  "Always keep 1 bandage. Zero healing = guaranteed death.",
  "Night Raids: the darkness is your shield. Use it.",
  "Safe Pocket saves your best item on death. Always equip it.",
  "Scrappy upgrades print passive income. Don't sleep on them.",
];

// ═════════════════════════════════════
// ACHIEVEMENTS
// ═════════════════════════════════════
const BADGES = [
  { id:"first_blood", name:"First Blood", desc:"Complete your first raid", icon:"\uD83D\uDDE1\uFE0F", check:d=>d.totalRaids>=1 },
  { id:"first_extract", name:"Clean Exit", desc:"Extract for the first time", icon:"\uD83D\uDEAA", check:d=>d.totalExtracts>=1 },
  { id:"streak_3", name:"On a Roll", desc:"Reach a 3 extraction streak", icon:"\uD83D\uDD25", check:d=>d.bestStreak>=3 },
  { id:"streak_5", name:"Untouchable", desc:"Reach a 5 extraction streak", icon:"\u26A1", check:d=>d.bestStreak>=5 },
  { id:"streak_10", name:"Ghost Protocol", desc:"Reach a 10 extraction streak", icon:"\uD83D\uDC7B", check:d=>d.bestStreak>=10 },
  { id:"raids_10", name:"Regular", desc:"Complete 10 raids", icon:"\uD83C\uDFAF", check:d=>d.totalRaids>=10 },
  { id:"raids_50", name:"Veteran", desc:"Complete 50 raids", icon:"\uD83C\uDF96\uFE0F", check:d=>d.totalRaids>=50 },
  { id:"raids_100", name:"Legend", desc:"Complete 100 raids", icon:"\uD83D\uDC51", check:d=>d.totalRaids>=100 },
  { id:"all_keys", name:"Locksmith", desc:"Own every key type at once", icon:"\uD83D\uDD10", check:d=>KEYS_DB.every(k=>(d.keys[k.id]||0)>0) },
  { id:"quests_all", name:"Questmaster", desc:"Complete all tracked quests", icon:"\uD83D\uDCDC", check:d=>d.quests?.length>=QUESTS.length },
  { id:"challenge_5", name:"Daredevil", desc:"Win 5 challenge mode raids", icon:"\uD83C\uDFB2", check:d=>(d.challenges?.won||0)>=5 },
  { id:"ws_max", name:"Workshop Master", desc:"Max out 3+ workshop stations", icon:"\u2699\uFE0F", check:d=>Object.values(d.ws||{}).filter(v=>v>=3).length>=3 },
  { id:"rich", name:"Coin Baron", desc:"Hold keys worth 100K+", icon:"\uD83D\uDCB0", check:d=>Object.entries(d.keys||{}).reduce((a,[id,q])=>{const k=KEYS_DB.find(x=>x.id===id);return a+(k?.coinEst||0)*q;},0)>=100000 },
  { id:"daily_7", name:"Dedicated", desc:"Log raids on 7 different days", icon:"\uD83D\uDCC5", check:d=>{const days=new Set((d.raidLog||[]).map(r=>r.date));return days.size>=7;} },
  { id:"konami", name:"\u2588\u2588\u2588\u2588\u2588\u2588", desc:"???", icon:"\uD83D\uDC7E", check:d=>d.konamiUnlocked },
  { id:"explorer", name:"Explorer", desc:"Use API database lookup", icon:"\uD83D\uDD2D", check:d=>d.apiUsed },
];

// Konami sequence: ↑↑↓↓←→←→BA
const KONAMI = [38,38,40,40,37,39,37,39,66,65];

// ═════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════
export default function ARCCompanionV5() {
  const [tab, setTab] = useState("home");
  const [data, setData] = useState({
    keys:{}, ws:{}, loadout:{primary:"",secondary:"",shield:"",augment:""},
    quests:[], notes:"", raidLog:[], raidMode:null,
    totalRaids:0, totalExtracts:0, bestStreak:0, currentStreak:0,
    skills:{mobility:0,survival:0,conditioning:0},
    challenges:{won:0,lost:0,active:null},
    badgesUnlocked:[], konamiUnlocked:false, apiUsed:false,
  });
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [surprise, setSurprise] = useState(null);
  const [exp, setExp] = useState({});
  const [wf, setWF] = useState("All");
  const [cw, setCW] = useState([]);
  const [aiResp, setAiResp] = useState("");
  const [aiLoad, setAiLoad] = useState(false);
  const [aiQ, setAiQ] = useState("");
  const [raidTimer, setRaidTimer] = useState(0);
  const [planMap, setPlanMap] = useState("All");
  const [showExport, setShowExport] = useState(false);
  const [newBadge, setNewBadge] = useState(null);
  const [apiItems, setApiItems] = useState(null);
  const [apiSearch, setApiSearch] = useState("");
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [logFilter, setLogFilter] = useState("all");
  const [flashColor, setFlashColor] = useState(null);
  const timerRef = useRef(null);
  const konamiRef = useRef([]);
  const KEY = "arc-companion-v5";

  // CSS
  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = `
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
      @keyframes glow{0%,100%{box-shadow:0 0 4px #00e8a022}50%{box-shadow:0 0 16px #00e8a044}}
      @keyframes fadein{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      @keyframes scan{0%{top:-2px}100%{top:100%}}
      @keyframes streak{0%{transform:scale(1)}50%{transform:scale(1.15)}100%{transform:scale(1)}}
      @keyframes badgePop{0%{transform:scale(0) rotate(-15deg);opacity:0}60%{transform:scale(1.2) rotate(5deg)}100%{transform:scale(1) rotate(0);opacity:1}}
      @keyframes glitch{0%{transform:translate(0)}20%{transform:translate(-2px,1px)}40%{transform:translate(2px,-1px)}60%{transform:translate(-1px,2px)}80%{transform:translate(1px,-2px)}100%{transform:translate(0)}}
      @keyframes screenFlash{0%{opacity:.3}100%{opacity:0}}
      .arc-card{animation:fadein .25s ease both}
      .arc-scan::after{content:'';position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,#00e8a018,transparent);animation:scan 4s linear infinite;pointer-events:none}
      .arc-badge-new{animation:badgePop .5s cubic-bezier(.175,.885,.32,1.275) both}
      *::-webkit-scrollbar{width:4px;height:4px}
      *::-webkit-scrollbar-track{background:transparent}
      *::-webkit-scrollbar-thumb{background:#152030;border-radius:2px}
    `;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  // Konami Code listener
  useEffect(() => {
    const handler = (e) => {
      konamiRef.current = [...konamiRef.current, e.keyCode].slice(-10);
      if (konamiRef.current.length === 10 && konamiRef.current.every((v,i) => v === KONAMI[i])) {
        if (!data.konamiUnlocked) {
          upd({ konamiUnlocked: true });
          setNewBadge(BADGES.find(b=>b.id==="konami"));
          setTimeout(()=>setNewBadge(null), 3000);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [data.konamiUnlocked]);

  // Load
  useEffect(() => {
    (async () => {
      try {
        const raw = window?.storage?.get
          ? (await window.storage.get(KEY).catch(()=>null))?.value
          : null;
        if (raw) { const p = JSON.parse(raw); if (p && typeof p === "object") setData(d => ({...d, ...p})); }
      } catch(e) {}
      setLoaded(true);
    })();
  }, []);

  const save = useCallback(async (nd) => {
    setSaving(true);
    try { if (window?.storage?.set) await window.storage.set(KEY, JSON.stringify(nd)); } catch(e) {}
    setTimeout(() => setSaving(false), 400);
  }, []);

  const upd = useCallback((patch) => {
    setData(d => { const n = {...d, ...patch}; save(n); return n; });
  }, [save]);

  // Badge checker
  useEffect(() => {
    if (!loaded) return;
    const unlocked = data.badgesUnlocked || [];
    for (const b of BADGES) {
      if (!unlocked.includes(b.id) && b.check(data)) {
        const next = [...unlocked, b.id];
        upd({ badgesUnlocked: next });
        setNewBadge(b);
        setTimeout(() => setNewBadge(null), 3500);
        break; // one at a time
      }
    }
  }, [data.totalRaids, data.totalExtracts, data.bestStreak, data.quests?.length, data.challenges?.won, loaded]);

  const updKey = (id, delta) => upd({keys: {...data.keys, [id]: Math.max(0, (data.keys[id]||0)+delta)}});
  const updWS = (id, lvl) => upd({ws: {...data.ws, [id]: data.ws[id]===lvl ? lvl-1 : lvl}});
  const toggleQuest = (qid) => upd({quests: data.quests.includes(qid) ? data.quests.filter(x=>x!==qid) : [...data.quests, qid]});

  const totalKeys = Object.values(data.keys).reduce((a,b)=>a+b,0);
  const estKeyValue = Object.entries(data.keys).reduce((a,[id,qty])=>{const k=KEYS_DB.find(x=>x.id===id);return a+(k?.coinEst||0)*qty;},0);

  // Raid analytics
  const log = data.raidLog||[];
  const avgTime = log.length ? Math.round(log.reduce((a,r)=>a+r.time,0)/log.length) : 0;
  const extRate = data.totalRaids ? Math.round((data.totalExtracts||0)/data.totalRaids*100) : 0;
  const recentRate = (()=>{ const r5=log.slice(0,5); return r5.length ? Math.round(r5.filter(r=>r.extracted).length/r5.length*100) : 0; })();

  // Death map analysis
  const deathsByMap = (()=>{
    const m = {};
    log.filter(r=>!r.extracted).forEach(r=>{ const plan=RUN_PLANS.find(p=>p.name===r.plan); if(plan) m[plan.map]=(m[plan.map]||0)+1; });
    return Object.entries(m).sort((a,b)=>b[1]-a[1]);
  })();

  // Next upgrade + shopping list
  const nextUpgrades = UPGRADE_ORDER.filter(u => (data.ws[u.id]||0) < u.lvl).slice(0,3);
  const shoppingList = (()=>{
    const list = {};
    nextUpgrades.forEach(u => {
      const ws = WORKSHOP.find(w=>w.id===u.id);
      const lvl = ws?.lvls.find(l=>l.l===u.lvl);
      lvl?.mats.forEach(m => { list[m.n] = (list[m.n]||0) + m.q; });
    });
    return Object.entries(list).sort((a,b)=>b[1]-a[1]);
  })();

  const bestRun = RUN_PLANS.filter(p=>p.keys.every(k=>(data.keys[k]||0)>0)).sort((a,b)=>b.coinEst-a.coinEst)[0];

  // Daily fortune (changes each calendar day)
  const dailyFortune = FORTUNES[Math.floor(new Date().getTime() / 86400000) % FORTUNES.length];
  const dailyTip = TIPS[Math.floor(new Date().getTime() / 86400000 + 7) % TIPS.length];

  // Surprise / Challenge
  const pick = arr => arr[Math.floor(Math.random()*arr.length)];
  const rollSurprise = () => {
    const primaries = WEAPONS.filter(w=>!["Pistol","Grenade Launcher"].includes(w.type));
    const secondaries = WEAPONS.filter(w=>["Pistol","Shotgun","SMG"].includes(w.type));
    const shields = ["Light Shield","Heavy Shield","No Shield"];
    const wildcards = [
      "Pistols only \u2014 no primary allowed",
      "Melee-first: only shoot after taking damage",
      "Speed run: extract in under 5 minutes",
      "Pacifist: avoid all PvP engagements",
      "Hoarder: fill your backpack 100% before extracting",
      "No meds allowed \u2014 raw skill only",
      "Use the first weapon you find, ditch your loadout guns",
    ];
    const s = {
      fortune:pick(FORTUNES), primary:pick(primaries).name, secondary:pick(secondaries).name,
      tip:pick(TIPS), shield:pick(shields), wildcard:Math.random()>0.6?pick(wildcards):null, ts:Date.now()
    };
    setSurprise(s);
  };
  const acceptChallenge = () => {
    if(!surprise) return;
    upd({ challenges:{...data.challenges, active:{primary:surprise.primary,secondary:surprise.secondary,wildcard:surprise.wildcard,accepted:Date.now()}},
          loadout:{...data.loadout, primary:surprise.primary, secondary:surprise.secondary} });
  };

  // Raid Mode
  const startRaid = (plan) => {
    upd({raidMode:{plan:plan.name,step:0,steps:plan.steps,keys:plan.keys||[],startTime:Date.now(),lootNotes:""}});
    setRaidTimer(0);
    if(timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(()=>setRaidTimer(t=>t+1),1000);
    setTab("raid");
  };
  const endRaid = (extracted) => {
    if(timerRef.current) clearInterval(timerRef.current);
    const rm = data.raidMode;
    const entry = {plan:rm?.plan,time:raidTimer,extracted,date:new Date().toISOString().split('T')[0],notes:rm?.lootNotes||""};
    let newKeys = {...data.keys};
    if (extracted && rm?.keys) rm.keys.forEach(k => { if(newKeys[k]>0) newKeys[k]--; });
    const newStreak = extracted ? (data.currentStreak||0)+1 : 0;
    const best = Math.max(data.bestStreak||0, newStreak);
    let ch = {...(data.challenges||{})};
    if (ch.active) { if(extracted) ch.won=(ch.won||0)+1; else ch.lost=(ch.lost||0)+1; ch.active=null; }
    // Screen flash
    setFlashColor(extracted ? "#00e8a0" : "#ef4444");
    setTimeout(() => setFlashColor(null), 600);
    upd({ raidLog:[entry,...log.slice(0,49)], raidMode:null, keys:newKeys,
          totalRaids:(data.totalRaids||0)+1, totalExtracts:(data.totalExtracts||0)+(extracted?1:0),
          currentStreak:newStreak, bestStreak:best, challenges:ch });
    setTab("home");
  };
  const advanceStep = () => {
    if(!data.raidMode) return;
    const next = data.raidMode.step+1;
    if(next>=data.raidMode.steps.length) return;
    upd({raidMode:{...data.raidMode,step:next}});
  };

  // API Fetch (ardb.app + arcdata fallback)
  const fetchAPI = async (search) => {
    setApiLoading(true); setApiError(null); setApiItems(null);
    if (!data.apiUsed) upd({ apiUsed: true });
    try {
      // Try arcdata.mahcks.com first (public Cloudflare Worker)
      const r = await fetch(`https://arcdata.mahcks.com/v1/items?full=true&limit=45`);
      if (r.ok) {
        const d = await r.json();
        const items = d.items || d;
        const filtered = search ? items.filter(i =>
          (i.name?.en||i.name||"").toLowerCase().includes(search.toLowerCase()) ||
          (i.description?.en||"").toLowerCase().includes(search.toLowerCase())
        ) : items.slice(0,20);
        setApiItems(filtered);
      } else throw new Error("Primary API failed");
    } catch(e1) {
      try {
        // Fallback: ardb.app
        const r2 = await fetch(`https://ardb.app/api/items`);
        if (r2.ok) {
          const d2 = await r2.json();
          const filtered = search ? d2.filter(i =>
            (i.name||"").toLowerCase().includes(search.toLowerCase())
          ) : d2.slice(0,20);
          setApiItems(filtered);
        } else throw new Error("Backup API failed");
      } catch(e2) {
        setApiError("APIs unreachable. When deployed externally, this will fetch live game data from ardb.app and arcdata.mahcks.com. For now, use the built-in GUNS tab for weapon data.");
      }
    }
    setApiLoading(false);
  };

  // AI
  const askAI = useCallback(async (q) => {
    setAiLoad(true); setAiResp("");
    const invK = Object.entries(data.keys).filter(([,v])=>v>0).map(([k,v])=>{const d=KEYS_DB.find(x=>x.id===k);return `${v}x ${d?.name||k} (T${d?.tier})`;}).join(", ")||"none";
    const wsS = Object.entries(data.ws).map(([k,v])=>`${k}:Lv${v}`).join(", ")||"all Lv0";
    const ldS = `${data.loadout.primary||"none"}+${data.loadout.secondary||"none"}|${data.loadout.shield||"none"}`;
    const raidStats = `${data.totalRaids||0} raids, ${extRate}% extract rate, ${data.currentStreak||0} current streak, best ${data.bestStreak||0}`;
    const recent = log.slice(0,3).map(r=>`${r.extracted?"EXT":"DIED"} ${r.plan||"?"} ${Math.floor(r.time/60)}m`).join("; ");
    const badges = (data.badgesUnlocked||[]).length;
    const deathInfo = deathsByMap.length ? `Deaths by map: ${deathsByMap.map(([m,c])=>`${m}:${c}`).join(", ")}` : "";
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
          system:`Elite ARC Raiders tactical advisor (Feb 2026). PLAYER: Keys=${invK}. Workshop=${wsS}. Loadout=${ldS}. Quests=${data.quests.length}/15 tracked. Stats=${raidStats}. Recent=${recent}. Key value~${estKeyValue}. Badges=${badges}/16. ${deathInfo}
S-weapons=Ferro,Anvil,Kettle,Vulcano. Workshop=Gunsmith2>Scrappy2>GearBench2>Refiner2>Utility2>Gear3.
Skills=Mobility(Marathon Runner,Youthful Lungs)>Survival(In-Round Crafting,Security Breach)>Conditioning.
Keys: S=Raider Hatch, A=Comm Tower, B+=Dam Surv/Trench, B=Confiscation/SP Warehouse.
Night=boosted loot. Door Blockers=mandatory. Safe Pocket=always.
External resources: ARCTracker.io for full sync, ardb.app for item DB, OP.GG for guides.
Concise, tactical, personalized. Max 200 words. 1-3 numbered actions.`,
          messages:[{role:"user",content:q}]
        })
      });
      const d = await r.json();
      setAiResp(d.content?.map(i=>i.text||"").join("\n")||"Comms error.");
    } catch(e) { setAiResp("Comms offline. Use the app tabs to plan manually."); }
    setAiLoad(false);
  }, [data, estKeyValue, extRate, log, deathsByMap]);

  // Export / Import / Reset
  const exportData = () => { try { navigator.clipboard.writeText(JSON.stringify(data,null,2)); setShowExport(true); setTimeout(()=>setShowExport(false),2000); } catch(e){} };
  const importData = () => {
    const input = prompt("Paste exported JSON data:");
    if (!input) return;
    try { const parsed = JSON.parse(input); if (parsed && typeof parsed === "object") { setData(d => ({...d, ...parsed})); save({...data, ...parsed}); } } catch(e) { alert("Invalid JSON"); }
  };
  const resetAll = () => {
    if(!confirm("EXPEDITION RESET: Wipe ALL progress? This cannot be undone.")) return;
    const fresh = {keys:{},ws:{},loadout:{primary:"",secondary:"",shield:"",augment:""},quests:[],notes:"",raidLog:[],raidMode:null,totalRaids:0,totalExtracts:0,bestStreak:0,currentStreak:0,skills:{mobility:0,survival:0,conditioning:0},challenges:{won:0,lost:0,active:null},badgesUnlocked:[],konamiUnlocked:false,apiUsed:false};
    setData(fresh); save(fresh);
  };

  // ═══ STYLES ═══
  const bg="#060910",cd="#0b1118",bd="#152030",ac="#00e8a0",acd=ac+"28",gd="#fbbf24",rd="#ef4444",pp="#a78bfa",cy="#38bdf8";
  const t0="#3e5a70",t1="#8aabb8",t2="#e2e8f0";
  const S = {
    app:{minHeight:"100vh",background:bg,color:t1,fontFamily:"'SF Mono','Menlo','JetBrains Mono',ui-monospace,monospace",fontSize:12,position:"relative"},
    hd:{background:`linear-gradient(180deg,#0d1520 0%,${bg} 100%)`,borderBottom:`1px solid ${bd}`,padding:"10px 12px 0",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(16px)"},
    tabs:{display:"flex",gap:0,marginTop:6,overflowX:"auto"},
    tab:a=>({flex:"0 0 auto",padding:"6px 9px",fontSize:7,letterSpacing:2,textTransform:"uppercase",fontWeight:800,background:"none",border:"none",borderBottom:a?`2px solid ${ac}`:"2px solid transparent",color:a?ac:t0,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",transition:"color .15s"}),
    body:{maxWidth:660,margin:"0 auto",padding:"4px 10px 90px"},
    card:b=>({background:cd,border:`1px solid ${b||bd}`,borderRadius:8,padding:10,marginBottom:5}),
    badge:c=>({fontSize:7,padding:"1px 5px",borderRadius:3,background:`${c}20`,color:c,fontWeight:700,letterSpacing:.5,display:"inline-block"}),
    hdr:c=>({fontSize:7,letterSpacing:3,textTransform:"uppercase",fontWeight:800,color:c||ac,marginBottom:6}),
    btn:c=>({background:`${(c||ac)}12`,border:`1px solid ${(c||ac)}28`,borderRadius:5,padding:"4px 10px",fontSize:9,color:c||ac,cursor:"pointer",fontWeight:600,fontFamily:"inherit",transition:"all .12s"}),
    val:{fontSize:16,fontWeight:800,color:t2},
    sm:{fontSize:9,color:t0},
    qb:{width:24,height:24,borderRadius:4,border:`1px solid ${bd}`,background:"#0a1018",color:t1,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"monospace"},
    inp:{background:"#080d14",border:`1px solid ${bd}`,borderRadius:5,padding:"7px 9px",fontSize:11,color:t2,fontFamily:"inherit",outline:"none",width:"100%"},
    sel:{background:"#080d14",border:`1px solid ${bd}`,borderRadius:5,padding:"5px 7px",fontSize:10,color:t2,fontFamily:"inherit",outline:"none"},
  };
  const TABS=[{id:"home",l:"HOME"},{id:"plan",l:"PLAN"},{id:"keys",l:"KEYS"},{id:"loadout",l:"KIT"},{id:"workshop",l:"SHOP"},{id:"weapons",l:"GUNS"},{id:"skills",l:"SKILLS"},{id:"quests",l:"QUESTS"},{id:"intel",l:"INTEL"},{id:"ai",l:"AI"}];
  if(data.raidMode) TABS.unshift({id:"raid",l:"\u25B6 LIVE"});
  const fmt = s => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;
  const tc = t => ({S:ac,A:cy,"B+":pp,B:gd,"C+":"#f97316",C:"#f97316",D:rd})[t]||t0;
  const unlockedBadges = data.badgesUnlocked||[];

  if(!loaded) return <div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center",height:"100vh"}}><div style={{color:ac,fontSize:9,letterSpacing:4,animation:"pulse 1.5s infinite"}}>INITIALIZING...</div></div>;

  return (
    <div style={S.app}>
      {/* Screen flash effect */}
      {flashColor && <div style={{position:"fixed",inset:0,background:flashColor,zIndex:9999,pointerEvents:"none",animation:"screenFlash .6s ease-out forwards"}} />}

      {/* Badge unlock toast */}
      {newBadge && <div style={{position:"fixed",top:60,left:"50%",transform:"translateX(-50%)",zIndex:9998,background:"#0d1520",border:`1px solid ${gd}40`,borderRadius:10,padding:"10px 16px",display:"flex",alignItems:"center",gap:8,boxShadow:`0 0 30px ${gd}20`}} className="arc-badge-new">
        <span style={{fontSize:24}}>{newBadge.icon}</span>
        <div><div style={{fontSize:7,letterSpacing:2,color:gd,fontWeight:800}}>BADGE UNLOCKED</div><div style={{fontSize:11,fontWeight:700,color:t2}}>{newBadge.name}</div><div style={{fontSize:8,color:t0}}>{newBadge.desc}</div></div>
      </div>}

      {/* Header */}
      <div style={S.hd}><div style={{maxWidth:660,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:6,letterSpacing:6,color:ac,fontWeight:800}}>ARC RAIDERS</div>
            <div style={{fontSize:14,fontWeight:800,color:"#fff",letterSpacing:1}}>COMPANION <span style={{fontSize:8,color:t0,fontWeight:400,letterSpacing:0}}>v5</span></div>
          </div>
          <div style={{textAlign:"right",fontSize:8,color:t0}}>
            {saving&&<span style={{color:ac,animation:"pulse .6s infinite"}}>SAVING </span>}
            <span style={{color:data.currentStreak>=3?gd:t0}}>{data.currentStreak>=3?`\uD83D\uDD25${data.currentStreak}`:""}</span>
            {" "}{totalKeys>0?`${totalKeys}K`:"0K"} {data.quests.length}Q {extRate}% {unlockedBadges.length>0?`\uD83C\uDFC5${unlockedBadges.length}`:""}
          </div>
        </div>
        <div style={S.tabs}>{TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={S.tab(tab===t.id)}>{t.l}</button>)}</div>
      </div></div>

      <div style={S.body}>

        {/* ═══ LIVE RAID ═══ */}
        {tab==="raid"&&data.raidMode&&(()=>{
          const rm=data.raidMode, clr=raidTimer<300?ac:raidTimer<480?gd:rd;
          return <>
            <div className="arc-card arc-scan" style={{...S.card(`${clr}40`),textAlign:"center",marginTop:6,position:"relative",overflow:"hidden"}}>
              <div style={{fontSize:7,letterSpacing:4,color:clr,fontWeight:800}}>RAID IN PROGRESS</div>
              <div style={{fontSize:32,fontWeight:800,color:clr,margin:"4px 0",animation:"glow 2s infinite"}}>{fmt(raidTimer)}</div>
              <div style={{fontSize:10,color:t2}}>{rm.plan}</div>
              {data.challenges?.active&&<div style={{marginTop:4}}><span style={S.badge(gd)}>CHALLENGE ACTIVE{data.challenges.active.wildcard?" \u2605":""}</span>
                {data.challenges.active.wildcard&&<div style={{fontSize:8,color:gd,marginTop:2}}>{data.challenges.active.wildcard}</div>}
              </div>}
            </div>
            {rm.steps.map((step,i)=>{
              const done=i<rm.step,cur=i===rm.step;
              return <div key={i} className="arc-card" onClick={cur?advanceStep:undefined} style={{...S.card(cur?`${ac}30`:undefined),opacity:i>rm.step?.4:1,cursor:cur?"pointer":"default",display:"flex",gap:8,alignItems:"center"}}>
                <div style={{width:22,height:22,borderRadius:11,border:`2px solid ${done?ac:cur?ac:bd}`,background:done?ac:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:9,color:done?bg:cur?ac:t0,fontWeight:700,animation:cur?"pulse 1.5s infinite":"none"}}>{done?"\u2713":i+1}</div>
                <span style={{fontSize:11,color:done?t0:cur?t2:t1,textDecoration:done?"line-through":"none",flex:1}}>{step}</span>
                {cur&&<span style={{fontSize:7,color:ac,fontWeight:700}}>TAP \u25B6</span>}
              </div>;
            })}
            <div className="arc-card" style={{...S.card(),marginTop:3}}>
              <textarea value={rm.lootNotes||""} onChange={e=>upd({raidMode:{...rm,lootNotes:e.target.value}})} placeholder="Log loot found..." style={{...S.inp,minHeight:40,resize:"vertical"}} />
            </div>
            <div style={{display:"flex",gap:5,marginTop:4}}>
              <button onClick={()=>endRaid(true)} style={{...S.btn(ac),flex:1,padding:8,fontSize:11,fontWeight:800}}>EXTRACTED \u2713</button>
              <button onClick={()=>endRaid(false)} style={{...S.btn(rd),flex:1,padding:8,fontSize:11,fontWeight:800}}>DIED \u2620</button>
            </div>
          </>;
        })()}

        {/* ═══ HOME ═══ */}
        {tab==="home"&&<>
          {/* Daily Intel */}
          <div className="arc-card" style={{...S.card(`${pp}15`),marginTop:5,borderLeft:`2px solid ${pp}`}}>
            <div style={{fontSize:7,letterSpacing:2,color:pp,fontWeight:800}}>DAILY INTEL</div>
            <div style={{fontSize:11,color:t2,fontStyle:"italic",margin:"3px 0"}}>"{dailyFortune}"</div>
            <div style={{fontSize:9,color:ac}}>{dailyTip}</div>
          </div>

          {/* Stats */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:3,marginTop:3}}>
            {[{l:"Keys",v:totalKeys,c:ac},{l:"Value",v:estKeyValue>0?`${Math.round(estKeyValue/1000)}K`:"—",c:gd},{l:"Rate",v:`${extRate}%`,c:extRate>=60?ac:extRate>=40?gd:rd},{l:"Streak",v:data.bestStreak||0,c:pp}].map((s,i)=>
              <div key={i} className="arc-card" style={S.card()}><div style={S.sm}>{s.l}</div><div style={{...S.val,fontSize:13,color:s.c}}>{s.v}</div></div>
            )}
          </div>

          {/* Smart Recommend */}
          {bestRun && <div className="arc-card" style={{...S.card(acd),marginTop:3}}>
            <div style={S.hdr()}>RECOMMENDED RUN</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:12,fontWeight:700,color:t2}}>{bestRun.name}</div><div style={{fontSize:9,color:t0}}>{bestRun.map} | ~{bestRun.est}</div></div>
              <div style={{textAlign:"right"}}><span style={{fontSize:12,fontWeight:700,color:gd}}>~{Math.round(bestRun.coinEst/1000)}K</span></div>
            </div>
            <button onClick={()=>startRaid(bestRun)} style={{...S.btn(),marginTop:6,width:"100%",padding:7,fontSize:10,fontWeight:700}}>START THIS RAID</button>
          </div>}

          {/* Next Priorities */}
          <div className="arc-card" style={{...S.card(),marginTop:3}}>
            <div style={S.hdr(gd)}>NEXT PRIORITIES</div>
            {totalKeys===0&&Object.keys(data.ws).length===0 ? (
              <div style={{fontSize:10,color:t1,lineHeight:1.5}}>
                Welcome! Set your <span style={{color:ac,cursor:"pointer"}} onClick={()=>setTab("workshop")}>workshop levels</span>, add <span style={{color:ac,cursor:"pointer"}} onClick={()=>setTab("keys")}>keys</span>, then check <span style={{color:ac,cursor:"pointer"}} onClick={()=>setTab("plan")}>planner</span>.
              </div>
            ) : (
              <div style={{fontSize:10,lineHeight:1.5}}>
                {nextUpgrades[0]&&<div style={{marginBottom:3}}><span style={{color:gd}}>Workshop:</span> <span style={{color:t2}}>{nextUpgrades[0].what}</span> <span style={{color:t0}}>— {nextUpgrades[0].why}</span></div>}
                {totalKeys>0&&<div style={{marginBottom:3}}><span style={{color:pp}}>Keys:</span> <span style={{color:t2}}>{totalKeys} keys (~{Math.round(estKeyValue/1000)}K)</span> <span style={{color:ac,cursor:"pointer"}} onClick={()=>setTab("plan")}>Plan run \u25B6</span></div>}
                {extRate>0&&extRate<50&&<div style={{marginBottom:3}}><span style={{color:rd}}>Survival:</span> <span style={{color:t2}}>Extract rate {extRate}%. Consider Budget Coin Run loadout.</span></div>}
                {deathsByMap.length>0&&<div><span style={{color:"#f97316"}}>Danger zone:</span> <span style={{color:t2}}>Most deaths on {deathsByMap[0][0]} ({deathsByMap[0][1]}). Adjust strategy.</span></div>}
              </div>
            )}
          </div>

          {/* Surprise Drop / Challenge */}
          <div className="arc-card" style={{...S.card(`${cy}12`),marginTop:3}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:10,fontWeight:700,color:cy}}>Surprise Drop</div><div style={S.sm}>Random loadout + fortune + wildcard</div></div>
              <button onClick={rollSurprise} style={S.btn(cy)}>\uD83C\uDFB2 Roll</button>
            </div>
            {data.challenges?.active&&<div style={{marginTop:6,padding:6,background:`${gd}10`,borderRadius:4,border:`1px solid ${gd}25`}}>
              <div style={{fontSize:9,color:gd,fontWeight:700}}>ACTIVE CHALLENGE</div>
              <div style={{fontSize:10,color:t2}}>{data.challenges.active.primary} + {data.challenges.active.secondary}</div>
              {data.challenges.active.wildcard&&<div style={{fontSize:9,color:"#f97316",marginTop:1}}>\u2605 {data.challenges.active.wildcard}</div>}
              <div style={{fontSize:8,color:t0}}>Extract to win! ({data.challenges.won||0}W / {data.challenges.lost||0}L)</div>
            </div>}
            {surprise&&<div style={{marginTop:6}}>
              <div style={{fontSize:11,color:t2,marginBottom:4,fontStyle:"italic"}}>"{surprise.fortune}"</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4}}>
                <div style={{...S.card(),padding:6}}><div style={{fontSize:8,color:t0}}>Primary</div><div style={{fontSize:11,fontWeight:700,color:t2}}>{surprise.primary}</div></div>
                <div style={{...S.card(),padding:6}}><div style={{fontSize:8,color:t0}}>Secondary</div><div style={{fontSize:11,fontWeight:700,color:t2}}>{surprise.secondary}</div></div>
                <div style={{...S.card(),padding:6}}><div style={{fontSize:8,color:t0}}>Shield</div><div style={{fontSize:11,fontWeight:700,color:t2}}>{surprise.shield}</div></div>
              </div>
              {surprise.wildcard&&<div style={{marginTop:4,padding:5,background:`${"#f97316"}12`,border:`1px solid ${"#f97316"}25`,borderRadius:4}}>
                <div style={{fontSize:8,color:"#f97316",fontWeight:700}}>\u2605 WILDCARD</div>
                <div style={{fontSize:10,color:t2}}>{surprise.wildcard}</div>
              </div>}
              <div style={{fontSize:9,color:ac,marginTop:4}}>{surprise.tip}</div>
              <div style={{display:"flex",gap:4,marginTop:4}}>
                <button onClick={acceptChallenge} style={{...S.btn(gd),fontSize:9}}>Accept Challenge</button>
                <button onClick={()=>{upd({loadout:{...data.loadout,primary:surprise.primary,secondary:surprise.secondary}});}} style={{...S.btn(),fontSize:9}}>Just Equip</button>
              </div>
            </div>}
          </div>

          {/* Badges Preview */}
          {unlockedBadges.length>0&&<div className="arc-card" style={{...S.card(),marginTop:3}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={S.hdr(gd)}>BADGES ({unlockedBadges.length}/{BADGES.length})</div>
              <span style={{fontSize:8,color:t0,cursor:"pointer"}} onClick={()=>setTab("intel")}>View all \u25B6</span>
            </div>
            <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
              {BADGES.filter(b=>unlockedBadges.includes(b.id)).map(b=>(
                <span key={b.id} title={`${b.name}: ${b.desc}`} style={{fontSize:18,cursor:"default",filter:"drop-shadow(0 0 4px #fbbf2440)"}}>{b.icon}</span>
              ))}
            </div>
          </div>}

          {/* Raid Analytics */}
          {data.totalRaids>0&&<div className="arc-card" style={{...S.card(),marginTop:3}}>
            <div style={S.hdr(pp)}>RAID ANALYTICS</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:3,marginBottom:6}}>
              <div><div style={S.sm}>Avg Time</div><div style={{fontSize:12,fontWeight:700,color:t2}}>{fmt(avgTime)}</div></div>
              <div><div style={S.sm}>Last 5</div><div style={{fontSize:12,fontWeight:700,color:recentRate>=60?ac:recentRate>=40?gd:rd}}>{recentRate}%</div></div>
              <div><div style={S.sm}>Best Streak</div><div style={{fontSize:12,fontWeight:700,color:pp,animation:data.currentStreak>=3&&data.currentStreak===data.bestStreak?"streak .6s ease":"none"}}>{data.bestStreak||0}</div></div>
            </div>
            <div style={{display:"flex",gap:1}}>
              {log.slice(0,15).reverse().map((r,i)=><div key={i} style={{flex:1,height:16,borderRadius:2,background:r.extracted?`${ac}50`:`${rd}40`}} title={`${r.plan||"?"} ${fmt(r.time)}`}/>)}
            </div>
            <div style={{fontSize:8,color:t0,marginTop:2}}>Last {Math.min(15,log.length)} raids (left=oldest)</div>
          </div>}

          {/* Quick AI */}
          <div className="arc-card" style={{...S.card(),marginTop:3}}>
            <button onClick={()=>{setTab("ai");setTimeout(()=>askAI("Based on my exact state, what are the 3 most impactful things for my next session?"),100);}} style={{...S.btn(),width:"100%",padding:7,fontSize:10}}>ASK AI: What should I do next?</button>
          </div>
        </>}

        {/* ═══ PLANNER ═══ */}
        {tab==="plan"&&<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:4}}>
            <div style={S.hdr()}>RUN PLANNER</div>
            <div style={{display:"flex",gap:2}}>
              {["All","Blue Gate","Dam BG","Spaceport"].map(m=><button key={m} onClick={()=>setPlanMap(m)} style={{...S.btn(planMap===m?ac:t0),fontSize:7,padding:"2px 6px"}}>{m==="All"?"ALL":m.split(" ")[0].toUpperCase()}</button>)}
            </div>
          </div>
          {RUN_PLANS.filter(p=>planMap==="All"||p.map===planMap).map((p,i)=>{
            const avail=p.keys.every(k=>(data.keys[k]||0)>0);
            const open=exp[`p${i}`];
            return <div key={i} className="arc-card" style={S.card(avail?acd:undefined)}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}} onClick={()=>setExp(e=>({...e,[`p${i}`]:!open}))}>
                <div>
                  <div style={{display:"flex",gap:4,alignItems:"center"}}><span style={{fontSize:11,fontWeight:700,color:t2}}>{p.name}</span>{avail&&<span style={S.badge(ac)}>READY</span>}</div>
                  <div style={{fontSize:9,color:t0}}>{p.map} | {p.cond} | ~{p.est}</div>
                </div>
                <span style={{fontSize:12,fontWeight:700,color:gd}}>~{Math.round(p.coinEst/1000)}K</span>
              </div>
              {open&&<div style={{marginTop:6,paddingTop:6,borderTop:`1px solid ${bd}`}}>
                <div style={{fontSize:9,color:t0,marginBottom:3}}>KEYS: {p.keys.length===0?"None (free run)":p.keys.map(k=>{const kd=KEYS_DB.find(x=>x.id===k);return `${kd?.name||k} ${(data.keys[k]||0)>0?"\u2705":"\u274C"}`;}).join(", ")}</div>
                {p.steps.map((s,si)=><div key={si} style={{fontSize:10,color:t1,padding:"2px 0",borderBottom:`1px solid ${bd}08`}}>{si+1}. {s}</div>)}
                {avail&&<button onClick={()=>startRaid(p)} style={{...S.btn(),width:"100%",marginTop:6,padding:6,fontWeight:700}}>START RAID</button>}
              </div>}
            </div>;
          })}
        </>}

        {/* ═══ KEYS ═══ */}
        {tab==="keys"&&<>
          <div style={S.hdr()}>KEYS ({totalKeys})</div>
          {KEYS_DB.map(k=>{
            const qty=data.keys[k.id]||0;
            const open=exp[k.id];
            return <div key={k.id} className="arc-card" style={S.card(qty>0?acd:undefined)}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:16}}>{k.icon}</span>
                  <div><div style={{fontSize:11,fontWeight:600,color:qty>0?t2:t1}}>{k.name}</div><div style={{fontSize:8,color:t0}}>{k.map} <span style={{...S.badge(tc(k.tier)),marginLeft:3}}>{k.tier}</span></div></div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <button onClick={()=>updKey(k.id,-1)} style={S.qb}>−</button>
                  <span style={{fontSize:14,fontWeight:800,color:qty>0?ac:t0,minWidth:18,textAlign:"center"}}>{qty}</span>
                  <button onClick={()=>updKey(k.id,1)} style={S.qb}>+</button>
                </div>
              </div>
              <div style={{fontSize:8,color:t0,marginTop:3,cursor:"pointer"}} onClick={()=>setExp(e=>({...e,[k.id]:!open}))}>{open?"\u25B2 Less":"\u25BC Details"}</div>
              {open&&<div style={{marginTop:4,paddingTop:4,borderTop:`1px solid ${bd}`,fontSize:9,lineHeight:1.6}}>
                <div><span style={{color:t0}}>Location:</span> <span style={{color:t2}}>{k.loc}</span></div>
                <div><span style={{color:t0}}>Route:</span> <span style={{color:t2}}>{k.route}</span></div>
                <div><span style={{color:t0}}>Loot:</span> <span style={{color:gd}}>{k.loot}</span></div>
                {k.quest&&<div><span style={{color:t0}}>Quest:</span> <span style={{color:pp}}>{k.quest}</span></div>}
              </div>}
            </div>;
          })}
        </>}

        {/* ═══ KIT ═══ */}
        {tab==="loadout"&&<>
          <div style={S.hdr()}>LOADOUT</div>
          <div className="arc-card" style={S.card()}>
            {["primary","secondary","shield","augment"].map(slot=>(
              <div key={slot} style={{marginBottom:6}}>
                <div style={{fontSize:8,color:t0,textTransform:"uppercase",letterSpacing:1,marginBottom:2}}>{slot}</div>
                <select value={data.loadout[slot]||""} onChange={e=>upd({loadout:{...data.loadout,[slot]:e.target.value}})} style={{...S.sel,width:"100%"}}>
                  <option value="">—</option>
                  {slot==="shield"?["Light Shield","Heavy Shield"].map(s=><option key={s}>{s}</option>):
                   slot==="augment"?["Any","Looting Mk.2","Looting Mk.3","Combat","Tactical"].map(s=><option key={s}>{s}</option>):
                   WEAPONS.filter(w=>slot==="secondary"?["Pistol","Shotgun","SMG"].includes(w.type):!["Pistol","Grenade Launcher"].includes(w.type)).map(w=><option key={w.name}>{w.name}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div style={S.hdr(gd)}>TEMPLATES</div>
          {LOADOUT_TEMPLATES.map((t,i)=>(
            <div key={i} className="arc-card" style={S.card()}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontSize:11,fontWeight:700,color:t2}}>{t.icon} {t.name}</div><div style={{fontSize:9,color:t0}}>{t.primary} + {t.secondary} | {t.shield}</div><div style={{fontSize:8,color:t0}}>{t.use}</div></div>
                <button onClick={()=>upd({loadout:{primary:t.primary,secondary:t.secondary,shield:t.shield,augment:t.augment}})} style={S.btn()}>EQUIP</button>
              </div>
            </div>
          ))}
        </>}

        {/* ═══ WORKSHOP ═══ */}
        {tab==="workshop"&&<>
          <div style={S.hdr()}>WORKSHOP</div>
          {/* Overall progress */}
          {(()=>{
            const total=WORKSHOP.reduce((a,w)=>a+w.lvls.length,0);
            const done=WORKSHOP.reduce((a,w)=>a+Math.min(data.ws[w.id]||0,w.lvls.length),0);
            return <div className="arc-card" style={S.card()}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:9}}><span style={{color:t0}}>Overall Progress</span><span style={{color:ac,fontWeight:700}}>{done}/{total}</span></div>
              <div style={{height:3,background:bd,borderRadius:2,marginTop:3,overflow:"hidden"}}><div style={{height:3,background:ac,borderRadius:2,width:`${(done/total)*100}%`,transition:"width .3s"}}/></div>
            </div>;
          })()}
          {/* Shopping list */}
          {shoppingList.length>0&&<div className="arc-card" style={{...S.card(`${gd}12`),marginBottom:6}}>
            <div style={S.hdr(gd)}>SHOPPING LIST (NEXT {nextUpgrades.length} UPGRADES)</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:3}}>{shoppingList.map(([name,qty])=><span key={name} style={{fontSize:8,padding:"2px 6px",borderRadius:100,background:`${gd}10`,border:`1px solid ${gd}20`,color:gd}}>{name} ×{qty}</span>)}</div>
            <div style={{fontSize:8,color:t0,marginTop:3}}>{nextUpgrades.map(u=>`${u.what} (${u.why})`).join(" → ")}</div>
          </div>}
          {WORKSHOP.map(w=>{
            const cl=data.ws[w.id]||0;
            const open=exp[`w${w.id}`];
            return <div key={w.id} className="arc-card" style={S.card()}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}} onClick={()=>setExp(e=>({...e,[`w${w.id}`]:!open}))}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:16}}>{w.icon}</span>
                  <div><div style={{fontSize:11,fontWeight:600,color:t2}}>{w.name}</div><div style={{fontSize:8,color:t0}}>{w.desc}</div></div>
                </div>
                <div style={{display:"flex",gap:2}}>{w.lvls.map(l=><button key={l.l} onClick={e=>{e.stopPropagation();updWS(w.id,l.l);}} style={{width:22,height:22,borderRadius:4,fontSize:9,fontWeight:700,border:`1px solid ${cl>=l.l?ac:bd}`,background:cl>=l.l?ac:"transparent",color:cl>=l.l?bg:t0,cursor:"pointer"}}>{l.l}</button>)}</div>
              </div>
              {open&&<div style={{marginTop:6,paddingTop:6,borderTop:`1px solid ${bd}`}}>
                {w.lvls.map(l=><div key={l.l} style={{marginBottom:4,opacity:cl>=l.l?.5:1}}>
                  <div style={{fontSize:9,color:cl>=l.l?t0:t2,fontWeight:600}}>Lv{l.l}: {l.unlock}</div>
                  {l.mats.length>0&&<div style={{fontSize:8,color:t0}}>{l.mats.map(m=>`${m.n} ×${m.q}`).join(", ")}</div>}
                </div>)}
              </div>}
            </div>;
          })}
        </>}

        {/* ═══ WEAPONS ═══ */}
        {tab==="weapons"&&<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:4}}>
            <div style={S.hdr()}>WEAPONS ({WEAPONS.length})</div>
            <div style={{display:"flex",gap:2}}>
              {["All","S","A","B","C","D"].map(f=><button key={f} onClick={()=>setWF(f)} style={{...S.btn(wf===f?tc(f):t0),fontSize:7,padding:"2px 5px"}}>{f}</button>)}
            </div>
          </div>
          {cw.length===2&&<div className="arc-card" style={{...S.card(cy+"20"),marginBottom:6}}>
            <div style={S.hdr(cy)}>COMPARE</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {cw.map((wn,i)=>{const w=WEAPONS.find(x=>x.name===wn);return w?<div key={i}>
                <div style={{fontSize:12,fontWeight:700,color:t2}}>{w.name}</div>
                <div style={{fontSize:9,color:t0}}>{w.type} | {w.rarity} | {w.ammo}</div>
                {["pvp","pve","wt"].map(s=><div key={s} style={{display:"flex",justifyContent:"space-between",fontSize:9,marginTop:2}}><span style={{color:t0}}>{s.toUpperCase()}</span><span style={{color:t2,fontWeight:700}}>{w[s]}</span></div>)}
              </div>:null;})}
            </div>
            <button onClick={()=>setCW([])} style={{...S.btn(rd),marginTop:6,fontSize:8}}>Clear</button>
          </div>}
          {WEAPONS.filter(w=>wf==="All"||w.tier===wf).map((w,i)=>{
            const open=exp[`w${i}`];
            return <div key={i} className="arc-card" style={S.card()}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}} onClick={()=>setExp(e=>({...e,[`w${i}`]:!open}))}>
                <div><div style={{fontSize:11,fontWeight:600,color:t2}}>{w.name} <span style={S.badge(tc(w.tier))}>{w.tier}</span></div><div style={{fontSize:9,color:t0}}>{w.type} | {w.ammo} | {w.rarity}</div></div>
                <div style={{display:"flex",gap:6,fontSize:9}}>
                  <span style={{color:rd}}>PvP:{w.pvp}</span><span style={{color:cy}}>PvE:{w.pve}</span>
                </div>
              </div>
              {open&&<div style={{marginTop:6,paddingTop:6,borderTop:`1px solid ${bd}`,fontSize:9}}>
                <div style={{color:t1,marginBottom:4}}>{w.notes}</div>
                <div style={{display:"flex",gap:6,marginBottom:3}}><span style={{color:t0}}>AAP: {w.aap}</span><span style={{color:t0}}>Weight: {w.wt}kg</span><span style={{color:t0}}>Craft: {w.craft}</span></div>
                <div style={{display:"flex",gap:3}}>
                  <button onClick={()=>upd({loadout:{...data.loadout,primary:w.name}})} style={{...S.btn(),fontSize:8}}>Set Primary</button>
                  <button onClick={()=>upd({loadout:{...data.loadout,secondary:w.name}})} style={{...S.btn(),fontSize:8}}>Set Secondary</button>
                  <button onClick={()=>setCW(c=>c.length<2&&!c.includes(w.name)?[...c,w.name]:c)} style={{...S.btn(cy),fontSize:8}}>Compare{cw.length===1?" (1/2)":""}</button>
                </div>
              </div>}
            </div>;
          })}
        </>}

        {/* ═══ SKILLS ═══ */}
        {tab==="skills"&&<>
          <div style={S.hdr()}>SKILL TREE</div>
          <div className="arc-card" style={S.card()}>
            {[{k:"mobility",l:"Mobility",c:ac,max:30},{k:"survival",l:"Survival",c:pp,max:25},{k:"conditioning",l:"Conditioning",c:gd,max:21}].map(b=>(
              <div key={b.k} style={{marginBottom:6}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
                  <span style={{fontSize:9,color:b.c,fontWeight:700}}>{b.l}</span>
                  <div style={{display:"flex",alignItems:"center",gap:4}}>
                    <button onClick={()=>{const v=Math.max(0,(data.skills?.[b.k]||0)-1);upd({skills:{...data.skills,[b.k]:v}});}} style={{...S.qb,width:18,height:18,fontSize:11}}>−</button>
                    <span style={{fontSize:11,fontWeight:700,color:t2,minWidth:20,textAlign:"center"}}>{data.skills?.[b.k]||0}</span>
                    <button onClick={()=>{const v=Math.min(b.max,(data.skills?.[b.k]||0)+1);upd({skills:{...data.skills,[b.k]:v}});}} style={{...S.qb,width:18,height:18,fontSize:11}}>+</button>
                  </div>
                </div>
                <div style={{height:3,background:bd,borderRadius:2,overflow:"hidden"}}><div style={{height:3,background:b.c,borderRadius:2,width:`${((data.skills?.[b.k]||0)/b.max)*100}%`,transition:"width .3s"}}/></div>
              </div>
            ))}
            <div style={{fontSize:8,color:t0,textAlign:"center"}}>Total: {(data.skills?.mobility||0)+(data.skills?.survival||0)+(data.skills?.conditioning||0)} / 76 available</div>
          </div>

          <div className="arc-card" style={{...S.card(),marginBottom:6}}>
            <div style={{fontSize:9,color:ac,fontWeight:700}}>UNIVERSAL FIRST 12 POINTS</div>
            <div style={{fontSize:10,color:t2,marginTop:2}}>Marathon Runner 5/5 → Youthful Lungs 5/5 → Nimble Climber → Effortless Roll</div>
            <div style={{fontSize:8,color:t0,marginTop:1}}>Mobility first. Always. Stamina is survival.</div>
          </div>

          {SKILL_BUILDS.map((b,i)=>{
            const open=exp[`sb${i}`];
            return <div key={i} className="arc-card" style={S.card(open?acd:undefined)} onClick={()=>setExp(e=>({...e,[`sb${i}`]:!open}))}>
              <div style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}>
                <div style={{flex:1}}><div style={{fontSize:11,fontWeight:700,color:t2}}>{b.name} {b.rec&&<span style={S.badge(ac)}>REC</span>}</div><div style={{fontSize:9,color:t0}}>{b.desc}</div></div>
                <span style={S.badge({Mobility:ac,Survival:pp,Conditioning:gd,Mixed:cy}[b.branch]||t0)}>{b.branch}</span>
              </div>
              {open&&<div style={{marginTop:6,paddingTop:6,borderTop:`1px solid ${bd}`}}>
                <div style={{display:"flex",flexWrap:"wrap",gap:2}}>{b.skills.map(s=><span key={s} style={{fontSize:8,padding:"1px 6px",borderRadius:100,background:`${ac}0a`,border:`1px solid ${ac}20`,color:ac}}>{s}</span>)}</div>
              </div>}
            </div>;
          })}

          <div className="arc-card" style={{...S.card(`${rd}12`),marginTop:2}}>
            <div style={{fontSize:9,color:rd,fontWeight:700}}>SKIP THESE</div>
            <div style={{fontSize:9,color:t0,marginTop:2}}>{SKIP_SKILLS.join(" • ")}</div>
          </div>
        </>}

        {/* ═══ QUESTS ═══ */}
        {tab==="quests"&&<>
          <div style={S.hdr()}>QUESTS ({data.quests.length}/{QUESTS.length})</div>
          <div style={{height:3,background:bd,borderRadius:2,marginBottom:6,overflow:"hidden"}}><div style={{height:3,background:ac,borderRadius:2,width:`${(data.quests.length/QUESTS.length)*100}%`,transition:"width .3s"}}/></div>
          {["early","mid","late"].map(phase=><div key={phase}>
            <div style={{fontSize:8,color:t0,letterSpacing:2,textTransform:"uppercase",fontWeight:700,margin:"8px 0 3px"}}>{phase}</div>
            {QUESTS.filter(q=>q.phase===phase).map(q=>{
              const done=data.quests.includes(q.id);
              return <div key={q.id} className="arc-card" style={{...S.card(done?`${ac}10`:undefined),display:"flex",alignItems:"flex-start",gap:6}}>
                <button onClick={()=>toggleQuest(q.id)} style={{width:18,height:18,borderRadius:3,border:`2px solid ${done?ac:bd}`,background:done?ac:"transparent",cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:done?bg:"transparent",fontWeight:700,marginTop:1}}>{done?"\u2713":""}</button>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,fontWeight:600,color:done?t0:t2,textDecoration:done?"line-through":"none"}}>{q.name}</div>
                  <div style={{fontSize:9,color:t0}}>{q.trader} | {q.map}</div>
                  <div style={{fontSize:9,color:t1,marginTop:1}}>{q.obj}</div>
                  <div style={{fontSize:9,color:gd}}>{q.reward}</div>
                </div>
              </div>;
            })}
          </div>)}
        </>}

        {/* ═══ INTEL (NEW) ═══ */}
        {tab==="intel"&&<>
          {/* Badges */}
          <div className="arc-card" style={{...S.card(`${gd}12`),marginTop:4}}>
            <div style={S.hdr(gd)}>BADGES ({unlockedBadges.length}/{BADGES.length})</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:4}}>
              {BADGES.map(b=>{
                const unlocked=unlockedBadges.includes(b.id);
                return <div key={b.id} style={{textAlign:"center",padding:6,borderRadius:6,background:unlocked?`${gd}08`:"#080d14",border:`1px solid ${unlocked?`${gd}20`:bd}`,opacity:unlocked?1:.35}}>
                  <div style={{fontSize:20,filter:unlocked?"none":"grayscale(1) brightness(.3)"}}>{b.icon}</div>
                  <div style={{fontSize:7,fontWeight:700,color:unlocked?t2:t0,marginTop:2}}>{b.name}</div>
                  <div style={{fontSize:6,color:t0}}>{b.desc}</div>
                </div>;
              })}
            </div>
          </div>

          {/* Raid Journal */}
          <div className="arc-card" style={{...S.card(),marginTop:4}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={S.hdr(pp)}>RAID JOURNAL</div>
              <div style={{display:"flex",gap:2}}>
                {["all","extracted","died"].map(f=><button key={f} onClick={()=>setLogFilter(f)} style={{...S.btn(logFilter===f?ac:t0),fontSize:7,padding:"2px 6px"}}>{f.toUpperCase()}</button>)}
              </div>
            </div>
            {log.filter(r=>logFilter==="all"||(logFilter==="extracted"?r.extracted:!r.extracted)).slice(0,15).map((r,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:`1px solid ${bd}08`,fontSize:9}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{fontSize:11}}>{r.extracted?"\u2705":"\u2620\uFE0F"}</span>
                  <div><div style={{color:t2,fontWeight:600}}>{r.plan||"Unknown"}</div><div style={{color:t0,fontSize:8}}>{r.date}</div></div>
                </div>
                <div style={{textAlign:"right"}}><div style={{color:r.extracted?ac:rd,fontWeight:700}}>{fmt(r.time)}</div></div>
              </div>
            ))}
            {log.length===0&&<div style={{fontSize:9,color:t0,textAlign:"center",padding:10}}>No raids logged yet. Start a raid to begin tracking.</div>}
          </div>

          {/* Death Analysis */}
          {deathsByMap.length>0&&<div className="arc-card" style={{...S.card(`${rd}10`),marginTop:4}}>
            <div style={S.hdr(rd)}>DEATH ANALYSIS</div>
            {deathsByMap.map(([map,count])=>{
              const pct = Math.round(count/log.filter(r=>!r.extracted).length*100);
              return <div key={map} style={{marginBottom:4}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:9}}><span style={{color:t2}}>{map}</span><span style={{color:rd,fontWeight:700}}>{count} deaths ({pct}%)</span></div>
                <div style={{height:3,background:bd,borderRadius:2,overflow:"hidden",marginTop:1}}><div style={{height:3,background:rd,borderRadius:2,width:`${pct}%`}}/></div>
              </div>;
            })}
          </div>}

          {/* API Database Lookup */}
          <div className="arc-card" style={{...S.card(`${cy}10`),marginTop:4}}>
            <div style={S.hdr(cy)}>LIVE DATABASE LOOKUP</div>
            <div style={{fontSize:8,color:t0,marginBottom:4}}>Fetches real game data from community APIs. Works best when deployed externally.</div>
            <div style={{display:"flex",gap:4,marginBottom:6}}>
              <input value={apiSearch} onChange={e=>setApiSearch(e.target.value)} onKeyDown={e=>{if(e.key==="Enter") fetchAPI(apiSearch);}} placeholder="Search items (e.g. Anvil, Battery)..." style={S.inp}/>
              <button onClick={()=>fetchAPI(apiSearch)} disabled={apiLoading} style={{...S.btn(cy),flexShrink:0,opacity:apiLoading?.5:1}}>{apiLoading?"...":"SEARCH"}</button>
            </div>
            {apiError&&<div style={{fontSize:9,color:gd,padding:8,background:`${gd}08`,borderRadius:4,marginBottom:4}}>{apiError}</div>}
            {apiItems&&apiItems.length>0&&<div>
              {apiItems.slice(0,10).map((item,i)=>(
                <div key={i} style={{padding:"4px 0",borderBottom:`1px solid ${bd}08`,fontSize:9}}>
                  <div style={{fontWeight:700,color:t2}}>{item.name?.en||item.name||"Unknown"}</div>
                  {item.description?.en&&<div style={{color:t0,fontSize:8}}>{item.description.en.slice(0,80)}...</div>}
                  {item.category&&<span style={S.badge(cy)}>{item.category}</span>}
                </div>
              ))}
              <div style={{fontSize:8,color:t0,marginTop:3}}>Data provided by ardb.app / arcdata.mahcks.com</div>
            </div>}
            {apiItems&&apiItems.length===0&&<div style={{fontSize:9,color:t0}}>No results found.</div>}
          </div>

          {/* External Resources */}
          <div className="arc-card" style={{...S.card(),marginTop:4}}>
            <div style={S.hdr()}>COMMUNITY RESOURCES</div>
            {[
              {name:"ARCTracker.io",desc:"Full account sync, overlay, stash viewer, interactive maps",url:"https://arctracker.io",c:ac},
              {name:"ardb.app",desc:"Community item/quest database with public API",url:"https://ardb.app",c:cy},
              {name:"OP.GG ARC Raiders",desc:"Guides, items, maps, loadouts",url:"https://op.gg/arc-raiders",c:gd},
              {name:"MetaForge",desc:"Database, interactive maps, API docs",url:"https://metaforge.app/arc-raiders",c:pp},
              {name:"ARC Raiders LFG Discord",desc:"70K+ raiders. Find teammates.",url:"https://discord.gg/QNeSxEXrzR",c:"#5865F2"},
            ].map((r,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${bd}08`}}>
                <div><div style={{fontSize:10,fontWeight:700,color:r.c}}>{r.name}</div><div style={{fontSize:8,color:t0}}>{r.desc}</div></div>
                <button onClick={()=>window.open(r.url,"_blank")} style={{...S.btn(r.c),fontSize:8}}>OPEN</button>
              </div>
            ))}
          </div>

          {/* Deployment Info */}
          <div className="arc-card" style={{...S.card(`${"#f97316"}10`),marginTop:4}}>
            <div style={S.hdr("#f97316")}>DEPLOY THIS APP</div>
            <div style={{fontSize:9,color:t1,lineHeight:1.6}}>
              Want others to use this? Deploy as a standalone web app:
              <div style={{marginTop:4,fontSize:8,color:t0}}>
                1. Export this .jsx to a Vite + React project{"\n"}
                2. Add a PWA manifest for mobile "Add to Home Screen"{"\n"}
                3. Deploy free on Vercel, Netlify, or Cloudflare Pages{"\n"}
                4. API calls to ardb.app will work live{"\n"}
                5. Share the URL — it's a full mobile web app
              </div>
              <div style={{fontSize:8,color:"#f97316",marginTop:3}}>See the included Deployment Guide for step-by-step instructions.</div>
            </div>
          </div>
        </>}

        {/* ═══ AI ═══ */}
        {tab==="ai"&&<>
          <div className="arc-card" style={{...S.card(acd),marginTop:4}}>
            <div style={S.hdr()}>AI TACTICAL ADVISOR</div>
            <div style={{fontSize:9,color:t0,marginBottom:6}}>Knows your keys, workshop, loadout, quests, raids, streaks, deaths, badges.</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:2,marginBottom:6}}>
              {["What should I do next?","Plan next 3 sessions","Best loadout for me?","Make coins fast?","Farm Sentinel Cores?","Best quest rewards?","Night vs Day raid?","Optimize my kit","Am I ready for Stella Montis?","How to improve my extract rate?","Analyze my death patterns","What badges am I closest to?"].map(q=>(
                <button key={q} onClick={()=>askAI(q)} style={{background:"#080d14",border:`1px solid ${bd}`,borderRadius:100,padding:"3px 8px",fontSize:8,color:t1,cursor:"pointer",fontFamily:"inherit"}}>{q}</button>
              ))}
            </div>
            <div style={{display:"flex",gap:4}}>
              <input value={aiQ} onChange={e=>setAiQ(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&aiQ.trim()){askAI(aiQ.trim());setAiQ("");}}} placeholder="Ask anything..." style={S.inp}/>
              <button onClick={()=>{if(aiQ.trim()){askAI(aiQ.trim());setAiQ("");}}} disabled={aiLoad} style={{background:ac,border:"none",borderRadius:5,padding:"7px 12px",fontSize:10,color:bg,fontWeight:800,cursor:"pointer",fontFamily:"inherit",opacity:aiLoad?.5:1,flexShrink:0}}>{aiLoad?"...":"GO"}</button>
            </div>
            {(aiLoad||aiResp)&&<div style={{background:"#070c12",border:`1px solid ${acd}`,borderRadius:6,padding:10,marginTop:6,fontSize:11,color:ac,lineHeight:1.6,whiteSpace:"pre-wrap"}}>
              <div style={{fontSize:6,letterSpacing:2,color:t0,marginBottom:3}}>{aiLoad?"ANALYZING...":"TACTICAL PLAN"}</div>
              {aiLoad?<span style={{color:t0,animation:"pulse 1s infinite"}}>Processing...</span>:aiResp}
            </div>}
          </div>

          {/* Notes */}
          <div className="arc-card" style={{...S.card(),marginTop:4}}>
            <div style={S.hdr(gd)}>NOTES</div>
            <textarea value={data.notes||""} onChange={e=>upd({notes:e.target.value})} placeholder="Goals, farming notes..." style={{...S.inp,minHeight:50,resize:"vertical"}}/>
          </div>

          {/* Data Management */}
          <div className="arc-card" style={{...S.card(),marginTop:4}}>
            <div style={S.hdr(t0)}>DATA</div>
            <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
              <button onClick={exportData} style={S.btn(cy)}>{showExport?"Copied!":"Export Data"}</button>
              <button onClick={importData} style={S.btn(pp)}>Import Data</button>
              <button onClick={resetAll} style={S.btn(rd)}>Expedition Reset</button>
            </div>
            <div style={{fontSize:8,color:t0,marginTop:3}}>Export copies JSON to clipboard. Import restores from clipboard. Reset wipes all.</div>
          </div>

          {/* Footer Attribution */}
          <div style={{textAlign:"center",marginTop:8,padding:8,fontSize:7,color:t0}}>
            ARC Raiders Companion V5 • Game data via ardb.app • Not affiliated with Embark Studios
          </div>
        </>}
      </div>
    </div>
  );
}