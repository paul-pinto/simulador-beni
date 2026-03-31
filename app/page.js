<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Simulador de balotaje - Beni</title>
  <style>
    :root {
      --bg: #efefef;
      --card: #ffffff;
      --text: #18181b;
      --muted: #71717a;
      --line: #e4e4e7;
      --orange: #f97316;
      --pink: #ec4899;
      --gray: #9ca3af;
      --shadow: 0 10px 30px rgba(0,0,0,.08);
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
    .sigla { font-size: 18px; font-weight: 800; }
    .nombre { font-size: 12px; font-weight: 700; color: #3f3f46; }
    .big-pct { font-size: 50px; font-weight: 900; line-height: 1; margin-top: 4px; }
    .votes { font-size: 15px; }
    .muted { color: var(--muted); }
    .small { font-size: 12px; }
    .tiny { font-size: 11px; }
    .section-title { font-size: 14px; font-weight: 800; margin-bottom: 10px; }
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
      border: 0;
      background: #111827;
      color: white;
      padding: 10px 14px;
      border-radius: 14px;
      cursor: pointer;
      font-weight: 700;
    }
    button.secondary {
      background: #e4e4e7;
      color: #111827;
    }
    button.outline {
      background: white;
      color: #111827;
      border: 1px solid #d4d4d8;
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
    .source .name { font-size: 11px; font-weight: 700; color: #3f3f46; }
    .source .votes-label { font-size: 12px; color: #52525b; }
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
    .ballot-big { font-size: 34px; font-weight: 900; line-height: 1; margin-top: 4px; }
    .footer-note {
      text-align: center;
      font-size: 13px;
      color: #3f3f46;
    }
    @media (max-width: 900px) {
      .grid-top, .sources-grid, .stats-grid, .legend-grid, .candidate-grid, .ballot-grid { grid-template-columns: 1fr; }
      .big-pct { font-size: 40px; }
      .ballot-big { font-size: 28px; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="grid-top">
      <div class="card">
        <div class="candidate-grid">
          <div>
            <div class="sigla" style="color:#f97316">PATRIA-UNIDOS</div>
            <div class="nombre">JESÚS EGUEZ RIVERO</div>
            <div class="big-pct" id="pct-izq" style="color:#f97316">36,6%</div>
            <div class="votes" id="votes-izq">70.729 votos</div>
          </div>
          <div>
            <div class="sigla" style="color:#ec4899">MNR</div>
            <div class="nombre">HUGO VARGAS ROCA</div>
            <div class="big-pct" id="pct-der" style="color:#ec4899">20,1%</div>
            <div class="votes" id="votes-der">38.927 votos</div>
          </div>
        </div>

        <div style="margin-top:18px">
          <div class="row-between small muted" style="font-weight:800">
            <span>Distribución total simulada (primera vuelta)</span>
            <span id="ventaja">Ventaja: 31.802 votos</span>
          </div>
          <div class="bar-wrap" style="margin-top:8px">
            <div id="bar-izq" class="bar" style="width:36.56%; background:#f97316"></div>
            <div id="bar-der" class="bar" style="width:20.12%; background:#ec4899"></div>
            <div id="bar-na" class="bar" style="width:43.32%; background:#9ca3af"></div>
          </div>
          <div class="legend-grid" style="margin-top:10px">
            <div class="pill" id="legend-izq">PATRIA-UNIDOS: 36,6%</div>
            <div class="pill" id="legend-der">MNR: 20,1%</div>
            <div class="pill" id="legend-na">No asignado: 43,3%</div>
          </div>
        </div>

        <div class="ballot-box">
          <div class="row-between small muted" style="font-weight:800">
            <span>Cómputo final del balotaje</span>
            <span id="ventaja-balotaje">Ventaja: 31.802 votos válidos</span>
          </div>
          <div class="ballot-grid" style="margin-top:12px">
            <div>
              <div class="small" style="font-weight:800;color:#f97316">PATRIA-UNIDOS</div>
              <div class="ballot-big" id="pct-balotaje-izq" style="color:#f97316">64,5%</div>
            </div>
            <div>
              <div class="small" style="font-weight:800;color:#ec4899">MNR</div>
              <div class="ballot-big" id="pct-balotaje-der" style="color:#ec4899">35,5%</div>
            </div>
          </div>
          <div class="bar-wrap" style="margin-top:12px">
            <div id="bar-balotaje-izq" class="bar" style="width:64.5%; background:#f97316"></div>
            <div id="bar-balotaje-der" class="bar" style="width:35.5%; background:#ec4899"></div>
          </div>
          <div class="legend-grid" style="grid-template-columns:1fr 1fr; margin-top:10px">
            <div class="pill" id="legend-balotaje-izq">PATRIA-UNIDOS: 64,5%</div>
            <div class="pill" id="legend-balotaje-der">MNR: 35,5%</div>
          </div>
          <div class="tiny muted" style="text-align:center; margin-top:10px">
            Este resultado se calcula únicamente sobre los votos válidos asignados a ambos finalistas, sin incluir el voto no asignado.
          </div>
        </div>
      </div>

      <div class="card">
        <div class="row-between">
          <div>
            <div class="section-title" style="margin:0">Resumen del escenario</div>
            <div class="tiny muted">Primera vuelta + transferencias simuladas</div>
          </div>
          <div id="winner-badge" class="badge" style="background:#f97316">PATRIA-UNIDOS</div>
        </div>

        <div class="stats-grid" style="margin-top:14px">
          <div class="mini-box">
            <div class="small muted">No asignado</div>
            <div class="value muted" id="na-pct">43,3%</div>
            <div class="small" id="na-votes">83.817 votos</div>
          </div>
          <div class="mini-box">
            <div class="small muted">Margen</div>
            <div class="value" id="margen-votes">31.802</div>
            <div class="small" id="margen-label">a favor de PATRIA-UNIDOS</div>
          </div>
        </div>

        <div class="dashed tiny muted" style="margin-top:14px">
          El simulador parte desde la primera vuelta real: 36,56% para PATRIA-UNIDOS y 20,12% para MNR. En el bloque superior, el cómputo final del balotaje se recalcula solo sobre los votos que terminan en uno de los dos finalistas.
        </div>

        <div class="actions" style="margin-top:14px">
          <button class="outline" id="btn-reset">Resetear</button>
          <button class="outline" id="btn-save">Guardar escenario</button>
          <button id="btn-json">Exportar JSON</button>
          <button class="secondary" id="btn-csv">Exportar CSV</button>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="section-title">Escenarios rápidos</div>
      <div class="presets">
        <button class="outline" data-preset="optimista_eguez">Escenario optimista Egüez</button>
        <button class="outline" data-preset="competitivo">Escenario competitivo</button>
        <button class="outline" data-preset="optimista_mnr">Escenario optimista MNR</button>
      </div>
      <div id="saved-presets" class="presets" style="margin-top:8px"></div>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="section-title">Retención PATRIA-UNIDOS</div>
      <div class="slider-head">
        <span style="color:#f97316" id="ret-izq-left">100%</span>
        <span style="color:#f97316">0%</span>
      </div>
      <input id="retencion-izquierda" type="range" min="0" max="100" step="1" value="100" />
      <div class="tiny muted">Porcentaje de su propio voto que conserva en segunda vuelta</div>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="section-title">Retención MNR</div>
      <div class="slider-head">
        <span style="color:#ec4899" id="ret-der-left">100%</span>
        <span style="color:#ec4899">0%</span>
      </div>
      <input id="retencion-derecha" type="range" min="0" max="100" step="1" value="100" />
      <div class="tiny muted">Porcentaje de su propio voto que conserva en segunda vuelta</div>
    </div>

    <div class="sources-grid" id="sources-grid"></div>

    <div class="card" style="margin-top:16px">
      <div class="footer-note">Votos válidos primera vuelta: <b>193.473</b> · Blancos: <b>29.377</b> · Nulos: <b>12.101</b></div>
      <div class="footer-note" style="margin-top:8px">Emitidos: <b>234.951</b> · Ausentes: <b>54.446</b> · Padrón: <b>289.397</b></div>
    </div>
  </div>

  <script>
    const PADRON = 289397;
    const VOTOS_VALIDOS = 193473;
    const VOTOS_BLANCOS = 29377;
    const VOTOS_NULOS = 12101;
    const VOTOS_EMITIDOS = 234951;
    const AUSENTES = PADRON - VOTOS_EMITIDOS;

    const FINALISTAS = {
      izquierda: { sigla: 'PATRIA-UNIDOS', nombre: 'JESÚS EGUEZ RIVERO', votos: 70729, color: '#f97316' },
      derecha: { sigla: 'MNR', nombre: 'HUGO VARGAS ROCA', votos: 38927, color: '#ec4899' },
    };

    const FUENTES = [
      { key: 'tufe', sigla: 'TUFE', nombre: 'MIGUEL RIVERO BALCAZAR', votos: 26574, color: '#1c87b0', defaultLeft: 50, turnoutDefault: 0 },
      { key: 'aupp', sigla: 'A-UPP', nombre: 'MARIO ALBERTO ALMEIDA SALAS', votos: 6818, color: '#e1c34a', defaultLeft: 50, turnoutDefault: 0 },
      { key: 'mts', sigla: 'MTS', nombre: 'CASTA KARINA SALINAS CURY', votos: 8408, color: '#8b4513', defaultLeft: 50, turnoutDefault: 0 },
      { key: 'despierta', sigla: 'DESPIERTA', nombre: 'ALEJANDRO UNZUETA SHIRIQUI', votos: 30835, color: '#16a34a', defaultLeft: 50, turnoutDefault: 0 },
      { key: 'cpemb', sigla: 'CPEM-B', nombre: 'CONSUELO NUÑEZ MOLINA', votos: 7048, color: '#eab308', defaultLeft: 50, turnoutDefault: 0 },
      { key: 'ngp', sigla: 'NGP', nombre: 'LUIS PEDRIEL CALLEJA', votos: 4134, color: '#38bdf8', defaultLeft: 50, turnoutDefault: 0 },
      { key: 'blancos', sigla: 'BLANCOS', nombre: 'VOTOS BLANCOS', votos: VOTOS_BLANCOS, color: '#9ca3af', defaultLeft: 50, turnoutDefault: 0 },
      { key: 'nulos', sigla: 'NULOS', nombre: 'VOTOS NULOS', votos: VOTOS_NULOS, color: '#6b7280', defaultLeft: 50, turnoutDefault: 0 },
      { key: 'ausentes', sigla: 'AUSENTES', nombre: 'NO VOTARON EN PRIMERA VUELTA', votos: AUSENTES, color: '#4b5563', defaultLeft: 50, turnoutDefault: 0, wide: true },
    ];

    const PRESETS = {
      optimista_eguez: {
        nombre: 'Escenario optimista Egüez', retencionIzquierda: 96, retencionDerecha: 90,
        fuentes: { tufe:{left:62,turnout:78}, aupp:{left:55,turnout:65}, mts:{left:72,turnout:70}, despierta:{left:46,turnout:74}, cpemb:{left:58,turnout:60}, ngp:{left:60,turnout:52}, blancos:{left:52,turnout:24}, nulos:{left:50,turnout:14}, ausentes:{left:54,turnout:12} }
      },
      competitivo: {
        nombre: 'Escenario competitivo', retencionIzquierda: 94, retencionDerecha: 94,
        fuentes: { tufe:{left:52,turnout:72}, aupp:{left:50,turnout:62}, mts:{left:60,turnout:65}, despierta:{left:48,turnout:70}, cpemb:{left:51,turnout:56}, ngp:{left:52,turnout:48}, blancos:{left:50,turnout:18}, nulos:{left:50,turnout:10}, ausentes:{left:50,turnout:10} }
      },
      optimista_mnr: {
        nombre: 'Escenario optimista MNR', retencionIzquierda: 90, retencionDerecha: 96,
        fuentes: { tufe:{left:38,turnout:78}, aupp:{left:44,turnout:65}, mts:{left:42,turnout:68}, despierta:{left:36,turnout:76}, cpemb:{left:45,turnout:62}, ngp:{left:40,turnout:54}, blancos:{left:46,turnout:24}, nulos:{left:46,turnout:14}, ausentes:{left:44,turnout:12} }
      }
    };

    function fmtInt(n) { return new Intl.NumberFormat('es-BO').format(n); }
    function fmtPct(n) { return n.toFixed(1).replace('.', ',') + '%'; }
    function buildDefaultFuentes() {
      const out = {};
      FUENTES.forEach(f => out[f.key] = { left: f.defaultLeft, turnout: f.turnoutDefault });
      return out;
    }

    const state = {
      retencionIzquierda: 100,
      retencionDerecha: 100,
      fuentes: buildDefaultFuentes(),
      saved: []
    };

    function resultadoActual() {
      const baseIzquierdaRetenida = Math.round(FINALISTAS.izquierda.votos * (state.retencionIzquierda / 100));
      const baseDerechaRetenida = Math.round(FINALISTAS.derecha.votos * (state.retencionDerecha / 100));
      let izquierda = baseIzquierdaRetenida;
      let derecha = baseDerechaRetenida;
      let noAsignado = (FINALISTAS.izquierda.votos - baseIzquierdaRetenida) + (FINALISTAS.derecha.votos - baseDerechaRetenida);

      FUENTES.forEach((fuente) => {
        const cfg = state.fuentes[fuente.key];
        const transferidos = Math.round(fuente.votos * (cfg.turnout / 100));
        const haciaIzquierda = Math.round(transferidos * (cfg.left / 100));
        const haciaDerecha = transferidos - haciaIzquierda;
        izquierda += haciaIzquierda;
        derecha += haciaDerecha;
        if (!['blancos', 'nulos', 'ausentes'].includes(fuente.key)) {
          noAsignado += fuente.votos - transferidos;
        }
      });

      const total = izquierda + derecha + noAsignado;
      const margen = izquierda - derecha;
      const validosBalotaje = izquierda + derecha;
      return {
        izquierda, derecha, noAsignado, total, margen, validosBalotaje,
        ganador: margen > 0 ? FINALISTAS.izquierda.sigla : margen < 0 ? FINALISTAS.derecha.sigla : 'EMPATE',
        izquierdaPct: total ? (izquierda / total) * 100 : 0,
        derechaPct: total ? (derecha / total) * 100 : 0,
        noAsignadoPct: total ? (noAsignado / total) * 100 : 0,
        izquierdaBalotajePct: validosBalotaje ? (izquierda / validosBalotaje) * 100 : 0,
        derechaBalotajePct: validosBalotaje ? (derecha / validosBalotaje) * 100 : 0,
      };
    }

    function downloadFile(filename, content, type) {
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    function renderSaved() {
      const container = document.getElementById('saved-presets');
      container.innerHTML = '';
      state.saved.forEach((item) => {
        const btn = document.createElement('button');
        btn.className = 'secondary';
        btn.textContent = item.nombre;
        btn.onclick = () => {
          state.retencionIzquierda = item.retencionIzquierda;
          state.retencionDerecha = item.retencionDerecha;
          state.fuentes = JSON.parse(JSON.stringify(item.fuentes));
          syncInputs();
          update();
        };
        container.appendChild(btn);
      });
    }

    function renderSources() {
      const grid = document.getElementById('sources-grid');
      grid.innerHTML = '';
      FUENTES.forEach((fuente) => {
        const cfg = state.fuentes[fuente.key];
        const transferidos = Math.round(fuente.votos * (cfg.turnout / 100));
        const izq = Math.round(transferidos * (cfg.left / 100));
        const der = transferidos - izq;

        const card = document.createElement('div');
        card.className = 'source' + (fuente.wide ? ' full' : '');
        card.innerHTML = `
          <div class="sigla" style="font-size:15px;color:${fuente.color}">${fuente.sigla}</div>
          <div class="name">${fuente.nombre}</div>
          <div class="votes-label">(${fmtInt(fuente.votos)} votos)</div>

          <div class="slider-head" style="margin-top:10px">
            <span style="color:${FINALISTAS.izquierda.color}">${Math.round(cfg.left)}%</span>
            <span style="color:${FINALISTAS.derecha.color}">${Math.round(100 - cfg.left)}%</span>
          </div>
          <input type="range" min="0" max="100" step="1" value="${cfg.left}" data-type="left" data-key="${fuente.key}" />

          <div class="row-between votes-label" style="margin-top:8px;font-size:12px;color:#3f3f46">
            <span>${fmtInt(izq)}</span>
            <span>${fmtInt(der)}</span>
          </div>

          <div class="tiny" style="margin-top:10px;font-weight:800;color:#3f3f46">Concurrencia</div>
          <div class="turnout-row">
            <span>0%</span>
            <input type="range" min="0" max="100" step="1" value="${cfg.turnout}" data-type="turnout" data-key="${fuente.key}" />
            <span>100%</span>
          </div>
        `;
        grid.appendChild(card);
      });

      grid.querySelectorAll('input[type="range"]').forEach((input) => {
        input.addEventListener('input', (e) => {
          const key = e.target.dataset.key;
          const type = e.target.dataset.type;
          state.fuentes[key][type] = Number(e.target.value);
          update();
        });
      });
    }

    function syncInputs() {
      document.getElementById('retencion-izquierda').value = state.retencionIzquierda;
      document.getElementById('retencion-derecha').value = state.retencionDerecha;
    }

    function update() {
      const r = resultadoActual();
      document.getElementById('pct-izq').textContent = fmtPct(r.izquierdaPct);
      document.getElementById('pct-der').textContent = fmtPct(r.derechaPct);
      document.getElementById('votes-izq').textContent = fmtInt(r.izquierda) + ' votos';
      document.getElementById('votes-der').textContent = fmtInt(r.derecha) + ' votos';
      document.getElementById('bar-izq').style.width = r.izquierdaPct + '%';
      document.getElementById('bar-der').style.width = r.derechaPct + '%';
      document.getElementById('bar-na').style.width = r.noAsignadoPct + '%';
      document.getElementById('legend-izq').textContent = FINALISTAS.izquierda.sigla + ': ' + fmtPct(r.izquierdaPct);
      document.getElementById('legend-der').textContent = FINALISTAS.derecha.sigla + ': ' + fmtPct(r.derechaPct);
      document.getElementById('legend-na').textContent = 'No asignado: ' + fmtPct(r.noAsignadoPct);
      document.getElementById('na-pct').textContent = fmtPct(r.noAsignadoPct);
      document.getElementById('na-votes').textContent = fmtInt(r.noAsignado) + ' votos';
      document.getElementById('margen-votes').textContent = fmtInt(Math.abs(r.margen));
      document.getElementById('margen-label').textContent = r.margen === 0 ? 'Empate' : 'a favor de ' + r.ganador;
      document.getElementById('winner-badge').textContent = r.ganador;
      document.getElementById('winner-badge').style.backgroundColor = r.ganador === FINALISTAS.derecha.sigla ? FINALISTAS.derecha.color : r.ganador === FINALISTAS.izquierda.sigla ? FINALISTAS.izquierda.color : '#71717a';
      document.getElementById('ventaja').textContent = r.ganador === 'EMPATE' ? 'Empate técnico' : 'Ventaja: ' + fmtInt(Math.abs(r.margen)) + ' votos';
      document.getElementById('ret-izq-left').textContent = state.retencionIzquierda + '%';
      document.getElementById('ret-der-left').textContent = state.retencionDerecha + '%';

      document.getElementById('pct-balotaje-izq').textContent = fmtPct(r.izquierdaBalotajePct);
      document.getElementById('pct-balotaje-der').textContent = fmtPct(r.derechaBalotajePct);
      document.getElementById('bar-balotaje-izq').style.width = r.izquierdaBalotajePct + '%';
      document.getElementById('bar-balotaje-der').style.width = r.derechaBalotajePct + '%';
      document.getElementById('legend-balotaje-izq').textContent = FINALISTAS.izquierda.sigla + ': ' + fmtPct(r.izquierdaBalotajePct);
      document.getElementById('legend-balotaje-der').textContent = FINALISTAS.derecha.sigla + ': ' + fmtPct(r.derechaBalotajePct);
      document.getElementById('ventaja-balotaje').textContent = r.ganador === 'EMPATE' ? 'Empate técnico' : 'Ventaja: ' + fmtInt(Math.abs(r.margen)) + ' votos válidos';

      renderSources();
    }

    document.getElementById('retencion-izquierda').addEventListener('input', (e) => {
      state.retencionIzquierda = Number(e.target.value);
      update();
    });
    document.getElementById('retencion-derecha').addEventListener('input', (e) => {
      state.retencionDerecha = Number(e.target.value);
      update();
    });

    document.getElementById('btn-reset').addEventListener('click', () => {
      state.retencionIzquierda = 100;
      state.retencionDerecha = 100;
      state.fuentes = buildDefaultFuentes();
      syncInputs();
      update();
    });

    document.getElementById('btn-save').addEventListener('click', () => {
      state.saved.push({
        nombre: 'Escenario ' + (state.saved.length + 1),
        retencionIzquierda: state.retencionIzquierda,
        retencionDerecha: state.retencionDerecha,
        fuentes: JSON.parse(JSON.stringify(state.fuentes)),
      });
      state.saved = state.saved.slice(-6);
      renderSaved();
    });

    document.getElementById('btn-json').addEventListener('click', () => {
      const r = resultadoActual();
      downloadFile('simulacion-beni-balotaje.json', JSON.stringify({
        metadata: { padron: PADRON, votos_validos: VOTOS_VALIDOS, votos_blancos: VOTOS_BLANCOS, votos_nulos: VOTOS_NULOS, votos_emitidos: VOTOS_EMITIDOS },
        finalistas: FINALISTAS,
        configuracion: { retencionIzquierda: state.retencionIzquierda, retencionDerecha: state.retencionDerecha, fuentes: state.fuentes },
        resultado: r
      }, null, 2), 'application/json;charset=utf-8');
    });

    document.getElementById('btn-csv').addEventListener('click', () => {
      const r = resultadoActual();
      const rows = [
        ['Campo','Valor'],
        ['Ganador',r.ganador],
        ['PATRIA-UNIDOS votos',r.izquierda],
        ['PATRIA-UNIDOS porcentaje primera vuelta',r.izquierdaPct.toFixed(2)],
        ['PATRIA-UNIDOS porcentaje balotaje',r.izquierdaBalotajePct.toFixed(2)],
        ['MNR votos',r.derecha],
        ['MNR porcentaje primera vuelta',r.derechaPct.toFixed(2)],
        ['MNR porcentaje balotaje',r.derechaBalotajePct.toFixed(2)],
        ['No asignado votos',r.noAsignado],
        ['No asignado porcentaje',r.noAsignadoPct.toFixed(2)],
        ['Margen',r.margen]
      ];
      downloadFile('simulacion-beni-balotaje.csv', rows.map(r => r.join(',')).join('\n'), 'text/csv;charset=utf-8');
    });

    document.querySelectorAll('[data-preset]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const preset = PRESETS[btn.dataset.preset];
        state.retencionIzquierda = preset.retencionIzquierda;
        state.retencionDerecha = preset.retencionDerecha;
        state.fuentes = JSON.parse(JSON.stringify(preset.fuentes));
        syncInputs();
        update();
      });
    });

    update();
  </script>
</body>
</html>
