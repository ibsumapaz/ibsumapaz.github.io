(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function e(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(s){if(s.ep)return;s.ep=!0;const i=e(s);fetch(s.href,i)}})();const A={FAVORITES:"himnario_favorites_set",PLAYLISTS:"himnario_playlists_json",USER_NAME:"himnario_user_name",USER_AVATAR_COLOR:"himnario_user_avatar_color",USER_PROFILE_IMAGE:"himnario_user_profile_image",APP_THEME:"himnario_app_theme",TEXT_SIZE:"himnario_text_size_scale",WAKE_LOCK:"himnario_wake_lock_enabled"},b={getFavorites(){try{const r=localStorage.getItem(A.FAVORITES);if(!r)return new Set;const t=JSON.parse(r);return new Set(t.map(Number))}catch{return new Set}},setFavorites(r){try{const t=Array.from(r);localStorage.setItem(A.FAVORITES,JSON.stringify(t))}catch(t){console.error("Failed to save favorites",t)}},toggleFavorite(r){const t=this.getFavorites(),e=t.has(r);return e?t.delete(r):t.add(r),this.setFavorites(t),!e},isFavorite(r){return this.getFavorites().has(r)},getPlaylists(){try{const r=localStorage.getItem(A.PLAYLISTS);if(!r)return[];const t=JSON.parse(r);return Array.isArray(t)?t:[]}catch{return[]}},savePlaylists(r){try{localStorage.setItem(A.PLAYLISTS,JSON.stringify(r))}catch(t){console.error("Failed to save playlists",t)}},createPlaylist(r){const t=(r||"").trim();if(!t)return!1;const e=this.getPlaylists();return e.some(a=>a.name.toLowerCase()===t.toLowerCase())?!1:(e.push({name:t,hymns:[]}),this.savePlaylists(e),!0)},deletePlaylist(r){const t=this.getPlaylists().filter(e=>e.name.toLowerCase()!==r.toLowerCase());this.savePlaylists(t)},addHymnToPlaylist(r,t){const e=this.getPlaylists(),a=e.findIndex(i=>i.name.toLowerCase()===r.toLowerCase());if(a===-1)return!1;const s=e[a];return s.hymns.includes(t)||(s.hymns.push(t),this.savePlaylists(e)),!0},removeHymnFromPlaylist(r,t){const e=this.getPlaylists(),a=e.findIndex(s=>s.name.toLowerCase()===r.toLowerCase());a!==-1&&(e[a].hymns=e[a].hymns.filter(s=>s!==t),this.savePlaylists(e))},moveHymnInPlaylist(r,t,e){const a=this.getPlaylists(),s=a.findIndex(c=>c.name.toLowerCase()===r.toLowerCase());if(s===-1)return;const i=[...a[s].hymns],n=i.indexOf(t);if(n===-1)return;const l=e?n-1:n+1;if(l>=0&&l<i.length){const c=i[n];i[n]=i[l],i[l]=c,a[s].hymns=i,this.savePlaylists(a)}},getUserName(){return localStorage.getItem(A.USER_NAME)||""},setUserName(r){localStorage.setItem(A.USER_NAME,r||"")},getUserAvatarColor(){return localStorage.getItem(A.USER_AVATAR_COLOR)||"#14C69B"},setUserAvatarColor(r){localStorage.setItem(A.USER_AVATAR_COLOR,r||"#14C69B")},getUserProfileImage(){return localStorage.getItem(A.USER_PROFILE_IMAGE)||""},setUserProfileImage(r){try{localStorage.setItem(A.USER_PROFILE_IMAGE,r||"")}catch(t){console.warn("Failed to save image in localStorage (size limit)",t)}},getAppTheme(){return localStorage.getItem(A.APP_THEME)||"system"},setAppTheme(r){localStorage.setItem(A.APP_THEME,r||"system")},getTextSizeScale(){return localStorage.getItem(A.TEXT_SIZE)||"normal"},setTextSizeScale(r){localStorage.setItem(A.TEXT_SIZE,r||"normal")},getWakeLockEnabled(){return localStorage.getItem(A.WAKE_LOCK)==="true"},setWakeLockEnabled(r){localStorage.setItem(A.WAKE_LOCK,r?"true":"false")},exportBackup(){try{const r=Array.from(this.getFavorites()),t=this.getPlaylists(),e={version:1,favorites:r,playlists:t},a=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),s=URL.createObjectURL(a),i=document.createElement("a");return i.href=s,i.download=`himnario_backup_${new Date().toISOString().slice(0,10)}.json`,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(s),!0}catch(r){return console.error("Export backup failed",r),!1}},async importBackup(r){try{const t=await r.text(),e=JSON.parse(t);if(Array.isArray(e.favorites)){const a=this.getFavorites();e.favorites.forEach(s=>{(typeof s=="number"||typeof s=="string"&&!isNaN(Number(s)))&&a.add(Number(s))}),this.setFavorites(a)}if(Array.isArray(e.playlists)){const a=this.getPlaylists();e.playlists.forEach(s=>{if(s&&s.name){const i=s.name.trim(),n=Array.isArray(s.hymns)?s.hymns.map(Number):[],l=a.findIndex(c=>c.name.toLowerCase()===i.toLowerCase());if(l!==-1){const c=Array.from(new Set([...a[l].hymns,...n]));a[l].hymns=c}else a.push({name:i,hymns:n})}}),this.savePlaylists(a)}return!0}catch(t){return console.error("Import backup failed",t),!1}}};class _{constructor(){this.state={hymnsList:[],isLoading:!0,activeTab:0,selectedCategory:null,categoryMode:"THEMATIC",selectedPlaylist:null,selectedHymn:null,searchQuery:"",favorites:b.getFavorites(),playlists:b.getPlaylists(),userProfile:{name:b.getUserName(),avatarColor:b.getUserAvatarColor(),profileImage:b.getUserProfileImage()},appTheme:b.getAppTheme(),textSizeScale:b.getTextSizeScale(),wakeLockEnabled:b.getWakeLockEnabled(),activeModal:null,modalPayload:null},this.listeners=new Set}get(){return this.state}set(t){this.state={...this.state,...t},this.notify()}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}notify(){this.listeners.forEach(t=>{try{t(this.state)}catch(e){console.error("State listener error",e)}})}setActiveTab(t){this.set({activeTab:t,selectedCategory:null,selectedHymn:null})}setSelectedCategory(t){this.set({selectedCategory:t,selectedHymn:null})}setCategoryMode(t){this.set({categoryMode:t,selectedCategory:null})}setSelectedPlaylist(t){this.set({selectedPlaylist:t,selectedHymn:null})}setSelectedHymn(t){this.set({selectedHymn:t})}setSearchQuery(t){const e={searchQuery:t};t&&t.trim()&&(this.state.selectedHymn&&(e.selectedHymn=null),this.state.activeTab===4&&(e.activeTab=0)),this.set(e)}toggleFavorite(t){const e=b.toggleFavorite(t),a=b.getFavorites();return this.set({favorites:a}),e}refreshPlaylists(){const t=b.getPlaylists();let e=this.state.selectedPlaylist;e&&(e=t.find(a=>a.name.toLowerCase()===e.name.toLowerCase())||null),this.set({playlists:t,selectedPlaylist:e})}openModal(t,e=null){this.set({activeModal:t,modalPayload:e})}closeModal(){this.set({activeModal:null,modalPayload:null})}applyTheme(t){b.setAppTheme(t),this.set({appTheme:t}),P(t)}toggleTheme(){const t=this.state.appTheme;let e="dark";t==="dark"?e="light":t==="light"?e="dark":e=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"light":"dark",this.applyTheme(e)}applyTextScale(t){b.setTextSizeScale(t),this.set({textSizeScale:t}),N(t)}}function U(){const r=b.getAppTheme();return r==="dark"?!0:r==="light"?!1:window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches}function P(r){let t=!1;r==="dark"?t=!0:r==="light"?t=!1:t=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches,document.documentElement.setAttribute("data-theme",t?"dark":"light");const e=document.querySelector('meta[name="theme-color"]');e&&e.setAttribute("content",t?"#081120":"#006680")}function N(r){let t=1;r==="large"?t=1.25:r==="extra_large"&&(t=1.5),document.documentElement.style.setProperty("--font-scale",t.toString())}const o=new _,F=new Set([19,176,204,301,379,481,525,547]);function B(r){return r?r.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase():""}function z(r){if(!r)return"Original";const e=r.substring(r.lastIndexOf("/")+1).replace(".mp3","").split("-");if(e.length<=1)return"Original";const a=e[e.length-1],s=a.toLowerCase(),i=new Set(["do","re","mi","fa","sol","la","si"]);if(s==="m"&&e.length>2){const l=e[e.length-2].toLowerCase();if(i.has(l))return`${l.charAt(0).toUpperCase()+l.slice(1)}-m`}return/^(do|re|mi|fa|sol|la|si)(#|b|m)?$/i.test(a)?a.charAt(0).toUpperCase()+a.slice(1).toLowerCase():"Original"}function Q(r){return r.map(t=>{const e=t.index_number,a=t.title||"",s=t.index_title||a,i=t.key||null,n=t.mood||null,l=t.bible_passage||null,c=t.category||null,u=Array.isArray(t.credits)?t.credits:[],v=Array.isArray(t.notes)?t.notes:[],h=t.type||"song",m=Array.isArray(t.mp3_urls)?t.mp3_urls:[],g=t.mp3_variantes||0,p=[];if(h==="reading")(Array.isArray(t.paragraphs)?t.paragraphs:[]).forEach(k=>{p.push({type:"verse",text:k,number:null})});else{const L=[];Array.isArray(t.stanzas)&&t.stanzas.forEach(T=>{const x=Array.isArray(T.lines)?T.lines:[];L.push({type:"verse",text:x.join(`
`),number:T.label||null})});const k=[];if(Array.isArray(t.choruses)&&t.choruses.forEach(T=>{const x=Array.isArray(T.lines)?T.lines:[];k.push({type:"chorus",text:x.join(`
`),number:null})}),F.has(e))p.push(...k),p.push(...L);else if(L.length>0){p.push(L[0]),k.length>0&&p.push(k[0]);for(let T=1;T<L.length;T++)p.push(L[T]);for(let T=1;T<k.length;T++)p.push(k[T])}else p.push(...k)}const f=p.map(L=>L.text).join(`

`),y=B(s),I=B(f);return{number:e,title:a,indexTitle:s,key:i,mood:n,biblePassage:l,credits:u,sections:p,fullText:f,searchTitle:y,searchLyrics:I,bibleVerse:null,bibleReference:null,authorLyrics:null,authorMusic:null,category:c,type:h,footnotes:v,mp3Urls:m,mp3Variantes:g}})}function R(r,t){if(!r||r.length===0)return[];if(t==="READINGS")return["Lecturas Bíblicas"];const e=new Map;return r.forEach(a=>{let s=null;if(t==="THEMATIC"?s=a.category:t==="KEY"?s=a.key:t==="MOOD"&&(s=a.mood),s&&s.trim()){const i=s.trim();e.set(i,(e.get(i)||0)+1)}}),Array.from(e.entries()).sort((a,s)=>s[1]-a[1]).map(a=>a[0])}function H(r,{activeTab:t,selectedCategory:e,categoryMode:a,searchQuery:s,favorites:i}){let n=r;t===1&&e?a==="THEMATIC"?n=r.filter(c=>c.category===e):a==="READINGS"?n=r.filter(c=>c.type==="reading"):a==="KEY"?n=r.filter(c=>c.key===e):a==="MOOD"&&(n=r.filter(c=>c.mood===e)):t===3&&(n=r.filter(c=>i.has(c.number)));const l=B((s||"").trim());if(l){const c=parseInt(l,10);isNaN(c)?n=n.filter(u=>u.searchTitle.includes(l)||u.searchLyrics.includes(l)||u.category&&B(u.category).includes(l)||u.key&&B(u.key).includes(l)||u.mood&&B(u.mood).includes(l)):n=n.filter(u=>u.number===c||u.searchTitle.includes(l)||u.searchLyrics.includes(l))}return n}const d={music:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>',book:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>',queue:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/></svg>',heart:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',heartOutline:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',info:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',search:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',close:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',arrowBack:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>',check:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>',play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',pause:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',prev:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>',next:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>',share:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92z"/></svg>',playlistAdd:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"/></svg>',delete:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>',add:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>',arrowUp:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg>',arrowDown:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/></svg>',camera:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0-8c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5zm-7 14.5c0-2.33 4.67-3.5 7-3.5s7 1.17 7 3.5V20H5v-1.5z"/></svg>',upload:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>',download:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>',sun:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>',moon:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>'};function M(r){if(!r||isNaN(r)||r<0)return"00:00";const t=Math.floor(r),e=Math.floor(t/60),a=t%60;return`${e.toString().padStart(2,"0")}:${a.toString().padStart(2,"0")}`}class V{constructor(){this.audio=new Audio,this.currentHymn=null,this.currentUrl=null,this.currentQueue=[],this.isPlaying=!1,this.isLoading=!1,this.currentTime=0,this.duration=0,this.listeners=new Set,this.initAudioEvents(),this.initMediaSession()}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}notify(){const t=this.getState();this.listeners.forEach(e=>{try{e(t)}catch(a){console.error("Audio listener error",a)}})}getState(){return{currentHymn:this.currentHymn,currentUrl:this.currentUrl,currentQueue:this.currentQueue,isPlaying:this.isPlaying,isLoading:this.isLoading,currentTime:this.currentTime,duration:this.duration,hasPrevious:this.hasPrevious(),hasNext:this.hasNext()}}initAudioEvents(){this.audio.addEventListener("loadstart",()=>{this.isLoading=!0,this.notify()}),this.audio.addEventListener("canplay",()=>{this.isLoading=!1,this.duration=this.audio.duration||0,this.notify()}),this.audio.addEventListener("play",()=>{this.isPlaying=!0,this.isLoading=!1,this.updateMediaSessionPlaybackState("playing"),this.notify()}),this.audio.addEventListener("pause",()=>{this.isPlaying=!1,this.updateMediaSessionPlaybackState("paused"),this.notify()}),this.audio.addEventListener("timeupdate",()=>{this.currentTime=this.audio.currentTime||0,this.duration=this.audio.duration||this.duration||0,this.notify()}),this.audio.addEventListener("ended",()=>{this.hasNext()?this.playNext():(this.isPlaying=!1,this.currentTime=0,this.notify())}),this.audio.addEventListener("error",t=>{console.warn("Audio playback error",t),this.isLoading=!1,this.isPlaying=!1,this.notify()})}initMediaSession(){"mediaSession"in navigator&&(navigator.mediaSession.setActionHandler("play",()=>this.resume()),navigator.mediaSession.setActionHandler("pause",()=>this.pause()),navigator.mediaSession.setActionHandler("previoustrack",()=>this.playPrevious()),navigator.mediaSession.setActionHandler("nexttrack",()=>this.playNext()),navigator.mediaSession.setActionHandler("seekto",t=>{t.seekTime!==void 0&&this.seekTo(t.seekTime)}))}updateMediaSessionMetadata(){"mediaSession"in navigator&&this.currentHymn&&(navigator.mediaSession.metadata=new MediaMetadata({title:`Himno ${this.currentHymn.number}: ${this.currentHymn.title}`,artist:"Celebremos Su Gloria",album:this.currentHymn.category||"Himnario Cristiano",artwork:[{src:"./logo.png",sizes:"192x192",type:"image/png"},{src:"./logo.png",sizes:"512x512",type:"image/png"}]}))}updateMediaSessionPlaybackState(t){"mediaSession"in navigator&&(navigator.mediaSession.playbackState=t)}hasPrevious(){if(!this.currentHymn||!this.currentQueue.length)return!1;const t=this.currentQueue.findIndex(e=>e.number===this.currentHymn.number);return t>0&&this.currentQueue.slice(0,t).some(e=>e.mp3Urls&&e.mp3Urls.length>0)}hasNext(){if(!this.currentHymn||!this.currentQueue.length)return!1;const t=this.currentQueue.findIndex(e=>e.number===this.currentHymn.number);return t!==-1&&t<this.currentQueue.length-1&&this.currentQueue.slice(t+1).some(e=>e.mp3Urls&&e.mp3Urls.length>0)}play(t,e=[],a=null){if(!t)return;const s=a||t.mp3Urls&&t.mp3Urls[0];s&&(this.currentHymn=t,this.currentQueue=e.length?e:[t],this.currentUrl=s,this.isLoading=!0,this.audio.src=s,this.audio.play().catch(i=>{console.warn("Audio play prevented or failed:",i)}),this.updateMediaSessionMetadata(),this.notify())}pause(){this.audio.pause()}resume(){this.currentUrl&&this.audio.play().catch(()=>{})}stop(){this.audio.pause(),this.audio.currentTime=0,this.currentHymn=null,this.currentUrl=null,this.isPlaying=!1,this.isLoading=!1,this.notify()}seekTo(t){this.audio&&!isNaN(t)&&(this.audio.currentTime=t,this.currentTime=t,this.notify())}playNext(){if(!this.currentHymn||!this.currentQueue.length)return;const t=this.currentQueue.findIndex(e=>e.number===this.currentHymn.number);if(t!==-1)for(let e=t+1;e<this.currentQueue.length;e++){const a=this.currentQueue[e];if(a.mp3Urls&&a.mp3Urls.length>0){this.play(a,this.currentQueue,a.mp3Urls[0]);return}}}playPrevious(){if(!this.currentHymn||!this.currentQueue.length)return;const t=this.currentQueue.findIndex(e=>e.number===this.currentHymn.number);if(!(t<=0))for(let e=t-1;e>=0;e--){const a=this.currentQueue[e];if(a.mp3Urls&&a.mp3Urls.length>0){this.play(a,this.currentQueue,a.mp3Urls[0]);return}}}}const E=new V;function $(r,t=2500){let e=document.querySelector(".toast-container");e||(e=document.createElement("div"),e.className="toast-container",document.body.appendChild(e));const a=document.createElement("div");a.className="toast",a.innerHTML=`<span>${r}</span>`,e.appendChild(a),setTimeout(()=>{a.style.opacity="0",a.style.transform="translateY(10px) scale(0.95)",a.style.transition="all 0.2s ease-out",setTimeout(()=>{a.remove()},200)},t)}async function D(r){if(!r)return;const t=r.number,e=r.title,a=r.category?`_Categoría: ${r.category}_

`:`
`,s=r.key?` (Tono: ${r.key})`:"",i=r.sections.map(u=>{let v="";return u.type==="chorus"?v=`[CORO]
`:u.number&&(v=`${u.number}. `),`${v}${u.text}`}).join(`

`),n=r.footnotes.length?`

${r.footnotes.join(`
`)}`:"",l=r.credits.length?`

— ${r.credits.join(`
`)}`:"",c=`🎶 *Himno ${t}: ${e}*${s}
${a}${i}${n}${l}`;if(navigator.share)try{await navigator.share({title:`Himno ${t}: ${e}`,text:c});return}catch(u){if(u.name!=="AbortError")console.warn("Share API failed, fallback to clipboard",u);else return}try{await navigator.clipboard.writeText(c),$("Letra copiada al portapapeles")}catch{const v=document.createElement("textarea");v.value=c,v.style.position="fixed",v.style.opacity="0",document.body.appendChild(v),v.focus(),v.select();try{document.execCommand("copy"),$("Letra copiada al portapapeles")}catch{$("No se pudo copiar el texto")}document.body.removeChild(v)}}class q{constructor(t){this.container=t,this.currentDetailVariantIndex=0,this.renderedView={type:null,tab:null,category:null,playlistName:null,hymnNumber:null,mode:null},this.currentActiveModal=null,this.renderedAudioTrackUrl=null,this.isUserSeeking=!1}init(){this.renderSkeleton(),this.bindGlobalEvents(),this.initSidebar(),this.initHeader(),this.initNav(),o.subscribe(()=>{this.render()}),E.subscribe(()=>{this.updatePlayerUI()}),this.render()}renderSkeleton(){this.container.innerHTML=`
      <aside class="app-sidebar" id="app-sidebar"></aside>
      <div class="app-stage">
        <header class="app-header" id="app-header"></header>
        <main class="main-viewport" id="main-viewport"></main>
        <div id="bottom-player-host"></div>
        <nav class="bottom-nav" id="bottom-nav"></nav>
      </div>
      <div id="modal-host"></div>
    `}bindGlobalEvents(){window.addEventListener("popstate",()=>{const t=o.get();t.selectedHymn?o.setSelectedHymn(null):t.activeTab===1&&t.selectedCategory?o.setSelectedCategory(null):t.activeTab===2&&t.selectedPlaylist?o.setSelectedPlaylist(null):t.activeTab!==0&&o.setActiveTab(0)}),window.addEventListener("keydown",t=>{if((t.ctrlKey||t.metaKey)&&t.key.toLowerCase()==="k"){t.preventDefault();const e=document.getElementById("top-search-input")||document.getElementById("mobile-search-input");e==null||e.focus(),e==null||e.select();return}if(t.key==="Escape"){const e=o.get();e.activeModal?o.closeModal():e.selectedHymn?o.setSelectedHymn(null):e.activeTab===1&&e.selectedCategory?o.setSelectedCategory(null):e.activeTab===2&&e.selectedPlaylist?o.setSelectedPlaylist(null):e.searchQuery&&o.setSearchQuery("")}})}render(){this.updateSidebar(),this.updateHeader(),this.updateNav(),this.renderContent(),this.renderModal(),this.updatePlayerUI()}initSidebar(){var a,s,i;const t=document.getElementById("app-sidebar");if(!t)return;const e=[{id:0,label:"Todos los Himnos",icon:d.music,countId:"sidebar-count-all"},{id:1,label:"Categorías",icon:d.book,countId:null},{id:2,label:"Listas de Reproducción",icon:d.queue,countId:"sidebar-count-playlists"},{id:3,label:"Favoritos",icon:d.heart,countId:"sidebar-count-favs"},{id:4,label:"Acerca de",icon:d.info,countId:null}];t.innerHTML=`
      <div class="sidebar-top">
        <div class="sidebar-brand" id="btn-sidebar-home" role="button" tabindex="0">
          <img src="./logo.png" alt="Logo" class="sidebar-logo">
          <div class="sidebar-titles">
            <span class="sidebar-title">Celebremos Su Gloria</span>
            <span class="sidebar-badge">HIMNARIO</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          ${e.map(n=>`
            <a class="sidebar-nav-item" data-sidebar-tab="${n.id}" role="button" tabindex="0">
              ${n.icon}
              <span>${n.label}</span>
              ${n.countId?`<span class="sidebar-badge-count" id="${n.countId}">0</span>`:""}
            </a>
          `).join("")}
        </nav>
      </div>

      <div class="sidebar-bottom">
        <button class="sidebar-theme-toggle" id="btn-sidebar-theme-toggle" title="Cambiar tema">
          <div class="theme-toggle-left">
            <span id="sidebar-theme-icon">${d.moon}</span>
            <span id="sidebar-theme-label">Modo Oscuro</span>
          </div>
          <div class="theme-toggle-switch">
            <div class="theme-toggle-dot"></div>
          </div>
        </button>

        <div class="sidebar-profile-card" id="btn-sidebar-profile" role="button" tabindex="0">
          <div class="user-avatar-badge" id="sidebar-user-avatar" style="width: 34px; height: 34px; background-color: #14C69B;">
            <span id="sidebar-avatar-initial">U</span>
          </div>
          <div class="sidebar-profile-info">
            <span class="sidebar-profile-name" id="sidebar-profile-name">Mi Perfil</span>
            <span class="sidebar-profile-sub">Ajustes & Copias</span>
          </div>
        </div>
      </div>
    `,(a=document.getElementById("btn-sidebar-home"))==null||a.addEventListener("click",()=>{o.setActiveTab(0),o.setSelectedHymn(null)}),t.querySelectorAll("[data-sidebar-tab]").forEach(n=>{n.addEventListener("click",()=>{const l=parseInt(n.getAttribute("data-sidebar-tab"),10);o.setActiveTab(l)})}),(s=document.getElementById("btn-sidebar-theme-toggle"))==null||s.addEventListener("click",()=>{o.toggleTheme()}),(i=document.getElementById("btn-sidebar-profile"))==null||i.addEventListener("click",()=>{o.openModal("PROFILE")}),this.updateSidebar()}updateSidebar(){const t=document.getElementById("app-sidebar");if(!t)return;const e=o.get(),a=e.userProfile,s=U(),i=a.name?a.name.trim().charAt(0).toUpperCase():"U",n=a.avatarColor||"#14C69B";t.querySelectorAll("[data-sidebar-tab]").forEach(p=>{const f=parseInt(p.getAttribute("data-sidebar-tab"),10),y=e.activeTab===f&&!e.selectedHymn;p.classList.toggle("active",y)});const l=document.getElementById("sidebar-count-all");l&&(l.textContent=e.hymnsList.length);const c=document.getElementById("sidebar-count-playlists");c&&(c.textContent=e.playlists.length);const u=document.getElementById("sidebar-count-favs");u&&(u.textContent=e.favorites.size);const v=document.getElementById("sidebar-theme-icon");v&&(v.innerHTML=s?d.moon:d.sun);const h=document.getElementById("sidebar-theme-label");h&&(h.textContent=s?"Modo Oscuro":"Modo Claro");const m=document.getElementById("sidebar-user-avatar");m&&(m.style.backgroundColor=n,a.profileImage?m.innerHTML=`<img src="${a.profileImage}" alt="Avatar">`:m.innerHTML=`<span id="sidebar-avatar-initial">${i}</span>`);const g=document.getElementById("sidebar-profile-name");g&&(g.textContent=a.name||"Mi Perfil")}initHeader(){var a,s,i,n;const t=document.getElementById("app-header");if(!t)return;t.innerHTML=`
      <div class="mobile-header-brand" id="btn-mobile-home" role="button" tabindex="0">
        <img src="./logo.png" alt="Logo" class="mobile-header-logo">
        <div>
          <div class="mobile-header-title">Celebremos Su Gloria</div>
          <div class="mobile-header-sub">Himnario</div>
        </div>
      </div>

      <div class="desktop-header-left">
        <div class="top-search-box">
          <span class="top-search-icon">${d.search}</span>
          <input type="text" class="top-search-input" id="top-search-input" placeholder="Buscar por número, título, letra, tono o pasaje..." autocomplete="off" spellcheck="false">
          <button class="search-clear-btn hidden" id="btn-clear-top-search" aria-label="Limpiar búsqueda">${d.close}</button>
          <span class="top-search-shortcut" id="top-search-shortcut">Ctrl K</span>
        </div>
      </div>

      <div class="header-actions">
        <button class="header-action-btn" id="btn-header-theme-toggle" title="Alternar Modo Oscuro / Claro">
          <span id="header-theme-icon">${d.moon}</span>
        </button>

        <button class="header-profile-btn" id="btn-open-profile-header" aria-label="Ajustes de Perfil">
          <div class="user-avatar-badge" id="header-user-avatar" style="background-color: #14C69B;">
            <span id="header-avatar-initial">U</span>
          </div>
        </button>
      </div>
    `,(a=document.getElementById("btn-mobile-home"))==null||a.addEventListener("click",()=>{o.setActiveTab(0),o.setSelectedHymn(null)});const e=document.getElementById("top-search-input");e==null||e.addEventListener("input",l=>{o.setSearchQuery(l.target.value)}),(s=document.getElementById("btn-clear-top-search"))==null||s.addEventListener("click",()=>{o.setSearchQuery(""),e==null||e.focus()}),(i=document.getElementById("btn-header-theme-toggle"))==null||i.addEventListener("click",()=>{o.toggleTheme()}),(n=document.getElementById("btn-open-profile-header"))==null||n.addEventListener("click",()=>{o.openModal("PROFILE")}),this.updateHeader()}updateHeader(){if(!document.getElementById("app-header"))return;const e=o.get(),a=U(),s=e.userProfile,i=s.name?s.name.trim().charAt(0).toUpperCase():"U",n=s.avatarColor||"#14C69B",l=document.getElementById("top-search-input");l&&l.value!==(e.searchQuery||"")&&(l.value=e.searchQuery||"");const c=document.getElementById("btn-clear-top-search"),u=document.getElementById("top-search-shortcut"),v=!!(e.searchQuery&&e.searchQuery.length>0);c&&c.classList.toggle("hidden",!v),u&&u.classList.toggle("hidden",v);const h=document.getElementById("header-theme-icon");h&&(h.innerHTML=a?d.moon:d.sun);const m=document.getElementById("header-user-avatar");m&&(m.style.backgroundColor=n,s.profileImage?m.innerHTML=`<img src="${s.profileImage}" alt="Avatar">`:m.innerHTML=`<span id="header-avatar-initial">${i}</span>`)}initNav(){const t=document.getElementById("bottom-nav");if(!t)return;const e=[{id:0,label:"Todos",icon:d.music},{id:1,label:"Categorías",icon:d.book},{id:2,label:"Listas",icon:d.queue},{id:3,label:"Favoritos",icon:d.heart},{id:4,label:"Ayuda",icon:d.info}];t.innerHTML=e.map(a=>`
      <button class="nav-item" data-tab="${a.id}">
        <div class="icon-wrapper">${a.icon}</div>
        <span class="nav-label">${a.label}</span>
      </button>
    `).join(""),t.querySelectorAll(".nav-item").forEach(a=>{a.addEventListener("click",()=>{const s=parseInt(a.getAttribute("data-tab"),10);o.setActiveTab(s)})}),this.updateNav()}updateNav(){const t=document.getElementById("bottom-nav");if(!t)return;const e=o.get();t.querySelectorAll(".nav-item").forEach(a=>{const s=parseInt(a.getAttribute("data-tab"),10),i=e.activeTab===s&&!e.selectedHymn;a.classList.toggle("active",i)})}renderContent(){const t=document.getElementById("main-viewport");if(!t)return;const e=o.get();if(e.isLoading){this.renderedView.type!=="LOADING"&&(t.innerHTML=`
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Cargando himnos...</p>
          </div>
        `,this.renderedView={type:"LOADING"},t.scrollTop=0);return}if(e.selectedHymn){const a=e.selectedHymn.number;this.renderedView.type!=="DETAIL"||this.renderedView.hymnNumber!==a?(this.renderHymnDetail(t,e.selectedHymn),this.renderedView={type:"DETAIL",hymnNumber:a},t.scrollTop=0):this.updateHymnDetailDynamicElements(t,e.selectedHymn);return}switch(e.activeTab){case 0:this.renderHymnsListTab(t);break;case 1:this.renderCategoriesTab(t);break;case 2:this.renderPlaylistsTab(t);break;case 3:this.renderFavoritesTab(t);break;case 4:this.renderInfoTab(t);break;default:this.renderHymnsListTab(t)}}renderHymnsListTab(t){var n,l;const e=o.get(),a=H(e.hymnsList,{activeTab:0,searchQuery:e.searchQuery,favorites:e.favorites}),s=a.filter(c=>c.mp3Urls&&c.mp3Urls.length>0);if(this.renderedView.type==="TAB_0"){const c=t.querySelector(".hymns-grid-container");c&&(c.innerHTML=this.buildHymnGridItems(a,e.searchQuery,e.favorites));const u=t.querySelector(".view-subheading");u&&(u.textContent=`${a.length} ${a.length===1?"himno disponible":"himnos disponibles"}`);const v=document.getElementById("btn-play-all-hymns");v&&(v.style.display=s.length>0?"inline-flex":"none");const h=document.getElementById("mobile-search-input");h&&h.value!==(e.searchQuery||"")&&(h.value=e.searchQuery||"");const m=document.getElementById("btn-clear-mobile-search");m&&m.classList.toggle("hidden",!e.searchQuery),this.bindHymnCardClicks();return}this.renderedView={type:"TAB_0"},t.scrollTop=0,t.innerHTML=`
      <div class="view-content-wrapper">
        <div class="mobile-search-bar">
          <div class="mobile-search-box">
            <span class="top-search-icon">${d.search}</span>
            <input type="text" class="mobile-search-input" id="mobile-search-input" placeholder="Buscar himnos..." value="${e.searchQuery||""}" autocomplete="off">
            <button class="search-clear-btn ${e.searchQuery?"":"hidden"}" id="btn-clear-mobile-search">${d.close}</button>
          </div>
        </div>

        <div class="view-header-bar">
          <div>
            <h1 class="view-heading">Todos los Himnos</h1>
            <span class="view-subheading">${a.length} ${a.length===1?"himno disponible":"himnos disponibles"}</span>
          </div>
          <button class="btn-primary btn-compact" id="btn-play-all-hymns" style="display: ${s.length>0?"inline-flex":"none"};">
            ${d.play} Reproducir
          </button>
        </div>

        <div class="hymns-grid-container">
          ${this.buildHymnGridItems(a,e.searchQuery,e.favorites)}
        </div>
      </div>
    `;const i=document.getElementById("mobile-search-input");i==null||i.addEventListener("input",c=>{o.setSearchQuery(c.target.value)}),(n=document.getElementById("btn-clear-mobile-search"))==null||n.addEventListener("click",()=>{o.setSearchQuery(""),i==null||i.focus()}),(l=document.getElementById("btn-play-all-hymns"))==null||l.addEventListener("click",()=>{const c=o.get(),v=H(c.hymnsList,{activeTab:0,searchQuery:c.searchQuery,favorites:c.favorites}).filter(h=>h.mp3Urls&&h.mp3Urls.length>0);v.length>0&&E.play(v[0],v)}),this.bindHymnCardClicks()}renderCategoriesTab(t){var i,n;const e=o.get();if(e.selectedCategory){const l=H(e.hymnsList,{activeTab:1,selectedCategory:e.selectedCategory,categoryMode:e.categoryMode,searchQuery:e.searchQuery,favorites:e.favorites}),c=l.filter(u=>u.mp3Urls&&u.mp3Urls.length>0);if(this.renderedView.type==="CAT_DETAIL"&&this.renderedView.category===e.selectedCategory){const u=t.querySelector(".hymns-grid-container");u&&(u.innerHTML=this.buildHymnGridItems(l,e.searchQuery,e.favorites));const v=t.querySelector(".view-subheading");v&&(v.textContent=`${l.length} himnos`);const h=document.getElementById("btn-play-all-cat");h&&(h.style.display=c.length>0?"inline-flex":"none"),this.bindHymnCardClicks();return}this.renderedView={type:"CAT_DETAIL",category:e.selectedCategory},t.scrollTop=0,t.innerHTML=`
        <div class="view-content-wrapper">
          <div class="category-header">
            <button class="category-header-back" id="btn-back-categories" title="Volver a Categorías">
              ${d.arrowBack}
            </button>
            <div>
              <h1 class="category-header-title">${e.selectedCategory}</h1>
              <span class="view-subheading">${l.length} himnos</span>
            </div>
            <button class="btn-primary btn-compact" id="btn-play-all-cat" style="margin-left: auto; display: ${c.length>0?"inline-flex":"none"};">
              ${d.play} Reproducir
            </button>
          </div>

          <div class="hymns-grid-container">
            ${this.buildHymnGridItems(l,e.searchQuery,e.favorites)}
          </div>
        </div>
      `,(i=document.getElementById("btn-back-categories"))==null||i.addEventListener("click",()=>{o.setSelectedCategory(null)}),(n=document.getElementById("btn-play-all-cat"))==null||n.addEventListener("click",()=>{const u=o.get(),h=H(u.hymnsList,{activeTab:1,selectedCategory:u.selectedCategory,categoryMode:u.categoryMode,searchQuery:u.searchQuery,favorites:u.favorites}).filter(m=>m.mp3Urls&&m.mp3Urls.length>0);h.length>0&&E.play(h[0],h)}),this.bindHymnCardClicks();return}if(this.renderedView.type==="CAT_ROOT"&&this.renderedView.mode===e.categoryMode)return;this.renderedView={type:"CAT_ROOT",mode:e.categoryMode},t.scrollTop=0;const a=[{id:"THEMATIC",label:"Temas",icon:d.book},{id:"READINGS",label:"Lecturas Bíblicas",icon:d.book},{id:"KEY",label:"Notas / Tonos",icon:d.music},{id:"MOOD",label:"Carácter",icon:d.music}],s=R(e.hymnsList,e.categoryMode);t.innerHTML=`
      <div class="view-content-wrapper">
        <div class="view-header-bar">
          <div>
            <h1 class="view-heading">Categorías y Clasificaciones</h1>
            <span class="view-subheading">Explora los himnos por temática, lecturas bíblicas, tono musical o carácter</span>
          </div>
        </div>

        <div class="category-modes-bar">
          ${a.map(l=>`
            <button class="chip-btn ${e.categoryMode===l.id?"active":""}" data-mode="${l.id}">
              ${l.label}
            </button>
          `).join("")}
        </div>

        <div class="categories-grid">
          ${s.map(l=>`
            <div class="category-card" data-category="${l}">
              <div class="category-card-icon">
                ${e.categoryMode==="KEY"||e.categoryMode==="MOOD"?d.music:d.book}
              </div>
              <div class="category-card-title">${l}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `,t.querySelectorAll(".chip-btn").forEach(l=>{l.addEventListener("click",()=>{const c=l.getAttribute("data-mode");o.setCategoryMode(c)})}),t.querySelectorAll(".category-card").forEach(l=>{l.addEventListener("click",()=>{const c=l.getAttribute("data-category");o.setSelectedCategory(c)})})}renderPlaylistsTab(t){var s,i,n,l,c;const e=o.get();if(e.selectedPlaylist){const u=e.selectedPlaylist,v=u.hymns.map(m=>e.hymnsList.find(g=>g.number===m)).filter(Boolean),h=v.filter(m=>m.mp3Urls&&m.mp3Urls.length>0);this.renderedView={type:"PL_DETAIL",playlistName:u.name},t.scrollTop=0,t.innerHTML=`
        <div class="view-content-wrapper">
          <div class="playlist-detail-header">
            <button class="category-header-back" id="btn-back-playlists" title="Volver a listas">
              ${d.arrowBack}
            </button>
            <div style="flex: 1;">
              <h1 class="playlist-detail-title">${u.name}</h1>
              <span class="view-subheading">${v.length} himnos</span>
            </div>
            ${h.length>0?`
              <button class="btn-primary btn-compact" id="btn-play-all-pl">
                ${d.play} Reproducir
              </button>
            `:""}
          </div>

          ${v.length===0?`
            <div class="empty-state">
              <div class="empty-state-icon">${d.queue}</div>
              <div class="empty-state-title">Esta lista está vacía</div>
              <p class="empty-state-desc">Añade himnos tocando el botón de lista (+) en la vista detallada de cualquier himno.</p>
            </div>
          `:`
            <div class="hymns-grid-container">
              ${v.map((m,g)=>`
                <div class="hymn-grid-item" data-number="${m.number}">
                  <div class="hymn-number-badge">${m.number}</div>
                  <div class="hymn-info">
                    <span class="hymn-title">${m.title}</span>
                    ${m.category?`<span class="hymn-subtitle">${m.category}</span>`:""}
                  </div>
                  <div class="playlist-hymn-actions" onclick="event.stopPropagation();">
                    <button class="playlist-reorder-btn btn-move-up" data-num="${m.number}" ${g===0?"disabled":""} title="Subir">
                      ${d.arrowUp}
                    </button>
                    <button class="playlist-reorder-btn btn-move-down" data-num="${m.number}" ${g===v.length-1?"disabled":""} title="Bajar">
                      ${d.arrowDown}
                    </button>
                    <button class="playlist-reorder-btn btn-remove-hymn" data-num="${m.number}" title="Remover de lista">
                      ${d.close}
                    </button>
                  </div>
                </div>
              `).join("")}
            </div>
          `}
        </div>
      `,(s=document.getElementById("btn-back-playlists"))==null||s.addEventListener("click",()=>{o.setSelectedPlaylist(null)}),(i=document.getElementById("btn-play-all-pl"))==null||i.addEventListener("click",()=>{h.length>0&&E.play(h[0],h)}),this.bindHymnCardClicks(),t.querySelectorAll(".btn-move-up").forEach(m=>{m.addEventListener("click",()=>{const g=parseInt(m.getAttribute("data-num"),10);b.moveHymnInPlaylist(u.name,g,!0),o.refreshPlaylists()})}),t.querySelectorAll(".btn-move-down").forEach(m=>{m.addEventListener("click",()=>{const g=parseInt(m.getAttribute("data-num"),10);b.moveHymnInPlaylist(u.name,g,!1),o.refreshPlaylists()})}),t.querySelectorAll(".btn-remove-hymn").forEach(m=>{m.addEventListener("click",()=>{const g=parseInt(m.getAttribute("data-num"),10);b.removeHymnFromPlaylist(u.name,g),o.refreshPlaylists()})});return}this.renderedView={type:"PL_ROOT"},t.scrollTop=0;const a=e.playlists;t.innerHTML=`
      <div class="view-content-wrapper">
        <div class="view-header-bar">
          <div>
            <h1 class="view-heading">Listas de Reproducción</h1>
            <span class="view-subheading">Organiza y reproduce secuencias de himnos para los servicios y cultos</span>
          </div>
          <button class="btn-primary btn-compact" id="btn-create-playlist-header">
            ${d.add} Nueva lista
          </button>
        </div>

        <div class="playlists-container">
          ${a.length===0?`
            <div class="empty-state" style="grid-column: 1 / -1;">
              <div class="empty-state-icon">${d.queue}</div>
              <div class="empty-state-title">No tienes listas creadas</div>
              <p class="empty-state-desc">Crea listas de reproducción para organizar tus himnos favoritos para los cultos o devocionales.</p>
              <button class="btn-primary btn-compact" id="btn-create-playlist-empty">
                ${d.add} Crear lista
              </button>
            </div>
          `:`
            ${a.map(u=>`
              <div class="playlist-card" data-playlist="${u.name}">
                <div class="playlist-card-info">
                  <span class="playlist-card-name">${u.name}</span>
                  <span class="playlist-card-count">${u.hymns.length} ${u.hymns.length===1?"himno":"himnos"}</span>
                </div>
                <button class="playlist-card-delete-btn" data-delete-playlist="${u.name}" title="Eliminar lista">
                  ${d.delete}
                </button>
              </div>
            `).join("")}
          `}
        </div>
      </div>
      <button class="fab-btn" id="fab-create-playlist" title="Nueva lista">
        ${d.add}
      </button>
    `,(n=document.getElementById("btn-create-playlist-header"))==null||n.addEventListener("click",()=>{o.openModal("CREATE_PLAYLIST")}),(l=document.getElementById("btn-create-playlist-empty"))==null||l.addEventListener("click",()=>{o.openModal("CREATE_PLAYLIST")}),(c=document.getElementById("fab-create-playlist"))==null||c.addEventListener("click",()=>{o.openModal("CREATE_PLAYLIST")}),t.querySelectorAll(".playlist-card").forEach(u=>{u.addEventListener("click",v=>{if(v.target.closest(".playlist-card-delete-btn"))return;const h=u.getAttribute("data-playlist"),m=a.find(g=>g.name===h);m&&o.setSelectedPlaylist(m)})}),t.querySelectorAll(".playlist-card-delete-btn").forEach(u=>{u.addEventListener("click",v=>{v.stopPropagation();const h=u.getAttribute("data-delete-playlist");o.openModal("DELETE_PLAYLIST",{name:h})})})}renderFavoritesTab(t){var i;const e=o.get(),a=H(e.hymnsList,{activeTab:3,searchQuery:e.searchQuery,favorites:e.favorites}),s=a.filter(n=>n.mp3Urls&&n.mp3Urls.length>0);if(this.renderedView.type==="FAVORITES"){if(e.favorites.size===0){t.innerHTML=`
          <div class="view-content-wrapper">
            <div class="empty-state">
              <div class="empty-state-icon">${d.heartOutline}</div>
              <div class="empty-state-title">No tienes himnos favoritos</div>
              <p class="empty-state-desc">Toca el corazón en la letra de cualquier himno para guardarlo en esta sección.</p>
            </div>
          </div>
        `;return}const n=t.querySelector(".hymns-grid-container");n&&(n.innerHTML=this.buildHymnGridItems(a,e.searchQuery,e.favorites));const l=t.querySelector(".view-subheading");l&&(l.textContent=`${a.length} himnos guardados`);const c=document.getElementById("btn-play-all-favs");c&&(c.style.display=s.length>0?"inline-flex":"none"),this.bindHymnCardClicks();return}if(this.renderedView={type:"FAVORITES"},t.scrollTop=0,e.favorites.size===0){t.innerHTML=`
        <div class="view-content-wrapper">
          <div class="empty-state">
            <div class="empty-state-icon">${d.heartOutline}</div>
            <div class="empty-state-title">No tienes himnos favoritos</div>
            <p class="empty-state-desc">Toca el corazón en la letra de cualquier himno para guardarlo en esta sección.</p>
          </div>
        </div>
      `;return}t.innerHTML=`
      <div class="view-content-wrapper">
        <div class="view-header-bar">
          <div>
            <h1 class="view-heading">Himnos Favoritos</h1>
            <span class="view-subheading">${a.length} himnos guardados</span>
          </div>
          <button class="btn-primary btn-compact" id="btn-play-all-favs" style="display: ${s.length>0?"inline-flex":"none"};">
            ${d.play} Reproducir
          </button>
        </div>

        <div class="hymns-grid-container">
          ${this.buildHymnGridItems(a,e.searchQuery,e.favorites)}
        </div>
      </div>
    `,(i=document.getElementById("btn-play-all-favs"))==null||i.addEventListener("click",()=>{const n=o.get(),c=H(n.hymnsList,{activeTab:3,searchQuery:n.searchQuery,favorites:n.favorites}).filter(u=>u.mp3Urls&&u.mp3Urls.length>0);c.length>0&&E.play(c[0],c)}),this.bindHymnCardClicks()}renderInfoTab(t){this.renderedView.type!=="INFO"&&(this.renderedView={type:"INFO"},t.scrollTop=0,t.innerHTML=`
      <div class="view-content-wrapper">
        <div class="info-view-container">
          <div class="info-hero">
            <img src="./logo.png" alt="Celebremos Su Gloria" class="info-logo">
            <div class="info-title">Celebremos Su Gloria</div>
            <div class="info-subtitle">Himnario Cristiano</div>
          </div>

          <div class="info-card">
            <div class="info-card-header">
              <div class="info-card-icon">${d.book}</div>
              <div class="info-card-title">Letras de los Himnos</div>
            </div>
            <p class="info-card-text">
              Las letras de los himnos son tomadas del himnario <strong>Celebremos su gloria</strong>, publicado por <strong>Editorial CLC</strong>. Agradecemos su gran labor para proveer este valioso recurso doctrinal e instrumental a la iglesia hispana.
            </p>
          </div>

          <div class="info-card">
            <div class="info-card-header">
              <div class="info-card-icon">${d.music}</div>
              <div class="info-card-title">Audios del Himnario</div>
            </div>
            <p class="info-card-text">
              Gracias a <a href="https://www.palabradeverdad.com/audio/himnario/" target="_blank" rel="noopener noreferrer" class="info-card-link">Audio Producciones Berea</a> por los audios de los himnos. Su ministerio es una gran bendición para el pueblo del Señor.
            </p>
          </div>

          <div class="info-card">
            <div class="info-card-header">
              <div class="info-card-icon">${d.heart}</div>
              <div class="info-card-title">Sobre el Proyecto</div>
            </div>
            <p class="info-card-text">
              Esta aplicación web y PWA ha sido creada con ❤️ por <strong>Alejandro Morales</strong>. El único propósito de este proyecto es servir al pueblo de Dios.
            </p>
          </div>
        </div>
      </div>
    `)}renderHymnDetail(t,e){var v,h,m,g,p,f;const a=o.get(),s=a.favorites.has(e.number);let i=a.hymnsList;a.activeTab===2&&a.selectedPlaylist?i=a.selectedPlaylist.hymns.map(y=>a.hymnsList.find(I=>I.number===y)).filter(Boolean):a.activeTab===3&&(i=a.hymnsList.filter(y=>a.favorites.has(y.number)));const n=E.getState(),l=n.currentHymn&&n.currentHymn.number===e.number;t.innerHTML=`
      <div class="hymn-detail-view">
        <div class="detail-top-bar">
          <button class="action-icon-btn" id="btn-back-detail" aria-label="Volver">
            ${d.arrowBack}
          </button>
          <div class="detail-actions">
            <button class="action-icon-btn" id="btn-add-playlist-detail" title="Añadir a lista">
              ${d.playlistAdd}
            </button>
            <button class="action-icon-btn" id="btn-share-detail" title="Compartir letra">
              ${d.share}
            </button>
            <button class="action-icon-btn ${s?"is-fav":""}" id="btn-fav-detail" title="${s?"Quitar de favoritos":"Añadir a favoritos"}">
              ${s?d.heart:d.heartOutline}
            </button>
          </div>
        </div>

        <div class="hymn-content">
          <div class="detail-header-badge">Himno ${e.number}</div>
          <h1 class="detail-hymn-title">${e.title}</h1>

          <div class="detail-tags-row">
            ${e.category?`<span class="tag-pill tag-category">${e.category}</span>`:""}
            ${e.key?`<span class="tag-pill tag-key">Tono: ${e.key}</span>`:""}
            ${e.mood?`<span class="tag-pill tag-mood">${e.mood}</span>`:""}
          </div>

          ${e.mp3Urls&&e.mp3Urls.length>0?`
            <div class="detail-player-card">
              <div class="player-card-header">
                <div class="player-info">
                  <div class="player-music-icon">${d.music}</div>
                  <div>
                    <div class="player-title">Audio disponible</div>
                    <div class="player-subtitle">${e.mp3Urls.length>1?`${e.mp3Urls.length} variantes de tono`:"Tono original"}</div>
                  </div>
                </div>
                <div class="player-controls-row">
                  <button class="player-btn-prev" id="btn-detail-prev" ${n.hasPrevious?"":"disabled"} title="Anterior">
                    ${d.prev}
                  </button>
                  <button class="player-btn-play" id="btn-detail-play" title="Reproducir">
                    ${l&&n.isPlaying?d.pause:d.play}
                  </button>
                  <button class="player-btn-next" id="btn-detail-next" ${n.hasNext?"":"disabled"} title="Siguiente">
                    ${d.next}
                  </button>
                </div>
              </div>

              <div class="player-seekbar-row" id="detail-seekbar-row" style="display: ${l&&n.duration>0?"block":"none"};">
                <input type="range" class="player-seekbar" id="detail-seekbar" min="0" max="${Math.floor(n.duration)}" value="${Math.floor(n.currentTime)}">
                <div class="player-times">
                  <span id="detail-time-current">${M(n.currentTime)}</span>
                  <span id="detail-time-duration">${M(n.duration)}</span>
                </div>
              </div>

              ${e.mp3Urls.length>1?`
                <div class="tone-variants-row">
                  <span class="tone-label">Tono:</span>
                  ${e.mp3Urls.map((y,I)=>{const L=z(y);return`
                      <button class="tone-chip ${this.currentDetailVariantIndex===I?"active":""}" data-variant-idx="${I}" data-url="${y}">
                        ${L}
                      </button>
                    `}).join("")}
                </div>
              `:""}
            </div>
          `:""}

          ${e.biblePassage?`
            <div class="bible-card">
              <div class="bible-icon">${d.book}</div>
              <div class="bible-content">
                <div class="bible-text">${e.bibleVerse||e.biblePassage}</div>
                ${e.bibleReference?`<div class="bible-ref">${e.bibleReference}</div>`:""}
              </div>
            </div>
          `:""}

          <div class="lyrics-container">
            ${e.type==="reading"?`
              ${e.sections.map(y=>`<p class="reading-paragraph">${y.text}</p>`).join("")}
            `:`
              ${e.sections.map(y=>y.type==="chorus"?`
                    <div class="chorus-card">
                      <div class="chorus-label">[CORO]</div>
                      <div class="chorus-text">${y.text}</div>
                    </div>
                  `:`
                    <div class="verse-block">
                      ${y.number?`<span class="verse-number">${y.number}</span>`:""}
                      <p class="verse-text">${y.text}</p>
                    </div>
                  `).join("")}
            `}
          </div>

          ${e.footnotes&&e.footnotes.length>0?`
            <div class="footnotes-card">
              ${e.footnotes.map(y=>`<div class="footnote-item">${y}</div>`).join("")}
            </div>
          `:""}

          ${e.credits&&e.credits.length>0?`
            <div class="hymn-credits-footer">
              ${e.credits.map(y=>`<span class="credit-line">${y}</span>`).join("")}
            </div>
          `:""}
        </div>
      </div>
    `,(v=document.getElementById("btn-back-detail"))==null||v.addEventListener("click",()=>{o.setSelectedHymn(null)}),(h=document.getElementById("btn-share-detail"))==null||h.addEventListener("click",()=>{D(e)}),(m=document.getElementById("btn-add-playlist-detail"))==null||m.addEventListener("click",()=>{o.openModal("ADD_TO_PLAYLIST",{hymn:e})}),(g=document.getElementById("btn-fav-detail"))==null||g.addEventListener("click",()=>{const y=o.toggleFavorite(e.number);$(y?"Añadido a favoritos":"Eliminado de favoritos")});const c=document.getElementById("btn-detail-play");c==null||c.addEventListener("click",()=>{const y=E.getState(),I=e.mp3Urls&&e.mp3Urls[this.currentDetailVariantIndex]||e.mp3Urls&&e.mp3Urls[0];I&&(y.currentUrl===I?y.isPlaying?E.pause():E.resume():E.play(e,i,I))}),(p=document.getElementById("btn-detail-prev"))==null||p.addEventListener("click",()=>{E.playPrevious()}),(f=document.getElementById("btn-detail-next"))==null||f.addEventListener("click",()=>{E.playNext()});const u=document.getElementById("detail-seekbar");u==null||u.addEventListener("input",y=>{E.seekTo(parseFloat(y.target.value))}),t.querySelectorAll(".tone-chip").forEach(y=>{y.addEventListener("click",()=>{const I=parseInt(y.getAttribute("data-variant-idx"),10),L=y.getAttribute("data-url");this.currentDetailVariantIndex=I,t.querySelectorAll(".tone-chip").forEach(T=>T.classList.remove("active")),y.classList.add("active");const k=E.getState();k.currentHymn&&k.currentHymn.number===e.number&&E.play(e,i,L)})})}updateHymnDetailDynamicElements(t,e){const s=o.get().favorites.has(e.number),i=document.getElementById("btn-fav-detail");i&&(i.classList.toggle("is-fav",s),i.innerHTML=s?d.heart:d.heartOutline,i.title=s?"Quitar de favoritos":"Añadir a favoritos");const n=E.getState(),l=n.currentHymn&&n.currentHymn.number===e.number,c=document.getElementById("btn-detail-play");c&&(c.innerHTML=l&&n.isPlaying?d.pause:d.play);const u=document.getElementById("detail-seekbar-row");u&&(u.style.display=l&&n.duration>0?"block":"none");const v=document.getElementById("detail-seekbar");v&&l&&(v.max=Math.floor(n.duration),this.isUserSeeking||(v.value=Math.floor(n.currentTime)));const h=document.getElementById("detail-time-current");h&&l&&(h.textContent=M(n.currentTime));const m=document.getElementById("detail-time-duration");m&&l&&(m.textContent=M(n.duration))}updatePlayerUI(){var y,I,L,k,T,x;const t=document.getElementById("bottom-player-host");if(!t)return;const e=E.getState(),a=e.currentHymn;if(!a||!e.currentUrl){this.renderedAudioTrackUrl!==null&&(t.innerHTML="",this.renderedAudioTrackUrl=null);return}const s=o.get(),i=s.favorites.has(a.number),n=e.duration>0?e.currentTime/e.duration*100:0,l=z(e.currentUrl);if(this.renderedAudioTrackUrl!==e.currentUrl){this.renderedAudioTrackUrl=e.currentUrl,t.innerHTML=`
        <div class="web-bottom-player">
          <div class="player-mobile-progress">
            <div class="player-mobile-progress-fill" id="player-mobile-progress-fill" style="width: ${n}%;"></div>
          </div>

          <div class="player-track-meta" id="player-track-meta">
            <div class="player-artwork">
              ${d.music}
            </div>
            <div class="player-text-details">
              <span class="player-track-tag">Himno ${a.number}</span>
              <span class="player-track-title">${a.title}</span>
            </div>
            <button class="player-btn-fav ${i?"is-fav":""}" id="btn-player-fav" title="${i?"Quitar de favoritos":"Añadir a favoritos"}">
              ${i?d.heart:d.heartOutline}
            </button>
          </div>

          <div class="player-center-controls">
            <div class="player-transport-buttons">
              <button class="player-icon-btn" id="btn-player-prev" ${e.hasPrevious?"":"disabled"} title="Anterior">
                ${d.prev}
              </button>
              <button class="player-main-play-btn" id="btn-player-main-play" title="${e.isPlaying?"Pausa":"Reproducir"}">
                <span id="player-main-play-icon">${e.isPlaying?d.pause:d.play}</span>
              </button>
              <button class="player-icon-btn" id="btn-player-next" ${e.hasNext?"":"disabled"} title="Siguiente">
                ${d.next}
              </button>
            </div>

            <div class="player-timeline-bar">
              <span class="player-time-current" id="player-time-current">${M(e.currentTime)}</span>
              <input type="range" class="player-timeline-slider" id="player-timeline-slider" min="0" max="${Math.floor(e.duration)}" value="${Math.floor(e.currentTime)}">
              <span class="player-time-total" id="player-time-total">${M(e.duration)}</span>
            </div>
          </div>

          <div class="player-right-tools">
            <span class="player-tone-badge-btn" id="player-tone-badge" title="Tono en reproducción">
              ${d.music} ${l}
            </span>
            <button class="player-btn-close" id="btn-player-close" title="Cerrar reproductor">
              ${d.close}
            </button>
          </div>
        </div>
      `,(y=document.getElementById("player-track-meta"))==null||y.addEventListener("click",C=>{C.target.closest("#btn-player-fav")||o.setSelectedHymn(a)}),(I=document.getElementById("btn-player-fav"))==null||I.addEventListener("click",C=>{C.stopPropagation(),o.toggleFavorite(a.number)}),(L=document.getElementById("btn-player-main-play"))==null||L.addEventListener("click",()=>{E.getState().isPlaying?E.pause():E.resume()}),(k=document.getElementById("btn-player-prev"))==null||k.addEventListener("click",()=>{E.playPrevious()}),(T=document.getElementById("btn-player-next"))==null||T.addEventListener("click",()=>{E.playNext()}),(x=document.getElementById("btn-player-close"))==null||x.addEventListener("click",()=>{E.stop()});const S=document.getElementById("player-timeline-slider");S==null||S.addEventListener("mousedown",()=>{this.isUserSeeking=!0}),S==null||S.addEventListener("touchstart",()=>{this.isUserSeeking=!0}),S==null||S.addEventListener("change",C=>{this.isUserSeeking=!1,E.seekTo(parseFloat(C.target.value))}),S==null||S.addEventListener("input",C=>{const w=document.getElementById("player-time-current");w&&(w.textContent=M(parseFloat(C.target.value)))});return}const c=document.getElementById("player-mobile-progress-fill");c&&(c.style.width=`${n}%`);const u=document.getElementById("player-main-play-icon");u&&(u.innerHTML=e.isPlaying?d.pause:d.play);const v=document.getElementById("btn-player-fav");v&&(v.classList.toggle("is-fav",i),v.innerHTML=i?d.heart:d.heartOutline);const h=document.getElementById("btn-player-prev");h&&(h.disabled=!e.hasPrevious);const m=document.getElementById("btn-player-next");m&&(m.disabled=!e.hasNext);const g=document.getElementById("player-time-current");g&&(g.textContent=M(e.currentTime));const p=document.getElementById("player-time-total");p&&(p.textContent=M(e.duration));const f=document.getElementById("player-timeline-slider");if(f&&(f.max=Math.floor(e.duration),this.isUserSeeking||(f.value=Math.floor(e.currentTime))),s.selectedHymn&&s.selectedHymn.number===a.number){const S=document.getElementById("detail-time-current");S&&(S.textContent=M(e.currentTime));const C=document.getElementById("detail-time-duration");C&&(C.textContent=M(e.duration));const w=document.getElementById("detail-seekbar");w&&!this.isUserSeeking&&(w.max=Math.floor(e.duration),w.value=Math.floor(e.currentTime))}}renderModal(){const t=document.getElementById("modal-host");if(!t)return;const e=o.get();if(!e.activeModal){this.currentActiveModal!==null&&(t.innerHTML="",this.currentActiveModal=null);return}if(this.currentActiveModal!==e.activeModal)switch(this.currentActiveModal=e.activeModal,e.activeModal){case"PROFILE":this.renderProfileModal(t);break;case"CREATE_PLAYLIST":this.renderCreatePlaylistModal(t);break;case"ADD_TO_PLAYLIST":this.renderAddToPlaylistModal(t,e.modalPayload);break;case"DELETE_PLAYLIST":this.renderDeletePlaylistModal(t,e.modalPayload);break;default:t.innerHTML="",this.currentActiveModal=null}}renderProfileModal(t){var c,u,v,h,m,g;const e=o.get(),a=e.userProfile,s=[{hex:"#14C69B",label:"Verde"},{hex:"#006680",label:"Azul"},{hex:"#DCBB11",label:"Oro"},{hex:"#8E24AA",label:"Púrpura"},{hex:"#E53935",label:"Rojo"},{hex:"#3949AB",label:"Índigo"}];t.innerHTML=`
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal-dialog">
          <div class="modal-header">
            <h2 class="modal-title">Ajustes & Configuración</h2>
            <button class="modal-close-btn" id="btn-close-modal">${d.close}</button>
          </div>
          <div class="modal-body custom-scroll">
            <div class="profile-avatar-editor">
              <div class="avatar-upload-box" id="avatar-box" style="background-color: ${a.avatarColor||"#14C69B"};">
                ${a.profileImage?`<img src="${a.profileImage}" id="avatar-preview-img" alt="Avatar">`:`<span class="avatar-initial" id="avatar-initial-txt">${a.name?a.name.charAt(0).toUpperCase():"U"}</span>`}
                <div class="avatar-upload-overlay">${d.camera}</div>
                <input type="file" id="avatar-file-input" accept="image/*" style="display: none;">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="profile-name-input">Nombre de usuario</label>
              <input type="text" class="form-input" id="profile-name-input" value="${a.name||""}" placeholder="Tu nombre">
            </div>

            <div class="form-group">
              <label class="form-label">Color de avatar</label>
              <div class="avatar-colors-row">
                ${s.map(p=>`
                  <div class="color-option ${a.avatarColor===p.hex?"selected":""}" data-color="${p.hex}">
                    <div class="color-circle-inner" style="background-color: ${p.hex};"></div>
                  </div>
                `).join("")}
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Tamaño de letra en himnos</label>
              <div class="segmented-group">
                <button class="segmented-btn ${e.textSizeScale==="normal"?"active":""}" data-scale="normal">Normal</button>
                <button class="segmented-btn ${e.textSizeScale==="large"?"active":""}" data-scale="large">Grande</button>
                <button class="segmented-btn ${e.textSizeScale==="extra_large"?"active":""}" data-scale="extra_large">Muy Grande</button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Tema de la aplicación</label>
              <div class="segmented-group">
                <button class="segmented-btn ${e.appTheme==="system"?"active":""}" data-theme="system">Sistema</button>
                <button class="segmented-btn ${e.appTheme==="light"?"active":""}" data-theme="light">Claro</button>
                <button class="segmented-btn ${e.appTheme==="dark"?"active":""}" data-theme="dark">Oscuro</button>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Copias de Seguridad (JSON)</label>
              <div style="display: flex; gap: 8px;">
                <button class="btn-outlined" id="btn-export-backup" style="flex: 1;">
                  ${d.upload} Exportar
                </button>
                <button class="btn-outlined" id="btn-import-backup-trigger" style="flex: 1;">
                  ${d.download} Importar
                </button>
                <input type="file" id="backup-file-input" accept=".json,application/json" style="display: none;">
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-outlined" id="btn-cancel-profile">Cancelar</button>
            <button class="btn-primary" id="btn-save-profile">Guardar</button>
          </div>
        </div>
      </div>
    `,(c=document.getElementById("btn-close-modal"))==null||c.addEventListener("click",()=>o.closeModal()),(u=document.getElementById("btn-cancel-profile"))==null||u.addEventListener("click",()=>o.closeModal()),(v=document.getElementById("modal-overlay"))==null||v.addEventListener("click",p=>{p.target.id==="modal-overlay"&&o.closeModal()});const i=document.getElementById("avatar-box"),n=document.getElementById("avatar-file-input");i==null||i.addEventListener("click",()=>n==null?void 0:n.click()),n==null||n.addEventListener("change",p=>{const f=p.target.files[0];if(f){const y=new FileReader;y.onload=I=>{const L=I.target.result;a.profileImage=L,i.innerHTML=`<img src="${L}" alt="Avatar"><div class="avatar-upload-overlay">${d.camera}</div>`},y.readAsDataURL(f)}}),t.querySelectorAll(".color-option").forEach(p=>{p.addEventListener("click",()=>{t.querySelectorAll(".color-option").forEach(y=>y.classList.remove("selected")),p.classList.add("selected");const f=p.getAttribute("data-color");a.avatarColor=f,i.style.backgroundColor=f})}),t.querySelectorAll("[data-scale]").forEach(p=>{p.addEventListener("click",()=>{t.querySelectorAll("[data-scale]").forEach(y=>y.classList.remove("active")),p.classList.add("active");const f=p.getAttribute("data-scale");o.applyTextScale(f)})}),t.querySelectorAll("[data-theme]").forEach(p=>{p.addEventListener("click",()=>{t.querySelectorAll("[data-theme]").forEach(y=>y.classList.remove("active")),p.classList.add("active");const f=p.getAttribute("data-theme");o.applyTheme(f)})}),(h=document.getElementById("btn-export-backup"))==null||h.addEventListener("click",()=>{const p=b.exportBackup();$(p?"Copia de seguridad descargada":"Error al exportar copia de seguridad")});const l=document.getElementById("backup-file-input");(m=document.getElementById("btn-import-backup-trigger"))==null||m.addEventListener("click",()=>{l==null||l.click()}),l==null||l.addEventListener("change",async p=>{const f=p.target.files[0];f&&(await b.importBackup(f)?(o.set({favorites:b.getFavorites(),playlists:b.getPlaylists()}),$("Copia de seguridad importada con éxito"),o.closeModal()):$("Error al importar archivo de copia"))}),(g=document.getElementById("btn-save-profile"))==null||g.addEventListener("click",()=>{var f;const p=((f=document.getElementById("profile-name-input"))==null?void 0:f.value.trim())||"";b.setUserName(p),b.setUserAvatarColor(a.avatarColor),b.setUserProfileImage(a.profileImage),o.set({userProfile:{name:p,avatarColor:a.avatarColor,profileImage:a.profileImage}}),$("Perfil actualizado"),o.closeModal()})}renderCreatePlaylistModal(t){var e,a,s,i;t.innerHTML=`
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal-dialog">
          <div class="modal-header">
            <h2 class="modal-title">Nueva Lista</h2>
            <button class="modal-close-btn" id="btn-close-modal">${d.close}</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label" for="playlist-name-input">Nombre de la lista</label>
              <input type="text" class="form-input" id="playlist-name-input" placeholder="Ej: Culto del Domingo" autofocus>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-outlined" id="btn-cancel-playlist">Cancelar</button>
            <button class="btn-primary" id="btn-save-playlist">Crear</button>
          </div>
        </div>
      </div>
    `,(e=document.getElementById("btn-close-modal"))==null||e.addEventListener("click",()=>o.closeModal()),(a=document.getElementById("btn-cancel-playlist"))==null||a.addEventListener("click",()=>o.closeModal()),(s=document.getElementById("modal-overlay"))==null||s.addEventListener("click",n=>{n.target.id==="modal-overlay"&&o.closeModal()}),(i=document.getElementById("btn-save-playlist"))==null||i.addEventListener("click",()=>{var c;const n=(c=document.getElementById("playlist-name-input"))==null?void 0:c.value.trim();if(!n){$("Ingresa un nombre para la lista");return}b.createPlaylist(n)?(o.refreshPlaylists(),$("Lista creada"),o.closeModal()):$("Ya existe una lista con ese nombre")})}renderAddToPlaylistModal(t,e){var l,c,u,v,h;const a=e==null?void 0:e.hymn;if(!a){o.closeModal();return}const s=()=>{const m=b.getPlaylists();return m.length===0?`
          <div class="modal-empty-playlists">
            <div class="empty-state-icon" style="width: 32px; height: 32px; opacity: 0.6;">${d.queue}</div>
            <span>No tienes listas creadas aún. Escribe un nombre arriba para crear tu primera lista.</span>
          </div>
        `:`
        <div class="playlist-modal-list custom-scroll">
          ${m.map(g=>{const p=g.hymns.includes(a.number);return`
              <div class="playlist-select-item ${p?"contains-hymn":""}" data-pl-name="${g.name}">
                <div class="playlist-select-info">
                  <div class="playlist-select-icon">${d.queue}</div>
                  <div>
                    <div class="playlist-select-name">${g.name}</div>
                    <div class="playlist-select-count">${g.hymns.length} ${g.hymns.length===1?"himno":"himnos"}</div>
                  </div>
                </div>
                <button class="playlist-select-btn ${p?"active":""}" data-action-pl="${g.name}" title="${p?"Quitar de lista":"Añadir a lista"}">
                  ${p?`${d.check} Añadido`:`${d.add} Añadir`}
                </button>
              </div>
            `}).join("")}
        </div>
      `};t.innerHTML=`
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal-dialog">
          <div class="modal-header">
            <div>
              <h2 class="modal-title">Añadir a Lista</h2>
              <div class="modal-target-hymn-pill">
                <span class="modal-target-badge">#${a.number}</span>
                <span class="modal-target-title">${a.title}</span>
              </div>
            </div>
            <button class="modal-close-btn" id="btn-close-modal">${d.close}</button>
          </div>
          <div class="modal-body custom-scroll">
            <div class="modal-quick-create-box">
              <span class="modal-section-label">Crear nueva lista</span>
              <div class="modal-create-row">
                <input type="text" class="form-input modal-create-input" id="new-playlist-quick-input" placeholder="Nombre de la nueva lista...">
                <button class="btn-primary btn-compact" id="btn-quick-create-pl">
                  ${d.add} Crear
                </button>
              </div>
            </div>

            <div class="modal-playlists-section">
              <span class="modal-section-label">Tus listas</span>
              <div id="modal-playlists-host">
                ${s()}
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-primary btn-compact" id="btn-done-add-modal" style="width: 100%; justify-content: center;">
              Listo
            </button>
          </div>
        </div>
      </div>
    `;const i=()=>{const m=document.getElementById("modal-playlists-host");m&&m.querySelectorAll(".playlist-select-item").forEach(g=>{g.addEventListener("click",()=>{const p=g.getAttribute("data-pl-name"),y=b.getPlaylists().find(L=>L.name.toLowerCase()===p.toLowerCase());y&&y.hymns.includes(a.number)?(b.removeHymnFromPlaylist(p,a.number),$(`Eliminado de "${p}"`)):(b.addHymnToPlaylist(p,a.number),$(`Añadido a "${p}"`)),o.refreshPlaylists(),m.innerHTML=s(),i()})})};i();const n=()=>{const m=document.getElementById("new-playlist-quick-input"),g=m==null?void 0:m.value.trim();if(!g){$("Ingresa un nombre para la lista");return}if(b.createPlaylist(g)){b.addHymnToPlaylist(g,a.number),o.refreshPlaylists(),$("Lista creada y añadido"),m&&(m.value="");const f=document.getElementById("modal-playlists-host");f&&(f.innerHTML=s(),i())}else $("Ya existe una lista con ese nombre")};(l=document.getElementById("btn-quick-create-pl"))==null||l.addEventListener("click",n),(c=document.getElementById("new-playlist-quick-input"))==null||c.addEventListener("keydown",m=>{m.key==="Enter"&&(m.preventDefault(),n())}),(u=document.getElementById("btn-close-modal"))==null||u.addEventListener("click",()=>o.closeModal()),(v=document.getElementById("btn-done-add-modal"))==null||v.addEventListener("click",()=>o.closeModal()),(h=document.getElementById("modal-overlay"))==null||h.addEventListener("click",m=>{m.target.id==="modal-overlay"&&o.closeModal()})}renderDeletePlaylistModal(t,e){var s,i,n,l;const a=e==null?void 0:e.name;if(!a){o.closeModal();return}t.innerHTML=`
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal-dialog">
          <div class="modal-header">
            <h2 class="modal-title title-error">¿Eliminar Lista?</h2>
            <button class="modal-close-btn" id="btn-close-modal">${d.close}</button>
          </div>
          <div class="modal-body">
            <p style="font-size: 0.95rem; line-height: 1.5; color: var(--text-main);">
              ¿Estás seguro de que deseas eliminar la lista <strong>"${a}"</strong>? Esta acción no se puede deshacer.
            </p>
          </div>
          <div class="modal-footer">
            <button class="btn-outlined" id="btn-cancel-delete">Cancelar</button>
            <button class="btn-primary btn-danger" id="btn-confirm-delete">Eliminar</button>
          </div>
        </div>
      </div>
    `,(s=document.getElementById("btn-close-modal"))==null||s.addEventListener("click",()=>o.closeModal()),(i=document.getElementById("btn-cancel-delete"))==null||i.addEventListener("click",()=>o.closeModal()),(n=document.getElementById("modal-overlay"))==null||n.addEventListener("click",c=>{c.target.id==="modal-overlay"&&o.closeModal()}),(l=document.getElementById("btn-confirm-delete"))==null||l.addEventListener("click",()=>{b.deletePlaylist(a),o.refreshPlaylists(),$("Lista eliminada"),o.closeModal()})}buildHymnGridItems(t,e,a){return!t||t.length===0?`
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">${d.search}</div>
          <div class="empty-state-title">No se encontraron himnos</div>
          <p class="empty-state-desc">Prueba con otro término de búsqueda o número de himno.</p>
        </div>
      `:t.map(s=>{const i=a.has(s.number),n=s.mp3Urls&&s.mp3Urls.length>0,l=this.highlightQuery(s.title,e);return`
        <div class="hymn-grid-item" data-number="${s.number}">
          <div class="hymn-number-badge">${s.number}</div>
          <div class="hymn-info">
            <span class="hymn-title">${l}</span>
            ${s.category?`<span class="hymn-subtitle">${s.category}</span>`:""}
          </div>
          <div class="hymn-item-badges">
            ${n?`<div class="hymn-audio-icon" title="Audio disponible">${d.music}</div>`:""}
            ${i?`<div class="hymn-fav-icon" title="Favorito">${d.heart}</div>`:""}
          </div>
        </div>
      `}).join("")}highlightQuery(t,e){if(!e||!e.trim())return t;const a=e.trim().replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),s=new RegExp(`(${a})`,"gi");return t.replace(s,'<mark class="search-highlight">$1</mark>')}bindHymnCardClicks(){document.querySelectorAll(".hymn-grid-item").forEach(t=>{t.addEventListener("click",()=>{const e=parseInt(t.getAttribute("data-number"),10),a=o.get().hymnsList.find(s=>s.number===e);a&&o.setSelectedHymn(a)})})}}async function O(){const r=document.getElementById("app");if(!r)return;const t=o.get().appTheme,e=o.get().textSizeScale;P(t),N(e),window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{o.get().appTheme==="system"&&P("system")}),new q(r).init();try{const s=await fetch("./hymns.json");if(!s.ok)throw new Error(`HTTP error ${s.status}`);const i=await s.json(),n=Q(i);o.set({hymnsList:n,isLoading:!1})}catch(s){console.error("Failed to load hymns:",s);const i=document.getElementById("main-viewport");i&&(i.innerHTML=`
        <div class="empty-state">
          <div class="empty-state-title">Error al cargar los himnos</div>
          <p class="empty-state-desc">Verifica tu conexión a internet o intenta recargar la página.</p>
          <button class="btn-primary" onclick="location.reload()">Recargar</button>
        </div>
      `)}"serviceWorker"in navigator&&window.location.protocol.startsWith("http")&&window.addEventListener("load",()=>{navigator.serviceWorker.register("./sw.js").catch(s=>{console.warn("Service Worker registration failed:",s)})})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",O):O();
