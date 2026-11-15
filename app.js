'use strict';

const KEY = 'tg-planner-v1';
const COURSES = ['Starters', 'Main', 'Sides', 'Desserts', 'Drinks'];
const $ = (s, r = document) => r.querySelector(s);
const uid = () => Math.random().toString(36).slice(2, 9);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const parseDay = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const today = () => iso(new Date());
const dayDiff = (a, b) => Math.round((parseDay(a) - parseDay(b)) / 864e5);
const MIC = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>';

// ---------- Starter menus ----------

function thanksgivingFor(year) {
  const first = new Date(year, 10, 1);
  return new Date(year, 10, 1 + ((4 - first.getDay() + 7) % 7) + 21); // 4th Thursday of November
}
function nextThanksgiving() {
  const now = new Date();
  const t = thanksgivingFor(now.getFullYear());
  return iso(iso(t) < iso(now) ? thanksgivingFor(now.getFullYear() + 1) : t);
}
const mkIng = text => ({ id: uid(), text, got: false });

// The schedule is the same shape for every starter (4 PM dinner); only the dish-specific steps differ.
const starterTimeline = t => [
  [-5, '', 'Finalize the menu and guest count'],
  [-5, '', 'Shop for non-perishables and drinks'],
  [-4, '', 'Move frozen turkey to the fridge to thaw (allow 1 day per 4 lb)'],
  [-3, '', t.ahead],
  [-3, '', 'Clear fridge space; check serving dishes and roasting pan'],
  [-2, '', 'Shop for fresh produce, dairy and bread'],
  [-2, '', t.tuesday],
  [-1, '09:00', 'Salt the turkey (dry brine) and return to fridge uncovered'],
  [-1, '10:00', t.bake],
  [-1, '14:00', t.prep],
  [-1, '15:00', t.assemble],
  [-1, '19:00', 'Set the table; chill drinks'],
  [0, '09:30', 'Take turkey out of the fridge; preheat oven to 325°F'],
  [0, '10:30', 'Turkey in the oven (about 3½–4 hours for 14–16 lb)'],
  [0, '13:15', t.stove],
  [0, '14:15', 'Turkey out when the thigh reads 165°F; tent with foil and rest'],
  [0, '14:20', t.oven],
  [0, '14:45', t.finish],
  [0, '15:00', 'Make gravy from the pan drippings'],
  [0, '15:20', t.last],
  [0, '15:30', 'Carve the turkey'],
  [0, '16:00', 'Dinner is served'],
];

const TURKEY = ['14–16 lb turkey', '1 stick unsalted butter', '1 bunch fresh thyme', '1 bunch fresh sage', '1 lemon', '1 head garlic', '1 yellow onion', 'Kosher salt & black pepper'];

const STARTERS = [
  {
    name: 'The Traditional',
    tagline: 'The table everyone pictures',
    dishes: [
      ['Main', 'Roast Turkey', TURKEY],
      ['Main', 'Turkey Gravy', ['4 tbsp unsalted butter', '1/4 cup all-purpose flour', '4 cups turkey or chicken stock']],
      ['Sides', 'Classic Stuffing', ['1 lb loaf sturdy white bread', '1 stick unsalted butter', '2 yellow onions', '4 stalks celery', '2 1/2 cups chicken stock', '2 eggs', 'Fresh sage, thyme & parsley']],
      ['Sides', 'Mashed Potatoes', ['5 lb Yukon Gold potatoes', '1 stick unsalted butter', '1 cup whole milk', '1/2 cup sour cream']],
      ['Sides', 'Green Bean Casserole', ['2 lb fresh green beans', '2 cans (10.5 oz) cream of mushroom soup', '3/4 cup whole milk', '6 oz crispy fried onions']],
      ['Sides', 'Cranberry Sauce', ['12 oz fresh cranberries', '1 cup sugar', '1 orange']],
      ['Sides', 'Dinner Rolls', ['2 dozen dinner rolls', 'Salted butter for the table']],
      ['Desserts', 'Pumpkin Pie', ['1 pie crust', '1 can (15 oz) pumpkin purée', '1 can (14 oz) sweetened condensed milk', '2 eggs', '2 tsp pumpkin pie spice', '1 pint heavy cream (for whipping)']],
      ['Desserts', 'Pecan Pie', ['1 pie crust', '2 cups pecan halves', '1 cup light corn syrup', '1 cup brown sugar', '3 eggs', '4 tbsp unsalted butter', '1 tsp vanilla extract']],
    ],
    timeline: {
      ahead: 'Make cranberry sauce and refrigerate',
      tuesday: 'Cube the stuffing bread and leave out to dry',
      bake: 'Bake pumpkin and pecan pies',
      prep: 'Chop onions, celery and herbs; trim green beans',
      assemble: 'Assemble stuffing and green bean casserole; refrigerate',
      stove: 'Peel and boil potatoes',
      oven: 'Oven to 375°F; bake stuffing and green bean casserole',
      finish: 'Mash potatoes; keep warm',
      last: 'Warm the rolls; whip cream for pie',
    },
  },
  {
    name: 'Southern Comfort',
    tagline: 'Cornbread, greens and plenty of butter',
    dishes: [
      ['Main', 'Roast Turkey', TURKEY],
      ['Main', 'Giblet Gravy', ['Turkey giblets and neck (from the bird)', '4 tbsp unsalted butter', '1/4 cup all-purpose flour', '4 cups chicken stock', '2 eggs (hard-boiled)']],
      ['Sides', 'Cornbread Dressing', ['2 boxes (8.5 oz) cornbread mix', '4 eggs', '2/3 cup whole milk', '1 stick unsalted butter', '2 yellow onions', '4 stalks celery', '3 cups chicken stock', '2 tsp poultry seasoning']],
      ['Sides', 'Baked Mac and Cheese', ['1 lb elbow macaroni', '1 lb sharp cheddar', '8 oz Monterey Jack', '4 tbsp unsalted butter', '1/4 cup all-purpose flour', '3 cups whole milk', '1 cup heavy cream']],
      ['Sides', 'Collard Greens', ['3 lb collard greens', '1 smoked ham hock', '1 yellow onion', '4 cloves garlic', '4 cups chicken stock', '2 tbsp apple cider vinegar', 'Red pepper flakes']],
      ['Sides', 'Sweet Potato Casserole', ['4 lb sweet potatoes', '1 stick unsalted butter', '1 cup brown sugar', '2 eggs', '1/2 cup whole milk', '1 cup chopped pecans', '1/3 cup all-purpose flour']],
      ['Sides', 'Cranberry Sauce', ['12 oz fresh cranberries', '1 cup sugar', '1 orange']],
      ['Sides', 'Buttermilk Biscuits', ['3 cups self-rising flour', '1 1/2 sticks cold unsalted butter', '1 1/4 cups buttermilk']],
      ['Desserts', 'Pecan Pie', ['1 pie crust', '2 cups pecan halves', '1 cup light corn syrup', '1 cup brown sugar', '3 eggs', '4 tbsp unsalted butter', '1 tsp vanilla extract']],
      ['Desserts', 'Sweet Potato Pie', ['1 pie crust', '1 1/2 lb sweet potatoes', '1 stick unsalted butter', '1 cup sugar', '1/2 cup evaporated milk', '2 eggs', '1 tsp cinnamon', '1/2 tsp nutmeg']],
    ],
    timeline: {
      ahead: 'Make cranberry sauce; bake the cornbread for dressing',
      tuesday: 'Crumble the cornbread and leave out to dry',
      bake: 'Bake pecan and sweet potato pies',
      prep: 'Wash and chop collards; chop onions and celery; shred cheese',
      assemble: 'Assemble dressing, mac and cheese and sweet potato casserole; refrigerate',
      stove: 'Start collard greens simmering with the ham hock',
      oven: 'Oven to 375°F; bake dressing, mac and cheese and sweet potato casserole',
      finish: 'Mix and cut biscuits; simmer giblets for gravy',
      last: 'Bake biscuits at 425°F once the casseroles are out',
    },
  },
  {
    name: 'Harvest Table',
    tagline: 'A fresher, vegetable-forward spread',
    dishes: [
      ['Starters', 'Autumn Salad', ['10 oz mixed greens or baby kale', '2 Honeycrisp apples', '3/4 cup candied pecans', '4 oz goat cheese', '1/2 cup dried cranberries', '1/4 cup olive oil', '2 tbsp apple cider vinegar', '1 tbsp Dijon mustard', '1 tbsp maple syrup']],
      ['Main', 'Herb-Butter Roast Turkey', [...TURKEY, '1 bunch fresh rosemary']],
      ['Main', 'White Wine Gravy', ['4 tbsp unsalted butter', '1/4 cup all-purpose flour', '1 cup dry white wine', '3 cups turkey or chicken stock']],
      ['Sides', 'Sourdough Sausage Stuffing', ['1 lb loaf sourdough bread', '1 lb Italian sausage', '2 leeks', '4 stalks celery', '6 tbsp unsalted butter', '2 1/2 cups chicken stock', '2 eggs', 'Fresh sage & thyme']],
      ['Sides', 'Garlic Mashed Potatoes', ['5 lb Yukon Gold potatoes', '1 head garlic', '1 stick unsalted butter', '1 cup heavy cream']],
      ['Sides', 'Roasted Brussels Sprouts with Bacon', ['2 lb Brussels sprouts', '8 oz thick-cut bacon', '2 tbsp olive oil', '2 tbsp balsamic vinegar']],
      ['Sides', 'Maple-Roasted Carrots', ['2 lb carrots', '3 tbsp maple syrup', '2 tbsp olive oil', 'Fresh thyme']],
      ['Sides', 'Cranberry-Orange Relish', ['12 oz fresh cranberries', '1 orange', '3/4 cup sugar']],
      ['Desserts', 'Apple Pie', ['2 pie crusts', '3 lb Granny Smith apples', '3/4 cup sugar', '2 tbsp all-purpose flour', '1 tsp cinnamon', '2 tbsp unsalted butter', '1 egg (for the wash)']],
      ['Desserts', 'Pumpkin Pie', ['1 pie crust', '1 can (15 oz) pumpkin purée', '1 can (14 oz) sweetened condensed milk', '2 eggs', '2 tsp pumpkin pie spice', '1 pint heavy cream (for whipping)']],
    ],
    timeline: {
      ahead: 'Make cranberry-orange relish and the salad dressing',
      tuesday: 'Cube the sourdough and leave out to dry',
      bake: 'Bake apple and pumpkin pies',
      prep: 'Trim Brussels sprouts; peel carrots; slice leeks and celery',
      assemble: 'Brown the sausage and assemble the stuffing; refrigerate',
      stove: 'Peel and boil potatoes; roast the garlic',
      oven: 'Oven to 400°F; bake stuffing; roast Brussels sprouts and carrots',
      finish: 'Mash potatoes with roasted garlic; keep warm',
      last: 'Toss the salad; whip cream for pie',
    },
  },
];

function applyStarter(s) {
  const day = off => { const d = parseDay(state.tday); d.setDate(d.getDate() + off); return iso(d); };
  state.menu = s.dishes.map(([course, name, ings]) => ({ id: uid(), course, name, ingredients: ings.map(mkIng) }));
  state.tasks = starterTimeline(s.timeline).map(([off, time, text]) => ({ id: uid(), day: day(off), time, text, done: false }));
}

// ---------- State ----------

const defaults = () => ({ tday: nextThanksgiving(), guests: 8, model: 'gpt-5-mini', apiKey: '', view: 'dish', chat: [], menu: [], tasks: [] });

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && Array.isArray(s.menu) && Array.isArray(s.tasks)) return { ...defaults(), ...s };
  } catch { /* fall through to defaults */ }
  return defaults();
}
let state = load();
const save = () => localStorage.setItem(KEY, JSON.stringify(state));

// ---------- Menu ----------

const openDishes = new Set(); // which dishes are expanded; not saved

// Strip a leading quantity/unit so the shopping list sorts by the ingredient itself.
const itemName = t => t.replace(/^[\d\s\/.,½¼¾⅓⅔–-]+/, '')
  .replace(/^(lbs?|oz|cups?|tbsp|tsp|sticks?|cans?|bags?|boxes|box|bunch(es)?|heads?|cloves?|pints?|quarts?|dozen|stalks?|loaf|loaves|large|medium|small)\b\.?\s*/i, '')
  .replace(/^\(.*?\)\s*/, '').replace(/^of\s+/i, '').toLowerCase();

const ingRow = (i, tag) => `<li><label><input type="checkbox" data-ing="${i.id}" ${i.got ? 'checked' : ''}><span>${esc(i.text)}${tag ? `<span class="tag">${esc(tag)}</span>` : ''}</span></label></li>`;

// rows: [{ i: ingredient, tag?: dish name }]. Unowned first, then what's already owned (so a tick can be undone).
function ingLists(rows) {
  const need = rows.filter(r => !r.i.got), have = rows.filter(r => r.i.got);
  return (need.length
    ? `<p class="lbl">Still to buy</p><ul class="ings">${need.map(r => ingRow(r.i, r.tag)).join('')}</ul>`
    : `<p class="lbl done">You have everything ✓</p>`) +
    (have.length ? `<p class="lbl">Owned</p><ul class="ings">${have.map(r => ingRow(r.i, r.tag)).join('')}</ul>` : '');
}

const longDate = () => parseDay(state.tday).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

function zeroState() {
  return `<div class="carte">
    <header class="carte-head"><p class="orn">❦</p><h2>Plan Your Feast</h2><p>Start from a classic menu, then make it yours</p></header>
    ${STARTERS.map((s, n) => `<button class="starter" data-starter="${n}">
      <strong>${esc(s.name)}</strong><em>${esc(s.tagline)}</em>
      <span>${s.dishes.map(d => esc(d[1])).join(' · ')}</span>
    </button>`).join('')}
    <p class="or">or build your own</p>
    <div class="zero-actions">
      <button class="btn primary" data-act="dictate">${MIC} Say what you're making</button>
      <button class="btn" data-act="add-dish">Add a dish by hand</button>
    </div>
  </div>`;
}

function renderMenu() {
  const el = $('#tab-menu');
  if (!state.menu.length) { el.innerHTML = zeroState(); return; }

  const all = state.menu.flatMap(d => d.ingredients);
  const owned = all.filter(i => i.got).length;
  let html = `<div class="bar">
      <div class="seg">
        <button data-view="dish" class="${state.view === 'dish' ? 'on' : ''}">Menu</button>
        <button data-view="all" class="${state.view === 'all' ? 'on' : ''}">Shopping list</button>
      </div>
      <button class="btn" data-act="add-dish">+ Dish</button>
    </div>`;

  if (state.view === 'all') {
    const rows = state.menu.flatMap(d => d.ingredients.map(i => ({ i, tag: d.name })))
      .sort((a, b) => itemName(a.i.text).localeCompare(itemName(b.i.text)));
    html += `<div class="carte"><header class="carte-head"><h2>Shopping List</h2><p>${all.length - owned} to buy · ${owned} owned</p></header>
      <div class="dish-body">${ingLists(rows)}</div></div>`;
  } else {
    html += `<div class="carte"><header class="carte-head"><p class="orn">❦</p><h2>Thanksgiving Dinner</h2><p>${longDate()}</p></header>`;
    const courses = [...new Set([...COURSES, ...state.menu.map(d => d.course)])];
    for (const c of courses) {
      const dishes = state.menu.filter(d => d.course === c);
      if (!dishes.length) continue;
      html += `<section class="course"><h3>${esc(c)}</h3>${dishes.map(d => {
        const n = d.ingredients.length, have = d.ingredients.filter(i => i.got).length;
        const open = openDishes.has(d.id);
        return `<article class="dish ${open ? 'open' : ''}">
          <button class="dish-head" data-toggle="${d.id}" aria-expanded="${open}">
            <span class="dish-name">${esc(d.name)}</span>
            <span class="dish-own ${n && have === n ? 'done' : ''}">${n ? `${have} of ${n} ingredients owned` : 'No ingredients listed'}</span>
          </button>
          ${open ? `<div class="dish-body">${n ? ingLists(d.ingredients.map(i => ({ i }))) : ''}
            <button class="link" data-dish="${d.id}">Edit dish</button></div>` : ''}
        </article>`;
      }).join('')}</section>`;
    }
    html += `<footer class="carte-foot">${owned} of ${all.length} ingredients owned</footer></div>`;
  }
  el.innerHTML = html;
}

// ---------- Timeline ----------

const fmtTime = t => {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
};

function renderTimeline() {
  const now = today();
  const days = [...new Set([...state.tasks.map(t => t.day), state.tday])].sort();
  let html = `<div class="bar"><p class="sub" style="margin:0">${state.tasks.length ? `${state.tasks.filter(t => !t.done).length} tasks to go` : ''}</p>
    <button class="btn" data-act="add-task">+ Task</button></div>`;
  if (!state.tasks.length) {
    html += `<p class="empty">No cooking schedule yet.<br>${state.menu.length
      ? `<button class="btn primary" data-ask="Build a day-by-day cooking timeline for my current menu, with dinner at 4 PM.">Ask ChatGPT to build one</button>`
      : 'Pick a starter menu on the Menu tab and it will fill in here.'}</p>`;
  }
  for (const day of days) {
    const diff = dayDiff(state.tday, day);
    const label = day === now ? 'Today' : diff === 0 ? 'Thanksgiving Day' : diff > 0 ? `${diff} day${diff > 1 ? 's' : ''} before` : '';
    const tasks = state.tasks.filter(t => t.day === day).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    html += `<section class="day ${day === now ? 'today' : day < now ? 'past' : ''}">
      <h2>${parseDay(day).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}${label ? `<span>${label}</span>` : ''}</h2>
      <ul class="tasks">${tasks.map(t => `<li class="task ${t.done ? 'done' : ''}">
        <input type="checkbox" data-task-check="${t.id}" ${t.done ? 'checked' : ''} aria-label="Done">
        <button data-task="${t.id}">${t.time ? `<time>${fmtTime(t.time)}</time>` : ''}${esc(t.text)}</button>
      </li>`).join('') || '<li class="task"><button data-act="add-task" data-day="' + day + '" style="color:var(--muted)">Nothing planned — tap to add</button></li>'}</ul>
    </section>`;
  }
  $('#tab-timeline').innerHTML = html;

  const d = dayDiff(state.tday, now);
  $('#countdown').textContent = d > 1 ? `${d} days to go` : d === 1 ? 'Tomorrow!' : d === 0 ? 'Happy Thanksgiving!' : '';
}

// ---------- Dialogs ----------

const dlg = $('#dlg');
function openDialog(html, onSubmit) {
  dlg.innerHTML = `<form method="dialog">${html}</form>`;
  const form = $('form', dlg);
  form.addEventListener('submit', e => {
    if (e.submitter?.value === 'cancel') return;
    if (onSubmit(new FormData(form), e.submitter?.value) === false) e.preventDefault();
    save(); renderAll();
  });
  dlg.showModal();
}

function dishDialog(dish) {
  openDialog(`
    <h3>${dish ? 'Edit dish' : 'Add a dish'}</h3>
    <label>Dish name<input name="name" required value="${esc(dish?.name)}" autocomplete="off"></label>
    <label>Course<input name="course" list="courses" required value="${esc(dish?.course ?? 'Sides')}" autocomplete="off"></label>
    <datalist id="courses">${COURSES.map(c => `<option value="${c}">`).join('')}</datalist>
    <label>Ingredients<textarea name="ings" rows="8" placeholder="One per line, e.g.&#10;2 cups heavy cream">${esc(dish?.ingredients.map(i => i.text).join('\n'))}</textarea></label>
    <p class="hint">One ingredient per line, quantity first.</p>
    <div class="row">
      ${dish ? '<button class="btn danger" value="delete" formnovalidate>Delete</button>' : ''}
      <button class="btn" value="cancel" formnovalidate>Cancel</button>
      <button class="btn primary" value="save">Save</button>
    </div>`, (fd, action) => {
    if (action === 'delete') { state.menu = state.menu.filter(d => d !== dish); return; }
    setDish({ previous_name: dish?.name, name: fd.get('name'), course: fd.get('course'), ingredients: fd.get('ings').split('\n') });
  });
}

function taskDialog(task, day) {
  openDialog(`
    <h3>${task ? 'Edit task' : 'Add a task'}</h3>
    <label>Task<textarea name="text" rows="3" required>${esc(task?.text)}</textarea></label>
    <div class="two">
      <label>Day<input type="date" name="day" required value="${task?.day ?? day ?? state.tday}"></label>
      <label>Time (optional)<input type="time" name="time" value="${task?.time ?? ''}"></label>
    </div>
    <div class="row">
      ${task ? '<button class="btn danger" value="delete" formnovalidate>Delete</button>' : ''}
      <button class="btn" value="cancel" formnovalidate>Cancel</button>
      <button class="btn primary" value="save">Save</button>
    </div>`, (fd, action) => {
    if (action === 'delete') { state.tasks = state.tasks.filter(t => t !== task); return; }
    setTask({ id: task?.id, text: fd.get('text'), day: fd.get('day'), time: fd.get('time') });
  });
}

function settingsDialog() {
  openDialog(`
    <h3>Settings</h3>
    <label>OpenAI API key<input name="apiKey" type="password" value="${esc(state.apiKey)}" placeholder="sk-…" autocomplete="off"></label>
    <p class="hint">Needed for ChatGPT and voice. Stored only on this device and sent only to OpenAI. Create one at platform.openai.com → API keys.</p>
    <div class="two">
      <label>ChatGPT model<input name="model" value="${esc(state.model)}" autocomplete="off" autocapitalize="off"></label>
      <label>Guests<input name="guests" type="number" min="1" max="99" value="${state.guests}"></label>
    </div>
    <label>Thanksgiving date<input name="tday" type="date" required value="${state.tday}"></label>
    <div class="row">
      <button class="btn danger" value="reset" formnovalidate>Start over</button>
      <button class="btn" value="cancel" formnovalidate>Cancel</button>
      <button class="btn primary" value="save">Save</button>
    </div>`, (fd, action) => {
    if (action === 'reset') {
      if (!confirm('Clear your menu, ingredients, timeline and chat, and start from a blank plan?')) return false;
      Object.assign(state, { menu: [], tasks: [], chat: [], view: 'dish' });
      openDishes.clear();
      return;
    }
    state.apiKey = fd.get('apiKey').trim();
    state.model = fd.get('model').trim() || 'gpt-5-mini';
    state.guests = Math.max(1, Number(fd.get('guests')) || 8);
    state.tday = fd.get('tday') || state.tday;
  });
}

// ---------- Mutations (shared by the forms and by ChatGPT) ----------

const same = (a, b) => String(a ?? '').trim().toLowerCase() === String(b ?? '').trim().toLowerCase();
const findDish = name => state.menu.find(d => same(d.name, name));

function setDish({ name, previous_name, course, ingredients }) {
  name = String(name ?? '').trim();
  if (!name) throw new Error('A dish needs a name');
  const dish = findDish(previous_name || name) || findDish(name);
  const old = dish?.ingredients ?? [];
  const ings = (ingredients ?? old.map(i => i.text)).map(t => String(t).trim()).filter(Boolean)
    .map(text => old.find(i => same(i.text, text)) ?? mkIng(text)); // keep "owned" ticks
  if (dish) {
    Object.assign(dish, { name, course: String(course || dish.course).trim(), ingredients: ings });
    return `Updated ${name}`;
  }
  state.menu.push({ id: uid(), name, course: String(course || 'Sides').trim(), ingredients: ings });
  return `Added ${name}`;
}

function removeDish({ name }) {
  const dish = findDish(name);
  if (!dish) throw new Error(`No dish named "${name}"`);
  state.menu = state.menu.filter(d => d !== dish);
  return `Removed ${dish.name}`;
}

function setTask({ id, text, day, time, done }) {
  if (day != null && !/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new Error('day must be YYYY-MM-DD');
  if (time && !/^\d{2}:\d{2}$/.test(time)) throw new Error('time must be 24-hour HH:MM');
  const task = id && state.tasks.find(t => t.id === id);
  if (id && !task) throw new Error(`No task with id "${id}"`);
  if (task) {
    if (text != null) task.text = String(text).trim();
    if (day != null) task.day = day;
    if (time != null) task.time = time;
    if (done != null) task.done = !!done;
    return `Updated task: ${task.text}`;
  }
  if (!String(text ?? '').trim() || !day) throw new Error('A new task needs text and a day');
  state.tasks.push({ id: uid(), text: String(text).trim(), day, time: time || '', done: !!done });
  return `Added task: ${String(text).trim()}`;
}

function removeTask({ id }) {
  const task = state.tasks.find(t => t.id === id);
  if (!task) throw new Error(`No task with id "${id}"`);
  state.tasks = state.tasks.filter(t => t !== task);
  return `Removed task: ${task.text}`;
}

// ---------- ChatGPT ----------

const fn = (name, description, properties, required) =>
  ({ type: 'function', function: { name, description, parameters: { type: 'object', properties, required } } });
const TOOLS = [
  fn('set_dish', 'Add a new dish, or replace an existing one (matched by name, case-insensitive). Always pass the complete ingredient list for the dish.', {
    name: { type: 'string' },
    previous_name: { type: 'string', description: 'Only when renaming: the dish\'s current name' },
    course: { type: 'string', description: 'Starters, Main, Sides, Desserts or Drinks' },
    ingredients: { type: 'array', items: { type: 'string' }, description: 'One shopping-list item per entry, quantity first, e.g. "2 cups heavy cream"' },
  }, ['name', 'course', 'ingredients']),
  fn('remove_dish', 'Remove a dish and its ingredients from the menu.', { name: { type: 'string' } }, ['name']),
  fn('set_task', 'Add a cooking timeline task, or update an existing one by id (only the fields passed are changed).', {
    id: { type: 'string', description: 'Existing task id; omit to add a new task' },
    text: { type: 'string' },
    day: { type: 'string', description: 'YYYY-MM-DD' },
    time: { type: 'string', description: '24-hour HH:MM, or "" for no specific time' },
    done: { type: 'boolean' },
  }, []),
  fn('remove_task', 'Remove a timeline task by id.', { id: { type: 'string' } }, ['id']),
];
const TOOL_IMPL = { set_dish: setDish, remove_dish: removeDish, set_task: setTask, remove_task: removeTask };

function systemPrompt() {
  const menu = state.menu.map(d => ({ name: d.name, course: d.course, ingredients: d.ingredients.map(i => i.text + (i.got ? ' (owned)' : '')) }));
  const tasks = state.tasks.map(({ id, day, time, text, done }) => ({ id, day, time, text, done }));
  return `You are a friendly Thanksgiving cooking assistant built into a meal-planning app on the user's phone.
Today is ${today()}. Thanksgiving dinner is on ${state.tday}, for ${state.guests} guests.

Answer cooking questions (unit conversions, substitutions, timing, food safety) briefly and directly; the user is often reading mid-task in a kitchen or a store. Use plain text only, no markdown.

The user often speaks instead of typing, so messages may be transcribed speech with misheard words or run-together lists; read them charitably. When the user names foods they want to serve, add each one as its own dish with set_dish. Base each ingredient list on the most popular, widely made version of that recipe (the kind a top-rated recipe site would give), with quantities scaled for the guest count, written the way they would appear on a shopping list. Give each dish a clear menu-style name and the right course.

When the user asks to change the menu, the ingredients or the cooking timeline, make the change with the tools, then confirm what changed in a sentence or two. When a menu change affects the cooking schedule and a timeline already exists, update the timeline tasks too. Do not change anything the user did not ask about.

Current menu (ingredients marked "owned" are already in the user's kitchen):
${JSON.stringify(menu)}

Current cooking timeline:
${JSON.stringify(tasks)}`;
}

let busy = '';   // status text while waiting on OpenAI
let rec = null;  // active MediaRecorder while listening

function renderChat() {
  const log = $('#chatLog');
  const status = rec ? 'Listening… tap the mic when you\'re done' : busy;
  if (!state.chat.length && !status) {
    log.innerHTML = `<div class="chips"><p>Ask anything, or change the plan</p>
      <span class="hint">Tap the mic and say what you want to serve</span>${[
      'How many tablespoons in 3/4 cup?',
      'What can I substitute for buttermilk?',
      'Add a vegetarian main dish',
      'Move dinner to 5 PM and adjust the timeline',
    ].map(q => `<button data-ask="${esc(q)}">${esc(q)}</button>`).join('')}</div>`;
  } else {
    log.innerHTML = state.chat.map(m => `<div class="msg ${m.role}">${esc(m.content)}</div>`).join('') +
      (status ? `<div class="msg assistant typing">${esc(status)}</div>` : '');
    log.scrollTop = log.scrollHeight;
  }
  $('#chatSend').disabled = !!busy || !!rec;
  $('#micBtn').disabled = !!busy;
  $('#micBtn').classList.toggle('rec', !!rec);
}

const chatError = text => { state.chat.push({ role: 'error', content: text }); save(); renderChat(); };
const NEED_KEY = 'Add your OpenAI API key in Settings (the gear, top right) to use ChatGPT and voice.';

async function sendChat(text) {
  text = text.trim();
  if (!text || busy) return;
  showTab('chat');
  state.chat.push({ role: 'user', content: text });
  if (!state.apiKey) return chatError(NEED_KEY);
  busy = 'Thinking…'; renderChat();
  const messages = [{ role: 'system', content: systemPrompt() },
    ...state.chat.filter(m => m.role === 'user' || m.role === 'assistant').slice(-12).map(({ role, content }) => ({ role, content }))];
  const changes = [];
  try {
    for (let round = 0; ; round++) {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${state.apiKey}` },
        body: JSON.stringify({ model: state.model, messages, tools: TOOLS }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error?.message || `OpenAI returned HTTP ${res.status}`);
      const msg = data.choices[0].message;
      messages.push(msg);
      if (msg.tool_calls?.length && round < 6) {
        for (const call of msg.tool_calls) {
          let out;
          try {
            out = TOOL_IMPL[call.function.name](JSON.parse(call.function.arguments || '{}'));
            changes.push(out);
          } catch (e) { out = `Error: ${e.message}`; }
          messages.push({ role: 'tool', tool_call_id: call.id, content: out });
        }
        save(); renderMenu(); renderTimeline();
        continue;
      }
      if (changes.length) state.chat.push({ role: 'note', content: changes.map(c => `✓ ${c}`).join('\n') });
      state.chat.push({ role: 'assistant', content: msg.content || 'Done.' });
      break;
    }
  } catch (e) {
    if (changes.length) state.chat.push({ role: 'note', content: changes.map(c => `✓ ${c}`).join('\n') });
    state.chat.push({ role: 'error', content: `Couldn't reach ChatGPT: ${e.message}` });
  }
  busy = '';
  state.chat = state.chat.slice(-60);
  save(); renderChat();
}

// ---------- Voice ----------
// Records with the microphone and transcribes through OpenAI, because the browser's built-in
// speech recognition is not available to home-screen apps on iPhone.

async function transcribe(blob) {
  const ext = blob.type.includes('webm') ? 'webm' : blob.type.includes('ogg') ? 'ogg' : 'mp4';
  let err;
  for (const model of ['gpt-4o-mini-transcribe', 'whisper-1']) {
    const fd = new FormData();
    fd.append('file', blob, `speech.${ext}`);
    fd.append('model', model);
    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST', headers: { Authorization: `Bearer ${state.apiKey}` }, body: fd,
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) return String(data.text ?? '').trim();
    err = new Error(data.error?.message || `OpenAI returned HTTP ${res.status}`);
    if (res.status === 401 || res.status === 429) break; // a different model won't help
  }
  throw err;
}

async function toggleMic() {
  if (rec) { rec.stop(); return; }
  if (busy) return;
  showTab('chat');
  if (!state.apiKey) return chatError(NEED_KEY);
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) return chatError('This browser can\'t record audio. You can still type, or use the microphone key on the keyboard.');
  let stream;
  try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
  catch { return chatError('Microphone access was blocked. Allow it for this site in Settings, or type instead.'); }

  const chunks = [];
  const recorder = rec = new MediaRecorder(stream);
  recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
  recorder.onstop = async () => {
    stream.getTracks().forEach(t => t.stop());
    rec = null;
    busy = 'Writing down what you said…'; renderChat();
    let text = '', failed = '';
    try { text = await transcribe(new Blob(chunks, { type: recorder.mimeType || 'audio/mp4' })); }
    catch (e) { failed = `Couldn't transcribe that: ${e.message}`; }
    busy = '';
    if (text) sendChat(text);
    else chatError(failed || 'I didn\'t catch anything. Tap the mic and try again.');
  };
  recorder.start();
  renderChat();
}

// ---------- Wiring ----------

function renderAll() { renderMenu(); renderTimeline(); renderChat(); }

function showTab(name) {
  if ($(`#tab-${name}`).classList.contains('active')) return;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.id === `tab-${name}`));
  document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
  $('#main').scrollTop = 0;
  if (name === 'chat') renderChat();
}

document.addEventListener('click', e => {
  const t = e.target.closest('[data-tab],[data-view],[data-act],[data-dish],[data-task],[data-ask],[data-toggle],[data-starter]');
  if (!t) return;
  const d = t.dataset;
  if (d.tab) showTab(d.tab);
  else if (d.view) { state.view = d.view; save(); renderMenu(); }
  else if (d.toggle) { openDishes.has(d.toggle) ? openDishes.delete(d.toggle) : openDishes.add(d.toggle); renderMenu(); }
  else if (d.starter) { applyStarter(STARTERS[d.starter]); save(); renderAll(); $('#main').scrollTop = 0; }
  else if (d.act === 'add-dish') dishDialog();
  else if (d.act === 'add-task') taskDialog(null, d.day);
  else if (d.act === 'dictate') toggleMic();
  else if (d.dish) dishDialog(state.menu.find(x => x.id === d.dish));
  else if (d.task) taskDialog(state.tasks.find(x => x.id === d.task));
  else if (d.ask) sendChat(d.ask);
});

document.addEventListener('change', e => {
  const d = e.target.dataset;
  if (d.ing) {
    const ing = state.menu.flatMap(x => x.ingredients).find(i => i.id === d.ing);
    if (ing) { ing.got = e.target.checked; save(); renderMenu(); }
  } else if (d.taskCheck) {
    const task = state.tasks.find(t => t.id === d.taskCheck);
    if (task) { task.done = e.target.checked; save(); renderTimeline(); }
  }
});

$('#settingsBtn').addEventListener('click', settingsDialog);
$('#micBtn').innerHTML = MIC;
$('#micBtn').addEventListener('click', toggleMic);
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });

const input = $('#chatInput');
$('#chatForm').addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value;
  input.value = ''; input.style.height = '';
  sendChat(text);
});
input.addEventListener('input', () => { input.style.height = ''; input.style.height = `${input.scrollHeight}px`; });
input.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('#chatForm').requestSubmit(); }
});

renderAll();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
