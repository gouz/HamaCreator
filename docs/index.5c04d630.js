const e=document.querySelector("#mockup"),t=e.getContext("2d"),l=document.createElement("img"),n=document.querySelector("#temp"),c=n.getContext("2d"),o=document.querySelector("#horizontal"),r=document.querySelector("#vertical");let a=1,i=1,d=[];const s=document.querySelector("#palette"),h=document.querySelector("#spinner");let u=!0;fetch("./list.json").then((e=>e.json())).then((e=>{s.innerHTML="";for(let t=0;t<e.palette.length;t++)d.push(e.palette[t].color),s.innerHTML+=`\n        <label title="${e.palette[t].label}">\n          <input class="color-picked" type="checkbox" value="${e.palette[t].color}" checked />\n          <span class="border">\n            <span class="color" style="background-color: ${e.palette[t].color};"></span>\n            <span class="number">${e.palette[t].num}</span>\n            </span>\n          <span class="sr-only">${e.palette[t].label}</span>\n        </label>\n      `;s.innerHTML+='<button id="toggle">Aucun</button>',document.querySelector("#toggle").addEventListener("click",(()=>{document.querySelectorAll(".color-picked").forEach((e=>{e.checked=u,e.click()})),document.querySelector("#toggle").innerHTML=u?"Tous":"Aucun",u=!u}),!1),document.querySelectorAll(".color-picked").forEach((e=>{e.addEventListener("click",(()=>{e.checked?d.push(e.value):d.splice(d.indexOf(e.value),1)}),!1)}))}));const p=e=>{let t=768,l=d[0];for(let n=0;n<d.length;n++){let c=0;for(let t=0;t<3;t++)c+=Math.abs(e[t]-parseInt(d[n].substring(2*t+1,2*t+3),16));c<t&&(t=c,l=d[n])}return l},g=()=>{a>i?(e.width=580,e.height=580*i/a):(e.width=580*a/i,e.height=580)};l.addEventListener("load",(()=>{t.clearRect(0,0,e.width,e.height),c.clearRect(0,0,n.width,n.height),(()=>{n.width=29*a,n.height=29*i;let e=l.width,t=l.height;t*=n.width/e,e=n.width,t>n.height&&(e*=n.height/t,t=n.height),c.drawImage(l,0,0,l.width,l.height,(n.width-e)/2,(n.height-t)/2,e,t)})(),(()=>{if(d.length)for(let e=0;e<n.width;e++)for(let l=0;l<n.height;l++){const n=c.getImageData(e,l,1,1).data;if(0!=n[3]){t.beginPath();let c=a;i>a&&(c=i),t.arc((10+20*e)/c,(10+20*l)/c,8/c,0,2*Math.PI),t.lineWidth=5/c,t.strokeStyle=p(n),t.stroke()}}else alert("Pas de coloris sélectionné")})(),h.style.display="none"}),!1),e.addEventListener("dragover",(e=>{e.preventDefault()}),!1),e.addEventListener("drop",(e=>{const t=e.dataTransfer.files;if(t.length>0){const e=t[0];if("undefined"!=typeof FileReader&&-1!=e.type.indexOf("image")){h.style.display="block";const t=new FileReader;t.onload=e=>{l.src=e.target.result},t.readAsDataURL(e)}}e.preventDefault()}),!1),o.addEventListener("click",(()=>{a=o.value,g()}),!1),r.addEventListener("click",(()=>{i=r.value,g()}),!1);