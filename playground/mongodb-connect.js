const MongoClient=require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('connected to mongoDB');
    // db.collection('Todos').insertOne({
    //     text:'Something to do',
    //     completed:false

    // },(err,result)=>{
    //     if(err){
    //         return console.log('Unable to Insert todos',err);
    //     }
    //     console.log(JSON.stringify(result.ops,undefined,2))
    // })
    db.collection('Users').insertOne({
        name:'Rishabh',
        age:28,
        location:'chandigarh'
    },(err,result)=>{
        if(err){
            return console.log('unable to insert users');
        }
        console.log(result.ops);
    })
    db.close();
    console.log('connection closed');
})