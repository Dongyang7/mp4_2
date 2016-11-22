// Get the packages we need
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var userModel = require('./models/user');
var taskModel = require('./models/task');

// Create our Express application
var app = express();

mongoose.connect('mongodb://dl7:cs498rk1@ds157187.mlab.com:57187/mp3');


// Use environment defined port or 3000
var port = process.env.PORT || 3000;

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

// Use routes as a module (see index.js)
require('./routes')(app, router);
//home route*************************************************************
var homeRoute = router.route('/');
homeRoute.get(function (req, res) {
    res.json({
        message: 'Nothing here. Go to /users or /tasks to play with the API.',
        data: []
    });
});
//user route*************************************************************
var userRoute = router.route('/users');
//this part is for GET
userRoute.get(function(req,res){
    var getuser = userModel.find();
    if(req.query.where){
        where = JSON.parse(req.query.where);
        getuser.where(where);
    }
    if(req.query.sort){
        sort = JSON.parse(req.query.sort);
        getuser.sort(sort);
    }
    if(req.query.select){
        select = JSON.parse(req.query.select);
        getuser.select(select);
    }
    if(req.query.skip){
        skip = parseInt(req.query.skip,10);
        getuser.skip(skip);
    }
    if(req.query.limit){
        limit = parseInt(req.query.limit,10);
        getuser.limit(limit);
    }
    if(req.query.count == 'true'){
        getuser.count(function(err,count){
            if(err){
                res.status(500).json({message:'Internal Server Error!', data:[]})
            }
            else{
                res.status(200).json({message:'OK', data:count})
            }
        })
    }
    else{
        getuser.exec(function(err,users){
            if(err){
                res.status(500).json({message:'Internal Server Error!', data:[]})
            }
            else{
                res.status(200).json({message:'OK', data:users})
            }
        })
    }
})

//this part is for post
userRoute.post(function(req,res){
    var newuser = new userModel();
    if((!req.body.name)&&(!req.body.email)){
        res.status(500).json({message:'Internal Server Error! A name and an email is required!', data:[]})
    }
    else if(!req.body.name){
        res.status(500).json({message:'Internal Server Error! A name is required!', data:[]})
    }
    else if(!req.body.email){
        res.status(500).json({message:'Internal Server Error! An email is required!', data:[]})
    }
    else{
        newuser.name = req.body.name;
        newuser.email = req.body.email;
    }
    newuser.save(function(err,user){
        if(err){
            res.status(500).json({message:'Email already exists!', data:[]})
        }
        else{
            res.status(201).json({message:'User successfully added!', data:user})
        }
    })
})

userRoute.options(function (req, res) {
    res.writeHead(200);
    res.end();
})

//user id route**********************************************************
var userIDRoute = router.route('/users/:id');
//also, GET first
userIDRoute.get(function(req, res){
    userModel.findById(req.params.id, function(err,user){
        if(err){
            res.status(404).json({message:'User not found', data:[]})
        }
        else{
            res.status(200).json({message:'OK', data: user})
        }
    })
})
//then PUT
userIDRoute.put(function(req,res){
    var newuser = new userModel();
    userModel.findById(req.params.id, function(err,user){
        if(err){
            res.status(404).json({message:'Page not found', data:[]})
        }
        else{
            if((!req.body.name)&&(!req.body.email)){
                res.status(500).json({message:'Internal Server Error! A name and an email is required!', data:[]})
            }
            else if(!req.body.name){
                res.status(500).json({message:'Internal Server Error! A name is required!', data:[]})
            }
            else if(!req.body.email){
                res.status(500).json({message:'Internal Server Error! An email is required!', data:[]})
            }
            else{
                newuser.name = req.body.name;
                newuser.email = req.body.email;
            }
        }
        newuser.save(function(err,updateduser){
            if(err){
                res.status(500).json({message:'Internal Server Error!'})
            }
            else{
                res.status(200).json({message:'User successfully updated!', data: updateduser})
            }
        })
    })
})
//finally it's DELETE
userIDRoute.delete(function(req,res){
    userModel.findById(req.params.id, function(err,user){
        if(err){
            res.status(404).json({message:'User not found', data:[]})
        }
        else{
            userModel.remove({_id: req.params.id}, function(err,user){
                if(err){
                    res.status(500).json({message:'Internal Server Error!'})
                }
                else{
                    res.status(200).json({message:'User successfully deleted!', data:[]})
                }
            })
        }
    })
})

//task route******************************************
var taskRoute = router.route('/tasks');

//as always, get first
taskRoute.get(function(req,res){
    var gettask = taskModel.find();
    if(req.query.where){
        where = JSON.parse(req.query.where);
        gettask.where(where);
    }
    if(req.query.sort){
        sort = JSON.parse(req.query.sort);
        gettask.sort(sort);
    }
    if(req.query.select){
        select = JSON.parse(req.query.select);
        gettask.select(select);
    }
    if(req.query.skip){
        skip = parseInt(req.query.skip,10);
        gettask.skip(skip);
    }
    if(req.query.limit){
        limit = parseInt(req.query.limit,10);
        gettask.limit(limit);
    }
    if(req.query.count == 'true'){
        gettask.count(function(err,count){
            if(err){
                res.status(500).json({message:'Internal Server Error!', data:[]})
            }
            else{
                res.status(200).json({message:'OK', data:count})
            }
        })
    }
    else{
        gettask.exec(function(err,task){
            if(err){
                res.status(500).json({message:'Internal Server Error!', data:[]})
            }
            else{
                res.status(200).json({message:'OK', data:task})
            }
        })
    }
})
//then POST
taskRoute.post(function(req,res){
    var newtask = new taskModel();
    if((!req.body.name)&&(!req.body.deadline)){
        res.status(500).json({message:'Internal Server Error! A name and a deadline is required!', data:[]})
    }
    else if(!req.body.name){
        res.status(500).json({message:'Internal Server Error! A name is required!', data:[]})
    }
    else if(!req.body.deadline){
        res.status(500).json({message:'Internal Server Error! A deadline is required!', data:[]})
    }
    else{
        newtask.name = req.body.name;
        newtask.deadline = req.body.deadline;
    }
    newtask.save(function(err,task){
        if(err){
            res.status(500).json({message:'Internal Server Error!', data:[]})
        }
        else{
            res.status(201).json({message:'Task successfully added!', data:task})
        }
    })
})

taskRoute.options(function (req, res) {
    res.writeHead(200);
    res.end();
})

//task id route******************************************
var taskIDRoute = router.route('/tasks/:id');

//Get first
taskIDRoute.get(function(req, res){
    taskModel.findById(req.params.id, function(err,task){
        if(err){
            res.status(404).json({message:'Task not found', data:[]})
        }
        else{
            res.status(200).json({message:'OK', data: user})
        }
    })
})
//then PUT
taskIDRoute.put(function(req,res){
    var newtask = new taskModel();
    taskModel.findById(req.params.id, function(err,user){
        if(err){
            res.status(404).json({message:'Page not found', data:[]})
        }
        else{
            if((!req.body.name)&&(!req.body.deadline)){
                res.status(500).json({message:'Internal Server Error! A name and a deadline is required!', data:[]})
            }
            else if(!req.body.name){
                res.status(500).json({message:'Internal Server Error! A name is required!', data:[]})
            }
            else if(!req.body.deadline){
                res.status(500).json({message:'Internal Server Error! A deadline is required!', data:[]})
            }
            else{
                newtask.name = req.body.name;
                newtask.deadline = req.body.deadline;
                newtask.assignedUser = req.body.assignedUser;
                if(!req.body.assignedUserName){
                    newtask.assignedUserName = "unassigned";
                }
                else{
                    newtask.assignedUserName = req.body.assignedUserName;
                }
            }
        }
        newtask.save(function(err,updatedtask){
            if(err){
                res.status(500).json({message:'Internal Server Error!'})
            }
            else{
                res.status(200).json({message:'Task successfully updated!', data: updatedtask})
            }
        })
    })
})
//finally it's DELETE
taskIDRoute.delete(function(req,res){
    taskModel.findById(req.params.id, function(err,task){
        if(err){
            res.status(404).json({message:'Task not found', data:[]})
        }
        else{
            taskModel.remove({_id: req.params.id}, function(err,tasktodelete){
                if(err){
                    res.status(500).json({message:'Internal Server Error!'})
                }
                else{
                    res.status(200).json({message:'Task successfully deleted!', data:[]})
                }
            })
        }
    })
})


// Start the server
app.listen(port);
console.log('Server running on port ' + port);
