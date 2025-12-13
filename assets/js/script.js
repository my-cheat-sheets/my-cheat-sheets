document.addEventListener('DOMContentLoaded', () => {
  const content = document.getElementById('content');
  const themeToggle = document.getElementById('theme-toggle');
  const menuToggle = document.getElementById('mobile-menu');
  const navMenu = document.querySelector('.nav-menu');

  // ===== DROPDOWN MENU HANDLING =====
  // Handle all dropdown menus
  const dropdowns = document.querySelectorAll('.dropdown');
  
  dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('a');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    if (trigger && menu) {
      // Toggle dropdown on click
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Close all other dropdowns
        dropdowns.forEach(otherDropdown => {
          if (otherDropdown !== dropdown) {
            otherDropdown.querySelector('.dropdown-menu').classList.remove('show');
          }
        });
        
        // Toggle current dropdown
        menu.classList.toggle('show');
      });
    }
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      dropdowns.forEach(dropdown => {
        dropdown.querySelector('.dropdown-menu').classList.remove('show');
      });
    }
  });
  
  // Close dropdowns on menu item click
  dropdowns.forEach(dropdown => {
    const items = dropdown.querySelectorAll('.dropdown-menu a');
    items.forEach(item => {
      item.addEventListener('click', () => {
        dropdown.querySelector('.dropdown-menu').classList.remove('show');
      });
    });
  });

  // ===== CHEATSHEET LOADING =====
  // Function to load a cheatsheet by name
  function loadCheat(name, category) {
    // category could be 'languages', 'databases', 'frameworks'
    const file = `cheats/${category}/${name}.html`;
    fetch(file)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP status ${res.status}`);
        return res.text();
      })
      .then(html => {
        content.innerHTML = html;
        addCopyButtons();
      })
      .catch(err => {
        content.innerHTML = `<p style="color:red">Could not load cheatsheet: ${name} (${category})</p>`;
        console.error('Fetch error for file', file, err);
      });
  }

  // Parse hash parameters
  function parseHashParams() {
    // Remove leading "#"
    const hash = window.location.hash.substring(1);
    // Example hash: "cheat=postgresql&category=databases"
    const params = {};
    hash.split('&').forEach(part => {
      const [key, val] = part.split('=');
      if (!key) return;
      params[key] = decodeURIComponent(val || '');
    });
    return params;
  }

  // On hash change or initial load, check if cheat param exists
  function handleHash() {
    const params = parseHashParams();
    if (params.cheat) {
      const name = params.cheat;
      const category = params.category || 'languages'; // default category
      loadCheat(name, category);
    } else {
      // default home
      content.innerHTML = `
        <div class="welcome">
          <h1>Welcome to Cheatsheets Hub</h1>
          <p>Select a language from the menu to view cheatsheet.</p>
        </div>`;
    }
  }

  window.addEventListener('hashchange', handleHash);
  handleHash(); // run on first load

  // ===== THEME TOGGLE =====
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
  }
  
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const newTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  });

  // ===== COPY BUTTON LOGIC =====
  function addCopyButtons() {
    document.querySelectorAll('pre').forEach(pre => {
      if (pre.querySelector('.copy-button')) return;
      const btn = document.createElement('button');
      btn.className = 'copy-button';
      btn.textContent = 'Copy';
      btn.addEventListener('click', () => {
        const code = pre.innerText;
        navigator.clipboard.writeText(code).then(() => {
          btn.textContent = 'Copied!';
          setTimeout(() => btn.textContent = 'Copy', 2000);
        });
      });
      pre.appendChild(btn);
    });
  }

  // ===== MOBILE MENU TOGGLE =====
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show');
  });
});
