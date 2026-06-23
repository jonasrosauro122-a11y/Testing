const DEFAULTS = {
  leadStages: ["New Lead", "Contacted", "Warm Lead", "Waiting for Response", "Booked", "Completed", "Follow-Up Needed", "Closed/Lost"],
  serviceCategories: ["NDIS", "Exercise Physiology", "Telehealth", "Home Visit", "Diabetes Program", "WorkCover", "Stoma Care", "Falls Prevention", "Lungs in Action", "Walking Group", "General Enquiry"],
  urgencyLevels: ["Critical", "High", "Medium", "Low"],
  users: ["Hassan", "Jason", "Executive Assistant", "Unassigned", "Needs Review"],
  enquirySources: ["Website Contact Form", "Phone Call", "Email", "Halaxy Booking", "NDIS Referral", "GP Referral", "Social Media", "Returning Client", "Word of Mouth"],
  reminderTypes: ["No reply follow-up", "Booking confirmation", "Appointment reminder", "Warm lead check-in", "Referral follow-up", "Post-appointment follow-up", "Missing information follow-up"]
};

const APP_VERSION = "3.0-professional-demo";
const STORAGE_KEY = "holistic-ep-command-center-v3";
const today = new Date();

const fmt = (offset = 0) => {
  const d = new Date(today);
  d.setDate(today.getDate() + offset);
  return d.toISOString().slice(0, 10);
};
const uid = () => (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function")
  ? globalThis.crypto.randomUUID()
  : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const clone = obj => JSON.parse(JSON.stringify(obj));
const esc = (v = "") => String(v).replace(/[&<>'"]/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" }[ch]));
const selected = (a, b) => String(a) === String(b || "") ? "selected" : "";

const seedState = {
  appVersion: APP_VERSION,
  session: null,
  currentPage: "dashboard",
  filters: {},
  settings: DEFAULTS,
  leads: [
    { id: uid(), name: "Amelia Tran", phone: "0412 223 119", email: "amelia.tran@example.com", enquirySource: "Website Contact Form", serviceCategory: "NDIS", stage: "New Lead", assignedTo: "Hassan", priority: "High", lastContactDate: fmt(-1), nextFollowUpDate: fmt(0), appointmentDate: "", notes: "NDIS participant asking about ongoing exercise physiology support to improve mobility and independence.", history: ["Website enquiry received", "NDIS service category tagged"], createdAt: fmt(-2), updatedAt: fmt(-1), closedLostReason: "" },
    { id: uid(), name: "Michael Rivera", phone: "0404 991 220", email: "michael.rivera@example.com", enquirySource: "GP Referral", serviceCategory: "Diabetes Program", stage: "Warm Lead", assignedTo: "Jason", priority: "Medium", lastContactDate: fmt(-3), nextFollowUpDate: fmt(0), appointmentDate: "", notes: "GP referred client asking about diabetes program, exercise plan, and appointment availability.", history: ["GP referral received", "Initial call completed", "Waiting for preferred appointment time"], createdAt: fmt(-6), updatedAt: fmt(-3), closedLostReason: "" },
    { id: uid(), name: "Sarah Nguyen", phone: "0433 880 154", email: "sarah.nguyen@example.com", enquirySource: "Phone Call", serviceCategory: "Home Visit", stage: "Waiting for Response", assignedTo: "Executive Assistant", priority: "High", lastContactDate: fmt(-2), nextFollowUpDate: fmt(0), appointmentDate: "", notes: "Needs home visit availability confirmation for next week. Awaiting response after EA sent options.", history: ["Called clinic", "EA sent availability options"], createdAt: fmt(-4), updatedAt: fmt(-2), closedLostReason: "" },
    { id: uid(), name: "Daniel Brooks", phone: "0499 234 100", email: "daniel.brooks@example.com", enquirySource: "Halaxy Booking", serviceCategory: "Exercise Physiology", stage: "Booked", assignedTo: "Jason", priority: "Medium", lastContactDate: fmt(-1), nextFollowUpDate: fmt(3), appointmentDate: fmt(5), notes: "Initial assessment booked. Needs reminder and intake form confirmation.", history: ["Halaxy booking received", "Appointment confirmed"], createdAt: fmt(-3), updatedAt: fmt(-1), closedLostReason: "" },
    { id: uid(), name: "Grace Patel", phone: "0422 333 889", email: "grace.patel@example.com", enquirySource: "Email", serviceCategory: "Falls Prevention", stage: "Follow-Up Needed", assignedTo: "Hassan", priority: "Critical", lastContactDate: fmt(-5), nextFollowUpDate: fmt(-1), appointmentDate: "", notes: "Daughter requested falls prevention program details for elderly parent. Follow-up is overdue.", history: ["Email enquiry received", "Program information sent"], createdAt: fmt(-8), updatedAt: fmt(-5), closedLostReason: "" },
    { id: uid(), name: "Oliver Hart", phone: "0411 762 992", email: "oliver.hart@example.com", enquirySource: "NDIS Referral", serviceCategory: "NDIS", stage: "Contacted", assignedTo: "Executive Assistant", priority: "High", lastContactDate: fmt(0), nextFollowUpDate: fmt(2), appointmentDate: "", notes: "Support coordinator requested callback and service availability information.", history: ["NDIS referral received", "EA called and left voicemail"], createdAt: fmt(-1), updatedAt: fmt(0), closedLostReason: "" },
    { id: uid(), name: "Lillian Morris", phone: "0402 998 121", email: "lillian.morris@example.com", enquirySource: "Returning Client", serviceCategory: "Lungs in Action", stage: "Completed", assignedTo: "Jason", priority: "Low", lastContactDate: fmt(-7), nextFollowUpDate: fmt(14), appointmentDate: fmt(-7), notes: "Completed session. Post-session check-in scheduled.", history: ["Session completed", "Follow-up scheduled"], createdAt: fmt(-14), updatedAt: fmt(-7), closedLostReason: "" },
    { id: uid(), name: "Priya Singh", phone: "0478 432 566", email: "priya.singh@example.com", enquirySource: "Social Media", serviceCategory: "Telehealth", stage: "Warm Lead", assignedTo: "Executive Assistant", priority: "Medium", lastContactDate: fmt(-2), nextFollowUpDate: fmt(1), appointmentDate: "", notes: "Asked if telehealth is suitable while recovering from injury. Send booking link if still interested.", history: ["Social message received", "EA replied with general telehealth process"], createdAt: fmt(-3), updatedAt: fmt(-2), closedLostReason: "" },
    { id: uid(), name: "Henry Wilson", phone: "0419 989 787", email: "henry.wilson@example.com", enquirySource: "Email", serviceCategory: "WorkCover", stage: "Closed/Lost", assignedTo: "Hassan", priority: "Low", lastContactDate: fmt(-9), nextFollowUpDate: "", appointmentDate: "", notes: "Client chose another provider due to location preference.", history: ["WorkCover enquiry received", "Follow-up sent", "Closed after client update"], createdAt: fmt(-15), updatedAt: fmt(-9), closedLostReason: "Chose another provider closer to home." },
    { id: uid(), name: "Mina Chen", phone: "0408 112 400", email: "mina.chen@example.com", enquirySource: "Word of Mouth", serviceCategory: "Walking Group", stage: "New Lead", assignedTo: "Executive Assistant", priority: "Medium", lastContactDate: "", nextFollowUpDate: fmt(0), appointmentDate: "", notes: "Interested in walking group schedule and eligibility.", history: ["Lead entered by EA"], createdAt: fmt(0), updatedAt: fmt(0), closedLostReason: "" },
    { id: uid(), name: "Noah Williams", phone: "0444 212 144", email: "noah.williams@example.com", enquirySource: "GP Referral", serviceCategory: "Exercise Physiology", stage: "Contacted", assignedTo: "Jason", priority: "High", lastContactDate: fmt(-1), nextFollowUpDate: fmt(1), appointmentDate: "", notes: "Musculoskeletal pain; wants to understand initial assessment process.", history: ["GP referral received", "Jason review requested"], createdAt: fmt(-2), updatedAt: fmt(-1), closedLostReason: "" },
    { id: uid(), name: "Rachel Evans", phone: "0400 339 812", email: "rachel.evans@example.com", enquirySource: "Website Contact Form", serviceCategory: "Stoma Care", stage: "Waiting for Response", assignedTo: "Hassan", priority: "Critical", lastContactDate: fmt(-4), nextFollowUpDate: fmt(-2), appointmentDate: "", notes: "Asked about stoma-related exercise guidance. Needs careful follow-up and practitioner review.", history: ["Website form received", "Initial acknowledgement sent"], createdAt: fmt(-6), updatedAt: fmt(-4), closedLostReason: "" }
  ],
  urgentEmails: [
    { id: uid(), subject: "NDIS referral: new participant availability", senderName: "Karen Lee", senderEmail: "karen.support@example.com", enquiryType: "NDIS Referral", serviceCategory: "NDIS", urgency: "Critical", assignedTo: "Hassan", dateReceived: fmt(0), replyDueDate: fmt(0), status: "Reply Needed", responseNeeded: "Confirm service availability and request required referral details.", notes: "Potential high-value ongoing client.", createdAt: fmt(0), updatedAt: fmt(0) },
    { id: uid(), subject: "Home visit request for next week", senderName: "Sarah Nguyen", senderEmail: "sarah.nguyen@example.com", enquiryType: "Booking Enquiry", serviceCategory: "Home Visit", urgency: "High", assignedTo: "Executive Assistant", dateReceived: fmt(-1), replyDueDate: fmt(0), status: "Waiting for Hassan", responseNeeded: "Confirm Hassan availability before replying.", notes: "Related lead: Sarah Nguyen", createdAt: fmt(-1), updatedAt: fmt(-1) },
    { id: uid(), subject: "GP referral documents attached", senderName: "Dr. Walsh Clinic", senderEmail: "reception@exampleclinic.com", enquiryType: "GP Referral", serviceCategory: "Diabetes Program", urgency: "High", assignedTo: "Jason", dateReceived: fmt(0), replyDueDate: fmt(0), status: "New", responseNeeded: "Review referral and confirm next steps for booking.", notes: "Do not store real patient info in demo.", createdAt: fmt(0), updatedAt: fmt(0) },
    { id: uid(), subject: "Question about telehealth consult", senderName: "Priya Singh", senderEmail: "priya.singh@example.com", enquiryType: "General Enquiry", serviceCategory: "Telehealth", urgency: "Medium", assignedTo: "Executive Assistant", dateReceived: fmt(-1), replyDueDate: fmt(1), status: "Reply Needed", responseNeeded: "Send general telehealth process and booking link.", notes: "Warm lead.", createdAt: fmt(-1), updatedAt: fmt(-1) },
    { id: uid(), subject: "Falls prevention program for my father", senderName: "Emma Patel", senderEmail: "emma.patel@example.com", enquiryType: "Family Enquiry", serviceCategory: "Falls Prevention", urgency: "Critical", assignedTo: "Hassan", dateReceived: fmt(-2), replyDueDate: fmt(-1), status: "Reply Needed", responseNeeded: "Overdue reply. Follow up with program information and booking options.", notes: "Related to Grace Patel lead.", createdAt: fmt(-2), updatedAt: fmt(-2) },
    { id: uid(), subject: "WorkCover service coverage", senderName: "Claims Officer", senderEmail: "claims@example.com", enquiryType: "WorkCover", serviceCategory: "WorkCover", urgency: "Medium", assignedTo: "Jason", dateReceived: fmt(-3), replyDueDate: fmt(1), status: "Waiting for Jason", responseNeeded: "Confirm service scope.", notes: "May need practitioner input.", createdAt: fmt(-3), updatedAt: fmt(-3) },
    { id: uid(), subject: "Walking group timetable", senderName: "Mina Chen", senderEmail: "mina.chen@example.com", enquiryType: "General Enquiry", serviceCategory: "Walking Group", urgency: "Low", assignedTo: "Executive Assistant", dateReceived: fmt(0), replyDueDate: fmt(2), status: "New", responseNeeded: "Send group schedule and eligibility notes.", notes: "Simple reply.", createdAt: fmt(0), updatedAt: fmt(0) },
    { id: uid(), subject: "Stoma care exercise question", senderName: "Rachel Evans", senderEmail: "rachel.evans@example.com", enquiryType: "Clinical Question", serviceCategory: "Stoma Care", urgency: "High", assignedTo: "Hassan", dateReceived: fmt(-1), replyDueDate: fmt(0), status: "Waiting for Hassan", responseNeeded: "Practitioner review needed before reply.", notes: "Sensitive clinical question; EA should not provide advice.", createdAt: fmt(-1), updatedAt: fmt(-1) }
  ],
  reminders: [
    { id: uid(), leadId: null, clientName: "Grace Patel", reason: "Warm lead check-in", followUpDate: fmt(-1), assignedTo: "Hassan", status: "Pending", lastMessageSent: fmt(-5), nextAction: "Follow up on falls prevention enquiry and offer booking options.", notes: "Overdue — high risk of missed opportunity.", createdAt: fmt(-5), updatedAt: fmt(-1) },
    { id: uid(), leadId: null, clientName: "Amelia Tran", reason: "NDIS referral follow-up", followUpDate: fmt(0), assignedTo: "Executive Assistant", status: "Due Today", lastMessageSent: fmt(-1), nextAction: "Request missing NDIS referral details and preferred appointment time.", notes: "Coordinate with Hassan.", createdAt: fmt(-2), updatedAt: fmt(0) },
    { id: uid(), leadId: null, clientName: "Michael Rivera", reason: "Booking confirmation", followUpDate: fmt(0), assignedTo: "Jason", status: "Due Today", lastMessageSent: fmt(-3), nextAction: "Confirm interest in diabetes program and offer available schedule.", notes: "Warm lead.", createdAt: fmt(-3), updatedAt: fmt(0) },
    { id: uid(), leadId: null, clientName: "Rachel Evans", reason: "Missing information follow-up", followUpDate: fmt(-2), assignedTo: "Hassan", status: "Pending", lastMessageSent: fmt(-4), nextAction: "Review clinical question and advise EA on safe response.", notes: "Practitioner review needed.", createdAt: fmt(-4), updatedAt: fmt(-2) },
    { id: uid(), leadId: null, clientName: "Daniel Brooks", reason: "Appointment reminder", followUpDate: fmt(3), assignedTo: "Executive Assistant", status: "Pending", lastMessageSent: fmt(-1), nextAction: "Send reminder and confirm intake form completion.", notes: "Booked client.", createdAt: fmt(-1), updatedAt: fmt(-1) },
    { id: uid(), leadId: null, clientName: "Priya Singh", reason: "No reply follow-up", followUpDate: fmt(1), assignedTo: "Executive Assistant", status: "Pending", lastMessageSent: fmt(-2), nextAction: "Check if she wants a telehealth consult and send booking link.", notes: "Warm lead.", createdAt: fmt(-2), updatedAt: fmt(-2) },
    { id: uid(), leadId: null, clientName: "Oliver Hart", reason: "Referral follow-up", followUpDate: fmt(2), assignedTo: "Executive Assistant", status: "Pending", lastMessageSent: fmt(0), nextAction: "Try second call if no response.", notes: "Left voicemail today.", createdAt: fmt(0), updatedAt: fmt(0) },
    { id: uid(), leadId: null, clientName: "Lillian Morris", reason: "Post-appointment follow-up", followUpDate: fmt(14), assignedTo: "Jason", status: "Pending", lastMessageSent: fmt(-7), nextAction: "Check client progress after Lungs in Action session.", notes: "Retention opportunity.", createdAt: fmt(-7), updatedAt: fmt(-7) }
  ],
  tasks: [
    { id: uid(), title: "Prepare 9 AM priority brief", description: "Summarise critical emails, overdue follow-ups, warm leads, and booking blockers for Hassan and Jason.", assignedTo: "Executive Assistant", dueDate: fmt(0), priority: "High", relatedLeadId: null, status: "To Do", createdAt: fmt(0), updatedAt: fmt(0) },
    { id: uid(), title: "Clear critical inbox items", description: "Reply or assign urgent NDIS, GP referral, and home visit emails.", assignedTo: "Executive Assistant", dueDate: fmt(0), priority: "Critical", relatedLeadId: null, status: "In Progress", createdAt: fmt(0), updatedAt: fmt(0) },
    { id: uid(), title: "Confirm Hassan availability", description: "Check available slots for home visit and falls prevention enquiries.", assignedTo: "Hassan", dueDate: fmt(0), priority: "High", relatedLeadId: null, status: "Waiting", createdAt: fmt(0), updatedAt: fmt(0) },
    { id: uid(), title: "Jason review: diabetes program lead", description: "Review GP referral and advise next booking step.", assignedTo: "Jason", dueDate: fmt(0), priority: "Medium", relatedLeadId: null, status: "To Do", createdAt: fmt(0), updatedAt: fmt(0) },
    { id: uid(), title: "Update lead notes after calls", description: "Log call outcomes and move lead stages after follow-up attempts.", assignedTo: "Executive Assistant", dueDate: fmt(0), priority: "Medium", relatedLeadId: null, status: "To Do", createdAt: fmt(0), updatedAt: fmt(0) },
    { id: uid(), title: "Send walking group details", description: "Reply to Mina with schedule, location, and next step.", assignedTo: "Executive Assistant", dueDate: fmt(1), priority: "Low", relatedLeadId: null, status: "To Do", createdAt: fmt(0), updatedAt: fmt(0) },
    { id: uid(), title: "Archive completed email replies", description: "Mark completed inbox items and update tracker notes.", assignedTo: "Executive Assistant", dueDate: fmt(0), priority: "Low", relatedLeadId: null, status: "Done", createdAt: fmt(0), updatedAt: fmt(0) },
    { id: uid(), title: "Review closed/lost reasons", description: "Check if any closed leads can be reactivated later.", assignedTo: "Executive Assistant", dueDate: fmt(3), priority: "Low", relatedLeadId: null, status: "To Do", createdAt: fmt(0), updatedAt: fmt(0) }
  ]
};

let state = loadState();
let modal = null;
let sidebarOpen = false;

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return normalizeState(JSON.parse(saved));
  } catch (err) { console.warn("Could not load saved demo state", err); }
  const fresh = normalizeState(clone(seedState));
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh)); } catch (err) {}
  return fresh;
}
function normalizeState(raw = {}) {
  const base = clone(seedState);
  return {
    ...base,
    ...raw,
    appVersion: APP_VERSION,
    settings: { ...DEFAULTS, ...(raw.settings || {}) },
    filters: raw.filters && typeof raw.filters === "object" ? raw.filters : {},
    leads: Array.isArray(raw.leads) ? raw.leads : base.leads,
    urgentEmails: Array.isArray(raw.urgentEmails) ? raw.urgentEmails : base.urgentEmails,
    reminders: Array.isArray(raw.reminders) ? raw.reminders : base.reminders,
    tasks: Array.isArray(raw.tasks) ? raw.tasks : base.tasks
  };
}
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (err) { alert("Changes could not be saved in this browser. Please clear old demo data or allow localStorage."); }
}
function resetDemo() {
  if (!confirm("Reset demo data to the polished professional version?")) return;
  localStorage.removeItem(STORAGE_KEY);
  state = loadState();
  modal = null;
  render();
}

function daysDiff(dateStr) {
  if (!dateStr) return null;
  const a = new Date(dateStr + "T00:00:00");
  const b = new Date(fmt(0) + "T00:00:00");
  return Math.round((a - b) / 86400000);
}
function isToday(dateStr) { return daysDiff(dateStr) === 0; }
function isOverdue(dateStr) { const d = daysDiff(dateStr); return d !== null && d < 0; }
function urgencyRank(u) { return ({ Critical: 0, High: 1, Medium: 2, Low: 3 }[u] ?? 9); }
function priorityRank(u) { return urgencyRank(u); }
function pill(text, cls = "") { return `<span class="badge ${cls || className(text)}">${esc(text || "—")}</span>`; }
function className(text = "") { return String(text).replace(/[^a-zA-Z0-9_-]/g, " ").trim().split(/\s+/)[0] || "dark"; }
function setPage(page) { state.currentPage = page; state.filters = {}; sidebarOpen = false; save(); render(); }
function setSession(role) { state.session = { role, name: role === "Admin" ? "Admin" : role, loggedInAt: new Date().toISOString() }; save(); render(); }
function logout() { state.session = null; save(); render(); }

const pageInfo = {
  dashboard: ["Executive Command Center", "A client-ready operating dashboard for daily lead movement, urgent replies, warm leads, and follow-up accountability."],
  pipeline: ["Lead Pipeline", "Move enquiries from first contact to booked appointment, completed visit, or closed/lost outcome."],
  emails: ["Urgent Email Tracker", "Prioritise NDIS referrals, GP referrals, booking enquiries, home visits, and client concerns."],
  reminders: ["Follow-Up Reminders", "Keep warm leads active and prevent missed opportunities with clear next actions."],
  tasks: ["EA Task Planner", "Organise daily admin priorities, appointment work, and practitioner handoffs."],
  reports: ["Executive Reports", "Show Hassan and Jason booking movement, follow-up health, and service demand."],
  settings: ["Demo Settings", "Manage lead stages, services, owners, urgency levels, and reminder types for the demo."]
};

function metrics() {
  const openEmails = state.urgentEmails.filter(e => !["Completed", "Replied"].includes(e.status));
  const bookedOrCompleted = state.leads.filter(l => ["Booked", "Completed"].includes(l.stage)).length;
  const activeLeads = state.leads.filter(l => !["Closed/Lost", "Completed"].includes(l.stage)).length;
  return {
    newLeads: state.leads.filter(l => l.stage === "New Lead").length,
    warmLeads: state.leads.filter(l => ["Warm Lead", "Waiting for Response", "Follow-Up Needed"].includes(l.stage)).length,
    urgentEmails: openEmails.filter(e => ["Critical", "High"].includes(e.urgency)).length,
    followUpsToday: state.reminders.filter(r => r.status !== "Completed" && isToday(r.followUpDate)).length,
    pendingBookings: state.leads.filter(l => ["Waiting for Response", "Booked"].includes(l.stage)).length,
    overdueFollowUps: state.reminders.filter(r => r.status !== "Completed" && isOverdue(r.followUpDate)).length,
    completedTasks: state.tasks.filter(t => t.status === "Done" && t.updatedAt === fmt(0)).length,
    missed: state.leads.filter(l => l.stage === "Closed/Lost").length,
    activeLeads,
    conversion: state.leads.length ? Math.round((bookedOrCompleted / state.leads.length) * 100) : 0
  };
}

function render() {
  const app = document.getElementById("app");
  if (!state.session) {
    app.innerHTML = loginView();
    bindEvents();
    return;
  }
  const [title, desc] = pageInfo[state.currentPage] || pageInfo.dashboard;
  app.innerHTML = `
    <div class="app-shell">
      ${sidebarView()}
      <main class="main">
        <div class="topbar">
          <div>
            <button class="btn secondary small mobile-menu" data-action="toggleSidebar">☰ Menu</button>
            <p class="eyebrow">Holistic EP Internal Demo</p>
            <div class="title-row"><h1>${esc(title)}</h1><span class="demo-chip">Phase 1 Demo • LocalStorage</span></div>
            <p class="page-desc">${esc(desc)}</p>
          </div>
          <div class="user-pill">
            <span class="avatar">${esc((state.session.name || "U")[0])}</span>
            <div><strong>${esc(state.session.name)}</strong><br><small>${esc(state.session.role)} access</small></div>
            <button class="btn ghost small" data-action="logout">Logout</button>
          </div>
        </div>
        ${pageView()}
      </main>
    </div>
    ${modal ? modalView() : ""}
  `;
  bindEvents();
}

function loginView() {
  const m = metrics();
  return `
    <section class="login-screen">
      <div class="login-card">
        <div class="login-hero">
          <div class="logo-row">
            <div class="logo-mark">HEP</div>
            <div>
              <p class="brand-title"><strong>Holistic Exercise Physiology</strong></p>
              <p class="brand-subtitle">Lead & Follow-Up Command Center</p>
            </div>
          </div>
          <h1>A calmer way to manage every enquiry.</h1>
          <p>Professional demo for Hassan, Jason, and the Executive Assistant: lead movement, urgent emails, follow-up reminders, task ownership, and daily reporting in one clean workspace.</p>
          <div class="login-metric-grid">
            <div class="login-metric"><strong>${m.activeLeads}</strong><span>active leads visible</span></div>
            <div class="login-metric"><strong>${m.urgentEmails}</strong><span>urgent replies open</span></div>
            <div class="login-metric"><strong>${m.conversion}%</strong><span>demo conversion view</span></div>
          </div>
        </div>
        <div class="login-panel">
          <p class="eyebrow">Client Demo Login</p>
          <h2>Choose a workspace</h2>
          <p class="page-desc">This demo uses sample data only and is designed to show how the workflow can support enquiries, referrals, bookings, and follow-ups.</p>
          <div class="role-grid">
            ${[
              ["Admin", "Full demo visibility, settings, and reports", "A"],
              ["Hassan", "Practitioner view for assigned leads and clinical handoffs", "H"],
              ["Jason", "Practitioner view for assigned leads and booking movement", "J"],
              ["Executive Assistant", "Daily operating view for inbox, follow-ups, and tasks", "EA"]
            ].map(([role, desc, icon]) => `<button class="role-btn" data-action="login" data-role="${role}"><span class="role-icon">${icon}</span><span><strong>${role}</strong><span>${desc}</span></span></button>`).join("")}
          </div>
          <div class="sidebar-panel" style="margin-top:20px;">
            <h4>Demo safety note</h4>
            <small>No real patient, NDIS, referral, or medical information should be entered until a secure backend, access controls, and privacy safeguards are added.</small>
          </div>
        </div>
      </div>
    </section>
  `;
}

function sidebarView() {
  const m = metrics();
  const items = [
    ["dashboard", "⌘", "Command Center"],
    ["pipeline", "⇄", "Lead Pipeline"],
    ["emails", "✉", "Urgent Emails"],
    ["reminders", "◷", "Follow-Ups"],
    ["tasks", "✓", "Task Planner"],
    ["reports", "◌", "Reports"],
    ["settings", "⚙", "Settings"]
  ];
  return `
    <aside class="sidebar ${sidebarOpen ? "open" : ""}">
      <div class="brand-card">
        <div class="logo-row">
          <div class="logo-mark">HEP</div>
          <div>
            <p class="brand-title"><strong>Holistic EP</strong></p>
            <p class="brand-subtitle">Command Center Demo</p>
          </div>
        </div>
        <p class="brand-tagline">Balancing Body, Mind, and Movement — supported by a clearer admin workflow.</p>
        <div class="brand-mini-grid"><span>Leads</span><span>Inbox</span><span>Follow-up</span></div>
      </div>
      <nav class="nav">
        ${items.map(([id, icon, label]) => `<button class="${state.currentPage === id ? "active" : ""}" data-page="${id}"><span class="icon">${icon}</span>${label}</button>`).join("")}
      </nav>
      <div class="sidebar-panel">
        <h4>Today’s Focus</h4>
        <small>Prioritise critical emails, overdue follow-ups, and warm leads close to booking.</small>
        <div class="sidebar-kpi">
          <div><strong>${m.urgentEmails}</strong><span>urgent</span></div>
          <div><strong>${m.overdueFollowUps}</strong><span>overdue</span></div>
        </div>
      </div>
      <div class="sidebar-panel">
        <small><strong>Phase 1:</strong> static demo saved in browser localStorage. Upgrade to a secure backend before live use.</small>
        <div class="actions" style="margin-top:12px;"><button class="btn ghost small" data-action="resetDemo">Reset demo</button></div>
      </div>
    </aside>
  `;
}

function pageView() {
  switch (state.currentPage) {
    case "pipeline": return pipelinePage();
    case "emails": return emailsPage();
    case "reminders": return remindersPage();
    case "tasks": return tasksPage();
    case "reports": return reportsPage();
    case "settings": return settingsPage();
    default: return dashboardPage();
  }
}

function dashboardPage() {
  const m = metrics();
  const statCards = [
    ["New Leads", m.newLeads, "Need first action", "↗"],
    ["Warm Leads", m.warmLeads, "Can still convert", "↻"],
    ["Urgent Emails", m.urgentEmails, "Critical/high priority", "!"],
    ["Follow-Ups Today", m.followUpsToday, "Due now", "◷"],
    ["Pending Bookings", m.pendingBookings, "Waiting/confirmed", "□"],
    ["Overdue Follow-Ups", m.overdueFollowUps, "Review immediately", "⚠"],
    ["Completed Tasks", m.completedTasks, "Done today", "✓"],
    ["Conversion Rate", `${m.conversion}%`, "Booked/completed demo", "%"]
  ];
  const urgent = [...state.urgentEmails].filter(e => !["Completed", "Replied"].includes(e.status)).sort((a,b) => urgencyRank(a.urgency) - urgencyRank(b.urgency)).slice(0, 5);
  const due = state.reminders.filter(r => r.status !== "Completed" && (isToday(r.followUpDate) || isOverdue(r.followUpDate))).sort((a,b)=>new Date(a.followUpDate)-new Date(b.followUpDate)).slice(0, 5);
  const warm = state.leads.filter(l => ["Warm Lead", "Waiting for Response", "Follow-Up Needed"].includes(l.stage)).sort((a,b)=>priorityRank(a.priority)-priorityRank(b.priority)).slice(0, 5);
  const serviceDemand = Object.entries(countBy(state.leads, "serviceCategory")).sort((a,b)=>b[1]-a[1]).slice(0,5);
  return `
    <div class="command-strip">
      <div><strong>EA Morning Operating Rule</strong><span>1) Clear critical replies. 2) Complete overdue follow-ups. 3) Move warm leads to booked or next-action status. 4) Send Hassan/Jason a quick daily summary.</span></div>
      <div class="actions"><button class="btn" data-action="dailySummary">Generate Daily Summary</button><button class="btn secondary" data-action="openLead">+ New Lead</button></div>
    </div>
    <div class="grid stats-grid">${statCards.map(([label, value, note, icon]) => statCard(label, value, note, icon)).join("")}</div>
    <div class="grid two-grid" style="margin-top:18px;">
      <section class="card highlight">
        <div class="section-title-row"><div><h2>Priority Inbox</h2><p class="page-desc">Emails that can block bookings, referrals, or client confidence.</p></div><button class="btn secondary small" data-page="emails">View all</button></div>
        <div class="list">${urgent.map(emailItem).join("") || empty("No open urgent emails.")}</div>
      </section>
      <section class="card">
        <div class="section-title-row"><div><h2>Follow-Ups Due</h2><p class="page-desc">Today and overdue items that should not be missed.</p></div><button class="btn secondary small" data-page="reminders">View all</button></div>
        <div class="list">${due.map(reminderItem).join("") || empty("No due or overdue follow-ups.")}</div>
      </section>
    </div>
    <div class="grid two-grid" style="margin-top:18px;">
      <section class="card">
        <div class="section-title-row"><div><h2>Warm Lead Movement</h2><p class="page-desc">Best opportunities to push toward booking this week.</p></div><button class="btn secondary small" data-page="pipeline">Open pipeline</button></div>
        <div class="list">${warm.map(l => compactLeadItem(l)).join("") || empty("No warm leads pending.")}</div>
      </section>
      <section class="card">
        <div class="section-title-row"><div><h2>Service Demand Snapshot</h2><p class="page-desc">Quick view of which service lines are creating enquiries.</p></div><span class="demo-chip">demo sample</span></div>
        <div class="risk-list">${serviceDemand.map(([svc, count]) => `<div class="service-card"><div><strong>${esc(svc)}</strong><span> ${count} lead${count > 1 ? "s" : ""} tracked</span></div>${pill(count, "dark")}</div>`).join("")}</div>
      </section>
    </div>
  `;
}
function statCard(label, value, note, icon) {
  return `<section class="card stat-card"><div class="card-title-row"><p class="stat-label">${esc(label)}</p>${pill(icon, "gold")}</div><p class="stat-value">${esc(value)}</p><p class="stat-note">${esc(note)}</p><span class="stat-trend">Visible in demo</span></section>`;
}

function filtersCommon(type) {
  const f = state.filters || {};
  const statusOptions = type === "leads" ? state.settings.leadStages : type === "emails" ? ["New", "Reply Needed", "Waiting for Hassan", "Waiting for Jason", "Replied", "Completed"] : type === "reminders" ? ["Pending", "Due Today", "Overdue", "Completed", "Rescheduled"] : type === "tasks" ? ["To Do", "In Progress", "Waiting", "Done"] : [];
  const includeService = ["leads", "emails"].includes(type);
  const includePriority = ["leads", "emails", "tasks"].includes(type);
  return `
    <div class="filters">
      <input class="input" data-filter="search" value="${esc(f.search || "")}" placeholder="Search name, email, service, notes..." />
      <select data-filter="assignedTo"><option value="">All owners</option>${state.settings.users.map(u => `<option value="${esc(u)}" ${selected(u, f.assignedTo)}>${esc(u)}</option>`).join("")}</select>
      ${includeService ? `<select data-filter="serviceCategory"><option value="">All services</option>${state.settings.serviceCategories.map(s => `<option value="${esc(s)}" ${selected(s, f.serviceCategory)}>${esc(s)}</option>`).join("")}</select>` : ""}
      ${includePriority ? `<select data-filter="priority"><option value="">All priorities</option>${["Critical","High","Medium","Low"].map(p => `<option value="${p}" ${selected(p, f.priority)}>${p}</option>`).join("")}</select>` : ""}
      ${statusOptions.length ? `<select data-filter="status"><option value="">All statuses</option>${statusOptions.map(s => `<option value="${esc(s)}" ${selected(s, f.status)}>${esc(s)}</option>`).join("")}</select>` : ""}
      <button class="btn ghost" data-action="clearFilters">Clear filters</button>
    </div>`;
}
function leadMatches(l) {
  const f = state.filters || {};
  const search = (f.search || "").toLowerCase();
  return (!search || [l.name, l.email, l.phone, l.notes, l.serviceCategory, l.enquirySource].join(" ").toLowerCase().includes(search)) &&
    (!f.assignedTo || l.assignedTo === f.assignedTo) &&
    (!f.serviceCategory || l.serviceCategory === f.serviceCategory) &&
    (!f.priority || l.priority === f.priority) &&
    (!f.status || l.stage === f.status);
}

function pipelinePage() {
  const leads = state.leads.filter(leadMatches);
  return `
    <section class="card" style="margin-bottom:18px;">
      <div class="section-title-row"><div><h2>Lead Movement Board</h2><p class="page-desc">A Kanban view built for quick EA updates and practitioner visibility.</p></div><div class="actions"><button class="btn secondary" data-action="exportData" data-type="leads">Export CSV</button><button class="btn" data-action="openLead">+ Add Lead</button></div></div>
      ${filtersCommon("leads")}
    </section>
    <div class="pipeline">
      ${state.settings.leadStages.map(stage => {
        const stageLeads = leads.filter(l => l.stage === stage).sort((a,b)=>priorityRank(a.priority)-priorityRank(b.priority));
        return `<div class="column"><div class="column-header"><h3>${esc(stage)}</h3>${pill(stageLeads.length, "dark")}</div>${stageLeads.map(leadCard).join("") || empty("No leads")}</div>`;
      }).join("")}
    </div>
  `;
}
function leadCard(l) {
  const due = l.nextFollowUpDate ? isOverdue(l.nextFollowUpDate) ? pill("Overdue", "overdue") : isToday(l.nextFollowUpDate) ? pill("Due Today", "today") : pill(l.nextFollowUpDate, "dark") : pill("No follow-up", "dark");
  return `<article class="lead-card priority-${esc(l.priority)}">
    <h4>${esc(l.name)}</h4>
    <div class="actions">${pill(l.priority)}${pill(l.serviceCategory)}</div>
    <p><strong>Owner:</strong> ${esc(l.assignedTo)}<br><strong>Source:</strong> ${esc(l.enquirySource)}</p>
    <p><strong>Next:</strong> ${due} <br><strong>Last contact:</strong> ${esc(l.lastContactDate || "—")}</p>
    <p>${esc(l.notes)}</p>
    <select class="stage-select" data-action="changeLeadStage" data-id="${l.id}">${state.settings.leadStages.map(s => `<option ${s === l.stage ? "selected" : ""}>${esc(s)}</option>`).join("")}</select>
    <div class="card-actions"><button class="btn secondary small" data-action="viewLead" data-id="${l.id}">View</button><button class="btn ghost small" data-action="openLead" data-id="${l.id}">Edit</button></div>
  </article>`;
}
function compactLeadItem(l) {
  return `<div class="item ${l.priority === "Critical" ? "critical" : ""}"><div class="item-top"><p class="item-title">${esc(l.name)}</p><div class="actions">${pill(l.priority)}${pill(l.stage)}</div></div><p class="item-meta">${esc(l.serviceCategory)} • Owner: ${esc(l.assignedTo)} • Next: ${esc(l.nextFollowUpDate || "not set")}</p><p class="item-meta">${esc(l.notes)}</p><div class="item-actions"><button class="btn secondary small" data-action="viewLead" data-id="${l.id}">Open lead</button></div></div>`;
}

function emailsPage() {
  const f = state.filters || {}, search = (f.search || "").toLowerCase();
  const emails = state.urgentEmails.filter(e => (!search || [e.subject,e.senderName,e.senderEmail,e.responseNeeded,e.notes,e.enquiryType,e.serviceCategory].join(" ").toLowerCase().includes(search)) &&
    (!f.assignedTo || e.assignedTo === f.assignedTo) &&
    (!f.serviceCategory || e.serviceCategory === f.serviceCategory) &&
    (!f.priority || e.urgency === f.priority) &&
    (!f.status || e.status === f.status)
  ).sort((a,b)=>urgencyRank(a.urgency)-urgencyRank(b.urgency));
  return `<section class="card"><div class="section-title-row"><div><h2>Urgent Email Board</h2><p class="page-desc">Critical and high-priority emails stay visible until a reply is sent or a practitioner has reviewed the next step.</p></div><div class="actions"><button class="btn secondary" data-action="exportData" data-type="urgentEmails">Export CSV</button><button class="btn" data-action="openEmail">+ Add Email</button></div></div>${filtersCommon("emails")}${emailTable(emails)}</section>`;
}
function emailTable(emails) {
  if (!emails.length) return empty("No email items match your filters.");
  return `<div class="table-wrap"><table><thead><tr><th>Subject / Response Needed</th><th>Sender</th><th>Service</th><th>Urgency</th><th>Owner</th><th>Due</th><th>Status</th><th>Action</th></tr></thead><tbody>${emails.map(e => `<tr class="${e.urgency === "Critical" ? "critical-row" : ""}"><td><strong>${esc(e.subject)}</strong><br><small>${esc(e.responseNeeded)}</small></td><td>${esc(e.senderName)}<br><small>${esc(e.senderEmail)}</small></td><td>${pill(e.serviceCategory)}</td><td>${pill(e.urgency)}</td><td>${esc(e.assignedTo)}</td><td>${esc(e.replyDueDate)} ${isOverdue(e.replyDueDate) && !["Completed","Replied"].includes(e.status) ? pill("Overdue", "overdue") : isToday(e.replyDueDate) ? pill("Today", "today") : ""}</td><td>${pill(e.status)}</td><td><div class="actions"><button class="btn secondary small" data-action="openEmail" data-id="${e.id}">Edit</button><button class="btn ghost small" data-action="markEmailDone" data-id="${e.id}">Done</button></div></td></tr>`).join("")}</tbody></table></div>`;
}
function emailItem(e) {
  return `<div class="item ${e.urgency === "Critical" ? "critical" : ""}"><div class="item-top"><p class="item-title">${esc(e.subject)}</p>${pill(e.urgency)}</div><p class="item-meta">${esc(e.serviceCategory)} • Owner: ${esc(e.assignedTo)} • Due ${esc(e.replyDueDate)}</p><p class="item-meta">${esc(e.responseNeeded)}</p><div class="item-actions"><button class="btn secondary small" data-action="openEmail" data-id="${e.id}">Open email</button><button class="btn ghost small" data-action="markEmailDone" data-id="${e.id}">Mark done</button></div></div>`;
}

function remindersPage() {
  const f = state.filters || {}, search = (f.search || "").toLowerCase();
  const reminders = state.reminders.filter(r => {
    const computed = reminderComputedStatus(r);
    return (!search || [r.clientName,r.reason,r.nextAction,r.notes].join(" ").toLowerCase().includes(search)) &&
      (!f.assignedTo || r.assignedTo === f.assignedTo) &&
      (!f.status || computed === f.status);
  }).sort((a,b)=>new Date(a.followUpDate)-new Date(b.followUpDate));
  return `<section class="card"><div class="section-title-row"><div><h2>Follow-Up Reminders</h2><p class="page-desc">Each reminder has a clear reason, owner, date, and next action so opportunities do not fall through the cracks.</p></div><button class="btn" data-action="openReminder">+ Add Reminder</button></div>${filtersCommon("reminders")}<div class="grid two-grid">${reminders.map(reminderItem).join("") || empty("No reminders found.")}</div></section>`;
}
function reminderComputedStatus(r) { return r.status !== "Completed" && isOverdue(r.followUpDate) ? "Overdue" : r.status !== "Completed" && isToday(r.followUpDate) ? "Due Today" : r.status; }
function reminderItem(r) {
  const status = reminderComputedStatus(r);
  const cls = status === "Overdue" ? "overdue" : status === "Due Today" ? "today" : "";
  return `<div class="item ${status === "Overdue" ? "critical" : ""}"><div class="item-top"><p class="item-title">${esc(r.clientName)}</p>${pill(status, cls)}</div><p class="item-meta">${esc(r.reason)} • Owner: ${esc(r.assignedTo)} • Due ${esc(r.followUpDate)}</p><p class="item-meta"><strong>Next action:</strong> ${esc(r.nextAction)}</p><div class="item-actions"><button class="btn secondary small" data-action="openReminder" data-id="${r.id}">Edit</button><button class="btn ghost small" data-action="completeReminder" data-id="${r.id}">Complete</button></div></div>`;
}

function tasksPage() {
  const groups = ["To Do", "In Progress", "Waiting", "Done"];
  const f = state.filters || {}, search = (f.search || "").toLowerCase();
  const tasks = state.tasks.filter(t => (!search || [t.title,t.description,t.assignedTo].join(" ").toLowerCase().includes(search)) &&
    (!f.assignedTo || t.assignedTo === f.assignedTo) &&
    (!f.priority || t.priority === f.priority) &&
    (!f.status || t.status === f.status)
  );
  return `<section class="card"><div class="section-title-row"><div><h2>Daily EA Task Planner</h2><p class="page-desc">A practical execution board for daily inbox, lead, booking, and practitioner handoff tasks.</p></div><button class="btn" data-action="openTask">+ Add Task</button></div>${filtersCommon("tasks")}<div class="grid four-grid" style="overflow-x:auto; padding-bottom:6px;">${groups.map(status => `<div class="column"><div class="column-header"><h3>${esc(status)}</h3>${pill(tasks.filter(t=>t.status===status).length, "dark")}</div>${tasks.filter(t=>t.status===status).sort((a,b)=>priorityRank(a.priority)-priorityRank(b.priority)).map(taskCard).join("") || empty("No tasks")}</div>`).join("")}</div></section>`;
}
function taskCard(t) {
  return `<article class="lead-card priority-${esc(t.priority)}"><h4>${esc(t.title)}</h4><div class="actions">${pill(t.priority)}${pill(t.assignedTo)}</div><p>${esc(t.description)}</p><p><strong>Due:</strong> ${esc(t.dueDate)} ${isToday(t.dueDate) ? pill("Today", "today") : isOverdue(t.dueDate) && t.status !== "Done" ? pill("Overdue", "overdue") : ""}</p><select class="stage-select" data-action="changeTaskStatus" data-id="${t.id}">${["To Do", "In Progress", "Waiting", "Done"].map(s => `<option ${s===t.status?"selected":""}>${esc(s)}</option>`).join("")}</select><div class="card-actions"><button class="btn secondary small" data-action="openTask" data-id="${t.id}">Edit</button></div></article>`;
}

function reportsPage() {
  const m = metrics();
  const booked = state.leads.filter(l => ["Booked", "Completed"].includes(l.stage)).length;
  const reports = [
    ["Total Leads", state.leads.length, "All demo enquiries"],
    ["Booked / Completed", booked, "Converted or attended"],
    ["Warm Opportunities", m.warmLeads, "Needs movement"],
    ["Closed / Lost", m.missed, "Reason required"],
    ["Follow-Ups Completed", state.reminders.filter(r=>r.status==="Completed").length, "Closed reminders"],
    ["Overdue Follow-Ups", m.overdueFollowUps, "At-risk work"],
    ["Urgent Emails Completed", state.urgentEmails.filter(e=>["Completed","Replied"].includes(e.status)).length, "Resolved inbox"],
    ["Conversion Rate", `${m.conversion}%`, "Demo indicator"]
  ];
  return `<section class="card" style="margin-bottom:18px;"><div class="section-title-row"><div><h2>Executive Demo Report</h2><p class="page-desc">Use this page to show Hassan and Jason how the tracker gives visibility over lead movement, service demand, follow-up health, and conversion.</p></div><div class="actions"><button class="btn secondary small" data-action="exportData" data-type="leads">Export Leads CSV</button><button class="btn secondary small" data-action="exportData" data-type="urgentEmails">Export Emails CSV</button></div></div></section><div class="grid stats-grid">${reports.map(([label,value,note]) => statCard(label,value,note,"•")).join("")}</div><div class="grid two-grid" style="margin-top:18px;"><section class="card"><h3>Leads by Service Category</h3>${barChart(countBy(state.leads,"serviceCategory"))}</section><section class="card"><h3>Leads by Stage</h3>${barChart(countBy(state.leads,"stage"))}</section><section class="card"><h3>Leads by Assigned Person</h3>${barChart(countBy(state.leads,"assignedTo"))}</section><section class="card"><h3>Reminder Status</h3>${barChart(countBy(state.reminders,"status"))}</section></div>`;
}
function countBy(arr, key) { return arr.reduce((acc, item) => { acc[item[key] || "Unassigned"] = (acc[item[key] || "Unassigned"] || 0) + 1; return acc; }, {}); }
function barChart(obj) {
  const entries = Object.entries(obj).sort((a,b)=>b[1]-a[1]);
  const max = Math.max(1, ...entries.map(([,v])=>v));
  return `<div class="chart-bar">${entries.map(([k,v]) => `<div class="bar-row"><span>${esc(k)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(6, Math.round((v/max)*100))}%"></div></div><strong>${v}</strong></div>`).join("")}</div>`;
}

function settingsPage() {
  const settings = [["serviceCategories","Service Categories"],["leadStages","Lead Stages"],["urgencyLevels","Urgency Levels"],["users","Users"],["enquirySources","Enquiry Sources"],["reminderTypes","Reminder Types"]];
  return `<div class="grid two-grid">${settings.map(([key,label]) => `<section class="card"><h3>${esc(label)}</h3><p class="page-desc">One item per line. Saved locally for this professional demo.</p><textarea data-setting="${key}">${esc(state.settings[key].join("\n"))}</textarea><div class="actions" style="margin-top:12px;"><button class="btn secondary" data-action="saveSetting" data-key="${key}">Save ${esc(label)}</button></div></section>`).join("")}</div>`;
}

function empty(message) { return `<div class="empty-state">${esc(message)}</div>`; }

function modalView() {
  if (modal.type === "summary") return dailySummaryModal();
  if (modal.type === "lead") return formModal("Lead", leadFields(modal.item || {}), "saveLead", modal.item?.id);
  if (modal.type === "leadDetails") return leadDetailsModal(modal.item);
  if (modal.type === "email") return formModal("Urgent Email", emailFields(modal.item || {}), "saveEmail", modal.item?.id);
  if (modal.type === "reminder") return formModal("Follow-Up Reminder", reminderFields(modal.item || {}), "saveReminder", modal.item?.id);
  if (modal.type === "task") return formModal("Task", taskFields(modal.item || {}), "saveTask", modal.item?.id);
  return "";
}
function field(name, label, value = "", type = "text", options = null, full = false) {
  if (options) return `<div class="form-row ${full ? "full" : ""}"><label>${esc(label)}</label><select name="${name}">${options.map(o => `<option value="${esc(o)}" ${selected(o, value)}>${esc(o)}</option>`).join("")}</select></div>`;
  if (type === "textarea") return `<div class="form-row ${full ? "full" : ""}"><label>${esc(label)}</label><textarea name="${name}">${esc(value)}</textarea></div>`;
  return `<div class="form-row ${full ? "full" : ""}"><label>${esc(label)}</label><input class="input" name="${name}" type="${type}" value="${esc(value)}" /></div>`;
}
function formModal(title, fieldsHtml, saveAction, id = "") {
  return `<div class="modal-backdrop"><div class="modal"><div class="section-title-row"><div><p class="eyebrow">${id ? "Edit record" : "Create record"}</p><h2>${id ? "Edit" : "Add"} ${esc(title)}</h2></div><button class="btn ghost" data-action="closeModal">Close</button></div><form data-action="${saveAction}" data-id="${id || ""}"><div class="form-grid">${fieldsHtml}</div><div class="actions" style="margin-top:18px;"><button class="btn" type="submit">Save ${esc(title)}</button>${id ? `<button class="btn danger" type="button" data-action="deleteRecord" data-type="${esc(title)}" data-id="${id}">Delete</button>` : ""}</div></form></div></div>`;
}
function leadFields(l) {
  return [
    field("name","Lead Name",l.name), field("phone","Phone",l.phone), field("email","Email",l.email,"email"), field("enquirySource","Enquiry Source",l.enquirySource,"text",state.settings.enquirySources),
    field("serviceCategory","Service Category",l.serviceCategory,"text",state.settings.serviceCategories), field("stage","Lead Stage",l.stage || "New Lead","text",state.settings.leadStages), field("assignedTo","Assigned To",l.assignedTo || "Executive Assistant","text",state.settings.users), field("priority","Priority",l.priority || "Medium","text",["Critical","High","Medium","Low"]),
    field("lastContactDate","Last Contact Date",l.lastContactDate,"date"), field("nextFollowUpDate","Next Follow-Up Date",l.nextFollowUpDate,"date"), field("appointmentDate","Appointment Date",l.appointmentDate,"date"), field("closedLostReason","Closed/Lost Reason",l.closedLostReason), field("notes","Notes",l.notes,"textarea",null,true)
  ].join("");
}
function emailFields(e) {
  return [field("subject","Email Subject",e.subject), field("senderName","Sender Name",e.senderName), field("senderEmail","Sender Email",e.senderEmail,"email"), field("enquiryType","Enquiry Type",e.enquiryType), field("serviceCategory","Service Category",e.serviceCategory,"text",state.settings.serviceCategories), field("urgency","Urgency",e.urgency || "Medium","text",state.settings.urgencyLevels), field("assignedTo","Assigned To",e.assignedTo || "Executive Assistant","text",state.settings.users), field("dateReceived","Date Received",e.dateReceived || fmt(0),"date"), field("replyDueDate","Reply Due Date",e.replyDueDate || fmt(0),"date"), field("status","Status",e.status || "New","text",["New","Reply Needed","Waiting for Hassan","Waiting for Jason","Replied","Completed"]), field("responseNeeded","Response Needed",e.responseNeeded,"textarea",null,true), field("notes","Notes",e.notes,"textarea",null,true)].join("");
}
function reminderFields(r) {
  return [field("clientName","Lead/Client Name",r.clientName), field("reason","Follow-Up Reason",r.reason,"text",state.settings.reminderTypes), field("followUpDate","Follow-Up Date",r.followUpDate || fmt(0),"date"), field("assignedTo","Assigned To",r.assignedTo || "Executive Assistant","text",state.settings.users), field("status","Status",r.status || "Pending","text",["Pending","Due Today","Overdue","Completed","Rescheduled"]), field("lastMessageSent","Last Message Sent",r.lastMessageSent,"date"), field("nextAction","Next Action",r.nextAction,"textarea",null,true), field("notes","Notes",r.notes,"textarea",null,true)].join("");
}
function taskFields(t) {
  return [field("title","Task Title",t.title), field("assignedTo","Assigned To",t.assignedTo || "Executive Assistant","text",state.settings.users), field("dueDate","Due Date",t.dueDate || fmt(0),"date"), field("priority","Priority",t.priority || "Medium","text",["Critical","High","Medium","Low"]), field("status","Status",t.status || "To Do","text",["To Do","In Progress","Waiting","Done"]), field("description","Description",t.description,"textarea",null,true)].join("");
}
function leadDetailsModal(l) {
  if (!l) return "";
  const history = (l.history || []).map((h, i) => `<div class="timeline-step"><span class="timeline-dot">${i + 1}</span><p>${esc(h)}</p></div>`).join("") || empty("No history yet.");
  return `<div class="modal-backdrop"><div class="modal"><div class="section-title-row"><div><p class="eyebrow">Lead Profile</p><h2>${esc(l.name)}</h2><p class="page-desc">${esc(l.serviceCategory)} • ${esc(l.assignedTo)} • ${esc(l.stage)}</p></div><button class="btn ghost" data-action="closeModal">Close</button></div><div class="grid two-grid"><section class="card"><h3>Contact & Routing</h3><p>Email: ${esc(l.email || "—")}</p><p>Phone: ${esc(l.phone || "—")}</p><p>Source: ${esc(l.enquirySource || "—")}</p><p>Priority: ${pill(l.priority)}</p></section><section class="card"><h3>Dates & Movement</h3><p>Last contact: ${esc(l.lastContactDate || "—")}</p><p>Next follow-up: ${esc(l.nextFollowUpDate || "—")}</p><p>Appointment: ${esc(l.appointmentDate || "—")}</p></section><section class="card"><h3>Notes</h3><p>${esc(l.notes || "No notes")}</p>${l.closedLostReason ? `<p><strong>Closed/Lost reason:</strong> ${esc(l.closedLostReason)}</p>` : ""}</section><section class="card"><h3>History</h3><div class="timeline">${history}</div></section></div><div class="actions" style="margin-top:18px;">${state.settings.leadStages.map(stage => `<button class="btn secondary small" data-action="quickStage" data-id="${l.id}" data-stage="${esc(stage)}">${esc(stage)}</button>`).join("")}<button class="btn" data-action="openLead" data-id="${l.id}">Edit Lead</button></div></div></div>`;
}

function dailySummaryText() {
  const m = metrics();
  const urgent = state.urgentEmails.filter(e => ["Critical","High"].includes(e.urgency) && !["Completed","Replied"].includes(e.status)).sort((a,b)=>urgencyRank(a.urgency)-urgencyRank(b.urgency));
  const overdue = state.reminders.filter(r => isOverdue(r.followUpDate) && r.status !== "Completed");
  const warm = state.leads.filter(l => ["Warm Lead","Waiting for Response","Follow-Up Needed"].includes(l.stage));
  return [
    `Holistic EP Daily EA Brief — ${fmt(0)}`,
    "",
    "Executive snapshot:",
    `- New leads: ${m.newLeads}`,
    `- Warm / waiting leads: ${m.warmLeads}`,
    `- Critical or high-priority emails open: ${m.urgentEmails}`,
    `- Follow-ups due today: ${m.followUpsToday}`,
    `- Overdue follow-ups: ${m.overdueFollowUps}`,
    `- Current demo conversion rate: ${m.conversion}%`,
    "",
    "Priority emails:",
    ...(urgent.length ? urgent.slice(0,5).map(e => `- ${e.urgency}: ${e.subject} | Owner: ${e.assignedTo} | Due: ${e.replyDueDate}`) : ["- No critical/high urgent emails open."]),
    "",
    "Overdue follow-ups:",
    ...(overdue.length ? overdue.slice(0,5).map(r => `- ${r.clientName}: ${r.nextAction} | Owner: ${r.assignedTo} | Due: ${r.followUpDate}`) : ["- No overdue follow-ups."]),
    "",
    "Warm leads needing movement:",
    ...(warm.length ? warm.slice(0,5).map(l => `- ${l.name}: ${l.serviceCategory} | Stage: ${l.stage} | Owner: ${l.assignedTo} | Next: ${l.nextFollowUpDate || "not set"}`) : ["- No warm leads currently pending."]),
    "",
    "Suggested EA focus:",
    "1. Reply to or assign all critical emails.",
    "2. Clear overdue follow-ups before handling low-priority admin tasks.",
    "3. Move warm leads to booked, waiting, or closed/lost so the pipeline stays accurate."
  ].join("\n");
}
function dailySummaryModal() {
  return `<div class="modal-backdrop"><div class="modal"><div class="section-title-row"><div><p class="eyebrow">Daily EA Brief</p><h2>Copy/Paste Update for Hassan & Jason</h2><p class="page-desc">Use this as a polished daily operating update after checking the inbox and follow-ups.</p></div><button class="btn ghost" data-action="closeModal">Close</button></div><textarea class="summary-box" readonly>${esc(dailySummaryText())}</textarea><div class="actions" style="margin-top:14px;"><button class="btn" data-action="copySummary">Copy Summary</button></div></div></div>`;
}

function validateForm(action, data) {
  if (action === "saveLead") {
    if (!data.name?.trim()) return "Lead name is required.";
    if (!data.serviceCategory?.trim()) return "Service category is required.";
    if (!data.stage?.trim()) return "Lead stage is required.";
    if (!data.assignedTo?.trim()) return "Assigned person is required.";
    if (["Warm Lead", "Waiting for Response", "Follow-Up Needed"].includes(data.stage) && !data.nextFollowUpDate) return "Warm/waiting leads need a next follow-up date.";
    if (data.stage === "Closed/Lost" && !data.closedLostReason?.trim()) return "Please add a Closed/Lost reason.";
  }
  if (action === "saveEmail") {
    if (!data.subject?.trim()) return "Email subject is required.";
    if (!data.assignedTo?.trim()) return "Assigned person is required.";
    if (!data.urgency?.trim()) return "Urgency level is required.";
    if (!data.replyDueDate) return "Reply due date is required.";
  }
  if (action === "saveReminder") {
    if (!data.clientName?.trim()) return "Lead/client name is required.";
    if (!data.followUpDate) return "Follow-up date is required.";
    if (!data.nextAction?.trim()) return "Next action is required.";
  }
  if (action === "saveTask" && !data.title?.trim()) return "Task title is required.";
  return "";
}

function bindEvents() {
  document.querySelectorAll("[data-page]").forEach(el => el.addEventListener("click", () => setPage(el.dataset.page)));
  document.querySelectorAll("[data-action]").forEach(el => {
    if (el.tagName === "FORM") { el.addEventListener("submit", handleForm); return; }
    el.addEventListener("click", e => handleAction(e, el, el.dataset.action));
  });
  document.querySelectorAll("[data-filter]").forEach(el => {
    const eventName = el.tagName === "INPUT" ? "input" : "change";
    el.addEventListener(eventName, () => {
      state.filters[el.dataset.filter] = el.value;
      save();
      if (el.tagName === "INPUT") {
        clearTimeout(window.__hepFilterTimer);
        window.__hepFilterTimer = setTimeout(render, 180);
      } else render();
    });
  });
  document.querySelectorAll("select[data-action='changeLeadStage']").forEach(el => el.addEventListener("change", () => {
    const l = state.leads.find(x => x.id === el.dataset.id);
    if (!l) return;
    if (el.value === "Closed/Lost" && !l.closedLostReason) {
      alert("Please open the lead and add a Closed/Lost reason before closing.");
      render();
      return;
    }
    l.stage = el.value;
    l.updatedAt = fmt(0);
    l.history = [...(l.history || []), `Moved to ${el.value} on ${fmt(0)}`];
    save(); render();
  }));
  document.querySelectorAll("select[data-action='changeTaskStatus']").forEach(el => el.addEventListener("change", () => {
    const t = state.tasks.find(x => x.id === el.dataset.id);
    if (!t) return;
    t.status = el.value;
    t.updatedAt = fmt(0);
    save(); render();
  }));
}
function handleAction(e, el, action) {
  if (["login","logout","resetDemo","toggleSidebar","clearFilters","closeModal"].includes(action)) e.preventDefault();
  if (action === "login") setSession(el.dataset.role);
  if (action === "logout") logout();
  if (action === "resetDemo") resetDemo();
  if (action === "toggleSidebar") { sidebarOpen = !sidebarOpen; render(); }
  if (action === "clearFilters") { state.filters = {}; save(); render(); }
  if (action === "closeModal") { modal = null; render(); }
  if (action === "dailySummary") { modal = { type: "summary" }; render(); }
  if (action === "copySummary") { navigator.clipboard?.writeText(dailySummaryText()); alert("Daily summary copied."); }
  if (action === "exportData") exportCollection(el.dataset.type);
  if (action === "openLead") { modal = { type: "lead", item: state.leads.find(x => x.id === el.dataset.id) || null }; render(); }
  if (action === "viewLead") { modal = { type: "leadDetails", item: state.leads.find(x => x.id === el.dataset.id) || null }; render(); }
  if (action === "openEmail") { modal = { type: "email", item: state.urgentEmails.find(x => x.id === el.dataset.id) || null }; render(); }
  if (action === "openReminder") { modal = { type: "reminder", item: state.reminders.find(x => x.id === el.dataset.id) || null }; render(); }
  if (action === "openTask") { modal = { type: "task", item: state.tasks.find(x => x.id === el.dataset.id) || null }; render(); }
  if (action === "markEmailDone") { const item = state.urgentEmails.find(x => x.id === el.dataset.id); if (item) { item.status = "Completed"; item.updatedAt = fmt(0); save(); render(); } }
  if (action === "completeReminder") { const item = state.reminders.find(x => x.id === el.dataset.id); if (item) { item.status = "Completed"; item.updatedAt = fmt(0); save(); render(); } }
  if (action === "quickStage") { const l = state.leads.find(x => x.id === el.dataset.id); if (l) { l.stage = el.dataset.stage; l.updatedAt = fmt(0); l.history = [...(l.history || []), `Moved to ${el.dataset.stage} on ${fmt(0)}`]; modal = null; save(); render(); } }
  if (action === "saveSetting") { const ta = document.querySelector(`textarea[data-setting="${el.dataset.key}"]`); state.settings[el.dataset.key] = ta.value.split("\n").map(x => x.trim()).filter(Boolean); save(); render(); }
  if (action === "deleteRecord") deleteRecord(el.dataset.type, el.dataset.id);
}
function handleForm(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const action = form.dataset.action;
  const id = form.dataset.id;
  const data = Object.fromEntries(new FormData(form).entries());
  const validation = validateForm(action, data);
  if (validation) { alert(validation); return; }
  if (action === "saveLead") {
    const existing = state.leads.find(x => x.id === id);
    upsert("leads", id, { ...data, history: existing ? (existing.history || []) : ["Lead created from demo form"], createdAt: existing?.createdAt || fmt(0), updatedAt: fmt(0) });
  }
  if (action === "saveEmail") {
    const existing = state.urgentEmails.find(x => x.id === id);
    upsert("urgentEmails", id, { ...data, createdAt: existing?.createdAt || fmt(0), updatedAt: fmt(0) });
  }
  if (action === "saveReminder") {
    const existing = state.reminders.find(x => x.id === id);
    upsert("reminders", id, { ...data, leadId: existing?.leadId || null, createdAt: existing?.createdAt || fmt(0), updatedAt: fmt(0) });
  }
  if (action === "saveTask") {
    const existing = state.tasks.find(x => x.id === id);
    upsert("tasks", id, { ...data, relatedLeadId: existing?.relatedLeadId || null, createdAt: existing?.createdAt || fmt(0), updatedAt: fmt(0) });
  }
  modal = null;
  save(); render();
}
function upsert(collection, id, data) {
  if (id) {
    const idx = state[collection].findIndex(x => x.id === id);
    if (idx >= 0) state[collection][idx] = { ...state[collection][idx], ...data, id };
  } else state[collection].unshift({ id: uid(), ...data });
}
function deleteRecord(type, id) {
  const map = { Lead: "leads", "Urgent Email": "urgentEmails", "Follow-Up Reminder": "reminders", Task: "tasks" };
  const coll = map[type];
  if (!coll) return;
  if (confirm(`Delete this ${type}?`)) {
    state[coll] = state[coll].filter(x => x.id !== id);
    modal = null;
    save(); render();
  }
}
function exportCollection(type) {
  const rows = state[type] || [];
  if (!rows.length) { alert("Nothing to export yet."); return; }
  const keys = Array.from(rows.reduce((set, row) => { Object.keys(row).forEach(k => set.add(k)); return set; }, new Set()));
  const csv = [keys.join(","), ...rows.map(row => keys.map(k => csvCell(row[k])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `holistic-ep-${type}-${fmt(0)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
function csvCell(value) {
  const text = Array.isArray(value) ? value.join(" | ") : value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

render();
