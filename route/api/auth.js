const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require("../../middleware/auth")
const User = require("../../models/User")
const jwt = require('jsonwebtoken');
const config = require('config')
const {check, validationResult} = require('express-validator');

//@route  GET api/Auth
//@desc   Tests Auth route
//@access Public

router.get('/',auth, async (req,res)=>{
  try{
    const user = await User.findById(req.user.id).select('-password');
    res.json(user)
  }catch(err){
    console.error(err.message);
    res.status(500).send('Server Error')
  }
});


//@route  Post api/Auth
//@desc   Authenticate User & get token
//@access Public

router.post('/', [
  //Validation----
  check('email', 'Please include a valide email').isEmail(),
  check('password','Password is required').exists()
], 
async(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array() })
  }

  const {email,password} = req.body;
  

  try{
    //Check if user exist
    let user = await User.findOne({email});

    if(!user){
      return res.status(400)
      .json({ errors: [{msg: "Invalid Credentials"}]})
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
      return res.status(400)
      .json({ errors: [{msg: "Invalid Credentials"}]})
    }

    //return jsonwebtoken

    //Calling the user.id from Mongodb
    const payload = {
      user:{
        id:user.id
      }
    }

    //sign the token, passing payload and secret
    jwt.sign(
      payload, 
      config.get("jwtSecret"),
      { expiresIn: 36000 },
      (err, token)=>{
        if(err) throw err;
        res.json({ token })
      });



  }catch(err){
    console.error(err.message);
    res.status(500).send('Server Error')
  }
});


module.exports = router;