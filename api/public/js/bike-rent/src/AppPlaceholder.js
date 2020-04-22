import "css/app.css"
import { Container, Image } from "semantic-ui-react"
import React, { Component } from "react"
import LoadingIcon from "images/logos/bike-loading.gif"

class AppPlaceholder extends Component {
	render() {
		return (
			<Container className="appPlaceholderContainer" fluid textAlign="center">
				<div className="appPlaceholderLogo">
					<Image centered src={LoadingIcon} />
				</div>
			</Container>
		)
	}
}

export default AppPlaceholder
