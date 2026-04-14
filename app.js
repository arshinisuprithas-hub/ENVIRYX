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
     <button onclick="login('citizen')"><i class="fas fa-user"></i> Citizen Login</button>
     <button onclick="login('admin')"><i class="fas fa-user-shield"></i> Admin Login</button>
     </div>
      <div class="dashboard-stats">
      <div class="dash-card"><h3 id="total"></h3><p>Total</p></div>
      <div class="dash-card"><h3 id="active"></h3><p>Active</p></div>
      <div class="dash-card"><h3 id="pending"></h3><p>Pending</p></div>
      <div class="dash-card"><h3 id="resolved"></h3><p>Resolved</p></div>
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

  if (text.includes("water") || text.includes("leak"))
    return {type:"Water Issue", dept:"Water Dept", priority:"High"};

  if (text.includes("garbage") || text.includes("waste"))
    return {type:"Sanitation Issue", dept:"Sanitation Dept", priority:"Medium"};

  if (text.includes("light") || text.includes("power"))
    return {type:"Electricity Issue", dept:"Electricity Dept", priority:"High"};

  if (text.includes("road") || text.includes("pothole"))
    return {type:"Road Issue", dept:"Roads Dept", priority:"High"};

  return {type:"General Issue", dept:"General Dept", priority:"Low"};
}
function renderReport() {
  document.getElementById("active").innerText =
  data.filter(c => c.status !== "Resolved").length;
    <div class="hero">

      <div class="report-container ai-box">

        <h2>🤖 AI Issue Reporting</h2>

        <input id="desc" type="text" placeholder="Describe the issue (e.g., water leakage)" />

        <input id="imageInput" type="file" accept="image/*" />

        <div id="preview"></div>

        <button onclick="runAI()">Analyze with AI</button>

        <div id="result" class="ai-result"></div>

        <button onclick="submitIssue()">Submit Issue</button>
        <button onclick="renderHome()">Back</button>

      </div>

    </div>
  `;
}

function renderDashboard() {
  let html = `
    <div class="hero">
      <div class="dashboard-container">

        <div class="dashboard-header">
          <h2>📊 Civic Dashboard</h2>
          <button onclick="renderHome()">Back</button>
        </div>

        <!-- FILTER -->
        <div class="filter">
          <label>Select Panchayat:</label>
          <select onchange="filterPanchayat(this.value)">
            <option value="all">All</option>
            <option value="Tambaram">Tambaram</option>
            <option value="Kovalam">Kovalam</option>
      <div class="ai-insights">
  <div class="insight red">
    <h4>Water Leak Surge</h4>
    <p>Expected increase in next 48 hours</p>
  </div>
  <div class="insight orange">
    <h4>Waste Optimization</h4>
    <p>Improve collection efficiency</p>
  </div>
  <div class="insight blue">
    <h4>Pollution Pattern</h4>
    <p>Industrial zone spikes detected</p>
      renderCharts();
  </div>
</div>
          </select>
        </div>

        <!-- STATS -->
        <div class="dashboard-stats">
          <div class="dash-card">
            <h3 id="total"></h3>
            <p>Total</p>
          </div>
          <div class="dash-card">
            <h3 id="pending"></h3>
            <p>Pending</p>
          </div>
          <div class="dash-card">
            <h3 id="resolved"></h3>
            <p>Resolved</p>
          </div>
        </div>

        <!-- DEPARTMENT -->
        <div class="department-box">
          <h3>Department Breakdown</h3>
          <div id="deptStats"></div>
        </div>

        <!-- HEATMAP -->
        let html = "";
  for (let area in grouped) {
  let count = grouped[area];

  let color = "#22c55e";
  if (count > 2) color = "#f59e0b";
  if (count > 4) color = "#ef4444";

  html += `
    <div class="heat-row">
      <span>${area}</span>
      <div class="bar">
        <div class="fill" style="width:${count*20}%; background:${color}"></div>
      </div>
      <span>${count} issues</span>
    </div>
  `;
}

        <!-- LIST -->
        <div class="dashboard-list" id="complaintList"></div>
        <div class="search-box">
        <input type="text" placeholder="Search complaints..." onkeyup="searchComplaints(this.value)">
        </div>

      </div>
    </div>
  `;
document.getElementById("app").innerHTML = html;
updateDashboard(complaints);
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
function runAI() {
  let desc = document.getElementById("desc").value;
  let file = document.getElementById("imageInput").files[0];

  if (!desc && !file) {
    alert("Please enter description or upload image");
    return;
  }

  let ai = classify(desc);

  // IMAGE PREVIEW
  if (file) {
    let reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById("preview").innerHTML =
        `<img src="${e.target.result}" width="100%" style="border-radius:10px; margin-top:10px;">`;
    };
    reader.readAsDataURL(file);
  }

  document.getElementById("result").innerHTML = `
    <h3>AI Analysis Result</h3>
    <p><strong>Issue Type:</strong> ${ai.type}</p>
    <p><strong>Department:</strong> ${ai.dept}</p>
    <p><strong>Priority:</strong> ${ai.priority}</p>
  `;
}
function submitIssue() {
  let desc = document.getElementById("desc").value;

  if (!desc) {
    alert("Please enter issue description");
    return;
  }

  let ai = classify(desc);

  let newItem = {
    id: "CMP-" + (complaints.length + 1),
    issue_type: ai.type,
    title: desc,
    panchayat: "Tambaram",
    department: ai.dept,
    priority: ai.priority,
    status: "Submitted",
    location: { lat: Math.random()*100, lng: Math.random()*100 }
  };

  complaints.push(newItem);
  save();

  alert("✅ Issue submitted with AI classification!");
  renderDashboard();
}
function renderMap(data) {
  let grid = document.getElementById("mapGrid");

  let grouped = {};

  // GROUP BY PANCHAYAT
  data.forEach(c => {
    grouped[c.panchayat] = (grouped[c.panchayat] || 0) + 1;
  });

  let html = "";

  for (let area in grouped) {
    let count = grouped[area];

    let color = "green";
    if (count > 2) color = "orange";
    if (count > 4) color = "red";

    html += `
      <div class="map-cell" style="background:${color}">
        ${area} <br> ${count}
      </div>
    `;
  }

  grid.innerHTML = html;
}
function updateDashboard(data) {

  // COUNTS
  document.getElementById("total").innerText = data.length;
  document.getElementById("pending").innerText =
    data.filter(c => c.status === "Submitted").length;
  document.getElementById("resolved").innerText =
    data.filter(c => c.status === "Resolved").length;

  // DEPARTMENT
  let dept = {};
  data.forEach(c => {
    dept[c.department] = (dept[c.department] || 0) + 1;
  });

  let deptHTML = "";
  for (let d in dept) {
    deptHTML += `<p>${d}: ${dept[d]}</p>`;
  }
  document.getElementById("deptStats").innerHTML = deptHTML;

  // LIST
  let listHTML = "";
  data.forEach(c => {
    listHTML += `
      <div class="dash-item">
        <div>
          <strong>${c.title}</strong><br>
          ${c.department} | ${c.priority} | ${c.status}
        </div>
        <button onclick="resolve('${c.id}')">Resolve</button>
      </div>
    `;
  });
  document.getElementById("complaintList").innerHTML = listHTML;

  // MAP
  renderMap(data);
}
function filterPanchayat(value) {
  if (value === "all") {
    updateDashboard(complaints);
  } else {
    let filtered = complaints.filter(c => c.panchayat === value);
    updateDashboard(filtered);
  }
}
function searchComplaints(value) {
  let filtered = complaints.filter(c =>
    c.title.toLowerCase().includes(value.toLowerCase())
  );
  updateDashboard(filtered);
}
<canvas id="lineChart"></canvas>
<canvas id="pieChart"></canvas>
function renderCharts() {

  new Chart(document.getElementById("lineChart"), {
    type: 'line',
    data: {
      labels: ["Jan","Feb","Mar","Apr"],
      datasets: [
        { label: "Reports", data: [10,20,30,40], borderColor: "blue" },
        { label: "Resolved", data: [5,15,25,35], borderColor: "green" }
      ]
    }
  });

  new Chart(document.getElementById("pieChart"), {
    type: 'pie',
    data: {
      labels: ["Water","Electricity","Sanitation"],
      datasets: [{
        data: [10,5,8],
        backgroundColor: ["blue","yellow","green"]
      }]
    }
  });
}

