"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
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

const PRESETS = {
  optimista_eguez: {
    nombre: "Escenario optimista Egüez",
    retencionIzquierda: 96,
    retencionDerecha: 90,
    fuentes: {
      tufe: { left: 62, turnout: 78 },
      aupp: { left: 55, turnout: 65 },
      mts: { left: 72, turnout: 70 },
      despierta: { left: 46, turnout: 74 },
      cpemb: { left: 58, turnout: 60 },
      ngp: { left: 60, turnout: 52 },
      blancos: { left: 52, turnout: 24 },
      nulos: { left: 50, turnout: 14 },
      ausentes: { left: 54, turnout: 12 },
    },
  },
  competitivo: {
    nombre: "Escenario competitivo",
    retencionIzquierda: 94,
    retencionDerecha: 94,
    fuentes: {
      tufe: { left: 52, turnout: 72 },
      aupp: { left: 50, turnout: 62 },
      mts: { left: 60, turnout: 65 },
      despierta: { left: 48, turnout: 70 },
      cpemb: { left: 51, turnout: 56 },
      ngp: { left: 52, turnout: 48 },
      blancos: { left: 50, turnout: 18 },
      nulos: { left: 50, turnout: 10 },
      ausentes: { left: 50, turnout: 10 },
    },
  },
  optimista_mnr: {
    nombre: "Escenario optimista MNR",
    retencionIzquierda: 90,
    retencionDerecha: 96,
    fuentes: {
      tufe: { left: 38, turnout: 78 },
      aupp: { left: 44, turnout: 65 },
      mts: { left: 42, turnout: 68 },
      despierta: { left: 36, turnout: 76 },
      cpemb: { left: 45, turnout: 62 },
      ngp: { left: 40, turnout: 54 },
      blancos: { left: 46, turnout: 24 },
      nulos: { left: 46, turnout: 14 },
      ausentes: { left: 44, turnout: 12 },
    },
  },
};

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

function DualSlider({ value, onChange, leftColor, rightColor }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[22px] font-black leading-none">
        <span style={{ color: leftColor }}>{Math.round(value)}%</span>
        <span style={{ color: rightColor }}>{Math.round(100 - value)}%</span>
      </div>
      <Slider value={[value]} min={0} max={100} step={1} onValueChange={(v) => onChange(v[0])} />
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
          <Slider value={[value]} min={0} max={100} step={1} onValueChange={(v) => onChange(v[0])} />
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
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`border bg-white p-3 shadow-sm rounded-2xl ${fuente.wide ? "md:col-span-2" : ""}`}
    >
      <div className="mb-2 text-center">
        <div className="text-[15px] font-bold" style={{ color: fuente.color }}>{fuente.sigla}</div>
        <div className="text-[11px] font-semibold text-zinc-700">{fuente.nombre}</div>
        <div className="text-[12px] text-zinc-600">({fmtInt.format(fuente.votos)} votos)</div>
      </div>

      <DualSlider
        value={state.left}
        onChange={(left) => setState((prev) => ({ ...prev, left }))}
        leftColor={FINALISTAS.izquierda.color}
        rightColor={FINALISTAS.derecha.color}
      />

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
  const [escenariosGuardados, setEscenariosGuardados] = useState([]);

  const resultado = useMemo(() => {
    const baseIzquierdaRetenida = Math.round(FINALISTAS.izquierda.votos * (retencionIzquierda / 100));
    const baseDerechaRetenida = Math.round(FINALISTAS.derecha.votos * (retencionDerecha / 100));

    let izquierda = baseIzquierdaRetenida;
    let derecha = baseDerechaRetenida;
    let noAsignado =
      (FINALISTAS.izquierda.votos - baseIzquierdaRetenida) +
      (FINALISTAS.derecha.votos - baseDerechaRetenida);

    FUENTES.forEach((fuente) => {
      const cfg = fuentes[fuente.key];
      const transferidos = Math.round(fuente.votos * (cfg.turnout / 100));
      const haciaIzquierda = Math.round(transferidos * (cfg.left / 100));
      const haciaDerecha = transferidos - haciaIzquierda;

      izquierda += haciaIzquierda;
      derecha += haciaDerecha;

      if (["blancos", "nulos", "ausentes"].includes(fuente.key)) return;
      noAsignado += fuente.votos - transferidos;
    });

    const total = izquierda + derecha + noAsignado;
    const margen = izquierda - derecha;

    return {
      izquierda,
      derecha,
      noAsignado,
      total,
      margen,
      ganador: margen > 0 ? FINALISTAS.izquierda.sigla : margen < 0 ? FINALISTAS.derecha.sigla : "EMPATE",
      izquierdaPct: total ? (izquierda / total) * 100 : 0,
      derechaPct: total ? (derecha / total) * 100 : 0,
      noAsignadoPct: total ? (noAsignado / total) * 100 : 0,
      validosBalotaje: izquierda + derecha,
      izquierdaBalotajePct: izquierda + derecha ? (izquierda / (izquierda + derecha)) * 100 : 0,
      derechaBalotajePct: izquierda + derecha ? (derecha / (izquierda + derecha)) * 100 : 0,
    };
  }, [retencionIzquierda, retencionDerecha, fuentes]);

  const snapshot = useMemo(() => ({
    retencionIzquierda,
    retencionDerecha,
    fuentes,
  }), [retencionIzquierda, retencionDerecha, fuentes]);

  const aplicarEscenario = (escenario) => {
    setRetencionIzquierda(escenario.retencionIzquierda);
    setRetencionDerecha(escenario.retencionDerecha);
    setFuentes(escenario.fuentes);
  };

  const reset = () => {
    setRetencionIzquierda(100);
    setRetencionDerecha(100);
    setFuentes(buildDefaultFuentes());
  };

  const guardarEscenario = () => {
    const nombre = `Escenario ${escenariosGuardados.length + 1}`;
    setEscenariosGuardados((prev) => [...prev, { nombre, ...snapshot }].slice(-6));
  };

  const exportarJSON = () => {
    downloadFile(
      "simulacion-beni-balotaje.json",
      JSON.stringify({
        metadata: {
          padron: PADRON,
          votos_validos: VOTOS_VALIDOS,
          votos_blancos: VOTOS_BLANCOS,
          votos_nulos: VOTOS_NULOS,
          votos_emitidos: VOTOS_EMITIDOS,
        },
        finalistas: FINALISTAS,
        configuracion: snapshot,
        resultado,
      }, null, 2)
    );
  };

  const exportarCSV = () => {
    const rows = [
      ["Campo", "Valor"],
      ["Ganador", resultado.ganador],
      ["PATRIA-UNIDOS votos", resultado.izquierda],
      ["PATRIA-UNIDOS porcentaje balotaje", resultado.izquierdaBalotajePct.toFixed(2)],
      ["MNR votos", resultado.derecha],
      ["MNR porcentaje balotaje", resultado.derechaBalotajePct.toFixed(2)],
      ["No asignado votos", resultado.noAsignado],
      ["No asignado porcentaje", resultado.noAsignadoPct.toFixed(2)],
      ["Margen", resultado.margen],
    ];
    downloadFile("simulacion-beni-balotaje.csv", rows.map((r) => r.join(",")).join("\n"), "text/csv;charset=utf-8");
  };

  const barraResultado = [
    { label: FINALISTAS.izquierda.sigla, value: resultado.izquierdaPct, color: FINALISTAS.izquierda.color },
    { label: FINALISTAS.derecha.sigla, value: resultado.derechaPct, color: FINALISTAS.derecha.color },
    { label: "No asignado", value: resultado.noAsignadoPct, color: "#9ca3af" },
  ];

  return (
    <div className="min-h-screen bg-[#efefef] p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-4">
        <motion.div layout className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <Card className="rounded-3xl border-0 shadow-lg">
            <CardContent className="p-5">
              <div className="grid grid-cols-2 gap-6 text-center">
                <motion.div layout>
                  <div className="text-[18px] font-bold" style={{ color: FINALISTAS.izquierda.color }}>{FINALISTAS.izquierda.sigla}</div>
                  <div className="text-[12px] font-semibold text-zinc-700">{FINALISTAS.izquierda.nombre}</div>
                  <motion.div key={resultado.izquierdaPct.toFixed(1)} initial={{ scale: 0.96, opacity: 0.8 }} animate={{ scale: 1, opacity: 1 }} className="mt-1 text-[50px] font-black leading-none" style={{ color: FINALISTAS.izquierda.color }}>
                    {fmtPct(resultado.izquierdaPct)}
                  </motion.div>
                  <div className="text-[15px] text-zinc-800">{fmtInt.format(resultado.izquierda)} votos</div>
                </motion.div>

                <motion.div layout>
                  <div className="text-[18px] font-bold" style={{ color: FINALISTAS.derecha.color }}>{FINALISTAS.derecha.sigla}</div>
                  <div className="text-[12px] font-semibold text-zinc-700">{FINALISTAS.derecha.nombre}</div>
                  <motion.div key={resultado.derechaPct.toFixed(1)} initial={{ scale: 0.96, opacity: 0.8 }} animate={{ scale: 1, opacity: 1 }} className="mt-1 text-[50px] font-black leading-none" style={{ color: FINALISTAS.derecha.color }}>
                    {fmtPct(resultado.derechaPct)}
                  </motion.div>
                  <div className="text-[15px] text-zinc-800">{fmtInt.format(resultado.derecha)} votos</div>
                </motion.div>
              </div>

              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-600">
                  <span>Distribución total simulada (primera vuelta)</span>
                  <span>{resultado.ganador === "EMPATE" ? "Empate técnico" : `Ventaja: ${fmtInt.format(Math.abs(resultado.margen))} votos`}</span>
                </div>
                <div className="flex h-5 overflow-hidden rounded-full bg-zinc-200">
                  {barraResultado.map((item) => (
                    <motion.div
                      key={item.label}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 0.4 }}
                      style={{ backgroundColor: item.color }}
                      className="h-full"
                    />
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-zinc-700">
                  {barraResultado.map((item) => (
                    <div key={item.label} className="rounded-xl bg-zinc-100 px-2 py-1">
                      {item.label}: {fmtPct(item.value)}
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-600">
                    <span>Cómputo final del balotaje</span>
                    <span>{resultado.ganador === "EMPATE" ? "Empate técnico" : `Ventaja: ${fmtInt.format(Math.abs(resultado.margen))} votos válidos`}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-[15px] font-bold" style={{ color: FINALISTAS.izquierda.color }}>{FINALISTAS.izquierda.sigla}</div>
                      <div className="mt-1 text-[34px] font-black leading-none" style={{ color: FINALISTAS.izquierda.color }}>
                        {fmtPct(resultado.izquierdaBalotajePct)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[15px] font-bold" style={{ color: FINALISTAS.derecha.color }}>{FINALISTAS.derecha.sigla}</div>
                      <div className="mt-1 text-[34px] font-black leading-none" style={{ color: FINALISTAS.derecha.color }}>
                        {fmtPct(resultado.derechaBalotajePct)}
                      </div>
                    </div>
                  </div>

                  <div className="flex h-5 overflow-hidden rounded-full bg-zinc-200">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${resultado.izquierdaBalotajePct}%` }} transition={{ duration: 0.4 }} style={{ backgroundColor: FINALISTAS.izquierda.color }} className="h-full" />
                    <motion.div initial={{ width: 0 }} animate={{ width: `${resultado.derechaBalotajePct}%` }} transition={{ duration: 0.4 }} style={{ backgroundColor: FINALISTAS.derecha.color }} className="h-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center text-[11px] font-semibold text-zinc-700">
                    <div className="rounded-xl bg-white px-2 py-1">{FINALISTAS.izquierda.sigla}: {fmtPct(resultado.izquierdaBalotajePct)}</div>
                    <div className="rounded-xl bg-white px-2 py-1">{FINALISTAS.derecha.sigla}: {fmtPct(resultado.derechaBalotajePct)}</div>
                  </div>
                  <div className="text-center text-[11px] text-zinc-500">
                    Este resultado se calcula únicamente sobre los votos válidos asignados a ambos finalistas, sin incluir el voto no asignado.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-lg">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-zinc-800">Resumen del escenario</div>
                  <div className="text-xs text-zinc-500">Primera vuelta + transferencias simuladas</div>
                </div>
                <Badge className="rounded-full px-3 py-1 text-white" style={{ backgroundColor: resultado.ganador === FINALISTAS.derecha.sigla ? FINALISTAS.derecha.color : resultado.ganador === FINALISTAS.izquierda.sigla ? FINALISTAS.izquierda.color : "#71717a" }}>
                  {resultado.ganador}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-zinc-100 p-3">
                  <div className="text-zinc-500">No asignado</div>
                  <div className="text-2xl font-black text-zinc-600">{fmtPct(resultado.noAsignadoPct)}</div>
                  <div>{fmtInt.format(resultado.noAsignado)} votos</div>
                </div>
                <div className="rounded-2xl bg-zinc-100 p-3">
                  <div className="text-zinc-500">Margen</div>
                  <div className="text-2xl font-black text-zinc-800">{fmtInt.format(Math.abs(resultado.margen))}</div>
                  <div>{resultado.margen === 0 ? "Empate" : `a favor de ${resultado.ganador}`}</div>
                </div>
              </div>

              <div className="rounded-2xl border border-dashed p-3 text-center text-[11px] text-zinc-500">
                El simulador parte desde la primera vuelta real: 36,56% para PATRIA-UNIDOS y 20,12% para MNR. En el bloque superior, el cómputo final del balotaje se recalcula solo sobre los votos que terminan en uno de los dos finalistas.
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={reset} variant="outline" className="rounded-2xl">
                  <RefreshCcw className="mr-2 h-4 w-4" /> Resetear
                </Button>
                <Button onClick={guardarEscenario} variant="outline" className="rounded-2xl">
                  <Save className="mr-2 h-4 w-4" /> Guardar escenario
                </Button>
                <Button onClick={exportarJSON} className="rounded-2xl">
                  <Download className="mr-2 h-4 w-4" /> Exportar JSON
                </Button>
                <Button onClick={exportarCSV} variant="secondary" className="rounded-2xl">
                  <Download className="mr-2 h-4 w-4" /> Exportar CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Card className="rounded-3xl border-0 shadow-md">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-800">
              <Sparkles className="h-4 w-4" /> Escenarios rápidos
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(PRESETS).map(([key, preset]) => (
                <Button key={key} variant="outline" className="rounded-2xl" onClick={() => aplicarEscenario(preset)}>
                  {preset.nombre}
                </Button>
              ))}
              {escenariosGuardados.map((escenario, index) => (
                <Button key={`${escenario.nombre}-${index}`} variant="secondary" className="rounded-2xl" onClick={() => aplicarEscenario(escenario)}>
                  {escenario.nombre}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 shadow-md">
          <CardContent className="p-4 space-y-3">
            <div className="text-[12px] font-bold text-zinc-700">Retención {FINALISTAS.izquierda.sigla}</div>
            <DualSlider value={retencionIzquierda} onChange={setRetencionIzquierda} leftColor={FINALISTAS.izquierda.color} rightColor={FINALISTAS.izquierda.color} />
            <div className="text-[11px] text-zinc-600">Porcentaje de su propio voto que conserva en segunda vuelta</div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 shadow-md">
          <CardContent className="p-4 space-y-3">
            <div className="text-[12px] font-bold text-zinc-700">Retención {FINALISTAS.derecha.sigla}</div>
            <DualSlider value={retencionDerecha} onChange={setRetencionDerecha} leftColor={FINALISTAS.derecha.color} rightColor={FINALISTAS.derecha.color} />
            <div className="text-[11px] text-zinc-600">Porcentaje de su propio voto que conserva en segunda vuelta</div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {FUENTES.map((fuente) => (
            <FuenteCard
              key={fuente.key}
              fuente={fuente}
              state={fuentes[fuente.key]}
              setState={(updater) =>
                setFuentes((prev) => ({
                  ...prev,
                  [fuente.key]: typeof updater === "function" ? updater(prev[fuente.key]) : updater,
                }))
              }
            />
          ))}
        </div>

        <Card className="rounded-3xl border-0 shadow-md">
          <CardContent className="p-4 text-center space-y-2">
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
