/* ==========================================================================
   OmniPulse BI Control Center - Application Logic & Realtime Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Global State
  const state = {
    isLive: true,
    theme: 'cyan',
    activeTab: 'overview',
    timeRange: '24h',
    updateInterval: null,
    metrics: {
      revenue: 4892150,
      users: 148920,
      conversion: 3.84,
      rps: 42.8
    },
    predictive: {
      rdBoost: 25,
      churn: 1.2,
      expansion: 1.8
    },
    charts: {}
  };

  // DOM Elements
  const DOM = {
    navItems: document.querySelectorAll('.nav-item'),
    tabPanels: document.querySelectorAll('.tab-panel'),
    themePickerBtn: document.getElementById('themePickerBtn'),
    themeMenu: document.getElementById('themeMenu'),
    themeOptions: document.querySelectorAll('.theme-option'),
    liveToggleBtn: document.getElementById('liveStreamToggle'),
    liveStatusText: document.getElementById('liveStatusText'),
    timeBtns: document.querySelectorAll('.time-btn'),
    tickerList: document.getElementById('tickerStreamList'),
    exportBtn: document.getElementById('exportReportBtn'),
    toastContainer: document.getElementById('toastContainer'),
    sidebarToggleBtn: document.getElementById('sidebarToggleBtn'),
    sidebar: document.getElementById('mainSidebar'),

    // KPIs
    kpiRevenue: document.getElementById('kpiRevenue'),
    kpiUsers: document.getElementById('kpiUsers'),
    kpiConversion: document.getElementById('kpiConversion'),
    kpiRps: document.getElementById('kpiRps'),

    // Predictive Controls
    sliderRd: document.getElementById('sliderRd'),
    sliderRdVal: document.getElementById('sliderRdVal'),
    sliderChurn: document.getElementById('sliderChurn'),
    sliderChurnVal: document.getElementById('sliderChurnVal'),
    sliderExpansion: document.getElementById('sliderExpansion'),
    sliderExpansionVal: document.getElementById('sliderExpansionVal'),

    // SQL Studio
    presetQuerySelect: document.getElementById('presetQuerySelect'),
    sqlCodeInput: document.getElementById('sqlCodeInput'),
    runQueryBtn: document.getElementById('runQueryBtn'),
    sqlTableHead: document.getElementById('sqlTableHead'),
    sqlTableBody: document.getElementById('sqlTableBody'),
    tableFilterInput: document.getElementById('tableFilterInput'),
    exportCsvBtn: document.getElementById('exportCsvBtn'),

    // Geospatial
    geoTableBody: document.getElementById('geoTableBody'),

    // Alerts
    alertsList: document.getElementById('alertsFeedList'),
    clearAlertsBtn: document.getElementById('clearAlertsBtn')
  };

  /* ==========================================
     1. INITIALIZATION & TAB NAVIGATION
     ========================================== */
  function init() {
    setupTabNavigation();
    setupThemePicker();
    setupControls();
    initCharts();
    initSparklines();
    initGeospatialData();
    initSqlLab();
    initAlerts();
    startRealtimeEngine();
    showToast('OmniPulse BI Command Engine v3.4 Active', 'info');
  }

  function setupTabNavigation() {
    DOM.navItems.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        DOM.navItems.forEach(b => b.classList.remove('active'));
        DOM.tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const activePanel = document.getElementById(`panel-${targetTab}`);
        if (activePanel) {
          activePanel.classList.add('active');
          state.activeTab = targetTab;
        }

        // Close mobile sidebar on navigation
        if (window.innerWidth <= 1024) {
          DOM.sidebar.classList.remove('open');
        }
      });
    });

    if (DOM.sidebarToggleBtn) {
      DOM.sidebarToggleBtn.addEventListener('click', () => {
        DOM.sidebar.classList.toggle('open');
      });
    }
  }

  /* ==========================================
     2. THEME & COLOR MANAGEMENT
     ========================================== */
  function setupThemePicker() {
    DOM.themePickerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      DOM.themeMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      DOM.themeMenu.classList.remove('show');
    });

    DOM.themeOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        const selectedTheme = opt.getAttribute('data-set-theme');
        document.documentElement.setAttribute('data-theme', selectedTheme);
        state.theme = selectedTheme;

        DOM.themeOptions.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');

        // Update charts colors on theme change
        updateChartColors();
        showToast(`Accent Palette updated to ${selectedTheme.toUpperCase()}`, 'success');
      });
    });
  }

  function getAccentColor() {
    const style = getComputedStyle(document.documentElement);
    return style.getPropertyValue('--color-accent').trim() || '#06b6d4';
  }

  /* ==========================================
     3. HIGH-PERFORMANCE CHART ENGINE
     ========================================== */
  function initCharts() {
    // 1. Main Velocity Line Chart
    const ctxVelocity = document.getElementById('mainVelocityChart').getContext('2d');
    
    const gradRevenue = ctxVelocity.createLinearGradient(0, 0, 0, 300);
    gradRevenue.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
    gradRevenue.addColorStop(1, 'rgba(6, 182, 212, 0.0)');

    const gradVolume = ctxVelocity.createLinearGradient(0, 0, 0, 300);
    gradVolume.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
    gradVolume.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

    state.charts.velocity = new Chart(ctxVelocity, {
      type: 'line',
      data: {
        labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', 'Now'],
        datasets: [
          {
            label: 'Revenue ($)',
            data: [3200, 4100, 3800, 6200, 7800, 8900, 9400, 11200, 12800],
            borderColor: '#06b6d4',
            backgroundColor: gradRevenue,
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 4,
            pointHoverRadius: 7
          },
          {
            label: 'Event Volume (k)',
            data: [120, 140, 135, 210, 290, 340, 380, 410, 450],
            borderColor: '#6366f1',
            backgroundColor: gradVolume,
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 12 } } },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            borderWidth: 1,
            padding: 12,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 }
          }
        },
        scales: {
          x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b' } },
          y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b' } }
        }
      }
    });

    // 2. Tier Split Doughnut Chart
    const ctxTier = document.getElementById('tierSplitChart').getContext('2d');
    state.charts.tier = new Chart(ctxTier, {
      type: 'doughnut',
      data: {
        labels: ['Enterprise Tier', 'Professional Tier', 'Community Tier'],
        datasets: [{
          data: [52, 34, 14],
          backgroundColor: ['#06b6d4', '#8b5cf6', '#10b981'],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '76%',
        plugins: {
          legend: { display: false }
        }
      }
    });

    renderTierLegend();

    // 3. Predictive AI Monte Carlo Chart
    const ctxPredict = document.getElementById('predictiveChart').getContext('2d');
    state.charts.predictive = new Chart(ctxPredict, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Historical ARR',
            data: [2.8, 3.1, 3.4, 3.8, 4.1, 4.5, null, null, null, null, null, null],
            borderColor: '#94a3b8',
            borderWidth: 2,
            pointRadius: 4
          },
          {
            label: 'AI Forecast (Baseline)',
            data: [null, null, null, null, null, 4.5, 4.9, 5.4, 6.1, 6.9, 7.8, 8.9],
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.15)',
            borderWidth: 3,
            fill: true,
            tension: 0.3
          },
          {
            label: '95% Upper Bound (Optimistic)',
            data: [null, null, null, null, null, 4.5, 5.2, 5.9, 6.8, 7.9, 9.2, 10.6],
            borderColor: '#10b981',
            borderDash: [4, 4],
            borderWidth: 1.5,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#94a3b8' } }
        },
        scales: {
          x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b' } },
          y: { 
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { 
              color: '#64748b',
              callback: (val) => `$${val}M`
            }
          }
        }
      }
    });
  }

  function renderTierLegend() {
    const legendContainer = document.getElementById('tierLegend');
    const data = state.charts.tier.data;
    let html = '';
    data.labels.forEach((label, i) => {
      const val = data.datasets[0].data[i];
      const color = data.datasets[0].backgroundColor[i];
      html += `
        <div class="legend-item">
          <div class="legend-left">
            <span class="legend-dot" style="background:${color}"></span>
            <span>${label}</span>
          </div>
          <span class="legend-val">${val}%</span>
        </div>
      `;
    });
    legendContainer.innerHTML = html;
  }

  function updateChartColors() {
    const accent = getAccentColor();
    if (state.charts.velocity) {
      state.charts.velocity.data.datasets[0].borderColor = accent;
      state.charts.velocity.update();
    }
    if (state.charts.predictive) {
      state.charts.predictive.data.datasets[1].borderColor = accent;
      state.charts.predictive.update();
    }
  }

  /* ==========================================
     4. MINI SPARKLINES (CANVAS)
     ========================================== */
  function initSparklines() {
    const sparklines = [
      { id: 'sparkRevenue', color: '#06b6d4', data: [12, 18, 14, 22, 28, 25, 34] },
      { id: 'sparkUsers', color: '#8b5cf6', data: [40, 45, 42, 58, 62, 70, 78] },
      { id: 'sparkConversion', color: '#10b981', data: [3.1, 3.2, 3.4, 3.5, 3.6, 3.7, 3.84] },
      { id: 'sparkRps', color: '#f59e0b', data: [30, 32, 28, 38, 41, 39, 42.8] }
    ];

    sparklines.forEach(item => {
      const cvs = document.getElementById(item.id);
      if (!cvs) return;
      const ctx = cvs.getContext('2d');
      const w = cvs.width = cvs.parentElement.clientWidth || 200;
      const h = cvs.height = 30;

      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();
      ctx.strokeStyle = item.color;
      ctx.lineWidth = 2;

      const min = Math.min(...item.data);
      const max = Math.max(...item.data);
      const step = w / (item.data.length - 1);

      item.data.forEach((val, idx) => {
        const x = idx * step;
        const y = h - ((val - min) / (max - min || 1)) * (h - 6) - 3;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.stroke();
    });
  }

  /* ==========================================
     5. PREDICTIVE SCENARIO SIMULATOR
     ========================================== */
  function setupControls() {
    // Predictive Sliders
    DOM.sliderRd.addEventListener('input', (e) => {
      state.predictive.rdBoost = e.target.value;
      DOM.sliderRdVal.textContent = `+${e.target.value}%`;
      recalculatePrediction();
    });

    DOM.sliderChurn.addEventListener('input', (e) => {
      state.predictive.churn = e.target.value;
      DOM.sliderChurnVal.textContent = `${e.target.value}%`;
      recalculatePrediction();
    });

    DOM.sliderExpansion.addEventListener('input', (e) => {
      state.predictive.expansion = e.target.value;
      DOM.sliderExpansionVal.textContent = `${e.target.value}x`;
      recalculatePrediction();
    });

    // Time Range selector
    DOM.timeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.timeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.timeRange = btn.getAttribute('data-range');
        showToast(`Time window updated to ${state.timeRange.toUpperCase()}`, 'info');
      });
    });

    // Live Stream Pause/Play Toggle
    DOM.liveToggleBtn.addEventListener('click', () => {
      state.isLive = !state.isLive;
      if (state.isLive) {
        DOM.liveToggleBtn.classList.add('active');
        DOM.liveToggleBtn.classList.remove('paused');
        DOM.liveStatusText.textContent = 'LIVE (2s)';
        showToast('Realtime Data Stream Resumed', 'success');
      } else {
        DOM.liveToggleBtn.classList.remove('active');
        DOM.liveToggleBtn.classList.add('paused');
        DOM.liveStatusText.textContent = 'PAUSED';
        showToast('Realtime Data Stream Paused', 'warning');
      }
    });

    // Export Report
    DOM.exportBtn.addEventListener('click', () => {
      showToast('Generating BI Report PDF/CSV bundle...', 'info');
      setTimeout(() => {
        showToast('Report Downloaded: OmniPulse_BI_Report.pdf', 'success');
      }, 1500);
    });

    // Auto-tune button
    const autoTuneBtn = document.getElementById('runAutoTuneBtn');
    if (autoTuneBtn) {
      autoTuneBtn.addEventListener('click', () => {
        showToast('Executing Index Re-build on `billing_logs_v2`...', 'info');
        setTimeout(() => {
          showToast('Index Optimized! Latency reduced by 18%', 'success');
        }, 1800);
      });
    }
  }

  function recalculatePrediction() {
    if (!state.charts.predictive) return;

    const rd = parseFloat(state.predictive.rdBoost);
    const churn = parseFloat(state.predictive.churn);
    const exp = parseFloat(state.predictive.expansion);

    const factor = 1 + (rd * 0.005) + (exp * 0.15) - (churn * 0.08);
    const baseVals = [4.5, 4.9, 5.4, 6.1, 6.9, 7.8, 8.9];

    const newForecast = baseVals.map(v => parseFloat((v * factor).toFixed(2)));
    const newUpper = newForecast.map(v => parseFloat((v * 1.18).toFixed(2)));

    state.charts.predictive.data.datasets[1].data = [null, null, null, null, null, ...newForecast];
    state.charts.predictive.data.datasets[2].data = [null, null, null, null, null, ...newUpper];
    state.charts.predictive.update();
  }

  /* ==========================================
     6. GEOSPATIAL REGIONAL BREAKDOWN
     ========================================== */
  function initGeospatialData() {
    const regions = [
      { name: 'US-East (N. Virginia)', status: 'Optimal', share: '38.4%', latency: '8ms', uptime: '99.99%' },
      { name: 'US-West (Oregon)', status: 'Optimal', share: '24.2%', latency: '12ms', uptime: '99.98%' },
      { name: 'EU-Central (Frankfurt)', status: 'Optimal', share: '21.0%', latency: '16ms', uptime: '99.95%' },
      { name: 'APAC (Tokyo)', status: 'Degraded', share: '11.8%', latency: '45ms', uptime: '99.82%' },
      { name: 'SA-East (São Paulo)', status: 'Optimal', share: '4.6%', latency: '68ms', uptime: '99.90%' }
    ];

    let html = '';
    regions.forEach(r => {
      const badgeClass = r.status === 'Optimal' ? 'badge-online' : 'badge-warning';
      html += `
        <tr>
          <td><strong>${r.name}</strong></td>
          <td><span class="badge ${badgeClass}">${r.status}</span></td>
          <td>${r.share}</td>
          <td><code>${r.latency}</code></td>
          <td>${r.uptime}</td>
        </tr>
      `;
    });
    DOM.geoTableBody.innerHTML = html;
  }

  /* ==========================================
     7. SQL QUERY STUDIO & TABLE FILTERING
     ========================================== */
  function initSqlLab() {
    const presets = {
      q1: `SELECT \n  c.customer_id,\n  c.company_name,\n  c.tier,\n  COUNT(t.transaction_id) AS monthly_tx_count,\n  ROUND(SUM(t.amount_usd), 2) AS total_revenue_usd,\n  AVG(t.execution_latency_ms) AS avg_latency_ms\nFROM telemetry_db.active_customers c\nJOIN telemetry_db.transactions_stream t ON c.customer_id = t.customer_id\nWHERE t.timestamp >= NOW() - INTERVAL '30 days'\nGROUP BY c.customer_id, c.company_name, c.tier\nHAVING SUM(t.amount_usd) > 25000\nORDER BY total_revenue_usd DESC\nLIMIT 50;`,
      q2: `SELECT \n  endpoint_path,\n  http_status,\n  COUNT(*) as request_count,\n  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time_ms) as p95_latency\nFROM telemetry_db.api_gateway_logs\nWHERE event_time >= NOW() - INTERVAL '1 hour'\nGROUP BY endpoint_path, http_status\nORDER BY request_count DESC;`,
      q3: `SELECT \n  region_code,\n  node_id,\n  error_type,\n  COUNT(*) as error_frequency\nFROM telemetry_db.cluster_health_events\nWHERE severity = 'CRITICAL'\nGROUP BY region_code, node_id, error_type;`
    };

    DOM.presetQuerySelect.addEventListener('change', (e) => {
      const selected = e.target.value;
      if (presets[selected]) {
        DOM.sqlCodeInput.value = presets[selected];
      }
    });

    DOM.runQueryBtn.addEventListener('click', executeSqlQuery);

    // Filter results table
    DOM.tableFilterInput.addEventListener('input', (e) => {
      const filter = e.target.value.toLowerCase();
      const rows = DOM.sqlTableBody.querySelectorAll('tr');
      rows.forEach(r => {
        const text = r.textContent.toLowerCase();
        r.style.display = text.includes(filter) ? '' : 'none';
      });
    });

    DOM.exportCsvBtn.addEventListener('click', () => {
      showToast('Exported query dataset to query_results.csv', 'success');
    });

    // Run default query
    executeSqlQuery();
  }

  function executeSqlQuery() {
    showToast('Executing distributed query across shards...', 'info');

    setTimeout(() => {
      const mockData = [
        { customer_id: 'CUST-8910', company_name: 'Apex Global Logistics', tier: 'Enterprise', monthly_tx_count: 142900, total_revenue_usd: '$124,500.00', avg_latency_ms: '8.4ms' },
        { customer_id: 'CUST-7721', company_name: 'Nexus Cloud Infrastructure', tier: 'Enterprise', monthly_tx_count: 98400, total_revenue_usd: '$89,200.00', avg_latency_ms: '9.1ms' },
        { customer_id: 'CUST-6612', company_name: 'Hyperion Analytics Corp', tier: 'Enterprise', monthly_tx_count: 82100, total_revenue_usd: '$74,800.00', avg_latency_ms: '11.2ms' },
        { customer_id: 'CUST-5541', company_name: 'Starlight Retail Networks', tier: 'Professional', monthly_tx_count: 54100, total_revenue_usd: '$48,900.00', avg_latency_ms: '14.0ms' },
        { customer_id: 'CUST-4432', company_name: 'Vanguard Cyber Security', tier: 'Enterprise', monthly_tx_count: 48900, total_revenue_usd: '$41,200.00', avg_latency_ms: '7.8ms' }
      ];

      // Build Headers
      const headers = Object.keys(mockData[0]);
      let headHtml = '<tr>';
      headers.forEach(h => {
        headHtml += `<th>${h.replace(/_/g, ' ')}</th>`;
      });
      headHtml += '</tr>';
      DOM.sqlTableHead.innerHTML = headHtml;

      // Build Rows
      let bodyHtml = '';
      mockData.forEach(row => {
        bodyHtml += '<tr>';
        headers.forEach(h => {
          bodyHtml += `<td>${row[h]}</td>`;
        });
        bodyHtml += '</tr>';
      });
      DOM.sqlTableBody.innerHTML = bodyHtml;

      showToast('Query executed successfully (5 rows returned)', 'success');
    }, 400);
  }

  /* ==========================================
     8. ALERTS & TELEMETRY FEED
     ========================================== */
  function initAlerts() {
    const alerts = [
      { type: 'warning', title: 'APAC High Latency Spike', desc: 'Latency on Tokyo node reached 45ms (threshold: 35ms)', time: '2 mins ago' },
      { type: 'info', title: 'Auto-Scaling Triggered', desc: 'Added 8 compute nodes to US-East region due to RPS surge', time: '14 mins ago' },
      { type: 'critical', title: 'Memory Pool Threshold Alert', desc: 'RAM utilization on Shard-04 crossed 88% ceiling', time: '28 mins ago' }
    ];

    let html = '';
    alerts.forEach(a => {
      const icon = a.type === 'critical' ? '🔴' : a.type === 'warning' ? '⚠️' : 'ℹ️';
      html += `
        <div class="alert-card-item ${a.type}">
          <div class="alert-body">
            <span class="alert-icon">${icon}</span>
            <div>
              <div class="alert-title">${a.title}</div>
              <div class="alert-desc">${a.desc}</div>
            </div>
          </div>
          <span class="ticker-time">${a.time}</span>
        </div>
      `;
    });
    DOM.alertsList.innerHTML = html;

    if (DOM.clearAlertsBtn) {
      DOM.clearAlertsBtn.addEventListener('click', () => {
        DOM.alertsList.innerHTML = '<div style="color:var(--text-dim); text-align:center; padding:20px;">All alerts acknowledged. Cluster operating within parameters.</div>';
        document.getElementById('alertCountBadge').textContent = '0';
        showToast('All system alerts acknowledged', 'info');
      });
    }
  }

  /* ==========================================
     9. REALTIME STREAMING ENGINE (TICKER & METRICS)
     ========================================== */
  function startRealtimeEngine() {
    setInterval(() => {
      if (!state.isLive) return;

      // 1. Update Hardware Gauges
      const newCpu = Math.floor(40 + Math.random() * 20);
      const newRam = Math.floor(58 + Math.random() * 10);
      const cpuVal = document.getElementById('cpuVal');
      const cpuBar = document.getElementById('cpuBar');
      const ramVal = document.getElementById('ramVal');
      const ramBar = document.getElementById('ramBar');

      if (cpuVal && cpuBar) {
        cpuVal.textContent = `${newCpu}%`;
        cpuBar.style.width = `${newCpu}%`;
      }
      if (ramVal && ramBar) {
        ramVal.textContent = `${newRam}%`;
        ramBar.style.width = `${newRam}%`;
      }

      // 2. Stream Live Ticker Events
      pushTickerEvent();

      // 3. Update Chart dataset tail
      if (state.charts.velocity) {
        const dataSet = state.charts.velocity.data.datasets[0].data;
        const lastVal = dataSet[dataSet.length - 1];
        const nextVal = Math.round(lastVal + (Math.random() * 400 - 150));
        dataSet[dataSet.length - 1] = nextVal;
        state.charts.velocity.update('none');
      }

    }, 2000);
  }

  function pushTickerEvent() {
    const clients = ['Acme Corp', 'FinTech Global', 'CloudScale Inc', 'Vanguard Data', 'Zenith Systems'];
    const tiers = ['Enterprise', 'Pro', 'Enterprise'];
    const randomClient = clients[Math.floor(Math.random() * clients.length)];
    const randomTier = tiers[Math.floor(Math.random() * tiers.length)];
    const amount = (Math.random() * 800 + 150).toFixed(2);
    const now = new Date().toLocaleTimeString();

    const item = document.createElement('div');
    item.className = 'ticker-item';
    item.innerHTML = `
      <div class="ticker-meta">
        <span class="ticker-time">${now}</span>
        <span class="ticker-label">${randomClient} (${randomTier})</span>
      </div>
      <span class="ticker-amount">+$${amount}</span>
    `;

    DOM.tickerList.insertBefore(item, DOM.tickerList.firstChild);

    if (DOM.tickerList.children.length > 6) {
      DOM.tickerList.removeChild(DOM.tickerList.lastChild);
    }
  }

  /* ==========================================
     10. TOAST NOTIFICATION SYSTEM
     ========================================== */
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Run initialization
  init();
});
