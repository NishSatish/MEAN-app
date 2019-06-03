const Post = require('../models/post');

// To save posts
exports.savePost = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/img/" + req.file.filename,
    creator: req.userData.userId
  });

  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added',
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  })
  .catch(err => {
    res.status(500).json({
      message: "Post creation failed"
    });
  });
}

// To edit posts
exports.editPost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if(req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/img/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then(result => {
    // nModified is a property in the 'result' data from the then method
    if (result.n > 0) {
      res.status(200).json({message: "Updated"});
    } else {
      res.status(401).json({message: "Updating failed, no auth"});
    }
  })
  .catch(err => {
    res.status(500).json({
      message: "Post update failed"
    });
  });
}

// To get posts to show
exports.fetchPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "P0sts fetched",
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Posts could not be fetched"
      });
    });
}

// To get information about a post
exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'developer404'});
    }
  })
  .catch(err => {
    res.status(500).json({
      message: "Fetching post failed"
    });
  });
}

// To delete a post
exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    // 'n' is a property of the result data coming from the then method
    if (result.n > 0) {
      res.status(200).json({message: "Post deleted"});
    } else {
      res.status(401).json({message: "Post deletion failed, no auth"});
    }
  })
  .catch(err => {
    res.status(500).json({
      message: "Post creation failed"
    });
  });
}
