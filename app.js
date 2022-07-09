const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect(
    "mongodb+srv://strider:veryimportant2001@cluster0.7jvc7ln.mongodb.net/tododb"
    );

const taskSchema = 
    {//defining the structure of data
        name: {
            type: String,
            required: true
        }
    };

 const Task = mongoose.model("Task", taskSchema);

 app.get("/", function (req, res) 
 {
  
    let today = new Date();
    let options = 
    { 
        weekday: "long", 
        day: "numeric", 
        month: "long" 
    };
    let day = today.toLocaleDateString("en-US", options);
    Task.find({}, function (err, foundTasks) 
    {
        if (err) 
        {
            console.log(err)
        }
        else 
        {
            res.render("index", { today: day, tasks: foundTasks });
        }
    });
 });
 app.post("/", function (req, res) {
    const taskName = req.body.newTask;
    if (taskName) {
        const task = new Task({
            name: taskName,
        });
  
        task.save()
            .then(() => {
                res.redirect("/");
            });
    } else {
        res.redirect("/");
    }
});
app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    Task.findByIdAndRemove(checkedItemId, function (err) {
      if (!err) {
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      }
    });
  });
  app.listen(3000);
 