const express = require('express')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const routeClient = require("./routes/client/index")
const routeAdmin = require("./routes/admin/index")
const db = require("./config/database")

const app = express()

// use method override
app.use(methodOverride('_method'))

// use body parser
app.use(bodyParser.urlencoded({ extended: false }))

//use flash
app.use(cookieParser('ABC'));
app.use(session({
  secret: 'yourSecretKey',  // Khoá bí mật để mã hoá session ID
}));
app.use(flash());

// use file env
require("dotenv").config();

// connect db
db.connectDB(process.env.MONGO_URL)

// use pug
app.set("views", "./views");
app.set("view engine", "pug");

// use static file
app.use(express.static("./public"))

// Route
routeClient(app);
routeAdmin(app);


const PORT = process.env.PORT || 3000;

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})