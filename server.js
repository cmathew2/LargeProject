require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { json } = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectId;
const bcrypt =require('bcrypt');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const cryptoRandomString = require('crypto-random-string');


const url = 'mongodb+srv://dbuser:weakPASSWORD21@cluster0.ygm9c8s.mongodb.net/?retryWrites=true&w=majority'; 

const client = new MongoClient(url);
client.connect();


const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => 
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.get("/", async (req, res, next)=>
{
    const db = client.db("FeastBook");
    console.log("/ working")
    res.send("hello")
    let data = db.collection('Users')
})

app.get("/users", async (req, res, next)=>
{
    const db = client.db("FeastBook");
   
    db.collection('Users').find({}).toArray((err, results) =>
    {
      if (err) throw err

      console.log("users displayed")
      res.json(results)
    })
})

app.post('/api/login', async (req, res, next) => 
{
  // incoming: login, password
  // outgoing: id, firstName, lastName, error

  let error = '';

  const { login, password } = req.body;
 
  const results = db.collection('Users').find({login:login});

  let id = -1;
  let firstName = '';
  let lastName = '';

  const db = client.db("FeastBook");
     //must compare password to hash password
     bcrypt.compare(password, login[0],password, (err, result)=> {
        if(err) {
            res.status(401).json({
                message: 'Authenication Failed'
            })
        }
        if(result){
        const jwtoken = jwt.sign(
          {lo: user}
        );
        

        if( results.length > 0 )
        {
            id = results[0]._id;
            firstName = results[0].firstname;
            lastName = results[0].lastname;
        }

        let ret = { id:id, firstname:firstName, lastname:lastName, error:''};
        res.status(200).json(ret);
                
        }
     })
});

app.post('/api/register', async (req, res, next) => 
{
  // incoming: firstName, lastName, login, password, email
  // outgoing: id, firstName, lastName, login, password, error

  let error = '';
  let bool = true;

  const { firstName, lastName, login, password, email} = req.body;

  const db = client.db("FeastBook");

  var newUser = new User({
    login: login,
    email: email,
    emailToken: cryptoRandomString(10),
    added: false
  });

  const numUsers = await db.collection('Users').find({login:login}).toArray();

  try
  { if(numUsers.length <= 0)
    {
      //password hashing
      bcrypt.hash(password,10,(err, hash) => {
        if(err){
            res.status(500).json({
                error: err
            });
          }
        else{
        // email verification 
          const message = {
            to: user.email,
            from: {
                name: 'Chris @ FeastBook',
                email:'cvmathew18@gmail.com', 
                },
            subject: 'Verify Your FeastBook account',
            text:` 
                  Hello, thank you for registering. 
                  Please use this link to verify your account. 
                  http://${req.headers.host}/verify-email?token=${newUser.emailToken}
                  `,
            html: `
                  <h1>Hello,</h1>
                  <p>Thanks for registering on our site.</p>
                  <p>Please use this link to verify your account.</p>
                  <a href="http://${req.headers.host}/verify-email?token=${newUser.emailToken}">Verify your account</a>
            `
          };
          try{
            await sgMail.send(message);
            req.flash('Success. Check Your Email to Finish Registration.')
            res.redirect('/');
          }
          catch(e){
            console.log(error);
            req.flash('error', 'Something has gone wrong.')
            res.redirect('/');
          }
        }});
    }
    else
    {
      console.log("User already exists")
      bool = false;
    }
  }
  catch(e)
  {
    error = e.toString();
    bool = false;
  }
  
  let ret = { added:bool, firstName:firstName, lastName:lastName, login:login, password:password, email: email, error:''};
  res.status(200).json(ret);
});

app.get('/api/verify-email', async (req, res, next) => {
  try {
    const user = await User.findOne({emailToken: req.query.emailToken })
    if (!user) {
      req.flash('Invalid token');
      res.redirect('/');
    }
  }
  catch (error) {
    console.log(error);
    req.flash('Something went wrong');
    res.redirect('/');
  }
});

app.post('/api/forgotpassword', async (req, res, next) => {
<<<<<<< HEAD
  const {email} = req.body;

  User.findOne.({email:email})
 
  
=======
>>>>>>> e8d55b854a4b16b31449f8d38e18fab6182ab666
  
  try {
    const message = {
      to: user.email,
      from: {
          name: 'Chris @ FeastBook',
          email:'cvmathew18@gmail.com', 
          },
      subject: 'Reset your Password',
      text:` 
            Hello, your password must be reset 
            Please use this link to reset your password. 
            http://${req.headers.host}/resetpassword?token=${newUser.emailToken}
            `,
      html: `
            <h1>Hello,</h1>
            <p>Your password must be reset.</p>
            <p>Please use this link to reset your password.</p>
            <a href="http://${req.headers.host}/resetpassword?token=${newUser.emailToken}">Reset your password</a>
      `
    };

    }
  catch{}
});

app.get('/api/resetpassword', async (req, res, next) => {
  let error = '';
  try {
    

    }
  catch{

  }
});


app.delete('/api/deleteuser', async (req, res, next) => 
{

  // deletes the current user being used and all of their posts

  let error = '';
  let deleted = false
  const { id } = req.body;

  const db = client.db("FeastBook");


  const result = await db.collection('Users').deleteOne({_id: objectId(id)})
  deleted = true;

  if (result.deletedCount > 0)
  {
    console.log("User deleted")
  }

  res.status(200).send(result);
  // let ret = { id:id, deleted: deleted, error:''};
  // res.status(200).json(ret);
});

app.post('/api/searchuser', async (req, res, next) => 
{
  // incoming: userId, search
  // outgoing: results[], error

  let error = '';

  const {search } = req.body;

  let _search = search.trim();
  
  const db = client.db("FeastBook");
  const results = await db.collection('Users').find({login:{$regex: '^'+_search+'.*', $options: 'ir'}}).toArray();
  
  let _ret = [];
  for( var i=0; i<results.length; i++ )
  {
    let temp = 
    {
      login: results[i].login,
      id: results[i]._id
    }
    _ret.push(temp);
  }
  
  let ret = {results:_ret, error:error};
  res.status(200).json(ret);
});

app.post('/api/updateuser', async (req, res, next) => 
{

  // deletes the current user being used and all of their posts

  let error = '';
  let deleted = false
  const db = client.db("FeastBook");

  const { id, firstName, lastName} = req.body;

  let oldfirstName = '';
  let oldlastName = '';


  const old = await db.collection('Users').find({_id: objectId(id)}).toArray();

  db.collection('Users').updateOne({_id: objectId(id)}, {$set: {firstname: firstName, lastname: lastName}}, function(err, result)
  {
    if (err) 
    {
      throw err;
    }
  })
  
  if(old.length > 0 )
  {
    oldfirstName = old[0].firstname;
    oldlastName = old[0].lastname;
  }
  
  let ret = {id: id, oldfirstname: oldfirstName, oldlastname: oldlastName, firstame: firstName, lastname: lastName, error:error};
  res.status(200).json(ret);
});

app.listen(5000); 
