import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/controls/OrbitControls.js";

const host=document.getElementById("anatomy3d");
if(host){
 const scene=new THREE.Scene(); scene.background=new THREE.Color(0x14151b);
 const camera=new THREE.PerspectiveCamera(34,1,.1,100); camera.position.set(0,1.7,8.8);
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true}); renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.15; host.innerHTML="";host.appendChild(renderer.domElement);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.07;controls.minDistance=5.2;controls.maxDistance=12;controls.target.set(0,1.45,0);controls.maxPolarAngle=Math.PI*.88;
 scene.add(new THREE.HemisphereLight(0xdce7ff,0x271b20,2.1));
 const key=new THREE.DirectionalLight(0xffe1d7,3.3);key.position.set(-4,7,6);scene.add(key);
 const rim=new THREE.DirectionalLight(0x789cff,2.2);rim.position.set(4,4,-5);scene.add(rim);
 const fill=new THREE.PointLight(0xff5b54,35,10);fill.position.set(0,2.4,4);scene.add(fill);
 const floor=new THREE.Mesh(new THREE.CircleGeometry(2.4,64),new THREE.MeshBasicMaterial({color:0x20232c,transparent:true,opacity:.55}));floor.rotation.x=-Math.PI/2;floor.position.y=-.04;scene.add(floor);
 const body=new THREE.Group();body.scale.set(.88,1,.92);scene.add(body);
 const materials={base:new THREE.MeshStandardMaterial({color:0x9a5149,roughness:.58,metalness:.02}),muscle:new THREE.MeshStandardMaterial({color:0xb45d52,roughness:.48}),deep:new THREE.MeshStandardMaterial({color:0x713b3b,roughness:.6}),tendon:new THREE.MeshStandardMaterial({color:0xd0b4a0,roughness:.72}),bone:new THREE.MeshStandardMaterial({color:0xc8b6a6,roughness:.8}),hot:new THREE.MeshStandardMaterial({color:0xff263f,emissive:0x8e071c,emissiveIntensity:.65,roughness:.38})};
 const parts={};
 function ell(group,name,pos,scale,mat="muscle",rot=[0,0,0]){const mesh=new THREE.Mesh(new THREE.SphereGeometry(1,24,18),materials[mat]);mesh.position.set(...pos);const factor=name?0.88:1;mesh.scale.set(scale[0]*factor,scale[1]*factor,scale[2]*factor);mesh.rotation.set(...rot);mesh.userData.muscle=name;body.add(mesh);if(name)(parts[name]??=[]).push(mesh);return mesh;}
 function limb(name,a,b,r1,r2,mat="muscle"){const mid=new THREE.Vector3(...a).add(new THREE.Vector3(...b)).multiplyScalar(.5);const d=new THREE.Vector3(...b).sub(new THREE.Vector3(...a));const m=ell(null,name,mid.toArray(),[r1,d.length()*.62,r2],mat);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m;}
 // torso core, neck and head
 ell(null,null,[0,2.35,0],[.66,.91,.34],"base");
 ell(null,null,[0,3.15,0],[.23,.28,.22],"tendon");ell(null,null,[0,3.55,0],[.27,.34,.25],"base");
 // clavicle / sternum and rib/abdominal layers
 ell(null,"Грудь",[-.39,2.82,.27],[.43,.27,.19]);ell(null,"Грудь",[.39,2.82,.27],[.43,.27,.19]);
 ell(null,"Пресс",[-.17,2.37,.31],[.16,.34,.095]);ell(null,"Пресс",[.17,2.37,.31],[.16,.34,.095]);
 for(let y=2.52;y>=2.0;y-=.17){ell(null,"Пресс",[-.17,y,.385],[.145,.075,.065]);ell(null,"Пресс",[.17,y,.385],[.145,.075,.065]);}
 ell(null,"Пресс",[-.53,2.36,.16],[.12,.39,.12],"deep",[0,0,-.22]);ell(null,"Пресс",[.53,2.36,.16],[.12,.39,.12],"deep",[0,0,.22]);
 // upper back, lats and spinal erectors
 ell(null,"Спина",[0,2.9,-.29],[.32,.38,.14],"deep");ell(null,"Спина",[-.39,2.5,-.27],[.3,.52,.15]);ell(null,"Спина",[.39,2.5,-.27],[.3,.52,.15]);
 ell(null,"Спина",[-.12,2.45,-.36],[.095,.63,.09],"deep");ell(null,"Спина",[.12,2.45,-.36],[.095,.63,.09],"deep");
 // shoulders and arms, both sides
 for(const s of [-1,1]){
  ell(null,"Плечи",[s*.72,2.98,0],[.29,.31,.29]);
  limb("Бицепс",[s*.83,2.82,.05],[s*1.02,2.15,.08],.19,.17);
  limb("Трицепс",[s*.84,2.78,-.13],[s*1.04,2.12,-.12],.19,.16);
  ell(null,"Бицепс",[s*1.02,2.36,.19],[.14,.31,.13]);
  limb("Трицепс",[s*1.04,2.18,-.12],[s*1.13,1.73,-.08],.14,.13);
  limb("Бицепс",[s*1.04,2.18,.12],[s*1.13,1.73,.14],.13,.12);
  ell(null,null,[s*1.13,1.66,0],[.12,.12,.12],"tendon");
 }
 // pelvis, glutes and legs
 ell(null,null,[0,1.65,0],[.48,.36,.29],"deep");
 for(const s of [-1,1]){
  ell(null,"Ягодицы",[s*.25,1.62,-.27],[.29,.34,.2]);
  limb("Квадрицепс",[s*.25,1.52,.12],[s*.3,.62,.1],.25,.21);
  ell(null,"Квадрицепс",[s*.3,1.16,.26],[.19,.47,.13]);
  limb("Бицепс бедра",[s*.25,1.5,-.17],[s*.3,.65,-.17],.22,.17);
  ell(null,"Бицепс бедра",[s*.3,1.1,-.22],[.17,.42,.13]);
  ell(null,null,[s*.3,.57,.03],[.15,.16,.15],"bone");
  limb("Икры",[s*.3,.52,-.04],[s*.32,.12,-.02],.17,.17);
  ell(null,"Икры",[s*.32,.32,.13],[.15,.31,.16]);
  ell(null,null,[s*.32,.08,.1],[.14,.1,.27],"tendon");
 }
 // fine tendon lines as sculpted landmarks
 function tendon(a,b,r=.018){const v1=new THREE.Vector3(...a),v2=new THREE.Vector3(...b),d=v2.clone().sub(v1);const m=new THREE.Mesh(new THREE.CylinderGeometry(r*.65,r,d.length(),8),materials.tendon);m.position.copy(v1.add(v2).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());body.add(m);}
 tendon([0,3.05,.18],[0,2.78,.36],.02);tendon([0,2.02,.31],[0,1.83,.25],.025);
 for(const s of [-1,1]){tendon([s*.72,2.9,.2],[s*.45,2.85,.37]);tendon([s*.3,.68,.2],[s*.3,.53,.18]);}
 // floor shadow
 const shadow=new THREE.Mesh(new THREE.CircleGeometry(1.25,48),new THREE.MeshBasicMaterial({color:0x050609,transparent:true,opacity:.55}));shadow.rotation.x=-Math.PI/2;shadow.position.y=-.035;shadow.scale.set(1.15,1.8,1);scene.add(shadow);
 const defaults={};for(const [name,list] of Object.entries(parts))list.forEach(m=>defaults[name]=materials.muscle);
 let current={};
 function update(totals={}){current=totals;for(const [name,list] of Object.entries(parts)){const on=(totals[name]||0)>0;list.forEach(m=>{m.material=on?materials.hot:(name==="Спина"?materials.deep:materials.muscle);});}}
 function view(which){if(which==="front"){camera.position.set(0,1.75,8.8);controls.target.set(0,1.65,0);}else if(which==="back"){camera.position.set(0,1.75,-8.8);controls.target.set(0,1.65,0);}else{camera.position.set(8.8,1.7,0);controls.target.set(0,1.65,0);}controls.update();document.querySelectorAll("[data-anatomy-view]").forEach(b=>b.classList.toggle("active",b.dataset.anatomyView===which));}
 document.querySelectorAll("[data-anatomy-view]").forEach(b=>b.addEventListener("click",()=>view(b.dataset.anatomyView)));
 const names=["Грудь","Спина","Плечи","Бицепс","Трицепс","Пресс","Квадрицепс","Бицепс бедра","Ягодицы","Икры"];
 document.getElementById("anatomy3dLegend").innerHTML=names.map(n=>'<span><i></i>'+n+'</span>').join("");
 function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
 new ResizeObserver(resize).observe(host);resize();
 function animate(){requestAnimationFrame(animate);controls.update();renderer.render(scene,camera);}animate();
 window.MGC3D={update,view};
}
