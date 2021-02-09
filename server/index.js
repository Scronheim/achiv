"use strict";
const express = require('express');
const mysqldb = require('./mysqldb');
const config = require('./config')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment');
const FileUpload = require('express-fileupload');
const _ = require('lodash')

const mysqlDB = new mysqldb();
const app = express();
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

app.use(cors());
app.use(FileUpload({createParentPath: true}));

router.route('/api/achievements')
  .get((req, res) => {
    mysqlDB.selectAchievements().then((response) => {
      res.json({results: response})
    });
  })

router.route('/api/aboutMe')
  .patch((req, res) => {
    mysqlDB.updateAboutMe(req.body).then((response) => {
      res.json({results: response})
    });
  })

router.post('/api/login', (req, res) => {
  mysqlDB.searchUserByEmail(req.body.email).then((response) => {
    if (response.length > 0) {
      let passwordIsValid = bcrypt.compareSync(req.body.password, response[0].password);
      if (!passwordIsValid) return res.status(401).send({ auth: false, token: null});
      let token = jwt.sign({ id: response[0].id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.status(200).send({ auth: true, token: token, user: response[0] });
    } else {
      res.status(401).send({ auth: false, token: null});
    }
  });
})

router.post('/api/register', function(req, res) {
  delete req.body.password_confirmation;
  req.body.created_at = moment().utcOffset(5).format('YYYY-MM-DD HH:mm:ss');
  req.body.password = bcrypt.hashSync(req.body.password, 8);
  req.body.is_admin = 0;
  mysqlDB.insertUser(req.body).then(() => {
    mysqlDB.searchUserByEmail(req.body.email).then((response) => {
      let token = jwt.sign({id: response[0].id}, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      res.json({success: true, data: {auth: true, token: token, user: response[0]}});
    })
  })
    .catch((err) => {
      res.json({success: false, error: err});
    })
});

router.get('/api/me', function(req, res) {
  let token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    mysqlDB.searchUserById(decoded.id).then((response) => {
      delete response[0].password
      res.json(response[0]);
    });
  });
});

let port = process.env.PORT || 3000;
app.use(router)
app.listen(port, function() {
  console.log(`${moment().utcOffset(5).format('YYYY-MM-DD HH:mm:ss')} | Express server listening on port ${port}`)
})