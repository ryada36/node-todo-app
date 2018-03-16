const expect = require('expect');
const request=require('supertest');
const {ObjectID}=require('mongodb');

const {app}=require('./../server');
const {Todo}=require('./../db/models/todo');
const {User}=require('./../db/models/user');

var {todos,users}=require('./../db/seed/seed');

//set up the user database with the inital values
beforeEach((done)=>{
    User.remove({}).then(()=>{
        var userOne=new User(users[0]).save();
        var userTwo=new User(users[1]).save();
        return Promise.all([userOne,userTwo])
    }).then(()=>done()).catch((e)=>{done(e);})

})

beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then(()=>{done()}).catch((e)=>done(e));

});

describe('POST /todos',()=>{
    it('should create a new todo',(done)=>{
        var text='Test todo text';
        request(app)
            .post('/todos')
            .send({text:text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                Todo.find({text}).then((todos)=>{
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e)=>{done(e)});
            })
    })
    it('should not create todo with invalid body data',(done)=>{
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err,res)=>{
                if(err)
                    return done(err);
                Todo.find().then((todos)=>{
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e)=>{
                    done(e);
                })
            })
    })
});

describe('GET /todos',()=>{
    it('should return all todos',(done)=>{
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});
describe('GET /todos/:id',()=>{
    it('should return the todo item for the given id',(done)=>{
        var id=todos[0]._id.toHexString();
        request(app)
            .get(`/todos/${id}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });
    it('should return 404 if todo not found',(done)=>{
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });
});
describe('DELETE /todos/:id',()=>{
    it('should delete todo for the given id',(done)=>{
        var id=todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo._id).toBe(id);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(id).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    });
    // A little caveat for you , if you put the just deleted id in the previous test case in the
    //below test case it will return 200 instead of 404 , Go figure
    it('should return 404 if id is valid but not found',(done)=>{
        var id = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);
    })
});
describe('PATCH /todos/:id',()=>{
    it('should update the set properties of the given id',(done)=>{
        var id=todos[0]._id.toHexString();
        var body={
            text:'update from tester',
            completed:true
        }
        request(app)
            .patch(`/todos/${id}`)
            .send(body)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(body.text);
            })
            .end(done);
    });

})

/******************   USER ROUTES TEST SUITS ******************************/

describe('POST /users',()=>{
    it('should sign up user and return auth token',(done)=>{
        request(app)
            .post('/users')
            .send({
                email:'test@test.com',
                password:'testuser'
            })
            .expect(200)
            .expect((res)=>{
                expect(res.header['x-auth']).toExist();
            })
            .end((err,res)=>{
                if(err)
                    done(err);
                //to check data is persisted fetch the same user back
                User.findOne({email:'test@test.com'}).then((user)=>{
                    expect(user).toExist();
                    done();
                }).catch((e)=>{done(e)});
            })
    })
})
describe('GET /users/me',()=>{
    it('should return the user profile provided correct auth token',(done)=>{
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token).
            expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    })
})
