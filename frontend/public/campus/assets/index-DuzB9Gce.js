(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ca="180",Ui={ROTATE:0,DOLLY:1,PAN:2},Li={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Nh=0,ol=1,Fh=2,bc=1,wc=2,Cn=3,Zn=0,Ie=1,tn=2,Wn=0,Ni=1,al=2,ll=3,cl=4,Oh=5,oi=100,Bh=101,zh=102,Hh=103,kh=104,Gh=200,Vh=201,Wh=202,Xh=203,Ao=204,Ro=205,Yh=206,Zh=207,qh=208,jh=209,Kh=210,Jh=211,$h=212,Qh=213,tu=214,Co=0,Po=1,Do=2,Oi=3,Lo=4,Io=5,Uo=6,No=7,Tc=0,eu=1,nu=2,Xn=0,iu=1,su=2,ru=3,Ac=4,ou=5,au=6,lu=7,Rc=300,Bi=301,zi=302,Fo=303,Oo=304,Ar=306,gr=1e3,Vn=1001,Bo=1002,qe=1003,cu=1004,Is=1005,fn=1006,Fr=1007,li=1008,gn=1009,Cc=1010,Pc=1011,ps=1012,Pa=1013,ci=1014,pn=1015,Es=1016,Da=1017,La=1018,ms=1020,Dc=35902,Lc=35899,Ic=1021,Uc=1022,ln=1023,gs=1026,_s=1027,Ia=1028,Ua=1029,Nc=1030,Na=1031,Fa=1033,ar=33776,lr=33777,cr=33778,hr=33779,zo=35840,Ho=35841,ko=35842,Go=35843,Vo=36196,Wo=37492,Xo=37496,Yo=37808,Zo=37809,qo=37810,jo=37811,Ko=37812,Jo=37813,$o=37814,Qo=37815,ta=37816,ea=37817,na=37818,ia=37819,sa=37820,ra=37821,oa=36492,aa=36494,la=36495,ca=36283,ha=36284,ua=36285,da=36286,hu=3200,uu=3201,Fc=0,du=1,Gn="",we="srgb",Hi="srgb-linear",_r="linear",ie="srgb",_i=7680,hl=519,fu=512,pu=513,mu=514,Oc=515,gu=516,_u=517,xu=518,vu=519,ul=35044,dl="300 es",mn=2e3,xr=2001;class fi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const Ce=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],us=Math.PI/180,fa=180/Math.PI;function Vi(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ce[i&255]+Ce[i>>8&255]+Ce[i>>16&255]+Ce[i>>24&255]+"-"+Ce[t&255]+Ce[t>>8&255]+"-"+Ce[t>>16&15|64]+Ce[t>>24&255]+"-"+Ce[e&63|128]+Ce[e>>8&255]+"-"+Ce[e>>16&255]+Ce[e>>24&255]+Ce[n&255]+Ce[n>>8&255]+Ce[n>>16&255]+Ce[n>>24&255]).toLowerCase()}function Vt(i,t,e){return Math.max(t,Math.min(e,i))}function yu(i,t){return(i%t+t)%t}function Or(i,t,e){return(1-e)*i+e*t}function Mu(i){return i*us}function Ji(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ze(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Bc={DEG2RAD:us,degToRad:Mu};class Q{constructor(t=0,e=0){Q.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Vt(this.x,t.x,e.x),this.y=Vt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Vt(this.x,t,e),this.y=Vt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Vt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Vt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class hi{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3];const f=r[o+0],p=r[o+1],g=r[o+2],x=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=f,t[e+1]=p,t[e+2]=g,t[e+3]=x;return}if(u!==x||c!==f||l!==p||h!==g){let m=1-a;const d=c*f+l*p+h*g+u*x,M=d>=0?1:-1,v=1-d*d;if(v>Number.EPSILON){const w=Math.sqrt(v),A=Math.atan2(w,d*M);m=Math.sin(m*A)/w,a=Math.sin(a*A)/w}const _=a*M;if(c=c*m+f*_,l=l*m+p*_,h=h*m+g*_,u=u*m+x*_,m===1-a){const w=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=w,l*=w,h*=w,u*=w}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=r[o],f=r[o+1],p=r[o+2],g=r[o+3];return t[e]=a*g+h*u+c*p-l*f,t[e+1]=c*g+h*f+l*u-a*p,t[e+2]=l*g+h*p+a*f-c*u,t[e+3]=h*g-a*u-c*f-l*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),u=a(r/2),f=c(n/2),p=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=f*h*u+l*p*g,this._y=l*p*u-f*h*g,this._z=l*h*g+f*p*u,this._w=l*h*u-f*p*g;break;case"YXZ":this._x=f*h*u+l*p*g,this._y=l*p*u-f*h*g,this._z=l*h*g-f*p*u,this._w=l*h*u+f*p*g;break;case"ZXY":this._x=f*h*u-l*p*g,this._y=l*p*u+f*h*g,this._z=l*h*g+f*p*u,this._w=l*h*u-f*p*g;break;case"ZYX":this._x=f*h*u-l*p*g,this._y=l*p*u+f*h*g,this._z=l*h*g-f*p*u,this._w=l*h*u+f*p*g;break;case"YZX":this._x=f*h*u+l*p*g,this._y=l*p*u+f*h*g,this._z=l*h*g-f*p*u,this._w=l*h*u-f*p*g;break;case"XZY":this._x=f*h*u-l*p*g,this._y=l*p*u-f*h*g,this._z=l*h*g+f*p*u,this._w=l*h*u+f*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],u=e[10],f=n+a+u;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(h-c)*p,this._y=(r-l)*p,this._z=(o-s)*p}else if(n>a&&n>u){const p=2*Math.sqrt(1+n-a-u);this._w=(h-c)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+l)/p}else if(a>u){const p=2*Math.sqrt(1+a-n-u);this._w=(r-l)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(c+h)/p}else{const p=2*Math.sqrt(1+u-n-a);this._w=(o-s)/p,this._x=(r+l)/p,this._y=(c+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Vt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-s*a,this._w=o*h-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const p=1-e;return this._w=p*o+e*this._w,this._x=p*n+e*this._x,this._y=p*s+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-e)*h)/l,f=Math.sin(e*h)/l;return this._w=o*u+this._w*f,this._x=n*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(t=0,e=0,n=0){D.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(fl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(fl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*s-a*n),h=2*(a*e-r*s),u=2*(r*n-o*e);return this.x=e+c*l+o*u-a*h,this.y=n+c*h+a*l-r*u,this.z=s+c*u+r*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Vt(this.x,t.x,e.x),this.y=Vt(this.y,t.y,e.y),this.z=Vt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Vt(this.x,t,e),this.y=Vt(this.y,t,e),this.z=Vt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Vt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Br.copy(this).projectOnVector(t),this.sub(Br)}reflect(t){return this.sub(Br.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Vt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Br=new D,fl=new hi;class kt{constructor(t,e,n,s,r,o,a,c,l){kt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l)}set(t,e,n,s,r,o,a,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],f=n[2],p=n[5],g=n[8],x=s[0],m=s[3],d=s[6],M=s[1],v=s[4],_=s[7],w=s[2],A=s[5],R=s[8];return r[0]=o*x+a*M+c*w,r[3]=o*m+a*v+c*A,r[6]=o*d+a*_+c*R,r[1]=l*x+h*M+u*w,r[4]=l*m+h*v+u*A,r[7]=l*d+h*_+u*R,r[2]=f*x+p*M+g*w,r[5]=f*m+p*v+g*A,r[8]=f*d+p*_+g*R,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-n*r*h+n*a*c+s*r*l-s*o*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=h*o-a*l,f=a*c-h*r,p=l*r-o*c,g=e*u+n*f+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/g;return t[0]=u*x,t[1]=(s*l-h*n)*x,t[2]=(a*n-s*o)*x,t[3]=f*x,t[4]=(h*e-s*c)*x,t[5]=(s*r-a*e)*x,t[6]=p*x,t[7]=(n*c-l*e)*x,t[8]=(o*e-n*r)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-s*l,s*c,-s*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(zr.makeScale(t,e)),this}rotate(t){return this.premultiply(zr.makeRotation(-t)),this}translate(t,e){return this.premultiply(zr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const zr=new kt;function zc(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function vr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Su(){const i=vr("canvas");return i.style.display="block",i}const pl={};function xs(i){i in pl||(pl[i]=!0,console.warn(i))}function Eu(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const ml=new kt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),gl=new kt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function bu(){const i={enabled:!0,workingColorSpace:Hi,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===ie&&(s.r=Dn(s.r),s.g=Dn(s.g),s.b=Dn(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===ie&&(s.r=Fi(s.r),s.g=Fi(s.g),s.b=Fi(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Gn?_r:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return xs("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return xs("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Hi]:{primaries:t,whitePoint:n,transfer:_r,toXYZ:ml,fromXYZ:gl,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:we},outputColorSpaceConfig:{drawingBufferColorSpace:we}},[we]:{primaries:t,whitePoint:n,transfer:ie,toXYZ:ml,fromXYZ:gl,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:we}}}),i}const $t=bu();function Dn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Fi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let xi;class wu{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{xi===void 0&&(xi=vr("canvas")),xi.width=t.width,xi.height=t.height;const s=xi.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=xi}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=vr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Dn(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Dn(e[n]/255)*255):e[n]=Dn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Tu=0;class Oa{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Tu++}),this.uuid=Vi(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Hr(s[o].image)):r.push(Hr(s[o]))}else r=Hr(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function Hr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?wu.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Au=0;const kr=new D;class Ue extends fi{constructor(t=Ue.DEFAULT_IMAGE,e=Ue.DEFAULT_MAPPING,n=Vn,s=Vn,r=fn,o=li,a=ln,c=gn,l=Ue.DEFAULT_ANISOTROPY,h=Gn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Au++}),this.uuid=Vi(),this.name="",this.source=new Oa(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Q(0,0),this.repeat=new Q(1,1),this.center=new Q(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new kt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(kr).x}get height(){return this.source.getSize(kr).y}get depth(){return this.source.getSize(kr).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Rc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case gr:t.x=t.x-Math.floor(t.x);break;case Vn:t.x=t.x<0?0:1;break;case Bo:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case gr:t.y=t.y-Math.floor(t.y);break;case Vn:t.y=t.y<0?0:1;break;case Bo:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ue.DEFAULT_IMAGE=null;Ue.DEFAULT_MAPPING=Rc;Ue.DEFAULT_ANISOTROPY=1;class me{constructor(t=0,e=0,n=0,s=1){me.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,l=c[0],h=c[4],u=c[8],f=c[1],p=c[5],g=c[9],x=c[2],m=c[6],d=c[10];if(Math.abs(h-f)<.01&&Math.abs(u-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+x)<.1&&Math.abs(g+m)<.1&&Math.abs(l+p+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const v=(l+1)/2,_=(p+1)/2,w=(d+1)/2,A=(h+f)/4,R=(u+x)/4,P=(g+m)/4;return v>_&&v>w?v<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(v),s=A/n,r=R/n):_>w?_<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(_),n=A/s,r=P/s):w<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),n=R/r,s=P/r),this.set(n,s,r,e),this}let M=Math.sqrt((m-g)*(m-g)+(u-x)*(u-x)+(f-h)*(f-h));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(u-x)/M,this.z=(f-h)/M,this.w=Math.acos((l+p+d-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Vt(this.x,t.x,e.x),this.y=Vt(this.y,t.y,e.y),this.z=Vt(this.z,t.z,e.z),this.w=Vt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Vt(this.x,t,e),this.y=Vt(this.y,t,e),this.z=Vt(this.z,t,e),this.w=Vt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Vt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Ru extends fi{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:fn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new me(0,0,t,e),this.scissorTest=!1,this.viewport=new me(0,0,t,e);const s={width:t,height:e,depth:n.depth},r=new Ue(s);this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:fn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new Oa(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ui extends Ru{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Hc extends Ue{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=qe,this.minFilter=qe,this.wrapR=Vn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Cu extends Ue{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=qe,this.minFilter=qe,this.wrapR=Vn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class jn{constructor(t=new D(1/0,1/0,1/0),e=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(sn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(sn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=sn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,sn):sn.fromBufferAttribute(r,o),sn.applyMatrix4(t.matrixWorld),this.expandByPoint(sn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Us.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Us.copy(n.boundingBox)),Us.applyMatrix4(t.matrixWorld),this.union(Us)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,sn),sn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter($i),Ns.subVectors(this.max,$i),vi.subVectors(t.a,$i),yi.subVectors(t.b,$i),Mi.subVectors(t.c,$i),Un.subVectors(yi,vi),Nn.subVectors(Mi,yi),Qn.subVectors(vi,Mi);let e=[0,-Un.z,Un.y,0,-Nn.z,Nn.y,0,-Qn.z,Qn.y,Un.z,0,-Un.x,Nn.z,0,-Nn.x,Qn.z,0,-Qn.x,-Un.y,Un.x,0,-Nn.y,Nn.x,0,-Qn.y,Qn.x,0];return!Gr(e,vi,yi,Mi,Ns)||(e=[1,0,0,0,1,0,0,0,1],!Gr(e,vi,yi,Mi,Ns))?!1:(Fs.crossVectors(Un,Nn),e=[Fs.x,Fs.y,Fs.z],Gr(e,vi,yi,Mi,Ns))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,sn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(sn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(En[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),En[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),En[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),En[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),En[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),En[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),En[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),En[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(En),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const En=[new D,new D,new D,new D,new D,new D,new D,new D],sn=new D,Us=new jn,vi=new D,yi=new D,Mi=new D,Un=new D,Nn=new D,Qn=new D,$i=new D,Ns=new D,Fs=new D,ti=new D;function Gr(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){ti.fromArray(i,r);const a=s.x*Math.abs(ti.x)+s.y*Math.abs(ti.y)+s.z*Math.abs(ti.z),c=t.dot(ti),l=e.dot(ti),h=n.dot(ti);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const Pu=new jn,Qi=new D,Vr=new D;class Wi{constructor(t=new D,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Pu.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Qi.subVectors(t,this.center);const e=Qi.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Qi,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Vr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Qi.copy(t.center).add(Vr)),this.expandByPoint(Qi.copy(t.center).sub(Vr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const bn=new D,Wr=new D,Os=new D,Fn=new D,Xr=new D,Bs=new D,Yr=new D;class Rr{constructor(t=new D,e=new D(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,bn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=bn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(bn.copy(this.origin).addScaledVector(this.direction,e),bn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Wr.copy(t).add(e).multiplyScalar(.5),Os.copy(e).sub(t).normalize(),Fn.copy(this.origin).sub(Wr);const r=t.distanceTo(e)*.5,o=-this.direction.dot(Os),a=Fn.dot(this.direction),c=-Fn.dot(Os),l=Fn.lengthSq(),h=Math.abs(1-o*o);let u,f,p,g;if(h>0)if(u=o*c-a,f=o*a-c,g=r*h,u>=0)if(f>=-g)if(f<=g){const x=1/h;u*=x,f*=x,p=u*(u+o*f+2*a)+f*(o*u+f+2*c)+l}else f=r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*c)+l;else f=-r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*c)+l;else f<=-g?(u=Math.max(0,-(-o*r+a)),f=u>0?-r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+l):f<=g?(u=0,f=Math.min(Math.max(-r,-c),r),p=f*(f+2*c)+l):(u=Math.max(0,-(o*r+a)),f=u>0?r:Math.min(Math.max(-r,-c),r),p=-u*u+f*(f+2*c)+l);else f=o>0?-r:r,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Wr).addScaledVector(Os,f),p}intersectSphere(t,e){bn.subVectors(t.center,this.origin);const n=bn.dot(this.direction),s=bn.dot(bn)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return l>=0?(n=(t.min.x-f.x)*l,s=(t.max.x-f.x)*l):(n=(t.max.x-f.x)*l,s=(t.min.x-f.x)*l),h>=0?(r=(t.min.y-f.y)*h,o=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,o=(t.min.y-f.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-f.z)*u,c=(t.max.z-f.z)*u):(a=(t.max.z-f.z)*u,c=(t.min.z-f.z)*u),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,bn)!==null}intersectTriangle(t,e,n,s,r){Xr.subVectors(e,t),Bs.subVectors(n,t),Yr.crossVectors(Xr,Bs);let o=this.direction.dot(Yr),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Fn.subVectors(this.origin,t);const c=a*this.direction.dot(Bs.crossVectors(Fn,Bs));if(c<0)return null;const l=a*this.direction.dot(Xr.cross(Fn));if(l<0||c+l>o)return null;const h=-a*Fn.dot(Yr);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class oe{constructor(t,e,n,s,r,o,a,c,l,h,u,f,p,g,x,m){oe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l,h,u,f,p,g,x,m)}set(t,e,n,s,r,o,a,c,l,h,u,f,p,g,x,m){const d=this.elements;return d[0]=t,d[4]=e,d[8]=n,d[12]=s,d[1]=r,d[5]=o,d[9]=a,d[13]=c,d[2]=l,d[6]=h,d[10]=u,d[14]=f,d[3]=p,d[7]=g,d[11]=x,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new oe().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Si.setFromMatrixColumn(t,0).length(),r=1/Si.setFromMatrixColumn(t,1).length(),o=1/Si.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const f=o*h,p=o*u,g=a*h,x=a*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=p+g*l,e[5]=f-x*l,e[9]=-a*c,e[2]=x-f*l,e[6]=g+p*l,e[10]=o*c}else if(t.order==="YXZ"){const f=c*h,p=c*u,g=l*h,x=l*u;e[0]=f+x*a,e[4]=g*a-p,e[8]=o*l,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=p*a-g,e[6]=x+f*a,e[10]=o*c}else if(t.order==="ZXY"){const f=c*h,p=c*u,g=l*h,x=l*u;e[0]=f-x*a,e[4]=-o*u,e[8]=g+p*a,e[1]=p+g*a,e[5]=o*h,e[9]=x-f*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){const f=o*h,p=o*u,g=a*h,x=a*u;e[0]=c*h,e[4]=g*l-p,e[8]=f*l+x,e[1]=c*u,e[5]=x*l+f,e[9]=p*l-g,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){const f=o*c,p=o*l,g=a*c,x=a*l;e[0]=c*h,e[4]=x-f*u,e[8]=g*u+p,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=p*u+g,e[10]=f-x*u}else if(t.order==="XZY"){const f=o*c,p=o*l,g=a*c,x=a*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=f*u+x,e[5]=o*h,e[9]=p*u-g,e[2]=g*u-p,e[6]=a*h,e[10]=x*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Du,t,Lu)}lookAt(t,e,n){const s=this.elements;return We.subVectors(t,e),We.lengthSq()===0&&(We.z=1),We.normalize(),On.crossVectors(n,We),On.lengthSq()===0&&(Math.abs(n.z)===1?We.x+=1e-4:We.z+=1e-4,We.normalize(),On.crossVectors(n,We)),On.normalize(),zs.crossVectors(We,On),s[0]=On.x,s[4]=zs.x,s[8]=We.x,s[1]=On.y,s[5]=zs.y,s[9]=We.y,s[2]=On.z,s[6]=zs.z,s[10]=We.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],f=n[9],p=n[13],g=n[2],x=n[6],m=n[10],d=n[14],M=n[3],v=n[7],_=n[11],w=n[15],A=s[0],R=s[4],P=s[8],S=s[12],E=s[1],L=s[5],O=s[9],H=s[13],Y=s[2],G=s[6],X=s[10],$=s[14],V=s[3],dt=s[7],xt=s[11],Mt=s[15];return r[0]=o*A+a*E+c*Y+l*V,r[4]=o*R+a*L+c*G+l*dt,r[8]=o*P+a*O+c*X+l*xt,r[12]=o*S+a*H+c*$+l*Mt,r[1]=h*A+u*E+f*Y+p*V,r[5]=h*R+u*L+f*G+p*dt,r[9]=h*P+u*O+f*X+p*xt,r[13]=h*S+u*H+f*$+p*Mt,r[2]=g*A+x*E+m*Y+d*V,r[6]=g*R+x*L+m*G+d*dt,r[10]=g*P+x*O+m*X+d*xt,r[14]=g*S+x*H+m*$+d*Mt,r[3]=M*A+v*E+_*Y+w*V,r[7]=M*R+v*L+_*G+w*dt,r[11]=M*P+v*O+_*X+w*xt,r[15]=M*S+v*H+_*$+w*Mt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],u=t[6],f=t[10],p=t[14],g=t[3],x=t[7],m=t[11],d=t[15];return g*(+r*c*u-s*l*u-r*a*f+n*l*f+s*a*p-n*c*p)+x*(+e*c*p-e*l*f+r*o*f-s*o*p+s*l*h-r*c*h)+m*(+e*l*u-e*a*p-r*o*u+n*o*p+r*a*h-n*l*h)+d*(-s*a*h-e*c*u+e*a*f+s*o*u-n*o*f+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=t[9],f=t[10],p=t[11],g=t[12],x=t[13],m=t[14],d=t[15],M=u*m*l-x*f*l+x*c*p-a*m*p-u*c*d+a*f*d,v=g*f*l-h*m*l-g*c*p+o*m*p+h*c*d-o*f*d,_=h*x*l-g*u*l+g*a*p-o*x*p-h*a*d+o*u*d,w=g*u*c-h*x*c-g*a*f+o*x*f+h*a*m-o*u*m,A=e*M+n*v+s*_+r*w;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/A;return t[0]=M*R,t[1]=(x*f*r-u*m*r-x*s*p+n*m*p+u*s*d-n*f*d)*R,t[2]=(a*m*r-x*c*r+x*s*l-n*m*l-a*s*d+n*c*d)*R,t[3]=(u*c*r-a*f*r-u*s*l+n*f*l+a*s*p-n*c*p)*R,t[4]=v*R,t[5]=(h*m*r-g*f*r+g*s*p-e*m*p-h*s*d+e*f*d)*R,t[6]=(g*c*r-o*m*r-g*s*l+e*m*l+o*s*d-e*c*d)*R,t[7]=(o*f*r-h*c*r+h*s*l-e*f*l-o*s*p+e*c*p)*R,t[8]=_*R,t[9]=(g*u*r-h*x*r-g*n*p+e*x*p+h*n*d-e*u*d)*R,t[10]=(o*x*r-g*a*r+g*n*l-e*x*l-o*n*d+e*a*d)*R,t[11]=(h*a*r-o*u*r-h*n*l+e*u*l+o*n*p-e*a*p)*R,t[12]=w*R,t[13]=(h*x*s-g*u*s+g*n*f-e*x*f-h*n*m+e*u*m)*R,t[14]=(g*a*s-o*x*s-g*n*c+e*x*c+o*n*m-e*a*m)*R,t[15]=(o*u*s-h*a*s+h*n*c-e*u*c-o*n*f+e*a*f)*R,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,h=o+o,u=a+a,f=r*l,p=r*h,g=r*u,x=o*h,m=o*u,d=a*u,M=c*l,v=c*h,_=c*u,w=n.x,A=n.y,R=n.z;return s[0]=(1-(x+d))*w,s[1]=(p+_)*w,s[2]=(g-v)*w,s[3]=0,s[4]=(p-_)*A,s[5]=(1-(f+d))*A,s[6]=(m+M)*A,s[7]=0,s[8]=(g+v)*R,s[9]=(m-M)*R,s[10]=(1-(f+x))*R,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Si.set(s[0],s[1],s[2]).length();const o=Si.set(s[4],s[5],s[6]).length(),a=Si.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],rn.copy(this);const l=1/r,h=1/o,u=1/a;return rn.elements[0]*=l,rn.elements[1]*=l,rn.elements[2]*=l,rn.elements[4]*=h,rn.elements[5]*=h,rn.elements[6]*=h,rn.elements[8]*=u,rn.elements[9]*=u,rn.elements[10]*=u,e.setFromRotationMatrix(rn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=mn,c=!1){const l=this.elements,h=2*r/(e-t),u=2*r/(n-s),f=(e+t)/(e-t),p=(n+s)/(n-s);let g,x;if(c)g=r/(o-r),x=o*r/(o-r);else if(a===mn)g=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===xr)g=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=mn,c=!1){const l=this.elements,h=2/(e-t),u=2/(n-s),f=-(e+t)/(e-t),p=-(n+s)/(n-s);let g,x;if(c)g=1/(o-r),x=o/(o-r);else if(a===mn)g=-2/(o-r),x=-(o+r)/(o-r);else if(a===xr)g=-1/(o-r),x=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=u,l[9]=0,l[13]=p,l[2]=0,l[6]=0,l[10]=g,l[14]=x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Si=new D,rn=new oe,Du=new D(0,0,0),Lu=new D(1,1,1),On=new D,zs=new D,We=new D,_l=new oe,xl=new hi;class _n{constructor(t=0,e=0,n=0,s=_n.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],u=s[2],f=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(Vt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Vt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Vt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Vt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Vt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Vt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return _l.makeRotationFromQuaternion(t),this.setFromRotationMatrix(_l,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return xl.setFromEuler(this),this.setFromQuaternion(xl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}_n.DEFAULT_ORDER="XYZ";class Ba{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Iu=0;const vl=new D,Ei=new hi,wn=new oe,Hs=new D,ts=new D,Uu=new D,Nu=new hi,yl=new D(1,0,0),Ml=new D(0,1,0),Sl=new D(0,0,1),El={type:"added"},Fu={type:"removed"},bi={type:"childadded",child:null},Zr={type:"childremoved",child:null};class xe extends fi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Iu++}),this.uuid=Vi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=xe.DEFAULT_UP.clone();const t=new D,e=new _n,n=new hi,s=new D(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new oe},normalMatrix:{value:new kt}}),this.matrix=new oe,this.matrixWorld=new oe,this.matrixAutoUpdate=xe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=xe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ba,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ei.setFromAxisAngle(t,e),this.quaternion.multiply(Ei),this}rotateOnWorldAxis(t,e){return Ei.setFromAxisAngle(t,e),this.quaternion.premultiply(Ei),this}rotateX(t){return this.rotateOnAxis(yl,t)}rotateY(t){return this.rotateOnAxis(Ml,t)}rotateZ(t){return this.rotateOnAxis(Sl,t)}translateOnAxis(t,e){return vl.copy(t).applyQuaternion(this.quaternion),this.position.add(vl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(yl,t)}translateY(t){return this.translateOnAxis(Ml,t)}translateZ(t){return this.translateOnAxis(Sl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(wn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Hs.copy(t):Hs.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),ts.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?wn.lookAt(ts,Hs,this.up):wn.lookAt(Hs,ts,this.up),this.quaternion.setFromRotationMatrix(wn),s&&(wn.extractRotation(s.matrixWorld),Ei.setFromRotationMatrix(wn),this.quaternion.premultiply(Ei.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(El),bi.child=t,this.dispatchEvent(bi),bi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Fu),Zr.child=t,this.dispatchEvent(Zr),Zr.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),wn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),wn.multiply(t.parent.matrixWorld)),t.applyMatrix4(wn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(El),bi.child=t,this.dispatchEvent(bi),bi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ts,t,Uu),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ts,Nu,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){const a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),u=o(t.shapes),f=o(t.skeletons),p=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}xe.DEFAULT_UP=new D(0,1,0);xe.DEFAULT_MATRIX_AUTO_UPDATE=!0;xe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const on=new D,Tn=new D,qr=new D,An=new D,wi=new D,Ti=new D,bl=new D,jr=new D,Kr=new D,Jr=new D,$r=new me,Qr=new me,to=new me;class an{constructor(t=new D,e=new D,n=new D){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),on.subVectors(t,e),s.cross(on);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){on.subVectors(s,e),Tn.subVectors(n,e),qr.subVectors(t,e);const o=on.dot(on),a=on.dot(Tn),c=on.dot(qr),l=Tn.dot(Tn),h=Tn.dot(qr),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;const f=1/u,p=(l*c-a*h)*f,g=(o*h-a*c)*f;return r.set(1-p-g,g,p)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,An)===null?!1:An.x>=0&&An.y>=0&&An.x+An.y<=1}static getInterpolation(t,e,n,s,r,o,a,c){return this.getBarycoord(t,e,n,s,An)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,An.x),c.addScaledVector(o,An.y),c.addScaledVector(a,An.z),c)}static getInterpolatedAttribute(t,e,n,s,r,o){return $r.setScalar(0),Qr.setScalar(0),to.setScalar(0),$r.fromBufferAttribute(t,e),Qr.fromBufferAttribute(t,n),to.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector($r,r.x),o.addScaledVector(Qr,r.y),o.addScaledVector(to,r.z),o}static isFrontFacing(t,e,n,s){return on.subVectors(n,e),Tn.subVectors(t,e),on.cross(Tn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return on.subVectors(this.c,this.b),Tn.subVectors(this.a,this.b),on.cross(Tn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return an.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return an.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return an.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return an.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return an.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;wi.subVectors(s,n),Ti.subVectors(r,n),jr.subVectors(t,n);const c=wi.dot(jr),l=Ti.dot(jr);if(c<=0&&l<=0)return e.copy(n);Kr.subVectors(t,s);const h=wi.dot(Kr),u=Ti.dot(Kr);if(h>=0&&u<=h)return e.copy(s);const f=c*u-h*l;if(f<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(n).addScaledVector(wi,o);Jr.subVectors(t,r);const p=wi.dot(Jr),g=Ti.dot(Jr);if(g>=0&&p<=g)return e.copy(r);const x=p*l-c*g;if(x<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(n).addScaledVector(Ti,a);const m=h*g-p*u;if(m<=0&&u-h>=0&&p-g>=0)return bl.subVectors(r,s),a=(u-h)/(u-h+(p-g)),e.copy(s).addScaledVector(bl,a);const d=1/(m+x+f);return o=x*d,a=f*d,e.copy(n).addScaledVector(wi,o).addScaledVector(Ti,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const kc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Bn={h:0,s:0,l:0},ks={h:0,s:0,l:0};function eo(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Wt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=we){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,$t.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=$t.workingColorSpace){return this.r=t,this.g=e,this.b=n,$t.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=$t.workingColorSpace){if(t=yu(t,1),e=Vt(e,0,1),n=Vt(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=eo(o,r,t+1/3),this.g=eo(o,r,t),this.b=eo(o,r,t-1/3)}return $t.colorSpaceToWorking(this,s),this}setStyle(t,e=we){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=we){const n=kc[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Dn(t.r),this.g=Dn(t.g),this.b=Dn(t.b),this}copyLinearToSRGB(t){return this.r=Fi(t.r),this.g=Fi(t.g),this.b=Fi(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=we){return $t.workingToColorSpace(Pe.copy(this),t),Math.round(Vt(Pe.r*255,0,255))*65536+Math.round(Vt(Pe.g*255,0,255))*256+Math.round(Vt(Pe.b*255,0,255))}getHexString(t=we){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=$t.workingColorSpace){$t.workingToColorSpace(Pe.copy(this),e);const n=Pe.r,s=Pe.g,r=Pe.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let c,l;const h=(a+o)/2;if(a===o)c=0,l=0;else{const u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=$t.workingColorSpace){return $t.workingToColorSpace(Pe.copy(this),e),t.r=Pe.r,t.g=Pe.g,t.b=Pe.b,t}getStyle(t=we){$t.workingToColorSpace(Pe.copy(this),t);const e=Pe.r,n=Pe.g,s=Pe.b;return t!==we?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Bn),this.setHSL(Bn.h+t,Bn.s+e,Bn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Bn),t.getHSL(ks);const n=Or(Bn.h,ks.h,e),s=Or(Bn.s,ks.s,e),r=Or(Bn.l,ks.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Pe=new Wt;Wt.NAMES=kc;let Ou=0;class Xi extends fi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ou++}),this.uuid=Vi(),this.name="",this.type="Material",this.blending=Ni,this.side=Zn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ao,this.blendDst=Ro,this.blendEquation=oi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Wt(0,0,0),this.blendAlpha=0,this.depthFunc=Oi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=hl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=_i,this.stencilZFail=_i,this.stencilZPass=_i,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ni&&(n.blending=this.blending),this.side!==Zn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ao&&(n.blendSrc=this.blendSrc),this.blendDst!==Ro&&(n.blendDst=this.blendDst),this.blendEquation!==oi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Oi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==hl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==_i&&(n.stencilFail=this.stencilFail),this.stencilZFail!==_i&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==_i&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class bs extends Xi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Wt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _n,this.combine=Tc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const _e=new D,Gs=new Q;let Bu=0;class nn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Bu++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=ul,this.updateRanges=[],this.gpuType=pn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Gs.fromBufferAttribute(this,e),Gs.applyMatrix3(t),this.setXY(e,Gs.x,Gs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)_e.fromBufferAttribute(this,e),_e.applyMatrix3(t),this.setXYZ(e,_e.x,_e.y,_e.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)_e.fromBufferAttribute(this,e),_e.applyMatrix4(t),this.setXYZ(e,_e.x,_e.y,_e.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)_e.fromBufferAttribute(this,e),_e.applyNormalMatrix(t),this.setXYZ(e,_e.x,_e.y,_e.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)_e.fromBufferAttribute(this,e),_e.transformDirection(t),this.setXYZ(e,_e.x,_e.y,_e.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Ji(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ze(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ji(e,this.array)),e}setX(t,e){return this.normalized&&(e=ze(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ji(e,this.array)),e}setY(t,e){return this.normalized&&(e=ze(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ji(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ze(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ji(e,this.array)),e}setW(t,e){return this.normalized&&(e=ze(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ze(e,this.array),n=ze(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=ze(e,this.array),n=ze(n,this.array),s=ze(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=ze(e,this.array),n=ze(n,this.array),s=ze(s,this.array),r=ze(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==ul&&(t.usage=this.usage),t}}class Gc extends nn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Vc extends nn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Qt extends nn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let zu=0;const Je=new oe,no=new xe,Ai=new D,Xe=new jn,es=new jn,be=new D;class Ee extends fi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:zu++}),this.uuid=Vi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(zc(t)?Vc:Gc)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new kt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Je.makeRotationFromQuaternion(t),this.applyMatrix4(Je),this}rotateX(t){return Je.makeRotationX(t),this.applyMatrix4(Je),this}rotateY(t){return Je.makeRotationY(t),this.applyMatrix4(Je),this}rotateZ(t){return Je.makeRotationZ(t),this.applyMatrix4(Je),this}translate(t,e,n){return Je.makeTranslation(t,e,n),this.applyMatrix4(Je),this}scale(t,e,n){return Je.makeScale(t,e,n),this.applyMatrix4(Je),this}lookAt(t){return no.lookAt(t),no.updateMatrix(),this.applyMatrix4(no.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ai).negate(),this.translate(Ai.x,Ai.y,Ai.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Qt(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new jn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];Xe.setFromBufferAttribute(r),this.morphTargetsRelative?(be.addVectors(this.boundingBox.min,Xe.min),this.boundingBox.expandByPoint(be),be.addVectors(this.boundingBox.max,Xe.max),this.boundingBox.expandByPoint(be)):(this.boundingBox.expandByPoint(Xe.min),this.boundingBox.expandByPoint(Xe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Wi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(t){const n=this.boundingSphere.center;if(Xe.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];es.setFromBufferAttribute(a),this.morphTargetsRelative?(be.addVectors(Xe.min,es.min),Xe.expandByPoint(be),be.addVectors(Xe.max,es.max),Xe.expandByPoint(be)):(Xe.expandByPoint(es.min),Xe.expandByPoint(es.max))}Xe.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)be.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(be));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)be.fromBufferAttribute(a,l),c&&(Ai.fromBufferAttribute(t,l),be.add(Ai)),s=Math.max(s,n.distanceToSquared(be))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new nn(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let P=0;P<n.count;P++)a[P]=new D,c[P]=new D;const l=new D,h=new D,u=new D,f=new Q,p=new Q,g=new Q,x=new D,m=new D;function d(P,S,E){l.fromBufferAttribute(n,P),h.fromBufferAttribute(n,S),u.fromBufferAttribute(n,E),f.fromBufferAttribute(r,P),p.fromBufferAttribute(r,S),g.fromBufferAttribute(r,E),h.sub(l),u.sub(l),p.sub(f),g.sub(f);const L=1/(p.x*g.y-g.x*p.y);isFinite(L)&&(x.copy(h).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(L),m.copy(u).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(L),a[P].add(x),a[S].add(x),a[E].add(x),c[P].add(m),c[S].add(m),c[E].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:t.count}]);for(let P=0,S=M.length;P<S;++P){const E=M[P],L=E.start,O=E.count;for(let H=L,Y=L+O;H<Y;H+=3)d(t.getX(H+0),t.getX(H+1),t.getX(H+2))}const v=new D,_=new D,w=new D,A=new D;function R(P){w.fromBufferAttribute(s,P),A.copy(w);const S=a[P];v.copy(S),v.sub(w.multiplyScalar(w.dot(S))).normalize(),_.crossVectors(A,S);const L=_.dot(c[P])<0?-1:1;o.setXYZW(P,v.x,v.y,v.z,L)}for(let P=0,S=M.length;P<S;++P){const E=M[P],L=E.start,O=E.count;for(let H=L,Y=L+O;H<Y;H+=3)R(t.getX(H+0)),R(t.getX(H+1)),R(t.getX(H+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new nn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,p=n.count;f<p;f++)n.setXYZ(f,0,0,0);const s=new D,r=new D,o=new D,a=new D,c=new D,l=new D,h=new D,u=new D;if(t)for(let f=0,p=t.count;f<p;f+=3){const g=t.getX(f+0),x=t.getX(f+1),m=t.getX(f+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,x),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,m),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let f=0,p=e.count;f<p;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)be.fromBufferAttribute(t,e),be.normalize(),t.setXYZ(e,be.x,be.y,be.z)}toNonIndexed(){function t(a,c){const l=a.array,h=a.itemSize,u=a.normalized,f=new l.constructor(c.length*h);let p=0,g=0;for(let x=0,m=c.length;x<m;x++){a.isInterleavedBufferAttribute?p=c[x]*a.data.stride+a.offset:p=c[x]*h;for(let d=0;d<h;d++)f[g++]=l[p++]}return new nn(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ee,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=t(c,n);e.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){const f=l[h],p=t(f,n);c.push(p)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,f=l.length;u<f;u++){const p=l[u];h.push(p.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const r=t.morphAttributes;for(const l in r){const h=[],u=r[l];for(let f=0,p=u.length;f<p;f++)h.push(u[f].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,h=o.length;l<h;l++){const u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const wl=new oe,ei=new Rr,Vs=new Wi,Tl=new D,Ws=new D,Xs=new D,Ys=new D,io=new D,Zs=new D,Al=new D,qs=new D;class qt extends xe{constructor(t=new Ee,e=new bs){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){Zs.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=a[c],u=r[c];h!==0&&(io.fromBufferAttribute(u,t),o?Zs.addScaledVector(io,h):Zs.addScaledVector(io.sub(e),h))}e.add(Zs)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Vs.copy(n.boundingSphere),Vs.applyMatrix4(r),ei.copy(t.ray).recast(t.near),!(Vs.containsPoint(ei.origin)===!1&&(ei.intersectSphere(Vs,Tl)===null||ei.origin.distanceToSquared(Tl)>(t.far-t.near)**2))&&(wl.copy(r).invert(),ei.copy(t.ray).applyMatrix4(wl),!(n.boundingBox!==null&&ei.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ei)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,x=f.length;g<x;g++){const m=f[g],d=o[m.materialIndex],M=Math.max(m.start,p.start),v=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let _=M,w=v;_<w;_+=3){const A=a.getX(_),R=a.getX(_+1),P=a.getX(_+2);s=js(this,d,t,n,l,h,u,A,R,P),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),x=Math.min(a.count,p.start+p.count);for(let m=g,d=x;m<d;m+=3){const M=a.getX(m),v=a.getX(m+1),_=a.getX(m+2);s=js(this,o,t,n,l,h,u,M,v,_),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,x=f.length;g<x;g++){const m=f[g],d=o[m.materialIndex],M=Math.max(m.start,p.start),v=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let _=M,w=v;_<w;_+=3){const A=_,R=_+1,P=_+2;s=js(this,d,t,n,l,h,u,A,R,P),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),x=Math.min(c.count,p.start+p.count);for(let m=g,d=x;m<d;m+=3){const M=m,v=m+1,_=m+2;s=js(this,o,t,n,l,h,u,M,v,_),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Hu(i,t,e,n,s,r,o,a){let c;if(t.side===Ie?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,t.side===Zn,a),c===null)return null;qs.copy(a),qs.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(qs);return l<e.near||l>e.far?null:{distance:l,point:qs.clone(),object:i}}function js(i,t,e,n,s,r,o,a,c,l){i.getVertexPosition(a,Ws),i.getVertexPosition(c,Xs),i.getVertexPosition(l,Ys);const h=Hu(i,t,e,n,Ws,Xs,Ys,Al);if(h){const u=new D;an.getBarycoord(Al,Ws,Xs,Ys,u),s&&(h.uv=an.getInterpolatedAttribute(s,a,c,l,u,new Q)),r&&(h.uv1=an.getInterpolatedAttribute(r,a,c,l,u,new Q)),o&&(h.normal=an.getInterpolatedAttribute(o,a,c,l,u,new D),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a,b:c,c:l,normal:new D,materialIndex:0};an.getNormal(Ws,Xs,Ys,f.normal),h.face=f,h.barycoord=u}return h}class Kn extends Ee{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],h=[],u=[];let f=0,p=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new Qt(l,3)),this.setAttribute("normal",new Qt(h,3)),this.setAttribute("uv",new Qt(u,2));function g(x,m,d,M,v,_,w,A,R,P,S){const E=_/R,L=w/P,O=_/2,H=w/2,Y=A/2,G=R+1,X=P+1;let $=0,V=0;const dt=new D;for(let xt=0;xt<X;xt++){const Mt=xt*L-H;for(let zt=0;zt<G;zt++){const jt=zt*E-O;dt[x]=jt*M,dt[m]=Mt*v,dt[d]=Y,l.push(dt.x,dt.y,dt.z),dt[x]=0,dt[m]=0,dt[d]=A>0?1:-1,h.push(dt.x,dt.y,dt.z),u.push(zt/R),u.push(1-xt/P),$+=1}}for(let xt=0;xt<P;xt++)for(let Mt=0;Mt<R;Mt++){const zt=f+Mt+G*xt,jt=f+Mt+G*(xt+1),ee=f+(Mt+1)+G*(xt+1),Kt=f+(Mt+1)+G*xt;c.push(zt,jt,Kt),c.push(jt,ee,Kt),V+=6}a.addGroup(p,V,S),p+=V,f+=$}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Kn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ki(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Fe(i){const t={};for(let e=0;e<i.length;e++){const n=ki(i[e]);for(const s in n)t[s]=n[s]}return t}function ku(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Wc(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:$t.workingColorSpace}const Gu={clone:ki,merge:Fe};var Vu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Wu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class qn extends Xi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Vu,this.fragmentShader=Wu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ki(t.uniforms),this.uniformsGroups=ku(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Xc extends xe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new oe,this.projectionMatrix=new oe,this.projectionMatrixInverse=new oe,this.coordinateSystem=mn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const zn=new D,Rl=new Q,Cl=new Q;class Qe extends Xc{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=fa*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(us*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return fa*2*Math.atan(Math.tan(us*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){zn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(zn.x,zn.y).multiplyScalar(-t/zn.z),zn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(zn.x,zn.y).multiplyScalar(-t/zn.z)}getViewSize(t,e){return this.getViewBounds(t,Rl,Cl),e.subVectors(Cl,Rl)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(us*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ri=-90,Ci=1;class Xu extends xe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Qe(Ri,Ci,t,e);s.layers=this.layers,this.add(s);const r=new Qe(Ri,Ci,t,e);r.layers=this.layers,this.add(r);const o=new Qe(Ri,Ci,t,e);o.layers=this.layers,this.add(o);const a=new Qe(Ri,Ci,t,e);a.layers=this.layers,this.add(a);const c=new Qe(Ri,Ci,t,e);c.layers=this.layers,this.add(c);const l=new Qe(Ri,Ci,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,c]=e;for(const l of e)this.remove(l);if(t===mn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===xr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,f,p),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Yc extends Ue{constructor(t=[],e=Bi,n,s,r,o,a,c,l,h){super(t,e,n,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Yu extends ui{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Yc(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Kn(5,5,5),r=new qn({name:"CubemapFromEquirect",uniforms:ki(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ie,blending:Wn});r.uniforms.tEquirect.value=e;const o=new qt(s,r),a=e.minFilter;return e.minFilter===li&&(e.minFilter=fn),new Xu(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}class cn extends xe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Zu={type:"move"};class so{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new cn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new cn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new cn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const x of t.hand.values()){const m=e.getJointPose(x,n),d=this._getHandJoint(l,x);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],f=h.position.distanceTo(u.position),p=.02,g=.005;l.inputState.pinching&&f>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Zu)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new cn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Cr{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Wt(t),this.near=e,this.far=n}clone(){return new Cr(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Zc extends xe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new _n,this.environmentIntensity=1,this.environmentRotation=new _n,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class qu extends Ue{constructor(t=null,e=1,n=1,s,r,o,a,c,l=qe,h=qe,u,f){super(null,o,a,c,l,h,s,r,u,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Pl extends nn{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Pi=new oe,Dl=new oe,Ks=[],Ll=new jn,ju=new oe,ns=new qt,is=new Wi;class pa extends qt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Pl(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,ju)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new jn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Pi),Ll.copy(t.boundingBox).applyMatrix4(Pi),this.boundingBox.union(Ll)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Wi),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Pi),is.copy(t.boundingSphere).applyMatrix4(Pi),this.boundingSphere.union(is)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(ns.geometry=this.geometry,ns.material=this.material,ns.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),is.copy(this.boundingSphere),is.applyMatrix4(n),t.ray.intersectsSphere(is)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Pi),Dl.multiplyMatrices(n,Pi),ns.matrixWorld=Dl,ns.raycast(t,Ks);for(let o=0,a=Ks.length;o<a;o++){const c=Ks[o];c.instanceId=r,c.object=this,e.push(c)}Ks.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Pl(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new qu(new Float32Array(s*this.count),s,this.count,Ia,pn));const r=this.morphTexture.source.data.data;let o=0;for(let l=0;l<n.length;l++)o+=n[l];const a=this.geometry.morphTargetsRelative?1:1-o,c=s*t;r[c]=a,r.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const ro=new D,Ku=new D,Ju=new kt;class Hn{constructor(t=new D(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=ro.subVectors(n,e).cross(Ku.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(ro),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Ju.getNormalMatrix(t),s=this.coplanarPoint(ro).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ni=new Wi,$u=new Q(.5,.5),Js=new D;class za{constructor(t=new Hn,e=new Hn,n=new Hn,s=new Hn,r=new Hn,o=new Hn){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=mn,n=!1){const s=this.planes,r=t.elements,o=r[0],a=r[1],c=r[2],l=r[3],h=r[4],u=r[5],f=r[6],p=r[7],g=r[8],x=r[9],m=r[10],d=r[11],M=r[12],v=r[13],_=r[14],w=r[15];if(s[0].setComponents(l-o,p-h,d-g,w-M).normalize(),s[1].setComponents(l+o,p+h,d+g,w+M).normalize(),s[2].setComponents(l+a,p+u,d+x,w+v).normalize(),s[3].setComponents(l-a,p-u,d-x,w-v).normalize(),n)s[4].setComponents(c,f,m,_).normalize(),s[5].setComponents(l-c,p-f,d-m,w-_).normalize();else if(s[4].setComponents(l-c,p-f,d-m,w-_).normalize(),e===mn)s[5].setComponents(l+c,p+f,d+m,w+_).normalize();else if(e===xr)s[5].setComponents(c,f,m,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ni.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ni.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ni)}intersectsSprite(t){ni.center.set(0,0,0);const e=$u.distanceTo(t.center);return ni.radius=.7071067811865476+e,ni.applyMatrix4(t.matrixWorld),this.intersectsSphere(ni)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Js.x=s.normal.x>0?t.max.x:t.min.x,Js.y=s.normal.y>0?t.max.y:t.min.y,Js.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Js)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class qc extends Xi{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Wt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const yr=new D,Mr=new D,Il=new oe,ss=new Rr,$s=new Wi,oo=new D,Ul=new D;class Qu extends xe{constructor(t=new Ee,e=new qc){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)yr.fromBufferAttribute(e,s-1),Mr.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=yr.distanceTo(Mr);t.setAttribute("lineDistance",new Qt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),$s.copy(n.boundingSphere),$s.applyMatrix4(s),$s.radius+=r,t.ray.intersectsSphere($s)===!1)return;Il.copy(s).invert(),ss.copy(t.ray).applyMatrix4(Il);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){const p=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let x=p,m=g-1;x<m;x+=l){const d=h.getX(x),M=h.getX(x+1),v=Qs(this,t,ss,c,d,M,x);v&&e.push(v)}if(this.isLineLoop){const x=h.getX(g-1),m=h.getX(p),d=Qs(this,t,ss,c,x,m,g-1);d&&e.push(d)}}else{const p=Math.max(0,o.start),g=Math.min(f.count,o.start+o.count);for(let x=p,m=g-1;x<m;x+=l){const d=Qs(this,t,ss,c,x,x+1,x);d&&e.push(d)}if(this.isLineLoop){const x=Qs(this,t,ss,c,g-1,p,g-1);x&&e.push(x)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Qs(i,t,e,n,s,r,o){const a=i.geometry.attributes.position;if(yr.fromBufferAttribute(a,s),Mr.fromBufferAttribute(a,r),e.distanceSqToSegment(yr,Mr,oo,Ul)>n)return;oo.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(oo);if(!(l<t.near||l>t.far))return{distance:l,point:Ul.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}class ws extends Ue{constructor(t,e,n,s,r,o,a,c,l){super(t,e,n,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class jc extends Ue{constructor(t,e,n=ci,s,r,o,a=qe,c=qe,l,h=gs,u=1){if(h!==gs&&h!==_s)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:t,height:e,depth:u};super(f,s,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Oa(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Kc extends Ue{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Ha extends Ee{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],o=[],a=[],c=[],l=new D,h=new Q;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let u=0,f=3;u<=e;u++,f+=3){const p=n+u/e*s;l.x=t*Math.cos(p),l.y=t*Math.sin(p),o.push(l.x,l.y,l.z),a.push(0,0,1),h.x=(o[f]/t+1)/2,h.y=(o[f+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Qt(o,3)),this.setAttribute("normal",new Qt(a,3)),this.setAttribute("uv",new Qt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ha(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Ts extends Ee{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],f=[],p=[];let g=0;const x=[],m=n/2;let d=0;M(),o===!1&&(t>0&&v(!0),e>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new Qt(u,3)),this.setAttribute("normal",new Qt(f,3)),this.setAttribute("uv",new Qt(p,2));function M(){const _=new D,w=new D;let A=0;const R=(e-t)/n;for(let P=0;P<=r;P++){const S=[],E=P/r,L=E*(e-t)+t;for(let O=0;O<=s;O++){const H=O/s,Y=H*c+a,G=Math.sin(Y),X=Math.cos(Y);w.x=L*G,w.y=-E*n+m,w.z=L*X,u.push(w.x,w.y,w.z),_.set(G,R,X).normalize(),f.push(_.x,_.y,_.z),p.push(H,1-E),S.push(g++)}x.push(S)}for(let P=0;P<s;P++)for(let S=0;S<r;S++){const E=x[S][P],L=x[S+1][P],O=x[S+1][P+1],H=x[S][P+1];(t>0||S!==0)&&(h.push(E,L,H),A+=3),(e>0||S!==r-1)&&(h.push(L,O,H),A+=3)}l.addGroup(d,A,0),d+=A}function v(_){const w=g,A=new Q,R=new D;let P=0;const S=_===!0?t:e,E=_===!0?1:-1;for(let O=1;O<=s;O++)u.push(0,m*E,0),f.push(0,E,0),p.push(.5,.5),g++;const L=g;for(let O=0;O<=s;O++){const Y=O/s*c+a,G=Math.cos(Y),X=Math.sin(Y);R.x=S*X,R.y=m*E,R.z=S*G,u.push(R.x,R.y,R.z),f.push(0,E,0),A.x=G*.5+.5,A.y=X*.5*E+.5,p.push(A.x,A.y),g++}for(let O=0;O<s;O++){const H=w+O,Y=L+O;_===!0?h.push(Y,Y+1,H):h.push(Y+1,Y,H),P+=3}l.addGroup(d,P,_===!0?1:2),d+=P}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ts(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ka extends Ee{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],o=[];a(s),l(n),h(),this.setAttribute("position",new Qt(r,3)),this.setAttribute("normal",new Qt(r.slice(),3)),this.setAttribute("uv",new Qt(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(M){const v=new D,_=new D,w=new D;for(let A=0;A<e.length;A+=3)p(e[A+0],v),p(e[A+1],_),p(e[A+2],w),c(v,_,w,M)}function c(M,v,_,w){const A=w+1,R=[];for(let P=0;P<=A;P++){R[P]=[];const S=M.clone().lerp(_,P/A),E=v.clone().lerp(_,P/A),L=A-P;for(let O=0;O<=L;O++)O===0&&P===A?R[P][O]=S:R[P][O]=S.clone().lerp(E,O/L)}for(let P=0;P<A;P++)for(let S=0;S<2*(A-P)-1;S++){const E=Math.floor(S/2);S%2===0?(f(R[P][E+1]),f(R[P+1][E]),f(R[P][E])):(f(R[P][E+1]),f(R[P+1][E+1]),f(R[P+1][E]))}}function l(M){const v=new D;for(let _=0;_<r.length;_+=3)v.x=r[_+0],v.y=r[_+1],v.z=r[_+2],v.normalize().multiplyScalar(M),r[_+0]=v.x,r[_+1]=v.y,r[_+2]=v.z}function h(){const M=new D;for(let v=0;v<r.length;v+=3){M.x=r[v+0],M.y=r[v+1],M.z=r[v+2];const _=m(M)/2/Math.PI+.5,w=d(M)/Math.PI+.5;o.push(_,1-w)}g(),u()}function u(){for(let M=0;M<o.length;M+=6){const v=o[M+0],_=o[M+2],w=o[M+4],A=Math.max(v,_,w),R=Math.min(v,_,w);A>.9&&R<.1&&(v<.2&&(o[M+0]+=1),_<.2&&(o[M+2]+=1),w<.2&&(o[M+4]+=1))}}function f(M){r.push(M.x,M.y,M.z)}function p(M,v){const _=M*3;v.x=t[_+0],v.y=t[_+1],v.z=t[_+2]}function g(){const M=new D,v=new D,_=new D,w=new D,A=new Q,R=new Q,P=new Q;for(let S=0,E=0;S<r.length;S+=9,E+=6){M.set(r[S+0],r[S+1],r[S+2]),v.set(r[S+3],r[S+4],r[S+5]),_.set(r[S+6],r[S+7],r[S+8]),A.set(o[E+0],o[E+1]),R.set(o[E+2],o[E+3]),P.set(o[E+4],o[E+5]),w.copy(M).add(v).add(_).divideScalar(3);const L=m(w);x(A,E+0,M,L),x(R,E+2,v,L),x(P,E+4,_,L)}}function x(M,v,_,w){w<0&&M.x===1&&(o[v]=M.x-1),_.x===0&&_.z===0&&(o[v]=w/2/Math.PI+.5)}function m(M){return Math.atan2(M.z,-M.x)}function d(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ka(t.vertices,t.indices,t.radius,t.details)}}class yn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let s=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===o)return s/(r-1);const h=n[s],f=n[s+1]-h,p=(o-h)/f;return(s+p)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),c=e||(o.isVector2?new Q:new D);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new D,s=[],r=[],o=[],a=new D,c=new oe;for(let p=0;p<=t;p++){const g=p/t;s[p]=this.getTangentAt(g,new D)}r[0]=new D,o[0]=new D;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),f<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let p=1;p<=t;p++){if(r[p]=r[p-1].clone(),o[p]=o[p-1].clone(),a.crossVectors(s[p-1],s[p]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(Vt(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(c.makeRotationAxis(a,g))}o[p].crossVectors(s[p],r[p])}if(e===!0){let p=Math.acos(Vt(r[0].dot(r[t]),-1,1));p/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(p=-p);for(let g=1;g<=t;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],p*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Ga extends yn{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e=new Q){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=c-this.aX,p=l-this.aY;c=f*h-p*u+this.aX,l=f*u+p*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class td extends Ga{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Va(){let i=0,t=0,e=0,n=0;function s(r,o,a,c){i=r,t=a,e=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,u){let f=(o-r)/l-(a-r)/(l+h)+(a-o)/h,p=(a-o)/h-(c-o)/(h+u)+(c-a)/u;f*=h,p*=h,s(o,a,f,p)},calc:function(r){const o=r*r,a=o*r;return i+t*r+e*o+n*a}}}const tr=new D,ao=new Va,lo=new Va,co=new Va;class ed extends yn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new D){const n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=s[(a-1)%r]:(tr.subVectors(s[0],s[1]).add(s[0]),l=tr);const u=s[a%r],f=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(tr.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=tr),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),p),x=Math.pow(u.distanceToSquared(f),p),m=Math.pow(f.distanceToSquared(h),p);x<1e-4&&(x=1),g<1e-4&&(g=x),m<1e-4&&(m=x),ao.initNonuniformCatmullRom(l.x,u.x,f.x,h.x,g,x,m),lo.initNonuniformCatmullRom(l.y,u.y,f.y,h.y,g,x,m),co.initNonuniformCatmullRom(l.z,u.z,f.z,h.z,g,x,m)}else this.curveType==="catmullrom"&&(ao.initCatmullRom(l.x,u.x,f.x,h.x,this.tension),lo.initCatmullRom(l.y,u.y,f.y,h.y,this.tension),co.initCatmullRom(l.z,u.z,f.z,h.z,this.tension));return n.set(ao.calc(c),lo.calc(c),co.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new D().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Nl(i,t,e,n,s){const r=(n-t)*.5,o=(s-e)*.5,a=i*i,c=i*a;return(2*e-2*n+r+o)*c+(-3*e+3*n-2*r-o)*a+r*i+e}function nd(i,t){const e=1-i;return e*e*t}function id(i,t){return 2*(1-i)*i*t}function sd(i,t){return i*i*t}function ds(i,t,e,n){return nd(i,t)+id(i,e)+sd(i,n)}function rd(i,t){const e=1-i;return e*e*e*t}function od(i,t){const e=1-i;return 3*e*e*i*t}function ad(i,t){return 3*(1-i)*i*i*t}function ld(i,t){return i*i*i*t}function fs(i,t,e,n,s){return rd(i,t)+od(i,e)+ad(i,n)+ld(i,s)}class Jc extends yn{constructor(t=new Q,e=new Q,n=new Q,s=new Q){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new Q){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(fs(t,s.x,r.x,o.x,a.x),fs(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class cd extends yn{constructor(t=new D,e=new D,n=new D,s=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new D){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(fs(t,s.x,r.x,o.x,a.x),fs(t,s.y,r.y,o.y,a.y),fs(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class $c extends yn{constructor(t=new Q,e=new Q){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Q){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Q){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class hd extends yn{constructor(t=new D,e=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new D){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new D){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Qc extends yn{constructor(t=new Q,e=new Q,n=new Q){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new Q){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(ds(t,s.x,r.x,o.x),ds(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class ud extends yn{constructor(t=new D,e=new D,n=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new D){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(ds(t,s.x,r.x,o.x),ds(t,s.y,r.y,o.y),ds(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class th extends yn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Q){const n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(Nl(a,c.x,l.x,h.x,u.x),Nl(a,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new Q().fromArray(s))}return this}}var ma=Object.freeze({__proto__:null,ArcCurve:td,CatmullRomCurve3:ed,CubicBezierCurve:Jc,CubicBezierCurve3:cd,EllipseCurve:Ga,LineCurve:$c,LineCurve3:hd,QuadraticBezierCurve:Qc,QuadraticBezierCurve3:ud,SplineCurve:th});class dd extends yn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new ma[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(a);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new ma[s.type]().fromJSON(s))}return this}}class ga extends dd{constructor(t){super(),this.type="Path",this.currentPoint=new Q,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new $c(this.currentPoint.clone(),new Q(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Qc(this.currentPoint.clone(),new Q(t,e),new Q(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){const a=new Jc(this.currentPoint.clone(),new Q(t,e),new Q(n,s),new Q(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new th(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,s,r,o,a,c),this}absellipse(t,e,n,s,r,o,a,c){const l=new Ga(t,e,n,s,r,o,a,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class pi extends ga{constructor(t){super(t),this.uuid=Vi(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new ga().fromJSON(s))}return this}}function fd(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=eh(i,0,s,e,!0);const o=[];if(!r||r.next===r.prev)return o;let a,c,l;if(n&&(r=xd(i,t,r,e)),i.length>80*e){a=1/0,c=1/0;let h=-1/0,u=-1/0;for(let f=e;f<s;f+=e){const p=i[f],g=i[f+1];p<a&&(a=p),g<c&&(c=g),p>h&&(h=p),g>u&&(u=g)}l=Math.max(h-a,u-c),l=l!==0?32767/l:0}return vs(r,o,e,a,c,l,0),o}function eh(i,t,e,n,s){let r;if(s===Cd(i,t,e,n)>0)for(let o=t;o<e;o+=n)r=Fl(o/n|0,i[o],i[o+1],r);else for(let o=e-n;o>=t;o-=n)r=Fl(o/n|0,i[o],i[o+1],r);return r&&Gi(r,r.next)&&(Ms(r),r=r.next),r}function di(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Gi(e,e.next)||fe(e.prev,e,e.next)===0)){if(Ms(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function vs(i,t,e,n,s,r,o){if(!i)return;!o&&r&&Ed(i,n,s,r);let a=i;for(;i.prev!==i.next;){const c=i.prev,l=i.next;if(r?md(i,n,s,r):pd(i)){t.push(c.i,i.i,l.i),Ms(i),i=l.next,a=l.next;continue}if(i=l,i===a){o?o===1?(i=gd(di(i),t),vs(i,t,e,n,s,r,2)):o===2&&_d(i,t,e,n,s,r):vs(di(i),t,e,n,s,r,1);break}}}function pd(i){const t=i.prev,e=i,n=i.next;if(fe(t,e,n)>=0)return!1;const s=t.x,r=e.x,o=n.x,a=t.y,c=e.y,l=n.y,h=Math.min(s,r,o),u=Math.min(a,c,l),f=Math.max(s,r,o),p=Math.max(a,c,l);let g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=f&&g.y>=u&&g.y<=p&&rs(s,a,r,c,o,l,g.x,g.y)&&fe(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function md(i,t,e,n){const s=i.prev,r=i,o=i.next;if(fe(s,r,o)>=0)return!1;const a=s.x,c=r.x,l=o.x,h=s.y,u=r.y,f=o.y,p=Math.min(a,c,l),g=Math.min(h,u,f),x=Math.max(a,c,l),m=Math.max(h,u,f),d=_a(p,g,t,e,n),M=_a(x,m,t,e,n);let v=i.prevZ,_=i.nextZ;for(;v&&v.z>=d&&_&&_.z<=M;){if(v.x>=p&&v.x<=x&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&rs(a,h,c,u,l,f,v.x,v.y)&&fe(v.prev,v,v.next)>=0||(v=v.prevZ,_.x>=p&&_.x<=x&&_.y>=g&&_.y<=m&&_!==s&&_!==o&&rs(a,h,c,u,l,f,_.x,_.y)&&fe(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;v&&v.z>=d;){if(v.x>=p&&v.x<=x&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&rs(a,h,c,u,l,f,v.x,v.y)&&fe(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;_&&_.z<=M;){if(_.x>=p&&_.x<=x&&_.y>=g&&_.y<=m&&_!==s&&_!==o&&rs(a,h,c,u,l,f,_.x,_.y)&&fe(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function gd(i,t){let e=i;do{const n=e.prev,s=e.next.next;!Gi(n,s)&&ih(n,e,e.next,s)&&ys(n,s)&&ys(s,n)&&(t.push(n.i,e.i,s.i),Ms(e),Ms(e.next),e=i=s),e=e.next}while(e!==i);return di(e)}function _d(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Td(o,a)){let c=sh(o,a);o=di(o,o.next),c=di(c,c.next),vs(o,t,e,n,s,r,0),vs(c,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function xd(i,t,e,n){const s=[];for(let r=0,o=t.length;r<o;r++){const a=t[r]*n,c=r<o-1?t[r+1]*n:i.length,l=eh(i,a,c,n,!1);l===l.next&&(l.steiner=!0),s.push(wd(l))}s.sort(vd);for(let r=0;r<s.length;r++)e=yd(s[r],e);return e}function vd(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function yd(i,t){const e=Md(i,t);if(!e)return t;const n=sh(e,i);return di(n,n.next),di(e,e.next)}function Md(i,t){let e=t;const n=i.x,s=i.y;let r=-1/0,o;if(Gi(i,e))return e;do{if(Gi(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const u=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=n&&u>r&&(r=u,o=e.x<e.next.x?e:e.next,u===n))return o}e=e.next}while(e!==t);if(!o)return null;const a=o,c=o.x,l=o.y;let h=1/0;e=o;do{if(n>=e.x&&e.x>=c&&n!==e.x&&nh(s<l?n:r,s,c,l,s<l?r:n,s,e.x,e.y)){const u=Math.abs(s-e.y)/(n-e.x);ys(e,i)&&(u<h||u===h&&(e.x>o.x||e.x===o.x&&Sd(o,e)))&&(o=e,h=u)}e=e.next}while(e!==a);return o}function Sd(i,t){return fe(i.prev,i,t.prev)<0&&fe(t.next,i,i.next)<0}function Ed(i,t,e,n){let s=i;do s.z===0&&(s.z=_a(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,bd(s)}function bd(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let o=n,a=0;for(let l=0;l<e&&(a++,o=o.nextZ,!!o);l++);let c=e;for(;a>0||c>0&&o;)a!==0&&(c===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,e*=2}while(t>1);return i}function _a(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function wd(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function nh(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function rs(i,t,e,n,s,r,o,a){return!(i===o&&t===a)&&nh(i,t,e,n,s,r,o,a)}function Td(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!Ad(i,t)&&(ys(i,t)&&ys(t,i)&&Rd(i,t)&&(fe(i.prev,i,t.prev)||fe(i,t.prev,t))||Gi(i,t)&&fe(i.prev,i,i.next)>0&&fe(t.prev,t,t.next)>0)}function fe(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Gi(i,t){return i.x===t.x&&i.y===t.y}function ih(i,t,e,n){const s=nr(fe(i,t,e)),r=nr(fe(i,t,n)),o=nr(fe(e,n,i)),a=nr(fe(e,n,t));return!!(s!==r&&o!==a||s===0&&er(i,e,t)||r===0&&er(i,n,t)||o===0&&er(e,i,n)||a===0&&er(e,t,n))}function er(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function nr(i){return i>0?1:i<0?-1:0}function Ad(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&ih(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function ys(i,t){return fe(i.prev,i,i.next)<0?fe(i,t,i.next)>=0&&fe(i,i.prev,t)>=0:fe(i,t,i.prev)<0||fe(i,i.next,t)<0}function Rd(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function sh(i,t){const e=xa(i.i,i.x,i.y),n=xa(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Fl(i,t,e,n){const s=xa(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Ms(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function xa(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Cd(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}class Pd{static triangulate(t,e,n=2){return fd(t,e,n)}}class Pn{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Pn.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];Ol(t),Bl(n,t);let o=t.length;e.forEach(Ol);for(let c=0;c<e.length;c++)s.push(o),o+=e[c].length,Bl(n,e[c]);const a=Pd.triangulate(n,s);for(let c=0;c<a.length;c+=3)r.push(a.slice(c,c+3));return r}}function Ol(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Bl(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class Yi extends Ee{constructor(t=new pi([new Q(.5,.5),new Q(-.5,.5),new Q(-.5,-.5),new Q(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],r=[];for(let a=0,c=t.length;a<c;a++){const l=t[a];o(l)}this.setAttribute("position",new Qt(s,3)),this.setAttribute("uv",new Qt(r,2)),this.computeVertexNormals();function o(a){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let f=e.bevelEnabled!==void 0?e.bevelEnabled:!0,p=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:p-.1,x=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const d=e.extrudePath,M=e.UVGenerator!==void 0?e.UVGenerator:Dd;let v,_=!1,w,A,R,P;d&&(v=d.getSpacedPoints(h),_=!0,f=!1,w=d.computeFrenetFrames(h,!1),A=new D,R=new D,P=new D),f||(m=0,p=0,g=0,x=0);const S=a.extractPoints(l);let E=S.shape;const L=S.holes;if(!Pn.isClockWise(E)){E=E.reverse();for(let et=0,K=L.length;et<K;et++){const j=L[et];Pn.isClockWise(j)&&(L[et]=j.reverse())}}function H(et){const j=10000000000000001e-36;let q=et[0];for(let ht=1;ht<=et.length;ht++){const it=ht%et.length,ut=et[it],Ot=ut.x-q.x,Ft=ut.y-q.y,T=Ot*Ot+Ft*Ft,y=Math.max(Math.abs(ut.x),Math.abs(ut.y),Math.abs(q.x),Math.abs(q.y)),F=j*y*y;if(T<=F){et.splice(it,1),ht--;continue}q=ut}}H(E),L.forEach(H);const Y=L.length,G=E;for(let et=0;et<Y;et++){const K=L[et];E=E.concat(K)}function X(et,K,j){return K||console.error("THREE.ExtrudeGeometry: vec does not exist"),et.clone().addScaledVector(K,j)}const $=E.length;function V(et,K,j){let q,ht,it;const ut=et.x-K.x,Ot=et.y-K.y,Ft=j.x-et.x,T=j.y-et.y,y=ut*ut+Ot*Ot,F=ut*T-Ot*Ft;if(Math.abs(F)>Number.EPSILON){const k=Math.sqrt(y),tt=Math.sqrt(Ft*Ft+T*T),W=K.x-Ot/k,Rt=K.y+ut/k,ct=j.x-T/tt,wt=j.y+Ft/tt,Tt=((ct-W)*T-(wt-Rt)*Ft)/(ut*T-Ot*Ft);q=W+ut*Tt-et.x,ht=Rt+Ot*Tt-et.y;const rt=q*q+ht*ht;if(rt<=2)return new Q(q,ht);it=Math.sqrt(rt/2)}else{let k=!1;ut>Number.EPSILON?Ft>Number.EPSILON&&(k=!0):ut<-Number.EPSILON?Ft<-Number.EPSILON&&(k=!0):Math.sign(Ot)===Math.sign(T)&&(k=!0),k?(q=-Ot,ht=ut,it=Math.sqrt(y)):(q=ut,ht=Ot,it=Math.sqrt(y/2))}return new Q(q/it,ht/it)}const dt=[];for(let et=0,K=G.length,j=K-1,q=et+1;et<K;et++,j++,q++)j===K&&(j=0),q===K&&(q=0),dt[et]=V(G[et],G[j],G[q]);const xt=[];let Mt,zt=dt.concat();for(let et=0,K=Y;et<K;et++){const j=L[et];Mt=[];for(let q=0,ht=j.length,it=ht-1,ut=q+1;q<ht;q++,it++,ut++)it===ht&&(it=0),ut===ht&&(ut=0),Mt[q]=V(j[q],j[it],j[ut]);xt.push(Mt),zt=zt.concat(Mt)}let jt;if(m===0)jt=Pn.triangulateShape(G,L);else{const et=[],K=[];for(let j=0;j<m;j++){const q=j/m,ht=p*Math.cos(q*Math.PI/2),it=g*Math.sin(q*Math.PI/2)+x;for(let ut=0,Ot=G.length;ut<Ot;ut++){const Ft=X(G[ut],dt[ut],it);Pt(Ft.x,Ft.y,-ht),q===0&&et.push(Ft)}for(let ut=0,Ot=Y;ut<Ot;ut++){const Ft=L[ut];Mt=xt[ut];const T=[];for(let y=0,F=Ft.length;y<F;y++){const k=X(Ft[y],Mt[y],it);Pt(k.x,k.y,-ht),q===0&&T.push(k)}q===0&&K.push(T)}}jt=Pn.triangulateShape(et,K)}const ee=jt.length,Kt=g+x;for(let et=0;et<$;et++){const K=f?X(E[et],zt[et],Kt):E[et];_?(R.copy(w.normals[0]).multiplyScalar(K.x),A.copy(w.binormals[0]).multiplyScalar(K.y),P.copy(v[0]).add(R).add(A),Pt(P.x,P.y,P.z)):Pt(K.x,K.y,0)}for(let et=1;et<=h;et++)for(let K=0;K<$;K++){const j=f?X(E[K],zt[K],Kt):E[K];_?(R.copy(w.normals[et]).multiplyScalar(j.x),A.copy(w.binormals[et]).multiplyScalar(j.y),P.copy(v[et]).add(R).add(A),Pt(P.x,P.y,P.z)):Pt(j.x,j.y,u/h*et)}for(let et=m-1;et>=0;et--){const K=et/m,j=p*Math.cos(K*Math.PI/2),q=g*Math.sin(K*Math.PI/2)+x;for(let ht=0,it=G.length;ht<it;ht++){const ut=X(G[ht],dt[ht],q);Pt(ut.x,ut.y,u+j)}for(let ht=0,it=L.length;ht<it;ht++){const ut=L[ht];Mt=xt[ht];for(let Ot=0,Ft=ut.length;Ot<Ft;Ot++){const T=X(ut[Ot],Mt[Ot],q);_?Pt(T.x,T.y+v[h-1].y,v[h-1].x+j):Pt(T.x,T.y,u+j)}}}Z(),nt();function Z(){const et=s.length/3;if(f){let K=0,j=$*K;for(let q=0;q<ee;q++){const ht=jt[q];bt(ht[2]+j,ht[1]+j,ht[0]+j)}K=h+m*2,j=$*K;for(let q=0;q<ee;q++){const ht=jt[q];bt(ht[0]+j,ht[1]+j,ht[2]+j)}}else{for(let K=0;K<ee;K++){const j=jt[K];bt(j[2],j[1],j[0])}for(let K=0;K<ee;K++){const j=jt[K];bt(j[0]+$*h,j[1]+$*h,j[2]+$*h)}}n.addGroup(et,s.length/3-et,0)}function nt(){const et=s.length/3;let K=0;yt(G,K),K+=G.length;for(let j=0,q=L.length;j<q;j++){const ht=L[j];yt(ht,K),K+=ht.length}n.addGroup(et,s.length/3-et,1)}function yt(et,K){let j=et.length;for(;--j>=0;){const q=j;let ht=j-1;ht<0&&(ht=et.length-1);for(let it=0,ut=h+m*2;it<ut;it++){const Ot=$*it,Ft=$*(it+1),T=K+q+Ot,y=K+ht+Ot,F=K+ht+Ft,k=K+q+Ft;Yt(T,y,F,k)}}}function Pt(et,K,j){c.push(et),c.push(K),c.push(j)}function bt(et,K,j){ae(et),ae(K),ae(j);const q=s.length/3,ht=M.generateTopUV(n,s,q-3,q-2,q-1);C(ht[0]),C(ht[1]),C(ht[2])}function Yt(et,K,j,q){ae(et),ae(K),ae(q),ae(K),ae(j),ae(q);const ht=s.length/3,it=M.generateSideWallUV(n,s,ht-6,ht-3,ht-2,ht-1);C(it[0]),C(it[1]),C(it[3]),C(it[1]),C(it[2]),C(it[3])}function ae(et){s.push(c[et*3+0]),s.push(c[et*3+1]),s.push(c[et*3+2])}function C(et){r.push(et.x),r.push(et.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return Ld(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,o=t.shapes.length;r<o;r++){const a=e[t.shapes[r]];n.push(a)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new ma[s.type]().fromJSON(s)),new Yi(n,t.options)}}const Dd={generateTopUV:function(i,t,e,n,s){const r=t[e*3],o=t[e*3+1],a=t[n*3],c=t[n*3+1],l=t[s*3],h=t[s*3+1];return[new Q(r,o),new Q(a,c),new Q(l,h)]},generateSideWallUV:function(i,t,e,n,s,r){const o=t[e*3],a=t[e*3+1],c=t[e*3+2],l=t[n*3],h=t[n*3+1],u=t[n*3+2],f=t[s*3],p=t[s*3+1],g=t[s*3+2],x=t[r*3],m=t[r*3+1],d=t[r*3+2];return Math.abs(a-h)<Math.abs(o-l)?[new Q(o,1-c),new Q(l,1-u),new Q(f,1-g),new Q(x,1-d)]:[new Q(a,1-c),new Q(h,1-u),new Q(p,1-g),new Q(m,1-d)]}};function Ld(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Wa extends ka{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Wa(t.radius,t.detail)}}class Mn extends Ee{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,u=t/a,f=e/c,p=[],g=[],x=[],m=[];for(let d=0;d<h;d++){const M=d*f-o;for(let v=0;v<l;v++){const _=v*u-r;g.push(_,-M,0),x.push(0,0,1),m.push(v/a),m.push(1-d/c)}}for(let d=0;d<c;d++)for(let M=0;M<a;M++){const v=M+l*d,_=M+l*(d+1),w=M+1+l*(d+1),A=M+1+l*d;p.push(v,_,A),p.push(_,w,A)}this.setIndex(p),this.setAttribute("position",new Qt(g,3)),this.setAttribute("normal",new Qt(x,3)),this.setAttribute("uv",new Qt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Mn(t.width,t.height,t.widthSegments,t.heightSegments)}}class Xa extends Ee{constructor(t=.5,e=1,n=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:o},n=Math.max(3,n),s=Math.max(1,s);const a=[],c=[],l=[],h=[];let u=t;const f=(e-t)/s,p=new D,g=new Q;for(let x=0;x<=s;x++){for(let m=0;m<=n;m++){const d=r+m/n*o;p.x=u*Math.cos(d),p.y=u*Math.sin(d),c.push(p.x,p.y,p.z),l.push(0,0,1),g.x=(p.x/e+1)/2,g.y=(p.y/e+1)/2,h.push(g.x,g.y)}u+=f}for(let x=0;x<s;x++){const m=x*(n+1);for(let d=0;d<n;d++){const M=d+m,v=M,_=M+n+1,w=M+n+2,A=M+1;a.push(v,_,A),a.push(_,w,A)}}this.setIndex(a),this.setAttribute("position",new Qt(c,3)),this.setAttribute("normal",new Qt(l,3)),this.setAttribute("uv",new Qt(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xa(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Ya extends Ee{constructor(t=new pi([new Q(0,.5),new Q(-.5,-.5),new Q(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],s=[],r=[],o=[];let a=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let h=0;h<t.length;h++)l(t[h]),this.addGroup(a,c,h),a+=c,c=0;this.setIndex(n),this.setAttribute("position",new Qt(s,3)),this.setAttribute("normal",new Qt(r,3)),this.setAttribute("uv",new Qt(o,2));function l(h){const u=s.length/3,f=h.extractPoints(e);let p=f.shape;const g=f.holes;Pn.isClockWise(p)===!1&&(p=p.reverse());for(let m=0,d=g.length;m<d;m++){const M=g[m];Pn.isClockWise(M)===!0&&(g[m]=M.reverse())}const x=Pn.triangulateShape(p,g);for(let m=0,d=g.length;m<d;m++){const M=g[m];p=p.concat(M)}for(let m=0,d=p.length;m<d;m++){const M=p[m];s.push(M.x,M.y,0),r.push(0,0,1),o.push(M.x,M.y)}for(let m=0,d=x.length;m<d;m++){const M=x[m],v=M[0]+u,_=M[1]+u,w=M[2]+u;n.push(v,_,w),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return Id(e,t)}static fromJSON(t,e){const n=[];for(let s=0,r=t.shapes.length;s<r;s++){const o=e[t.shapes[s]];n.push(o)}return new Ya(n,t.curveSegments)}}function Id(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){const s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}class Zi extends Ee{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let l=0;const h=[],u=new D,f=new D,p=[],g=[],x=[],m=[];for(let d=0;d<=n;d++){const M=[],v=d/n;let _=0;d===0&&o===0?_=.5/e:d===n&&c===Math.PI&&(_=-.5/e);for(let w=0;w<=e;w++){const A=w/e;u.x=-t*Math.cos(s+A*r)*Math.sin(o+v*a),u.y=t*Math.cos(o+v*a),u.z=t*Math.sin(s+A*r)*Math.sin(o+v*a),g.push(u.x,u.y,u.z),f.copy(u).normalize(),x.push(f.x,f.y,f.z),m.push(A+_,1-v),M.push(l++)}h.push(M)}for(let d=0;d<n;d++)for(let M=0;M<e;M++){const v=h[d][M+1],_=h[d][M],w=h[d+1][M],A=h[d+1][M+1];(d!==0||o>0)&&p.push(v,_,A),(d!==n-1||c<Math.PI)&&p.push(_,w,A)}this.setIndex(p),this.setAttribute("position",new Qt(g,3)),this.setAttribute("normal",new Qt(x,3)),this.setAttribute("uv",new Qt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Zi(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class xn extends Xi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Wt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Wt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Fc,this.normalScale=new Q(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _n,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Ud extends Xi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=hu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Nd extends Xi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class rh extends xe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Wt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class oh extends rh{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(xe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Wt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const ho=new oe,zl=new D,Hl=new D;class Fd{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Q(512,512),this.mapType=gn,this.map=null,this.mapPass=null,this.matrix=new oe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new za,this._frameExtents=new Q(1,1),this._viewportCount=1,this._viewports=[new me(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;zl.setFromMatrixPosition(t.matrixWorld),e.position.copy(zl),Hl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Hl),e.updateMatrixWorld(),ho.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ho,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ho)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class ah extends Xc{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Od extends Fd{constructor(){super(new ah(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class va extends rh{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(xe.DEFAULT_UP),this.updateMatrix(),this.target=new xe,this.shadow=new Od}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Bd extends Qe{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}const kl=new oe;class zd{constructor(t,e,n=0,s=1/0){this.ray=new Rr(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Ba,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return kl.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(kl),this}intersectObject(t,e=!0,n=[]){return ya(t,this,n,e),n.sort(Gl),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)ya(t[s],this,n,e);return n.sort(Gl),n}}function Gl(i,t){return i.distance-t.distance}function ya(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let o=0,a=r.length;o<a;o++)ya(r[o],t,e,!0)}}class Vl{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Vt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Vt(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const Wl=new Q;class Za{constructor(t=new Q(1/0,1/0),e=new Q(-1/0,-1/0)){this.isBox2=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Wl.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(t){return this.isEmpty()?t.set(0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Wl).distanceTo(t)}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}class Hd extends fi{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){if(t===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}}function Xl(i,t,e,n){const s=kd(n);switch(e){case Ic:return i*t;case Ia:return i*t/s.components*s.byteLength;case Ua:return i*t/s.components*s.byteLength;case Nc:return i*t*2/s.components*s.byteLength;case Na:return i*t*2/s.components*s.byteLength;case Uc:return i*t*3/s.components*s.byteLength;case ln:return i*t*4/s.components*s.byteLength;case Fa:return i*t*4/s.components*s.byteLength;case ar:case lr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case cr:case hr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Ho:case Go:return Math.max(i,16)*Math.max(t,8)/4;case zo:case ko:return Math.max(i,8)*Math.max(t,8)/2;case Vo:case Wo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Xo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Yo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Zo:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case qo:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case jo:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Ko:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Jo:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case $o:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Qo:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case ta:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case ea:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case na:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case ia:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case sa:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case ra:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case oa:case aa:case la:return Math.ceil(i/4)*Math.ceil(t/4)*16;case ca:case ha:return Math.ceil(i/4)*Math.ceil(t/4)*8;case ua:case da:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function kd(i){switch(i){case gn:case Cc:return{byteLength:1,components:1};case ps:case Pc:case Es:return{byteLength:2,components:1};case Da:case La:return{byteLength:2,components:4};case ci:case Pa:case pn:return{byteLength:4,components:1};case Dc:case Lc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ca}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ca);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function lh(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Gd(i){const t=new WeakMap;function e(a,c){const l=a.array,h=a.usage,u=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,h),a.onUploadCallback();let p;if(l instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)p=i.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=i.SHORT;else if(l instanceof Uint32Array)p=i.UNSIGNED_INT;else if(l instanceof Int32Array)p=i.INT;else if(l instanceof Int8Array)p=i.BYTE;else if(l instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,c,l){const h=c.array,u=c.updateRanges;if(i.bindBuffer(l,a),u.length===0)i.bufferSubData(l,0,h);else{u.sort((p,g)=>p.start-g.start);let f=0;for(let p=1;p<u.length;p++){const g=u[f],x=u[p];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++f,u[f]=x)}u.length=f+1;for(let p=0,g=u.length;p<g;p++){const x=u[p];i.bufferSubData(l,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=t.get(a);c&&(i.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}var Vd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Wd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Xd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Yd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Zd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,qd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,jd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Kd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Jd=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,$d=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Qd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,tf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ef=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,nf=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,sf=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,rf=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,of=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,af=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,lf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,cf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,hf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,uf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,df=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,ff=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,pf=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,mf=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,gf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,_f=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,xf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,vf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,yf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Mf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Sf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Ef=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,bf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,wf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Tf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Af=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Rf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Cf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Pf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Df=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Lf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,If=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Uf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Nf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Ff=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Of=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Bf=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,zf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Hf=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,kf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Gf=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Vf=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Wf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Xf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Yf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Zf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,qf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,jf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Kf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Jf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,$f=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Qf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,tp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ep=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,np=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ip=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,sp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,rp=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,op=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ap=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,lp=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,cp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,hp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,up=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,dp=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,fp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,pp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,mp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,gp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,_p=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,xp=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,vp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,yp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Mp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Sp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ep=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,bp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,wp=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Tp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Ap=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Rp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Cp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Pp=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Dp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Lp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Ip=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Up=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Np=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Fp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Op=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Bp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,zp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Hp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,kp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Gp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Vp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Wp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Xp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Yp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,qp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Kp=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Jp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,$p=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Qp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,tm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,em=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,nm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,im=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,sm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rm=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,om=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,am=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,lm=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cm=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,hm=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,um=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,dm=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fm=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,pm=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,mm=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,gm=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_m=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,xm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,vm=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ym=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Mm=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Sm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Gt={alphahash_fragment:Vd,alphahash_pars_fragment:Wd,alphamap_fragment:Xd,alphamap_pars_fragment:Yd,alphatest_fragment:Zd,alphatest_pars_fragment:qd,aomap_fragment:jd,aomap_pars_fragment:Kd,batching_pars_vertex:Jd,batching_vertex:$d,begin_vertex:Qd,beginnormal_vertex:tf,bsdfs:ef,iridescence_fragment:nf,bumpmap_pars_fragment:sf,clipping_planes_fragment:rf,clipping_planes_pars_fragment:of,clipping_planes_pars_vertex:af,clipping_planes_vertex:lf,color_fragment:cf,color_pars_fragment:hf,color_pars_vertex:uf,color_vertex:df,common:ff,cube_uv_reflection_fragment:pf,defaultnormal_vertex:mf,displacementmap_pars_vertex:gf,displacementmap_vertex:_f,emissivemap_fragment:xf,emissivemap_pars_fragment:vf,colorspace_fragment:yf,colorspace_pars_fragment:Mf,envmap_fragment:Sf,envmap_common_pars_fragment:Ef,envmap_pars_fragment:bf,envmap_pars_vertex:wf,envmap_physical_pars_fragment:Ff,envmap_vertex:Tf,fog_vertex:Af,fog_pars_vertex:Rf,fog_fragment:Cf,fog_pars_fragment:Pf,gradientmap_pars_fragment:Df,lightmap_pars_fragment:Lf,lights_lambert_fragment:If,lights_lambert_pars_fragment:Uf,lights_pars_begin:Nf,lights_toon_fragment:Of,lights_toon_pars_fragment:Bf,lights_phong_fragment:zf,lights_phong_pars_fragment:Hf,lights_physical_fragment:kf,lights_physical_pars_fragment:Gf,lights_fragment_begin:Vf,lights_fragment_maps:Wf,lights_fragment_end:Xf,logdepthbuf_fragment:Yf,logdepthbuf_pars_fragment:Zf,logdepthbuf_pars_vertex:qf,logdepthbuf_vertex:jf,map_fragment:Kf,map_pars_fragment:Jf,map_particle_fragment:$f,map_particle_pars_fragment:Qf,metalnessmap_fragment:tp,metalnessmap_pars_fragment:ep,morphinstance_vertex:np,morphcolor_vertex:ip,morphnormal_vertex:sp,morphtarget_pars_vertex:rp,morphtarget_vertex:op,normal_fragment_begin:ap,normal_fragment_maps:lp,normal_pars_fragment:cp,normal_pars_vertex:hp,normal_vertex:up,normalmap_pars_fragment:dp,clearcoat_normal_fragment_begin:fp,clearcoat_normal_fragment_maps:pp,clearcoat_pars_fragment:mp,iridescence_pars_fragment:gp,opaque_fragment:_p,packing:xp,premultiplied_alpha_fragment:vp,project_vertex:yp,dithering_fragment:Mp,dithering_pars_fragment:Sp,roughnessmap_fragment:Ep,roughnessmap_pars_fragment:bp,shadowmap_pars_fragment:wp,shadowmap_pars_vertex:Tp,shadowmap_vertex:Ap,shadowmask_pars_fragment:Rp,skinbase_vertex:Cp,skinning_pars_vertex:Pp,skinning_vertex:Dp,skinnormal_vertex:Lp,specularmap_fragment:Ip,specularmap_pars_fragment:Up,tonemapping_fragment:Np,tonemapping_pars_fragment:Fp,transmission_fragment:Op,transmission_pars_fragment:Bp,uv_pars_fragment:zp,uv_pars_vertex:Hp,uv_vertex:kp,worldpos_vertex:Gp,background_vert:Vp,background_frag:Wp,backgroundCube_vert:Xp,backgroundCube_frag:Yp,cube_vert:Zp,cube_frag:qp,depth_vert:jp,depth_frag:Kp,distanceRGBA_vert:Jp,distanceRGBA_frag:$p,equirect_vert:Qp,equirect_frag:tm,linedashed_vert:em,linedashed_frag:nm,meshbasic_vert:im,meshbasic_frag:sm,meshlambert_vert:rm,meshlambert_frag:om,meshmatcap_vert:am,meshmatcap_frag:lm,meshnormal_vert:cm,meshnormal_frag:hm,meshphong_vert:um,meshphong_frag:dm,meshphysical_vert:fm,meshphysical_frag:pm,meshtoon_vert:mm,meshtoon_frag:gm,points_vert:_m,points_frag:xm,shadow_vert:vm,shadow_frag:ym,sprite_vert:Mm,sprite_frag:Sm},pt={common:{diffuse:{value:new Wt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new kt},alphaMap:{value:null},alphaMapTransform:{value:new kt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new kt}},envmap:{envMap:{value:null},envMapRotation:{value:new kt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new kt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new kt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new kt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new kt},normalScale:{value:new Q(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new kt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new kt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new kt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new kt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Wt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Wt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new kt},alphaTest:{value:0},uvTransform:{value:new kt}},sprite:{diffuse:{value:new Wt(16777215)},opacity:{value:1},center:{value:new Q(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new kt},alphaMap:{value:null},alphaMapTransform:{value:new kt},alphaTest:{value:0}}},dn={basic:{uniforms:Fe([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.fog]),vertexShader:Gt.meshbasic_vert,fragmentShader:Gt.meshbasic_frag},lambert:{uniforms:Fe([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new Wt(0)}}]),vertexShader:Gt.meshlambert_vert,fragmentShader:Gt.meshlambert_frag},phong:{uniforms:Fe([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new Wt(0)},specular:{value:new Wt(1118481)},shininess:{value:30}}]),vertexShader:Gt.meshphong_vert,fragmentShader:Gt.meshphong_frag},standard:{uniforms:Fe([pt.common,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.roughnessmap,pt.metalnessmap,pt.fog,pt.lights,{emissive:{value:new Wt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Gt.meshphysical_vert,fragmentShader:Gt.meshphysical_frag},toon:{uniforms:Fe([pt.common,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.gradientmap,pt.fog,pt.lights,{emissive:{value:new Wt(0)}}]),vertexShader:Gt.meshtoon_vert,fragmentShader:Gt.meshtoon_frag},matcap:{uniforms:Fe([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,{matcap:{value:null}}]),vertexShader:Gt.meshmatcap_vert,fragmentShader:Gt.meshmatcap_frag},points:{uniforms:Fe([pt.points,pt.fog]),vertexShader:Gt.points_vert,fragmentShader:Gt.points_frag},dashed:{uniforms:Fe([pt.common,pt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Gt.linedashed_vert,fragmentShader:Gt.linedashed_frag},depth:{uniforms:Fe([pt.common,pt.displacementmap]),vertexShader:Gt.depth_vert,fragmentShader:Gt.depth_frag},normal:{uniforms:Fe([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,{opacity:{value:1}}]),vertexShader:Gt.meshnormal_vert,fragmentShader:Gt.meshnormal_frag},sprite:{uniforms:Fe([pt.sprite,pt.fog]),vertexShader:Gt.sprite_vert,fragmentShader:Gt.sprite_frag},background:{uniforms:{uvTransform:{value:new kt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Gt.background_vert,fragmentShader:Gt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new kt}},vertexShader:Gt.backgroundCube_vert,fragmentShader:Gt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Gt.cube_vert,fragmentShader:Gt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Gt.equirect_vert,fragmentShader:Gt.equirect_frag},distanceRGBA:{uniforms:Fe([pt.common,pt.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Gt.distanceRGBA_vert,fragmentShader:Gt.distanceRGBA_frag},shadow:{uniforms:Fe([pt.lights,pt.fog,{color:{value:new Wt(0)},opacity:{value:1}}]),vertexShader:Gt.shadow_vert,fragmentShader:Gt.shadow_frag}};dn.physical={uniforms:Fe([dn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new kt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new kt},clearcoatNormalScale:{value:new Q(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new kt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new kt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new kt},sheen:{value:0},sheenColor:{value:new Wt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new kt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new kt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new kt},transmissionSamplerSize:{value:new Q},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new kt},attenuationDistance:{value:0},attenuationColor:{value:new Wt(0)},specularColor:{value:new Wt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new kt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new kt},anisotropyVector:{value:new Q},anisotropyMap:{value:null},anisotropyMapTransform:{value:new kt}}]),vertexShader:Gt.meshphysical_vert,fragmentShader:Gt.meshphysical_frag};const ir={r:0,b:0,g:0},ii=new _n,Em=new oe;function bm(i,t,e,n,s,r,o){const a=new Wt(0);let c=r===!0?0:1,l,h,u=null,f=0,p=null;function g(v){let _=v.isScene===!0?v.background:null;return _&&_.isTexture&&(_=(v.backgroundBlurriness>0?e:t).get(_)),_}function x(v){let _=!1;const w=g(v);w===null?d(a,c):w&&w.isColor&&(d(w,1),_=!0);const A=i.xr.getEnvironmentBlendMode();A==="additive"?n.buffers.color.setClear(0,0,0,1,o):A==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(v,_){const w=g(_);w&&(w.isCubeTexture||w.mapping===Ar)?(h===void 0&&(h=new qt(new Kn(1,1,1),new qn({name:"BackgroundCubeMaterial",uniforms:ki(dn.backgroundCube.uniforms),vertexShader:dn.backgroundCube.vertexShader,fragmentShader:dn.backgroundCube.fragmentShader,side:Ie,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,R,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),ii.copy(_.backgroundRotation),ii.x*=-1,ii.y*=-1,ii.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(ii.y*=-1,ii.z*=-1),h.material.uniforms.envMap.value=w,h.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Em.makeRotationFromEuler(ii)),h.material.toneMapped=$t.getTransfer(w.colorSpace)!==ie,(u!==w||f!==w.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,u=w,f=w.version,p=i.toneMapping),h.layers.enableAll(),v.unshift(h,h.geometry,h.material,0,0,null)):w&&w.isTexture&&(l===void 0&&(l=new qt(new Mn(2,2),new qn({name:"BackgroundMaterial",uniforms:ki(dn.background.uniforms),vertexShader:dn.background.vertexShader,fragmentShader:dn.background.fragmentShader,side:Zn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=w,l.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,l.material.toneMapped=$t.getTransfer(w.colorSpace)!==ie,w.matrixAutoUpdate===!0&&w.updateMatrix(),l.material.uniforms.uvTransform.value.copy(w.matrix),(u!==w||f!==w.version||p!==i.toneMapping)&&(l.material.needsUpdate=!0,u=w,f=w.version,p=i.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function d(v,_){v.getRGB(ir,Wc(i)),n.buffers.color.setClear(ir.r,ir.g,ir.b,_,o)}function M(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(v,_=1){a.set(v),c=_,d(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(v){c=v,d(a,c)},render:x,addToRenderList:m,dispose:M}}function wm(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null);let r=s,o=!1;function a(E,L,O,H,Y){let G=!1;const X=u(H,O,L);r!==X&&(r=X,l(r.object)),G=p(E,H,O,Y),G&&g(E,H,O,Y),Y!==null&&t.update(Y,i.ELEMENT_ARRAY_BUFFER),(G||o)&&(o=!1,_(E,L,O,H),Y!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(Y).buffer))}function c(){return i.createVertexArray()}function l(E){return i.bindVertexArray(E)}function h(E){return i.deleteVertexArray(E)}function u(E,L,O){const H=O.wireframe===!0;let Y=n[E.id];Y===void 0&&(Y={},n[E.id]=Y);let G=Y[L.id];G===void 0&&(G={},Y[L.id]=G);let X=G[H];return X===void 0&&(X=f(c()),G[H]=X),X}function f(E){const L=[],O=[],H=[];for(let Y=0;Y<e;Y++)L[Y]=0,O[Y]=0,H[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:O,attributeDivisors:H,object:E,attributes:{},index:null}}function p(E,L,O,H){const Y=r.attributes,G=L.attributes;let X=0;const $=O.getAttributes();for(const V in $)if($[V].location>=0){const xt=Y[V];let Mt=G[V];if(Mt===void 0&&(V==="instanceMatrix"&&E.instanceMatrix&&(Mt=E.instanceMatrix),V==="instanceColor"&&E.instanceColor&&(Mt=E.instanceColor)),xt===void 0||xt.attribute!==Mt||Mt&&xt.data!==Mt.data)return!0;X++}return r.attributesNum!==X||r.index!==H}function g(E,L,O,H){const Y={},G=L.attributes;let X=0;const $=O.getAttributes();for(const V in $)if($[V].location>=0){let xt=G[V];xt===void 0&&(V==="instanceMatrix"&&E.instanceMatrix&&(xt=E.instanceMatrix),V==="instanceColor"&&E.instanceColor&&(xt=E.instanceColor));const Mt={};Mt.attribute=xt,xt&&xt.data&&(Mt.data=xt.data),Y[V]=Mt,X++}r.attributes=Y,r.attributesNum=X,r.index=H}function x(){const E=r.newAttributes;for(let L=0,O=E.length;L<O;L++)E[L]=0}function m(E){d(E,0)}function d(E,L){const O=r.newAttributes,H=r.enabledAttributes,Y=r.attributeDivisors;O[E]=1,H[E]===0&&(i.enableVertexAttribArray(E),H[E]=1),Y[E]!==L&&(i.vertexAttribDivisor(E,L),Y[E]=L)}function M(){const E=r.newAttributes,L=r.enabledAttributes;for(let O=0,H=L.length;O<H;O++)L[O]!==E[O]&&(i.disableVertexAttribArray(O),L[O]=0)}function v(E,L,O,H,Y,G,X){X===!0?i.vertexAttribIPointer(E,L,O,Y,G):i.vertexAttribPointer(E,L,O,H,Y,G)}function _(E,L,O,H){x();const Y=H.attributes,G=O.getAttributes(),X=L.defaultAttributeValues;for(const $ in G){const V=G[$];if(V.location>=0){let dt=Y[$];if(dt===void 0&&($==="instanceMatrix"&&E.instanceMatrix&&(dt=E.instanceMatrix),$==="instanceColor"&&E.instanceColor&&(dt=E.instanceColor)),dt!==void 0){const xt=dt.normalized,Mt=dt.itemSize,zt=t.get(dt);if(zt===void 0)continue;const jt=zt.buffer,ee=zt.type,Kt=zt.bytesPerElement,Z=ee===i.INT||ee===i.UNSIGNED_INT||dt.gpuType===Pa;if(dt.isInterleavedBufferAttribute){const nt=dt.data,yt=nt.stride,Pt=dt.offset;if(nt.isInstancedInterleavedBuffer){for(let bt=0;bt<V.locationSize;bt++)d(V.location+bt,nt.meshPerAttribute);E.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=nt.meshPerAttribute*nt.count)}else for(let bt=0;bt<V.locationSize;bt++)m(V.location+bt);i.bindBuffer(i.ARRAY_BUFFER,jt);for(let bt=0;bt<V.locationSize;bt++)v(V.location+bt,Mt/V.locationSize,ee,xt,yt*Kt,(Pt+Mt/V.locationSize*bt)*Kt,Z)}else{if(dt.isInstancedBufferAttribute){for(let nt=0;nt<V.locationSize;nt++)d(V.location+nt,dt.meshPerAttribute);E.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=dt.meshPerAttribute*dt.count)}else for(let nt=0;nt<V.locationSize;nt++)m(V.location+nt);i.bindBuffer(i.ARRAY_BUFFER,jt);for(let nt=0;nt<V.locationSize;nt++)v(V.location+nt,Mt/V.locationSize,ee,xt,Mt*Kt,Mt/V.locationSize*nt*Kt,Z)}}else if(X!==void 0){const xt=X[$];if(xt!==void 0)switch(xt.length){case 2:i.vertexAttrib2fv(V.location,xt);break;case 3:i.vertexAttrib3fv(V.location,xt);break;case 4:i.vertexAttrib4fv(V.location,xt);break;default:i.vertexAttrib1fv(V.location,xt)}}}}M()}function w(){P();for(const E in n){const L=n[E];for(const O in L){const H=L[O];for(const Y in H)h(H[Y].object),delete H[Y];delete L[O]}delete n[E]}}function A(E){if(n[E.id]===void 0)return;const L=n[E.id];for(const O in L){const H=L[O];for(const Y in H)h(H[Y].object),delete H[Y];delete L[O]}delete n[E.id]}function R(E){for(const L in n){const O=n[L];if(O[E.id]===void 0)continue;const H=O[E.id];for(const Y in H)h(H[Y].object),delete H[Y];delete O[E.id]}}function P(){S(),o=!0,r!==s&&(r=s,l(r.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:P,resetDefaultState:S,dispose:w,releaseStatesOfGeometry:A,releaseStatesOfProgram:R,initAttributes:x,enableAttribute:m,disableUnusedAttributes:M}}function Tm(i,t,e){let n;function s(l){n=l}function r(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function o(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),e.update(h,n,u))}function a(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let p=0;for(let g=0;g<u;g++)p+=h[g];e.update(p,n,1)}function c(l,h,u,f){if(u===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<l.length;g++)o(l[g],h[g],f[g]);else{p.multiDrawArraysInstancedWEBGL(n,l,0,h,0,f,0,u);let g=0;for(let x=0;x<u;x++)g+=h[x]*f[x];e.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function Am(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const R=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(R){return!(R!==ln&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){const P=R===Es&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(R!==gn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==pn&&!P)}function c(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,f=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),d=i.getParameter(i.MAX_VERTEX_ATTRIBS),M=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),v=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=g>0,A=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:M,maxVaryings:v,maxFragmentUniforms:_,vertexTextures:w,maxSamples:A}}function Rm(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new Hn,a=new kt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const p=u.length!==0||f||n!==0||s;return s=f,n=u.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,p){const g=u.clippingPlanes,x=u.clipIntersection,m=u.clipShadows,d=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):l();else{const M=r?0:n,v=M*4;let _=d.clippingState||null;c.value=_,_=h(g,f,v,p);for(let w=0;w!==v;++w)_[w]=e[w];d.clippingState=_,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=M}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,f,p,g){const x=u!==null?u.length:0;let m=null;if(x!==0){if(m=c.value,g!==!0||m===null){const d=p+x*4,M=f.matrixWorldInverse;a.getNormalMatrix(M),(m===null||m.length<d)&&(m=new Float32Array(d));for(let v=0,_=p;v!==x;++v,_+=4)o.copy(u[v]).applyMatrix4(M,a),o.normal.toArray(m,_),m[_+3]=o.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,m}}function Cm(i){let t=new WeakMap;function e(o,a){return a===Fo?o.mapping=Bi:a===Oo&&(o.mapping=zi),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Fo||a===Oo)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new Yu(c.height);return l.fromEquirectangularTexture(i,o),t.set(o,l),o.addEventListener("dispose",s),e(l.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const Ii=4,Yl=[.125,.215,.35,.446,.526,.582],ai=20,uo=new ah,Zl=new Wt;let fo=null,po=0,mo=0,go=!1;const ri=(1+Math.sqrt(5))/2,Di=1/ri,ql=[new D(-ri,Di,0),new D(ri,Di,0),new D(-Di,0,ri),new D(Di,0,ri),new D(0,ri,-Di),new D(0,ri,Di),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)],Pm=new D;class jl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100,r={}){const{size:o=256,position:a=Pm}=r;fo=this._renderer.getRenderTarget(),po=this._renderer.getActiveCubeFace(),mo=this._renderer.getActiveMipmapLevel(),go=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,s,c,a),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=$l(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Jl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(fo,po,mo),this._renderer.xr.enabled=go,t.scissorTest=!1,sr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Bi||t.mapping===zi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),fo=this._renderer.getRenderTarget(),po=this._renderer.getActiveCubeFace(),mo=this._renderer.getActiveMipmapLevel(),go=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:fn,minFilter:fn,generateMipmaps:!1,type:Es,format:ln,colorSpace:Hi,depthBuffer:!1},s=Kl(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Kl(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Dm(r)),this._blurMaterial=Lm(r,t,e)}return s}_compileMaterial(t){const e=new qt(this._lodPlanes[0],t);this._renderer.compile(e,uo)}_sceneToCubeUV(t,e,n,s,r){const c=new Qe(90,1,e,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,p=u.toneMapping;u.getClearColor(Zl),u.toneMapping=Xn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));const x=new bs({name:"PMREM.Background",side:Ie,depthWrite:!1,depthTest:!1}),m=new qt(new Kn,x);let d=!1;const M=t.background;M?M.isColor&&(x.color.copy(M),t.background=null,d=!0):(x.color.copy(Zl),d=!0);for(let v=0;v<6;v++){const _=v%3;_===0?(c.up.set(0,l[v],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[v],r.y,r.z)):_===1?(c.up.set(0,0,l[v]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[v],r.z)):(c.up.set(0,l[v],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[v]));const w=this._cubeSize;sr(s,_*w,v>2?w:0,w,w),u.setRenderTarget(s),d&&u.render(m,c),u.render(t,c)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=p,u.autoClear=f,t.background=M}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Bi||t.mapping===zi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=$l()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Jl());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new qt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const c=this._cubeSize;sr(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,uo)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=ql[(s-r-1)%ql.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new qt(this._lodPlanes[s],l),f=l.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*ai-1),x=r/g,m=isFinite(r)?1+Math.floor(h*x):ai;m>ai&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ai}`);const d=[];let M=0;for(let R=0;R<ai;++R){const P=R/x,S=Math.exp(-P*P/2);d.push(S),R===0?M+=S:R<m&&(M+=2*S)}for(let R=0;R<d.length;R++)d[R]=d[R]/M;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=d,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:v}=this;f.dTheta.value=g,f.mipInt.value=v-n;const _=this._sizeLods[s],w=3*_*(s>v-Ii?s-v+Ii:0),A=4*(this._cubeSize-_);sr(e,w,A,3*_,2*_),c.setRenderTarget(e),c.render(u,uo)}}function Dm(i){const t=[],e=[],n=[];let s=i;const r=i-Ii+1+Yl.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let c=1/a;o>i-Ii?c=Yl[o-i+Ii-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),h=-l,u=1+l,f=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,x=3,m=2,d=1,M=new Float32Array(x*g*p),v=new Float32Array(m*g*p),_=new Float32Array(d*g*p);for(let A=0;A<p;A++){const R=A%3*2/3-1,P=A>2?0:-1,S=[R,P,0,R+2/3,P,0,R+2/3,P+1,0,R,P,0,R+2/3,P+1,0,R,P+1,0];M.set(S,x*g*A),v.set(f,m*g*A);const E=[A,A,A,A,A,A];_.set(E,d*g*A)}const w=new Ee;w.setAttribute("position",new nn(M,x)),w.setAttribute("uv",new nn(v,m)),w.setAttribute("faceIndex",new nn(_,d)),t.push(w),s>Ii&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Kl(i,t,e){const n=new ui(i,t,e);return n.texture.mapping=Ar,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function sr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Lm(i,t,e){const n=new Float32Array(ai),s=new D(0,1,0);return new qn({name:"SphericalGaussianBlur",defines:{n:ai,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:qa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function Jl(){return new qn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:qa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function $l(){return new qn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:qa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function qa(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Im(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===Fo||c===Oo,h=c===Bi||c===zi;if(l||h){let u=t.get(a);const f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return e===null&&(e=new jl(i)),u=l?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{const p=a.image;return l&&p&&p.height>0||h&&p&&s(p)?(e===null&&(e=new jl(i)),u=l?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let c=0;const l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){const c=a.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Um(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&xs("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Nm(i,t,e,n){const s={},r=new WeakMap;function o(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);f.removeEventListener("dispose",o),delete s[f.id];const p=r.get(f);p&&(t.remove(p),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(u,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,e.memory.geometries++),f}function c(u){const f=u.attributes;for(const p in f)t.update(f[p],i.ARRAY_BUFFER)}function l(u){const f=[],p=u.index,g=u.attributes.position;let x=0;if(p!==null){const M=p.array;x=p.version;for(let v=0,_=M.length;v<_;v+=3){const w=M[v+0],A=M[v+1],R=M[v+2];f.push(w,A,A,R,R,w)}}else if(g!==void 0){const M=g.array;x=g.version;for(let v=0,_=M.length/3-1;v<_;v+=3){const w=v+0,A=v+1,R=v+2;f.push(w,A,A,R,R,w)}}else return;const m=new(zc(f)?Vc:Gc)(f,1);m.version=x;const d=r.get(u);d&&t.remove(d),r.set(u,m)}function h(u){const f=r.get(u);if(f){const p=u.index;p!==null&&f.version<p.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function Fm(i,t,e){let n;function s(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function c(f,p){i.drawElements(n,p,r,f*o),e.update(p,n,1)}function l(f,p,g){g!==0&&(i.drawElementsInstanced(n,p,r,f*o,g),e.update(p,n,g))}function h(f,p,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,f,0,g);let m=0;for(let d=0;d<g;d++)m+=p[d];e.update(m,n,1)}function u(f,p,g,x){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<f.length;d++)l(f[d]/o,p[d],x[d]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,f,0,x,0,g);let d=0;for(let M=0;M<g;M++)d+=p[M]*x[M];e.update(d,n,1)}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Om(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Bm(i,t,e){const n=new WeakMap,s=new me;function r(o,a,c){const l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let f=n.get(a);if(f===void 0||f.count!==u){let E=function(){P.dispose(),n.delete(a),a.removeEventListener("dispose",E)};var p=E;f!==void 0&&f.texture.dispose();const g=a.morphAttributes.position!==void 0,x=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,d=a.morphAttributes.position||[],M=a.morphAttributes.normal||[],v=a.morphAttributes.color||[];let _=0;g===!0&&(_=1),x===!0&&(_=2),m===!0&&(_=3);let w=a.attributes.position.count*_,A=1;w>t.maxTextureSize&&(A=Math.ceil(w/t.maxTextureSize),w=t.maxTextureSize);const R=new Float32Array(w*A*4*u),P=new Hc(R,w,A,u);P.type=pn,P.needsUpdate=!0;const S=_*4;for(let L=0;L<u;L++){const O=d[L],H=M[L],Y=v[L],G=w*A*4*L;for(let X=0;X<O.count;X++){const $=X*S;g===!0&&(s.fromBufferAttribute(O,X),R[G+$+0]=s.x,R[G+$+1]=s.y,R[G+$+2]=s.z,R[G+$+3]=0),x===!0&&(s.fromBufferAttribute(H,X),R[G+$+4]=s.x,R[G+$+5]=s.y,R[G+$+6]=s.z,R[G+$+7]=0),m===!0&&(s.fromBufferAttribute(Y,X),R[G+$+8]=s.x,R[G+$+9]=s.y,R[G+$+10]=s.z,R[G+$+11]=Y.itemSize===4?s.w:1)}}f={count:u,texture:P,size:new Q(w,A)},n.set(a,f),a.addEventListener("dispose",E)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const x=a.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",x),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function zm(i,t,e,n){let s=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return u}function o(){s=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}const ch=new Ue,Ql=new jc(1,1),hh=new Hc,uh=new Cu,dh=new Yc,tc=[],ec=[],nc=new Float32Array(16),ic=new Float32Array(9),sc=new Float32Array(4);function qi(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=tc[s];if(r===void 0&&(r=new Float32Array(s),tc[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function ye(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Me(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Pr(i,t){let e=ec[t];e===void 0&&(e=new Int32Array(t),ec[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Hm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function km(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ye(e,t))return;i.uniform2fv(this.addr,t),Me(e,t)}}function Gm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(ye(e,t))return;i.uniform3fv(this.addr,t),Me(e,t)}}function Vm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ye(e,t))return;i.uniform4fv(this.addr,t),Me(e,t)}}function Wm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ye(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Me(e,t)}else{if(ye(e,n))return;sc.set(n),i.uniformMatrix2fv(this.addr,!1,sc),Me(e,n)}}function Xm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ye(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Me(e,t)}else{if(ye(e,n))return;ic.set(n),i.uniformMatrix3fv(this.addr,!1,ic),Me(e,n)}}function Ym(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ye(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Me(e,t)}else{if(ye(e,n))return;nc.set(n),i.uniformMatrix4fv(this.addr,!1,nc),Me(e,n)}}function Zm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function qm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ye(e,t))return;i.uniform2iv(this.addr,t),Me(e,t)}}function jm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ye(e,t))return;i.uniform3iv(this.addr,t),Me(e,t)}}function Km(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ye(e,t))return;i.uniform4iv(this.addr,t),Me(e,t)}}function Jm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function $m(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ye(e,t))return;i.uniform2uiv(this.addr,t),Me(e,t)}}function Qm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ye(e,t))return;i.uniform3uiv(this.addr,t),Me(e,t)}}function tg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ye(e,t))return;i.uniform4uiv(this.addr,t),Me(e,t)}}function eg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Ql.compareFunction=Oc,r=Ql):r=ch,e.setTexture2D(t||r,s)}function ng(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||uh,s)}function ig(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||dh,s)}function sg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||hh,s)}function rg(i){switch(i){case 5126:return Hm;case 35664:return km;case 35665:return Gm;case 35666:return Vm;case 35674:return Wm;case 35675:return Xm;case 35676:return Ym;case 5124:case 35670:return Zm;case 35667:case 35671:return qm;case 35668:case 35672:return jm;case 35669:case 35673:return Km;case 5125:return Jm;case 36294:return $m;case 36295:return Qm;case 36296:return tg;case 35678:case 36198:case 36298:case 36306:case 35682:return eg;case 35679:case 36299:case 36307:return ng;case 35680:case 36300:case 36308:case 36293:return ig;case 36289:case 36303:case 36311:case 36292:return sg}}function og(i,t){i.uniform1fv(this.addr,t)}function ag(i,t){const e=qi(t,this.size,2);i.uniform2fv(this.addr,e)}function lg(i,t){const e=qi(t,this.size,3);i.uniform3fv(this.addr,e)}function cg(i,t){const e=qi(t,this.size,4);i.uniform4fv(this.addr,e)}function hg(i,t){const e=qi(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function ug(i,t){const e=qi(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function dg(i,t){const e=qi(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function fg(i,t){i.uniform1iv(this.addr,t)}function pg(i,t){i.uniform2iv(this.addr,t)}function mg(i,t){i.uniform3iv(this.addr,t)}function gg(i,t){i.uniform4iv(this.addr,t)}function _g(i,t){i.uniform1uiv(this.addr,t)}function xg(i,t){i.uniform2uiv(this.addr,t)}function vg(i,t){i.uniform3uiv(this.addr,t)}function yg(i,t){i.uniform4uiv(this.addr,t)}function Mg(i,t,e){const n=this.cache,s=t.length,r=Pr(e,s);ye(n,r)||(i.uniform1iv(this.addr,r),Me(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||ch,r[o])}function Sg(i,t,e){const n=this.cache,s=t.length,r=Pr(e,s);ye(n,r)||(i.uniform1iv(this.addr,r),Me(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||uh,r[o])}function Eg(i,t,e){const n=this.cache,s=t.length,r=Pr(e,s);ye(n,r)||(i.uniform1iv(this.addr,r),Me(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||dh,r[o])}function bg(i,t,e){const n=this.cache,s=t.length,r=Pr(e,s);ye(n,r)||(i.uniform1iv(this.addr,r),Me(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||hh,r[o])}function wg(i){switch(i){case 5126:return og;case 35664:return ag;case 35665:return lg;case 35666:return cg;case 35674:return hg;case 35675:return ug;case 35676:return dg;case 5124:case 35670:return fg;case 35667:case 35671:return pg;case 35668:case 35672:return mg;case 35669:case 35673:return gg;case 5125:return _g;case 36294:return xg;case 36295:return vg;case 36296:return yg;case 35678:case 36198:case 36298:case 36306:case 35682:return Mg;case 35679:case 36299:case 36307:return Sg;case 35680:case 36300:case 36308:case 36293:return Eg;case 36289:case 36303:case 36311:case 36292:return bg}}class Tg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=rg(e.type)}}class Ag{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=wg(e.type)}}class Rg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const _o=/(\w+)(\])?(\[|\.)?/g;function rc(i,t){i.seq.push(t),i.map[t.id]=t}function Cg(i,t,e){const n=i.name,s=n.length;for(_o.lastIndex=0;;){const r=_o.exec(n),o=_o.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){rc(e,l===void 0?new Tg(a,i,t):new Ag(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new Rg(a),rc(e,u)),e=u}}}class ur{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);Cg(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function oc(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Pg=37297;let Dg=0;function Lg(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const ac=new kt;function Ig(i){$t._getMatrix(ac,$t.workingColorSpace,i);const t=`mat3( ${ac.elements.map(e=>e.toFixed(4))} )`;switch($t.getTransfer(i)){case _r:return[t,"LinearTransferOETF"];case ie:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function lc(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+Lg(i.getShaderSource(t),a)}else return r}function Ug(i,t){const e=Ig(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Ng(i,t){let e;switch(t){case iu:e="Linear";break;case su:e="Reinhard";break;case ru:e="Cineon";break;case Ac:e="ACESFilmic";break;case au:e="AgX";break;case lu:e="Neutral";break;case ou:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const rr=new D;function Fg(){$t.getLuminanceCoefficients(rr);const i=rr.x.toFixed(4),t=rr.y.toFixed(4),e=rr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Og(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(os).join(`
`)}function Bg(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function zg(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function os(i){return i!==""}function cc(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function hc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Hg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ma(i){return i.replace(Hg,Gg)}const kg=new Map;function Gg(i,t){let e=Gt[t];if(e===void 0){const n=kg.get(t);if(n!==void 0)e=Gt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Ma(e)}const Vg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function uc(i){return i.replace(Vg,Wg)}function Wg(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function dc(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Xg(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===bc?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===wc?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Cn&&(t="SHADOWMAP_TYPE_VSM"),t}function Yg(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Bi:case zi:t="ENVMAP_TYPE_CUBE";break;case Ar:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Zg(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case zi:t="ENVMAP_MODE_REFRACTION";break}return t}function qg(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Tc:t="ENVMAP_BLENDING_MULTIPLY";break;case eu:t="ENVMAP_BLENDING_MIX";break;case nu:t="ENVMAP_BLENDING_ADD";break}return t}function jg(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function Kg(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const c=Xg(e),l=Yg(e),h=Zg(e),u=qg(e),f=jg(e),p=Og(e),g=Bg(r),x=s.createProgram();let m,d,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(os).join(`
`),m.length>0&&(m+=`
`),d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(os).join(`
`),d.length>0&&(d+=`
`)):(m=[dc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(os).join(`
`),d=[dc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Xn?"#define TONE_MAPPING":"",e.toneMapping!==Xn?Gt.tonemapping_pars_fragment:"",e.toneMapping!==Xn?Ng("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Gt.colorspace_pars_fragment,Ug("linearToOutputTexel",e.outputColorSpace),Fg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(os).join(`
`)),o=Ma(o),o=cc(o,e),o=hc(o,e),a=Ma(a),a=cc(a,e),a=hc(a,e),o=uc(o),a=uc(a),e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,d=["#define varying in",e.glslVersion===dl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===dl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const v=M+m+o,_=M+d+a,w=oc(s,s.VERTEX_SHADER,v),A=oc(s,s.FRAGMENT_SHADER,_);s.attachShader(x,w),s.attachShader(x,A),e.index0AttributeName!==void 0?s.bindAttribLocation(x,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function R(L){if(i.debug.checkShaderErrors){const O=s.getProgramInfoLog(x)||"",H=s.getShaderInfoLog(w)||"",Y=s.getShaderInfoLog(A)||"",G=O.trim(),X=H.trim(),$=Y.trim();let V=!0,dt=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(V=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,w,A);else{const xt=lc(s,w,"vertex"),Mt=lc(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+G+`
`+xt+`
`+Mt)}else G!==""?console.warn("THREE.WebGLProgram: Program Info Log:",G):(X===""||$==="")&&(dt=!1);dt&&(L.diagnostics={runnable:V,programLog:G,vertexShader:{log:X,prefix:m},fragmentShader:{log:$,prefix:d}})}s.deleteShader(w),s.deleteShader(A),P=new ur(s,x),S=zg(s,x)}let P;this.getUniforms=function(){return P===void 0&&R(this),P};let S;this.getAttributes=function(){return S===void 0&&R(this),S};let E=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=s.getProgramParameter(x,Pg)),E},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Dg++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=w,this.fragmentShader=A,this}let Jg=0;class $g{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Qg(t),e.set(t,n)),n}}class Qg{constructor(t){this.id=Jg++,this.code=t,this.usedTimes=0}}function t0(i,t,e,n,s,r,o){const a=new Ba,c=new $g,l=new Set,h=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures;let p=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(S){return l.add(S),S===0?"uv":`uv${S}`}function m(S,E,L,O,H){const Y=O.fog,G=H.geometry,X=S.isMeshStandardMaterial?O.environment:null,$=(S.isMeshStandardMaterial?e:t).get(S.envMap||X),V=$&&$.mapping===Ar?$.image.height:null,dt=g[S.type];S.precision!==null&&(p=s.getMaxPrecision(S.precision),p!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",p,"instead."));const xt=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Mt=xt!==void 0?xt.length:0;let zt=0;G.morphAttributes.position!==void 0&&(zt=1),G.morphAttributes.normal!==void 0&&(zt=2),G.morphAttributes.color!==void 0&&(zt=3);let jt,ee,Kt,Z;if(dt){const te=dn[dt];jt=te.vertexShader,ee=te.fragmentShader}else jt=S.vertexShader,ee=S.fragmentShader,c.update(S),Kt=c.getVertexShaderID(S),Z=c.getFragmentShaderID(S);const nt=i.getRenderTarget(),yt=i.state.buffers.depth.getReversed(),Pt=H.isInstancedMesh===!0,bt=H.isBatchedMesh===!0,Yt=!!S.map,ae=!!S.matcap,C=!!$,et=!!S.aoMap,K=!!S.lightMap,j=!!S.bumpMap,q=!!S.normalMap,ht=!!S.displacementMap,it=!!S.emissiveMap,ut=!!S.metalnessMap,Ot=!!S.roughnessMap,Ft=S.anisotropy>0,T=S.clearcoat>0,y=S.dispersion>0,F=S.iridescence>0,k=S.sheen>0,tt=S.transmission>0,W=Ft&&!!S.anisotropyMap,Rt=T&&!!S.clearcoatMap,ct=T&&!!S.clearcoatNormalMap,wt=T&&!!S.clearcoatRoughnessMap,Tt=F&&!!S.iridescenceMap,rt=F&&!!S.iridescenceThicknessMap,_t=k&&!!S.sheenColorMap,Ut=k&&!!S.sheenRoughnessMap,Ct=!!S.specularMap,mt=!!S.specularColorMap,Ht=!!S.specularIntensityMap,I=tt&&!!S.transmissionMap,lt=tt&&!!S.thicknessMap,ft=!!S.gradientMap,St=!!S.alphaMap,ot=S.alphaTest>0,J=!!S.alphaHash,At=!!S.extensions;let Bt=Xn;S.toneMapped&&(nt===null||nt.isXRRenderTarget===!0)&&(Bt=i.toneMapping);const le={shaderID:dt,shaderType:S.type,shaderName:S.name,vertexShader:jt,fragmentShader:ee,defines:S.defines,customVertexShaderID:Kt,customFragmentShaderID:Z,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:p,batching:bt,batchingColor:bt&&H._colorsTexture!==null,instancing:Pt,instancingColor:Pt&&H.instanceColor!==null,instancingMorph:Pt&&H.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:nt===null?i.outputColorSpace:nt.isXRRenderTarget===!0?nt.texture.colorSpace:Hi,alphaToCoverage:!!S.alphaToCoverage,map:Yt,matcap:ae,envMap:C,envMapMode:C&&$.mapping,envMapCubeUVHeight:V,aoMap:et,lightMap:K,bumpMap:j,normalMap:q,displacementMap:f&&ht,emissiveMap:it,normalMapObjectSpace:q&&S.normalMapType===du,normalMapTangentSpace:q&&S.normalMapType===Fc,metalnessMap:ut,roughnessMap:Ot,anisotropy:Ft,anisotropyMap:W,clearcoat:T,clearcoatMap:Rt,clearcoatNormalMap:ct,clearcoatRoughnessMap:wt,dispersion:y,iridescence:F,iridescenceMap:Tt,iridescenceThicknessMap:rt,sheen:k,sheenColorMap:_t,sheenRoughnessMap:Ut,specularMap:Ct,specularColorMap:mt,specularIntensityMap:Ht,transmission:tt,transmissionMap:I,thicknessMap:lt,gradientMap:ft,opaque:S.transparent===!1&&S.blending===Ni&&S.alphaToCoverage===!1,alphaMap:St,alphaTest:ot,alphaHash:J,combine:S.combine,mapUv:Yt&&x(S.map.channel),aoMapUv:et&&x(S.aoMap.channel),lightMapUv:K&&x(S.lightMap.channel),bumpMapUv:j&&x(S.bumpMap.channel),normalMapUv:q&&x(S.normalMap.channel),displacementMapUv:ht&&x(S.displacementMap.channel),emissiveMapUv:it&&x(S.emissiveMap.channel),metalnessMapUv:ut&&x(S.metalnessMap.channel),roughnessMapUv:Ot&&x(S.roughnessMap.channel),anisotropyMapUv:W&&x(S.anisotropyMap.channel),clearcoatMapUv:Rt&&x(S.clearcoatMap.channel),clearcoatNormalMapUv:ct&&x(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:wt&&x(S.clearcoatRoughnessMap.channel),iridescenceMapUv:Tt&&x(S.iridescenceMap.channel),iridescenceThicknessMapUv:rt&&x(S.iridescenceThicknessMap.channel),sheenColorMapUv:_t&&x(S.sheenColorMap.channel),sheenRoughnessMapUv:Ut&&x(S.sheenRoughnessMap.channel),specularMapUv:Ct&&x(S.specularMap.channel),specularColorMapUv:mt&&x(S.specularColorMap.channel),specularIntensityMapUv:Ht&&x(S.specularIntensityMap.channel),transmissionMapUv:I&&x(S.transmissionMap.channel),thicknessMapUv:lt&&x(S.thicknessMap.channel),alphaMapUv:St&&x(S.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(q||Ft),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:H.isPoints===!0&&!!G.attributes.uv&&(Yt||St),fog:!!Y,useFog:S.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:S.flatShading===!0&&S.wireframe===!1,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:yt,skinning:H.isSkinnedMesh===!0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:Mt,morphTextureStride:zt,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:Bt,decodeVideoTexture:Yt&&S.map.isVideoTexture===!0&&$t.getTransfer(S.map.colorSpace)===ie,decodeVideoTextureEmissive:it&&S.emissiveMap.isVideoTexture===!0&&$t.getTransfer(S.emissiveMap.colorSpace)===ie,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===tn,flipSided:S.side===Ie,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:At&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(At&&S.extensions.multiDraw===!0||bt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return le.vertexUv1s=l.has(1),le.vertexUv2s=l.has(2),le.vertexUv3s=l.has(3),l.clear(),le}function d(S){const E=[];if(S.shaderID?E.push(S.shaderID):(E.push(S.customVertexShaderID),E.push(S.customFragmentShaderID)),S.defines!==void 0)for(const L in S.defines)E.push(L),E.push(S.defines[L]);return S.isRawShaderMaterial===!1&&(M(E,S),v(E,S),E.push(i.outputColorSpace)),E.push(S.customProgramCacheKey),E.join()}function M(S,E){S.push(E.precision),S.push(E.outputColorSpace),S.push(E.envMapMode),S.push(E.envMapCubeUVHeight),S.push(E.mapUv),S.push(E.alphaMapUv),S.push(E.lightMapUv),S.push(E.aoMapUv),S.push(E.bumpMapUv),S.push(E.normalMapUv),S.push(E.displacementMapUv),S.push(E.emissiveMapUv),S.push(E.metalnessMapUv),S.push(E.roughnessMapUv),S.push(E.anisotropyMapUv),S.push(E.clearcoatMapUv),S.push(E.clearcoatNormalMapUv),S.push(E.clearcoatRoughnessMapUv),S.push(E.iridescenceMapUv),S.push(E.iridescenceThicknessMapUv),S.push(E.sheenColorMapUv),S.push(E.sheenRoughnessMapUv),S.push(E.specularMapUv),S.push(E.specularColorMapUv),S.push(E.specularIntensityMapUv),S.push(E.transmissionMapUv),S.push(E.thicknessMapUv),S.push(E.combine),S.push(E.fogExp2),S.push(E.sizeAttenuation),S.push(E.morphTargetsCount),S.push(E.morphAttributeCount),S.push(E.numDirLights),S.push(E.numPointLights),S.push(E.numSpotLights),S.push(E.numSpotLightMaps),S.push(E.numHemiLights),S.push(E.numRectAreaLights),S.push(E.numDirLightShadows),S.push(E.numPointLightShadows),S.push(E.numSpotLightShadows),S.push(E.numSpotLightShadowsWithMaps),S.push(E.numLightProbes),S.push(E.shadowMapType),S.push(E.toneMapping),S.push(E.numClippingPlanes),S.push(E.numClipIntersection),S.push(E.depthPacking)}function v(S,E){a.disableAll(),E.supportsVertexTextures&&a.enable(0),E.instancing&&a.enable(1),E.instancingColor&&a.enable(2),E.instancingMorph&&a.enable(3),E.matcap&&a.enable(4),E.envMap&&a.enable(5),E.normalMapObjectSpace&&a.enable(6),E.normalMapTangentSpace&&a.enable(7),E.clearcoat&&a.enable(8),E.iridescence&&a.enable(9),E.alphaTest&&a.enable(10),E.vertexColors&&a.enable(11),E.vertexAlphas&&a.enable(12),E.vertexUv1s&&a.enable(13),E.vertexUv2s&&a.enable(14),E.vertexUv3s&&a.enable(15),E.vertexTangents&&a.enable(16),E.anisotropy&&a.enable(17),E.alphaHash&&a.enable(18),E.batching&&a.enable(19),E.dispersion&&a.enable(20),E.batchingColor&&a.enable(21),E.gradientMap&&a.enable(22),S.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reversedDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),S.push(a.mask)}function _(S){const E=g[S.type];let L;if(E){const O=dn[E];L=Gu.clone(O.uniforms)}else L=S.uniforms;return L}function w(S,E){let L;for(let O=0,H=h.length;O<H;O++){const Y=h[O];if(Y.cacheKey===E){L=Y,++L.usedTimes;break}}return L===void 0&&(L=new Kg(i,E,S,r),h.push(L)),L}function A(S){if(--S.usedTimes===0){const E=h.indexOf(S);h[E]=h[h.length-1],h.pop(),S.destroy()}}function R(S){c.remove(S)}function P(){c.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:_,acquireProgram:w,releaseProgram:A,releaseShaderCache:R,programs:h,dispose:P}}function e0(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,c){i.get(o)[a]=c}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function n0(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function fc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function pc(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u,f,p,g,x,m){let d=i[t];return d===void 0?(d={id:u.id,object:u,geometry:f,material:p,groupOrder:g,renderOrder:u.renderOrder,z:x,group:m},i[t]=d):(d.id=u.id,d.object=u,d.geometry=f,d.material=p,d.groupOrder=g,d.renderOrder=u.renderOrder,d.z=x,d.group=m),t++,d}function a(u,f,p,g,x,m){const d=o(u,f,p,g,x,m);p.transmission>0?n.push(d):p.transparent===!0?s.push(d):e.push(d)}function c(u,f,p,g,x,m){const d=o(u,f,p,g,x,m);p.transmission>0?n.unshift(d):p.transparent===!0?s.unshift(d):e.unshift(d)}function l(u,f){e.length>1&&e.sort(u||n0),n.length>1&&n.sort(f||fc),s.length>1&&s.sort(f||fc)}function h(){for(let u=t,f=i.length;u<f;u++){const p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function i0(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new pc,i.set(n,[o])):s>=r.length?(o=new pc,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function s0(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new D,color:new Wt};break;case"SpotLight":e={position:new D,direction:new D,color:new Wt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new D,color:new Wt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new D,skyColor:new Wt,groundColor:new Wt};break;case"RectAreaLight":e={color:new Wt,position:new D,halfWidth:new D,halfHeight:new D};break}return i[t.id]=e,e}}}function r0(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Q};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Q};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Q,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let o0=0;function a0(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function l0(i){const t=new s0,e=r0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new D);const s=new D,r=new oe,o=new oe;function a(l){let h=0,u=0,f=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let p=0,g=0,x=0,m=0,d=0,M=0,v=0,_=0,w=0,A=0,R=0;l.sort(a0);for(let S=0,E=l.length;S<E;S++){const L=l[S],O=L.color,H=L.intensity,Y=L.distance,G=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)h+=O.r*H,u+=O.g*H,f+=O.b*H;else if(L.isLightProbe){for(let X=0;X<9;X++)n.probe[X].addScaledVector(L.sh.coefficients[X],H);R++}else if(L.isDirectionalLight){const X=t.get(L);if(X.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const $=L.shadow,V=e.get(L);V.shadowIntensity=$.intensity,V.shadowBias=$.bias,V.shadowNormalBias=$.normalBias,V.shadowRadius=$.radius,V.shadowMapSize=$.mapSize,n.directionalShadow[p]=V,n.directionalShadowMap[p]=G,n.directionalShadowMatrix[p]=L.shadow.matrix,M++}n.directional[p]=X,p++}else if(L.isSpotLight){const X=t.get(L);X.position.setFromMatrixPosition(L.matrixWorld),X.color.copy(O).multiplyScalar(H),X.distance=Y,X.coneCos=Math.cos(L.angle),X.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),X.decay=L.decay,n.spot[x]=X;const $=L.shadow;if(L.map&&(n.spotLightMap[w]=L.map,w++,$.updateMatrices(L),L.castShadow&&A++),n.spotLightMatrix[x]=$.matrix,L.castShadow){const V=e.get(L);V.shadowIntensity=$.intensity,V.shadowBias=$.bias,V.shadowNormalBias=$.normalBias,V.shadowRadius=$.radius,V.shadowMapSize=$.mapSize,n.spotShadow[x]=V,n.spotShadowMap[x]=G,_++}x++}else if(L.isRectAreaLight){const X=t.get(L);X.color.copy(O).multiplyScalar(H),X.halfWidth.set(L.width*.5,0,0),X.halfHeight.set(0,L.height*.5,0),n.rectArea[m]=X,m++}else if(L.isPointLight){const X=t.get(L);if(X.color.copy(L.color).multiplyScalar(L.intensity),X.distance=L.distance,X.decay=L.decay,L.castShadow){const $=L.shadow,V=e.get(L);V.shadowIntensity=$.intensity,V.shadowBias=$.bias,V.shadowNormalBias=$.normalBias,V.shadowRadius=$.radius,V.shadowMapSize=$.mapSize,V.shadowCameraNear=$.camera.near,V.shadowCameraFar=$.camera.far,n.pointShadow[g]=V,n.pointShadowMap[g]=G,n.pointShadowMatrix[g]=L.shadow.matrix,v++}n.point[g]=X,g++}else if(L.isHemisphereLight){const X=t.get(L);X.skyColor.copy(L.color).multiplyScalar(H),X.groundColor.copy(L.groundColor).multiplyScalar(H),n.hemi[d]=X,d++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=pt.LTC_FLOAT_1,n.rectAreaLTC2=pt.LTC_FLOAT_2):(n.rectAreaLTC1=pt.LTC_HALF_1,n.rectAreaLTC2=pt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;const P=n.hash;(P.directionalLength!==p||P.pointLength!==g||P.spotLength!==x||P.rectAreaLength!==m||P.hemiLength!==d||P.numDirectionalShadows!==M||P.numPointShadows!==v||P.numSpotShadows!==_||P.numSpotMaps!==w||P.numLightProbes!==R)&&(n.directional.length=p,n.spot.length=x,n.rectArea.length=m,n.point.length=g,n.hemi.length=d,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=_+w-A,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=R,P.directionalLength=p,P.pointLength=g,P.spotLength=x,P.rectAreaLength=m,P.hemiLength=d,P.numDirectionalShadows=M,P.numPointShadows=v,P.numSpotShadows=_,P.numSpotMaps=w,P.numLightProbes=R,n.version=o0++)}function c(l,h){let u=0,f=0,p=0,g=0,x=0;const m=h.matrixWorldInverse;for(let d=0,M=l.length;d<M;d++){const v=l[d];if(v.isDirectionalLight){const _=n.directional[u];_.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(m),u++}else if(v.isSpotLight){const _=n.spot[p];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(m),_.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(m),p++}else if(v.isRectAreaLight){const _=n.rectArea[g];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(m),o.identity(),r.copy(v.matrixWorld),r.premultiply(m),o.extractRotation(r),_.halfWidth.set(v.width*.5,0,0),_.halfHeight.set(0,v.height*.5,0),_.halfWidth.applyMatrix4(o),_.halfHeight.applyMatrix4(o),g++}else if(v.isPointLight){const _=n.point[f];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(m),f++}else if(v.isHemisphereLight){const _=n.hemi[x];_.direction.setFromMatrixPosition(v.matrixWorld),_.direction.transformDirection(m),x++}}}return{setup:a,setupView:c,state:n}}function mc(i){const t=new l0(i),e=[],n=[];function s(h){l.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function c0(i){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new mc(i),t.set(s,[a])):r>=o.length?(a=new mc(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}const h0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,u0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function d0(i,t,e){let n=new za;const s=new Q,r=new Q,o=new me,a=new Ud({depthPacking:uu}),c=new Nd,l={},h=e.maxTextureSize,u={[Zn]:Ie,[Ie]:Zn,[tn]:tn},f=new qn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Q},radius:{value:4}},vertexShader:h0,fragmentShader:u0}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const g=new Ee;g.setAttribute("position",new nn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new qt(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=bc;let d=this.type;this.render=function(A,R,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;const S=i.getRenderTarget(),E=i.getActiveCubeFace(),L=i.getActiveMipmapLevel(),O=i.state;O.setBlending(Wn),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);const H=d!==Cn&&this.type===Cn,Y=d===Cn&&this.type!==Cn;for(let G=0,X=A.length;G<X;G++){const $=A[G],V=$.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);const dt=V.getFrameExtents();if(s.multiply(dt),r.copy(V.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/dt.x),s.x=r.x*dt.x,V.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/dt.y),s.y=r.y*dt.y,V.mapSize.y=r.y)),V.map===null||H===!0||Y===!0){const Mt=this.type!==Cn?{minFilter:qe,magFilter:qe}:{};V.map!==null&&V.map.dispose(),V.map=new ui(s.x,s.y,Mt),V.map.texture.name=$.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();const xt=V.getViewportCount();for(let Mt=0;Mt<xt;Mt++){const zt=V.getViewport(Mt);o.set(r.x*zt.x,r.y*zt.y,r.x*zt.z,r.y*zt.w),O.viewport(o),V.updateMatrices($,Mt),n=V.getFrustum(),_(R,P,V.camera,$,this.type)}V.isPointLightShadow!==!0&&this.type===Cn&&M(V,P),V.needsUpdate=!1}d=this.type,m.needsUpdate=!1,i.setRenderTarget(S,E,L)};function M(A,R){const P=t.update(x);f.defines.VSM_SAMPLES!==A.blurSamples&&(f.defines.VSM_SAMPLES=A.blurSamples,p.defines.VSM_SAMPLES=A.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new ui(s.x,s.y)),f.uniforms.shadow_pass.value=A.map.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(R,null,P,f,x,null),p.uniforms.shadow_pass.value=A.mapPass.texture,p.uniforms.resolution.value=A.mapSize,p.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(R,null,P,p,x,null)}function v(A,R,P,S){let E=null;const L=P.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(L!==void 0)E=L;else if(E=P.isPointLight===!0?c:a,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const O=E.uuid,H=R.uuid;let Y=l[O];Y===void 0&&(Y={},l[O]=Y);let G=Y[H];G===void 0&&(G=E.clone(),Y[H]=G,R.addEventListener("dispose",w)),E=G}if(E.visible=R.visible,E.wireframe=R.wireframe,S===Cn?E.side=R.shadowSide!==null?R.shadowSide:R.side:E.side=R.shadowSide!==null?R.shadowSide:u[R.side],E.alphaMap=R.alphaMap,E.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,E.map=R.map,E.clipShadows=R.clipShadows,E.clippingPlanes=R.clippingPlanes,E.clipIntersection=R.clipIntersection,E.displacementMap=R.displacementMap,E.displacementScale=R.displacementScale,E.displacementBias=R.displacementBias,E.wireframeLinewidth=R.wireframeLinewidth,E.linewidth=R.linewidth,P.isPointLight===!0&&E.isMeshDistanceMaterial===!0){const O=i.properties.get(E);O.light=P}return E}function _(A,R,P,S,E){if(A.visible===!1)return;if(A.layers.test(R.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&E===Cn)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,A.matrixWorld);const H=t.update(A),Y=A.material;if(Array.isArray(Y)){const G=H.groups;for(let X=0,$=G.length;X<$;X++){const V=G[X],dt=Y[V.materialIndex];if(dt&&dt.visible){const xt=v(A,dt,S,E);A.onBeforeShadow(i,A,R,P,H,xt,V),i.renderBufferDirect(P,null,H,xt,A,V),A.onAfterShadow(i,A,R,P,H,xt,V)}}}else if(Y.visible){const G=v(A,Y,S,E);A.onBeforeShadow(i,A,R,P,H,G,null),i.renderBufferDirect(P,null,H,G,A,null),A.onAfterShadow(i,A,R,P,H,G,null)}}const O=A.children;for(let H=0,Y=O.length;H<Y;H++)_(O[H],R,P,S,E)}function w(A){A.target.removeEventListener("dispose",w);for(const P in l){const S=l[P],E=A.target.uuid;E in S&&(S[E].dispose(),delete S[E])}}}const f0={[Co]:Po,[Do]:Uo,[Lo]:No,[Oi]:Io,[Po]:Co,[Uo]:Do,[No]:Lo,[Io]:Oi};function p0(i,t){function e(){let I=!1;const lt=new me;let ft=null;const St=new me(0,0,0,0);return{setMask:function(ot){ft!==ot&&!I&&(i.colorMask(ot,ot,ot,ot),ft=ot)},setLocked:function(ot){I=ot},setClear:function(ot,J,At,Bt,le){le===!0&&(ot*=Bt,J*=Bt,At*=Bt),lt.set(ot,J,At,Bt),St.equals(lt)===!1&&(i.clearColor(ot,J,At,Bt),St.copy(lt))},reset:function(){I=!1,ft=null,St.set(-1,0,0,0)}}}function n(){let I=!1,lt=!1,ft=null,St=null,ot=null;return{setReversed:function(J){if(lt!==J){const At=t.get("EXT_clip_control");J?At.clipControlEXT(At.LOWER_LEFT_EXT,At.ZERO_TO_ONE_EXT):At.clipControlEXT(At.LOWER_LEFT_EXT,At.NEGATIVE_ONE_TO_ONE_EXT),lt=J;const Bt=ot;ot=null,this.setClear(Bt)}},getReversed:function(){return lt},setTest:function(J){J?nt(i.DEPTH_TEST):yt(i.DEPTH_TEST)},setMask:function(J){ft!==J&&!I&&(i.depthMask(J),ft=J)},setFunc:function(J){if(lt&&(J=f0[J]),St!==J){switch(J){case Co:i.depthFunc(i.NEVER);break;case Po:i.depthFunc(i.ALWAYS);break;case Do:i.depthFunc(i.LESS);break;case Oi:i.depthFunc(i.LEQUAL);break;case Lo:i.depthFunc(i.EQUAL);break;case Io:i.depthFunc(i.GEQUAL);break;case Uo:i.depthFunc(i.GREATER);break;case No:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}St=J}},setLocked:function(J){I=J},setClear:function(J){ot!==J&&(lt&&(J=1-J),i.clearDepth(J),ot=J)},reset:function(){I=!1,ft=null,St=null,ot=null,lt=!1}}}function s(){let I=!1,lt=null,ft=null,St=null,ot=null,J=null,At=null,Bt=null,le=null;return{setTest:function(te){I||(te?nt(i.STENCIL_TEST):yt(i.STENCIL_TEST))},setMask:function(te){lt!==te&&!I&&(i.stencilMask(te),lt=te)},setFunc:function(te,Sn,un){(ft!==te||St!==Sn||ot!==un)&&(i.stencilFunc(te,Sn,un),ft=te,St=Sn,ot=un)},setOp:function(te,Sn,un){(J!==te||At!==Sn||Bt!==un)&&(i.stencilOp(te,Sn,un),J=te,At=Sn,Bt=un)},setLocked:function(te){I=te},setClear:function(te){le!==te&&(i.clearStencil(te),le=te)},reset:function(){I=!1,lt=null,ft=null,St=null,ot=null,J=null,At=null,Bt=null,le=null}}}const r=new e,o=new n,a=new s,c=new WeakMap,l=new WeakMap;let h={},u={},f=new WeakMap,p=[],g=null,x=!1,m=null,d=null,M=null,v=null,_=null,w=null,A=null,R=new Wt(0,0,0),P=0,S=!1,E=null,L=null,O=null,H=null,Y=null;const G=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let X=!1,$=0;const V=i.getParameter(i.VERSION);V.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(V)[1]),X=$>=1):V.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),X=$>=2);let dt=null,xt={};const Mt=i.getParameter(i.SCISSOR_BOX),zt=i.getParameter(i.VIEWPORT),jt=new me().fromArray(Mt),ee=new me().fromArray(zt);function Kt(I,lt,ft,St){const ot=new Uint8Array(4),J=i.createTexture();i.bindTexture(I,J),i.texParameteri(I,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(I,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let At=0;At<ft;At++)I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY?i.texImage3D(lt,0,i.RGBA,1,1,St,0,i.RGBA,i.UNSIGNED_BYTE,ot):i.texImage2D(lt+At,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ot);return J}const Z={};Z[i.TEXTURE_2D]=Kt(i.TEXTURE_2D,i.TEXTURE_2D,1),Z[i.TEXTURE_CUBE_MAP]=Kt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Z[i.TEXTURE_2D_ARRAY]=Kt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Z[i.TEXTURE_3D]=Kt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),nt(i.DEPTH_TEST),o.setFunc(Oi),j(!1),q(ol),nt(i.CULL_FACE),et(Wn);function nt(I){h[I]!==!0&&(i.enable(I),h[I]=!0)}function yt(I){h[I]!==!1&&(i.disable(I),h[I]=!1)}function Pt(I,lt){return u[I]!==lt?(i.bindFramebuffer(I,lt),u[I]=lt,I===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=lt),I===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=lt),!0):!1}function bt(I,lt){let ft=p,St=!1;if(I){ft=f.get(lt),ft===void 0&&(ft=[],f.set(lt,ft));const ot=I.textures;if(ft.length!==ot.length||ft[0]!==i.COLOR_ATTACHMENT0){for(let J=0,At=ot.length;J<At;J++)ft[J]=i.COLOR_ATTACHMENT0+J;ft.length=ot.length,St=!0}}else ft[0]!==i.BACK&&(ft[0]=i.BACK,St=!0);St&&i.drawBuffers(ft)}function Yt(I){return g!==I?(i.useProgram(I),g=I,!0):!1}const ae={[oi]:i.FUNC_ADD,[Bh]:i.FUNC_SUBTRACT,[zh]:i.FUNC_REVERSE_SUBTRACT};ae[Hh]=i.MIN,ae[kh]=i.MAX;const C={[Gh]:i.ZERO,[Vh]:i.ONE,[Wh]:i.SRC_COLOR,[Ao]:i.SRC_ALPHA,[Kh]:i.SRC_ALPHA_SATURATE,[qh]:i.DST_COLOR,[Yh]:i.DST_ALPHA,[Xh]:i.ONE_MINUS_SRC_COLOR,[Ro]:i.ONE_MINUS_SRC_ALPHA,[jh]:i.ONE_MINUS_DST_COLOR,[Zh]:i.ONE_MINUS_DST_ALPHA,[Jh]:i.CONSTANT_COLOR,[$h]:i.ONE_MINUS_CONSTANT_COLOR,[Qh]:i.CONSTANT_ALPHA,[tu]:i.ONE_MINUS_CONSTANT_ALPHA};function et(I,lt,ft,St,ot,J,At,Bt,le,te){if(I===Wn){x===!0&&(yt(i.BLEND),x=!1);return}if(x===!1&&(nt(i.BLEND),x=!0),I!==Oh){if(I!==m||te!==S){if((d!==oi||_!==oi)&&(i.blendEquation(i.FUNC_ADD),d=oi,_=oi),te)switch(I){case Ni:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case al:i.blendFunc(i.ONE,i.ONE);break;case ll:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case cl:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case Ni:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case al:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case ll:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case cl:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}M=null,v=null,w=null,A=null,R.set(0,0,0),P=0,m=I,S=te}return}ot=ot||lt,J=J||ft,At=At||St,(lt!==d||ot!==_)&&(i.blendEquationSeparate(ae[lt],ae[ot]),d=lt,_=ot),(ft!==M||St!==v||J!==w||At!==A)&&(i.blendFuncSeparate(C[ft],C[St],C[J],C[At]),M=ft,v=St,w=J,A=At),(Bt.equals(R)===!1||le!==P)&&(i.blendColor(Bt.r,Bt.g,Bt.b,le),R.copy(Bt),P=le),m=I,S=!1}function K(I,lt){I.side===tn?yt(i.CULL_FACE):nt(i.CULL_FACE);let ft=I.side===Ie;lt&&(ft=!ft),j(ft),I.blending===Ni&&I.transparent===!1?et(Wn):et(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),o.setFunc(I.depthFunc),o.setTest(I.depthTest),o.setMask(I.depthWrite),r.setMask(I.colorWrite);const St=I.stencilWrite;a.setTest(St),St&&(a.setMask(I.stencilWriteMask),a.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),a.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),it(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?nt(i.SAMPLE_ALPHA_TO_COVERAGE):yt(i.SAMPLE_ALPHA_TO_COVERAGE)}function j(I){E!==I&&(I?i.frontFace(i.CW):i.frontFace(i.CCW),E=I)}function q(I){I!==Nh?(nt(i.CULL_FACE),I!==L&&(I===ol?i.cullFace(i.BACK):I===Fh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):yt(i.CULL_FACE),L=I}function ht(I){I!==O&&(X&&i.lineWidth(I),O=I)}function it(I,lt,ft){I?(nt(i.POLYGON_OFFSET_FILL),(H!==lt||Y!==ft)&&(i.polygonOffset(lt,ft),H=lt,Y=ft)):yt(i.POLYGON_OFFSET_FILL)}function ut(I){I?nt(i.SCISSOR_TEST):yt(i.SCISSOR_TEST)}function Ot(I){I===void 0&&(I=i.TEXTURE0+G-1),dt!==I&&(i.activeTexture(I),dt=I)}function Ft(I,lt,ft){ft===void 0&&(dt===null?ft=i.TEXTURE0+G-1:ft=dt);let St=xt[ft];St===void 0&&(St={type:void 0,texture:void 0},xt[ft]=St),(St.type!==I||St.texture!==lt)&&(dt!==ft&&(i.activeTexture(ft),dt=ft),i.bindTexture(I,lt||Z[I]),St.type=I,St.texture=lt)}function T(){const I=xt[dt];I!==void 0&&I.type!==void 0&&(i.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function y(){try{i.compressedTexImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function F(){try{i.compressedTexImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function k(){try{i.texSubImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function tt(){try{i.texSubImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function W(){try{i.compressedTexSubImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Rt(){try{i.compressedTexSubImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ct(){try{i.texStorage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function wt(){try{i.texStorage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Tt(){try{i.texImage2D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function rt(){try{i.texImage3D(...arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function _t(I){jt.equals(I)===!1&&(i.scissor(I.x,I.y,I.z,I.w),jt.copy(I))}function Ut(I){ee.equals(I)===!1&&(i.viewport(I.x,I.y,I.z,I.w),ee.copy(I))}function Ct(I,lt){let ft=l.get(lt);ft===void 0&&(ft=new WeakMap,l.set(lt,ft));let St=ft.get(I);St===void 0&&(St=i.getUniformBlockIndex(lt,I.name),ft.set(I,St))}function mt(I,lt){const St=l.get(lt).get(I);c.get(lt)!==St&&(i.uniformBlockBinding(lt,St,I.__bindingPointIndex),c.set(lt,St))}function Ht(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},dt=null,xt={},u={},f=new WeakMap,p=[],g=null,x=!1,m=null,d=null,M=null,v=null,_=null,w=null,A=null,R=new Wt(0,0,0),P=0,S=!1,E=null,L=null,O=null,H=null,Y=null,jt.set(0,0,i.canvas.width,i.canvas.height),ee.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:nt,disable:yt,bindFramebuffer:Pt,drawBuffers:bt,useProgram:Yt,setBlending:et,setMaterial:K,setFlipSided:j,setCullFace:q,setLineWidth:ht,setPolygonOffset:it,setScissorTest:ut,activeTexture:Ot,bindTexture:Ft,unbindTexture:T,compressedTexImage2D:y,compressedTexImage3D:F,texImage2D:Tt,texImage3D:rt,updateUBOMapping:Ct,uniformBlockBinding:mt,texStorage2D:ct,texStorage3D:wt,texSubImage2D:k,texSubImage3D:tt,compressedTexSubImage2D:W,compressedTexSubImage3D:Rt,scissor:_t,viewport:Ut,reset:Ht}}function m0(i,t,e,n,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Q,h=new WeakMap;let u;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(T,y){return p?new OffscreenCanvas(T,y):vr("canvas")}function x(T,y,F){let k=1;const tt=Ft(T);if((tt.width>F||tt.height>F)&&(k=F/Math.max(tt.width,tt.height)),k<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const W=Math.floor(k*tt.width),Rt=Math.floor(k*tt.height);u===void 0&&(u=g(W,Rt));const ct=y?g(W,Rt):u;return ct.width=W,ct.height=Rt,ct.getContext("2d").drawImage(T,0,0,W,Rt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+tt.width+"x"+tt.height+") to ("+W+"x"+Rt+")."),ct}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+tt.width+"x"+tt.height+")."),T;return T}function m(T){return T.generateMipmaps}function d(T){i.generateMipmap(T)}function M(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(T,y,F,k,tt=!1){if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let W=y;if(y===i.RED&&(F===i.FLOAT&&(W=i.R32F),F===i.HALF_FLOAT&&(W=i.R16F),F===i.UNSIGNED_BYTE&&(W=i.R8)),y===i.RED_INTEGER&&(F===i.UNSIGNED_BYTE&&(W=i.R8UI),F===i.UNSIGNED_SHORT&&(W=i.R16UI),F===i.UNSIGNED_INT&&(W=i.R32UI),F===i.BYTE&&(W=i.R8I),F===i.SHORT&&(W=i.R16I),F===i.INT&&(W=i.R32I)),y===i.RG&&(F===i.FLOAT&&(W=i.RG32F),F===i.HALF_FLOAT&&(W=i.RG16F),F===i.UNSIGNED_BYTE&&(W=i.RG8)),y===i.RG_INTEGER&&(F===i.UNSIGNED_BYTE&&(W=i.RG8UI),F===i.UNSIGNED_SHORT&&(W=i.RG16UI),F===i.UNSIGNED_INT&&(W=i.RG32UI),F===i.BYTE&&(W=i.RG8I),F===i.SHORT&&(W=i.RG16I),F===i.INT&&(W=i.RG32I)),y===i.RGB_INTEGER&&(F===i.UNSIGNED_BYTE&&(W=i.RGB8UI),F===i.UNSIGNED_SHORT&&(W=i.RGB16UI),F===i.UNSIGNED_INT&&(W=i.RGB32UI),F===i.BYTE&&(W=i.RGB8I),F===i.SHORT&&(W=i.RGB16I),F===i.INT&&(W=i.RGB32I)),y===i.RGBA_INTEGER&&(F===i.UNSIGNED_BYTE&&(W=i.RGBA8UI),F===i.UNSIGNED_SHORT&&(W=i.RGBA16UI),F===i.UNSIGNED_INT&&(W=i.RGBA32UI),F===i.BYTE&&(W=i.RGBA8I),F===i.SHORT&&(W=i.RGBA16I),F===i.INT&&(W=i.RGBA32I)),y===i.RGB&&(F===i.UNSIGNED_INT_5_9_9_9_REV&&(W=i.RGB9_E5),F===i.UNSIGNED_INT_10F_11F_11F_REV&&(W=i.R11F_G11F_B10F)),y===i.RGBA){const Rt=tt?_r:$t.getTransfer(k);F===i.FLOAT&&(W=i.RGBA32F),F===i.HALF_FLOAT&&(W=i.RGBA16F),F===i.UNSIGNED_BYTE&&(W=Rt===ie?i.SRGB8_ALPHA8:i.RGBA8),F===i.UNSIGNED_SHORT_4_4_4_4&&(W=i.RGBA4),F===i.UNSIGNED_SHORT_5_5_5_1&&(W=i.RGB5_A1)}return(W===i.R16F||W===i.R32F||W===i.RG16F||W===i.RG32F||W===i.RGBA16F||W===i.RGBA32F)&&t.get("EXT_color_buffer_float"),W}function _(T,y){let F;return T?y===null||y===ci||y===ms?F=i.DEPTH24_STENCIL8:y===pn?F=i.DEPTH32F_STENCIL8:y===ps&&(F=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===ci||y===ms?F=i.DEPTH_COMPONENT24:y===pn?F=i.DEPTH_COMPONENT32F:y===ps&&(F=i.DEPTH_COMPONENT16),F}function w(T,y){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==qe&&T.minFilter!==fn?Math.log2(Math.max(y.width,y.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?y.mipmaps.length:1}function A(T){const y=T.target;y.removeEventListener("dispose",A),P(y),y.isVideoTexture&&h.delete(y)}function R(T){const y=T.target;y.removeEventListener("dispose",R),E(y)}function P(T){const y=n.get(T);if(y.__webglInit===void 0)return;const F=T.source,k=f.get(F);if(k){const tt=k[y.__cacheKey];tt.usedTimes--,tt.usedTimes===0&&S(T),Object.keys(k).length===0&&f.delete(F)}n.remove(T)}function S(T){const y=n.get(T);i.deleteTexture(y.__webglTexture);const F=T.source,k=f.get(F);delete k[y.__cacheKey],o.memory.textures--}function E(T){const y=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let k=0;k<6;k++){if(Array.isArray(y.__webglFramebuffer[k]))for(let tt=0;tt<y.__webglFramebuffer[k].length;tt++)i.deleteFramebuffer(y.__webglFramebuffer[k][tt]);else i.deleteFramebuffer(y.__webglFramebuffer[k]);y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer[k])}else{if(Array.isArray(y.__webglFramebuffer))for(let k=0;k<y.__webglFramebuffer.length;k++)i.deleteFramebuffer(y.__webglFramebuffer[k]);else i.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&i.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let k=0;k<y.__webglColorRenderbuffer.length;k++)y.__webglColorRenderbuffer[k]&&i.deleteRenderbuffer(y.__webglColorRenderbuffer[k]);y.__webglDepthRenderbuffer&&i.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const F=T.textures;for(let k=0,tt=F.length;k<tt;k++){const W=n.get(F[k]);W.__webglTexture&&(i.deleteTexture(W.__webglTexture),o.memory.textures--),n.remove(F[k])}n.remove(T)}let L=0;function O(){L=0}function H(){const T=L;return T>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),L+=1,T}function Y(T){const y=[];return y.push(T.wrapS),y.push(T.wrapT),y.push(T.wrapR||0),y.push(T.magFilter),y.push(T.minFilter),y.push(T.anisotropy),y.push(T.internalFormat),y.push(T.format),y.push(T.type),y.push(T.generateMipmaps),y.push(T.premultiplyAlpha),y.push(T.flipY),y.push(T.unpackAlignment),y.push(T.colorSpace),y.join()}function G(T,y){const F=n.get(T);if(T.isVideoTexture&&ut(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&F.__version!==T.version){const k=T.image;if(k===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(k.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Z(F,T,y);return}}else T.isExternalTexture&&(F.__webglTexture=T.sourceTexture?T.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,F.__webglTexture,i.TEXTURE0+y)}function X(T,y){const F=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&F.__version!==T.version){Z(F,T,y);return}e.bindTexture(i.TEXTURE_2D_ARRAY,F.__webglTexture,i.TEXTURE0+y)}function $(T,y){const F=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&F.__version!==T.version){Z(F,T,y);return}e.bindTexture(i.TEXTURE_3D,F.__webglTexture,i.TEXTURE0+y)}function V(T,y){const F=n.get(T);if(T.version>0&&F.__version!==T.version){nt(F,T,y);return}e.bindTexture(i.TEXTURE_CUBE_MAP,F.__webglTexture,i.TEXTURE0+y)}const dt={[gr]:i.REPEAT,[Vn]:i.CLAMP_TO_EDGE,[Bo]:i.MIRRORED_REPEAT},xt={[qe]:i.NEAREST,[cu]:i.NEAREST_MIPMAP_NEAREST,[Is]:i.NEAREST_MIPMAP_LINEAR,[fn]:i.LINEAR,[Fr]:i.LINEAR_MIPMAP_NEAREST,[li]:i.LINEAR_MIPMAP_LINEAR},Mt={[fu]:i.NEVER,[vu]:i.ALWAYS,[pu]:i.LESS,[Oc]:i.LEQUAL,[mu]:i.EQUAL,[xu]:i.GEQUAL,[gu]:i.GREATER,[_u]:i.NOTEQUAL};function zt(T,y){if(y.type===pn&&t.has("OES_texture_float_linear")===!1&&(y.magFilter===fn||y.magFilter===Fr||y.magFilter===Is||y.magFilter===li||y.minFilter===fn||y.minFilter===Fr||y.minFilter===Is||y.minFilter===li)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,dt[y.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,dt[y.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,dt[y.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,xt[y.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,xt[y.minFilter]),y.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,Mt[y.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===qe||y.minFilter!==Is&&y.minFilter!==li||y.type===pn&&t.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){const F=t.get("EXT_texture_filter_anisotropic");i.texParameterf(T,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,s.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function jt(T,y){let F=!1;T.__webglInit===void 0&&(T.__webglInit=!0,y.addEventListener("dispose",A));const k=y.source;let tt=f.get(k);tt===void 0&&(tt={},f.set(k,tt));const W=Y(y);if(W!==T.__cacheKey){tt[W]===void 0&&(tt[W]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,F=!0),tt[W].usedTimes++;const Rt=tt[T.__cacheKey];Rt!==void 0&&(tt[T.__cacheKey].usedTimes--,Rt.usedTimes===0&&S(y)),T.__cacheKey=W,T.__webglTexture=tt[W].texture}return F}function ee(T,y,F){return Math.floor(Math.floor(T/F)/y)}function Kt(T,y,F,k){const W=T.updateRanges;if(W.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,y.width,y.height,F,k,y.data);else{W.sort((rt,_t)=>rt.start-_t.start);let Rt=0;for(let rt=1;rt<W.length;rt++){const _t=W[Rt],Ut=W[rt],Ct=_t.start+_t.count,mt=ee(Ut.start,y.width,4),Ht=ee(_t.start,y.width,4);Ut.start<=Ct+1&&mt===Ht&&ee(Ut.start+Ut.count-1,y.width,4)===mt?_t.count=Math.max(_t.count,Ut.start+Ut.count-_t.start):(++Rt,W[Rt]=Ut)}W.length=Rt+1;const ct=i.getParameter(i.UNPACK_ROW_LENGTH),wt=i.getParameter(i.UNPACK_SKIP_PIXELS),Tt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,y.width);for(let rt=0,_t=W.length;rt<_t;rt++){const Ut=W[rt],Ct=Math.floor(Ut.start/4),mt=Math.ceil(Ut.count/4),Ht=Ct%y.width,I=Math.floor(Ct/y.width),lt=mt,ft=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ht),i.pixelStorei(i.UNPACK_SKIP_ROWS,I),e.texSubImage2D(i.TEXTURE_2D,0,Ht,I,lt,ft,F,k,y.data)}T.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,ct),i.pixelStorei(i.UNPACK_SKIP_PIXELS,wt),i.pixelStorei(i.UNPACK_SKIP_ROWS,Tt)}}function Z(T,y,F){let k=i.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(k=i.TEXTURE_2D_ARRAY),y.isData3DTexture&&(k=i.TEXTURE_3D);const tt=jt(T,y),W=y.source;e.bindTexture(k,T.__webglTexture,i.TEXTURE0+F);const Rt=n.get(W);if(W.version!==Rt.__version||tt===!0){e.activeTexture(i.TEXTURE0+F);const ct=$t.getPrimaries($t.workingColorSpace),wt=y.colorSpace===Gn?null:$t.getPrimaries(y.colorSpace),Tt=y.colorSpace===Gn||ct===wt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Tt);let rt=x(y.image,!1,s.maxTextureSize);rt=Ot(y,rt);const _t=r.convert(y.format,y.colorSpace),Ut=r.convert(y.type);let Ct=v(y.internalFormat,_t,Ut,y.colorSpace,y.isVideoTexture);zt(k,y);let mt;const Ht=y.mipmaps,I=y.isVideoTexture!==!0,lt=Rt.__version===void 0||tt===!0,ft=W.dataReady,St=w(y,rt);if(y.isDepthTexture)Ct=_(y.format===_s,y.type),lt&&(I?e.texStorage2D(i.TEXTURE_2D,1,Ct,rt.width,rt.height):e.texImage2D(i.TEXTURE_2D,0,Ct,rt.width,rt.height,0,_t,Ut,null));else if(y.isDataTexture)if(Ht.length>0){I&&lt&&e.texStorage2D(i.TEXTURE_2D,St,Ct,Ht[0].width,Ht[0].height);for(let ot=0,J=Ht.length;ot<J;ot++)mt=Ht[ot],I?ft&&e.texSubImage2D(i.TEXTURE_2D,ot,0,0,mt.width,mt.height,_t,Ut,mt.data):e.texImage2D(i.TEXTURE_2D,ot,Ct,mt.width,mt.height,0,_t,Ut,mt.data);y.generateMipmaps=!1}else I?(lt&&e.texStorage2D(i.TEXTURE_2D,St,Ct,rt.width,rt.height),ft&&Kt(y,rt,_t,Ut)):e.texImage2D(i.TEXTURE_2D,0,Ct,rt.width,rt.height,0,_t,Ut,rt.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){I&&lt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,St,Ct,Ht[0].width,Ht[0].height,rt.depth);for(let ot=0,J=Ht.length;ot<J;ot++)if(mt=Ht[ot],y.format!==ln)if(_t!==null)if(I){if(ft)if(y.layerUpdates.size>0){const At=Xl(mt.width,mt.height,y.format,y.type);for(const Bt of y.layerUpdates){const le=mt.data.subarray(Bt*At/mt.data.BYTES_PER_ELEMENT,(Bt+1)*At/mt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ot,0,0,Bt,mt.width,mt.height,1,_t,le)}y.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ot,0,0,0,mt.width,mt.height,rt.depth,_t,mt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ot,Ct,mt.width,mt.height,rt.depth,0,mt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else I?ft&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,ot,0,0,0,mt.width,mt.height,rt.depth,_t,Ut,mt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,ot,Ct,mt.width,mt.height,rt.depth,0,_t,Ut,mt.data)}else{I&&lt&&e.texStorage2D(i.TEXTURE_2D,St,Ct,Ht[0].width,Ht[0].height);for(let ot=0,J=Ht.length;ot<J;ot++)mt=Ht[ot],y.format!==ln?_t!==null?I?ft&&e.compressedTexSubImage2D(i.TEXTURE_2D,ot,0,0,mt.width,mt.height,_t,mt.data):e.compressedTexImage2D(i.TEXTURE_2D,ot,Ct,mt.width,mt.height,0,mt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):I?ft&&e.texSubImage2D(i.TEXTURE_2D,ot,0,0,mt.width,mt.height,_t,Ut,mt.data):e.texImage2D(i.TEXTURE_2D,ot,Ct,mt.width,mt.height,0,_t,Ut,mt.data)}else if(y.isDataArrayTexture)if(I){if(lt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,St,Ct,rt.width,rt.height,rt.depth),ft)if(y.layerUpdates.size>0){const ot=Xl(rt.width,rt.height,y.format,y.type);for(const J of y.layerUpdates){const At=rt.data.subarray(J*ot/rt.data.BYTES_PER_ELEMENT,(J+1)*ot/rt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,J,rt.width,rt.height,1,_t,Ut,At)}y.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,rt.width,rt.height,rt.depth,_t,Ut,rt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ct,rt.width,rt.height,rt.depth,0,_t,Ut,rt.data);else if(y.isData3DTexture)I?(lt&&e.texStorage3D(i.TEXTURE_3D,St,Ct,rt.width,rt.height,rt.depth),ft&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,rt.width,rt.height,rt.depth,_t,Ut,rt.data)):e.texImage3D(i.TEXTURE_3D,0,Ct,rt.width,rt.height,rt.depth,0,_t,Ut,rt.data);else if(y.isFramebufferTexture){if(lt)if(I)e.texStorage2D(i.TEXTURE_2D,St,Ct,rt.width,rt.height);else{let ot=rt.width,J=rt.height;for(let At=0;At<St;At++)e.texImage2D(i.TEXTURE_2D,At,Ct,ot,J,0,_t,Ut,null),ot>>=1,J>>=1}}else if(Ht.length>0){if(I&&lt){const ot=Ft(Ht[0]);e.texStorage2D(i.TEXTURE_2D,St,Ct,ot.width,ot.height)}for(let ot=0,J=Ht.length;ot<J;ot++)mt=Ht[ot],I?ft&&e.texSubImage2D(i.TEXTURE_2D,ot,0,0,_t,Ut,mt):e.texImage2D(i.TEXTURE_2D,ot,Ct,_t,Ut,mt);y.generateMipmaps=!1}else if(I){if(lt){const ot=Ft(rt);e.texStorage2D(i.TEXTURE_2D,St,Ct,ot.width,ot.height)}ft&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,_t,Ut,rt)}else e.texImage2D(i.TEXTURE_2D,0,Ct,_t,Ut,rt);m(y)&&d(k),Rt.__version=W.version,y.onUpdate&&y.onUpdate(y)}T.__version=y.version}function nt(T,y,F){if(y.image.length!==6)return;const k=jt(T,y),tt=y.source;e.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+F);const W=n.get(tt);if(tt.version!==W.__version||k===!0){e.activeTexture(i.TEXTURE0+F);const Rt=$t.getPrimaries($t.workingColorSpace),ct=y.colorSpace===Gn?null:$t.getPrimaries(y.colorSpace),wt=y.colorSpace===Gn||Rt===ct?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,wt);const Tt=y.isCompressedTexture||y.image[0].isCompressedTexture,rt=y.image[0]&&y.image[0].isDataTexture,_t=[];for(let J=0;J<6;J++)!Tt&&!rt?_t[J]=x(y.image[J],!0,s.maxCubemapSize):_t[J]=rt?y.image[J].image:y.image[J],_t[J]=Ot(y,_t[J]);const Ut=_t[0],Ct=r.convert(y.format,y.colorSpace),mt=r.convert(y.type),Ht=v(y.internalFormat,Ct,mt,y.colorSpace),I=y.isVideoTexture!==!0,lt=W.__version===void 0||k===!0,ft=tt.dataReady;let St=w(y,Ut);zt(i.TEXTURE_CUBE_MAP,y);let ot;if(Tt){I&&lt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,St,Ht,Ut.width,Ut.height);for(let J=0;J<6;J++){ot=_t[J].mipmaps;for(let At=0;At<ot.length;At++){const Bt=ot[At];y.format!==ln?Ct!==null?I?ft&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,At,0,0,Bt.width,Bt.height,Ct,Bt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,At,Ht,Bt.width,Bt.height,0,Bt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):I?ft&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,At,0,0,Bt.width,Bt.height,Ct,mt,Bt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,At,Ht,Bt.width,Bt.height,0,Ct,mt,Bt.data)}}}else{if(ot=y.mipmaps,I&&lt){ot.length>0&&St++;const J=Ft(_t[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,St,Ht,J.width,J.height)}for(let J=0;J<6;J++)if(rt){I?ft&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,_t[J].width,_t[J].height,Ct,mt,_t[J].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Ht,_t[J].width,_t[J].height,0,Ct,mt,_t[J].data);for(let At=0;At<ot.length;At++){const le=ot[At].image[J].image;I?ft&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,At+1,0,0,le.width,le.height,Ct,mt,le.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,At+1,Ht,le.width,le.height,0,Ct,mt,le.data)}}else{I?ft&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,Ct,mt,_t[J]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Ht,Ct,mt,_t[J]);for(let At=0;At<ot.length;At++){const Bt=ot[At];I?ft&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,At+1,0,0,Ct,mt,Bt.image[J]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,At+1,Ht,Ct,mt,Bt.image[J])}}}m(y)&&d(i.TEXTURE_CUBE_MAP),W.__version=tt.version,y.onUpdate&&y.onUpdate(y)}T.__version=y.version}function yt(T,y,F,k,tt,W){const Rt=r.convert(F.format,F.colorSpace),ct=r.convert(F.type),wt=v(F.internalFormat,Rt,ct,F.colorSpace),Tt=n.get(y),rt=n.get(F);if(rt.__renderTarget=y,!Tt.__hasExternalTextures){const _t=Math.max(1,y.width>>W),Ut=Math.max(1,y.height>>W);tt===i.TEXTURE_3D||tt===i.TEXTURE_2D_ARRAY?e.texImage3D(tt,W,wt,_t,Ut,y.depth,0,Rt,ct,null):e.texImage2D(tt,W,wt,_t,Ut,0,Rt,ct,null)}e.bindFramebuffer(i.FRAMEBUFFER,T),it(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,k,tt,rt.__webglTexture,0,ht(y)):(tt===i.TEXTURE_2D||tt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&tt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,k,tt,rt.__webglTexture,W),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Pt(T,y,F){if(i.bindRenderbuffer(i.RENDERBUFFER,T),y.depthBuffer){const k=y.depthTexture,tt=k&&k.isDepthTexture?k.type:null,W=_(y.stencilBuffer,tt),Rt=y.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ct=ht(y);it(y)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ct,W,y.width,y.height):F?i.renderbufferStorageMultisample(i.RENDERBUFFER,ct,W,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,W,y.width,y.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Rt,i.RENDERBUFFER,T)}else{const k=y.textures;for(let tt=0;tt<k.length;tt++){const W=k[tt],Rt=r.convert(W.format,W.colorSpace),ct=r.convert(W.type),wt=v(W.internalFormat,Rt,ct,W.colorSpace),Tt=ht(y);F&&it(y)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Tt,wt,y.width,y.height):it(y)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Tt,wt,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,wt,y.width,y.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function bt(T,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,T),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const k=n.get(y.depthTexture);k.__renderTarget=y,(!k.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),G(y.depthTexture,0);const tt=k.__webglTexture,W=ht(y);if(y.depthTexture.format===gs)it(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,tt,0,W):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,tt,0);else if(y.depthTexture.format===_s)it(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,tt,0,W):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,tt,0);else throw new Error("Unknown depthTexture format")}function Yt(T){const y=n.get(T),F=T.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==T.depthTexture){const k=T.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),k){const tt=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,k.removeEventListener("dispose",tt)};k.addEventListener("dispose",tt),y.__depthDisposeCallback=tt}y.__boundDepthTexture=k}if(T.depthTexture&&!y.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");const k=T.texture.mipmaps;k&&k.length>0?bt(y.__webglFramebuffer[0],T):bt(y.__webglFramebuffer,T)}else if(F){y.__webglDepthbuffer=[];for(let k=0;k<6;k++)if(e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[k]),y.__webglDepthbuffer[k]===void 0)y.__webglDepthbuffer[k]=i.createRenderbuffer(),Pt(y.__webglDepthbuffer[k],T,!1);else{const tt=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,W=y.__webglDepthbuffer[k];i.bindRenderbuffer(i.RENDERBUFFER,W),i.framebufferRenderbuffer(i.FRAMEBUFFER,tt,i.RENDERBUFFER,W)}}else{const k=T.texture.mipmaps;if(k&&k.length>0?e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=i.createRenderbuffer(),Pt(y.__webglDepthbuffer,T,!1);else{const tt=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,W=y.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,W),i.framebufferRenderbuffer(i.FRAMEBUFFER,tt,i.RENDERBUFFER,W)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function ae(T,y,F){const k=n.get(T);y!==void 0&&yt(k.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),F!==void 0&&Yt(T)}function C(T){const y=T.texture,F=n.get(T),k=n.get(y);T.addEventListener("dispose",R);const tt=T.textures,W=T.isWebGLCubeRenderTarget===!0,Rt=tt.length>1;if(Rt||(k.__webglTexture===void 0&&(k.__webglTexture=i.createTexture()),k.__version=y.version,o.memory.textures++),W){F.__webglFramebuffer=[];for(let ct=0;ct<6;ct++)if(y.mipmaps&&y.mipmaps.length>0){F.__webglFramebuffer[ct]=[];for(let wt=0;wt<y.mipmaps.length;wt++)F.__webglFramebuffer[ct][wt]=i.createFramebuffer()}else F.__webglFramebuffer[ct]=i.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){F.__webglFramebuffer=[];for(let ct=0;ct<y.mipmaps.length;ct++)F.__webglFramebuffer[ct]=i.createFramebuffer()}else F.__webglFramebuffer=i.createFramebuffer();if(Rt)for(let ct=0,wt=tt.length;ct<wt;ct++){const Tt=n.get(tt[ct]);Tt.__webglTexture===void 0&&(Tt.__webglTexture=i.createTexture(),o.memory.textures++)}if(T.samples>0&&it(T)===!1){F.__webglMultisampledFramebuffer=i.createFramebuffer(),F.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let ct=0;ct<tt.length;ct++){const wt=tt[ct];F.__webglColorRenderbuffer[ct]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,F.__webglColorRenderbuffer[ct]);const Tt=r.convert(wt.format,wt.colorSpace),rt=r.convert(wt.type),_t=v(wt.internalFormat,Tt,rt,wt.colorSpace,T.isXRRenderTarget===!0),Ut=ht(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ut,_t,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ct,i.RENDERBUFFER,F.__webglColorRenderbuffer[ct])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(F.__webglDepthRenderbuffer=i.createRenderbuffer(),Pt(F.__webglDepthRenderbuffer,T,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(W){e.bindTexture(i.TEXTURE_CUBE_MAP,k.__webglTexture),zt(i.TEXTURE_CUBE_MAP,y);for(let ct=0;ct<6;ct++)if(y.mipmaps&&y.mipmaps.length>0)for(let wt=0;wt<y.mipmaps.length;wt++)yt(F.__webglFramebuffer[ct][wt],T,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,wt);else yt(F.__webglFramebuffer[ct],T,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0);m(y)&&d(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Rt){for(let ct=0,wt=tt.length;ct<wt;ct++){const Tt=tt[ct],rt=n.get(Tt);let _t=i.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(_t=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(_t,rt.__webglTexture),zt(_t,Tt),yt(F.__webglFramebuffer,T,Tt,i.COLOR_ATTACHMENT0+ct,_t,0),m(Tt)&&d(_t)}e.unbindTexture()}else{let ct=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ct=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ct,k.__webglTexture),zt(ct,y),y.mipmaps&&y.mipmaps.length>0)for(let wt=0;wt<y.mipmaps.length;wt++)yt(F.__webglFramebuffer[wt],T,y,i.COLOR_ATTACHMENT0,ct,wt);else yt(F.__webglFramebuffer,T,y,i.COLOR_ATTACHMENT0,ct,0);m(y)&&d(ct),e.unbindTexture()}T.depthBuffer&&Yt(T)}function et(T){const y=T.textures;for(let F=0,k=y.length;F<k;F++){const tt=y[F];if(m(tt)){const W=M(T),Rt=n.get(tt).__webglTexture;e.bindTexture(W,Rt),d(W),e.unbindTexture()}}}const K=[],j=[];function q(T){if(T.samples>0){if(it(T)===!1){const y=T.textures,F=T.width,k=T.height;let tt=i.COLOR_BUFFER_BIT;const W=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Rt=n.get(T),ct=y.length>1;if(ct)for(let Tt=0;Tt<y.length;Tt++)e.bindFramebuffer(i.FRAMEBUFFER,Rt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Tt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Rt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Tt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Rt.__webglMultisampledFramebuffer);const wt=T.texture.mipmaps;wt&&wt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Rt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Rt.__webglFramebuffer);for(let Tt=0;Tt<y.length;Tt++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(tt|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(tt|=i.STENCIL_BUFFER_BIT)),ct){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Rt.__webglColorRenderbuffer[Tt]);const rt=n.get(y[Tt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,rt,0)}i.blitFramebuffer(0,0,F,k,0,0,F,k,tt,i.NEAREST),c===!0&&(K.length=0,j.length=0,K.push(i.COLOR_ATTACHMENT0+Tt),T.depthBuffer&&T.resolveDepthBuffer===!1&&(K.push(W),j.push(W),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,j)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,K))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ct)for(let Tt=0;Tt<y.length;Tt++){e.bindFramebuffer(i.FRAMEBUFFER,Rt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Tt,i.RENDERBUFFER,Rt.__webglColorRenderbuffer[Tt]);const rt=n.get(y[Tt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Rt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Tt,i.TEXTURE_2D,rt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Rt.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&c){const y=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[y])}}}function ht(T){return Math.min(s.maxSamples,T.samples)}function it(T){const y=n.get(T);return T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function ut(T){const y=o.render.frame;h.get(T)!==y&&(h.set(T,y),T.update())}function Ot(T,y){const F=T.colorSpace,k=T.format,tt=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||F!==Hi&&F!==Gn&&($t.getTransfer(F)===ie?(k!==ln||tt!==gn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),y}function Ft(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(l.width=T.naturalWidth||T.width,l.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(l.width=T.displayWidth,l.height=T.displayHeight):(l.width=T.width,l.height=T.height),l}this.allocateTextureUnit=H,this.resetTextureUnits=O,this.setTexture2D=G,this.setTexture2DArray=X,this.setTexture3D=$,this.setTextureCube=V,this.rebindTextures=ae,this.setupRenderTarget=C,this.updateRenderTargetMipmap=et,this.updateMultisampleRenderTarget=q,this.setupDepthRenderbuffer=Yt,this.setupFrameBufferTexture=yt,this.useMultisampledRTT=it}function g0(i,t){function e(n,s=Gn){let r;const o=$t.getTransfer(s);if(n===gn)return i.UNSIGNED_BYTE;if(n===Da)return i.UNSIGNED_SHORT_4_4_4_4;if(n===La)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Dc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Lc)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Cc)return i.BYTE;if(n===Pc)return i.SHORT;if(n===ps)return i.UNSIGNED_SHORT;if(n===Pa)return i.INT;if(n===ci)return i.UNSIGNED_INT;if(n===pn)return i.FLOAT;if(n===Es)return i.HALF_FLOAT;if(n===Ic)return i.ALPHA;if(n===Uc)return i.RGB;if(n===ln)return i.RGBA;if(n===gs)return i.DEPTH_COMPONENT;if(n===_s)return i.DEPTH_STENCIL;if(n===Ia)return i.RED;if(n===Ua)return i.RED_INTEGER;if(n===Nc)return i.RG;if(n===Na)return i.RG_INTEGER;if(n===Fa)return i.RGBA_INTEGER;if(n===ar||n===lr||n===cr||n===hr)if(o===ie)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===ar)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===lr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===cr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===hr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===ar)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===lr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===cr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===hr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===zo||n===Ho||n===ko||n===Go)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===zo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ho)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ko)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Go)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Vo||n===Wo||n===Xo)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Vo||n===Wo)return o===ie?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Xo)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Yo||n===Zo||n===qo||n===jo||n===Ko||n===Jo||n===$o||n===Qo||n===ta||n===ea||n===na||n===ia||n===sa||n===ra)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Yo)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Zo)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===qo)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===jo)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ko)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Jo)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===$o)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Qo)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ta)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ea)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===na)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ia)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===sa)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ra)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===oa||n===aa||n===la)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===oa)return o===ie?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===aa)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===la)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ca||n===ha||n===ua||n===da)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===ca)return r.COMPRESSED_RED_RGTC1_EXT;if(n===ha)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ua)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===da)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ms?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const _0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,x0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class v0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Kc(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new qn({vertexShader:_0,fragmentShader:x0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new qt(new Mn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class y0 extends fi{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,f=null,p=null,g=null;const x=typeof XRWebGLBinding<"u",m=new v0,d={},M=e.getContextAttributes();let v=null,_=null;const w=[],A=[],R=new Q;let P=null;const S=new Qe;S.viewport=new me;const E=new Qe;E.viewport=new me;const L=[S,E],O=new Bd;let H=null,Y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let nt=w[Z];return nt===void 0&&(nt=new so,w[Z]=nt),nt.getTargetRaySpace()},this.getControllerGrip=function(Z){let nt=w[Z];return nt===void 0&&(nt=new so,w[Z]=nt),nt.getGripSpace()},this.getHand=function(Z){let nt=w[Z];return nt===void 0&&(nt=new so,w[Z]=nt),nt.getHandSpace()};function G(Z){const nt=A.indexOf(Z.inputSource);if(nt===-1)return;const yt=w[nt];yt!==void 0&&(yt.update(Z.inputSource,Z.frame,l||o),yt.dispatchEvent({type:Z.type,data:Z.inputSource}))}function X(){s.removeEventListener("select",G),s.removeEventListener("selectstart",G),s.removeEventListener("selectend",G),s.removeEventListener("squeeze",G),s.removeEventListener("squeezestart",G),s.removeEventListener("squeezeend",G),s.removeEventListener("end",X),s.removeEventListener("inputsourceschange",$);for(let Z=0;Z<w.length;Z++){const nt=A[Z];nt!==null&&(A[Z]=null,w[Z].disconnect(nt))}H=null,Y=null,m.reset();for(const Z in d)delete d[Z];t.setRenderTarget(v),p=null,f=null,u=null,s=null,_=null,Kt.stop(),n.isPresenting=!1,t.setPixelRatio(P),t.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){a=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(Z){l=Z},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(v=t.getRenderTarget(),s.addEventListener("select",G),s.addEventListener("selectstart",G),s.addEventListener("selectend",G),s.addEventListener("squeeze",G),s.addEventListener("squeezestart",G),s.addEventListener("squeezeend",G),s.addEventListener("end",X),s.addEventListener("inputsourceschange",$),M.xrCompatible!==!0&&await e.makeXRCompatible(),P=t.getPixelRatio(),t.getSize(R),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let yt=null,Pt=null,bt=null;M.depth&&(bt=M.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,yt=M.stencil?_s:gs,Pt=M.stencil?ms:ci);const Yt={colorFormat:e.RGBA8,depthFormat:bt,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(Yt),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),_=new ui(f.textureWidth,f.textureHeight,{format:ln,type:gn,depthTexture:new jc(f.textureWidth,f.textureHeight,Pt,void 0,void 0,void 0,void 0,void 0,void 0,yt),stencilBuffer:M.stencil,colorSpace:t.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const yt={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,e,yt),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),_=new ui(p.framebufferWidth,p.framebufferHeight,{format:ln,type:gn,colorSpace:t.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),Kt.setContext(s),Kt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function $(Z){for(let nt=0;nt<Z.removed.length;nt++){const yt=Z.removed[nt],Pt=A.indexOf(yt);Pt>=0&&(A[Pt]=null,w[Pt].disconnect(yt))}for(let nt=0;nt<Z.added.length;nt++){const yt=Z.added[nt];let Pt=A.indexOf(yt);if(Pt===-1){for(let Yt=0;Yt<w.length;Yt++)if(Yt>=A.length){A.push(yt),Pt=Yt;break}else if(A[Yt]===null){A[Yt]=yt,Pt=Yt;break}if(Pt===-1)break}const bt=w[Pt];bt&&bt.connect(yt)}}const V=new D,dt=new D;function xt(Z,nt,yt){V.setFromMatrixPosition(nt.matrixWorld),dt.setFromMatrixPosition(yt.matrixWorld);const Pt=V.distanceTo(dt),bt=nt.projectionMatrix.elements,Yt=yt.projectionMatrix.elements,ae=bt[14]/(bt[10]-1),C=bt[14]/(bt[10]+1),et=(bt[9]+1)/bt[5],K=(bt[9]-1)/bt[5],j=(bt[8]-1)/bt[0],q=(Yt[8]+1)/Yt[0],ht=ae*j,it=ae*q,ut=Pt/(-j+q),Ot=ut*-j;if(nt.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(Ot),Z.translateZ(ut),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),bt[10]===-1)Z.projectionMatrix.copy(nt.projectionMatrix),Z.projectionMatrixInverse.copy(nt.projectionMatrixInverse);else{const Ft=ae+ut,T=C+ut,y=ht-Ot,F=it+(Pt-Ot),k=et*C/T*Ft,tt=K*C/T*Ft;Z.projectionMatrix.makePerspective(y,F,k,tt,Ft,T),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function Mt(Z,nt){nt===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(nt.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let nt=Z.near,yt=Z.far;m.texture!==null&&(m.depthNear>0&&(nt=m.depthNear),m.depthFar>0&&(yt=m.depthFar)),O.near=E.near=S.near=nt,O.far=E.far=S.far=yt,(H!==O.near||Y!==O.far)&&(s.updateRenderState({depthNear:O.near,depthFar:O.far}),H=O.near,Y=O.far),O.layers.mask=Z.layers.mask|6,S.layers.mask=O.layers.mask&3,E.layers.mask=O.layers.mask&5;const Pt=Z.parent,bt=O.cameras;Mt(O,Pt);for(let Yt=0;Yt<bt.length;Yt++)Mt(bt[Yt],Pt);bt.length===2?xt(O,S,E):O.projectionMatrix.copy(S.projectionMatrix),zt(Z,O,Pt)};function zt(Z,nt,yt){yt===null?Z.matrix.copy(nt.matrixWorld):(Z.matrix.copy(yt.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(nt.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(nt.projectionMatrix),Z.projectionMatrixInverse.copy(nt.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=fa*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(!(f===null&&p===null))return c},this.setFoveation=function(Z){c=Z,f!==null&&(f.fixedFoveation=Z),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Z)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(O)},this.getCameraTexture=function(Z){return d[Z]};let jt=null;function ee(Z,nt){if(h=nt.getViewerPose(l||o),g=nt,h!==null){const yt=h.views;p!==null&&(t.setRenderTargetFramebuffer(_,p.framebuffer),t.setRenderTarget(_));let Pt=!1;yt.length!==O.cameras.length&&(O.cameras.length=0,Pt=!0);for(let C=0;C<yt.length;C++){const et=yt[C];let K=null;if(p!==null)K=p.getViewport(et);else{const q=u.getViewSubImage(f,et);K=q.viewport,C===0&&(t.setRenderTargetTextures(_,q.colorTexture,q.depthStencilTexture),t.setRenderTarget(_))}let j=L[C];j===void 0&&(j=new Qe,j.layers.enable(C),j.viewport=new me,L[C]=j),j.matrix.fromArray(et.transform.matrix),j.matrix.decompose(j.position,j.quaternion,j.scale),j.projectionMatrix.fromArray(et.projectionMatrix),j.projectionMatrixInverse.copy(j.projectionMatrix).invert(),j.viewport.set(K.x,K.y,K.width,K.height),C===0&&(O.matrix.copy(j.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),Pt===!0&&O.cameras.push(j)}const bt=s.enabledFeatures;if(bt&&bt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){u=n.getBinding();const C=u.getDepthInformation(yt[0]);C&&C.isValid&&C.texture&&m.init(C,s.renderState)}if(bt&&bt.includes("camera-access")&&x){t.state.unbindTexture(),u=n.getBinding();for(let C=0;C<yt.length;C++){const et=yt[C].camera;if(et){let K=d[et];K||(K=new Kc,d[et]=K);const j=u.getCameraImage(et);K.sourceTexture=j}}}}for(let yt=0;yt<w.length;yt++){const Pt=A[yt],bt=w[yt];Pt!==null&&bt!==void 0&&bt.update(Pt,nt,l||o)}jt&&jt(Z,nt),nt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:nt}),g=null}const Kt=new lh;Kt.setAnimationLoop(ee),this.setAnimationLoop=function(Z){jt=Z},this.dispose=function(){}}}const si=new _n,M0=new oe;function S0(i,t){function e(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function n(m,d){d.color.getRGB(m.fogColor.value,Wc(i)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function s(m,d,M,v,_){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(m,d):d.isMeshToonMaterial?(r(m,d),u(m,d)):d.isMeshPhongMaterial?(r(m,d),h(m,d)):d.isMeshStandardMaterial?(r(m,d),f(m,d),d.isMeshPhysicalMaterial&&p(m,d,_)):d.isMeshMatcapMaterial?(r(m,d),g(m,d)):d.isMeshDepthMaterial?r(m,d):d.isMeshDistanceMaterial?(r(m,d),x(m,d)):d.isMeshNormalMaterial?r(m,d):d.isLineBasicMaterial?(o(m,d),d.isLineDashedMaterial&&a(m,d)):d.isPointsMaterial?c(m,d,M,v):d.isSpriteMaterial?l(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,e(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===Ie&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,e(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===Ie&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,e(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,e(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);const M=t.get(d),v=M.envMap,_=M.envMapRotation;v&&(m.envMap.value=v,si.copy(_),si.x*=-1,si.y*=-1,si.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(si.y*=-1,si.z*=-1),m.envMapRotation.value.setFromMatrix4(M0.makeRotationFromEuler(si)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap&&(m.lightMap.value=d.lightMap,m.lightMapIntensity.value=d.lightMapIntensity,e(d.lightMap,m.lightMapTransform)),d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,m.aoMapTransform))}function o(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform))}function a(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function c(m,d,M,v){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*M,m.scale.value=v*.5,d.map&&(m.map.value=d.map,e(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function l(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function h(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function u(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function f(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,m.roughnessMapTransform)),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,M){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Ie&&m.clearcoatNormalScale.value.negate())),d.dispersion>0&&(m.dispersion.value=d.dispersion),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,d){d.matcap&&(m.matcap.value=d.matcap)}function x(m,d){const M=t.get(d).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function E0(i,t,e,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(M,v){const _=v.program;n.uniformBlockBinding(M,_)}function l(M,v){let _=s[M.id];_===void 0&&(g(M),_=h(M),s[M.id]=_,M.addEventListener("dispose",m));const w=v.program;n.updateUBOMapping(M,w);const A=t.render.frame;r[M.id]!==A&&(f(M),r[M.id]=A)}function h(M){const v=u();M.__bindingPointIndex=v;const _=i.createBuffer(),w=M.__size,A=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,w,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,_),_}function u(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(M){const v=s[M.id],_=M.uniforms,w=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let A=0,R=_.length;A<R;A++){const P=Array.isArray(_[A])?_[A]:[_[A]];for(let S=0,E=P.length;S<E;S++){const L=P[S];if(p(L,A,S,w)===!0){const O=L.__offset,H=Array.isArray(L.value)?L.value:[L.value];let Y=0;for(let G=0;G<H.length;G++){const X=H[G],$=x(X);typeof X=="number"||typeof X=="boolean"?(L.__data[0]=X,i.bufferSubData(i.UNIFORM_BUFFER,O+Y,L.__data)):X.isMatrix3?(L.__data[0]=X.elements[0],L.__data[1]=X.elements[1],L.__data[2]=X.elements[2],L.__data[3]=0,L.__data[4]=X.elements[3],L.__data[5]=X.elements[4],L.__data[6]=X.elements[5],L.__data[7]=0,L.__data[8]=X.elements[6],L.__data[9]=X.elements[7],L.__data[10]=X.elements[8],L.__data[11]=0):(X.toArray(L.__data,Y),Y+=$.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,O,L.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(M,v,_,w){const A=M.value,R=v+"_"+_;if(w[R]===void 0)return typeof A=="number"||typeof A=="boolean"?w[R]=A:w[R]=A.clone(),!0;{const P=w[R];if(typeof A=="number"||typeof A=="boolean"){if(P!==A)return w[R]=A,!0}else if(P.equals(A)===!1)return P.copy(A),!0}return!1}function g(M){const v=M.uniforms;let _=0;const w=16;for(let R=0,P=v.length;R<P;R++){const S=Array.isArray(v[R])?v[R]:[v[R]];for(let E=0,L=S.length;E<L;E++){const O=S[E],H=Array.isArray(O.value)?O.value:[O.value];for(let Y=0,G=H.length;Y<G;Y++){const X=H[Y],$=x(X),V=_%w,dt=V%$.boundary,xt=V+dt;_+=dt,xt!==0&&w-xt<$.storage&&(_+=w-xt),O.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),O.__offset=_,_+=$.storage}}}const A=_%w;return A>0&&(_+=w-A),M.__size=_,M.__cache={},this}function x(M){const v={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(v.boundary=4,v.storage=4):M.isVector2?(v.boundary=8,v.storage=8):M.isVector3||M.isColor?(v.boundary=16,v.storage=12):M.isVector4?(v.boundary=16,v.storage=16):M.isMatrix3?(v.boundary=48,v.storage=48):M.isMatrix4?(v.boundary=64,v.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),v}function m(M){const v=M.target;v.removeEventListener("dispose",m);const _=o.indexOf(v.__bindingPointIndex);o.splice(_,1),i.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function d(){for(const M in s)i.deleteBuffer(s[M]);o=[],s={},r={}}return{bind:c,update:l,dispose:d}}class b0{constructor(t={}){const{canvas:e=Su(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;const g=new Uint32Array(4),x=new Int32Array(4);let m=null,d=null;const M=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Xn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const _=this;let w=!1;this._outputColorSpace=we;let A=0,R=0,P=null,S=-1,E=null;const L=new me,O=new me;let H=null;const Y=new Wt(0);let G=0,X=e.width,$=e.height,V=1,dt=null,xt=null;const Mt=new me(0,0,X,$),zt=new me(0,0,X,$);let jt=!1;const ee=new za;let Kt=!1,Z=!1;const nt=new oe,yt=new D,Pt=new me,bt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Yt=!1;function ae(){return P===null?V:1}let C=n;function et(b,U){return e.getContext(b,U)}try{const b={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ca}`),e.addEventListener("webglcontextlost",ft,!1),e.addEventListener("webglcontextrestored",St,!1),e.addEventListener("webglcontextcreationerror",ot,!1),C===null){const U="webgl2";if(C=et(U,b),C===null)throw et(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let K,j,q,ht,it,ut,Ot,Ft,T,y,F,k,tt,W,Rt,ct,wt,Tt,rt,_t,Ut,Ct,mt,Ht;function I(){K=new Um(C),K.init(),Ct=new g0(C,K),j=new Am(C,K,t,Ct),q=new p0(C,K),j.reversedDepthBuffer&&f&&q.buffers.depth.setReversed(!0),ht=new Om(C),it=new e0,ut=new m0(C,K,q,it,j,Ct,ht),Ot=new Cm(_),Ft=new Im(_),T=new Gd(C),mt=new wm(C,T),y=new Nm(C,T,ht,mt),F=new zm(C,y,T,ht),rt=new Bm(C,j,ut),ct=new Rm(it),k=new t0(_,Ot,Ft,K,j,mt,ct),tt=new S0(_,it),W=new i0,Rt=new c0(K),Tt=new bm(_,Ot,Ft,q,F,p,c),wt=new d0(_,F,j),Ht=new E0(C,ht,j,q),_t=new Tm(C,K,ht),Ut=new Fm(C,K,ht),ht.programs=k.programs,_.capabilities=j,_.extensions=K,_.properties=it,_.renderLists=W,_.shadowMap=wt,_.state=q,_.info=ht}I();const lt=new y0(_,C);this.xr=lt,this.getContext=function(){return C},this.getContextAttributes=function(){return C.getContextAttributes()},this.forceContextLoss=function(){const b=K.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=K.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(b){b!==void 0&&(V=b,this.setSize(X,$,!1))},this.getSize=function(b){return b.set(X,$)},this.setSize=function(b,U,B=!0){if(lt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}X=b,$=U,e.width=Math.floor(b*V),e.height=Math.floor(U*V),B===!0&&(e.style.width=b+"px",e.style.height=U+"px"),this.setViewport(0,0,b,U)},this.getDrawingBufferSize=function(b){return b.set(X*V,$*V).floor()},this.setDrawingBufferSize=function(b,U,B){X=b,$=U,V=B,e.width=Math.floor(b*B),e.height=Math.floor(U*B),this.setViewport(0,0,b,U)},this.getCurrentViewport=function(b){return b.copy(L)},this.getViewport=function(b){return b.copy(Mt)},this.setViewport=function(b,U,B,z){b.isVector4?Mt.set(b.x,b.y,b.z,b.w):Mt.set(b,U,B,z),q.viewport(L.copy(Mt).multiplyScalar(V).round())},this.getScissor=function(b){return b.copy(zt)},this.setScissor=function(b,U,B,z){b.isVector4?zt.set(b.x,b.y,b.z,b.w):zt.set(b,U,B,z),q.scissor(O.copy(zt).multiplyScalar(V).round())},this.getScissorTest=function(){return jt},this.setScissorTest=function(b){q.setScissorTest(jt=b)},this.setOpaqueSort=function(b){dt=b},this.setTransparentSort=function(b){xt=b},this.getClearColor=function(b){return b.copy(Tt.getClearColor())},this.setClearColor=function(){Tt.setClearColor(...arguments)},this.getClearAlpha=function(){return Tt.getClearAlpha()},this.setClearAlpha=function(){Tt.setClearAlpha(...arguments)},this.clear=function(b=!0,U=!0,B=!0){let z=0;if(b){let N=!1;if(P!==null){const at=P.texture.format;N=at===Fa||at===Na||at===Ua}if(N){const at=P.texture.type,gt=at===gn||at===ci||at===ps||at===ms||at===Da||at===La,Et=Tt.getClearColor(),vt=Tt.getClearAlpha(),It=Et.r,Nt=Et.g,Dt=Et.b;gt?(g[0]=It,g[1]=Nt,g[2]=Dt,g[3]=vt,C.clearBufferuiv(C.COLOR,0,g)):(x[0]=It,x[1]=Nt,x[2]=Dt,x[3]=vt,C.clearBufferiv(C.COLOR,0,x))}else z|=C.COLOR_BUFFER_BIT}U&&(z|=C.DEPTH_BUFFER_BIT),B&&(z|=C.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),C.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ft,!1),e.removeEventListener("webglcontextrestored",St,!1),e.removeEventListener("webglcontextcreationerror",ot,!1),Tt.dispose(),W.dispose(),Rt.dispose(),it.dispose(),Ot.dispose(),Ft.dispose(),F.dispose(),mt.dispose(),Ht.dispose(),k.dispose(),lt.dispose(),lt.removeEventListener("sessionstart",un),lt.removeEventListener("sessionend",tl),Jn.stop()};function ft(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function St(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const b=ht.autoReset,U=wt.enabled,B=wt.autoUpdate,z=wt.needsUpdate,N=wt.type;I(),ht.autoReset=b,wt.enabled=U,wt.autoUpdate=B,wt.needsUpdate=z,wt.type=N}function ot(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function J(b){const U=b.target;U.removeEventListener("dispose",J),At(U)}function At(b){Bt(b),it.remove(b)}function Bt(b){const U=it.get(b).programs;U!==void 0&&(U.forEach(function(B){k.releaseProgram(B)}),b.isShaderMaterial&&k.releaseShaderCache(b))}this.renderBufferDirect=function(b,U,B,z,N,at){U===null&&(U=bt);const gt=N.isMesh&&N.matrixWorld.determinant()<0,Et=Ch(b,U,B,z,N);q.setMaterial(z,gt);let vt=B.index,It=1;if(z.wireframe===!0){if(vt=y.getWireframeAttribute(B),vt===void 0)return;It=2}const Nt=B.drawRange,Dt=B.attributes.position;let Zt=Nt.start*It,ne=(Nt.start+Nt.count)*It;at!==null&&(Zt=Math.max(Zt,at.start*It),ne=Math.min(ne,(at.start+at.count)*It)),vt!==null?(Zt=Math.max(Zt,0),ne=Math.min(ne,vt.count)):Dt!=null&&(Zt=Math.max(Zt,0),ne=Math.min(ne,Dt.count));const pe=ne-Zt;if(pe<0||pe===1/0)return;mt.setup(N,z,Et,B,vt);let ce,re=_t;if(vt!==null&&(ce=T.get(vt),re=Ut,re.setIndex(ce)),N.isMesh)z.wireframe===!0?(q.setLineWidth(z.wireframeLinewidth*ae()),re.setMode(C.LINES)):re.setMode(C.TRIANGLES);else if(N.isLine){let Lt=z.linewidth;Lt===void 0&&(Lt=1),q.setLineWidth(Lt*ae()),N.isLineSegments?re.setMode(C.LINES):N.isLineLoop?re.setMode(C.LINE_LOOP):re.setMode(C.LINE_STRIP)}else N.isPoints?re.setMode(C.POINTS):N.isSprite&&re.setMode(C.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)xs("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),re.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(K.get("WEBGL_multi_draw"))re.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{const Lt=N._multiDrawStarts,he=N._multiDrawCounts,Jt=N._multiDrawCount,Ge=vt?T.get(vt).bytesPerElement:1,gi=it.get(z).currentProgram.getUniforms();for(let Ve=0;Ve<Jt;Ve++)gi.setValue(C,"_gl_DrawID",Ve),re.render(Lt[Ve]/Ge,he[Ve])}else if(N.isInstancedMesh)re.renderInstances(Zt,pe,N.count);else if(B.isInstancedBufferGeometry){const Lt=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,he=Math.min(B.instanceCount,Lt);re.renderInstances(Zt,pe,he)}else re.render(Zt,pe)};function le(b,U,B){b.transparent===!0&&b.side===tn&&b.forceSinglePass===!1?(b.side=Ie,b.needsUpdate=!0,Ls(b,U,B),b.side=Zn,b.needsUpdate=!0,Ls(b,U,B),b.side=tn):Ls(b,U,B)}this.compile=function(b,U,B=null){B===null&&(B=b),d=Rt.get(B),d.init(U),v.push(d),B.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(d.pushLight(N),N.castShadow&&d.pushShadow(N))}),b!==B&&b.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(d.pushLight(N),N.castShadow&&d.pushShadow(N))}),d.setupLights();const z=new Set;return b.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;const at=N.material;if(at)if(Array.isArray(at))for(let gt=0;gt<at.length;gt++){const Et=at[gt];le(Et,B,N),z.add(Et)}else le(at,B,N),z.add(at)}),d=v.pop(),z},this.compileAsync=function(b,U,B=null){const z=this.compile(b,U,B);return new Promise(N=>{function at(){if(z.forEach(function(gt){it.get(gt).currentProgram.isReady()&&z.delete(gt)}),z.size===0){N(b);return}setTimeout(at,10)}K.get("KHR_parallel_shader_compile")!==null?at():setTimeout(at,10)})};let te=null;function Sn(b){te&&te(b)}function un(){Jn.stop()}function tl(){Jn.start()}const Jn=new lh;Jn.setAnimationLoop(Sn),typeof self<"u"&&Jn.setContext(self),this.setAnimationLoop=function(b){te=b,lt.setAnimationLoop(b),b===null?Jn.stop():Jn.start()},lt.addEventListener("sessionstart",un),lt.addEventListener("sessionend",tl),this.render=function(b,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),lt.enabled===!0&&lt.isPresenting===!0&&(lt.cameraAutoUpdate===!0&&lt.updateCamera(U),U=lt.getCamera()),b.isScene===!0&&b.onBeforeRender(_,b,U,P),d=Rt.get(b,v.length),d.init(U),v.push(d),nt.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),ee.setFromProjectionMatrix(nt,mn,U.reversedDepth),Z=this.localClippingEnabled,Kt=ct.init(this.clippingPlanes,Z),m=W.get(b,M.length),m.init(),M.push(m),lt.enabled===!0&&lt.isPresenting===!0){const at=_.xr.getDepthSensingMesh();at!==null&&Ur(at,U,-1/0,_.sortObjects)}Ur(b,U,0,_.sortObjects),m.finish(),_.sortObjects===!0&&m.sort(dt,xt),Yt=lt.enabled===!1||lt.isPresenting===!1||lt.hasDepthSensing()===!1,Yt&&Tt.addToRenderList(m,b),this.info.render.frame++,Kt===!0&&ct.beginShadows();const B=d.state.shadowsArray;wt.render(B,b,U),Kt===!0&&ct.endShadows(),this.info.autoReset===!0&&this.info.reset();const z=m.opaque,N=m.transmissive;if(d.setupLights(),U.isArrayCamera){const at=U.cameras;if(N.length>0)for(let gt=0,Et=at.length;gt<Et;gt++){const vt=at[gt];nl(z,N,b,vt)}Yt&&Tt.render(b);for(let gt=0,Et=at.length;gt<Et;gt++){const vt=at[gt];el(m,b,vt,vt.viewport)}}else N.length>0&&nl(z,N,b,U),Yt&&Tt.render(b),el(m,b,U);P!==null&&R===0&&(ut.updateMultisampleRenderTarget(P),ut.updateRenderTargetMipmap(P)),b.isScene===!0&&b.onAfterRender(_,b,U),mt.resetDefaultState(),S=-1,E=null,v.pop(),v.length>0?(d=v[v.length-1],Kt===!0&&ct.setGlobalState(_.clippingPlanes,d.state.camera)):d=null,M.pop(),M.length>0?m=M[M.length-1]:m=null};function Ur(b,U,B,z){if(b.visible===!1)return;if(b.layers.test(U.layers)){if(b.isGroup)B=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(U);else if(b.isLight)d.pushLight(b),b.castShadow&&d.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||ee.intersectsSprite(b)){z&&Pt.setFromMatrixPosition(b.matrixWorld).applyMatrix4(nt);const gt=F.update(b),Et=b.material;Et.visible&&m.push(b,gt,Et,B,Pt.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||ee.intersectsObject(b))){const gt=F.update(b),Et=b.material;if(z&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Pt.copy(b.boundingSphere.center)):(gt.boundingSphere===null&&gt.computeBoundingSphere(),Pt.copy(gt.boundingSphere.center)),Pt.applyMatrix4(b.matrixWorld).applyMatrix4(nt)),Array.isArray(Et)){const vt=gt.groups;for(let It=0,Nt=vt.length;It<Nt;It++){const Dt=vt[It],Zt=Et[Dt.materialIndex];Zt&&Zt.visible&&m.push(b,gt,Zt,B,Pt.z,Dt)}}else Et.visible&&m.push(b,gt,Et,B,Pt.z,null)}}const at=b.children;for(let gt=0,Et=at.length;gt<Et;gt++)Ur(at[gt],U,B,z)}function el(b,U,B,z){const N=b.opaque,at=b.transmissive,gt=b.transparent;d.setupLightsView(B),Kt===!0&&ct.setGlobalState(_.clippingPlanes,B),z&&q.viewport(L.copy(z)),N.length>0&&Ds(N,U,B),at.length>0&&Ds(at,U,B),gt.length>0&&Ds(gt,U,B),q.buffers.depth.setTest(!0),q.buffers.depth.setMask(!0),q.buffers.color.setMask(!0),q.setPolygonOffset(!1)}function nl(b,U,B,z){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[z.id]===void 0&&(d.state.transmissionRenderTarget[z.id]=new ui(1,1,{generateMipmaps:!0,type:K.has("EXT_color_buffer_half_float")||K.has("EXT_color_buffer_float")?Es:gn,minFilter:li,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:$t.workingColorSpace}));const at=d.state.transmissionRenderTarget[z.id],gt=z.viewport||L;at.setSize(gt.z*_.transmissionResolutionScale,gt.w*_.transmissionResolutionScale);const Et=_.getRenderTarget(),vt=_.getActiveCubeFace(),It=_.getActiveMipmapLevel();_.setRenderTarget(at),_.getClearColor(Y),G=_.getClearAlpha(),G<1&&_.setClearColor(16777215,.5),_.clear(),Yt&&Tt.render(B);const Nt=_.toneMapping;_.toneMapping=Xn;const Dt=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),d.setupLightsView(z),Kt===!0&&ct.setGlobalState(_.clippingPlanes,z),Ds(b,B,z),ut.updateMultisampleRenderTarget(at),ut.updateRenderTargetMipmap(at),K.has("WEBGL_multisampled_render_to_texture")===!1){let Zt=!1;for(let ne=0,pe=U.length;ne<pe;ne++){const ce=U[ne],re=ce.object,Lt=ce.geometry,he=ce.material,Jt=ce.group;if(he.side===tn&&re.layers.test(z.layers)){const Ge=he.side;he.side=Ie,he.needsUpdate=!0,il(re,B,z,Lt,he,Jt),he.side=Ge,he.needsUpdate=!0,Zt=!0}}Zt===!0&&(ut.updateMultisampleRenderTarget(at),ut.updateRenderTargetMipmap(at))}_.setRenderTarget(Et,vt,It),_.setClearColor(Y,G),Dt!==void 0&&(z.viewport=Dt),_.toneMapping=Nt}function Ds(b,U,B){const z=U.isScene===!0?U.overrideMaterial:null;for(let N=0,at=b.length;N<at;N++){const gt=b[N],Et=gt.object,vt=gt.geometry,It=gt.group;let Nt=gt.material;Nt.allowOverride===!0&&z!==null&&(Nt=z),Et.layers.test(B.layers)&&il(Et,U,B,vt,Nt,It)}}function il(b,U,B,z,N,at){b.onBeforeRender(_,U,B,z,N,at),b.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),N.onBeforeRender(_,U,B,z,b,at),N.transparent===!0&&N.side===tn&&N.forceSinglePass===!1?(N.side=Ie,N.needsUpdate=!0,_.renderBufferDirect(B,U,z,N,b,at),N.side=Zn,N.needsUpdate=!0,_.renderBufferDirect(B,U,z,N,b,at),N.side=tn):_.renderBufferDirect(B,U,z,N,b,at),b.onAfterRender(_,U,B,z,N,at)}function Ls(b,U,B){U.isScene!==!0&&(U=bt);const z=it.get(b),N=d.state.lights,at=d.state.shadowsArray,gt=N.state.version,Et=k.getParameters(b,N.state,at,U,B),vt=k.getProgramCacheKey(Et);let It=z.programs;z.environment=b.isMeshStandardMaterial?U.environment:null,z.fog=U.fog,z.envMap=(b.isMeshStandardMaterial?Ft:Ot).get(b.envMap||z.environment),z.envMapRotation=z.environment!==null&&b.envMap===null?U.environmentRotation:b.envMapRotation,It===void 0&&(b.addEventListener("dispose",J),It=new Map,z.programs=It);let Nt=It.get(vt);if(Nt!==void 0){if(z.currentProgram===Nt&&z.lightsStateVersion===gt)return rl(b,Et),Nt}else Et.uniforms=k.getUniforms(b),b.onBeforeCompile(Et,_),Nt=k.acquireProgram(Et,vt),It.set(vt,Nt),z.uniforms=Et.uniforms;const Dt=z.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Dt.clippingPlanes=ct.uniform),rl(b,Et),z.needsLights=Dh(b),z.lightsStateVersion=gt,z.needsLights&&(Dt.ambientLightColor.value=N.state.ambient,Dt.lightProbe.value=N.state.probe,Dt.directionalLights.value=N.state.directional,Dt.directionalLightShadows.value=N.state.directionalShadow,Dt.spotLights.value=N.state.spot,Dt.spotLightShadows.value=N.state.spotShadow,Dt.rectAreaLights.value=N.state.rectArea,Dt.ltc_1.value=N.state.rectAreaLTC1,Dt.ltc_2.value=N.state.rectAreaLTC2,Dt.pointLights.value=N.state.point,Dt.pointLightShadows.value=N.state.pointShadow,Dt.hemisphereLights.value=N.state.hemi,Dt.directionalShadowMap.value=N.state.directionalShadowMap,Dt.directionalShadowMatrix.value=N.state.directionalShadowMatrix,Dt.spotShadowMap.value=N.state.spotShadowMap,Dt.spotLightMatrix.value=N.state.spotLightMatrix,Dt.spotLightMap.value=N.state.spotLightMap,Dt.pointShadowMap.value=N.state.pointShadowMap,Dt.pointShadowMatrix.value=N.state.pointShadowMatrix),z.currentProgram=Nt,z.uniformsList=null,Nt}function sl(b){if(b.uniformsList===null){const U=b.currentProgram.getUniforms();b.uniformsList=ur.seqWithValue(U.seq,b.uniforms)}return b.uniformsList}function rl(b,U){const B=it.get(b);B.outputColorSpace=U.outputColorSpace,B.batching=U.batching,B.batchingColor=U.batchingColor,B.instancing=U.instancing,B.instancingColor=U.instancingColor,B.instancingMorph=U.instancingMorph,B.skinning=U.skinning,B.morphTargets=U.morphTargets,B.morphNormals=U.morphNormals,B.morphColors=U.morphColors,B.morphTargetsCount=U.morphTargetsCount,B.numClippingPlanes=U.numClippingPlanes,B.numIntersection=U.numClipIntersection,B.vertexAlphas=U.vertexAlphas,B.vertexTangents=U.vertexTangents,B.toneMapping=U.toneMapping}function Ch(b,U,B,z,N){U.isScene!==!0&&(U=bt),ut.resetTextureUnits();const at=U.fog,gt=z.isMeshStandardMaterial?U.environment:null,Et=P===null?_.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:Hi,vt=(z.isMeshStandardMaterial?Ft:Ot).get(z.envMap||gt),It=z.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,Nt=!!B.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),Dt=!!B.morphAttributes.position,Zt=!!B.morphAttributes.normal,ne=!!B.morphAttributes.color;let pe=Xn;z.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(pe=_.toneMapping);const ce=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,re=ce!==void 0?ce.length:0,Lt=it.get(z),he=d.state.lights;if(Kt===!0&&(Z===!0||b!==E)){const Ne=b===E&&z.id===S;ct.setState(z,b,Ne)}let Jt=!1;z.version===Lt.__version?(Lt.needsLights&&Lt.lightsStateVersion!==he.state.version||Lt.outputColorSpace!==Et||N.isBatchedMesh&&Lt.batching===!1||!N.isBatchedMesh&&Lt.batching===!0||N.isBatchedMesh&&Lt.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&Lt.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&Lt.instancing===!1||!N.isInstancedMesh&&Lt.instancing===!0||N.isSkinnedMesh&&Lt.skinning===!1||!N.isSkinnedMesh&&Lt.skinning===!0||N.isInstancedMesh&&Lt.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&Lt.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&Lt.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&Lt.instancingMorph===!1&&N.morphTexture!==null||Lt.envMap!==vt||z.fog===!0&&Lt.fog!==at||Lt.numClippingPlanes!==void 0&&(Lt.numClippingPlanes!==ct.numPlanes||Lt.numIntersection!==ct.numIntersection)||Lt.vertexAlphas!==It||Lt.vertexTangents!==Nt||Lt.morphTargets!==Dt||Lt.morphNormals!==Zt||Lt.morphColors!==ne||Lt.toneMapping!==pe||Lt.morphTargetsCount!==re)&&(Jt=!0):(Jt=!0,Lt.__version=z.version);let Ge=Lt.currentProgram;Jt===!0&&(Ge=Ls(z,U,N));let gi=!1,Ve=!1,Ki=!1;const ue=Ge.getUniforms(),je=Lt.uniforms;if(q.useProgram(Ge.program)&&(gi=!0,Ve=!0,Ki=!0),z.id!==S&&(S=z.id,Ve=!0),gi||E!==b){q.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),ue.setValue(C,"projectionMatrix",b.projectionMatrix),ue.setValue(C,"viewMatrix",b.matrixWorldInverse);const Be=ue.map.cameraPosition;Be!==void 0&&Be.setValue(C,yt.setFromMatrixPosition(b.matrixWorld)),j.logarithmicDepthBuffer&&ue.setValue(C,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&ue.setValue(C,"isOrthographic",b.isOrthographicCamera===!0),E!==b&&(E=b,Ve=!0,Ki=!0)}if(N.isSkinnedMesh){ue.setOptional(C,N,"bindMatrix"),ue.setOptional(C,N,"bindMatrixInverse");const Ne=N.skeleton;Ne&&(Ne.boneTexture===null&&Ne.computeBoneTexture(),ue.setValue(C,"boneTexture",Ne.boneTexture,ut))}N.isBatchedMesh&&(ue.setOptional(C,N,"batchingTexture"),ue.setValue(C,"batchingTexture",N._matricesTexture,ut),ue.setOptional(C,N,"batchingIdTexture"),ue.setValue(C,"batchingIdTexture",N._indirectTexture,ut),ue.setOptional(C,N,"batchingColorTexture"),N._colorsTexture!==null&&ue.setValue(C,"batchingColorTexture",N._colorsTexture,ut));const Ke=B.morphAttributes;if((Ke.position!==void 0||Ke.normal!==void 0||Ke.color!==void 0)&&rt.update(N,B,Ge),(Ve||Lt.receiveShadow!==N.receiveShadow)&&(Lt.receiveShadow=N.receiveShadow,ue.setValue(C,"receiveShadow",N.receiveShadow)),z.isMeshGouraudMaterial&&z.envMap!==null&&(je.envMap.value=vt,je.flipEnvMap.value=vt.isCubeTexture&&vt.isRenderTargetTexture===!1?-1:1),z.isMeshStandardMaterial&&z.envMap===null&&U.environment!==null&&(je.envMapIntensity.value=U.environmentIntensity),Ve&&(ue.setValue(C,"toneMappingExposure",_.toneMappingExposure),Lt.needsLights&&Ph(je,Ki),at&&z.fog===!0&&tt.refreshFogUniforms(je,at),tt.refreshMaterialUniforms(je,z,V,$,d.state.transmissionRenderTarget[b.id]),ur.upload(C,sl(Lt),je,ut)),z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&(ur.upload(C,sl(Lt),je,ut),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&ue.setValue(C,"center",N.center),ue.setValue(C,"modelViewMatrix",N.modelViewMatrix),ue.setValue(C,"normalMatrix",N.normalMatrix),ue.setValue(C,"modelMatrix",N.matrixWorld),z.isShaderMaterial||z.isRawShaderMaterial){const Ne=z.uniformsGroups;for(let Be=0,Nr=Ne.length;Be<Nr;Be++){const $n=Ne[Be];Ht.update($n,Ge),Ht.bind($n,Ge)}}return Ge}function Ph(b,U){b.ambientLightColor.needsUpdate=U,b.lightProbe.needsUpdate=U,b.directionalLights.needsUpdate=U,b.directionalLightShadows.needsUpdate=U,b.pointLights.needsUpdate=U,b.pointLightShadows.needsUpdate=U,b.spotLights.needsUpdate=U,b.spotLightShadows.needsUpdate=U,b.rectAreaLights.needsUpdate=U,b.hemisphereLights.needsUpdate=U}function Dh(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(b,U,B){const z=it.get(b);z.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,z.__autoAllocateDepthBuffer===!1&&(z.__useRenderToTexture=!1),it.get(b.texture).__webglTexture=U,it.get(b.depthTexture).__webglTexture=z.__autoAllocateDepthBuffer?void 0:B,z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,U){const B=it.get(b);B.__webglFramebuffer=U,B.__useDefaultFramebuffer=U===void 0};const Lh=C.createFramebuffer();this.setRenderTarget=function(b,U=0,B=0){P=b,A=U,R=B;let z=!0,N=null,at=!1,gt=!1;if(b){const vt=it.get(b);if(vt.__useDefaultFramebuffer!==void 0)q.bindFramebuffer(C.FRAMEBUFFER,null),z=!1;else if(vt.__webglFramebuffer===void 0)ut.setupRenderTarget(b);else if(vt.__hasExternalTextures)ut.rebindTextures(b,it.get(b.texture).__webglTexture,it.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const Dt=b.depthTexture;if(vt.__boundDepthTexture!==Dt){if(Dt!==null&&it.has(Dt)&&(b.width!==Dt.image.width||b.height!==Dt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ut.setupDepthRenderbuffer(b)}}const It=b.texture;(It.isData3DTexture||It.isDataArrayTexture||It.isCompressedArrayTexture)&&(gt=!0);const Nt=it.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Nt[U])?N=Nt[U][B]:N=Nt[U],at=!0):b.samples>0&&ut.useMultisampledRTT(b)===!1?N=it.get(b).__webglMultisampledFramebuffer:Array.isArray(Nt)?N=Nt[B]:N=Nt,L.copy(b.viewport),O.copy(b.scissor),H=b.scissorTest}else L.copy(Mt).multiplyScalar(V).floor(),O.copy(zt).multiplyScalar(V).floor(),H=jt;if(B!==0&&(N=Lh),q.bindFramebuffer(C.FRAMEBUFFER,N)&&z&&q.drawBuffers(b,N),q.viewport(L),q.scissor(O),q.setScissorTest(H),at){const vt=it.get(b.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_CUBE_MAP_POSITIVE_X+U,vt.__webglTexture,B)}else if(gt){const vt=U;for(let It=0;It<b.textures.length;It++){const Nt=it.get(b.textures[It]);C.framebufferTextureLayer(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0+It,Nt.__webglTexture,B,vt)}}else if(b!==null&&B!==0){const vt=it.get(b.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,vt.__webglTexture,B)}S=-1},this.readRenderTargetPixels=function(b,U,B,z,N,at,gt,Et=0){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let vt=it.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&gt!==void 0&&(vt=vt[gt]),vt){q.bindFramebuffer(C.FRAMEBUFFER,vt);try{const It=b.textures[Et],Nt=It.format,Dt=It.type;if(!j.textureFormatReadable(Nt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!j.textureTypeReadable(Dt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=b.width-z&&B>=0&&B<=b.height-N&&(b.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+Et),C.readPixels(U,B,z,N,Ct.convert(Nt),Ct.convert(Dt),at))}finally{const It=P!==null?it.get(P).__webglFramebuffer:null;q.bindFramebuffer(C.FRAMEBUFFER,It)}}},this.readRenderTargetPixelsAsync=async function(b,U,B,z,N,at,gt,Et=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let vt=it.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&gt!==void 0&&(vt=vt[gt]),vt)if(U>=0&&U<=b.width-z&&B>=0&&B<=b.height-N){q.bindFramebuffer(C.FRAMEBUFFER,vt);const It=b.textures[Et],Nt=It.format,Dt=It.type;if(!j.textureFormatReadable(Nt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!j.textureTypeReadable(Dt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Zt=C.createBuffer();C.bindBuffer(C.PIXEL_PACK_BUFFER,Zt),C.bufferData(C.PIXEL_PACK_BUFFER,at.byteLength,C.STREAM_READ),b.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+Et),C.readPixels(U,B,z,N,Ct.convert(Nt),Ct.convert(Dt),0);const ne=P!==null?it.get(P).__webglFramebuffer:null;q.bindFramebuffer(C.FRAMEBUFFER,ne);const pe=C.fenceSync(C.SYNC_GPU_COMMANDS_COMPLETE,0);return C.flush(),await Eu(C,pe,4),C.bindBuffer(C.PIXEL_PACK_BUFFER,Zt),C.getBufferSubData(C.PIXEL_PACK_BUFFER,0,at),C.deleteBuffer(Zt),C.deleteSync(pe),at}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,U=null,B=0){const z=Math.pow(2,-B),N=Math.floor(b.image.width*z),at=Math.floor(b.image.height*z),gt=U!==null?U.x:0,Et=U!==null?U.y:0;ut.setTexture2D(b,0),C.copyTexSubImage2D(C.TEXTURE_2D,B,0,0,gt,Et,N,at),q.unbindTexture()};const Ih=C.createFramebuffer(),Uh=C.createFramebuffer();this.copyTextureToTexture=function(b,U,B=null,z=null,N=0,at=null){at===null&&(N!==0?(xs("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),at=N,N=0):at=0);let gt,Et,vt,It,Nt,Dt,Zt,ne,pe;const ce=b.isCompressedTexture?b.mipmaps[at]:b.image;if(B!==null)gt=B.max.x-B.min.x,Et=B.max.y-B.min.y,vt=B.isBox3?B.max.z-B.min.z:1,It=B.min.x,Nt=B.min.y,Dt=B.isBox3?B.min.z:0;else{const Ke=Math.pow(2,-N);gt=Math.floor(ce.width*Ke),Et=Math.floor(ce.height*Ke),b.isDataArrayTexture?vt=ce.depth:b.isData3DTexture?vt=Math.floor(ce.depth*Ke):vt=1,It=0,Nt=0,Dt=0}z!==null?(Zt=z.x,ne=z.y,pe=z.z):(Zt=0,ne=0,pe=0);const re=Ct.convert(U.format),Lt=Ct.convert(U.type);let he;U.isData3DTexture?(ut.setTexture3D(U,0),he=C.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(ut.setTexture2DArray(U,0),he=C.TEXTURE_2D_ARRAY):(ut.setTexture2D(U,0),he=C.TEXTURE_2D),C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,U.flipY),C.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),C.pixelStorei(C.UNPACK_ALIGNMENT,U.unpackAlignment);const Jt=C.getParameter(C.UNPACK_ROW_LENGTH),Ge=C.getParameter(C.UNPACK_IMAGE_HEIGHT),gi=C.getParameter(C.UNPACK_SKIP_PIXELS),Ve=C.getParameter(C.UNPACK_SKIP_ROWS),Ki=C.getParameter(C.UNPACK_SKIP_IMAGES);C.pixelStorei(C.UNPACK_ROW_LENGTH,ce.width),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,ce.height),C.pixelStorei(C.UNPACK_SKIP_PIXELS,It),C.pixelStorei(C.UNPACK_SKIP_ROWS,Nt),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Dt);const ue=b.isDataArrayTexture||b.isData3DTexture,je=U.isDataArrayTexture||U.isData3DTexture;if(b.isDepthTexture){const Ke=it.get(b),Ne=it.get(U),Be=it.get(Ke.__renderTarget),Nr=it.get(Ne.__renderTarget);q.bindFramebuffer(C.READ_FRAMEBUFFER,Be.__webglFramebuffer),q.bindFramebuffer(C.DRAW_FRAMEBUFFER,Nr.__webglFramebuffer);for(let $n=0;$n<vt;$n++)ue&&(C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,it.get(b).__webglTexture,N,Dt+$n),C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,it.get(U).__webglTexture,at,pe+$n)),C.blitFramebuffer(It,Nt,gt,Et,Zt,ne,gt,Et,C.DEPTH_BUFFER_BIT,C.NEAREST);q.bindFramebuffer(C.READ_FRAMEBUFFER,null),q.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else if(N!==0||b.isRenderTargetTexture||it.has(b)){const Ke=it.get(b),Ne=it.get(U);q.bindFramebuffer(C.READ_FRAMEBUFFER,Ih),q.bindFramebuffer(C.DRAW_FRAMEBUFFER,Uh);for(let Be=0;Be<vt;Be++)ue?C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,Ke.__webglTexture,N,Dt+Be):C.framebufferTexture2D(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,Ke.__webglTexture,N),je?C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,Ne.__webglTexture,at,pe+Be):C.framebufferTexture2D(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,Ne.__webglTexture,at),N!==0?C.blitFramebuffer(It,Nt,gt,Et,Zt,ne,gt,Et,C.COLOR_BUFFER_BIT,C.NEAREST):je?C.copyTexSubImage3D(he,at,Zt,ne,pe+Be,It,Nt,gt,Et):C.copyTexSubImage2D(he,at,Zt,ne,It,Nt,gt,Et);q.bindFramebuffer(C.READ_FRAMEBUFFER,null),q.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else je?b.isDataTexture||b.isData3DTexture?C.texSubImage3D(he,at,Zt,ne,pe,gt,Et,vt,re,Lt,ce.data):U.isCompressedArrayTexture?C.compressedTexSubImage3D(he,at,Zt,ne,pe,gt,Et,vt,re,ce.data):C.texSubImage3D(he,at,Zt,ne,pe,gt,Et,vt,re,Lt,ce):b.isDataTexture?C.texSubImage2D(C.TEXTURE_2D,at,Zt,ne,gt,Et,re,Lt,ce.data):b.isCompressedTexture?C.compressedTexSubImage2D(C.TEXTURE_2D,at,Zt,ne,ce.width,ce.height,re,ce.data):C.texSubImage2D(C.TEXTURE_2D,at,Zt,ne,gt,Et,re,Lt,ce);C.pixelStorei(C.UNPACK_ROW_LENGTH,Jt),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,Ge),C.pixelStorei(C.UNPACK_SKIP_PIXELS,gi),C.pixelStorei(C.UNPACK_SKIP_ROWS,Ve),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Ki),at===0&&U.generateMipmaps&&C.generateMipmap(he),q.unbindTexture()},this.initRenderTarget=function(b){it.get(b).__webglFramebuffer===void 0&&ut.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?ut.setTextureCube(b,0):b.isData3DTexture?ut.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?ut.setTexture2DArray(b,0):ut.setTexture2D(b,0),q.unbindTexture()},this.resetState=function(){A=0,R=0,P=null,q.reset(),mt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return mn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=$t._getDrawingBufferColorSpace(t),e.unpackColorSpace=$t._getUnpackColorSpace()}}const gc={type:"change"},ja={type:"start"},fh={type:"end"},or=new Rr,_c=new Hn,w0=Math.cos(70*Bc.DEG2RAD),ve=new D,He=2*Math.PI,se={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},xo=1e-6;class T0 extends Hd{constructor(t,e=null){super(t,e),this.state=se.NONE,this.target=new D,this.cursor=new D,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Ui.ROTATE,MIDDLE:Ui.DOLLY,RIGHT:Ui.PAN},this.touches={ONE:Li.ROTATE,TWO:Li.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new D,this._lastQuaternion=new hi,this._lastTargetPosition=new D,this._quat=new hi().setFromUnitVectors(t.up,new D(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Vl,this._sphericalDelta=new Vl,this._scale=1,this._panOffset=new D,this._rotateStart=new Q,this._rotateEnd=new Q,this._rotateDelta=new Q,this._panStart=new Q,this._panEnd=new Q,this._panDelta=new Q,this._dollyStart=new Q,this._dollyEnd=new Q,this._dollyDelta=new Q,this._dollyDirection=new D,this._mouse=new Q,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=R0.bind(this),this._onPointerDown=A0.bind(this),this._onPointerUp=C0.bind(this),this._onContextMenu=F0.bind(this),this._onMouseWheel=L0.bind(this),this._onKeyDown=I0.bind(this),this._onTouchStart=U0.bind(this),this._onTouchMove=N0.bind(this),this._onMouseDown=P0.bind(this),this._onMouseMove=D0.bind(this),this._interceptControlDown=O0.bind(this),this._interceptControlUp=B0.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(gc),this.update(),this.state=se.NONE}update(t=null){const e=this.object.position;ve.copy(e).sub(this.target),ve.applyQuaternion(this._quat),this._spherical.setFromVector3(ve),this.autoRotate&&this.state===se.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=He:n>Math.PI&&(n-=He),s<-Math.PI?s+=He:s>Math.PI&&(s-=He),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(ve.setFromSpherical(this._spherical),ve.applyQuaternion(this._quatInverse),e.copy(this.target).add(ve),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=ve.length();o=this._clampDistance(a*this._scale);const c=a-o;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){const a=new D(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;const l=new D(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(a),this.object.updateMatrixWorld(),o=ve.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(or.origin.copy(this.object.position),or.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(or.direction))<w0?this.object.lookAt(this.target):(_c.setFromNormalAndCoplanarPoint(this.object.up,this.target),or.intersectPlane(_c,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>xo||8*(1-this._lastQuaternion.dot(this.object.quaternion))>xo||this._lastTargetPosition.distanceToSquared(this.target)>xo?(this.dispatchEvent(gc),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?He/60*this.autoRotateSpeed*t:He/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){ve.setFromMatrixColumn(e,0),ve.multiplyScalar(-t),this._panOffset.add(ve)}_panUp(t,e){this.screenSpacePanning===!0?ve.setFromMatrixColumn(e,1):(ve.setFromMatrixColumn(e,0),ve.crossVectors(this.object.up,ve)),ve.multiplyScalar(t),this._panOffset.add(ve)}_pan(t,e){const n=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;ve.copy(s).sub(this.target);let r=ve.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),s=t-n.left,r=e-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(He*this._rotateDelta.x/e.clientHeight),this._rotateUp(He*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(He*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-He*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(He*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-He*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(n,s)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const n=this._getSecondPointerPosition(t),s=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(He*this._rotateDelta.x/e.clientHeight),this._rotateUp(He*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new Q,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function A0(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function R0(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function C0(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(fh),this.state=se.NONE;break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function P0(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case Ui.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=se.DOLLY;break;case Ui.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=se.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=se.ROTATE}break;case Ui.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=se.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=se.PAN}break;default:this.state=se.NONE}this.state!==se.NONE&&this.dispatchEvent(ja)}function D0(i){switch(this.state){case se.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case se.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case se.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function L0(i){this.enabled===!1||this.enableZoom===!1||this.state!==se.NONE||(i.preventDefault(),this.dispatchEvent(ja),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(fh))}function I0(i){this.enabled!==!1&&this._handleKeyDown(i)}function U0(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case Li.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=se.TOUCH_ROTATE;break;case Li.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=se.TOUCH_PAN;break;default:this.state=se.NONE}break;case 2:switch(this.touches.TWO){case Li.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=se.TOUCH_DOLLY_PAN;break;case Li.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=se.TOUCH_DOLLY_ROTATE;break;default:this.state=se.NONE}break;default:this.state=se.NONE}this.state!==se.NONE&&this.dispatchEvent(ja)}function N0(i){switch(this._trackPointer(i),this.state){case se.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case se.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case se.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case se.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=se.NONE}}function F0(i){this.enabled!==!1&&i.preventDefault()}function O0(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function B0(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Sr(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,c=new Ee;let l=0;for(let h=0;h<i.length;++h){const u=i[h];let f=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const p in u.attributes){if(!n.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+p+'" attribute exists among all geometries, or in none of them.'),null;r[p]===void 0&&(r[p]=[]),r[p].push(u.attributes[p]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const p in u.morphAttributes){if(!s.has(p))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[p]===void 0&&(o[p]=[]),o[p].push(u.morphAttributes[p])}if(t){let p;if(e)p=u.index.count;else if(u.attributes.position!==void 0)p=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,p,h),l+=p}}if(e){let h=0;const u=[];for(let f=0;f<i.length;++f){const p=i[f].index;for(let g=0;g<p.count;++g)u.push(p.getX(g)+h);h+=i[f].attributes.position.count}c.setIndex(u)}for(const h in r){const u=xc(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(const h in o){const u=o[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let f=0;f<u;++f){const p=[];for(let x=0;x<o[h].length;++x)p.push(o[h][x][f]);const g=xc(p);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(g)}}return c}function xc(i){let t,e,n,s=-1,r=0;for(let l=0;l<i.length;++l){const h=i[l];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}const o=new t(r),a=new nn(o,e,n);let c=0;for(let l=0;l<i.length;++l){const h=i[l];if(h.isInterleavedBufferAttribute){const u=c/e;for(let f=0,p=h.count;f<p;f++)for(let g=0;g<e;g++){const x=h.getComponent(f,g);a.setComponent(f+u,g,x)}}else o.set(h.array,c);c+=h.count*e}return s!==void 0&&(a.gpuType=s),a}const z0=JSON.parse('[{"id":"b-north-tip","name":"北端折形楼","category":"other","height":15,"footprint":[[203.8,-511.1],[267.4,-511.7],[267.4,-491.5],[255.5,-491.5],[255.5,-498.6],[217.5,-498.6],[217.5,-476],[204.4,-476]],"roof":"cream","note":"影像可见屋顶轮廓的简化描绘，非实测基底；高度约15米，仅示意；用途及正式楼名未核实。"},{"id":"b-north-court-a","name":"西北院落楼北翼","category":"other","height":20,"footprint":[[-18.7,-439.7],[109.2,-439.7],[109.2,-419.5],[31.9,-419.5],[31.9,-410],[20,-410],[20,-420.7],[-6.8,-420.7],[-6.8,-409.4],[-18.7,-409.4]],"roof":"cream","note":"影像可见屋顶轮廓的简化描绘，非实测基底；高度约20米，仅示意；用途及正式楼名未核实。与西北院落楼南翼为同一可见院落体量的分段，保留中庭。"},{"id":"b-north-court-b","name":"学生宿舍8","category":"other","height":20,"footprint":[[-18.7,-409.4],[-6.8,-409.4],[-6.8,-398.7],[20,-398.7],[20,-410],[31.9,-410],[31.9,-379.7],[-18.7,-379.7]],"roof":"cream","note":"屋顶轮廓为影像判读的简化描绘，非实测基底；高度为示意估算。楼名取自第三方校园地图参考点位（点落入轮廓内，偏移 0.0 m），未经校方核实。","shapeName":"西北院落楼南翼","poiType":"dormitory","nameEvidence":"third-party","nameOffsetM":0},{"id":"b-north-arc","name":"致远楼","category":"landmark","height":22,"footprint":[[73.5,-360],[81.8,-367.8],[95.5,-367.8],[95.5,-356.5],[102.7,-356.5],[102.7,-360.6],[118.1,-362.4],[118.1,-359.4],[144.9,-363],[160.4,-362.4],[160.4,-360],[183,-358.3],[183,-361.2],[196,-359.4],[196,-355.3],[205,-353.5],[205,-366],[220.4,-366],[226.4,-357.1],[226.4,-331.5],[209.7,-331.5],[209.7,-334.5],[186.5,-338.6],[164.5,-342.2],[156.8,-339.8],[145.5,-339.8],[136,-342.8],[114.6,-339.2],[96.1,-335.1],[96.1,-332.1],[84.2,-332.1],[84.2,-344.6],[73.5,-344.6]],"roof":"cream","note":"屋顶轮廓为影像判读的简化描绘，非实测基底；高度为示意估算。楼名取自第三方校园地图参考点位（点落入轮廓内，偏移 0.0 m），未经校方核实。","shapeName":"中央弧形楼","poiType":"teaching","nameEvidence":"third-party","nameOffsetM":0},{"id":"b-north-back-w","name":"甘澍楼","category":"other","height":15,"footprint":[[67.6,-392.2],[114.6,-392.2],[114.6,-395.7],[124.7,-395.7],[124.7,-379.1],[67.6,-379.1]],"roof":"gray","note":"屋顶轮廓为影像判读的简化描绘，非实测基底；高度为示意估算。楼名取自第三方校园地图参考点位（点落入轮廓内，偏移 3.7 m），未经校方核实。","shapeName":"弧形楼北侧西条楼","poiType":"teaching","nameEvidence":"third-party","nameOffsetM":3.7},{"id":"b-north-back-e","name":"学而楼","category":"other","height":15,"footprint":[[172.8,-395.7],[183,-395.7],[183,-391],[232.3,-391],[232.3,-379.7],[172.8,-379.7]],"roof":"gray","note":"屋顶轮廓为影像判读的简化描绘，非实测基底；高度为示意估算。楼名取自第三方校园地图参考点位（点落入轮廓内，偏移 3.5 m），未经校方核实。","shapeName":"弧形楼北侧东条楼","poiType":"teaching","nameEvidence":"third-party","nameOffsetM":3.5},{"id":"b-north-west-1","name":"学生宿舍6","category":"other","height":15,"footprint":[[-12.7,-365.4],[32.5,-365.4],[32.5,-353.5],[-12.7,-353.5]],"roof":"red","note":"屋顶轮廓为影像判读的简化描绘，非实测基底；高度为示意估算。楼名取自第三方校园地图参考点位（点落入轮廓内，偏移 7.6 m），未经校方核实。","shapeName":"北区西侧条楼01","poiType":"dormitory","nameEvidence":"third-party","nameOffsetM":7.6},{"id":"b-north-west-2","name":"学生宿舍7","category":"other","height":15,"footprint":[[-19.3,-332.1],[35.5,-332.1],[35.5,-320.8],[-19.3,-320.8]],"roof":"red","note":"屋顶轮廓为影像判读的简化描绘，非实测基底；高度为示意估算。楼名取自第三方校园地图参考点位（点落入轮廓内，偏移 0.0 m），未经校方核实。","shapeName":"北区西侧条楼02","poiType":"dormitory","nameEvidence":"third-party","nameOffsetM":0},{"id":"b-northeast-1","name":"四科苑4","category":"other","height":15,"footprint":[[258.5,-430.8],[319.7,-430.8],[319.7,-417.7],[258.5,-417.7]],"roof":"gray","note":"屋顶轮廓为影像判读的简化描绘，非实测基底；高度为示意估算。楼名取自第三方校园地图参考点位（点落入轮廓内，偏移 0.0 m），未经校方核实。","shapeName":"东北条楼01","poiType":"unknown","nameEvidence":"third-party","nameOffsetM":0},{"id":"b-northeast-2","name":"四科苑3","category":"other","height":15,"footprint":[[266.2,-380.9],[318,-380.9],[318,-367.2],[266.2,-367.2]],"roof":"red","note":"屋顶轮廓为影像判读的简化描绘，非实测基底；高度为示意估算。楼名取自第三方校园地图参考点位（点落入轮廓内，偏移 0.0 m），未经校方核实。","shapeName":"东北条楼02","poiType":"unknown","nameEvidence":"third-party","nameOffsetM":0},{"id":"b-northeast-3","name":"四科苑2","category":"other","height":15,"footprint":[[263.2,-349.9],[320.9,-349.9],[320.9,-335.1],[263.2,-335.1]],"roof":"cream","note":"屋顶轮廓为影像判读的简化描绘，非实测基底；高度为示意估算。楼名取自第三方校园地图参考点位（点落入轮廓内，偏移 0.0 m），未经校方核实。","shapeName":"东北条楼03","poiType":"unknown","nameEvidence":"third-party","nameOffsetM":0},{"id":"b-northeast-4","name":"四科苑1","category":"other","height":15,"footprint":[[263.2,-320.8],[316.8,-320.8],[316.8,-310.1],[263.2,-310.1]],"roof":"red","note":"屋顶轮廓为影像判读的简化描绘，非实测基底；高度为示意估算。楼名取自第三方校园地图参考点位（点落入轮廓内，偏移 6.3 m），未经校方核实。","shapeName":"东北条楼04","poiType":"unknown","nameEvidence":"third-party","nameOffsetM":6.3},{"id":"b-plaza-west","name":"图书馆","category":"other","height":20,"footprint":[[-18.7,-306.5],[40.8,-306.5],[40.8,-288.7],[30.1,-282.1],[6.9,-276.8],[-3.2,-276.8],[-3.2,-231.6],[9.3,-231.6],[27.7,-225.6],[40.8,-217.9],[40.8,-201.8],[-18.7,-201.8]],"roof":"cream","note":"屋顶轮廓为影像判读的简化描绘，非实测基底；高度为示意估算。楼名取自第三方校园地图参考点位（点落入轮廓内，偏移 15.2 m），未经校方核实。","shapeName":"广场西侧折形楼","poiType":"functionality","nameEvidence":"third-party","nameOffsetM":15.2},{"id":"b-mid-hall","name":"养根楼","category":"other","height":15,"footprint":[[-19.3,-144.7],[-9.1,-144.7],[-9.1,-154.9],[25.9,-154.9],[36.1,-135.2],[40.2,-135.2],[40.2,-119.8],[-19.3,-119.8]],"roof":"gray","note":"屋顶轮廓为影像判读的简化描绘，非实测基底；高度为示意估算。楼名取自第三方校园地图参考点位（点落入轮廓内，偏移 0.0 m），未经校方核实。","shapeName":"中区西侧块状楼","poiType":"teaching","nameEvidence":"third-party","nameOffsetM":0},{"id":"b-mid-north-w","name":"百全楼","category":"other","height":15,"footprint":[[64,-137],[140.7,-137],[140.7,-121],[64,-121]],"roof":"gray","note":"屋顶轮廓为影像判读的简化描绘，非实测基底；高度为示意估算。楼名取自第三方校园地图参考点位（点落入轮廓内，偏移 0.0 m），未经校方核实。","shapeName":"中区北侧西条楼","poiType":"teaching","nameEvidence":"third-party","nameOffsetM":0},{"id":"b-mid-north-e","name":"播馨楼","category":"other","height":15,"footprint":[[162.1,-137],[238.9,-137],[238.9,-118.6],[225.2,-118.6],[225.2,-125.7],[177,-125.7],[177,-118.6],[162.1,-118.6]],"roof":"gray","note":"屋顶轮廓为影像判读的简化描绘，非实测基底；高度为示意估算。楼名取自第三方校园地图参考点位（点落入轮廓内，偏移 0.0 m），未经校方核实。","shapeName":"中区北侧东折形楼","poiType":"teaching","nameEvidence":"third-party","nameOffsetM":0},{"id":"b-gym","name":"田径场西侧蓝顶长楼","category":"other","height":10,"footprint":[[-233.4,-92.4],[-213.1,-92.4],[-210.2,-81.7],[-210.2,58.7],[-214.9,63.4],[-233.4,63.4]],"roof":"blue","note":"影像可见屋顶轮廓的简化描绘，非实测基底；高度约10米，仅示意；用途及正式楼名未核实。蓝色可见屋面；是否为看台或馆舍未核实。"},{"id":"b-mid-west-complex","name":"淳和楼","category":"other","height":18,"footprint":[[-15.7,-104.9],[36.6,-104.9],[36.6,-36.5],[15.2,-36.5],[15.2,-62.1],[4.5,-62.1],[4.5,-87.6],[-15.7,-87.6]],"roof":"blue","note":"屋顶轮廓为影像判读的简化描绘，非实测基底；高度为示意估算。楼名取自第三方校园地图参考点位（点落入轮廓内，偏移 0.0 m），未经校方核实。","shapeName":"中区西侧复合楼","poiType":"canteen","nameEvidence":"third-party","nameOffsetM":0},{"id":"b-mid-west-l","name":"学生宿舍9","category":"other","height":18,"footprint":[[24.2,-27],[38.4,-27],[38.4,22.4],[-6.8,22.4],[-6.8,8.1],[24.2,8.1]],"roof":"cream","note":"屋顶轮廓为影像判读的简化描绘，非实测基底；高度为示意估算。楼名取自第三方校园地图参考点位（点落入轮廓内，偏移 0.0 m），未经校方核实。","shapeName":"中区西侧L形楼","poiType":"dormitory","nameEvidence":"third-party","nameOffsetM":0},{"id":"b-mid-south-c","name":"学生宿舍10","category":"other","height":20,"footprint":[[-21,45.6],[39.6,45.6],[39.6,63.4],[-6.8,63.4],[-6.8,83.6],[39.6,83.6],[39.6,102.1],[-5,102.1],[-14.5,96.7],[-21,87.8]],"roof":"blue","note":"屋顶轮廓为影像判读的简化描绘，非实测基底；高度为示意估算。楼名取自第三方校园地图参考点位（点落入轮廓内，偏移 0.0 m），未经校方核实。","shapeName":"中南部C形楼","poiType":"dormitory","nameEvidence":"third-party","nameOffsetM":0},{"id":"b-central-row-1","name":"学生宿舍1","category":"other","height":18,"footprint":[[68.8,-28.8],[122.3,-28.8],[122.3,-16.3],[68.8,-16.3]],"roof":"red","note":"屋顶轮廓为影像判读的简化描绘，非实测基底；高度为示意估算。楼名取自第三方校园地图参考点位（点落入轮廓内，偏移 9.8 m），未经校方核实。","shapeName":"中区条楼01","poiType":"dormitory","nameEvidence":"third-party","nameOffsetM":9.8},{"id":"b-central-row-2","name":"学生宿舍2","category":"other","height":18,"footprint":[[64,4.5],[128.2,4.5],[128.2,18.8],[64,18.8]],"roof":"red","note":"屋顶轮廓为影像判读的简化描绘，非实测基底；高度为示意估算。楼名取自第三方校园地图参考点位（点落入轮廓内，偏移 8.8 m），未经校方核实。","shapeName":"中区条楼02","poiType":"dormitory","nameEvidence":"third-party","nameOffsetM":8.8},{"id":"b-central-row-3","name":"学生宿舍3","category":"other","height":18,"footprint":[[69.4,46.8],[125.3,46.8],[125.3,58.1],[69.4,58.1]],"roof":"red","note":"屋顶轮廓为影像判读的简化描绘，非实测基底；高度为示意估算。楼名取自第三方校园地图参考点位（点落入轮廓内，偏移 8.6 m），未经校方核实。","shapeName":"中区条楼03","poiType":"dormitory","nameEvidence":"third-party","nameOffsetM":8.6},{"id":"b-central-row-4","name":"学生宿舍4","category":"other","height":18,"footprint":[[58.1,75.3],[132.4,75.3],[132.4,88.4],[58.1,88.4]],"roof":"gray","note":"屋顶轮廓为影像判读的简化描绘，非实测基底；高度为示意估算。楼名取自第三方校园地图参考点位（点落入轮廓内，偏移 8.3 m），未经校方核实。","shapeName":"中区条楼04","poiType":"dormitory","nameEvidence":"third-party","nameOffsetM":8.3},{"id":"b-central-row-5","name":"学生宿舍5","category":"other","height":18,"footprint":[[56.3,108],[133,108],[133,121.1],[56.3,121.1]],"roof":"gray","note":"屋顶轮廓为影像判读的简化描绘，非实测基底；高度为示意估算。楼名取自第三方校园地图参考点位（点落入轮廓内，偏移 9.0 m），未经校方核实。","shapeName":"中区条楼05","poiType":"dormitory","nameEvidence":"third-party","nameOffsetM":9},{"id":"b-east-white","name":"匠成楼","category":"other","height":15,"footprint":[[167.5,-55.5],[209.7,-55.5],[209.7,-60.9],[223.4,-60.9],[223.4,-42.4],[209.7,-42.4],[209.7,-37.7],[216.9,-37.7],[216.9,-23.4],[169.9,-23.4],[169.9,-37.7],[181.8,-37.7],[181.8,-42.4],[167.5,-42.4]],"roof":"cream","note":"屋顶轮廓为影像判读的简化描绘，非实测基底；高度为示意估算。楼名取自第三方校园地图参考点位（点落入轮廓内，偏移 0.0 m），未经校方核实。","shapeName":"中区东侧浅顶楼","poiType":"unknown","nameEvidence":"third-party","nameOffsetM":0},{"id":"b-southeast-1","name":"三才苑1","category":"other","height":18,"footprint":[[162.1,46.2],[240.1,46.2],[240.1,59.9],[162.1,59.9]],"roof":"gray","note":"屋顶轮廓为影像判读的简化描绘，非实测基底；高度为示意估算。楼名取自第三方校园地图参考点位（点落入轮廓内，偏移 0.0 m），未经校方核实。","shapeName":"中南东侧条楼01","poiType":"unknown","nameEvidence":"third-party","nameOffsetM":0},{"id":"b-southeast-2","name":"三才苑2","category":"other","height":18,"footprint":[[171.1,81.9],[240.6,81.9],[240.6,92],[171.1,92]],"roof":"red","note":"屋顶轮廓为影像判读的简化描绘，非实测基底；高度为示意估算。楼名取自第三方校园地图参考点位（点落入轮廓内，偏移 0.0 m），未经校方核实。","shapeName":"中南东侧条楼02","poiType":"unknown","nameEvidence":"third-party","nameOffsetM":0},{"id":"b-southeast-3","name":"三才苑3","category":"other","height":18,"footprint":[[168.1,111.6],[241.2,111.6],[241.2,121.7],[168.1,121.7]],"roof":"red","note":"屋顶轮廓为影像判读的简化描绘，非实测基底；高度为示意估算。楼名取自第三方校园地图参考点位（点落入轮廓内，偏移 0.0 m），未经校方核实。","shapeName":"中南东侧条楼03","poiType":"unknown","nameEvidence":"third-party","nameOffsetM":0},{"id":"b-south-red-n","name":"逸夫楼","category":"other","height":18,"footprint":[[-33.5,184.2],[15.2,184.2],[15.2,203.8],[-23.4,203.8],[-23.4,213.9],[-28.8,213.9]],"roof":"red","note":"屋顶轮廓为影像判读的简化描绘，非实测基底；高度为示意估算。楼名取自第三方校园地图参考点位（点落入轮廓内，偏移 0.0 m），未经校方核实。","shapeName":"南区东侧红顶楼","poiType":"teaching","nameEvidence":"third-party","nameOffsetM":0},{"id":"b-south-blue","name":"南区东侧斜向楼","category":"other","height":18,"footprint":[[-30,217.5],[-0.2,209.1],[9.9,246.6],[-18.1,253.7]],"roof":"blue","note":"影像可见屋顶轮廓的简化描绘，非实测基底；高度约18米，仅示意；用途及正式楼名未核实。"},{"id":"b-south-red-s","name":"南区东侧U形楼","category":"other","height":18,"footprint":[[-32.3,275.1],[11.1,275.1],[11.1,283.5],[-21.6,283.5],[-21.6,299.5],[17.6,299.5],[17.6,316.8],[-32.3,316.8]],"roof":"red","note":"影像可见屋顶轮廓的简化描绘，非实测基底；高度约18米，仅示意；用途及正式楼名未核实。"},{"id":"b-south-west-n","name":"南区西侧条楼01","category":"other","height":12,"footprint":[[-304.1,212.7],[-268.5,212.7],[-268.5,225.8],[-304.1,225.8]],"roof":"gray","note":"影像可见屋顶轮廓的简化描绘，非实测基底；高度约12米，仅示意；用途及正式楼名未核实。"},{"id":"b-south-west-s","name":"学生宿舍16","category":"other","height":12,"footprint":[[-314.8,297.7],[-258.9,297.7],[-258.9,312.6],[-314.8,312.6]],"roof":"gray","note":"屋顶轮廓为影像判读的简化描绘，非实测基底；高度为示意估算。楼名取自第三方校园地图参考点位（点落入轮廓内，偏移 0.0 m），未经校方核实。","shapeName":"南区西侧条楼02","poiType":"dormitory","nameEvidence":"third-party","nameOffsetM":0},{"id":"b-south-middle","name":"博达楼","category":"other","height":15,"footprint":[[-126.3,257.3],[-100.7,257.3],[-100.7,269.8],[-57.3,269.8],[-57.3,282.3],[-107.9,282.3],[-107.9,274.6],[-126.3,274.6]],"roof":"gray","note":"屋顶轮廓为影像判读的简化描绘，非实测基底；高度为示意估算。楼名取自第三方校园地图参考点位（点落入轮廓内，偏移 0.0 m），未经校方核实。","shapeName":"南区中部折形楼","poiType":"unknown","nameEvidence":"third-party","nameOffsetM":0},{"id":"b-south-small","name":"南区浅顶小楼","category":"other","height":10,"footprint":[[-225,275.1],[-203.6,275.1],[-203.6,281.1],[-182.8,281.1],[-182.8,291.8],[-225,291.8]],"roof":"cream","note":"影像可见屋顶轮廓的简化描绘，非实测基底；高度约10米，仅示意；用途及正式楼名未核实。"}]'),H0=[{id:"pitch",name:"田径场内球场",kind:"pitch",ring:[[-165.1,-63],[-96.5,-63.4],[-94.9,45.4],[-165.5,45.1],[-165.1,-63]],evidence:"osm"},{id:"garden-1",name:"广场东侧绿地",kind:"garden",ring:[[192.3,-235.7],[245.5,-235.9],[246.8,-157.5],[174.8,-156.5],[174.5,-196.3],[192.5,-196.5],[192.3,-235.7]],evidence:"osm"},{id:"garden-2",name:"广场西侧绿地",kind:"garden",ring:[[103.6,-239.1],[54,-239.2],[54.2,-156.8],[117.4,-156.9],[118.4,-196.9],[103,-197.2],[103.6,-239.1]],evidence:"osm"},{id:"plaza",name:"圆形广场",kind:"plaza",circle:[148.5,-254],r:45,evidence:"imagery-approximate"},{id:"basketball",name:"中区球场",kind:"court",ring:[[58.1,-96.6],[133,-96.6],[133,-54.3],[58.1,-54.3]],evidence:"imagery"},{id:"court-east",name:"中区东侧球场",kind:"court",ring:[[163.3,-6.8],[218.6,-6.8],[218.6,24.2],[163.3,24.2]],evidence:"imagery"},{id:"paved",name:"西南铺装场地",kind:"paved",ring:[[-147.1,98.5],[-57.9,98.5],[-57.9,163.3],[-147.1,163.3]],evidence:"imagery"},{id:"tennis",name:"南区球场",kind:"court",ring:[[-241.1,215.1],[-162,215.1],[-162,252.5],[-241.1,252.5]],evidence:"imagery"}],k0=[{name:"学院路",evidence:"osm",line:[[-46.2,321.3],[-43.3,105.8],[-39.5,-727.3]]},{name:"桃圃街",evidence:"osm",line:[[767.5,144.7],[754.1,140.1],[740.1,135.3],[434.5,131.6],[420.5,131.9],[392,133.2]]}],G0=[[-61.6,-449.3],[180.5,-458.8],[186.2,-513.9],[228.7,-534.1],[272.8,-525.6],[271.2,-477.8],[320.6,-476.6],[346.7,-462.2],[349.1,-415.6],[383.8,-412.8],[384.3,-146],[256.8,-148.3],[248.2,153.5],[55.4,141.2],[-18.6,112.7],[-24.5,130.6],[22.1,157.1],[26.7,333.9],[-243.3,333.8],[-253.1,322.1],[-321.6,323.6],[-322.5,140.3],[-258.1,139.6],[-248.1,-114.7],[-79.3,-112.7],[-76.9,-305.1],[-57.1,-306.5],[-61.6,-449.3]],V0=[{name:"东门",type:"school",lng:112.006435,lat:27.712191,x:392.3,z:-251.1,inBoundary:!1,bldg:null,offsetM:120.8},{name:"致远楼",type:"teaching",lng:112.003957,lat:27.713122,x:148.8,z:-355.6,inBoundary:!0,bldg:"b-north-arc",offsetM:0},{name:"图书馆",type:"functionality",lng:112.002458,lat:27.712244,x:1.6,z:-258.4,inBoundary:!0,bldg:"b-plaza-west",offsetM:15.2},{name:"海园广场",type:"sign",lng:112.003917,lat:27.712187,x:144.9,z:-251.5,inBoundary:!0,bldg:null,offsetM:99.5},{name:"百全楼",type:"teaching",lng:112.003425,lat:27.711112,x:96.6,z:-132,inBoundary:!0,bldg:"b-mid-north-w",offsetM:0},{name:"播馨楼",type:"teaching",lng:112.004475,lat:27.711147,x:199.7,z:-135.5,inBoundary:!0,bldg:"b-mid-north-e",offsetM:0},{name:"明德楼",type:"functionality",lng:112.005534,lat:27.711167,x:303.8,z:-137.4,inBoundary:!1,bldg:null,offsetM:103.7},{name:"甘澍楼",type:"teaching",lng:112.003469,lat:27.713451,x:100.9,z:-392.4,inBoundary:!0,bldg:"b-north-back-w",offsetM:3.7},{name:"学而楼",type:"teaching",lng:112.00445,lat:27.713451,x:197.3,z:-392.1,inBoundary:!0,bldg:"b-north-back-e",offsetM:3.5},{name:"学生宿舍6",type:"dormitory",lng:112.002498,lat:27.713208,x:5.5,z:-365.7,inBoundary:!0,bldg:"b-north-west-1",offsetM:7.6},{name:"学生宿舍7",type:"dormitory",lng:112.002455,lat:27.712858,x:1.3,z:-326.7,inBoundary:!0,bldg:"b-north-west-2",offsetM:0},{name:"学生宿舍8",type:"dormitory",lng:112.002455,lat:27.713477,x:1.3,z:-395.7,inBoundary:!0,bldg:"b-north-court-b",offsetM:0},{name:"学生宿舍1",type:"dormitory",lng:112.003385,lat:27.710213,x:92.7,z:-31.9,inBoundary:!0,bldg:"b-central-row-1",offsetM:9.8},{name:"学生宿舍2",type:"dormitory",lng:112.003385,lat:27.709894,x:92.7,z:3.6,inBoundary:!0,bldg:"b-central-row-2",offsetM:8.8},{name:"学生宿舍3",type:"dormitory",lng:112.003385,lat:27.70952,x:92.7,z:45.2,inBoundary:!0,bldg:"b-central-row-3",offsetM:8.6},{name:"学生宿舍4",type:"dormitory",lng:112.003385,lat:27.709262,x:92.7,z:74,inBoundary:!0,bldg:"b-central-row-4",offsetM:8.3},{name:"学生宿舍5",type:"dormitory",lng:112.003385,lat:27.708976,x:92.7,z:105.8,inBoundary:!0,bldg:"b-central-row-5",offsetM:9},{name:"学生宿舍9",type:"dormitory",lng:112.002679,lat:27.709843,x:23.3,z:9,inBoundary:!0,bldg:"b-mid-west-l",offsetM:0},{name:"学生宿舍10",type:"dormitory",lng:112.002437,lat:27.709466,x:-.4,z:50.9,inBoundary:!0,bldg:"b-mid-south-c",offsetM:0},{name:"学生宿舍15",type:"dormitory",lng:112.000184,lat:27.712864,x:-221.8,z:-328.2,inBoundary:!1,bldg:null,offsetM:229.9},{name:"学生宿舍14",type:"dormitory",lng:112.000188,lat:27.712501,x:-221.4,z:-287.8,inBoundary:!1,bldg:null,offsetM:232.7},{name:"学生宿舍13",type:"dormitory",lng:112.000811,lat:27.712903,x:-160.2,z:-332.3,inBoundary:!1,bldg:null,offsetM:168.4},{name:"学生宿舍12",type:"dormitory",lng:112.000811,lat:27.712472,x:-160.2,z:-284.3,inBoundary:!1,bldg:null,offsetM:173.5},{name:"学生宿舍16",type:"dormitory",lng:111.9995,lat:27.707213,x:-288.9,z:300.7,inBoundary:!0,bldg:"b-south-west-s",offsetM:0},{name:"学生宿舍17",type:"dormitory",lng:111.999547,lat:27.70752,x:-284.3,z:266.6,inBoundary:!0,bldg:null,offsetM:38.7},{name:"毓师园",type:"sign",lng:112.005673,lat:27.71176,x:317.4,z:-203.4,inBoundary:!0,bldg:null,offsetM:115.4},{name:"仁德楼",type:"unknown",lng:112.006117,lat:27.711301,x:361,z:-152.1,inBoundary:!0,bldg:null,offsetM:162.5},{name:"尚贤楼",type:"unknown",lng:112.006475,lat:27.711561,x:396.2,z:-180.9,inBoundary:!1,bldg:null,offsetM:171.4},{name:"养根楼",type:"teaching",lng:112.00246,lat:27.711144,x:1.8,z:-135.9,inBoundary:!0,bldg:"b-mid-hall",offsetM:0},{name:"淳和楼",type:"canteen",lng:112.00259,lat:27.710612,x:14.6,z:-76.6,inBoundary:!0,bldg:"b-mid-west-complex",offsetM:0},{name:"汇鼎餐厅（新食堂）",type:"canteen",lng:112.000202,lat:27.71331,x:-220,z:-377.8,inBoundary:!1,bldg:null,offsetM:227.7},{name:"宇光球场",type:"playground",lng:112.003409,lat:27.71052,x:95,z:-66.1,inBoundary:!0,bldg:null,offsetM:43.6},{name:"惠丰球场",type:"playground",lng:112.001425,lat:27.708393,x:-99.8,z:170,inBoundary:!0,bldg:null,offsetM:92},{name:"田径场",type:"playground",lng:112.001128,lat:27.710072,x:-129,z:-17,inBoundary:!0,bldg:null,offsetM:90.2},{name:"匠成楼",type:"unknown",lng:112.00442,lat:27.7104,x:194.4,z:-52.4,inBoundary:!0,bldg:"b-east-white",offsetM:0},{name:"成德楼",type:"unknown",lng:112.006006,lat:27.712843,x:350.1,z:-323.8,inBoundary:!0,bldg:null,offsetM:60.7},{name:"雅韵楼",type:"unknown",lng:112.006053,lat:27.713718,x:354.7,z:-421.2,inBoundary:!1,bldg:null,offsetM:65.7},{name:"碧梧楼",type:"unknown",lng:112.006488,lat:27.713545,x:397.5,z:-401.8,inBoundary:!1,bldg:null,offsetM:109},{name:"博达楼",type:"unknown",lng:112.001411,lat:27.707492,x:-101.2,z:270.3,inBoundary:!0,bldg:"b-south-middle",offsetM:0},{name:"逸夫楼",type:"teaching",lng:112.002325,lat:27.708187,x:-11.4,z:193.3,inBoundary:!0,bldg:"b-south-red-n",offsetM:0},{name:"阳光公寓1",type:"dormitory",lng:112.00039,lat:27.715329,x:-201.6,z:-602.6,inBoundary:!1,bldg:null,offsetM:290.9},{name:"阳光公寓2",type:"dormitory",lng:112.001297,lat:27.715306,x:-112.5,z:-599.7,inBoundary:!1,bldg:null,offsetM:227.7},{name:"阳光公寓3",type:"dormitory",lng:112.000387,lat:27.715016,x:-201.9,z:-567.7,inBoundary:!1,bldg:null,offsetM:267.9},{name:"阳光公寓4",type:"dormitory",lng:112.001278,lat:27.715016,x:-114.4,z:-567.4,inBoundary:!1,bldg:null,offsetM:204.4},{name:"阳光公寓5",type:"dormitory",lng:112.000352,lat:27.714569,x:-205.3,z:-518,inBoundary:!1,bldg:null,offsetM:242.8},{name:"阳光公寓6",type:"dormitory",lng:112.00111,lat:27.714261,x:-130.9,z:-483.4,inBoundary:!1,bldg:null,offsetM:161.1},{name:"知本楼",type:"teaching",lng:112.000217,lat:27.712188,x:-218.6,z:-252.9,inBoundary:!1,bldg:null,offsetM:234.7},{name:"树艺楼",type:"teaching",lng:112.000217,lat:27.711867,x:-218.6,z:-217.2,inBoundary:!1,bldg:null,offsetM:203.7},{name:"强毅楼",type:"teaching",lng:112.000807,lat:27.712197,x:-160.6,z:-253.7,inBoundary:!1,bldg:null,offsetM:176.7},{name:"多闻楼",type:"teaching",lng:112.000807,lat:27.711854,x:-160.6,z:-215.5,inBoundary:!1,bldg:null,offsetM:180.8},{name:"五义苑1",type:"unknown",lng:112.005515,lat:27.710699,x:301.9,z:-85.3,inBoundary:!1,bldg:null,offsetM:108.6},{name:"五义苑2",type:"unknown",lng:112.005515,lat:27.710453,x:301.9,z:-57.9,inBoundary:!1,bldg:null,offsetM:106},{name:"五义苑3",type:"unknown",lng:112.005515,lat:27.710168,x:301.9,z:-26.2,inBoundary:!1,bldg:null,offsetM:106.3},{name:"五义苑4",type:"unknown",lng:112.005515,lat:27.709966,x:301.9,z:-3.7,inBoundary:!1,bldg:null,offsetM:112},{name:"五义苑5",type:"unknown",lng:112.005515,lat:27.709746,x:301.9,z:20.8,inBoundary:!1,bldg:null,offsetM:105.9},{name:"四科苑1",type:"unknown",lng:112.005376,lat:27.71282,x:288.2,z:-321.5,inBoundary:!0,bldg:"b-northeast-4",offsetM:6.3},{name:"四科苑2",type:"unknown",lng:112.005376,lat:27.713013,x:288.2,z:-343,inBoundary:!0,bldg:"b-northeast-3",offsetM:0},{name:"四科苑3",type:"unknown",lng:112.005376,lat:27.713325,x:288.2,z:-377.7,inBoundary:!0,bldg:"b-northeast-2",offsetM:0},{name:"四科苑4",type:"unknown",lng:112.005376,lat:27.713747,x:288.2,z:-424.7,inBoundary:!0,bldg:"b-northeast-1",offsetM:0},{name:"三才苑1",type:"unknown",lng:112.004503,lat:27.7095,x:202.5,z:47.8,inBoundary:!0,bldg:"b-southeast-1",offsetM:0},{name:"三才苑2",type:"unknown",lng:112.004498,lat:27.709184,x:202,z:83,inBoundary:!0,bldg:"b-southeast-2",offsetM:0},{name:"三才苑3",type:"unknown",lng:112.004498,lat:27.708877,x:202,z:117.2,inBoundary:!0,bldg:"b-southeast-3",offsetM:0},{name:"新光球场",type:"playground",lng:112.004466,lat:27.709931,x:198.9,z:-.2,inBoundary:!0,bldg:null,offsetM:42.7},{name:"体育馆",type:"functionality",lng:111.999648,lat:27.709552,x:-274.4,z:40.4,inBoundary:!1,bldg:null,offsetM:77.1}],W0=[{name:"氐星路",highway:"secondary",w:15,line:[[428.4,-727.3],[420.4,23.8],[420.5,131.9],[421.4,145.4],[439.4,501],[449.3,734.4],[449.4,737.3],[459.7,751.8]],oneway:!0},{name:"学院路",highway:"residential",w:9,line:[[-46.2,321.3],[-43.3,105.8],[-39.6,-727.4]],oneway:!1},{name:"扶青路",highway:"secondary",w:15,line:[[-647.4,-823.6],[-651.2,-539.2],[-700,-453.1]],oneway:!0},{name:"新科街",highway:"residential",w:9,line:[[-39.6,-727.4],[414.3,-726.8],[428.4,-727.3],[439.1,-727.2],[457.6,-725.1],[575.6,-718.4],[904.4,-688.4]],oneway:!1},{name:"桃圃街",highway:"secondary",w:15,line:[[767.5,144.8],[754.1,140.2],[740.1,135.3],[434.5,131.6],[420.5,131.9],[392,133.2]],oneway:!0},{name:"娄星南路",highway:"secondary",w:15,line:[[-276.7,642.6],[-278.7,945.4]],oneway:!0},{name:"环府路",highway:"unclassified",w:10,line:[[-947.9,949.9],[-919.5,887.9],[-888,857.8],[-849.2,836.3],[-811.9,827.7],[-767.5,829.1],[-728.7,836.3],[-701.5,849.2],[-669.9,875.1],[-648.4,905.2],[-631.2,939.6]],oneway:!1},{name:"",highway:"unclassified",w:10,line:[[-78.1,671.7],[65.9,786.2],[105,814.9],[197.9,883.1],[229.1,906],[299.3,955.1],[322.2,971.1]],oneway:!1},{name:"学院路",highway:"residential",w:9,line:[[-39.6,-727.4],[-100.8,-859.1],[-129.4,-920.6]],oneway:!1},{name:"建设街",highway:"primary",w:18,line:[[469.5,738.1],[492.5,740.8],[838.5,779.3]],oneway:!0},{name:"新星南路",highway:"primary",w:18,line:[[477.9,904.2],[480.4,838.8],[483,765.9],[483.4,755.1],[492.5,740.8],[510.5,651.7],[522.3,614],[597,401.4],[661.2,297.4],[719.8,206.7],[762.4,151.4],[767.5,144.8],[806,93.7]],oneway:!0},{name:"娄星南路",highway:"secondary",w:15,line:[[-276.5,626.6],[-275.1,507.6],[-284.7,450.7],[-307.4,397.3],[-320.9,372.1],[-371.1,302],[-415.6,225.9],[-432.3,182.8],[-450.8,118.1],[-465.3,33.8],[-464.3,-45.9],[-459.3,-91.7],[-444.4,-154],[-316.7,-572.9],[-290.4,-662.2],[-277.9,-705.2],[-275.9,-722.7],[-271.9,-757.1],[-273.3,-901.2],[-271.5,-944.9]],oneway:!1},{name:"思源路",highway:"unclassified",w:10,line:[[-78.5,646.7],[-78.1,671.7],[-74.7,856.5],[-57,923.3]],oneway:!1},{name:"福泉巷",highway:"unclassified",w:10,line:[[-631.2,939.6],[-278.7,945.4]],oneway:!1},{name:"福星路",highway:"unclassified",w:10,line:[[838.5,779.3],[834.7,790.7],[841.5,905.8],[833.7,955.9]],oneway:!1},{name:"向阳街",highway:"unclassified",w:10,line:[[661.2,297.4],[830.3,407.4]],oneway:!1},{name:"",highway:"residential",w:9,line:[[838.5,779.3],[858.8,762.5],[961.8,609.1]],oneway:!1},{name:"桑树街",highway:"residential",w:9,line:[[806,93.7],[845.5,75.7],[919.3,89.9]],oneway:!1},{name:"新星南路",highway:"primary",w:18,line:[[817.7,56.5],[754.1,140.2],[747.8,148.5],[678.9,242.3],[649.3,287.3],[588,397],[520.7,566.6],[502.2,629.5],[488.4,691.4],[480.3,723.1],[469.5,738.1],[459.7,751.8]],oneway:!0},{name:"桃圃街",highway:"secondary",w:15,line:[[392.9,145.4],[421.4,145.4],[432.6,145.3],[724.7,145.8],[747.8,148.5],[762.4,151.4]],oneway:!0},{name:"氐星路",highway:"secondary",w:15,line:[[469.5,738.1],[460.2,728.4],[458.9,708.3],[455.5,658.2],[449.5,495.6],[432.6,145.3]],oneway:!0},{name:"氐星路",highway:"secondary",w:15,line:[[432.6,145.3],[434.5,131.6],[436.3,80],[439.1,-727.2]],oneway:!0},{name:"",highway:"unclassified",w:10,line:[[414.7,-857.7],[414.3,-726.8],[408.6,-111.2],[409.4,46.1],[408,96.4],[403.6,106.4],[396.2,118.3],[392,133.2]],oneway:!0},{name:"建设街",highway:"primary",w:18,line:[[459.7,751.8],[483.4,755.1],[510.8,757.1],[834.7,790.7]],oneway:!0},{name:"扶青路",highway:"secondary",w:15,line:[[-692.7,-448.3],[-642.5,-536.8],[-638.6,-823.4]],oneway:!0},{name:"",highway:"unclassified",w:10,line:[[436.3,80],[449,64.6],[451.3,-158.4],[457.4,-708.8],[457.6,-725.1]],oneway:!0},{name:"娄星南路",highway:"secondary",w:15,line:[[-263.7,945.5],[-264.6,642.7],[-264.8,626.7]],oneway:!0},{name:"",highway:"residential",w:9,line:[[-100.8,-859.1],[414.7,-857.7]],oneway:!1},{name:"",highway:"residential",w:9,line:[[-39.6,-727.4],[-275.9,-722.7]],oneway:!1},{name:"新星南路",highway:"primary",w:18,line:[[459.7,751.8],[460.9,884.7]],oneway:!0},{name:"",highway:"primary_link",w:11,line:[[483.4,755.1],[469.5,738.1]],oneway:!0},{name:"早元街",highway:"primary",w:18,line:[[-276.7,642.6],[-264.6,642.7],[-78.5,646.7],[-14.2,648.2],[134.6,674.1],[339,726.2],[459.7,751.8]],oneway:!0},{name:"早元街",highway:"primary",w:18,line:[[469.5,738.1],[449.3,734.4],[349.9,715.9],[211.3,677.6],[103.7,649.5],[-8.5,631.2],[-144.2,627.7],[-264.8,626.7],[-276.5,626.6]],oneway:!0},{name:"娄星南路",highway:"secondary",w:15,line:[[-276.5,626.6],[-276.7,642.6]],oneway:!0},{name:"",highway:"unclassified",w:10,line:[[392,133.2],[392.9,145.4]],oneway:!1}],Te={buildings:z0,areas:H0,roads:k0,campusBoundary:G0,poi:V0,roadsOsm:W0},X0=JSON.parse('[{"id":"photo-gate","title":"东大门 · 实景照片","category":"landmark","photos":[{"src":"/campus/photos/east-gate.jpg","w":800,"h":510,"cap":"双主柱附楼、上挑弧形檐板与金色校名，彩旗与灯笼为拍摄时布置","url":"https://www.huhst.edu.cn/images/15/11/22/1ir74pcoa8/1.bmp"}],"source":"https://www.huhst.edu.cn/images/15/11/22/1ir74pcoa8/1.bmp","gallery":"https://www.huhst.edu.cn/xxjs/xyfg/xxjz.htm","note":"官网「学校建筑」图库东大门原图；拍摄时间未核实，与三维场景中任何落位无关。"},{"id":"photo-library","title":"图书馆 · 实景照片","category":"landmark","photos":[{"src":"/campus/photos/library-front.jpg","w":960,"h":540,"cap":"正面近景：两翼弧形体量夹持中部连接体，翼端通高蓝色玻璃竖带，入口台阶前有校庆标识","url":"https://www.huhst.edu.cn/2019030516.jpg"},{"src":"/campus/photos/library-side.jpg","w":960,"h":692,"cap":"侧面远眺：塔楼退台与转角玻璃，中部门洞透空，环廊树阵与前区绿化","url":"https://www.huhst.edu.cn/2019030513.jpg"},{"src":"/campus/photos/library-towers.jpg","w":1024,"h":683,"cap":"全景：双塔外弧立面各带通高蓝色玻璃竖带，中部大跨度门洞，前置门厅金字「图书馆」","url":"https://www.huhst.edu.cn/images/15/12/02/1ur0bugxuc/10.JPG"},{"src":"/campus/photos/library-panorama.jpg","w":500,"h":310,"cap":"馆方「主馆全景」：可整体判读双塔—门洞—门厅三段关系与同心弧铺装前广场","url":"https://www.huhst.edu.cn/__local/3/9B/51/4CDABBC3CDB629B4DD7F6A81A06_61FDDB50_7189E.bmp"},{"src":"/campus/photos/library-approach.jpg","w":1080,"h":607,"cap":"入口轴：大台阶登临，两翼弧形立面夹中央门厅，两侧成排白色圆柱灯杆；前方「人文科技／因你而美丽」标语牌与「1978—2018」四十周年校庆标识","url":""}],"source":"https://www.huhst.edu.cn/2019030516.jpg","gallery":"https://www.huhst.edu.cn/xxjs/xyfg/xxjz.htm","note":"官网图库两个视图＋第三方站「主馆全景」＋用户现场照片（2026-07），共五图；五图均可互证：双弧翼夹中央门厅、通高蓝色玻璃竖带、门洞透空、前方大台阶与同心弧铺装广场。与场景中三维体量的对应关系为形态推测，未验证。"},{"id":"photo-zhiyuan","title":"致远楼 · 实景照片","category":"teaching","photos":[{"src":"/campus/photos/zhiyuan.jpg","w":874,"h":557,"cap":"正面：横向长体量教学主楼，楼前圆形广场与旗台","url":"https://www.huhst.edu.cn/2019030517.jpg"},{"src":"/campus/photos/zhiyuan-elevation.jpg","w":1024,"h":683,"cap":"正面全景：缓弧长立面，两端绿色玻璃竖带塔楼，中央「门」形构架高于屋面，前为放射铺装大广场","url":"https://www.huhst.edu.cn/images/15/12/02/1ur0bugxuc/14.JPG"},{"src":"/campus/photos/zhiyuan-oblique.jpg","w":800,"h":548,"cap":"斜侧近景：立面外弧与通高绿色玻璃竖带，端部白色楼梯塔与层间线脚","url":"https://www.huhst.edu.cn/images/15/11/22/1ir74pcoa8/8.bmp"},{"src":"/campus/photos/zhiyuan-membrane.jpg","w":800,"h":600,"cap":"楼前广场：白色张拉膜锥形遮阳结构与环形铺装、中心绿化岛","url":"https://www.huhst.edu.cn/images/15/11/22/1ir74pcoa8/9.bmp"}],"source":"https://www.huhst.edu.cn/2019030517.jpg","gallery":"https://www.huhst.edu.cn/xxjs/xyfg/xxjz.htm","note":"来自官网「学校建筑」「校园风光」两处图库，共四个视图；场景内无对应落位，仅作外观参考。"},{"id":"photo-tongde","title":"同德楼 · 实景照片","category":"teaching","photos":[{"src":"/campus/photos/tongde.jpg","w":960,"h":746,"cap":"浅粉色砖面多层楼，拱窗与白色线脚，入口门廊，墙面金色「同德楼」字样","url":"https://www.huhst.edu.cn/2019030515.jpg"},{"src":"/campus/photos/tongde-b.jpg","w":1024,"h":683,"cap":"第二视角：同德楼正面，可对照门窗比例与线脚层次","url":"https://www.huhst.edu.cn/images/15/12/02/1ur0bugxuc/9.JPG"}],"source":"https://www.huhst.edu.cn/2019030515.jpg","gallery":"https://www.huhst.edu.cn/xxjs/xyfg/xxjz.htm","note":"官网图库标注名；场景内无对应落位。"},{"id":"photo-ganshu","title":"甘澍楼 · 实景照片","category":"teaching","photos":[{"src":"/campus/photos/ganshu.jpg","w":978,"h":810,"cap":"米色多层楼体，竖向条窗，入口台阶与绿化前坪","url":"https://www.huhst.edu.cn/2019030514.jpg"},{"src":"/campus/photos/ganshu-b.jpg","w":1024,"h":683,"cap":"第二视角：甘澍楼全景，可见端部体量与屋面轮廓","url":"https://www.huhst.edu.cn/images/15/12/02/1ur0bugxuc/4.JPG"}],"source":"https://www.huhst.edu.cn/2019030514.jpg","gallery":"https://www.huhst.edu.cn/xxjs/xyfg/xxjz.htm","note":"官网图库标注名；场景内无对应落位。"},{"id":"photo-boxin","title":"播馨楼 · 实景照片","category":"teaching","photos":[{"src":"/campus/photos/boxin.jpg","w":960,"h":639,"cap":"浅色多层教学楼，横向窗带，楼前道路与行道树","url":"https://www.huhst.edu.cn/2019030512.jpg"}],"source":"https://www.huhst.edu.cn/2019030512.jpg","gallery":"https://www.huhst.edu.cn/xxjs/xyfg/xxjz.htm","note":"官网图库标注名；场景内无对应落位。"},{"id":"photo-xueer","title":"学而楼 · 实景照片","category":"teaching","photos":[{"src":"/campus/photos/xueer.jpg","w":960,"h":540,"cap":"白色多层老楼，竖向窗列，墙面金色「学而楼」字样，屋顶横向檐板","url":"https://www.huhst.edu.cn/2019030508.jpg"},{"src":"/campus/photos/xueer-b.jpg","w":1024,"h":683,"cap":"第二视角：学而楼沿街立面，可见檐板与窗列节奏","url":"https://www.huhst.edu.cn/images/15/12/02/1ur0bugxuc/11.JPG"}],"source":"https://www.huhst.edu.cn/2019030508.jpg","gallery":"https://www.huhst.edu.cn/xxjs/xyfg/xxjz.htm","note":"官网图库标注名；外观较旧，场景内无对应落位。"},{"id":"photo-jiangcheng","title":"匠成楼 · 实景照片","category":"teaching","photos":[{"src":"/campus/photos/jiangcheng.jpg","w":960,"h":540,"cap":"米白色多层楼，红褐竖向饰带，入口上方金色「匠成楼」字样","url":"https://www.huhst.edu.cn/4E4DAA6EF9E8B04CF8A133F26B9AEC12.jpg"},{"src":"/campus/photos/jiangcheng-b.jpg","w":800,"h":533,"cap":"第二视角：匠成楼正面，可对照竖向饰带与入口体量","url":"https://www.huhst.edu.cn/images/15/11/22/1ir74pcoa8/11.bmp"}],"source":"https://www.huhst.edu.cn/4E4DAA6EF9E8B04CF8A133F26B9AEC12.jpg","gallery":"https://www.huhst.edu.cn/xxjs/xyfg/xxjz.htm","note":"官网图库标注名（原图 BMP 已转 JPG）；场景内无对应落位。"},{"id":"photo-gaoyun","title":"高韵楼 · 实景照片","category":"teaching","photos":[{"src":"/campus/photos/gaoyun.jpg","w":800,"h":498,"cap":"浅色多层楼，规律竖窗，入口雨棚","url":"https://www.huhst.edu.cn/images/15/11/22/1ir74pcoa8/12.bmp"}],"source":"https://www.huhst.edu.cn/images/15/11/22/1ir74pcoa8/12.bmp","gallery":"https://www.huhst.edu.cn/xxjs/xyfg/xxjz.htm","note":"官网图库标注名（原图 BMP 已转 JPG）；场景内无对应落位。"},{"id":"photo-baiquan","title":"百全楼 · 实景照片","category":"teaching","photos":[{"src":"/campus/photos/baiquan.jpg","w":800,"h":533,"cap":"浅色多层楼，拱形入口，楼前绿化","url":"https://www.huhst.edu.cn/images/15/11/22/1ir74pcoa8/7.bmp"}],"source":"https://www.huhst.edu.cn/images/15/11/22/1ir74pcoa8/7.bmp","gallery":"https://www.huhst.edu.cn/xxjs/xyfg/xxjz.htm","note":"官网图库标注名（原图 BMP 已转 JPG）；场景内无对应落位。"},{"id":"photo-yanggen","title":"养根楼 · 实景照片","category":"teaching","photos":[{"src":"/campus/photos/yanggen.jpg","w":800,"h":600,"cap":"浅色多层楼，端部山墙，楼前步道","url":"https://www.huhst.edu.cn/images/15/11/22/1ir74pcoa8/6.bmp"},{"src":"/campus/photos/yanggen-lou.jpg","w":1080,"h":607,"cap":"现场：端部圆弧转角塔与竖向金字「养根楼 / YANG GEN LOU」，屋面设太阳能集热器，临街面为车行与斑马线","url":""}],"source":"https://www.huhst.edu.cn/images/15/11/22/1ir74pcoa8/6.bmp","gallery":"https://www.huhst.edu.cn/xxjs/xyfg/xxjz.htm","note":"官网图库标注「养根楼」；用户提供的现场照片（2026-07）显示端部为圆弧转角、屋面有集热器。场景内未作地理落位。"},{"id":"photo-mingde","title":"明德楼 · 实景照片","category":"teaching","photos":[{"src":"/campus/photos/mingde.jpg","w":1024,"h":683,"cap":"浅色多层办公楼，竖向「明德楼」金字，底层门厅雨棚与门前停车","url":"https://www.huhst.edu.cn/images/15/12/02/1ur0bugxuc/6.JPG"}],"source":"https://www.huhst.edu.cn/images/15/12/02/1ur0bugxuc/6.JPG","gallery":"https://www.huhst.edu.cn/xxjs/xyfg/xxfg.htm","note":"官网「校园风光」图库标注名；场景内无对应落位。"},{"id":"photo-chunhe","title":"淳和楼 · 实景照片","category":"teaching","photos":[{"src":"/campus/photos/chunhe.jpg","w":1024,"h":683,"cap":"浅色多层楼，横向窗带，入口台阶","url":"https://www.huhst.edu.cn/images/15/12/02/1ur0bugxuc/3.JPG"}],"source":"https://www.huhst.edu.cn/images/15/12/02/1ur0bugxuc/3.JPG","gallery":"https://www.huhst.edu.cn/xxjs/xyfg/xxfg.htm","note":"官网「校园风光」图库标注名；场景内无对应落位。"},{"id":"photo-yifu","title":"逸夫艺术馆（音乐舞蹈学院）· 实景照片","category":"landmark","photos":[{"src":"/campus/photos/yifu-art.jpg","w":1024,"h":683,"cap":"官网图：斜向大坡檐、锦砖盲墙与竖排金色「逸夫艺术馆」题字，中部竖向百叶带","url":"https://www.huhst.edu.cn/images/15/12/02/1ur0bugxuc/13.JPG"},{"src":"/campus/photos/yifu-music.jpg","w":1706,"h":1279,"cap":"正面：左墙「逸夫艺术馆」、中缝竖向百叶、右墙「音乐舞蹈学院」，下层为宽台阶与门厅，红色横题「音乐厅」","url":""},{"src":"/campus/photos/yifu-music-n.jpg","w":1279,"h":1706,"cap":"竖构图：两墙夹一道斜向百叶缝，「音乐舞蹈学院」下方钤印章","url":""},{"src":"/campus/photos/yifu-training.jpg","w":1706,"h":1279,"cap":"东南立面：竖排金色「艺术实训培训馆」与两道竖向百叶带，左接玻璃门厅","url":""}],"source":"https://www.huhst.edu.cn/images/15/12/02/1ur0bugxuc/13.JPG","gallery":"https://www.huhst.edu.cn/xxjs/xyfg/xxfg.htm","note":"官网「校园风光」图库标注「逸夫艺术楼」；用户提供的三张现场照片为 2026-07 同日拍摄，显示同一建筑的另三个立面。四图同用锦砖墙面＋竖向百叶＋竖排金色题字的构图，可互证为同一建筑。场景内未作地理落位。"},{"id":"photo-gym","title":"体育馆 · 实景照片","category":"sport","photos":[{"src":"/campus/photos/gym.jpg","w":960,"h":486,"cap":"远景：大跨度灰白馆舍，斜切面屋面，正面金色「体育馆」字样","url":"https://www.huhst.edu.cn/2019030504.jpg"},{"src":"/campus/photos/gym-portico.jpg","w":1024,"h":683,"cap":"近景：外挑斜屋面与檐下高侧窗带、束腰柱廊、转角圆柱体与百叶墙板","url":"https://www.huhst.edu.cn/images/15/12/02/1ur0bugxuc/8.JPG"}],"source":"https://www.huhst.edu.cn/2019030504.jpg","gallery":"https://www.huhst.edu.cn/xxjs/xyfg/xxjz.htm","note":"官网图库两个视图；场景内无对应落位。"},{"id":"photo-track","title":"田径场看台 · 实景照片","category":"sport","photos":[{"src":"/campus/photos/track.jpg","w":800,"h":372,"cap":"红色塑胶跑道环绕绿茵场，西侧蓝色顶长看台，看台下为浅色多层用房","url":"https://www.huhst.edu.cn/images/15/11/22/12u2alworb/4.bmp"}],"source":"https://www.huhst.edu.cn/images/15/11/22/12u2alworb/4.bmp","gallery":"https://www.huhst.edu.cn/xxjs/xyfg/jxss.htm","note":"官网「教学设施」图库标注「田径场」；看台形态与场景中「田径场西侧蓝顶长楼」相似，对应关系未验证。"},{"id":"photo-dorm","title":"学生宿舍 · 实景照片","category":"living","photos":[{"src":"/campus/photos/dorm.jpg","w":960,"h":640,"cap":"米黄色长条宿舍楼，白色檐口，封闭式阳台与外挂空调机位，楼前草花地","url":"https://www.huhst.edu.cn/2019030507.jpg"}],"source":"https://www.huhst.edu.cn/2019030507.jpg","gallery":"https://www.huhst.edu.cn/xxjs/xyfg/xxjz.htm","note":"官网图库仅标「学生宿舍」，无具体楼号；场景内无对应落位。"},{"id":"photo-nanfeng","title":"南风苑 · 实景照片","category":"living","photos":[{"src":"/campus/photos/nanfengyuan.jpg","w":1024,"h":683,"cap":"米色多层公寓式宿舍，错落阳台，底层架空入口","url":"https://www.huhst.edu.cn/images/15/12/02/1ur0bugxuc/7.JPG"}],"source":"https://www.huhst.edu.cn/images/15/12/02/1ur0bugxuc/7.JPG","gallery":"https://www.huhst.edu.cn/xxjs/xyfg/xxfg.htm","note":"官网「校园风光」图库标注名；场景内无对应落位。"},{"id":"photo-dorm-3","title":"宿舍区 · 实景照片","category":"living","photos":[{"src":"/campus/photos/dorm-3.jpg","w":800,"h":600,"cap":"白色长条宿舍楼群，成排行道树与自行车棚","url":"https://www.huhst.edu.cn/images/15/11/22/1ir74pcoa8/3.bmp"},{"src":"/campus/photos/dorm-b.jpg","w":1024,"h":690,"cap":"第二视角：宿舍楼组群与楼间绿化铺装","url":"https://www.huhst.edu.cn/images/15/12/02/1ur0bugxuc/12.JPG"}],"source":"https://www.huhst.edu.cn/images/15/11/22/1ir74pcoa8/3.bmp","gallery":"https://www.huhst.edu.cn/xxjs/xyfg/xxjz.htm","note":"官网「学校建筑」图库宿舍系列（原图 BMP 已转 JPG），无具体楼号。"},{"id":"photo-haiyuan","title":"海园广场 · 实景照片","category":"landmark","photos":[{"src":"/campus/photos/haiyuan.jpg","w":960,"h":540,"cap":"园内步道、孤植乔木与圆形铺装节点，周边为教学区绿地","url":"https://www.huhst.edu.cn/2019030511.jpg"},{"src":"/campus/photos/haiyuan-b.jpg","w":960,"h":540,"cap":"第二视角：海园广场绿地与步道组织","url":"https://www.huhst.edu.cn/2019030509.jpg"}],"source":"https://www.huhst.edu.cn/2019030511.jpg","gallery":"https://www.huhst.edu.cn/xxjs/xyfg/xxjz.htm","note":"官网图库标注名；与场景中「圆形广场」的对应关系未验证。"},{"id":"photo-english","title":"英语角 · 实景照片","category":"landmark","photos":[{"src":"/campus/photos/english-corner.jpg","w":960,"h":540,"cap":"拼花铺装小广场，弧形座椅与红色展示立柱，冠大荫浓的乔木","url":"https://www.huhst.edu.cn/2019030505.jpg"}],"source":"https://www.huhst.edu.cn/2019030505.jpg","gallery":"https://www.huhst.edu.cn/xxjs/xyfg/xxjz.htm","note":"官网图库标注名；场景内无对应落位。"},{"id":"photo-yushiyuan","title":"毓师园 · 实景照片","category":"landmark","photos":[{"src":"/campus/photos/yushiyuan.jpg","w":800,"h":533,"cap":"园地内的纪念性小品与绿化背景","url":"https://www.huhst.edu.cn/images/15/12/02/6m9ur8qy9d/8.bmp"}],"source":"https://www.huhst.edu.cn/images/15/12/02/6m9ur8qy9d/8.bmp","gallery":"https://www.huhst.edu.cn/xxjs/xyfg/xxfg.htm","note":"官网图库标注名（原图 BMP 已转 JPG）；场景内无对应落位。"},{"id":"photo-campus-unid","title":"未识别楼栋 · 现场照片","category":"teaching","photos":[{"src":"/campus/photos/campus-unid.jpg","w":1080,"h":556,"cap":"长条形六层楼，女儿墙通排社会主义核心价值观十二词，入口上方为弧形白色雨篷，前广场立三根旗杆并植有黄干棕榈","url":""}],"source":"","gallery":"","note":"用户提供的 2026-07 现场照片。画面内无可辨认楼名，与官网图库各楼照片逐一比对后仍未确认；不推测归属，仅作存档，未进入三维场景。"}]'),Dr=X0;function Y0(i){const t=document.querySelector(".stage"),e=document.createElement("section");e.className="photo-panel",e.hidden=!0,e.setAttribute("aria-label","校园实景照片"),t.append(e);const n=document.createElement("aside");n.className="photo-compare",n.hidden=!0,t.append(n);const s=document.createElement("dialog");s.className="photo-dialog",s.innerHTML='<button class="photo-close" type="button" aria-label="关闭大图">×</button><img alt=""><p></p>',document.body.append(s),s.querySelector("button").onclick=()=>s.close(),s.addEventListener("click",l=>{l.target===s&&s.close()});function r(l,h){const u=s.querySelector("img");u.src=l.src,u.alt=h,s.querySelector("p").textContent=l.cap,s.showModal()}function o(l,h){const u=document.createElement("button");u.type="button",u.className="photo-image",u.setAttribute("aria-label","放大查看"+h);const f=new Image;return f.src=l.src,f.alt=h,f.width=l.w,f.height=l.h,f.decoding="async",f.onerror=()=>{u.textContent="图片加载失败 · 点击重试",u.onclick=()=>{f.src=l.src,u.replaceChildren(f),u.onclick=()=>r(l,h)}},u.append(f),u.onclick=()=>r(l,h),u}function a(l,h){const u=document.createElement("a");return u.href=l,u.textContent=h,u.target="_blank",u.rel="noopener noreferrer",u}function c(l,h=!1){e.hidden=h,n.hidden=!h;const u=h?n:e;u.replaceChildren();const f=document.createElement("div");f.className="photo-heading";const p=document.createElement("h2");p.textContent=h?"实景对照":l.title;const g=document.createElement("span");g.textContent="HUHST / PHOTO ARCHIVE",f.append(g,p),u.append(f);let x=0,m=null;const d=document.createElement("figure"),M=document.createElement("figcaption"),v=document.createElement("div");v.className="photo-pager";function _(){const R=l.photos[x];d.replaceChildren(o(R,l.title),M),M.textContent=R.cap,m&&(m.href=R.url||l.source),v.querySelectorAll("button").forEach((P,S)=>P.setAttribute("aria-pressed",String(S===x)))}l.photos.length>1&&l.photos.forEach((R,P)=>{const S=document.createElement("button");S.type="button",S.textContent=`视图 ${P+1}`,S.onclick=()=>{x=P,_()},v.append(S)}),u.append(d,v);const w=document.createElement("div");w.className="photo-attribution",m=a(l.source,"原图 ↗"),w.append(a(l.gallery,"官网图库 ↗"),m),u.append(w);const A=document.createElement("p");if(A.className="photo-note",A.textContent="图片版权归校方 · 拍摄时间未核实 · 未验证地理落位",u.append(A),!h){const R={"photo-gate":"study-gate","photo-library":"study-library","photo-zhiyuan":"study-zhiyuan","photo-gym":"study-gym","photo-yifu":"study-yifu","photo-yanggen":"study-yanggen"}[l.id];if(R){const P=document.createElement("button");P.type="button",P.className="btn btn-primary",P.textContent="查看三维外观研究 →",P.onclick=()=>i(R),u.append(P)}}_()}return{show:c,hide(){e.hidden=n.hidden=!0},isOpen:()=>!e.hidden}}const ph={"study-gate":{name:"东大门 · 外观研究",category:"landmark",study:!0,photoId:"photo-gate",note:"依据东大门正面照片校准体量：双主柱与外侧附楼、上挑弧形檐板、横梁金色校名、彩旗与灯笼、伸缩门。进深、背面与材色为估算。"},"study-library":{name:"图书馆 · 外观研究",category:"landmark",study:!0,photoId:"photo-library",note:"依据正面、侧面、全景三张照片重建：双塔外弧立面各带通高蓝色玻璃竖带，中部为大跨度通透门洞，前置柱廊门厅与台阶。层数与不可见体量为估算。"},"study-zhiyuan":{name:"致远楼 · 外观研究",category:"teaching",study:!0,photoId:"photo-zhiyuan",note:"依据正面、斜侧与广场照片重建：缓弧长立面、端部绿色玻璃竖带、中央「门」形构架、入口台阶与前广场环形铺装。弧度为视线判读的近似值。"},"study-gym":{name:"体育馆 · 外观研究",category:"sport",study:!0,photoId:"photo-gym",note:"依据远景与近景照片重建：大跨度外挑斜屋面、檐下高侧窗带、束腰柱廊、转角圆柱体与百叶墙板。屋面背面与馆内形态为估算。"},"study-yifu":{name:"逸夫艺术馆 · 外观研究",category:"landmark",study:!0,photoId:"photo-yifu",note:"依据官网图与三张现场照片重建：锦砖盲墙、中缝竖向百叶、竖排金色题字「逸夫艺术馆 / 音乐舞蹈学院 / 艺术实训培训馆」、宽台阶与左侧玻璃门厅。坡屋面与背面为估算。"},"study-yanggen":{name:"养根楼 · 外观研究",category:"teaching",study:!0,photoId:"photo-yanggen",note:"依据官网图与现场照片重建：转角圆柱面与弧面叠窗、竖排金字「养根楼 / YANG GEN LOU」、塔顶立式半圆构架、六层锦砖立面、深色基座门廊与暗红雨篷、前区高台栏杆。平面 L 形折角为视线判读的近似值。"}},Z0=Bc.degToRad;function q0(i,t){const e=document.createElement("canvas");e.width=8,e.height=256;const n=e.getContext("2d"),s=n.createLinearGradient(0,0,0,256);s.addColorStop(0,t.top),s.addColorStop(.55,t.mid),s.addColorStop(1,t.bottom),n.fillStyle=s,n.fillRect(0,0,8,256);const r=new ws(e);r.colorSpace=we;const o=new qt(new Zi(t.radius||1600,32,16),new bs({map:r,side:Ie,fog:!1,depthWrite:!1}));return o.renderOrder=-1,i.add(o),o}const vo=new Map;function ge(i,t={}){const{roughness:e=.84,metalness:n=.02,...s}=t,r=i+"|"+e+"|"+n+"|"+JSON.stringify(s);if(vo.has(r))return vo.get(r);const o=new xn({color:i,roughness:e,metalness:n,...s});return vo.set(r,o),o}function j0(){const i=(s,r,o)=>new xn({color:s,roughness:r,metalness:o,emissive:new Wt("#f0c274"),emissiveIntensity:0}),t=i("#5c8299",.16,.22),e=i("#5d8e7e",.18,.18),n=i("#6d8492",.15,.26);return{glazing:[t,e,n],glassBlue:t,glassGreen:e,glassDark:n,stone:ge("#e3dfd3",{roughness:.87}),stoneW:ge("#eeece5",{roughness:.88}),stone2:ge("#d6d2c5",{roughness:.88}),recess:ge("#c3bfb1",{roughness:.9}),trim:ge("#cac6b9",{roughness:.78}),base:ge("#93908a",{roughness:.92}),roof:ge("#c6c3b9",{roughness:.86}),metal:ge("#8b8d86",{roughness:.5,metalness:.38}),gold:ge("#c3a24d",{roughness:.4,metalness:.62}),lantern:ge("#bf3735",{roughness:.72}),trunk:ge("#8a7a63",{roughness:.95}),leaf:ge("#67845f",{roughness:.95}),hedge:ge("#5c7c54",{roughness:.95}),paving:ge("#c9cbc2",{roughness:.96}),paving2:ge("#aeb0a8",{roughness:.96}),pavingWarm:ge("#c6b9ac",{roughness:.96}),fabric:ge("#f2efe6",{roughness:.9,side:tn}),lamp:ge("#d7d4c7",{roughness:.7})}}function st(i,t,e,n,s,r,o,a){const c=new qt(new Kn(t,e,n),a);return c.position.set(s,r,o),c.castShadow=c.receiveShadow=!0,i.add(c),c}function Ze(i,t,e,n,s,r,o,a,c=20){const l=new qt(new Ts(t,e,n,c),a);return l.position.set(s,r,o),l.castShadow=l.receiveShadow=!0,i.add(l),l}function en(i,t,e,n,s,r=8){const o=new D(...t),a=new D(...e),c=a.clone().sub(o),l=new qt(new Ts(n,n,c.length(),r),s);return l.position.copy(o).add(a).multiplyScalar(.5),l.quaternion.setFromUnitVectors(new D(0,1,0),c.normalize()),l.castShadow=!0,i.add(l),l}function mh(i,t,e,n,s){const r=new pi;t.forEach(([c,l],h)=>h?r.lineTo(c,-l):r.moveTo(c,-l)),r.closePath();const o=new Yi(r,{depth:e,bevelEnabled:!1});o.rotateX(-Math.PI/2);const a=new qt(o,s);return a.position.y=n,a.castShadow=a.receiveShadow=!0,i.add(a),a}function K0(i,t,e,n,s,r=12){const o=[[i,e],[t,e],[t,n]];for(let a=r-1;a>=0;a--){const c=a/r;o.push([i+(t-i)*c,n+s*Math.sin(Math.PI*c)])}return o}function J0(i,t,e){const{x0:n,x1:s,zFront:r,bow:o,y0:a,y1:c}=e,l=s-n,h=e.ix0??n+1.4,u=e.ix1??s-1.4,f=e.cols,p=e.rows,g=e.gx,x=e.gy,m=(u-h-g*(f-1))/f,d=(c-a-x*(p-1))/p;for(let M=0;M<p;M++)for(let v=0;v<f;v++){const _=h+v*(m+g)+m/2,w=(_-n)/l,A=r+o*Math.sin(Math.PI*w),R=o*Math.PI/l*Math.cos(Math.PI*w),P=a+M*(d+x)+d/2,S=new qt(new Mn(m,d),t);S.position.set(_,P,A),S.rotation.y=-Math.atan(R),S.translateZ(.04),i.add(S)}if(e.band)for(let v=1;v<p;v++){const _=a+v*(d+x)-x/2;for(let w=0;w<9;w++){const A=h+(u-h)*w/9,R=h+(u-h)*(w+1)/9,P=(A+R)/2,S=(P-n)/l,E=r+o*Math.sin(Math.PI*S),L=o*Math.PI/l*Math.cos(Math.PI*S),O=st(i,(R-A)*1.14,x*.82,.22,P,_,E,e.band);O.rotation.y=-Math.atan(L)}}return{cw:m,ch:d}}function Le(i,t,e){const n=e.axis||"z",s=n==="z"?e.x0:e.z0,r=n==="z"?e.x1:e.z1,o=e.y0,a=e.y1,c=r-s,l=a-o,h=e.gx??1.3,u=e.gy??1.1,f=e.cols??Math.max(1,Math.round((c+h)/((e.wx??2.7)+h))),p=e.rows??Math.max(1,Math.round((l+u)/((e.wy??1.9)+u))),g=(c-h*(f-1))/f,x=(l-u*(p-1))/p;for(let m=0;m<p;m++)for(let d=0;d<f;d++){const M=s+d*(g+h)+g/2,v=o+m*(x+u)+x/2,_=new qt(new Mn(g,x),t);n==="z"?(_.position.set(M,v,e.z),_.rotation.y=e.rotY??0):(_.position.set(e.x,v,M),_.rotation.y=(e.rotY??0)+Math.PI/2),_.translateZ(.035),i.add(_)}if(e.band)for(let m=1;m<p;m++){const d=o+m*(x+u)-u/2;n==="z"?st(i,c+h,u*.82,.22,(s+r)/2,d,e.z,e.band):st(i,.22,u*.82,c+h,e.x,d,(s+r)/2,e.band)}}function Sa(i,t,e,n){const{x:s,z:r,y0:o,y1:a,w:c}=n,l=a-o,h=(o+a)/2,u=new cn;u.position.set(s,h,r),u.rotation.y=n.rotY??0,i.add(u),st(u,c+2,l,.34,0,0,-.2,t.recess),st(u,c,l-.5,.2,0,0,.04,e);for(let f=-l/2+2.4;f<l/2-1.2;f+=3.6)st(u,c+.34,.14,.28,0,f,.02,t.trim);return u}function De(i,t,e,n,s,r,o,a={}){const c=!!a.vertical,l=document.createElement("canvas");l.width=c?512:2048,l.height=c?2048:512;const h=l.getContext("2d");if(h.clearRect(0,0,l.width,l.height),a.plate&&(h.fillStyle=a.plate,h.fillRect(0,0,l.width,l.height)),h.font=`bold ${c?300:272}px KaiTi, STKaiti, "KaiTi_GB2312", serif`,h.textAlign="center",h.textBaseline="middle",h.shadowColor=a.shadow||"#6a5416",h.shadowBlur=7,h.shadowOffsetY=6,h.fillStyle=a.color||"#d3ac53",c){const p=[...t],g=p.length;p.forEach((x,m)=>h.fillText(x,l.width/2,(m+.5)*l.height/g))}else h.fillText(t,l.width/2,l.height/2,l.width*.95);const u=new ws(l);u.colorSpace=we,u.anisotropy=4;const f=new qt(new Mn(r,o),new bs({map:u,transparent:!a.plate,toneMapped:!1,depthWrite:!1}));return f.position.set(e,n,s),a.ry&&(f.rotation.y=a.ry),i.add(f),f}function ji(i,t,e,n,s={}){st(i,t,.6,e,0,-.3,0,s.mat||n.paving);const r=s.step||8,o=s.line||n.paving2;for(let a=-t/2+r;a<t/2;a+=r)st(i,.06,.03,e,a,.005,0,o);for(let a=-e/2+r;a<e/2;a+=r)st(i,t,.03,.06,0,.005,a,o)}function As(i,t,e,n,s,r,o,a){for(let c=0;c<e;c++){const l=o-c*n;st(i,t,l,s,0,l/2,r+c*s+s/2,a)}}function Rs(i,t,e,n,s){Ze(i,.17*n,.24*n,3.6*n,t,1.8*n,e,s.trunk,6);const r=new qt(new Wa(2*n,1),s.leaf);r.position.set(t,4.9*n,e),r.scale.set(1,1.25,1),r.castShadow=!0,i.add(r)}function Ka(i,t,e,n,s){Ze(i,.16,.32,n,t,n/2,e,s.metal,8),Ze(i,1.6,.5,.7,t,n+.25,e,s.metal,14);for(let r=0;r<6;r++){const o=r/6*Math.PI*2,a=new qt(new Zi(.44,10,8),s.lamp);a.position.set(t+Math.cos(o)*1.3,n-.05,e+Math.sin(o)*1.3),i.add(a)}}function gh(i,t,e,n,s,r,o){for(let a=n;a<s;a+=4.2){const c=new qt(new Xa(a,a+.5,128,1,Math.PI*.08,Math.PI*.84),o);c.rotation.x=-Math.PI/2,c.position.set(t,.055,e),i.add(c)}}function $0(i,t,e){ji(t,110,64,e,{step:9});for(const v of[-1,1]){const _=v*14.2;st(i,6.4+1.6,.9,5.8+1.2,_,.45,0,e.base),st(i,6.4,14,5.8,_,.9+14/2,0,e.stone);for(const A of[5.8/2+.06,-5.8/2-.06])st(i,6.4-2.4,14-4.6,.12,_,.9+14/2,A,e.recess);st(i,6.4+1.2,.9,5.8+1,_,15.8-.45,0,e.trim);const w=v*(14.2+6.4/2+8.9);st(i,17.8,10.6,7.6,w,5.3,0,e.stone),st(i,16.6,.6,7,w,.3,0,e.base),st(i,18.6,.8,8.2,w,10.9,0,e.trim),Le(i,e.glassBlue,{x0:w-6.9,x1:w+6.9,y0:1.8,y1:9.6,z:3.85,cols:5,rows:3,band:e.stone}),Le(i,e.glassBlue,{x0:w-6.9,x1:w+6.9,y0:1.8,y1:9.6,z:-3.85,rotY:Math.PI,cols:5,rows:3,band:e.stone}),Le(i,e.glassBlue,{axis:"x",z0:-2.4,z1:2.4,y0:1.8,y1:9.6,x:w+v*8.95,rotY:v>0?Math.PI/2:-Math.PI/2,cols:2,rows:3})}st(i,22+6.4*2,3.8,5.8*.96,0,13.1,0,e.stone),st(i,22+6.4*2+.9,.55,5.8*.96+.6,0,15,0,e.trim),st(i,22+6.4*2+.9,.55,5.8*.96+.6,0,11.2,0,e.trim),De(i,"湖 南 人 文 科 技 学 院",0,13.15,5.8*.48+.18,27,2.9,{color:"#d8b45c"});const l=27.6,h=15,u=2.7,f=1.5,p=6.2,g=64,x=new pi;for(let v=0;v<=g;v++){const _=-1+2*v/g,w=_*l,A=h+u*_*_;v?x.lineTo(w,A):x.moveTo(w,A)}for(let v=g;v>=0;v--){const _=-1+2*v/g,w=_*l,A=h+u*_*_-f;x.lineTo(w,A)}x.closePath();const m=new Yi(x,{depth:p,bevelEnabled:!1});m.translate(0,0,-p/2);const d=new qt(m,e.stone);d.castShadow=d.receiveShadow=!0,i.add(d);const M=["#cc4442","#efeee0","#759c72","#dcb555","#a15491"];for(let v=0;v<17;v++){const _=-16.5+v*2.06,w=_/l,A=h+u*w*w+f;en(i,[_,A-.1,1.1],[_,A+3.6,1.1],.05,e.gold);const R=new Ee;R.setAttribute("position",new Qt([_,A+3.4,1.1,_+.98,A+.9,1.28,_,A+.7,1.1],3)),R.computeVertexNormals();const P=new qt(R,new xn({color:M[v%5],side:tn,roughness:.9}));P.castShadow=!0,i.add(P)}for(const v of[-7.8,7.8]){en(i,[v,11.2,1.5],[v,10.4,1.5],.05,e.gold);const _=new qt(new Zi(1.05,18,14),e.lantern);_.position.set(v,9.45,1.5),_.scale.y=.72,_.castShadow=!0,i.add(_),en(i,[v,8.85,1.5],[v,8.1,1.5],.05,e.gold)}for(const v of[-1,1])for(let _=0;_<9;_++){const w=v*(11.4+_*.56);en(i,[w,.08,3.4],[w,2.1,3.4],.035,e.trim),en(i,[w,.2,3.4],[w+v*.56,1.9,3.4],.026,e.gold)}}function Q0(i,t,e){ji(t,132,116,e,{step:11}),gh(t,0,34,20,62,e,e.pavingWarm),st(t,46,.9,12,0,.45,24,e.stone2);for(const v of[-1,1]){const _=v<0?-39:15,w=v<0?-30/2:30/2+24;mh(i,K0(_,w,-18,6,2.2,14),30,0,e.stoneW),st(i,24+.8,.8,24+.8,(_+w)/2,30+.4,-12/2,e.trim),st(i,24+.5,.55,24+.5,(_+w)/2,.28,-12/2,e.base);const A=v<0?.3:.7,R=_+(w-_)*A,P=6+2.2*Math.sin(Math.PI*A),S=2.2*Math.PI/24*Math.cos(Math.PI*A);Sa(i,e,e.glassBlue,{x:R,z:P,y0:1.6,y1:28,w:6,rotY:-Math.atan(S)}),J0(i,e.glassBlue,{x0:_,x1:w,zFront:6,bow:2.2,y0:2.2,y1:30-3.4,rows:7,cols:4,gx:1,gy:2.1,band:e.stoneW,ix0:v<0?_+24*.42:_+1.8,ix1:v<0?w-1.8:w-24*.42}),Le(i,e.glassBlue,{axis:"x",z0:-18+2.4,z1:6-2.4,y0:2.2,y1:30-3.4,x:v<0?_:w,rotY:v<0?-Math.PI/2:Math.PI/2,cols:5,gx:1.1,gy:2.1,rows:7,band:e.stoneW})}const g=30;st(i,g,12.4,24,0,12.4/2,-12/2,e.stone2),st(i,g,24-20.4,24,0,(24+20.4)/2,-12/2,e.stone2),st(i,(g-9*2)/2,20.4-12.4,24,-12,(12.4+20.4)/2,-12/2,e.stone2),st(i,(g-9*2)/2,20.4-12.4,24,9+(g-9*2)/4,(12.4+20.4)/2,-12/2,e.stone2),st(i,g+.6,.7,24+.6,0,24+.35,-12/2,e.trim),Le(i,e.glassBlue,{x0:-11,x1:11,y0:20.4+1.2,y1:24-1.4,z:6+.06,cols:3,rows:1}),Le(i,e.glassBlue,{x0:-11,x1:11,y0:20.4+1.2,y1:24-1.4,z:-18-.06,rotY:Math.PI,cols:3,rows:1}),Le(i,e.glassBlue,{x0:-12,x1:12,y0:2.2,y1:12.4-2.2,z:6+.06,cols:5,rows:2});const x=21,m=9,d=6,M=17;st(i,x+1.6,1.1,M-d+1,0,.55,(d+M)/2,e.base),st(i,x,m,M-d,0,1.1+m/2,(d+M)/2,e.stone),st(i,x+1,.8,M-d+.8,0,1.1+m+.3,(d+M)/2,e.trim),st(i,x-3,4.6,.3,0,4.5,M-.05,e.glassDark);for(let v=-x/2+2.6;v<=x/2-2.6;v+=5.2)Ze(i,.46,.52,m-2.2,v,1.1+(m-2.2)/2,M+.55,e.stoneW,12);De(i,"图 书 馆",0,8.3,M+.22,11,2.2,{color:"#c8a24a"}),As(i,x+10,14,.32,1,M+1,4.5,e.stone2),st(i,x+14,.5,3.4,0,.25,M+4.2,e.stone2);for(const v of[-1,1])for(const _ of[M+9,M+18,M+27,M+36])Ze(i,.52,.64,9.4,v*26,4.7,_,e.stoneW,14),Ze(i,.96,.52,.9,v*26,9.85,_,e.stoneW,14);st(t,9.4,2.6,1,0,1.3,M+31,e.stoneW),De(t,"因你而美丽",2.6,3,M+31.6,8.6,1.7,{color:"#8e8a7c"}),De(t,"人文科技",-4.6,2.9,M+31.65,1.4,3.4,{vertical:!0,color:"#b8453c",plate:"#f5f2ea"}),De(t,"1978—2018",6.4,.5,M+31.05,2.6,.5,{color:"#b8453c"});for(const v of[-1,1]){for(const _ of[-6,12,30])st(t,8,.5,8,v*46,.25,_,e.trim),Rs(t,v*46,_,3,e);for(let _=-10;_<=26;_+=12)Ka(t,v*30,_,9.5,e)}}function t_(i,t,e){ji(t,150,96,e,{step:12}),gh(t,0,40,12,34,e,e.pavingWarm),Ze(t,9,9.4,.7,0,.35,40,e.stone2,48),Ze(t,7.6,7.6,1.5,0,1.05,40,e.hedge,40),Ka(t,0,40,26,e);const p=M=>9+8*Math.pow(M/48,2);for(let M=0;M<16;M++){const v=-48+6*(M+.5),_=2*8*v/(48*48),w=-Math.atan(_),A=new cn;A.position.set(v,0,p(v)),A.rotation.y=w,i.add(A),st(A,6+.6,22,15,0,22/2,-15/2,e.stoneW),st(A,6+.7,.7,15+.6,0,22+.35,-15/2,e.trim),st(A,6+.6,.5,15+.4,0,.25,-15/2,e.base);for(let R=0;R<2;R++){const P=-1.5+R*3;for(let S=0;S<6;S++){const E=new qt(new Mn(2.35,1.55),e.glassBlue);E.position.set(P,2.75+S*3.4,.04),A.add(E)}}for(let R=0;R<5;R++)st(A,6+.4,1.35,.26,0,4.35+R*3.4,.05,e.stoneW);st(A,6+.4,1.1,.26,0,21.2,.05,e.trim)}for(const M of[-44,-20,20,44])Sa(i,e,e.glassGreen,{x:M,z:p(M)+.02,y0:2,y1:22-1.6,w:3.4,rotY:-Math.atan(2*8*M/(48*48))});for(const M of[-1,1]){const v=M*56,_=p(M*48)-18/2+2;st(i,16,27,18,v,27/2,_,e.stoneW),st(i,16+.9,.8,18+.9,v,27+.4,_,e.trim),st(i,16+.6,.5,18+.6,v,.25,_,e.base),Le(i,e.glassBlue,{x0:v-5.4,x1:v+5.4,y0:2.4,y1:24,z:_+18/2+.06,cols:2,gx:1.2,gy:2.2,rows:6,band:e.stoneW});for(const w of[v-6,v+6])Sa(i,e,e.glassGreen,{x:w,z:_+18/2+.02,y0:2,y1:25,w:2.6});De(i,"致远楼",M>0?v+8.4:v-8.4,27-6.5,_+18/2+.12,2,9.5,{vertical:!0,color:"#c9a34c",ry:M>0?0:Math.PI})}const g=22,x=33,m=3.4,d=8;for(const M of[-1,1])st(i,m,x-g,d,M*8.6,(g+x)/2,5,e.stoneW),st(i,m+.8,.6,d+.8,M*8.6,g+.3,5,e.trim);st(i,24,3.2,d,0,x+1.2,5,e.stoneW),st(i,25,.6,d+.8,0,x+3.1,5,e.trim),st(i,22,1.3,d-1.6,0,g+5.4,5,e.stoneW),st(i,26,9.5,5.5,0,4.75,9+2.6,e.stone),st(i,30,.8,7.5,0,9.9,9+3.2,e.trim),st(i,15,4.6,.3,0,3.6,9+5.45,e.glassDark),De(i,"致 远 楼",0,7.9,9+5.62,11,2.1,{color:"#c8a24a"}),As(i,32,3,.4,1.6,15,1.2,e.stone2);for(const M of[-1,1])for(const v of[-10,14,34])Rs(t,M*42,v,3.2,e)}function e_(i,t,e){ji(t,132,104,e,{step:12}),st(i,62,18,42,0,18/2,0/2,e.stoneW),st(i,62+.6,.5,42+.6,0,.25,0/2,e.base);const c=st(i,70,1.5,49,0,18+2.2,0/2,e.roof);c.rotation.x=.052,c.rotation.z=-.026;const l=st(i,71,.8,50,0,18+1.3,0/2,e.trim);l.rotation.x=.052,l.rotation.z=-.026;for(let h=-62/2+6;h<=62/2-6;h+=10){const u=st(i,.35,.1,49,h,21,0,e.stone2);u.rotation.x=.052}for(let h=-62/2+7;h<=62/2-7;h+=13)en(i,[h,18+1.2,21+5.2],[h,18-.5,18],.22,e.metal,6);Le(i,e.glassBlue,{x0:-62/2+2.4,x1:6,y0:15.4,y1:18-.6,z:21+.06,cols:12,rows:1}),Le(i,e.glassBlue,{x0:-62/2+2.4,x1:6,y0:15.4,y1:18-.6,z:-21-.06,rotY:Math.PI,cols:12,rows:1}),Le(i,e.glassBlue,{axis:"x",z0:-17,z1:17,y0:15.4,y1:18-.6,x:-62/2,rotY:-Math.PI/2,cols:8,rows:1}),Le(i,e.glassBlue,{axis:"x",z0:-17,z1:17,y0:15.4,y1:18-.6,x:62/2,rotY:Math.PI/2,cols:8,rows:1}),st(i,60,1.2,.3,0,1.35,21+.07,e.base),Ze(i,10.5,10.5,19.5,18,9.75,17,e.stoneW,40),Ze(i,11.1,11.1,.7,18,19.9,17,e.trim,40);for(let h=-26;h<=6;h+=4)en(i,[h,.5,21+1.9],[h,10.6,21+1.9],1.05,e.stoneW,16),Ze(i,2.05,1.05,1.9,h,11.7,21+1.9,e.stoneW,18),Ze(i,1.25,1.35,.6,h,.3,21+1.9,e.base,18);st(i,37,2.1,3.6,-10,13.5,21+1.6,e.stone),st(i,37.6,.5,4.1,-10,14.7,21+1.6,e.trim),De(i,"体 育 馆",-10,13.6,21+3.5,21,2.6,{color:"#c8a24a"}),st(i,34,12,.3,-10,6,21-.12,e.glassDark),As(i,22,4,.35,1.4,21+3.4,1.4,e.stone2);for(const h of[-32,-8,12]){st(i,7.8,6.8,.2,h,8.4,21+.07,e.recess);for(let u=0;u<9;u++)st(i,7.1,.26,.34,h,5.4+u*.72,21+.2,e.metal)}for(const h of[-1,1])for(const u of[-14,4,26])Rs(t,h*56,u,3,e);for(const h of[-42,-22,0,22,42])Ka(t,h,44,9,e)}function vc(i,t,e){const n=e.slat??.3,s=e.gap??.34,r=Math.max(2,Math.floor((e.y1-e.y0)/(n+s))),o=new cn;o.position.set(e.x,(e.y0+e.y1)/2,e.z),o.rotation.set(0,e.rotY??0,e.tilt??0),i.add(o),st(o,e.w,e.y1-e.y0,.4,0,0,-.28,t.recess);for(let a=0;a<r;a++)st(o,e.w,n,e.depth??.6,0,-((r-1)*(n+s))/2+a*(n+s),.06,t.metal);return o}function n_(i,t,e){ji(t,132,96,e,{step:11}),As(i,88,12,.34,1.02,13.4,4.2,e.stone2),st(i,92,4.2,34,0,4.2/2,-4,e.stone),st(i,92.6,.5,34.6,0,4.2+.25,-4,e.stone2),st(i,54,24,18,0,4.2+24/2,6-18/2,e.stone),st(i,54+.8,.7,18+.8,0,4.2+24+.35,6-18/2,e.trim),st(i,54+.3,.6,18+.3,0,4.2+.3,6-18/2,e.base),vc(i,e,{x:-1.6,z:6+.12,y0:4.2+1.8,y1:4.2+24-1.4,w:3.6,tilt:.055}),vc(i,e,{x:-27.14,z:-3,y0:4.2+3.2,y1:4.2+24-3.2,w:2.6,rotY:-Math.PI/2,tilt:.05}),De(i,"逸夫艺术馆",-17,4.2+11.8,6+.14,2.1,11,{vertical:!0,color:"#c9a34c"}),De(i,"八大山人",-22.6,4.2+3.6,6+.14,.72,3.2,{vertical:!0,color:"#b9974a"}),De(i,"音乐舞蹈学院",15,4.2+11.2,6+.14,2,11.8,{vertical:!0,color:"#c9a34c"}),De(i,"艺术实训培训馆",-27.14,4.2+10.8,1.5,2,12.6,{vertical:!0,color:"#c9a34c",ry:-Math.PI/2}),st(i,1.4,1.4,.1,11.2,4.2+3.7,6+.12,ge("#a8402f",{roughness:.7})),De(i,"音 乐 厅",21.6,4.2+6.4,6+.14,7.8,1.8,{color:"#c0392b"}),st(i,19,12.4,12,-36.5,4.2+6.2,8,e.stoneW),Le(i,e.glassBlue,{x0:-43.6,x1:-29.4,y0:4.2+1.2,y1:4.2+11.2,z:14.06,cols:4,rows:3,band:e.stoneW}),st(i,21,.7,13.4,-36.5,4.2+12.9,8,e.trim),st(i,20.4,.5,4.4,-36.5,4.2+8.6,15.2,e.stoneW),st(i,12,4.4,.3,-36.5,4.2+4.2,12.1,e.glassDark),st(i,46,20,24,4,4.2+10,-22,e.stoneW);const c=st(i,54,1.4,32,4,4.2+21.6,-22,e.trim);c.rotation.z=-.1;const l=st(i,30,1.2,26,-20,4.2+15.8,-16,e.roof);l.rotation.z=.07;for(const h of[-1,1])for(const u of[20,34])st(t,6,.4,6,h*36,.2,u,e.trim),Rs(t,h*36,u,2.6,e);for(const h of[-48,48])Ze(t,.4,.5,8.2,h,4.1,24,e.stoneW,12)}function i_(i,t,e,n,s,r=12){const o=i+s,a=n-s,c=[[t,e],[i,e],[i,a]];for(let l=0;l<=r;l++){const h=Math.PI-Math.PI/2*(l/r);c.push([o+s*Math.cos(h),a+s*Math.sin(h)])}return c.push([t,n]),c}function yo(i,t,e,n,s){for(let o=0;o<e.length-1;o++){const a=e[o],c=e[o+1];en(i,[a[0],n+s,a[1]],[c[0],n+s,c[1]],.06,t.metal,6),en(i,[a[0],n+s*.55,a[1]],[c[0],n+s*.55,c[1]],.04,t.metal,6),en(i,[a[0],n,a[1]],[a[0],n+s,a[1]],.05,t.metal,6)}const r=e[e.length-1];en(i,[r[0],n,r[1]],[r[0],n+s,r[1]],.05,t.metal,6)}function s_(i,t,e){ji(t,138,96,e,{step:12}),st(i,104,1.8,32,2,.9,16,e.stone2),As(i,38,5,.36,1.06,6+25.4,1.8,e.stone2),yo(i,e,[[-19,6+25.4],[-19,15],[-46,15],[-46,6+25.4]],1.8,1.05),yo(i,e,[[25,6+25.4],[25,15],[48,15],[48,6+25.4]],1.8,1.05),st(i,60,21,16,8,21/2+1.8,-10/2,e.stoneW),st(i,60.6,.7,16+.6,8,21+1.8+.35,-10/2,e.trim),st(i,60.4,.5,16+.4,8,1.8+.25,-10/2,e.base);for(let d=0;d<5;d++){Le(i,e.glassBlue,{x0:-15.4,x1:31.4,y0:4.6+d*3.5,y1:6.4+d*3.5,z:6+.06,cols:11,rows:1,band:e.stoneW}),Le(i,e.glassBlue,{x0:-15.4,x1:31.4,y0:4.6+d*3.5,y1:6.4+d*3.5,z:-16-.06,rotY:Math.PI,cols:11,rows:1,band:e.stoneW});for(let M=-14;M<=30;M+=5.6)st(i,2,.9,.7,M,9.2+d*3.5,6+.3,e.metal)}yo(i,e,[[-21.6,6],[37.6,6]],21+2.4,.9),mh(i,i_(-38,-21,-16,6,9,14),26,1.8,e.stoneW),st(i,17+.6,.7,16+.6,-59/2,26+1.8+.35,-10/2,e.trim);const u=-29,f=-3;for(let d=0;d<5;d++)for(let M=0;M<4;M++){const v=Math.PI-Math.PI/2*((M+.5)/4),_=new qt(new Mn(2.9,1.8),e.glassBlue);_.position.set(u+9*Math.cos(v),5.4+d*3.5,f+9*Math.sin(v)),_.rotation.y=v-Math.PI/2,_.translateZ(.04),i.add(_)}De(i,"养根楼",-26.2,16.2,6+.14,2.8,10.4,{vertical:!0,color:"#c9a34c"}),De(i,"YANG GEN LOU",-22.5,16.2,6+.14,2.3,11.6,{vertical:!0,color:"#c9a34c"});const p=new pi;p.absarc(0,0,3.8,0,Math.PI,!1),p.closePath();const g=new Yi(p,{depth:.7,bevelEnabled:!1}),x=new qt(g,e.metal);x.position.set(-29.5,26+2.5,-10/2),x.castShadow=!0,i.add(x);for(let d=1;d<6;d++){const M=Math.PI*d/6;en(i,[-29.5,26+2.5,-10/2+.4],[-29.5+3.7*Math.cos(M),26+2.5+3.7*Math.sin(M),-10/2+.4],.07,e.trim,5)}const m=new cn;m.position.set(38,0,-3),m.rotation.y=.42,i.add(m),st(m,34,18,15,15,9,-6,e.stoneW),st(m,34.6,.7,15.6,15,18.35,-6,e.trim);for(let d=0;d<4;d++)Le(m,e.glassBlue,{x0:1.4,x1:28.6,y0:4.2+d*3.5,y1:6+d*3.5,z:1.56,cols:6,rows:1,band:e.stoneW});st(i,26,6.4,5.2,2,1.8+3.2,6+2.6,e.stone),st(i,26.6,.9,5.8,2,1.8+6.85,6+2.6,e.base),st(i,24,1.5,1,2,1.8+7.9,6+5.15,ge("#7d3b39",{roughness:.75})),st(i,15,4.6,.35,2,1.8+3.1,6+5.2,e.glassDark),De(i,"养 根 楼",2,1.8+6.1,6+5.24,8.4,1.6,{color:"#c8a24a"});for(const d of[-1,1])for(const M of[22,38])st(t,7,.4,7,d*44,.2,M,e.trim),Rs(t,d*44,M,3,e)}const yc={"study-gate":$0,"study-library":Q0,"study-zhiyuan":t_,"study-gym":e_,"study-yifu":n_,"study-yanggen":s_},r_={"study-gate":{az:.14,el:.13,k:.94,off:.28},"study-library":{az:.1,el:.21,k:1.02,off:.4},"study-zhiyuan":{az:.34,el:.24,k:1.12,off:.36},"study-gym":{az:.62,el:.19,k:1.32,off:.3},"study-yifu":{az:.3,el:.17,k:1.06,off:.34},"study-yanggen":{az:-.34,el:.2,k:1.04,off:.34}},Mo="#dbe4e1",o_="#1b2b39";function a_(i){if(!yc[i])throw new Error("Unknown landmark: "+i);const t=new Zc;t.background=new Wt(Mo),t.fog=new Cr(Mo,320,900);const e=new oh("#eef6ff","#b6b4a1",2.05);t.add(e);const n=new va("#fff2da",2.75);n.position.set(-95,155,135),n.castShadow=!0,n.shadow.mapSize.set(2048,2048),Object.assign(n.shadow.camera,{left:-150,right:150,top:150,bottom:-150,near:1,far:560}),n.shadow.camera.updateProjectionMatrix(),n.shadow.bias=-4e-4,n.shadow.normalBias=.55,t.add(n);const s=new va("#dfe9ff",.55);s.position.set(130,95,-120),t.add(s);const r=j0(),o=q0(t,{top:"#7fa8cc",mid:"#cfe0e6",bottom:"#cfd8cb",radius:1500});st(t,1700,1,1700,0,-1,0,ge("#cfd8cb"));const a=new cn;t.add(a);const c=new cn;t.add(c),yc[i](a,c,r);const l=new jn().setFromObject(a),h=l.getCenter(new D),u=l.getSize(new D),f=new D(h.x,h.y*.88,h.z),p=r_[i]||{az:.3,el:.26,k:1},g=Math.max(u.x,u.z,u.y/.62)*.5,x=g/Math.tan(Z0(21))*(p.k??1)*1.16,m=new D(f.x+x*Math.sin(p.az)*Math.cos(p.el),f.y+x*Math.sin(p.el),f.z+x*Math.cos(p.az)*Math.cos(p.el)),d=m.clone().sub(f).normalize(),M=new D().crossVectors(new D(0,1,0),d).normalize();return f.addScaledVector(M,-g*(p.off??.34)),{scene:t,bounds:l,target:f,position:m,setNight(v){t.background.set(v?o_:Mo),t.fog.color.copy(t.background),o.material.color.set(v?"#2b3d50":"#ffffff"),e.intensity=v?.62:2.05,n.intensity=v?.35:2.75,s.intensity=v?.3:.55;for(const _ of r.glazing)_.emissiveIntensity=v?.62:0}}}const Yn=new Map;let Oe=null;const Ea=matchMedia("(prefers-reduced-motion: reduce)"),Ln=Y0(i=>Cs(mi.find(t=>t.id===i))),Xt=i=>document.getElementById(i),vn=Xt("scene"),Se=new Zc;Se.background=new Wt("#a4af8b");Se.fog=new Cr("#b3bd9c",1150,2500);const l_=(()=>{const i=document.createElement("canvas");i.width=8,i.height=256;const t=i.getContext("2d"),e=t.createLinearGradient(0,0,0,256);e.addColorStop(0,"#6f9ecb"),e.addColorStop(.4,"#c6d6dd"),e.addColorStop(.5,"#b3bd9c"),e.addColorStop(1,"#b3bd9c"),t.fillStyle=e,t.fillRect(0,0,8,256);const n=new ws(i);n.colorSpace=we;const s=new qt(new Zi(7200,32,16),new bs({map:n,side:Ie,fog:!1,depthWrite:!1}));return s.renderOrder=-1,Se.add(s),s})(),Ae=new Qe(42,1,2,12e3);let ke;try{ke=new b0({canvas:vn,antialias:!0})}catch(i){throw Xt("loading").textContent="浏览器无法启动 WebGL，请开启硬件加速后重试。",i}ke.setPixelRatio(Math.min(devicePixelRatio,2));ke.shadowMap.enabled=!0;ke.shadowMap.type=wc;ke.outputColorSpace=we;ke.toneMapping=Ac;ke.toneMappingExposure=1.08;const as={draws:0,tris:0,geoms:0,texs:0},Re=new T0(Ae,vn);Re.enableDamping=!0;Re.maxPolarAngle=Math.PI*.47;Re.minDistance=35;Re.maxDistance=1800;const _h=new oh("#fff8e6","#708467",1.45);Se.add(_h);const hn=new va("#fff0cf",3.5);hn.position.set(-260,550,280);hn.castShadow=!0;hn.shadow.mapSize.set(2048,2048);hn.target.position.set(30,0,-100);Se.add(hn.target);Object.assign(hn.shadow.camera,{left:-540,right:540,top:540,bottom:-540,near:1,far:1600});hn.shadow.camera.updateProjectionMatrix();hn.shadow.bias=-5e-4;hn.shadow.normalBias=.9;Se.add(hn);const In=i=>new xn({color:i,roughness:.85});In("#e9e5d4");const So=In("#cbcaba");function Ja(i){let t=i>>>0;return()=>{t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function Lr(i,t,e=1,n=1){const s=document.createElement("canvas");s.width=s.height=i,t(s.getContext("2d"),i);const r=new ws(s);return r.colorSpace=we,r.wrapS=r.wrapT=gr,r.repeat.set(e,n),r.anisotropy=4,r}function $a(i,t,e,n){i.fillStyle=e,i.fillRect(0,0,t,t);const s=Ja(n.seed);for(let r=0;r<n.n;r++)i.fillStyle=s()<.5?n.a:n.b,i.beginPath(),i.arc(s()*t,s()*t,n.r0+s()*n.dr,0,6.2832),i.fill()}const c_=Lr(256,(i,t)=>$a(i,t,"#93a67d",{seed:7,n:2200,a:"rgba(126,146,105,.55)",b:"rgba(176,188,143,.45)",r0:6,dr:24}),.16,.16),h_=Lr(256,(i,t)=>$a(i,t,"#a4af8b",{seed:11,n:2600,a:"rgba(142,160,112,.5)",b:"rgba(184,194,154,.44)",r0:2,dr:9}),428,428),u_=Lr(256,(i,t)=>{i.fillStyle="#cfcabb",i.fillRect(0,0,t,t);const e=8,n=t/e;for(let s=0;s<e;s++)for(let r=0;r<e;r++){const o=Ja(s*131+r*977),a=236+Math.round(o()*14);i.fillStyle=`rgb(${a},${a-4},${a-14})`,i.fillRect(s*n+.7,r*n+.7,n-1.4,n-1.4)}},1,1),d_=Lr(256,(i,t)=>$a(i,t,"#6f7671",{seed:23,n:5200,a:"rgba(56,62,58,.5)",b:"rgba(146,152,146,.32)",r0:.6,dr:1.6}),1,.25),f_=new xn({color:"#e9e5d4",roughness:.86,map:u_}),p_=new xn({color:"#92a57c",roughness:.97,map:c_}),m_=new xn({color:"#a4af8b",roughness:.98,map:h_}),g_=new xn({color:"#ffffff",roughness:.95,map:d_});function ba(i,t,e,n,s,r,o,a=Se){const c=new qt(new Kn(n,s,r),o);return c.position.set(i,t,e),c.castShadow=c.receiveShadow=!0,a.add(c),c}function Er(i,t,e,n=0){const s=new pi;i.forEach(([a,c],l)=>l?s.lineTo(a,-c):s.moveTo(a,-c)),s.closePath();const r=new Yi(s,{depth:t,bevelEnabled:!1});r.rotateX(-Math.PI/2);const o=new qt(r,typeof e=="string"?In(e):e);return o.position.y=n,o.castShadow=o.receiveShadow=!0,Se.add(o),o}function ls(i,t,e=1,n=1){const s=new Ee().setFromPoints(i.map(o=>new D(o[0],n,o[1]))),r=new Qu(s,new qc({color:t,linewidth:e}));return Se.add(r),r}function Mc(i,t,e,n,s=1.22){const r=new qt(new Ha(e,64),In(n));return r.rotation.x=-Math.PI/2,r.position.set(i,s,t),r.receiveShadow=!0,Se.add(r),r}ba(0,-6,0,6200,10,6200,m_);Er(Te.campusBoundary,2,p_,-1);ls(Te.campusBoundary,"#dde0c5",2,1.4);const kn=new Za;Te.campusBoundary.forEach(i=>kn.expandByPoint(new Q(...i)));const br=kn.getCenter(new Q),wr=new D(br.x,0,br.y),xh=new D(br.x+600,700,br.y+790);Ae.position.copy(xh);Re.target.copy(wr);const vh=[];function wa(i,t,e){const n=i.length,s=t/2,r=[],o=[];for(let f=0;f<n;f++){const p=i[f],g=i[Math.max(0,f-1)],x=i[Math.min(n-1,f+1)];let m=x[0]-g[0],d=x[1]-g[1];const M=Math.hypot(m,d)||1;m/=M,d/=M;const v=-d,_=m;let w=1;if(f>0&&f<n-1){let A=Math.atan2(p[1]-g[1],p[0]-g[0]),R=Math.atan2(x[1]-p[1],x[0]-p[0]),P=Math.abs(R-A);P>Math.PI&&(P=2*Math.PI-P),w=1/Math.max(.34,Math.cos(P/2))}r.push([p[0]+v*s*w,p[1]+_*s*w]),o.push([p[0]-v*s*w,p[1]-_*s*w])}const a=[],c=[],l=[];let h=0;for(let f=0;f<n;f++)f>0&&(h+=Math.hypot(i[f][0]-i[f-1][0],i[f][1]-i[f-1][1])),a.push(r[f][0],e,r[f][1],o[f][0],e,o[f][1]),c.push(0,h,1,h);for(let f=0;f<n-1;f++){const p=f*2;l.push(p,p+1,p+2,p+1,p+3,p+2)}const u=new Ee;return u.setAttribute("position",new Qt(a,3)),u.setAttribute("uv",new Qt(c,2)),u.setIndex(l),u.computeVertexNormals(),u}const dr=new Map,yh=[];function Mh(i,t,e,n){if(!(i.length<2)){dr.has(e)||dr.set(e,[]),dr.get(e).push(wa(i,t+2.4,n)),yh.push(wa(i,t,n+.05));for(let s=1;s<i.length;s++)vh.push([i[s-1],i[s]])}}function __(){let i=0;for(const[e,n]of dr){const s=Sr(n,!1);if(!s)continue;const r=new qt(s,In(e));r.receiveShadow=!0,r.matrixAutoUpdate=!1,Se.add(r),i++}const t=Sr(yh,!1);if(t){const e=new qt(t,g_);e.receiveShadow=!0,e.matrixAutoUpdate=!1,Se.add(e),i++}return i}function x_(i,t,e,n){const s=n[0]-e[0],r=n[1]-e[1],o=s*s+r*r||1;let a=((i-e[0])*s+(t-e[1])*r)/o;return a=Math.max(0,Math.min(1,a)),Math.hypot(i-(e[0]+a*s),t-(e[1]+a*r))}Te.roads.forEach(i=>Mh(i.line,11,"#b4b4a7",1.24));(Te.roadsOsm||[]).forEach(i=>{const t={primary:"#b8b5a6",secondary:"#b1afa2",tertiary:"#adaca0"}[i.highway]||"#a8a79b";Mh(i.line,i.w*.72,t,-.92)});__();function v_(i,t,e,n,s,r){const o=[];for(let l=1;l<i.length;l++){const h=i[l-1],u=i[l],f=u[0]-h[0],p=u[1]-h[1],g=Math.hypot(f,p);if(g<1e-6)continue;const x=f/g,m=p/g;let d=0,M=0;const v=n+s;for(;d<g;){const _=Math.min(v-M,g-d);if(M<n&&_>.01){const w=d,A=d+_;o.push(wa([[h[0]+x*w,h[1]+m*w],[h[0]+x*A,h[1]+m*A]],r,t))}d+=_,M=(M+_)%v}}if(!o.length)return;const a=Sr(o,!1);if(!a)return;const c=new qt(a,In(e));c.receiveShadow=!1,c.matrixAutoUpdate=!1,Se.add(c)}Te.roads.forEach(i=>v_(i.line,1.31,"#dedac9",3.2,4.4,.55));const mi=[],Sh=[],Ss=[];function Ta(i,t){const e={...i,center:t};return mi.push(e),e}for(const i of Te.areas){if(i.ring&&(Er(i.ring,.15,i.kind==="pitch"?"#618464":i.kind==="garden"?"#758f67":i.kind==="court"?"#9b7463":"#c8c6ab",1.05),i.kind==="pitch")){ls(i.ring,"#e4e8d3",1,1.25);const t=new Za;i.ring.forEach(h=>t.expandByPoint(new Q(...h)));const e=t.getCenter(new Q),n=t.getSize(new Q);ls([[t.min.x,e.y],[t.max.x,e.y]],"#e6e8d6",1,1.3);const s=Array.from({length:65},(h,u)=>[e.x+9*Math.cos(u*Math.PI/32),e.y+9*Math.sin(u*Math.PI/32)]);ls(s,"#e6e8d6",1,1.3);const r=new pi,o=n.x/2+12,a=n.y/2+12;r.absellipse(0,0,o,a,0,Math.PI*2,!1);const c=new ga;c.absellipse(0,0,o-5,a-5,0,Math.PI*2,!0),r.holes.push(c);const l=new qt(new Ya(r),In("#a47963"));l.rotation.x=-Math.PI/2,l.position.set(e.x,1.22,e.y),Se.add(l),Ta({...i,category:"sport"},new D(e.x,2,e.y))}if(i.circle){Mc(...i.circle,i.r,"#d5cfb7"),Mc(...i.circle,8,"#708663",1.26);for(let t=14;t<i.r;t+=6)ls(Array.from({length:100},(e,n)=>[i.circle[0]+t*Math.cos(n/99*Math.PI*2),i.circle[1]+t*Math.sin(n/99*Math.PI*2)]),"#b9b59f",1,1.28);Ta({...i,category:"landmark"},new D(i.circle[0],3,i.circle[1]))}}const y_=Object.fromEntries(Object.entries({cream:"#c5c3b4",gray:"#939d9d",red:"#b27661",blue:"#648b9e"}).map(([i,t])=>[i,In(t)])),Aa=In("#697e76");let Qa=[];for(const[i,t]of Te.buildings.entries()){const e=Er(t.footprint,t.height,f_,1.2);Er(t.footprint,.65,y_[t.roof]||So,t.height+1.2);const n=new Za;t.footprint.forEach(a=>n.expandByPoint(new Q(...a)));const s=n.getCenter(new Q),r=n.getSize(new Q);if(Math.min(r.x,r.y)>13&&(ba(s.x,1.2+t.height+1.9,s.y,Math.min(r.x*.24,9),3.5,Math.min(r.y*.24,9),So),Math.max(r.x,r.y)>34))for(const a of[-1,1])ba(s.x+a*Math.min(r.x*.26,10),1.2+t.height+2.1,s.y-a*Math.min(r.y*.2,6),3.4,2.7,3.4,So);const o=Ta({...t,name:t.name||`建筑 ${String(i+1).padStart(2,"0")} · 待核名`},new D(s.x,t.height+3,s.y));e.userData.place=o,Sh.push(e);for(let a=0;a<t.footprint.length;a++){const c=t.footprint[a],l=t.footprint[(a+1)%t.footprint.length],h=l[0]-c[0],u=l[1]-c[1],f=Math.hypot(h,u);if(!(f<4))for(let p=2.2;p<f-1.2;p+=4.2)for(let g=3;g<t.height-1;g+=3.4){const x=new xe;x.position.set(c[0]+h*p/f,g+1.2,c[1]+u*p/f),x.rotation.y=-Math.atan2(u,h),x.scale.set(1.65,1.45,.24),x.updateMatrix(),Qa.push(x.matrix.clone())}}}const Eh=new pa(new Kn(1,1,1),Aa,Qa.length);Qa.forEach((i,t)=>Eh.setMatrixAt(t,i));Se.add(Eh);function Eo(i,t){let e=!1;for(let n=0,s=t.length-1;n<t.length;s=n++){const r=t[n],o=t[s];r[1]>i[1]!=o[1]>i[1]&&i[0]<(o[0]-r[0])*(i[1]-r[1])/(o[1]-r[1])+r[0]&&(e=!e)}return e}let bo=17;function Rn(){return bo=bo*1664525+1013904223>>>0,bo/4294967296}const M_=(()=>{const i=document.createElement("canvas");i.width=i.height=128;const t=i.getContext("2d"),e=Ja(91);for(let s=0;s<120;s++){const r=e()*6.2832,o=Math.sqrt(e())*60,a=64+Math.cos(r)*o,c=64+Math.sin(r)*o*.9,l=150+Math.round(e()*95);t.fillStyle=`rgba(${l},${l},${l},${.8+e()*.2})`,t.beginPath(),t.ellipse(a,c,3+e()*5,2+e()*3.2,e()*3.14,0,6.2832),t.fill()}const n=new ws(i);return n.colorSpace=we,n.wrapS=n.wrapT=Vn,n.anisotropy=4,n})();function wo(i,t,e){const n=new Ts(t*.55,t,i,6,1).toNonIndexed();return n.rotateZ(e),n.rotateX(e*.6),n.translate(0,i/2,0),n}function To(i,t,e,n){const s=[];for(let o=0;o<n;o++){const a=new Mn(i,t);a.rotateY(o*Math.PI/n),s.push(a)}const r=Sr(s,!1);return r.translate(0,e,0),r}const fr=[{tr:wo(3.3,.3,.05),cr:To(5.2,4.6,3.2,3),trunk:"#6f5f49",leaf:"#5f7f50",cast:!0,w:.6},{tr:wo(4.6,.24,.02),cr:To(3.5,5.6,4.1,3),trunk:"#6b5c48",leaf:"#4c6b45",cast:!1,w:.28},{tr:wo(2,.2,.07),cr:To(3.1,2.7,1.9,2),trunk:"#75664f",leaf:"#7a9163",cast:!1,w:.12}],bh=[[],[],[]];for(let i=0;i<3200;i++){const t=kn.min.x+Rn()*(kn.max.x-kn.min.x),e=kn.min.y+Rn()*(kn.max.y-kn.min.y);if(!Eo([t,e],Te.campusBoundary)||Te.buildings.some(a=>Eo([t,e],a.footprint))||Te.areas.some(a=>a.ring?Eo([t,e],a.ring):a.circle&&Math.hypot(t-a.circle[0],e-a.circle[1])<a.r+3)||vh.some(a=>x_(t,e,a[0],a[1])<6.5))continue;const n=Rn(),s=n<fr[0].w?0:n<fr[0].w+fr[1].w?1:2,r=new xe;r.position.set(t,0,e);const o=1.4+Rn()*1.5;r.scale.set(o*(.86+Rn()*.3),o*(.86+Rn()*.42),o*(.86+Rn()*.3)),r.rotation.y=Rn()*Math.PI*2,r.updateMatrix(),bh[s].push({m:r.matrix.clone(),shade:.76+Rn()*.46})}const wh=new cn;fr.forEach((i,t)=>{const e=bh[t];if(!e.length)return;const n=new xn({color:i.trunk,roughness:.95}),s=new xn({color:i.leaf,roughness:.92,map:M_,alphaTest:.42,side:tn}),r=new pa(i.tr,n,e.length),o=new pa(i.cr,s,e.length),a=new Wt;e.forEach((c,l)=>{r.setMatrixAt(l,c.m),o.setMatrixAt(l,c.m),a.setRGB(c.shade,c.shade*(.95+l*37%9/110),c.shade*.93),r.setColorAt(l,a),o.setColorAt(l,a)}),r.instanceMatrix.needsUpdate=o.instanceMatrix.needsUpdate=!0,r.instanceColor&&(r.instanceColor.needsUpdate=!0),o.instanceColor&&(o.instanceColor.needsUpdate=!0),r.castShadow=o.castShadow=i.cast,r.matrixAutoUpdate=o.matrixAutoUpdate=!1,wh.add(r,o)});Se.add(wh);let de=null,Ra="all",pr=!0,cs=!1,hs=!1,$e=!1,Ye=null;function Tr(i,t){if(Ea.matches){Ae.position.copy(t),Re.target.copy(i),Ye=null;return}Ye={start:performance.now(),from:Ae.position.clone(),to:t,tf:Re.target.clone(),tt:i}}function Ir(){cs=!1,Re.autoRotate=!1,Xt("tour-btn").setAttribute("aria-pressed","false")}function Cs(i){if(!i)return;if(Ir(),de=i,Oe=i.study?i.id:null,Ln.hide(),i.photo)Ye=null,Ln.show(i.entry),Xt("status").textContent="官网实景档案 · 未作地理落位";else if(Oe){Yn.has(i.id)||Yn.set(i.id,a_(i.id));const n=Yn.get(i.id);n.setNight($e);const s=n.position.clone(),r=Ae.clone(),o=n.bounds;for(let a=0;a<30&&(r.position.copy(s),r.lookAt(n.target),r.updateMatrixWorld(),![o.min.x,o.max.x].every(l=>[o.min.y,o.max.y].every(h=>[o.min.z,o.max.z].every(u=>{const f=new D(l,h,u).project(r);return Math.abs(f.x)<.86&&Math.abs(f.y)<.78}))));a++)s.sub(n.target).multiplyScalar(1.1).add(n.target);Tr(n.target.clone(),s),Ln.show(Dr.find(a=>a.id===i.photoId),!0),Xt("status").textContent="照片参照模型 · 比例估算"}else Tr(i.center.clone().setY(0),i.center.clone().add(new D(65,65,100))),Xt("status").textContent="影像校准版 · "+Te.buildings.length+" 栋体量";Xt("detail").replaceChildren();const t=document.createElement("h2");t.className="detail-title",t.textContent=i.name;const e=document.createElement("p");if(e.className="detail-body",e.textContent=i.note||"影像判读体量；正式名称与用途尚未核实。",Xt("detail").append(t,e),i.height){const n=document.createElement("p");n.className="detail-foot",n.textContent=`高度 ≈ ${i.height} m · 位置/轮廓为影像判读，非实测`,Xt("detail").append(n)}if(i.nameEvidence==="third-party"){const n=document.createElement("p");n.className="detail-foot",n.textContent=`楼名来源：第三方校园地图点位，距轮廓约 ${i.nameOffsetM} m · 未与校方命名核实`,Xt("detail").append(n)}Ps()}function Sc(){const i=Xt("search").value.trim();return mi.filter(t=>(Ra==="all"||t.category===Ra)&&t.name.includes(i))}function Ps(){Xt("place-list").replaceChildren();for(const i of Sc()){const t=document.createElement("button");t.className="place-item"+((de==null?void 0:de.id)===i.id?" active":""),t.dataset.id=i.id;const e=document.createElement("i");e.className="place-dot "+i.category;const n=document.createElement("span");n.className="place-text";const s=document.createElement("span");s.className="place-name",s.textContent=i.name;const r=document.createElement("span");if(r.className="place-sub",r.textContent=i.poi?"第三方参考点位 · 未落到轮廓":i.study?"照片参照 · 三维外观研究":i.photo?"官网实景 · 点击看图":i.evidence==="osm"?"OSM 轮廓 · 非测绘":i.nameEvidence==="third-party"?"影像轮廓 · 楼名据第三方参考":"影像判读 · 用途待核",i.photo||i.study){const o=i.photo?i.entry:Dr.find(c=>c.id===i.photoId),a=new Image;a.src=o.photos[0].src,a.alt="",a.loading="lazy",a.className="place-thumbnail",t.append(a),e.hidden=!0}t.setAttribute("aria-pressed",String((de==null?void 0:de.id)===i.id)),n.append(s,r),t.append(e,n),t.onclick=()=>Cs(i),Xt("place-list").append(t)}Sc().length||(Xt("place-list").textContent="没有匹配的地点")}mi.push(...Dr.map(i=>({id:i.id,name:i.title,category:i.category,photo:!0,entry:i,note:i.note,center:new D})));Object.entries(ph).reverse().forEach(([i,t])=>mi.unshift({...t,id:i,center:new D}));mi.filter(i=>!i.study&&!i.photo).forEach((i,t)=>{const e=document.createElement("button");e.type="button",e.className="map-label",e.textContent=i.name,e.onclick=()=>Cs(i),Xt("labels").append(e),Ss.push({p:i,el:e,i:t})});Xt("labels").removeAttribute("aria-hidden");const S_={teaching:"teaching",dormitory:"living",canteen:"living",playground:"sport",sign:"landmark",functionality:"teaching",unknown:"teaching",school:"landmark"};for(const i of(Te.poi||[]).filter(t=>!t.bldg)){const t={id:"poi:"+i.name,name:i.name,category:S_[i.type]||"teaching",poi:!0,evidence:"third-party",center:new D(i.x,2,i.z),note:`第三方校园地图参考点位（WGS-84 ${i.lat.toFixed(6)}, ${i.lng.toFixed(6)}；原表为 GCJ-02 火星坐标，已反算）。社区标注，非测绘成果，未与校方核实，也未与影像轮廓逐一对上。`};mi.push(t);const e=document.createElement("button");e.type="button",e.className="map-label poi-label",e.textContent=i.name,e.onclick=()=>Cs(t),Xt("labels").append(e),Ss.push({p:t,el:e,i:Ss.length,poi:!0})}Xt("search").oninput=Ps;document.querySelectorAll("[data-filter]").forEach(i=>i.onclick=()=>{Ra=i.dataset.filter,document.querySelectorAll("[data-filter]").forEach(t=>{t.classList.toggle("active",t===i),t.setAttribute("aria-pressed",String(t===i))}),Ps()});const E_=Te.buildings.filter(i=>i.nameEvidence==="third-party").length;function Th(){Ir(),Oe=null,de=null,Ln.hide(),Xt("status").textContent="影像校准版 · "+Te.buildings.length+" 栋体量",Xt("detail").innerHTML="<h2>校园概览</h2><p>"+Te.buildings.length+" 栋影像体量（其中 "+E_+" 栋按第三方校园地图点位采用楼名）· "+Object.keys(ph).length+" 处照片参照模型 · "+Dr.length+' 组实景档案。选择地点探索，或搜索楼名查看照片。</p><p class="detail-foot">照片研究不代表地理落位；模型尺寸与楼名均未与校方逐一核实。</p>',Ps()}Xt("home-btn").onclick=()=>{Th(),Tr(wr.clone(),xh.clone())};Xt("top-btn").onclick=()=>{Th(),Tr(wr.clone(),wr.clone().add(new D(0,1e3,.1)))};Xt("labels-btn").onclick=()=>{pr=!pr,Xt("labels-btn").setAttribute("aria-pressed",String(pr))};Xt("tour-btn").onclick=()=>{Ln.isOpen()&&Xt("home-btn").click(),cs=!cs,Re.autoRotate=cs,Re.autoRotateSpeed=.6,Xt("tour-btn").setAttribute("aria-pressed",String(cs))};Re.zoomToCursor=!0;Re.addEventListener("start",()=>{Ye=null,Ir()});Ea.addEventListener("change",()=>{Ea.matches&&(Ir(),Ye=null)});Xt("day-btn").onclick=()=>{$e=!$e,document.body.classList.toggle("night",$e),Se.background.set($e?"#25372f":"#a4af8b"),l_.material.color.set($e?"#3a4a52":"#ffffff"),Se.fog.color.set($e?"#25372f":"#b3bd9c"),hn.intensity=$e?.25:3.5,_h.intensity=$e?.5:1.45,Yn.forEach(i=>i.setNight($e)),Aa.emissive.set("#e7bf7b"),Aa.emissiveIntensity=$e?.6:0,Xt("day-btn").setAttribute("aria-pressed",String($e))};Xt("evidence-btn").onclick=()=>{hs=!hs,Ss.forEach(({el:i,p:t})=>i.textContent=t.name+(hs&&t.height?` ≈${t.height}m`:"")),Xt("evidence-btn").setAttribute("aria-pressed",String(hs))};Xt("sources-btn").onclick=()=>Xt("sources-dialog").showModal();Xt("sources-close").onclick=()=>Xt("sources-dialog").close();let mr=null;vn.addEventListener("pointerdown",i=>mr=[i.clientX,i.clientY]);vn.addEventListener("pointerup",i=>{if(!mr||Math.hypot(i.clientX-mr[0],i.clientY-mr[1])>5)return;const t=vn.getBoundingClientRect();if(Oe||Ln.isOpen())return;const e=new zd;e.setFromCamera(new Q((i.clientX-t.left)/t.width*2-1,-(i.clientY-t.top)/t.height*2+1),Ae);const n=e.intersectObjects(Sh)[0];n&&Cs(n.object.userData.place)});function Ah(){const i=vn.getBoundingClientRect();ke.setSize(i.width,i.height,!1),Ae.aspect=i.width/i.height,Ae.updateProjectionMatrix()}new ResizeObserver(Ah).observe(vn);Ah();Ps();Xt("loading").hidden=!0;Xt("status").textContent="影像校准版 · "+Te.buildings.length+" 栋体量";window.__campus={ready:!0,buildings:Te.buildings.length,stats:as,setCam(i,t){Ye=null,Ae.position.set(i[0],i[1],i[2]),Re.target.set(t[0],t[1],t[2]),Re.update()},get selected(){return de==null?void 0:de.id},get activeStudy(){return Oe},get mode(){return Ln.isOpen()?"photo":Oe?"study":"campus"},get cameraPosition(){return Ae.position.toArray()},get studyDiagnostics(){const i=Oe?Yn.get(Oe):null;return{camera:Ae.position.toArray(),target:Re.target.toArray(),fov:Ae.fov,aspect:Ae.aspect,viewport:{width:vn.clientWidth,height:vn.clientHeight},bounds:i?{min:i.bounds.min.toArray(),max:i.bounds.max.toArray()}:null}},get studyBackground(){return Oe?Yn.get(Oe).scene.background.getHexString():null},get studyFits(){if(!Oe)return null;const i=Yn.get(Oe).bounds;return[i.min.x,i.max.x].every(t=>[i.min.y,i.max.y].every(e=>[i.min.z,i.max.z].every(n=>{const s=new D(t,e,n).project(Ae);return Math.abs(s.x)<=1&&Math.abs(s.y)<=1})))},renderer:ke};let Ec=0;function Rh(i){if(requestAnimationFrame(Rh),document.hidden)return;if(Ye){let s=Math.min(1,(i-Ye.start)/950);s=s*s*(3-2*s),Ae.position.lerpVectors(Ye.from,Ye.to,s),Re.target.lerpVectors(Ye.tf,Ye.tt,s),s>=1&&(Ye=null)}if(Re.update(),Ln.isOpen()||(ke.render(Oe?Yn.get(Oe).scene:Se,Ae),as.draws=ke.info.render.calls,as.tris=ke.info.render.triangles,as.geoms=ke.info.memory.geometries,as.texs=ke.info.memory.textures),i-Ec<90)return;Ec=i;const t=vn.getBoundingClientRect(),e=[],n=[...Ss].sort((s,r)=>+(r.p.id===(de==null?void 0:de.id))-+(s.p.id===(de==null?void 0:de.id)));for(const{p:s,el:r,i:o}of n){const a=s.center.clone().project(Ae),c=(a.x+1)*.5*t.width,l=(-a.y+1)*.5*t.height,h=s.name.length*11+26+(hs?50:0),u={l:c-h/2,r:c+h/2,t:l-32,b:l+4};let f=!Oe&&!Ln.isOpen()&&pr&&a.z<1&&a.z>-1&&u.l>4&&u.r<t.width-4&&u.t>4&&u.b<t.height-105&&((de==null?void 0:de.id)===s.id||o%3===0||s.category==="sport");f&&e.some(p=>u.l<p.r&&u.r>p.l&&u.t<p.b&&u.b>p.t)&&(f=!1),f&&e.push(u),r.style.display=f?"":"none",r.style.left=c+"px",r.style.top=l+"px",r.classList.toggle("active",(de==null?void 0:de.id)===s.id)}}requestAnimationFrame(Rh);
