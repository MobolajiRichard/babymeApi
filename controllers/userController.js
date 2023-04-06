const users = require("../model/users.json");
const fs = require("fs/promises");
const path = require("path");
const bcrypt = require("bcrypt");

const userDB = {
  user: users,
  setUser: function (data) {
    this.user = data;
  },
};

const registerUser = async (req, res) => {

 //declaring variables
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;

  //check if any fields are empty then throw error if true
  if (!firstname || !lastname || !username || !email || !password) {
    res.status(406).json({ Error: "All fields are required" });
  }

  //Searching for duplicates password or email
  const duplicateUser = userDB.user.find((u) => u.username === username);
  const duplicateEmail = userDB.user.find((u) => u.email === email);

  //throw error if duplicate username is true
  if (duplicateUser || duplicateEmail) {
    res.sendStatus(409);
  }

//   //throw error if duplicate password is true
//   if (duplicateEmail) {
//     res.status(409).json({ Error: "Email Already Exist" });
//   }

 //Storing details in database
  try {
    //encrypt password
    const hashedPwd = await bcrypt.hash(password, 10)
    //new user object
    const newUser = {
        "firstname":firstname,
        "lastname":lastname,
        "username":username,
        "email":email,
        "roles":[2001],
        "password": hashedPwd,
      };
    //storing new user
    userDB.setUser([...userDB.user, newUser]);
    //connect to database
    await fs.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(userDB.user)
    );
    res.status(201).json(userDB.user);
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
};

module.exports = { registerUser };
