const dbURL = 'mongodb+srv://testtest:testtest@node.z327a.mongodb.net/' //The Link to database
const mongoose = require('mongoose')

//Connect to Database
mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then((result) => console.log('Database Connected') ).catch((err) => console.log(err) )

module.exports = mongoose