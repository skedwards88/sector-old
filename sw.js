if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let r=Promise.resolve();return s[e]||(r=new Promise((async r=>{if("document"in self){const s=document.createElement("script");s.src=e,document.head.appendChild(s),s.onload=r}else importScripts(e),r()}))),r.then((()=>{if(!s[e])throw new Error(`Module ${e} didn’t register its module`);return s[e]}))},r=(r,s)=>{Promise.all(r.map(e)).then((e=>s(1===e.length?e[0]:e)))},s={require:Promise.resolve(r)};self.define=(r,a,i)=>{s[r]||(s[r]=Promise.resolve().then((()=>{let s={};const c={uri:location.origin+r.slice(1)};return Promise.all(a.map((r=>{switch(r){case"exports":return s;case"module":return c;default:return e(r)}}))).then((e=>{const r=i(...e);return s.default||(s.default=r),s}))})))}}define("./sw.js",["./workbox-543be79b"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"app.js",revision:"e389491228b75a7778fc45f718d32b35"},{url:"images/favicon.png",revision:"82e63880d805fbb6722b6529a178cf68"},{url:"images/icon_512.png",revision:"716a5d88794b529a9d12d79dba5f1ed5"},{url:"images/moon.svg",revision:"5935e6c119a08e3a40cb2ffba7ee3cae"},{url:"images/move.svg",revision:"62621d096f2954cc65001322cc2d7a2e"},{url:"images/planet.svg",revision:"b7f803c17d5935e508a5acb81c1a817d"},{url:"images/rotate.svg",revision:"7e7607547d009291d05b4a82fd0d50ff"},{url:"images/rules/adjacent.png",revision:"ef08278d65943b1bc1a9b2215d194f34"},{url:"images/rules/diagonal.png",revision:"ea47356230327eb90345c3efff11db24"},{url:"images/rules/end_and_score.png",revision:"bbacda403cafaec2122eb45b9e333313"},{url:"images/rules/example_tile.png",revision:"f20ee5bd4f4d9ec96324752679d80a1b"},{url:"images/rules/large/adjacent.png",revision:"5b71c8012c931b10ce95eaf0152d15ad"},{url:"images/rules/large/diagonal.png",revision:"7de6a03e1ff12f366456edccad63148d"},{url:"images/rules/large/end_and_score.png",revision:"bbacda403cafaec2122eb45b9e333313"},{url:"images/rules/large/example_tile.png",revision:"b12b636650bd470d476bec81f5bb1e50"},{url:"images/rules/large/legal_overlap.png",revision:"6e10f937ff7c020a9ce3209d25d165fc"},{url:"images/rules/large/placements.png",revision:"715433f2ddd5df16bd28e584effb13a2"},{url:"images/rules/large/score.png",revision:"f6a38a0ec32651d7f33d715fb271f7c8"},{url:"images/rules/large/sectors.png",revision:"c741e9d9fe762a6ac1e78e4b74d10ca6"},{url:"images/rules/large/symbols.png",revision:"4b6886f22337aefef7e0491f15ed8bc1"},{url:"images/rules/legal_overlap.png",revision:"223ceb374cf11c06a0ecb44b3e723bfa"},{url:"images/rules/placements.png",revision:"b7b5ea9a6c99eeae6dd0b9527bf9d099"},{url:"images/rules/score.png",revision:"575fe46f7e7b9b3ce2c426a2b7c415cd"},{url:"images/rules/sectors.png",revision:"ec324358000fe83d62d738ee544686cc"},{url:"images/rules/symbols.png",revision:"5d6d93cc3535ac5d0db5b5860048acf7"},{url:"images/star.svg",revision:"1d086de214e59e0d0561cb2d162e580b"},{url:"images/stars.svg",revision:"0df182f412a5d414e65284b6bc86c742"},{url:"images/whirl.svg",revision:"2778085fc382e5fb369371984fab0b5a"},{url:"index.css",revision:"42a0352dc82bae41f9b92b44f7fb1817"},{url:"index.html",revision:"b5b94cd09dabe6acc79003e6a417ff9f"},{url:"index.js",revision:"0f38d135501edf207df836ddc13ab6fa"},{url:"manifest.json",revision:"a2ed22520e2ba3dd8a88337103c39196"},{url:"package-lock.json",revision:"93bae34b43c7da56a543b0b141ac4550"},{url:"package.json",revision:"668310006b0e68ed3387832b72340c7d"},{url:"score.js",revision:"3ad0e765e38c21eb75b237750d557153"},{url:"shuffle.js",revision:"7cd1925f22243d26c5f90acec81fa2cb"},{url:"tiles.js",revision:"d7183da7173d92ad40e056fe20baae5d"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]})}));
//# sourceMappingURL=sw.js.map
