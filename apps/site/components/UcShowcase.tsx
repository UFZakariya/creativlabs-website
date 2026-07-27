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

import { useEffect, useRef } from "react";

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
                            <div><p class="mock-h1">Good morning, Zakariya</p><p>Layers · Universal Farms · Today, live</p></div>
                            <div class="ufms-filters"><span class="ufms-chip is-on">Today</span><span class="ufms-chip">7 days</span><span class="ufms-chip">All houses</span></div>
                          </div>
                          <div class="ufms-kpis">
                            <div class="ufms-kpi"><small>Eggs collected</small><strong class="tnum">2,940</strong><em class="up">▲ 4.2% vs avg</em></div>
                            <div class="ufms-kpi"><small>Lay rate</small><strong class="tnum">87.6%</strong><em class="up">▲ 1.1 pts</em></div>
                            <div class="ufms-kpi"><small>Mortality</small><strong class="tnum">0.08%</strong><em class="ok">On target</em></div>
                            <div class="ufms-kpi"><small>Feed used</small><strong class="tnum">1.42 t</strong><em class="watch">1.63 kg/bird</em></div>
                          </div>
                          <div class="ufms-grid">
                            <section class="ufms-card ufms-ledger">
                              <div class="ufms-card-h"><span>Egg ledger — today</span><span class="ufms-live-tag"><i></i>live</span></div>
                              <div class="ufms-ledger-big"><strong class="tnum">98</strong><span>crates <em>+ 0 loose</em></span></div>
                              <div class="ufms-ledger-bars">
                                <span style="--h:52%"></span><span style="--h:64%"></span><span style="--h:48%"></span><span style="--h:78%"></span><span style="--h:70%"></span><span style="--h:90%"></span><span style="--h:100%"></span><span style="--h:84%"></span>
                              </div>
                              <div class="ufms-ledger-foot"><span>House 1–4</span><span class="tnum">2,940 eggs · 98.0 crates</span></div>
                            </section>
                            <section class="ufms-card">
                              <div class="ufms-card-h"><span>Lay-rate trend</span><small>14 days</small></div>
                              <svg class="ufms-line" viewBox="0 0 300 96" preserveAspectRatio="none">
                                <path class="ufms-area" d="M0,64 L20,58 40,60 60,50 80,54 100,44 120,46 140,38 160,42 180,34 200,36 220,30 240,32 260,26 280,28 300,22 L300,96 L0,96 Z"/>
                                <path class="ufms-stroke" d="M0,64 L20,58 40,60 60,50 80,54 100,44 120,46 140,38 160,42 180,34 200,36 220,30 240,32 260,26 280,28 300,22"/>
                              </svg>
                              <div class="ufms-line-foot"><span>74%</span><span class="tnum">88%</span></div>
                            </section>
                          </div>
                          <section class="ufms-card">
                            <div class="ufms-card-h"><span>Per-batch performance</span><small>4 active batches</small></div>
                            <table class="ufms-table">
                              <thead><tr><th>Batch</th><th>House</th><th class="r">Birds</th><th class="r">Lay rate</th><th class="r">Eggs</th><th>Status</th></tr></thead>
                              <tbody>
                                <tr><td><strong>B2 · Isa Brown</strong></td><td>House 1</td><td class="r tnum">3,180</td><td class="r tnum">91.2%</td><td class="r tnum">870</td><td><span class="ufms-pill ok">On target</span></td></tr>
                                <tr><td><strong>B3 · Isa Brown</strong></td><td>House 2</td><td class="r tnum">3,050</td><td class="r tnum">88.4%</td><td class="r tnum">808</td><td><span class="ufms-pill ok">On target</span></td></tr>
                                <tr><td><strong>B5 · Lohmann</strong></td><td>House 3</td><td class="r tnum">2,960</td><td class="r tnum">84.1%</td><td class="r tnum">746</td><td><span class="ufms-pill watch">Watch</span></td></tr>
                                <tr><td><strong>B6 · Lohmann</strong></td><td>House 4</td><td class="r tnum">2,010</td><td class="r tnum">85.6%</td><td class="r tnum">516</td><td><span class="ufms-pill ok">On target</span></td></tr>
                              </tbody>
                            </table>
                          </section>
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
                            <a class="tvos-navitem is-active"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>Dashboard</a>
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
                          <div class="tvos-topright"><span class="tvos-day">4 July 2026</span><span class="tvos-userchip"><span class="tvos-ava">ZA</span>Zakariya · Owner</span><span class="tvos-logout">Log out</span></div>
                        </header>
                        <div class="tvos-content">
                          <section class="tvos-card tvos-hero">
                            <div class="tvos-hero-l">
                              <p class="tvos-kicker">Dashboard</p>
                              <h2>Owner workspace</h2>
                              <p class="tvos-sub">The sidebar reflects this profile's duties. In-house profiles manage TruckVille operations, while vendor profiles focus on their own queue.</p>
                            </div>
                            <div class="tvos-hero-r">
                              <span class="tvos-date">4 July 2026</span>
                              <span class="tvos-pulse"><i></i>Live</span>
                              <span class="tvos-daypill">Day open</span>
                            </div>
                          </section>

                          <dl class="tvos-kpis">
                            <div class="tvos-card tvos-stat"><dt>Orders</dt><dd class="tvos-val tnum">248</dd><small>recorded today</small></div>
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
                                <div><dt>Card</dt><dd class="tnum">&#8358;742,000</dd></div>
                                <div><dt>Transfer</dt><dd class="tnum">&#8358;386,500</dd></div>
                                <div><dt>Cash</dt><dd class="tnum">&#8358;156,000</dd></div>
                              </dl>
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
                                </tbody>
                              </table>
                            </section>
                          </div>

                          <section class="tvos-card">
                            <p class="tvos-kicker-muted">End of day</p>
                            <h3>Closeout preview</h3>
                            <div class="tvos-bands">
                              <div class="tvos-band mint"><strong>Ready to close</strong>Card &amp; transfer reconciled · &#8358;1,128,500 confirmed</div>
                              <div class="tvos-band amber"><strong>Before day close</strong>3 cash records still unconfirmed — the accountant confirms these first.</div>
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>
                  </div><div class="uc-boot"><span class="uc-boot-dot"></span>TruckVille OS</div></div>
                  <div class="uc-app" data-app-view="labour"><div class="uc-app-inner">
                    <div class="lp">
                      <header class="lp-header">
                        <div class="lp-brand"><span class="lp-logo">LP</span><span class="lp-brandtxt"><strong>Labour Party</strong><small>Membership Portal</small></span></div>
                        <nav class="lp-nav"><a>Home</a><a>About</a><a class="is-on">Membership</a><a>News</a><a class="lp-login">Member Login</a></nav>
                      </header>
                      <div class="lp-shell">
                        <div class="lp-layout">
                          <aside class="lp-sidebar">
                            <h2>Member Menu</h2>
                            <button class="lp-navitem is-active">Dashboard</button>
                            <button class="lp-navitem">My Profile</button>
                            <button class="lp-navitem">Membership Card</button>
                            <button class="lp-navitem">Update Details</button>
                            <a class="lp-navitem lp-logout">Logout</a>
                          </aside>
                          <main class="lp-main">
                            <div class="lp-card">
                              <p class="mock-h1">Dashboard</p>
                              <p class="lp-subtitle">Welcome, Adebayo Okonkwo</p>
                              <div class="lp-stats">
                                <div class="lp-stat"><span>Membership ID</span><strong>LP/LA/2024/019823</strong></div>
                                <div class="lp-stat"><span>Category</span><strong>Regular Member</strong></div>
                                <div class="lp-stat"><span>Phone</span><strong>0803 &bull;&bull;&bull; 4471</strong></div>
                                <div class="lp-stat"><span>Registered</span><strong>2024-11-05</strong></div>
                              </div>
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
                          </main>
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

export default function UcShowcase() {
  const host = useRef<HTMLDivElement>(null);

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
  }, []);

  return <div ref={host} />;
}
