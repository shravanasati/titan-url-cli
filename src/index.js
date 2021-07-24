const inquirer = require("inquirer")
const http = require("http")

// colors
const RED = "\x1b[31m"
const GREEN = "\x1b[32m"
const RESET = "\x1b[0m"

// emojis
const GREEN_CHECK_MARK = "\u2705"
const RED_CROSS_MARK = "\u274C"

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
				console.log(`${RED_CROSS_MARK} ${RED}An error occured: ${message}${RESET}`) // * red color for failure
			}
			else {
				console.log(`${GREEN_CHECK_MARK} ${GREEN}Here's your shortened URL: ${message}${RESET}`) // * green color for success
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