document.addEventListener('DOMContentLoaded', function () {
    const passwordList = document.getElementById('password-list');
    const addPasswordBtn = document.getElementById('add-password');
  
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
  
    chrome.storage.sync.get(['passwords'], function(result) {
      const passwords = result.passwords || [];
      displayPasswords(passwords);
    });
  
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
  