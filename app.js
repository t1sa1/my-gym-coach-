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
 const front=side==="front",peak=Math.max(1,...Object.values(totals));
 const fill=m=>totals[m]>0?MUSCLE_COLORS[m]:"#aeb8c4";
 const alpha=m=>totals[m]>0?Math.min(.72+.28*totals[m]/peak,1):.43;
 const part=(m,d)=>'<path class="anatomy-muscle" d="'+d+'" fill="'+fill(m)+'" fill-opacity="'+alpha(m)+'" stroke="#e8edf3" stroke-opacity=".82" stroke-width="1.05" stroke-linejoin="round"/>';
 const fiber=d=>'<path d="'+d+'" fill="none" stroke="#f5f7fa" stroke-opacity=".27" stroke-width=".75" stroke-linecap="round"/>';
 const body='<path d="M108 49Q91 48 84 59L70 65Q53 66 44 84L28 151Q24 166 34 174Q43 180 50 165L65 119 69 177Q66 195 72 218L79 250 74 290 78 342 73 403 69 474Q78 484 96 480L108 412 112 352 116 412 128 480Q146 484 155 474L151 403 146 342 150 290 145 250 152 218Q158 195 155 177L159 119 174 165Q181 180 190 174Q200 166 196 151L176 84Q167 66 150 65L136 59Q129 48 112 49Z" fill="#b9c3ce" fill-opacity=".17" stroke="#e8edf3" stroke-opacity=".92" stroke-width="1.6" stroke-linejoin="round"/>';
 const head='<path d="M97 22Q97 5 110 5Q123 5 123 22L121 43Q117 54 110 55Q103 54 99 43Z" fill="#b9c3ce" fill-opacity=".24" stroke="#e8edf3" stroke-opacity=".9" stroke-width="1.4"/><path d="M101 27Q110 31 119 27M104 39Q110 42 116 39M101 48L101 64Q110 72 119 64L119 48" fill="none" stroke="#edf1f5" stroke-opacity=".5" stroke-width=".8"/>';
 let m="";
 if(front){
  m+=part("Плечи","M91 69Q78 64 67 77Q57 91 66 108Q75 119 91 104L103 83Z M133 69Q146 64 157 77Q167 91 158 108Q149 119 133 104L121 83Z");
  m+=part("Грудь","M99 91Q110 84 118 94L118 132Q105 139 89 128Q77 118 82 104Q88 94 99 91Z M125 91Q114 84 106 94L106 132Q119 139 135 128Q147 118 142 104Q136 94 125 91Z");
  m+=part("Бицепс","M66 112Q76 110 84 124L76 163Q68 171 58 158L56 137Z M158 112Q148 110 140 124L148 163Q156 171 166 158L168 137Z");
  m+=part("Трицепс","M56 119Q63 111 70 118L65 160Q59 171 51 161L48 143Z M168 119Q161 111 154 118L159 160Q165 171 173 161L176 143Z");
  m+=part("Пресс","M101 139Q108 135 118 139L118 164 101 164Z M125 139Q122 135 106 139L106 164 125 164Z M101 168L118 168 118 190 101 190Z M125 168L106 168 106 190 125 190Z M101 194L118 194 118 216 101 216Z M125 194L106 194 106 216 125 216Z M103 220L118 220 117 239 104 239Z M123 220L108 220 109 239 122 239Z");
  m+=part("Пресс","M91 140Q98 138 101 151L96 210 85 198Z M135 140Q128 138 125 151L130 210 141 198Z");
  m+=part("Квадрицепс","M86 248Q99 239 109 249L106 300 98 347 86 335 78 286Z M112 249Q122 239 134 248L142 286 134 335 122 347 114 300Z M81 253Q74 260 77 291L84 337 91 345 96 302 94 263Z M139 253Q146 260 143 291L136 337 129 345 124 302 126 263Z");
  m+=part("Икры","M87 354Q98 348 107 361L103 410 94 449 82 438Z M133 354Q122 348 113 361L117 410 126 449 138 438Z");
  m+=fiber("M83 104Q93 110 101 128M91 97Q100 103 106 119M137 97Q128 103 122 119M145 104Q135 110 127 128M104 145L104 158M114 145L114 158M104 173L104 185M114 173L114 185M104 198L104 211M114 198L114 211M88 266Q96 285 95 315M130 266Q122 285 123 315M91 369Q99 386 95 414M129 369Q121 386 125 414");
 }else{
  m+=part("Плечи","M91 69Q78 64 67 77Q57 91 66 108Q75 119 91 104Z M133 69Q146 64 157 77Q167 91 158 108Q149 119 133 104Z");
  m+=part("Спина","M98 82Q110 73 126 82L137 117 120 151 110 163 100 151 83 117Z");
  m+=part("Спина","M85 119Q98 112 106 135L103 218Q88 210 76 178Z M135 119Q122 112 114 135L117 218Q132 210 144 178Z");
  m+=part("Трицепс","M66 112Q76 110 84 124L76 163Q68 171 58 158L56 137Z M158 112Q148 110 140 124L148 163Q156 171 166 158L168 137Z");
  m+=part("Бицепс","M48 177Q56 169 65 178L59 208 48 216Q42 204 48 177Z M176 177Q168 169 159 178L165 208 176 216Q182 204 176 177Z");
  m+=part("Ягодицы","M84 222Q98 211 109 224L109 267Q98 282 81 260Q77 239 84 222Z M136 222Q122 211 111 224L111 267Q122 282 139 260Q143 239 136 222Z");
  m+=part("Бицепс бедра","M84 273Q98 264 108 278L104 340 95 380 82 353Z M136 273Q122 264 112 278L116 340 125 380 138 353Z M108 281L112 281 113 352 110 378 107 352Z");
  m+=part("Икры","M87 385Q98 377 107 391L103 432 94 461 82 449Z M133 385Q122 377 113 391L117 432 126 461 138 449Z");
  m+=fiber("M89 91Q101 102 107 133M131 91Q119 102 113 133M89 139Q98 155 99 193M131 139Q122 155 121 193M91 229Q99 239 101 258M129 229Q121 239 119 258M90 290Q98 315 94 350M130 290Q122 315 126 350M92 399Q99 414 95 438M128 399Q121 414 125 438");
 }
 const details='<path d="M110 62V78M110 137V239M110 246V268M110 354V380M65 170L72 184M155 170L148 184M76 218L91 229M144 218L129 229" fill="none" stroke="#f4f7fa" stroke-opacity=".42" stroke-width=".9"/><path d="M29 151Q24 163 28 174L34 184 38 179 36 169 42 180 45 177 40 163 46 173 49 169 40 153M195 151Q200 163 196 174L190 184 186 179 188 169 182 180 179 177 184 163 178 173 175 169 184 153" fill="#aeb8c4" fill-opacity=".24" stroke="#e8edf3" stroke-opacity=".75" stroke-width="1"/><path d="M73 474Q68 482 69 491Q81 500 99 495L100 482 96 477M151 474Q156 482 155 491Q143 500 125 495L124 482 128 477" fill="#aeb8c4" fill-opacity=".24" stroke="#e8edf3" stroke-opacity=".75" stroke-width="1"/>';
 return '<svg class="body-figure anatomical-figure" viewBox="0 0 220 510" role="img" aria-label="'+(front?"Анатомическая карта мышц спереди":"Анатомическая карта мышц сзади")+'" xmlns="http://www.w3.org/2000/svg">'+body+head+m+details+'</svg>';
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
