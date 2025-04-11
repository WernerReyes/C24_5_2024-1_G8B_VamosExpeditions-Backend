import{u as g,a as x,b as u,j as e,I as b,P as p,B as f,c as h,l as N}from"./index-Id9fuaH4.js";import{u as j,C as n,t as w}from"./zod-DGae_hZc.js";const{DASHBOARD:v}=h.private,S=()=>{const{control:s,handleSubmit:o,formState:{errors:i}}=j({resolver:w(N.getSchema)}),c=g(),{init:m}=x(),[r,{isLoading:l}]=u(),d=async t=>{await r(t).unwrap().then(({data:a})=>{c(v),m(a.expiresAt)})};return e.jsx("section",{"aria-labelledby":"login-heading",className:"bg-login bg-no-repeat bg-cover bg-center w-screen min-h-screen flex justify-center items-center",children:e.jsxs("div",{className:"mx-10 w-80 bg-secondary px-8 py-16 rounded-lg shadow-lg sm:w-[25rem]",children:[e.jsx("img",{src:"/images/logo.webp",alt:"Logo",className:"mx-auto"}),e.jsx("h1",{id:"login-heading",className:"text-2xl mt-7 font-bold text-center mb-1 text-tertiary",children:"Bienvenido de nuevo"}),e.jsx("p",{className:"text-center font-light text-sm mb-6",children:"Ingresa tus credenciales para acceder a tu cuenta"}),e.jsxs("form",{className:"flex flex-col",onSubmit:o(d),noValidate:!0,children:[e.jsx(n,{control:s,name:"email",defaultValue:"test1@google.com",render:({field:t,fieldState:{error:a}})=>e.jsx(b,{label:{htmlFor:"email",text:"Correo Electrónico",className:"text-tertiary font-bold mb-2"},small:{text:a==null?void 0:a.message,className:"text-red-500"},iconField:!0,iconFieldProps:{iconPosition:"left"},iconProps:{className:"pi pi-envelope"},id:"email",className:"block w-full",placeholder:"Correo Electrónico",invalid:!!a,...t})}),e.jsx("div",{className:"mt-5",children:e.jsx(n,{control:s,name:"password",defaultValue:"aLTEC1234@",render:({field:t,fieldState:{error:a}})=>e.jsx(p,{label:{htmlFor:"password",text:"Contraseña",className:"text-tertiary font-bold"},small:{text:a==null?void 0:a.message,className:"text-red-500"},feedback:!1,className:"w-full",inputClassName:"mt-2 block w-64 sm:w-[21rem]",placeholder:"Contraseña",toggleMask:!0,invalid:!!a,...t})})}),e.jsx(f,{type:"submit",label:l?"Validando...":"Iniciar Sesión",disabled:Object.keys(i).length>0||l,className:"w-full mt-8"})]})]})})};export{S as default};
