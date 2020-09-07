const router = require('express').Router();
const { Post, User, Vote, Comment } = require  ('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

// Find all Posts
router.get('/', (req, res) => {
    Post.findAll({
        order: [['created_at', 'DESC']],
        attributes: [
            'id',
            'title',
            'post_body', 
            'created_at'
        ],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => res.json(dbPostData))
    .catch( err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Find a Post by id
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id', 
            'title',
            'post_body',  
            'created_at'
        ],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Create new Post
router.post('/', withAuth, (req, res) => {
    // expects {title: 'string', post_url: 'valid url as string', user_id: integer}
    Post.create({
        title: req.body.title,
        post_body: req.body.post_body,
        user_id: req.session.user_id 
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Update a Post
router.put('/:id', withAuth, (req, res) => {
    Post.update(
        {
            title: req.body.title, 
            post_body: req.body.post_body
        },
        {
            where: {
                id: req.params.id 
            }
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Delete a Post
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id 
        }
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

module.exports = router;