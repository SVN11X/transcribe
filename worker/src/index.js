// Servidor de transcripción para "Preparar un video para una IA".
// Recibe un trozo de audio en formato WAV, lo transcribe con Whisper large v3 turbo
// y devuelve el texto con sus tiempos. El modelo nunca se descarga en el computador de quien usa la página.
//
// Usa dos servicios gratis, uno después del otro.
// Primero Cloudflare Workers AI, unos 200 minutos de audio al día.
// Cuando se acaba, sigue con Groq si agregaste su clave, unos 480 minutos más al día.
//
// Cómo publicarlo gratis, sin instalar nada.
// 1. Crea una cuenta en dash.cloudflare.com.
// 2. Entra a Workers & Pages, luego Create, luego Start with Hello World.
//    Ponle un nombre, por ejemplo transcribir, y pulsa Deploy.
// 3. Pulsa Edit code, borra lo que aparece, pega todo este archivo y pulsa Deploy.
// 4. En Settings, sección Bindings, pulsa Add binding, elige Workers AI y ponle el nombre AI.
// 5. Copia la dirección del Worker (termina en workers.dev) y pégala en la página.
//
// Para sumar Groq, opcional.
// 6. Crea una cuenta gratis en console.groq.com, entra a API Keys y crea una clave.
// 7. En Settings del Worker, sección Runtime variables and secrets, pulsa Add variable,
//    elige el tipo Secret, ponle el nombre GROQ_API_KEY, pega la clave y pulsa Deploy.

// Direcciones de las páginas que pueden usar este servidor, sin barra al final.
const PAGINAS_PERMITIDAS = [
  'https://svn11x.github.io'
];

// Clave opcional. Si pones una, la página tiene que enviarla en el campo Clave.
const CLAVE = '';

const MODELO_CLOUDFLARE = '@cf/openai/whisper-large-v3-turbo';
const MODELO_GROQ = 'whisper-large-v3-turbo';
const MAXIMO_POR_TROZO = 4 * 1024 * 1024;

// si la cuota de Cloudflare se acabó, no se vuelve a intentar hasta la medianoche UTC
let cloudflareAgotadoHasta = 0;

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const permitido = PAGINAS_PERMITIDAS.includes(origin);
    const cors = {
      'Access-Control-Allow-Origin': permitido ? origin : PAGINAS_PERMITIDAS[0],
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Clave',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin'
    };

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (!permitido) return responder({ error: 'pagina-no-permitida' }, 403, cors);
    if (CLAVE && request.headers.get('X-Clave') !== CLAVE) return responder({ error: 'clave-incorrecta' }, 401, cors);

    const hayCloudflare = !!env.AI;
    const hayGroq = !!env.GROQ_API_KEY;
    if (!hayCloudflare && !hayGroq) return responder({ error: 'falta-enlace-ai' }, 500, cors);

    // prueba de conexión desde la página
    if (request.method === 'GET') {
      const servicios = [];
      if (hayCloudflare) servicios.push('cloudflare');
      if (hayGroq) servicios.push('groq');
      return responder({ ok: true, servicios }, 200, cors);
    }
    if (request.method !== 'POST') return responder({ error: 'metodo-no-permitido' }, 405, cors);

    const audio = new Uint8Array(await request.arrayBuffer());
    if (!audio.length) return responder({ error: 'sin-audio' }, 400, cors);
    if (audio.length > MAXIMO_POR_TROZO) return responder({ error: 'trozo-muy-grande' }, 413, cors);
    const idioma = new URL(request.url).searchParams.get('idioma') || '';

    let detalle = '';
    let cloudflareAgotado = !hayCloudflare || Date.now() < cloudflareAgotadoHasta;
    let groqAgotado = false;

    // 1. Cloudflare
    if (!cloudflareAgotado) {
      try {
        const entrada = { audio: aBase64(audio), task: 'transcribe', vad_filter: true };
        if (idioma) entrada.language = idioma;
        const r = await env.AI.run(MODELO_CLOUDFLARE, entrada);
        return listo(r, 'cloudflare', cors);
      } catch (e) {
        detalle = String((e && e.message) || e);
        if (/4006|neurons|allocation|quota/i.test(detalle)) {
          cloudflareAgotadoHasta = proximaMedianocheUTC();
          cloudflareAgotado = true;
        }
      }
    }

    // 2. Groq, si hay clave
    if (hayGroq) {
      try {
        const r = await transcribirConGroq(audio, idioma, env.GROQ_API_KEY);
        return listo(r, 'groq', cors);
      } catch (e) {
        if (e.ocupado) return responder({ error: 'ocupado', esperar: e.esperar }, 429, cors);
        groqAgotado = !!e.cuota;
        detalle = String(e.message || detalle).slice(0, 300);
      }
    }

    const todoAgotado = cloudflareAgotado && (!hayGroq || groqAgotado);
    return responder({ error: todoAgotado ? 'cuota-agotada' : 'fallo-modelo', detalle }, todoAgotado ? 429 : 502, cors);
  }
};

async function transcribirConGroq(audio, idioma, clave) {
  const datos = new FormData();
  datos.append('file', new Blob([audio], { type: 'audio/wav' }), 'trozo.wav');
  datos.append('model', MODELO_GROQ);
  datos.append('response_format', 'verbose_json');
  datos.append('temperature', '0');
  if (idioma) datos.append('language', idioma);
  const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + clave },
    body: datos
  });
  if (res.status === 429) {
    const texto = await res.text();
    const esperar = Math.max(1, Math.ceil(parseFloat(res.headers.get('retry-after') || '20')));
    const e = new Error(texto);
    // límite del día: se acabó. Límite por minuto u hora: hay que esperar un poco
    if (/per day|\(ASD\)|\(RPD\)/i.test(texto)) e.cuota = true; else { e.ocupado = true; e.esperar = esperar; }
    throw e;
  }
  if (!res.ok) throw new Error('Groq respondió ' + res.status + '. ' + (await res.text()).slice(0, 300));
  return res.json();
}

function listo(r, servicio, cors) {
  const segmentos = (r.segments || []).map(s => ({ start: s.start, end: s.end, text: s.text }));
  return responder({ text: r.text || '', segments: segmentos, servicio }, 200, cors);
}

function proximaMedianocheUTC() {
  const d = new Date();
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1);
}

function responder(datos, estado, cors) {
  return new Response(JSON.stringify(datos), {
    status: estado,
    headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' }
  });
}

function aBase64(bytes) {
  if (typeof bytes.toBase64 === 'function') return bytes.toBase64();
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  }
  return btoa(s);
}