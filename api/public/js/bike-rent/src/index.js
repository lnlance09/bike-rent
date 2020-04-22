import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import AppPlaceholder from "./AppPlaceholder"
import * as serviceWorker from "./serviceWorker"

async function getSettings() {
	const response = await fetch(`${window.location.origin}/api/settings/`)
	const data = await response.json()
	return data
}

ReactDOM.render(<AppPlaceholder />, document.getElementById("root"))

getSettings().then(data => {
	ReactDOM.render(<App settings={data} />, document.getElementById("root"))
	serviceWorker.unregister()
})