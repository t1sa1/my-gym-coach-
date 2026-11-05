const plans=[
 {id:1,name:"Upper A",label:"ВЕРХ A",ex:[["Жим штанги лёжа",3,"6–10"],["Тяга верхнего блока",3,"8–12"],["Жим гантелей под наклоном",3,"8–12"],["Горизонтальная тяга",3,"8–12"],["Подъём гантелей в стороны",3,"12–20"],["Сгибание рук EZ",2,"10–12"],["Разгибание рук на блоке",2,"10–15"]]},
 {id:2,name:"Lower A",label:"НИЗ A",ex:[["Приседания",3,"6–10"],["Румынская тяга",3,"8–10"],["Жим ногами",3,"10–12"],["Сгибание ног",2,"10–15"],["Подъёмы на носки",3,"12–20"],["Пресс",3,"12–20"]]},
 {id:4,name:"Upper B",label:"ВЕРХ B",ex:[["Подтягивания / верхний блок",3,"8–12"],["Жим в тренажёре на грудь",3,"8–12"],["Тяга с упором грудью",3,"8–12"],["Жим гантелей сидя",2,"8–12"],["Обратная бабочка",3,"12–20"],["Молотковые сгибания",2,"10–12"],["Разгибание рук из-за головы",2,"10–15"]]},
 {id:5,name:"Lower B",label:"НИЗ B",ex:[["Гакк-приседания",3,"8–12"],["Ягодичный мост",3,"8–12"],["Болгарские выпады",2,"10–12"],["Сгибание ног лёжа",3,"10–15"],["Разгибание ног",2,"12–15"],["Икры сидя",3,"12–20"]]},
 {id:7,name:"Upper C",label:"ВЕРХ C",ex:[["Жим гантелей на наклонной",3,"8–12"],["Тяга верхнего блока нейтральным хватом",3,"8–12"],["Сведение рук в кроссовере",2,"12–15"],["Горизонтальная тяга блока",2,"10–12"],["Подъём гантелей в стороны",3,"12–20"],["Обратная бабочка",2,"12–20"],["Сгибание рук на скамье Скотта",2,"10–12"],["Разгибание рук на блоке",2,"10–15"]]}
];
const $=id=>document.getElementById(id);
let state=JSON.parse(localStorage.getItem("mgc-data")||'{"logs":[],"profile":{"bodyWeight":90,"height":186,"age":20,"goal":"Гипертрофия","experience":"Начинающий","frequency":"3","priority":"Верх тела"},"cycle":0}');
state.profile={bodyWeight:90,height:186,age:20,goal:"Гипертрофия",experience:"Начинающий",frequency:"3",priority:"Верх тела",...state.profile};
let current=0,selected=0,completed=new Set(),activeWorkout=[];
function save(){localStorage.setItem("mgc-data",JSON.stringify(state));renderStats()}
function currentPlan(){return plans[current]}
function renderDays(){$("daySelect").innerHTML=plans.map((p,i)=>`<button class="day-btn ${i===current?"active":""}" data-i="${i}">${p.label}</button>`).join("");document.querySelectorAll(".day-btn").forEach(b=>b.onclick=()=>{current=+b.dataset.i;selected=0;completed.clear();activeWorkout=[];renderWorkout()})}
function recommendation(name){let all=state.logs.filter(x=>x.exercise===name);if(!all.length)return "Пока нет истории для этого упражнения. Начни с комфортного веса и оставляй 2–3 повтора в запасе.";let last=all.slice(-3);let best=last[last.length-1];let reps=+best.reps;let max=all.reduce((m,x)=>Math.max(m,+x.weight),0);if(reps>=12)return `Последний записанный подход: ${best.weight} кг × ${best.reps}. Если все рабочие подходы были уверенными и техника стабильна, попробуй прибавить минимальный шаг веса.`;return `Последний результат: ${best.weight} кг × ${best.reps}. Сначала постарайся добавить 1 повтор при том же весе. Твой лучший записанный вес: ${max} кг.`}
function renderWorkout(){renderDays();let p=currentPlan();$("dayTag").textContent=`ДЕНЬ ${p.id}`;$("coachAdvice").textContent=recommendation(p.ex[selected][0]);$("exerciseCount").textContent=`${p.ex.length} упражнений`;$("exerciseList").innerHTML=p.ex.map((e,i)=>`<div class="exercise ${i===selected?"selected":""}" data-i="${i}"><span class="num">${i+1}</span><div><b>${e[0]}</b><small>${e[1]} подхода · ${e[2]} повторений</small></div><span class="check">${completed.has(i)?"✓":""}</span></div>`).join("");document.querySelectorAll(".exercise").forEach(el=>el.onclick=()=>{selected=+el.dataset.i;renderWorkout()});$("selectedExercise").textContent=p.ex[selected][0];$("currentSets").innerHTML=activeWorkout.filter(x=>x.exercise===p.ex[selected][0]).map((x,i)=>`<div class="set-row"><span>Подход ${i+1}</span><b>${x.weight} кг × ${x.reps}</b></div>`).join("");$("addSet").onclick=()=>{let w=+$("weight").value,r=+$("reps").value;if(!Number.isFinite(w)||w<0||!Number.isInteger(r)||r<1){alert("Введи корректный вес и количество повторений.");return}activeWorkout.push({exercise:p.ex[selected][0],weight:w,reps:r,notes:$("notes").value});$("weight").value="";$("reps").value="";$("notes").value="";renderWorkout()};$("finishExercise").onclick=()=>{completed.add(selected);renderWorkout()};$("finishWorkout").onclick=()=>{if(!activeWorkout.length){alert("Сначала запиши хотя бы один подход.");return}let now=new Date().toISOString();state.logs.push(...activeWorkout.map(x=>({...x,day:p.name,date:now,cycle:state.cycle})));state.cycle++;save();activeWorkout=[];completed.clear();alert("Тренировка сохранена! Отличная работа.");renderWorkout();renderProgress()}}
function renderStats(){let logs=state.logs;$("statSessions").textContent=new Set(logs.map(x=>x.date)).size;$("statSets").textContent=logs.length;$("statVolume").textContent=Math.round(logs.reduce((s,x)=>s+x.weight*x.reps,0)).toLocaleString("ru-RU")}

const MUSCLE_MAP = {
  "Грудь": ["жим штанги","жим гантелей","жим в тренажёре","сведение рук","кроссовер"],
  "Спина": ["тяга верхнего","тяга горизонтальная","горизонтальная тяга","подтягивания","тяга с упором"],
  "Плечи": ["жим гантелей сидя","подъём гантелей в стороны","обратная бабочка"],
  "Бицепс": ["сгибание рук","молотковые","скамье скотта"],
  "Трицепс": ["разгибание рук"],
  "Квадрицепс": ["присед","жим ногами","гакк-присед","болгарские","разгибание ног"],
  "Бицепс бедра": ["румынская тяга","сгибание ног"],
  "Ягодицы": ["ягодичный мост","болгарские","присед","гакк-присед"],
  "Икры": ["икры","подъёмы на носки"],
  "Пресс": ["пресс"]
};
const MUSCLE_COLORS = {"Грудь":"#f04452","Спина":"#f28b35","Плечи":"#f3c94b","Бицепс":"#38a5e9","Трицепс":"#8b6be8","Квадрицепс":"#35b96b","Бицепс бедра":"#28a6a0","Ягодицы":"#e879b7","Икры":"#8b9ba9","Пресс":"#a7c84b"};
function musclesForExercise(name){
 const n=name.toLowerCase();
 return Object.entries(MUSCLE_MAP).filter(([group,keys])=>keys.some(k=>n.includes(k))).map(([group])=>group);
}
function renderMuscleMap(){
 const totals=Object.fromEntries(Object.keys(MUSCLE_MAP).map(k=>[k,0]));
 const since=Date.now()-7*24*60*60*1000;
 state.logs.filter(x=>new Date(x.date).getTime()>=since).forEach(x=>{
   musclesForExercise(x.exercise).forEach((m,i)=>totals[m]+=i===0?1:0.5);
 });
 const max=Math.max(1,...Object.values(totals));
 const frontGroups=["Грудь","Плечи","Бицепс","Трицепс","Квадрицепс","Пресс"];
 const backGroups=["Спина","Плечи","Бицепс","Трицепс","Бицепс бедра","Ягодицы","Икры"];
 const body=(groups,side)=>groups.map((m,i)=>{const v=totals[m],opacity=v?Math.min(.35+v/max*.65,1):.13;return `<span class="muscle-chip" style="--muscle:${MUSCLE_COLORS[m]};--intensity:${opacity}">${m}</span>`}).join("");
 $("muscleFrontLegend").innerHTML=frontGroups.map(m=>muscleRow(m,totals[m])).join("");
 $("muscleBackLegend").innerHTML=backGroups.filter((m,i,a)=>a.indexOf(m)===i).map(m=>muscleRow(m,totals[m])).join("");
 $("muscleFront").innerHTML=muscleFigure("front",totals);
 $("muscleBack").innerHTML=muscleFigure("back",totals);
 $("musclePeriod").textContent="Последние 7 дней · рабочие подходы";
}
function muscleRow(m,v){
 const max=Math.max(1,...Object.values(MUSCLE_MAP).map(()=>0),...state.logs.filter(x=>new Date(x.date).getTime()>=Date.now()-7*86400000).flatMap(x=>musclesForExercise(x.exercise).map(()=>1)));
 const pct=Math.min(100,v/Math.max(4,max*4)*100);
 return `<div class="muscle-row"><span class="muscle-dot" style="background:${MUSCLE_COLORS[m]}"></span><span class="muscle-name">${m}</span><span class="muscle-track"><i style="width:${pct}%;background:${MUSCLE_COLORS[m]}"></i></span><b>${Number(v.toFixed(1))}</b></div>`;
}
function muscleFigure(side,totals){
 const front=side==="front";
 const fill=m=>totals[m]>0?MUSCLE_COLORS[m]:"#87928d";
 const op=m=>totals[m]>0?".96":".25";
 const muscle=(m,d)=>`<path d="${d}" fill="${fill(m)}" opacity="${op(m)}" stroke="#26332e" stroke-width="1.1" stroke-linejoin="round"/>`;
 const base=`<g fill="#59645f" stroke="#aeb8b2" stroke-width="1.5" stroke-linejoin="round">
 <path d="M91 51 Q110 42 129 51 L145 74 140 151 Q137 176 132 193 L128 235 92 235 88 193 Q83 176 80 151 L75 74Z"/>
 <path d="M80 62 Q65 59 57 78 L37 144 Q33 157 41 161 Q49 164 55 150 L84 98Z"/>
 <path d="M140 62 Q155 59 163 78 L183 144 Q187 157 179 161 Q171 164 165 150 L136 98Z"/>
 <path d="M92 226 Q110 234 128 226 L132 257 125 305 119 367 103 367 96 305 88 257Z"/>
 <path d="M103 363 L119 363 123 414 Q112 420 101 414Z"/>
 <path d="M103 363 L119 363 119 414 Q108 420 97 414Z"/>
 <ellipse cx="110" cy="25" rx="18" ry="22"/>
 </g>`;
 let details="";
 if(front){
 details+=muscle("Плечи","M80 66 Q66 61 60 79 Q63 91 78 96 L91 80Z M140 66 Q154 61 160 79 Q157 91 142 96 L129 80Z");
 details+=muscle("Грудь","M91 83 Q99 73 108 84 L107 119 Q94 117 82 104 Q80 91 91 83Z M129 83 Q121 73 112 84 L113 119 Q126 117 138 104 Q140 91 129 83Z");
 details+=muscle("Бицепс","M57 91 Q68 91 78 102 L67 143 Q55 146 50 135Z M163 91 Q152 91 142 102 L153 143 Q165 146 170 135Z");
 details+=muscle("Пресс","M100 123 Q110 119 120 123 L119 181 Q110 188 101 181Z");
 details+=muscle("Квадрицепс","M91 211 Q101 207 108 215 L105 298 Q95 306 89 288Z M129 211 Q119 207 112 215 L115 298 Q125 306 131 288Z");
 details+=muscle("Икры","M99 315 Q108 310 108 321 L105 404 L96 404Z M121 315 Q112 310 112 321 L115 404 L124 404Z");
 }else{
 details+=muscle("Плечи","M80 66 Q66 61 60 79 Q63 91 78 96 L91 80Z M140 66 Q154 61 160 79 Q157 91 142 96 L129 80Z");
 details+=muscle("Спина","M94 78 Q110 69 126 78 L137 133 Q128 151 110 155 Q92 151 83 133Z");
 details+=muscle("Трицепс","M57 94 Q68 91 78 102 L67 143 Q55 146 50 135Z M163 94 Q152 91 142 102 L153 143 Q165 146 170 135Z");
 details+=muscle("Ягодицы","M89 193 Q99 184 109 194 L108 231 Q96 237 87 222Z M131 193 Q121 184 111 194 L112 231 Q124 237 133 222Z");
 details+=muscle("Бицепс бедра","M91 237 Q101 231 108 240 L105 305 Q95 312 89 292Z M129 237 Q119 231 112 240 L115 305 Q125 312 131 292Z");
 details+=muscle("Икры","M99 315 Q108 310 108 321 L105 404 L96 404Z M121 315 Q112 310 112 321 L115 404 L124 404Z");
 }
 return `<svg class="body-figure" viewBox="0 0 220 430" role="img" aria-label="${front?"Передняя":"Задняя"} анатомическая схема мышц">${base}${details}<path d="M110 48 V408" stroke="#dbe2dd" stroke-width="1" opacity=".25"/></svg>`;
}

function renderProgress(){renderMuscleMap();let names=[...new Set(state.logs.map(x=>x.exercise))];$("progressExercise").innerHTML=names.map(n=>`<option>${n}</option>`).join("");$("progressExercise").onchange=drawChart;drawChart();$("historyList").innerHTML=state.logs.slice().reverse().slice(0,30).map(x=>`<div class="history-item"><b>${x.exercise}</b><p>${new Date(x.date).toLocaleString("ru-RU")} · ${x.day}</p><strong>${x.weight} кг × ${x.reps}</strong></div>`).join("")||'<p class="muted">Пока нет сохранённых тренировок.</p>'}
function drawChart(){let name=$("progressExercise").value;let arr=state.logs.filter(x=>x.exercise===name);if(!arr.length){$("progressChart").className="chart-empty";$("progressChart").textContent="Добавь результаты тренировок, чтобы увидеть график.";return}let best=arr.map(x=>+x.weight);let max=Math.max(...best,1),min=Math.min(...best);let w=320,h=150,pad=25;let pts=best.map((v,i)=>`${pad+i*(w-2*pad)/Math.max(best.length-1,1)},${h-pad-(v/max)*(h-2*pad)}`).join(" ");$("progressChart").className="";$("progressChart").innerHTML=`<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="График веса"><polyline points="${pts}" fill="none" stroke="#1c8b56" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${best.map((v,i)=>`<circle cx="${pad+i*(w-2*pad)/Math.max(best.length-1,1)}" cy="${h-pad-(v/max)*(h-2*pad)}" r="4" fill="#1c8b56"/>`).join("")}</svg><div class="muted">Последний вес: ${best[best.length-1]} кг · Лучший: ${max} кг · Записей: ${best.length}</div>`}
function renderPlan(){$("fullPlan").innerHTML=plans.map(p=>`<div class="plan-day"><h3>${p.name}<span class="tag">ДЕНЬ ${p.id}</span></h3><ul>${p.ex.map(e=>`<li>${e[0]} — ${e[1]} × ${e[2]}</li>`).join("")}</ul></div>`).join("")}
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll(".view").forEach(x=>x.classList.toggle("active",x.id==="view-"+b.dataset.tab));if(b.dataset.tab==="progress")renderProgress()});
$("saveProfile").onclick=()=>{state.profile={bodyWeight:+$("bodyWeight").value,height:+$("height").value,age:+$("age").value,goal:$("goal").value,experience:$("experience").value,frequency:$("frequency").value,priority:$("priority").value};save();alert("Профиль сохранён. ИИ-тренер будет учитывать новые настройки.")};
$("exportData").onclick=()=>{let blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="my-gym-coach-backup.json";a.click();URL.revokeObjectURL(a.href)};
$("importData").onchange=async e=>{try{let obj=JSON.parse(await e.target.files[0].text());if(!Array.isArray(obj.logs)||!obj.profile)throw Error();state=obj;save();renderWorkout();renderProgress();alert("Данные импортированы.")}catch{alert("Не удалось прочитать резервную копию.")}};
$("bodyWeight").value=state.profile.bodyWeight;$("height").value=state.profile.height;$("age").value=state.profile.age;$("goal").value=state.profile.goal;$("experience").value=state.profile.experience;$("frequency").value=state.profile.frequency;$("priority").value=state.profile.priority;
renderWorkout();renderStats();renderPlan();renderProgress();
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));

// --- MY GYM COACH AI connection ---
const AI_API_URL = "https://quiet-truth-eee4.tisaii.workers.dev/coach";
if (!Array.isArray(state.aiHistory)) state.aiHistory = [];
function renderAIHistory(){
  const chat = $("aiChat");
  chat.innerHTML = "";
  const greeting = document.createElement("div");
  greeting.className = "ai-message assistant";
  greeting.textContent = "Привет! Я твой AI-тренер. Могу разобрать прогресс, предложить рабочие веса и помочь скорректировать тренировку. С чего начнём?";
  chat.appendChild(greeting);
  state.aiHistory.slice(-12).forEach(item => {
    const bubble = document.createElement("div");
    bubble.className = "ai-message " + (item.role === "user" ? "user" : "assistant");
    bubble.textContent = item.content;
    chat.appendChild(bubble);
  });
  chat.scrollTop = chat.scrollHeight;
}
async function sendAIQuestion(){
  const input = $("aiQuestion");
  const button = $("aiSend");
  const question = input.value.trim();
  if (!question) { input.focus(); return; }
  const history = state.aiHistory.slice(-6);
  state.aiHistory.push({role:"user",content:question});
  input.value = "";
  renderAIHistory();
  button.disabled = true;
  button.textContent = "Тренер думает…";
  $("aiStatus").textContent = "Связь с AI активна";
  try {
    const response = await fetch(AI_API_URL, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        question,
        profile:state.profile,
        logs:state.logs.slice(-40),
        history
      })
    });
    const data = await response.json();
    if (!response.ok || !data.answer) throw new Error(data.error || "Не удалось получить ответ от тренера.");
    state.aiHistory.push({role:"assistant",content:data.answer});
    state.aiHistory = state.aiHistory.slice(-30);
    save();
    renderAIHistory();
    $("aiStatus").textContent = "AI-тренер подключён";
  } catch (error) {
    state.aiHistory.push({role:"assistant",content:"Не удалось получить ответ: " + error.message + " Проверь подключение и попробуй ещё раз."});
    renderAIHistory();
    $("aiStatus").textContent = "Ошибка соединения";
  } finally {
    button.disabled = false;
    button.textContent = "Отправить тренеру";
  }
}
$("aiSend").addEventListener("click", sendAIQuestion);
$("aiQuestion").addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendAIQuestion();
  }
});
renderAIHistory();
