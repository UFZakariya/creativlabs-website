"use client";

/* The old site's Use Cases device showcase, brought over whole: original
   #products shell markup (app tabs + laptop/phone stage + caption foot),
   original CSS (app/uc-demo.css, imported by the customers page) and the
   original vanilla JS modules served from /legacy/uc-demo.js (clickable
   app tabs, UFMS in-app page nav, laptop->phone morph for the ordering
   app, zoom refit on resize, scroll hints). Follows the LegacyDock
   pattern exactly: inject the shell via innerHTML once, then load the
   legacy script. The #products id is load-bearing — the legacy
   stylesheet's <=700px phone-frame overrides are scoped to it.
   Only change from the archived markup: href="#contact" -> "/contact". */

import { useEffect, useRef, useState } from "react";

const SHELL = `
<div id="products">
        <div class="uc-tabs" role="tablist" aria-label="Live product previews" data-uc-tabs data-reveal>
          <span class="uc-tab-indicator" aria-hidden="true"></span>
          <button class="uc-tab is-active" id="uc-tab-ufms" role="tab" aria-selected="true" data-app="ufms" data-device="laptop" type="button">UFMS</button>
          <button class="uc-tab" id="uc-tab-os" role="tab" aria-selected="false" data-app="os" data-device="laptop" tabindex="-1" type="button">TruckVille&nbsp;OS</button>
          <button class="uc-tab" id="uc-tab-order" role="tab" aria-selected="false" data-app="order" data-device="phone" tabindex="-1" type="button">Ordering&nbsp;App</button>
          <button class="uc-tab" id="uc-tab-labour" role="tab" aria-selected="false" data-app="labour" data-device="laptop" tabindex="-1" type="button">Labour&nbsp;Party</button>
        </div>

        <div class="uc-stage" data-uc-stage data-device="laptop" data-reveal>
          <!-- LAPTOP — desktop apps (UFMS, TruckVille OS, Labour Party portal) -->
          <div class="uc-laptop">
            <div class="uc-laptop-lid">
              <div class="uc-laptop-screen">
                <span class="uc-cam" aria-hidden="true"></span>
                <div class="uc-viewport" data-uc-viewport="laptop" tabindex="0" role="group" aria-label="Product preview — scroll to explore">
                  <div class="uc-app is-active" data-app-view="ufms"><div class="uc-app-inner">
                    <div class="ufms">
                      <header class="ufms-top">
                        <span class="ufms-burger" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg></span>
                        <div class="ufms-brand">
                          <span class="ufms-logo">UF</span>
                          <span class="ufms-brandtxt"><small>UNIVERSAL FARMS</small><strong>UFMS</strong></span>
                          <span class="ufms-live"><i></i>LIVE</span>
                        </div>
                        <div class="ufms-topright">
                          <div class="ufms-search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg><span>Search actions &amp; pages…</span><kbd>Ctrl K</kbd></div>
                          <span class="ufms-iconbtn"><svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg><i class="ufms-dot">1</i></span>
                          <div class="ufms-user"><strong>Zakariya</strong><small>Creator</small></div>
                          <span class="ufms-avatar">ZA</span>
                          <span class="ufms-logout">Logout</span>
                        </div>
                      </header>
                      <div class="ufms-body">
                        <nav class="ufms-side">
                          <a class="ufms-nav is-active" data-ufms-goto="dashboard"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>Dashboard</a>
                          <a class="ufms-nav"><svg viewBox="0 0 24 24"><path d="M4 20V9M10 20V4M16 20v-6M22 20H2"/></svg>Production</a>
                          <a class="ufms-nav"><svg viewBox="0 0 24 24"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/></svg>Flock &amp; Batches</a>
                          <a class="ufms-nav"><svg viewBox="0 0 24 24"><path d="M12 21s-7-4.3-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.7-7 10-7 10Z"/></svg>Health</a>
                          <a class="ufms-nav"><svg viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>Finance</a>
                          <a class="ufms-nav"><svg viewBox="0 0 24 24"><path d="M6 2.5h8L20 8.5V21a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z"/><path d="M9 13h7M9 17h5"/></svg>Daily Entry</a>
                          <a class="ufms-nav" data-ufms-goto="records"><svg viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 18.5Z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>Records</a>
                          <a class="ufms-nav"><svg viewBox="0 0 24 24"><path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H13Z"/></svg>Actions</a>
                          <a class="ufms-nav"><svg viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 4.4 2.9 8 7 10 4.1-2 7-5.6 7-10V6Z"/><path d="m9 11.5 2.2 2.2L15.5 9.4"/></svg>Approvals</a>
                          <a class="ufms-nav"><svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/></svg>Reports</a>
                          <a class="ufms-nav"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.4"/><path d="M5 20c.6-3.6 3.4-5.6 7-5.6s6.4 2 7 5.6"/></svg>Admin</a>
                        </nav>
                        <main class="ufms-main">
                          <div class="ufms-page is-active" data-ufms-page="dashboard">
                          <div class="ufms-pagehead">
                            <div><p class="mock-h1">Good morning, Zakariya</p><p>Universal Farms &middot; Layers operations cockpit &middot; live</p></div>
                            <div class="ufms-filters"><span class="ufms-chip is-on">Today</span><span class="ufms-chip">14 days</span><span class="ufms-chip">Layers</span></div>
                          </div>
                          <div class="ufms-kpis ufms-kpis--5">
                            <div class="ufms-kpi ufms-kpi--hero" style="--rail:#1f9d55">
                              <div class="ufms-kpi-top"><small>Lay rate (HDEP)</small><span class="ufms-badge ok">&#9679; On target</span></div>
                              <strong class="tnum">87.6<em class="ufms-unit">%</em></strong>
                              <div class="ufms-kpi-meta"><b class="ufms-delta up">+1.1</b><small>vs 85% target &middot; 11,240 live layers</small></div>
                              <svg class="ufms-spark" viewBox="0 0 100 26" preserveAspectRatio="none"><polyline fill="none" stroke="#1f9d55" stroke-width="2" points="0,21 9,18 18,19 27,15 36,17 45,12 54,14 63,10 72,12 81,8 90,9 100,5"/></svg>
                            </div>
                            <div class="ufms-kpi" style="--rail:#c5d2ca">
                              <div class="ufms-kpi-top"><small>Eggs today</small></div>
                              <strong class="tnum">98.0<em class="ufms-unit">crates</em></strong>
                              <div class="ufms-kpi-meta"><b class="ufms-delta up">+4.2%</b><small><b class="tnum" data-tick-key="ufms-eggs" data-tick-step="3" data-tick-every="6000">2,940</b> good eggs</small></div>
                              <svg class="ufms-spark" viewBox="0 0 100 26" preserveAspectRatio="none"><polyline fill="none" stroke="#0f6b3f" stroke-width="2" points="0,18 9,20 18,14 27,16 36,11 45,13 54,9 63,12 72,7 81,10 90,6 100,8"/></svg>
                            </div>
                            <div class="ufms-kpi" style="--rail:#1f9d55">
                              <div class="ufms-kpi-top"><small>Mortality today</small><span class="ufms-badge ok">&#9679; On target</span></div>
                              <strong class="tnum">9<em class="ufms-unit">birds</em></strong>
                              <div class="ufms-kpi-meta"><b class="ufms-delta up">0.08%</b><small>41 lost in 14d</small></div>
                              <svg class="ufms-spark" viewBox="0 0 100 26" preserveAspectRatio="none"><polyline fill="none" stroke="#1f9d55" stroke-width="2" points="0,14 9,18 18,12 27,20 36,16 45,21 54,15 63,19 72,13 81,20 90,17 100,19"/></svg>
                            </div>
                            <div class="ufms-kpi" style="--rail:#c67f11">
                              <div class="ufms-kpi-top"><small>Stock on hand</small><span class="ufms-badge watch">&#9684; Watch</span></div>
                              <strong class="tnum">132.4<em class="ufms-unit">crates</em></strong>
                              <div class="ufms-kpi-meta"><small>3,972 eggs closing &middot; plan a sale</small></div>
                              <svg class="ufms-spark" viewBox="0 0 100 26" preserveAspectRatio="none"><polyline fill="none" stroke="#c67f11" stroke-width="2" points="0,20 9,19 18,17 27,18 36,15 45,16 54,13 63,14 72,11 81,12 90,8 100,6"/></svg>
                            </div>
                            <div class="ufms-kpi" style="--rail:#c5d2ca">
                              <div class="ufms-kpi-top"><small>Week egg income</small></div>
                              <strong class="tnum">&#8358;1.84m</strong>
                              <div class="ufms-kpi-meta"><small>confirmed &middot; last 7 days</small></div>
                            </div>
                          </div>
                          <div class="ufms-grid ufms-grid--32">
                            <section class="ufms-card ufms-ledgercard">
                              <div class="ufms-ledger-head">
                                <span class="ufms-ledger-title">&#129370; Daily Production Snapshot<i class="ufms-ledger-group">LAYERS</i></span>
                                <span class="ufms-ledger-nav">
                                  <b class="ufms-daybtn">&#8249;</b>
                                  <span class="ufms-ledger-day"><strong class="tnum">2026-07-27</strong><small>latest day</small></span>
                                  <b class="ufms-daybtn is-off">&#8250;</b>
                                  <em class="ufms-ledger-live"><i></i>LIVE</em>
                                </span>
                              </div>
                              <div class="ufms-ledger-body">
                                <div class="ufms-tiles">
                                  <div class="ufms-tile" style="--rail:#7c8f86"><small>Previous balance</small><strong class="tnum">116.4<em>cr</em></strong><span class="tnum">3,492 eggs carried in</span></div>
                                  <div class="ufms-tile is-strong" style="--rail:#0f6b3f"><small>+ Produced today</small><strong class="tnum">98.0<em>cr</em></strong><span class="tnum"><b data-tick-key="ufms-eggs">2,940</b> good eggs</span></div>
                                  <div class="ufms-tile" style="--rail:#e8a723"><small>&minus; Sold today</small><strong class="tnum">82.0<em>cr</em></strong><span class="tnum">2,460 eggs</span></div>
                                  <div class="ufms-tile is-strong" style="--rail:#0f6b3f"><small>= Closing balance</small><strong class="tnum">132.4<em>cr</em></strong><span class="tnum">3,972 eggs on hand</span></div>
                                </div>
                                <p class="ufms-microhead">Per-batch production &middot; 4 batches in Layers</p>
                                <table class="ufms-table">
                                  <thead><tr><th>Batch</th><th class="r">Birds</th><th class="r">Good eggs</th><th class="r">Crates</th><th>Status</th></tr></thead>
                                  <tbody>
                                    <tr><td><strong>B2 &middot; Isa Brown</strong></td><td class="r tnum">3,180</td><td class="r tnum">870</td><td class="r tnum">29.0</td><td><span class="ufms-pill ok">On target</span></td></tr>
                                    <tr><td><strong>B3 &middot; Isa Brown</strong></td><td class="r tnum">3,050</td><td class="r tnum">808</td><td class="r tnum">26.9</td><td><span class="ufms-pill ok">On target</span></td></tr>
                                    <tr><td><strong>B5 &middot; Lohmann</strong></td><td class="r tnum">2,960</td><td class="r tnum">746</td><td class="r tnum">24.9</td><td><span class="ufms-pill watch">Watch</span></td></tr>
                                    <tr><td><strong>B6 &middot; Lohmann</strong></td><td class="r tnum">2,050</td><td class="r tnum">516</td><td class="r tnum">17.2</td><td><span class="ufms-pill ok">On target</span></td></tr>
                                    <tr class="ufms-total"><td><strong>Total</strong></td><td class="r tnum">11,240</td><td class="r tnum">2,940</td><td class="r tnum">98.0</td><td></td></tr>
                                  </tbody>
                                </table>
                              </div>
                            </section>
                            <section class="ufms-card">
                              <div class="ufms-card-h"><span>&#128202; Production vs sales &amp; closing stock</span><small>Layers &middot; 14 days, crates</small></div>
                              <svg class="ufms-chart" viewBox="0 0 300 140" preserveAspectRatio="none">
                                <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(18,33,26,0.07)"/>
                                <line x1="0" y1="56" x2="300" y2="56" stroke="rgba(18,33,26,0.07)"/>
                                <line x1="0" y1="92" x2="300" y2="92" stroke="rgba(18,33,26,0.07)"/>
                                <line x1="0" y1="129" x2="300" y2="129" stroke="rgba(18,33,26,0.16)"/>
                                <rect x="6" y="52" width="8" height="77" rx="1.5" fill="#128a52"/><rect x="15" y="70" width="8" height="59" rx="1.5" fill="#e8a723"/>
                                <rect x="27" y="46" width="8" height="83" rx="1.5" fill="#128a52"/><rect x="36" y="60" width="8" height="69" rx="1.5" fill="#e8a723"/>
                                <rect x="48" y="58" width="8" height="71" rx="1.5" fill="#128a52"/><rect x="57" y="75" width="8" height="54" rx="1.5" fill="#e8a723"/>
                                <rect x="69" y="40" width="8" height="89" rx="1.5" fill="#128a52"/><rect x="78" y="64" width="8" height="65" rx="1.5" fill="#e8a723"/>
                                <rect x="90" y="48" width="8" height="81" rx="1.5" fill="#128a52"/><rect x="99" y="55" width="8" height="74" rx="1.5" fill="#e8a723"/>
                                <rect x="111" y="35" width="8" height="94" rx="1.5" fill="#128a52"/><rect x="120" y="50" width="8" height="79" rx="1.5" fill="#e8a723"/>
                                <rect x="132" y="30" width="8" height="99" rx="1.5" fill="#128a52"/><rect x="141" y="58" width="8" height="71" rx="1.5" fill="#e8a723"/>
                                <rect x="153" y="42" width="8" height="87" rx="1.5" fill="#128a52"/><rect x="162" y="66" width="8" height="63" rx="1.5" fill="#e8a723"/>
                                <rect x="174" y="38" width="8" height="91" rx="1.5" fill="#128a52"/><rect x="183" y="46" width="8" height="83" rx="1.5" fill="#e8a723"/>
                                <rect x="195" y="34" width="8" height="95" rx="1.5" fill="#128a52"/><rect x="204" y="60" width="8" height="69" rx="1.5" fill="#e8a723"/>
                                <rect x="216" y="44" width="8" height="85" rx="1.5" fill="#128a52"/><rect x="225" y="52" width="8" height="77" rx="1.5" fill="#e8a723"/>
                                <rect x="237" y="36" width="8" height="93" rx="1.5" fill="#128a52"/><rect x="246" y="64" width="8" height="65" rx="1.5" fill="#e8a723"/>
                                <rect x="258" y="32" width="8" height="97" rx="1.5" fill="#128a52"/><rect x="267" y="56" width="8" height="73" rx="1.5" fill="#e8a723"/>
                                <rect x="279" y="40" width="8" height="89" rx="1.5" fill="#128a52"/><rect x="288" y="48" width="8" height="81" rx="1.5" fill="#e8a723"/>
                                <polyline fill="none" stroke="#12211a" stroke-width="1.8" points="14,56 35,52 56,58 77,50 98,46 119,44 140,40 161,42 182,38 203,42 224,36 245,40 266,34 287,30"/>
                              </svg>
                              <div class="ufms-legend"><span><i style="background:#128a52"></i>Production</span><span><i style="background:#e8a723"></i>Sales</span><span><i class="ufms-legline"></i>Closing stock</span></div>
                            </section>
                          </div>
                          <div class="ufms-grid">
                            <section class="ufms-card">
                              <div class="ufms-card-h"><span>&#128200; Lay rate trend</span><small>hen-day egg production &middot; 14 days</small></div>
                              <svg class="ufms-line" viewBox="0 0 300 96" preserveAspectRatio="none">
                                <line x1="0" y1="24" x2="300" y2="24" stroke="rgba(18,33,26,0.07)"/>
                                <line x1="0" y1="48" x2="300" y2="48" stroke="rgba(18,33,26,0.07)"/>
                                <line x1="0" y1="72" x2="300" y2="72" stroke="rgba(18,33,26,0.07)"/>
                                <path class="ufms-area" d="M0,64 L20,58 40,60 60,50 80,54 100,44 120,46 140,38 160,42 180,34 200,36 220,30 240,32 260,26 280,28 300,22 L300,96 L0,96 Z"/>
                                <line x1="0" y1="34" x2="300" y2="34" stroke="#c67f11" stroke-width="1.5" stroke-dasharray="6 5" opacity="0.75"/>
                                <path class="ufms-stroke" d="M0,64 L20,58 40,60 60,50 80,54 100,44 120,46 140,38 160,42 180,34 200,36 220,30 240,32 260,26 280,28 300,22"/>
                              </svg>
                              <div class="ufms-line-foot"><span class="tnum">Jul 14 &middot; 81.2%</span><span>dashed = 85% flock standard</span><span class="tnum">Jul 27 &middot; 87.6%</span></div>
                            </section>
                            <section class="ufms-card">
                              <div class="ufms-card-h"><span>&#9888;&#65039; Daily mortality</span><small>spikes flagged red &middot; 14d</small></div>
                              <svg class="ufms-chart ufms-chart--bars" viewBox="0 0 300 96" preserveAspectRatio="none">
                                <line x1="0" y1="26" x2="300" y2="26" stroke="rgba(18,33,26,0.07)"/>
                                <line x1="0" y1="56" x2="300" y2="56" stroke="rgba(18,33,26,0.07)"/>
                                <line x1="0" y1="86" x2="300" y2="86" stroke="rgba(18,33,26,0.16)"/>
                                <rect x="4" y="74" width="14" height="12" rx="2" fill="rgba(15,107,63,0.38)"/>
                                <rect x="25" y="80" width="14" height="6" rx="2" fill="rgba(15,107,63,0.38)"/>
                                <rect x="46" y="68" width="14" height="18" rx="2" fill="rgba(15,107,63,0.38)"/>
                                <rect x="67" y="80" width="14" height="6" rx="2" fill="rgba(15,107,63,0.38)"/>
                                <rect x="88" y="80" width="14" height="6" rx="2" fill="rgba(15,107,63,0.38)"/>
                                <rect x="109" y="74" width="14" height="12" rx="2" fill="rgba(15,107,63,0.38)"/>
                                <rect x="130" y="80" width="14" height="6" rx="2" fill="rgba(15,107,63,0.38)"/>
                                <rect x="151" y="20" width="14" height="66" rx="2" fill="#c0392b"/>
                                <rect x="172" y="74" width="14" height="12" rx="2" fill="rgba(15,107,63,0.38)"/>
                                <rect x="193" y="80" width="14" height="6" rx="2" fill="rgba(15,107,63,0.38)"/>
                                <rect x="214" y="74" width="14" height="12" rx="2" fill="rgba(15,107,63,0.38)"/>
                                <rect x="235" y="68" width="14" height="18" rx="2" fill="rgba(15,107,63,0.38)"/>
                                <rect x="256" y="80" width="14" height="6" rx="2" fill="rgba(15,107,63,0.38)"/>
                                <rect x="277" y="74" width="14" height="12" rx="2" fill="rgba(15,107,63,0.38)"/>
                              </svg>
                              <div class="ufms-line-foot"><span>avg 2.9 birds/day</span><span><i class="ufms-dotred"></i>Jul 21 spike &middot; 11 birds &middot; health check logged</span></div>
                            </section>
                          </div>
                          <div class="ufms-grid">
                            <section class="ufms-card">
                              <div class="ufms-card-h"><span>&#128020; Per-batch production today</span><small>good eggs by batch &middot; 2026-07-27</small></div>
                              <div class="ufms-hbars">
                                <div class="ufms-hbar"><span>B2 &middot; Isa Brown</span><span class="ufms-hbar-track"><i style="--w:100%"></i></span><b class="tnum">870</b></div>
                                <div class="ufms-hbar"><span>B3 &middot; Isa Brown</span><span class="ufms-hbar-track"><i style="--w:93%"></i></span><b class="tnum">808</b></div>
                                <div class="ufms-hbar"><span>B5 &middot; Lohmann</span><span class="ufms-hbar-track"><i style="--w:86%"></i></span><b class="tnum">746</b></div>
                                <div class="ufms-hbar"><span>B6 &middot; Lohmann</span><span class="ufms-hbar-track"><i style="--w:59%"></i></span><b class="tnum">516</b></div>
                              </div>
                              <div class="ufms-card-foot">2,940 good eggs recorded across 4 laying batches</div>
                            </section>
                            <section class="ufms-card">
                              <div class="ufms-card-h"><span>&#128037; Live flock by group</span><small>current head count</small></div>
                              <div class="ufms-donutwrap">
                                <svg class="ufms-donut" viewBox="0 0 120 120">
                                  <circle cx="60" cy="60" r="44" fill="none" stroke="#eef3f0" stroke-width="15"/>
                                  <circle cx="60" cy="60" r="44" fill="none" stroke="#0f6b3f" stroke-width="15" stroke-dasharray="186 277" transform="rotate(-90 60 60)"/>
                                  <circle cx="60" cy="60" r="44" fill="none" stroke="#e8a723" stroke-width="15" stroke-dasharray="56 277" stroke-dashoffset="-186" transform="rotate(-90 60 60)"/>
                                  <circle cx="60" cy="60" r="44" fill="none" stroke="#2f80ed" stroke-width="15" stroke-dasharray="34 277" stroke-dashoffset="-242" transform="rotate(-90 60 60)"/>
                                  <text x="60" y="58" text-anchor="middle" font-size="16" font-weight="800" fill="#12211a">16,700</text>
                                  <text x="60" y="72" text-anchor="middle" font-size="8" fill="#7c8f86">live birds</text>
                                </svg>
                                <div class="ufms-dlegend">
                                  <span><i style="background:#0f6b3f"></i>Layers<b class="tnum">11,240</b></span>
                                  <span><i style="background:#e8a723"></i>Growers<b class="tnum">3,410</b></span>
                                  <span><i style="background:#2f80ed"></i>Broilers<b class="tnum">2,050</b></span>
                                </div>
                              </div>
                              <div class="ufms-card-foot">16,700 live birds &middot; 6 active batches</div>
                            </section>
                          </div>
                          <p class="ufms-note">Not tracked yet: egg weight / grade, feed-conversion by mass, and layer-flock environment &mdash; intentionally omitted rather than estimated.</p>
                          </div>

                          <div class="ufms-page" data-ufms-page="records">
                            <div class="ufms-pagehead">
                              <div><p class="mock-h1">Records</p><p>Browse farms, pens, batches, transactions and more. Click a row for detail; create, edit, or change lifecycle where your role allows.</p></div>
                            </div>
                            <div class="ufms-card ufms-setup">
                              <div class="ufms-setup-h">
                                <span class="ufms-setup-ic"><svg viewBox="0 0 24 24"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/></svg></span>
                                <div><strong>Set up your farm</strong><small>Build the structure top-down — Farm → Pen → Batch. Codes auto-fill and increment; you can always edit them.</small></div>
                              </div>
                              <div class="ufms-setup-cards">
                                <div class="ufms-setup-card"><span class="ufms-setup-num">🏡</span><div><strong>New Farm</strong><small>Register a farm — the top of the structure.</small></div></div>
                                <div class="ufms-setup-card"><span class="ufms-setup-num">🚪</span><div><strong>New Pen</strong><small>Add a pen inside a farm. Auto-codes P001, P002…</small></div></div>
                                <div class="ufms-setup-card"><span class="ufms-setup-num">📦</span><div><strong>New Batch</strong><small>Place a flock in a pen. Bird-type code auto-fills.</small></div></div>
                              </div>
                            </div>
                            <div class="ufms-rtabs">
                              <span class="ufms-rtab is-on">Farms</span><span class="ufms-rtab">Pens</span><span class="ufms-rtab">Batches</span><span class="ufms-rtab">Transactions</span><span class="ufms-rtab">Health checks</span><span class="ufms-rtab">Treatment logs</span><span class="ufms-rtab">Users</span><span class="ufms-rtab">API tokens</span>
                            </div>
                            <div class="ufms-card">
                              <div class="ufms-toolbar">
                                <label class="ufms-check"><span class="ufms-box"></span>Include inactive</label>
                                <div class="ufms-toolbar-r"><span class="ufms-btn">Refresh</span><span class="ufms-btn ufms-btn--primary">+ Create</span></div>
                              </div>
                              <table class="ufms-table ufms-rtable">
                                <thead><tr><th>ID</th><th>Name</th><th>Location</th><th>State</th><th></th></tr></thead>
                                <tbody>
                                  <tr><td class="tnum">#1</td><td><strong>Universal Farms</strong></td><td>Kaduna, Nigeria</td><td><span class="ufms-pill ok">active</span></td><td class="r"><span class="ufms-view">View</span></td></tr>
                                </tbody>
                              </table>
                              <div class="ufms-pager"><span>1–1 of 1</span><div class="ufms-pager-b"><span class="ufms-btn">‹ Prev</span><span class="ufms-pager-n">Page 1 / 1</span><span class="ufms-btn">Next ›</span></div></div>
                            </div>
                          </div>
                        </main>
                      </div>
                    </div>
                  </div></div>
                  <div class="uc-app" data-app-view="os"><div class="uc-app-inner">
                    <div class="tvos">
                      <aside class="tvos-side">
                        <div class="tvos-brand"><span class="tvos-logo">TV</span><span class="tvos-brandtxt"><small>TRUCKVILLE</small><strong>Operations</strong></span></div>
                        <nav class="tvos-nav">
                          <div class="tvos-group"><p>Operations</p>
                            <a class="tvos-navitem is-active" data-tvos-goto="dashboard" data-goto-nav data-goto-title="Dashboard"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>Dashboard</a>
                            <a class="tvos-navitem" data-tvos-goto="closeout" data-goto-nav data-goto-title="Closeout"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8.4 12.3 2.4 2.4 4.8-5.2"/></svg>Closeout</a>
                            <a class="tvos-navitem"><svg viewBox="0 0 24 24"><path d="M6 2.5h9L20 8v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z"/><path d="M9 12h7M9 16h5"/></svg>Live orders</a>
                            <a class="tvos-navitem"><svg viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 9.5h19"/></svg>Transactions</a>
                            <a class="tvos-navitem"><svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>Insights</a>
                            <a class="tvos-navitem"><svg viewBox="0 0 24 24"><path d="m12 3 2.5 5.6 6.1.6-4.6 4 1.4 6-5.4-3.2L6.6 19l1.4-6-4.6-4 6.1-.6Z"/></svg>Ratings</a>
                            <a class="tvos-navitem"><svg viewBox="0 0 24 24"><path d="M12 21s-7-4.3-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.7-7 10-7 10Z"/></svg>Loyalty</a>
                          </div>
                          <div class="tvos-group"><p>Vendors</p>
                            <a class="tvos-navitem"><svg viewBox="0 0 24 24"><path d="M4 9V6l2-3h12l2 3v3M5 9h14v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1Z"/></svg>Vendors</a>
                            <a class="tvos-navitem"><svg viewBox="0 0 24 24"><path d="M4 21V8l8-5 8 5v13"/><path d="M9 21v-6h6v6"/></svg>Rent control</a>
                            <a class="tvos-navitem"><svg viewBox="0 0 24 24"><circle cx="8" cy="8" r="5"/><path d="M13.5 12.5a5 5 0 1 1-3-9"/></svg>Settlements</a>
                            <a class="tvos-navitem"><svg viewBox="0 0 24 24"><path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4M12 17h.01"/></svg>Outstanding</a>
                          </div>
                          <div class="tvos-group"><p>Admin</p>
                            <a class="tvos-navitem"><svg viewBox="0 0 24 24"><path d="M12 3v12M8 11l4 4 4-4M5 21h14"/></svg>Daily exports</a>
                            <a class="tvos-navitem"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5.5l3.5 2"/></svg>Audit trail</a>
                            <a class="tvos-navitem"><svg viewBox="0 0 24 24"><path d="M12 3c3 2 5 5 5 9a5 5 0 0 1-10 0c0-4 2-7 5-9Z"/><path d="m9 21 3-3 3 3"/></svg>Launch setup</a>
                            <a class="tvos-navitem"><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.4"/><path d="M2.8 20c.6-3.6 3.1-5.6 6.2-5.6s5.6 2 6.2 5.6"/><circle cx="17.5" cy="9" r="2.6"/></svg>Profiles</a>
                          </div>
                        </nav>
                      </aside>
                      <div class="tvos-main">
                        <header class="tvos-top">
                          <div><p class="tvos-kicker">TruckVille Operations</p><p class="mock-h1">Dashboard</p></div>
                          <div class="tvos-topright"><span class="tvos-day">27 July 2026</span><span class="tvos-userchip"><span class="tvos-ava">ZA</span>Zakariya &middot; Owner</span><span class="tvos-logout">Log out</span></div>
                        </header>
                        <div class="tvos-content">
                          <div class="tvos-page is-active" data-tvos-page="dashboard">
                          <section class="tvos-card tvos-hero">
                            <div class="tvos-hero-row">
                              <div class="tvos-hero-l">
                                <p class="tvos-kicker">Dashboard</p>
                                <h2>Owner workspace</h2>
                                <p class="tvos-sub">The sidebar reflects this profile's duties. In-house profiles manage TruckVille operations, while vendor profiles focus on their own queue.</p>
                              </div>
                              <div class="tvos-hero-r">
                                <span class="tvos-date">27 July 2026</span>
                                <span class="tvos-pulse"><i></i>Live</span>
                                <span class="tvos-daypill">Day open</span>
                              </div>
                            </div>
                            <div class="tvos-band amber"><strong>Before day close</strong>3 money records still unconfirmed &mdash; the accountant confirms these before day close.</div>
                          </section>

                          <dl class="tvos-kpis">
                            <div class="tvos-card tvos-stat"><dt>Orders</dt><dd class="tvos-val tnum"><span data-tick-key="tvos-orders" data-tick-step="1" data-tick-every="7000">248</span></dd><small>recorded today</small></div>
                            <div class="tvos-card tvos-stat"><dt>Recorded sales</dt><dd class="tvos-val tnum">&#8358;1,284,500</dd><small>gross order value</small></div>
                            <div class="tvos-card tvos-stat"><dt>Rent &amp; charges</dt><dd class="tvos-val tnum">&#8358;180,000</dd><small>collected today</small></div>
                            <div class="tvos-card tvos-stat"><dt>Other income</dt><dd class="tvos-val tnum">&#8358;42,000</dd><small>outside orders</small></div>
                            <div class="tvos-card tvos-stat"><dt>Expenses</dt><dd class="tvos-val tnum">&#8358;96,300</dd><small>paid out today</small></div>
                          </dl>

                          <div class="tvos-grid2">
                            <section class="tvos-card">
                              <p class="tvos-kicker-muted">Payment methods</p>
                              <h3>How money arrived</h3>
                              <dl class="tvos-pay">
                                <div><dt>POS</dt><dd class="tnum">&#8358;742,000</dd></div>
                                <div><dt>Transfer</dt><dd class="tnum">&#8358;386,500</dd></div>
                                <div><dt>Cash</dt><dd class="tnum">&#8358;156,000</dd></div>
                              </dl>
                              <div class="tvos-band gray"><strong>Reconciled</strong>POS &amp; transfer match the processor's totals for today.</div>
                            </section>
                            <section class="tvos-card">
                              <p class="tvos-kicker-muted">Sales leaders</p>
                              <h3>Top vendors today</h3>
                              <table class="tvos-table">
                                <thead><tr><th>Vendor</th><th class="r">Orders</th><th class="r">Gross</th></tr></thead>
                                <tbody>
                                  <tr><td>Mama Put Kitchen</td><td class="r tnum">62</td><td class="r tnum b">&#8358;386,200</td></tr>
                                  <tr><td>Suya Republic</td><td class="r tnum">48</td><td class="r tnum b">&#8358;298,400</td></tr>
                                  <tr><td>Bukka Fresh</td><td class="r tnum">39</td><td class="r tnum b">&#8358;221,900</td></tr>
                                  <tr><td>Grill House</td><td class="r tnum">31</td><td class="r tnum b">&#8358;178,000</td></tr>
                                  <tr><td>Shawarma Yard</td><td class="r tnum">24</td><td class="r tnum b">&#8358;121,300</td></tr>
                                  <tr><td>Chill &amp; Sip</td><td class="r tnum">18</td><td class="r tnum b">&#8358;74,900</td></tr>
                                </tbody>
                              </table>
                            </section>
                          </div>

                          <section class="tvos-card">
                            <p class="tvos-kicker-muted">End of day</p>
                            <h3>Close the day</h3>
                            <p class="tvos-sub">Review the day, confirm the money, then freeze today's records.</p>
                            <div class="tvos-bands">
                              <div class="tvos-band mint"><strong>Ready when you are</strong>POS &amp; transfer reconciled &middot; &#8358;1,128,500 confirmed</div>
                              <div class="tvos-band amber"><strong>3 to confirm</strong>Cash &amp; transfer records dated today still need the accountant.</div>
                            </div>
                            <div class="tvos-btnrow">
                              <span class="tvos-pill-btn">Print day sheet</span>
                              <span class="tvos-pill-btn dark" data-tvos-goto="closeout">Open closeout &rarr;</span>
                            </div>
                          </section>
                          </div>

                          <div class="tvos-page" data-tvos-page="closeout">
                          <section class="tvos-card">
                            <div class="tvcl-head">
                              <div>
                                <p class="tvos-kicker">Closeout</p>
                                <h3>Close the day <span class="tvcl-date tnum">2026-07-27</span></h3>
                                <p class="tvos-sub">Review the day, confirm the money, then freeze today's records.</p>
                              </div>
                              <div class="tvcl-head-r"><span class="tvos-pill-btn">Print day sheet</span><span class="tvos-minipill">Day open</span></div>
                            </div>
                            <nav class="tvcl-steps">
                              <span class="tvcl-step-btn is-active" data-tvcl-goto="review" data-goto-nav><i class="tvcl-step-n">1</i>Review</span>
                              <span class="tvcl-step-btn" data-tvcl-goto="money" data-goto-nav><i class="tvcl-step-n">2</i>Confirm money</span>
                              <span class="tvcl-step-btn" data-tvcl-goto="close" data-goto-nav><i class="tvcl-step-n">3</i>Close</span>
                            </nav>
                            <div class="tvcl-step is-active" data-tvcl-page="review">
                              <dl class="tvcl-figs">
                                <div class="tvcl-fig"><dt>Orders</dt><dd class="tnum"><span data-tick-key="tvos-orders">248</span></dd></div>
                                <div class="tvcl-fig"><dt>Recorded sales</dt><dd class="tnum">&#8358;1,284,500</dd></div>
                                <div class="tvcl-fig"><dt>Rent &amp; charges</dt><dd class="tnum">&#8358;180,000</dd></div>
                                <div class="tvcl-fig"><dt>Other income</dt><dd class="tnum">&#8358;42,000</dd></div>
                                <div class="tvcl-fig"><dt>Expenses</dt><dd class="tnum">&#8358;96,300</dd></div>
                              </dl>
                              <div class="tvos-band rose tvcl-issue">
                                <div class="tvcl-issue-top"><span><strong>Blocking</strong><b>Unsettled orders</b></span><i class="tvcl-count rose">2</i></div>
                                <p>2 orders are still open past service close. Settle or void them before the day is frozen.</p>
                              </div>
                              <div class="tvos-band amber tvcl-issue">
                                <div class="tvcl-issue-top"><span><strong>Warning</strong><b>Cash variance</b></span><i class="tvcl-count amber">1</i></div>
                                <p>Counted cash differs from recorded cash by &#8358;1,500 &mdash; recount the till before closing.</p>
                              </div>
                              <span class="tvos-pill-btn dark tvcl-next" data-tvcl-goto="money">Next: confirm money</span>
                            </div>
                            <div class="tvcl-step" data-tvcl-page="money">
                              <div class="tvcl-money-head"><p class="tvcl-kicker-amber">Unconfirmed money</p><i class="tvcl-count amber">3 to confirm</i></div>
                              <p class="tvos-sub">Confirm every payment and transaction dated today &mdash; the day only closes cleanly once this queue is empty.</p>
                              <div class="tvcl-money">
                                <div class="tvcl-money-top"><strong class="tnum">&#8358;8,500</strong><span class="tvcl-chip ink">Cash payment</span><span class="tvcl-chip amber">Unconfirmed</span></div>
                                <p>Order #214 &middot; counter till</p>
                                <span class="tvos-pill-btn mint">Confirm payment</span>
                              </div>
                              <div class="tvcl-money">
                                <div class="tvcl-money-top"><strong class="tnum">&#8358;23,000</strong><span class="tvcl-chip ink">Transfer payment</span><span class="tvcl-chip amber">Unconfirmed</span></div>
                                <p>Order #219 &middot; GTB ref 004512</p>
                                <span class="tvos-pill-btn mint">Confirm payment</span>
                              </div>
                              <div class="tvcl-money">
                                <div class="tvcl-money-top"><strong class="tnum">&#8358;12,000</strong><span class="tvcl-chip ink">Expense</span><span class="tvcl-chip amber">Unconfirmed</span></div>
                                <p>Fuel &middot; generator diesel top-up</p>
                                <span class="tvos-pill-btn mint">Confirm transaction</span>
                              </div>
                              <span class="tvos-pill-btn dark tvcl-next" data-tvcl-goto="close">Next: close the day</span>
                            </div>
                            <div class="tvcl-step" data-tvcl-page="close">
                              <div class="tvos-band amber"><strong>Not ready to close</strong>3 money records dated today are still unconfirmed. Confirm them first &mdash; the close stays locked until the queue is empty.</div>
                              <div class="tvos-btnrow"><span class="tvos-pill-btn" data-tvcl-goto="money">Back to confirm money</span><span class="tvos-pill-btn dark is-disabled">Confirm the money first</span></div>
                            </div>
                          </section>
                          </div>
                        </div>
                      </div>
                      <nav class="tvos-dock" aria-hidden="true">
                        <a class="is-on"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>Dashboard</a>
                        <a><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8.4 12.3 2.4 2.4 4.8-5.2"/></svg>Closeout</a>
                        <a><svg viewBox="0 0 24 24"><path d="M6 2.5h9L20 8v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z"/><path d="M9 12h7M9 16h5"/></svg>Orders</a>
                        <a><svg viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 9.5h19"/></svg>Money</a>
                        <a><svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>More</a>
                      </nav>
                    </div>
                  </div><div class="uc-boot"><span class="uc-boot-dot"></span>TruckVille OS</div></div>

                  <div class="uc-app" data-app-view="labour"><div class="uc-app-inner">
                    <div class="lp">
                      <header class="lp-header">
                        <div class="lp-brand"><span class="lp-logo">LP</span><span class="lp-brandtxt"><strong>Labour Party</strong><small>Membership Portal</small></span></div>
                        <span class="lp-burger" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg></span>
                        <nav class="lp-nav">
                          <a>Home</a><a>How to Register</a><a>FAQ</a><a>Verify Member</a>
                          <a class="is-on" data-lp-goto="member" data-goto-nav>Member Login</a>
                          <a class="lp-join" data-lp-goto="register" data-goto-nav>Register Now</a>
                        </nav>
                      </header>

                      <div class="lp-page is-active" data-lp-page="member">
                      <div class="lp-shell">
                        <div class="lp-layout">
                          <aside class="lp-sidebar">
                            <h2>Member Menu</h2>
                            <button class="lp-navitem is-active" data-lpp-goto="dashboard" data-goto-nav>Dashboard</button>
                            <button class="lp-navitem" data-lpp-goto="profile" data-goto-nav>My Profile</button>
                            <button class="lp-navitem" data-lpp-goto="card" data-goto-nav>Membership Card</button>
                            <button class="lp-navitem" data-lpp-goto="update" data-goto-nav>Update Details</button>
                            <a class="lp-navitem lp-logout">Logout</a>
                          </aside>
                          <main class="lp-main">
                            <section class="lp-panel is-active" data-lpp-page="dashboard">
                              <div class="lp-card">
                                <p class="mock-h1">Dashboard</p>
                                <p class="lp-subtitle">Welcome, Adebayo Okonkwo</p>
                                <div class="lp-stats">
                                  <div class="lp-stat"><span>Membership ID</span><strong>LP/LA/2024/019823</strong></div>
                                  <div class="lp-stat"><span>Category</span><strong>Regular Member</strong></div>
                                  <div class="lp-stat"><span>Phone</span><strong>0803 &bull;&bull;&bull; 4471</strong></div>
                                  <div class="lp-stat"><span>Registered</span><strong>2024-11-05</strong></div>
                                </div>
                                <div class="lp-alert ok"><p>Profile complete &mdash; your membership card is ready. Open <b>Membership Card</b> to preview, print or download it.</p></div>
                              </div>
                            </section>

                            <section class="lp-panel" data-lpp-page="profile">
                              <div class="lp-card">
                                <p class="mock-h1">My Profile</p>
                                <div class="lp-pgrid">
                                  <div class="lp-photo">No Photo</div>
                                  <table class="lp-rtable"><tbody>
                                    <tr><th>Membership ID</th><td>LP/LA/2024/019823</td></tr>
                                    <tr><th>Full Name</th><td>OKONKWO ADEBAYO CHUKWUMA</td></tr>
                                    <tr><th>Date of Birth</th><td>1988-03-14</td></tr>
                                    <tr><th>Gender</th><td>Male</td></tr>
                                    <tr><th>Phone</th><td>0803 &bull;&bull;&bull; 4471</td></tr>
                                    <tr><th>Email</th><td>adebayo.okonkwo@example.com</td></tr>
                                    <tr><th>Occupation</th><td>Trader</td></tr>
                                    <tr><th>Category</th><td>Regular Member</td></tr>
                                    <tr><th>State / LGA / Ward</th><td>LAGOS / IKEJA / 07</td></tr>
                                    <tr><th>Polling Unit</th><td>PU 014 &mdash; Community Hall</td></tr>
                                    <tr><th>Address</th><td>23 Adeniran Street, Ikeja, Lagos</td></tr>
                                    <tr><th>NIN</th><td>&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 3401</td></tr>
                                    <tr><th>VIN</th><td>&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 8827</td></tr>
                                  </tbody></table>
                                </div>
                              </div>
                            </section>

                            <section class="lp-panel" data-lpp-page="card">
                              <div class="lp-card">
                                <p class="mock-h1">Membership Card</p>
                                <p class="lp-subtitle">Preview, print or download your membership card.</p>
                                <div class="lp-cardactions"><span class="lp-btn lp-btn--primary">Print</span><span class="lp-btn lp-btn--secondary">Download PDF</span><span class="lp-btn lp-btn--secondary">Open Full Preview</span></div>
                              </div>
                              <div class="lp-slip">
                                <div class="lp-slip-head"><h2>Labour Party (LP)</h2><p>Temporary Membership Slip</p></div>
                                <div class="lp-slip-div"></div>
                                <div class="lp-slip-main">
                                  <div class="lp-slip-photo">No Photo</div>
                                  <div class="lp-slip-meta">
                                    <h3>ADEBAYO OKONKWO</h3>
                                    <p><strong>Membership ID:</strong> LP/LA/2024/019823</p>
                                    <p><strong>Registration Date:</strong> 2024-11-05</p>
                                  </div>
                                  <div class="lp-slip-brand"><span class="lp-logo lp-logo-sm">LP</span><span class="lp-slip-lp">LP</span></div>
                                </div>
                                <div class="lp-slip-loc">
                                  <div class="lp-loc-item"><strong>LAGOS</strong><span>State</span></div>
                                  <div class="lp-loc-item"><strong>IKEJA</strong><span>LGA</span></div>
                                  <div class="lp-loc-item"><strong>07</strong><span>Ward</span></div>
                                </div>
                                <div class="lp-slip-foot">&copy; 2026 Labour Party</div>
                              </div>
                            </section>

                            <section class="lp-panel" data-lpp-page="update">
                              <div class="lp-card">
                                <p class="mock-h1">Update Details</p>
                                <div class="lp-form lp-form--flat">
                                  <div class="lp-field"><span>Surname</span><div class="lp-input has-value">OKONKWO</div></div>
                                  <div class="lp-field"><span>First Name</span><div class="lp-input has-value">ADEBAYO</div></div>
                                  <div class="lp-field lp-f-full"><span>Other Names</span><div class="lp-input has-value">CHUKWUMA</div></div>
                                  <div class="lp-field"><span>Phone Number</span><div class="lp-input has-value">08031204471</div></div>
                                  <div class="lp-field"><span>Email Address</span><div class="lp-input has-value">adebayo.okonkwo@example.com</div></div>
                                  <div class="lp-field"><span>Occupation</span><div class="lp-input has-value">Trader</div></div>
                                  <div class="lp-field lp-f-full"><span>Residential Address</span><div class="lp-input lp-input--area has-value">23 Adeniran Street, Ikeja, Lagos</div></div>
                                  <div class="lp-actions"><span class="lp-btn lp-btn--primary">Save Details</span></div>
                                </div>
                                <div class="lp-passdiv"></div>
                                <h2 class="lp-h2">Change Password</h2>
                                <p class="lp-subtitle">Default password is your phone number. Change it after first login.</p>
                                <div class="lp-form lp-form--flat">
                                  <div class="lp-field"><span>Current Password</span><div class="lp-input has-value">&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;</div></div>
                                  <div class="lp-field"><span>New Password</span><div class="lp-input">Min. 8 characters</div></div>
                                  <div class="lp-field lp-f-full"><span>Confirm New Password</span><div class="lp-input">Repeat new password</div></div>
                                  <div class="lp-actions"><span class="lp-btn lp-btn--primary">Update Password</span></div>
                                </div>
                              </div>
                            </section>
                          </main>
                        </div>
                      </div>
                      </div>

                      <div class="lp-page" data-lp-page="register">
                      <div class="lp-reg">
                        <div class="lp-regband">
                          <h2>Join the Movement</h2>
                          <p class="lp-regmeta">Complete the form below to register as a party member</p>
                          <div class="lp-track">
                            <span class="lp-track-line"></span><span class="lp-track-fill"></span>
                            <div class="lp-node is-active"><span class="lp-node-badge">1</span><small>PERSONAL</small></div>
                            <div class="lp-node"><span class="lp-node-badge">2</span><small>ELECTORAL</small></div>
                            <div class="lp-node"><span class="lp-node-badge">3</span><small>ID &amp; DOCS</small></div>
                            <div class="lp-node"><span class="lp-node-badge">4</span><small>CONFIRM</small></div>
                          </div>
                        </div>
                        <div class="lp-regcard">
                          <div class="lp-regcard-head"><p class="mock-h1">Personal Information</p><p class="lp-subtitle">Please provide your basic details accurately as they appear on official documents.</p></div>
                          <div class="lp-form">
                            <div class="lp-split">
                              <div class="lp-passport"><span class="lp-passport-ic">&#128247;</span>Upload Passport<small>Max 5MB, clear photo on plain background.</small></div>
                              <div class="lp-splitfields">
                                <div class="lp-field"><span>First Name <em>*</em></span><div class="lp-input">E.g. Chukwudi</div></div>
                                <div class="lp-field"><span>Surname/Last Name <em>*</em></span><div class="lp-input">E.g. Okafor</div></div>
                                <div class="lp-field lp-f-full"><span>Other Names</span><div class="lp-input">Middle name (Optional)</div></div>
                              </div>
                            </div>
                            <div class="lp-field"><span>Email Address <em>*</em></span><div class="lp-input">example@email.com</div></div>
                            <div class="lp-field"><span>Phone Number <em>*</em></span><div class="lp-input">08012345678</div></div>
                            <div class="lp-field"><span>Date of Birth <em>*</em></span><div class="lp-input">DD / MM / YYYY</div></div>
                            <div class="lp-field"><span>Gender <em>*</em></span><div class="lp-radios"><span class="lp-radio is-sel"><i></i>Male</span><span class="lp-radio"><i></i>Female</span><span class="lp-radio"><i></i>Other</span></div></div>
                            <div class="lp-field"><span>Occupation</span><div class="lp-input">Occupation</div></div>
                            <div class="lp-field"><span>Membership Category <em>*</em></span><div class="lp-input lp-input--select">Select Membership Category<b>&#9662;</b></div></div>
                            <div class="lp-actions"><span class="lp-btn lp-btn--primary">Continue &#8250;</span></div>
                          </div>
                        </div>
                      </div>
                      </div>
                    </div>
                  </div><div class="uc-boot"><span class="uc-boot-dot"></span>Labour Party portal</div></div>
                </div>
                <div class="uc-scroll-hint" data-uc-hint="laptop" aria-hidden="true"><span></span></div>
              </div>
            </div>
            <div class="uc-laptop-base" aria-hidden="true"><span class="uc-laptop-lip"></span></div>
          </div>

          <!-- PHONE — the ordering app (laptop morphs to this when selected) -->
          <div class="uc-phone" aria-hidden="true">
            <div class="uc-phone-frame">
              <div class="uc-phone-screen">
                <div class="uc-statusbar" aria-hidden="true">
                  <span class="uc-time">9:41</span>
                  <span class="uc-phone-island"></span>
                  <span class="uc-sicons">
                    <svg viewBox="0 0 18 12" class="uc-sig"><rect x="0" y="7" width="3" height="5" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="2.5" width="3" height="9.5" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1" opacity="0.35"/></svg>
                    <svg viewBox="0 0 16 12" class="uc-wifi"><path d="M8 10.8 5.2 7.9a4 4 0 0 1 5.6 0L8 10.8Z"/><path d="M2.8 5.4a7.4 7.4 0 0 1 10.4 0l-1.7 1.8a5 5 0 0 0-7 0L2.8 5.4Z" opacity="0.85"/><path d="M.4 2.9a10.8 10.8 0 0 1 15.2 0l-1.7 1.8a8.4 8.4 0 0 0-11.8 0L.4 2.9Z" opacity="0.7"/></svg>
                    <svg viewBox="0 0 25 12" class="uc-batt"><rect x="0.5" y="0.5" width="21" height="11" rx="3" fill="none" stroke="currentColor"/><rect x="2.5" y="2.5" width="15" height="7" rx="1.5"/><path d="M23.5 4v4a2 2 0 0 0 0-4Z"/></svg>
                  </span>
                </div>
                <div class="uc-viewport" data-uc-viewport="phone" tabindex="0" role="group" aria-label="Ordering app — scroll to explore">
                <div class="uc-app" data-app-view="order"><div class="uc-app-inner">
                  <div class="tvo">
                    <div class="tvo-top">
                      <div class="tvo-topbar">
                        <span class="tvo-word">TruckVille</span>
                        <span class="tvo-scan"><svg viewBox="0 0 24 24"><path d="M3 7V4a1 1 0 0 1 1-1h3M17 3h3a1 1 0 0 1 1 1v3M21 17v3a1 1 0 0 1-1 1h-3M7 21H4a1 1 0 0 1-1-1v-3"/><path d="M7 8h3v3H7zM14 8h3v3h-3zM7 14h3v3H7zM14 14h3v3h-3z"/></svg>Scan / track</span>
                      </div>
                      <div class="tvo-search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg><span>Search trucks, dishes, drinks…</span></div>
                    </div>

                    <section class="tvo-hero">
                      <p class="tvo-hero-k">Welcome to the park</p>
                      <p class="mock-h1">What are you eating today?</p>
                      <p class="tvo-hero-sub">Order from any truck in the yard — one cart, pay once, collect at the counter with your code.</p>
                    </section>

                    <a class="tvo-card tvo-squad">
                      <span class="tvo-squad-ic">🧑‍🤝‍🧑</span>
                      <span class="tvo-squad-t"><strong>Ordering with friends? Start a squad</strong><small>One shared cart · everyone adds their own · the host places it</small></span>
                      <span class="tvo-chev">›</span>
                    </a>

                    <div class="tvo-quick">
                      <a class="tvo-card tvo-quick-c">
                        <span class="tvo-quick-ic forest"><svg viewBox="0 0 24 24"><path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10Z"/><circle cx="12" cy="11" r="2.3"/></svg></span>
                        <span><strong>Park map</strong><small>Find any truck &amp; its live queue</small></span>
                      </a>
                      <a class="tvo-card tvo-quick-c">
                        <span class="tvo-quick-ic gold"><svg viewBox="0 0 24 24"><path d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7S9 7 9 4.5 12 7 12 7ZM12 7s3 0 3-2.5S12 7 12 7Z"/></svg></span>
                        <span><strong>Rewards</strong><small>Earn stamps &amp; free portions</small></span>
                      </a>
                    </div>

                    <div class="tvo-chips">
                      <span class="tvo-chip is-active">All</span>
                      <span class="tvo-chip">Rice</span>
                      <span class="tvo-chip">Grills</span>
                      <span class="tvo-chip">Swallow</span>
                      <span class="tvo-chip">Shawarma</span>
                      <span class="tvo-chip">Drinks</span>
                      <span class="tvo-chip">Snacks</span>
                    </div>

                    <div class="tvo-rail">
                      <div class="tvo-rail-h"><div><strong>Open now</strong><small>Trucks taking orders this minute</small></div><span class="tvo-seeall">See all</span></div>
                      <div class="tvo-rail-row">
                        <article class="tvo-card tvo-vendor">
                          <span class="tvo-vphoto" style="--g1:#0b6b2e;--g2:#063824">🍚<span class="tvo-vpill open">Open</span></span>
                          <div class="tvo-vbody"><strong>Mama Put Kitchen</strong><span class="tvo-vmeta"><i class="tvo-star">★</i>4.8 · 12 min</span><small>Nigerian · Rice &amp; stews</small></div>
                        </article>
                        <article class="tvo-card tvo-vendor">
                          <span class="tvo-vphoto" style="--g1:#b23c17;--g2:#7a2a10">🍢<span class="tvo-vpill open">Open</span></span>
                          <div class="tvo-vbody"><strong>Suya Republic</strong><span class="tvo-vmeta"><i class="tvo-star">★</i>4.7 · 9 min</span><small>Grills · Suya &amp; asun</small></div>
                        </article>
                        <article class="tvo-card tvo-vendor">
                          <span class="tvo-vphoto" style="--g1:#9a6a10;--g2:#5f4208">🥘<span class="tvo-vpill busy">Busy</span></span>
                          <div class="tvo-vbody"><strong>Bukka Fresh</strong><span class="tvo-vmeta"><i class="tvo-star">★</i>4.6 · 18 min</span><small>Swallow · Soups</small></div>
                        </article>
                      </div>
                    </div>

                    <div class="tvo-promo">
                      <div><p class="tvo-promo-k">Park deal</p><strong>20% off your first order</strong><small>Auto-applied at checkout · today only</small></div>
                      <span class="tvo-promo-badge">−20%</span>
                    </div>

                    <section class="tvo-every">
                      <h2>Every truck &amp; cabin</h2>
                      <div class="tvo-grid">
                        <article class="tvo-card tvo-vendor">
                          <span class="tvo-vphoto" style="--g1:#0b6b2e;--g2:#063824">🍗<span class="tvo-vpill open">Open</span></span>
                          <div class="tvo-vbody"><strong>Grill House</strong><span class="tvo-vmeta"><i class="tvo-star">★</i>4.5 · 15 min</span><small>BBQ · Chicken</small></div>
                        </article>
                        <article class="tvo-card tvo-vendor">
                          <span class="tvo-vphoto" style="--g1:#7a3ea0;--g2:#4a2565">🌯<span class="tvo-vpill open">Open</span></span>
                          <div class="tvo-vbody"><strong>Shawarma Yard</strong><span class="tvo-vmeta"><i class="tvo-star">★</i>4.7 · 11 min</span><small>Wraps · Fast food</small></div>
                        </article>
                        <article class="tvo-card tvo-vendor">
                          <span class="tvo-vphoto" style="--g1:#1f7fae;--g2:#0f4b68">🥤<span class="tvo-vpill open">Open</span></span>
                          <div class="tvo-vbody"><strong>Chill &amp; Sip</strong><span class="tvo-vmeta"><i class="tvo-star">★</i>4.4 · 6 min</span><small>Drinks · Smoothies</small></div>
                        </article>
                        <article class="tvo-card tvo-vendor">
                          <span class="tvo-vphoto" style="--g1:#b8860b;--g2:#7a5807">🍩<span class="tvo-vpill soldout">Sold out</span></span>
                          <div class="tvo-vbody"><strong>Sweet Corner</strong><span class="tvo-vmeta"><i class="tvo-star">★</i>4.8 · —</span><small>Pastries · Snacks</small></div>
                        </article>
                      </div>
                    </section>

                    <nav class="tvo-tabbar">
                      <span class="tvo-glass"></span>
                      <a class="is-on"><svg viewBox="0 0 24 24"><path d="M4 11 12 4l8 7"/><path d="M6 10v9h12v-9"/></svg>Home</a>
                      <a><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>Search</a>
                      <a><svg viewBox="0 0 24 24"><path d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7"/></svg>Rewards</a>
                      <a><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.6"/><path d="M5 20c.6-3.8 3.3-5.8 7-5.8s6.4 2 7 5.8"/></svg>Account</a>
                    </nav>
                  </div>
                </div><div class="uc-boot"><span class="uc-boot-dot"></span>Ordering app</div></div>
                </div>
                <div class="uc-scroll-hint" data-uc-hint="phone" aria-hidden="true"><span></span></div>
                <span class="uc-phone-home" aria-hidden="true"></span>
              </div>
            </div>
          </div>
        </div>

        <div class="uc-foot" data-reveal>
          <p class="uc-caption"><span class="proof-dot" aria-hidden="true"></span><strong data-uc-caption>UFMS — running daily at Universal Farms, our founder&rsquo;s own poultry operation.</strong></p>
          <a href="/contact" class="glass-btn glass-btn--accent">Discuss Your System <span class="btn-arrow" aria-hidden="true">&rarr;</span></a>
        </div>
</div>
`;

/* Phones hide each app's own nav rail (the skins reflow to one column), which
   would strand the in-app pages. This strip mirrors whichever rail belongs to
   the visible app and drives the real legacy controls. */
const PHONE_PAGES: Record<string, { sel: string; label: string }[]> = {
  ufms: [
    { sel: "[data-ufms-goto='dashboard']", label: "Dashboard" },
    { sel: "[data-ufms-goto='records']", label: "Records" },
  ],
  os: [
    { sel: "[data-tvos-goto='dashboard']", label: "Dashboard" },
    { sel: "[data-tvos-goto='closeout']", label: "Closeout" },
  ],
  labour: [
    { sel: "[data-lp-goto='member']", label: "Member area" },
    { sel: "[data-lp-goto='register']", label: "Register" },
    { sel: "[data-lpp-goto='profile']", label: "Profile" },
    { sel: "[data-lpp-goto='card']", label: "Card" },
  ],
};

export default function UcShowcase() {
  const host = useRef<HTMLDivElement>(null);
  const [app, setApp] = useState("ufms");
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (document.getElementById("products")) return; // once per page load
    const el = host.current;
    if (!el) return;
    el.innerHTML = SHELL;

    // load the legacy module AFTER the shell exists — it queries the DOM
    // at execution time (same contract as hermes-dock.js)
    const s = document.createElement("script");
    s.src = "/legacy/uc-demo.js";
    document.body.appendChild(s);

    // mirror the legacy app tabs so the phone strip follows the visible app
    const stage = el.querySelector("[data-uc-stage]");
    const tabs = el.querySelectorAll<HTMLElement>(".uc-tab[data-app]");
    const sync = (e: Event) => {
      const a = (e.currentTarget as HTMLElement).dataset.app;
      if (a) { setApp(a); setPage(0); }
    };
    tabs.forEach((t) => t.addEventListener("click", sync));
    // ?uc= deep link sets the app before we mount
    const q = new URLSearchParams(window.location.search).get("uc");
    if (q && PHONE_PAGES[q]) setApp(q);
    return () => {
      tabs.forEach((t) => t.removeEventListener("click", sync));
      void stage;
    };
  }, []);

  const pages = PHONE_PAGES[app] ?? [];

  return (
    <div>
      <div ref={host} />
      {pages.length > 0 && (
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
          {pages.map((p, i) => (
            <button
              key={p.sel}
              type="button"
              onClick={() => {
                const target = document.querySelector<HTMLElement>(`#products ${p.sel}`);
                target?.click();
                setPage(i);
              }}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors ${
                page === i
                  ? "bg-[var(--color-blue)] text-white"
                  : "border border-black/10 bg-white/70 text-[var(--color-ink-soft)]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
