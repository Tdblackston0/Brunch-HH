const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config')
const {
  check,
  validationResult
} = require('express-validator');



const User = require('../../models/User')

//@route  Post api/users/test
//@desc   Register User
//@access Public

router.post('/', [
    //Validation----
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valide email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      })
    }

    const {
      name,
      email,
      password
    } = req.body;

    try {
      //Check if user exist
      let user = await User.findOne({
        email
      });

      if (user) {
        return res.status(400).json({
          errors: [{
            msg: "User Already Exists"
          }]
        })
      }

      //get users gravatar 
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      })

      //Create Users 
      user = new User({
        name,
        email,
        avatar,
        password
      });

      //encrypt (hash password)
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      //Save user in database
      await user.save()

      //return jsonwebtoken

      //Calling the user.id from Mongodb
      const payload = {
        user: {
          id: user.id
        }
      }

      //sign the token, passing payload and secret
      jwt.sign(
        payload,
        config.get("jwtSecret"), {
          expiresIn: 36000
        },
        (err, token) => {
          if (err) throw err;
          res.json({
            token
          })
        });



    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error')
    }
  });

module.exports = router;