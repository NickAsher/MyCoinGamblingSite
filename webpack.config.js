const path = require('path') ;


module.exports = {
    entry : "./APP/public/mycoin.js",
    output : {
        path : path.join(__dirname, "APP/public"),
        filename : "bundle.js"
    }
}