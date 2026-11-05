(()=> {
const host=document.getElementById("anatomy3d");if(!host)return;
let THREE=null,scene,camera,renderer,bodyGroup,activeView="front",lastTotals={},drag=null,pinch=0,zoom=1,ready=false;
const hint=()=>document.querySelector(".anatomy3d-hint");
const material=(color,roughness=.48,metalness=.32)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const baseMat=()=>material("#9da5b0",.52,.38),muscleMat=()=>material("#c0c6ce",.4,.42);
const hotMat=()=>material("#ed263f",.34,.35,{});
function ellipsoid(parent,name,pos,scale,mat,muscle=null){
 const mesh=new THREE.Mesh(new THREE.SphereGeometry(1,32,24),mat);
 mesh.name=name;mesh.position.set(...pos);mesh.scale.set(...scale);mesh.castShadow=true;mesh.receiveShadow=true;
 if(muscle)mesh.userData.muscle=muscle;
 parent.add(mesh);return mesh;
}
function limb(parent,name,a,b,radii,mat,muscle){
 const mid=a.map((v,i)=>(v+b[i])/2),d=new THREE.Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]);
 const mesh=ellipsoid(parent,name,mid,[radii[0],d.length()/2+radii[1],radii[2]],mat,muscle);
 mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return mesh;
}
function paired(parent,name,y,z,sx,sy,sz,offset=.34){
 for(const side of [-1,1])ellipsoid(parent,name,[side*offset,y,z],[sx,sy,sz],muscleMat(),name);
}
function buildBody(){
 bodyGroup=new THREE.Group();scene.add(bodyGroup);
 const shell=baseMat();
 // Neutral, faceless anatomical base: no hair, eyes, nose or mouth.
 ellipsoid(bodyGroup,"torso",[0,1.15,0],[.78,1.25,.39],shell);
 ellipsoid(bodyGroup,"pelvis",[0,-.38,0],[.62,.55,.34],shell);
 ellipsoid(bodyGroup,"neck",[0,2.28,0],[.23,.42,.23],shell);
 ellipsoid(bodyGroup,"head",[0,2.92,0],[.37,.52,.34],shell);
 // Arms and legs are real 3D meshes, not SVG paths.
 for(const s of [-1,1]){
  limb(bodyGroup,"upper arm",[s*.72,1.88,0],[s*1.02,.72,0],[.19,.13,.2],shell);
  limb(bodyGroup,"forearm",[s*1.02,.72,0],[s*1.13,-.18,.02],[.145,.1,.15],shell);
  ellipsoid(bodyGroup,"hand",[s*1.14,-.34,.02],[.13,.2,.09],shell);
  limb(bodyGroup,"thigh",[s*.34,-.55,0],[s*.42,-1.85,0],[.27,.16,.29],shell);
  limb(bodyGroup,"shin",[s*.42,-1.85,0],[s*.43,-3.12,.02],[.17,.13,.18],shell);
  ellipsoid(bodyGroup,"foot",[s*.43,-3.25,.12],[.17,.25,.3],shell);
 }
 // Front anatomy
 paired(bodyGroup,"Плечи",1.93,.27,.24,.31,.25,.76);
 paired(bodyGroup,"Грудные мышцы",1.48,.34,.38,.3,.16,.39);
 paired(bodyGroup,"Бицепс",.91,.2,.17,.39,.17,.91);
 paired(bodyGroup,"Предплечья",.24,.16,.13,.39,.13,1.08);
 paired(bodyGroup,"Косые мышцы живота",.57,.3,.16,.49,.1,.43);
 paired(bodyGroup,"Пресс",.68,.34,.2,.22,.105,.0);
 for(let row=0;row<3;row++)for(const s of [-1,1])
  ellipsoid(bodyGroup,"Пресс",[s*.115,.98-row*.34,.365],[.105,.145,.075],muscleMat(),"Пресс");
 paired(bodyGroup,"Квадрицепс",-1.22,.2,.205,.61,.18,.43);
 paired(bodyGroup,"Икры",-2.55,.13,.16,.43,.15,.43);
 // Back anatomy, positioned behind the torso.
 paired(bodyGroup,"Трапеции",1.82,-.28,.33,.55,.13,.0);
 paired(bodyGroup,"Широчайшие мышцы",.93,-.31,.39,.72,.13,.39);
 paired(bodyGroup,"Трицепс",.94,-.2,.17,.4,.16,.91);
 paired(bodyGroup,"Предплечья",.23,-.15,.13,.39,.13,1.08);
 paired(bodyGroup,"Ягодицы",-0.48,-.31,.29,.36,.16,.32);
 paired(bodyGroup,"Бицепс бедра",-1.3,-.2,.21,.62,.16,.43);
 // A fine central line and anatomical clavicle/rib relief, kept subtle.
 const detailMat=new THREE.MeshStandardMaterial({color:"#e0e4e9",roughness:.55,metalness:.22,transparent:true,opacity:.28});
 for(const s of [-1,1]){
  limb(bodyGroup,"clavicle",[0,1.83,.38],[s*.48,1.72,.34],[.035,.035,.035],detailMat);
 }
}
function applyLoad(){
 if(!ready)return;
 bodyGroup.traverse(o=>{if(!o.isMesh||!o.userData.muscle)return;
  const value=Number(lastTotals[o.userData.muscle]||0),active=value>0;
  o.material=active?new THREE.MeshStandardMaterial({color:"#ef3048",roughness:.35,metalness:.25,emissive:"#8b071b",emissiveIntensity:Math.min(.15+value*.025,.65)}):muscleMat();
 });
}
function setView(which){if(which!=="front"&&which!=="back")return;activeView=which;if(bodyGroup)bodyGroup.rotation.y=which==="front"?0:Math.PI;document.querySelectorAll("[data-anatomy-view]").forEach(b=>b.classList.toggle("active",b.dataset.anatomyView===which));}
function resize(){if(!renderer||!camera)return;const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
async function init(){
 try{
  THREE=await import("https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js");
  scene=new THREE.Scene();scene.background=null;
  camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(0,0,9.5);
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:"high-performance"});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  host.innerHTML="";host.appendChild(renderer.domElement);renderer.domElement.setAttribute("aria-label","Интерактивная трёхмерная анатомическая модель");
  scene.add(new THREE.HemisphereLight("#e8edf5","#242832",2.1));
  const key=new THREE.DirectionalLight("#ffffff",3.2);key.position.set(-3,5,6);key.castShadow=true;scene.add(key);
  const rim=new THREE.DirectionalLight("#8c9bb4",2.4);rim.position.set(4,1,-5);scene.add(rim);
  const fill=new THREE.PointLight("#ff4359",.45,12);fill.position.set(0,0,4);scene.add(fill);
  buildBody();ready=true;applyLoad();resize();
  new ResizeObserver(resize).observe(host);
  renderer.setAnimationLoop(()=>{renderer.render(scene,camera);});
  setView(activeView);
 }catch(err){host.innerHTML='<div class="anatomy3d-error">Не удалось загрузить 3D-движок. Проверь подключение к интернету и обнови страницу.</div>';console.error("3D anatomy init failed",err);}
}
function update(totals={}){lastTotals=totals||{};applyLoad();}
function pointerDown(e){host.setPointerCapture?.(e.pointerId);if(!drag)drag={x:e.clientX,y:e.clientY};}
function pointerMove(e){if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag={x:e.clientX,y:e.clientY};if(bodyGroup){bodyGroup.rotation.y+=dx*.009;bodyGroup.rotation.x=Math.max(-.45,Math.min(.45,bodyGroup.rotation.x+dy*.006));}}
function pointerUp(){drag=null;}
host.addEventListener("pointerdown",pointerDown);host.addEventListener("pointermove",pointerMove);host.addEventListener("pointerup",pointerUp);host.addEventListener("pointercancel",pointerUp);
host.addEventListener("wheel",e=>{e.preventDefault();zoom=Math.max(.78,Math.min(1.4,zoom-e.deltaY*.001));camera?.position.set(0,0,9.5/zoom);},{passive:false});
host.addEventListener("click",e=>{if(!ready)return;const rect=renderer.domElement.getBoundingClientRect(),mouse=new THREE.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),ray=new THREE.Raycaster();ray.setFromCamera(mouse,camera);const hits=ray.intersectObjects(bodyGroup.children,true);if(hits.length){const muscle=hits.find(h=>h.object.userData.muscle)?.object.userData.muscle;if(muscle&&hint())hint().textContent=muscle+" · нагрузка за 7 дней: "+Number(lastTotals[muscle]||0).toFixed(1);}});
document.querySelectorAll("[data-anatomy-view]").forEach(b=>b.addEventListener("click",()=>setView(b.dataset.anatomyView)));
window.MGC3D={update,view:setView};
init();
})();