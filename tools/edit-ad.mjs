// Edita el crudo de la demo (grabado con el celular) y lo deja en formato publicitario.
// - recorta, corta y acelera tramos
// - pone los textos de la marca (subtítulos ASS)
// - agrega placa final
// - exporta vertical 1080x1920 (o lo que diga el plan)
//
// Uso:
//   node tools/edit-ad.mjs crudo.mp4 salida.mp4 [plan.json]
//   node tools/edit-ad.mjs crudo.mp4 --info
//
// El plan es JSON (tiempos en segundos):
// {
//   "size": [1080, 1920],
//   "crop": { "w": 720, "h": 1400, "x": 180, "y": 120 },   // opcional, en píxeles del crudo
//   "segments": [ { "start": 0, "end": 6, "speed": 1 },
//                 { "start": 18, "end": 52, "speed": 2 } ],
//   "captions": [ { "text": "Cargás el pedido", "from": 0.3, "to": 3.6 } ],
//   "brand": "HENRIS Gallery",
//   "endcard": { "text": "HENRIS Gallery", "sub": "pedido · obra · seña · saldo", "seconds": 2 }
// }
// start/end son sobre el crudo; from/to de los textos, sobre el video ya editado.
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const FFMPEG = "ffmpeg";
const FFPROBE = "ffprobe";
const FPS = 30;

const [, , entrada, salidaArg, planArg] = process.argv;
if (!entrada) {
  console.log("Uso: node tools/edit-ad.mjs crudo.mp4 salida.mp4 [plan.json]");
  process.exit(1);
}
if (!existsSync(entrada)) {
  console.error("No encuentro el archivo: " + entrada);
  process.exit(1);
}

function correr(args, etiqueta) {
  const r = spawnSync(FFMPEG, args, { encoding: "utf8" });
  if (r.status !== 0) {
    console.error("Fallo en " + etiqueta + ":\n" + (r.stderr || "").slice(-1200));
    process.exit(1);
  }
}

function info(archivo) {
  const r = spawnSync(FFPROBE, ["-v", "error", "-select_streams", "v:0",
    "-show_entries", "stream=width,height,r_frame_rate:format=duration",
    "-of", "json", archivo], { encoding: "utf8" });
  if (r.status !== 0) return null;
  const d = JSON.parse(r.stdout);
  const s = d.streams[0] || {};
  return { ancho: s.width, alto: s.height, fps: s.r_frame_rate, duracion: Number(d.format?.duration || 0) };
}

const meta = info(entrada);
if (salidaArg === "--info") {
  console.log(JSON.stringify(meta, null, 2));
  process.exit(0);
}

const salida = salidaArg || "demo-editada.mp4";
const plan = planArg && existsSync(planArg)
  ? JSON.parse(readFileSync(planArg, "utf8"))
  : {
      size: [1080, 1920],
      segments: [{ start: 0, end: Math.min(meta.duracion, 30), speed: 1 }],
      captions: [],
      endcard: { text: "HENRIS Gallery", sub: "", seconds: 2 }
    };

const [W, H] = plan.size || [1080, 1920];
const tmp = join(tmpdir(), "henris-edit-" + Date.now());
mkdirSync(tmp, { recursive: true });

// --- subtítulos en ASS (evita el infierno de escapes de drawtext) ---
const ASS_HEAD = `[Script Info]
ScriptType: v4.00+
PlayResX: ${W}
PlayResY: ${H}
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,Segoe UI,${Math.round(H * 0.042)},&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,2,2,2,60,60,${Math.round(H * 0.14)},1
Style: Brand,Segoe UI,${Math.round(H * 0.017)},&HB3FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,2,0,1,0,0,8,60,60,${Math.round(H * 0.05)},1
Style: Big,Segoe UI,${Math.round(H * 0.052)},&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,-1,0,0,0,100,100,2,0,1,0,0,5,60,60,0,1
Style: Sub,Segoe UI,${Math.round(H * 0.021)},&HB3FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,2,0,1,0,0,5,60,60,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

function reloj(seg) {
  const s = Math.max(0, seg);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = (s % 60).toFixed(2).padStart(5, "0");
  return h + ":" + String(m).padStart(2, "0") + ":" + ss;
}

function linea(desde, hasta, estilo, texto) {
  return "Dialogue: 0," + reloj(desde) + "," + reloj(hasta) + "," + estilo + ",,0,0,0,," + texto;
}

function escribirAss(archivo, eventos) {
  writeFileSync(archivo, ASS_HEAD + eventos.join("\n") + "\n", "utf8");
  return archivo.replace(/\\/g, "/").replace(/:/g, "\\:");
}

console.log("crudo: " + meta.ancho + "x" + meta.alto + " · " + meta.duracion.toFixed(1) + " s");

// 1) tramos
const base = [];
plan.segments.forEach((s, i) => {
  const fin = Math.min(s.end ?? meta.duracion, meta.duracion);
  const dur = Math.max(0.1, fin - s.start);
  const vel = s.speed && s.speed > 0 ? s.speed : 1;
  const recorte = plan.crop
    ? "crop=" + plan.crop.w + ":" + plan.crop.h + ":" + plan.crop.x + ":" + plan.crop.y + ","
    : "";
  const out = join(tmp, "t" + i + ".mp4");
  correr(["-y", "-ss", String(s.start), "-t", String(dur), "-i", entrada,
    "-vf", recorte + "setpts=(PTS-STARTPTS)/" + vel + ",fps=" + FPS,
    "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", out], "tramo " + (i + 1));
  base.push(out);
  console.log("  tramo " + (i + 1) + ": " + s.start + "→" + fin + " s · " + vel + "x");
});

// 2) unir
let actual;
if (base.length === 1) {
  actual = base[0];
} else {
  const lista = join(tmp, "lista.txt");
  writeFileSync(lista, base.map((p) => "file '" + p.replace(/\\/g, "/") + "'").join("\n") + "\n");
  actual = join(tmp, "unido.mp4");
  correr(["-y", "-f", "concat", "-safe", "0", "-i", lista, "-c", "copy", actual], "unión de tramos");
}

// 3) encuadre + textos
const eventos = [];
if (plan.brand) eventos.push(linea(0, 3599, "Brand", plan.brand));
(plan.captions || []).forEach((c) => eventos.push(linea(c.from, c.to, "Cap", c.text)));
const ass = escribirAss(join(tmp, "textos.ass"), eventos);

const conTexto = join(tmp, "texto.mp4");
correr(["-y", "-i", actual,
  "-vf", "scale=" + W + ":" + H + ":force_original_aspect_ratio=decrease," +
    "pad=" + W + ":" + H + ":(ow-iw)/2:(oh-ih)/2:color=black,setsar=1," +
    "subtitles='" + ass + "'",
  "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "20", conTexto], "encuadre y textos");

// 4) placa final
let final = conTexto;
if (plan.endcard) {
  const seg = plan.endcard.seconds || 2;
  const ev = [linea(0, seg, "Big", plan.endcard.text || "")];
  if (plan.endcard.sub) ev.push(linea(0, seg, "Sub", plan.endcard.sub));
  const assPlaca = escribirAss(join(tmp, "placa.ass"), ev);
  const placa = join(tmp, "placa.mp4");
  correr(["-y", "-f", "lavfi", "-i", "color=c=black:s=" + W + "x" + H + ":d=" + seg + ":r=" + FPS,
    "-vf", "setsar=1,subtitles='" + assPlaca + "'", "-an", "-t", String(seg),
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", placa], "placa final");

  const lista2 = join(tmp, "final.txt");
  writeFileSync(lista2, [conTexto, placa].map((p) => "file '" + p.replace(/\\/g, "/") + "'").join("\n") + "\n");
  final = join(tmp, "con-placa.mp4");
  correr(["-y", "-f", "concat", "-safe", "0", "-i", lista2, "-c", "copy", final], "cierre");
}

// 5) salida
correr(["-y", "-i", final, "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "20",
  "-pix_fmt", "yuv420p", "-movflags", "+faststart", salida], "exportación");

const fin = info(salida);
console.log("ok · " + fin.ancho + "x" + fin.alto + " · " + fin.duracion.toFixed(1) + " s → " + salida);
rmSync(tmp, { recursive: true, force: true });
