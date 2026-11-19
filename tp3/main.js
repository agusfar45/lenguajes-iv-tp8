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
