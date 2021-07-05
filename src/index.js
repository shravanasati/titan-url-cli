const inquirer = require("inquirer")
const http = require("http")

const shorten = (url, aliasType, slug) => {
	const options = {
		hostname: "localhost",
		port: 5000,
		path: "/shorten",
		method: "GET",
		headers: {
			"original-url": url,
			"alias-type": aliasType,
			"slug": slug
		}
	}

	const req = http.get(options, res => {
		res.on('data', resp => {
			let jsonResp = JSON.parse(resp)
			let ok = jsonResp["ok"]
			let message = jsonResp["message"]

			if (!ok) {
				console.log(`\x1b[31m An error occured: ${message} \x1b[0m`) // * red color for failure
			}
			else {
				console.log(`\x1b[32m Here's your shortened URL: ${message} \x1b[0m`) // * green color for success
			}
		})
	})

	req.on('error', error => {
		console.error(`An error occured: ${error}`)
	})

	req.end()
}

inquirer
	.prompt([
		{ "type": "input", "name": "url", "message": "Enter the URL you want to shorten:" },
		{ "type": "list", "name": "aliasType", "message": "Choose the alias type:", "choices": ["random", "custom"] }
	])
	.then(answers => {
		let url = answers["url"]
		const aliasType = answers["aliasType"]

		if (aliasType == "random") {
			const slug = ""
			shorten(url, aliasType, slug)

		} else {
			inquirer
				.prompt([{ "type": "input", "name": "slug", "message": "Enter the custom slug you want for the shortned URL:" }])
				.then(slug_answers => {
					const slug = slug_answers["slug"]
					shorten(url, aliasType, slug)
				})
		}
	})