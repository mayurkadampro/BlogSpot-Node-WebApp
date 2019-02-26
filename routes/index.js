var express = require('express');
var router = express.Router();
var BlogPost = require('../models/blogpost');
var Comment = require('../models/comment');
var passport = require("passport");

var loggedin = function (req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/login');
  }
}

var loggedinForEdit = function (req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.send('You Must Login First');
  }
}

var auth = function (req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/blogs');
  }
}


/* GET home page. */
router.get('/',auth, function(req, res) {
  res.redirect('/profile');
});

// NEW ROUTE
router.get('/new', function(req, res) {
  res.render('new',{user: req.user});
});


router.get('/login', function (req, res, next) {
  res.render('login');
});

router.get('/signup', function (req, res, next) {
  res.render('signup');
});

router.get('/logout',function (req, res) {
  req.logout()
  res.redirect('/')
});

////////////////////////////Profile/////////////////////////////////

router.get('/profile',loggedin,function (req, res, next) {
	let id = req.params.id;
	BlogPost.find(id, function(err, allPosts) {
    if (err) {
      console.log('SOMETHING WENT WRONG:');
      console.log(err);
    } else {
      res.render('profile', {user: req.user,blogPosts: allPosts});
    };
  })
});

// SHOW ROUTE FOR LOGIN
router.get('/profile/:id', function(req, res) {
  let id = req.params.id;
  BlogPost.findById(id, function(err, post) {
    if (err) {
      console.log(err);
    } else {
      res.render('showUser', {user: req.user,post});
    };
  });
});

// EDIT ROUTE by Login
router.get('/profile/:id/editUser', function(req, res,next) {
  let id = req.params.id;
  BlogPost.findById(id, function(err, post) {
    if (err) {
      console.log('SOMETHING WENT WRONG')
      console.log(err);
    } else {
      console.log('LOADING PAGE');
      console.log(post.post.stringContent);
      res.render('editUser', {user: req.user,post});
    };
  });
});

// UPDATE ROUTE
router.put('/profile/:id/editUser', function(req, res) {
  let id = req.params.id;
  let content = req.body.content;
  let formattedContent = content.split('\r\n');
  let editedPost = {
    title: req.body.title,
    post: {
      image: req.body.image,
      stringContent: content,
      content: formattedContent
    },
    site: {
      name: req.body.citationName,
      url: req.body.citationUrl
    }
  };
  BlogPost.update({ _id: id }, editedPost, function(err) {
    if (err) {
      console.log(err)
    } else {
      res.redirect(`/profile/${ id }`);
    };
  });
});

// DELETE ROUTE
router.get('/profile/:id/delete',loggedinForEdit, function(req, res) {
  let id = req.params.id;
  BlogPost.findById(id, function(err, blogPost) {
    if (err) {
      console.log(err);
    } else {
      console.log(blogPost);
      res.render('delete', {user: req.user, blogPost });
    };
  });
});

// DELETE ROUTE
router.delete('/profile/:id',loggedinForEdit, function(req, res) {
  let id = req.params.id;
  BlogPost.remove({ _id: id }, function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/profile');
    }
  })
});




/////////////////////////////////////// FOR BLOG ///////////////////////////////

router.get('/blogs', function(req, res) {
  BlogPost.find({}, function(err, allPosts) {
    if (err) {
      console.log('SOMETHING WENT WRONG:');
      console.log(err);
    } else {
      res.render('index', {blogPosts: allPosts});
    };
  });
});



// CREATE ROUTE
router.post('/blogs', function(req, res) {
  console.log(req.body);
  let content = req.body.content;
  let formattedContent = content.split('\r\n');
  let newPost = {
    title: req.body.title,
    meta: {
      date: req.body.date
    },
    post: {
      image: req.body.image,
      stringContent: content,
      content: formattedContent
    },
    site: {
      name: req.body.citationName,
      url: req.body.citationUrl
    }
  };
  BlogPost.create(newPost, function(err, post) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/profile');
    }
  });
});

// SHOW ROUTE
router.get('/blogs/:id', function(req, res) {
  let id = req.params.id;
  BlogPost.findById(id, function(err, post) {
    if (err) {
      console.log(err);
    } else {
      res.render('show', {post});
    };
  });
});



// EDIT ROUTE
router.get('/blogs/:id/edit',loggedinForEdit, function(req, res) {
  let id = req.params.id;
  BlogPost.findById(id, function(err, post) {
    if (err) {
      console.log('SOMETHING WENT WRONG')
      console.log(err);
    } else {
      console.log('LOADING PAGE');
      console.log(post.post.stringContent);
      res.render('edit', {post});
    };
  });
});



// UPDATE ROUTE
router.put('/blogs/:id/edit', function(req, res) {
  let id = req.params.id;
  let content = req.body.content;
  let formattedContent = content.split('\r\n');
  let editedPost = {
    title: req.body.title,
    post: {
      image: req.body.image,
      stringContent: content,
      content: formattedContent
    },
    site: {
      name: req.body.citationName,
      url: req.body.citationUrl
    }
  };
  BlogPost.update({ _id: id }, editedPost, function(err) {
    if (err) {
      console.log(err)
    } else {
      res.redirect(`/blogs/${ id }`);
    };
  });
});

///////////////////////////////////COMMENT //////////////////////////////////////

// ADD COMMENTS
router.post('/blogs/:id/comments', function(req, res) {
  let comment = req.body;
  let id = req.params.id;
  BlogPost.findById(id, function(err, post) {
    if (err) {
      console.log(err);
    } else {
      post.comments.push(comment);
      post.save();
      res.redirect('/blogs/' + id);
    };
  });
});

// DETLETE COMMENTS
router.delete('/blogs/:postId/comments/:commentId/delete',loggedinForEdit, (req, res) => {
  let postId = req.params.postId;
  let commentId = req.params.commentId;
  console.log('postId: ', postId);
  console.log('commentId: ', commentId);
  BlogPost.findById(postId, (err, post) => {
    if (err) {
      console.log(err);
    } else {
      console.log(post);
      let commentToDelete = post.comments.find(function findId(element) {
        return element._id == commentId;
      });
      console.log('COMMENTS ARRAY ----------', post.comments);
      console.log('THIS IS THE COMMENT TO DELETE ----------------', commentToDelete);
      let deleteIndex = post.comments.indexOf(commentToDelete);
      post.comments.splice(deleteIndex, 1);
      post.save();
      res.redirect(`/blogs/${ postId }/#comment-form`);
    };
  });
});



module.exports = router;