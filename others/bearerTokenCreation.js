require('dotenv').config();

let { CREDENTIALS_URL, CREDENDIALS_USER, CREDENTIALS_PASS } = process.env

const url = CREDENTIALS_URL;
const data = {
    username: CREDENDIALS_USER,
    password: CREDENTIALS_PASS
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
