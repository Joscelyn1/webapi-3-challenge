const express = require('express');

const userDb = require('./userDb.js');
const router = express.Router();
//const postDb = require('../posts/postDb.js');
// get all users
router.get('/', (req, res) => {
  userDb
    .get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      console.log(err);
      res
        .status(500)
        .json({ error: 'The users information could not be retrieved.' });
    });
});

// get specific user
router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

// delete user

router.delete('/:id', validateUserId, (req, res) => {
  const { id } = req.params;
  userDb
    .remove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      res.status(500).json({ error: 'Error deleting user' });
    });
});

// edit user

router.put('/:id', validateUserId, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  userDb
    .update(id, { name })
    .then(() => {
      userDb
        .getById(id)
        .then(user => res.status(200).json(user))
        .catch(err => {
          console.log(err);
          res.status(500).json({ error: 'Error getting user' });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Error getting updating user' });
    });
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const { id } = req.params;
  userDb
    .getUserPosts(id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "error getting user's posts" });
    });
});

router.post('/', validateUser, (req, res) => {
  const user = req.body;
  userDb
    .insert(user)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Error inserting user' });
    });
});

// custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;
  userDb.getById(id).then(user => {
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(404).json({ error: 'User with id does not exist' });
    }
  });
}

function validateUser(req, res, next) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (typeof name !== 'string') {
    return res.status(400).json({ error: 'name must be a string' });
  }
  next();
}

function validatePost(req, res, next) {}

module.exports = router;
