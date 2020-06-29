function initializeParse() {
  Parse.serverURL = 'https://parseapi.back4app.com';
  Parse.initialize('yuRcZi2r0wpaFn2zTIkepiCnLq2Di6fsUOxJsfh2', 'duUFCRrT7hRAWCXUyeh3p8aOqksu6JkuhMX2VkVM');

  Parse.enableEncryptedUser();
  Parse.secret = 'a966c7d2cb9e18c6930798797c195f6d7ebe1a0297a35efadb1e18b72cfc3cd0';
}


function messenger(element) {
  return (type, message) => {
    document.getElementById(element).innerHTML = '<span class="' + type + '">' + message + '</span>';
  }
}


function hide(...elements) {
  elements.forEach(element => {
    element.classList.add('hidden');

    const form = element.getElementsByTagName('form')[0];
    if (form) {
      form.reset();
    }

    const message = element.getElementsByClassName('message');
    [...message].forEach(element => {
      element.innerHTML = '';
    });
  });
}


function show(...elements) {
  elements.forEach(element => {
    element.classList.remove('hidden');
  });
}


function registerUser() {
  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;

  if (username.trim() === '' || password.trim() === '') {
    registerMessage('error', 'A username and password is required.');
    return;
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
    registerMessage('error', 'The password must contain 8 characters, an uppercase letter, a lowercase letter and a number.');
    return;
  }

  const user = new Parse.User();
  user.set('username', username);
  user.set('password', password);

  user.signUp().then(user => {
    registerMessage('success', 'Created account successfully.');
    statusMessage('', '');

    checkStatus();
  }).catch(err => {
    registerMessage('error', 'An error occurred when creating the account: ' + err);
  });
}


function loginUser() {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  Parse.User.logIn(username, password).then(user => {
    loginMessage('success', 'Logged in successfully.');
    statusMessage('', '');

    checkStatus();
  }).catch(err => {
    loginMessage('error', 'An error occurred when logging in: ' + err);
  });
}


function logoutUser() {
  Parse.User.logOut().then(() => {
    statusMessage('success', 'Logged out successfully.');

    checkStatus();
  }).catch(err => {
    statusMessage('error', 'An error occurred when logging out: ' + err);
  });
}


function deleteUser() {
  account.destroy().then(() => {
    statusMessage('success', 'Account deleted successfully.');

    checkStatus();
  }).catch(err => {
    statusMessage('error', 'An error occurred when deleting your account: ' + err);
  });
}


function updateUser() {
  const username = document.getElementById('updateUsername').value;
  const password = document.getElementById('updatePassword').value;

  if (username.trim() === '' && password.trim() === '') {
    updateMessage('error', 'At least one field must be filled.');
    return;
  } else if (password.trim() !== '' && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password)) {
    updateMessage('error', 'The password must contain 8 characters, an uppercase letter, a lowercase letter and a number.');
    return;
  }

  account.set('username', username);
  account.set('password', password);

  account.save().then(() => {
    updateMessage('success', 'Account updated successfully.');

    checkStatus();
  }).catch(err => {
    updateMessage('error', 'An error occurred when updating your account: ' + err);
  });
}


function checkStatus() {
  let user = Parse.User.current();

  if (user) {
    loginStatus('', 'You are logged in as <b>' + user.attributes.username + '</b>.');

    hide(loginForm, registerForm);
    show(logout, del, updateForm);

    account = user;
  } else {
    loginStatus('', 'You are not logged in.');

    hide(logout, del, updateForm);
    show(loginForm, registerForm);

    account = null;
  }
}



initializeParse();

const logout = document.getElementById('logout');
const del = document.getElementById('delete');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const updateForm = document.getElementById('updateForm');

document.getElementById('register').addEventListener('click', registerUser);
document.getElementById('login').addEventListener('click', loginUser);
logout.addEventListener('click', logoutUser);
del.addEventListener('click', deleteUser);
document.getElementById('update').addEventListener('click', updateUser);

const registerMessage = messenger('registerMessage');
const loginMessage = messenger('loginMessage');
const statusMessage = messenger('statusMessage');
const loginStatus = messenger('loginStatus');
const updateMessage= messenger('updateMessage');

let account;

checkStatus();