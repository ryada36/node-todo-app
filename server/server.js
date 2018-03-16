const express=require('express');
const bodyParser=require('body-parser');
const {ObjectID}=require('mongodb');
const _ = require('lodash');

require('./config/config');
var {mongoose}=require('./db/mongoose');
var {Todo}=require('./db/models/todo');
var {User}=require('./db/models/user');
var {authenticate}=require('./middleware/authenticate');

var app=express();
var port=process.env.PORT || 4200;

app.use(express.static(__dirname+'/public/'));
app.use(bodyParser.json());


//GET todos
app.get('/todos',(req,res)=>{
    Todo.find().then((todos)=>{
        res.send({todos});
    },(e)=>{
        res.status(400).send(e);
    })
});

//GET todos/:id
app.get('/todos/:id',(req,res)=>{
    var id=req.params.id;
    if(!ObjectID.isValid(id)){
        res.status(404).send({});
    }
        
    Todo.findById(id).then((todo)=>{
        if(!todo)
            return res.status(404).send();
        res.send({todo});
    }).catch((e)=>{
        res.status(400).send();
    })
})

//POST todos
app.post('/todos',authenticate,(req,res)=>{
    var todo=new Todo({
        text:req.body.text,
        _creatorId:req.user._id
    });
    todo.save()
        .then((doc)=>{
            res.send(doc);
        }).catch((e)=>{
            res.status(400).send(e);
        });
})

//DELETE todos/:id
app.delete('/todos/:id',(req,res)=>{
    var id=req.params.id;
    Todo.findByIdAndRemove(id).then((todo)=>{
        if(!todo)
            return res.status(404).send();
        res.send({todo});
    }).catch((e)=>res.status(400).send(e))
});

//UPDATE/PATCH /todos/:id
app.patch('/todos/:id',(req,res)=>{
    var id=req.params.id;
    var body=_.pick(req.body,['text','completed']);
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt=new Date().getTime();
    }
    else{
        body.completed=false;
        body.completedAt=null;
    }
        
    Todo.findByIdAndUpdate(id,{
        $set:body
    },
    {
        new:true
    }).then((todo)=>{
        if(!todo)
            return res.status(404).send();
        res.send({todo});

    }).catch((e)=>res.status(400).send(e));
})


/******************   USER ROUTES  ******************************/

//POST /users
app.post('/users',(req,res)=>{
    var body=_.pick(req.body,['email','password']);
    var user = new User(body)
    user.save().then((user)=>{
        // if(!user)
        //     return res.status(400).send();
        // return res.send({user});
        return user.generateAuthToken();
    }).then((token)=>{
        res.header('x-auth',token).send(user)
    }).catch((e)=>{
        res.status(400).send(e)
    });
});

//GET /users/me
app.get('/users/me',authenticate,(req,res)=>{
    res.send(req.user);
})

//POST /users/login
app.post('/users/login',(req,res)=>{
   var body= _.pick(req.body,['email','password']);
   //make a model method findByCredentials
   User.findByCredentials(body.email,body.password).then((user)=>{
       return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        })
   }).catch((e)=>{
        res.status(401).send(e)
    })
});

//DELETE /users/me/token
app.delete('/users/me/token',authenticate,(req,res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.send();
    }).catch((e)=>{
        res.status(401).send();
    })
})



app.listen(port,()=>{
    console.log('API server running at ',port);
})

module.exports={app};



