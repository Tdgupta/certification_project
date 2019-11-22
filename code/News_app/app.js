const express       = require ('express');
const mongoose      = require('mongoose');
var parser          = require('body-parser');
var request         = require('request')
var cors            = require('cors')
const News          = require('./models/news');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(''); // your api key


const app = express();

const corsOptions = {
    credentials: true, // This is important.
    origin: (origin, callback) => {
      
        return callback(null, true)
  
        callback(new Error('Not allowed by CORS'));
    }
}
app.use(cors(corsOptions));

app.use(parser.urlencoded({ extended: false }))
app.use(parser.json())
app.use("/",express.static(__dirname+'/public'));
app.set('views', './src/views');
app.set('view engine', 'ejs');



mongoose.connect('mongodb://localhost:27017/newsapp', { useNewUrlParser: true,useUnifiedTopology:true }, (err)=>{
    if(err) throw err
    else console.log('DB connected successfully')
})
var server = app.listen(3000,(err)=>{
    if(err) throw err;
    else console.log('Server up and running !')
})

app.get('/',(req,res)=>{
    res.redirect('/home')
})

app.get('/home',(req,res)=>{
    News.find().sort({ _id: -1 }).limit(3).then((data,err)=>{
        console.log(data)
      //  return res.json({success : true,data:data})
      res.render('index',{latestnews:data}) 
    }) 
    
})
app.get('/aboutus',(req,res)=>{ res.render('aboutus') })
app.get('/contactus',(req,res)=>{ res.render('contactus',{error: req.query.error?req.query.error:''}) })
app.get('/sports',(req,res)=>{ res.render('sports') })

app.post('/sendmail',(req,res)=>{
    console.log(req.body)
    const msg = {
        to: '', // generic email
        from: '', // your email
        subject: 'Query',
        text: req.body.query,
      };
      
      sgMail.send(msg).then((data)=>{
          console.log('success')
          res.redirect('/')
        /* console.log(data) */
      }).catch(err=>{
          res.redirect('/contactus?error='+encodeURIComponent('Something went wrong !'))
          console.log(err)
          
      })
})

app.get('/weather',(req,res)=>{
    let appid = ''
    if(req.query.latitude && req.query.longitude){
        let url = 'http://api.openweathermap.org/data/2.5/weather?lat='+req.query.latitude+'&lon='+req.query.longitude+'&units=metric&cnt=2&APPID='+appid
        request(url, (err,response,body) =>{
            if(err){
                console.log(err);
            } else {           
                const output = JSON.parse(body);
                res.send(output);
            }
        });
    }
    else{
        //console.log('no lat long')
        let url = 'http://api.openweathermap.org/data/2.5/weather?q=London&APPID='+appid
        request(url, (err,response,body) =>{
            if(err){
                console.log(err);
            } else {           
                const output = JSON.parse(body);
                res.send(output);
            }
        });
    }
   
})


var io = require('socket.io').listen(server);
usernames = []
io.sockets.on('connection',function(socket){
   console.log('connected')    
   socket.on('new user',function(data,callback){        
        if(data == '' || data == ' ' || data == '  '|| data == '   ' || usernames.indexOf(data) != -1)
            {
                callback(false);
            }
        else
            {
                callback(true);                 
                socket.username = data;                
                usernames.push(socket.username);
                io.sockets.emit('joinu',usernames[usernames.length-1]);
                updateUsernames();
            }        
    });
    //Update username
 
    function updateUsernames(){
        io.sockets.emit('usernames',{usernames:usernames});
        console.log(usernames);
    }
    
 
    //Send Message
    socket.on('send message',function(data){       
        io.sockets.emit('new message',{msg : data,user:socket.username});
    });
    // Disconnects user
    socket.on('disconnect',function(data){
        if(!socket.username) return;        
        io.sockets.emit('leaveu',socket.username);        
        usernames.splice(usernames.indexOf(socket.username),1);
        updateUsernames();
    });
    
});