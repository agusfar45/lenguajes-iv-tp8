export function guardar(blob, nombre) {
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombre;
  document.body.append(enlace);
  enlace.click();
  enlace.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function rango(inicio, fin, total) {
  if (inicio === '' || fin === '') return null;
  const a = Number(inicio), b = Number(fin);
  return Number.isInteger(a) && Number.isInteger(b) && a >= 0 && a <= b && b <= total
    ? [a,b] : null;
}
