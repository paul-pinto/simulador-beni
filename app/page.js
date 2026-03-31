"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCcw, Save, Download, Sparkles } from "lucide-react";

const fmtInt = new Intl.NumberFormat("es-BO");
const fmtPct = (n) => `${n.toFixed(1).replace(".", ",")}%`;

const PADRON = 289397;
const VOTOS_VALIDOS = 193473;
const VOTOS_BLANCOS = 29377;
const VOTOS_NULOS = 12101;
const VOTOS_EMITIDOS = 234951;
const AUSENTES = PADRON - VOTOS_EMITIDOS;

const FINALISTAS = {
  izquierda: {
    sigla: "PATRIA-UNIDOS",
    nombre: "JESÚS EGUEZ RIVERO",
    votos: 70729,
    color: "#f97316",
  },
  derecha: {
    sigla: "MNR",
    nombre: "HUGO VARGAS ROCA",
    votos: 38927,
    color: "#ec4899",
  },
};

const FUENTES = [
  { key: "tufe", sigla: "TUFE", nombre: "MIGUEL RIVERO BALCAZAR", votos: 26574, color: "#1c87b0", defaultLeft: 50, turnoutDefault: 0 },
  { key: "aupp", sigla: "A-UPP", nombre: "MARIO ALBERTO ALMEIDA SALAS", votos: 6818, color: "#e1c34a", defaultLeft: 50, turnoutDefault: 0 },
  { key: "mts", sigla: "MTS", nombre: "CASTA KARINA SALINAS CURY", votos: 8408, color: "#8b4513", defaultLeft: 50, turnoutDefault: 0 },
  { key: "despierta", sigla: "DESPIERTA", nombre: "ALEJANDRO UNZUETA SHIRIQUI", votos: 30835, color: "#16a34a", defaultLeft: 50, turnoutDefault: 0 },
  { key: "cpemb", sigla: "CPEM-B", nombre: "CONSUELO NUÑEZ MOLINA", votos: 7048, color: "#eab308", defaultLeft: 50, turnoutDefault: 0 },
  { key: "ngp", sigla: "NGP", nombre: "LUIS PEDRIEL CALLEJA", votos: 4134, color: "#38bdf8", defaultLeft: 50, turnoutDefault: 0 },
  { key: "blancos", sigla: "BLANCOS", nombre: "VOTOS BLANCOS", votos: VOTOS_BLANCOS, color: "#9ca3af", defaultLeft: 50, turnoutDefault: 0 },
  { key: "nulos", sigla: "NULOS", nombre: "VOTOS NULOS", votos: VOTOS_NULOS, color: "#6b7280", defaultLeft: 50, turnoutDefault: 0 },
  { key: "ausentes", sigla: "AUSENTES", nombre: "NO VOTARON EN PRIMERA VUELTA", votos: AUSENTES, color: "#4b5563", defaultLeft: 50, turnoutDefault: 0, wide: true },
];

const buildDefaultFuentes = () => Object.fromEntries(FUENTES.map((f) => [f.key, { left: f.defaultLeft, turnout: f.turnoutDefault }]));

function downloadFile(filename, content, type = "application/json;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ✅ Slider simple y estable
function RangeSlider({ value, min = 0, max = 100, step = 1, onChange }) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-300"
      style={{ accentColor: "#2563eb" }}
    />
  );
}

function DualSlider({ value, onChange, leftColor, rightColor }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[22px] font-black leading-none">
        <span style={{ color: leftColor }}>{Math.round(value)}%</span>
        <span style={{ color: rightColor }}>{Math.round(100 - value)}%</span>
      </div>
      <RangeSlider value={value} min={0} max={100} step={1} onChange={onChange} />
    </div>
  );
}

function TurnoutSlider({ value, onChange }) {
  return (
    <div className="space-y-1 pt-1">
      <div className="text-center text-[11px] font-bold uppercase tracking-wide text-zinc-700">Concurrencia</div>
      <div className="flex items-center gap-2 px-6">
        <span className="text-[10px] font-semibold text-zinc-600">0%</span>
        <div className="flex-1">
          <RangeSlider value={value} min={0} max={100} step={1} onChange={onChange} />
        </div>
        <span className="text-[10px] font-semibold text-zinc-600">100%</span>
      </div>
    </div>
  );
}

function FuenteCard({ fuente, state, setState }) {
  const transferidos = Math.round(fuente.votos * (state.turnout / 100));
  const izquierda = Math.round(transferidos * (state.left / 100));
  const derecha = transferidos - izquierda;

  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className={`border bg-white p-3 shadow-sm rounded-2xl ${fuente.wide ? "md:col-span-2" : ""}`}>
      <div className="mb-2 text-center">
        <div className="text-[15px] font-bold" style={{ color: fuente.color }}>{fuente.sigla}</div>
        <div className="text-[11px] font-semibold text-zinc-700">{fuente.nombre}</div>
        <div className="text-[12px] text-zinc-600">({fmtInt.format(fuente.votos)} votos)</div>
      </div>

      <DualSlider value={state.left} onChange={(left) => setState((prev) => ({ ...prev, left }))} leftColor={FINALISTAS.izquierda.color} rightColor={FINALISTAS.derecha.color} />

      <div className="mt-2 flex justify-between text-[12px] text-zinc-700">
        <span>{fmtInt.format(izquierda)}</span>
        <span>{fmtInt.format(derecha)}</span>
      </div>

      <TurnoutSlider value={state.turnout} onChange={(turnout) => setState((prev) => ({ ...prev, turnout }))} />
    </motion.div>
  );
}

export default function SimuladorBalotajeBeni() {
  const [retencionIzquierda, setRetencionIzquierda] = useState(100);
  const [retencionDerecha, setRetencionDerecha] = useState(100);
  const [fuentes, setFuentes] = useState(buildDefaultFuentes);

  const resultado = useMemo(() => {
    let izquierda = Math.round(FINALISTAS.izquierda.votos * (retencionIzquierda / 100));
    let derecha = Math.round(FINALISTAS.derecha.votos * (retencionDerecha / 100));

    FUENTES.forEach((f) => {
      const cfg = fuentes[f.key];
      const transferidos = Math.round(f.votos * (cfg.turnout / 100));
      izquierda += Math.round(transferidos * (cfg.left / 100));
      derecha += transferidos - Math.round(transferidos * (cfg.left / 100));
    });

    const total = izquierda + derecha;

    return {
      izquierda,
      derecha,
      izquierdaPct: (izquierda / total) * 100,
      derechaPct: (derecha / total) * 100,
    };
  }, [retencionIzquierda, retencionDerecha, fuentes]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Simulador Beni</h1>

      <DualSlider value={retencionIzquierda} onChange={setRetencionIzquierda} leftColor="#f97316" rightColor="#f97316" />
      <DualSlider value={retencionDerecha} onChange={setRetencionDerecha} leftColor="#ec4899" rightColor="#ec4899" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {FUENTES.map((f) => (
          <FuenteCard key={f.key} fuente={f} state={fuentes[f.key]} setState={(updater) => setFuentes((prev) => ({ ...prev, [f.key]: updater(prev[f.key]) }))} />
        ))}
      </div>

      <div className="mt-6">
        <div>PATRIA-UNIDOS: {fmtPct(resultado.izquierdaPct)}</div>
        <div>MNR: {fmtPct(resultado.derechaPct)}</div>
      </div>
    </div>
  );
}
