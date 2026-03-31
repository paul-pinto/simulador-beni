"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

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
  { key: "blancos", sigla: "BLANCOS", nombre: "VOTOS BLANCOS", votos: VOTOS_BLANCOS, color: "#94a3b8", defaultLeft: 50, turnoutDefault: 0 },
  { key: "nulos", sigla: "NULOS", nombre: "VOTOS NULOS", votos: VOTOS_NULOS, color: "#64748b", defaultLeft: 50, turnoutDefault: 0 },
  { key: "ausentes", sigla: "AUSENTES", nombre: "NO VOTARON EN PRIMERA VUELTA", votos: AUSENTES, color: "#475569", defaultLeft: 50, turnoutDefault: 0, wide: true },
];

const buildDefaultFuentes = () =>
  Object.fromEntries(FUENTES.map((f) => [f.key, { left: f.defaultLeft, turnout: f.turnoutDefault }]));

function RangeTrack({ value, onChange, accent = "#2563eb" }) {
  return (
    <input
      type="range"
      min={0}
      max={100}
      step={1}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="slider-range"
      style={{ accentColor: accent }}
    />
  );
}

function TransferSlider({ value, onChange }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[18px] font-black leading-none md:text-[22px]">
        <span style={{ color: FINALISTAS.izquierda.color }}>{Math.round(value)}%</span>
        <span style={{ color: FINALISTAS.derecha.color }}>{Math.round(100 - value)}%</span>
      </div>
      <div className="mx-auto w-full max-w-[360px]">
        <RangeTrack value={value} onChange={onChange} />
      </div>
    </div>
  );
}

function RetentionSlider({ value, onChange, candidate = "left" }) {
  const leftLabel = candidate === "left" ? value : 100 - value;
  const rightLabel = candidate === "left" ? 100 - value : value;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[18px] font-black leading-none md:text-[22px]">
        <span style={{ color: FINALISTAS.izquierda.color }}>{Math.round(leftLabel)}%</span>
        <span style={{ color: FINALISTAS.derecha.color }}>{Math.round(rightLabel)}%</span>
      </div>
      <div className="mx-auto w-full max-w-[520px]">
        <RangeTrack value={value} onChange={onChange} />
      </div>
    </div>
  );
}

function TurnoutSlider({ value, onChange }) {
  return (
    <div className="space-y-2 pt-2">
      <div className="text-center text-[11px] font-bold uppercase tracking-wide text-zinc-700">Concurrencia</div>
      <div className="mx-auto flex w-full max-w-[380px] items-center gap-3">
        <span className="w-8 text-[10px] font-semibold text-zinc-600">0%</span>
        <div className="flex-1">
          <RangeTrack value={value} onChange={onChange} />
        </div>
        <span className="w-10 text-right text-[10px] font-semibold text-zinc-600">100%</span>
      </div>
    </div>
  );
}

function FuenteCard({ fuente, state, setState }) {
  const transferidos = Math.round(fuente.votos * (state.turnout / 100));
  const izquierda = Math.round(transferidos * (state.left / 100));
  const derecha = transferidos - izquierda;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm md:p-5 ${fuente.wide ? "md:col-span-2" : ""}`}
    >
      <div className="mb-3 text-center">
        <div className="text-[15px] font-bold" style={{ color: fuente.color }}>{fuente.sigla}</div>
        <div className="text-[11px] font-semibold text-zinc-700">{fuente.nombre}</div>
        <div className="text-[12px] text-zinc-600">({fmtInt.format(fuente.votos)} votos)</div>
      </div>

      <TransferSlider value={state.left} onChange={(left) => setState((prev) => ({ ...prev, left }))} />

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
      const aIzquierda = Math.round(transferidos * (cfg.left / 100));
      izquierda += aIzquierda;
      derecha += transferidos - aIzquierda;
    });

    const total = izquierda + derecha;
    return {
      izquierda,
      derecha,
      izquierdaPct: total ? (izquierda / total) * 100 : 0,
      derechaPct: total ? (derecha / total) * 100 : 0,
    };
  }, [retencionIzquierda, retencionDerecha, fuentes]);

  return (
    <div className="min-h-screen bg-[#efefef] p-4 md:p-7">
      <style jsx global>{`
        .slider-range {
          width: 100%;
          appearance: none;
          -webkit-appearance: none;
          background: transparent;
          height: 28px;
        }
        .slider-range::-webkit-slider-runnable-track {
          height: 6px;
          background: #2563eb;
          border-radius: 999px;
        }
        .slider-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: #6b7280;
          border: 3px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.25);
          margin-top: -6px;
        }
        .slider-range::-moz-range-track {
          height: 6px;
          background: #2563eb;
          border-radius: 999px;
        }
        .slider-range::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border: 3px solid white;
          border-radius: 999px;
          background: #6b7280;
          box-shadow: 0 1px 4px rgba(0,0,0,0.25);
        }
      `}</style>

      <div className="mx-auto max-w-6xl space-y-4">
        <Card className="rounded-[28px] border border-zinc-200 bg-white shadow-sm">
          <CardContent className="space-y-5 p-5 md:p-7">
            <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-2">
              <div>
                <div className="text-[18px] font-bold" style={{ color: FINALISTAS.izquierda.color }}>{FINALISTAS.izquierda.sigla}</div>
                <div className="text-[12px] font-semibold text-zinc-700">{FINALISTAS.izquierda.nombre}</div>
                <div className="mt-1 text-[50px] font-black leading-none md:text-[58px]" style={{ color: FINALISTAS.izquierda.color }}>
                  {fmtPct(resultado.izquierdaPct)}
                </div>
                <div className="text-[15px] text-zinc-800">{fmtInt.format(resultado.izquierda)} votos</div>
              </div>
              <div>
                <div className="text-[18px] font-bold" style={{ color: FINALISTAS.derecha.color }}>{FINALISTAS.derecha.sigla}</div>
                <div className="text-[12px] font-semibold text-zinc-700">{FINALISTAS.derecha.nombre}</div>
                <div className="mt-1 text-[50px] font-black leading-none md:text-[58px]" style={{ color: FINALISTAS.derecha.color }}>
                  {fmtPct(resultado.derechaPct)}
                </div>
                <div className="text-[15px] text-zinc-800">{fmtInt.format(resultado.derecha)} votos</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm md:p-5">
                <div className="mb-2 text-center text-[12px] font-bold text-zinc-700">Retención {FINALISTAS.izquierda.sigla}</div>
                <RetentionSlider value={retencionIzquierda} onChange={setRetencionIzquierda} candidate="left" />
                <div className="text-center text-[11px] text-zinc-600">Porcentaje de su propio voto que conserva en segunda vuelta</div>
              </div>

              <div className="rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm md:p-5">
                <div className="mb-2 text-center text-[12px] font-bold text-zinc-700">Retención {FINALISTAS.derecha.sigla}</div>
                <RetentionSlider value={retencionDerecha} onChange={setRetencionDerecha} candidate="right" />
                <div className="text-center text-[11px] text-zinc-600">Porcentaje de su propio voto que conserva en segunda vuelta</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {FUENTES.map((f) => (
            <FuenteCard
              key={f.key}
              fuente={f}
              state={fuentes[f.key]}
              setState={(updater) =>
                setFuentes((prev) => ({
                  ...prev,
                  [f.key]: typeof updater === "function" ? updater(prev[f.key]) : updater,
                }))
              }
            />
          ))}
        </div>

        <Card className="rounded-[24px] border border-zinc-200 bg-white shadow-sm">
          <CardContent className="space-y-2 p-4 text-center">
            <div className="text-[13px] text-zinc-700">
              Votos válidos primera vuelta: <span className="font-bold">{fmtInt.format(VOTOS_VALIDOS)}</span> · Blancos: <span className="font-bold">{fmtInt.format(VOTOS_BLANCOS)}</span> · Nulos: <span className="font-bold">{fmtInt.format(VOTOS_NULOS)}</span>
            </div>
            <div className="text-[13px] text-zinc-700">
              Emitidos: <span className="font-bold">{fmtInt.format(VOTOS_EMITIDOS)}</span> · Ausentes: <span className="font-bold">{fmtInt.format(AUSENTES)}</span> · Padrón: <span className="font-bold">{fmtInt.format(PADRON)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
