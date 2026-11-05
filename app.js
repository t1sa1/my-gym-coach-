const plans=[
 {id:1,name:"Upper A",label:"ВЕРХ A",ex:[["Жим штанги лёжа",3,"6–10"],["Тяга верхнего блока",3,"8–12"],["Жим гантелей под наклоном",3,"8–12"],["Горизонтальная тяга",3,"8–12"],["Подъём гантелей в стороны",3,"12–20"],["Сгибание рук EZ",2,"10–12"],["Разгибание рук на блоке",2,"10–15"]]},
 {id:2,name:"Lower A",label:"НИЗ A",ex:[["Приседания",3,"6–10"],["Румынская тяга",3,"8–10"],["Жим ногами",3,"10–12"],["Сгибание ног",2,"10–15"],["Подъёмы на носки",3,"12–20"],["Пресс",3,"12–20"]]},
 {id:4,name:"Upper B",label:"ВЕРХ B",ex:[["Подтягивания / верхний блок",3,"8–12"],["Жим в тренажёре на грудь",3,"8–12"],["Тяга с упором грудью",3,"8–12"],["Жим гантелей сидя",2,"8–12"],["Обратная бабочка",3,"12–20"],["Молотковые сгибания",2,"10–12"],["Разгибание рук из-за головы",2,"10–15"]]},
 {id:5,name:"Lower B",label:"НИЗ B",ex:[["Гакк-приседания",3,"8–12"],["Ягодичный мост",3,"8–12"],["Болгарские выпады",2,"10–12"],["Сгибание ног лёжа",3,"10–15"],["Разгибание ног",2,"12–15"],["Икры сидя",3,"12–20"]]},
 {id:7,name:"Upper C",label:"ВЕРХ C",ex:[["Жим гантелей на наклонной",3,"8–12"],["Тяга верхнего блока нейтральным хватом",3,"8–12"],["Сведение рук в кроссовере",2,"12–15"],["Горизонтальная тяга блока",2,"10–12"],["Подъём гантелей в стороны",3,"12–20"],["Обратная бабочка",2,"12–20"],["Сгибание рук на скамье Скотта",2,"10–12"],["Разгибание рук на блоке",2,"10–15"]]}
];
const $=id=>document.getElementById(id);
let state=JSON.parse(localStorage.getItem("mgc-data")||'{"logs":[],"profile":{"bodyWeight":90,"height":186,"age":20,"goal":"Гипертрофия","experience":"Начинающий","frequency":"3","priority":"Верх тела"},"cycle":0}');
if(!Array.isArray(state.logs))state.logs=[];
state.logs=state.logs.filter(x=>x&&typeof x==="object").map(x=>({...x,exercise:String(x.exercise||x.name||"Неизвестное упражнение"),weight:Number(x.weight)||0,reps:Number(x.reps)||0,date:x.date||new Date().toISOString(),day:x.day||"Тренировка"}));
state.profile={bodyWeight:90,height:186,age:20,sex:"male",goal:"Набор массы",activity:"1.55",experience:"Начинающий",frequency:"3",priority:"Верх тела",...state.profile};
if(["Гипертрофия","Сила и масса"].includes(state.profile.goal))state.profile.goal="Набор массы";if(!["Набор массы","Поддержание веса","Снижение жира","Рекомпозиция"].includes(state.profile.goal))state.profile.goal="Набор массы";if(!["male","female"].includes(state.profile.sex))state.profile.sex="male";if(!state.profile.activity)state.profile.activity="1.375";
if(!Array.isArray(state.foodLog))state.foodLog=[];
let current=0,selected=0,completed=new Set(),activeWorkout=[];
function save(){localStorage.setItem("mgc-data",JSON.stringify(state));renderStats()}
function currentPlan(){return plans[current]}
function renderDays(){$("daySelect").innerHTML=plans.map((p,i)=>`<button class="day-btn ${i===current?"active":""}" data-i="${i}">${p.label}</button>`).join("");document.querySelectorAll(".day-btn").forEach(b=>b.onclick=()=>{current=+b.dataset.i;selected=0;completed.clear();activeWorkout=[];renderWorkout()})}
function recommendation(name){let all=state.logs.filter(x=>x.exercise===name);if(!all.length)return "Пока нет истории для этого упражнения. Начни с комфортного веса и оставляй 2–3 повтора в запасе.";let last=all.slice(-3);let best=last[last.length-1];let reps=+best.reps;let max=all.reduce((m,x)=>Math.max(m,+x.weight),0);if(reps>=12)return `Последний записанный подход: ${best.weight} кг × ${best.reps}. Если все рабочие подходы были уверенными и техника стабильна, попробуй прибавить минимальный шаг веса.`;return `Последний результат: ${best.weight} кг × ${best.reps}. Сначала постарайся добавить 1 повтор при том же весе. Твой лучший записанный вес: ${max} кг.`}

// Exercise library: equipment, target muscles and practical technique cues.
const EXERCISE_GUIDES = [
 {re:/жим штанги лёжа/i,e:"bar",equipment:"Штанга и скамья",primary:"Грудные мышцы",secondary:"Трицепс · передняя дельта",steps:["Ляг на скамью, сведи и опусти лопатки, стопы уверенно поставь на пол.","Возьми гриф чуть шире плеч; запястья держи над локтями.","Опускай гриф подконтрольно к нижней/средней части груди.","Выжми вверх, не теряя положения лопаток и не отбивая гриф от груди."],tip:"Не отрывай таз от скамьи. Не проверяй максимум в одиночку без страховки."},
 {re:/жим гантелей под наклоном|жим гантелей на наклонной/i,e:"dumbbellbench",equipment:"Гантели и наклонная скамья",primary:"Верх груди",secondary:"Передняя дельта · трицепс",steps:["Установи спинку примерно под 20–35°.","Подними гантели над верхней частью груди, лопатки собраны.","Опускай гантели по бокам груди до комфортной глубины.","Выжми вверх без столкновения гантелей и без чрезмерного прогиба."],tip:"Не ставь спинку слишком вертикально: нагрузка сильнее уйдёт в плечи."},
 {re:/жим в тренажёре на грудь/i,e:"machinepress",equipment:"Тренажёр для жима",primary:"Грудные мышцы",secondary:"Трицепс · передняя дельта",steps:["Настрой сиденье так, чтобы рукояти были примерно на уровне середины груди.","Прижми спину к опоре, плечи опусти.","Выжми рукояти вперёд, сохраняя мягкий локоть в верхней точке.","Верни рукояти медленно, не позволяя весу резко тянуть руки назад."],tip:"Не позволяй плечам округляться вперёд в нижней точке."},
 {re:/сведение рук в кроссовере/i,e:"cable",equipment:"Кроссовер",primary:"Грудные мышцы",secondary:"Передняя дельта",steps:["Поставь блоки примерно на уровне плеч или немного выше.","Сделай небольшой шаг вперёд, корпус стабилен, локти слегка согнуты.","Сведи рукояти перед грудью по дуге.","Медленно разведи руки до комфортного растяжения."],tip:"Двигай плечом, а не превращай упражнение в жим за счёт сгибания локтей."},
 {re:/тяга верхнего блока|подтягивания/i,e:"pulldown",equipment:"Верхний блок / турник",primary:"Широчайшие мышцы спины",secondary:"Бицепс · ромбовидные мышцы",steps:["Возьмись за рукоять и стабилизируй корпус; грудь слегка приподнята.","Начни движение с опускания лопаток.","Подтяни рукоять к верхней части груди, ведя локти вниз.","Верни руки вверх медленно, не раскачивая корпус."],tip:"Не тяни рукоять за голову и не отклоняйся сильно назад."},
 {re:/горизонтальная тяга|тяга верхнего нейтральным|горизонтальная тяга блока/i,e:"row",equipment:"Горизонтальный блок",primary:"Средняя часть спины",secondary:"Широчайшие · бицепс · задняя дельта",steps:["Сядь устойчиво, возьмись за рукоять, спину держи нейтрально.","Слегка расправь грудь и зафиксируй корпус.","Потяни рукоять к нижним рёбрам, сводя лопатки.","Медленно вытяни руки вперёд, не округляя поясницу."],tip:"Не раскачивайся всем корпусом, чтобы закончить повтор."},
 {re:/тяга с упором грудью/i,e:"chestrow",equipment:"Тренажёр тяги с упором грудью",primary:"Средняя часть спины",secondary:"Широчайшие · бицепс · задняя дельта",steps:["Настрой опору под грудь и возьмись за рукояти.","Сохраняй грудь на подушке и шею нейтрально.","Потяни локти назад, сводя лопатки.","Верни рукояти медленно, не теряя контроля."],tip:"Упор грудью помогает убрать раскачку — не отрывайся от подушки."},
 {re:/подъём гантелей в стороны/i,e:"dumbbells",equipment:"Гантели",primary:"Средняя дельта",secondary:"Надостная мышца · верх трапеции",steps:["Встань ровно, гантели по бокам, локти слегка согнуты.","Поднимай руки в стороны примерно до уровня плеч.","Веди локти, кисти не задирай выше локтей.","Опускай гантели медленно и без раскачки."],tip:"Используй небольшой вес и не подбрасывай гантели корпусом."},
 {re:/обратная бабочка/i,e:"reversefly",equipment:"Тренажёр обратная бабочка",primary:"Задняя дельта",secondary:"Ромбовидные · средняя трапеция",steps:["Настрой сиденье так, чтобы рукояти были на уровне плеч.","Прижми грудь к опоре, локти слегка согнуты.","Разведи руки назад, двигая плечами и контролируя лопатки.","Верни рукояти вперёд плавно."],tip:"Не превращай движение в сильное сведение лопаток с рывком."},
 {re:/жим гантелей сидя/i,e:"dumbbellpress",equipment:"Гантели и скамья",primary:"Передняя и средняя дельта",secondary:"Трицепс · верх груди",steps:["Сядь с опорой для спины, гантели у уровня ушей.","Напряги корпус, не прогибай поясницу.","Выжми гантели вверх по естественной траектории.","Опусти их контролируемо до комфортной глубины."],tip:"Не сталкивай гантели над головой и не прогибайся в пояснице."},
 {re:/сгибание рук EZ/i,e:"ez",equipment:"EZ-гриф",primary:"Бицепс",secondary:"Плечевая мышца · предплечья",steps:["Возьми EZ-гриф удобным хватом, локти держи около корпуса.","Согни руки, поднимая гриф без движения плеч вперёд.","На секунду напряги бицепс вверху.","Опускай гриф медленно почти до полного разгибания."],tip:"Убери раскачку корпуса; если приходится помогать спиной — снизь вес."},
 {re:/молотковые сгибания/i,e:"dumbbells",equipment:"Гантели",primary:"Плечевая мышца и брахиорадиалис",secondary:"Бицепс",steps:["Держи гантели нейтральным хватом, ладони смотрят друг на друга.","Сохраняй локти возле корпуса.","Подними гантели к плечам без разворота кистей.","Опусти медленно, сохраняя нейтральный хват."],tip:"Не выводи локти вперёд и не раскачивайся."},
 {re:/скамье Скотта/i,e:"preacher",equipment:"Скамья Скотта и EZ-гриф / гантель",primary:"Бицепс",secondary:"Плечевая мышца",steps:["Плотно расположи плечи на подушке скамьи.","Начни с почти разогнутых, но не заблокированных рук.","Согни локти и подними вес без отрыва плеч.","Опускай медленно, не бросая вес в нижнюю точку."],tip:"Не переразгибай локти и не используй инерцию."},
 {re:/разгибание рук на блоке/i,e:"pushdown",equipment:"Верхний блок с рукоятью",primary:"Трицепс",secondary:"Локтевая мышца",steps:["Встань лицом к блоку, локти прижми к корпусу.","Зафиксируй плечи и начни с согнутых локтей.","Разогни руки вниз до почти полного выпрямления.","Верни рукоять вверх медленно, не уводя локти вперёд."],tip:"Двигай только предплечьями; корпус не должен раскачиваться."},
 {re:/разгибание рук из-за головы/i,e:"overhead",equipment:"Канат верхнего блока / гантель",primary:"Длинная головка трицепса",secondary:"Другие головки трицепса",steps:["Развернись спиной к блоку или возьми одну гантель двумя руками.","Подними локти вверх и направь их вперёд, насколько комфортно.","Разогни руки, сохраняя плечи стабильными.","Согни локти под контролем, чувствуя растяжение трицепса."],tip:"Не разводи локти чрезмерно и не прогибай поясницу."},
 {re:/приседания|гакк-приседания/i,e:"squat",equipment:"Штанга / гакк-тренажёр",primary:"Квадрицепсы",secondary:"Ягодицы · приводящие мышцы · корпус",steps:["Поставь стопы устойчиво примерно на ширине плеч.","Напряги корпус и начни движение сгибанием тазобедренных и коленных суставов.","Опускайся до глубины, которую контролируешь без боли и потери положения спины.","Встань, толкая пол всей стопой."],tip:"Колени могут двигаться вперёд по линии носков; не допускай их резкого завала внутрь."},
 {re:/румынская тяга/i,e:"rdl",equipment:"Штанга или гантели",primary:"Задняя поверхность бедра",secondary:"Ягодицы · разгибатели спины",steps:["Стой ровно, колени слегка согнуты, вес у бёдер.","Отведи таз назад, ведя вес близко к ногам.","Опускайся до выраженного натяжения задней поверхности бедра при нейтральной спине.","Разогни таз и вернись в стойку, не переразгибаясь."],tip:"Это наклон через таз, а не присед. Глубина зависит от подвижности."},
 {re:/жим ногами/i,e:"legpress",equipment:"Тренажёр жим ногами",primary:"Квадрицепсы",secondary:"Ягодицы · приводящие мышцы",steps:["Поставь стопы на платформу примерно на ширине плеч.","Сними фиксаторы и опускай платформу подконтрольно.","Опускай до глубины, пока таз и поясница остаются прижатыми к спинке.","Выжми платформу, не блокируя колени резко."],tip:"Не опускай платформу настолько глубоко, чтобы таз подкручивался и поясница отрывалась."},
 {re:/сгибание ног/i,e:"legcurl",equipment:"Тренажёр сгибания ног",primary:"Задняя поверхность бедра",secondary:"Икроножная мышца",steps:["Настрой валик чуть выше пяток, ось тренажёра совмести с коленом.","Зафиксируй таз и корпус на опоре.","Согни колени, подтягивая валик к себе.","Верни ноги медленно, не бросая стек."],tip:"Не поднимай таз и не используй рывок."},
 {re:/подъёмы на носки|икры сидя/i,e:"calf",equipment:"Тренажёр для икр / платформа",primary:"Икроножная и камбаловидная мышцы",secondary:"—",steps:["Поставь переднюю часть стоп на платформу, пятки свободны.","Опусти пятки до комфортного растяжения.","Поднимись максимально высоко на носки.","Задержись на секунду и опускайся медленно."],tip:"Работай в полной контролируемой амплитуде, не пружинь."},
 {re:/ягодичный мост/i,e:"hipthrust",equipment:"Скамья и штанга / тренажёр",primary:"Большая ягодичная мышца",secondary:"Задняя поверхность бедра · корпус",steps:["Упрись верхом спины в край скамьи, стопы поставь на ширине таза.","Подними таз, сохраняя рёбра опущенными и подбородок слегка вниз.","В верхней точке добейся прямой линии плечи-таз-колени.","Опусти таз под контролем, не теряя устойчивости."],tip:"Не переразгибай поясницу в верхней точке — движение завершается ягодицами."},
 {re:/болгарские выпады/i,e:"split",equipment:"Скамья и гантели",primary:"Квадрицепсы и ягодицы",secondary:"Приводящие мышцы · корпус",steps:["Поставь заднюю стопу на скамью, переднюю — достаточно далеко для устойчивости.","Опускайся вертикально вниз, сохраняя опору на всю переднюю стопу.","Колено передней ноги направляй по линии носка.","Оттолкнись передней ногой и вернись вверх."],tip:"Начни без веса, найди устойчивую длину шага и безболезненную глубину."},
 {re:/разгибание ног/i,e:"legext",equipment:"Тренажёр разгибания ног",primary:"Квадрицепсы",secondary:"—",steps:["Совмести ось тренажёра с коленным суставом.","Валик размести над голеностопом, спину прижми к спинке.","Разогни колени плавно, не ударяя в верхней точке.","Опусти вес медленно."],tip:"Не используй инерцию и не выбирай вес, который вызывает боль в колене."},
 {re:/пресс/i,e:"core",equipment:"Коврик / тренажёр для пресса",primary:"Мышцы живота",secondary:"Сгибатели бедра (зависит от варианта)",steps:["Выбери вариант упражнения и зафиксируй корпус.","На выдохе подкрути таз или сблизь рёбра и таз — в зависимости от движения.","Не тяни голову руками и не делай рывков.","Вернись в исходное положение медленно."],tip:"Сосредоточься на контроле корпуса и дыхании, а не на количестве повторений."}
];
function exerciseGuide(name){return EXERCISE_GUIDES.find(g=>g.re.test(name))||{e:"machine",equipment:"Тренажёр или свободный вес",primary:"Целевая группа зависит от варианта",secondary:"Стабилизаторы и мышцы-синергисты",steps:["Настрой оборудование под свой рост и амплитуду.","Займи устойчивое положение и напряги корпус.","Выполняй движение плавно, без рывков и боли.","Возвращай вес под контролем."],tip:"Начни с лёгкого веса и попроси тренера в зале проверить технику."}}
function exercisePhoto(name){
 const n=String(name||"").toLowerCase();
 const make=(file,label,credit,backup)=>({url:"https://commons.wikimedia.org/wiki/Special:FilePath/"+encodeURIComponent(file)+"?width=960",backupUrl:backup?"https://commons.wikimedia.org/wiki/Special:FilePath/"+encodeURIComponent(backup)+"?width=960":"",credit,label,page:"https://commons.wikimedia.org/wiki/File:"+encodeURIComponent(file)});
 const items=[
  {re:/жим в тренажёре на грудь/i,p:make("Bench_press_Machine.jpg","Тренажёр для жима","Aliva Sahoo · CC BY-SA 4.0","Bench_Press.jpg")},
  {re:/жим штанги лёжа/i,p:make("Bench_Press.jpg","Скамья и штанга для жима","Aditya Oberai · CC BY-SA 4.0","Bench_press_Machine.jpg")},
  {re:/жим гантелей под наклоном|жим гантелей на наклонной|жим гантелей сидя|подъём гантелей в стороны|молотковые сгибания/i,p:make("Dumbells_and_free_weights_in_a_gym.jpg","Гантели и свободные веса","KeepActive Australia · CC BY-SA 4.0","Fitness_dumbbell_marked_with_a_green_logo_resting_on_a_gym_rack.jpg")},
  {re:/подтягивания/i,p:make("Pull-up_bar.JPG","Турник для подтягиваний","Santeri Viinamäki · CC BY 4.0","Pull_up_bar_stand.jpg")},
  {re:/тяга верхнего блока/i,p:make("Lat_Pull_down_Machine.jpg","Верхний блок для тяги","SAgbley · CC BY-SA 4.0","Diverging_Lat_Pulldown_Machine.jpg")},
  {re:/горизонтальная тяга|тяга с упором грудью/i,p:make("Multifunctional_cable_and_row_machines_in_a_gym.jpg","Горизонтальная блочная тяга","San Francisco Foghorn · CC BY 2.0","Functional_Trainer_Exercise_Machine_at_Gym.jpg")},
  {re:/кроссовер|разгибание рук на блоке|разгибание рук из-за головы/i,p:make("Functional_Trainer_Exercise_Machine_at_Gym.jpg","Кроссовер / блочный тренажёр","KeepActive Australia · Wikimedia Commons","Multifunctional_cable_and_row_machines_in_a_gym.jpg")},
  {re:/жим ногами/i,p:make("Leg_Press_Machine.jpg","Тренажёр для жима ногами","Paulmcdonald · CC BY-SA 4.0")},
  {re:/гакк-приседания/i,p:make("HackSquatMachineExercise.JPG","Гакк-тренажёр","GeorgeStepanek · Wikimedia Commons","Leg_Press_Machine.jpg")},
  {re:/сгибание ног/i,p:make("LyingLegCurlMachineExercise.JPG","Тренажёр сгибания ног","GeorgeStepanek · CC BY-SA 3.0","Leg_Press_Machine.jpg")},
  {re:/разгибание ног/i,p:make("Young_man_doing_leg_with_machine_in_gym.jpg","Тренажёр для ног","Nenad Stojkovic · CC BY 2.0","Leg_Press_Machine.jpg")},
  {re:/подъёмы на носки|икры сидя/i,p:make("SeatedCalfRaiseMachineExercise.JPG","Тренажёр для икр сидя","GeorgeStepanek · CC BY-SA 3.0","Seated_calf_machine.jpg")},
  {re:/обратная бабочка/i,p:make("Chest_Fly_Machine_1.jpg","Тренажёр сведения / разведения рук","SAgbley · CC BY-SA 4.0","Functional_Trainer_Exercise_Machine_at_Gym.jpg")},
  {re:/скамье скотта/i,p:make("Preacher_curl.webp","Скамья Скотта для сгибаний","SALlM BlN YOUSUF · CC BY 4.0","Dumbells_and_free_weights_in_a_gym.jpg")},
  {re:/приседания|румынская тяга|ягодичный мост|болгарские выпады|сгибание рук EZ/i,p:make("Barbell_and_Dumbbells_in_a_local_health_club.jpg","Штанга и свободные веса","Alvinategyeka · CC BY-SA 4.0","Free_weight_for_exercises_in_a_gym.jpg")},
  {re:/пресс/i,p:make("P90xgym.jpg","Инвентарь для упражнений с собственным весом","Andman8 · Wikimedia Commons","Gym_workout_machine.jpg")}
 ];
 const found=items.find(x=>x.re.test(n));
 return found?found.p:make("Gym_workout_machine.jpg","Оборудование тренажёрного зала","Samson Ssemakadde · CC0","Gym_workout_machines.jpg");
}
function mgcEquipmentImageError(img){
 if(img.dataset.backup && !img.dataset.backupTried){
  img.dataset.backupTried="1";img.src=img.dataset.backup;return;
 }
 const fig=img.closest("figure");
 if(fig){fig.innerHTML='<div class="photo-load-fallback">Фотография временно недоступна</div>';return;}
 img.outerHTML='<span class="exercise-icon-mark" aria-hidden="true">ЗАЛ</span>';
}
function equipmentImageMarkup(photo,alt,thumb){
 const safeAlt=String(alt||"Реальное спортивное оборудование").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");
 return '<img class="'+(thumb?"exercise-thumb-photo":"equipment-main-photo")+'" src="'+photo.url+'" '+(photo.backupUrl?'data-backup="'+photo.backupUrl+'"':'')+' alt="'+safeAlt+'" loading="'+(thumb?"lazy":"eager")+'" decoding="async" onerror="mgcEquipmentImageError(this)">';
}
function exerciseThumb(name){
 const photo=exercisePhoto(name);
 return '<div class="exercise-thumb exercise-icon">'+(photo?equipmentImageMarkup(photo,photo.label,true):exerciseIcon(name))+'</div>';
}
function exerciseIcon(name){
 const n=String(name||"").toLowerCase();
 const groups=[
  [/присед|ног|икры|болгар|румын|ягодич/i,"НО"],
  [/плеч|дельт|жим гантелей сидя|подъём гантелей в стороны/i,"ПЛ"],
  [/тяга|подтяг/i,"СП"],
  [/жим штанги лёжа|жим в тренажёре на грудь|жим гантелей под наклоном|жим гантелей на наклонной|сведение/i,"ГР"],
  [/бицепс|сгибание рук|молотков|скотта/i,"БИ"],
  [/трицепс|разгибание рук/i,"ТР"],
  [/пресс|кор|планк/i,"КОР"]
 ];
 const code=(groups.find(([re])=>re.test(n))||["","ЗАЛ"])[1];
 return '<span class="exercise-icon-mark" aria-hidden="true">'+code+'</span>';
}
function exerciseMuscleMini(name){
 const selected=musclesForExercise(name);
 const totals=Object.fromEntries(Object.keys(MUSCLE_MAP).map(k=>[k,0]));
 selected.forEach((m,i)=>totals[m]=i===0?2:1);
 return '<div class="mini-muscle-map"><div class="mini-map-head"><b>Мышцы в этом упражнении</b><small>Красный — основная нагрузка · приглушённый — дополнительно</small></div><div class="mini-map-figures">'+muscleFigure("front",totals)+muscleFigure("back",totals)+'</div><div class="mini-map-legend">'+selected.map((m,i)=>'<span><i style="background:'+MUSCLE_COLORS[m]+'"></i>'+m+(i===0?' · основная':' · дополнительная')+'</span>').join('')+'</div></div>';
}

function renderExerciseDetail(name){
 const g=exerciseGuide(name), steps=g.steps.map((x,i)=>'<li><span>'+(i+1)+'</span><p>'+x+'</p></li>').join('');
 const photo=exercisePhoto(name);
 const credit=photo&&photo.credit.indexOf("KeepActive")===0?photo.credit+' · <a href="https://keepactive.com.au/" target="_blank" rel="noopener">KeepActive</a>':photo&&photo.credit;
 const photoBlock=photo?'<figure class="exercise-photo equipment-photo">'+equipmentImageMarkup(photo,"Фотография оборудования: "+photo.label,false)+'<figcaption>'+photo.label+' · '+credit+' · <a href="'+photo.page+'" target="_blank" rel="noopener">источник и лицензия</a></figcaption></figure>':'<div class="photo-placeholder equipment-photo-placeholder"><span>ОБОРУДОВАНИЕ</span><small>'+g.equipment+' · фото будет добавлено в библиотеку оборудования</small></div>';
 $('exerciseDetail').innerHTML=photoBlock+'<div class="equipment-caption"><span class="eyebrow">ОБОРУДОВАНИЕ</span><b>'+g.equipment+'</b></div>'+exerciseMuscleMini(name)+'<div class="detail-muscles"><div><small>ОСНОВНАЯ НАГРУЗКА</small><b>'+g.primary+'</b></div><div><small>ДОПОЛНИТЕЛЬНО</small><b>'+g.secondary+'</b></div></div><div class="detail-steps"><h3>Как выполнять</h3><ol>'+steps+'</ol></div><div class="detail-tip"><span>✦</span><p>'+g.tip+'</p></div>';
}

function renderWorkout(){renderDays();let p=currentPlan();$("dayTag").textContent=`ДЕНЬ ${p.id}`;if($("homeWorkoutName"))$("homeWorkoutName").textContent=p.name;$("coachAdvice").textContent=recommendation(p.ex[selected][0]);$("exerciseCount").textContent=`${p.ex.length} УПРАЖНЕНИЙ`;$("exerciseList").innerHTML=p.ex.map((e,i)=>{const thumb=exerciseThumb(e[0]);return '<div class="exercise '+(i===selected?'selected':'')+'" data-i="'+i+'">'+thumb+'<div class="exercise-copy"><b>'+e[0]+'</b><small>'+e[1]+' подхода · '+e[2]+' повторений</small></div><span class="check">'+(completed.has(i)?'✓':'›')+'</span></div>'}).join("");document.querySelectorAll(".exercise").forEach(el=>el.onclick=()=>{selected=+el.dataset.i;renderWorkout()});renderExerciseDetail(p.ex[selected][0]);$("selectedExercise").textContent=p.ex[selected][0];$("currentSets").innerHTML=activeWorkout.filter(x=>x.exercise===p.ex[selected][0]).map((x,i)=>'<div class="set-row"><span>Подход '+(i+1)+'</span><b>'+x.weight+' кг × '+x.reps+'</b></div>').join("");$("addSet").onclick=()=>{let w=+$("weight").value,r=+$("reps").value;if(!Number.isFinite(w)||w<0||!Number.isInteger(r)||r<1){alert("Введи корректный вес и количество повторений.");return}activeWorkout.push({exercise:p.ex[selected][0],weight:w,reps:r,notes:$("notes").value});renderMuscleMap();$("weight").value="";$("reps").value="";$("notes").value="";renderWorkout()};$("finishExercise").onclick=()=>{completed.add(selected);renderWorkout()};$("finishWorkout").onclick=()=>{if(!activeWorkout.length){alert("Сначала запиши хотя бы один подход.");return}let now=new Date().toISOString();state.logs.push(...activeWorkout.map(x=>({...x,day:p.name,date:now,cycle:state.cycle})));state.cycle++;save();activeWorkout=[];completed.clear();alert("Тренировка сохранена! Отличная работа.");renderWorkout();renderProgress()}}
function renderStats(){let logs=state.logs;let sessions=new Set(logs.map(x=>x.date)).size;let volume=Math.round(logs.reduce((s,x)=>s+x.weight*x.reps,0));$("statSessions").textContent=sessions;$("statSets").textContent=logs.length;$("statVolume").textContent=volume.toLocaleString((state.settings&&state.settings.language)==="en"?"en-US":(state.settings&&state.settings.language)==="cs"?"cs-CZ":"ru-RU");if($("homeSessions"))$("homeSessions").textContent=sessions;if($("homeSets"))$("homeSets").textContent=logs.length;if($("homeVolume"))$("homeVolume").textContent=volume.toLocaleString((state.settings&&state.settings.language)==="en"?"en-US":(state.settings&&state.settings.language)==="cs"?"cs-CZ":"ru-RU");if($("progressSessions"))$("progressSessions").textContent=sessions;if($("progressSets"))$("progressSets").textContent=logs.length;if($("progressVolume"))$("progressVolume").textContent=volume.toLocaleString((state.settings&&state.settings.language)==="en"?"en-US":(state.settings&&state.settings.language)==="cs"?"cs-CZ":"ru-RU")}

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
const MUSCLE_COLORS = {"Грудь":"#f12a43","Спина":"#f12a43","Плечи":"#f12a43","Бицепс":"#f12a43","Трицепс":"#f12a43","Квадрицепс":"#f12a43","Бицепс бедра":"#f12a43","Ягодицы":"#f12a43","Икры":"#f12a43","Пресс":"#f12a43"};
function musclesForExercise(name){
 const n=name.toLowerCase();
 const rules=[
  [/жим штанги лёжа|жим гантелей под наклоном|жим гантелей на наклонной|жим в тренажёре на грудь|сведение рук в кроссовере/,"Грудь",["Трицепс","Плечи"]],
  [/тяга верхнего блока|подтягивания|горизонтальная тяга|тяга с упором грудью/,"Спина",["Бицепс","Плечи"]],
  [/жим гантелей сидя/,"Плечи",["Трицепс","Грудь"]],
  [/подъём гантелей в стороны|обратная бабочка/,"Плечи",["Спина"]],
  [/сгибание рук|молотковые|скамье скотта/,"Бицепс",[]],
  [/разгибание рук/,"Трицепс",["Плечи"]],
  [/приседания|гакк-приседания|жим ногами|болгарские выпады|разгибание ног/,"Квадрицепс",["Ягодицы","Бицепс бедра"]],
  [/румынская тяга|сгибание ног/,"Бицепс бедра",["Ягодицы","Спина"]],
  [/ягодичный мост/,"Ягодицы",["Бицепс бедра"]],
  [/подъёмы на носки|икры сидя/,"Икры",["Бицепс бедра"]],
  [/пресс/,"Пресс",["Ягодицы"]]
 ];
 const found=rules.find(([re])=>re.test(n));
 return found?[found[1],...found[2]]:[];
}
function renderMuscleMap(){
 const totals=Object.fromEntries(Object.keys(MUSCLE_MAP).map(k=>[k,0]));
 const since=Date.now()-7*24*60*60*1000;
 [...state.logs.filter(x=>new Date(x.date).getTime()>=since),...activeWorkout].forEach(x=>{
   musclesForExercise(x.exercise).forEach((m,i)=>totals[m]+=i===0?1:0.5);
 });
 const max=Math.max(1,...Object.values(totals));
 const frontGroups=["Грудь","Плечи","Бицепс","Трицепс","Квадрицепс","Пресс"];
 const backGroups=["Спина","Плечи","Бицепс","Трицепс","Бицепс бедра","Ягодицы","Икры"];
 const body=(groups,side)=>groups.map((m,i)=>{const v=totals[m],opacity=v?Math.min(.35+v/max*.65,1):.13;return `<span class="muscle-chip" style="--muscle:${MUSCLE_COLORS[m]};--intensity:${opacity}">${m}</span>`}).join("");
 $("muscleFrontLegend").innerHTML=frontGroups.map(m=>muscleRow(m,totals[m])).join("");
 $("muscleBackLegend").innerHTML=backGroups.filter((m,i,a)=>a.indexOf(m)===i).map(m=>muscleRow(m,totals[m])).join("");
 if(window.MGC3D?.update){window.MGC3D.update(totals);}else{
  const front=$("muscleFront"),back=$("muscleBack");
  if(front&&back){front.innerHTML=muscleFigure("front",totals);back.innerHTML=muscleFigure("back",totals);}
 }
 $("musclePeriod").textContent="Последние 7 дней · оценка нагрузки по записанным подходам";
}
function muscleRow(m,v){
 const max=Math.max(1,...Object.values(MUSCLE_MAP).map(()=>0),...state.logs.filter(x=>new Date(x.date).getTime()>=Date.now()-7*86400000).flatMap(x=>musclesForExercise(x.exercise).map(()=>1)));
 const pct=Math.min(100,v/Math.max(4,max*4)*100);
 return `<div class="muscle-row"><span class="muscle-dot" style="background:${MUSCLE_COLORS[m]}"></span><span class="muscle-name">${m}</span><span class="muscle-track"><i style="width:${pct}%;background:${MUSCLE_COLORS[m]}"></i></span><b>${Number(v.toFixed(1))}</b></div>`;
}
let muscleSvgId=0;
function muscleFigure(side,totals){
 const front=side==="front",id="anatomy"+(++muscleSvgId),peak=Math.max(1,...Object.values(totals));
 const active=m=>totals[m]>0;
 const fill=m=>active(m)?MUSCLE_COLORS[m]:"#9da8b5";
 const opacity=m=>active(m)?Math.min(.82+.18*totals[m]/peak,.98):.34;
 const part=(m,d)=>'<path class="muscle-volume" d="'+d+'" fill="url(#'+id+'-'+(active(m)?"hot":"cool")+')" fill-opacity="'+opacity(m)+'" stroke="#f5f7fb" stroke-opacity=".56" stroke-width="1.15" stroke-linejoin="round"/>';
 const detail=d=>'<path d="'+d+'" fill="none" stroke="#f5f7fb" stroke-opacity=".42" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>';
 const anatomy='<path d="M139 66Q119 64 108 78L83 88Q58 91 47 116L24 193Q20 211 31 221Q42 230 51 211L73 151 77 221Q76 244 84 267L91 303 84 351 88 420 81 507Q79 526 94 531L119 531 143 431 150 352 157 431 181 531 206 531Q221 526 219 507L212 420 216 351 209 303 216 267Q224 244 223 221L227 151 249 211Q258 230 269 221Q280 211 276 193L253 116Q242 91 217 88L192 78Q181 64 161 66Z" fill="url(#'+id+'-skin)" stroke="#e6eaf0" stroke-opacity=".8" stroke-width="1.8"/>';
 const head='<path d="M130 24Q130 5 150 5Q170 5 170 24L167 53Q163 69 150 72Q137 69 133 53Z" fill="url(#'+id+'-skin)" stroke="#e6eaf0" stroke-opacity=".8" stroke-width="1.6"/><path d="M139 37Q150 41 161 37M143 53Q150 57 157 53M139 63L139 84Q150 94 161 84L161 63" fill="none" stroke="#fff" stroke-opacity=".24" stroke-width="1"/>';
 let muscles="";
 if(front){
  muscles+=part("Плечи","M129 91Q107 79 88 94Q69 109 77 137Q84 159 108 151Q126 143 137 125Z M171 91Q193 79 212 94Q231 109 223 137Q216 159 192 151Q174 143 163 125Z");
  muscles+=part("Грудь","M137 126Q119 119 103 132Q91 145 101 163Q113 180 145 181L149 137Z M163 126Q181 119 197 132Q209 145 199 163Q187 180 155 181L151 137Z");
  muscles+=part("Бицепс","M77 151Q91 143 104 160L94 218Q82 232 67 211L62 181Z M223 151Q209 143 196 160L206 218Q218 232 233 211L238 181Z");
  muscles+=part("Трицепс","M62 159Q75 147 86 160L77 218Q66 231 54 215L50 188Z M238 159Q225 147 214 160L223 218Q234 231 246 215L250 188Z");
  muscles+=part("Пресс","M139 184Q150 179 161 184L161 211Q150 217 139 211Z M139 216Q150 212 161 216L161 243Q150 249 139 243Z M139 248Q150 244 161 248L161 275Q150 281 139 275Z M139 280Q150 276 161 280L161 306Q150 311 139 306Z");
  muscles+=part("Пресс","M119 185Q130 181 137 188L133 270Q126 278 115 266L108 218Z M181 185Q170 181 163 188L167 270Q174 278 185 266L192 218Z");
  muscles+=part("Квадрицепс","M99 307Q119 294 145 309L139 375 128 440Q113 451 99 426L89 359Z M201 307Q181 294 155 309L161 375 172 440Q187 451 201 426L211 359Z M91 318Q82 331 88 382L101 433 112 442 116 371 110 322Z M209 318Q218 331 212 382L199 433 188 442 184 371 190 322Z");
  muscles+=part("Икры","M111 443Q126 436 143 450L136 505 122 539 105 520Z M189 443Q174 436 157 450L164 505 178 539 195 520Z");
  muscles+=detail("M88 111Q105 118 119 147M212 111Q195 118 181 147M104 151Q116 163 128 174M196 151Q184 163 172 174M150 186V300M121 195Q128 225 126 258M179 195Q172 225 174 258M104 327Q116 358 113 405M196 327Q184 358 187 405M121 456Q131 480 122 513M179 456Q169 480 178 513");
 }else{
  muscles+=part("Плечи","M129 91Q107 79 88 94Q69 109 77 137Q84 159 108 151L137 125Z M171 91Q193 79 212 94Q231 109 223 137Q216 159 192 151L163 125Z");
  muscles+=part("Спина","M137 118Q150 109 163 118L177 172 163 215 150 231 137 215 123 172Z");
  muscles+=part("Спина","M121 166Q137 157 146 183L141 292Q120 283 100 252L91 207Z M179 166Q163 157 154 183L159 292Q180 283 200 252L209 207Z");
  muscles+=part("Трицепс","M77 151Q91 143 104 160L94 218Q82 232 67 211L62 181Z M223 151Q209 143 196 160L206 218Q218 232 233 211L238 181Z");
  muscles+=part("Бицепс","M54 220Q68 211 81 226L72 269Q59 279 47 260Q44 239 54 220Z M246 220Q232 211 219 226L228 269Q241 279 253 260Q256 239 246 220Z");
  muscles+=part("Ягодицы","M111 287Q132 273 148 292L148 344Q132 369 105 345Q96 316 111 287Z M189 287Q168 273 152 292L152 344Q168 369 195 345Q204 316 189 287Z");
  muscles+=part("Бицепс бедра","M105 354Q126 343 145 358L139 430 126 476 104 447 96 394Z M195 354Q174 343 155 358L161 430 174 476 196 447 204 394Z");
  muscles+=part("Икры","M111 478Q126 468 143 485L136 522 122 548 105 533Z M189 478Q174 468 157 485L164 522 178 548 195 533Z");
  muscles+=detail("M150 98V285M91 111Q108 130 119 164M209 111Q192 130 181 164M108 186Q122 213 122 252M192 186Q178 213 178 252M112 300Q130 315 140 338M188 300Q170 315 160 338M115 370Q127 397 122 438M185 370Q173 397 178 438M121 490Q131 510 121 535M179 490Q169 510 179 535");
 }
 const overlays='<path d="M150 75V535M84 101Q105 91 127 105M216 101Q195 91 173 105M97 145Q116 133 136 143M203 145Q184 133 164 143M116 188Q128 180 139 187M184 188Q172 180 161 187" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="2" stroke-linecap="round"/><path d="M73 221Q62 233 64 247M227 221Q238 233 236 247M90 350Q101 357 111 351M210 350Q199 357 189 351M83 505Q98 514 112 506M217 505Q202 514 188 506" fill="none" stroke="#f8fafc" stroke-opacity=".34" stroke-width="1.2"/>';
 return '<svg class="body-figure anatomical-figure" viewBox="0 0 300 570" role="img" aria-label="'+(front?"Объёмная анатомическая карта мышц спереди":"Объёмная анатомическая карта мышц сзади")+'" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="'+id+'-skin" x1="0" y1="0" x2="1" y2=".8"><stop offset="0" stop-color="#f0c9b9"/><stop offset=".22" stop-color="#b9857e"/><stop offset=".48" stop-color="#e5b6a7"/><stop offset=".72" stop-color="#80535a"/><stop offset="1" stop-color="#d7a69a"/></linearGradient><linearGradient id="'+id+'-hot" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff8b98"/><stop offset=".28" stop-color="#f02c48"/><stop offset=".62" stop-color="#a90d2b"/><stop offset="1" stop-color="#ff5269"/></linearGradient><linearGradient id="'+id+'-cool" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e0e6ec"/><stop offset=".42" stop-color="#84909d"/><stop offset="1" stop-color="#4b5664"/></linearGradient><radialGradient id="'+id+'-shade"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient><filter id="'+id+'-shadow" x="-30%" y="-20%" width="160%" height="150%"><feGaussianBlur stdDeviation="5"/></filter></defs><ellipse cx="150" cy="550" rx="92" ry="10" fill="#000" opacity=".45" filter="url(#'+id+'-shadow)"/>'+anatomy+head+muscles+overlays+'</svg>';
}
function renderProgress(){
 const history=$("historyList"), select=$("progressExercise");
 const showError=(label,error)=>{
   console.error(label,error);
   if(history)history.innerHTML='<div class="panel"><b>Не удалось загрузить часть прогресса</b><p class="muted">'+escHtml(error&&error.message?error.message:String(error))+'</p><p class="muted">Обнови страницу и попробуй снова. Тренировочные данные не удалены.</p></div>';
 };
 try{renderStats()}catch(error){showError("Ошибка статистики прогресса",error)}
 try{renderMuscleMap()}catch(error){console.error("Ошибка карты мышц:",error);const f=$("muscleFrontLegend"),b=$("muscleBackLegend");if(f)f.innerHTML='<p class="muted">Карта мышц временно недоступна.</p>';if(b)b.innerHTML="";}
 try{
   const logs=Array.isArray(state.logs)?state.logs:[];
   const names=[...new Set(logs.map(x=>String(x.exercise||"Неизвестное упражнение")))];
   if(select){select.innerHTML=names.map(n=>'<option value="'+escHtml(n)+'">'+escHtml(n)+'</option>').join("");select.onchange=drawChart;}
   drawChart();
   if(history)history.innerHTML=logs.slice().reverse().slice(0,30).map(x=>'<div class="history-item"><b>'+escHtml(x.exercise)+'</b><p>'+new Date(x.date).toLocaleString((state.settings&&state.settings.language)==="en"?"en-US":(state.settings&&state.settings.language)==="cs"?"cs-CZ":"ru-RU")+' · '+escHtml(x.day)+'</p><strong>'+x.weight+' кг × '+x.reps+'</strong></div>').join("")||'<p class="muted">Пока нет сохранённых тренировок. Запиши подход и нажми «Завершить тренировку».</p>';
 }catch(error){showError("Ошибка журнала прогресса",error)}
}
function drawChart(){let select=$("progressExercise");let name=select?select.value:"";let arr=state.logs.filter(x=>x.exercise===name);if(!arr.length){$("progressChart").className="chart-empty";$("progressChart").textContent="Добавь результаты тренировок, чтобы увидеть график.";return}let best=arr.map(x=>+x.weight);let max=Math.max(...best,1),min=Math.min(...best);let w=320,h=150,pad=25;let pts=best.map((v,i)=>`${pad+i*(w-2*pad)/Math.max(best.length-1,1)},${h-pad-(v/max)*(h-2*pad)}`).join(" ");$("progressChart").className="";$("progressChart").innerHTML=`<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="График веса"><polyline points="${pts}" fill="none" stroke="#1c8b56" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${best.map((v,i)=>`<circle cx="${pad+i*(w-2*pad)/Math.max(best.length-1,1)}" cy="${h-pad-(v/max)*(h-2*pad)}" r="4" fill="#1c8b56"/>`).join("")}</svg><div class="muted">Последний вес: ${best[best.length-1]} кг · Лучший: ${max} кг · Записей: ${best.length}</div>`}
function renderPlan(){$("fullPlan").innerHTML=plans.map(p=>`<div class="plan-day"><h3>${p.name}<span class="tag">ДЕНЬ ${p.id}</span></h3><ul>${p.ex.map(e=>`<li>${e[0]} — ${e[1]} × ${e[2]}</li>`).join("")}</ul></div>`).join("")}
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll(".view").forEach(x=>x.classList.toggle("active",x.id==="view-"+b.dataset.tab));if(b.dataset.tab==="progress")renderProgress();if(b.dataset.tab==="nutrition")renderNutrition();if(b.dataset.scroll){setTimeout(()=>$(b.dataset.scroll)?.scrollIntoView({behavior:"smooth",block:"start"}),60)}});document.querySelectorAll("[data-open-tab]").forEach(b=>b.onclick=()=>document.querySelector('.tab[data-tab="'+b.dataset.openTab+'"]')?.click());if($("startWorkout"))$("startWorkout").onclick=()=>$("workoutArea").scrollIntoView({behavior:"smooth",block:"start"});if($("goWorkout"))$("goWorkout").onclick=()=>$("workoutArea").scrollIntoView({behavior:"smooth",block:"start"});
$("saveProfile").onclick=()=>{state.profile={...state.profile,bodyWeight:+$("bodyWeight").value,height:+$("height").value,age:+$("age").value,sex:$("sex").value,goal:$("goal").value,activity:$("activity").value,experience:$("experience").value,frequency:$("frequency").value,priority:$("priority").value};save();renderNutrition();alert("Профиль сохранён. Нормы КБЖУ пересчитаны.")};
$("exportData").onclick=()=>{let blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="my-gym-coach-backup.json";a.click();URL.revokeObjectURL(a.href)};
$("importData").onchange=async e=>{try{let obj=JSON.parse(await e.target.files[0].text());if(!Array.isArray(obj.logs)||!obj.profile)throw Error();state=obj;save();renderWorkout();renderProgress();alert("Данные импортированы.")}catch{alert("Не удалось прочитать резервную копию.")}};
$("bodyWeight").value=state.profile.bodyWeight;$("height").value=state.profile.height;$("age").value=state.profile.age;$("sex").value=state.profile.sex;$("goal").value=state.profile.goal;$("activity").value=state.profile.activity;$("experience").value=state.profile.experience;$("frequency").value=state.profile.frequency;$("priority").value=state.profile.priority;

function nutritionNumbers(){
 const p=state.profile,w=+p.bodyWeight,h=+p.height,age=+p.age;
 if(!(w>0&&h>0&&age>0))return null;
 const bmr=10*w+6.25*h-5*age+(p.sex==="male"?5:-161);
 const activity=({1.2:1.2,1.375:1.375,1.55:1.55,1.725:1.725,1.9:1.9})[p.activity]||1.55;
 const tdee=bmr*activity;
 const goal=p.goal||"Набор массы";
 const target=Math.round(tdee*(goal==="Набор массы"||goal==="Гипертрофия"||goal==="Сила и масса"?1.1:goal==="Снижение жира"?0.85:1));
 const protein=Math.round(w*(goal==="Снижение жира"?2:1.9));
 const fat=Math.round(w*.85);
 const carbs=Math.max(0,Math.round((target-protein*4-fat*9)/4));
 return {bmr:Math.round(bmr),tdee:Math.round(tdee),target,protein,fat,carbs};
}
function localDay(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function escHtml(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderNutrition(){
 const n=nutritionNumbers();if(!n)return;
 $("nutritionBmr").textContent=n.bmr.toLocaleString((state.settings&&state.settings.language)==="en"?"en-US":(state.settings&&state.settings.language)==="cs"?"cs-CZ":"ru-RU")+" ккал";
 $("nutritionTdee").textContent=n.tdee.toLocaleString((state.settings&&state.settings.language)==="en"?"en-US":(state.settings&&state.settings.language)==="cs"?"cs-CZ":"ru-RU")+" ккал";
 $("nutritionTarget").textContent=n.target.toLocaleString((state.settings&&state.settings.language)==="en"?"en-US":(state.settings&&state.settings.language)==="cs"?"cs-CZ":"ru-RU");
 const today=state.foodLog.filter(x=>x.date===localDay());
 const eaten=today.reduce((s,x)=>({kcal:s.kcal+x.kcal,p:s.p+x.p,f:s.f+x.f,c:s.c+x.c}),{kcal:0,p:0,f:0,c:0});
 $("nutritionEaten").textContent=Math.round(eaten.kcal);
 $("nutritionRemaining").textContent=Math.round(n.target-eaten.kcal);
 const vals=[["Белки",eaten.p,n.protein,"g"],["Жиры",eaten.f,n.fat,"g"],["Углеводы",eaten.c,n.carbs,"g"]];
 $("nutritionMacros").innerHTML=vals.map(([label,v,target,unit])=>{const pct=Math.min(100,Math.round(v/Math.max(target,1)*100));return '<div class="macro-row"><div><b>'+label+'</b><span>'+Math.round(v)+' / '+target+' '+unit+'</span></div><div class="macro-track"><i style="width:'+pct+'%"></i></div></div>'}).join("");
 $("foodList").innerHTML=today.slice().reverse().map(x=>'<div class="food-item"><div><b>'+escHtml(x.name)+'</b><small>'+x.kcal+' ккал · Б '+x.p+' · Ж '+x.f+' · У '+x.c+'</small></div><button type="button" class="food-delete" data-food-id="'+x.id+'" aria-label="Удалить">×</button></div>').join("")||'<p class="muted">Пока нет записей за сегодня.</p>';
 $("foodList").querySelectorAll("[data-food-id]").forEach(b=>b.onclick=()=>{state.foodLog=state.foodLog.filter(x=>String(x.id)!==b.dataset.foodId);save();renderNutrition()});
}
$("addFood").onclick=()=>{
 const name=$("foodName").value.trim(),kcal=+$("foodKcal").value,p=+$("foodProtein").value,f=+$("foodFat").value,c=+$("foodCarbs").value;
 if(!name||![kcal,p,f,c].every(Number.isFinite)||kcal<0||p<0||f<0||c<0){alert("Заполни название и корректные значения КБЖУ.");return}
 state.foodLog.push({id:Date.now(),date:localDay(),name,kcal,p,f,c});
 $("foodName").value="";$("foodKcal").value="";$("foodProtein").value="";$("foodFat").value="";$("foodCarbs").value="";
 save();renderNutrition();
};

renderWorkout();renderStats();renderPlan();renderProgress();renderNutrition();
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
        language:state.settings?.language||"ru",
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


/* MY GYM COACH — localization and personal settings */
const MGC_DEFAULT_SETTINGS={language:"ru",theme:"dark-red",background:"#07080b",panel:"#14151a",accent:"#ed1832",icons:"#ff4057",muscles:"#ed1832",text:"#f6f6f7",iconStyle:"standard",size:"normal",animations:true,sounds:false,rest:90};
state.settings={...MGC_DEFAULT_SETTINGS,...(state.settings||{})};
const MGC_I18N={
ru:{settingsEyebrow:"ПЕРСОНАЛИЗАЦИЯ",settingsTitle:"Настройки",settingsSubtitle:"Настрой приложение под себя.",language:"ЯЗЫК ПРИЛОЖЕНИЯ",interfaceLanguage:"Язык интерфейса",appearance:"ВНЕШНИЙ ВИД",theme:"Тема",backgroundColor:"Цвет фона",panelColor:"Цвет карточек и панелей",accentColor:"Основной акцент / кнопки",iconColor:"Цвет иконок",muscleColor:"Цвет активных мышц",textColor:"Цвет текста",iconStyle:"Стиль иконок",interfaceSize:"Размер интерфейса",experience:"ЭФФЕКТЫ И УДОБСТВО",animations:"Анимации",sounds:"Звуковые сигналы",restDuration:"Длительность отдыха между подходами (сек.)",startTimer:"Запустить таймер отдыха",dataSettings:"НАСТРОЙКИ И РЕЗЕРВНОЕ КОПИРОВАНИЕ",exportSettings:"Экспорт настроек",importSettings:"Импорт настроек",resetAppearance:"Сбросить оформление",settingsSafe:"Настройки сохраняются на этом устройстве и не удаляют историю тренировок, питание или профиль.",compact:"Компактный",normal:"Стандартный",large:"Увеличенный",standard:"Стандартный",minimal:"Минималистичный",detailed:"Детализированный",home:"Главная",workouts:"Тренировки",progress:"Прогресс",nutrition:"Питание",chat:"Чат",profile:"Профиль"},
en:{settingsEyebrow:"PERSONALIZATION",settingsTitle:"Settings",settingsSubtitle:"Make the app yours.",language:"APP LANGUAGE",interfaceLanguage:"Interface language",appearance:"APPEARANCE",theme:"Theme",backgroundColor:"Background color",panelColor:"Cards and panels color",accentColor:"Primary accent / buttons",iconColor:"Icon color",muscleColor:"Active muscle color",textColor:"Text color",iconStyle:"Icon style",interfaceSize:"Interface size",experience:"EFFECTS & COMFORT",animations:"Animations",sounds:"Sound alerts",restDuration:"Rest duration between sets (sec.)",startTimer:"Start rest timer",dataSettings:"SETTINGS & BACKUP",exportSettings:"Export settings",importSettings:"Import settings",resetAppearance:"Reset appearance",settingsSafe:"Settings are saved on this device and will not delete workout history, nutrition or your profile.",compact:"Compact",normal:"Standard",large:"Large",standard:"Standard",minimal:"Minimal",detailed:"Detailed",home:"Home",workouts:"Workouts",progress:"Progress",nutrition:"Nutrition",chat:"Chat",profile:"Profile"},
cs:{settingsEyebrow:"PŘIZPŮSOBENÍ",settingsTitle:"Nastavení",settingsSubtitle:"Přizpůsobte si aplikaci.",language:"JAZYK APLIKACE",interfaceLanguage:"Jazyk rozhraní",appearance:"VZHLED",theme:"Motiv",backgroundColor:"Barva pozadí",panelColor:"Barva karet a panelů",accentColor:"Hlavní zvýraznění / tlačítka",iconColor:"Barva ikon",muscleColor:"Barva aktivních svalů",textColor:"Barva textu",iconStyle:"Styl ikon",interfaceSize:"Velikost rozhraní",experience:"EFEKTY A POHODLÍ",animations:"Animace",sounds:"Zvuková upozornění",restDuration:"Délka odpočinku mezi sériemi (s)",startTimer:"Spustit časovač odpočinku",dataSettings:"NASTAVENÍ A ZÁLOHA",exportSettings:"Exportovat nastavení",importSettings:"Importovat nastavení",resetAppearance:"Obnovit vzhled",settingsSafe:"Nastavení se ukládá v tomto zařízení a nesmaže historii tréninků, výživu ani profil.",compact:"Kompaktní",normal:"Standardní",large:"Zvětšené",standard:"Standardní",minimal:"Minimalistický",detailed:"Detailní",home:"Domů",workouts:"Tréninky",progress:"Pokrok",nutrition:"Výživa",chat:"Chat",profile:"Profil"}
};
const MGC_TRANSLATIONS={
"Главная":["Home","Domů"],"Тренировки":["Workouts","Tréninky"],"Прогресс":["Progress","Pokrok"],"Питание":["Nutrition","Výživa"],"Чат":["Chat","Chat"],"Профиль":["Profile","Profil"],"ТВОЯ СИЛА. ТВОЙ ПУТЬ.":["YOUR STRENGTH. YOUR JOURNEY.","TVÁ SÍLA. TVÁ CESTA."],"Тренируйся умнее. Становись сильнее.":["Train smarter. Get stronger.","Trénuj chytřeji. Sílej."],"Начать тренировку":["Start workout","Začít trénink"],"ПЛАН НА СЕГОДНЯ":["TODAY'S PLAN","DNEŠNÍ PLÁN"],"Твоя следующая тренировка":["Your next workout","Tvůj další trénink"],"Упражнения":["Exercises","Cviky"],"Вес, кг":["Weight, kg","Váha, kg"],"Повторения":["Reps","Opakování"],"Заметка":["Note","Poznámka"],"Записать подход":["Log set","Zapsat sérii"],"Отметить упражнение выполненным":["Mark exercise as complete","Označit cvik jako dokončený"],"Завершить тренировку":["Finish workout","Dokončit trénink"],"ТВОИ РЕЗУЛЬТАТЫ":["YOUR RESULTS","TVOJE VÝSLEDKY"],"Каждая тренировка приближает к цели.":["Every workout brings you closer to your goal.","Každý trénink tě přibližuje k cíli."],"ДНЕВНИК ПИТАНИЯ":["FOOD DIARY","JÍDELNÍČEK"],"Добавить продукт или блюдо":["Add food or meal","Přidat potravinu nebo jídlo"],"Название":["Name","Název"],"Калории, ккал":["Calories, kcal","Kalorie, kcal"],"Белки, г":["Protein, g","Bílkoviny, g"],"Жиры, г":["Fat, g","Tuky, g"],"Углеводы, г":["Carbs, g","Sacharidy, g"],"Добавить в дневник":["Add to diary","Přidat do deníku"],"AI-тренер":["AI Coach","AI trenér"],"Персональные рекомендации на основе твоих результатов.":["Personalized recommendations based on your results.","Osobní doporučení na základě tvých výsledků."],"Отправить тренеру ↗":["Send to coach ↗","Odeslat trenérovi ↗"],"ТВОЙ ВОПРОС":["YOUR QUESTION","TVŮJ DOTAZ"],"Профиль":["Profile","Profil"],"Настрой тренировки под свои цели.":["Set up your training around your goals.","Přizpůsob trénink svým cílům."],"Твои параметры и тренировочные предпочтения":["Your stats and training preferences","Tvé údaje a tréninkové preference"],"Вес тела, кг":["Body weight, kg","Tělesná hmotnost, kg"],"Рост, см":["Height, cm","Výška, cm"],"Возраст":["Age","Věk"],"Пол":["Sex","Pohlaví"],"Мужской":["Male","Muž"],"Женский":["Female","Žena"],"Цель":["Goal","Cíl"],"Набор массы":["Muscle gain","Nabírání svalů"],"Поддержание веса":["Maintenance","Udržení hmotnosti"],"Снижение жира":["Fat loss","Redukce tuku"],"Рекомпозиция":["Recomposition","Rekompozice"],"Начинающий":["Beginner","Začátečník"],"Средний":["Intermediate","Pokročilý"],"Продвинутый":["Advanced","Pokročilý"],"Резервная копия":["Backup","Záloha"],"Экспорт данных ↓":["Export data ↓","Exportovat data ↓"],"Импорт данных ↑":["Import data ↑","Importovat data ↑"],"ТРЕНИРОВОК":["WORKOUTS","TRÉNINKŮ"],"ПОДХОДОВ":["SETS","SÉRIÍ"],"ОБЪЁМ, КГ":["VOLUME, KG","OBJEM, KG"],"ПРОГРАММА":["PROGRAM","PROGRAM"],"СОВЕТ AI-ТРЕНЕРА":["AI COACH TIP","TIP AI TRENÉRA"],"ПРОГРАММА ДНЯ":["TODAY'S PROGRAM","DNEŠNÍ PROGRAM"],"Запись результата":["Log result","Záznam výsledku"],"Твой вопрос":["Your question","Tvůj dotaz"],"Подключение настроено":["Connection configured","Připojení nastaveno"]
,"Жим штанги лёжа":["Barbell bench press","Bench-press s velkou činkou"]
,"Тяга верхнего блока":["Lat pulldown","Stahování horní kladky"]
,"Жим гантелей под наклоном":["Incline dumbbell press","Tlaky s jednoručkami na šikmé lavici"]
,"Горизонтальная тяга":["Seated cable row","Veslování na kladce"]
,"Подъём гантелей в стороны":["Dumbbell lateral raise","Upažování s jednoručkami"]
,"Сгибание рук EZ":["EZ-bar curl","Bicepsový zdvih s EZ osou"]
,"Разгибание рук на блоке":["Cable triceps pushdown","Stahování kladky na triceps"]
,"Приседания":["Squats","Dřepy"]
,"Румынская тяга":["Romanian deadlift","Rumunský mrtvý tah"]
,"Жим ногами":["Leg press","Leg press"]
,"Сгибание ног":["Leg curl","Zakopávání"]
,"Подъёмы на носки":["Calf raises","Výpony na lýtka"]
,"Пресс":["Abs","Břicho"]
,"Подтягивания / верхний блок":["Pull-ups / lat pulldown","Shyby / stahování horní kladky"]
,"Жим в тренажёре на грудь":["Chest press machine","Tlak na prsa ve stroji"]
,"Тяга с упором грудью":["Chest-supported row","Přítahy s oporou hrudníku"]
,"Жим гантелей сидя":["Seated dumbbell shoulder press","Tlaky s jednoručkami vsedě"]
,"Обратная бабочка":["Reverse pec deck","Rozpažování obráceně na stroji"]
,"Молотковые сгибания":["Hammer curls","Kladivové zdvihy"]
,"Разгибание рук из-за головы":["Overhead triceps extension","Tricepsové extenze nad hlavou"]
,"Гакк-приседания":["Hack squats","Hack dřepy"]
,"Ягодичный мост":["Glute bridge","Glute bridge"]
,"Болгарские выпады":["Bulgarian split squats","Bulharské dřepy"]
,"Сгибание ног лёжа":["Lying leg curl","Zakopávání vleže"]
,"Разгибание ног":["Leg extension","Předkopávání"]
,"Икры сидя":["Seated calf raises","Výpony na lýtka vsedě"]
,"Жим гантелей на наклонной":["Incline dumbbell press","Tlaky s jednoručkami na šikmé lavici"]
,"Тяга верхнего блока нейтральным хватом":["Neutral-grip lat pulldown","Stahování horní kladky neutrálním úchopem"]
,"Сведение рук в кроссовере":["Cable fly","Rozpažování na kladkách"]
,"Горизонтальная тяга блока":["Seated cable row","Veslování na kladce"]
,"Сгибание рук на скамье Скотта":["Preacher curl","Bicepsový zdvih na Scottově lavici"]
,"Грудь":["Chest","Hrudník"],"Спина":["Back","Záda"],"Плечи":["Shoulders","Ramena"],"Бицепс":["Biceps","Biceps"],"Трицепс":["Triceps","Triceps"],"Квадрицепс":["Quadriceps","Kvadriceps"],"Бицепс бедра":["Hamstrings","Hamstringy"],"Ягодицы":["Glutes","Hýždě"]

};
Object.assign(MGC_TRANSLATIONS,{"Тренируйся умнее. Становись сильнее.":["Train smarter. Get stronger.","Trénuj chytřeji. Sílej."],"Твоя следующая тренировка":["Your next workout","Tvůj další trénink"],"Сохраняй технику и постепенно увеличивай нагрузку.":["Keep good form and gradually increase the load.","Udržuj správnou techniku a postupně zvyšuj zátěž."],"Тренировок":["Workouts","Tréninků"],"Объём, кг":["Volume, kg","Objem, kg"],"Подходов":["Sets","Série"],"Пока нет истории для этого упражнения. Начни с комфортного веса и оставляй 2–3 повтора в запасе.":["No history for this exercise yet. Start with a comfortable weight and leave 2–3 reps in reserve.","Pro tento cvik zatím nemáš historii. Začni s pohodlnou váhou a nech si rezervu 2–3 opakování."],"Последний записанный подход:":["Last recorded set:","Poslední zaznamenaná série:"],"Последний результат:":["Last result:","Poslední výsledek:"],"Если все рабочие подходы были уверенными и техника стабильна, попробуй прибавить минимальный шаг веса.":["If all working sets felt solid and your form was stable, try the smallest weight increase.","Pokud byly všechny pracovní série jisté a technika stabilní, zkus nejmenší možné zvýšení váhy."],"Сначала постарайся добавить 1 повтор при том же весе. Твой лучший записанный вес:":["First try to add 1 rep at the same weight. Your best recorded weight:","Nejprve zkus přidat 1 opakování se stejnou váhou. Tvá nejlepší zaznamenaná váha:"],"Мышцы в этом упражнении":["Muscles used in this exercise","Svaly zapojené při tomto cviku"],"Красный — основная нагрузка · приглушённый — дополнительно":["Red — primary target · muted — secondary","Červená — hlavní zapojení · tlumená — doplňkové"],"основная":["primary","hlavní"],"дополнительная":["secondary","doplňkové"],"Фото-пример":["Exercise photo","Ukázková fotografie"],"Для этого упражнения пока нет проверенного фото в открытой библиотеке":["No verified photo is available for this exercise yet.","Pro tento cvik zatím není dostupná ověřená fotografie."],"ОБОРУДОВАНИЕ":["EQUIPMENT","VYBAVENÍ"],"ОСНОВНАЯ НАГРУЗКА":["PRIMARY MUSCLES","HLAVNÍ ZAPOJENÍ"],"ДОПОЛНИТЕЛЬНО":["SECONDARY MUSCLES","DOPLŇKOVÉ ZAPOJENÍ"],"Как выполнять":["How to perform","Jak cvik provádět"],"источник и лицензия":["source and license","zdroj a licence"],"Спереди":["Front","Zepředu"],"Сзади":["Back","Zezadu"],"Сбоку":["Side","Z boku"],"Проводи пальцем, чтобы вращать модель · двумя пальцами — масштаб":["Drag to rotate the model · pinch with two fingers to zoom","Tažením otáčej modelem · dvěma prsty přibližuj"],"ПЕРЕДНЯЯ ГРУППА":["FRONT MUSCLE GROUP","PŘEDNÍ SVALOVÁ SKUPINA"],"ЗАДНЯЯ ГРУППА":["BACK MUSCLE GROUP","ZADNÍ SVALOVÁ SKUPINA"],"Подсветка отражает нагрузку по записанным упражнениям за последние 7 дней.":["Highlights show training load from logged exercises over the last 7 days.","Zvýraznění ukazuje zatížení podle zaznamenaných cviků za posledních 7 dní."],"Не удалось загрузить часть прогресса":["Could not load some progress data","Nepodařilo se načíst část pokroku"],"Обнови страницу и попробуй снова. Тренировочные данные не удалены.":["Refresh the page and try again. Your workout data has not been deleted.","Obnov stránku a zkus to znovu. Tréninková data nebyla smazána."],"Карта мышц временно недоступна.":["Muscle map is temporarily unavailable.","Mapa svalů je dočasně nedostupná."],"Пока нет сохранённых тренировок. Запиши подход и нажми «Завершить тренировку».":["No saved workouts yet. Log a set and tap “Finish workout”.","Zatím nemáš uložené tréninky. Zaznamenej sérii a klepni na „Dokončit trénink“."],"Добавь результаты тренировок, чтобы увидеть график.":["Log workout results to see the chart.","Zaznamenej výsledky tréninku a zobrazí se graf."],"Последний вес:":["Latest weight:","Poslední váha:"],"Лучший:":["Best:","Nejlepší:"],"Записей:":["Entries:","Záznamů:"],"План тренировок":["Workout plan","Tréninkový plán"],"Цикл через день: 3 тренировки верха и 2 тренировки низа за 8 дней.":["Every-other-day cycle: 3 upper-body and 2 lower-body workouts over 8 days.","Cyklus obden: 3 tréninky horní části těla a 2 tréninky dolní části těla během 8 dní."],"Калории и КБЖУ":["Calories and macros","Kalorie a makroživiny"],"Персональные ориентиры по твоему профилю и цели.":["Personal targets based on your profile and goal.","Osobní cíle podle tvého profilu a záměru."],"ЦЕЛЬ НА ДЕНЬ":["DAILY TARGET","DENNÍ CÍL"],"Съедено:":["Consumed:","Snědeno:"],"Осталось:":["Remaining:","Zbývá:"],"ОСНОВНОЙ ОБМЕН":["BASAL METABOLIC RATE","BAZÁLNÍ METABOLISMUS"],"РАСХОД ЗА ДЕНЬ":["DAILY ENERGY EXPENDITURE","DENNÍ VÝDEJ"],"ТВОИ МАКРОНУТРИЕНТЫ":["YOUR MACROS","TVÉ MAKROŽIVINY"],"Расчёт — ориентир по формуле Mifflin–St Jeor. Реальный расход может отличаться; корректируй норму по динамике веса за 2–3 недели.":["Estimate based on the Mifflin–St Jeor equation. Actual expenditure may differ; adjust your target based on 2–3 weeks of weight trends.","Odhad podle rovnice Mifflin–St Jeor. Skutečný výdej se může lišit; cíl uprav podle vývoje hmotnosti za 2–3 týdny."],"Добавить продукт или блюдо":["Add food or meal","Přidat potravinu nebo jídlo"],"Например, куриная грудка":["e.g. chicken breast","např. kuřecí prsa"],"СЕГОДНЯ":["TODAY","DNES"],"Пока нет записей за сегодня.":["No entries for today yet.","Pro dnešek zatím žádné záznamy."],"Персональные рекомендации на основе твоих результатов.":["Personalized recommendations based on your results.","Osobní doporučení podle tvých výsledků."],"ТВОЙ ПЕРСОНАЛЬНЫЙ ТРЕНЕР":["YOUR PERSONAL COACH","TVŮJ OSOBNÍ TRENÉR"],"Анализирую профиль, тренировки и динамику рабочих весов.":["I analyze your profile, workouts and working-weight trends.","Analyzuji tvůj profil, tréninky a vývoj pracovních vah."],"Привет! Я твой AI-тренер. Могу разобрать прогресс, предложить рабочие веса и помочь скорректировать тренировку. С чего начнём?":["Hi! I’m your AI coach. I can review your progress, suggest working weights and help adjust your workout. Where shall we start?","Ahoj! Jsem tvůj AI trenér. Mohu vyhodnotit pokrok, navrhnout pracovní váhy a upravit trénink. Čím začneme?"],"Подключение настроено":["Connection configured","Připojení nastaveno"],"Связь с AI активна":["AI connection active","Spojení s AI je aktivní"],"AI-тренер подключён":["AI coach connected","AI trenér připojen"],"Тренер думает…":["Coach is thinking…","Trenér přemýšlí…"],"Не удалось получить ответ от тренера.":["Could not get a response from the coach.","Nepodařilo se získat odpověď trenéra."],"Не удалось получить ответ:":["Could not get a response:","Nepodařilo se získat odpověď:"],"Проверь подключение и попробуй ещё раз.":["Check your connection and try again.","Zkontroluj připojení a zkus to znovu."],"Ошибка соединения":["Connection error","Chyba připojení"],"ТВОЙ ВОПРОС":["YOUR QUESTION","TVŮJ DOTAZ"],"Отправить тренеру":["Send to coach","Odeslat trenérovi"],"МОЙ ПРОФИЛЬ":["MY PROFILE","MŮJ PROFIL"],"Твои параметры и тренировочные предпочтения":["Your stats and training preferences","Tvé údaje a tréninkové preference"],"Общая дневная активность":["Daily activity level","Celková denní aktivita"],"Низкая — почти весь день сижу":["Low — mostly sedentary","Nízká — většinu dne sedím"],"Лёгкая — немного хожу":["Light — some walking","Lehká — trochu chodím"],"Средняя — регулярно двигаюсь":["Moderate — regularly active","Střední — pravidelně se hýbu"],"Высокая — активная работа/много шагов":["High — active job/many steps","Vysoká — aktivní práce/hodně kroků"],"Очень высокая — тяжёлая работа":["Very high — physical job","Velmi vysoká — fyzicky náročná práce"],"Опыт тренировок":["Training experience","Tréninkové zkušenosti"],"Тренировок в неделю":["Workouts per week","Tréninků týdně"],"Приоритетная группа мышц":["Priority muscle group","Prioritní svalová partie"],"Равномерное развитие":["Balanced development","Rovnoměrný rozvoj"],"Верх тела":["Upper body","Horní část těla"],"Ноги":["Legs","Nohy"],"Профиль сохранён. Нормы КБЖУ пересчитаны.":["Profile saved. Macro targets recalculated.","Profil uložen. Cílové hodnoty makroživin byly přepočítány."],"Данные импортированы.":["Data imported.","Data byla importována."],"Не удалось прочитать резервную копию.":["Could not read backup file.","Zálohu se nepodařilo přečíst."],"Заполни название и корректные значения КБЖУ.":["Enter a name and valid macro values.","Zadej název a platné hodnoty makroživin."],"Введи корректный вес и количество повторений.":["Enter a valid weight and number of reps.","Zadej platnou váhu a počet opakování."],"Сначала запиши хотя бы один подход.":["Log at least one set first.","Nejprve zaznamenej alespoň jednu sérii."],"Тренировка сохранена! Отличная работа.":["Workout saved! Great work.","Trénink uložen! Skvělá práce."],"Настройки сохраняются на этом устройстве и не удаляют историю тренировок, питание или профиль.":["Settings are saved on this device and do not delete workout history, nutrition or your profile.","Nastavení se ukládá v tomto zařízení a nesmaže historii tréninků, výživu ani profil."],"Неизвестное упражнение":["Unknown exercise","Neznámý cvik"],"Тренировка":["Workout","Trénink"],"Карта мышц":["Muscle map","Mapa svalů"],"Динамика рабочих весов":["Working weight trends","Vývoj pracovních vah"],"История лучших записанных подходов.":["History of your best logged sets.","Historie nejlepších zaznamenaných sérií."],"Последние записи":["Latest entries","Poslední záznamy"],"Журнал":["LOG","DENÍK"],"Анализ тела":["BODY ANALYSIS","ANALÝZA TĚLA"],"Сила и динамика":["STRENGTH & TRENDS","SÍLA A VÝVOJ"],"ПРОГРАММА ДНЯ":["TODAY'S PROGRAM","DNEŠNÍ PROGRAM"]});
Object.assign(MGC_TRANSLATIONS,{"ВЕРХ A":["UPPER A","HORNÍ ČÁST A"],"НИЗ A":["LOWER A","DOLNÍ ČÁST A"],"ВЕРХ B":["UPPER B","HORNÍ ČÁST B"],"НИЗ B":["LOWER B","DOLNÍ ČÁST B"],"ВЕРХ C":["UPPER C","HORNÍ ČÁST C"],"ДЕНЬ":["DAY","DEN"],"УПРАЖНЕНИЙ":["EXERCISES","CVIKŮ"],"подхода":["sets","série"],"подход":["Set","Série"],"повторений":["reps","opakování"],"Жим штанги лёжа":["Barbell bench press","Bench press s velkou činkou"],"Тяга верхнего блока":["Lat pulldown","Stahování horní kladky"],"Жим гантелей под наклоном":["Incline dumbbell press","Tlaky s jednoručkami na šikmé lavici"],"Горизонтальная тяга":["Seated cable row","Přítahy spodní kladky"],"Подъём гантелей в стороны":["Dumbbell lateral raise","Upažování s jednoručkami"],"Сгибание рук EZ":["EZ-bar curl","Bicepsový zdvih s EZ osou"],"Разгибание рук на блоке":["Cable triceps pushdown","Stahování kladky na triceps"],"Приседания":["Squats","Dřepy"],"Румынская тяга":["Romanian deadlift","Rumunský mrtvý tah"],"Жим ногами":["Leg press","Leg press"],"Сгибание ног":["Leg curl","Zakopávání"],"Подъёмы на носки":["Calf raises","Výpony na lýtka"],"Пресс":["Abs","Břicho"],"Подтягивания / верхний блок":["Pull-ups / lat pulldown","Shyby / stahování horní kladky"],"Жим в тренажёре на грудь":["Chest press machine","Tlaky na prsním stroji"],"Тяга с упором грудью":["Chest-supported row","Přítahy s oporou hrudníku"],"Жим гантелей сидя":["Seated dumbbell shoulder press","Tlaky s jednoručkami vsedě"],"Обратная бабочка":["Reverse pec deck","Zadní rozpažování na stroji"],"Молотковые сгибания":["Hammer curls","Kladivové zdvihy"],"Разгибание рук из-за головы":["Overhead triceps extension","Tricepsové extenze nad hlavou"],"Гакк-приседания":["Hack squats","Hack dřepy"],"Ягодичный мост":["Hip thrust","Hip thrust"],"Болгарские выпады":["Bulgarian split squats","Bulharské dřepy"],"Сгибание ног лёжа":["Lying leg curl","Zakopávání vleže"],"Разгибание ног":["Leg extension","Předkopávání"],"Икры сидя":["Seated calf raise","Výpony vsedě"],"Жим гантелей на наклонной":["Incline dumbbell press","Tlaky s jednoručkami na šikmé lavici"],"Тяга верхнего блока нейтральным хватом":["Neutral-grip lat pulldown","Stahování horní kladky neutrálním úchopem"],"Сведение рук в кроссовере":["Cable chest fly","Stahování kladek na prsa"],"Горизонтальная тяга блока":["Seated cable row","Přítahy spodní kladky"],"Сгибание рук на скамье Скотта":["Preacher curl","Bicepsový zdvih na Scottově lavici"],"Грудь":["Chest","Hrudník"],"Спина":["Back","Záda"],"Плечи":["Shoulders","Ramena"],"Бицепс":["Biceps","Biceps"],"Трицепс":["Triceps","Triceps"],"Квадрицепс":["Quadriceps","Kvadricepsy"],"Бицепс бедра":["Hamstrings","Hamstringy"],"Ягодицы":["Glutes","Hýždě"],"Икры":["Calves","Lýtka"],"Мышцы в этом упражнении":["Muscles worked in this exercise","Svaly zapojené při tomto cviku"],"Красный — основная нагрузка · приглушённый — дополнительно":["Red — primary · muted — secondary","Červená — hlavní · tlumená — doplňková"],"Оборудование":["Equipment","Vybavení"],"Штанга и скамья":["Barbell and bench","Velká činka a lavice"],"Гантели и наклонная скамья":["Dumbbells and incline bench","Jednoručky a šikmá lavice"],"Тренажёр для жима":["Chest press machine","Stroj na tlaky"],"Кроссовер":["Cable crossover","Protisměrné kladky"],"Верхний блок / турник":["Lat pulldown / pull-up bar","Horní kladka / hrazda"],"Горизонтальный блок":["Seated cable row","Spodní kladka"],"Гантели":["Dumbbells","Jednoručky"],"EZ-гриф":["EZ bar","EZ osa"],"Верхний блок с рукоятью":["Cable machine with handle","Horní kladka s adaptérem"],"Тренажёр обратная бабочка":["Reverse pec deck machine","Stroj na zadní delty"],"Тренажёр жим ногами":["Leg press machine","Leg press"],"Тренажёр сгибания ног":["Leg curl machine","Stroj na zakopávání"],"Тренажёр для икр / платформа":["Calf machine / platform","Stroj na lýtka / platforma"],"Как выполнять":["How to perform","Jak cvik provádět"],"Фото-пример":["Exercise example","Ukázka cviku"],"источник и лицензия":["source and license","zdroj a licence"],"ОСНОВНАЯ НАГРУЗКА":["PRIMARY MUSCLES","HLAVNÍ ZAPOJENÍ"],"ДОПОЛНИТЕЛЬНО":["SECONDARY MUSCLES","DOPLŇKOVÉ ZAPOJENÍ"],"основная":["primary","hlavní"],"дополнительная":["secondary","doplňková"],"Последний записанный подход:":["Last logged set:","Poslední zaznamenaná série:"],"Последний результат:":["Latest result:","Poslední výsledek:"],"Последний вес:":["Latest weight:","Poslední váha:"],"Лучший:":["Best:","Nejlepší:"],"Записей:":["Entries:","Záznamů:"],"График веса":["Weight chart","Graf hmotnosti"],"Добавь результаты тренировок, чтобы увидеть график.":["Log workout results to see the chart.","Zaznamenej výsledky tréninku a zobrazí se graf."],"Пока нет сохранённых тренировок. Запиши подход и нажми «Завершить тренировку».":["No saved workouts yet. Log a set and tap “Finish workout”.","Zatím nemáš uložené tréninky. Zaznamenej sérii a klepni na „Dokončit trénink“."],"Не удалось загрузить часть прогресса":["Could not load some progress data","Nepodařilo se načíst část pokroku"],"Обнови страницу и попробуй снова. Тренировочные данные не удалены.":["Refresh the page and try again. Your workout data has not been deleted.","Obnov stránku a zkus to znovu. Tréninková data nebyla smazána."],"Карта мышц временно недоступна.":["Muscle map is temporarily unavailable.","Mapa svalů je dočasně nedostupná."],"Калории, ккал":["Calories, kcal","Kalorie, kcal"],"Белки, г":["Protein, g","Bílkoviny, g"],"Жиры, г":["Fat, g","Tuky, g"],"Углеводы, г":["Carbs, g","Sacharidy, g"],"Белки":["Protein","Bílkoviny"],"Жиры":["Fat","Tuky"],"Углеводы":["Carbs","Sacharidy"],"ккал":["kcal","kcal"],"Съедено:":["Consumed:","Snědeno:"],"Осталось:":["Remaining:","Zbývá:"],"ОСНОВНОЙ ОБМЕН":["BASAL METABOLIC RATE","BAZÁLNÍ METABOLISMUS"],"РАСХОД ЗА ДЕНЬ":["DAILY ENERGY EXPENDITURE","DENNÍ VÝDEJ"],"ТВОИ МАКРОНУТРИЕНТЫ":["YOUR MACROS","TVÉ MAKROŽIVINY"],"Пока нет записей за сегодня.":["No entries for today yet.","Pro dnešek zatím žádné záznamy."],"Заполни название и корректные значения КБЖУ.":["Enter a name and valid calorie and macro values.","Zadej název a platné hodnoty kalorií a makroživin."],"Профиль сохранён. Нормы КБЖУ пересчитаны.":["Profile saved. Calorie and macro targets recalculated.","Profil uložen. Cílové hodnoty kalorií a makroživin byly přepočítány."],"Добавить в дневник":["Add to diary","Přidat do deníku"],"Название":["Name","Název"],"Например, куриная грудка":["e.g. chicken breast","např. kuřecí prsa"],"ЦЕЛЬ НА ДЕНЬ":["DAILY TARGET","DENNÍ CÍL"],"План тренировок":["Workout plan","Tréninkový plán"],"История лучших записанных подходов.":["History of your best logged sets.","Historie nejlepších zaznamenaných sérií."]});
const mgcOriginalText=new WeakMap();
const mgcOriginalAttrs=new WeakMap();
Object.assign(MGC_TRANSLATIONS,{"Грудные мышцы":["Pectoral muscles","Prsní svaly"],"Верх груди":["Upper chest","Horní část hrudníku"],"Передняя дельта":["Front deltoid","Přední deltový sval"],"Средняя дельта":["Lateral deltoid","Boční deltový sval"],"Задняя дельта":["Rear deltoid","Zadní deltový sval"],"Широчайшие мышцы спины":["Latissimus dorsi","Široký sval zádový"],"Средняя часть спины":["Mid-back","Střed zad"],"Квадрицепсы":["Quadriceps","Kvadricepsy"],"Задняя поверхность бедра":["Hamstrings","Zadní strana stehen"],"Мышцы живота":["Abdominal muscles","Břišní svaly"],"Плечевая мышца":["Brachialis","Pažní sval"],"Ромбовидные мышцы":["Rhomboids","Rombické svaly"],"Стабилизаторы и мышцы-синергисты":["Stabilizers and synergists","Stabilizátory a synergisté"],"Целевая группа зависит от варианта":["Target muscles depend on the variation","Cílové svaly závisí na variantě"],"Тренажёр или свободный вес":["Machine or free weights","Stroj nebo volné váhy"],"Тренажёр тяги с упором грудью":["Chest-supported row machine","Přítahový stroj s oporou hrudníku"],"Скамья Скотта и EZ-гриф / гантель":["Preacher bench and EZ bar / dumbbell","Scottova lavice a EZ osa / jednoručka"],"Канат верхнего блока / гантель":["Cable rope / dumbbell","Lano horní kladky / jednoručka"],"Ляг на скамью, сведи и опусти лопатки, стопы уверенно поставь на пол.":["Lie on the bench, retract and lower your shoulder blades, and plant your feet firmly on the floor.","Lehni si na lavici, stáhni a spusť lopatky a pevně polož chodidla na zem."],"Возьми гриф чуть шире плеч; запястья держи над локтями.":["Grip the bar slightly wider than shoulder-width; keep your wrists above your elbows.","Uchop osu o něco šíře než na šířku ramen; zápěstí drž nad lokty."],"Опускай гриф подконтрольно к нижней/средней части груди.":["Lower the bar under control toward the lower/middle chest.","Spouštěj osu kontrolovaně ke spodní/střední části hrudníku."],"Выжми вверх, не теряя положения лопаток и не отбивая гриф от груди.":["Press up without losing your shoulder-blade position or bouncing the bar off your chest.","Vytlač osu vzhůru, aniž bys změnil polohu lopatek nebo odrážel osu od hrudníku."],"Не отрывай таз от скамьи. Не проверяй максимум в одиночку без страховки.":["Keep your hips on the bench. Do not test your max alone without a spotter.","Nezvedej pánev z lavice. Nezkoušej maximum o samotě bez dopomoci."],"Настрой оборудование под свой рост и амплитуду.":["Adjust the equipment to your height and range of motion.","Nastav vybavení podle své výšky a rozsahu pohybu."],"Займи устойчивое положение и напряги корпус.":["Take a stable position and brace your core.","Zaujmi stabilní polohu a zpevni střed těla."],"Выполняй движение плавно, без рывков и боли.":["Move smoothly without jerking or pain.","Pohyb prováděj plynule, bez trhání a bolesti."],"Возвращай вес под контролем.":["Return the weight under control.","Vracej zátěž kontrolovaně."],"Начни с лёгкого веса и попроси тренера в зале проверить технику.":["Start with a light weight and ask a gym trainer to check your technique.","Začni s lehkou váhou a požádej trenéra v posilovně o kontrolu techniky."],"Начни с комфортного веса и оставляй 2–3 повтора в запасе.":["Start with a comfortable weight and keep 2–3 reps in reserve.","Začni s pohodlnou váhou a nech si rezervu 2–3 opakování."],"Добавить подход":["Add set","Přidat sérii"],"Завершить упражнение":["Finish exercise","Dokončit cvik"],"Завершить тренировку":["Finish workout","Dokončit trénink"],"Вес, кг":["Weight, kg","Váha, kg"],"Повторения":["Repetitions","Opakování"],"Заметки":["Notes","Poznámky"],"Отдых между подходами":["Rest between sets","Odpočinek mezi sériemi"],"КБЖУ":["Calories & macros","Kalorie a makroživiny"],"Калории":["Calories","Kalorie"],"Продукт или блюдо":["Food or meal","Potravina nebo jídlo"],"Добавить продукт":["Add food","Přidat potravinu"],"Удалить":["Delete","Smazat"],"Дневник питания":["Food diary","Jídelní deník"],"Норма белка":["Protein target","Cíl bílkovin"],"Норма жиров":["Fat target","Cíl tuků"],"Норма углеводов":["Carb target","Cíl sacharidů"],"Расчёт — ориентир по формуле Mifflin–St Jeor. Реальный расход может отличаться; корректируй норму по динамике веса за 2–3 недели.":["Estimate based on the Mifflin–St Jeor equation. Actual expenditure may vary; adjust your target based on weight trends over 2–3 weeks.","Odhad podle rovnice Mifflin–St Jeor. Skutečný výdej se může lišit; uprav cíl podle vývoje hmotnosti během 2–3 týdnů."],"Объём, кг":["Volume, kg","Objem, kg"],"Тренировок":["Workouts","Tréninků"],"Подходов":["Sets","Série"],"Последние записи":["Latest entries","Poslední záznamy"],"Анализ тела":["Body analysis","Analýza těla"],"Сила и динамика":["Strength & trends","Síla a vývoj"],"ПЕРЕДНЯЯ ГРУППА":["FRONT MUSCLE GROUP","PŘEDNÍ SVALOVÁ SKUPINA"],"ЗАДНЯЯ ГРУППА":["BACK MUSCLE GROUP","ZADNÍ SVALOVÁ SKUPINA"],"Спереди":["Front","Zepředu"],"Сзади":["Back","Zezadu"],"Сбоку":["Side","Z boku"],"Обнови страницу и попробуй снова. Тренировочные данные не удалены.":["Refresh the page and try again. Your workout data has not been deleted.","Obnov stránku a zkus to znovu. Tréninková data nebyla smazána."]});
function mgcTranslateString(input){let value=String(input??"");const lang=state.settings.language||"ru";for(const [ru,pair] of Object.entries(MGC_TRANSLATIONS)){value=value.split(pair[0]).join(ru).split(pair[1]).join(ru);}if(lang!=="ru"){for(const [ru,pair] of Object.entries(MGC_TRANSLATIONS)){value=value.split(ru).join(pair[lang==="en"?0:1]);}}return value;}
function mgcTranslateTextNode(node){if(!node||node.nodeType!==Node.TEXT_NODE||!node.nodeValue.trim())return;if(!mgcOriginalText.has(node))mgcOriginalText.set(node,node.nodeValue);const original=mgcOriginalText.get(node);const value=mgcTranslateString(original);if(value!==node.nodeValue)node.nodeValue=value;}
function mgcTranslateTree(root){if(!root)return;const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;while((node=walker.nextNode())){if(node.parentElement?.closest("[data-i18n]"))continue;mgcTranslateTextNode(node);}const elements=[];if(root.nodeType===Node.ELEMENT_NODE)elements.push(root);if(root.querySelectorAll)elements.push(...root.querySelectorAll("*"));for(const el of elements){for(const attr of ["placeholder","title","aria-label","alt"]){if(!el.hasAttribute(attr))continue;let saved=mgcOriginalAttrs.get(el);if(!saved){saved={};mgcOriginalAttrs.set(el,saved);}if(!(attr in saved))saved[attr]=el.getAttribute(attr);const translated=mgcTranslateString(saved[attr]);if(el.getAttribute(attr)!==translated)el.setAttribute(attr,translated);}}}
function mgcApplyLanguage(){const lang=state.settings.language||"ru",d=MGC_I18N[lang]||MGC_I18N.ru;document.documentElement.lang=lang;document.documentElement.setAttribute("lang",lang);
document.querySelectorAll("[data-i18n]").forEach(el=>{const k=el.dataset.i18n;if(d[k]){const first=Array.from(el.childNodes).find(n=>n.nodeType===Node.TEXT_NODE&&n.nodeValue.trim());if(first){mgcOriginalText.delete(first);first.nodeValue=d[k];mgcOriginalText.set(first,d[k]);}else{const n=document.createTextNode(d[k]);el.prepend(n);mgcOriginalText.set(n,d[k]);}}});
mgcTranslateTree(document.body);
const nav=document.querySelectorAll(".tab span:last-child"),keys=["home","workouts","progress","nutrition","chat","settingsTitle","profile"];nav.forEach((el,i)=>{if(keys[i]&&d[keys[i]])el.textContent=d[keys[i]];});
}
function mgcApplySettings(){const s=state.settings,root=document.documentElement.style;const themes={"dark-red":["#07080b","#14151a","#ed1832","#ff4057","#f6f6f7"],"dark-blue":["#080b12","#151b27","#3985ff","#69a3ff","#f4f6fb"],"dark-green":["#080d0b","#141d19","#21b879","#65d9a5","#f3f8f5"],"light":["#f1f2f5","#ffffff","#e53935","#d9233d","#17191f"]};const t=themes[s.theme],v=t?{background:t[0],panel:t[1],accent:t[2],icons:t[3],text:t[4]}:s;
root.setProperty("--bg",v.background);root.setProperty("--panel",v.panel);root.setProperty("--panel2",s.theme==="light"?"#e7e9ee":"#1b1c22");root.setProperty("--red",v.accent);root.setProperty("--red2",v.accent);root.setProperty("--icon-color",v.icons);root.setProperty("--muscle-active",s.muscles);root.setProperty("--text",v.text);
document.body.classList.toggle("theme-light",s.theme==="light");document.body.classList.toggle("compact",s.size==="compact");document.body.classList.toggle("large",s.size==="large");document.body.classList.toggle("no-animations",!s.animations);document.body.classList.toggle("minimal-icons",s.iconStyle==="minimal");document.body.classList.toggle("detailed-icons",s.iconStyle==="detailed");document.body.style.color=v.text;document.body.style.backgroundColor=v.background;document.documentElement.style.colorScheme=s.theme==="light"?"light":"dark";
$("settingLanguage").value=s.language;$("settingTheme").value=s.theme;[["settingBackground","background"],["settingPanel","panel"],["settingAccent","accent"],["settingIcons","icons"],["settingMuscles","muscles"],["settingText","text"]].forEach(([id,k])=>$(id).value=s[k]);$("settingIconStyle").value=s.iconStyle;$("settingSize").value=s.size;$("settingAnimations").checked=s.animations;$("settingSounds").checked=s.sounds;$("settingRest").value=s.rest;
}
function mgcPersist(){save();mgcApplySettings();mgcApplyLanguage();}
function mgcChooseTheme(theme){state.settings.theme=theme;const t={"dark-red":["#07080b","#14151a","#ed1832","#ff4057","#f6f6f7"],"dark-blue":["#080b12","#151b27","#3985ff","#69a3ff","#f4f6fb"],"dark-green":["#080d0b","#141d19","#21b879","#65d9a5","#f3f8f5"],"light":["#f1f2f5","#ffffff","#e53935","#d9233d","#17191f"]}[theme];if(t)[["background",t[0]],["panel",t[1]],["accent",t[2]],["icons",t[3]],["text",t[4]]].forEach(([k,x])=>state.settings[k]=x);mgcPersist();}
$("openSettings").onclick=()=>document.querySelector('.tab[data-tab="settings"]').click();
$("settingLanguage").onchange=e=>{state.settings.language=e.target.value;mgcPersist();renderWorkout();renderPlan();renderProgress();renderNutrition();renderAIHistory();};
$("settingTheme").onchange=e=>mgcChooseTheme(e.target.value);
$("settingIconStyle").onchange=e=>{state.settings.iconStyle=e.target.value;mgcPersist();};
$("settingSize").onchange=e=>{state.settings.size=e.target.value;mgcPersist();};
[["settingBackground","background"],["settingPanel","panel"],["settingAccent","accent"],["settingIcons","icons"],["settingMuscles","muscles"],["settingText","text"]].forEach(([id,k])=>$(id).oninput=e=>{state.settings[k]=e.target.value;state.settings.theme="custom";$("settingTheme").value="custom";mgcPersist();});
[["settingAnimations","animations"],["settingSounds","sounds"]].forEach(([id,k])=>$(id).onchange=e=>{state.settings[k]=e.target.checked;mgcPersist();});
$("settingRest").onchange=e=>{state.settings.rest=Math.max(15,Math.min(600,+e.target.value||90));mgcPersist();};
$("exportSettings").onclick=()=>{const blob=new Blob([JSON.stringify(state.settings,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="my-gym-coach-settings.json";a.click();URL.revokeObjectURL(a.href);};
$("importSettingsButton").onclick=()=>$("importSettingsFile").click();
$("importSettingsFile").onchange=async e=>{try{const v=JSON.parse(await e.target.files[0].text());state.settings={...MGC_DEFAULT_SETTINGS,...v};mgcPersist();}catch{alert("Could not import settings.");}};
$("resetAppearance").onclick=()=>{state.settings={...MGC_DEFAULT_SETTINGS,language:state.settings.language};mgcPersist();};
let mgcInterval=null,mgcLeft=0;
$("startRestTimer").onclick=()=>{clearInterval(mgcInterval);mgcLeft=state.settings.rest;const out=$("restTimerDisplay");const tick=()=>{out.textContent=Math.floor(mgcLeft/60)+":"+String(mgcLeft%60).padStart(2,"0");if(mgcLeft<=0){clearInterval(mgcInterval);if(state.settings.sounds){try{const ctx=new(window.AudioContext||window.webkitAudioContext)(),osc=ctx.createOscillator();osc.connect(ctx.destination);osc.frequency.value=880;osc.start();osc.stop(ctx.currentTime+.35);}catch{}}return;}mgcLeft--;};tick();mgcInterval=setInterval(tick,1000);};
mgcApplySettings();mgcApplyLanguage();
const mgcObserver=new MutationObserver(records=>{if(state.settings.language==="ru")return;records.forEach(r=>r.addedNodes.forEach(n=>{if(n.nodeType===Node.TEXT_NODE)mgcTranslateTextNode(n);else mgcTranslateTree(n);}));});
mgcObserver.observe(document.body,{subtree:true,childList:true});
