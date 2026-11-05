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
function equipmentArt(type){
 const common='<defs><linearGradient id="metal" x2="1" y2="1"><stop stop-color="#aebbb3"/><stop offset="1" stop-color="#52645a"/></linearGradient><linearGradient id="pad" x2="0" y2="1"><stop stop-color="#315c46"/><stop offset="1" stop-color="#183629"/></linearGradient></defs>';
 const arts={
 bar:'<path d="M25 35H175M37 24V46M47 20V50M153 20V50M163 24V46" stroke="url(#metal)" stroke-width="6" stroke-linecap="round"/><path d="M65 66H135M75 66V83M125 66V83" stroke="#60756a" stroke-width="7" stroke-linecap="round"/><rect x="67" y="80" width="66" height="9" rx="4" fill="url(#pad)"/>',
 dumbbells:'<path d="M48 52H152" stroke="url(#metal)" stroke-width="8" stroke-linecap="round"/><rect x="30" y="34" width="18" height="36" rx="5" fill="#315c46"/><rect x="152" y="34" width="18" height="36" rx="5" fill="#315c46"/><rect x="22" y="40" width="8" height="24" rx="3" fill="#7c9185"/><rect x="170" y="40" width="8" height="24" rx="3" fill="#7c9185"/>',
 cable:'<path d="M50 18V100M150 18V100M50 22H150M100 22V64" stroke="url(#metal)" stroke-width="6" stroke-linecap="round"/><rect x="85" y="61" width="30" height="28" rx="5" fill="url(#pad)"/><path d="M100 64L83 82M100 64L117 82" stroke="#52645a" stroke-width="3"/>',
 machine:'<path d="M48 15V100M152 15V100M48 18H152M48 95H152" stroke="url(#metal)" stroke-width="7" stroke-linecap="round"/><rect x="58" y="48" width="104" height="18" rx="7" fill="url(#pad)"/><rect x="65" y="73" width="90" height="11" rx="5" fill="#7c9185"/><path d="M72 48V35H128V48" stroke="#60756a" stroke-width="5" fill="none"/>',
 pulldown:'<path d="M55 15V95M145 15V95M55 20H145M100 20V48" stroke="url(#metal)" stroke-width="6" stroke-linecap="round"/><path d="M70 48H130" stroke="#315c46" stroke-width="8" stroke-linecap="round"/><path d="M78 95V72H122V95" stroke="#60756a" stroke-width="8" fill="none"/><path d="M87 70L100 52L113 70" stroke="#315c46" stroke-width="6" fill="none"/>',
 row:'<path d="M38 22V95M38 90H162M38 22H145" stroke="url(#metal)" stroke-width="6" stroke-linecap="round"/><path d="M145 22L112 60L92 60" stroke="#60756a" stroke-width="3" fill="none"/><rect x="78" y="58" width="36" height="16" rx="5" fill="url(#pad)"/><path d="M72 91V78H120V91" stroke="#315c46" stroke-width="6"/>',
 dumbbellbench:'<path d="M35 86H165M55 83L75 50H130L150 83" stroke="#60756a" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M70 48H137" stroke="url(#pad)" stroke-width="12" stroke-linecap="round"/><path d="M55 35H78M142 35H165" stroke="#315c46" stroke-width="7" stroke-linecap="round"/>',
 machinepress:'<path d="M55 18V96M145 18V96M55 24H145" stroke="url(#metal)" stroke-width="7"/><rect x="72" y="49" width="76" height="17" rx="6" fill="url(#pad)"/><path d="M72 57L35 38M148 57L185 38" stroke="#60756a" stroke-width="6" stroke-linecap="round"/><path d="M65 93V73H155V93" stroke="#315c46" stroke-width="7" fill="none"/>',
 reversefly:'<path d="M48 18V95M152 18V95M48 24H152" stroke="url(#metal)" stroke-width="6"/><rect x="88" y="40" width="24" height="44" rx="7" fill="url(#pad)"/><path d="M88 50L48 35M112 50L152 35" stroke="#60756a" stroke-width="6" stroke-linecap="round"/>',
 squat:'<path d="M48 15V100M152 15V100M48 25H152" stroke="url(#metal)" stroke-width="7"/><path d="M65 35H135" stroke="#315c46" stroke-width="9" stroke-linecap="round"/><path d="M80 44V72M120 44V72" stroke="#60756a" stroke-width="7"/><rect x="68" y="72" width="84" height="13" rx="5" fill="url(#pad)"/>',
 rdl:'<path d="M25 35H175M38 24V46M47 20V50M153 20V50M163 24V46" stroke="url(#metal)" stroke-width="6" stroke-linecap="round"/><path d="M78 62L100 82L122 62" stroke="#315c46" stroke-width="8" fill="none" stroke-linecap="round"/>',
 legpress:'<path d="M35 95L70 25H165M35 95H170" stroke="url(#metal)" stroke-width="7" fill="none"/><path d="M85 70L145 30" stroke="#315c46" stroke-width="12" stroke-linecap="round"/><path d="M68 82L88 92" stroke="#60756a" stroke-width="8"/>',
 legcurl:'<path d="M48 18V95M48 90H160" stroke="url(#metal)" stroke-width="7"/><rect x="65" y="42" width="65" height="15" rx="6" fill="url(#pad)"/><circle cx="145" cy="77" r="13" fill="#315c46"/><path d="M145 77L115 60" stroke="#60756a" stroke-width="7"/>',
 calf:'<path d="M35 82H165M60 82V45M140 82V45" stroke="url(#metal)" stroke-width="7"/><rect x="55" y="35" width="110" height="13" rx="5" fill="url(#pad)"/><path d="M88 35V20H132V35" stroke="#60756a" stroke-width="6" fill="none"/>',
 hipthrust:'<path d="M25 80H175M45 80V94M155 80V94" stroke="url(#metal)" stroke-width="7"/><rect x="60" y="58" width="100" height="15" rx="7" fill="url(#pad)"/><path d="M75 58L92 38H145" stroke="#60756a" stroke-width="8" fill="none"/>',
 split:'<path d="M45 80H175M65 80V93M155 80V93" stroke="url(#metal)" stroke-width="7"/><rect x="70" y="52" width="90" height="12" rx="5" fill="url(#pad)"/><path d="M50 48H100" stroke="#60756a" stroke-width="8" stroke-linecap="round"/>',
 legext:'<path d="M48 18V95M48 90H160" stroke="url(#metal)" stroke-width="7"/><rect x="58" y="35" width="80" height="15" rx="6" fill="url(#pad)"/><circle cx="143" cy="73" r="12" fill="#315c46"/><path d="M143 73L112 56" stroke="#60756a" stroke-width="7"/>',
 core:'<path d="M35 85H165" stroke="url(#metal)" stroke-width="7" stroke-linecap="round"/><path d="M65 75Q80 35 115 55Q145 72 155 40" stroke="#315c46" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="153" cy="35" r="9" fill="#7c9185"/>',
 overhead:'<path d="M50 18V95M150 18V95M50 22H150M100 22V48" stroke="url(#metal)" stroke-width="6"/><path d="M87 48L100 65L113 48" stroke="#315c46" stroke-width="7" fill="none"/><path d="M100 65V88" stroke="#60756a" stroke-width="5"/>',
 ez:'<path d="M25 45H55L68 35L82 55L96 35L110 55L124 35L138 45H175" stroke="#60756a" stroke-width="7" fill="none" stroke-linecap="round"/><rect x="18" y="31" width="10" height="28" rx="3" fill="#315c46"/><rect x="172" y="31" width="10" height="28" rx="3" fill="#315c46"/>',
 preacher:'<path d="M40 90L75 40H145L165 90" stroke="#60756a" stroke-width="8" fill="none"/><path d="M70 42H145" stroke="#315c46" stroke-width="13" stroke-linecap="round"/><path d="M75 72H135" stroke="url(#metal)" stroke-width="6"/>',
 pushdown:'<path d="M100 18V52M68 52H132" stroke="url(#metal)" stroke-width="6" stroke-linecap="round"/><path d="M100 52V85M84 85H116" stroke="#315c46" stroke-width="7" stroke-linecap="round"/>'
 };
 const art=arts[type]||arts.machine;
 return '<svg viewBox="0 0 200 110" aria-hidden="true">'+common+art+'</svg>';
}

function exercisePhoto(name){
 const n=name.toLowerCase();
 const items=[
  {re:/жим штанги лёжа/i,url:"https://upload.wikimedia.org/wikipedia/commons/e/e8/184kg_bench.jpg",credit:"John049",page:"https://commons.wikimedia.org/wiki/File:184kg_bench.jpg"},
  {re:/жим гантелей под наклоном|жим гантелей на наклонной/i,url:"https://commons.wikimedia.org/wiki/Special:FilePath/Inclined_bench_press.jpg",credit:"SAgbley",page:"https://commons.wikimedia.org/wiki/File:Inclined_bench_press.jpg"},
  {re:/тяга верхнего блока|подтягивания|горизонтальная тяга|тяга с упором грудью/i,url:"https://commons.wikimedia.org/wiki/Special:FilePath/Back_Pull_down.jpg",credit:"Aliva Sahoo",page:"https://commons.wikimedia.org/wiki/File:Back_Pull_down.jpg"},
  {re:/жим ногами/i,url:"https://commons.wikimedia.org/wiki/Special:FilePath/Young_man_using_a_leg_press_machine_at_the_gym.jpg",credit:"Nenad Stojkovic",page:"https://commons.wikimedia.org/wiki/File:Young_man_using_a_leg_press_machine_at_the_gym.jpg"},
  {re:/подъём гантелей в стороны/i,url:"https://commons.wikimedia.org/wiki/Special:FilePath/DumbbellLateralRaise.JPG",credit:"GeorgeStepanek",page:"https://commons.wikimedia.org/wiki/File:DumbbellLateralRaise.JPG"},
  {re:/сгибание рук|молотковые|скамье скотта/i,url:"https://commons.wikimedia.org/wiki/Special:FilePath/Dumbbell_bicep_curls.jpg",credit:"PTPioneer",page:"https://commons.wikimedia.org/wiki/File:Dumbbell_bicep_curls.jpg"},
  {re:/разгибание рук/i,url:"https://commons.wikimedia.org/wiki/Special:FilePath/Role_doing_cable_tricep_extension_exercise.jpg",credit:"PTPioneer",page:"https://commons.wikimedia.org/wiki/File:Role_doing_cable_tricep_extension_exercise.jpg"},
  {re:/приседания|гакк-приседания|болгарские выпады|румынская тяга|ягодичный мост|сгибание ног|разгибание ног|подъёмы на носки|икры/i,url:"https://commons.wikimedia.org/wiki/Special:FilePath/Woman_doing_squat_workout_in_gym_with_barbell,_back_view.jpg",credit:"Nenad Stojkovic",page:"https://commons.wikimedia.org/wiki/File:Woman_doing_squat_workout_in_gym_with_barbell,_back_view.jpg"}
 ];
 return items.find(x=>x.re.test(n))||null;
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
 const photoBlock=photo?'<figure class="exercise-photo"><img src="'+photo.url+'" alt="Фото-пример упражнения '+name+'" loading="lazy" onerror="this.closest(\'figure\').classList.add(\'photo-failed\');this.remove()"><figcaption>Фото-пример · '+photo.credit+' · <a href="'+photo.page+'" target="_blank" rel="noopener">источник и лицензия</a></figcaption></figure>':'<div class="photo-placeholder"><span>Фото-пример</span><small>Для этого упражнения пока нет проверенного фото в открытой библиотеке</small></div>';
 $('exerciseDetail').innerHTML=photoBlock+'<div class="detail-visual"><div><span class="eyebrow">ОБОРУДОВАНИЕ</span><b>'+g.equipment+'</b></div>'+equipmentArt(g.e)+'</div>'+exerciseMuscleMini(name)+'<div class="detail-muscles"><div><small>ОСНОВНАЯ НАГРУЗКА</small><b>'+g.primary+'</b></div><div><small>ДОПОЛНИТЕЛЬНО</small><b>'+g.secondary+'</b></div></div><div class="detail-steps"><h3>Как выполнять</h3><ol>'+steps+'</ol></div><div class="detail-tip"><span>✦</span><p>'+g.tip+'</p></div>';
}

function renderWorkout(){renderDays();let p=currentPlan();$("dayTag").textContent=`ДЕНЬ ${p.id}`;if($("homeWorkoutName"))$("homeWorkoutName").textContent=p.name;$("coachAdvice").textContent=recommendation(p.ex[selected][0]);$("exerciseCount").textContent=`${p.ex.length} УПРАЖНЕНИЙ`;$("exerciseList").innerHTML=p.ex.map((e,i)=>{const photo=exercisePhoto(e[0]);const thumb=photo?'<div class="exercise-thumb"><img src="'+photo.url+'" alt="" loading="lazy" onerror="this.parentElement.innerHTML=\'✦\'"></div>':'<div class="exercise-thumb">✦</div>';return '<div class="exercise '+(i===selected?'selected':'')+'" data-i="'+i+'">'+thumb+'<div class="exercise-copy"><b>'+e[0]+'</b><small>'+e[1]+' подхода · '+e[2]+' повторений</small></div><span class="check">'+(completed.has(i)?'✓':'›')+'</span></div>'}).join("");document.querySelectorAll(".exercise").forEach(el=>el.onclick=()=>{selected=+el.dataset.i;renderWorkout()});renderExerciseDetail(p.ex[selected][0]);$("selectedExercise").textContent=p.ex[selected][0];$("currentSets").innerHTML=activeWorkout.filter(x=>x.exercise===p.ex[selected][0]).map((x,i)=>'<div class="set-row"><span>Подход '+(i+1)+'</span><b>'+x.weight+' кг × '+x.reps+'</b></div>').join("");$("addSet").onclick=()=>{let w=+$("weight").value,r=+$("reps").value;if(!Number.isFinite(w)||w<0||!Number.isInteger(r)||r<1){alert("Введи корректный вес и количество повторений.");return}activeWorkout.push({exercise:p.ex[selected][0],weight:w,reps:r,notes:$("notes").value});$("weight").value="";$("reps").value="";$("notes").value="";renderWorkout()};$("finishExercise").onclick=()=>{completed.add(selected);renderWorkout()};$("finishWorkout").onclick=()=>{if(!activeWorkout.length){alert("Сначала запиши хотя бы один подход.");return}let now=new Date().toISOString();state.logs.push(...activeWorkout.map(x=>({...x,day:p.name,date:now,cycle:state.cycle})));state.cycle++;save();activeWorkout=[];completed.clear();alert("Тренировка сохранена! Отличная работа.");renderWorkout();renderProgress()}}
function renderStats(){let logs=state.logs;let sessions=new Set(logs.map(x=>x.date)).size;let volume=Math.round(logs.reduce((s,x)=>s+x.weight*x.reps,0));$("statSessions").textContent=sessions;$("statSets").textContent=logs.length;$("statVolume").textContent=volume.toLocaleString("ru-RU");if($("homeSessions"))$("homeSessions").textContent=sessions;if($("homeSets"))$("homeSets").textContent=logs.length;if($("homeVolume"))$("homeVolume").textContent=volume.toLocaleString("ru-RU");if($("progressSessions"))$("progressSessions").textContent=sessions;if($("progressSets"))$("progressSets").textContent=logs.length;if($("progressVolume"))$("progressVolume").textContent=volume.toLocaleString("ru-RU")}

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
 $("musclePeriod").textContent="Последние 7 дней · оценка нагрузки по записанным подходам";
}
function muscleRow(m,v){
 const max=Math.max(1,...Object.values(MUSCLE_MAP).map(()=>0),...state.logs.filter(x=>new Date(x.date).getTime()>=Date.now()-7*86400000).flatMap(x=>musclesForExercise(x.exercise).map(()=>1)));
 const pct=Math.min(100,v/Math.max(4,max*4)*100);
 return `<div class="muscle-row"><span class="muscle-dot" style="background:${MUSCLE_COLORS[m]}"></span><span class="muscle-name">${m}</span><span class="muscle-track"><i style="width:${pct}%;background:${MUSCLE_COLORS[m]}"></i></span><b>${Number(v.toFixed(1))}</b></div>`;
}
function muscleFigure(side,totals){
 const front=side==="front";
 const peak=Math.max(1,...Object.values(totals));
 const color=m=>totals[m]>0?MUSCLE_COLORS[m]:"#77818d";
 const opacity=m=>totals[m]>0?Math.min(.48+.52*totals[m]/peak,1):.27;
 const p=(m,d)=>'<path class="anatomy-muscle" d="'+d+'" fill="'+color(m)+'" fill-opacity="'+opacity(m)+'" stroke="#e5e9ed" stroke-opacity=".48" stroke-width=".8" stroke-linejoin="round"/>';
 const outline=front
 ?'<path d="M100 35Q91 37 86 47L78 53Q61 54 53 70L37 132Q34 145 43 151Q51 154 57 140L73 101 79 151Q77 173 82 193L87 218 83 254 88 295 86 343 83 393Q91 400 101 394L108 347 110 300 112 347 119 394Q129 400 137 393L134 343 131 295 137 254 133 218 138 193Q143 173 141 151L147 101 163 140Q169 154 177 151Q186 145 183 132L167 70Q159 54 142 53L134 47Q129 37 120 35Z" fill="url(#skinFront)" stroke="#e0e5e9" stroke-width="1.3"/>'
 :'<path d="M100 35Q91 37 86 47L78 53Q61 54 53 70L37 132Q34 145 43 151Q51 154 57 140L73 101 79 151Q77 173 82 193L87 218 83 254 88 295 86 343 83 393Q91 400 101 394L108 347 110 300 112 347 119 394Q129 400 137 393L134 343 131 295 137 254 133 218 138 193Q143 173 141 151L147 101 163 140Q169 154 177 151Q186 145 183 132L167 70Q159 54 142 53L134 47Q129 37 120 35Z" fill="url(#skinBack)" stroke="#e0e5e9" stroke-width="1.3"/>';
 let muscles="";
 if(front){
  muscles+=p("Плечи","M88 57Q76 52 66 64Q57 76 66 91Q74 99 88 87L96 69Z M132 57Q144 52 154 64Q163 76 154 91Q146 99 132 87L124 69Z");
  muscles+=p("Грудь","M91 75Q101 68 108 76L108 111Q99 115 87 106Q77 95 82 83Z M129 75Q119 68 112 76L112 111Q121 115 133 106Q143 95 138 83Z");
  muscles+=p("Бицепс","M65 91Q75 91 82 103L73 137Q64 143 57 132L55 113Z M155 91Q145 91 138 103L147 137Q156 143 163 132L165 113Z");
  muscles+=p("Трицепс","M57 101Q62 96 67 100L62 133 54 140Q49 131 52 119Z M163 101Q158 96 153 100L158 133 166 140Q171 131 168 119Z");
  muscles+=p("Бицепс","M49 145Q56 138 65 145L59 177Q51 184 45 174Z M171 145Q164 138 155 145L161 177Q169 184 175 174Z");
  muscles+=p("Пресс","M99 116Q105 113 108 120L108 141 99 143Q95 133 99 116Z M121 116Q115 113 112 120L112 141 121 143Q125 133 121 116Z M99 146L108 145 108 164 99 165Z M121 146L112 145 112 164 121 165Z M99 168L108 167 108 186 99 187Z M121 168L112 167 112 186 121 187Z M99 190L108 189 108 204 100 205Z M121 190L112 189 112 204 120 205Z");
  muscles+=p("Пресс","M91 119Q96 117 99 126L95 179 87 170Z M129 119Q124 117 121 126L125 179 133 170Z");
  muscles+=p("Квадрицепс","M91 211Q99 205 107 212L106 248 99 280 90 291 85 258Z M109 212Q115 207 121 213L129 258 124 291 115 280 108 248Z M129 211Q135 207 140 217L136 260 130 289 124 278 122 245Z M91 211Q85 207 80 217L84 260 90 289 96 278 98 245Z");
  muscles+=p("Икры","M92 298Q100 291 107 302L105 337 98 363 89 357Z M128 298Q120 291 113 302L115 337 122 363 131 357Z");
 }else{
  muscles+=p("Плечи","M88 58Q76 52 66 65Q57 77 66 92Q75 99 88 86Z M132 58Q144 52 154 65Q163 77 154 92Q145 99 132 86Z");
  muscles+=p("Спина","M96 65Q110 57 124 65L130 92 110 109 90 92Z");
  muscles+=p("Спина","M89 94Q99 91 108 105L105 159Q94 154 84 132Z M131 94Q121 91 112 105L115 159Q126 154 136 132Z");
  muscles+=p("Трицепс","M65 94Q74 92 82 104L73 137Q64 143 57 132L55 113Z M155 94Q146 92 138 104L147 137Q156 143 163 132L165 113Z");
  muscles+=p("Бицепс","M49 145Q56 138 65 145L59 177Q51 184 45 174Z M171 145Q164 138 155 145L161 177Q169 184 175 174Z");
  muscles+=p("Ягодицы","M88 190Q98 183 108 193L108 226Q99 239 86 222Q82 204 88 190Z M132 190Q122 183 112 193L112 226Q121 239 134 222Q138 204 132 190Z");
  muscles+=p("Бицепс бедра","M89 231Q99 226 108 236L105 282 98 313 87 292Z M131 231Q121 226 112 236L115 282 122 313 133 292Z M109 238L111 238 112 292 110 311 108 292Z");
  muscles+=p("Икры","M92 312Q100 306 107 318L104 353 98 375 89 366Z M128 312Q120 306 113 318L116 353 122 375 131 366Z");
 }
 const anatomyLines=front
 ?'<path d="M110 45V62M110 112V207M110 210V300M80 151L93 159M140 151L127 159M89 219L108 229M131 219L112 229" fill="none" stroke="#f0f2f5" stroke-opacity=".26" stroke-width=".8"/>'
 :'<path d="M110 48V190M110 232V300M80 151L94 159M140 151L126 159M89 226L108 234M131 226L112 234" fill="none" stroke="#f0f2f5" stroke-opacity=".26" stroke-width=".8"/>';
 return '<svg class="body-figure anatomical-figure" viewBox="0 0 220 420" role="img" aria-label="'+(front?"Реалистичная анатомическая карта мышц спереди":"Реалистичная анатомическая карта мышц сзади")+'"><defs><linearGradient id="skinFront" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#aeb7c1"/><stop offset=".48" stop-color="#59636f"/><stop offset="1" stop-color="#242a33"/></linearGradient><linearGradient id="skinBack" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#aeb7c1"/><stop offset=".48" stop-color="#59636f"/><stop offset="1" stop-color="#242a33"/></linearGradient><radialGradient id="muscleGlow"><stop stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><g>'+outline+'</g><ellipse cx="110" cy="24" rx="14" ry="18" fill="#8d98a4" stroke="#e0e5e9" stroke-width="1"/><path d="M99 39L99 50Q110 57 121 50L121 39" fill="#697480" stroke="#dce1e6" stroke-width=".8"/>'+muscles+anatomyLines+'<path d="M40 135Q43 153 51 151M180 135Q177 153 169 151" fill="none" stroke="#f1f3f5" stroke-opacity=".42" stroke-width="1.2"/></svg>';
}
function renderProgress(){renderStats();renderMuscleMap();let names=[...new Set(state.logs.map(x=>x.exercise))];$("progressExercise").innerHTML=names.map(n=>`<option>${n}</option>`).join("");$("progressExercise").onchange=drawChart;drawChart();$("historyList").innerHTML=state.logs.slice().reverse().slice(0,30).map(x=>`<div class="history-item"><b>${x.exercise}</b><p>${new Date(x.date).toLocaleString("ru-RU")} · ${x.day}</p><strong>${x.weight} кг × ${x.reps}</strong></div>`).join("")||'<p class="muted">Пока нет сохранённых тренировок.</p>'}
function drawChart(){let name=$("progressExercise").value;let arr=state.logs.filter(x=>x.exercise===name);if(!arr.length){$("progressChart").className="chart-empty";$("progressChart").textContent="Добавь результаты тренировок, чтобы увидеть график.";return}let best=arr.map(x=>+x.weight);let max=Math.max(...best,1),min=Math.min(...best);let w=320,h=150,pad=25;let pts=best.map((v,i)=>`${pad+i*(w-2*pad)/Math.max(best.length-1,1)},${h-pad-(v/max)*(h-2*pad)}`).join(" ");$("progressChart").className="";$("progressChart").innerHTML=`<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="График веса"><polyline points="${pts}" fill="none" stroke="#1c8b56" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${best.map((v,i)=>`<circle cx="${pad+i*(w-2*pad)/Math.max(best.length-1,1)}" cy="${h-pad-(v/max)*(h-2*pad)}" r="4" fill="#1c8b56"/>`).join("")}</svg><div class="muted">Последний вес: ${best[best.length-1]} кг · Лучший: ${max} кг · Записей: ${best.length}</div>`}
function renderPlan(){$("fullPlan").innerHTML=plans.map(p=>`<div class="plan-day"><h3>${p.name}<span class="tag">ДЕНЬ ${p.id}</span></h3><ul>${p.ex.map(e=>`<li>${e[0]} — ${e[1]} × ${e[2]}</li>`).join("")}</ul></div>`).join("")}
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll(".view").forEach(x=>x.classList.toggle("active",x.id==="view-"+b.dataset.tab));if(b.dataset.tab==="progress")renderProgress();if(b.dataset.scroll){setTimeout(()=>$(b.dataset.scroll)?.scrollIntoView({behavior:"smooth",block:"start"}),60)}});document.querySelectorAll("[data-open-tab]").forEach(b=>b.onclick=()=>document.querySelector('.tab[data-tab="'+b.dataset.openTab+'"]')?.click());if($("startWorkout"))$("startWorkout").onclick=()=>$("workoutArea").scrollIntoView({behavior:"smooth",block:"start"});if($("goWorkout"))$("goWorkout").onclick=()=>$("workoutArea").scrollIntoView({behavior:"smooth",block:"start"});
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
