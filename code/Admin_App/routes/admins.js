const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const News = require('../models/news');
const config = require('../config');
const LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

router.post('/register', (req, res) => {
    if(!req.body.username || !req.body.password){
        res.redirect('/views/admin/register?error='+encodeURIComponent('Please enter all required fields'))
    }
    else{
        let newadmin = new Admin({
            username : req.body.username,
            password : req.body.password
        })
    
        newadmin.save((err,result)=>{
            if(err) return res.status(500).send('Oops ! Something went wrong !');
            else {
                res.redirect('/views/admin/login?msg='+encodeURIComponent('Registered successfully.'))
            }
        })
    }
    


})

router.post('/login', (req, res) => {
    if(!req.body.username || !req.body.password){
        res.redirect('/views/admin/login?error='+encodeURIComponent('Please enter all required fields'))
    }
    else{
        Admin.findOne({ username: req.body.username,password : req.body.password }, function (err, admin) {
            if (err) return res.status(500).send('Oops ! Something went wrong !');
            if(!admin) res.redirect('/views/admin/login?error='+encodeURIComponent('Invalid credentials'))
            else{
                var token = jwt.sign({ id: admin._id }, config.secret, { expiresIn: 86400 });
                localStorage.setItem('admin-authtoken', token)
                res.redirect('/views/admin/dashboard');
            }
        })    
    }
})

router.post('/addnews', (req, res) => {
    if(!req.body.title || !req.body.description || !req.body.url || !req.body.imageurl){
        res.redirect('/views/admin/addnews?error='+encodeURIComponent('Please enter all required fields'))
        return
    }

    var token
    try{
        token = localStorage.getItem('admin-authtoken')
    }
    catch(err){
        console.log(err)
        res.redirect('/views/admin/login')
        return
    }
    
    if (!token) {res.redirect('/views/admin/login') }
    jwt.verify(token, config.secret, function(err, decoded) {
        if(err) {res.redirect('/views/admin/login') }
        let newnews = News({
            title : req.body.title,
    description : req.body.description,
    url : req.body.url,
    imageurl : req.body.imageurl,
        })

        newnews.save((err,result)=>{
            console.log(err)
            if(err) return res.status(500).send('Oops ! Something went wrong !');
            else {
                res.redirect('/views/admin/dashboard');
            }
        })
    })
})


router.post('/editnews', (req, res) => {
    console.log(req.body)
    if(!req.body.title || !req.body.description || !req.body.url || !req.body.imageurl || !req.body.id){
        res.redirect('/views/admin/editnews?error='+encodeURIComponent('Please enter all required fields'))
        return
    }

    var token
    try{
        token = localStorage.getItem('admin-authtoken')
    }
    catch(err){
        console.log(err)
        res.redirect('/views/admin/login')
        return
    }
    
    if (!token) {res.redirect('/views/admin/login') }
    jwt.verify(token, config.secret, function(err, decoded) {
        if(err) {res.redirect('/views/admin/login') }
        News.findById(req.body.id,(err,news)=>{
            news.title = req.body.title,
            news.description = req.body.description,
            news.url = req.body.url,
            news.imageurl = req.body.imageurl

            news.update(news, (err) => {
                if(err) return res.status(500).send('Oops ! Something went wrong !'); 
                else {
                    res.redirect('/views/admin/dashboard');
                }
            });
        })
    })
})

router.get('/deletenews', (req, res) => {
    console.log(req.query.id)
    if(!req.query.id){
        res.status(400).send('Id not provide !')
        return
    }

    var token
    try{
        token = localStorage.getItem('admin-authtoken')
    }
    catch(err){
        console.log(err)
        res.redirect('/views/admin/login')
        return
    }
    
    if (!token) {res.redirect('/views/admin/login') }
    jwt.verify(token, config.secret, function(err, decoded) {
        if(err) {res.redirect('/views/admin/login') }
        News.remove({_id : req.query.id},(err)=>{
            if(err) return res.status(500).send('Oops ! Something went wrong !'); 
            else {
                    res.status(200).json({success : true})
                }
        })
    })
})

router.get('/logout', (req, res) => {
    localStorage.removeItem('admin-authtoken')
    res.redirect('/views/admin/login')
})

module.exports = router;