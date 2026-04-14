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

// ---------------- HOME ----------------
function renderHome() {
  document.getElementById("app").innerHTML = `
  <div class="hero">

    <div class="nav">
      <div class="logo">
        <i class="fas fa-leaf"></i>
        <h2>Enviryx</h2>
      </div>

      <div class="nav-links">
        <button onclick="renderHome()"><i class="fas fa-home"></i> Home</button>
        <button onclick="renderDashboard()"><i class="fas fa-chart-line"></i> Dashboard</button>
      </div>
    </div>

    <div class="hero-content">
      <h1>ENVIRYX</h1>
      <h2 class="tagline">Predicting & <span>Preventing</span> Civic Issues</h2>
      <p>AI-powered civic infrastructure system</p>

      <div class="actions">
        <button onclick="login('citizen')">Citizen Login</button>
        <button onclick="login('admin')">Admin Login</button>
      </div>

      <div class="dashboard-stats">
        <div class="dash-card"><h3 id="total"></h3><p>Total</p></div>
        <div class="dash-card"><h3 id="active"></h3><p>Active</p></div>
        <div class="dash-card"><h3 id="pending"></h3><p>Pending</p></div>
        <div class="dash-card"><h3 id="resolved"></h3><p>Resolved</p></div>
      </div>

      <div class="voice">
        <button onclick="toggleVoice()"><i class="fas fa-microphone"></i></button>
        <p id="voiceOutput"></p>
      </div>
    </div>

  </div>
  `;

  updateDashboard(complaints);
}

// ---------------- LOGIN ----------------
function login(role) {
  user = role;
  role === "citizen" ? renderReport() : renderDashboard();
}

// ---------------- AI ----------------
function classify(text) {
  text = text.toLowerCase();

  if (text.includes("water") || text.includes("leak"))
    return {type:"Water", dept:"Water Dept", priority:"High"};

  if (text.includes("garbage"))
    return {type:"Waste", dept:"Sanitation", priority:"Medium"};

  if (text.includes("light"))
    return {type:"Electricity", dept:"EB", priority:"High"};

  return {type:"General", dept:"General", priority:"Low"};
}

// ---------------- REPORT ----------------
function renderReport() {
  document.getElementById("app").innerHTML = `
  <div class="hero">
    <div class="report-container">

      <h2>AI Issue Reporting</h2>

      <input id="desc" placeholder="Describe issue"/>
      <input id="imageInput" type="file"/>

      <div id="preview"></div>

      <button onclick="runAI()">Analyze</button>
      <div id="result"></div>

      <button onclick="submitIssue()">Submit</button>
      <button onclick="renderHome()">Back</button>

    </div>
  </div>
  `;
}

function runAI() {
  let desc = document.getElementById("desc").value;
  let ai = classify(desc);

  document.getElementById("result").innerHTML =
    `Type: ${ai.type} | Dept: ${ai.dept} | Priority: ${ai.priority}`;
}

// ---------------- SUBMIT ----------------
function submitIssue() {
  let desc = document.getElementById("desc").value;
  if (!desc) return alert("Enter issue");

  let ai = classify(desc);

  complaints.push({
    id: "CMP-" + (complaints.length+1),
    title: desc,
    panchayat: "Tambaram",
    department: ai.dept,
    priority: ai.priority,
    status: "Submitted"
  });

  save();
  renderDashboard();
}

// ---------------- DASHBOARD ----------------
function renderDashboard() {
  document.getElementById("app").innerHTML = `
  <div class="hero">
    <div class="dashboard-container">

      <h2>Dashboard</h2>

      <input placeholder="Search..." onkeyup="searchComplaints(this.value)"/>

      <div class="dashboard-stats">
        <div class="dash-card"><h3 id="total"></h3><p>Total</p></div>
        <div class="dash-card"><h3 id="active"></h3><p>Active</p></div>
        <div class="dash-card"><h3 id="pending"></h3><p>Pending</p></div>
        <div class="dash-card"><h3 id="resolved"></h3><p>Resolved</p></div>
      </div>

      <div id="mapGrid"></div>

      <canvas id="lineChart"></canvas>
      <canvas id="pieChart"></canvas>

      <div id="complaintList"></div>

      <button onclick="renderHome()">Back</button>

    </div>
  </div>
  `;

  updateDashboard(complaints);
  renderCharts();
}

// ---------------- UPDATE ----------------
function updateDashboard(data) {
  document.getElementById("total").innerText = data.length;
  document.getElementById("active").innerText = data.filter(c => c.status !== "Resolved").length;
  document.getElementById("pending").innerText = data.filter(c => c.status === "Submitted").length;
  document.getElementById("resolved").innerText = data.filter(c => c.status === "Resolved").length;

  let list = "";
  data.forEach(c => {
    list += `
    <div class="dash-item">
      ${c.title} | ${c.department} | ${c.status}
      <button onclick="resolve('${c.id}')">Resolve</button>
    </div>`;
  });

  document.getElementById("complaintList").innerHTML = list;
  renderMap(data);
}

// ---------------- MAP ----------------
function renderMap(data) {
  let grouped = {};
  data.forEach(c => grouped[c.panchayat] = (grouped[c.panchayat]||0)+1);

  let html = "";
  for (let k in grouped) {
    html += `<div>${k}: ${grouped[k]}</div>`;
  }

  document.getElementById("mapGrid").innerHTML = html;
}

// ---------------- SEARCH ----------------
function searchComplaints(v) {
  let f = complaints.filter(c => c.title.toLowerCase().includes(v.toLowerCase()));
  updateDashboard(f);
}

// ---------------- RESOLVE ----------------
function resolve(id) {
  complaints.forEach(c => { if (c.id === id) c.status="Resolved"; });
  save();
  renderDashboard();
}

// ---------------- CHARTS ----------------
function renderCharts() {
  if (window.chart1) window.chart1.destroy();
  if (window.chart2) window.chart2.destroy();

  window.chart1 = new Chart(document.getElementById("lineChart"), {
    type:'line',
    data:{labels:["Jan","Feb"],datasets:[{data:[10,20]}]}
  });

  window.chart2 = new Chart(document.getElementById("pieChart"), {
    type:'pie',
    data:{labels:["Water","Waste"],datasets:[{data:[5,3]}]}
  });
}

// ---------------- VOICE ----------------
function toggleVoice() {
  alert("Voice simulated");
}

renderHome();
