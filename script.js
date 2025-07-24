const app_id = 86139;
const redirect_uri = window.location.origin + window.location.pathname;

const loginBtn = document.getElementById('loginBtn');
const userInfo = document.getElementById('userInfo');
const userName = document.getElementById('userName');
const balance = document.getElementById('balance');

loginBtn.addEventListener('click', () => {
  const url = `https://oauth.deriv.com/oauth2/authorize?app_id=${app_id}&l=EN&redirect_uri=${redirect_uri}`;
  window.location.href = url;
});

function getAuthTokenFromUrl() {
  const urlParams = new URLSearchParams(window.location.hash.substr(1));
  return urlParams.get('token');
}

async function fetchUserDetails(token) {
  const ws = new WebSocket('wss://ws.derivws.com/websockets/v3');

  ws.onopen = () => {
    ws.send(JSON.stringify({ authorize: token }));
  };

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);

    if (data.msg_type === 'authorize') {
      userName.textContent = data.authorize.loginid;
      ws.send(JSON.stringify({ balance: 1, subscribe: 1 }));
    }

    if (data.msg_type === 'balance') {
      balance.textContent = data.balance.balance.toFixed(2);
      userInfo.style.display = 'block';
      loginBtn.style.display = 'none';
    }
  };
}

const token = getAuthTokenFromUrl();
if (token) {
  fetchUserDetails(token);
}
