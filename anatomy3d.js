(()=> {
const host=document.getElementById("anatomy3d");if(!host)return;
const NS="http://www.w3.org/2000/svg";
let activeView="front",lastTotals={},scale=1,startX=0,startY=0,pointers=new Map(),lastPinch=0,suppressSwipe=false;
const defs='<defs>'+
'<linearGradient id="body" x1="0" y1="0" x2="1" y2=".2"><stop stop-color="#525a66"/><stop offset=".18" stop-color="#cbd0d8"/><stop offset=".42" stop-color="#737d89"/><stop offset=".68" stop-color="#e0e4e9"/><stop offset="1" stop-color="#555e69"/></linearGradient>'+
'<linearGradient id="muscle" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f0f2f5"/><stop offset=".18" stop-color="#b9c0ca"/><stop offset=".48" stop-color="#707986"/><stop offset=".75" stop-color="#d7dce3"/><stop offset="1" stop-color="#555e6b"/></linearGradient>'+
'<linearGradient id="hot" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ff9da7"/><stop offset=".25" stop-color="#ff4058"/><stop offset=".62" stop-color="#c41430"/><stop offset="1" stop-color="#ff7888"/></linearGradient>'+
'<radialGradient id="head" cx=".35" cy=".22" r=".8"><stop stop-color="#edf0f4"/><stop offset=".35" stop-color="#aab2bd"/><stop offset=".72" stop-color="#66707d"/><stop offset="1" stop-color="#424b57"/></radialGradient>'+
'<filter id="softShadow" x="-30%" y="-20%" width="160%" height="150%"><feGaussianBlur stdDeviation="9"/></filter></defs>';
const p=(d,m,cls)=>'<path '+(m?'data-muscle="'+m+'"':'class="'+(cls||"detail")+'"')+' d="'+d+'"/>';
const line=d=>p(d,null,"detail");
const silhouette='<path class="body-shape" d="M202 139Q185 120 187 82Q190 23 240 20Q290 23 293 82Q295 120 278 139L309 167Q357 169 386 204Q410 236 395 300L375 382Q369 421 352 451L365 536Q377 585 362 650L345 760Q339 805 321 851L299 849L292 766L275 652L240 560L205 652L188 766L181 849L159 851Q141 805 135 760L118 650Q103 585 115 536L128 451Q111 421 105 382L85 300Q70 236 94 204Q123 169 171 167Z"/>';
const head='<ellipse class="head-shape" cx="240" cy="82" rx="51" ry="64"/><path class="detail" d="M201 105Q240 121 279 105M211 129Q240 138 269 129"/>';
const neck='<path class="body-shape" d="M205 133Q210 165 186 183L215 211H265L294 183Q270 165 275 133Q240 157 205 133Z"/>';
const front=[
 silhouette,head,neck,
 p("M171 177Q137 165 111 190Q82 219 91 269Q101 309 143 307Q166 286 177 239Z M309 177Q343 165 369 190Q398 219 389 269Q379 309 337 307Q314 286 303 239Z","Плечи"),
 p("M145 211Q177 183 235 208L237 301Q216 324 175 312Q135 295 130 258Q128 231 145 211Z M335 211Q303 183 245 208L243 301Q264 324 305 312Q345 295 350 258Q352 231 335 211Z","Грудь"),
 p("M101 277Q122 260 146 282Q159 316 143 371Q130 410 105 414Q81 401 79 357Q77 306 101 277Z M379 277Q358 260 334 282Q321 316 337 371Q350 410 375 414Q399 401 401 357Q403 306 379 277Z","Бицепс"),
 p("M84 354Q105 337 128 359L119 433Q105 461 83 449Q66 426 68 391Z M396 354Q375 337 352 359L361 433Q375 461 397 449Q414 426 412 391Z","Трицепс"),
 p("M76 438Q95 424 115 442L128 529Q121 561 99 568Q77 555 67 510Z M404 438Q385 424 365 442L352 529Q359 561 381 568Q403 555 413 510Z","Предплечья"),
 p("M188 308Q211 298 237 309L237 360Q214 374 188 359Z M292 308Q269 298 243 309L243 360Q266 374 292 359Z M188 365Q211 355 237 367L237 420Q214 433 188 420Z M292 365Q269 355 243 367L243 420Q266 433 292 420Z M188 425Q211 415 237 427L237 480Q214 492 188 480Z M292 425Q269 415 243 427L243 480Q266 492 292 480Z","Пресс"),
 p("M145 300Q164 314 184 321L174 430Q157 447 139 422Q127 370 145 300Z M335 300Q316 314 296 321L306 430Q323 447 341 422Q353 370 335 300Z","Косые мышцы живота"),
 p("M157 491Q194 475 235 496L231 551Q205 574 165 556Q143 536 157 491Z M323 491Q286 475 245 496L249 551Q275 574 315 556Q337 536 323 491Z","Ягодицы"),
 p("M145 552Q182 536 230 559L222 709Q205 750 174 765Q144 747 132 678Q125 611 145 552Z M335 552Q298 536 250 559L258 709Q275 750 306 765Q336 747 348 678Q355 611 335 552Z","Квадрицепс"),
 p("M177 757Q198 745 221 766L210 861Q194 895 169 881Q150 845 157 800Z M303 757Q282 745 259 766L270 861Q286 895 311 881Q330 845 323 800Z","Икры"),
 line("M240 170V489 M151 213Q187 232 235 247 M329 213Q293 232 245 247 M142 291Q174 321 235 311 M338 291Q306 321 245 311 M188 360H237M243 360H292M188 421H237M243 421H292M188 481H237M243 481H292M240 493V554 M160 510Q188 530 226 522 M320 510Q292 530 254 522 M177 576Q194 640 176 728 M303 576Q286 640 304 728 M184 776Q197 817 178 859 M296 776Q283 817 302 859"),
 line("M110 202Q128 224 143 257 M370 202Q352 224 337 257 M91 362Q108 386 101 424 M389 362Q372 386 379 424 M206 81Q240 93 274 81")
].join("");
const back=[
 silhouette,head,neck,
 p("M171 177Q137 165 111 190Q82 219 91 269Q101 309 143 307Q166 286 177 239Z M309 177Q343 165 369 190Q398 219 389 269Q379 309 337 307Q314 286 303 239Z","Плечи"),
 p("M183 190Q211 173 237 198L232 350Q211 385 174 367Q144 331 151 255Z M297 190Q269 173 243 198L248 350Q269 385 306 367Q336 331 329 255Z","Спина"),
 p("M163 340Q195 324 235 352L229 460Q197 487 160 454Q143 397 163 340Z M317 340Q285 324 245 352L251 460Q283 487 320 454Q337 397 317 340Z","Спина"),
 p("M101 277Q122 260 146 282Q159 316 143 371Q130 410 105 414Q81 401 79 357Q77 306 101 277Z M379 277Q358 260 334 282Q321 316 337 371Q350 410 375 414Q399 401 401 357Q403 306 379 277Z","Трицепс"),
 p("M84 354Q105 337 128 359L119 433Q105 461 83 449Q66 426 68 391Z M396 354Q375 337 352 359L361 433Q375 461 397 449Q414 426 412 391Z","Бицепс"),
 p("M76 438Q95 424 115 442L128 529Q121 561 99 568Q77 555 67 510Z M404 438Q385 424 365 442L352 529Q359 561 381 568Q403 555 413 510Z","Предплечья"),
 p("M151 466Q190 444 237 469L239 556Q203 582 161 549Q137 519 151 466Z M329 466Q290 444 243 469L241 556Q277 582 319 549Q343 519 329 466Z","Ягодицы"),
 p("M145 552Q182 536 230 559L222 713Q204 755 174 765Q143 745 132 678Q125 611 145 552Z M335 552Q298 536 250 559L258 713Q276 755 306 765Q337 745 348 678Q355 611 335 552Z","Бицепс бедра"),
 p("M177 757Q198 745 221 766L210 861Q194 895 169 881Q150 845 157 800Z M303 757Q282 745 259 766L270 861Q286 895 311 881Q330 845 323 800Z","Икры"),
 line("M240 170V557 M152 218Q190 252 235 226 M328 218Q290 252 245 226 M157 276Q190 318 230 297 M323 276Q290 318 250 297 M166 355Q197 384 230 367 M314 355Q283 384 250 367 M160 425Q196 449 230 430 M320 425Q284 449 250 430 M240 470V555 M151 492Q191 521 235 507 M329 492Q289 521 245 507 M174 578Q194 642 176 730 M306 578Q286 642 304 730 M184 776Q197 817 178 859 M296 776Q283 817 302 859"),
 line("M110 202Q128 224 143 257 M370 202Q352 224 337 257 M91 362Q108 386 101 424 M389 362Q372 386 379 424")
].join("");
function render(){
 const body=activeView==="front"?front:back;
 host.innerHTML='<svg class="anatomy-svg premium-anatomy" viewBox="0 0 480 920" role="img" aria-label="Анатомическая модель без лица и волос, '+(activeView==="front"?"спереди":"сзади")+'" xmlns="'+NS+'">'+defs+'<ellipse cx="240" cy="890" rx="116" ry="12" fill="#000" opacity=".55" filter="url(#softShadow)"/><g id="anatomyScale" transform="translate(240 460) scale('+scale+') translate(-240 -460)">'+body+'</g></svg>';
 host.querySelectorAll("[data-muscle]").forEach(el=>{
  const key=el.dataset.muscle;
  const v=Number(lastTotals[key]||0);
  const active=v>0;
  el.style.fill=active?"url(#hot)":"url(#muscle)";
  el.style.filter=active?"drop-shadow(0 0 7px #f12a4388)":"";
  el.style.opacity=active?String(Math.min(.78+v*.08,1)):"1";
  el.style.cursor="pointer";
  el.addEventListener("click",()=>{
   const hint=document.querySelector(".anatomy3d-hint");
   if(hint)hint.textContent=key+" · нагрузка за 7 дней: "+v.toFixed(1);
  });
 });
}
function update(totals={}){lastTotals=totals||{};render();}
function view(which){if(which!=="front"&&which!=="back")return;activeView=which;render();document.querySelectorAll("[data-anatomy-view]").forEach(b=>b.classList.toggle("active",b.dataset.anatomyView===which));}
document.querySelectorAll("[data-anatomy-view]").forEach(b=>b.addEventListener("click",()=>view(b.dataset.anatomyView)));
host.addEventListener("pointerdown",e=>{host.setPointerCapture?.(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===1){startX=e.clientX;startY=e.clientY;}if(pointers.size===2){const a=[...pointers.values()];lastPinch=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);suppressSwipe=true;}});
host.addEventListener("pointermove",e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2){const a=[...pointers.values()],d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);if(lastPinch>0){scale=Math.max(.8,Math.min(1.35,scale*d/lastPinch));const g=host.querySelector("#anatomyScale");if(g)g.setAttribute("transform","translate(240 460) scale("+scale+") translate(-240 -460)");}lastPinch=d;}});
function release(e){pointers.delete(e.pointerId);if(pointers.size<2)lastPinch=0;if(!pointers.size){const dx=e.clientX-startX,dy=e.clientY-startY;if(!suppressSwipe&&Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy))view(activeView==="front"?"back":"front");suppressSwipe=false;}}
host.addEventListener("pointerup",release);host.addEventListener("pointercancel",release);
render();window.MGC3D={update,view};
})();