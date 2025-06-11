// Matrix Background
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let fontColor = "#33ff33";
let bgFade = "rgba(0,0,0,0.05)";
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);


function drawMatrix() {
  ctx.fillStyle = bgFade;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = fontColor;
  ctx.font = fontSize + "px monospace";
  for (let i = 0; i < drops.length; i++) {
    const char = Math.random() > 0.5 ? '0' : '1';
    ctx.fillText(char, i * fontSize, drops[i] * fontSize);
    drops[i] = (drops[i] * fontSize > canvas.height || Math.random() > 0.95) ? 0 : drops[i] + 1;
  }
}
setInterval(drawMatrix, 50);
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Theme toggle
document.getElementById('themeToggle').onclick = () => {
  const isLight = document.body.classList.toggle('light');
  fontColor = isLight ? "#111" : "#33ff33";
  bgFade = isLight ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
};

// ASCII Banner
document.getElementById("asciiName").textContent = `
MANOJ KUMAR V K
`;

// Projects
const projects = [
  { title: "CyberScan", desc: "Python port scanner", image: "assets/cyberscan.png", link: "#" },
  { title: "PhishDetector", desc: "ML phishing detector", image: "assets/phishdetector.png", link: "#" },
  { title: "CTF Tracker", desc: "Capture-the-flag tracker", image: "assets/ctf.png", link: "#" },
  { title: "LogParser", desc: "Security log analysis", image: "assets/logparser.png", link: "#" }
];
const container = document.getElementById("projectContainer");
projects.forEach(p => {
  const card = document.createElement("div");
  card.className = "project-card fade-in";
  card.innerHTML = `
    <img src="${p.image}" />
    <div class="info">
      <h4>${p.title}</h4>
      <p>${p.desc}</p>
      <a href="${p.link}" target="_blank">GitHub</a>
    </div>`;
  card.onclick = () => openProjectModal(p);
  container.appendChild(card);
});

// Modal logic
function openProjectModal(project) {
  document.getElementById("modalTitle").textContent = project.title;
  document.getElementById("modalDesc").textContent = project.desc;
  document.getElementById("modalImage").src = project.image;
  document.getElementById("modalLink").href = project.link;
  document.getElementById("modal").style.display = "block";
}
function closeModal(id) {
  if (id) document.getElementById(id).style.display = "none";
  else document.getElementById("modal").style.display = "none";
}

// Project counter
let counter = 0;
const countEl = document.getElementById("projectCounter");
const interval = setInterval(() => {
  countEl.textContent = ++counter;
  if (counter >= projects.length) clearInterval(interval);
}, 100);

// Fade-in animation
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.1 });

document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

const glitchSound = document.getElementById('glitchSound');

function playGlitchSound() {
    glitchSound.currentTime = 0;
    glitchSound.play().catch(() => { });
    setTimeout(() => {
        glitchSound.pause();
        glitchSound.currentTime = 0;
    }, 1500); // Limit to 1.5 seconds
}

// Wait until user interacts before enabling sound-on-hover
let glitchReady = false;

document.addEventListener('click', () => {
    if (!glitchReady) {
        glitchReady = true;
        const glitchTargets = [
            document.getElementById('asciiName'),
            ...document.querySelectorAll('.glitch-title')
        ];
        glitchTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (glitchReady) playGlitchSound();
            });
        });
    }
});

document.getElementById('themeToggle').onclick = () => {
    const isLight = document.body.classList.toggle('light');
    fontColor = isLight ? "#000000" : "#33ff33";
    bgFade = isLight ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
};

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = "block";
    }
}

function closeModal(id) {
    if (id) document.getElementById(id).style.display = "none";
    else document.getElementById("modal").style.display = "none";
}
