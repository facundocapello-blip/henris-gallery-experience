import { cents, totals, CHANNELS } from './domain.js';
export const KEY = 'henris-experience-v2';
export const catalog = [{id:'ART-001', title:'Horizonte', unique:true},{id:'ART-002',title:'Luz de tarde',unique:true}];
export function seed(){return {id:'HG-001',customer:'Cliente demo',channel:'Local',currency:'USD',operation:'Nuevo',items:[{id:'item-1',pedidoId:'HG-001',catalogId:'ART-001',title:'Horizonte',unique:true,quantity:1,price:80000},{id:'item-2',pedidoId:'HG-001',catalogId:'ART-002',title:'Luz de tarde',unique:true,quantity:1,price:40000}],payments:[{id:'initial',pedidoId:'HG-001',amount:30000,method:'Transferencia',date:'2026-10-15T12:00:00Z'}]};}
export function payment(order,value,method,token){
 if(order.payments.some(p=>p.id===token)) return order;
 if(!['Transferencia','Efectivo','Tarjeta'].includes(method)) throw Error('Elegí un medio de pago válido.');
 const amount=cents(value); if(amount>totals(order).balance) throw Error('El pago no puede superar el saldo.');
 return {...order,payments:[...order.payments,{id:token,pedidoId:order.id,amount,method,date:new Date().toISOString()}]};
}
export function undo(order){return {...order,payments:order.payments.at(-1)?.id==='initial'?order.payments:order.payments.slice(0,-1)};}
export function validate(order){
 if(!order || typeof order.id!=='string'||!order.id||typeof order.customer!=='string'||!order.customer.trim()||order.customer.length>120||!CHANNELS.includes(order.channel)||!['USD','ARS'].includes(order.currency)||!['Nuevo','Confirmado','En producción'].includes(order.operation)||!Array.isArray(order.items)||order.items.length>50||!Array.isArray(order.payments)||order.payments.length>1000) throw Error('Pedido inválido.');
 const ids=new Set();
 for(const i of order.items){if(!i.id||ids.has(i.id)||i.pedidoId!==order.id||typeof i.title!=='string'||!i.title.trim()||i.title.length>120||!Number.isInteger(i.quantity)||i.quantity<1||i.quantity>10000||(i.unique&&i.quantity!==1)||!Number.isSafeInteger(i.price)||i.price<=0)throw Error('Revisá la obra, cantidad y precio. Las piezas únicas admiten una unidad.');ids.add(i.id);}
 for(const p of order.payments){if(!p.id||ids.has(p.id)||p.pedidoId!==order.id||!Number.isSafeInteger(p.amount)||p.amount<=0||!['Transferencia','Efectivo','Tarjeta'].includes(p.method)||!Number.isFinite(Date.parse(p.date)))throw Error('Pago inválido.');ids.add(p.id);}
 const t=totals(order);if(!Number.isSafeInteger(t.total)||t.total>10000000000||t.balance<0)throw Error('El total no puede ser menor que lo ya pagado ni superar el límite demo.');return order;
}
export function restore(raw){return raw===null?seed():validate(JSON.parse(raw));}
