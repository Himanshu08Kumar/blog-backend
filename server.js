const express = require("express");
const app = express();
const fs = require('fs');
const path = './posts.json';

app.use(express.json());

//loads posts from json file
const loadPosts = () =>{
    const data = fs.readFileSync(path, "utf-8");
    return JSON.parse(data);
}

//save posts  on json file
const savePosts = (posts) =>{
    //for better readablity and indentation
    fs.writeFileSync(path, JSON.stringify(posts, null, 2))
};

//loads posts on server starts
let posts = loadPosts();

app.get("/", (req, res) => {
  //shows all the posts
  res.status(200).json(posts);
});

app.get("/:id", (req, res) => {
  //shows a single post
  const id = parseInt(req.params.id);
  const post = posts.find((post) => post.id === id);
  //It will check the post id is exists or not
  if (!post) {
    //if not then it will display a message in json format
    res.status(404).json({ message: "Post not found!!" });
  } else {
    //id matches it will display that post
    res.status(200).json(post);
  }
});

app.post("/", (req, res) => {
  //create a new post
  const newPost = {
    id: posts.length + 1,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: req.body.date,
  };

  //it will checks that title, content , author and date is provided or not
  if (!newPost.title && !newPost.content && !newPost.author && !newPost.date) {
    //if not then a message will appear
    res.status(400).json({ message: "Title, content, author and date is required" });
  } else {
    //push the new post in the posts array
    posts.push(newPost);
    savePosts(posts);
    res.status(201).json(posts);
  }
});

app.put("/:id", (req, res) => {
  //update a post
  const id = parseInt(req.params.id);
  //before updating it will check if the posts exist or not
  const post = posts.find((post) => post.id === id);
//   console.log(post);

  if (!post) {
    //if not then a message will appear
    res.status(404).json({ message: `user data is not exists!!` });
  } else {
    post.title = req.body.title;
    (post.content = req.body.content),
    (post.author = req.body.author),
    (post.date = req.body.date);

    //update and saves the post
    savePosts(posts)
    res.status(200).json(posts);
  }
});


//delete post by its id
app.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const postIndex = posts.findIndex((post) => post.id === id);
  if (postIndex === -1) {
    //if not found then show the message
    res.status(404).json({ message: "Post not found" });
  } else {
    //remove the post from posts
    posts.splice(postIndex, 1);
    savePosts(posts);
    res.status(200).json(posts);
  }
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
