import{C as U,r as o,d as z,e as B,f as k,D as H,o as w,O as h,s as M,j as E,V as q}from"./index-D_cF9bit.js";import{B as J}from"./badge.esm-CnWvYCoG.js";function p(e){"@babel/helpers - typeof";return p=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},p(e)}function K(e,t){if(p(e)!=="object"||e===null)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var a=r.call(e,t||"default");if(p(a)!=="object")return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function X(e){var t=K(e,"string");return p(t)==="symbol"?t:String(t)}function L(e,t,r){return t=X(t),t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function O(){return O=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(e[a]=r[a])}return e},O.apply(this,arguments)}function V(e){if(Array.isArray(e))return e}function W(e,t){var r=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(r!=null){var a,n,s,c,i=[],l=!0,m=!1;try{if(s=(r=r.call(e)).next,t!==0)for(;!(l=(a=s.call(r)).done)&&(i.push(a.value),i.length!==t);l=!0);}catch(g){m=!0,n=g}finally{try{if(!l&&r.return!=null&&(c=r.return(),Object(c)!==c))return}finally{if(m)throw n}}return i}}function S(e,t){(t==null||t>e.length)&&(t=e.length);for(var r=0,a=new Array(t);r<t;r++)a[r]=e[r];return a}function Y(e,t){if(e){if(typeof e=="string")return S(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);if(r==="Object"&&e.constructor&&(r=e.constructor.name),r==="Map"||r==="Set")return Array.from(e);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return S(e,t)}}function G(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function P(e,t){return V(e)||W(e,t)||Y(e,t)||G()}var Q={root:function(t){var r=t.props,a=t.state;return w("p-avatar p-component",{"p-avatar-image":h.isNotEmpty(r.image)&&!a.imageFailed,"p-avatar-circle":r.shape==="circle","p-avatar-lg":r.size==="large","p-avatar-xl":r.size==="xlarge","p-avatar-clickable":!!r.onClick})},label:"p-avatar-text",icon:"p-avatar-icon"},Z=`
@layer primereact {
    .p-avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        font-size: 1rem;
    }
    
    .p-avatar.p-avatar-image {
        background-color: transparent;
    }
    
    .p-avatar.p-avatar-circle {
        border-radius: 50%;
    }
    
    .p-avatar.p-avatar-circle img {
        border-radius: 50%;
    }
    
    .p-avatar .p-avatar-icon {
        font-size: 1rem;
    }
    
    .p-avatar img {
        width: 100%;
        height: 100%;
    }
    
    .p-avatar-clickable {
        cursor: pointer;
    }
}
`,y=U.extend({defaultProps:{__TYPE:"Avatar",className:null,icon:null,image:null,imageAlt:"avatar",imageFallback:"default",label:null,onImageError:null,shape:"square",size:"normal",style:null,template:null,children:void 0},css:{classes:Q,styles:Z}});function A(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable})),r.push.apply(r,a)}return r}function ee(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]!=null?arguments[t]:{};t%2?A(Object(r),!0).forEach(function(a){L(e,a,r[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):A(Object(r)).forEach(function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(r,a))})}return e}var x=o.forwardRef(function(e,t){var r=z(),a=o.useContext(B),n=y.getProps(e,a),s=o.useRef(null),c=o.useState(!1),i=P(c,2),l=i[0],m=i[1],g=o.useState(!1),j=P(g,2),_=j[0],I=j[1],b=y.setMetaData({props:n,state:{imageFailed:l,nested:_}}),f=b.ptm,d=b.cx,N=b.isUnstyled;k(y.css.styles,N,{name:"avatar"});var C=function(){if(h.isNotEmpty(n.image)&&!l){var u=r({src:n.image,onError:R},f("image"));return o.createElement("img",O({alt:n.imageAlt},u))}else if(n.label){var F=r({className:d("label")},f("label"));return o.createElement("span",F,n.label)}else if(n.icon){var T=r({className:d("icon")},f("icon"));return M.getJSXIcon(n.icon,ee({},T),{props:n})}return null},R=function(u){n.imageFallback==="default"?n.onImageError||(m(!0),u.target.src=null):u.target.src=n.imageFallback,n.onImageError&&n.onImageError(u)};o.useEffect(function(){var v=H.isAttributeEquals(s.current.parentElement,"data-pc-name","avatargroup");I(v)},[]),o.useImperativeHandle(t,function(){return{props:n,getElement:function(){return s.current}}});var $=r({ref:s,style:n.style,className:w(n.className,d("root",{imageFailed:l}))},y.getOtherProps(n),f("root")),D=n.template?h.getJSXElement(n.template,n):C();return o.createElement("div",$,D,n.children)});x.displayName="Avatar";const ne=({label:e,badge:t,className:r,...a})=>E.jsxs(x,{...a,className:q(r,t?"p-overlay-badge":void 0),label:te(e),children:[t&&E.jsx(J,{...t}),a.children]}),te=e=>{if(!e)return;const[t,r]=e.split(" ");return`${t.charAt(0).toUpperCase()}${(r==null?void 0:r.charAt(0).toUpperCase())??""}`};export{ne as A};
