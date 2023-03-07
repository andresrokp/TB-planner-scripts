const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun","Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
var days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

let date = new Date(value);
let year = date.getFullYear();
let month = monthNames[date.getMonth()];
let day = date.getDate();
let dayName = days[date.getDay()];
let hour = date.getHours();
let minutes = date.getMinutes();

return `${dayName} ${day} / ${hour}:${minutes}`;