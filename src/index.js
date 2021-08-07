#!/usr/bin/env node

// imports
const inquirer = require("inquirer")
const request = require("request")

// colors
const RED = "\x1b[31m"
const GREEN = "\x1b[32m"
const RESET = "\x1b[0m"

// emojis
const GREEN_CHECK_MARK = "\u2705"
const RED_CROSS_MARK = "\u274C"

// shorten function which makes a request to the titan-url api
const shorten = (url, aliasType, slug) => {
	let data = {
		"original-url": url,
		"alias-type": aliasType,
		"slug": slug
	}

	request.post({
		url: "http://titan-url.herokuapp.com/shorten",
		headers: {
			'User-Agent': "titan-url-cli",
			"Content-Type": "application/json"
		},
		json: data
	}, function (error, response, body) {
		let ok = body["ok"]
		let message = body["message"]
	
		if (!ok) {
			console.log(`${RED_CROSS_MARK} ${RED}An error occurred: ${message}${RESET}`) // * red color for failure
		}
		else {
			console.log(`${GREEN_CHECK_MARK} ${GREEN}Here's your shortened URL: ${message}${RESET}`) // * green color for success
		}
	})

}

// main TUI
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
				.prompt([{ "type": "input", "name": "slug", "message": "Enter the custom slug you want for the shortened URL:" }])
				.then(slug_answers => {
					const slug = slug_answers["slug"]
					shorten(url, aliasType, slug)
				})
		}
	})