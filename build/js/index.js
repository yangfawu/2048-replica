(()=>{"use strict";var t={540:(t,e,s)=>{var r=s(755),o=s.n(r);class n{constructor(t,e,s=1){this._power=s,this.before=[t,e],this.now=[t,e];const r=`${n.ANIMATION_TIME}s`;this.node=o()("<div>").addClass("tile").attr("data-value",0).css("transition",["top","left","transform"].join(` ${r}, `)+` ${r}`),this._compile()}get power(){return this._power}get value(){return Math.pow(2,this._power)}equals(t){return this.value==(null==t?void 0:t.value)}static get spacing(){return"15px"}_compile(){const t=n.spacing,e=`calc(25% - calc(0.75 * ${t}))`,s=`calc(${e} / 2)`,r=r=>`calc(${s} + ${this.now[r]}*${e} + ${this.now[r]}*${t})`;return this.node.text(this.value).attr("data-value",this.value).css({top:r(0),left:r(1)}),this}upgrade(){return this._power++,this._compile(),this.node.css("transform","translate(-50%, -50%) scale(1.2)"),setTimeout((()=>{this.node.css("transform","translate(-50%, -50%) scale(1)")}),1e3*n.ANIMATION_TIME),this}changeCoord(t,e){return this.before=[...this.now],this.now=[t,e],this._compile()}changeCol(t){return this.changeCoord(this.now[0],t)}changeRow(t){return this.changeCoord(t,this.now[1])}remove(){return this.node.remove(),this}get flatBeforeIndex(){return 4*this.before[0]+this.before[1]}get flatNowIndex(){return 4*this.now[0]+this.now[1]}}n.ANIMATION_TIME=.1;class i{constructor(){this.tiles=new Array(16),this.state="IDLE";const t=()=>({node:o()("<span>").css("transition",`transform ${n.ANIMATION_TIME}s, color ${n.ANIMATION_TIME}s`).text(0),value:0});this.score=[t(),t()];const e=o()('<div class="back">');for(let t=0;t<16;t++)e.append("<div>");this.$front=o()('<div class="front">');const s=()=>{this.reset()};this.over={text:o()("<p>").text("Game over!"),button:o()("<button>").text("Try again").on("click",s)},this.$over=o()('<div class="over">').append(...Object.values(this.over)).fadeOut(0),this.node=o()('<section class="ui">').append(o()('<div class="header">').append(o()("<div>").append(o()("<h1>").text("2048"),o()("<p>").html('Join the tiles, get to <a href="https://play2048.co/" target="_blank">2048!</a>'),o()("<p>").text("Replicated from scratch by Yangfa")),o()("<div>").append(o()("<div>").append(o()("<div>").append(o()("<h1>").text("score"),this.score[0].node),o()("<div>").append(o()("<h1>").text("best"),this.score[1].node)),o()("<button>").text("New Game").on("click",s))),o()('<div class="board">').append(e,this.$front,this.$over),o()("<p>").html('All the colors and general formatting were sourced from <a href="https://play2048.co/" target="_blank">here</a>. Everything else in this project is built from scratch using node_modules, TS, and SCSS. Have fun.')),this.reset()}setScore(t,e){const s=this.score[t];return s.value!=e&&(s.value=e,s.node.text(s.value).css({transform:"scale(1.2)",color:"#dddddd"}),setTimeout((()=>{s.node.css({transform:"scale(1)",color:"white"})}),i.ANIMATION_TIME)),this}addScore(t){return this.setScore(0,this.score[0].value+t),this._normalizeScores()}_normalizeScores(){return this.score[0].value>this.score[1].value&&this.setScore(1,this.score[0].value),this}empty(){for(let t=0;t<this.tiles.length;t++)this.tiles[t]=null;return this.$front.empty(),this}addTileRandomly(t=1){const e=this.emptyTileIndexes;if(e.length>0){const s=e[Math.floor(Math.random()*e.length)],r=Math.floor(s/4),o=new n(r,s%4,t);this.$front.append(o.node),this.tiles[s]=o}return this}addRandomTile(t=1){for(let e=0;e<t;e++)this.addTileRandomly(Math.random()>i.chanceOf4?2:1);return this}get rows(){const t=new Array(4);for(let e=0;e<t.length;e++){const s=new Array(4);for(let t=0;t<4;t++)s[t]=this.tiles[4*e+t];t[e]=s}return t}get cols(){const t=new Array(4);for(let e=0;e<t.length;e++){const s=new Array(4);for(let t=0;t<4;t++)s[t]=this.tiles[4*t+e];t[e]=s}return t}getRow(t){return this.rows[t]}getCol(t){return this.cols[t]}getTileFlatly(t){return t<0||t>=this.tiles.length?null:this.tiles[t]}getTile(t,e){return this.tiles[4*t+e]}_isGroupCollapsable(t){var e;for(let s=1;s<t.length;s++)if(null===(e=t[s])||void 0===e?void 0:e.equals(t[s-1]))return!0;return!1}get collapsableRows(){const t=[];for(let e=0;e<this.rows.length;e++){const s=this.rows[e];this._isGroupCollapsable(s)&&t.push(e)}return t}get collapsableCols(){const t=[];for(let e=0;e<this.cols.length;e++){const s=this.cols[e];this._isGroupCollapsable(s)&&t.push(e)}return t}get isRowsCollapsable(){return this.collapsableRows.length>0}get isColsCollapsable(){return this.collapsableCols.length>0}get isCollapsable(){return this.isRowsCollapsable||this.isColsCollapsable}get _sortedFlatIndexes(){const t=[[],[]];for(let e=0;e<this.tiles.length;e++)t[this.tiles[e]?0:1].push(e);return t}get filledTileIndexes(){return this._sortedFlatIndexes[0]}get emptyTileIndexes(){return this._sortedFlatIndexes[1]}get randomOpenIndex(){const t=this.emptyTileIndexes;return t.length<1?-1:t[Math.floor(Math.random()*t.length)]}get isCompleted(){return this.tiles.findIndex((t=>t&&t.value>=2048))>-1}get isFull(){return 0==this.emptyTileIndexes.length}get isUnbeatable(){return this.isFull&&!this.isCollapsable}static _generateEmptyMap(){const t=new Array(4);for(let e=0;e<4;e++){const s=[];for(let t=0;t<4;t++)s[t]=null;t[e]=s}return t}_collapse(t,e=!0){const s=i._generateEmptyMap(),r=[...this[t]].map((t=>t.filter((t=>null!=t))));for(let t=0;t<r.length;t++){const o=r[t];let n=e?3:0;for(;o.length>0;){const r=o[e?o.length-1:0];if(o.length>1){const t=e?o.length-2:1,s=o[t];r.equals(s)&&(r.upgrade(),this.addScore(r.value),s.remove(),o.splice(t,1))}s[t][n]=r,e?(n--,o.pop()):(n++,o.shift())}}for(let e=0;e<this.tiles.length;e++){const r=Math.floor(e/4),o=e%4,n="rows"==t?s[r][o]:s[o][r];this.tiles[e]=n?n.changeCoord(r,o):null}return this}collapse(t,e=!0){const s=this.flatPrint;return this._collapse(t,e),this.flatPrint==s||this.isFull||(this.addRandomTile(),(this.isUnbeatable||this.isCompleted)&&(this.over.text.text("Game over!"),this.over.button.text("Try again"),this.isCompleted&&(this.over.text.text("You win!"),this.over.button.text("Replay")),this.$over.fadeIn(500))),this}get flatMap(){return this.tiles}get flatPrint(){const t=[];for(let e=0;e<this.tiles.length;e++){const s=this.tiles[e];t.push(s?s.value:null)}return t.join("-")}shift(t){return"BUSY"==this.state?new Promise(((t,e)=>{e("The board is currently busy executing another move.")})):this.isUnbeatable||this.isCompleted?new Promise(((t,e)=>{this.over.text.text("Game over!"),this.over.button.text("Try again"),this.isCompleted&&(this.over.text.text("You win!"),this.over.button.text("Replay")),this.$over.fadeIn(500),e("The game is over.")})):(this.state="BUSY",new Promise((e=>{"RIGHT"==t||"LEFT"==t?this.collapse("rows","RIGHT"==t):this.collapse("cols","DOWN"==t),setTimeout((()=>{this.state="IDLE",e(t+" move executed.")}),i.ANIMATION_TIME)})))}reset(){return this._normalizeScores().setScore(0,0).empty().$over.fadeOut(500,(()=>{this.addRandomTile(2)})),this}}i.DELAY=0,i.ANIMATION_TIME=1e3*n.ANIMATION_TIME+i.DELAY,i.chanceOf4=.7;var l=s(655);class a{constructor(t){this.board=t,this.listening={keydown:!1,swipe:!1},this.listenForKeyDown(),this.listenForSwipe()}listenForKeyDown(){return this.listening.keydown||(this.listening.keydown=!0,o()(window).on("keydown",(t=>{t.preventDefault();let e=null;switch(t.code){case"KeyA":case"ArrowLeft":e="LEFT";break;case"KeyS":case"ArrowDown":e="DOWN";break;case"KeyD":case"ArrowRight":e="RIGHT";break;case"KeyW":case"ArrowUp":e="UP"}e&&this.trigger(e).then((t=>{a.DEBUG&&console.log(t)})).catch((t=>{a.DEBUG&&console.log(t)}))}))),this}listenForSwipe(){if(this.listening.swipe)return this;this.listening.swipe=!0;let t=!1,e=[0,0];const s=this.board.$front;return s.on("touchstart",(s=>{if(s.preventDefault(),t)return;if(s.touches.length<1)return;t=!0;const r=s.touches[0];e=[r.clientX,r.clientY]})),s.on("touchend",(s=>{if(s.preventDefault(),!t)return;if(s.changedTouches.length<1)return;const r=s.changedTouches[0];this._analyzeTouch(e,[r.clientX,r.clientY]),t=!1})),s.on("touchcancel",(e=>{e.preventDefault(),t=!1})),this}get TOUCH_DIST_THRESHOLD(){return(this.board.$front.width()||400)/4}_analyzeTouch(t,e){if(Math.sqrt(Math.pow(t[0]-e[0],2)+Math.pow(t[1]-e[1],2))<this.TOUCH_DIST_THRESHOLD)return;e[0]-=t[0],e[1]-=t[1];const s=Math.atan2(e[1],e[0]);this.trigger(s>3*Math.PI/4||s<=-3*Math.PI/4?"LEFT":s<=3*Math.PI/4&&s>Math.PI/4?"DOWN":s<=Math.PI/4&&s>-Math.PI/4?"RIGHT":"UP").then((t=>{a.DEBUG&&console.log(t)})).catch((t=>{a.DEBUG&&console.log(t)}))}trigger(t){return(0,l.mG)(this,void 0,void 0,(function*(){return this.board.shift(t)}))}}a.DEBUG=!1;const h=new i,c=new a(h);o()(document.body).append(h.node),a.DEBUG&&console.log(c.board)}},e={};function s(r){if(e[r])return e[r].exports;var o=e[r]={exports:{}};return t[r].call(o.exports,o,o.exports,s),o.exports}s.m=t,s.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return s.d(e,{a:e}),e},s.d=(t,e)=>{for(var r in e)s.o(e,r)&&!s.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},s.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),(()=>{var t={179:0},e=[[540,874]],r=()=>{};function o(){for(var r,o=0;o<e.length;o++){for(var n=e[o],i=!0,l=1;l<n.length;l++){var a=n[l];0!==t[a]&&(i=!1)}i&&(e.splice(o--,1),r=s(s.s=n[0]))}return 0===e.length&&(s.x(),s.x=()=>{}),r}s.x=()=>{s.x=()=>{},i=i.slice();for(var t=0;t<i.length;t++)n(i[t]);return(r=o)()};var n=o=>{for(var n,i,[a,h,c,u]=o,d=0,p=[];d<a.length;d++)i=a[d],s.o(t,i)&&t[i]&&p.push(t[i][0]),t[i]=0;for(n in h)s.o(h,n)&&(s.m[n]=h[n]);for(c&&c(s),l(o);p.length;)p.shift()();return u&&e.push.apply(e,u),r()},i=self.webpackChunk_2048=self.webpackChunk_2048||[],l=i.push.bind(i);i.push=n})(),s.x()})();