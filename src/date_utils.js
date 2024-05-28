


export function obtainDateTime() {
    let date = new Date().toLocaleString('es-ES').replace(",", "")
    const [day, month, yearTime] = date.split('/');
    const [year, time] = yearTime.split(' ');
    return `${year}/${month}/${day} ${time}`;
}


export function formatDate(date_to_format) {
    let date = date_to_format.toLocaleString('es-ES').replace(",", "")
    const [day, month, yearTime] = date.split('/');
    const [year, time] = yearTime.split(' ');
    return `${year}/${month}/${day} ${time}`;
}