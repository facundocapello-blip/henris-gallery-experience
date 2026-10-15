import {test} from 'node:test';
import assert from 'node:assert/strict';
import {seed,payment,undo,restore,validate} from '../experience-domain.js';
import {totals} from '../domain.js';
test('USD 400, idempotencia y deshacer exacto',()=>{const o=seed();assert.deepEqual(totals(o),{total:120000,paid:30000,balance:90000,status:'Parcial'});const next=payment(o,'400','Transferencia','token');assert.equal(totals(next).balance,50000);assert.equal(totals(next).paid,70000);assert.deepEqual(payment(next,'400','Transferencia','token'),next);assert.deepEqual(undo(next),o);});
test('rechaza pagos inválidos y saldar no modifica el origen',()=>{const o=seed();for(const x of ['',0,-1,'Infinity','NaN','900.01','1.001'])assert.throws(()=>payment(o,x,'Transferencia','x'));assert.equal(totals(payment(o,'900','Efectivo','ok')).status,'Pagado');assert.equal(totals(o).balance,90000);});
test('recuperación valida relaciones, monedas y piezas únicas',()=>{const o=seed();assert.deepEqual(restore(JSON.stringify(o)),o);assert.throws(()=>restore('{}'));assert.throws(()=>validate({...o,currency:'EUR'}));o.items[0].quantity=2;assert.throws(()=>validate(o));});
