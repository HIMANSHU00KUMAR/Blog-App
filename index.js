import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import path from "path";

// import { MongoDBCollectionNamespace } from "mongodb";

const app=express();
const port=3000;

app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://himanshu:Mongo@cluster0.xvr7fqc.mongodb.net/blogData?retryWrites=true&w=majority',);
//   useCreateIndex: true,
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const db = mongoose.connection;

// Handle MongoDB connection events
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  // Connected to MongoDB successfully
  console.log('Connected to MongoDB');
});

// Inside your app.js

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

const Post = mongoose.model('Post', postSchema);
  


// let postsarry=[];

app.get("/",(req,res)=>{
    res.render("home");
})

app.get("/newpost",(req,res)=>{
    res.render("newpost");
})

// app.post("/newpost",(req,res)=>{
//     const newPost = {
//         title: req.body.title,
//         content: req.body.content,
//     };
//     postsarry.push(newPost);
    
//     res.redirect("/post");
// })
app.post('/newpost', async (req, res) => {
    try {
      const { title, content } = req.body;
      const newPost = new Post({ title, content });
      const savedPost = await newPost.save();
      res.redirect("/post");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.get('/post', async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: -1 }); 
      res.render('post', { posts });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});


app.post('/deletepost/:id', async (req, res) => {
    try {
      const postId = req.params.id;
      // Use mongoose's findByIdAndDelete method to delete the post by ID
      await Post.findByIdAndDelete(postId);
      res.redirect('/post');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// app.get("/post",(req,res)=>{
//     // var title=postsarry.title;
//     // var content=postsarry.content;
//     // console.log(postsarry);
//     res.render("post.ejs",{postsarry});
//     // res.send(postsarry);
// })

// app.post("/post",(req,res)=>{
//     var title=req.body["title"];
//     var content=req.body["content"];
//     // console.log(title);
//     // console.log(content);
//     res.render("post.ejs",{title,content});
// })

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
