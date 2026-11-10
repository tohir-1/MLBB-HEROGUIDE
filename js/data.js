// ===== MLBB HeroGuide — ma'lumotlar bazasi =====
// DIQQAT: stats, counter, build, emblem va tips ma'lumotlari "sample" (namunaviy).
// Rasmiy skill tavsiflari kiritilmagan (skills: []) — uydirma yozilmagan.
// Yangi hero qo'shish: RAW ga bitta qator qo'shing.
// Format: id|Name|Role|Lane|Difficulty|damage,durability,mobility,cc|strongAgainst ids|weakAgainst ids
const RAW = `
gusion|Gusion|Assassin|Jungle|Hard|9,4,9,5|eudora gord miya|khufra tigreal franco
layla|Layla|Marksman|Gold Lane|Easy|9,2,2,1|tigreal johnson akai|fanny hayabusa selena
tigreal|Tigreal|Tank|Roam|Easy|3,9,4,9|gusion fanny hayabusa|yuzhong esmeralda lunox
alucard|Alucard|Fighter|EXP Lane|Easy|7,6,6,3|layla miya eudora|khufra tigreal yuzhong
miya|Miya|Marksman|Gold Lane|Easy|8,2,6,2|johnson akai balmond|fanny gusion selena
eudora|Eudora|Mage|Mid Lane|Easy|9,2,3,6|layla miya harith|gusion lancelot natalia
fanny|Fanny|Assassin|Jungle|Hard|9,3,10,3|layla miya clint|tigreal khufra estes
franco|Franco|Tank|Roam|Medium|4,9,3,8|gusion hayabusa lancelot|esmeralda yuzhong gord
lancelot|Lancelot|Assassin|Jungle|Medium|9,4,9,3|eudora gord kagura|tigreal khufra franco
chou|Chou|Fighter|EXP Lane|Hard|7,6,9,6|layla miya harith|tigreal khufra esmeralda
gord|Gord|Mage|Mid Lane|Easy|8,2,3,7|chou balmond johnson|gusion lancelot hayabusa
kagura|Kagura|Mage|Mid Lane|Hard|9,2,6,4|akai johnson franco|natalia hayabusa selena
hayabusa|Hayabusa|Assassin|Jungle|Hard|9,3,9,3|layla eudora gord|tigreal khufra franco
balmond|Balmond|Fighter|Jungle|Easy|7,8,6,4|layla miya eudora|tigreal khufra yuzhong
nana|Nana|Mage|Roam|Medium|6,3,6,7|hayabusa fanny lancelot|franco khufra yuzhong
estes|Estes|Support|Roam|Easy|2,5,4,6|alucard balmond yuzhong|franco khufra natalia
angela|Angela|Support|Roam|Easy|3,4,6,5|layla miya moskov|franco natalia khufra
johnson|Johnson|Tank|Roam|Medium|3,8,7,7|layla miya hayabusa|yuzhong esmeralda kagura
akai|Akai|Tank|Roam|Medium|4,9,5,8|layla gusion hayabusa|yuzhong esmeralda estes
zilong|Zilong|Fighter|EXP Lane|Easy|8,5,8,3|layla eudora harith|tigreal khufra franco
bruno|Bruno|Marksman|Gold Lane|Easy|9,2,4,2|tigreal johnson akai|fanny hayabusa selena
clint|Clint|Marksman|Gold Lane|Medium|9,2,5,2|akai johnson tigreal|fanny lancelot gusion
moskov|Moskov|Marksman|Gold Lane|Medium|9,2,3,3|tigreal johnson akai|selena hayabusa fanny
lunox|Lunox|Mage|Mid Lane|Medium|8,3,5,5|tigreal esmeralda yuzhong|gusion hayabusa natalia
harith|Harith|Mage|Mid Lane|Hard|8,3,8,4|johnson akai alucard|hayabusa gusion lancelot
selena|Selena|Assassin|Roam|Hard|8,3,8,7|layla miya harith|tigreal khufra franco
natalia|Natalia|Assassin|Jungle|Medium|8,3,8,4|kagura eudora gord|tigreal khufra franco
khufra|Khufra|Tank|Roam|Medium|3,9,6,9|gusion fanny lancelot|yuzhong esmeralda estes
esmeralda|Esmeralda|Fighter|EXP Lane|Medium|6,8,6,5|tigreal johnson khufra|lancelot hayabusa fanny
yuzhong|Yu Zhong|Fighter|EXP Lane|Medium|8,6,7,5|tigreal johnson franco|khufra gusion lancelot
`;

export const ROLES = ['Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'];
export const LANES = ['Jungle', 'Gold Lane', 'Mid Lane', 'EXP Lane', 'Roam'];
export const DIFFS = ['Easy', 'Medium', 'Hard'];
export const BUILD_TYPES = ['Burst Damage', 'Sustain', 'Tank', 'Magic Damage', 'Physical Damage', 'Hybrid'];
export const STAT_LABELS = { damage: 'Damage', durability: 'Durability', mobility: 'Mobility', crowdControl: 'Crowd Control' };

export const SPELLS = {
  Flicker: 'Short-range teleport in a chosen direction.',
  Retribution: 'Jungle spell: deals damage to monsters and helps secure objectives.',
  Sprint: 'Temporarily boosts movement speed.',
  Execute: 'Deals true damage to a low-health enemy hero.',
  Purify: 'Removes control effects and grants brief immunity.',
  Aegis: 'Grants a temporary shield.',
  Petrify: 'Stuns nearby enemies for a short time.',
  Revitalize: 'Restores health over a short time.'
};

// Role bo'yicha SAMPLE build shablonlari
const T = {
  Assassin: { type: 'Burst Damage', items: ['Warrior Boots', 'Hunter Strike', 'Blade of Despair', 'Malefic Roar', 'Endless Battle', 'Immortality'], emblem: 'Assassin Emblem', talents: ['Agility', 'Seasoned Hunter', 'Killing Spree'] },
  Fighter: { type: 'Hybrid', items: ['Warrior Boots', 'Bloodlust Axe', 'Blade of Despair', 'War Axe', "Queen's Wings", 'Immortality'], emblem: 'Fighter Emblem', talents: ['Bravery', 'Firmness', 'Festival of Blood'] },
  Tank: { type: 'Tank', items: ['Tough Boots', 'Dominance Ice', "Athena's Shield", 'Antique Cuirass', 'Blade Armor', 'Immortality'], emblem: 'Tank Emblem', talents: ['Tenacity', 'Brave Smite', 'Concussive Blast'] },
  Mage: { type: 'Magic Damage', items: ['Arcane Boots', 'Lightning Truncheon', 'Holy Crystal', 'Divine Glaive', 'Blood Wings', 'Glowing Wand'], emblem: 'Mage Emblem', talents: ['Agility', 'Mystery Shop', 'Impure Rage'] },
  Marksman: { type: 'Physical Damage', items: ['Swift Boots', 'Scarlet Phantom', "Berserker's Fury", 'Blade of Despair', 'Endless Battle', 'Wind of Nature'], emblem: 'Marksman Emblem', talents: ['Agility', 'Weapons Master', 'Quantum Charge'] },
  Support: { type: 'Sustain', items: ['Tough Boots', 'Dominance Ice', 'Oracle', 'Fleeting Time', "Athena's Shield", 'Immortality'], emblem: 'Support Emblem', talents: ['Fortitude', 'Inspire', 'Concussive Blast'] }
};
const TIPS = {
  Assassin: ['Farm the jungle and look for ambush chances.', 'Join rotations and pick off isolated targets.', 'Pick off carries; avoid engaging first.', 'Wait for crowd control to be used, then dive the backline.', 'Stay on the edge of the fight and flank.'],
  Fighter: ['Win your lane with safe trades.', 'Push the lane and join objective fights.', 'Stay with the team and frontline when needed.', 'Engage after tanks, target exposed enemies.', 'Stay near allies, avoid being isolated.'],
  Tank: ['Roam with your team and set up vision.', 'Create picks and protect objectives.', 'Absorb damage and start fights on good terms.', 'Use crowd control to lock priority targets.', 'Stay in front of your damage dealers.'],
  Mage: ['Farm safely and keep mana in mind.', 'Rotate to fights with your burst ready.', 'Stay behind frontline and burst key targets.', 'Use skills from range, keep your escape ready.', 'Keep distance from assassins.'],
  Marksman: ['Farm efficiently and avoid early risks.', 'Take towers and objectives with your team.', 'Your damage carries the late game; stay alive.', 'Attack the closest safe target.', 'Stay behind your frontline at all times.'],
  Support: ['Protect your carry and place vision.', 'Rotate early to objectives.', 'Keep key allies alive and enable engages.', 'Use utility at the best moment, not the first one.', 'Stay close to those you protect.']
};
const COMBO_NOTE = 'Combo details are not included in the sample data — add verified combos to data.js.';

export const heroes = RAW.trim().split('\n').map((line, i) => {
  const [id, name, role, lane, difficulty, st, s, w] = line.split('|');
  const v = st.split(',').map(Number), t = T[role], tp = TIPS[role];
  const spell = lane === 'Jungle' ? 'Retribution' : 'Flicker';
  const h = {
    id, name, role, lane, difficulty, order: i,
    image: `assets/images/heroes/${id}.webp`,
    description: `${name} is a ${role} usually played in the ${lane}. This is a sample profile; add the official description in data.js.`,
    stats: { damage: v[0], durability: v[1], mobility: v[2], crowdControl: v[3] },
    skills: [], // Rasmiy skillarni shu yerga kiriting: {type,name,description,cooldown,icon}
    emblem: { type: t.emblem, talents: t.talents, explanation: 'Sample recommendation based on the hero role.' },
    spells: [spell, role === 'Assassin' || role === 'Fighter' ? 'Sprint' : 'Purify'],
    strongAgainst: s.split(' '), weakAgainst: w.split(' '),
    tips: { early: tp[0], mid: tp[1], late: tp[2], combos: COMBO_NOTE, teamfight: tp[3], positioning: tp[4] },
    source: 'sample', lastUpdated: '2026-11-09'
  };
  h.builds = [{ id: 'b-' + id, heroId: id, name: `${name} — ${t.type}`, type: t.type, items: t.items, emblem: t.emblem, talents: t.talents, spell, desc: `Sample ${t.type.toLowerCase()} build for ${name}. Not verified against the current game version.`, sample: true }];
  return h;
});

export const builds = heroes.flatMap(h => h.builds);
export const ITEMS = [...new Set(Object.values(T).flatMap(t => t.items))].sort();
export const EMBLEMS = Object.values(T).map(t => t.emblem);
export const TALENTS = [...new Set(Object.values(T).flatMap(t => t.talents))].sort();
export const byId = (id) => heroes.find(h => h.id === id);

export const guides = [
  ['beginner-basics', 'Beginner Guide: Understanding the Basics', 'Beginner Guide', 4, 'Learn the map, the three lanes, jungle monsters and objectives. Focus on last-hitting minions, watching the minimap and staying with your team.'],
  ['picking-first-hero', 'How to Pick Your First Hero', 'Beginner Guide', 3, 'Start with heroes that have simple skills and forgiving playstyles. Pick one role and learn it well before trying others.'],
  ['advanced-macro', 'Advanced Guide: Macro Play and Rotations', 'Advanced Guide', 6, 'Good macro means being at the right place at the right time. Track enemy positions, push waves before rotating and trade objectives smartly.'],
  ['jungle-routes', 'Jungle Guide: Routes and Timing', 'Jungle Guide', 5, 'Plan your clear route, track buff timers and invade only when you know where the enemy jungler is. Prioritise Turtle and Lord timings.'],
  ['gold-lane', 'Gold Lane Guide: Farming and Positioning', 'Gold Lane Guide', 5, 'Marksmen scale with items. Farm safely, avoid unnecessary fights early and always position behind your frontline in team fights.'],
  ['mid-lane', 'Mid Lane Guide: Wave Control and Roaming', 'Mid Lane Guide', 5, 'Clear waves quickly, then rotate to help side lanes and the jungle. Watch your mana and keep escape options ready.'],
  ['roaming', 'Roaming Guide: Vision and Protection', 'Roaming Guide', 4, 'Roamers set up vision, protect the carry and start fights. Communicate with your jungler and move with the team to objectives.'],
  ['teamfights', 'Team Fight Guide: Engage, Focus, Finish', 'Team Fight Guide', 5, 'Decide your target before the fight. Tanks engage, damage dealers focus the priority target, and supports keep key allies alive.'],
  ['rank-push', 'Rank Push Guide: Consistency Wins', 'Rank Push Guide', 6, 'Play a small hero pool, draft with team balance in mind, avoid tilt and review your mistakes after losses.'],
  ['draft-counter', 'Draft Guide: Thinking About Counters', 'Advanced Guide', 4, 'Look at what the enemy team lacks and what yours needs. Balanced drafts with control, damage and durability are usually safer.']
].map(([id, title, category, time, body]) => ({ id, title, category, time, body, source: 'sample', lastUpdated: '2026-11-09' }));

export const GUIDE_CATS = ['Beginner Guide', 'Advanced Guide', 'Jungle Guide', 'Gold Lane Guide', 'Mid Lane Guide', 'Roaming Guide', 'Team Fight Guide', 'Rank Push Guide'];
