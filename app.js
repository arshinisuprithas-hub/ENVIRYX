let user = null;

let complaints = JSON.parse(localStorage.getItem("complaints")) || [
  {
    id: "CMP-1",
    issue_type: "Water",
    title: "Pipe leakage",
    panchayat: "Kovalam",
    department: "Water",
    priority: "High",
    status: "Submitted"
  }
];

function save() {
  localStorage.setItem("complaints", JSON.stringify(complaints));
}

function renderHome() {
  document.getElementById("app").innerHTML = `
  
  <div class="hero">

    <!-- NAVBAR -->
    <div class="nav">
      <div class="logo">
        <i class="fas fa-leaf"></i>
        <h2>Enviryx</h2>
      </div>

      <div class="nav-links">
        <button><i class="fas fa-home"></i> Home</button>
        <button onclick="renderDashboard()"><i class="fas fa-chart-line"></i> Dashboard</button>
      </div>
    </div>

    <!-- HERO CONTENT -->
    <div class="hero-content">
      <h1>
        ENVIRYX
      </h1>

      <h2 class="tagline">
        Predicting & <span>Preventing</span> Civic Issues
      </h2>

      <p>
        AI-powered civic infrastructure system to detect, track and resolve issues faster.
      </p>

      <!-- LOGIN BUTTONS -->
      <div class="actions">
      <button onclick="login('citizen')">Citizen Login</button>
      <button onclick="login('admin')">Admin Login</button>
      </div>
      <div class="stats">
      <div><h2>12,847</h2><p>Issues Resolved</p></div>
      <div><h2>3,200+</h2><p>Active Reports</p></div>
      <div><h2>94.7%</h2><p>AI Accuracy</p></div>
      </div>

      <!-- VOICE -->
      <div class="voice">
        <button onclick="toggleVoice()">
          <i class="fas fa-microphone"></i>
        </button>
        <p id="voiceOutput"></p>
      </div>

    </div>

  </div>
  `;
}
function login(role) {
  user = role;
  if (role === "citizen") renderReport();
  else renderDashboard();
}

function classify(text) {
  text = text.toLowerCase();

  if (text.includes("water")) return {type:"Water", dept:"Water", priority:"High"};
  if (text.includes("garbage")) return {type:"Sanitation", dept:"Sanitation", priority:"Medium"};
  if (text.includes("power")) return {type:"Electricity", dept:"Electricity", priority:"High"};

  return {type:"General", dept:"General", priority:"Low"};
}

function renderReport() {
  document.getElementById("app").innerHTML = `
    <h2>Report Issue</h2>
    <input id="desc" placeholder="Describe issue"><br>
    <button onclick="submitIssue()">Submit</button>
    <div id="result"></div>
    <button onclick="renderHome()">Back</button>
  `;
}

function submitIssue() {
  let desc = document.getElementById("desc").value;
  let ai = classify(desc);

  let newItem = {
    id: "CMP-" + (complaints.length+1),
    issue_type: ai.type,
    title: desc,
    panchayat: "Tambaram",
    department: ai.dept,
    priority: ai.priority,
    status: "Submitted"
  };

  complaints.push(newItem);
  save();

  document.getElementById("result").innerHTML =
    "AI Detected: " + ai.type + " | Priority: " + ai.priority;
}

function renderDashboard() {
  let html = "<h2>Dashboard</h2>";

  complaints.forEach(c => {
    html += `
      <div class="card">
        ${c.title} <br>
        ${c.department} | ${c.priority} | ${c.status}
        <br>
        <button onclick="resolve('${c.id}')">Resolve</button>
      </div>
    `;
  });

  html += `<button onclick="renderHome()">Back</button>`;

  document.getElementById("app").innerHTML = html;
}

function resolve(id) {
  complaints = complaints.map(c => {
    if (c.id === id) c.status = "Resolved";
    return c;
  });
  save();
  renderDashboard();
}

function toggleVoice() {
  const output = document.getElementById("voiceOutput");
   output.innerText = "Listening...";

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript.toLowerCase();
    output.innerText = text;

    if (text.includes("report")) renderReport();
    if (text.includes("dashboard")) renderDashboard();
  };

  recognition.start();
}

renderHome();
