var date = new Date();

var day = String(date.getDate()).padStart(2, '0');
var month = String(date.getMonth() + 1).padStart(2, '0')
var year = date.getFullYear();

const oneDay = 24 * 60 * 60 * 1000;

const testDate = "2022-01-01T00:00:00Z";

function getFullDate() {
    return year + "-" + month + "-" + day;
}
function getFullDateYesterday(num) {
    date = new Date();
    date.setDate(date.getDate() - num)
    return convertToISO(date);
}
function getFullDateLastWeek(num) {
    date = new Date();
    date.setDate(date.getDate() - (7 * num))
    return convertToISO(date);
}
function getFullDateLastMonth(num) {
    date = new Date();
    date.setMonth(date.getMonth() - num)
    return convertToISO(date);
}
function getFullDateLastYear(num) {
    date = new Date();
    date.setFullYear(date.getFullYear() - num)
    return convertToISO(date);
}
function getFirstDateLastMonth(num) {
    date = new Date();
    date.setDate(1)
    date.setMonth(date.getMonth() - num)
    return convertToISO(date);
}
function getSecondDateLastMonth(num) {
    date = new Date();
    date.setDate(2)
    date.setMonth(date.getMonth() - num)
    return convertToISO(date);
}
function getFirstDateLastYear(num) {
    date = new Date();
    date.setDate(1);
    date.setMonth(0);
    date.setFullYear(date.getFullYear() - num)
    return convertToISO(date);
}
function getPreviousMonth(prevDate) {
    date = new Date();
    date.setDate(getDayFromISO(prevDate));
    date.setMonth(getMonthFromISO(prevDate));
    date.setFullYear(getYearFromISO(prevDate));

    date.setMonth(date.getMonth() - 1);

    return convertToISO(date).slice(0, 7);
}
function getDaysSince(date) {
    todaysDate = new Date();
    dateSince = new Date();
    dateSince.setDate(getDayFromISO(date));
    dateSince.setMonth(getMonthFromISO(date));
    dateSince.setFullYear(getYearFromISO(date));
    return Math.round(Math.abs((dateSince - todaysDate) / oneDay) + 1);;
}
function getMonthsSince(date) {
    todaysDate = new Date();
    dateSince = new Date();
    dateSince.setDate(getDayFromISO(date));
    dateSince.setMonth(getMonthFromISO(date));
    dateSince.setFullYear(getYearFromISO(date));

    var difference = (getYearFromISO(convertToISO(todaysDate)) - getYearFromISO(convertToISO(dateSince))) * 12;
    difference += (getMonthFromISO(convertToISO(todaysDate)) - getMonthFromISO(convertToISO(dateSince)));

    return difference + 1;
}
function getNextDay(date) {
    nextDay = new Date();

    nextDay.setMonth(getMonthFromISO(date));
    nextDay.setDate(getDayFromISO(date));
    nextDay.setFullYear(getYearFromISO(date));
    nextDay.setDate(nextDay.getDate() + 1)

    return convertToISO(nextDay);
}
function getFirstDateOfLastXMonths(x) {
    let datesToReturn = [];
    for (var i = 0; i < x; i++) {
        datesToReturn.push(getFirstDateLastMonth(i));
    }
    return datesToReturn;
}
function getTimeFromISO(date) {
    return parseInt(date.slice(11, 16))
}
function getDayFromISO(date) {
    return parseInt(date.slice(8, 10))
}
function getMonthFromISO(date) {
    return parseInt(date.slice(5, 7) - 1)
}
function getYearFromISO(date) {
    return parseInt(date.slice(0, 4))
}
function convertToISO(date) {
    var ISODate = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0');
    return ISODate + "T00:00:00Z";
}

function monthYearToISOFrom(m,y) {
    dat = new Date ();
    date.setDate(1);
    date.setMonth(m);
    date.setFullYear(y);
    return convertToISO(date);
}

function monthYearToISOTo(m,y) {
    dat = new Date ();
    date.setMonth(m);
    date.setDate(daysInMonth(m));
    date.setFullYear(y);
    return convertToISO(date);
}

function daysInMonth(month) {
    const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    return days[month]
}
function nameOfMonth(month) {
    const days = ["January", "February", "March", "April",
        "May", "June", "July", "August", "September", "October", "November", "December"]
    return days[month]
}
function nameOfTime(time) {
    const times = ["12am", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am",
        "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm",
        "10pm", "11pm"]

    if (time === 24) {
        return "12am";
    }
    return times[time];
}

const yesterday = {
    from: getFullDateYesterday(1),
    group: "hour",
}
const past7Days = {
    from: getFullDateLastWeek(1),
    group: "day",
}
const thisMonth = {
    from: getFirstDateLastMonth(0),
    group: "day",
}
const past8Weeks = {
    from: getFullDateLastWeek(8),
    group: "week",
}
const past6Months = {
    from: getFirstDateLastMonth(6),
    group: "month",
}
const pastYear = {
    from: getFullDateLastYear(1),
    group: "month",
}