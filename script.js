const input = document.getElementById('terminal-input');
const output = document.getElementById('output');
const sound = document.getElementById('type-sound');
const body = document.body;

let currentDir = '~';
const history = [];
let historyIndex = -1;
let typingSim = true;

const fileSystem = {
  '~': {
    type: 'dir',
    content: {
      projects: 'file',
      certifications: 'file',
      contact: 'file',
      portfolio: {
        type: 'dir',
        content: {
          resume: 'file'
        }
      }
    }
  }
};

const commands = {
  'cat': (args) => {
    const file = resolvePath(args[0]);
    if (!file || typeof file === 'object') return `cat: ${args[0]}: No such file`;

    switch (args[0]) {
      case 'projects': return projects();
      case 'certifications': return certifications();
      case 'contact': return contact();
      case 'resume': return `<a href="assets/resume.pdf" target="_blank" download>📄 Download Resume</a>`;
      default: return `cat: ${args[0]}: No such file`;
    }
  },

  'ls': () => {
    const dir = resolveDir(currentDir);
    return Object.entries(dir.content).map(([name, val]) => {
      const cls = (typeof val === 'object' && val.type === 'dir') ? 'dir' : 'file';
      return `<span class="${cls}">${name}</span>`;
    }).join('  ');
  },

  'cd': (args) => {
    const path = args[0];
    if (path === '..') {
      if (currentDir !== '~') {
        const parts = currentDir.split('/');
        parts.pop();
        currentDir = parts.join('/') || '~';
        return '';
      }
    } else {
      const dir = resolveDir(currentDir);
      if (dir.content[path] && dir.content[path].type === 'dir') {
        currentDir = currentDir === '~' ? `${currentDir}/${path}` : `${currentDir}/${path}`;
        return '';
      }
      return `cd: no such directory: ${path}`;
    }
    return '';
  },

  'clear': () => {
    output.innerHTML = '';
    return '';
  },

  'help': () => `
Available commands:<br>
- <code>ls</code>, <code>cd [dir]</code>, <code>cat [file]</code><br>
- <code>whoami</code>, <code>uptime</code>, <code>clear</code>, <code>help</code>
`,

  'whoami': () => `
<strong>VK Manojkumar</strong><br>
Cybersecurity enthusiast<br>
I aim to leverage my passion for cybersecurity and software engineering to build secure, scalable systems that protect data and empower users.<br>
Email: <a href="mailto:vkmanojk@gmail.com" target="_blank">vkmanojk@example.com</a><br>
GitHub: <a href="https://github.com/vkmanojk" target="_blank">vkmanojk</a><br>
LinkedIn: <a href="https://linkedin.com/in/vkmanojk" target="_blank">vkmanojk</a>
`,

  'uptime': () => {
    const secs = Math.floor(performance.now() / 1000);
    return `System uptime: ${secs} seconds`;
  },

  };

function projects() {
  return `<strong>CyberScan</strong> – Port scanner<br><a href="https://github.com/vkmanojk/cyberscan" target="_blank">[GitHub]</a><br>
<strong>PhishDetector</strong> – ML phishing detection<br><a href="https://github.com/vkmanojk/phish-detector" target="_blank">[GitHub]</a>`;
}

function certifications() {
  return `<strong>CEH</strong> – <a href="https://verify.eccouncil.org/certificate/CEH-123456" target="_blank">[Verify]</a><br>
<strong>Google Cybersecurity Cert</strong> – <a href="https://coursera.org/verify/google-cyber-cert" target="_blank">[Verify]</a>`;
}

function contact() {
  return `Email: <a href="mailto:vkmanojk@example.com" target="_blank">vkmanojk@example.com</a><br>
GitHub: <a href="https://github.com/vkmanojk" target="_blank">vkmanojk</a><br>
LinkedIn: <a href="https://linkedin.com/in/vkmanojk" target="_blank">vkmanojk</a>`;
}

function resolveDir(path) {
  let dir = fileSystem['~'];
  const parts = path.split('/').slice(1);
  for (const part of parts) {
    dir = dir.content[part];
  }
  return dir;
}

function resolvePath(name) {
  const dir = resolveDir(currentDir);
  return dir.content[name];
}

function toggleTheme() {
  body.classList.toggle('light');
  body.classList.toggle('dark');
}

input.addEventListener('keydown', (e) => {
  if (typingSim) {
    typingSim = false;
    input.value = '';
  }

  if (e.key === 'Enter') {
    const raw = input.value.trim();
    const args = raw.split(' ');
    const cmd = args.shift();

    history.push(raw);
    historyIndex = history.length;

    const promptLine = document.createElement('div');
    promptLine.className = 'output-line';
    promptLine.innerHTML = `<span class="prompt">vkmanojk@portfolio:${currentDir}$</span> ${raw}`;
    output.appendChild(promptLine);

    let response = commands[cmd] ? commands[cmd](args) : `Error 404: Command not found: <code>${cmd}</code>. Type <code>help</code>`;
    const resLine = document.createElement('div');
    resLine.className = 'output-line';
    resLine.innerHTML = response;
    output.appendChild(resLine);

    input.value = '';

    if (output.scrollHeight > window.innerHeight * 0.85) {
      const clearLine = document.createElement('div');
      clearLine.className = 'output-line';
      clearLine.innerHTML = commands.clear();
      output.appendChild(clearLine);
    }

    window.scrollTo(0, document.body.scrollHeight);
  }

  if (e.key === 'ArrowUp') {
    if (historyIndex > 0) {
      historyIndex--;
      input.value = history[historyIndex];
    }
  }

  if (e.key === 'ArrowDown') {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      input.value = history[historyIndex];
    } else {
      input.value = '';
    }
  }

  if (e.key === 'Tab') {
    e.preventDefault();
    const val = input.value.trim();
    const tokens = val.split(' ');
    const base = tokens[0];
    const partial = tokens[1] || '';

    let suggestions = [];

    if (base === 'cd' || base === 'cat') {
      const dir = resolveDir(currentDir);
      suggestions = Object.keys(dir.content).filter(k => k.startsWith(partial));
    } else {
      suggestions = Object.keys(commands).filter(c => c.startsWith(base));
    }

    if (suggestions.length === 1) {
      input.value = base + ' ' + suggestions[0];
    } else if (suggestions.length > 1) {
      const line = document.createElement('div');
      line.className = 'output-line';
      line.innerHTML = suggestions.join('&nbsp;&nbsp;');
      output.appendChild(line);
    }
  }

  if (sound && e.key.length === 1) {
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }
});

// Typing simulation: show "help" as if being typed
window.onload = () => {
  input.value = 'help';
  typingSim = true;
  const clearSim = () => {
    if (typingSim) {
      input.value = '';
      typingSim = false;
    }
  };
  setTimeout(clearSim, 3000);
};

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const letters = "01";
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#33ff33";
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = letters[Math.floor(Math.random() * letters.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    drops[i] = (drops[i] * fontSize > canvas.height || Math.random() > 0.95) ? 0 : drops[i] + 1;
  }
}
setInterval(drawMatrix, 50);
