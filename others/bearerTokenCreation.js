let {credentials} = require('../myvars')

const url = `https://${credentials.dns}/api/auth/login`;
const data = {
    username: credentials.user,
    password: credentials.pass
};

fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => console.log(data.token))
.catch(error => console.error(error));
