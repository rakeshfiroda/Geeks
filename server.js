const path = require("path")
const express = require("express")
const jwt = require("jsonwebtoken");
var cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());
// app.use(auth);
app.use('/', require(path.join(__dirname, 'routes')));
app.use(express.static(__dirname));

app.listen(3000, () => {
    console.log("Server Started..");
});

async function auth(req, res, next) {
    console.log("authenticating user");
    try {
        const token = req.cookies['token'];
        const id = req.cookies['id'];
        const authData = await jwt.verify(token, "khuljasimsim");
        const userId = authData['_id'];

        if (userId !== id) {
            console.log("You are not authorised!");
            // res.redirect("/");
            next();
        } else {
            next();
        }
    } catch (e) {
        console.log("Seems suspicious authorisation revoked!");
        res.redirect("/");
    }
}
