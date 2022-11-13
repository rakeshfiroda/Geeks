require("dotenv").config();
const path = require("path");
const express = require("express");
const Cloudant = require("@cloudant/cloudant");
const PouchDB = require("pouchdb");
const jwt = require("jsonwebtoken");

const router = express.Router();

const url = process.env.CLOUDANT_URL;
const username = process.env.CLOUDANT_USERNAME;
const password = process.env.CLOUDANT_PASSWORD;
const baseUrl = process.env.CLOUDANT_BASEURL;
const remoteDbName = process.env.CLOUDANT_DBNAME;

const localDb = new PouchDB('courses');
const cloudant = Cloudant({ url: url, username: username, password: password });
const remoteDb = new PouchDB(`${baseUrl}/${remoteDbName}`, { auth: { username, password } });

PouchDB.sync(localDb, remoteDb, { live: true, retry: true })
	.on('change', function (change) {
		console.log("Data sync successfully");
		localDb.allDocs({ include_docs: true }).then((result) => {
			console.log(JSON.stringify(result));
		});
	}).on('error', function (err) {
		console.log("Some error occured ", err);
	});


router.get('/', (req, res) => {
	// const db = cloudant.db.use("courses");
	// db.search('search', 'authorSearch', { q: 'author: Rakesh Firoda', include_docs: true }, function (err, res) {
	//     console.log(res.rows);
	// });
	res.sendFile(path.join(__dirname, 'index.html'));
});

router.get('/api/getData', async (req, res) => {
	const db = cloudant.db.use("courses");
	const body = await db.view('courses', 'list');
	courses = body.rows;
	res.send(courses);
});

router.get('/get/:id', async (req, res) => {
	const db = cloudant.db.use("courses");
	try {
		let course = await db.get(req.params.id, { include_docs: true });
		res.send(course);
	} catch (e) {
		res.send(null);
	}
});

router.get('/auth', async (req, res) => {
	const db = cloudant.db.use("users");
	let resCode = "0"; // Internal Server Error.
	let name = "";
	try {
		let user = await db.get(req.query.username, { include_docs: true });
		if (user.password === req.query.password) {
			resCode = "1";  // credentials match.
			name = user.name;
			let id = user._id;
			const token = await jwt.sign({ _id: id }, "khuljasimsim");
			res.cookie("token", token);
			res.cookie("id", id);
		} else {
			resCode = "2"; // wrong password.
		}
	} catch (e) {
		resCode = "3"; // user doesn't exist.
	}

	let userDetail = {
		resCode: resCode,
		name: name,
	};
	res.send(userDetail);
});

router.post('/signup', async (req, res) => {
	const db = cloudant.db.use("users");
	try {
		let user = {
			"_id": req.query.uname,
			"name": req.query.name,
			"password": req.query.password,
		};
		const response = await db.insert(user);
		// console.log(response);
		res.send("1");
	} catch (e) {
		res.send("0");
	}
});

router.post('/update/course', async (req, res) => {
	const db = cloudant.db.use("courses");
	let course = await db.get(req.query.id, { include_docs: true });
	const courseName = req.query.newName;
	const updatedCourse = {
		"_id": course._id,
		"name": courseName,
		"author": course.author,
		"image": course.image,
		"_rev": course._rev
	};
	try {
		const response = db.insert(updatedCourse);
		res.send("1");
	} catch (e) {
		if(e.statusCode === 409){
			course = await db.get(req.query.id, { include_docs: true });
			const updatedCourse = {
				"_id": course._id,
				"name": courseName,
				"author": course.author,
				"image": course.image,
				"_rev": course._rev
			};
			try {
				const response = db.insert(updatedCourse);
				res.send("1");
			}catch(err){
				res.send("0");
			}
		}else{
		res.send("0");
		}
	}
});

router.get('/signout', async (req, res) => {
	const token = await jwt.sign({ _id: "hello world" }, "khuljasimsim");
	res.cookie("token", token);
	res.cookie("id", "");
	res.send("1");
});

module.exports = router;


