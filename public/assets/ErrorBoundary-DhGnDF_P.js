import{j as e,B as E,H as g,r as a,S as f}from"./index-91IavEhX.js";const R=({refetch:t,isFetching:s,isLoading:r,message:n})=>e.jsxs("div",{className:"flex justify-center gap-x-2 items-center text-slate-500",children:[e.jsx("i",{className:"pi pi-exclamation-triangle"}),e.jsx("h5",{children:n}),e.jsx(E,{onClick:c=>{c.preventDefault(),t()},text:!0,icon:g({"pi pi-spin pi-spinner":s,"pi pi-refresh":!s}),className:"p-0 text-slate-500",disabled:r})]}),S=({children:t,fallBackComponent:s,resetCondition:r,error:n,isLoader:c,loadingComponent:l,skeleton:i,skeletonQuantity:o})=>{const[j,x]=a.useState(!1),[p,m]=a.useState(r),u=a.useCallback(()=>{r!==p&&(x(!1),m(r))},[r,p]);a.useEffect(()=>{u()},[u]);const h=a.useCallback(()=>{x(!0)},[]);return j||n?e.jsx(e.Fragment,{children:s}):e.jsx(v,{onError:h,children:c?l||e.jsx(e.Fragment,{children:o?Array.from({length:o}).map((B,d)=>e.jsx(f,{...i},d)):e.jsx(f,{...i})}):t})},v=({children:t,onError:s})=>{try{return e.jsx(e.Fragment,{children:t})}catch{return s(),null}};export{R as D,S as E};
