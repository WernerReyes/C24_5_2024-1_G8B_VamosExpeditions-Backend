import{b9 as De,j as e,Y as Q,a$ as g,af as D,aS as Re,a_ as ie,r as v,I as le,u as Se,J as K,ba as Fe,bb as Te,bc as Me,B as C,aB as ne,aC as Ie,_ as Oe,bd as ke,c as Le,be as Ve,bf as Be,bg as oe,aN as ce,V as B,ai as de,b0 as Ge,bh as ue,bi as Qe,bj as _e,aV as ae,ad as W,bk as ze,ae as qe,X as me,ab as he,ar as Ue,H as $e,ag as Ke,bl as We,bm as He,bn as Je,aJ as Xe,a3 as Ye,a4 as Ze,a1 as ea}from"./index-o_twqZXt.js";import{U as xe,C as pe,F,a as L,b as se,u as fe,T as aa}from"./FilterByDate-DTjcan2h.js";import{B as H}from"./badge.esm-XbflrKQh.js";import{C as l}from"./column.esm-B5q7Iliz.js";import{T}from"./tag.esm-COn-xcTG.js";import{E as ve,D as je}from"./ErrorBoundary-28oCh43E.js";import{f as J}from"./format-D-vkVYqJ.js";import{A as sa}from"./Avatar-DJIqMm1L.js";import{u as ta,t as ra,C as V}from"./zod-CtXsQb7t.js";import{a as ge,R as Ne}from"./row.esm-DIYvdFZ9.js";const ia=({options:s})=>{const{data:t}=De();return e.jsx(Q,{value:s.value||[],options:(t==null?void 0:t.data)||[],display:"chip",itemTemplate:i=>e.jsx(xe,{user:i}),onChange:i=>s.filterCallback(i.value,s.index),dataKey:"id",optionLabel:"fullname",placeholder:"Selecciona representantes",maxSelectedLabels:2,className:"p-column-filter"})},la=({options:s})=>e.jsx(Q,{value:s.value||[],options:Object.values(g).map(t=>({label:D[t].label,id:t})),display:"chip",itemTemplate:({id:t})=>{const{label:i,severity:h,icon:o}=D[t];return e.jsx(T,{value:i,severity:h,icon:o})},onChange:t=>{t.value!==s.value&&s.filterCallback(t.value,s.index)},dataKey:"id",placeholder:"Selecciona un estado",selectAllLabel:"Todos",maxSelectedLabels:2,className:"p-column-filter"}),na=({options:s})=>{const{data:t}=Re();return e.jsx(Q,{value:s.value||[],options:t==null?void 0:t.data,display:"chip",itemTemplate:i=>e.jsx(pe,{client:i}),dataKey:"id",onChange:i=>s.filterCallback(i.value,s.index),optionLabel:"fullName",placeholder:"Selecciona un cliente",selectAllLabel:"Todos",maxSelectedLabels:2,className:"p-column-filter"})},oa=(s,t)=>Array.isArray(t)&&t.length===0?!0:Array.isArray(t)?t.some(i=>(i==null?void 0:i.id)===s):!1,ca=(s,t)=>Array.isArray(t)&&t.length===0?!0:Array.isArray(t)?t.some(i=>(i==null?void 0:i.id)===s):!1,da=(s,t)=>Array.isArray(t)&&t.length===0?!0:Array.isArray(t)?t.some(i=>(i==null?void 0:i.id)===s):!1,be=s=>{var t,i,h;return{name:s.name.constraints[0].value??void 0,clientsIds:((t=s["tripDetails.client.id"].constraints[0].value)==null?void 0:t.map(o=>o.id))??void 0,startDate:s["tripDetails.startDate"].constraints[0].value??void 0,endDate:s["tripDetails.endDate"].constraints[0].value??void 0,representativesIds:((i=s["user.id"].constraints[0].value)==null?void 0:i.map(o=>o.id))??void 0,status:((h=s.status.constraints[0].value)==null?void 0:h.map(o=>o.id))??void 0}},$=({message:s})=>e.jsxs("span",{className:"text-xs md:text-sm text-gray-400",children:[e.jsx("i",{className:"pi pi-ban"})," ",s]}),ua=({options:s})=>{const[t,{isLoading:i}]=ie(),[h]=v.useState(s.rowData.name);return e.jsx(le,{disabled:i,value:s.rowData.name,className:"max-w-48 text-sm",onChange:o=>{var n;return(n=s.editorCallback)==null?void 0:n.call(s,o.target.value)},onBlur:()=>{s.value===h||!s.value.trim()||t({...s.rowData,name:s.value}).then(()=>{var o;return(o=s.editorCallback)==null?void 0:o.call(s,s.value)})},onKeyDown:o=>{s.value===h||!s.value.trim()||o.key==="Enter"&&t({...s.rowData,name:s.value}).then(()=>{var n;return(n=s.editorCallback)==null?void 0:n.call(s,s.value)})}})},{EDIT_QUOTE:ma}=Le.private,ha=["Transporte","Actividades","Alimenatación","Guías","Alojamiento"],xa=({type:s,rowData:t})=>{const i=Se(),[h,o]=v.useState(!1),{authUser:n}=K(r=>r.auth),{users:x}=K(r=>r.users),[a,{isLoading:p}]=Fe(),[d]=Te(),[N,{isLoading:w}]=Me(),{control:b,handleSubmit:P}=ta({resolver:ra(Ve)}),m=async r=>{var c;await N({subject:r.subject,to:r.to.map(f=>({email:f.email})),resources:r.resources,description:r.description,reservationId:(c=t.tripDetails)==null?void 0:c.id}).unwrap(),await d({from_user:n==null?void 0:n.id,to_user:r.to.map(f=>f.id),message:r.description}).unwrap()},y=r=>e.jsxs("div",{className:`\r
        flex\r
        items-center\r
      `,children:[e.jsx(sa,{icon:"pi pi-user",shape:"circle"}),e.jsx(H,{severity:r.online?"success":"danger",className:"mx-2"}),e.jsx("p",{className:"font-bold ",children:r.fullname})]});return e.jsxs("div",{className:"space-x-1",children:[e.jsx(C,{rounded:!0,text:!0,icon:"pi pi-pencil",onClick:()=>{i(ma(t==null?void 0:t.id))},disabled:t.status===g.APPROVED&&t.official}),e.jsx(C,{icon:"pi pi-file-pdf",className:"",rounded:!0,text:!0,disabled:p||t.status===g.DRAFT,onClick:()=>{var r,c;t.tripDetails&&a({id:t.id,name:((c=(r=t==null?void 0:t.tripDetails)==null?void 0:r.client)==null?void 0:c.fullName)||""})}}),s==="principal"&&e.jsx(C,{icon:"pi pi-envelope",rounded:!0,disabled:!t.tripDetails,text:!0,onClick:()=>{o(!0)}}),e.jsx(ne,{header:"Enviar correo",visible:h,style:{width:"auto"},onHide:()=>{o(!1)},children:e.jsxs("form",{className:"text-tertiary text-[20px] font-bold mb-4",onSubmit:P(m),children:[e.jsx(V,{name:"subject",control:b,defaultValue:"",render:({field:r,fieldState:{error:c}})=>e.jsx(le,{type:"text",label:{text:"Asunto",className:"text-tertiary text-[20px] font-bold "},placeholder:"Asunto",className:"w-full mb-4",invalid:!!c,...r,small:{text:c==null?void 0:c.message,className:"text-red-500"}})}),e.jsxs("div",{className:"mb-6",children:[e.jsx("label",{htmlFor:"",className:`\r
            \r
            `,children:"Para"}),e.jsx(V,{name:"to",control:b,render:({field:r,fieldState:{error:c}})=>e.jsx(Q,{options:Array.isArray(x)?x==null?void 0:x.map(f=>({...f})):[],multiple:!0,filter:!0,className:"w-full",placeholder:"Para",invalid:!!c,...r,onChange:f=>{r.onChange(f.value)},small:{text:c==null?void 0:c.message,className:"text-red-500"},display:"chip",optionLabel:"fullname",itemTemplate:y})})]}),e.jsx("div",{className:"mb-6",children:e.jsx("div",{children:e.jsx(V,{name:"resources",control:b,render:({field:r,fieldState:{error:c}})=>e.jsx(Ie,{label:{text:"Recursos"},options:ha,invalid:!!c,...r,onChange:f=>r.onChange(f.value),small:{text:c==null?void 0:c.message,className:"text-red-500"}})})})}),e.jsx(V,{name:"description",control:b,render:({field:r,fieldState:{error:c}})=>e.jsx(Oe,{...r,label:{text:"Descripción ( Opcional )"},rows:5,small:{text:c==null?void 0:c.message,className:"text-red-500"}})}),e.jsx("div",{className:"flex justify-end mt-4",children:w?e.jsx(ke,{style:{width:"40px",height:"40px"},strokeWidth:"8"}):e.jsxs(e.Fragment,{children:[e.jsx(C,{label:"Cancelar",onClick:()=>{o(!1)},icon:"pi pi-envelope",type:"submit",className:"mr-4 bg-white text-gray-500"}),e.jsx(C,{label:"Enviar",icon:"pi pi-envelope",type:"submit",disabled:w})]})})]})})]})},pa=({options:s})=>{const[t]=Be(),[i]=oe();return e.jsx(ce,{value:s.rowData.official,options:[{label:"Oficial",value:!0}],itemTemplate:()=>e.jsx("i",{className:"pi pi-check-circle"}),valueTemplate:()=>e.jsx("i",{className:B("pi",s.value?"pi-check-circle":"pi-times-circle")}),onChange:h=>{h.value!==s.value&&t({versionNumber:s.rowData.id.versionNumber,quotationId:s.rowData.id.quotationId}).unwrap().then(({data:o})=>{var n;(n=s.editorCallback)==null||n.call(s,h.value),o.newOfficial.status===g.APPROVED&&i({id:0,quotationId:s.rowData.id.quotationId,status:de.PENDING})})},placeholder:"Seleccionar tipo de cotización",className:"w-full"})},fa=({options:s,setSelectedQuotation:t})=>{const[i]=oe(),[h]=ie(),o=async n=>{var x;if(n.value!==s.value){if(s.rowData.official&&s.rowData.reservation&&n.value===g.CANCELATED)return t(s.rowData),(x=s.editorCallback)==null?void 0:x.call(s,n.value);n.value===g.APPROVED&&s.rowData.official?i({id:0,status:de.PENDING,quotationId:s.rowData.id.quotationId}).unwrap().then(()=>{var a;(a=s.editorCallback)==null||a.call(s,n.value)}):h(Ge.parse({...s.rowData,status:n.value})).unwrap().then(()=>{var a;(a=s.editorCallback)==null||a.call(s,n.value)})}};return e.jsx(ce,{value:s.rowData.status,options:[{...D[g.APPROVED],value:g.APPROVED},{...D[g.CANCELATED],value:g.CANCELATED}],itemTemplate:n=>e.jsx(T,{value:n.label,severity:n.severity,icon:n.icon}),valueTemplate:()=>{const{label:n,severity:x,icon:a}=D[s.value];return e.jsx(T,{value:n,severity:x,icon:a})},onChange:o,placeholder:"Seleccionar tipo de cotización",className:"w-full"})},va={EDIT_REFERENCE:"editReference",CANCEL_RESERVATION:"cancelReservation"},ja=({selectedQuotation:s,setSelectedQuotation:t})=>{var w,b,P;const{currentData:i}=ue({limit:10,page:1,quotationId:s==null?void 0:s.id.quotationId,status:[g.APPROVED]},{skip:!s}),[h]=Qe(),[o]=_e(),[n,x]=v.useState("EDIT_REFERENCE"),[a,p]=v.useState(void 0),d=(w=i==null?void 0:i.data)==null?void 0:w.content,N=()=>{var m;if(s){if(n==="CANCEL_RESERVATION"){s.reservation||alert("No se puede cancelar la reserva"),o(((m=s.reservation)==null?void 0:m.id)||0).unwrap().then(()=>{t(void 0)});return}!d||!a||h({quotationId:s.id.quotationId,versionNumber:a}).unwrap().then(()=>{t(void 0)})}};return v.useEffect(()=>{var m;d&&!a&&p((m=d[0])==null?void 0:m.id.versionNumber)},[d]),e.jsxs(ne,{header:"Motivo de cancelación",headerClassName:"text-primary",visible:!!s,onHide:()=>t(void 0),style:{maxWidth:"30rem"},children:[e.jsx("p",{className:"text-center",children:"Estas a punto de cancelar la versión oficial. Se debe seleccionar otra versión aprobada para reemplazarla."}),s&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"my-4",children:[e.jsx("h4",{className:"font-bold mb-2 text-primary",children:"Cotización oficial actual"}),e.jsxs("div",{className:"ml-3 grid grid-cols-2 gap-2",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-gray-400",children:"ID:"})," ",s.id.quotationId]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-gray-400",children:"Version:"})," v",s.id.versionNumber]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-gray-400",children:"Cliente: "}),(P=(b=s.tripDetails)==null?void 0:b.client)==null?void 0:P.fullName]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-gray-400",children:"Monto: "}),J(s.finalPrice||0)]})]})]}),n==="EDIT_REFERENCE"&&e.jsxs("div",{className:"my-4",children:[e.jsx("h4",{className:"font-bold mb-2 text-primary",children:"Seleccionar otra versión"}),d&&d.length>0&&(d==null?void 0:d.map(m=>e.jsxs("div",{className:"ml-3 flex align-items-center",children:[e.jsx(ae,{inputId:m.id.versionNumber.toString(),name:"version",value:m.id.versionNumber,checked:a===m.id.versionNumber,onChange:y=>{p(Number(y.target.value))}}),e.jsxs("label",{htmlFor:m.id.versionNumber.toString(),className:"ml-2",children:["Versión ",m.id.versionNumber,e.jsxs("span",{className:"text-gray-400 block",children:[J(m.finalPrice||0)," -",W.format(m.createdAt)]})]})]},m.id.versionNumber))),(d==null?void 0:d.length)===0&&e.jsx("p",{className:"ml-3 text-gray-400",children:"No hay cotizaciones aprobadas"})]}),e.jsxs("div",{className:"my-4",children:[e.jsx("h4",{className:"font-bold mb-2 text-primary",children:"Acción de la reserva"}),Object.entries(va).map(([m,y])=>e.jsxs("div",{className:"ml-3 flex align-items-center",children:[e.jsx(ae,{inputId:y,checked:n===m,value:m,onChange:r=>{x(r.target.value)}}),e.jsxs("label",{htmlFor:y,className:"ml-2",children:[m==="EDIT_REFERENCE"?"Editar la referencia":"Solo cancelar la reserva",e.jsx("span",{className:"text-gray-400 block",children:m==="EDIT_REFERENCE"?"Mantener la reserva actual y editar la referencia a la nueva versión seleccionada":"Cancelar la reserva actual sin reemplazarla por otra"})]})]},m))]}),e.jsxs("div",{className:"mt-10 md:flex gap-x-2 justify-end",children:[e.jsx(C,{disabled:(d==null?void 0:d.length)===0&&n==="EDIT_REFERENCE",onClick:N,label:"Aplicar cambios",className:"max-sm:w-full"}),e.jsx(C,{label:"Cancelar",outlined:!0,onClick:()=>t(void 0),className:"max-sm:w-full max-sm:mt-2"})]})]})]})},G=v.forwardRef(function({extraColumns:t,...i},h){const o=v.createRef();v.useImperativeHandle(h,()=>({exportCSV:()=>{var a;return(a=o.current)==null?void 0:a.exportCSV()}}));const[n,x]=v.useState();return e.jsxs(e.Fragment,{children:[e.jsx(ja,{selectedQuotation:n,setSelectedQuotation:x}),e.jsxs(ze,{...i,size:"small",pt:{wrapper:{className:"thin-scrollbar"},...i.pt},ref:o,className:B("max-sm:text-xs",i.className),children:[t==null?void 0:t.filter(({position:a})=>a==="start").map(({position:a,...p},d)=>e.jsx(l,{...p},d)),e.jsx(l,{selectionMode:"multiple"}),e.jsx(l,{field:"id",headerClassName:"min-w-24",className:"min-w-24",header:"Código",body:a=>e.jsxs("label",{children:["Q",a.id.quotationId,"-V",a.id.versionNumber]})}),e.jsx(l,{field:"name",header:"Nombre",filter:!0,editor:a=>a.rowData.status===g.APPROVED&&a.rowData.official?e.jsx("label",{children:a.rowData.name}):e.jsx(ua,{options:a}),headerClassName:"min-w-48",className:"min-w-48",showFilterMatchModes:!1,showFilterOperator:!1,showAddButton:!1,filterField:"name",filterPlaceholder:"Buscar por nombre",filterMenuClassName:"max-md:w-48",filterClear:a=>e.jsx(F,{...a}),filterApply:a=>e.jsx(L,{...a})}),e.jsx(l,{filter:!0,showFilterOperator:!1,showAddButton:!1,header:"Cliente",headerClassName:"min-w-64",body:a=>{if(!a.tripDetails)return e.jsx($,{message:"No se ha asignado un cliente"});const p=a.tripDetails.client;return e.jsx(pe,{client:p})},filterMatchMode:"custom",filterFunction:ca,filterType:"custom",filterField:"tripDetails.client.id",filterPlaceholder:"Buscar por cliente",showFilterMatchModes:!1,className:"min-w-64",filterClear:a=>e.jsx(F,{...a}),filterApply:a=>e.jsx(L,{...a}),filterElement:a=>e.jsx(na,{options:a})}),e.jsx(l,{field:"tripDetails.numberOfPeople",header:"Pasajeros",className:"min-w-24",headerClassName:"min-w-24",body:a=>{var p;return((p=a==null?void 0:a.tripDetails)==null?void 0:p.numberOfPeople)||0}}),e.jsx(l,{header:"Fecha de inicio",className:"min-w-32",headerClassName:"min-w-32",filterMenuStyle:{width:"16rem"},dataType:"date",filter:!0,showFilterOperator:!1,showAddButton:!1,showFilterMatchModes:!1,showApplyButton:!1,filterField:"tripDetails.startDate",filterClear:a=>e.jsx(F,{...a}),body:a=>a.tripDetails?W.format(a.tripDetails.startDate):e.jsx($,{message:"No se ha asignado una fecha de inicio"}),filterElement:a=>e.jsx(se,{options:a,placeholder:"Fecha de inicio"})}),e.jsx(l,{header:"Fecha fin",className:"min-w-32",headerClassName:"min-w-32",dataType:"date",filter:!0,showFilterOperator:!1,showAddButton:!1,showFilterMatchModes:!1,showApplyButton:!1,filterPlaceholder:"Buscar por fecha",filterField:"tripDetails.endDate",filterClear:a=>e.jsx(F,{...a}),body:a=>a.tripDetails?W.format(a.tripDetails.endDate):e.jsx($,{message:"No se ha asignado una fecha de fin"}),filterElement:a=>e.jsx(se,{options:a,placeholder:"Fecha de fin"})}),e.jsx(l,{header:"Representante",showFilterMatchModes:!1,showFilterOperator:!1,showAddButton:!1,filterMenuStyle:{width:"16rem"},filter:!0,filterMatchMode:"custom",headerClassName:"min-w-32",className:"min-w-56",filterType:"custom",filterField:"user.id",filterFunction:da,body:a=>e.jsx(xe,{user:a.user}),filterClear:a=>e.jsx(F,{...a}),filterApply:a=>e.jsx(L,{...a}),filterElement:a=>e.jsx(ia,{options:a})}),e.jsx(l,{field:"completionPercentage",header:"Avance",body:a=>e.jsx(qe,{value:a.completionPercentage,showValue:!1,className:"h-2"})}),e.jsx(l,{field:"finalPrice",header:"Precio",body:a=>J(a.finalPrice||0)}),e.jsx(l,{field:"status",header:"Status",filter:!0,filterMatchMode:"custom",filterFunction:oa,filterType:"custom",editor:a=>{if(a.rowData.status!==g.COMPLETED&&a.rowData.status!==g.APPROVED&&a.rowData.status!==g.CANCELATED){const{label:p,icon:d,severity:N}=D[a.rowData.status];return e.jsx(T,{value:p,icon:d,severity:N})}return e.jsx(fa,{options:a,setSelectedQuotation:x})},showFilterMatchModes:!1,showFilterOperator:!1,showAddButton:!1,body:a=>{const{label:p,icon:d,severity:N}=D[a.status];return e.jsx(T,{value:p,icon:d,severity:N})},filterClear:a=>e.jsx(F,{...a}),filterApply:a=>e.jsx(L,{...a}),filterElement:a=>e.jsx(la,{options:a})}),e.jsx(l,{field:"official",header:"Oficial",align:"center",editor:a=>a.rowData.official?e.jsx("i",{className:B("pi",{"pi-check-circle":a.rowData.official},{"pi-times-circle":!a.rowData.official})}):e.jsx(pa,{options:a}),body:a=>e.jsx("i",{className:B("pi",{"pi-check-circle":a.official},{"pi-times-circle":!a.official})})}),t==null?void 0:t.filter(({position:a})=>a==="end").map(({position:a,...p},d)=>e.jsx(l,{...p},d)),e.jsx(l,{header:"Acciones",body:a=>e.jsx(xa,{rowData:a,type:"principal"}),exportable:!1,className:"min-w-44"})]})]})}),ga=({currentRowExpanded:s,selectedQuotes:t,setSelectedQuotes:i,recentDuplicatedQuotes:h})=>{var M;const{handlePageChange:o,currentPage:n,first:x,limit:a,filters:p}=fe(5),[{name:d,clientsIds:N,startDate:w,endDate:b,representativesIds:P,status:m},y]=v.useState({}),{currentData:r,isLoading:c,isFetching:f,isError:_,refetch:z}=ue({page:n,limit:a,name:d,clientsIds:N,startDate:w,endDate:b,representativesIds:P,status:m,quotationId:s==null?void 0:s.id.quotationId},{skip:!n||!s});return v.useEffect(()=>{p&&y(be(p))},[p]),e.jsx(ve,{loadingComponent:e.jsx(me,{pt:{header:{className:"!bg-secondary"}},headerColumnGroup:Na,value:Array.from({length:(r==null?void 0:r.data.content.length)||a}),children:Array.from({length:14}).map((A,R)=>e.jsx(l,{body:()=>e.jsx(he,{shape:"rectangle",height:"2rem"})},R))}),isLoader:c||f,fallBackComponent:e.jsx(G,{value:[],showGridlines:!0,emptyMessage:e.jsx("div",{className:"p-4",children:e.jsx(je,{refetch:z,isFetching:f,isLoading:c,message:"No se pudieron cargar las versiones"})})}),error:_,children:e.jsx(G,{value:((M=r==null?void 0:r.data)==null?void 0:M.content)||[],scrollable:!0,emptyMessage:"No hay versiones disponibles",selectionMode:"checkbox",size:"small",tableStyle:{minWidth:"50rem"},editMode:"cell",selection:t,first:x,rows:a,onFilter:o,filters:p,loading:c||f,onSelectionChange:A=>i(A.value),className:"text-sm lg:text-[15px] p-5 overflow-x-hidden",rowClassName:A=>h.length>0&&h.some(R=>R.id.quotationId===A.id.quotationId&&R.id.versionNumber===A.id.versionNumber)?"bg-green-100":"",pt:{wrapper:{className:"invisible-x-scrollbar thin-y-scrollbar",footer:{className:"bg-white"}}},footer:e.jsx(Ue,{className:"w-full bg-transparent max-sm:text-xs",first:x,rows:a,totalRecords:r==null?void 0:r.data.total,onPageChange:o,template:"FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink",currentPageReportTemplate:"{currentPage} de {totalPages} páginas ({totalRecords} registros)"})})})},Na=e.jsx(ge,{children:e.jsxs(Ne,{children:[e.jsx(l,{header:"Código",headerClassName:"min-w-24"}),e.jsx(l,{header:"Nombre",filter:!0,headerClassName:"min-w-32"}),e.jsx(l,{header:"Cliente",filter:!0,headerClassName:"min-w-48"}),e.jsx(l,{header:"Pasajeros",headerClassName:"min-w-24"}),e.jsx(l,{header:"Fecha de inicio",filter:!0,headerClassName:"min-w-48"}),e.jsx(l,{header:"Fecha de fin",filter:!0,headerClassName:"min-w-32"}),e.jsx(l,{header:"Precio"}),e.jsx(l,{header:"Representante",headerClassName:"min-w-32",filter:!0}),e.jsx(l,{header:"Avance"}),e.jsx(l,{header:"Precio"}),e.jsx(l,{header:"Status",filter:!0}),e.jsx(l,{header:"Oficial",headerClassName:"min-w-24"}),e.jsx(l,{header:"Acciones"})]})}),{QUOTATION_PAGINATION:te}=Xe,re=[10,20,30],ba=()=>{const s=$e(),{currentQuotation:t}=K(u=>u.quotation),{handlePageChange:i,currentPage:h,first:o,limit:n,sortField:x,filters:a,handleSaveState:p}=fe(re[0],te),[{name:d,clientsIds:N,startDate:w,endDate:b,representativesIds:P,status:m},y]=v.useState({}),{currentData:r,isFetching:c,isLoading:f,isError:_,refetch:z}=Ke({page:h,limit:n,name:d,clientsIds:N,startDate:w,endDate:b,representativesIds:P,status:m,official:!0},{skip:!h}),[M,{isLoading:A}]=We(),[R,{isLoading:q}]=He(),[ye,X]=v.useState(void 0),[E,I]=v.useState([]),[S,Ce]=v.useState([]),[we,Ae]=v.useState(),Ee=async()=>{E.length&&(await M({ids:E.map(u=>u.id)}).unwrap(),Ce([...E]),I([]))},Pe=async()=>{if(!E.length)return;const u=E.filter(j=>!j.reservation);u.length&&(await R({ids:u.map(j=>j.id)}).unwrap().then(({data:j})=>{if(!t)return;const O=t.currentVersion.id;j.versionQuotationsDeleted.forEach(k=>{O.quotationId===k.id.quotationId&&O.versionNumber===k.id.versionNumber&&Ye.deleteCurrentQuotation().then(()=>{s(Ze(null))})})}),I([]))};v.useEffect(()=>{a&&y(be(a))},[a]);const U=e.jsxs("div",{className:"flex flex-wrap gap-2 p-2 items-center",children:[e.jsx("h4",{className:"m-0 text-sm md:text-lg",children:"Cotizaciones"}),e.jsx(H,{value:r!=null&&r.data.total?`Total: ${r==null?void 0:r.data.total}`:"Total: 0"}),S.length>0&&e.jsx(H,{value:`${S.length} ${S.length===1?"cotización duplicada":"cotizaciones duplicadas"}`,severity:"success",className:"text-white"})]});return e.jsxs(e.Fragment,{children:[e.jsx(aa,{className:"mt-10 mb-4",start:e.jsxs("div",{className:"flex gap-2",children:[e.jsx(C,{icon:"pi pi-trash",label:"Eliminar",loading:q,onClick:Pe,disabled:!E.length||A||q}),e.jsx(C,{icon:"pi pi-clone",label:"Duplicar",onClick:Ee,loading:A,severity:"secondary",disabled:!E.length||A||q})]})}),e.jsx(ve,{isLoader:f||c,loadingComponent:e.jsx(me,{pt:{header:{className:"!bg-secondary"}},showGridlines:!0,header:U,headerColumnGroup:ya,value:Array.from({length:(r==null?void 0:r.data.content.length)||n}),children:Array.from({length:14}).map((u,j)=>e.jsx(l,{body:()=>e.jsx(he,{shape:"rectangle",height:"1.5rem"})},j))}),fallBackComponent:e.jsx(G,{value:[],header:U,extraColumns:[{expander:u=>u.hasUnofficialVersions,position:"start"}],showGridlines:!0,emptyMessage:e.jsx("div",{className:"p-4",children:e.jsx(je,{refetch:z,isFetching:c,isLoading:f,message:"No se pudieron cargar las cotizaciones"})})}),error:_,children:e.jsx(G,{stateStorage:"custom",stateKey:te,customSaveState:p,value:(r==null?void 0:r.data.content)||[],expandedRows:ye,extraColumns:[{expander:u=>u.hasUnofficialVersions,position:"start"},{header:"Reserva relacionada",body:u=>{var Y,Z,ee;if(!((Y=u==null?void 0:u.reservation)!=null&&Y.id))return"Ninguno";const{icon:j,label:O,severity:k}=Je[(Z=u.reservation)==null?void 0:Z.status];return e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsxs("span",{children:["#",(ee=u.reservation)==null?void 0:ee.id]}),e.jsx(T,{icon:j,severity:k,value:O})]})},position:"end"}],first:o,rows:n,totalRecords:r==null?void 0:r.data.total,onPage:i,onFilter:i,rowsPerPageOptions:re,loading:f||c,lazy:!0,paginatorClassName:"max-sm:text-xs",size:"small",editMode:"cell",className:"text-sm lg:text-[15px] mt-5",sortMode:"single",dataKey:u=>`${u.id.quotationId}${u.id.versionNumber}`,sortField:x==null?void 0:x.sortField,sortOrder:x==null?void 0:x.sortOrder,filters:a,selectionMode:"checkbox",onRowExpand:u=>{const{id:j}=u.data;X({[`${j.quotationId}${j.versionNumber}`]:!0}),Ae(u.data)},onRowCollapse:()=>{X({})},selection:E,onSelectionChange:u=>{I(u.value)},header:U,rowClassName:u=>({"bg-green-100":S.length>0&&S.some(j=>j.id.quotationId===u.id.quotationId&&j.id.versionNumber===u.id.versionNumber)}),rowExpansionTemplate:()=>e.jsx(ga,{selectedQuotes:E,setSelectedQuotes:I,recentDuplicatedQuotes:S,currentRowExpanded:we}),tableStyle:{minWidth:"60rem"},paginatorTemplate:"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",paginator:!0,showGridlines:!0,filterDisplay:"menu",currentPageReportTemplate:"Mostrando del {first} al {last} de {totalRecords} cotizaciones",emptyMessage:"No hay cotizaciones"})})]})},ya=e.jsx(ge,{children:e.jsxs(Ne,{children:[e.jsx(l,{}),e.jsx(l,{header:"Código",headerClassName:"min-w-24"}),e.jsx(l,{header:"Nombre",filter:!0,headerClassName:"min-w-32"}),e.jsx(l,{header:"Cliente",filter:!0,headerClassName:"min-w-48"}),e.jsx(l,{header:"Pasajeros",headerClassName:"min-w-24"}),e.jsx(l,{header:"Fecha de inicio",filter:!0,headerClassName:"min-w-48"}),e.jsx(l,{header:"Fecha de fin",filter:!0,headerClassName:"min-w-32"}),e.jsx(l,{header:"Precio"}),e.jsx(l,{header:"Representante",headerClassName:"min-w-32",filter:!0}),e.jsx(l,{header:"Avance"}),e.jsx(l,{header:"Precio"}),e.jsx(l,{header:"Status",filter:!0}),e.jsx(l,{header:"Oficial",headerClassName:"min-w-24"}),e.jsx(l,{header:"Acciones"})]})}),Ma=()=>e.jsxs("div",{className:"bg-white p-10 rounded-lg shadow-md overflow-x-hidden",children:[e.jsxs("div",{className:"flex justify-end flex-wrap gap-y-5 space-x-4",children:[e.jsx(C,{label:"Exportar",className:"bg-transparent text-black border-[#D0D5DD]",icon:"pi pi-download"}),e.jsx(ea,{})]}),e.jsx(ba,{})]});export{Ma as default};
