const express=require('express');
const bodyParser=require('body-parser');
const {ObjectID}=require('mongodb');

var {mongoose}=require('./db/mongoose');
var {Todo}=require('./db/models/todo');
var {User}=require('./db/models/user');

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
app.post('/todos',(req,res)=>{
    var todo=new Todo({
        text:req.body.text
    });
    todo.save()
        .then((doc)=>{
            res.send(doc);
        },(e)=>{
            res.status(400).send(e);
        });
})


app.listen(port,()=>{
    console.log('API server running at ',port);
})

module.exports={app};



