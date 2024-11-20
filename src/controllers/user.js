const User = require('../services/database/models/user');

/**************************************************
 *
 *                    Get User
 *
 ***************************************************/
exports.getUser = async function (_, res) {
  try {
    const userList = await User.find({});
    res.status(200).json(userList);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

/**************************************************
 *
 *                  Create New User
 *
 ***************************************************/
exports.createNewUser = async function (req, res) {
  const body = req.body;

  // Validate required fields
  const requiredFields = [
    'firstname',
    'lastname',
    'username',
    'password',
    'email',
  ];
  const missingFields = requiredFields.filter((field) => !body[field]);

  if (missingFields.length > 0) {
    return res
      .status(400)
      .json({
        message: `Required fields left blank: [${missingFields.join(', ')}]`,
      });
  }

  const newUser = new User({
    firstname: body.firstname,
    lastname: body.lastname,
    username: body.username,
    displayname: body.displayname || body.username,
    email: body.email,
    password: body.password,
    sex: body.sex || false,
    gender: body.gender || 'Unknown',
    profilepicture: null,
  });

  try {
    const result = await newUser.save();
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating new user:', error);
    res.status(500).json({ message: 'Error creating new user' });
  }
};

/**************************************************
 *
 *                  Delete User
 *
 ***************************************************/
exports.deleteUser = async function (req, res) {
  const { _id } = req.body;

  if (!_id) {
    return res.status(400).json({ message: '_id is required for this route.' });
  }

  try {
    await User.findByIdAndDelete(_id);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};
