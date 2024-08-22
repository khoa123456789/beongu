const db = require(`../models`)
const jwt = require('jsonwebtoken')

const logginSuccessService = (email) => new Promise(async (resolve, reject) => {
  try {
    console.log('Received Email:', email);

    let response = await db.Users.findOne({
      where: { EMAIL: email }, // Thay 'emails' thành 'EMAIL'
      raw: true
    });

    console.log('User Response:', response);
    const token = response && jwt.sign({id: response.id, email: response.EMAIL, name: response.FULLNAME}, 'tringu', {expiresIn: '5d'})
    resolve({
      err: token ? 0 : 3,
      msg: token ? 'OK' : 'User Not Found!',
      token
    });
  } catch (error) {
    console.error('Error in logginSuccessService:', error);
    reject({
      err: 2,
      msg: 'fail at auth service: ' + (error.message || error)
    });
  }
});

  
module.exports = { logginSuccessService }
