const {ObjectID}=require('mongodb');
const jwt=require('jsonwebtoken');

require('./../../config/config');
const userOneId=new ObjectID();
const userTwoId=new ObjectID();

const todos=[{
    _id:new ObjectID(),
    text:'First test todo',
    _creatorId:userOneId
},
{
    _id:new ObjectID(),
    text:'Second test todo',
    _creatorId:userOneId
}]
const users=[
    {
        _id:userOneId,
        email:'clark@test.com',
        password:'abc1234',
        tokens:[
            {
                access:'auth',
                token:jwt.sign({_id:userOneId,access:'auth'},process.env.SECRET)
            }
        ]
    },
    {
        _id:userTwoId,
        email:'jenny@test.com',
        password:'abc12345'
    }
]

module.exports={todos,users}