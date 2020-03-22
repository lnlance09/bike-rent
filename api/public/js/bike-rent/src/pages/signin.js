import { connect, Provider } from "react-redux"
import { Container, Grid } from "semantic-ui-react"
import React, { Component } from "react"
import queryString from "query-string"
import Authentication from "components/authentication/v1/"
import PageFooter from "components/footer/v1/"
import PageHeader from "components/header/v1/"
import PropTypes from "prop-types"
import store from "store"

class Signin extends Component {
	constructor(props) {
		super(props)

		const currentState = store.getState()
		const user = currentState.user
		const auth = user.authenticated
		const qs = queryString.parse(this.props.location.search)

		if (auth && (!user.verify || user.emailVerified)) {
			this.props.history.push("/")
		}

		this.state = {
			type: qs.type
		}
	}

	componentDidMount() {}

	render() {
		const { settings } = this.props
		const { type } = this.state

		return (
			<Provider store={store}>
				<PageHeader activeItem="signin" {...this.props} />

				<div className="signInPage">
					<Container className="signInContainer" textAlign="center">
						<div className="loginForm">
							<Grid textAlign="center" verticalAlign="middle">
								<Grid.Column>
									<Authentication type={type} />
								</Grid.Column>
							</Grid>
						</div>
					</Container>
				</div>

				<PageFooter footerData={settings.footer} history={this.props.history} />
			</Provider>
		)
	}
}

Signin.propTypes = {
	settings: PropTypes.object
}

Signin.defaultProps = {}

const mapStateToProps = (state, ownProps) => {
	return {
		...state.Admin,
		...ownProps
	}
}

export default connect(mapStateToProps, {})(Signin)
