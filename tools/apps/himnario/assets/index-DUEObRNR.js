(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const l of s)if(l.type==="childList")for(const n of l.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function e(s){const l={};return s.integrity&&(l.integrity=s.integrity),s.referrerPolicy&&(l.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?l.credentials="include":s.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function a(s){if(s.ep)return;s.ep=!0;const l=e(s);fetch(s.href,l)}})();const k={FAVORITES:"himnario_favorites_set",PLAYLISTS:"himnario_playlists_json",USER_NAME:"himnario_user_name",USER_AVATAR_COLOR:"himnario_user_avatar_color",USER_PROFILE_IMAGE:"himnario_user_profile_image",APP_THEME:"himnario_app_theme",TEXT_SIZE:"himnario_text_size_scale",WAKE_LOCK:"himnario_wake_lock_enabled"},b={getFavorites(){try{const i=localStorage.getItem(k.FAVORITES);if(!i)return new Set;const t=JSON.parse(i);return new Set(t.map(Number))}catch{return new Set}},setFavorites(i){try{const t=Array.from(i);localStorage.setItem(k.FAVORITES,JSON.stringify(t))}catch(t){console.error("Failed to save favorites",t)}},toggleFavorite(i){const t=this.getFavorites(),e=t.has(i);return e?t.delete(i):t.add(i),this.setFavorites(t),!e},isFavorite(i){return this.getFavorites().has(i)},getPlaylists(){try{const i=localStorage.getItem(k.PLAYLISTS);if(!i)return[];const t=JSON.parse(i);return Array.isArray(t)?t:[]}catch{return[]}},savePlaylists(i){try{localStorage.setItem(k.PLAYLISTS,JSON.stringify(i))}catch(t){console.error("Failed to save playlists",t)}},createPlaylist(i){const t=(i||"").trim();if(!t)return!1;const e=this.getPlaylists();return e.some(a=>a.name.toLowerCase()===t.toLowerCase())?!1:(e.push({name:t,hymns:[]}),this.savePlaylists(e),!0)},deletePlaylist(i){const t=this.getPlaylists().filter(e=>e.name.toLowerCase()!==i.toLowerCase());this.savePlaylists(t)},addHymnToPlaylist(i,t){const e=this.getPlaylists(),a=e.findIndex(l=>l.name.toLowerCase()===i.toLowerCase());if(a===-1)return!1;const s=e[a];return s.hymns.includes(t)||(s.hymns.push(t),this.savePlaylists(e)),!0},removeHymnFromPlaylist(i,t){const e=this.getPlaylists(),a=e.findIndex(s=>s.name.toLowerCase()===i.toLowerCase());a!==-1&&(e[a].hymns=e[a].hymns.filter(s=>s!==t),this.savePlaylists(e))},moveHymnInPlaylist(i,t,e){const a=this.getPlaylists(),s=a.findIndex(d=>d.name.toLowerCase()===i.toLowerCase());if(s===-1)return;const l=[...a[s].hymns],n=l.indexOf(t);if(n===-1)return;const c=e?n-1:n+1;if(c>=0&&c<l.length){const d=l[n];l[n]=l[c],l[c]=d,a[s].hymns=l,this.savePlaylists(a)}},getUserName(){return localStorage.getItem(k.USER_NAME)||""},setUserName(i){localStorage.setItem(k.USER_NAME,i||"")},getUserAvatarColor(){return localStorage.getItem(k.USER_AVATAR_COLOR)||"#14C69B"},setUserAvatarColor(i){localStorage.setItem(k.USER_AVATAR_COLOR,i||"#14C69B")},getUserProfileImage(){return localStorage.getItem(k.USER_PROFILE_IMAGE)||""},setUserProfileImage(i){try{localStorage.setItem(k.USER_PROFILE_IMAGE,i||"")}catch(t){console.warn("Failed to save image in localStorage (size limit)",t)}},getAppTheme(){return localStorage.getItem(k.APP_THEME)||"system"},setAppTheme(i){localStorage.setItem(k.APP_THEME,i||"system")},getTextSizeScale(){return localStorage.getItem(k.TEXT_SIZE)||"normal"},setTextSizeScale(i){localStorage.setItem(k.TEXT_SIZE,i||"normal")},getWakeLockEnabled(){return localStorage.getItem(k.WAKE_LOCK)==="true"},setWakeLockEnabled(i){localStorage.setItem(k.WAKE_LOCK,i?"true":"false")},exportBackup(){try{const i=Array.from(this.getFavorites()),t=this.getPlaylists(),e={version:1,favorites:i,playlists:t},a=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),s=URL.createObjectURL(a),l=document.createElement("a");return l.href=s,l.download=`himnario_backup_${new Date().toISOString().slice(0,10)}.json`,document.body.appendChild(l),l.click(),document.body.removeChild(l),URL.revokeObjectURL(s),!0}catch(i){return console.error("Export backup failed",i),!1}},async importBackup(i){try{const t=await i.text(),e=JSON.parse(t);if(Array.isArray(e.favorites)){const a=this.getFavorites();e.favorites.forEach(s=>{(typeof s=="number"||typeof s=="string"&&!isNaN(Number(s)))&&a.add(Number(s))}),this.setFavorites(a)}if(Array.isArray(e.playlists)){const a=this.getPlaylists();e.playlists.forEach(s=>{if(s&&s.name){const l=s.name.trim(),n=Array.isArray(s.hymns)?s.hymns.map(Number):[],c=a.findIndex(d=>d.name.toLowerCase()===l.toLowerCase());if(c!==-1){const d=Array.from(new Set([...a[c].hymns,...n]));a[c].hymns=d}else a.push({name:l,hymns:n})}}),this.savePlaylists(a)}return!0}catch(t){return console.error("Import backup failed",t),!1}}};class U{constructor(){this.state={hymnsList:[],isLoading:!0,activeTab:0,selectedCategory:null,categoryMode:"THEMATIC",selectedPlaylist:null,selectedHymn:null,searchQuery:"",favorites:b.getFavorites(),playlists:b.getPlaylists(),userProfile:{name:b.getUserName(),avatarColor:b.getUserAvatarColor(),profileImage:b.getUserProfileImage()},appTheme:b.getAppTheme(),textSizeScale:b.getTextSizeScale(),wakeLockEnabled:b.getWakeLockEnabled(),activeModal:null,modalPayload:null},this.listeners=new Set}get(){return this.state}set(t){this.state={...this.state,...t},this.notify()}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}notify(){this.listeners.forEach(t=>{try{t(this.state)}catch(e){console.error("State listener error",e)}})}setActiveTab(t){this.set({activeTab:t,selectedCategory:null,selectedHymn:null})}setSelectedCategory(t){this.set({selectedCategory:t,selectedHymn:null})}setCategoryMode(t){this.set({categoryMode:t,selectedCategory:null})}setSelectedPlaylist(t){this.set({selectedPlaylist:t,selectedHymn:null})}setSelectedHymn(t){this.set({selectedHymn:t})}setSearchQuery(t){this.set({searchQuery:t})}toggleFavorite(t){const e=b.toggleFavorite(t),a=b.getFavorites();return this.set({favorites:a}),e}refreshPlaylists(){const t=b.getPlaylists();let e=this.state.selectedPlaylist;e&&(e=t.find(a=>a.name.toLowerCase()===e.name.toLowerCase())||null),this.set({playlists:t,selectedPlaylist:e})}openModal(t,e=null){this.set({activeModal:t,modalPayload:e})}closeModal(){this.set({activeModal:null,modalPayload:null})}applyTheme(t){b.setAppTheme(t),this.set({appTheme:t}),x(t)}toggleTheme(){const t=this.state.appTheme;let e="dark";t==="dark"?e="light":t==="light"?e="dark":e=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"light":"dark",this.applyTheme(e)}applyTextScale(t){b.setTextSizeScale(t),this.set({textSizeScale:t}),z(t)}}function P(){const i=b.getAppTheme();return i==="dark"?!0:i==="light"?!1:window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches}function x(i){let t=!1;i==="dark"?t=!0:i==="light"?t=!1:t=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches,document.documentElement.setAttribute("data-theme",t?"dark":"light");const e=document.querySelector('meta[name="theme-color"]');e&&e.setAttribute("content",t?"#081120":"#006680")}function z(i){let t=1;i==="large"?t=1.25:i==="extra_large"&&(t=1.5),document.documentElement.style.setProperty("--font-scale",t.toString())}const r=new U,_=new Set([19,176,204,301,379,481,525,547]);function w(i){return i?i.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase():""}function H(i){if(!i)return"Original";const e=i.substring(i.lastIndexOf("/")+1).replace(".mp3","").split("-");if(e.length<=1)return"Original";const a=e[e.length-1],s=a.toLowerCase(),l=new Set(["do","re","mi","fa","sol","la","si"]);if(s==="m"&&e.length>2){const c=e[e.length-2].toLowerCase();if(l.has(c))return`${c.charAt(0).toUpperCase()+c.slice(1)}-m`}return/^(do|re|mi|fa|sol|la|si)(#|b|m)?$/i.test(a)?a.charAt(0).toUpperCase()+a.slice(1).toLowerCase():"Original"}function O(i){return i.map(t=>{const e=t.index_number,a=t.title||"",s=t.index_title||a,l=t.key||null,n=t.mood||null,c=t.bible_passage||null,d=t.category||null,u=Array.isArray(t.credits)?t.credits:[],h=Array.isArray(t.notes)?t.notes:[],g=t.type||"song",m=Array.isArray(t.mp3_urls)?t.mp3_urls:[],y=t.mp3_variantes||0,v=[];if(g==="reading")(Array.isArray(t.paragraphs)?t.paragraphs:[]).forEach(A=>{v.push({type:"verse",text:A,number:null})});else{const L=[];Array.isArray(t.stanzas)&&t.stanzas.forEach(S=>{const I=Array.isArray(S.lines)?S.lines:[];L.push({type:"verse",text:I.join(`
`),number:S.label||null})});const A=[];if(Array.isArray(t.choruses)&&t.choruses.forEach(S=>{const I=Array.isArray(S.lines)?S.lines:[];A.push({type:"chorus",text:I.join(`
`),number:null})}),_.has(e))v.push(...A),v.push(...L);else if(L.length>0){v.push(L[0]),A.length>0&&v.push(A[0]);for(let S=1;S<L.length;S++)v.push(L[S]);for(let S=1;S<A.length;S++)v.push(A[S])}else v.push(...A)}const f=v.map(L=>L.text).join(`

`),p=w(s),T=w(f);return{number:e,title:a,indexTitle:s,key:l,mood:n,biblePassage:c,credits:u,sections:v,fullText:f,searchTitle:p,searchLyrics:T,bibleVerse:null,bibleReference:null,authorLyrics:null,authorMusic:null,category:d,type:g,footnotes:h,mp3Urls:m,mp3Variantes:y}})}function N(i,t){if(!i||i.length===0)return[];if(t==="READINGS")return["Lecturas Bíblicas"];const e=new Map;return i.forEach(a=>{let s=null;if(t==="THEMATIC"?s=a.category:t==="KEY"?s=a.key:t==="MOOD"&&(s=a.mood),s&&s.trim()){const l=s.trim();e.set(l,(e.get(l)||0)+1)}}),Array.from(e.entries()).sort((a,s)=>s[1]-a[1]).map(a=>a[0])}function M(i,{activeTab:t,selectedCategory:e,categoryMode:a,searchQuery:s,favorites:l}){let n=i;t===1&&e?a==="THEMATIC"?n=i.filter(d=>d.category===e):a==="READINGS"?n=i.filter(d=>d.type==="reading"):a==="KEY"?n=i.filter(d=>d.key===e):a==="MOOD"&&(n=i.filter(d=>d.mood===e)):t===3&&(n=i.filter(d=>l.has(d.number)));const c=w((s||"").trim());if(c){const d=parseInt(c,10);isNaN(d)?n=n.filter(u=>u.searchTitle.includes(c)||u.searchLyrics.includes(c)||u.category&&w(u.category).includes(c)||u.key&&w(u.key).includes(c)||u.mood&&w(u.mood).includes(c)):n=n.filter(u=>u.number===d||u.searchTitle.includes(c)||u.searchLyrics.includes(c))}return n}const o={music:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>',book:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>',queue:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z"/></svg>',heart:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',heartOutline:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',info:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',search:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',close:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',arrowBack:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>',check:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>',play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',pause:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',prev:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>',next:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>',share:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92z"/></svg>',playlistAdd:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"/></svg>',delete:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>',add:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>',arrowUp:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg>',arrowDown:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/></svg>',camera:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0-8c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5zm-7 14.5c0-2.33 4.67-3.5 7-3.5s7 1.17 7 3.5V20H5v-1.5z"/></svg>',upload:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>',download:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>',sun:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>',moon:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>'};function C(i){if(!i||isNaN(i)||i<0)return"00:00";const t=Math.floor(i),e=Math.floor(t/60),a=t%60;return`${e.toString().padStart(2,"0")}:${a.toString().padStart(2,"0")}`}class R{constructor(){this.audio=new Audio,this.currentHymn=null,this.currentUrl=null,this.currentQueue=[],this.isPlaying=!1,this.isLoading=!1,this.currentTime=0,this.duration=0,this.listeners=new Set,this.initAudioEvents(),this.initMediaSession()}subscribe(t){return this.listeners.add(t),()=>this.listeners.delete(t)}notify(){const t=this.getState();this.listeners.forEach(e=>{try{e(t)}catch(a){console.error("Audio listener error",a)}})}getState(){return{currentHymn:this.currentHymn,currentUrl:this.currentUrl,currentQueue:this.currentQueue,isPlaying:this.isPlaying,isLoading:this.isLoading,currentTime:this.currentTime,duration:this.duration,hasPrevious:this.hasPrevious(),hasNext:this.hasNext()}}initAudioEvents(){this.audio.addEventListener("loadstart",()=>{this.isLoading=!0,this.notify()}),this.audio.addEventListener("canplay",()=>{this.isLoading=!1,this.duration=this.audio.duration||0,this.notify()}),this.audio.addEventListener("play",()=>{this.isPlaying=!0,this.isLoading=!1,this.updateMediaSessionPlaybackState("playing"),this.notify()}),this.audio.addEventListener("pause",()=>{this.isPlaying=!1,this.updateMediaSessionPlaybackState("paused"),this.notify()}),this.audio.addEventListener("timeupdate",()=>{this.currentTime=this.audio.currentTime||0,this.duration=this.audio.duration||this.duration||0,this.notify()}),this.audio.addEventListener("ended",()=>{this.hasNext()?this.playNext():(this.isPlaying=!1,this.currentTime=0,this.notify())}),this.audio.addEventListener("error",t=>{console.warn("Audio playback error",t),this.isLoading=!1,this.isPlaying=!1,this.notify()})}initMediaSession(){"mediaSession"in navigator&&(navigator.mediaSession.setActionHandler("play",()=>this.resume()),navigator.mediaSession.setActionHandler("pause",()=>this.pause()),navigator.mediaSession.setActionHandler("previoustrack",()=>this.playPrevious()),navigator.mediaSession.setActionHandler("nexttrack",()=>this.playNext()),navigator.mediaSession.setActionHandler("seekto",t=>{t.seekTime!==void 0&&this.seekTo(t.seekTime)}))}updateMediaSessionMetadata(){"mediaSession"in navigator&&this.currentHymn&&(navigator.mediaSession.metadata=new MediaMetadata({title:`Himno ${this.currentHymn.number}: ${this.currentHymn.title}`,artist:"Celebremos Su Gloria",album:this.currentHymn.category||"Himnario Cristiano",artwork:[{src:"./logo.png",sizes:"192x192",type:"image/png"},{src:"./logo.png",sizes:"512x512",type:"image/png"}]}))}updateMediaSessionPlaybackState(t){"mediaSession"in navigator&&(navigator.mediaSession.playbackState=t)}hasPrevious(){if(!this.currentHymn||!this.currentQueue.length)return!1;const t=this.currentQueue.findIndex(e=>e.number===this.currentHymn.number);return t>0&&this.currentQueue.slice(0,t).some(e=>e.mp3Urls&&e.mp3Urls.length>0)}hasNext(){if(!this.currentHymn||!this.currentQueue.length)return!1;const t=this.currentQueue.findIndex(e=>e.number===this.currentHymn.number);return t!==-1&&t<this.currentQueue.length-1&&this.currentQueue.slice(t+1).some(e=>e.mp3Urls&&e.mp3Urls.length>0)}play(t,e=[],a=null){if(!t)return;const s=a||t.mp3Urls&&t.mp3Urls[0];s&&(this.currentHymn=t,this.currentQueue=e.length?e:[t],this.currentUrl=s,this.isLoading=!0,this.audio.src=s,this.audio.play().catch(l=>{console.warn("Audio play prevented or failed:",l)}),this.updateMediaSessionMetadata(),this.notify())}pause(){this.audio.pause()}resume(){this.currentUrl&&this.audio.play().catch(()=>{})}stop(){this.audio.pause(),this.audio.currentTime=0,this.currentHymn=null,this.currentUrl=null,this.isPlaying=!1,this.isLoading=!1,this.notify()}seekTo(t){this.audio&&!isNaN(t)&&(this.audio.currentTime=t,this.currentTime=t,this.notify())}playNext(){if(!this.currentHymn||!this.currentQueue.length)return;const t=this.currentQueue.findIndex(e=>e.number===this.currentHymn.number);if(t!==-1)for(let e=t+1;e<this.currentQueue.length;e++){const a=this.currentQueue[e];if(a.mp3Urls&&a.mp3Urls.length>0){this.play(a,this.currentQueue,a.mp3Urls[0]);return}}}playPrevious(){if(!this.currentHymn||!this.currentQueue.length)return;const t=this.currentQueue.findIndex(e=>e.number===this.currentHymn.number);if(!(t<=0))for(let e=t-1;e>=0;e--){const a=this.currentQueue[e];if(a.mp3Urls&&a.mp3Urls.length>0){this.play(a,this.currentQueue,a.mp3Urls[0]);return}}}}const E=new R;function $(i,t=2500){let e=document.querySelector(".toast-container");e||(e=document.createElement("div"),e.className="toast-container",document.body.appendChild(e));const a=document.createElement("div");a.className="toast",a.innerHTML=`<span>${i}</span>`,e.appendChild(a),setTimeout(()=>{a.style.opacity="0",a.style.transform="translateY(10px) scale(0.95)",a.style.transition="all 0.2s ease-out",setTimeout(()=>{a.remove()},200)},t)}async function F(i){if(!i)return;const t=i.number,e=i.title,a=i.category?`_Categoría: ${i.category}_

`:`
`,s=i.key?` (Tono: ${i.key})`:"",l=i.sections.map(u=>{let h="";return u.type==="chorus"?h=`[CORO]
`:u.number&&(h=`${u.number}. `),`${h}${u.text}`}).join(`

`),n=i.footnotes.length?`

${i.footnotes.join(`
`)}`:"",c=i.credits.length?`

— ${i.credits.join(`
`)}`:"",d=`🎶 *Himno ${t}: ${e}*${s}
${a}${l}${n}${c}`;if(navigator.share)try{await navigator.share({title:`Himno ${t}: ${e}`,text:d});return}catch(u){if(u.name!=="AbortError")console.warn("Share API failed, fallback to clipboard",u);else return}try{await navigator.clipboard.writeText(d),$("Letra copiada al portapapeles")}catch{const h=document.createElement("textarea");h.value=d,h.style.position="fixed",h.style.opacity="0",document.body.appendChild(h),h.focus(),h.select();try{document.execCommand("copy"),$("Letra copiada al portapapeles")}catch{$("No se pudo copiar el texto")}document.body.removeChild(h)}}class Q{constructor(t){this.container=t,this.currentDetailVariantIndex=0}init(){this.renderSkeleton(),this.bindGlobalEvents(),r.subscribe(()=>{this.render()}),E.subscribe(()=>{this.updatePlayerUI()}),this.render()}renderSkeleton(){this.container.innerHTML=`
      <aside class="app-sidebar" id="app-sidebar"></aside>
      <div class="app-stage">
        <header class="app-header" id="app-header"></header>
        <main class="main-viewport" id="main-viewport"></main>
        <div id="bottom-player-host"></div>
        <nav class="bottom-nav" id="bottom-nav"></nav>
      </div>
      <div id="modal-host"></div>
    `}bindGlobalEvents(){window.addEventListener("popstate",()=>{const t=r.get();t.selectedHymn?r.setSelectedHymn(null):t.activeTab===1&&t.selectedCategory?r.setSelectedCategory(null):t.activeTab===2&&t.selectedPlaylist?r.setSelectedPlaylist(null):t.activeTab!==0&&r.setActiveTab(0)}),window.addEventListener("keydown",t=>{if((t.ctrlKey||t.metaKey)&&t.key.toLowerCase()==="k"){t.preventDefault();const e=document.getElementById("top-search-input")||document.getElementById("mobile-search-input");e==null||e.focus();return}if(t.key==="Escape"){const e=r.get();e.activeModal?r.closeModal():e.selectedHymn?r.setSelectedHymn(null):e.activeTab===1&&e.selectedCategory?r.setSelectedCategory(null):e.activeTab===2&&e.selectedPlaylist&&r.setSelectedPlaylist(null)}})}render(){this.renderSidebar(),this.renderHeader(),this.renderNav(),this.renderContent(),this.renderModal(),this.updatePlayerUI()}renderSidebar(){var d,u,h;const t=document.getElementById("app-sidebar");if(!t)return;const e=r.get(),a=e.userProfile,s=a.name?a.name.trim().charAt(0).toUpperCase():"U",l=a.avatarColor||"#14C69B",n=P(),c=[{id:0,label:"Todos los Himnos",icon:o.music,count:e.hymnsList.length},{id:1,label:"Categorías",icon:o.book,count:null},{id:2,label:"Listas de Reproducción",icon:o.queue,count:e.playlists.length},{id:3,label:"Favoritos",icon:o.heart,count:e.favorites.size},{id:4,label:"Acerca de",icon:o.info,count:null}];t.innerHTML=`
      <div class="sidebar-top">
        <div class="sidebar-brand" id="btn-sidebar-home">
          <img src="./logo.png" alt="Logo" class="sidebar-logo">
          <div class="sidebar-titles">
            <span class="sidebar-title">Celebremos Su Gloria</span>
            <span class="sidebar-badge">HIMNARIO</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          ${c.map(g=>`
            <a class="sidebar-nav-item ${e.activeTab===g.id&&!e.selectedHymn?"active":""}" data-sidebar-tab="${g.id}">
              ${g.icon}
              <span>${g.label}</span>
              ${g.count!==null?`<span class="sidebar-badge-count">${g.count}</span>`:""}
            </a>
          `).join("")}
        </nav>
      </div>

      <div class="sidebar-bottom">
        <button class="sidebar-theme-toggle" id="btn-sidebar-theme-toggle" title="Cambiar tema">
          <div class="theme-toggle-left">
            ${n?o.moon:o.sun}
            <span>${n?"Modo Oscuro":"Modo Claro"}</span>
          </div>
          <div class="theme-toggle-switch">
            <div class="theme-toggle-dot"></div>
          </div>
        </button>

        <div class="sidebar-profile-card" id="btn-sidebar-profile">
          <div class="user-avatar-badge" style="width: 34px; height: 34px; background-color: ${l};">
            ${a.profileImage?`<img src="${a.profileImage}" alt="Avatar">`:`<span>${s}</span>`}
          </div>
          <div class="sidebar-profile-info">
            <span class="sidebar-profile-name">${a.name||"Mi Perfil"}</span>
            <span class="sidebar-profile-sub">Ajustes & Copias</span>
          </div>
        </div>
      </div>
    `,(d=document.getElementById("btn-sidebar-home"))==null||d.addEventListener("click",()=>{r.setActiveTab(0),r.setSelectedHymn(null)}),t.querySelectorAll("[data-sidebar-tab]").forEach(g=>{g.addEventListener("click",()=>{const m=parseInt(g.getAttribute("data-sidebar-tab"),10);r.setActiveTab(m)})}),(u=document.getElementById("btn-sidebar-theme-toggle"))==null||u.addEventListener("click",()=>{r.toggleTheme()}),(h=document.getElementById("btn-sidebar-profile"))==null||h.addEventListener("click",()=>{r.openModal("PROFILE")})}renderHeader(){var d,u,h,g;const t=document.getElementById("app-header");if(!t)return;const e=r.get(),a=e.userProfile,s=a.name?a.name.trim().charAt(0).toUpperCase():"U",l=a.avatarColor||"#14C69B",n=P();t.innerHTML=`
      <div class="mobile-header-brand" id="btn-mobile-home">
        <img src="./logo.png" alt="Logo" class="mobile-header-logo">
        <div>
          <div class="mobile-header-title">Celebremos Su Gloria</div>
          <div class="mobile-header-sub">Himnario</div>
        </div>
      </div>

      <div class="desktop-header-left">
        <div class="top-search-box">
          <span class="top-search-icon">${o.search}</span>
          <input type="text" class="top-search-input" id="top-search-input" placeholder="Buscar por número, título, letra, tono o pasaje..." value="${e.searchQuery||""}">
          ${e.searchQuery?`<button class="search-clear-btn" id="btn-clear-top-search">${o.close}</button>`:'<span class="top-search-shortcut">Ctrl K</span>'}
        </div>
      </div>

      <div class="header-actions">
        <button class="header-action-btn" id="btn-header-theme-toggle" title="Alternar Modo Oscuro / Claro">
          ${n?o.moon:o.sun}
        </button>

        <button class="header-profile-btn" id="btn-open-profile-header" aria-label="Ajustes de Perfil">
          <div class="user-avatar-badge" style="background-color: ${l};">
            ${a.profileImage?`<img src="${a.profileImage}" alt="Avatar">`:`<span>${s}</span>`}
          </div>
        </button>
      </div>
    `,(d=document.getElementById("btn-mobile-home"))==null||d.addEventListener("click",()=>{r.setActiveTab(0),r.setSelectedHymn(null)});const c=document.getElementById("top-search-input");c==null||c.addEventListener("input",m=>{r.setSearchQuery(m.target.value)}),(u=document.getElementById("btn-clear-top-search"))==null||u.addEventListener("click",()=>{r.setSearchQuery("")}),(h=document.getElementById("btn-header-theme-toggle"))==null||h.addEventListener("click",()=>{r.toggleTheme()}),(g=document.getElementById("btn-open-profile-header"))==null||g.addEventListener("click",()=>{r.openModal("PROFILE")})}renderNav(){const t=document.getElementById("bottom-nav");if(!t)return;const e=r.get(),a=[{id:0,label:"Todos",icon:o.music},{id:1,label:"Categorías",icon:o.book},{id:2,label:"Listas",icon:o.queue},{id:3,label:"Favoritos",icon:o.heart},{id:4,label:"Ayuda",icon:o.info}];t.innerHTML=a.map(s=>`
      <button class="nav-item ${e.activeTab===s.id&&!e.selectedHymn?"active":""}" data-tab="${s.id}">
        <div class="icon-wrapper">${s.icon}</div>
        <span class="nav-label">${s.label}</span>
      </button>
    `).join(""),t.querySelectorAll(".nav-item").forEach(s=>{s.addEventListener("click",()=>{const l=parseInt(s.getAttribute("data-tab"),10);r.setActiveTab(l)})})}renderContent(){const t=document.getElementById("main-viewport");if(!t)return;const e=r.get();if(e.isLoading){t.innerHTML=`
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Cargando himnos...</p>
        </div>
      `;return}if(e.selectedHymn){this.renderHymnDetail(t,e.selectedHymn);return}switch(e.activeTab){case 0:this.renderHymnsListTab(t);break;case 1:this.renderCategoriesTab(t);break;case 2:this.renderPlaylistsTab(t);break;case 3:this.renderFavoritesTab(t);break;case 4:this.renderInfoTab(t);break;default:this.renderHymnsListTab(t)}}renderHymnsListTab(t){var l,n,c;const e=r.get(),a=M(e.hymnsList,{activeTab:0,searchQuery:e.searchQuery,favorites:e.favorites}),s=a.filter(d=>d.mp3Urls&&d.mp3Urls.length>0);t.innerHTML=`
      <div class="view-content-wrapper fade-in">
        <div class="mobile-search-bar">
          <div class="mobile-search-box">
            <span class="top-search-icon">${o.search}</span>
            <input type="text" class="mobile-search-input" id="mobile-search-input" placeholder="Buscar himnos..." value="${e.searchQuery||""}">
            ${e.searchQuery?`<button class="search-clear-btn" id="btn-clear-mobile-search">${o.close}</button>`:""}
          </div>
        </div>

        <div class="view-header-bar">
          <div>
            <h1 class="view-heading">Todos los Himnos</h1>
            <span class="view-subheading">${a.length} ${a.length===1?"himno disponible":"himnos disponibles"}</span>
          </div>
          ${s.length>0?`
            <button class="btn-primary btn-compact" id="btn-play-all-hymns">
              ${o.play} Reproducir
            </button>
          `:""}
        </div>

        <div class="hymns-grid-container">
          ${this.buildHymnGridItems(a,e.searchQuery,e.favorites)}
        </div>
      </div>
    `,(l=document.getElementById("mobile-search-input"))==null||l.addEventListener("input",d=>{r.setSearchQuery(d.target.value)}),(n=document.getElementById("btn-clear-mobile-search"))==null||n.addEventListener("click",()=>{r.setSearchQuery("")}),(c=document.getElementById("btn-play-all-hymns"))==null||c.addEventListener("click",()=>{s.length>0&&E.play(s[0],s)}),this.bindHymnCardClicks()}renderCategoriesTab(t){var l,n;const e=r.get();if(e.selectedCategory){const c=M(e.hymnsList,{activeTab:1,selectedCategory:e.selectedCategory,categoryMode:e.categoryMode,searchQuery:e.searchQuery,favorites:e.favorites}),d=c.filter(u=>u.mp3Urls&&u.mp3Urls.length>0);t.innerHTML=`
        <div class="view-content-wrapper fade-in">
          <div class="category-header">
            <button class="category-header-back" id="btn-back-categories" title="Volver a Categorías">
              ${o.arrowBack}
            </button>
            <div>
              <h1 class="category-header-title">${e.selectedCategory}</h1>
              <span class="view-subheading">${c.length} himnos</span>
            </div>
            ${d.length>0?`
              <button class="btn-primary btn-compact" id="btn-play-all-cat" style="margin-left: auto;">
                ${o.play} Reproducir
              </button>
            `:""}
          </div>

          <div class="hymns-grid-container">
            ${this.buildHymnGridItems(c,e.searchQuery,e.favorites)}
          </div>
        </div>
      `,(l=document.getElementById("btn-back-categories"))==null||l.addEventListener("click",()=>{r.setSelectedCategory(null)}),(n=document.getElementById("btn-play-all-cat"))==null||n.addEventListener("click",()=>{d.length>0&&E.play(d[0],d)}),this.bindHymnCardClicks();return}const a=[{id:"THEMATIC",label:"Temas",icon:o.book},{id:"READINGS",label:"Lecturas Bíblicas",icon:o.book},{id:"KEY",label:"Notas / Tonos",icon:o.music},{id:"MOOD",label:"Carácter",icon:o.music}],s=N(e.hymnsList,e.categoryMode);t.innerHTML=`
      <div class="view-content-wrapper fade-in">
        <div class="view-header-bar">
          <div>
            <h1 class="view-heading">Categorías y Clasificaciones</h1>
            <span class="view-subheading">Explora los himnos por temática, lecturas bíblicas, tono musical o carácter</span>
          </div>
        </div>

        <div class="category-modes-bar">
          ${a.map(c=>`
            <button class="chip-btn ${e.categoryMode===c.id?"active":""}" data-mode="${c.id}">
              ${c.label}
            </button>
          `).join("")}
        </div>

        <div class="categories-grid">
          ${s.map(c=>`
            <div class="category-card" data-category="${c}">
              <div class="category-card-icon">
                ${e.categoryMode==="KEY"||e.categoryMode==="MOOD"?o.music:o.book}
              </div>
              <div class="category-card-title">${c}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `,t.querySelectorAll(".chip-btn").forEach(c=>{c.addEventListener("click",()=>{const d=c.getAttribute("data-mode");r.setCategoryMode(d)})}),t.querySelectorAll(".category-card").forEach(c=>{c.addEventListener("click",()=>{const d=c.getAttribute("data-category");r.setSelectedCategory(d)})})}renderPlaylistsTab(t){var s,l,n,c,d;const e=r.get();if(e.selectedPlaylist){const u=e.selectedPlaylist,h=u.hymns.map(m=>e.hymnsList.find(y=>y.number===m)).filter(Boolean),g=h.filter(m=>m.mp3Urls&&m.mp3Urls.length>0);t.innerHTML=`
        <div class="view-content-wrapper fade-in">
          <div class="playlist-detail-header">
            <button class="category-header-back" id="btn-back-playlists" title="Volver a listas">
              ${o.arrowBack}
            </button>
            <div style="flex: 1;">
              <h1 class="playlist-detail-title">${u.name}</h1>
              <span class="view-subheading">${h.length} himnos</span>
            </div>
            ${g.length>0?`
              <button class="btn-primary btn-compact" id="btn-play-all-pl">
                ${o.play} Reproducir
              </button>
            `:""}
          </div>

          ${h.length===0?`
            <div class="empty-state">
              <div class="empty-state-icon">${o.queue}</div>
              <div class="empty-state-title">Esta lista está vacía</div>
              <p class="empty-state-desc">Añade himnos tocando el botón de lista (+) en la vista detallada de cualquier himno.</p>
            </div>
          `:`
            <div class="hymns-grid-container">
              ${h.map((m,y)=>`
                <div class="hymn-grid-item" data-number="${m.number}">
                  <div class="hymn-number-badge">${m.number}</div>
                  <div class="hymn-info">
                    <span class="hymn-title">${m.title}</span>
                    ${m.category?`<span class="hymn-subtitle">${m.category}</span>`:""}
                  </div>
                  <div class="playlist-hymn-actions" onclick="event.stopPropagation();">
                    <button class="playlist-reorder-btn btn-move-up" data-num="${m.number}" ${y===0?"disabled":""} title="Subir">
                      ${o.arrowUp}
                    </button>
                    <button class="playlist-reorder-btn btn-move-down" data-num="${m.number}" ${y===h.length-1?"disabled":""} title="Bajar">
                      ${o.arrowDown}
                    </button>
                    <button class="playlist-reorder-btn btn-remove-hymn" data-num="${m.number}" title="Remover de lista">
                      ${o.close}
                    </button>
                  </div>
                </div>
              `).join("")}
            </div>
          `}
        </div>
      `,(s=document.getElementById("btn-back-playlists"))==null||s.addEventListener("click",()=>{r.setSelectedPlaylist(null)}),(l=document.getElementById("btn-play-all-pl"))==null||l.addEventListener("click",()=>{g.length>0&&E.play(g[0],g)}),this.bindHymnCardClicks(),t.querySelectorAll(".btn-move-up").forEach(m=>{m.addEventListener("click",()=>{const y=parseInt(m.getAttribute("data-num"),10);b.moveHymnInPlaylist(u.name,y,!0),r.refreshPlaylists()})}),t.querySelectorAll(".btn-move-down").forEach(m=>{m.addEventListener("click",()=>{const y=parseInt(m.getAttribute("data-num"),10);b.moveHymnInPlaylist(u.name,y,!1),r.refreshPlaylists()})}),t.querySelectorAll(".btn-remove-hymn").forEach(m=>{m.addEventListener("click",()=>{const y=parseInt(m.getAttribute("data-num"),10);b.removeHymnFromPlaylist(u.name,y),r.refreshPlaylists()})});return}const a=e.playlists;t.innerHTML=`
      <div class="view-content-wrapper fade-in">
        <div class="view-header-bar">
          <div>
            <h1 class="view-heading">Listas de Reproducción</h1>
            <span class="view-subheading">Organiza y reproduce secuencias de himnos para los servicios y cultos</span>
          </div>
          <button class="btn-primary btn-compact" id="btn-create-playlist-header">
            ${o.add} Nueva lista
          </button>
        </div>

        <div class="playlists-container">
          ${a.length===0?`
            <div class="empty-state" style="grid-column: 1 / -1;">
              <div class="empty-state-icon">${o.queue}</div>
              <div class="empty-state-title">No tienes listas creadas</div>
              <p class="empty-state-desc">Crea listas de reproducción para organizar tus himnos favoritos para los cultos o devocionales.</p>
              <button class="btn-primary btn-compact" id="btn-create-playlist-empty">
                ${o.add} Crear lista
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
                  ${o.delete}
                </button>
              </div>
            `).join("")}
          `}
        </div>
      </div>
      <button class="fab-btn" id="fab-create-playlist" title="Nueva lista">
        ${o.add}
      </button>
    `,(n=document.getElementById("btn-create-playlist-header"))==null||n.addEventListener("click",()=>{r.openModal("CREATE_PLAYLIST")}),(c=document.getElementById("btn-create-playlist-empty"))==null||c.addEventListener("click",()=>{r.openModal("CREATE_PLAYLIST")}),(d=document.getElementById("fab-create-playlist"))==null||d.addEventListener("click",()=>{r.openModal("CREATE_PLAYLIST")}),t.querySelectorAll(".playlist-card").forEach(u=>{u.addEventListener("click",h=>{if(h.target.closest(".playlist-card-delete-btn"))return;const g=u.getAttribute("data-playlist"),m=a.find(y=>y.name===g);m&&r.setSelectedPlaylist(m)})}),t.querySelectorAll(".playlist-card-delete-btn").forEach(u=>{u.addEventListener("click",h=>{h.stopPropagation();const g=u.getAttribute("data-delete-playlist");r.openModal("DELETE_PLAYLIST",{name:g})})})}renderFavoritesTab(t){var l;const e=r.get(),a=M(e.hymnsList,{activeTab:3,searchQuery:e.searchQuery,favorites:e.favorites}),s=a.filter(n=>n.mp3Urls&&n.mp3Urls.length>0);if(e.favorites.size===0){t.innerHTML=`
        <div class="view-content-wrapper fade-in">
          <div class="empty-state">
            <div class="empty-state-icon">${o.heartOutline}</div>
            <div class="empty-state-title">No tienes himnos favoritos</div>
            <p class="empty-state-desc">Toca el corazón en la letra de cualquier himno para guardarlo en esta sección.</p>
          </div>
        </div>
      `;return}t.innerHTML=`
      <div class="view-content-wrapper fade-in">
        <div class="view-header-bar">
          <div>
            <h1 class="view-heading">Himnos Favoritos</h1>
            <span class="view-subheading">${a.length} himnos guardados</span>
          </div>
          ${s.length>0?`
            <button class="btn-primary btn-compact" id="btn-play-all-favs">
              ${o.play} Reproducir
            </button>
          `:""}
        </div>

        <div class="hymns-grid-container">
          ${this.buildHymnGridItems(a,e.searchQuery,e.favorites)}
        </div>
      </div>
    `,(l=document.getElementById("btn-play-all-favs"))==null||l.addEventListener("click",()=>{s.length>0&&E.play(s[0],s)}),this.bindHymnCardClicks()}renderInfoTab(t){t.innerHTML=`
      <div class="view-content-wrapper fade-in">
        <div class="info-view-container">
          <div class="info-hero">
            <img src="./logo.png" alt="Celebremos Su Gloria" class="info-logo">
            <div class="info-title">Celebremos Su Gloria</div>
            <div class="info-subtitle">Himnario Cristiano</div>
          </div>

          <div class="info-card">
            <div class="info-card-header">
              <div class="info-card-icon">${o.book}</div>
              <div class="info-card-title">Letras de los Himnos</div>
            </div>
            <p class="info-card-text">
              Las letras de los himnos son tomadas del himnario <strong>Celebremos su gloria</strong>, publicado por <strong>Editorial CLC</strong>. Agradecemos su gran labor para proveer este valioso recurso doctrinal e instrumental a la iglesia hispana.
            </p>
          </div>

          <div class="info-card">
            <div class="info-card-header">
              <div class="info-card-icon">${o.music}</div>
              <div class="info-card-title">Audios del Himnario</div>
            </div>
            <p class="info-card-text">
              Gracias a <a href="https://www.palabradeverdad.com/audio/himnario/" target="_blank" rel="noopener noreferrer" class="info-card-link">Audio Producciones Berea</a> por los audios de los himnos. Su ministerio es una gran bendición para el pueblo del Señor.
            </p>
          </div>

          <div class="info-card">
            <div class="info-card-header">
              <div class="info-card-icon">${o.heart}</div>
              <div class="info-card-title">Sobre el Proyecto</div>
            </div>
            <p class="info-card-text">
              Esta aplicación web y PWA ha sido creada con ❤️ por <strong>Alejandro Morales</strong>. El único propósito de este proyecto es servir al pueblo de Dios.
            </p>
          </div>
        </div>
      </div>
    `}renderHymnDetail(t,e){var h,g,m,y,v,f;const a=r.get(),s=a.favorites.has(e.number);let l=a.hymnsList;a.activeTab===2&&a.selectedPlaylist?l=a.selectedPlaylist.hymns.map(p=>a.hymnsList.find(T=>T.number===p)).filter(Boolean):a.activeTab===3&&(l=a.hymnsList.filter(p=>a.favorites.has(p.number)));const n=E.getState(),c=n.currentHymn&&n.currentHymn.number===e.number;t.innerHTML=`
      <div class="hymn-detail-view fade-in">
        <div class="detail-top-bar">
          <button class="action-icon-btn" id="btn-back-detail" aria-label="Volver">
            ${o.arrowBack}
          </button>
          <div class="detail-actions">
            <button class="action-icon-btn" id="btn-add-playlist-detail" title="Añadir a lista">
              ${o.playlistAdd}
            </button>
            <button class="action-icon-btn" id="btn-share-detail" title="Compartir letra">
              ${o.share}
            </button>
            <button class="action-icon-btn ${s?"is-fav":""}" id="btn-fav-detail" title="${s?"Quitar de favoritos":"Añadir a favoritos"}">
              ${s?o.heart:o.heartOutline}
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
                  <div class="player-music-icon">${o.music}</div>
                  <div>
                    <div class="player-title">Audio disponible</div>
                    <div class="player-subtitle">${e.mp3Urls.length>1?`${e.mp3Urls.length} variantes de tono`:"Tono original"}</div>
                  </div>
                </div>
                <div class="player-controls-row">
                  <button class="player-btn-prev" id="btn-detail-prev" ${n.hasPrevious?"":"disabled"} title="Anterior">
                    ${o.prev}
                  </button>
                  <button class="player-btn-play" id="btn-detail-play" title="Reproducir">
                    ${c&&n.isPlaying?o.pause:o.play}
                  </button>
                  <button class="player-btn-next" id="btn-detail-next" ${n.hasNext?"":"disabled"} title="Siguiente">
                    ${o.next}
                  </button>
                </div>
              </div>

              ${c&&n.duration>0?`
                <div class="player-seekbar-row">
                  <input type="range" class="player-seekbar" id="detail-seekbar" min="0" max="${Math.floor(n.duration)}" value="${Math.floor(n.currentTime)}">
                  <div class="player-times">
                    <span>${C(n.currentTime)}</span>
                    <span>${C(n.duration)}</span>
                  </div>
                </div>
              `:""}

              ${e.mp3Urls.length>1?`
                <div class="tone-variants-row">
                  <span class="tone-label">Tono:</span>
                  ${e.mp3Urls.map((p,T)=>{const L=H(p);return`
                      <button class="tone-chip ${this.currentDetailVariantIndex===T?"active":""}" data-variant-idx="${T}" data-url="${p}">
                        ${L}
                      </button>
                    `}).join("")}
                </div>
              `:""}
            </div>
          `:""}

          ${e.biblePassage?`
            <div class="bible-card">
              <div class="bible-icon">${o.book}</div>
              <div class="bible-content">
                <div class="bible-text">${e.bibleVerse||e.biblePassage}</div>
                ${e.bibleReference?`<div class="bible-ref">${e.bibleReference}</div>`:""}
              </div>
            </div>
          `:""}

          <div class="lyrics-container">
            ${e.type==="reading"?`
              ${e.sections.map(p=>`<p class="reading-paragraph">${p.text}</p>`).join("")}
            `:`
              ${e.sections.map(p=>p.type==="chorus"?`
                    <div class="chorus-card">
                      <div class="chorus-label">[CORO]</div>
                      <div class="chorus-text">${p.text}</div>
                    </div>
                  `:`
                    <div class="verse-block">
                      ${p.number?`<span class="verse-number">${p.number}</span>`:""}
                      <p class="verse-text">${p.text}</p>
                    </div>
                  `).join("")}
            `}
          </div>

          ${e.footnotes&&e.footnotes.length>0?`
            <div class="footnotes-card">
              ${e.footnotes.map(p=>`<div class="footnote-item">${p}</div>`).join("")}
            </div>
          `:""}

          ${e.credits&&e.credits.length>0?`
            <div class="hymn-credits-footer">
              ${e.credits.map(p=>`<span class="credit-line">${p}</span>`).join("")}
            </div>
          `:""}
        </div>
      </div>
    `,(h=document.getElementById("btn-back-detail"))==null||h.addEventListener("click",()=>{r.setSelectedHymn(null)}),(g=document.getElementById("btn-share-detail"))==null||g.addEventListener("click",()=>{F(e)}),(m=document.getElementById("btn-add-playlist-detail"))==null||m.addEventListener("click",()=>{r.openModal("ADD_TO_PLAYLIST",{hymn:e})}),(y=document.getElementById("btn-fav-detail"))==null||y.addEventListener("click",()=>{const p=r.toggleFavorite(e.number);$(p?"Añadido a favoritos":"Eliminado de favoritos")});const d=document.getElementById("btn-detail-play");d&&d.addEventListener("click",()=>{const p=e.mp3Urls&&e.mp3Urls[this.currentDetailVariantIndex]||e.mp3Urls&&e.mp3Urls[0];p&&(n.currentUrl===p?n.isPlaying?E.pause():E.resume():E.play(e,l,p))}),(v=document.getElementById("btn-detail-prev"))==null||v.addEventListener("click",()=>{E.playPrevious()}),(f=document.getElementById("btn-detail-next"))==null||f.addEventListener("click",()=>{E.playNext()});const u=document.getElementById("detail-seekbar");u&&u.addEventListener("input",p=>{E.seekTo(parseFloat(p.target.value))}),t.querySelectorAll(".tone-chip").forEach(p=>{p.addEventListener("click",()=>{const T=parseInt(p.getAttribute("data-variant-idx"),10),L=p.getAttribute("data-url");this.currentDetailVariantIndex=T,n.currentHymn&&n.currentHymn.number===e.number?E.play(e,l,L):this.render()})})}updatePlayerUI(){var u,h,g,m,y,v;const t=document.getElementById("bottom-player-host");if(!t)return;const e=E.getState(),a=e.currentHymn;if(!a||!e.currentUrl){t.innerHTML="";return}const l=r.get().favorites.has(a.number),n=e.duration>0?e.currentTime/e.duration*100:0,c=H(e.currentUrl);t.innerHTML=`
      <div class="web-bottom-player">
        <!-- Top progress line on mobile -->
        <div class="player-mobile-progress">
          <div class="player-mobile-progress-fill" style="width: ${n}%;"></div>
        </div>

        <!-- Left Track Meta -->
        <div class="player-track-meta" id="player-track-meta">
          <div class="player-artwork">
            ${o.music}
          </div>
          <div class="player-text-details">
            <span class="player-track-tag">Himno ${a.number}</span>
            <span class="player-track-title">${a.title}</span>
          </div>
          <button class="player-btn-fav ${l?"is-fav":""}" id="btn-player-fav" title="${l?"Quitar de favoritos":"Añadir a favoritos"}">
            ${l?o.heart:o.heartOutline}
          </button>
        </div>

        <!-- Center Controls -->
        <div class="player-center-controls">
          <div class="player-transport-buttons">
            <button class="player-icon-btn" id="btn-player-prev" ${e.hasPrevious?"":"disabled"} title="Anterior">
              ${o.prev}
            </button>
            <button class="player-main-play-btn" id="btn-player-main-play" title="${e.isPlaying?"Pausa":"Reproducir"}">
              ${e.isPlaying?o.pause:o.play}
            </button>
            <button class="player-icon-btn" id="btn-player-next" ${e.hasNext?"":"disabled"} title="Siguiente">
              ${o.next}
            </button>
          </div>

          <div class="player-timeline-bar">
            <span class="player-time-current">${C(e.currentTime)}</span>
            <input type="range" class="player-timeline-slider" id="player-timeline-slider" min="0" max="${Math.floor(e.duration)}" value="${Math.floor(e.currentTime)}">
            <span class="player-time-total">${C(e.duration)}</span>
          </div>
        </div>

        <!-- Right Tools -->
        <div class="player-right-tools">
          <span class="player-tone-badge-btn" title="Tono en reproducción">
            ${o.music} ${c}
          </span>
          <button class="player-btn-close" id="btn-player-close" title="Cerrar reproductor">
            ${o.close}
          </button>
        </div>
      </div>
    `,(u=document.getElementById("player-track-meta"))==null||u.addEventListener("click",f=>{f.target.closest("#btn-player-fav")||r.setSelectedHymn(a)}),(h=document.getElementById("btn-player-fav"))==null||h.addEventListener("click",f=>{f.stopPropagation(),r.toggleFavorite(a.number)}),(g=document.getElementById("btn-player-main-play"))==null||g.addEventListener("click",()=>{e.isPlaying?E.pause():E.resume()}),(m=document.getElementById("btn-player-prev"))==null||m.addEventListener("click",()=>{E.playPrevious()}),(y=document.getElementById("btn-player-next"))==null||y.addEventListener("click",()=>{E.playNext()}),(v=document.getElementById("btn-player-close"))==null||v.addEventListener("click",()=>{E.stop()});const d=document.getElementById("player-timeline-slider");d==null||d.addEventListener("input",f=>{E.seekTo(parseFloat(f.target.value))})}renderModal(){const t=document.getElementById("modal-host");if(!t)return;const e=r.get();if(!e.activeModal){t.innerHTML="";return}switch(e.activeModal){case"PROFILE":this.renderProfileModal(t);break;case"CREATE_PLAYLIST":this.renderCreatePlaylistModal(t);break;case"ADD_TO_PLAYLIST":this.renderAddToPlaylistModal(t,e.modalPayload);break;case"DELETE_PLAYLIST":this.renderDeletePlaylistModal(t,e.modalPayload);break;default:t.innerHTML=""}}renderProfileModal(t){var d,u,h,g,m,y;const e=r.get(),a=e.userProfile,s=[{hex:"#14C69B",label:"Verde"},{hex:"#006680",label:"Azul"},{hex:"#DCBB11",label:"Oro"},{hex:"#8E24AA",label:"Púrpura"},{hex:"#E53935",label:"Rojo"},{hex:"#3949AB",label:"Índigo"}];t.innerHTML=`
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal-dialog">
          <div class="modal-header">
            <h2 class="modal-title">Ajustes & Configuración</h2>
            <button class="modal-close-btn" id="btn-close-modal">${o.close}</button>
          </div>
          <div class="modal-body custom-scroll">
            <div class="profile-avatar-editor">
              <div class="avatar-upload-box" id="avatar-box" style="background-color: ${a.avatarColor||"#14C69B"};">
                ${a.profileImage?`<img src="${a.profileImage}" id="avatar-preview-img" alt="Avatar">`:`<span class="avatar-initial" id="avatar-initial-txt">${a.name?a.name.charAt(0).toUpperCase():"U"}</span>`}
                <div class="avatar-upload-overlay">${o.camera}</div>
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
                ${s.map(v=>`
                  <div class="color-option ${a.avatarColor===v.hex?"selected":""}" data-color="${v.hex}">
                    <div class="color-circle-inner" style="background-color: ${v.hex};"></div>
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
                  ${o.upload} Exportar
                </button>
                <button class="btn-outlined" id="btn-import-backup-trigger" style="flex: 1;">
                  ${o.download} Importar
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
    `,(d=document.getElementById("btn-close-modal"))==null||d.addEventListener("click",()=>r.closeModal()),(u=document.getElementById("btn-cancel-profile"))==null||u.addEventListener("click",()=>r.closeModal()),(h=document.getElementById("modal-overlay"))==null||h.addEventListener("click",v=>{v.target.id==="modal-overlay"&&r.closeModal()});const l=document.getElementById("avatar-box"),n=document.getElementById("avatar-file-input");l==null||l.addEventListener("click",()=>n==null?void 0:n.click()),n==null||n.addEventListener("change",v=>{const f=v.target.files[0];if(f){const p=new FileReader;p.onload=T=>{const L=T.target.result;a.profileImage=L,l.innerHTML=`<img src="${L}" alt="Avatar"><div class="avatar-upload-overlay">${o.camera}</div>`},p.readAsDataURL(f)}}),t.querySelectorAll(".color-option").forEach(v=>{v.addEventListener("click",()=>{t.querySelectorAll(".color-option").forEach(p=>p.classList.remove("selected")),v.classList.add("selected");const f=v.getAttribute("data-color");a.avatarColor=f,l.style.backgroundColor=f})}),t.querySelectorAll("[data-scale]").forEach(v=>{v.addEventListener("click",()=>{t.querySelectorAll("[data-scale]").forEach(p=>p.classList.remove("active")),v.classList.add("active");const f=v.getAttribute("data-scale");r.applyTextScale(f)})}),t.querySelectorAll("[data-theme]").forEach(v=>{v.addEventListener("click",()=>{t.querySelectorAll("[data-theme]").forEach(p=>p.classList.remove("active")),v.classList.add("active");const f=v.getAttribute("data-theme");r.applyTheme(f)})}),(g=document.getElementById("btn-export-backup"))==null||g.addEventListener("click",()=>{const v=b.exportBackup();$(v?"Copia de seguridad descargada":"Error al exportar copia de seguridad")});const c=document.getElementById("backup-file-input");(m=document.getElementById("btn-import-backup-trigger"))==null||m.addEventListener("click",()=>{c==null||c.click()}),c==null||c.addEventListener("change",async v=>{const f=v.target.files[0];f&&(await b.importBackup(f)?(r.set({favorites:b.getFavorites(),playlists:b.getPlaylists()}),$("Copia de seguridad importada con éxito"),r.closeModal()):$("Error al importar archivo de copia"))}),(y=document.getElementById("btn-save-profile"))==null||y.addEventListener("click",()=>{var f;const v=((f=document.getElementById("profile-name-input"))==null?void 0:f.value.trim())||"";b.setUserName(v),b.setUserAvatarColor(a.avatarColor),b.setUserProfileImage(a.profileImage),r.set({userProfile:{name:v,avatarColor:a.avatarColor,profileImage:a.profileImage}}),$("Perfil actualizado"),r.closeModal()})}renderCreatePlaylistModal(t){var e,a,s,l;t.innerHTML=`
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal-dialog">
          <div class="modal-header">
            <h2 class="modal-title">Nueva Lista</h2>
            <button class="modal-close-btn" id="btn-close-modal">${o.close}</button>
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
    `,(e=document.getElementById("btn-close-modal"))==null||e.addEventListener("click",()=>r.closeModal()),(a=document.getElementById("btn-cancel-playlist"))==null||a.addEventListener("click",()=>r.closeModal()),(s=document.getElementById("modal-overlay"))==null||s.addEventListener("click",n=>{n.target.id==="modal-overlay"&&r.closeModal()}),(l=document.getElementById("btn-save-playlist"))==null||l.addEventListener("click",()=>{var d;const n=(d=document.getElementById("playlist-name-input"))==null?void 0:d.value.trim();if(!n){$("Ingresa un nombre para la lista");return}b.createPlaylist(n)?(r.refreshPlaylists(),$("Lista creada"),r.closeModal()):$("Ya existe una lista con ese nombre")})}renderAddToPlaylistModal(t,e){var c,d,u,h,g;const a=e==null?void 0:e.hymn;if(!a){r.closeModal();return}const s=()=>{const m=b.getPlaylists();return m.length===0?`
          <div class="modal-empty-playlists">
            <div class="empty-state-icon" style="width: 32px; height: 32px; opacity: 0.6;">${o.queue}</div>
            <span>No tienes listas creadas aún. Escribe un nombre arriba para crear tu primera lista.</span>
          </div>
        `:`
        <div class="playlist-modal-list custom-scroll">
          ${m.map(y=>{const v=y.hymns.includes(a.number);return`
              <div class="playlist-select-item ${v?"contains-hymn":""}" data-pl-name="${y.name}">
                <div class="playlist-select-info">
                  <div class="playlist-select-icon">${o.queue}</div>
                  <div>
                    <div class="playlist-select-name">${y.name}</div>
                    <div class="playlist-select-count">${y.hymns.length} ${y.hymns.length===1?"himno":"himnos"}</div>
                  </div>
                </div>
                <button class="playlist-select-btn ${v?"active":""}" data-action-pl="${y.name}" title="${v?"Quitar de lista":"Añadir a lista"}">
                  ${v?`${o.check} Añadido`:`${o.add} Añadir`}
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
            <button class="modal-close-btn" id="btn-close-modal">${o.close}</button>
          </div>
          <div class="modal-body custom-scroll">
            <div class="modal-quick-create-box">
              <span class="modal-section-label">Crear nueva lista</span>
              <div class="modal-create-row">
                <input type="text" class="form-input modal-create-input" id="new-playlist-quick-input" placeholder="Nombre de la nueva lista...">
                <button class="btn-primary btn-compact" id="btn-quick-create-pl">
                  ${o.add} Crear
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
    `;const l=()=>{const m=document.getElementById("modal-playlists-host");m&&m.querySelectorAll(".playlist-select-item").forEach(y=>{y.addEventListener("click",()=>{const v=y.getAttribute("data-pl-name"),p=b.getPlaylists().find(L=>L.name.toLowerCase()===v.toLowerCase());p&&p.hymns.includes(a.number)?(b.removeHymnFromPlaylist(v,a.number),$(`Eliminado de "${v}"`)):(b.addHymnToPlaylist(v,a.number),$(`Añadido a "${v}"`)),r.refreshPlaylists(),m.innerHTML=s(),l()})})};l();const n=()=>{const m=document.getElementById("new-playlist-quick-input"),y=m==null?void 0:m.value.trim();if(!y){$("Ingresa un nombre para la lista");return}if(b.createPlaylist(y)){b.addHymnToPlaylist(y,a.number),r.refreshPlaylists(),$("Lista creada y añadido"),m&&(m.value="");const f=document.getElementById("modal-playlists-host");f&&(f.innerHTML=s(),l())}else $("Ya existe una lista con ese nombre")};(c=document.getElementById("btn-quick-create-pl"))==null||c.addEventListener("click",n),(d=document.getElementById("new-playlist-quick-input"))==null||d.addEventListener("keydown",m=>{m.key==="Enter"&&(m.preventDefault(),n())}),(u=document.getElementById("btn-close-modal"))==null||u.addEventListener("click",()=>r.closeModal()),(h=document.getElementById("btn-done-add-modal"))==null||h.addEventListener("click",()=>r.closeModal()),(g=document.getElementById("modal-overlay"))==null||g.addEventListener("click",m=>{m.target.id==="modal-overlay"&&r.closeModal()})}renderDeletePlaylistModal(t,e){var s,l,n,c;const a=e==null?void 0:e.name;if(!a){r.closeModal();return}t.innerHTML=`
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal-dialog">
          <div class="modal-header">
            <h2 class="modal-title title-error">¿Eliminar Lista?</h2>
            <button class="modal-close-btn" id="btn-close-modal">${o.close}</button>
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
    `,(s=document.getElementById("btn-close-modal"))==null||s.addEventListener("click",()=>r.closeModal()),(l=document.getElementById("btn-cancel-delete"))==null||l.addEventListener("click",()=>r.closeModal()),(n=document.getElementById("modal-overlay"))==null||n.addEventListener("click",d=>{d.target.id==="modal-overlay"&&r.closeModal()}),(c=document.getElementById("btn-confirm-delete"))==null||c.addEventListener("click",()=>{b.deletePlaylist(a),r.refreshPlaylists(),$("Lista eliminada"),r.closeModal()})}buildHymnGridItems(t,e,a){return!t||t.length===0?`
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">${o.search}</div>
          <div class="empty-state-title">No se encontraron himnos</div>
          <p class="empty-state-desc">Prueba con otro término de búsqueda o número de himno.</p>
        </div>
      `:t.map(s=>{const l=a.has(s.number),n=s.mp3Urls&&s.mp3Urls.length>0,c=this.highlightQuery(s.title,e);return`
        <div class="hymn-grid-item" data-number="${s.number}">
          <div class="hymn-number-badge">${s.number}</div>
          <div class="hymn-info">
            <span class="hymn-title">${c}</span>
            ${s.category?`<span class="hymn-subtitle">${s.category}</span>`:""}
          </div>
          <div class="hymn-item-badges">
            ${n?`<div class="hymn-audio-icon" title="Audio disponible">${o.music}</div>`:""}
            ${l?`<div class="hymn-fav-icon" title="Favorito">${o.heart}</div>`:""}
          </div>
        </div>
      `}).join("")}highlightQuery(t,e){if(!e||!e.trim())return t;const a=e.trim().replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),s=new RegExp(`(${a})`,"gi");return t.replace(s,'<mark class="search-highlight">$1</mark>')}bindHymnCardClicks(){document.querySelectorAll(".hymn-grid-item").forEach(t=>{t.addEventListener("click",()=>{const e=parseInt(t.getAttribute("data-number"),10),a=r.get().hymnsList.find(s=>s.number===e);a&&r.setSelectedHymn(a)})})}}async function B(){const i=document.getElementById("app");if(!i)return;const t=r.get().appTheme,e=r.get().textSizeScale;x(t),z(e),window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{r.get().appTheme==="system"&&x("system")}),new Q(i).init();try{const s=await fetch("./hymns.json");if(!s.ok)throw new Error(`HTTP error ${s.status}`);const l=await s.json(),n=O(l);r.set({hymnsList:n,isLoading:!1})}catch(s){console.error("Failed to load hymns:",s);const l=document.getElementById("main-viewport");l&&(l.innerHTML=`
        <div class="empty-state">
          <div class="empty-state-title">Error al cargar los himnos</div>
          <p class="empty-state-desc">Verifica tu conexión a internet o intenta recargar la página.</p>
          <button class="btn-primary" onclick="location.reload()">Recargar</button>
        </div>
      `)}"serviceWorker"in navigator&&window.location.protocol.startsWith("http")&&window.addEventListener("load",()=>{navigator.serviceWorker.register("./sw.js").catch(s=>{console.warn("Service Worker registration failed:",s)})})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",B):B();
