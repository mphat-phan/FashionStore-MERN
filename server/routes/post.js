const express = require('express');
const router = express.Router();
const verifyToken = require('./../middleware/post');
const Post = require('./../models/Post');

//GET : /api/post
router.get('/', verifyToken, async(req,res) => {
    try {
        const posts = await Post.find({user : req.userID}).populate('user',['username']);
        return res
        .json({
            success:true,
            posts,
        });
        
    } catch (error) {
        console.log(error.message);
        return res
        .status(500)
        .json({
            success: false,
            message: 'Internal server error',
        });
    }
});

// POST : /api/post
router.post('/', verifyToken, async(req, res, next) => {
    const {title,description,url,status} = req.body;
    //Check title invalid
    if(!title){
        return res
        .status(400)
        .json({
            success: false,
            message: 'Tilte is required',
        });
    }
    //All true
    try {
        const newPost = new Post({
            title,
            description,
            url: url.startsWith('https://') ? url : `https://${url}`,
            status: status || 'To learn',
            user: req.userID,
        })
        await newPost.save();
        return res
        .json({
            success: true,
            message: 'Add successfully',
            post: newPost,
        });

    } catch (error) {
        console.log(error.message);
        return res
        .status(500)
        .json({
            success: false,
            message: 'Internal server error',
        });
    }

});

//PUT : /api/post
router.put('/:id', verifyToken, async(req, res, next) => {
    const {title,description,url,status} = req.body;
    //Check title invalid
    if(!title){
        return res
        .status(400)
        .json({
            success: false,
            message: 'Tilte is required',
        });
    }
    //All true
    try {
        let updatedPost = {
            title,
            description: description || '',
            url: (url.startsWith('https://') ? url : `https://${url}`) || '',
            status: status || 'To learn',
        };
        
        const postCheck = {
            _id: req.params.id,
            user: req.userID,
        };

        updatedPost = await Post.findOneAndUpdate(postCheck,updatedPost,{new: true});
        if(!updatedPost){
            return res
            .status(401)
            .json({
                success: false,
                message: 'Post not found or not authorised',
            });
        }

        return res
        .json({
            success: true,
            message: 'Updated successfully',
            post: updatedPost,
        });


    } catch (error) {
        console.log(error.message);
        return res
        .status(500)
        .json({
            success: false,
            message: 'Internal server error',
        });
    }
});

//DELETE : /api/post
router.delete('/:id', verifyToken, async(req, res, next) => {
    try {
        const postCheck = {
            _id: req.params.id,
            user: req.userID,
        };
        const deletedPost = await Post.findOneAndDelete(postCheck);

        if(!deletedPost){
            return res
            .status(401)
            .json({
                success: false,
                message: 'Post not found or not authorised',
            });
        }

        return res
        .json({
            success: true,
            message: 'Deleted Successfully',
        });

    } catch (error) {
        console.log(error.message);
        return res
        .status(500)
        .json({
            success: false,
            message: 'Internal server error',
        });
    }
});

module.exports = router;