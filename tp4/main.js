import {guardar,rango} from './blob.js';
const get = id => document.getElementById(id);
let blob, fragment;
get('create').onclick = () => {
  blob = new Blob([get('content').value], {type:'text/plain;charset=utf-8'});
  fragment = undefined;
  get('piece').textContent = 'El recorte aparecerá aquí.';
  get('info').textContent = blob.size + ' bytes · ' + blob.type;
  get('slice').disabled = get('download').disabled = false;
  get('fragment').disabled = true;
};
get('download').onclick = () => guardar(blob,'contenido.txt');
get('slice').onclick = async () => {
  const tramo = rango(get('start').value,get('end').value,blob.size);
  fragment = tramo ? blob.slice(...tramo,blob.type) : undefined;
  get('fragment').disabled = !fragment;
  get('piece').textContent = fragment ? fragment.size + ' bytes: ' + await fragment.text()
    : 'Ingresá dos enteros dentro del tamaño del Blob, en orden.';
};
get('fragment').onclick = () => guardar(fragment,'recorte.txt');
