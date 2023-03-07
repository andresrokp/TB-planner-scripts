const url = 'https://.com/api/auth/login';
const data = {
    username: '',
    password: ''
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
