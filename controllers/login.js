const users = require("../model/users.json");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");


const userDB = {
  user: users,
  setUser: function (data) {
    this.user = data;
  },
};

const handleLogin = async (req, res) => {
  //checking if fields aren't empty
  if (!req.body.username || !req.body.password) {
    res.status(400).json({ message: "Username and Password are required" });
  }

  //searching for user in database
  const user = userDB.user.find((u) => u.username === req.body.username);
  if(!user) return res.status(401).json({ Error: "Invalid Username" })
  //checking if password is correct
  const match = await bcrypt.compare(req.body.password, user?.password);
  //return error if user not found or password don't match
  if ( !match) {
    res.status(401).json({ Error: "Invalid Username or Password oomp" });
  } else {
    //login

    //create access token
    const accessToken = jwt.sign(
        {"username":user.username},
        process.env.ACCESS_TOKEN_KEY,
        {expiresIn: '40s'}
    )

    //create refresh token
    const refreshToken = jwt.sign(
        {"username":user.username},
        process.env.REFRESH_TOKEN_KEY,
        {expiresIn: '1h'}
    )

    //separating other users from the current user
    const otherUsers = userDB.user.filter(u => u.username !== user.username)

    //attaching refresh token with the current user
    const currentUser = {...user, refreshToken}

    //saving updated user info with the other users
    userDB.setUser([...otherUsers, currentUser])

    await fs.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(userDB.user))

    res.cookie('token',  refreshToken, {httpOnly : true, maxAge : 24 * 60 * 60 * 1000})
    res.status(200).json({ accessToken });
  }
};

module.exports = { handleLogin };
