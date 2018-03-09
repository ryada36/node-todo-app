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
        $.ajax({
            url:'/todos',
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
    })
})();