function fechaBacana(value){
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dic"];
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    let date = new Date(value);
    let year = date.getFullYear();
    let month = monthNames[date.getMonth()];
    let day = date.getDate();
    let dayName = days[date.getDay()];
    let hour = date.getHours();
    let minutes = date.getMinutes();
    minutes = minutes <= 9 ? `0${minutes}`: minutes;

    return `${dayName} ${day} ${month} ${hour}:${minutes}`;
}