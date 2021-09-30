const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const app = express();
const bcrypt = require("bcrypt");
const useragent = require("express-useragent");
const saltRounds = 10;
const moduleFile = require(__dirname + "/public/index1.js");

app.use(express.static("public"));
app.use(useragent.express());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({secret:"73gf83fg34fg4hffb0bx", resave: false, saveUninitialized: true}));

// mongoose.connect("mongodb+srv://pvaibzDB:st1llth1nk1ng@cluster0.gsiva.mongodb.net/quizmaniaDB?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connect("mongodb://localhost:27017/quizmaniaDB", { useNewUrlParser: true, useUnifiedTopology: true});

// Question Schema
const questionSchema = new mongoose.Schema({
    quesName: String,
    choice1: String,
    choice2: String,
    choice3: String,
    choice4: String,
    correctCH: String
});
// Student Schema
const studentSchema = new mongoose.Schema({
    studName: String,
    score: Number
});

// Quiz Info Schema
const quizInfoSchema = new mongoose.Schema({
    quiz_id: Number,
    topicName: String,
    topicDesc: String,
    quizDate: String,
    quizTime: String,
    points: Number,
    ansTime: Number,
    reviewtime: Number,
    isStarted: {
        type: Boolean,
        default: false
    },
    startPlay: {
        type: Boolean,
        default: false
    },
    ques: [questionSchema],
    students: [studentSchema]
});


// User/admin Schema
const userSchema = new mongoose.Schema({
    email: String,
    fullName: String,
    password: String,
    quiz: [quizInfoSchema]
});

// User Model or collection --
// -- a new collection will be created in 'quizmaniaDB' database as 'user'
const User = mongoose.model("User", userSchema);


app.get("/", function(req, res){
    if(req.session.user){
        res.redirect("/dashboard")
    }
    else{
        res.render("home");
    }
});

app.post("/", function(req, res){
    
    res.redirect("/playscreen?student=" + req.body.qCode + "");
});

app.get("/login", function(req, res){
    if(req.session.user){
        res.redirect("/dashboard");
    }
    else{
        res.render("login");
    }
});

app.get("/signup", function(req, res){
    res.render("signup");
});

let userD = {
    email: String,
    fullName: String,
};

app.post("/login", function(req, res){
    const username = req.body.login_mail;
    const password = req.body.login_password;
    
    if(username && password){
        User.findOne({email: username}, function(err, foundUser){
            if(err){
                console.log(err);
            } else {
                if(foundUser) {
                    bcrypt.compare(password, foundUser.password, function(err, result){
                        if(result === true){
                            userD.fullName = foundUser.fullName;
                            userD.email = foundUser.email;
                           
                            req.session.user = userD;
                            res.redirect("/");
                        }
                        else{
                            res.redirect("/login");
                        }
                    });
                } else{
                    res.redirect("/login");
                }
            }
        });
    } else{
        res.redirect("/login");
    }
    
});

app.get("/dashboard", function(req, res){
    if(req.session.user){
        
        User.findOne(userD, function(err, result){
            if(!err){
                res.render("user", {userDetails: result});
            } 
        });
    }
    else{
        res.redirect("/")
    } 
});

app.post("/signup", function(req, res){
    if(req.body.password && req.body.e_mail && req.body.full_name){
        bcrypt.hash(req.body.password, saltRounds, function(err, hash){
            const newUser = new User({
                email: req.body.e_mail,
                fullName: req.body.full_name,
                password: hash
            });
            newUser.save(function(err){
                if(err){
                    console.log(err);
                } else {
                    res.redirect("/login");
                }
            });
        });
    } else{
       res.redirect("/signup");
    }
});


app.get("/dashboard/Create", function(req, res){
    if(req.session.user){
        res.render("create");
    }
    else{
        res.redirect("/")
    }
});

let authQuesPage = false;
let QUIZ_ID;
app.post("/dashboard/Create", function(req, res){

    QUIZ_ID = moduleFile.uniqueQuizCode();
    
    User.findOneAndUpdate(userD, 
    {$push: {
        quiz: {
            quiz_id: QUIZ_ID,
            topicName: req.body.quiz_topic,
            topicDesc: req.body.quiz_description,
            quizDate: moduleFile.getExactDate(req.body.quiz_date),
            quizTime: moduleFile.timeToString(req.body.quiz_time),
            points: req.body.points,
            ansTime: req.body.time_perQues,
            reviewtime: req.body.time_reviewPerQues
        }
    }},{useFindAndModify: false},function(err){
        if(err){
            console.log(err);
        } else{
            authQuesPage = true;
            res.redirect("/dashboard/Create/set-questions");
        }
    });

});

app.get("/dashboard/Create/set-questions", function(req, res){
    if(authQuesPage){
        res.render("questionsSet");
    } else {
        res.status(404).send();
    }
});

var quesArr = [];

app.post("/dashboard/Create/set-questions", function(req, res){
    
    const uname = req.session.user.fullName;
    const u_email = req.session.user.email;

    if(Array.isArray(req.body.quiz_topic)){
        
        var totalQues = req.body.quiz_topic.length;
        
        var newQues = totalQues;

        function correctAnsAtIndex(index){
            var count = 1;
            var corrTick;
            for(j = 1; j <= newQues; j++){
                if(req.body['correctAns' + j]){
                        if(index === j - count){
                            corrTick = req.body['correctAns' + j];
                            break;
                        }
                }
                else {
                    newQues++;
                    count++;
                }
            }
            return corrTick;
        }
        
        for(i = 0; i < totalQues; i++){
            var corrCH = correctAnsAtIndex(i);
            var oneQuestion = {
                quesName: req.body.quiz_topic[i],
                choice1: req.body.o1[i],
                choice2: req.body.o2[i],
                choice3: req.body.o3[i],
                choice4: req.body.o4[i],
                correctCH: corrCH
            };

            quesArr.push(oneQuestion);
            
        }
    }
    else {
        
        const oneQuestion = {
                quesName: req.body.quiz_topic,
                choice1: req.body.o1,
                choice2: req.body.o2,
                choice3: req.body.o3,
                choice4: req.body.o4,
                correctCH: req.body.correctAns1
            };

            quesArr.push(oneQuestion);
            
    }

    User.findOneAndUpdate({fullName: uname, email: u_email, "quiz.quiz_id": QUIZ_ID},
            {
                $push: {
                    "quiz.$.ques" : { $each: quesArr}
                }
                },{useFindAndModify: false}, function(err){
                    if(err){
                        console.log(err);
                    }
                    else{
                        res.redirect("/dashboard");
                    }
            });

});

app.get("/dashboard/logout", function(req, res){
    req.session.destroy(function(err){
        if(err){
            res.send(err);
        }
        res.redirect("/");
    })
});

app.post("/dashboard", function(req, res){

    if(req.body.del){
        User.findOneAndUpdate({fullName: req.session.user.fullName, email: req.session.user.email, "quiz.quiz_id": req.body.del}, 
        {
            $pull: {
                "quiz": { "quiz_id": req.body.del}
            }
        },{useFindAndModify: false},
        function(err){
            if(!err){
                res.redirect("/dashboard");
            } else {
                console.log(err);
            }
        });
    } else {
        res.redirect("/dashboard");
    }
});

app.get("/playscreen", function(req, res){

    var quiz__id = req.query.user || req.query.student;
    
    User.findOne({"quiz.quiz_id": quiz__id}, function(err, result){
        let quizD = {};

        if(err){
            res.status(404).send();
        } else{
            if(result){
                for(i = 0; i < result.quiz.length; i++){
                    if(result.quiz[i].quiz_id === Number(quiz__id)){
                        
                        quizD = result.quiz[i];
                        break;
                    }
                }

                if(req.session.user){
                    if(req.query.user){

                        User.findOneAndUpdate({email: req.session.user.email, fullName: req.session.user.fullName, "quiz.quiz_id": (Number)(req.query.user)}, {"quiz.$.isStarted": true}, {useFindAndModify: false},function(err){
                            if(err)
                                console.log(err);
                            else{
                                
                            }
                        });
                        res.render("playscreen_admin", {userSide: quizD, screenSide: 1});
                    }
                    else{
                        res.redirect("/");
                    }  
                }
                
                if(!req.session.user){
                    if(!req.query.student){
                        res.redirect("/");
                    }
                }

                if(req.query.student){
                    if(quizD.isStarted){

                        if(!req.session.stud_d){
                            res.redirect("/playscreen/student/" + req.query.student);
                        } else {
                           
                            res.render("playscreen_admin", {quizName: quizD.topicName, organizer: result.fullName, userSide: quizD, screenSide: 0});
                        }
                        
                        
                    }else {
                        res.send("Quiz has not started yet");
                    } 
                }else{
                    res.status(404).send();
                }
                
            } else{
                res.status(404).send();
            }
            
        } 
        
    });
         
});



app.get("/playscreen/student/:quizCode", function(req, res){
    var code = (Number)(req.params.quizCode);

    if(req.session.stud_d){
        res.redirect("/playscreen?student=" + req.params.quizCode);
    } else{
        res.render("student_details");
    }
    
});

app.post("/playscreen/student/:quizCode", function(req, res){
    var code = (Number)(req.params.quizCode);
    if(req.body.studname){
        var studentName = moduleFile.uniqueStudentCode(req.body.studname);
        User.findOneAndUpdate({"quiz.quiz_id": code}, {
            $push: {
                "quiz.$.students" : {
                    studName: studentName,
                    score: 0
                    }
            }
        }, {useFindAndModify: false},function(err){
            if(err){
                console.log(err);
            } else {
                req.session.stud_d = studentName;
                res.redirect("/playscreen/?student=" + code + "");
            }
        });
    } else{
        res.redirect("/playscreen/student/" + req.params.quizCode);
    }
    
});

app.get("/api/ury7jbjvdfgwuj3883b-e8hdlbv/:quiZx", function(req, res){

    const quizId = (Number)(req.params.quiZx);
    
    User.findOne({"quiz.quiz_id": quizId}, function(err, result){

        let myQuiz = {};
        if(err){
            console.log(err);
        } else {
            if(result){
                for(i = 0; i < result.quiz.length; i++){
                    if(result.quiz[i].quiz_id === quizId){
                        
                        myQuiz = result.quiz[i];
                        break;
                    }
                }
            }
            
            return res.send(myQuiz);
        }
    });

});

app.post("/startTheQuiz/10sAfter", function(req, res){
    
    User.findOneAndUpdate({"quiz.quiz_id": (Number)(req.query.setStart)},{"quiz.$.startPlay": true}, {useFindAndModify: false}, function(err){
        if(err){
            console.log(err);
        }
    });
});

app.post("/playscreen", function(req, res){

    if(req.session.user){
        if(req.body.qstart){
            
            res.redirect("/playground?user=" + req.body.qstart);
            
        }
        else if(req.body.qstop){

            User.findOneAndUpdate({fullName: req.session.user.fullName, email: req.session.user.email, "quiz.quiz_id": (Number)(req.body.qstop)}, {"quiz.$.isStarted": false, "quiz.$.startPlay": false},{useFindAndModify: false} ,function(err){
                if(err)
                    console.log(err);
                else{
                    res.redirect("/dashboard");
                }   
            });

        } else{
            res.redirect("/");
        }
    } else {
        res.redirect("/");
    }

});

app.get("/playground", function(req, res){

    const quizID = (Number)(req.query.user || req.query.student);

    if(req.session.user || req.session.stud_d){

        User.findOne({"quiz.quiz_id": quizID}, function(err, result){
            let quizDetails = {};
            if(err){
                console.log(err);
            } else{
                if(result){
                    for(i = 0; i < result.quiz.length; i++){
                        if(result.quiz[i].quiz_id === quizID){
                            
                            quizDetails = result.quiz[i];
                            break;
                        }
                    }
                    if(req.session.user){
                        if(req.query.user){
                            res.render("playground", {Quizmania : quizDetails, screenS: 1});
                        }
                    }

                    if(req.session.stud_d){
                        if(req.query.student){
                            res.render("playground", {Quizmania : quizDetails, screenS: 0});
                        }
                    }   
                }
            }
        });
    } else {
        res.status(404).send();
    }
    
});


app.get("/dashboard/:name", function(req, res){
    
    User.findOne({fullName: req.session.user.fullName, email: req.session.user.email, "quiz.quiz_id": req.params.name},function(err, result){
        var quiz = {};

        if(err){
            res.status(404).send();
        } else{
            if(result){
                for(i = 0; i < result.quiz.length; i++){
                    if(result.quiz[i].quiz_id == req.params.name){
                        quiz = result.quiz[i];
                        break;
                    }
                }
                res.render("quiz", {quizinfo: quiz});
            } else{
                res.status(404).send();
            }
            
        }
       
    });

});

app.get("/playground/results/:quiz_ID", function(req, res){
    
    if(req.session.user || req.session.stud_d){
        User.findOne({"quiz.quiz_id": (Number)(req.params.quiz_ID)},function(err, result){
            var QUIZ_DETAILS = {};
            if(err){
                console.log(err);
            } else {
                if(result){

                    for(i = 0; i < result.quiz.length; i++){
                        if(result.quiz[i].quiz_id == req.params.quiz_ID){
                            QUIZ_DETAILS = result.quiz[i];
                            break;
                        }
                    }
                    if(QUIZ_DETAILS.students.length > 0){
                        var sortedStuds = moduleFile.sortStudentsByPoints(QUIZ_DETAILS.students);
                        var totalPoints = (QUIZ_DETAILS.ques.length) * (QUIZ_DETAILS.points);
                        res.render("result", {student_details: sortedStuds, topic: QUIZ_DETAILS.topicName, totalMarks: totalPoints});
                        if(req.session.stud_d){
                            req.session.destroy(function(err){
                                if(err){
                                    console.log(err);
                                }
                            });
                        }
                        
                    } else {
                        res.render("notFound");
                    }
                }
            }
        });
    } else {
        res.status(404).send();
    }
});

app.post("/on-refresh-playground/student/eft101101--post-delete-score", function(req, res){

    if(req.session.stud_d){
        User.updateOne({"quiz.quiz_id": (Number)(req.query.quizID), "quiz.students.studName": req.session.stud_d 
        }, {
            $set: {
                "quiz.$[outer].students.$[inner].score": 0
            }
        }, {"arrayFilters": [
            { "outer.quiz_id": (Number)(req.query.quizID) },
            { "inner.studName": req.session.stud_d},
            {useFindAndModify: false}
        ]}, function(err){
            if(err){
                console.log(err);
            }
        });
    } else{
        res.status(404).send();
    }
});

app.post("/add-score-to-the-account/student/addBy100287392uefi/smt-boot", function(req, res){

    User.updateOne({"quiz.quiz_id": (Number)(req.query.quizID), "quiz.students.studName": req.session.stud_d 
    }, {
        $inc: {"quiz.$[outer].students.$[inner].score": (Number)(req.query.points)}

    }, {"arrayFilters": [
        { "outer.quiz_id": (Number)(req.query.quizID) },
        { "inner.studName": req.session.stud_d},
        
    ]}, function(err){
        if(err){
            console.log(err);
        }
    });
    
});

app.listen(3000, function(){
    console.log("server started on port 3000");
});