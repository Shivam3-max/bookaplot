"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Property Flyer Maker — everything runs in the browser. The photo is read
 * with FileReader into a data URL and drawn to a canvas; it is never uploaded
 * anywhere, which is the whole point of the tool.
 */

const FORMATS = {
  square: { w: 1080, h: 1080, label: "Square", note: "WhatsApp / Instagram post" },
  portrait: { w: 1080, h: 1350, label: "Portrait", note: "Instagram feed" },
  story: { w: 1080, h: 1920, label: "Story", note: "WhatsApp status / Reels" },
} as const;
type FormatKey = keyof typeof FORMATS;

const THEMES = {
  gold: { accent: "#b99657", bar: "#1c1f24", label: "Gold on charcoal" },
  green: { accent: "#e8c877", bar: "#14372c", label: "Gold on forest" },
  navy: { accent: "#d8b46a", bar: "#16233d", label: "Gold on navy" },
  crimson: { accent: "#f0d9a8", bar: "#4a1720", label: "Sand on maroon" },
} as const;
type ThemeKey = keyof typeof THEMES;

interface Fields {
  badge: string;
  title: string;
  location: string;
  price: string;
  detailA: string;
  detailB: string;
  company: string;
  phone: string;
  address: string;
}

const DEFAULTS: Fields = {
  badge: "FOR SALE",
  title: "3 BHK Independent Floor",
  location: "Sector 82, Mohali",
  price: "₹1.45 Cr",
  detailA: "1,650 sq ft",
  detailB: "East facing",
  company: "Your Company Name",
  phone: "+91 98765 43210",
  address: "Shop 12, VIP Road, Zirakpur",
};

export default function FlyerMaker() {
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
  const [photoName, setPhotoName] = useState("");
  const [format, setFormat] = useState<FormatKey>("square");
  const [theme, setTheme] = useState<ThemeKey>("gold");
  const [f, setF] = useState<Fields>(DEFAULTS);
  const [fontsReady, setFontsReady] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let alive = true;
    document.fonts.ready.then(() => { if (alive) setFontsReady(true); });
    return () => { alive = false; };
  }, []);

  const set = (k: keyof Fields, v: string) => setF((p) => ({ ...p, [k]: v }));

  const onFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("That file is not an image."); return; }
    if (file.size > 12 * 1024 * 1024) { setError("Please use an image under 12 MB."); return; }
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => { setPhoto(img); setPhotoName(file.name); };
      img.onerror = () => setError("That image could not be read.");
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w, h } = FORMATS[format];
    canvas.width = w;
    canvas.height = h;
    const t = THEMES[theme];
    const barH = Math.round(h * 0.145);
    const photoH = h - barH;

    // ---- photo area -------------------------------------------------
    ctx.fillStyle = "#e9eef3";
    ctx.fillRect(0, 0, w, photoH);

    if (photo) {
      const scale = Math.max(w / photo.width, photoH / photo.height);
      const dw = photo.width * scale;
      const dh = photo.height * scale;
      ctx.drawImage(photo, (w - dw) / 2, (photoH - dh) / 2, dw, dh);
    } else {
      ctx.fillStyle = "#aab6c2";
      ctx.textAlign = "center";
      ctx.font = `600 ${Math.round(w * 0.032)}px Manrope, system-ui, sans-serif`;
      ctx.fillText("Upload a property photo", w / 2, photoH / 2);
      ctx.textAlign = "left";
    }

    // scrim so the text stays readable over any photo
    const scrimTop = photoH * 0.42;
    const g = ctx.createLinearGradient(0, scrimTop, 0, photoH);
    g.addColorStop(0, "rgba(12,14,17,0)");
    g.addColorStop(0.55, "rgba(12,14,17,0.62)");
    g.addColorStop(1, "rgba(12,14,17,0.9)");
    ctx.fillStyle = g;
    ctx.fillRect(0, scrimTop, w, photoH - scrimTop);

    const pad = Math.round(w * 0.062);

    // ---- badge ------------------------------------------------------
    if (f.badge.trim()) {
      const fs = Math.round(w * 0.026);
      ctx.font = `700 ${fs}px Manrope, system-ui, sans-serif`;
      const text = f.badge.trim().toUpperCase();
      const tw = ctx.measureText(text).width;
      const bw = tw + fs * 1.8;
      const bh = fs * 2.3;
      ctx.fillStyle = t.accent;
      roundRect(ctx, pad, pad, bw, bh, bh / 2);
      ctx.fill();
      ctx.fillStyle = "#15181c";
      ctx.textBaseline = "middle";
      ctx.fillText(text, pad + fs * 0.9, pad + bh / 2 + 1);
      ctx.textBaseline = "alphabetic";
    }

    // ---- price chip (top right) -------------------------------------
    if (f.price.trim()) {
      const fs = Math.round(w * 0.042);
      ctx.font = `900 ${fs}px Satoshi, "Helvetica Neue", sans-serif`;
      const text = f.price.trim();
      const tw = ctx.measureText(text).width;
      const bw = tw + fs * 1.1;
      const bh = fs * 1.75;
      ctx.fillStyle = "rgba(12,14,17,0.82)";
      roundRect(ctx, w - pad - bw, pad, bw, bh, bh * 0.28);
      ctx.fill();
      ctx.fillStyle = t.accent;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, w - pad - bw / 2, pad + bh / 2 + 1);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
    }

    // ---- title + location + details (bottom of photo) ---------------
    let y = photoH - pad;

    const detailParts = [f.detailA, f.detailB].map((s) => s.trim()).filter(Boolean);
    if (detailParts.length) {
      const fs = Math.round(w * 0.028);
      ctx.font = `600 ${fs}px Manrope, system-ui, sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.82)";
      ctx.fillText(detailParts.join("   ·   "), pad, y);
      y -= fs * 1.9;
    }

    if (f.location.trim()) {
      const fs = Math.round(w * 0.031);
      ctx.font = `700 ${fs}px Manrope, system-ui, sans-serif`;
      ctx.fillStyle = t.accent;
      ctx.fillText(f.location.trim(), pad, y);
      y -= fs * 1.75;
    }

    if (f.title.trim()) {
      const fs = Math.round(w * 0.062);
      ctx.font = `900 ${fs}px Satoshi, "Helvetica Neue", sans-serif`;
      ctx.fillStyle = "#fff";
      // the taller formats have room for a third line before the scrim runs out
      const maxLines = format === "square" ? 2 : 3;
      const all = wrap(ctx, f.title.trim(), w - pad * 2);
      const lines = all.slice(0, maxLines);
      if (all.length > maxLines && lines.length) {
        lines[lines.length - 1] = fit(ctx, `${lines[lines.length - 1]} ${all[maxLines]}`, w - pad * 2);
      }
      for (let i = lines.length - 1; i >= 0; i--) {
        ctx.fillText(lines[i], pad, y);
        y -= fs * 1.18;
      }
    }

    // ---- brand bar --------------------------------------------------
    ctx.fillStyle = t.bar;
    ctx.fillRect(0, photoH, w, barH);
    ctx.fillStyle = t.accent;
    ctx.fillRect(0, photoH, w, Math.max(3, Math.round(h * 0.004)));

    const cy = photoH + barH / 2;
    ctx.textBaseline = "middle";

    const nameFs = Math.round(w * 0.038);
    ctx.font = `900 ${nameFs}px Satoshi, "Helvetica Neue", sans-serif`;
    ctx.fillStyle = "#fff";
    const company = f.company.trim() || "Your Company";
    ctx.fillText(fit(ctx, company, w * 0.52), pad, cy - nameFs * 0.55);

    const addrFs = Math.round(w * 0.024);
    ctx.font = `500 ${addrFs}px Manrope, system-ui, sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.62)";
    if (f.address.trim()) {
      ctx.fillText(fit(ctx, f.address.trim(), w * 0.52), pad, cy + addrFs * 1.15);
    }

    if (f.phone.trim()) {
      const phFs = Math.round(w * 0.036);
      ctx.font = `900 ${phFs}px Satoshi, "Helvetica Neue", sans-serif`;
      ctx.fillStyle = t.accent;
      ctx.textAlign = "right";
      ctx.fillText(f.phone.trim(), w - pad, cy - phFs * 0.15);
      const capFs = Math.round(w * 0.019);
      ctx.font = `700 ${capFs}px Manrope, system-ui, sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.fillText("CALL / WHATSAPP", w - pad, cy + phFs * 0.95);
      ctx.textAlign = "left";
    }
    ctx.textBaseline = "alphabetic";
  }, [photo, format, theme, f]);

  useEffect(() => { if (fontsReady) draw(); }, [draw, fontsReady]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = `${(f.title || "property-flyer").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${format}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Property Flyer Maker</p>
        <h1 className="mt-2 font-display text-3xl font-black sm:text-4xl">
          Turn a property photo into a branded flyer
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-graphite">
          Upload a photo, add your name, number and address, and download a ready flyer for
          WhatsApp, Instagram or a status post. Everything happens inside your browser — the
          photo is never uploaded to any server.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* -------- preview -------- */}
        <div className="lg:order-2">
          <div className="card overflow-hidden p-4">
            <canvas
              ref={canvasRef}
              className="mx-auto block h-auto w-full max-w-[420px] rounded-xl"
              style={{ aspectRatio: `${FORMATS[format].w} / ${FORMATS[format].h}` }}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={download} disabled={!photo} className="btn-gold !py-2.5 !text-sm max-sm:w-full disabled:opacity-50">
              Download PNG
            </button>
            {!photo && <p className="self-center text-xs text-graphite">Upload a photo to enable download</p>}
          </div>
        </div>

        {/* -------- controls -------- */}
        <div className="space-y-5 lg:order-1">
          <div className="card p-5">
            <label className="label">Property photo</label>
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files?.[0]); }}
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-line bg-paper px-4 py-7 text-center transition-colors hover:border-gold"
            >
              <span className="font-display text-2xl" style={{ color: "var(--gold)" }}>⇪</span>
              <span className="mt-2 text-sm font-bold">
                {photoName ? "Change photo" : "Tap to upload, or drop a photo"}
              </span>
              <span className="mt-0.5 text-xs text-graphite">
                {photoName ? photoName : "JPG or PNG, up to 12 MB"}
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
            </label>
            {error && <p className="mt-2 text-xs font-bold" style={{ color: "var(--red)" }}>{error}</p>}
          </div>

          <div className="card space-y-4 p-5">
            <div>
              <label className="label">Format</label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(FORMATS) as FormatKey[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => setFormat(k)}
                    className={`rounded-full px-3.5 py-2 text-xs font-bold transition-colors ${
                      format === k ? "bg-ink text-white" : "border border-line bg-white text-graphite"
                    }`}
                  >
                    {FORMATS[k].label}
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-[11px] text-graphite">{FORMATS[format].note} · {FORMATS[format].w}×{FORMATS[format].h}</p>
            </div>

            <div>
              <label className="label">Colour</label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(THEMES) as ThemeKey[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => setTheme(k)}
                    title={THEMES[k].label}
                    aria-label={THEMES[k].label}
                    className={`h-9 w-9 rounded-full border-2 transition-transform ${theme === k ? "scale-110 border-ink" : "border-line"}`}
                    style={{ background: THEMES[k].bar }}
                  >
                    <span className="mx-auto block h-2.5 w-2.5 rounded-full" style={{ background: THEMES[k].accent }} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card space-y-3.5 p-5">
            <p className="font-display text-sm font-black">The property</p>
            <Input label="Badge" value={f.badge} onChange={(v) => set("badge", v)} placeholder="FOR SALE" />
            <Input label="Headline" value={f.title} onChange={(v) => set("title", v)} placeholder="3 BHK Independent Floor" />
            <Input label="Location" value={f.location} onChange={(v) => set("location", v)} placeholder="Sector 82, Mohali" />
            <Input label="Price" value={f.price} onChange={(v) => set("price", v)} placeholder="₹1.45 Cr" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Detail 1" value={f.detailA} onChange={(v) => set("detailA", v)} placeholder="1,650 sq ft" />
              <Input label="Detail 2" value={f.detailB} onChange={(v) => set("detailB", v)} placeholder="East facing" />
            </div>
          </div>

          <div className="card space-y-3.5 p-5">
            <p className="font-display text-sm font-black">Your details</p>
            <Input label="Company name" value={f.company} onChange={(v) => set("company", v)} placeholder="Your Company Name" />
            <Input label="Phone number" value={f.phone} onChange={(v) => set("phone", v)} placeholder="+91 98765 43210" />
            <Input label="Address" value={f.address} onChange={(v) => set("address", v)} placeholder="Shop 12, VIP Road, Zirakpur" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input !py-2.5 !text-sm" />
    </div>
  );
}

/* ---------- canvas helpers ---------- */

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

/** Greedy wrap; the caller decides how many lines it will actually print. */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Truncate with an ellipsis so a long company name cannot run into the phone. */
function fit(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  if (ctx.measureText(text).width <= maxW) return text;
  let s = text;
  while (s.length > 1 && ctx.measureText(`${s}…`).width > maxW) s = s.slice(0, -1);
  return `${s}…`;
}
