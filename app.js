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
  document.getElementById("app").innerHTML = `
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
          <h2>Admin Dashboard</h2>
          <button onclick="renderHome()">Back</button>
        </div>

        <div class="dashboard-stats">
          <div class="dash-card">
            <h3>${complaints.length}</h3>
            <p>Total Complaints</p>
          </div>
          <div class="dash-card">
            <h3>${complaints.filter(c => c.status === "Submitted").length}</h3>
            <p>Pending</p>
          </div>
          <div class="dash-card">
            <h3>${complaints.filter(c => c.status === "Resolved").length}</h3>
            <p>Resolved</p>
          </div>
        </div>

        <div class="dashboard-list">
  `;

  complaints.forEach(c => {
    html += `
      <div class="dash-item">
        <div>
          <strong>${c.title}</strong><br>
          <span>${c.department} | ${c.priority} | ${c.status}</span><br>
          <span>${c.panchayat}</span>
        </div>
        <button onclick="resolve('${c.id}')">Resolve</button>
      </div>
    `;
  });

  html += `
        </div>
      </div>
    </div>
  `;

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
    status: "Submitted"
  };

  complaints.push(newItem);
  save();

  alert("✅ Issue submitted with AI classification!");
  renderDashboard();
}
