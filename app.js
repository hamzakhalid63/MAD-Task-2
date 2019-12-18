const app = require("express")();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

app.set("port", (3000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
mongoose.connect("mongodb://localhost:27017/mydb", { useNewUrlParser: true, useUnifiedTopology: true });

const Student = mongoose.model("Student", {
    name: String,
    student_id: Number,
    email: String,
    password: String
});

app.get("/students", async(req, res) =>  {
    const studentList = await Student.find();
    res.send(studentList);
});

app.post("/signup", async (req, res) => {
    const body = req.body;
    try {
        const student = new Student(body);
        const result = await student.save();
        res.send({
            message: 'Student Signup Successfully'
        });
        console.log(body);
    }
    catch (ex) {
        res.send({
            message: 'Error'
        }).status(401);
    }
});

app.post("/login", async (req, res) => {
    const body = req.body;
    try {
        const email = body.email;
        console.log(body.email);
        const result = await Student.findOne({"email":  email});
        console.log(body);

        if(!result) {
            res.send({message: "User Dosn't Exits. Please Signup First!"}).status(401);
        }
        else {
            if(body.password === result.password) {
                console.log("Match");
                res.send({
                    message: "Succesfully Sign In!"
                })
            }
            else {
                console.log(body.password);
                console.log(result.password);
                res.send({message: "Wrong Email or Password!"}).status(401);
            }
        }
    }
    catch (ex) {
        res.send({
            message: 'Error'
        }).status(401);
    }
});

app.get("*", function (req, res) {
    res.send("Page Dosen't Exits");
});

app.listen(app.get("port"));




