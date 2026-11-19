const get = id => document.getElementById(id);
const field = get('file');
const preview = get('preview');
let currentUrl;
let version = 0;
get('select').addEventListener('click', () => field.click());
field.addEventListener('change', async () => {
  const selection = ++version;
  const file = field.files[0];
  if (currentUrl) URL.revokeObjectURL(currentUrl);
  preview.hidden = get('details').hidden = true;
  get('file-state').textContent = '';
  if (!file) return;
  if (!/^(image\/(png|jpeg|webp|gif|bmp|avif))$/.test(file.type)
      && !/\.img$/i.test(file.name)) {
    get('file-state').textContent = 'Seleccioná un archivo de imagen compatible.';
    field.value = '';
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    get('file-state').textContent = 'La imagen debe ocupar hasta 10 MB.';
    field.value = '';
    return;
  }
  const image = new Image();
  const url = URL.createObjectURL(file);
  image.src = url;
  try {
    await image.decode();
    if (selection !== version) { URL.revokeObjectURL(url); return; }
    currentUrl = url;
    preview.src = url;
    preview.hidden = get('details').hidden = false;
    get('name').textContent = file.name;
    get('type').textContent = file.type || 'Imagen con tipo MIME sin informar';
    get('size').textContent = file.size + ' bytes';
    get('file-state').textContent = 'Imagen cargada.';
  } catch {
    URL.revokeObjectURL(url);
    if (selection !== version) return;
    get('file-state').textContent = 'El contenido del archivo no se pudo leer como imagen.';
    field.value = '';
  }
});
function locate() {
  const status = get('geo-state');
  get('coordinates').hidden = true;
  if (!window.isSecureContext || !navigator.geolocation) {
    status.textContent = 'La ubicación requiere HTTPS o localhost.';
    return;
  }
  status.textContent = 'Solicitando tu permiso…';
  navigator.geolocation.getCurrentPosition(({coords}) => {
    status.textContent = 'Ubicación obtenida.';
    get('coordinates').textContent =
      'Latitud: ' + coords.latitude.toFixed(6) + '\nLongitud: ' + coords.longitude.toFixed(6) +
      '\nPrecisión aproximada: ' + Math.round(coords.accuracy) + ' m';
    get('coordinates').hidden = false;
  }, error => {
    status.textContent = {1:'El permiso de ubicación fue denegado.',
      2:'La ubicación no está disponible.', 3:'Se agotó el tiempo de espera.'}[error.code]
      || 'No se pudo obtener la ubicación.';
  }, {timeout: 10000, maximumAge: 0, enableHighAccuracy: true});
}
get('geo').addEventListener('click', locate);
locate();
