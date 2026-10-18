/* ==========================================================================
   UniHub prototype - plain HTML / CSS / JS
   Roles: student | dorm (Dorm Staff) | event (Event Handler) | registrar (Registrar Staff)
   All data is kept in localStorage so a student's actions show up for staff
   (log out, log in as staff) and vice versa.
   ========================================================================== */
 
/* ---------- constants ---------- */
const STORE_KEY = "unihub_db_v2";
const SESSION_KEY = "unihub_session_v2";
const STAFF_CODE = "592780752";
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
 
const DOC_TYPES = [
  { name: "Transcript of Records (TOR)", fee: 150 },
  { name: "Certificate of Registration (COR)", fee: 50 },
  { name: "True Copy of Grades", fee: 80 },
  { name: "Certification of Enrollment", fee: 50 }
];
const PAYMENT_METHODS = [
  { key: "gcash", label: "GCash" },
  { key: "maya", label: "Maya" },
  { key: "counter", label: "Cashier (on pickup)" }
];
const EVENT_TAGS = ["Academic", "Sports", "Career", "Culture", "Other"];
const ACTIVE_ROOM = ["Pending", "Approved", "Cancellation requested"];
const OPEN_REG = ["Pending", "Processing", "Ready", "Cancellation requested"];
 
const ROLES = {
  student: { label: "Student", theme: "student" },
  dorm: { label: "Dorm Staff", theme: "dorm" },
  event: { label: "Event Handler", theme: "event" },
  registrar: { label: "Registrar Staff", theme: "registrar" }
};
const SIGNUP_ROLES = [["student", "Student"], ["dorm", "Dorm Staff"], ["event", "Event Handler"], ["registrar", "Registrar Staff"]];
 
/* [screen key, label, icon] */
const NAV = {
  student: [["home", "Home", "home"], ["dorm", "Dorm", "building"], ["events", "Events", "calendar"], ["registrar", "Registrar", "file"], ["profile", "Profile", "user"]],
  dorm: [["home", "Home", "home"], ["d_requests", "Requests", "clipboard"], ["d_maint", "Maintenance", "wrench"], ["profile", "Profile", "user"]],
  event: [["home", "Home", "home"], ["e_events", "Events", "calendar"], ["e_attend", "Attendance", "users"], ["profile", "Profile", "user"]],
  registrar: [["home", "Home", "home"], ["r_requests", "Requests", "file"], ["r_payments", "Payments", "wallet"], ["profile", "Profile", "user"]]
};
 
/* ---------- icons ---------- */
const ICON_PATHS = {
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  chevR: '<polyline points="9 18 15 12 9 6"/>',
  chevL: '<polyline points="15 18 9 12 15 6"/>',
  arrowL: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  send: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  ticket: '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  circleCheck: '<circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>',
  mapPin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  nav: '<polygon points="3 11 22 2 13 21 11 13 3 11"/>',
  door: '<path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  pencil: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
  wallet: '<path d="M20 12V8H6a2 2 0 0 1 0-4h12v4"/><path d="M4 6v12a2 2 0 0 0 2 2h14v-4"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/>',
  clipboard: '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 17a2.5 2.5 0 0 0 2.5-2.5c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7.5 7.5 0 1 1-15 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  alert: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'
};
function icon(name, size) {
  return '<svg width="' + (size || 18) + '" height="' + (size || 18) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + (ICON_PATHS[name] || "") + "</svg>";
}
 
/* ---------- small helpers ---------- */
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}
function pad(n) { return n < 10 ? "0" + n : "" + n; }
function peso(n) { return "&#8369;" + Number(n).toLocaleString("en-US"); }
function isoOf(y, m, d) { return y + "-" + pad(m + 1) + "-" + pad(d); }
function isoDaysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return isoOf(d.getFullYear(), d.getMonth(), d.getDate());
}
function todayISO() { return isoDaysFromNow(0); }
function fmtDate(iso) {
  if (!iso) return "";
  const p = iso.split("-");
  return monthNames[Number(p[1]) - 1].slice(0, 3) + " " + Number(p[2]) + ", " + p[0];
}
function fmtTime(t) {
  if (!t) return "";
  const p = t.split(":");
  const h = Number(p[0]);
  return (((h + 11) % 12) + 1) + ":" + p[1] + " " + (h >= 12 ? "PM" : "AM");
}
function uid(prefix) { return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
 
/* resize + compress an image so it fits in localStorage */
function resizeImage(file, maxDim, quality, square) {
  return new Promise(function (resolve, reject) {
    if (!file || !/^image\//.test(file.type)) { reject(new Error("type")); return; }
    if (file.size > 10 * 1024 * 1024) { reject(new Error("size")); return; }
    const reader = new FileReader();
    reader.onerror = function () { reject(new Error("read")); };
    reader.onload = function () {
      const img = new Image();
      img.onerror = function () { reject(new Error("img")); };
      img.onload = function () {
        let sx = 0, sy = 0, sw = img.width, sh = img.height, dw, dh;
        if (square) {
          const s = Math.min(sw, sh);
          sx = (sw - s) / 2; sy = (sh - s) / 2; sw = s; sh = s;
          dw = dh = Math.min(maxDim, s);
        } else {
          const k = Math.min(1, maxDim / Math.max(sw, sh));
          dw = Math.round(sw * k); dh = Math.round(sh * k);
        }
        const c = document.createElement("canvas");
        c.width = dw; c.height = dh;
        c.getContext("2d").drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh);
        resolve(c.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
 
/* ---------- shared data (the "database") ---------- */
let db;
 
function seedDB() {
  return {
    accounts: [],
    rooms: [
      { id: "B1-102", building: "Bulanao Hall", floor: "1st Floor", beds: 2, price: 1800, occupantId: null },
      { id: "B2-201", building: "Bulanao Hall", floor: "2nd Floor", beds: 2, price: 1800, occupantId: null },
      { id: "B2-305", building: "Bulanao Hall", floor: "3rd Floor", beds: 4, price: 1200, occupantId: null },
      { id: "R1-108", building: "Rizal Residence", floor: "1st Floor", beds: 2, price: 2000, occupantId: null },
      { id: "R2-210", building: "Rizal Residence", floor: "2nd Floor", beds: 3, price: 1500, occupantId: null },
      { id: "R3-301", building: "Rizal Residence", floor: "3rd Floor", beds: 2, price: 1900, occupantId: null }
    ],
    roomRequests: [],
    maintenance: [],
    events: [],
    rsvps: [],
    registrar: [],
    notifications: []
  };
}
function removeLegacyDemoData() {
  const demoIds = ["STU-0001", "STU-0002", "STU-0003", "DRM-0001", "EVT-0001", "REG-0001"];
  const demoIdSet = new Set(demoIds);
  const demoEventIds = ["ev_seed1", "ev_seed2", "ev_seed3", "ev_seed4"];
  const demoEventSet = new Set(demoEventIds);

  db.accounts = (db.accounts || []).filter(function (a) { return !demoIdSet.has(a.id); });
  db.rooms = (db.rooms || []).map(function (r) {
    if (demoIdSet.has(r.occupantId)) r.occupantId = null;
    return r;
  });
  db.roomRequests = (db.roomRequests || []).filter(function (r) {
    return !demoIdSet.has(r.studentId) && !String(r.id || "").startsWith("rq_seed");
  });
  db.maintenance = (db.maintenance || []).filter(function (m) {
    return !demoIdSet.has(m.studentId) && !String(m.id || "").startsWith("mt_seed");
  });
  db.events = (db.events || []).filter(function (e) {
    return !demoIdSet.has(e.createdBy) && !demoEventSet.has(e.id);
  });
  db.rsvps = (db.rsvps || []).filter(function (r) {
    return !demoIdSet.has(r.studentId) && !demoEventSet.has(r.eventId) && !String(r.id || "").startsWith("rv_seed");
  });
  db.registrar = (db.registrar || []).filter(function (r) {
    return !demoIdSet.has(r.studentId) && !String(r.id || "").startsWith("rg_seed");
  });
  db.notifications = (db.notifications || []).filter(function (n) {
    return !demoIdSet.has(n.userId) && !demoIdSet.has(n.accountId);
  });
}

function loadDB() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) { db = JSON.parse(raw); removeLegacyDemoData(); saveDB(); return; }
  } catch (e) { /* fall through and seed */ }
  db = seedDB();
  removeLegacyDemoData();
  saveDB();
}
function saveDB() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(db)); }
  catch (e) { toast("Storage is full - the latest change could not be saved."); }
}
function getSession() { try { return localStorage.getItem(SESSION_KEY); } catch (e) { return null; } }
function setSession(id) { try { if (id) localStorage.setItem(SESSION_KEY, id); else localStorage.removeItem(SESSION_KEY); } catch (e) { /* ignore */ } }
 
/* ---------- lookups ---------- */
function userById(id) { return db.accounts.find(function (a) { return a.id === id; }); }
function me() { return userById(ui.userId); }
function myRole() { return me().role; }
function nameOf(id) { const u = userById(id); return u ? u.name : id; }
function roomById(id) { return db.rooms.find(function (r) { return r.id === id; }); }
function eventById(id) { return db.events.find(function (e) { return e.id === id; }); }
function activeRoomReq(sid) { return db.roomRequests.find(function (r) { return r.studentId === sid && ACTIVE_ROOM.indexOf(r.status) !== -1; }); }
function eventPhase(e) {
  if (e.status === "Cancelled") return "Cancelled";
  if (e.date < todayISO()) return "Ended";
  return "Open";
}
function sortedEvents() {
  return db.events.slice().sort(function (a, b) { return (a.date + a.time) < (b.date + b.time) ? -1 : 1; });
}
function nextEvent() {
  return sortedEvents().find(function (e) { return e.status === "Active" && e.date >= todayISO(); });
}
 
/* ---------- notifications ---------- */
function notify(to, text) {
  db.notifications.unshift({ id: uid("n"), to: to, text: text, date: todayISO(), read: false });
}
function myNotifs() {
  const u = me();
  return db.notifications.filter(function (n) { return n.to === u.id || n.to === "role:" + u.role; });
}
function unreadCount() { return myNotifs().filter(function (n) { return !n.read; }).length; }
 
/* ---------- toast ---------- */
let toastTimer = null;
function toast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.classList.remove("show"); }, 2600);
}
 
/* ---------- UI state (not saved) ---------- */
function blankSignup() { return { role: "student", name: "", id: "", mobile: "", email: "", password: "", confirm: "", code: "", agree: false, error: "" }; }
function blankEventForm() { return { id: null, title: "", date: "", time: "", place: "", tag: "Academic", description: "", error: "" }; }
const now0 = new Date();
const ui = {
  screen: "login", userId: null,
  loginId: "", loginPw: "", loginError: "",
  signup: blankSignup(),
  dormTab: "browse", regTab: "new",
  maint: { note: "", photo: null, error: "" },
  reg: { docIdx: 0, payKey: null, purpose: "" },
  cal: { month: now0.getMonth(), year: now0.getFullYear(), selected: null },
  mapOpen: null,
  dFilter: "pending", mFilter: "pending", rFilter: "pending",
  attendEventId: null,
  eventForm: blankEventForm(),
  profileEdit: { mobile: "", email: "", photo: undefined, error: "" },
  notifUnread: [],
  viewer: null
};
 
/* ==========================================================================
   Reusable pieces
   ========================================================================== */
const BADGES = {
  "Pending": ["neutral", "clock"], "Approved": ["good", "circleCheck"], "Rejected": ["bad", "x"], "Cancelled": ["muted", "x"],
  "Cancellation requested": ["warn", "clock"], "In Progress": ["warn", "clock"], "Processing": ["warn", "clock"],
  "Resolved": ["good", "circleCheck"], "Ready": ["good", "circleCheck"], "Released": ["good", "circleCheck"],
  "Paid": ["good", "circleCheck"], "Pay at pickup": ["warn", "clock"], "Refund pending": ["warn", "clock"], "Refunded": ["muted", "circleCheck"],
  "Active": ["good", "circleCheck"], "Ended": ["muted", "clock"], "Present": ["good", "circleCheck"], "Going": ["gold", "check"],
  "Vacant": ["good", "door"], "Occupied": ["neutral", "user"]
};
function badge(status) {
  const b = BADGES[status] || ["neutral", "clock"];
  return '<span class="badge bd-' + b[0] + '">' + icon(b[1], 12) + esc(status) + "</span>";
}
function header(title, opts) {
  opts = opts || {};
  let h = '<div class="hdr"><div class="hdr-row">';
  if (opts.back) h += '<button class="iconbtn" onclick="' + opts.back + '">' + icon("arrowL", 16) + "</button>";
  h += "<h1>" + esc(title) + "</h1>";
  if (opts.bell) {
    const n = unreadCount();
    h += '<button class="iconbtn" onclick="openNotifications()">' + icon("bell", 16) + (n ? '<span class="dot-badge">' + n + "</span>" : "") + "</button>";
  }
  h += "</div>";
  if (opts.sub) h += '<p class="hdr-sub">' + opts.sub + "</p>";
  if (opts.tabs) {
    h += '<div class="tabbar">' + opts.tabs.map(function (t) {
      return '<button class="' + (opts.active === t[0] ? "active" : "") + '" onclick="' + opts.onTab + "('" + t[0] + "')\">" + t[1] + "</button>";
    }).join("") + "</div>";
  }
  return h + "</div>";
}
function page(theme, hdr, body, nonav, wide) {
  return '<div class="screen theme-' + theme + (wide ? " wide" : "") + '">' + hdr + '<div class="scroll' + (nonav ? " nonav" : "") + '">' + body + "</div></div>";
}
function chips(items, active, fn) {
  return '<div class="chips">' + items.map(function (i) {
    return '<button class="chip' + (i[0] === active ? " on" : "") + '" onclick="' + fn + "('" + i[0] + "')\">" + esc(i[1]) + (i[2] != null ? '<span class="cnt">' + i[2] + "</span>" : "") + "</button>";
  }).join("") + "</div>";
}
function empty(msg, iconName) {
  return '<div class="empty">' + icon(iconName || "clipboard", 26) + "<p>" + esc(msg) + "</p></div>";
}
function kv(k, v, raw) {
  return '<div class="kvrow"><span>' + esc(k) + "</span><span>" + (raw ? v : esc(v)) + "</span></div>";
}
function avatar(u, size) {
  const initials = u.name.split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w[0].toUpperCase(); }).join("");
  const st = "width:" + size + "px;height:" + size + "px;";
  if (u.photo) return '<img class="avatar" style="' + st + '" src="' + u.photo + '" alt="">';
  return '<div class="avatar ph" style="' + st + "font-size:" + Math.round(size * 0.36) + 'px">' + esc(initials) + "</div>";
}
function person(id, rightHtml) {
  const u = userById(id);
  const nm = u ? u.name : id;
  const shown = u || { name: nm, photo: null };
  return '<div class="row between"><div class="person">' + avatar(shown, 36) + '<div><p class="pname">' + esc(nm) + '</p><p class="psub">' + esc(id) + "</p></div></div>" + (rightHtml || "") + "</div>";
}
function stat(num, label, onclick) {
  return '<button class="stat" onclick="' + onclick + '"><span class="num">' + num + '</span><span class="lbl">' + esc(label) + "</span></button>";
}
function modCard(onclick, label, sub, iconName, bg, color) {
  return '<button class="card modcard" onclick="' + onclick + '"><div class="modic" style="background:' + bg + ";color:" + color + '">' + icon(iconName, 20) + '</div><div class="grow"><p class="ttl">' + label + '</p><p class="sub">' + sub + "</p></div>" + icon("chevR", 16) + "</button>";
}
 
/* ==========================================================================
   Render pipeline
   ========================================================================== */
let lastKey = null;
function render(resetScroll) {
  const root = document.getElementById("screen-root");
  let keep = 0;
  const old = root.querySelector ? root.querySelector(".scroll") : null;
  if (old) keep = old.scrollTop;
  let html = "";
  if (ui.screen === "login") html = renderLogin();
  else if (ui.screen === "signup") html = renderSignup();
  else html = renderScreen(ui.screen) + renderBottomNav() + (ui.viewer ? renderViewer() : "");
  root.innerHTML = html;
  root.className = (ui.screen === "login" || ui.screen === "signup") ? "" : "withnav";
  const key = ui.screen + "|" + ui.userId;
  const sc = root.querySelector ? root.querySelector(".scroll") : null;
  if (sc && !resetScroll && lastKey === key) sc.scrollTop = keep;
  lastKey = key;
}
function renderScreen(s) {
  const role = myRole();
  switch (s) {
    case "home": return role === "student" ? homeStudent() : role === "dorm" ? homeDorm() : role === "event" ? homeEvent() : homeRegistrar();
    case "dorm": return dormStudent();
    case "events": return eventsStudent();
    case "registrar": return registrarStudent();
    case "d_requests": return dormRequests();
    case "d_maint": return dormMaintenance();
    case "e_events": return eventManage();
    case "e_form": return eventFormScreen();
    case "e_attend": return eventAttendance();
    case "r_requests": return registrarRequests();
    case "r_payments": return registrarPayments();
    case "profile": return profileScreen();
    case "profile_edit": return profileEditScreen();
    case "notifications": return notificationsScreen();
  }
  return homeStudent();
}
function navActive(s) {
  if (s === "e_form") return "e_events";
  if (s === "profile_edit") return "profile";
  if (s === "notifications") return "";
  return s;
}
function renderBottomNav() {
  const act = navActive(ui.screen);
  const u = me();
  const brand = '<div class="sidebrand"><span class="emb">' + icon("flame", 16) + '</span><div><p class="bn">UniHub</p><p class="bs">Kalinga State University</p></div></div>';
  const who = '<div class="sideuser">' + avatar(u, 34) + '<div><p class="pname">' + esc(u.name) + '</p><p class="psub">' + ROLES[u.role].label + "</p></div></div>";
  return '<div class="bottomnav">' + brand + NAV[myRole()].map(function (i) {
    return '<button class="navbtn' + (act === i[0] ? " active" : "") + '" onclick="goTo(\'' + i[0] + '\')"><span class="ic">' + icon(i[2], 20) + '</span><span class="lbl">' + i[1] + "</span></button>";
  }).join("") + who + "</div>";
}
function renderViewer() {
  return '<div class="overlay" onclick="closeViewer()"><button class="iconbtn closebtn" onclick="closeViewer()">' + icon("x", 16) + '</button><img src="' + ui.viewer + '" alt="Attached photo"></div>';
}
function goTo(screen) {
  ui.screen = screen;
  ui.viewer = null;
  if (screen === "e_attend") ensureAttendEvent();
  render(true);
}
function viewPhoto(kind, id) {
  const item = kind === "m" ? db.maintenance.find(function (m) { return m.id === id; }) : null;
  if (item && item.photo) { ui.viewer = item.photo; render(); }
}
function closeViewer() { ui.viewer = null; render(); }
 
/* ==========================================================================
   Login + create account
   ========================================================================== */
function eyeIcon(visible) {
  return visible
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 3l18 18" stroke="currentColor" stroke-width="1.8"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
}
function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  const button = document.querySelector('[data-toggle-for="' + inputId + '"]');
  if (!input || !button) return;
  const visible = input.type === "password";
  input.type = visible ? "text" : "password";
  button.innerHTML = eyeIcon(visible);
  button.setAttribute("aria-label", visible ? "Hide password" : "Show password");
  button.setAttribute("title", visible ? "Hide password" : "Show password");
  input.focus();
}
function renderLogin() {
  return '<div class="auth">' +
    '<div class="brand"><div class="emblem"><span class="fl">' + icon("flame", 20) + '</span><span class="bk">' + icon("book", 18) + "</span></div>" +
    "<h1>UniHub</h1><p class=\"u\">Kalinga State University</p><p class=\"tag\">Bridging financial gaps, building brighter futures</p></div>" +
    '<div class="authform">' +
    '<input class="auth-in" placeholder="ID number" value="' + esc(ui.loginId) + '" oninput="ui.loginId=this.value" onkeydown="if(event.key===\'Enter\')doLogin()">' +
    '<div class="password-wrap auth-password-wrap"><input id="login-password" class="auth-in" type="password" placeholder="Password" value="' + esc(ui.loginPw) + '" oninput="ui.loginPw=this.value" onkeydown="if(event.key===\'Enter\')doLogin()"><button class="password-toggle auth-password-toggle" type="button" data-toggle-for="login-password" aria-label="Show password" title="Show password" onclick="togglePasswordVisibility(\'login-password\')">' + eyeIcon(false) + '</button></div>' +
    (ui.loginError ? '<p class="autherr">' + esc(ui.loginError) + "</p>" : "") +
    '<button class="b b-gold b-block big" onclick="doLogin()">Log in</button>' +
    '<p class="authalt">New to UniHub? <button class="linkbtn" onclick="openSignup()">Create account</button></p></div></div>';
}
function doLogin() {
  const id = (ui.loginId || "").trim().toUpperCase();
  const pw = ui.loginPw || "";
  if (!id || !pw) { ui.loginError = "Enter your ID number and password."; render(); return; }
  const u = db.accounts.find(function (a) { return a.id.toUpperCase() === id; });
  if (!u || u.password !== pw) { ui.loginError = "Incorrect ID number or password."; render(); return; }
  startSession(u);
}
function startSession(u) {
  ui.userId = u.id;
  ui.loginError = ""; ui.loginPw = "";
  ui.dormTab = (u.role === "student" && activeRoomReq(u.id)) ? "room" : "browse";
  ui.regTab = "new";
  ui.maint = { note: "", photo: null, error: "" };
  ui.reg = { docIdx: 0, payKey: null, purpose: "" };
  ui.dFilter = "pending"; ui.mFilter = "pending"; ui.rFilter = "pending";
  ui.mapOpen = null; ui.cal.selected = null;
  setSession(u.id);
  ui.screen = "home";
  render(true);
  toast("Welcome, " + u.name.split(" ")[0] + "!");
}
function logout() {
  ui.userId = null;
  setSession(null);
  ui.screen = "login";
  render(true);
}
function openSignup() { ui.signup = blankSignup(); ui.screen = "signup"; render(true); }
function setSignupRole(r) { ui.signup.role = r; render(); }
 
function renderSignup() {
  const s = ui.signup;
  const staff = s.role !== "student";
  const f = function (label, key, type, ph) {
    const inputId = "signup-" + key;
    const input = '<input id="' + inputId + '" class="in" type="' + (type || "text") + '" placeholder="' + (ph || "") + '" value="' + esc(s[key]) + '" oninput="ui.signup.' + key + '=this.value">';
    const control = type === "password"
      ? '<div class="password-wrap">' + input + '<button class="password-toggle" type="button" data-toggle-for="' + inputId + '" aria-label="Show password" title="Show password" onclick="togglePasswordVisibility(\'' + inputId + '\')">' + eyeIcon(false) + '</button></div>'
      : input;
    return '<div class="field"><label>' + label + '</label>' + control + '</div>';
  };
  const body =
    '<div class="card pad formcard">' +
    '<div class="field"><label>I am a</label>' +
    '<div class="chips wrap">' + SIGNUP_ROLES.map(function (r) {
      return '<button class="chip' + (s.role === r[0] ? " on" : "") + '" onclick="setSignupRole(\'' + r[0] + '\')">' + r[1] + "</button>";
    }).join("") + "</div></div>" +
    f("Full name", "name", "text", "Juan Dela Cruz") +
    f("ID number", "id", "text", (staff ? "e.g. DRM-0002" : "e.g. 2026-00123")) +
    f("Mobile number", "mobile", "tel", "09XXXXXXXXX") +
    f("Email", "email", "email", "you@ksu.edu.ph") +
    f("Password", "password", "password", "At least 4 characters") +
    f("Confirm password", "confirm", "password", "Re-enter password") +
    (staff ? f("Staff authorization password", "code", "password", "Required to create staff accounts") + '<p class="small">Only authorized group members should know this password. Student accounts do not need it.</p>' : "") +
    '<label class="agree"><input type="checkbox"' + (s.agree ? " checked" : "") + ' onchange="ui.signup.agree=this.checked"><span>I agree that UniHub may use my mobile number and email only for account verification and follow-up on my requests (Data Privacy Act of 2012).</span></label>' +
    (s.error ? '<p class="formerr">' + esc(s.error) + "</p>" : "") +
    '<button class="b b-accent b-block big" onclick="doSignup()">Create account</button>' +
    "</div>";
  return page("student", header("Create account", { back: "goTo('login')" }), body, true);
}
function validMobile(m) { return /^(09|\+639)\d{9}$/.test(m.replace(/[\s-]/g, "")); }
function validEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function doSignup() {
  const s = ui.signup;
  const name = s.name.trim();
  const id = s.id.trim().toUpperCase();
  const mobile = s.mobile.replace(/[\s-]/g, "");
  const email = s.email.trim();
  let err = "";
  if (name.length < 3) err = "Enter your full name.";
  else if (!/^[A-Z0-9-]{3,20}$/.test(id)) err = "ID number must be 3-20 letters, numbers, or dashes.";
  else if (db.accounts.some(function (a) { return a.id.toUpperCase() === id; })) err = "That ID number already has an account.";
  else if (!validMobile(mobile)) err = "Enter a valid mobile number (e.g. 09171234567).";
  else if (!validEmail(email)) err = "Enter a valid email address.";
  else if (s.password.length < 4) err = "Password must be at least 4 characters.";
  else if (s.password !== s.confirm) err = "Passwords do not match.";
  else if (s.role !== "student" && s.code.trim() !== STAFF_CODE) err = "Incorrect staff authorization password. Staff account creation is restricted.";
  else if (!s.agree) err = "Please accept the data privacy notice to continue.";
  if (err) { s.error = err; render(); return; }
  db.accounts.push({ id: id, role: s.role, name: name, mobile: mobile, email: email, password: s.password, photo: null });
  saveDB();
  ui.loginId = id; ui.loginPw = ""; ui.loginError = "";
  ui.signup = blankSignup();
  ui.screen = "login";
  render(true);
  toast("Account created. You can now log in.");
}
 
/* ==========================================================================
   Notifications (all roles)
   ========================================================================== */
function openNotifications() {
  const mine = myNotifs();
  ui.notifUnread = mine.filter(function (n) { return !n.read; }).map(function (n) { return n.id; });
  mine.forEach(function (n) { n.read = true; });
  saveDB();
  goTo("notifications");
}
function notificationsScreen() {
  const mine = myNotifs();
  const body = mine.length ? mine.map(function (n) {
    const un = ui.notifUnread.indexOf(n.id) !== -1;
    return '<div class="card pad notif' + (un ? " unread" : "") + '"><p>' + esc(n.text) + '</p><p class="small">' + fmtDate(n.date) + "</p></div>";
  }).join("") : empty("No notifications yet.", "bell");
  return page(ROLES[myRole()].theme, header("Notifications", { back: "goTo('home')" }), body);
}
 
/* ==========================================================================
   STUDENT - Home
   ========================================================================== */
function homeStudent() {
  const u = me();
  const rr = activeRoomReq(u.id);
  let dormSub = "No room yet";
  if (rr) dormSub = rr.status === "Pending" ? "Room " + esc(rr.roomId) + " &middot; request pending" : "Room " + esc(rr.roomId);
  const myRsvps = db.rsvps.filter(function (r) {
    const e = eventById(r.eventId);
    return r.studentId === u.id && e && e.status === "Active" && e.date >= todayISO();
  });
  const regs = db.registrar.filter(function (r) { return r.studentId === u.id; });
  const open = regs.filter(function (r) { return OPEN_REG.indexOf(r.status) !== -1; });
  const due = open.filter(function (r) { return r.paymentStatus === "Pay at pickup"; }).reduce(function (s, r) { return s + r.fee; }, 0);
  const regSub = due > 0 ? peso(due) + " due at pickup" : open.length + " active request" + (open.length === 1 ? "" : "s");
  const ne = nextEvent();
  const notifs = myNotifs().slice(0, 3);
  let body =
    modCard("goTo('dorm')", "Dorm services", dormSub, "building", "var(--green-bg)", "var(--green-text)") +
    modCard("goTo('events')", "Event hub", myRsvps.length + " upcoming RSVP" + (myRsvps.length === 1 ? "" : "s"), "calendar", "var(--gold-bg)", "var(--gold-text)") +
    modCard("goTo('registrar')", "Registrar online", regSub, "file", "var(--maroon-bg)", "var(--maroon-text)");
  if (ne) {
    body += '<p class="sect">Next event</p><div class="card pad"><span class="tag t-gold">' + esc(ne.tag) + '</span><p class="ttl mt">' + esc(ne.title) + '</p><p class="sub">' +
      fmtDate(ne.date) + " &middot; " + fmtTime(ne.time) + " &middot; " + esc(ne.place) + "</p></div>";
  }
  body += '<p class="sect">Recent updates</p>' + (notifs.length ? notifs.map(function (n) {
    return '<div class="card pad notif"><p>' + esc(n.text) + '</p><p class="small">' + fmtDate(n.date) + "</p></div>";
  }).join("") : '<div class="card pad"><p class="small">Nothing new yet. Updates from the Dorm Office, Event Handlers, and Registrar will show here.</p></div>');
  return page("student", header(u.name, { bell: true, sub: "Welcome back &middot; Student &middot; " + esc(u.id) }), body);
}
 
/* ==========================================================================
   STUDENT - Dorm
   ========================================================================== */
function setDormTab(t) { ui.dormTab = t; render(true); }
function dormStudent() {
  const u = me();
  const rr = activeRoomReq(u.id);
  const t = ui.dormTab;
  const body = t === "room" ? dormMyRoom(u, rr) : t === "browse" ? dormBrowse(u, rr) : dormMaintStudent(u, rr);
  return page("dorm", header("Dorm services", { tabs: [["room", "My room"], ["browse", "Browse"], ["maintenance", "Maintenance"]], active: t, onTab: "setDormTab" }), body);
}
function dormMyRoom(u, rr) {
  let h = "";
  if (rr) {
    const room = roomById(rr.roomId) || { id: rr.roomId, building: "", floor: "", beds: "", price: 0 };
    let act = "";
    if (rr.status === "Pending") act = '<button class="b b-danger b-block" onclick="cancelRoomReq(\'' + rr.id + '\')">Cancel request</button>';
    else if (rr.status === "Approved") act = '<p class="small">Your room is assigned. Cancelling now needs the Dorm Office to confirm.</p><button class="b b-danger b-block" onclick="cancelRoomReq(\'' + rr.id + '\')">Request cancellation</button>';
    else act = '<p class="small">Waiting for the Dorm Office to confirm your cancellation.</p>';
    h += '<div class="card pad"><div class="row between"><div class="row gap8 accent-t">' + icon("door", 18) + '<span class="big">Room ' + esc(room.id) + "</span></div>" + badge(rr.status) + "</div>" +
      '<div class="kv">' + kv("Building", room.building) + kv("Floor", room.floor) + kv("Beds", room.beds) + kv("Rate", peso(room.price) + "/mo", true) + kv("Requested", fmtDate(rr.date)) + "</div>" + act + "</div>";
  } else {
    h += empty("You have no active room. Browse vacant rooms to send a request.", "building");
  }
  const past = db.roomRequests.filter(function (r) { return r.studentId === u.id && ACTIVE_ROOM.indexOf(r.status) === -1; });
  if (past.length) {
    h += '<p class="sect">Past requests</p>' + past.map(function (r) {
      return '<div class="card pad"><div class="row between"><div><p class="ttl">Room ' + esc(r.roomId) + '</p><p class="sub">' + fmtDate(r.date) + "</p></div>" + badge(r.status) + "</div>" + (r.note ? '<p class="small">Reason: ' + esc(r.note) + "</p>" : "") + "</div>";
    }).join("");
  }
  return h;
}
function dormBrowse(u, rr) {
  let h = "";
  if (rr) h += '<div class="note">You already have an active room request (' + esc(rr.roomId) + "). Cancel it first if you want a different room.</div>";
  const rooms = db.rooms.filter(function (r) { return !r.occupantId; });
  if (!rooms.length) return h + empty("No vacant rooms right now.", "building");
  rooms.forEach(function (room) {
    const mine = rr && rr.roomId === room.id;
    h += '<div class="card pad row between"><div><p class="ttl">' + esc(room.id) + " &mdash; " + esc(room.building) + '</p><p class="sub">' + esc(room.floor) + " &middot; " + room.beds + " beds &middot; " + peso(room.price) + "/mo</p></div>" +
      '<button class="b b-accentsoft" ' + (rr ? "disabled" : "") + " onclick=\"requestRoom('" + room.id + "')\">" + (mine ? "Requested" : "Request") + "</button></div>";
  });
  return h;
}
function requestRoom(roomId) {
  const u = me();
  const room = roomById(roomId);
  if (!room || room.occupantId) { toast("That room is no longer available."); render(); return; }
  if (activeRoomReq(u.id)) { toast("You already have an active room request."); return; }
  db.roomRequests.unshift({ id: uid("rq"), studentId: u.id, roomId: roomId, status: "Pending", date: todayISO(), note: "" });
  notify("role:dorm", "New room request: " + u.name + " (" + u.id + ") asked for room " + roomId + ".");
  saveDB();
  ui.dormTab = "room";
  toast("Room request sent to the Dorm Office.");
  render(true);
}
function cancelRoomReq(id) {
  const r = db.roomRequests.find(function (x) { return x.id === id; });
  if (!r) return;
  const u = me();
  if (r.status === "Pending") {
    if (!confirm("Cancel this room request?")) return;
    r.status = "Cancelled";
    toast("Room request cancelled.");
  } else if (r.status === "Approved") {
    if (!confirm("Your room is already assigned. Send a cancellation request to the Dorm Office?")) return;
    r.prevStatus = r.status;
    r.status = "Cancellation requested";
    notify("role:dorm", u.name + " (" + u.id + ") asked to cancel the approved room " + r.roomId + ".");
    toast("Cancellation request sent.");
  }
  saveDB(); render();
}
 
/* maintenance (student) */
function dormMaintStudent(u, rr) {
  const resident = rr && (rr.status === "Approved" || rr.status === "Cancellation requested");
  if (!resident) return '<div class="note">Maintenance requests are for dorm residents. Once the Dorm Office approves your room request, you can report issues here.</div>';
  const m = ui.maint;
  const mine = db.maintenance.filter(function (x) { return x.studentId === u.id; });
  let h = '<div class="card pad formcard"><p class="sect nomt">New maintenance request &middot; Room ' + esc(rr.roomId) + "</p>" +
    '<textarea class="in" rows="3" placeholder="Describe the issue (e.g. broken faucet, faulty light)" oninput="ui.maint.note=this.value">' + esc(m.note) + "</textarea>" +
    '<p class="sect">Photo (optional)</p>';
  if (m.photo) {
    h += '<div class="thumbwrap"><img class="thumb big" src="' + m.photo + '" alt=""><button class="thumbx" onclick="removeMaintPhoto()">' + icon("x", 12) + "</button></div>";
  } else {
    h += '<label class="b b-soft attach">' + icon("camera", 14) + ' Attach photo<input type="file" accept="image/*" onchange="attachMaintPhoto(event)" hidden></label>';
  }
  if (m.error) h += '<p class="formerr">' + esc(m.error) + "</p>";
  h += '<p class="small row gap6">' + icon("shield", 11) + " Attach a clear photo of the issue only. Inappropriate images are not allowed.</p>" +
    '<button class="b b-accent b-block big" onclick="submitMaintenance()">' + icon("wrench", 14) + " Submit request</button></div>";
  if (mine.length) {
    h += '<p class="sect">Your requests</p>' + mine.map(function (t) {
      let act = "";
      if (t.status === "Pending") act = '<button class="b b-danger" onclick="cancelMaint(\'' + t.id + '\')">Cancel</button>';
      else if (t.status === "In Progress") act = '<button class="b b-danger" onclick="cancelMaint(\'' + t.id + '\')">Request cancellation</button>';
      return '<div class="card pad"><div class="row between"><p class="ttl grow">' + esc(t.text) + "</p>" + badge(t.status) + '</div><p class="sub">' + fmtDate(t.date) + " &middot; Room " + esc(t.roomId) + "</p>" +
        (t.photo ? '<img class="thumb" src="' + t.photo + '" alt="" onclick="viewPhoto(\'m\',\'' + t.id + '\')">' : "") +
        (t.status === "Cancellation requested" ? '<p class="small">Waiting for the Dorm Office to confirm your cancellation.</p>' : "") +
        (t.status === "Resolved" ? '<p class="small">Marked as resolved by the Dorm Office.</p>' : "") + (act ? '<div class="actions">' + act + "</div>" : "") + "</div>";
    }).join("");
  }
  return h;
}
function attachMaintPhoto(ev) {
  const file = ev.target.files && ev.target.files[0];
  if (!file) return;
  resizeImage(file, 900, 0.72, false).then(function (url) {
    ui.maint.photo = url; ui.maint.error = ""; render();
  }).catch(function (e) {
    ui.maint.error = e.message === "type" ? "Please choose an image file." : e.message === "size" ? "That image is too large (max 10 MB)." : "Could not read that image.";
    render();
  });
}
function removeMaintPhoto() { ui.maint.photo = null; render(); }
function submitMaintenance() {
  const u = me();
  const rr = activeRoomReq(u.id);
  const text = ui.maint.note.trim();
  if (!rr || (rr.status !== "Approved" && rr.status !== "Cancellation requested")) { toast("You need an approved room first."); return; }
  if (text.length < 5) { ui.maint.error = "Please describe the issue (at least 5 characters)."; render(); return; }
  db.maintenance.unshift({ id: uid("mt"), studentId: u.id, roomId: rr.roomId, text: text, photo: ui.maint.photo, status: "Pending", date: todayISO() });
  notify("role:dorm", "New maintenance request from " + u.name + " (room " + rr.roomId + "): " + text.slice(0, 60));
  ui.maint = { note: "", photo: null, error: "" };
  saveDB();
  toast("Maintenance request submitted.");
  render(true);
}
function cancelMaint(id) {
  const t = db.maintenance.find(function (x) { return x.id === id; });
  if (!t) return;
  const u = me();
  if (t.status === "Pending") {
    if (!confirm("Cancel this maintenance request?")) return;
    t.status = "Cancelled";
    toast("Request cancelled.");
  } else if (t.status === "In Progress") {
    if (!confirm("Work has already started. Send a cancellation request to the Dorm Office?")) return;
    t.prevStatus = t.status; t.status = "Cancellation requested";
    notify("role:dorm", u.name + " asked to cancel an in-progress maintenance request (room " + t.roomId + ").");
    toast("Cancellation request sent.");
  }
  saveDB(); render();
}
 
/* ==========================================================================
   STUDENT - Events (calendar + list + RSVP + map)
   ========================================================================== */
function changeMonth(delta) {
  let m = ui.cal.month + delta, y = ui.cal.year;
  if (m < 0) { m = 11; y--; }
  if (m > 11) { m = 0; y++; }
  ui.cal.month = m; ui.cal.year = y; ui.cal.selected = null;
  render();
}
function selectCalDate(iso) { ui.cal.selected = ui.cal.selected === iso ? null : iso; render(); }
function toggleMap(id) { ui.mapOpen = ui.mapOpen === id ? null : id; render(); }
function mapQuery(e) { return encodeURIComponent(e.place + ", Kalinga State University, Tabuk City, Kalinga, Philippines"); }
 
function calendarHTML() {
  const byDate = {};
  db.events.forEach(function (e) { if (e.status !== "Cancelled") byDate[e.date] = true; });
  const c = ui.cal;
  const first = new Date(c.year, c.month, 1).getDay();
  const days = new Date(c.year, c.month + 1, 0).getDate();
  let cells = "";
  for (let i = 0; i < first; i++) cells += "<div></div>";
  for (let d = 1; d <= days; d++) {
    const iso = isoOf(c.year, c.month, d);
    cells += '<button class="day' + (iso === c.selected ? " sel" : "") + (iso === todayISO() ? " today" : "") + '" onclick="selectCalDate(\'' + iso + '\')"><span>' + d + '</span><i class="dotm' + (byDate[iso] ? " on" : "") + '"></i></button>';
  }
  return '<div class="card pad"><div class="row between calhead"><button class="roundbtn" onclick="changeMonth(-1)">' + icon("chevL", 14) + '</button><span class="ttl">' + monthNames[c.month] + " " + c.year + '</span><button class="roundbtn" onclick="changeMonth(1)">' + icon("chevR", 14) + "</button></div>" +
    '<div class="calgrid wk">' + ["S", "M", "T", "W", "T", "F", "S"].map(function (d) { return "<span>" + d + "</span>"; }).join("") + "</div>" +
    '<div class="calgrid">' + cells + '</div><p class="small row gap6 legend"><i class="dotm on"></i> Day with a scheduled event</p></div>';
}
function eventsStudent() {
  const u = me();
  let list;
  if (ui.cal.selected) list = sortedEvents().filter(function (e) { return e.date === ui.cal.selected; });
  else list = sortedEvents().filter(function (e) { return e.date >= todayISO(); });
  let right = "";
  if (ui.cal.selected) right += '<button class="linkbtn left" onclick="selectCalDate(null)">Showing ' + fmtDate(ui.cal.selected) + " &middot; Clear filter</button>";
  right += list.length ? list.map(function (e) { return eventCardStudent(e, u); }).join("") : empty(ui.cal.selected ? "No events on this day." : "No upcoming events yet.", "calendar");
  const body = '<div class="evgrid"><div class="evcal">' + calendarHTML() + '</div><div class="evlist">' + right + "</div></div>";
  return page("event", header("Event hub"), body, false, true);
}
function eventCardStudent(e, u) {
  const phase = eventPhase(e);
  const rsvp = db.rsvps.find(function (r) { return r.eventId === e.id && r.studentId === u.id; });
  const going = db.rsvps.filter(function (r) { return r.eventId === e.id; }).length;
  let btn;
  if (phase === "Cancelled") btn = badge("Cancelled");
  else if (phase === "Ended") btn = rsvp && rsvp.attended ? badge("Present") : badge("Ended");
  else if (rsvp && rsvp.attended) btn = badge("Present");
  else btn = '<button class="b ' + (rsvp ? "b-accent" : "b-accentsoft") + '" onclick="toggleRsvp(\'' + e.id + '\')">' + icon(rsvp ? "check" : "ticket", 13) + (rsvp ? " Going" : " RSVP") + "</button>";
  const mapOpen = ui.mapOpen === e.id;
  return '<div class="card pad' + (phase !== "Open" ? " faded" : "") + '"><div class="row between top"><div class="grow"><span class="tag t-gold">' + esc(e.tag) + '</span><p class="ttl mt">' + esc(e.title) + "</p>" +
    '<p class="sub row gap6">' + icon("calendar", 12) + fmtDate(e.date) + " &middot; " + fmtTime(e.time) + "</p>" +
    '<button class="linkbtn left sub row gap6" onclick="toggleMap(\'' + e.id + '\')">' + icon("mapPin", 12) + esc(e.place) + " &middot; " + (mapOpen ? "Hide map" : "View map") + "</button>" +
    (e.description ? '<p class="small">' + esc(e.description) + "</p>" : "") + '<p class="small">' + going + " going</p></div>" + btn + "</div>" +
    (mapOpen ? '<div class="mapbox"><iframe title="Map" loading="lazy" src="https://www.google.com/maps?q=' + mapQuery(e) + '&output=embed"></iframe><a class="b b-accent b-block" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=' + mapQuery(e) + '">' + icon("nav", 13) + " Get directions</a></div>" : "") + "</div>";
}
function toggleRsvp(eventId) {
  const u = me();
  const e = eventById(eventId);
  if (!e || eventPhase(e) !== "Open") { toast("This event is not open for RSVP."); render(); return; }
  const i = db.rsvps.findIndex(function (r) { return r.eventId === eventId && r.studentId === u.id; });
  if (i === -1) { db.rsvps.push({ id: uid("rv"), eventId: eventId, studentId: u.id, attended: false }); toast("You're going to " + e.title + "."); }
  else { db.rsvps.splice(i, 1); toast("RSVP removed."); }
  saveDB(); render();
}
 
/* ==========================================================================
   STUDENT - Registrar
   ========================================================================== */
function setRegTab(t) { ui.regTab = t; render(true); }
function selectDoc(i) { ui.reg.docIdx = i; render(); }
function selectPayment(k) { ui.reg.payKey = k; render(); }
function registrarStudent() {
  const u = me();
  const t = ui.regTab;
  let body = "";
  if (t === "new") {
    const doc = DOC_TYPES[ui.reg.docIdx];
    body = '<div class="card pad formcard"><div class="field"><label>Document type</label><div class="stack">' + DOC_TYPES.map(function (d, i) {
      return '<button class="opt' + (i === ui.reg.docIdx ? " on" : "") + '" onclick="selectDoc(' + i + ')"><span>' + esc(d.name) + '</span><span class="row gap8"><span class="small">' + peso(d.fee) + "</span>" + (i === ui.reg.docIdx ? icon("check", 14) : "") + "</span></button>";
    }).join("") + "</div></div>" +
      '<div class="field"><label>Purpose</label><input class="in" placeholder="e.g. Job application, transfer credentials" value="' + esc(ui.reg.purpose) + '" oninput="ui.reg.purpose=this.value"></div>' +
      '<div class="field"><label>Payment method</label><div class="grid3">' + PAYMENT_METHODS.map(function (p) {
        return '<button class="opt c' + (ui.reg.payKey === p.key ? " on" : "") + '" onclick="selectPayment(\'' + p.key + '\')">' + p.label + "</button>";
      }).join("") + "</div></div>" +
      '<div class="row between"><span class="small">Total fee</span><span class="ttl">' + peso(doc.fee) + ".00</span></div>" +
      '<p class="small">Online payments are simulated in this prototype. Cashier payments are collected when you pick up the document.</p>' +
      '<button class="b b-accent b-block big" onclick="submitRegistrar()">' + icon("send", 14) + " Submit request</button></div>";
  } else {
    const mine = db.registrar.filter(function (r) { return r.studentId === u.id; });
    body = mine.length ? mine.map(regCardStudent).join("") : empty("No requests yet.", "file");
  }
  return page("registrar", header("Registrar online", { tabs: [["new", "New request"], ["status", "My requests"]], active: t, onTab: "setRegTab" }), body);
}
function regCardStudent(r) {
  let act = "";
  if (r.status === "Pending") act = '<button class="b b-danger b-block" onclick="cancelRegistrar(\'' + r.id + '\')">Cancel request</button>';
  else if (r.status === "Processing") act = '<p class="small">Already being processed. Cancelling needs the Registrar to confirm.</p><button class="b b-danger b-block" onclick="cancelRegistrar(\'' + r.id + '\')">Request cancellation</button>';
  else if (r.status === "Cancellation requested") act = '<p class="small">Waiting for the Registrar to confirm your cancellation.</p>';
  else if (r.status === "Ready") act = '<p class="small">Ready for pickup. To change or cancel this request, please contact the Registrar office.</p>';
  return '<div class="card pad"><div class="row between top"><div class="grow"><p class="ttl">' + esc(r.type) + '</p><p class="sub">' + esc(r.purpose) + '</p><p class="small">Requested ' + fmtDate(r.date) + "</p></div>" + badge(r.status) + "</div>" +
    (r.note ? '<p class="small">Note from Registrar: ' + esc(r.note) + "</p>" : "") +
    '<div class="row between divider"><span class="small">' + peso(r.fee) + ".00 &middot; " + esc(r.payment) + "</span>" + (r.paymentStatus ? badge(r.paymentStatus) : "") + "</div>" + act + "</div>";
}
function submitRegistrar() {
  const u = me();
  const doc = DOC_TYPES[ui.reg.docIdx];
  const purpose = ui.reg.purpose.trim();
  const pay = PAYMENT_METHODS.find(function (p) { return p.key === ui.reg.payKey; });
  if (!purpose) { toast("Please enter the purpose of your request."); return; }
  if (!pay) { toast("Please choose a payment method."); return; }
  db.registrar.unshift({ id: uid("rg"), studentId: u.id, type: doc.name, fee: doc.fee, payment: pay.label, paymentStatus: pay.key === "counter" ? "Pay at pickup" : "Paid", purpose: purpose, date: todayISO(), status: "Pending" });
  notify("role:registrar", "New document request: " + doc.name + " from " + u.name + " (" + u.id + ").");
  ui.reg = { docIdx: 0, payKey: null, purpose: "" };
  ui.regTab = "status";
  saveDB();
  toast("Request submitted to the Registrar.");
  render(true);
}
function cancelRegistrar(id) {
  const r = db.registrar.find(function (x) { return x.id === id; });
  if (!r) return;
  const u = me();
  if (r.status === "Pending") {
    if (!confirm("Cancel this request?")) return;
    r.status = "Cancelled";
    r.paymentStatus = r.paymentStatus === "Paid" ? "Refund pending" : null;
    notify("role:registrar", u.name + " cancelled a pending request (" + r.type + ")." + (r.paymentStatus === "Refund pending" ? " A refund is needed." : ""));
    toast("Request cancelled.");
  } else if (r.status === "Processing") {
    if (!confirm("This request is already being processed. Send a cancellation request to the Registrar?")) return;
    r.prevStatus = r.status; r.status = "Cancellation requested";
    notify("role:registrar", u.name + " asked to cancel a request in process (" + r.type + ").");
    toast("Cancellation request sent.");
  }
  saveDB(); render();
}
 
/* ==========================================================================
   DORM STAFF
   ========================================================================== */
function homeDorm() {
  const u = me();
  const pend = db.roomRequests.filter(function (r) { return r.status === "Pending"; });
  const openM = db.maintenance.filter(function (m) { return m.status === "Pending" || m.status === "In Progress"; }).length;
  const canc = db.roomRequests.filter(function (r) { return r.status === "Cancellation requested"; }).length +
    db.maintenance.filter(function (m) { return m.status === "Cancellation requested"; }).length;
  const occ = db.rooms.filter(function (r) { return r.occupantId; }).length;
  let body = '<div class="stats">' +
    stat(pend.length, "Pending requests", "ui.dFilter='pending';goTo('d_requests')") +
    stat(openM, "Open maintenance", "ui.mFilter='pending';goTo('d_maint')") +
    stat(occ + "/" + db.rooms.length, "Rooms occupied", "goTo('d_requests')") + "</div>";
  if (canc) body += '<div class="note warn">' + canc + " cancellation request" + (canc === 1 ? "" : "s") + " waiting for your confirmation.</div>";
  body += '<p class="sect">Needs action</p>';
  body += pend.length ? pend.slice(0, 3).map(function (r) {
    return '<div class="card pad">' + person(r.studentId, badge("Pending")) + '<p class="sub mt">Requested room ' + esc(r.roomId) + " &middot; " + fmtDate(r.date) + '</p><div class="actions"><button class="b b-accent" onclick="ui.dFilter=\'pending\';goTo(\'d_requests\')">Review</button></div></div>';
  }).join("") : '<div class="card pad"><p class="small">No pending room requests.</p></div>';
  body += '<p class="sect">Rooms overview</p>' + db.rooms.map(function (r) {
    return '<div class="card pad row between"><div><p class="ttl">' + esc(r.id) + " &mdash; " + esc(r.building) + '</p><p class="sub">' + esc(r.floor) + " &middot; " + r.beds + " beds &middot; " + peso(r.price) + "/mo" + (r.occupantId ? " &middot; " + esc(nameOf(r.occupantId)) : "") + "</p></div>" + badge(r.occupantId ? "Occupied" : "Vacant") + "</div>";
  }).join("");
  return page("dorm", header(u.name, { bell: true, sub: "Dorm Staff &middot; " + esc(u.id) }), body);
}
 
function setDFilter(k) { ui.dFilter = k; render(true); }
function roomReqGroup(key) {
  return db.roomRequests.filter(function (r) {
    if (key === "pending") return r.status === "Pending";
    if (key === "approved") return r.status === "Approved";
    if (key === "cancel") return r.status === "Cancellation requested";
    return r.status === "Rejected" || r.status === "Cancelled";
  });
}
function dormRequests() {
  const keys = [["pending", "Pending"], ["approved", "Approved"], ["cancel", "Cancellations"], ["history", "History"]];
  const items = keys.map(function (k) { return [k[0], k[1], roomReqGroup(k[0]).length]; });
  const list = roomReqGroup(ui.dFilter);
  const body = chips(items, ui.dFilter, "setDFilter") + (list.length ? list.map(roomReqCard).join("") : empty("Nothing here.", "clipboard"));
  return page("dorm", header("Room requests"), body);
}
function roomReqCard(r) {
  const room = roomById(r.roomId) || { id: r.roomId, building: "", floor: "", beds: "", price: 0 };
  let act = "";
  if (r.status === "Pending") act = '<button class="b b-accent" onclick="approveRoom(\'' + r.id + '\')">Approve</button><button class="b b-danger" onclick="rejectRoom(\'' + r.id + '\')">Reject</button>';
  else if (r.status === "Cancellation requested") act = '<button class="b b-accent" onclick="confirmRoomCancel(\'' + r.id + '\')">Confirm cancel</button><button class="b b-soft" onclick="declineRoomCancel(\'' + r.id + '\')">Decline</button>';
  return '<div class="card pad">' + person(r.studentId, badge(r.status)) + '<div class="kv">' + kv("Room", room.id + " (" + room.building + ")") + kv("Floor / beds", room.floor + " / " + room.beds) + kv("Rate", peso(room.price) + "/mo", true) + kv("Requested", fmtDate(r.date)) + "</div>" +
    (r.note ? '<p class="small">Reason: ' + esc(r.note) + "</p>" : "") + (act ? '<div class="actions">' + act + "</div>" : "") + "</div>";
}
function approveRoom(id) {
  const r = db.roomRequests.find(function (x) { return x.id === id; });
  if (!r || r.status !== "Pending") return;
  const room = roomById(r.roomId);
  if (!room || room.occupantId) {
    r.status = "Rejected"; r.note = "Room is no longer available.";
    notify(r.studentId, "Your request for room " + r.roomId + " could not be approved: the room is no longer available.");
    saveDB(); toast("That room is already occupied. Request rejected."); render(); return;
  }
  room.occupantId = r.studentId;
  r.status = "Approved";
  notify(r.studentId, "Your request for room " + r.roomId + " was approved. Welcome to the dorm!");
  db.roomRequests.forEach(function (o) {
    if (o.id !== r.id && o.roomId === r.roomId && o.status === "Pending") {
      o.status = "Rejected"; o.note = "Room was assigned to another student.";
      notify(o.studentId, "Your request for room " + o.roomId + " was not approved: the room was assigned to another student.");
    }
  });
  saveDB(); toast("Approved. Room " + r.roomId + " is now occupied."); render();
}
function rejectRoom(id) {
  const r = db.roomRequests.find(function (x) { return x.id === id; });
  if (!r) return;
  const reason = prompt("Reason for rejecting (optional):", "");
  if (reason === null) return;
  r.status = "Rejected"; r.note = reason.trim();
  notify(r.studentId, "Your request for room " + r.roomId + " was not approved." + (r.note ? " Reason: " + r.note : ""));
  saveDB(); toast("Request rejected."); render();
}
function confirmRoomCancel(id) {
  const r = db.roomRequests.find(function (x) { return x.id === id; });
  if (!r) return;
  const room = roomById(r.roomId);
  if (room && room.occupantId === r.studentId) room.occupantId = null;
  r.status = "Cancelled"; delete r.prevStatus;
  notify(r.studentId, "Your cancellation for room " + r.roomId + " was confirmed. The room is now vacant.");
  saveDB(); toast("Cancellation confirmed. Room is vacant again."); render();
}
function declineRoomCancel(id) {
  const r = db.roomRequests.find(function (x) { return x.id === id; });
  if (!r) return;
  r.status = r.prevStatus || "Approved"; delete r.prevStatus;
  notify(r.studentId, "Your cancellation request for room " + r.roomId + " was declined. Please visit the Dorm Office.");
  saveDB(); toast("Cancellation declined."); render();
}
 
/* maintenance (staff) */
function setMFilter(k) { ui.mFilter = k; render(true); }
function maintGroup(key) {
  return db.maintenance.filter(function (m) {
    if (key === "pending") return m.status === "Pending";
    if (key === "progress") return m.status === "In Progress";
    if (key === "cancel") return m.status === "Cancellation requested";
    return m.status === "Resolved" || m.status === "Cancelled";
  });
}
function dormMaintenance() {
  const keys = [["pending", "Pending"], ["progress", "In progress"], ["cancel", "Cancellations"], ["history", "History"]];
  const items = keys.map(function (k) { return [k[0], k[1], maintGroup(k[0]).length]; });
  const list = maintGroup(ui.mFilter);
  const body = chips(items, ui.mFilter, "setMFilter") + (list.length ? list.map(maintCard).join("") : empty("Nothing here.", "wrench"));
  return page("dorm", header("Maintenance tickets"), body);
}
function maintCard(t) {
  let act = "";
  if (t.status === "Pending") act = '<button class="b b-accent" onclick="startMaint(\'' + t.id + '\')">Start work</button>';
  else if (t.status === "In Progress") act = '<button class="b b-accent" onclick="resolveMaint(\'' + t.id + '\')">Mark resolved</button>';
  else if (t.status === "Cancellation requested") act = '<button class="b b-accent" onclick="confirmMaintCancel(\'' + t.id + '\')">Confirm cancel</button><button class="b b-soft" onclick="declineMaintCancel(\'' + t.id + '\')">Decline</button>';
  return '<div class="card pad">' + person(t.studentId, badge(t.status)) + '<p class="ttl mt">' + esc(t.text) + '</p><p class="sub">Room ' + esc(t.roomId) + " &middot; " + fmtDate(t.date) + "</p>" +
    (t.photo ? '<img class="thumb" src="' + t.photo + '" alt="" onclick="viewPhoto(\'m\',\'' + t.id + '\')"><p class="small">Tap the photo to enlarge.</p>' : "") + (act ? '<div class="actions">' + act + "</div>" : "") + "</div>";
}
function startMaint(id) {
  const t = db.maintenance.find(function (x) { return x.id === id; });
  if (!t) return;
  t.status = "In Progress";
  notify(t.studentId, "The Dorm Office started working on your maintenance request (room " + t.roomId + ").");
  saveDB(); toast("Marked as in progress."); render();
}
function resolveMaint(id) {
  const t = db.maintenance.find(function (x) { return x.id === id; });
  if (!t) return;
  t.status = "Resolved";
  notify(t.studentId, "Your maintenance request for room " + t.roomId + " was resolved.");
  saveDB(); toast("Marked as resolved."); render();
}
function confirmMaintCancel(id) {
  const t = db.maintenance.find(function (x) { return x.id === id; });
  if (!t) return;
  t.status = "Cancelled"; delete t.prevStatus;
  notify(t.studentId, "Your maintenance cancellation was confirmed.");
  saveDB(); toast("Cancellation confirmed."); render();
}
function declineMaintCancel(id) {
  const t = db.maintenance.find(function (x) { return x.id === id; });
  if (!t) return;
  t.status = t.prevStatus || "In Progress"; delete t.prevStatus;
  notify(t.studentId, "Your maintenance cancellation request was declined. Work is already in progress.");
  saveDB(); toast("Cancellation declined."); render();
}
 
/* ==========================================================================
   EVENT HANDLER
   ========================================================================== */
function homeEvent() {
  const u = me();
  const upcoming = sortedEvents().filter(function (e) { return e.status === "Active" && e.date >= todayISO(); });
  const totalRsvp = db.rsvps.filter(function (r) { const e = eventById(r.eventId); return e && e.status === "Active" && e.date >= todayISO(); }).length;
  const todayN = upcoming.filter(function (e) { return e.date === todayISO(); }).length;
  let body = '<div class="stats">' + stat(upcoming.length, "Upcoming events", "goTo('e_events')") + stat(totalRsvp, "Total RSVPs", "goTo('e_attend')") + stat(todayN, "Happening today", "goTo('e_attend')") + "</div>" +
    '<button class="b b-accent b-block big" onclick="openEventForm()">' + icon("plus", 14) + " Create event</button>" +
    '<p class="sect">Coming up</p>';
  body += upcoming.length ? upcoming.slice(0, 4).map(function (e) {
    const n = db.rsvps.filter(function (r) { return r.eventId === e.id; }).length;
    return '<div class="card pad row between"><div><span class="tag t-gold">' + esc(e.tag) + '</span><p class="ttl mt">' + esc(e.title) + '</p><p class="sub">' + fmtDate(e.date) + " &middot; " + fmtTime(e.time) + " &middot; " + esc(e.place) + '</p></div><div class="center"><span class="num">' + n + '</span><span class="small">going</span></div></div>';
  }).join("") : '<div class="card pad"><p class="small">No upcoming events. Create one to get started.</p></div>';
  return page("event", header(u.name, { bell: true, sub: "Event Handler &middot; " + esc(u.id) }), body);
}
function eventManage() {
  const list = sortedEvents();
  let body = '<button class="b b-accent b-block big" onclick="openEventForm()">' + icon("plus", 14) + " Create event</button>";
  body += list.length ? list.map(function (e) {
    const phase = eventPhase(e);
    const n = db.rsvps.filter(function (r) { return r.eventId === e.id; });
    const pres = n.filter(function (r) { return r.attended; }).length;
    let act = '<button class="b b-soft" onclick="openAttendance(\'' + e.id + '\')">Attendees</button>';
    if (phase === "Open") act = '<button class="b b-soft" onclick="openEventForm(\'' + e.id + '\')">' + icon("pencil", 12) + " Edit</button>" + act + '<button class="b b-danger" onclick="cancelEvent(\'' + e.id + '\')">Cancel event</button>';
    return '<div class="card pad' + (phase !== "Open" ? " faded" : "") + '"><div class="row between top"><div class="grow"><span class="tag t-gold">' + esc(e.tag) + '</span><p class="ttl mt">' + esc(e.title) + '</p><p class="sub">' + fmtDate(e.date) + " &middot; " + fmtTime(e.time) + " &middot; " + esc(e.place) + '</p><p class="small">' + n.length + " going &middot; " + pres + " present</p></div>" + (phase === "Open" ? badge("Active") : badge(phase)) + '</div><div class="actions">' + act + "</div></div>";
  }).join("") : empty("No events yet.", "calendar");
  return page("event", header("Manage events"), body);
}
function openEventForm(id) {
  const f = blankEventForm();
  if (id) {
    const e = eventById(id);
    if (e) { f.id = e.id; f.title = e.title; f.date = e.date; f.time = e.time; f.place = e.place; f.tag = e.tag; f.description = e.description || ""; }
  }
  ui.eventForm = f;
  goTo("e_form");
}
function eventFormScreen() {
  const f = ui.eventForm;
  const body = '<div class="card pad formcard">' +
    '<div class="field"><label>Event title</label><input class="in" placeholder="e.g. Founders Day Program" value="' + esc(f.title) + '" oninput="ui.eventForm.title=this.value"></div>' +
    '<div class="two"><div class="field"><label>Date</label><input class="in" type="date" min="' + todayISO() + '" value="' + esc(f.date) + '" oninput="ui.eventForm.date=this.value" onchange="ui.eventForm.date=this.value"></div>' +
    '<div class="field"><label>Time</label><input class="in" type="time" value="' + esc(f.time) + '" oninput="ui.eventForm.time=this.value" onchange="ui.eventForm.time=this.value"></div></div>' +
    '<div class="field"><label>Place</label><input class="in" placeholder="e.g. University Gym" value="' + esc(f.place) + '" oninput="ui.eventForm.place=this.value"></div>' +
    '<div class="field"><label>Category</label><select class="in" onchange="ui.eventForm.tag=this.value">' + EVENT_TAGS.map(function (t) { return '<option value="' + t + '"' + (f.tag === t ? " selected" : "") + ">" + t + "</option>"; }).join("") + "</select></div>" +
    '<div class="field"><label>Description (optional)</label><textarea class="in" rows="3" placeholder="What is this event about?" oninput="ui.eventForm.description=this.value">' + esc(f.description) + "</textarea></div>" +
    (f.error ? '<p class="formerr">' + esc(f.error) + "</p>" : "") +
    '<button class="b b-accent b-block big" onclick="saveEvent()">' + (f.id ? "Save changes" : "Publish event") + "</button></div>";
  return page("event", header(f.id ? "Edit event" : "Create event", { back: "goTo('e_events')" }), body);
}
function saveEvent() {
  const f = ui.eventForm;
  const title = f.title.trim(), place = f.place.trim();
  if (!title || !f.date || !f.time || !place) { f.error = "Please fill in the title, date, time, and place."; render(); return; }
  if (f.date < todayISO()) { f.error = "The event date cannot be in the past."; render(); return; }
  const u = me();
  if (f.id) {
    const e = eventById(f.id);
    if (e) {
      e.title = title; e.date = f.date; e.time = f.time; e.place = place; e.tag = f.tag; e.description = f.description.trim();
      db.rsvps.filter(function (r) { return r.eventId === e.id; }).forEach(function (r) { notify(r.studentId, "The event \"" + e.title + "\" was updated: " + fmtDate(e.date) + ", " + fmtTime(e.time) + " at " + e.place + "."); });
    }
    toast("Event updated.");
  } else {
    const ne = { id: uid("ev"), title: title, date: f.date, time: f.time, place: place, tag: f.tag, description: f.description.trim(), status: "Active", createdBy: u.id };
    db.events.push(ne);
    db.accounts.filter(function (a) { return a.role === "student"; }).forEach(function (a) { notify(a.id, "New event: " + ne.title + " on " + fmtDate(ne.date) + " at " + ne.place + "."); });
    toast("Event published. Students were notified.");
  }
  ui.eventForm = blankEventForm();
  saveDB();
  goTo("e_events");
}
function cancelEvent(id) {
  const e = eventById(id);
  if (!e) return;
  if (!confirm("Cancel \"" + e.title + "\"? Students who RSVP'd will be notified.")) return;
  e.status = "Cancelled";
  db.rsvps.filter(function (r) { return r.eventId === id; }).forEach(function (r) { notify(r.studentId, "The event \"" + e.title + "\" was cancelled."); });
  saveDB(); toast("Event cancelled."); render();
}
function ensureAttendEvent() {
  const active = sortedEvents().filter(function (e) { return e.status === "Active"; });
  if (ui.attendEventId && active.some(function (e) { return e.id === ui.attendEventId; })) return;
  const t = todayISO();
  const pick = active.find(function (e) { return e.date === t; }) || active.find(function (e) { return e.date >= t; }) || active[0];
  ui.attendEventId = pick ? pick.id : null;
}
function openAttendance(id) { ui.attendEventId = id; goTo("e_attend"); }
function setAttendEvent(id) { ui.attendEventId = id; render(true); }
function eventAttendance() {
  ensureAttendEvent();
  const active = sortedEvents().filter(function (e) { return e.status === "Active"; });
  if (!active.length) return page("event", header("Attendance"), empty("No active events yet.", "users"));
  const e = eventById(ui.attendEventId);
  const list = db.rsvps.filter(function (r) { return r.eventId === e.id; });
  const present = list.filter(function (r) { return r.attended; }).length;
  const canMark = e.date <= todayISO();
  let body = '<div class="field"><label class="sect nomt">Event</label><select class="in" onchange="setAttendEvent(this.value)">' + active.map(function (x) {
    return '<option value="' + x.id + '"' + (x.id === e.id ? " selected" : "") + ">" + esc(x.title) + " (" + fmtDate(x.date) + ")</option>";
  }).join("") + "</select></div>" +
    '<div class="card pad row between"><div><p class="ttl">' + esc(e.title) + '</p><p class="sub">' + fmtDate(e.date) + " &middot; " + fmtTime(e.time) + " &middot; " + esc(e.place) + '</p></div><div class="center"><span class="num">' + present + "/" + list.length + '</span><span class="small">present</span></div></div>';
  if (!canMark) body += '<div class="note">Attendance opens on the day of the event (' + fmtDate(e.date) + "). You can still see who has RSVP'd.</div>";
  body += list.length ? list.map(function (r) {
    const right = canMark ? '<button class="b ' + (r.attended ? "b-accent" : "b-soft") + '" onclick="toggleAttend(\'' + r.id + '\')">' + (r.attended ? icon("check", 13) + " Present" : "Mark present") + "</button>" : badge("Pending");
    return '<div class="card pad">' + person(r.studentId, right) + "</div>";
  }).join("") : empty("No RSVPs for this event yet.", "users");
  return page("event", header("Attendance"), body);
}
function toggleAttend(id) {
  const r = db.rsvps.find(function (x) { return x.id === id; });
  if (!r) return;
  const e = eventById(r.eventId);
  if (!e || e.date > todayISO()) { toast("Attendance opens on the event day."); return; }
  r.attended = !r.attended;
  saveDB(); render();
}
 
/* ==========================================================================
   REGISTRAR STAFF
   ========================================================================== */
function regGroup(key) {
  return db.registrar.filter(function (r) {
    if (key === "pending") return r.status === "Pending";
    if (key === "processing") return r.status === "Processing";
    if (key === "ready") return r.status === "Ready";
    if (key === "cancel") return r.status === "Cancellation requested";
    return r.status === "Released" || r.status === "Cancelled" || r.status === "Rejected";
  });
}
function homeRegistrar() {
  const u = me();
  const collected = db.registrar.filter(function (r) { return r.paymentStatus === "Paid"; }).reduce(function (s, r) { return s + r.fee; }, 0);
  const canc = regGroup("cancel").length;
  let body = '<div class="stats four">' + stat(regGroup("pending").length, "Pending", "ui.rFilter='pending';goTo('r_requests')") + stat(regGroup("processing").length, "Processing", "ui.rFilter='processing';goTo('r_requests')") +
    stat(regGroup("ready").length, "Ready", "ui.rFilter='ready';goTo('r_requests')") + stat(canc, "Cancel", "ui.rFilter='cancel';goTo('r_requests')") + "</div>" +
    '<div class="card pad row between"><div><p class="sub">Payments collected</p><p class="ttl big">' + peso(collected) + '.00</p></div><button class="b b-soft" onclick="goTo(\'r_payments\')">View payments</button></div>' +
    '<p class="sect">Needs action</p>';
  const pend = regGroup("pending");
  body += pend.length ? pend.slice(0, 3).map(function (r) {
    return '<div class="card pad">' + person(r.studentId, badge("Pending")) + '<p class="ttl mt">' + esc(r.type) + '</p><p class="sub">' + esc(r.purpose) + '</p><div class="actions"><button class="b b-accent" onclick="ui.rFilter=\'pending\';goTo(\'r_requests\')">Review</button></div></div>';
  }).join("") : '<div class="card pad"><p class="small">No pending document requests.</p></div>';
  return page("registrar", header(u.name, { bell: true, sub: "Registrar Staff &middot; " + esc(u.id) }), body);
}
function setRFilter(k) { ui.rFilter = k; render(true); }
function registrarRequests() {
  const keys = [["pending", "Pending"], ["processing", "Processing"], ["ready", "Ready"], ["cancel", "Cancellations"], ["history", "History"]];
  const items = keys.map(function (k) { return [k[0], k[1], regGroup(k[0]).length]; });
  const list = regGroup(ui.rFilter);
  const body = chips(items, ui.rFilter, "setRFilter") + (list.length ? list.map(regCardStaff).join("") : empty("Nothing here.", "file"));
  return page("registrar", header("Document requests"), body);
}
function regCardStaff(r) {
  let act = "";
  if (r.status === "Pending") act = '<button class="b b-accent" onclick="startRegistrar(\'' + r.id + '\')">Start processing</button><button class="b b-danger" onclick="rejectRegistrar(\'' + r.id + '\')">Reject</button>';
  else if (r.status === "Processing") act = '<button class="b b-accent" onclick="markReady(\'' + r.id + '\')">Mark ready</button>';
  else if (r.status === "Ready") act = '<button class="b b-accent" onclick="releaseDoc(\'' + r.id + '\')">' + (r.paymentStatus === "Pay at pickup" ? "Collect &amp; release" : "Release") + "</button>";
  else if (r.status === "Cancellation requested") act = '<button class="b b-accent" onclick="confirmRegCancel(\'' + r.id + '\')">Confirm cancel</button><button class="b b-soft" onclick="declineRegCancel(\'' + r.id + '\')">Decline</button>';
  return '<div class="card pad">' + person(r.studentId, badge(r.status)) + '<p class="ttl mt">' + esc(r.type) + '</p><p class="sub">' + esc(r.purpose) + " &middot; " + fmtDate(r.date) + "</p>" + (r.note ? '<p class="small">Note: ' + esc(r.note) + "</p>" : "") +
    '<div class="row between divider"><span class="small">' + peso(r.fee) + ".00 &middot; " + esc(r.payment) + "</span>" + (r.paymentStatus ? badge(r.paymentStatus) : "") + "</div>" + (act ? '<div class="actions">' + act + "</div>" : "") + "</div>";
}
function regById(id) { return db.registrar.find(function (x) { return x.id === id; }); }
function startRegistrar(id) {
  const r = regById(id); if (!r) return;
  r.status = "Processing";
  notify(r.studentId, "The Registrar started processing your " + r.type + ".");
  saveDB(); toast("Moved to processing."); render();
}
function markReady(id) {
  const r = regById(id); if (!r) return;
  r.status = "Ready";
  notify(r.studentId, "Your " + r.type + " is ready for pickup at the Registrar's office." + (r.paymentStatus === "Pay at pickup" ? " Please bring PHP " + r.fee + " for payment." : ""));
  saveDB(); toast("Marked as ready for pickup."); render();
}
function releaseDoc(id) {
  const r = regById(id); if (!r) return;
  if (r.paymentStatus === "Pay at pickup") {
    if (!confirm("Collect PHP " + r.fee + " from the student before releasing?")) return;
    r.paymentStatus = "Paid";
  }
  r.status = "Released";
  notify(r.studentId, "Your " + r.type + " was released. Thank you!");
  saveDB(); toast("Document released."); render();
}
function rejectRegistrar(id) {
  const r = regById(id); if (!r) return;
  const reason = prompt("Reason for rejecting (optional):", "");
  if (reason === null) return;
  r.status = "Rejected"; r.note = reason.trim();
  r.paymentStatus = r.paymentStatus === "Paid" ? "Refund pending" : null;
  notify(r.studentId, "Your " + r.type + " request was rejected." + (r.note ? " Reason: " + r.note : "") + (r.paymentStatus === "Refund pending" ? " Your payment will be refunded." : ""));
  saveDB(); toast("Request rejected."); render();
}
function confirmRegCancel(id) {
  const r = regById(id); if (!r) return;
  r.status = "Cancelled"; delete r.prevStatus;
  r.paymentStatus = r.paymentStatus === "Paid" ? "Refund pending" : null;
  notify(r.studentId, "Your cancellation of " + r.type + " was confirmed." + (r.paymentStatus === "Refund pending" ? " Your payment will be refunded." : ""));
  saveDB(); toast("Cancellation confirmed."); render();
}
function declineRegCancel(id) {
  const r = regById(id); if (!r) return;
  r.status = r.prevStatus || "Processing"; delete r.prevStatus;
  notify(r.studentId, "Your cancellation request for " + r.type + " was declined because it is already being processed.");
  saveDB(); toast("Cancellation declined."); render();
}
function registrarPayments() {
  const all = db.registrar.filter(function (r) { return r.paymentStatus; });
  const sum = function (arr) { return arr.reduce(function (s, r) { return s + r.fee; }, 0); };
  const collected = sum(all.filter(function (r) { return r.paymentStatus === "Paid"; }));
  const toCollect = sum(all.filter(function (r) { return r.paymentStatus === "Pay at pickup" && OPEN_REG.indexOf(r.status) !== -1; }));
  const refunds = all.filter(function (r) { return r.paymentStatus === "Refund pending"; });
  let body = '<div class="stats"><div class="stat static"><span class="num sm">' + peso(collected) + '</span><span class="lbl">Collected</span></div><div class="stat static"><span class="num sm">' + peso(toCollect) + '</span><span class="lbl">To collect</span></div><div class="stat static"><span class="num sm">' + refunds.length + '</span><span class="lbl">Refunds due</span></div></div>';
  if (refunds.length) {
    body += '<p class="sect">Refunds to process</p>' + refunds.map(function (r) {
      return '<div class="card pad">' + person(r.studentId, badge("Refund pending")) + '<p class="sub mt">' + esc(r.type) + " &middot; " + peso(r.fee) + ".00 via " + esc(r.payment) + '</p><div class="actions"><button class="b b-accent" onclick="markRefunded(\'' + r.id + '\')">Mark refunded</button></div></div>';
    }).join("");
  }
  body += '<p class="sect">Payment ledger</p>' + (all.length ? all.slice(0, 15).map(function (r) {
    return '<div class="card pad row between"><div><p class="ttl">' + esc(r.type) + '</p><p class="sub">' + esc(nameOf(r.studentId)) + " &middot; " + esc(r.payment) + " &middot; " + fmtDate(r.date) + '</p></div><div class="right"><p class="ttl">' + peso(r.fee) + "</p>" + badge(r.paymentStatus) + "</div></div>";
  }).join("") : empty("No payments yet.", "wallet"));
  return page("registrar", header("Payments"), body);
}
function markRefunded(id) {
  const r = regById(id); if (!r) return;
  r.paymentStatus = "Refunded";
  notify(r.studentId, "Your refund of PHP " + r.fee + " for " + r.type + " was processed.");
  saveDB(); toast("Marked as refunded."); render();
}
 
/* ==========================================================================
   PROFILE (all roles)
   ========================================================================== */
function profileScreen() {
  const u = me();
  const body = '<div class="card pad profilecard">' + avatar(u, 88) + '<p class="ttl big mt">' + esc(u.name) + '</p><p class="sub">ID: ' + esc(u.id) + '</p><span class="tag t-role">' + ROLES[u.role].label + "</span></div>" +
    '<div class="card pad"><div class="inforow">' + icon("phone", 16) + '<div><p class="small">Mobile number</p><p class="ttl">' + esc(u.mobile || "Not set") + '</p></div></div><div class="inforow">' + icon("mail", 16) + '<div><p class="small">Email</p><p class="ttl">' + esc(u.email || "Not set") + '</p></div></div></div>' +
    '<button class="b b-accent b-block big" onclick="openProfileEdit()">' + icon("pencil", 14) + " Edit profile</button>" +
    (u.role === "student" ? '<div class="card pad"><p class="ttl">Testing data</p><p class="sub">Remove your student account and the requests, maintenance reports, RSVPs, and personal notifications you created while testing. Shared rooms and events will remain.</p><button class="b b-danger b-block" onclick="clearMyTestData()">Clear my test data</button></div>' : "") +
    '<button class="b b-danger b-block big" onclick="logout()">' + icon("logout", 14) + " Log out</button>";
  return page(ROLES[u.role].theme, header("Profile"), body);
}
function clearMyTestData() {
  const u = me();
  if (!u || u.role !== "student") return;
  const id = u.id;
  if (!confirm("Clear your test data? This will permanently delete your student account and your dorm requests, maintenance reports, event RSVPs, and registrar requests from this browser. You will need to create a new account to use UniHub again. Shared rooms, events, and other accounts will not be deleted.")) return;

  db.accounts = db.accounts.filter(function (a) { return a.id !== id; });
  db.rooms = db.rooms.map(function (r) {
    if (r.occupantId === id) r.occupantId = null;
    return r;
  });
  db.roomRequests = db.roomRequests.filter(function (r) { return r.studentId !== id; });
  db.maintenance = db.maintenance.filter(function (m) { return m.studentId !== id; });
  db.rsvps = db.rsvps.filter(function (r) { return r.studentId !== id; });
  db.registrar = db.registrar.filter(function (r) { return r.studentId !== id; });
  db.notifications = db.notifications.filter(function (n) {
    return n.to !== id && n.userId !== id && n.accountId !== id;
  });
  saveDB();
  ui.userId = null;
  setSession(null);
  ui.screen = "login";
  ui.loginId = ""; ui.loginPw = ""; ui.loginError = "";
  render(true);
  toast("Your test data was cleared.");
}
function openProfileEdit() {
  const u = me();
  ui.profileEdit = { mobile: u.mobile || "", email: u.email || "", photo: undefined, error: "" };
  goTo("profile_edit");
}
function profileEditScreen() {
  const u = me();
  const pe = ui.profileEdit;
  const shownPhoto = pe.photo === undefined ? u.photo : (pe.photo === "REMOVE" ? null : pe.photo);
  const preview = { name: u.name, photo: shownPhoto };
  const body = '<div class="card pad formcard"><div class="center">' + avatar(preview, 96) + '<div class="row gap8 center mt"><label class="b b-soft attach">' + icon("camera", 14) + ' Change photo<input type="file" accept="image/*" onchange="changeProfilePhoto(event)" hidden></label>' +
    (shownPhoto ? '<button class="b b-soft" onclick="removeProfilePhoto()">Remove</button>' : "") + "</div></div>" +
    '<div class="field"><label>Full name</label><input class="in locked" value="' + esc(u.name) + '" disabled></div>' +
    '<div class="field"><label>ID number</label><input class="in locked" value="' + esc(u.id) + '" disabled></div>' +
    '<div class="field"><label>Mobile number</label><input class="in" type="tel" value="' + esc(pe.mobile) + '" oninput="ui.profileEdit.mobile=this.value"></div>' +
    '<div class="field"><label>Email</label><input class="in" type="email" value="' + esc(pe.email) + '" oninput="ui.profileEdit.email=this.value"></div>' +
    '<p class="small">Your name and ID number can only be changed by the university office.</p>' +
    (pe.error ? '<p class="formerr">' + esc(pe.error) + "</p>" : "") +
    '<button class="b b-accent b-block big" onclick="saveProfile()">Save changes</button><button class="b b-soft b-block" onclick="goTo(\'profile\')">Cancel</button></div>';
  return page(ROLES[u.role].theme, header("Edit profile", { back: "goTo('profile')" }), body);
}
function changeProfilePhoto(ev) {
  const file = ev.target.files && ev.target.files[0];
  if (!file) return;
  resizeImage(file, 256, 0.82, true).then(function (url) {
    ui.profileEdit.photo = url; ui.profileEdit.error = ""; render();
  }).catch(function (e) {
    ui.profileEdit.error = e.message === "type" ? "Please choose an image file." : e.message === "size" ? "That image is too large (max 10 MB)." : "Could not read that image.";
    render();
  });
}
function removeProfilePhoto() { ui.profileEdit.photo = "REMOVE"; render(); }
function saveProfile() {
  const u = me();
  const pe = ui.profileEdit;
  const mobile = pe.mobile.replace(/[\s-]/g, "");
  const email = pe.email.trim();
  if (!validMobile(mobile)) { pe.error = "Enter a valid mobile number (e.g. 09171234567)."; render(); return; }
  if (!validEmail(email)) { pe.error = "Enter a valid email address."; render(); return; }
  u.mobile = mobile; u.email = email;
  if (pe.photo === "REMOVE") u.photo = null;
  else if (pe.photo) u.photo = pe.photo;
  saveDB();
  toast("Profile updated.");
  goTo("profile");
}
 
/* ==========================================================================
   Start
   ========================================================================== */
loadDB();
(function () {
  const sid = getSession();
  const su = sid ? userById(sid) : null;
  if (su) {
    ui.userId = su.id;
    ui.dormTab = (su.role === "student" && activeRoomReq(su.id)) ? "room" : "browse";
    ui.screen = "home";
  } else if (sid) {
    setSession(null);
  }
})();
render(true);
