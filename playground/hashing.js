const {SHA256}=require('crypto-js');
const jwt=require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// ************* Using crypto-js
// var message="I will be hashed";
// var hashed=SHA256(message);
// console.log('Hashed ',hashed.toString());

// const sHash='8199c3ff7441cf0968aa7ee09a1f29032f202abdcd673f0b683fc39a3ca70818';
// console.log(sHash==hashed);


// ************ Using JWT
// var data={
//     id:10
// }

// var token=jwt.sign(data,'abc123');
// console.log('Token :',token);
// var decoded=jwt.verify(token,'abc123');
// console.log('Decoded ',decoded);

/************* using bcrypt */

var password='abc1234';
var salt='xyz';
var promise=new Promise((resolve,reject)=>{
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,(err,hash)=>{
            console.log('Hashed Password ',hash);
            if(err)
                reject(err);
            else
                resolve(hash);
        })
    });
}).then((hash)=>{
    bcrypt.compare(password,hash,(err,res)=>{
        console.log('Do Password Match ',res);
    })
}).catch((e)=>console.log(e));


