// Genera el MP4 del corte de demo sin que haya que grabar la pantalla.
// Usa Chrome headless + screencast por CDP y ffmpeg para el encode.
// Uso: node tools/record-ad.mjs [url] [salida]
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync, existsSync, copyFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const URL_CORTE = process.argv[2] || "http://localhost:8791/staging/henris-ad-20261031/?loop=0";
const SALIDA = process.argv[3] || "staging/henris-ad-20261031/henris-demo.mp4";
const ANCHO = 1280, ALTO = 720, FPS = 30, DURACION_MS = 14200;

const CHROME = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
].find(existsSync);
if (!CHROME) throw new Error("No encuentro Chrome");

const FFMPEG = "ffmpeg";
const perfil = join(tmpdir(), "henris-ad-perfil-" + Date.now());
const frames = join(tmpdir(), "henris-ad-frames-" + Date.now());
mkdirSync(frames, { recursive: true });

const chrome = spawn(CHROME, [
  "--headless=new",
  "--remote-debugging-port=9333",
  "--user-data-dir=" + perfil,
  "--window-size=" + ANCHO + "," + ALTO,
  "--hide-scrollbars",
  "--force-device-scale-factor=1",
  "--no-first-run",
  "--no-default-browser-check",
  "--disable-extensions",
  "--mute-audio",
  "about:blank"
], { stdio: "ignore" });

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

async function esperarCdp() {
  for (let i = 0; i < 100; i++) {
    try {
      const r = await fetch("http://127.0.0.1:9333/json/version");
      if (r.ok) return (await r.json()).webSocketDebuggerUrl;
    } catch {}
    await dormir(150);
  }
  throw new Error("Chrome no levanto el puerto de depuracion");
}

const wsUrl = await esperarCdp();
const ws = new WebSocket(wsUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

let id = 0;
const pendientes = new Map();
const oyentes = [];
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pendientes.has(msg.id)) {
    const { res, rej } = pendientes.get(msg.id);
    pendientes.delete(msg.id);
    msg.error ? rej(new Error(msg.error.message)) : res(msg.result);
  } else if (msg.method) {
    oyentes.forEach((f) => f(msg));
  }
};

function enviar(method, params = {}, sessionId) {
  const n = ++id;
  ws.send(JSON.stringify({ id: n, method, params, ...(sessionId ? { sessionId } : {}) }));
  return new Promise((res, rej) => pendientes.set(n, { res, rej }));
}

const { targetId } = await enviar("Target.createTarget", { url: "about:blank" });
const { sessionId } = await enviar("Target.attachToTarget", { targetId, flatten: true });
const S = (m, p) => enviar(m, p, sessionId);

await S("Page.enable");
await S("Emulation.setDeviceMetricsOverride", { width: ANCHO, height: ALTO, deviceScaleFactor: 1, mobile: false });
await S("Page.setWebLifecycleState", { state: "active" });

const cargado = new Promise((res) => {
  oyentes.push((m) => { if (m.method === "Page.loadEventFired") res(); });
});
await S("Page.navigate", { url: URL_CORTE });
await Promise.race([cargado, dormir(15000)]);
await dormir(300);

const cuadros = [];
await S("Page.startScreencast", {
  format: "jpeg", quality: 92, maxWidth: ANCHO, maxHeight: ALTO, everyNthFrame: 1
});
oyentes.push((m) => {
  if (m.method !== "Page.screencastFrame") return;
  const { data, sessionId: fsid, metadata } = m.params;
  const n = cuadros.length + 1;
  const archivo = join(frames, String(n).padStart(5, "0") + ".jpg");
  writeFileSync(archivo, Buffer.from(data, "base64"));
  cuadros.push({ archivo, t: metadata.timestamp });
  enviar("Page.screencastFrameAck", { sessionId: fsid }, sessionId).catch(() => {});
});

await dormir(DURACION_MS);
await S("Page.stopScreencast");
ws.close();
chrome.kill();

if (cuadros.length < 10) throw new Error("Muy pocos cuadros: " + cuadros.length);

// Reconstruye la secuencia a 30 fps: para cada instante, el ultimo cuadro pintado.
const t0 = cuadros[0].t;
const total = Math.max(1, Math.round(((cuadros.at(-1).t - t0) * 1000) / (1000 / FPS))) + 45; // +1,5 s de cierre quieto
const seq = join(frames, "seq");
mkdirSync(seq, { recursive: true });
let j = 0;
for (let i = 0; i < total; i++) {
  const t = t0 + i / FPS;
  while (j + 1 < cuadros.length && cuadros[j + 1].t <= t) j++;
  copyFileSync(cuadros[j].archivo, join(seq, String(i + 1).padStart(5, "0") + ".jpg"));
}

const args = [
  "-y", "-framerate", String(FPS), "-i", join(seq, "%05d.jpg"),
  "-vf", "scale=" + ANCHO + ":" + ALTO + ":flags=lanczos,format=yuv420p",
  "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-movflags", "+faststart",
  "-an", SALIDA
];
await new Promise((res, rej) => {
  const p = spawn(FFMPEG, args, { stdio: ["ignore", "ignore", "pipe"] });
  let err = "";
  p.stderr.on("data", (d) => { err += d; });
  p.on("close", (code) => code === 0 ? res() : rej(new Error("ffmpeg fallo:\n" + err.slice(-800))));
});

rmSync(frames, { recursive: true, force: true });
rmSync(perfil, { recursive: true, force: true });
console.log("ok - " + cuadros.length + " cuadros - " + (total / FPS).toFixed(1) + " s -> " + SALIDA);
