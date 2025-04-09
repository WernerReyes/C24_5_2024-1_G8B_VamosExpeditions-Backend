import{C as We,r as s,d as Xe,e as Ye,f as qe,y as Ve,z as Qe,E as en,a7 as nn,i as tn,U as rn,n as an,Z as $,F as on,o as v,m as K,x as un,a8 as ln,D as d,s as sn,O as cn,R as pn}from"./index-DI1O3zWc.js";function A(n){"@babel/helpers - typeof";return A=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},A(n)}function dn(n,t){if(A(n)!=="object"||n===null)return n;var r=n[Symbol.toPrimitive];if(r!==void 0){var i=r.call(n,t||"default");if(A(i)!=="object")return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(n)}function fn(n){var t=dn(n,"string");return A(t)==="symbol"?t:String(t)}function mn(n,t,r){return t=fn(t),t in n?Object.defineProperty(n,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):n[t]=r,n}function E(){return E=Object.assign?Object.assign.bind():function(n){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(n[i]=r[i])}return n},E.apply(this,arguments)}function B(n,t){(t==null||t>n.length)&&(t=n.length);for(var r=0,i=new Array(t);r<t;r++)i[r]=n[r];return i}function bn(n){if(Array.isArray(n))return B(n)}function vn(n){if(typeof Symbol<"u"&&n[Symbol.iterator]!=null||n["@@iterator"]!=null)return Array.from(n)}function ce(n,t){if(n){if(typeof n=="string")return B(n,t);var r=Object.prototype.toString.call(n).slice(8,-1);if(r==="Object"&&n.constructor&&(r=n.constructor.name),r==="Map"||r==="Set")return Array.from(n);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return B(n,t)}}function yn(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function le(n){return bn(n)||vn(n)||ce(n)||yn()}function gn(n){if(Array.isArray(n))return n}function Sn(n,t){var r=n==null?null:typeof Symbol<"u"&&n[Symbol.iterator]||n["@@iterator"];if(r!=null){var i,a,C,I,f=[],_=!0,D=!1;try{if(C=(r=r.call(n)).next,t!==0)for(;!(_=(i=C.call(r)).done)&&(f.push(i.value),f.length!==t);_=!0);}catch(R){D=!0,a=R}finally{try{if(!_&&r.return!=null&&(I=r.return(),Object(I)!==I))return}finally{if(D)throw a}}return f}}function On(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function w(n,t){return gn(n)||Sn(n,t)||ce(n,t)||On()}var xn=`
@layer primereact {
    .p-menu-overlay {
        position: absolute;
        /* Github #3122: Prevent animation flickering  */
        top: -9999px;
        left: -9999px;
    }

    .p-menu ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .p-menu .p-menuitem-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        text-decoration: none;
        overflow: hidden;
        position: relative;
    }

    .p-menu .p-menuitem-text {
        line-height: 1;
    }
}
`,En={root:function(t){var r=t.props,i=t.context;return v("p-menu p-component",{"p-menu-overlay":r.popup,"p-input-filled":i&&i.inputStyle==="filled"||K.inputStyle==="filled","p-ripple-disabled":i&&i.ripple===!1||K.ripple===!1})},menu:"p-menu-list p-reset",content:"p-menuitem-content",action:function(t){var r=t.item;return v("p-menuitem-link",{"p-disabled":r.disabled})},menuitem:function(t){var r=t.focused;return v("p-menuitem",{"p-focus":r})},submenuHeader:function(t){var r=t.submenu;return v("p-submenu-header",{"p-disabled":r.disabled})},separator:"p-menu-separator",label:"p-menuitem-text",icon:"p-menuitem-icon",transition:"p-connected-overlay"},In={submenuHeader:function(t){var r=t.submenu;return r.style},menuitem:function(t){var r=t.item;return r.style}},H=We.extend({defaultProps:{__TYPE:"Menu",id:null,ariaLabel:null,ariaLabelledBy:null,tabIndex:0,model:null,popup:!1,popupAlignment:"left",style:null,className:null,autoZIndex:!0,baseZIndex:0,appendTo:null,onFocus:null,onBlur:null,transitionOptions:null,onShow:null,onHide:null,children:void 0,closeOnEscape:!0},css:{classes:En,styles:xn,inlineStyles:In}});function se(n,t){var r=Object.keys(n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(n);t&&(i=i.filter(function(a){return Object.getOwnPropertyDescriptor(n,a).enumerable})),r.push.apply(r,i)}return r}function hn(n){for(var t=1;t<arguments.length;t++){var r=arguments[t]!=null?arguments[t]:{};t%2?se(Object(r),!0).forEach(function(i){mn(n,i,r[i])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(r)):se(Object(r)).forEach(function(i){Object.defineProperty(n,i,Object.getOwnPropertyDescriptor(r,i))})}return n}var Pn=s.memo(s.forwardRef(function(n,t){var r=Xe(),i=s.useContext(Ye),a=H.getProps(n,i),C=s.useState(a.id),I=w(C,2),f=I[0],_=I[1],D=s.useState(!a.popup),R=w(D,2),h=R[0],Z=R[1],pe=s.useState(-1),z=w(pe,2),y=z[0],k=z[1],de=s.useState(-1),G=w(de,2),J=G[0],fe=G[1],me=s.useState(!1),W=w(me,2),X=W[0],Y=W[1],j=H.setMetaData({props:a,state:{id:f,visible:h,focused:X}}),P=j.ptm,m=j.cx,q=j.sx,be=j.isUnstyled,N=function(e,o){return P(e,{context:o})};qe(H.css.styles,be,{name:"menu"});var p=s.useRef(null),V=s.useRef(null),b=s.useRef(null),Q=!!(h&&a.popup&&a.closeOnEscape),ee=Ve("menu",Q);Qe({callback:function(e){g(e)},when:Q&&ee,priority:[en.MENU,ee]});var ve=nn({target:b,overlay:p,listener:function(e,o){var l=o.valid;l&&(g(e),k(-1))},when:h}),ne=w(ve,2),ye=ne[0],ge=ne[1],Se=function(e){a.popup&&ln.emit("overlay-click",{originalEvent:e,target:b.current})},te=function(e,o,l){if(o.disabled){e.preventDefault();return}o.command&&o.command({originalEvent:e,item:o}),a.popup&&g(e),!a.popup&&y!==l&&k(l),o.url||(e.preventDefault(),e.stopPropagation())},Oe=function(e,o){e&&a.popup&&y!==o&&k(o)},xe=function(e){Y(!0),a.popup||(J!==-1?(S(J),fe(-1)):S(0)),a.onFocus&&a.onFocus(e)},Ee=function(e){Y(!1),k(-1),a.onBlur&&a.onBlur(e)},Ie=function(e){switch(e.code){case"ArrowDown":he(e);break;case"ArrowUp":Pe(e);break;case"Home":we(e);break;case"End":_e(e);break;case"Enter":case"NumpadEnter":re(e);break;case"Space":ke(e);break;case"Escape":a.popup&&(d.focus(b.current),g(e));case"Tab":a.popup&&h&&g(e);break}},he=function(e){var o=Ne(y);S(o),e.preventDefault()},Pe=function(e){if(e.altKey&&a.popup)d.focus(b.current),g(e),e.preventDefault();else{var o=Me(y);S(o),e.preventDefault()}},we=function(e){S(0),e.preventDefault()},_e=function(e){S(d.find(p.current,'li[data-pc-section="menuitem"][data-p-disabled="false"]').length-1),e.preventDefault()},re=function(e){var o=d.findSingle(p.current,'li[id="'.concat("".concat(y),'"]')),l=o&&d.findSingle(o,'a[data-pc-section="action"]');a.popup&&d.focus(b.current),l?l.click():o&&o.click(),e.preventDefault()},ke=function(e){re(e)},Ne=function(e){var o=d.find(p.current,'li[data-pc-section="menuitem"][data-p-disabled="false"]'),l=le(o).findIndex(function(c){return c.id===e});return l>-1?l+1:0},Me=function(e){var o=d.find(p.current,'li[data-pc-section="menuitem"][data-p-disabled="false"]'),l=le(o).findIndex(function(c){return c.id===e});return l>-1?l-1:0},S=function(e){var o=d.find(p.current,'li[data-pc-section="menuitem"][data-p-disabled="false"]'),l=e>=o.length?o.length-1:e<0?0:e;l>-1&&k(o[l].getAttribute("id"))},ae=function(){return y!==-1?y:null},Ae=function(e){a.popup&&(h?g(e):oe(e))},oe=function(e){b.current=e.currentTarget,Z(!0),a.onShow&&a.onShow(e)},g=function(e){b.current=e.currentTarget,Z(!1),a.onHide&&a.onHide(e)},Ce=function(){d.addStyles(p.current,{position:"absolute",top:"0",left:"0"}),$.set("menu",p.current,i&&i.autoZIndex||K.autoZIndex,a.baseZIndex||i&&i.zIndex.menu||K.zIndex.menu),d.absolutePosition(p.current,b.current,a.popupAlignment),a.popup&&(d.focus(V.current),S(0))},De=function(){ye()},Re=function(){b.current=null,ge()},je=function(){$.clear(p.current)};tn(function(){f||_(rn())}),an(function(){$.clear(p.current)}),s.useImperativeHandle(t,function(){return{props:a,toggle:Ae,show:oe,hide:g,getElement:function(){return p.current},getTarget:function(){return b.current}}});var Te=function(e,o){var l=f+"_sub_"+o,c=e.items.map(function(M,L){return ie(M,L,l)}),T=r({id:l,role:"none",className:v(e.className,m("submenuHeader",{submenu:e})),style:q("submenuHeader",{submenu:e}),"data-p-disabled":e.disabled},P("submenuHeader"));return s.createElement(s.Fragment,{key:l},s.createElement("li",E({},T,{key:l}),e.label),c)},He=function(e,o){var l=f+"_separator_"+o,c=r({id:l,className:v(e.className,m("separator")),role:"separator"},P("separator"));return s.createElement("li",E({},c,{key:l}))},ie=function(e,o){var l=arguments.length>2&&arguments[2]!==void 0?arguments[2]:null,c={item:e,index:o,parentId:l},T=v("p-menuitem-link",{"p-disabled":e.disabled}),M=v("p-menuitem-icon",e.icon),L=r({className:m("icon")},N("icon",c)),Ue=sn.getJSXIcon(e.icon,hn({},L),{props:a}),$e=r({className:m("label")},N("label",c)),Be=e.label&&s.createElement("span",$e,e.label),O=e.id||(l||f)+"_"+o,Ze=r({onClick:function(x){return te(x,e,O)},onMouseMove:function(x){return Oe(x,O)},className:m("content")},N("content",c)),ze=r({href:e.url||"#",className:m("action",{item:e}),onFocus:function(x){return x.stopPropagation()},target:e.target,tabIndex:"-1","aria-label":e.label,"aria-hidden":!0,"aria-disabled":e.disabled,"data-p-disabled":e.disabled},N("action",c)),F=s.createElement("div",Ze,s.createElement("a",ze,Ue,Be,s.createElement(pn,null)));if(e.template){var Ge={onClick:function(x){return te(x,e,O)},className:T,tabIndex:"-1",labelClassName:"p-menuitem-text",iconClassName:M,element:F,props:a};F=cn.getJSXElement(e.template,e,Ge)}var Je=r({id:O,className:v(e.className,m("menuitem",{focused:y===O})),style:q("menuitem",{item:e}),role:"menuitem","aria-label":e.label,"aria-disabled":e.disabled,"data-p-focused":ae()===O,"data-p-disabled":e.disabled||!1},N("menuitem",c));return s.createElement("li",E({},Je,{key:O}),F)},Ke=function(e,o){return e.visible===!1?null:e.separator?He(e,o):e.items?Te(e,o):ie(e,o)},Le=function(){return a.model.map(Ke)},Fe=function(){if(a.model){var e=Le(),o=r({className:v(a.className,m("root",{context:i})),style:a.style,onClick:function(M){return Se(M)}},H.getOtherProps(a),P("root")),l=r({ref:V,className:m("menu"),id:f+"_list",tabIndex:a.tabIndex||"0",role:"menu","aria-label":a.ariaLabel,"aria-labelledby":a.ariaLabelledBy,"aria-activedescendant":X?ae():void 0,onFocus:xe,onKeyDown:Ie,onBlur:Ee},P("menu")),c=r({classNames:m("transition"),in:h,timeout:{enter:120,exit:100},options:a.transitionOptions,unmountOnExit:!0,onEnter:Ce,onEntered:De,onExit:Re,onExited:je},P("transition"));return s.createElement(un,E({nodeRef:p},c),s.createElement("div",E({id:a.id,ref:p},o),s.createElement("ul",l,e)))}return null},ue=Fe();return a.popup?s.createElement(on,{element:ue,appendTo:a.appendTo}):ue}));Pn.displayName="Menu";export{Pn as M};
