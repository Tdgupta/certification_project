const express       = require ('express');
const app           = express();
const mongoose      = require('mongoose');
var parser          = require('body-parser');
const admins        = require('./routes/admins');
const views         = require('./routes/views');

app.use("/",express.static(__dirname+'/public'));
app.set('views', './src/views');
app.set('view engine', 'ejs');
app.use(parser.urlencoded({ extended: false }))
app.use(parser.json())

// routes
app.use('/api/admins', admins);
app.use('/views', views);

app.get('/',(req,res)=>{
    res.redirect('/views/admin/login')
})

mongoose.connect('mongodb://localhost:27017/newsapp', { useNewUrlParser: true,useUnifiedTopology:true }, (err)=>{
    if(err) throw err
    else {
        console.log('DB connected successfully')
        app.listen(3001,(err) => {
            if (err) throw err;
            console.log('Server Up And Running !')
        })
    }
});