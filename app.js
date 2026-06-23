const DEFAULTS = {
  leadStages: ["New Lead", "Contacted", "Warm Lead", "Waiting for Response", "Booked", "Completed", "Follow-Up Needed", "Closed/Lost"],
  serviceCategories: ["NDIS", "Exercise Physiology", "Telehealth", "Home Visit", "Diabetes Program", "WorkCover", "Stoma Care", "Falls Prevention", "Lungs in Action", "Walking Group", "General Enquiry"],
  urgencyLevels: ["Critical", "High", "Medium", "Low"],
  users: ["Hassan", "Jason", "Executive Assistant", "Unassigned", "Needs Review"],
  enquirySources: ["Website Contact Form", "Phone Call", "Email", "Halaxy Booking", "NDIS Referral", "GP Referral", "Social Media", "Returning Client", "Word of Mouth"],
  reminderTypes: ["No reply follow-up", "Booking confirmation", "Appointment reminder", "Warm lead check-in", "Referral follow-up", "Post-appointment follow-up", "Missing information follow-up"]
};

const today = new Date();
const fmt = (offset = 0) => {
  const d = new Date(today);
  d.setDate(today.getDate() + offset);
  return d.toISOString().slice(0, 10);
};
const uid = () => (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function")
  ? globalThis.crypto.randomUUID()
  : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const APP_VERSION = "2.0";
const STORAGE_KEY = "holistic-ep-tracker-v2";

const seedState = {
  session: null,
  currentPage: "dashboard",
  settings: DEFAULTS,
  filters: {},
  leads: [
    { id: uid(), name: "Amelia Tran", phone: "0412 223 119", email: "amelia.tran@example.com", enquirySource: "Website Contact Form", serviceCategory: "NDIS", stage: "New Lead", assignedTo: "Hassan", priority: "High", lastContactDate: fmt(-1), nextFollowUpDate: fmt(0), appointmentDate: "", notes: "Participant seeking support to improve mobility and independence.", history: ["Website enquiry received"], createdAt: fmt(-2), updatedAt: fmt(-1), closedLostReason: "" },
    { id: uid(), name: "Michael Rivera", phone: "0404 991 220", email: "michael.rivera@example.com", enquirySource: "GP Referral", serviceCategory: "Diabetes Program", stage: "Warm Lead", assignedTo: "Jason", priority: "Medium", lastContactDate: fmt(-3), nextFollowUpDate: fmt(0), appointmentDate: "", notes: "Asked about diabetes exercise program and home routine.", history: ["GP referral received", "Initial call completed"], createdAt: fmt(-5), updatedAt: fmt(-3), closedLostReason: "" },
    { id: uid(), name: "Sarah Nguyen", phone: "0433 880 154", email: "sarah.nguyen@example.com", enquirySource: "Phone Call", serviceCategory: "Home Visit", stage: "Waiting for Response", assignedTo: "Executive Assistant", priority: "High", lastContactDate: fmt(-2), nextFollowUpDate: fmt(0), appointmentDate: "", notes: "Needs availability confirmation for home visit next week.", history: ["Called clinic", "EA sent availability options"], createdAt: fmt(-4), updatedAt: fmt(-2), closedLostReason: "" },
    { id: uid(), name: "Daniel Brooks", phone: "0499 234 100", email: "daniel.brooks@example.com", enquirySource: "Halaxy Booking", serviceCategory: "Exercise Physiology", stage: "Booked", assignedTo: "Jason", priority: "Medium", lastContactDate: fmt(-1), nextFollowUpDate: fmt(3), appointmentDate: fmt(5), notes: "Booked initial consult for lower back rehab.", history: ["Booked via Halaxy", "Confirmation email sent"], createdAt: fmt(-1), updatedAt: fmt(-1), closedLostReason: "" },
    { id: uid(), name: "Priya Shah", phone: "0420 112 887", email: "priya.shah@example.com", enquirySource: "Email", serviceCategory: "Telehealth", stage: "Contacted", assignedTo: "Hassan", priority: "Low", lastContactDate: fmt(-1), nextFollowUpDate: fmt(2), appointmentDate: "", notes: "Interested in remote consultation due to work schedule.", history: ["Email received", "Telehealth details sent"], createdAt: fmt(-2), updatedAt: fmt(-1), closedLostReason: "" },
    { id: uid(), name: "George Wilson", phone: "0418 762 333", email: "george.wilson@example.com", enquirySource: "WorkCover", serviceCategory: "WorkCover", stage: "Follow-Up Needed", assignedTo: "Executive Assistant", priority: "High", lastContactDate: fmt(-6), nextFollowUpDate: fmt(-1), appointmentDate: "", notes: "Need claim details before practitioner review.", history: ["Claim details requested"], createdAt: fmt(-8), updatedAt: fmt(-6), closedLostReason: "" },
    { id: uid(), name: "Lily Chen", phone: "0455 340 765", email: "lily.chen@example.com", enquirySource: "Social Media", serviceCategory: "Walking Group", stage: "Warm Lead", assignedTo: "Executive Assistant", priority: "Low", lastContactDate: fmt(-4), nextFollowUpDate: fmt(1), appointmentDate: "", notes: "Asked about joining the walking group with a friend.", history: ["Instagram DM received", "Program info sent"], createdAt: fmt(-5), updatedAt: fmt(-4), closedLostReason: "" },
    { id: uid(), name: "Anthony Moore", phone: "0471 819 230", email: "anthony.moore@example.com", enquirySource: "NDIS Referral", serviceCategory: "NDIS", stage: "Contacted", assignedTo: "Hassan", priority: "Critical", lastContactDate: fmt(0), nextFollowUpDate: fmt(0), appointmentDate: "", notes: "Support coordinator asked for urgent callback.", history: ["Referral received", "Callback requested"], createdAt: fmt(0), updatedAt: fmt(0), closedLostReason: "" },
    { id: uid(), name: "Rebecca Stone", phone: "0438 653 201", email: "rebecca.stone@example.com", enquirySource: "Email", serviceCategory: "Falls Prevention", stage: "New Lead", assignedTo: "Jason", priority: "Medium", lastContactDate: "", nextFollowUpDate: fmt(1), appointmentDate: "", notes: "Daughter enquiring for mother after recent fall.", history: ["Email enquiry received"], createdAt: fmt(0), updatedAt: fmt(0), closedLostReason: "" },
    { id: uid(), name: "Nina Patel", phone: "0401 450 770", email: "nina.patel@example.com", enquirySource: "Returning Client", serviceCategory: "Lungs in Action", stage: "Completed", assignedTo: "Jason", priority: "Low", lastContactDate: fmt(-1), nextFollowUpDate: fmt(14), appointmentDate: fmt(-1), notes: "Completed session. Follow-up check in two weeks.", history: ["Session completed", "Home routine sent"], createdAt: fmt(-10), updatedAt: fmt(-1), closedLostReason: "" },
    { id: uid(), name: "Oliver Martin", phone: "0466 390 411", email: "oliver.martin@example.com", enquirySource: "Phone Call", serviceCategory: "Stoma Care", stage: "Closed/Lost", assignedTo: "Hassan", priority: "Medium", lastContactDate: fmt(-5), nextFollowUpDate: "", appointmentDate: "", notes: "Requested location outside service area.", history: ["Phone enquiry", "Provided alternative recommendation"], createdAt: fmt(-9), updatedAt: fmt(-5), closedLostReason: "Outside current service area" },
    { id: uid(), name: "Grace Taylor", phone: "0429 105 991", email: "grace.taylor@example.com", enquirySource: "Word of Mouth", serviceCategory: "Exercise Physiology", stage: "Booked", assignedTo: "Hassan", priority: "Medium", lastContactDate: fmt(0), nextFollowUpDate: fmt(2), appointmentDate: fmt(2), notes: "Booked for chronic knee pain consult.", history: ["Referred by previous client", "Booking confirmed"], createdAt: fmt(-1), updatedAt: fmt(0), closedLostReason: "" }
  ],
  urgentEmails: [
    { id: uid(), subject: "NDIS referral - urgent availability", senderName: "Emma Kelly", senderEmail: "emma.kelly@example.com", enquiryType: "Referral", serviceCategory: "NDIS", urgency: "Critical", assignedTo: "Hassan", dateReceived: fmt(0), replyDueDate: fmt(0), status: "Reply Needed", responseNeeded: "Confirm availability and intake requirements.", notes: "Support coordinator waiting for response.", createdAt: fmt(0), updatedAt: fmt(0) },
    { id: uid(), subject: "Home visit question for father", senderName: "Maria Lopez", senderEmail: "maria.lopez@example.com", enquiryType: "Booking Enquiry", serviceCategory: "Home Visit", urgency: "High", assignedTo: "Executive Assistant", dateReceived: fmt(0), replyDueDate: fmt(0), status: "New", responseNeeded: "Send home visit process and ask for suburb/availability.", notes: "Potential warm lead.", createdAt: fmt(0), updatedAt: fmt(0) },
    { id: uid(), subject: "GP referral attached", senderName: "Dr. Alan Reeves", senderEmail: "dr.reeves@exampleclinic.com", enquiryType: "GP Referral", serviceCategory: "Exercise Physiology", urgency: "High", assignedTo: "Jason", dateReceived: fmt(-1), replyDueDate: fmt(0), status: "Waiting for Jason", responseNeeded: "Review referral and confirm next step.", notes: "Referral document mentioned chronic pain.", createdAt: fmt(-1), updatedAt: fmt(-1) },
    { id: uid(), subject: "Telehealth appointment request", senderName: "Priya Shah", senderEmail: "priya.shah@example.com", enquiryType: "Booking Enquiry", serviceCategory: "Telehealth", urgency: "Medium", assignedTo: "Executive Assistant", dateReceived: fmt(-1), replyDueDate: fmt(1), status: "Reply Needed", responseNeeded: "Offer telehealth times.", notes: "Prefers after 5pm.", createdAt: fmt(-1), updatedAt: fmt(-1) },
    { id: uid(), subject: "Diabetes program price", senderName: "Michael Rivera", senderEmail: "michael.rivera@example.com", enquiryType: "General Question", serviceCategory: "Diabetes Program", urgency: "Medium", assignedTo: "Jason", dateReceived: fmt(-2), replyDueDate: fmt(0), status: "Replied", responseNeeded: "Follow up if still interested.", notes: "May book after speaking to family.", createdAt: fmt(-2), updatedAt: fmt(-1) },
    { id: uid(), subject: "Walking group details", senderName: "Lily Chen", senderEmail: "lily.chen@example.com", enquiryType: "Social Media", serviceCategory: "Walking Group", urgency: "Low", assignedTo: "Executive Assistant", dateReceived: fmt(-3), replyDueDate: fmt(2), status: "Replied", responseNeeded: "Send start time and location.", notes: "Not urgent.", createdAt: fmt(-3), updatedAt: fmt(-2) },
    { id: uid(), subject: "WorkCover forms needed", senderName: "George Wilson", senderEmail: "george.wilson@example.com", enquiryType: "Documentation", serviceCategory: "WorkCover", urgency: "High", assignedTo: "Executive Assistant", dateReceived: fmt(-2), replyDueDate: fmt(-1), status: "Reply Needed", responseNeeded: "Request missing claim information.", notes: "Overdue reply risk.", createdAt: fmt(-2), updatedAt: fmt(-2) },
    { id: uid(), subject: "Appointment reschedule", senderName: "Grace Taylor", senderEmail: "grace.taylor@example.com", enquiryType: "Booking Change", serviceCategory: "Exercise Physiology", urgency: "Medium", assignedTo: "Hassan", dateReceived: fmt(0), replyDueDate: fmt(0), status: "New", responseNeeded: "Confirm if schedule change is possible.", notes: "Appointment in two days.", createdAt: fmt(0), updatedAt: fmt(0) }
  ],
  reminders: [
    { id: uid(), leadId: null, clientName: "Amelia Tran", reason: "NDIS referral follow-up", followUpDate: fmt(0), assignedTo: "Hassan", status: "Due Today", lastMessageSent: fmt(-1), nextAction: "Call support coordinator", notes: "Confirm goals and preferred appointment time.", createdAt: fmt(-1), updatedAt: fmt(-1) },
    { id: uid(), leadId: null, clientName: "Michael Rivera", reason: "Warm lead check-in", followUpDate: fmt(0), assignedTo: "Jason", status: "Due Today", lastMessageSent: fmt(-2), nextAction: "Send diabetes program booking link", notes: "Interested but not booked.", createdAt: fmt(-2), updatedAt: fmt(-2) },
    { id: uid(), leadId: null, clientName: "George Wilson", reason: "Missing information follow-up", followUpDate: fmt(-1), assignedTo: "Executive Assistant", status: "Overdue", lastMessageSent: fmt(-6), nextAction: "Ask for claim details", notes: "WorkCover claim details incomplete.", createdAt: fmt(-6), updatedAt: fmt(-1) },
    { id: uid(), leadId: null, clientName: "Sarah Nguyen", reason: "Booking confirmation", followUpDate: fmt(0), assignedTo: "Executive Assistant", status: "Due Today", lastMessageSent: fmt(-2), nextAction: "Confirm home visit schedule", notes: "Waiting for client reply.", createdAt: fmt(-2), updatedAt: fmt(-2) },
    { id: uid(), leadId: null, clientName: "Priya Shah", reason: "Telehealth follow-up", followUpDate: fmt(2), assignedTo: "Executive Assistant", status: "Pending", lastMessageSent: fmt(-1), nextAction: "Check preferred time", notes: "Prefers evening.", createdAt: fmt(-1), updatedAt: fmt(-1) },
    { id: uid(), leadId: null, clientName: "Daniel Brooks", reason: "Appointment reminder", followUpDate: fmt(3), assignedTo: "Executive Assistant", status: "Pending", lastMessageSent: fmt(-1), nextAction: "Send reminder and intake form", notes: "Initial consult booked.", createdAt: fmt(-1), updatedAt: fmt(-1) },
    { id: uid(), leadId: null, clientName: "Grace Taylor", reason: "Booking confirmation", followUpDate: fmt(1), assignedTo: "Hassan", status: "Pending", lastMessageSent: fmt(0), nextAction: "Confirm reschedule request", notes: "Needs appointment change.", createdAt: fmt(0), updatedAt: fmt(0) },
    { id: uid(), leadId: null, clientName: "Lily Chen", reason: "Walking group info", followUpDate: fmt(1), assignedTo: "Executive Assistant", status: "Pending", lastMessageSent: fmt(-4), nextAction: "Send group details", notes: "Potential participant.", createdAt: fmt(-4), updatedAt: fmt(-4) },
    { id: uid(), leadId: null, clientName: "Rebecca Stone", reason: "New lead contact", followUpDate: fmt(1), assignedTo: "Jason", status: "Pending", lastMessageSent: "", nextAction: "Call daughter", notes: "Falls prevention enquiry.", createdAt: fmt(0), updatedAt: fmt(0) },
    { id: uid(), leadId: null, clientName: "Nina Patel", reason: "Post-appointment follow-up", followUpDate: fmt(14), assignedTo: "Jason", status: "Pending", lastMessageSent: fmt(-1), nextAction: "Check home routine progress", notes: "Completed session.", createdAt: fmt(-1), updatedAt: fmt(-1) }
  ],
  tasks: [
    { id: uid(), title: "Review critical NDIS referral", description: "Flag intake requirements and confirm availability.", assignedTo: "Hassan", dueDate: fmt(0), priority: "Critical", relatedLeadId: null, status: "To Do", createdAt: fmt(0), updatedAt: fmt(0) },
    { id: uid(), title: "Reply to home visit enquiry", description: "Ask for location, preferred time, and support needs.", assignedTo: "Executive Assistant", dueDate: fmt(0), priority: "High", relatedLeadId: null, status: "To Do", createdAt: fmt(0), updatedAt: fmt(0) },
    { id: uid(), title: "Confirm diabetes program details", description: "Send booking link and program details.", assignedTo: "Jason", dueDate: fmt(0), priority: "Medium", relatedLeadId: null, status: "In Progress", createdAt: fmt(-1), updatedAt: fmt(0) },
    { id: uid(), title: "Update Warm Lead notes", description: "Update CRM notes after follow-up calls.", assignedTo: "Executive Assistant", dueDate: fmt(0), priority: "Medium", relatedLeadId: null, status: "To Do", createdAt: fmt(0), updatedAt: fmt(0) },
    { id: uid(), title: "Send appointment reminders", description: "Send reminders to booked clients for this week.", assignedTo: "Executive Assistant", dueDate: fmt(1), priority: "Medium", relatedLeadId: null, status: "To Do", createdAt: fmt(0), updatedAt: fmt(0) },
    { id: uid(), title: "Review GP referral", description: "Jason to review referral summary before reply.", assignedTo: "Jason", dueDate: fmt(0), priority: "High", relatedLeadId: null, status: "Waiting", createdAt: fmt(-1), updatedAt: fmt(0) },
    { id: uid(), title: "Prepare daily lead summary", description: "Summarize new leads, warm leads, urgent emails, and overdue follow-ups.", assignedTo: "Executive Assistant", dueDate: fmt(0), priority: "High", relatedLeadId: null, status: "To Do", createdAt: fmt(0), updatedAt: fmt(0) },
    { id: uid(), title: "Follow up WorkCover info", description: "Request missing claim information.", assignedTo: "Executive Assistant", dueDate: fmt(-1), priority: "High", relatedLeadId: null, status: "To Do", createdAt: fmt(-2), updatedAt: fmt(-1) },
    { id: uid(), title: "Confirm Grace reschedule", description: "Check Hassan availability then reply to client.", assignedTo: "Hassan", dueDate: fmt(0), priority: "Medium", relatedLeadId: null, status: "In Progress", createdAt: fmt(0), updatedAt: fmt(0) },
    { id: uid(), title: "Archive completed email replies", description: "Mark completed items and update tracker notes.", assignedTo: "Executive Assistant", dueDate: fmt(0), priority: "Low", relatedLeadId: null, status: "Done", createdAt: fmt(0), updatedAt: fmt(0) }
  ]
};

let state = loadState();
let modal = null;
let sidebarOpen = false;

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return normalizeState(JSON.parse(saved));

    // Gracefully migrate older demo saves if the user opened the first version.
    const oldSaved = localStorage.getItem("holistic-ep-tracker-v1");
    if (oldSaved) return normalizeState(JSON.parse(oldSaved));
  } catch (e) { console.warn("Unable to load saved demo data", e); }
  const fresh = normalizeState(structuredCloneSafe(seedState));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  return fresh;
}
function normalizeState(raw = {}) {
  const base = structuredCloneSafe(seedState);
  const merged = { ...base, ...raw };
  merged.appVersion = APP_VERSION;
  merged.settings = { ...DEFAULTS, ...(raw.settings || {}) };
  merged.filters = raw.filters && typeof raw.filters === "object" ? raw.filters : {};
  merged.leads = Array.isArray(raw.leads) ? raw.leads : base.leads;
  merged.urgentEmails = Array.isArray(raw.urgentEmails) ? raw.urgentEmails : base.urgentEmails;
  merged.reminders = Array.isArray(raw.reminders) ? raw.reminders : base.reminders;
  merged.tasks = Array.isArray(raw.tasks) ? raw.tasks : base.tasks;
  return merged;
}
function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Unable to save demo data", e);
    alert("The tracker could not save changes in this browser. Please check storage permissions or clear old demo data.");
  }
}
function structuredCloneSafe(obj) { return JSON.parse(JSON.stringify(obj)); }
function setPage(page) { state.currentPage = page; sidebarOpen = false; save(); render(); }
function setSession(role) { state.session = { role, name: role === "Admin" ? "Admin" : role, loggedInAt: new Date().toISOString() }; save(); render(); }
function logout() { state.session = null; save(); render(); }
function resetDemo() { if (confirm("Reset all demo data?")) { localStorage.removeItem(STORAGE_KEY); state = loadState(); render(); } }
function setFilter(key, value, shouldRender = true) {
  state.filters[key] = value;
  save();
  if (shouldRender) render();
}

function daysDiff(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  const t = new Date(fmt(0) + "T00:00:00");
  return Math.round((d - t) / 86400000);
}
function isDueToday(dateStr) { return daysDiff(dateStr) === 0; }
function isOverdue(dateStr) { const d = daysDiff(dateStr); return d !== null && d < 0; }
function esc(v = "") { return String(v).replace(/[&<>'"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[ch])); }
function pill(text, cls = "") { return `<span class="badge ${cls || text}">${esc(text)}</span>`; }

function metrics() {
  const todayStr = fmt(0);
  return {
    newLeads: state.leads.filter(l => l.stage === "New Lead").length,
    warmLeads: state.leads.filter(l => l.stage === "Warm Lead").length,
    urgentEmails: state.urgentEmails.filter(e => ["Critical", "High"].includes(e.urgency) && !["Completed", "Replied"].includes(e.status)).length,
    followUpsToday: state.reminders.filter(r => r.followUpDate === todayStr && r.status !== "Completed").length,
    pendingBookings: state.leads.filter(l => ["Waiting for Response", "Booked"].includes(l.stage)).length,
    overdueFollowUps: state.reminders.filter(r => isOverdue(r.followUpDate) && r.status !== "Completed").length,
    completedTasks: state.tasks.filter(t => t.status === "Done" && t.updatedAt === todayStr).length,
    missed: state.leads.filter(l => l.stage === "Closed/Lost").length
  };
}

const pageInfo = {
  dashboard: ["Daily EA Dashboard", "A clear operating view for urgent replies, warm leads, bookings, follow-ups, and assigned work."],
  pipeline: ["Lead Pipeline", "Track every enquiry from first contact to booking, completion, or closed/lost outcome."],
  emails: ["Urgent Email Tracker", "Prioritize booking enquiries, NDIS referrals, GP referrals, home visit questions, and client concerns."],
  reminders: ["Follow-Up Reminders", "Keep warm leads active and prevent missed opportunities through scheduled follow-ups."],
  tasks: ["EA Task Planner", "Plan daily admin actions, appointment tasks, urgent follow-ups, and completed work."],
  reports: ["Reports", "Monitor lead movement, conversion, urgent emails, follow-ups, and service demand."],
  settings: ["Settings", "Manage demo options for services, users, lead stages, urgency levels, and reminder types."]
};

function render() {
  const app = document.getElementById("app");
  if (!state.session) { app.innerHTML = loginView(); bindEvents(); return; }
  const [title, desc] = pageInfo[state.currentPage] || pageInfo.dashboard;
  app.innerHTML = `
    <div class="app-shell">
      ${sidebarView()}
      <main class="main">
        <div class="topbar">
          <div>
            <button class="btn secondary small mobile-menu" data-action="toggleSidebar">☰ Menu</button>
            <p class="eyebrow">Holistic EP Tracker</p>
            <h1>${title}</h1>
            <p class="page-desc">${desc}</p>
          </div>
          <div class="user-pill">
            <span class="avatar">${esc(state.session.name[0] || "U")}</span>
            <div><strong>${esc(state.session.name)}</strong><br><small>${esc(state.session.role)}</small></div>
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
  return `
    <section class="login-screen">
      <div class="login-card">
        <div class="login-hero">
          <div class="logo-row">
            <div class="logo-mark">HEP</div>
            <div>
              <p class="brand-title"><strong>Holistic Exercise Physiology</strong></p>
              <p class="brand-subtitle">Lead & Follow-Up Tracker</p>
            </div>
          </div>
          <h1 style="margin-top:58px;">Balance every lead, email, and follow-up.</h1>
          <p>A simple internal operating system for Hassan, Jason, and the Executive Assistant to track enquiries, referrals, warm leads, urgent replies, and booking movement.</p>
          <div class="grid three-grid" style="margin-top:28px; position:relative; z-index:1;">
            <div class="badge success">NDIS</div><div class="badge success">Telehealth</div><div class="badge success">Home Visits</div>
          </div>
        </div>
        <div class="login-panel">
          <p class="eyebrow">Demo Login</p>
          <h2 style="margin:0 0 10px; letter-spacing:-.04em;">Select your role</h2>
          <p class="page-desc" style="margin-bottom:22px;">Phase 1 demo uses localStorage only. No real patient/client information should be entered.</p>
          <div class="role-grid">
            ${["Admin", "Hassan", "Jason", "Executive Assistant"].map(role => `<button class="role-btn" data-action="login" data-role="${role}"><strong>${role}</strong><span>${role === "Admin" ? "Full visibility and settings access" : "View and update assigned leads, emails, and follow-ups"}</span></button>`).join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

function sidebarView() {
  const items = [
    ["dashboard", "▦", "Dashboard"],
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
            <p class="brand-subtitle">Lead & Follow-Up Tracker</p>
          </div>
        </div>
        <p class="tagline">Balancing Body, Mind, and Movement — now with a clearer admin workflow for every enquiry.</p>
      </div>
      <nav class="nav">
        ${items.map(([id, icon, label]) => `<button class="${state.currentPage === id ? "active" : ""}" data-page="${id}"><span class="icon">${icon}</span>${label}</button>`).join("")}
      </nav>
      <div class="sidebar-footer">
        <small><strong>Phase 1:</strong> demo data is saved in this browser using localStorage. For live client use, connect to a secure backend before storing real client or referral information.</small>
        <div class="actions" style="margin-top:12px;"><button class="btn ghost small" data-action="resetDemo">Reset Demo</button></div>
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
    ["New Leads", m.newLeads, "Needs first action"], ["Warm Leads", m.warmLeads, "Potential bookings"], ["Urgent Emails", m.urgentEmails, "Critical/high priority"], ["Follow-Ups Today", m.followUpsToday, "Due now"],
    ["Pending Bookings", m.pendingBookings, "Waiting or booked"], ["Overdue Follow-Ups", m.overdueFollowUps, "Needs immediate review"], ["Completed Tasks", m.completedTasks, "Done today"], ["Closed/Lost", m.missed, "Missed opportunities"]
  ];
  const urgent = [...state.urgentEmails].filter(e => !["Completed", "Replied"].includes(e.status)).sort((a,b) => urgencyRank(a.urgency) - urgencyRank(b.urgency)).slice(0,5);
  const due = state.reminders.filter(r => r.status !== "Completed" && (isDueToday(r.followUpDate) || isOverdue(r.followUpDate))).slice(0,5);
  const warm = state.leads.filter(l => ["Warm Lead", "Waiting for Response", "Follow-Up Needed"].includes(l.stage)).slice(0,5);
  const atRisk = state.leads.filter(l => isOverdue(l.nextFollowUpDate) && !["Completed","Closed/Lost"].includes(l.stage)).length;
  return `
    <div class="alert-strip">
      <div><strong>EA Morning Priority:</strong> Handle critical emails first, clear overdue follow-ups, then move warm leads toward booking.</div>
      <div class="actions"><button class="btn small" data-action="dailySummary">Generate Daily Summary</button><button class="btn secondary small" data-action="openLead">+ Add Lead</button></div>
    </div>
    <div class="grid stats-grid">
      ${statCards.map(([label, value, note]) => `<div class="card stat-card"><p class="stat-label">${label}</p><p class="stat-value">${value}</p><p class="stat-note">${note}</p></div>`).join("")}
    </div>
    <section class="card command-card" style="margin-top:18px;">
      <div class="section-title-row"><div><h2>Command Center</h2><p class="page-desc">A fast view of what needs movement today.</p></div>${pill(`${atRisk} at-risk lead${atRisk===1?"":"s"}`, atRisk ? "overdue" : "success")}</div>
      <div class="quick-grid">
        <button class="quick-tile" data-page="emails"><strong>${m.urgentEmails}</strong><span>urgent email replies</span></button>
        <button class="quick-tile" data-page="reminders"><strong>${m.overdueFollowUps}</strong><span>overdue follow-ups</span></button>
        <button class="quick-tile" data-page="pipeline"><strong>${m.warmLeads}</strong><span>warm leads to convert</span></button>
        <button class="quick-tile" data-page="tasks"><strong>${m.completedTasks}</strong><span>tasks completed today</span></button>
      </div>
    </section>
    <div class="grid two-grid" style="margin-top:18px;">
      ${listCard("Urgent emails needing reply", urgent.map(emailItem), `<button class="btn secondary small" data-page="emails">View board</button>`)}
      ${listCard("Follow-ups due now", due.map(reminderItem), `<button class="btn secondary small" data-page="reminders">View reminders</button>`)}
      ${listCard("Warm leads needing action", warm.map(leadMiniItem), `<button class="btn secondary small" data-page="pipeline">View pipeline</button>`)}
      ${listCard("Recently completed tasks", state.tasks.filter(t => t.status === "Done").slice(0,5).map(taskItem), `<button class="btn secondary small" data-page="tasks">View planner</button>`)}
    </div>
  `;
}

function listCard(title, items, action = "") {
  return `<section class="card"><div class="card-title-row"><h3>${title}</h3>${action}</div><div class="list">${items.length ? items.join("") : `<div class="empty-state">Nothing to show here.</div>`}</div></section>`;
}
function emailItem(e) {
  return `<div class="item"><div class="item-top"><p class="item-title">${esc(e.subject)}</p>${pill(e.urgency)}</div><p class="item-meta">From ${esc(e.senderName)} • ${esc(e.serviceCategory)} • Assigned to ${esc(e.assignedTo)} • Due ${esc(e.replyDueDate)}</p><p class="item-meta">${esc(e.responseNeeded)}</p></div>`;
}
function reminderItem(r) {
  const statusClass = isOverdue(r.followUpDate) ? "overdue" : isDueToday(r.followUpDate) ? "today" : "";
  return `<div class="item"><div class="item-top"><p class="item-title">${esc(r.clientName)}</p>${pill(isOverdue(r.followUpDate) ? "Overdue" : r.status, statusClass)}</div><p class="item-meta">${esc(r.reason)} • ${esc(r.assignedTo)} • ${esc(r.followUpDate)}</p><p class="item-meta">Next: ${esc(r.nextAction)}</p></div>`;
}
function leadMiniItem(l) {
  return `<div class="item"><div class="item-top"><p class="item-title">${esc(l.name)}</p>${pill(l.priority)}</div><p class="item-meta">${esc(l.stage)} • ${esc(l.serviceCategory)} • Assigned to ${esc(l.assignedTo)}</p><p class="item-meta">Next follow-up: ${esc(l.nextFollowUpDate || "Not set")}</p></div>`;
}
function taskItem(t) {
  return `<div class="item"><div class="item-top"><p class="item-title">${esc(t.title)}</p>${pill(t.status, t.status === "Done" ? "success" : "")}</div><p class="item-meta">${esc(t.assignedTo)} • Due ${esc(t.dueDate)} • ${esc(t.priority)}</p></div>`;
}

function selected(value, current) { return value === current ? "selected" : ""; }
function filtersCommon(type) {
  const f = state.filters || {};
  const showService = ["leads", "emails"].includes(type);
  const showPriority = ["leads", "emails", "tasks"].includes(type);
  const statusOptions = type === "leads" ? state.settings.leadStages
    : type === "emails" ? ["New", "Reply Needed", "Waiting for Hassan", "Waiting for Jason", "Replied", "Completed"]
    : type === "reminders" ? ["Pending", "Due Today", "Overdue", "Completed", "Rescheduled"]
    : type === "tasks" ? ["To Do", "In Progress", "Waiting", "Done"]
    : [];
  return `<div class="filters">
    <input class="input" placeholder="Search name, email, notes..." value="${esc(f.search || "")}" data-filter="search" />
    <select data-filter="assignedTo"><option value="">All owners</option>${state.settings.users.map(u => `<option value="${esc(u)}" ${selected(u, f.assignedTo)}>${esc(u)}</option>`).join("")}</select>
    ${showService ? `<select data-filter="serviceCategory"><option value="">All services</option>${state.settings.serviceCategories.map(s => `<option value="${esc(s)}" ${selected(s, f.serviceCategory)}>${esc(s)}</option>`).join("")}</select>` : ""}
    ${showPriority ? `<select data-filter="priority"><option value="">All priorities</option>${["Critical","High","Medium","Low"].map(p => `<option value="${p}" ${selected(p, f.priority)}>${p}</option>`).join("")}</select>` : ""}
    ${statusOptions.length ? `<select data-filter="status"><option value="">All statuses</option>${statusOptions.map(s => `<option value="${esc(s)}" ${selected(s, f.status)}>${esc(s)}</option>`).join("")}</select>` : ""}
    <button class="btn ghost" data-action="clearFilters">Clear</button>
  </div>`;
}
function leadMatches(l) {
  const f = state.filters || {};
  const search = (f.search || "").toLowerCase();
  return (!search || [l.name,l.email,l.phone,l.notes,l.serviceCategory,l.enquirySource].join(" ").toLowerCase().includes(search)) &&
    (!f.assignedTo || l.assignedTo === f.assignedTo) &&
    (!f.serviceCategory || l.serviceCategory === f.serviceCategory) &&
    (!f.priority || l.priority === f.priority) &&
    (!f.status || l.stage === f.status);
}

function pipelinePage() {
  const leads = state.leads.filter(leadMatches);
  return `
    <div class="card" style="margin-bottom:18px;">
      <div class="section-title-row"><h2>Lead Movement Board</h2><div class="actions"><button class="btn" data-action="openLead">+ Add Lead</button></div></div>
      ${filtersCommon("leads")}
    </div>
    <div class="pipeline">
      ${state.settings.leadStages.map(stage => {
        const stageLeads = leads.filter(l => l.stage === stage);
        return `<div class="column"><div class="column-header"><h3>${esc(stage)}</h3>${pill(stageLeads.length)}</div>${stageLeads.map(leadCard).join("") || `<div class="empty-state">No leads</div>`}</div>`;
      }).join("")}
    </div>
  `;
}
function leadCard(l) {
  return `<div class="lead-card">
    <h4>${esc(l.name)}</h4>
    <div class="actions">${pill(l.priority)}${pill(l.serviceCategory)}</div>
    <p>Owner: <strong>${esc(l.assignedTo)}</strong></p>
    <p>Last: ${esc(l.lastContactDate || "—")} • Next: ${esc(l.nextFollowUpDate || "—")}</p>
    <p>${esc(l.notes)}</p>
    <select class="stage-select" data-action="changeLeadStage" data-id="${l.id}">${state.settings.leadStages.map(s => `<option ${s===l.stage?'selected':''}>${esc(s)}</option>`).join("")}</select>
    <div class="card-actions"><button class="btn secondary small" data-action="viewLead" data-id="${l.id}">Details</button><button class="btn ghost small" data-action="openLead" data-id="${l.id}">Edit</button></div>
  </div>`;
}

function emailsPage() {
  const emails = state.urgentEmails.filter(e => {
    const f = state.filters || {}, search = (f.search || "").toLowerCase();
    return (!search || [e.subject,e.senderName,e.senderEmail,e.responseNeeded,e.notes,e.enquiryType].join(" ").toLowerCase().includes(search)) &&
      (!f.assignedTo || e.assignedTo === f.assignedTo) &&
      (!f.serviceCategory || e.serviceCategory === f.serviceCategory) &&
      (!f.priority || e.urgency === f.priority) &&
      (!f.status || e.status === f.status);
  }).sort((a,b) => urgencyRank(a.urgency) - urgencyRank(b.urgency));
  return `<section class="card"><div class="section-title-row"><div><h2>Urgent Email Board</h2><p class="page-desc">Critical and high priority messages stay visible until they are replied to or completed.</p></div><button class="btn" data-action="openEmail">+ Add Email</button></div>${filtersCommon("emails")}${emailTable(emails)}</section>`;
}
function emailTable(emails) {
  return `<div class="table-wrap"><table><thead><tr><th>Subject</th><th>Sender</th><th>Service</th><th>Urgency</th><th>Owner</th><th>Due</th><th>Status</th><th>Action</th></tr></thead><tbody>${emails.map(e => `<tr><td><strong>${esc(e.subject)}</strong><br><small>${esc(e.responseNeeded)}</small></td><td>${esc(e.senderName)}<br><small>${esc(e.senderEmail)}</small></td><td>${pill(e.serviceCategory)}</td><td>${pill(e.urgency)}</td><td>${esc(e.assignedTo)}</td><td>${esc(e.replyDueDate)}</td><td>${pill(e.status)}</td><td><button class="btn secondary small" data-action="openEmail" data-id="${e.id}">Edit</button> <button class="btn ghost small" data-action="markEmailDone" data-id="${e.id}">Done</button></td></tr>`).join("")}</tbody></table></div>`;
}
function urgencyRank(u) { return {Critical:0, High:1, Medium:2, Low:3}[u] ?? 9; }

function remindersPage() {
  const reminders = state.reminders.filter(r => {
    const f = state.filters || {}, search = (f.search || "").toLowerCase();
    const computedStatus = isOverdue(r.followUpDate) && r.status !== "Completed" ? "Overdue" : isDueToday(r.followUpDate) && r.status !== "Completed" ? "Due Today" : r.status;
    return (!search || [r.clientName,r.reason,r.nextAction,r.notes].join(" ").toLowerCase().includes(search)) &&
      (!f.assignedTo || r.assignedTo === f.assignedTo) &&
      (!f.status || computedStatus === f.status);
  }).sort((a,b) => new Date(a.followUpDate) - new Date(b.followUpDate));
  return `<section class="card"><div class="section-title-row"><div><h2>Follow-Up Reminders</h2><p class="page-desc">Use this page to keep warm leads and booking confirmations from falling through the cracks.</p></div><button class="btn" data-action="openReminder">+ Add Reminder</button></div>${filtersCommon("reminders")}<div class="grid two-grid">${reminders.map(r => `<div class="item"><div class="item-top"><p class="item-title">${esc(r.clientName)}</p>${pill(isOverdue(r.followUpDate) && r.status !== "Completed" ? "Overdue" : isDueToday(r.followUpDate) && r.status !== "Completed" ? "Due Today" : r.status, isOverdue(r.followUpDate) && r.status !== "Completed" ? "overdue" : isDueToday(r.followUpDate) ? "today" : "")}</div><p class="item-meta">${esc(r.reason)} • ${esc(r.assignedTo)} • Due ${esc(r.followUpDate)}</p><p class="item-meta">Next action: ${esc(r.nextAction)}</p><div class="item-actions"><button class="btn secondary small" data-action="openReminder" data-id="${r.id}">Edit</button><button class="btn ghost small" data-action="completeReminder" data-id="${r.id}">Complete</button></div></div>`).join("") || `<div class="empty-state">No reminders found.</div>`}</div></section>`;
}

function tasksPage() {
  const groups = ["To Do", "In Progress", "Waiting", "Done"];
  const f = state.filters || {}, search = (f.search || "").toLowerCase();
  const tasks = state.tasks.filter(t => (!search || [t.title,t.description,t.assignedTo].join(" ").toLowerCase().includes(search)) &&
    (!f.assignedTo || t.assignedTo === f.assignedTo) &&
    (!f.priority || t.priority === f.priority) &&
    (!f.status || t.status === f.status));
  return `<section class="card"><div class="section-title-row"><div><h2>Daily EA Task Planner</h2><p class="page-desc">Plan appointment tasks, admin work, urgent follow-ups, and completed actions.</p></div><button class="btn" data-action="openTask">+ Add Task</button></div>${filtersCommon("tasks")}<div class="grid four-grid" style="display:grid; grid-template-columns:repeat(4,minmax(230px,1fr)); gap:14px; overflow-x:auto; padding-bottom:6px;">${groups.map(status => `<div class="column"><div class="column-header"><h3>${status}</h3>${pill(tasks.filter(t=>t.status===status).length)}</div>${tasks.filter(t=>t.status===status).sort((a,b)=>new Date(a.dueDate)-new Date(b.dueDate)).map(t => `<div class="lead-card ${t.priority === "Critical" ? "critical-card" : ""}"><h4>${esc(t.title)}</h4><div class="actions">${pill(t.priority)}${pill(t.assignedTo)}</div><p>${esc(t.description)}</p><p>Due: ${esc(t.dueDate)}</p><select class="stage-select" data-action="changeTaskStatus" data-id="${t.id}">${groups.map(g => `<option ${g===t.status?'selected':''}>${g}</option>`).join("")}</select><div class="card-actions"><button class="btn secondary small" data-action="openTask" data-id="${t.id}">Edit</button></div></div>`).join("") || `<div class="empty-state">No tasks</div>`}</div>`).join("")}</div></section>`;
}

function reportsPage() {
  const total = state.leads.length || 1;
  const booked = state.leads.filter(l => l.stage === "Booked" || l.stage === "Completed").length;
  const conversion = Math.round((booked / total) * 100);
  const reports = [
    ["Total Leads", state.leads.length], ["Booked/Completed", booked], ["Warm Leads", state.leads.filter(l=>l.stage==="Warm Lead").length], ["Closed/Lost", state.leads.filter(l=>l.stage==="Closed/Lost").length],
    ["Follow-Ups Completed", state.reminders.filter(r=>r.status==="Completed").length], ["Overdue Follow-Ups", metrics().overdueFollowUps], ["Urgent Emails Completed", state.urgentEmails.filter(e=>e.status==="Completed"||e.status==="Replied").length], ["Conversion Rate", `${conversion}%`]
  ];
  return `<section class="card" style="margin-bottom:18px;"><div class="section-title-row"><div><h2>Operational Reports</h2><p class="page-desc">Use these summaries to show Hassan and Jason the lead movement, follow-up health, and booking conversion.</p></div><div class="actions"><button class="btn secondary small" data-action="exportData" data-type="leads">Export Leads CSV</button><button class="btn secondary small" data-action="exportData" data-type="urgentEmails">Export Emails CSV</button></div></div></section><div class="grid stats-grid">${reports.map(([l,v]) => `<div class="card stat-card"><p class="stat-label">${l}</p><p class="stat-value">${v}</p></div>`).join("")}</div><div class="grid two-grid" style="margin-top:18px;"><section class="card"><h3>Leads by Service Category</h3>${barChart(countBy(state.leads,"serviceCategory"))}</section><section class="card"><h3>Leads by Stage</h3>${barChart(countBy(state.leads,"stage"))}</section><section class="card"><h3>Leads by Assigned Person</h3>${barChart(countBy(state.leads,"assignedTo"))}</section><section class="card"><h3>Reminder Status</h3>${barChart(countBy(state.reminders,"status"))}</section></div>`;
}

function countBy(arr, key) { return arr.reduce((acc, item) => { acc[item[key]] = (acc[item[key]]||0)+1; return acc; }, {}); }
function barChart(obj) {
  const entries = Object.entries(obj).sort((a,b)=>b[1]-a[1]);
  const max = Math.max(...entries.map(e=>e[1]),1);
  return `<div class="chart-bar">${entries.map(([k,v]) => `<div class="bar-row"><span>${esc(k)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.round((v/max)*100)}%"></div></div><strong>${v}</strong></div>`).join("")}</div>`;
}

function settingsPage() {
  const settings = [["serviceCategories","Service Categories"],["leadStages","Lead Stages"],["urgencyLevels","Urgency Levels"],["users","Users"],["enquirySources","Enquiry Sources"],["reminderTypes","Reminder Types"]];
  return `<div class="grid two-grid">${settings.map(([key,label]) => `<section class="card"><h3>${label}</h3><p class="page-desc">One item per line. Saved locally for this demo.</p><textarea data-setting="${key}">${state.settings[key].join("\n")}</textarea><div class="actions" style="margin-top:12px;"><button class="btn secondary" data-action="saveSetting" data-key="${key}">Save ${label}</button></div></section>`).join("")}</div>`;
}

function modalView() {
  if (modal.type === "summary") return dailySummaryModal();
  if (modal.type === "lead") return formModal("Lead", leadFields(modal.item || {}), "saveLead", modal.item?.id);
  if (modal.type === "leadDetails") return leadDetailsModal(modal.item);
  if (modal.type === "email") return formModal("Urgent Email", emailFields(modal.item || {}), "saveEmail", modal.item?.id);
  if (modal.type === "reminder") return formModal("Follow-Up Reminder", reminderFields(modal.item || {}), "saveReminder", modal.item?.id);
  if (modal.type === "task") return formModal("Task", taskFields(modal.item || {}), "saveTask", modal.item?.id);
  return "";
}
function field(name, label, value="", type="text", options=null, full=false) {
  if (options) return `<div class="form-row ${full?'full':''}"><label>${label}</label><select name="${name}">${options.map(o=>`<option ${value===o?'selected':''}>${esc(o)}</option>`).join("")}</select></div>`;
  if (type === "textarea") return `<div class="form-row ${full?'full':''}"><label>${label}</label><textarea name="${name}">${esc(value)}</textarea></div>`;
  return `<div class="form-row ${full?'full':''}"><label>${label}</label><input class="input" name="${name}" type="${type}" value="${esc(value)}" /></div>`;
}
function formModal(title, fieldsHtml, saveAction, id="") {
  return `<div class="modal-backdrop"><div class="modal"><div class="section-title-row"><h2>${id ? "Edit" : "Add"} ${title}</h2><button class="btn ghost" data-action="closeModal">Close</button></div><form data-action="${saveAction}" data-id="${id || ""}"><div class="form-grid">${fieldsHtml}</div><div class="actions" style="margin-top:18px;"><button class="btn" type="submit">Save ${title}</button>${id ? `<button class="btn danger" type="button" data-action="deleteRecord" data-type="${title}" data-id="${id}">Delete</button>` : ""}</div></form></div></div>`;
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
  return `<div class="modal-backdrop"><div class="modal"><div class="section-title-row"><div><p class="eyebrow">Lead Details</p><h2>${esc(l.name)}</h2><p class="page-desc">${esc(l.serviceCategory)} • ${esc(l.assignedTo)} • ${esc(l.stage)}</p></div><button class="btn ghost" data-action="closeModal">Close</button></div><div class="grid two-grid"><section class="card"><h3>Contact</h3><p>Email: ${esc(l.email)}</p><p>Phone: ${esc(l.phone)}</p><p>Source: ${esc(l.enquirySource)}</p><p>Priority: ${pill(l.priority)}</p></section><section class="card"><h3>Dates</h3><p>Last contact: ${esc(l.lastContactDate || "—")}</p><p>Next follow-up: ${esc(l.nextFollowUpDate || "—")}</p><p>Appointment: ${esc(l.appointmentDate || "—")}</p></section><section class="card"><h3>Notes</h3><p>${esc(l.notes || "No notes")}</p></section><section class="card"><h3>History</h3><div class="list">${(l.history || []).map(h=>`<div class="item"><p class="item-meta">${esc(h)}</p></div>`).join("") || `<div class="empty-state">No history yet.</div>`}</div></section></div><div class="actions" style="margin-top:18px;">${state.settings.leadStages.map(stage => `<button class="btn secondary small" data-action="quickStage" data-id="${l.id}" data-stage="${stage}">${stage}</button>`).join("")}<button class="btn" data-action="openLead" data-id="${l.id}">Edit Lead</button></div></div></div>`;
}

function dailySummaryText() {
  const m = metrics();
  const urgent = state.urgentEmails.filter(e => ["Critical","High"].includes(e.urgency) && !["Completed","Replied"].includes(e.status));
  const overdue = state.reminders.filter(r => isOverdue(r.followUpDate) && r.status !== "Completed");
  const warm = state.leads.filter(l => ["Warm Lead","Waiting for Response","Follow-Up Needed"].includes(l.stage));
  return [
    `Holistic EP Daily EA Summary - ${fmt(0)}`,
    "",
    `New Leads: ${m.newLeads}`,
    `Warm Leads: ${m.warmLeads}`,
    `Urgent Emails: ${m.urgentEmails}`,
    `Follow-Ups Due Today: ${m.followUpsToday}`,
    `Overdue Follow-Ups: ${m.overdueFollowUps}`,
    "",
    "Top urgent emails:",
    ...(urgent.slice(0,5).map(e => `- ${e.urgency}: ${e.subject} | Owner: ${e.assignedTo} | Due: ${e.replyDueDate}`) || []),
    urgent.length ? "" : "- No critical/high urgent emails open.",
    "Overdue follow-ups:",
    ...(overdue.slice(0,5).map(r => `- ${r.clientName}: ${r.nextAction} | Owner: ${r.assignedTo} | Due: ${r.followUpDate}`) || []),
    overdue.length ? "" : "- No overdue follow-ups.",
    "Warm leads needing movement:",
    ...(warm.slice(0,5).map(l => `- ${l.name}: ${l.serviceCategory} | Stage: ${l.stage} | Owner: ${l.assignedTo} | Next: ${l.nextFollowUpDate || "Not set"}`) || []),
    warm.length ? "" : "- No warm leads currently pending."
  ].join("\n");
}
function dailySummaryModal() {
  return `<div class="modal-backdrop"><div class="modal"><div class="section-title-row"><div><p class="eyebrow">Daily EA Summary</p><h2>Copy/Paste Update for Hassan & Jason</h2><p class="page-desc">Use this as your quick daily update after checking urgent emails and follow-ups.</p></div><button class="btn ghost" data-action="closeModal">Close</button></div><textarea class="summary-box" readonly>${esc(dailySummaryText())}</textarea><div class="actions" style="margin-top:14px;"><button class="btn" data-action="copySummary">Copy Summary</button></div></div></div>`;
}
function validateForm(action, data) {
  if (action === "saveLead") {
    if (!data.name?.trim()) return "Lead name is required.";
    if (!data.serviceCategory?.trim()) return "Service category is required.";
    if (!data.stage?.trim()) return "Lead stage is required.";
    if (!data.assignedTo?.trim()) return "Assigned person is required.";
    if (["Warm Lead", "Waiting for Response", "Follow-Up Needed"].includes(data.stage) && !data.nextFollowUpDate) return "Warm or waiting leads need a next follow-up date.";
    if (data.stage === "Closed/Lost" && !data.closedLostReason?.trim()) return "Please add a Closed/Lost reason before closing the lead.";
  }
  if (action === "saveEmail") {
    if (!data.subject?.trim()) return "Email subject is required.";
    if (!data.assignedTo?.trim()) return "Please assign the email to Hassan, Jason, or the EA.";
    if (!data.urgency?.trim()) return "Urgency level is required.";
  }
  if (action === "saveReminder") {
    if (!data.clientName?.trim()) return "Lead/client name is required.";
    if (!data.followUpDate) return "Follow-up date is required.";
    if (!data.nextAction?.trim()) return "Next action is required.";
  }
  if (action === "saveTask" && !data.title?.trim()) return "Task title is required.";
  return "";
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

function bindEvents() {
  document.querySelectorAll("[data-page]").forEach(el => el.addEventListener("click", () => setPage(el.dataset.page)));
  document.querySelectorAll("[data-action]").forEach(el => {
    const action = el.dataset.action;
    if (el.tagName === "FORM") { el.addEventListener("submit", handleForm); return; }
    el.addEventListener("click", e => handleAction(e, el, action));
  });
  document.querySelectorAll("[data-filter]").forEach(el => {
    const eventName = el.tagName === "INPUT" ? "input" : "change";
    el.addEventListener(eventName, () => {
      if (el.tagName === "INPUT") {
        clearTimeout(window.__hepFilterTimer);
        state.filters[el.dataset.filter] = el.value;
        save();
        window.__hepFilterTimer = setTimeout(render, 220);
      } else {
        setFilter(el.dataset.filter, el.value);
      }
    });
  });
  document.querySelectorAll("[data-setting]").forEach(el => el.addEventListener("input", () => {}));
  document.querySelectorAll("select[data-action='changeLeadStage']").forEach(el => el.addEventListener("change", () => { const l = state.leads.find(x=>x.id===el.dataset.id); if(l){l.stage=el.value;l.updatedAt=fmt(0);l.history=[...(l.history||[]),`Moved to ${el.value} on ${fmt(0)}`]; save(); render();} }));
  document.querySelectorAll("select[data-action='changeTaskStatus']").forEach(el => el.addEventListener("change", () => { const t = state.tasks.find(x=>x.id===el.dataset.id); if(t){t.status=el.value;t.updatedAt=fmt(0); save(); render();} }));
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
  if (action === "exportData") { exportCollection(el.dataset.type); }
  if (action === "openLead") { const item = state.leads.find(x=>x.id===el.dataset.id); modal = { type:"lead", item }; render(); }
  if (action === "viewLead") { const item = state.leads.find(x=>x.id===el.dataset.id); modal = { type:"leadDetails", item }; render(); }
  if (action === "openEmail") { const item = state.urgentEmails.find(x=>x.id===el.dataset.id); modal = { type:"email", item }; render(); }
  if (action === "openReminder") { const item = state.reminders.find(x=>x.id===el.dataset.id); modal = { type:"reminder", item }; render(); }
  if (action === "openTask") { const item = state.tasks.find(x=>x.id===el.dataset.id); modal = { type:"task", item }; render(); }
  if (action === "markEmailDone") { const item = state.urgentEmails.find(x=>x.id===el.dataset.id); if(item){item.status="Completed"; item.updatedAt=fmt(0); save(); render();} }
  if (action === "completeReminder") { const item = state.reminders.find(x=>x.id===el.dataset.id); if(item){item.status="Completed"; item.updatedAt=fmt(0); save(); render();} }
  if (action === "quickStage") { const l = state.leads.find(x=>x.id===el.dataset.id); if(l){l.stage=el.dataset.stage; l.updatedAt=fmt(0); l.history=[...(l.history||[]),`Moved to ${el.dataset.stage} on ${fmt(0)}`]; modal = null; save(); render();} }
  if (action === "saveSetting") { const ta = document.querySelector(`textarea[data-setting="${el.dataset.key}"]`); state.settings[el.dataset.key] = ta.value.split("\n").map(x=>x.trim()).filter(Boolean); save(); render(); }
  if (action === "deleteRecord") { deleteRecord(el.dataset.type, el.dataset.id); }
}
function handleForm(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const action = form.dataset.action;
  const id = form.dataset.id;
  const data = Object.fromEntries(new FormData(form).entries());
  const validationMessage = validateForm(action, data);
  if (validationMessage) { alert(validationMessage); return; }
  if (action === "saveLead") upsert("leads", id, { ...data, history: id ? (state.leads.find(x=>x.id===id)?.history || []) : ["Lead created"], createdAt: id ? state.leads.find(x=>x.id===id)?.createdAt : fmt(0), updatedAt: fmt(0) });
  if (action === "saveEmail") upsert("urgentEmails", id, { ...data, createdAt: id ? state.urgentEmails.find(x=>x.id===id)?.createdAt : fmt(0), updatedAt: fmt(0) });
  if (action === "saveReminder") upsert("reminders", id, { ...data, leadId: null, createdAt: id ? state.reminders.find(x=>x.id===id)?.createdAt : fmt(0), updatedAt: fmt(0) });
  if (action === "saveTask") upsert("tasks", id, { ...data, relatedLeadId: null, createdAt: id ? state.tasks.find(x=>x.id===id)?.createdAt : fmt(0), updatedAt: fmt(0) });
  modal = null; save(); render();
}
function upsert(collection, id, data) {
  if (id) {
    const idx = state[collection].findIndex(x=>x.id===id);
    if (idx >= 0) state[collection][idx] = { ...state[collection][idx], ...data, id };
  } else {
    state[collection].unshift({ id: uid(), ...data });
  }
}
function deleteRecord(type, id) {
  const map = { Lead:"leads", "Urgent Email":"urgentEmails", "Follow-Up Reminder":"reminders", Task:"tasks" };
  const coll = map[type];
  if (coll && confirm(`Delete this ${type}?`)) { state[coll] = state[coll].filter(x=>x.id !== id); modal = null; save(); render(); }
}

render();
