(()=> {
const host=document.getElementById("anatomy3d");if(!host)return;
const NS="http://www.w3.org/2000/svg";let activeView="front",lastTotals={},scale=1,startX=0,startY=0;
const base='<defs><linearGradient id="body" x1="0" y1="0" x2="1" y2=".15"><stop stop-color="#535a65"/><stop offset=".22" stop-color="#c6cbd2"/><stop offset=".48" stop-color="#737b86"/><stop offset=".72" stop-color="#dce0e5"/><stop offset="1" stop-color="#555d68"/></linearGradient><linearGradient id="muscle" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e2e6eb"/><stop offset=".22" stop-color="#aeb5bf"/><stop offset=".52" stop-color="#68717d"/><stop offset=".78" stop-color="#cbd0d7"/><stop offset="1" stop-color="#515a66"/></linearGradient><linearGradient id="hot" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ff9aa5"/><stop offset=".24" stop-color="#ff4058"/><stop offset=".62" stop-color="#bb102c"/><stop offset="1" stop-color="#ff6478"/></linearGradient><linearGradient id="dark" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#252a32"/><stop offset="1" stop-color="#7b8490"/></linearGradient><filter id="shadow" x="-30%" y="-20%" width="160%" height="150%"><feGaussianBlur stdDeviation="7"/></filter></defs>';
const path=(d,m,cls="")=>'<path '+(m?'data-muscle="'+m+'"':'class="'+cls+'"')+' d="'+d+'" />';
const detail=d=>path(d,null,"detail");
const front=[
path("M203 143Q188 126 190 83Q193 31 240 24Q287 31 290 83Q292 126 277 143L302 171Q350 171 375 202Q402 237 388 302L370 382Q365 418 350 451L360 535Q373 583 358 647L340 760Q334 798 318 829L304 824L297 754L278 650L240 555L202 650L183 754L176 824L162 829Q146 798 140 760L122 647Q107 583 120 535L130 451Q115 418 110 382L92 302Q78 237 105 202Q130 171 178 171Z",null,"body-shape"),
path("M203 143Q240 164 277 143L294 181Q274 205 240 204Q206 205 186 181Z",null,"neck"),
path("M191 78Q205 48 240 47Q275 48 289 78Q278 104 240 108Q202 104 191 78Z",null,"head"),
path("M111 194Q82 184 65 213Q45 251 62 286Q81 315 112 294L145 236Z M369 194Q398 184 415 213Q435 251 418 286Q399 315 368 294L335 236Z","Плечи"),
path("M151 218Q182 190 235 213L237 300Q207 321 165 296Q132 274 151 218Z M329 218Q298 190 245 213L243 300Q273 321 315 296Q348 274 329 218Z","Грудь"),
path("M99 282Q119 264 139 287L130 391Q117 426 92 404Q74 371 78 322Z M381 282Q361 264 341 287L350 391Q363 426 388 404Q406 371 402 322Z","Бицепс"),
path("M78 310Q94 287 111 304L103 408Q91 431 72 410Q60 372 65 340Z M402 310Q386 287 369 304L377 408Q389 431 408 410Q420 372 415 340Z","Трицепс"),
path("M194 310Q216 300 237 312L237 365Q216 377 194 365Z M286 310Q264 300 243 312L243 365Q264 377 286 365Z M194 371Q216 363 237 374L237 428Q216 440 194 428Z M286 371Q264 363 243 374L243 428Q264 440 286 428Z M194 434Q216 427 237 438L237 487Q216 498 194 487Z M286 434Q264 427 243 438L243 487Q264 498 286 487Z","Пресс"),
path("M151 496Q191 481 235 501L230 557Q201 578 163 557Q140 537 151 496Z M329 496Q289 481 245 501L250 557Q279 578 317 557Q340 537 329 496Z","Пресс"),
path("M144 557Q182 540 231 564L222 703Q207 746 175 758Q145 744 132 674Q125 606 144 557Z M336 557Q298 540 249 564L258 703Q273 746 305 758Q335 744 348 674Q355 606 336 557Z","Квадрицепс"),
path("M171 755Q198 748 220 766L207 862Q192 895 169 881Q151 845 156 798Z M309 755Q282 748 260 766L273 862Q288 895 311 881Q329 845 324 798Z","Икры"),
detail("M240 177V505 M151 218Q184 231 235 249 M329 218Q296 231 245 249 M149 303Q178 323 235 315 M331 303Q302 323 245 315 M194 366H237 M243 366H286 M194 429H237 M243 429H286 M194 487H237 M243 487H286 M240 502V556 M151 575Q179 600 219 588 M329 575Q301 600 261 588 M176 600Q190 671 175 730 M304 600Q290 671 305 730 M180 770Q193 808 178 854 M300 770Q287 808 302 854"),
detail("M103 225Q119 242 131 270 M377 225Q361 242 349 270 M91 328Q105 355 96 389 M389 328Q375 355 384 389 M210 95Q240 119 270 95")
].join("");
const back=[
path("M203 143Q188 126 190 83Q193 31 240 24Q287 31 290 83Q292 126 277 143L302 171Q350 171 375 202Q402 237 388 302L370 382Q365 418 350 451L360 535Q373 583 358 647L340 760Q334 798 318 829L304 824L297 754L278 650L240 555L202 650L183 754L176 824L162 829Q146 798 140 760L122 647Q107 583 120 535L130 451Q115 418 110 382L92 302Q78 237 105 202Q130 171 178 171Z",null,"body-shape"),
path("M203 78Q205 48 240 47Q275 48 289 78Q278 104 240 108Q202 104 191 78Z",null,"head"),
path("M111 194Q82 184 65 213Q45 251 62 286Q81 315 112 294L145 236Z M369 194Q398 184 415 213Q435 251 418 286Q399 315 368 294L335 236Z","Плечи"),
path("M180 205Q211 185 237 206L230 360Q211 389 173 370Q145 328 151 253Z M300 205Q269 185 243 206L250 360Q269 389 307 370Q335 328 329 253Z M173 367Q203 350 235 374L224 471Q192 490 163 455Z M307 367Q277 350 245 374L256 471Q288 490 317 455Z","Спина"),
path("M99 282Q119 264 139 287L130 391Q117 426 92 404Q74 371 78 322Z M381 282Q361 264 341 287L350 391Q363 426 388 404Q406 371 402 322Z","Трицепс"),
path("M78 310Q94 287 111 304L103 408Q91 431 72 410Q60 372 65 340Z M402 310Q386 287 369 304L377 408Q389 431 408 410Q420 372 415 340Z","Бицепс"),
path("M151 470Q190 450 237 474L238 554Q204 579 163 548Q139 521 151 470Z M329 470Q290 450 243 474L242 554Q276 579 317 548Q341 521 329 470Z","Ягодицы"),
path("M144 556Q183 540 231 568L220 721Q199 757 171 749Q140 710 132 638Z M336 556Q297 540 249 568L260 721Q281 757 309 749Q340 710 348 638Z","Бицепс бедра"),
path("M171 746Q198 735 220 759L207 863Q192 895 169 881Q151 845 156 798Z M309 746Q282 735 260 759L273 863Q288 895 311 881Q329 845 324 798Z","Икры"),
detail("M240 177V466 M151 231Q191 255 235 229 M329 231Q289 255 245 229 M155 277Q190 309 228 290 M325 277Q290 309 252 290 M172 376Q204 397 230 376 M308 376Q276 397 250 376 M240 476V554 M151 493Q190 520 235 506 M329 493Q290 520 245 506 M171 582Q190 633 175 714 M309 582Q290 633 305 714 M180 768Q193 810 178 854 M300 768Q287 810 302 854"),
detail("M103 225Q119 242 131 270 M377 225Q361 242 349 270")
].join("");
function render(){
 const content=activeView==="front"?front:back;
 const svg='<svg class="anatomy-svg premium-anatomy" viewBox="0 0 480 920" role="img" aria-label="Объёмная анатомическая модель '+(activeView==="front"?"спереди":"сзади")+'" xmlns="'+NS+'">'+base+'<ellipse cx="240" cy="884" rx="105" ry="13" fill="#000" opacity=".55" filter="url(#shadow)"/><g id="anatomyScale" transform="translate(240 460) scale('+scale+') translate(-240 -460)">'+content+'</g></svg>';
 host.innerHTML=svg;
 host.querySelectorAll("[data-muscle]").forEach(el=>{const m=el.dataset.muscle;const v=Number(lastTotals[m]||0);el.style.fill=v>0?"url(#hot)":"url(#muscle)";el.style.filter=v>0?"drop-shadow(0 0 8px #f12a4388)":"";el.style.opacity=v>0?String(Math.min(.75+v*.08,1)):"1";el.style.cursor="pointer";el.addEventListener("click",()=>{const hint=document.querySelector(".anatomy3d-hint");if(hint)hint.textContent=m+" · нагрузка за 7 дней: "+v.toFixed(1);});});
}
function update(totals={}){lastTotals=totals||{};render();}
function view(which){if(which!=="front"&&which!=="back")return;activeView=which;render();document.querySelectorAll("[data-anatomy-view]").forEach(b=>b.classList.toggle("active",b.dataset.anatomyView===which));}
document.querySelectorAll("[data-anatomy-view]").forEach(b=>b.addEventListener("click",()=>view(b.dataset.anatomyView)));
host.addEventListener("pointerdown",e=>{startX=e.clientX;startY=e.clientY;});
host.addEventListener("pointerup",e=>{const dx=e.clientX-startX,dy=e.clientY-startY;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy))view(activeView==="front"?"back":"front");});
host.addEventListener("wheel",e=>{if(!e.ctrlKey)return;e.preventDefault();scale=Math.max(.85,Math.min(1.3,scale+(e.deltaY<0?.05:-.05)));const g=host.querySelector("#anatomyScale");if(g)g.setAttribute("transform","translate(240 460) scale("+scale+") translate(-240 -460)");},{passive:false});
render();window.MGC3D={update,view};
})();