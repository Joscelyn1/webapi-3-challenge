/*

1. Add endpoints to retrieve the list of `posts` for a `user` and 
to store a new `post` for a `user`.
*/

const express = require('express');
const router = express.Router();

const postDb = require('./postDb.js');

router.use(express.json());

// get all posts
router.get('/', (req, res) => {
  postDb
    .get()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: 'The posts information could not be retrieved.' });
    });
});

// get specific post
router.get('/:id', (req, res) => {
  const { id } = req.params;
  postDb
    .getById(id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ error: 'The post with the specified ID does not exist' });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ message: 'The post information could not be retrieved' });
    });
});

//delete a post

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  postDb
    .remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(200).json({ deleted });
      } else {
        res
          .status(404)
          .json({ error: 'The post with the specified ID does not exist' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "the post couldn't be removed" });
    });
});

//edit a post
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  if (!text) {
    res.status(400).json({ error: 'Please provide text for the post' });
  }
  postDb
    .update(id, text)
    .then(updated => {
      if (updated) {
        postDb
          .getById(id)
          .then(post => res.status(200).json(post))
          .catch(err => {
            res
              .status(500)
              .json({ error: 'The post information could not be modified' });
          });
      } else {
        res
          .status(404)
          .json({ error: 'The post with the specified ID does not exist' });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'The post information could not be modified' });
    });
});

// custom middleware

function validatePostId(req, res, next) {}

module.exports = router;
