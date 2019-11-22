function scrollbackdown(){               
    var elem = document.getElementById('chatWindow');
    elem.scrollTop = elem.scrollHeight;
    
 };
 
 
 $(function(){
 var socket = io.connect('http://localhost:3000');
 var $messageForm = $('#messageForm');
 var $message = $('#message');
 var $chat = $('#chatWindow');
 var $usernameForm = $('#usernameForm');
 var $users = $('#users');
 var $username = $('#username');
 var $error = $('#error');
 var $currentuser =$('#currentuser');
 
 //$('#username').focus();
 $('.jumbotron').addClass('animated bounceIn');
 
 
 $usernameForm.submit(function(e){
   console.log('submitted')
     e.preventDefault();     
     socket.emit('new user',$username.val(),function(data){
         if(data)
             {
                 $('#namesWrapper').hide();
                 $('#mainWrapper').show();
                 $currentuser.html($username.val());              
                 $('#message').focus();
             }
         else
             {
                 $error.html("Username cannot empty be or already taken!");
                  $username.addClass("animated shake");
             } 
        
     });
     $username.removeClass("animated shake");
     $uname=$('#username').val();
              
 });
 
 socket.on('usernames',function(data){
     var html = '';
      var ulen=data.usernames.length;
     for(i=0;i<data.usernames.length;i++)
         {
             html+=data.usernames[i]+' has joined <br>';
             $('#users').addClass('animated tada');
            
         }
     
     //$chat.append('<br><h4 align="center">'+data.usernames[data.usernames.length-1]+' has joined<br><small>At '+data.hour+':'+data.minute+'</small></h4><br>');
      scrollbackdown();
     
    if (ulen!=data.usernames.length)
        {
            $('#users').addClass('animated tada');
        }    
     $users.html(html); 
 });
  socket.on('joinu',function(data){
       var d = new Date();
      
       d = d.toLocaleString('en-US', { hour: 'numeric',minute:'numeric', hour12: true });
       $chat.append('<br><br><h4 align="center" id="notify_join">'+data+' has joined chat<br><small>'+d+'</small></h4>');
      
       $('#notify_join').addClass('animated tada');
       scrollbackdown();
 });
  $('#notify_join').addClass('animated tada');
 
 socket.on('leaveu',function(data){
     var d = new Date();    
     d = d.toLocaleString('en-US', { hour: 'numeric',minute:'numeric', hour12: true });
      $chat.append('<br><br><h4 align="center" id="notify_leave">'+data+' has left chat<br><small>'+d+'</small></h4>');
     $('#notify').addClass('animated tada');
      scrollbackdown();
 });
 $('#notify_leave').removeClass('animated tada');
 
 $messageForm.submit(function(e){
     e.preventDefault();
     socket.emit('send message',$message.val());
     $message.val('');    
 });
    
 
 socket.on('new message',function(data){
     var d = new Date();
     
     d = d.toLocaleString('en-US', { hour: 'numeric',minute:'numeric', hour12: true });
     var audio = new Audio('https://notificationsounds.com/standard-ringtones/here-i-am-449/download/mp3');
     var audio2 = new Audio('https://notificationsounds.com/message-tones/all-eyes-on-me-465/download/mp3');
         
     if(data.user==$username.val()){
             data.user = "You ";
             $chat.append('<br><br><div class="msgcontent animated bounceInRight" style="float:right; background: #00B8A9;font-size:18px;position:relative;right:8px;">  '+data.msg+': <strong>'+data.user+'</strong><br><small>'+d+'</small></div><br><br>');  
             audio2.play();
             scrollbackdown();
         }
     else  {
     $chat.append('<br><br><div class="msgcontent animated bounceInLeft" style="float:left;position:relative;left:2px;background:#625772;color:white;font-size:18px;"><strong>'+data.user+'</strong> :  '+data.msg+'<br><small>'+d+'</small></div><br><br>');
             audio.play();
             scrollbackdown();
              window.navigator.vibrate(200);
           
     }
     $('#message').focus();
 });
 });
     
     