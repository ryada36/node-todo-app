/**
 * API tester for making ajax calls
 */

(function(){
    
    /** GET /todos tester */
    $('#get-all').on('click',function(event){
        console.log('getting all the todos');
        $.get('/todos')
            .then(function(result){
                console.log(result);
            })
    });
    /** GET /todos/:id  tester*/
    $('#get-specific').on('click',function(event){
        console.log('Getting specific Todo item');
        var id=$('#todoId').val();
        if(!id)
            return alert('Please enter todo id');
        $.get('/todos/'+id)
            .then(function(result){
                console.log(result);
            })
    });
    /**POST /todos tester */
    $('#save').on('click',function(event){
        console.log('saving todo');
        var data={
            text:'Sending from Tester'
        }
        var token=localStorage.getItem('token');
        $.ajax({
            url:'/todos',
            headers: { 'x-auth': token },
            type:"POST",
            data:JSON.stringify(data),
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(result){
                console.log('Successfully saved',result);
            },
            error:function(err){
                console.log('Error :',err);
            }
        })
    });
    /** DELETE /todos/:id tester */
    $('#delete').on('click',function(event){
        console.log('Deleting the resource');
        var id=$('#delete-input').val();
        if(!id)
            return alert('Please enter todo id');
        $.ajax({
            url:`/todos/${id}`,
            type:"DELETE",
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(result){
                console.log('Successfully deleted',result);
            },
            error:function(err){
                console.log('Error :',err);
            }
        })
    });

    /** UPDATE /todos/:id tester */
    $('#update').on('click',function(event){
        console.log('Updating the resource');
        var id=$('#update-input').val();
        var data={
            text:'Update from Tester',
            completed:true
        }
        if(!id)
            return alert('Please enter todo id');
        $.ajax({
            url:`/todos/${id}`,
            type:"PATCH",
            data:JSON.stringify(data),
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(result){
                console.log('Successfully updated',result);
            },
            error:function(err){
                console.log('Error :',err);
            }
        })
    });

    /**POST /todos tester */
    $('#save-user').on('click',function(event){
        console.log('Signing Up New User');
        var data={
            email:'abc@example.com',
            password:'abc1234'
        }
        $.ajax({
            url:'/users',
            type:"POST",
            data:JSON.stringify(data),
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(result){
                console.log('User Successfully Registered',result);
            },
            error:function(err){
                console.log('Error :',err);
            }
        })
    });
    /** GET user by token */
    $('#user-detail').on('click',function(event){
        var token=localStorage.getItem('token')
        if(!token)
            return alert('No User Currently Logged in');

        $.ajax({
            url:'/users/me',
            headers: { 'x-auth': token },
            type:"GET",
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(result){
                console.log('User Successfully Fetched',result);
            },
            error:function(err){
                console.log('Error :',err);
            }
        })
    });
    /** POST /users/login */
    $('#login').on('click',function(event){
        var email=$('#email').val(),
            password=$('#password').val();
        var data={};
        if(!email || !password){
            return alert('Please enter username and password');
        }
        else{
            data.email=email;
            data.password=password;
        }

        $.ajax({
            url:'/users/login',
            type:"POST",
            data:JSON.stringify(data),
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(result){
                console.log('User Successfully Logged in',result);
                localStorage.setItem('token',result.tokens[1].token);
            },
            error:function(err){
                console.log('Error :',err);
            }
        })
        
    });

    /** DELETE /users/me/token */
    $('#logout').on('click',function(event){
        var token=localStorage.getItem('token')

        $.ajax({
            url:'/users/me/token',
            headers: { 'x-auth': token },
            type:"DELETE",
            contentType:"application/json; charset=utf-8",
            dataType:"json",
            success: function(result){
                console.log('User Successfully Logged out',result);
                localStorage.removeItem('token');
            },
            error:function(err){
                console.log('Error :',err);
                localStorage.removeItem('token')
            }
        })
    })

})();