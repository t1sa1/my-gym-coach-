(()=> {
"use strict";
const host=document.getElementById("anatomy3d");if(!host)return;
const MODEL_URL="https://raw.githubusercontent.com/organui/muscles-3d/main/public/models/muscles.glb";
const LABELS={
 "pectoralis":"Грудь","deltoid":"Плечи","biceps-brachii":"Бицепс","biceps brachii":"Бицепс",
 "triceps-brachii":"Трицепс","triceps brachii":"Трицепс","rectus-abdominis":"Пресс","oblique":"Пресс",
 "latissimus-dorsi":"Спина","trapezius":"Спина","rhomboid":"Спина","erector-spinae":"Спина",
 "gluteus":"Ягодицы","quadriceps":"Квадрицепс","rectus-femoris":"Квадрицепс","vastus":"Квадрицепс",
 "biceps-femoris":"Бицепс бедра","hamstring":"Бицепс бедра","gastrocnemius":"Икры","soleus":"Икры"
};
const GROUPS=["Грудь","Спина","Плечи","Бицепс","Трицепс","Квадрицепс","Бицепс бедра","Ягодицы","Икры","Пресс"];
let THREE,scene,camera,renderer,bodyGroup,activeView="front",lastTotals={},drag=null,zoom=1,ready=false,pinchDistance=0;
const pointers=new Map();let raycaster=null,mouse=null;
const hint=()=>document.querySelector(".anatomy3d-hint");
function groupForName(name){
 const n=String(name||"").toLowerCase().replace(/[_ .]+/g,"-");
 if(/pectoralis|pectoral|serratus-anterior|subclavius|intercostal|transversus-thoracis/.test(n))return "Грудь";
 if(/deltoid|supraspinatus|infraspinatus|teres-minor|teres-major|subscapularis|levator-scapulae/.test(n))return "Плечи";
 if(/biceps-brachii|biceps-brachialis|brachialis|brachioradialis/.test(n))return "Бицепс";
 if(/triceps-brachii|anconeus/.test(n))return "Трицепс";
 if(/rectus-abdominis|oblique|transversus-abdominis/.test(n))return "Пресс";
 if(/latissimus|trapezius|rhomboid|erector-spinae|iliocostalis|longissimus|spinalis|multifidus|serratus-posterior|splenius|rotatores|interspinales|intertransversarii|levatores-costarum|quadratus-lumborum/.test(n))return "Спина";
 if(/gluteus|piriformis|gemellus|obturator|quadratus-femoris|tensor-fasciae-latae/.test(n))return "Ягодицы";
 if(/quadriceps|rectus-femoris|vastus|iliacus|psoas-major|sartorius|pectineus|adductor|gracilis/.test(n))return "Квадрицепс";
 if(/biceps-femoris|semitendinosus|semimembranosus|hamstring/.test(n))return "Бицепс бедра";
 if(/gastrocnemius|soleus|plantaris|tibialis|fibularis|popliteus|calcaneal-tendon|extensor-hallucis-longus|extensor-digitorum-longus|flexor-digitorum-longus|flexor-hallucis-longus|abductor-hallucis|quadratus-plantae|lumbricals-foot|interossei-foot/.test(n))return "Икры";
 for(const [key,value] of Object.entries(LABELS))if(n.includes(key))return value;
 return null;
}
function isFaceOrScalp(name){return /frontalis|occipitalis|temporalis|masseter|orbicularis|zygomatic|nasalis|buccinator|mentalis|corrugator|epicranial|temporoparietalis|facial|scalp|eye|eyelid|tongue/i.test(name);}
function applyLoad(){
 if(!ready)return;
 bodyGroup.traverse(o=>{
  if(!o.isMesh||!o.userData.muscleGroup)return;
  const g=o.userData.muscleGroup,v=Number(lastTotals[g]||0),active=v>0;
  const mat=o.userData.baseMaterial;
  if(active){
   const m=mat.clone();m.color.set("#d6a4aa");m.emissive.set("#c20c2d");m.emissiveIntensity=Math.min(.12+v*.12,.72);m.roughness=.38;o.material=m;
  }else o.material=mat;
 });
}
function setView(which){if(which!=="front"&&which!=="back")return;activeView=which;if(bodyGroup)bodyGroup.rotation.y=which==="front"?0:Math.PI;document.querySelectorAll("[data-anatomy-view]").forEach(b=>b.classList.toggle("active",b.dataset.anatomyView===which));}
function resize(){if(!renderer||!camera)return;const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
function fitModel(root){
 const box=new THREE.Box3().setFromObject(root),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
 const scale=6.25/Math.max(size.y,0.001);root.scale.setScalar(scale);root.position.set(-center.x*scale,-center.y*scale,-center.z*scale);
 // Center model at the visual middle of the card after scaling.
 root.position.y+=0;
}
function addBlankHead(){
 const geo=new THREE.SphereGeometry(.31,40,32);
 const mat=new THREE.MeshStandardMaterial({color:"#aeb5bf",roughness:.48,metalness:.25});
 const head=new THREE.Mesh(geo,mat);head.name="Neutral faceless head";
 head.position.set(0,2.92,0);head.scale.set(1,1.25,.92);head.castShadow=true;bodyGroup.add(head);
}
async function init(){
 try{
  const THREEmod=await import("https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js");
  THREE=THREEmod;raycaster=new THREE.Raycaster();mouse=new THREE.Vector2();
  const {GLTFLoader}=await import("https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/loaders/GLTFLoader.js");
  scene=new THREE.Scene();
  camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(0,0,10.5);
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:"high-performance"});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
  host.innerHTML="";host.appendChild(renderer.domElement);renderer.domElement.setAttribute("aria-label","Настоящая трёхмерная анатомическая модель мышц");
  scene.add(new THREE.HemisphereLight("#f0f2f7","#30343d",2.0));
  const key=new THREE.DirectionalLight("#ffffff",3.0);key.position.set(-3,5,7);scene.add(key);
  const rim=new THREE.DirectionalLight("#a9b6ca",2.2);rim.position.set(4,2,-5);scene.add(rim);
  const fill=new THREE.PointLight("#ff4058",.3,14);fill.position.set(0,0,4);scene.add(fill);
  const loader=new GLTFLoader();
  const gltf=await loader.loadAsync(MODEL_URL);
  bodyGroup=new THREE.Group();scene.add(bodyGroup);
  const source=gltf.scene;
  source.traverse(o=>{
   if(!o.isMesh)return;
   const n=o.name||o.parent?.name||"";
   if(isFaceOrScalp(n)){o.visible=false;return;}
   const g=groupForName(n);
   const mat=new THREE.MeshStandardMaterial({color:"#aeb5bf",roughness:.46,metalness:.28});
   o.material=mat;o.userData.baseMaterial=mat;o.userData.muscleGroup=g||null;
   o.castShadow=true;o.receiveShadow=true;
  });
  bodyGroup.add(source);fitModel(source);
  // A smooth, neutral head replaces facial/scalp anatomy: no hair or facial features.
  const headGeometry=new THREE.SphereGeometry(.29,40,32),headMaterial=new THREE.MeshStandardMaterial({color:"#aeb5bf",roughness:.5,metalness:.25});
  const head=new THREE.Mesh(headGeometry,headMaterial);head.name="Faceless head";head.position.set(0,2.86,0);head.scale.set(1,1.22,.92);head.castShadow=true;bodyGroup.add(head);
  ready=true;applyLoad();resize();new ResizeObserver(resize).observe(host);
  renderer.setAnimationLoop(()=>renderer.render(scene,camera));
  setView(activeView);
 }catch(err){
  host.innerHTML='<div class="anatomy3d-error">Не удалось загрузить анатомическую 3D-модель. Проверь подключение к интернету и обнови страницу.</div>';
  console.error("Anatomy GLB load failed",err);
 }
}
function update(totals={}){lastTotals=totals||{};applyLoad();}
function pointerDown(e){
 host.setPointerCapture?.(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(pointers.size===1)drag={x:e.clientX,y:e.clientY};
 if(pointers.size===2){const p=[...pointers.values()];pinchDistance=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);drag=null;}
}
function pointerMove(e){
 if(!pointers.has(e.pointerId))return;const prev=pointers.get(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(pointers.size>=2){const p=[...pointers.values()],d=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);if(pinchDistance&&camera){zoom=Math.max(.72,Math.min(1.65,zoom+(d-pinchDistance)*.004));camera.position.z=10.5/zoom;}pinchDistance=d;return;}
 if(!drag)return;const dx=e.clientX-prev.x,dy=e.clientY-prev.y;drag={x:e.clientX,y:e.clientY};
 if(bodyGroup){bodyGroup.rotation.y+=dx*.008;bodyGroup.rotation.x=Math.max(-.4,Math.min(.4,bodyGroup.rotation.x+dy*.005));}
}
function pointerUp(e){if(e?.pointerId!==undefined)pointers.delete(e.pointerId);drag=pointers.size===1?[...pointers.values()][0]:null;if(pointers.size<2)pinchDistance=0;}
host.addEventListener("pointerdown",pointerDown);host.addEventListener("pointermove",pointerMove);host.addEventListener("pointerup",pointerUp);host.addEventListener("pointercancel",pointerUp);
host.addEventListener("wheel",e=>{e.preventDefault();zoom=Math.max(.72,Math.min(1.65,zoom-e.deltaY*.001));if(camera)camera.position.z=10.5/zoom;},{passive:false});
host.addEventListener("click",e=>{
 if(!ready)return;const rect=renderer.domElement.getBoundingClientRect();mouse.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);
 raycaster.setFromCamera(mouse,camera);const hits=raycaster.intersectObject(bodyGroup,true);
 const hit=hits.find(h=>h.object.userData.muscleGroup);if(hit){const g=hit.object.userData.muscleGroup;if(hint())hint().textContent=(g||hit.object.name)+" · нагрузка за 7 дней: "+Number(lastTotals[g]||0).toFixed(1);}
});
document.querySelectorAll("[data-anatomy-view]").forEach(b=>b.addEventListener("click",()=>setView(b.dataset.anatomyView)));
window.MGC3D={update,view:setView};
init();
})();