const express = require('express');

const userDb = require('./userDb.js');
const router = express.Router();
const postDb = require('../posts/postDb.js');
// get all users
router.get('/', (req, res) => {
  userDb
    .get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: 'The users information could not be retrieved.' });
    });
});

// get specific user
router.get('/:id', (req, res) => {
  const { id } = req.params;
  userDb
    .getById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ error: 'The user with the specified ID does not exist' });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ message: 'The user information could not be retrieved' });
    });
});

// delete user

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  userDb
    .remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(200).json({ deleted });
      } else {
        res
          .status(404)
          .json({ error: 'The user with the specified ID does not exist' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "the user couldn't be removed" });
    });
});

// edit user

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ error: 'Please provide name for the user' });
  }
  userDb
    .update(id, name)
    .then(updated => {
      if (updated) {
        userDb
          .getById(id)
          .then(user => res.status(200).json(user))
          .catch(err => {
            res
              .status(500)
              .json({ error: 'The user information could not be modified' });
          });
      } else {
        res
          .status(404)
          .json({ error: 'The user with the specified ID does not exist' });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'The user information could not be modified' });
    });
});

router.get('/:id/posts', (req, res) => {
  const { id } = req.params;

  if (!id) {
    res
      .status(404)
      .json({ error: 'The user with the specified ID does not exist.' });
  } else {
    postDb
      .getUserPosts(id)
      .then(posts => {
        res.status(200).json(comments);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: 'The posts information could not be retrieved.' });
      });
  }
});

// router.post('/:id/posts', (req, res) => {
//   const { post_id } = req.params;
//   const { text } = req.body;

//   if (text === '' || typeof text !== 'string') {
//     return res
//       .status(400)
//       .json({ error: 'Please provide text for the post.' });
//   }

//   postDb.insert({ text, post_id })
//     .then(({ id: comment_id }) => {
//       Posts.findCommentById(comment_id)
//         .then(([comment]) => {
//           if (comment) {
//             res.status(200).json(comment);
//           } else {
//             res
//               .status(404)
//               .json({
//                 error: 'The post with the specified ID does not exist.'
//               });
//           }
//         })
//         .catch(err => {
//           res
//             .status(500)
//             .json({ error: 'The posts information could not be retrieved.' });
//         });
//     })
//     .catch(err => {
//       res.status(500).json({
//         error: 'There was an error while saving the comment to the database'
//       });
//     });
// });

//custom middleware

function validateUserId(req, res, next) {}

function validateUser(req, res, next) {}

function validatePost(req, res, next) {}

module.exports = router;
