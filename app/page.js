"use client";

import React, { useMemo, useState } from "react";

const fmtInt = new Intl.NumberFormat("es-BO");
const fmtPct = (n) => n.toFixed(1).replace(".", ",") + "%";

const PADRON = 289397;
const VOTOS_VALIDOS = 193473;
const VOTOS_BLANCOS = 29377;
const VOTOS_NULOS = 12101;
const VOTOS_EMITIDOS = 234951;
const AUSENTES = PADRON - VOTOS_EMITIDOS;

const FINALISTAS = {
  izquierda: { sigla: "PATRIA-UNIDOS", nombre: "JESÚS EGUEZ RIVERO", votos: 70729, color: "#f97316" },
  derecha: { sigla: "MNR", nombre: "HUGO VARGAS ROCA", votos: 38927, color: "#ec4899" },
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

const PRESETS = {
  optimista_eguez: {
    nombre: "Escenario optimista Egüez", retencionIzquierda: 96, retencionDerecha: 90,
    fuentes: { tufe:{left:62,turnout:78}, aupp:{left:55,turnout:65}, mts:{left:72,turnout:70}, despierta:{left:46,turnout:74}, cpemb:{left:58,turnout:60}, ngp:{left:60,turnout:52}, blancos:{left:52,turnout:24}, nulos:{left:50,turnout:14}, ausentes:{left:54,turnout:12} }
  },
  competitivo: {
    nombre: "Escenario competitivo", retencionIzquierda: 94, retencionDerecha: 94,
    fuentes: { tufe:{left:52,turnout:72}, aupp:{left:50,turnout:62}, mts:{left:60,turnout:65}, despierta:{left:48,turnout:70}, cpemb:{left:51,turnout:56}, ngp:{left:52,turnout:48}, blancos:{left:50,turnout:18}, nulos:{left:50,turnout:10}, ausentes:{left:50,turnout:10} }
  },
  optimista_mnr: {
    nombre: "Escenario optimista MNR", retencionIzquierda: 90, retencionDerecha: 96,
    fuentes: { tufe:{left:38,turnout:78}, aupp:{left:44,turnout:65}, mts:{left:42,turnout:68}, despierta:{left:36,turnout:76}, cpemb:{left:45,turnout:62}, ngp:{left:40,turnout:54}, blancos:{left:46,turnout:24}, nulos:{left:46,turnout:14}, ausentes:{left:44,turnout:12} }
  }
};

const buildDefaultFuentes = () => {
  const out = {};
  FUENTES.forEach((f) => {
    out[f.key] = { left: f.defaultLeft, turnout: f.turnoutDefault };
  });
  return out;
};

function downloadFile(filename, content, type) {
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

function Range({ value, onChange, ...props }) {
  return (
    <input
      type="range"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      {...props}
    />
  );
}

function SourceCard({ fuente, cfg, onLeftChange, onTurnoutChange }) {
  const transferidos = Math.round(fuente.votos * (cfg.turnout / 100));
  const izquierda = Math.round(transferidos * (cfg.left / 100));
  const derecha = transferidos - izquierda;

  return (
    <div className={`source${fuente.wide ? " full" : ""}`}>
      <div className="sigla source-sigla" style={{ color: fuente.color }}>{fuente.sigla}</div>
      <div className="name">{fuente.nombre}</div>
      <div className="votes-label">({fmtInt.format(fuente.votos)} votos)</div>

      <div className="slider-head mt10">
        <span style={{ color: FINALISTAS.izquierda.color }}>{Math.round(cfg.left)}%</span>
        <span style={{ color: FINALISTAS.derecha.color }}>{Math.round(100 - cfg.left)}%</span>
      </div>
      <Range min={0} max={100} step={1} value={cfg.left} onChange={onLeftChange} />

      <div className="row-between votes-row">
        <span>{fmtInt.format(izquierda)}</span>
        <span>{fmtInt.format(derecha)}</span>
      </div>

      <div className="tiny turnout-title">Concurrencia</div>
      <div className="turnout-row">
        <span>0%</span>
        <Range min={0} max={100} step={1} value={cfg.turnout} onChange={onTurnoutChange} />
        <span>100%</span>
      </div>
    </div>
  );
}

export default function SimuladorBalotajeBeni() {
  const [retencionIzquierda, setRetencionIzquierda] = useState(100);
  const [retencionDerecha, setRetencionDerecha] = useState(100);
  const [fuentes, setFuentes] = useState(buildDefaultFuentes);
  const [saved, setSaved] = useState([]);

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
      if (!["blancos", "nulos", "ausentes"].includes(fuente.key)) {
        noAsignado += fuente.votos - transferidos;
      }
    });

    const total = izquierda + derecha + noAsignado;
    const margen = izquierda - derecha;
    const validosBalotaje = izquierda + derecha;

    return {
      izquierda,
      derecha,
      noAsignado,
      total,
      margen,
      validosBalotaje,
      ganador:
        margen > 0
          ? FINALISTAS.izquierda.sigla
          : margen < 0
            ? FINALISTAS.derecha.sigla
            : "EMPATE",
      izquierdaPct: total ? (izquierda / total) * 100 : 0,
      derechaPct: total ? (derecha / total) * 100 : 0,
      noAsignadoPct: total ? (noAsignado / total) * 100 : 0,
      izquierdaBalotajePct: validosBalotaje ? (izquierda / validosBalotaje) * 100 : 0,
      derechaBalotajePct: validosBalotaje ? (derecha / validosBalotaje) * 100 : 0,
    };
  }, [retencionIzquierda, retencionDerecha, fuentes]);

  const applyPreset = (preset) => {
    setRetencionIzquierda(preset.retencionIzquierda);
    setRetencionDerecha(preset.retencionDerecha);
    setFuentes(JSON.parse(JSON.stringify(preset.fuentes)));
  };

  const reset = () => {
    setRetencionIzquierda(100);
    setRetencionDerecha(100);
    setFuentes(buildDefaultFuentes());
  };

  const saveScenario = () => {
    setSaved((prev) => [
      ...prev.slice(-5),
      {
        nombre: `Escenario ${prev.length + 1}`,
        retencionIzquierda,
        retencionDerecha,
        fuentes: JSON.parse(JSON.stringify(fuentes)),
      },
    ]);
  };

  const exportJSON = () => {
    downloadFile(
      "simulacion-beni-balotaje.json",
      JSON.stringify(
        {
          metadata: {
            padron: PADRON,
            votos_validos: VOTOS_VALIDOS,
            votos_blancos: VOTOS_BLANCOS,
            votos_nulos: VOTOS_NULOS,
            votos_emitidos: VOTOS_EMITIDOS,
          },
          finalistas: FINALISTAS,
          configuracion: { retencionIzquierda, retencionDerecha, fuentes },
          resultado,
        },
        null,
        2,
      ),
      "application/json;charset=utf-8",
    );
  };

  const exportCSV = () => {
    const rows = [
      ["Campo", "Valor"],
      ["Ganador", resultado.ganador],
      ["PATRIA-UNIDOS votos", resultado.izquierda],
      ["PATRIA-UNIDOS porcentaje primera vuelta", resultado.izquierdaPct.toFixed(2)],
      ["PATRIA-UNIDOS porcentaje balotaje", resultado.izquierdaBalotajePct.toFixed(2)],
      ["MNR votos", resultado.derecha],
      ["MNR porcentaje primera vuelta", resultado.derechaPct.toFixed(2)],
      ["MNR porcentaje balotaje", resultado.derechaBalotajePct.toFixed(2)],
      ["No asignado votos", resultado.noAsignado],
      ["No asignado porcentaje", resultado.noAsignadoPct.toFixed(2)],
      ["Margen", resultado.margen],
    ];
    downloadFile(
      "simulacion-beni-balotaje.csv",
      rows.map((r) => r.join(",")).join("\n"),
      "text/csv;charset=utf-8",
    );
  };

  return (
    <>
      <style jsx global>{`
        :root {
          --bg: #efefef;
          --card: #ffffff;
          --text: #18181b;
          --muted: #71717a;
          --line: #e4e4e7;
          --orange: #f97316;
          --pink: #ec4899;
          --gray: #9ca3af;
          --shadow: 0 10px 30px rgba(0, 0, 0, .08);
          --radius: 24px;
        }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: Arial, Helvetica, sans-serif;
          background: var(--bg);
          color: var(--text);
        }
        .wrap {
          max-width: 1180px;
          margin: 0 auto;
          padding: 16px;
        }
        .grid-top {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 16px;
        }
        .card {
          background: var(--card);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          padding: 20px;
        }
        .candidate-grid,
        .stats-grid,
        .sources-grid,
        .legend-grid,
        .ballot-grid {
          display: grid;
          gap: 12px;
        }
        .candidate-grid { grid-template-columns: 1fr 1fr; text-align: center; }
        .stats-grid { grid-template-columns: 1fr 1fr; }
        .sources-grid { grid-template-columns: 1fr 1fr; margin-top: 16px; }
        .legend-grid { grid-template-columns: 1fr 1fr 1fr; text-align: center; }
        .ballot-grid { grid-template-columns: 1fr 1fr; text-align: center; }
        .full { grid-column: 1 / -1; }
        .sigla { font-size: 20px; font-weight: 800; }
        .source-sigla { font-size: 18px; }
        
        .nombre { font-size: 14px; font-weight: 700; color: #3f3f46; }
        .big-pct { font-size: 56px; font-weight: 900; line-height: 1; margin-top: 4px; }
        .votes { font-size: 18px; }
        .muted { color: var(--muted); }
        .small { font-size: 14px; }
        .tiny { font-size: 13px; }
        .section-title { font-size: 16px; font-weight: 800; margin-bottom: 10px; }
        .row-between {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }
        .bar-wrap {
          height: 20px;
          background: #e4e4e7;
          border-radius: 999px;
          overflow: hidden;
          display: flex;
        }
        .bar { height: 100%; transition: width .25s ease; }
        .pill {
          background: #f4f4f5;
          border-radius: 14px;
          padding: 6px 10px;
          font-size: 11px;
          font-weight: 700;
        }
        .badge {
          color: white;
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 800;
        }
        .mini-box {
          background: #f4f4f5;
          border-radius: 16px;
          padding: 14px;
        }
        .mini-box .value {
          font-size: 30px;
          font-weight: 900;
          line-height: 1;
          margin: 4px 0;
        }
        .dashed {
          border: 1px dashed #d4d4d8;
          border-radius: 16px;
          padding: 12px;
          text-align: center;
        }
        .actions, .presets {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        button {
          border: 2px solid #111827;
          background: #111827;
          color: white;
          padding: 12px 18px;
          border-radius: 16px;
          cursor: pointer;
          font-weight: 800;
          font-size: 18px;
          line-height: 1.1;
          transition: all .15s ease;
        }
        button:hover {
          transform: translateY(-1px);
        }
        button.secondary {
          background: #f4f4f5;
          color: #111827;
          border-color: #d4d4d8;
        }
        button.outline {
          background: white;
          color: #111827;
          border-color: #111827;
        }
        input[type="range"] {
          width: 100%;
          accent-color: #71717a;
          cursor: pointer;
        }
        .slider-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 22px;
          font-weight: 900;
          line-height: 1;
          margin-bottom: 4px;
        }
        .source {
          border: 1px solid var(--line);
          border-radius: 18px;
          background: white;
          padding: 14px;
          box-shadow: 0 3px 10px rgba(0,0,0,.04);
          text-align: center;
        }
        .source .name { font-size: 14px; font-weight: 700; color: #3f3f46; }
        .source .votes-label { font-size: 14px; color: #52525b; }
        .turnout-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .turnout-row span { font-size: 10px; font-weight: 700; color: #52525b; }
        .ballot-box {
          margin-top: 16px;
          padding: 16px;
          border-radius: 16px;
          border: 1px solid #e4e4e7;
          background: #fafafa;
        }
        .ballot-big { font-size: 44px; font-weight: 900; line-height: 1; margin-top: 4px; }
        .footer-note {
          text-align: center;
          font-size: 15px;
          color: #3f3f46;
        }
        .mt10 { margin-top: 10px; }
        .votes-row { margin-top: 8px; font-size: 12px; color: #3f3f46; }
        .turnout-title { margin-top: 10px; font-weight: 800; color: #3f3f46; }
        @media (max-width: 900px) {
          .grid-top, .sources-grid, .stats-grid, .legend-grid, .candidate-grid, .ballot-grid { grid-template-columns: 1fr; }
          .big-pct { font-size: 48px; }
          .ballot-big { font-size: 38px; }
          .sigla { font-size: 18px; }
          .source-sigla { font-size: 17px; }
          .nombre, .source .name { font-size: 13px; }
          .votes, .source .votes-label, .small { font-size: 15px; }
          .tiny { font-size: 12px; }
          .section-title { font-size: 18px; }
          .slider-head { font-size: 24px; }
          .actions, .presets { gap: 10px; }
          .actions button, .presets button {
            flex: 1 1 220px;
            justify-content: center;
            font-size: 16px;
            padding: 14px 16px;
          }
          .card { padding: 18px; }
        }
          .big-pct { font-size: 40px; }
          .ballot-big { font-size: 28px; }
        }
      `}</style>

      <div className="wrap">
        <div className="grid-top">
          <div className="card">
            <div className="candidate-grid">
              <div>
                <div className="sigla" style={{ color: "#f97316" }}>PATRIA-UNIDOS</div>
                <div className="nombre">JESÚS EGUEZ RIVERO</div>
                <div className="big-pct" style={{ color: "#f97316" }}>{fmtPct(resultado.izquierdaPct)}</div>
                <div className="votes">{fmtInt.format(resultado.izquierda)} votos</div>
              </div>
              <div>
                <div className="sigla" style={{ color: "#ec4899" }}>MNR</div>
                <div className="nombre">HUGO VARGAS ROCA</div>
                <div className="big-pct" style={{ color: "#ec4899" }}>{fmtPct(resultado.derechaPct)}</div>
                <div className="votes">{fmtInt.format(resultado.derecha)} votos</div>
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <div className="row-between small muted" style={{ fontWeight: 800 }}>
                <span>Distribución total simulada (primera vuelta)</span>
                <span>{resultado.ganador === "EMPATE" ? "Empate técnico" : `Ventaja: ${fmtInt.format(Math.abs(resultado.margen))} votos`}</span>
              </div>
              <div className="bar-wrap" style={{ marginTop: 8 }}>
                <div className="bar" style={{ width: `${resultado.izquierdaPct}%`, background: "#f97316" }} />
                <div className="bar" style={{ width: `${resultado.derechaPct}%`, background: "#ec4899" }} />
                <div className="bar" style={{ width: `${resultado.noAsignadoPct}%`, background: "#9ca3af" }} />
              </div>
              <div className="legend-grid" style={{ marginTop: 10 }}>
                <div className="pill">PATRIA-UNIDOS: {fmtPct(resultado.izquierdaPct)}</div>
                <div className="pill">MNR: {fmtPct(resultado.derechaPct)}</div>
                <div className="pill">No asignado: {fmtPct(resultado.noAsignadoPct)}</div>
              </div>
            </div>

            <div className="ballot-box">
              <div className="row-between small muted" style={{ fontWeight: 800 }}>
                <span>Cómputo final del balotaje</span>
                <span>{resultado.ganador === "EMPATE" ? "Empate técnico" : `Ventaja: ${fmtInt.format(Math.abs(resultado.margen))} votos válidos`}</span>
              </div>
              <div className="ballot-grid" style={{ marginTop: 12 }}>
                <div>
                  <div className="small" style={{ fontWeight: 800, color: "#f97316" }}>PATRIA-UNIDOS</div>
                  <div className="ballot-big" style={{ color: "#f97316" }}>{fmtPct(resultado.izquierdaBalotajePct)}</div>
                </div>
                <div>
                  <div className="small" style={{ fontWeight: 800, color: "#ec4899" }}>MNR</div>
                  <div className="ballot-big" style={{ color: "#ec4899" }}>{fmtPct(resultado.derechaBalotajePct)}</div>
                </div>
              </div>
              <div className="bar-wrap" style={{ marginTop: 12 }}>
                <div className="bar" style={{ width: `${resultado.izquierdaBalotajePct}%`, background: "#f97316" }} />
                <div className="bar" style={{ width: `${resultado.derechaBalotajePct}%`, background: "#ec4899" }} />
              </div>
              <div className="legend-grid" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 10 }}>
                <div className="pill">PATRIA-UNIDOS: {fmtPct(resultado.izquierdaBalotajePct)}</div>
                <div className="pill">MNR: {fmtPct(resultado.derechaBalotajePct)}</div>
              </div>
              <div className="tiny muted" style={{ textAlign: "center", marginTop: 10 }}>
                Este resultado se calcula únicamente sobre los votos válidos asignados a ambos finalistas, sin incluir el voto no asignado.
              </div>
            </div>
          </div>

          <div className="card">
            <div className="row-between">
              <div>
                <div className="section-title" style={{ margin: 0 }}>Resumen del escenario</div>
                <div className="tiny muted">Primera vuelta + transferencias simuladas</div>
              </div>
              <div className="badge" style={{ background: resultado.ganador === FINALISTAS.derecha.sigla ? FINALISTAS.derecha.color : resultado.ganador === FINALISTAS.izquierda.sigla ? FINALISTAS.izquierda.color : "#71717a" }}>
                {resultado.ganador}
              </div>
            </div>

            <div className="stats-grid" style={{ marginTop: 14 }}>
              <div className="mini-box">
                <div className="small muted">No asignado</div>
                <div className="value muted">{fmtPct(resultado.noAsignadoPct)}</div>
                <div className="small">{fmtInt.format(resultado.noAsignado)} votos</div>
              </div>
              <div className="mini-box">
                <div className="small muted">Margen</div>
                <div className="value">{fmtInt.format(Math.abs(resultado.margen))}</div>
                <div className="small">{resultado.margen === 0 ? "Empate" : `a favor de ${resultado.ganador}`}</div>
              </div>
            </div>

            <div className="dashed tiny muted" style={{ marginTop: 14 }}>
              El simulador parte desde la primera vuelta real: 36,56% para PATRIA-UNIDOS y 20,12% para MNR. En el bloque superior, el cómputo final del balotaje se recalcula solo sobre los votos que terminan en uno de los dos finalistas.
            </div>

            <div className="actions" style={{ marginTop: 14 }}>
              <button className="outline" onClick={reset}>Resetear</button>
              <button className="outline" onClick={saveScenario}>Guardar escenario</button>
              <button onClick={exportJSON}>Exportar JSON</button>
              <button className="secondary" onClick={exportCSV}>Exportar CSV</button>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: 16 }}>
          <div className="section-title">Escenarios rápidos</div>
          <div className="presets">
            {Object.entries(PRESETS).map(([key, preset]) => (
              <button key={key} className="outline" onClick={() => applyPreset(preset)}>{preset.nombre}</button>
            ))}
          </div>
          <div className="presets" style={{ marginTop: 8 }}>
            {saved.map((item, i) => (
              <button key={`${item.nombre}-${i}`} className="secondary" onClick={() => applyPreset(item)}>{item.nombre}</button>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginTop: 16 }}>
          <div className="section-title">Retención PATRIA-UNIDOS</div>
          <div className="slider-head">
            <span style={{ color: "#f97316" }}>{retencionIzquierda}%</span>
            <span style={{ color: "#f97316" }}>{100 - retencionIzquierda}%</span>
          </div>
          <Range min={0} max={100} step={1} value={retencionIzquierda} onChange={setRetencionIzquierda} />
          <div className="tiny muted">Porcentaje de su propio voto que conserva en segunda vuelta</div>
        </div>

        <div className="card" style={{ marginTop: 16 }}>
          <div className="section-title">Retención MNR</div>
          <div className="slider-head">
            <span style={{ color: "#ec4899" }}>{retencionDerecha}%</span>
            <span style={{ color: "#ec4899" }}>{100 - retencionDerecha}%</span>
          </div>
          <Range min={0} max={100} step={1} value={retencionDerecha} onChange={setRetencionDerecha} />
          <div className="tiny muted">Porcentaje de su propio voto que conserva en segunda vuelta</div>
        </div>

        <div className="sources-grid">
          {FUENTES.map((fuente) => (
            <SourceCard
              key={fuente.key}
              fuente={fuente}
              cfg={fuentes[fuente.key]}
              onLeftChange={(left) => setFuentes((prev) => ({ ...prev, [fuente.key]: { ...prev[fuente.key], left } }))}
              onTurnoutChange={(turnout) => setFuentes((prev) => ({ ...prev, [fuente.key]: { ...prev[fuente.key], turnout } }))}
            />
          ))}
        </div>

        <div className="card" style={{ marginTop: 16 }}>
          <div className="footer-note">Votos válidos primera vuelta: <b>{fmtInt.format(VOTOS_VALIDOS)}</b> · Blancos: <b>{fmtInt.format(VOTOS_BLANCOS)}</b> · Nulos: <b>{fmtInt.format(VOTOS_NULOS)}</b></div>
          <div className="footer-note" style={{ marginTop: 8 }}>Emitidos: <b>{fmtInt.format(VOTOS_EMITIDOS)}</b> · Ausentes: <b>{fmtInt.format(AUSENTES)}</b> · Padrón: <b>{fmtInt.format(PADRON)}</b></div>
        </div>
      </div>
    </>
  );
}
