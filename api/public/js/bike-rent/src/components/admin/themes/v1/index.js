import "./style.css"
import { setTheme } from "redux/actions/app"
import { connect, Provider } from "react-redux"
import { Button, Card, Divider, Header, Image } from "semantic-ui-react"
import { capitalizeWord } from "utils/textFunctions"
import React, { Component } from "react"
import PropTypes from "prop-types"
import store from "store"

class AdminThemes extends Component {
	constructor(props) {
		super(props)

		this.state = {}
	}

	render() {
		const { bearer, theme, themes } = this.props

		return (
			<Provider store={store}>
				<div className="adminThemes">
					<Header size="huge">Themes</Header>

					<Divider />

					<Card.Group itemsPerRow={3}>
						{themes.map((item, i) => (
							<Card key={item.title} raised={item.title === theme}>
								<Image src={item.img} wrapped ui={false} />
								<Card.Content>
									<Card.Header>{capitalizeWord(item.title)}</Card.Header>
									<Card.Description>{item.tag}</Card.Description>
								</Card.Content>
								<Card.Content extra>
									<Button
										color={item.title === theme ? "red" : "blue"}
										fluid
										onClick={() =>
											this.props.setTheme({ bearer, theme: item.title })
										}
									>
										{item.title === theme ? "Current theme" : "Use this theme"}
									</Button>
								</Card.Content>
							</Card>
						))}
					</Card.Group>
				</div>
			</Provider>
		)
	}
}

AdminThemes.propTypes = {
	bearer: PropTypes.string,
	setTheme: PropTypes.func,
	theme: PropTypes.string,
	themes: PropTypes.array
}

AdminThemes.defaultProps = {
	setTheme
}

const mapStateToProps = (state, ownProps) => ({
	...state.app,
	...ownProps
})

export default connect(mapStateToProps, {
	setTheme
})(AdminThemes)
