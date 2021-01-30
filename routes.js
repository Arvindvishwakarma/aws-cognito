const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const express = require('express');
const router = express.Router();
const config = require('./config.json');

const poolData = {
    UserPoolId: config.cognito.userPoolId,
    ClientId: config.cognito.clientId
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

router.get('/',(req,res)=>{
    res.render('index');
});

router.get('/signup',(req,res)=>{
    res.render('signup');
});

router.get('/dashboard',(req,res)=>{
    res.render('dashboard');
});

router.post('/signup',(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    /*const confirmPassword = req.body.confirm_passowrd;

    if(password !== confirmPassword){
        res.redirect('signup?error=password');
    }*/

    const emailData = {
        Name: 'email',
        Value: email
    };

    const emailAttribute = new AmazonCognitoIdentity.CognitoUserAttribute(emailData);

    userPool.signUp(email,password,[emailAttribute],null,(err,data)=>{
        if(err){
            return console.error(err);
        }
        res.send(data.user);
    });
    res.redirect('/dashboard')


});

router.get('/login',(req,res)=>{
    res.render('login')
});

router.post('/login',(req,res)=>{
    const LoginDetails = {
        Username: req.body.email,
        Password: req.body.password
    }
 
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(LoginDetails);

    const userDetails = {
        Username: req.body.email,
        Pool: userPool
    }

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userDetails)

    

    cognitoUser.authenticateUser(authenticationDetails,{
        onSuccess: data=> {
            console.log(data)
            res.redirect('/dashboard')
        },

        onFailure: err => {
            console.error(err)
            res.redirect('/signup')
        }
    })
});


module.exports = router;