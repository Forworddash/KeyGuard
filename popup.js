document.addEventListener('DOMContentLoaded', function () {
  const authSection = document.getElementById('auth-section');
  const passwordManagerSection = document.getElementById('password-manager-section');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const registerBtn = document.getElementById('register');
  const loginBtn = document.getElementById('login');
  const passwordList = document.getElementById('password-list');
  const addPasswordBtn = document.getElementById('add-password');

  registerBtn.addEventListener('click', () => {
    const username = usernameInput.value;
    const password = passwordInput.value;
    fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    }).then(response => {
      if (response.ok) {
        alert('Registered successfully');
      } else {
        alert('Registration failed');
      }
    });
  });

  loginBtn.addEventListener('click', () => {
    const username = usernameInput.value;
    const password = passwordInput.value;
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    }).then(response => response.json())
      .then(data => {
        if (data.token) {
          chrome.storage.sync.set({ token: data.token }, () => {
            showPasswordManager();
          });
        } else {
          alert('Login failed');
        }
      });
  });

  addPasswordBtn.addEventListener('click', () => {
    const site = prompt('Enter site name:');
    const password = prompt('Enter password:');
    if (site && password) {
      chrome.storage.sync.get(['passwords'], function(result) {
        const passwords = result.passwords || [];
        passwords.push({ site, password });
        chrome.storage.sync.set({ passwords }, function() {
          displayPasswords(passwords);
        });
      });
    }
  });

  chrome.storage.sync.get(['token'], function(result) {
    if (result.token) {
      showPasswordManager();
    } else {
      authSection.style.display = 'block';
    }
  });

  function showPasswordManager() {
    authSection.style.display = 'none';
    passwordManagerSection.style.display = 'block';
    chrome.storage.sync.get(['passwords'], function(result) {
      const passwords = result.passwords || [];
      displayPasswords(passwords);
    });
  }

  function displayPasswords(passwords) {
    passwordList.innerHTML = '';
    passwords.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'password-item';
      div.textContent = `${item.site}: ${item.password}`;
      passwordList.appendChild(div);
    });
  }
});
