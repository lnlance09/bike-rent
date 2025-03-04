import { connect, Provider } from "react-redux"
import { Container, Grid } from "semantic-ui-react"
import { DisplayMetaTags } from "utils/metaFunctions"
import React, { Component } from "react"
import queryString from "query-string"
import Authentication from "components/secondary/authentication/v1/"
import PageFooter from "components/primary/footer/v1/"
import PageHeader from "components/primary/header/v1/"
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
		const { auth, type } = this.state
		const { settings } = this.props
		const { signinPage } = settings

		return (
			<Provider store={store}>
				<DisplayMetaTags
					page="signin"
					props={this.props}
					seo={signinPage.seo}
					state={this.state}
				/>

				<PageHeader
					activeItem="signin"
					authenticated={auth}
					backgroundColor={settings.header.backgroundColor}
					// content={BookingForm}
					items={settings.header.items}
					language={settings.language}
					languages={settings.languages}
					logo={settings.header.logo}
					logoText={settings.header.logoText}
					showMainContent={false}
					signInButton={settings.header.signInButton}
					signUpButton={settings.header.signUpButton}
					{...this.props}
				/>
				<div className="mainWrapper signInPage">
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
		...state.app,
		...ownProps
	}
}

export default connect(mapStateToProps, {})(Signin)
