/* ── ONBOARDING TOUR ── */
function startOnboarding() {
  const existing = document.getElementById('onboard-overlay');
  if (existing) existing.remove();

  let currentStep = 0;
  const steps = [
    {
      targetFn: () => Array.from(document.querySelectorAll('.tb-btn')).find(b => b.textContent.trim() === 'Patient') || null,
      title: 'Start with a Patient',
      body: 'Click Patient to add a new case — name, file number, DOB, and X-ray date. All data stays on your device. You can switch between patients or search existing records here.'
    },
    {
      targetFn: () => Array.from(document.querySelectorAll('.tb-btn.gold')).find(b => b.textContent.includes('Load Ceph')) || null,
      title: 'Load Your X-Ray',
      body: 'Click Load Ceph or drag & drop a lateral cephalogram onto the canvas. If you don\'t have one handy, use the Demo button to load a sample image and explore the tool.'
    },
    {
      targetSelector: '#calib-btn',
      title: 'Calibrate for mm Measurements',
      body: 'Click Calibrate, then click two points on a known ruler or scale marker on the X-ray and enter the real-world distance. Required for accurate mm values in McNamara, Wits, and E-Line analyses.'
    },
    {
      targetSelector: '#img-enhance-bar',
      title: 'Enhance the Image',
      body: 'Adjust brightness, contrast, and sharpness to improve landmark visibility on difficult films. Use Invert for dark-background radiographs. Reset returns everything to defaults.'
    },
    {
      targetSelector: '#canvas-wrap',
      title: 'Navigate the X-Ray',
      body: 'Right-click and hold to pan the image around the canvas. Scroll to zoom in and out for precise point placement. Press Fit to reset the view back to full image.'
    },
    {
      targetSelector: '#landmark-selector',
      title: 'Place Landmarks',
      body: 'Select a landmark from the dropdown and click its anatomical position on the X-ray. The next landmark advances automatically after each placement. Arrow keys nudge a placed point; right-click removes it. Use ⊘ Skip for absent landmarks.'
    },
    {
      targetSelector: '#analysis-filter-bar',
      title: 'Choose Your Analyses',
      body: 'Select which analysis systems you need at the bottom of the canvas. The required landmark count updates immediately — so you only place the points each analysis actually needs.'
    },
    {
      targetSelector: '#analysis-tabs',
      title: 'Review Measurements',
      body: 'Switch between analysis systems on the right panel — Steiner, Ricketts, McNamara, Eastman, and more. Measurements and deviations update live as you place each landmark.'
    },
    {
      targetFn: () => document.getElementById('notes-area') || null,
      title: 'Clinical Notes',
      body: 'Type clinical observations, diagnosis summary, or treatment planning notes in the Notes field under the Overview tab. Notes are saved with the patient record and printed in the PDF report.'
    },
    {
      targetFn: () => Array.from(document.querySelectorAll('.tb-btn')).find(b => b.textContent.includes('Save')) || null,
      title: 'Save Your Session',
      body: 'Save your landmark positions at any time. Use Restore to reload a previous session — useful when tracing across multiple appointments or checking your work later.'
    },
    {
      targetFn: () => Array.from(document.querySelectorAll('.tb-btn')).find(b => b.textContent.trim() === 'Patient') || null,
      title: 'Edit Patient Details',
      body: 'Update patient info, switch to another patient, or start a new case at any time. Your current tracing is auto-saved before switching.'
    },
    {
      targetFn: () => Array.from(document.querySelectorAll('.tb-btn.gold')).find(b => b.textContent.includes('Report')) || null,
      title: 'Generate a Report',
      body: 'When landmarks are complete, generate a print-ready PDF report with all measurements, norm deviations, and percentile bar charts — ready to attach to the patient record.\n\nYou can press Tour anytime from the topbar to replay this walkthrough.'
    }
  ];

  // Overlay container
  const overlay = document.createElement('div');
  overlay.id = 'onboard-overlay';
  Object.assign(overlay.style, {
    position: 'fixed', inset: '0', zIndex: '5000',
    pointerEvents: 'auto'
  });
  // Prevent backdrop click from dismissing
  overlay.addEventListener('click', e => e.stopPropagation());

  // Spotlight element
  const spotlight = document.createElement('div');
  Object.assign(spotlight.style, {
    position: 'fixed',
    borderRadius: '8px',
    boxShadow: '0 0 0 9999px rgba(0,0,0,0.72)',
    pointerEvents: 'none',
    zIndex: '5001',
    transition: 'all 0.2s ease'
  });
  overlay.appendChild(spotlight);

  // Tooltip card
  const card = document.createElement('div');
  Object.assign(card.style, {
    position: 'fixed',
    zIndex: '5002',
    background: '#fff',
    borderRadius: '10px',
    padding: '20px 24px',
    maxWidth: '340px',
    width: '340px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    fontFamily: 'var(--font)'
  });
  card.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px">
      <span id="ob-step" style="font-size:11px;font-weight:700;color:var(--gold);font-family:var(--font-mono)">1 / ${steps.length}</span>
      <span id="ob-skip" style="font-size:11px;color:var(--text-dim);cursor:pointer;text-decoration:underline">Skip tour</span>
    </div>
    <div id="ob-title" style="font-size:15px;font-weight:700;color:var(--navy);margin:10px 0 6px;font-family:var(--font)"></div>
    <div id="ob-body" style="font-size:13px;color:var(--text-dim);line-height:1.6;margin-bottom:16px"></div>
    <div style="display:flex;justify-content:flex-end;gap:8px">
      <button id="ob-back" class="mbtn" style="display:none">← Back</button>
      <button id="ob-next" class="mbtn primary">Next →</button>
    </div>
  `;
  overlay.appendChild(card);

  card.querySelector('#ob-skip').addEventListener('click', finishTour);
  card.querySelector('#ob-back').addEventListener('click', () => { if (currentStep > 0) { currentStep--; showStep(currentStep); } });
  card.querySelector('#ob-next').addEventListener('click', () => {
    if (currentStep < steps.length - 1) { currentStep++; showStep(currentStep); }
    else { finishTour(); }
  });

  function showStep(index) {
    const step = steps[index];
    const target = step.targetFn ? step.targetFn() : document.querySelector(step.targetSelector);
    if (!target) { finishTour(); return; }

    const rect = target.getBoundingClientRect();
    const pad = 6;

    spotlight.style.left   = (rect.left - pad) + 'px';
    spotlight.style.top    = (rect.top - pad) + 'px';
    spotlight.style.width  = (rect.width + pad * 2) + 'px';
    spotlight.style.height = (rect.height + pad * 2) + 'px';

    // Position tooltip below or above target
    const tooltipH = 220; // approximate
    const vpH = window.innerHeight;
    const spaceBelow = vpH - rect.bottom;
    let tooltipTop;
    if (rect.top < vpH / 2 || spaceBelow >= tooltipH + 16) {
      tooltipTop = rect.bottom + pad + 10;
    } else {
      tooltipTop = rect.top - pad - tooltipH - 10;
    }
    // Clamp vertical
    tooltipTop = Math.max(8, Math.min(tooltipTop, vpH - tooltipH - 8));

    // Horizontal: align to left of spotlight, clamped
    let tooltipLeft = rect.left - pad;
    tooltipLeft = Math.max(8, Math.min(tooltipLeft, window.innerWidth - 348));

    card.style.top  = tooltipTop + 'px';
    card.style.left = tooltipLeft + 'px';

    card.querySelector('#ob-step').textContent = (index + 1) + ' / ' + steps.length;
    card.querySelector('#ob-title').textContent = step.title;
    card.querySelector('#ob-body').textContent  = step.body;
    card.querySelector('#ob-back').style.display = index === 0 ? 'none' : '';
    card.querySelector('#ob-next').textContent   = index === steps.length - 1 ? 'Finish ✓' : 'Next →';
  }

  function finishTour() {
    localStorage.setItem('bceph_onboarded', '1');
    overlay.remove();
    window.removeEventListener('resize', onResize);
    if (typeof analytics !== 'undefined') analytics.logEvent('tour_completed');
  }

  function onResize() {
    showStep(currentStep);
  }
  window.addEventListener('resize', onResize);

  document.body.appendChild(overlay);
  showStep(0);
}
