import{r as o,j as a,Q as S,C as j,i as P,k as w,a2 as h,m as E,o as F,J as v,B as C}from"./index-Dt1SHOUe.js";import{p as B}from"./phoneNumber.adapter-C09bg4A8.js";import{C as T}from"./row.esm-DhTP9-ee.js";const M=(e,l)=>{const s=sessionStorage.getItem(l||"")||"{}",n=JSON.parse(s),[r,u]=o.useState(n.currentPage??1),[d,f]=o.useState(n.filters??void 0),[g,m]=o.useState(),[i,p]=o.useState(n.first??0),[x,b]=o.useState(n.rows??e);return{currentPage:r,limit:x,first:i,handlePageChange:t=>{t.page&&t.page>0?u(t.page+1):u(1),p(t.first),b(t.rows),"sortField"in t&&"sortOrder"in t&&(t.first=0,m({sortField:t.sortField,sortOrder:t.sortOrder,multiSortMeta:[]}),f(t.filters))},handleSaveState:t=>{l&&sessionStorage.setItem(l,JSON.stringify({first:t.first,rows:t.rows,currentPage:t.first/t.rows+1,filters:t.filters}))},filters:d,sortField:g}},R=({user:e})=>a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsx(S,{label:e.fullname,shape:"circle",badge:{severity:e.online?"success":"danger"},className:"bg-primary text-white"}),a.jsx("span",{children:e.fullname})]}),U=({client:e})=>a.jsxs("div",{className:"flex flex-col",children:[a.jsx("span",{children:e==null?void 0:e.fullName}),a.jsx("span",{className:"text-xs text-muted-foreground",children:e==null?void 0:e.email}),a.jsxs("span",{className:"text-xs flex items-center text-muted-foreground",children:[a.jsxs("div",{className:"flex items-center gap-1",children:[(e==null?void 0:e.country.image)&&a.jsx("img",{src:e==null?void 0:e.country.image.png,alt:"flag",className:"w-4 h-4"}),a.jsx("span",{children:e==null?void 0:e.country.name})]}),a.jsx("span",{className:"mx-1",children:"|"}),a.jsx("p",{className:"text-xs text-muted-foreground",children:B.format(e==null?void 0:e.phone)})]})]});var c=j.extend({defaultProps:{__TYPE:"Toolbar",id:null,style:null,className:null,left:null,right:null,start:null,center:null,end:null,children:void 0},css:{classes:{root:"p-toolbar p-component",start:"p-toolbar-group-start p-toolbar-group-left",center:"p-toolbar-group-center",end:"p-toolbar-group-end p-toolbar-group-right"},styles:`
        @layer primereact {
            .p-toolbar {
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
            }
            
            .p-toolbar-group-start,
            .p-toolbar-group-center,
            .p-toolbar-group-end {
                display: flex;
                align-items: center;
            }
            
            .p-toolbar-group-left,
            .p-toolbar-group-right {
                display: flex;
                align-items: center;
            }
        }
        `}}),A=o.memo(o.forwardRef(function(e,l){var s=P(),n=o.useContext(w),r=c.getProps(e,n),u=o.useRef(null),d=h.getJSXElement(r.left||r.start,r),f=h.getJSXElement(r.center,r),g=h.getJSXElement(r.right||r.end,r),m=c.setMetaData({props:r}),i=m.ptm,p=m.cx,x=m.isUnstyled;E(c.css.styles,x,{name:"toolbar"}),o.useImperativeHandle(l,function(){return{props:r,getElement:function(){return u.current}}});var b=s({className:p("start")},i("start")),y=s({className:p("center")},i("center")),N=s({className:p("end")},i("end")),t=s({id:r.id,ref:u,style:r.style,className:F(r.className,p("root")),role:"toolbar"},c.getOtherProps(r),i("root"));return o.createElement("div",t,o.createElement("div",b,d),o.createElement("div",y,f),o.createElement("div",N,g))}));A.displayName="Toolbar";const L=e=>{const{width:l,TABLET:s}=v();return a.jsx(C,{label:l<s?"":"Aplicar",icon:l<s?"pi pi-check":"",onClick:()=>{const n=e.filterModel.constraints[0].value;e.filterApplyCallback(n,0)}})},D=e=>{const{width:l,TABLET:s}=v();return a.jsx(C,{label:l<s?"":"Limpiar",icon:l<s?"pi pi-times":"",outlined:!0,onClick:()=>e.filterClearCallback()})},X=({options:e,placeholder:l})=>a.jsx(T,{value:e.value,onChange:s=>s.value&&e.filterApplyCallback(s.value,e.index),placeholder:l,dateFormat:"dd/mm/yy",showIcon:!0,showOnFocus:!1,todayButtonClassName:"p-button-text",clearButtonClassName:"p-button-text",locale:"es",inputClassName:"text-sm"});export{U as C,D as F,A as T,R as U,L as a,X as b,M as u};
