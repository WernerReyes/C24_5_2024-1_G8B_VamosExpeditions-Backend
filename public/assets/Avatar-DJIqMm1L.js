import{C as T,r as o,d as U,e as z,f as k,D as H,o as A,O as h,s as M,j as B}from"./index-o_twqZXt.js";function p(e){"@babel/helpers - typeof";return p=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},p(e)}function q(e,t){if(p(e)!=="object"||e===null)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var n=r.call(e,t||"default");if(p(n)!=="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function J(e){var t=q(e,"string");return p(t)==="symbol"?t:String(t)}function K(e,t,r){return t=J(t),t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function O(){return O=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},O.apply(this,arguments)}function X(e){if(Array.isArray(e))return e}function L(e,t){var r=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(r!=null){var n,a,s,c,i=[],l=!0,m=!1;try{if(s=(r=r.call(e)).next,t!==0)for(;!(l=(n=s.call(r)).done)&&(i.push(n.value),i.length!==t);l=!0);}catch(y){m=!0,a=y}finally{try{if(!l&&r.return!=null&&(c=r.return(),Object(c)!==c))return}finally{if(m)throw a}}return i}}function S(e,t){(t==null||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function W(e,t){if(e){if(typeof e=="string")return S(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);if(r==="Object"&&e.constructor&&(r=e.constructor.name),r==="Map"||r==="Set")return Array.from(e);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return S(e,t)}}function Y(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function j(e,t){return X(e)||L(e,t)||W(e,t)||Y()}var G={root:function(t){var r=t.props,n=t.state;return A("p-avatar p-component",{"p-avatar-image":h.isNotEmpty(r.image)&&!n.imageFailed,"p-avatar-circle":r.shape==="circle","p-avatar-lg":r.size==="large","p-avatar-xl":r.size==="xlarge","p-avatar-clickable":!!r.onClick})},label:"p-avatar-text",icon:"p-avatar-icon"},Q=`
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
`,g=T.extend({defaultProps:{__TYPE:"Avatar",className:null,icon:null,image:null,imageAlt:"avatar",imageFallback:"default",label:null,onImageError:null,shape:"square",size:"normal",style:null,template:null,children:void 0},css:{classes:G,styles:Q}});function P(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable})),r.push.apply(r,n)}return r}function V(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]!=null?arguments[t]:{};t%2?P(Object(r),!0).forEach(function(n){K(e,n,r[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):P(Object(r)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))})}return e}var w=o.forwardRef(function(e,t){var r=U(),n=o.useContext(z),a=g.getProps(e,n),s=o.useRef(null),c=o.useState(!1),i=j(c,2),l=i[0],m=i[1],y=o.useState(!1),E=j(y,2),_=E[0],x=E[1],b=g.setMetaData({props:a,state:{imageFailed:l,nested:_}}),f=b.ptm,d=b.cx,I=b.isUnstyled;k(g.css.styles,I,{name:"avatar"});var N=function(){if(h.isNotEmpty(a.image)&&!l){var u=r({src:a.image,onError:C},f("image"));return o.createElement("img",O({alt:a.imageAlt},u))}else if(a.label){var D=r({className:d("label")},f("label"));return o.createElement("span",D,a.label)}else if(a.icon){var F=r({className:d("icon")},f("icon"));return M.getJSXIcon(a.icon,V({},F),{props:a})}return null},C=function(u){a.imageFallback==="default"?a.onImageError||(m(!0),u.target.src=null):u.target.src=a.imageFallback,a.onImageError&&a.onImageError(u)};o.useEffect(function(){var v=H.isAttributeEquals(s.current.parentElement,"data-pc-name","avatargroup");x(v)},[]),o.useImperativeHandle(t,function(){return{props:a,getElement:function(){return s.current}}});var R=r({ref:s,style:a.style,className:A(a.className,d("root",{imageFailed:l}))},g.getOtherProps(a),f("root")),$=a.template?h.getJSXElement(a.template,a):N();return o.createElement("div",R,$,a.children)});w.displayName="Avatar";const te=({label:e,...t})=>B.jsx(w,{...t,label:Z(e)}),Z=e=>{if(!e)return;const[t,r]=e.split(" ");return`${t.charAt(0).toUpperCase()}${(r==null?void 0:r.charAt(0).toUpperCase())??""}`};export{te as A};
