const inquirer = require("inquirer")
const http = require("http")

const shorten = (url) => {
	const options = {
		hostname: "http://titan-url.herokuapp.com",
		path: "/shorten",
		method: "get",
		data: url
	}
	const req = http.request(options, res => {
		res.on('data', d => {
			console.log(`Here's your shortened URL ${d["message"]}`);
		})
	})

	req.on('error', error => {
		console.error(`An error occured: ${error}`)
	})

	req.end()
}

inquirer
	.prompt([
		{ "type": "input", "name": "url", "message": "Enter the URL you want to shorten:" }
	])
	.then(answers => {
		let url = answers["url"]
		const valid = /^(ftp|http|https):\/\/[^ "]+$/.test(url);

		if (!valid) {
			console.log("The URL you've entered is wrong!");
		}

		else {
			shorten(url)
		}
	})