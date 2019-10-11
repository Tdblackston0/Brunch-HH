/*//Load input validation 

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//Load User model
const User = require("../../models/User")

//@route  GET api/users/test
//@desc   Tests users route
//@access Public
//router.get('/test', (req,res)=>res.json({msg:"Users works"}));

//@route  POST api/users/register
//@desc   Register User
//@access Public

router.post('/register',(req,res)=>{
  
  console.log(req.body);
  res.send('User Route')
  
  //const {errors, isValid} = validateRegisterInput(req.body);
  

  //Check validation
  /*if(!isValid){
    return res.status(400).json(errors)
  }

  User.findOne({ email: req.body.email })
    .then(user=>{
      if(user){
        return res.status(400).json({email:'Email Already exists'})
      }else{
        //Setting variable to pull avatar image based on user email.
        const avatar = gravatar.url(req.body.email,{
          s:'200', //size
          r:'pg',// rating
          default: 'mm' //default avatar image
        });
        const newUser = new User({
          name:req.body.name,
          email:req.body.email,
          avatar,
          password: req.body.password
        });

        bcrypt.genSalt(10,(err,salt)=>{
          bcrypt.hash(newUser.password, salt,(err,hash)=>{
            if(err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user))
              .catch(err=>console.log(err))
          })
        })
      }
    })
})


//@route  Post api/users/login
//@desc   Login  User / retruning JWT token
//@access Public

router.post('/login',(req,res)=>{

  const {errors, isValid} = validateLoginInput(req.body);

  //Check validation
  if(!isValid){
    return res.status(400).json(errors)
  }
  
  const email = req.body.email;
  const password = req.body.password;

  //find user by email 
  User.findOne({email})
    .then(user=>{
      //check for user
      if(!user){
        errors.email = "User not found";
        return res.status(404).json(errors);
      }

      //Check Password
      bcrypt.compare(password, user.password)
        .then(isMatch =>{
          if(isMatch){
            //User Matched

            const payload = {id:user.id, name:user.name, avatar:user.avatar} //create jwt payuload
            //Sign token
            jwt.sign(
              payload, 
              keys.secretOrKey,
              { expiresIn: 36000}, 
              (err,token)=>{
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                })
            });
          }else{
            errors.password = "Password incorrect"
            return res.status(400).json(errors)
          }
        })
    })
})

//@route  GET api/users/current
//@desc   Return Current user
//@access Private

router.get('/current',
  passport.authenticate('jwt',{ session: false }), 
    (req,res)=>{
      res.json({
        id:req.user.id,
        name: req.user.name,
        email:req.user.email
      });
    });*/