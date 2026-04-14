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

    <div class="nav">
      <h2>Enviryx</h2>
      <div>
        <button onclick="renderHome()">Home</button>
        <button onclick="renderDashboard()">Dashboard</button>
      </div>
    </div>

    <div class="hero-content">
      <h1>
        Predicting & <span>Preventing</span> Civic Issues
      </h1>

      <p>
        AI-powered civic infrastructure system to detect, track and resolve issues faster.
      </p>

      <div class="actions">
        <button onclick="login('citizen')">Citizen Login</button>
        <button onclick="login('admin')">Admin Login</button>
      </div>

      <div class="voice">
        <button onclick="toggleVoice()">🎤</button>
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
