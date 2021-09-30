
function uniqueQuizCode(){
    return (Math.floor(100000 + Math.random() * 900000));
}


function uniqueStudentCode(studName){
    var code = Math.floor(100000 + Math.random() * 900000);
    var uniqueStud = studName + code;
    return uniqueStud;
}

function timeToString(time){
    const hours = time.slice(0, 2);
    const minutes = time.slice(3);
    if(hours === "00"){
        return (12 + ":" + minutes + " AM")
    }
    else if(hours === "12"){
        return (time + " PM");
    }
    else if(hours > 12){
        return (hours - 12 + ":" + minutes + " PM");
    } else{
        return time + " AM";
    }
}

function getExactDate(quizdate){
    const d = new Date(quizdate);
    const day = d.getDay();
    const month = d.getMonth();
    var monthName = "";
    const date = d.getDate();
    const year = d.getFullYear();
    if(month === 0){
        monthName = "Jan";
    }
    else if(month === 1){
        monthName = "Feb";
    }
    else if(month === 2){
        monthName = "Mar";
    }
    else if(month === 3){
        monthName = "Apr";
    }
    else if(month === 4){
        monthName = "May";
    }
    else if(month === 5){
        monthName = "Jun";
    }
    else if(month === 6){
        monthName = "Jul";
    }
    else if(month === 7){
        monthName = "Aug";
    }
    else if(month === 8){
        monthName = "Sep";
    }
    else if(month === 9){
        monthName = "Oct";
    }
    else if(month === 10){
        monthName = "Nov";
    }
    else if(month === 11){
        monthName = "Dec";
    }
    else{
        monthName="?";
    }

    var dayName = "";
    if(day === 1){
        dayName = "Monday";
    }
    else if(day === 2){
        dayName = "Tuesday";
    }
    else if(day === 3){
        dayName = "Wednesday";
    }
    else if(day === 4){
        dayName = "Thursday";
    }
    else if(day === 5){
        dayName = "Friday";
    }
    else if(day === 6){
        dayName = "Saturday";
    }
    else if(day === 0){
        dayName = "Sunday"
    }
    else{
        dayName = "?";
    }
    var exactDateString = dayName + "," + monthName + " " + date + ", " + year;
    
    return exactDateString;
}

function sortStudentsByPoints(obj){
    var student_map = new Map();
    for(k = 0; k < obj.length; k++){
        
        var points;
        if(obj[k].score){
            points = obj[k].score;
        } else {
            points = 0;
        }
        student_map.set(obj[k].studName, points);
    }


    student_map[Symbol.iterator] = function* () {
        yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
    }
     
    
    return student_map;
}

module.exports = {uniqueQuizCode, timeToString, getExactDate, uniqueStudentCode, sortStudentsByPoints };


