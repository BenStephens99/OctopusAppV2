var date = new Date();

var day = String(date.getDate()).padStart(2, '0');
var month = String(date.getMonth() + 1).padStart(2, '0')
var year = date.getFullYear();

function getFullDate() {
    return year + "-" + month + "-" + day;
}

function getFullDateYesterday(num) {
    date = new Date();
    date.setDate(date.getDate() - num)
    var lastWeekDate = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0');
    return lastWeekDate + "T00:00:00";
}

function getFullLastWeek(num) {
    date = new Date();
    date.setDate(date.getDate() - (7 * num))
    var lastWeekDate = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0');
    return lastWeekDate + "T00:00:00Z";
}

function getFullDateLastMonth(num) {
    date = new Date();
    date.setMonth(date.getMonth() - num)
    var dateLastMonth = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0');
    return dateLastMonth + "T00:00:00Z";
}

function getFullDateLastYear(num) {
    date = new Date();
    date.setFullYear(date.getFullYear() - num)
    var fullDateLastYear = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0');
    return fullDateLastYear + "T00:00:00Z";
}

function getFirstDateLastMonth(num) {
    date = new Date();
    date.setDate(1)
    date.setMonth(date.getMonth() - num)
    var firstDateLastMonth = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0');
    return firstDateLastMonth + "T00:00:00Z";
}

function getFirstDateLastYear(num) {
    date = new Date();
    date.setDate(1);
    date.setMonth(0);
    date.setFullYear(date.getFullYear() - num)
    var firstDateLastMonth = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0');
    return firstDateLastMonth + "T00:00:00Z";
}

function daysInMonth(month) {
    const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] 
    return days[month-1];
}

function nameOfMonth(month) {
    const days = ["January", "February", "March", "April",
     "May", "June", "July", "August", "September", "October", "November", "December"] 
    return days[month-1];
}

const live = {
    from: getFullDateYesterday(0),
    group: "",
}

const hourly = {
    from: getFullDateYesterday(1),
    group: "hour",
}

const daily = {
    from: getFullLastWeek(1),
    group: "day",
}

const weekly = {
    from: getFullDateLastMonth(2),
    group: "week",
}

const monthly = {
    from: getFullDateLastYear(1),
    group: "month",
}

const quarterly = {
    from: "",
    group: "quarter"
}