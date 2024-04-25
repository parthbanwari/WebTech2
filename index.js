const express = require('express');
const mongoose = require('mongoose')
const path = require('path');
const ejs = require('ejs');
const PORT=3000;
const bodyParser = require('body-parser')
const password = encodeURIComponent('123456789#@!')
const url = `mongodb+srv://parthmbanwari2004:${password}@cluster0.q6uzvju.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
// Connect to MongoDB Atlas
mongoose
    .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB Atlas')
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB Atlas:', err.message)
    })

// Define Mongoose schema and model
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
})

const User = mongoose.model('User', userSchema)

const app = express();
// Middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get("/",(req,res)=>{
  res.render(__dirname +'/pages/index');
});
app.get("/login",(req,res)=>{
    res.render(__dirname +'/pages/login');
  });
app.get('/signup', (req, res) => {
  res.render(__dirname + '/pages/signup');
})
//login check
app.post('/login', async (req, res) => {
  try {
      const { username, password } = req.body
      const user = await User.findOne({ username: username })
      if (!user) {
          res.render(__dirname + '/pages/login.ejs', {
              response: 'invalid username or password',
          })
          return
      }
      if (password != user.password) {
          res.render(__dirname + '/pages/login.ejs', {
              response: 'invalid username or password',
          })
          return
      }
      curUser = user
      res.redirect('/')
  } catch (err) {
      console.error('Error during login:', err.message)
      res.status(500).send('Server Error')
    }
})
app.post('/add', async (req, res) => {
  const { username, password } = req.body
  try {
      const newUser = new User({ username, password })
      await newUser.save()
      res.redirect('/')
  } catch (err) {
      console.error('Error saving user:', err.message)
      res.render(__dirname + '/pages/signup')
  }
})
app.listen(PORT,()=>{
console.log(
    `listning ${PORT}`
)
})