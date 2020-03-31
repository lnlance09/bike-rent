import { connect, Provider } from "react-redux"
import { DisplayMetaTags } from "utils/metaFunctions"
import { Container, Menu } from "semantic-ui-react"
import PageFooter from "components/footer/v1/"
import PageHeader from "components/header/v1/"
import React, { Component } from "react"
import PropTypes from "prop-types"
import store from "store"

class Profile extends Component {
	constructor(props) {
		super(props)

		const currentState = store.getState()
		const user = currentState.user
		const auth = user.authenticated
		const bearer = user.bearer

		this.state = {
			activeItem: "purchases",
			auth,
			bearer
		}
	}

	componentDidMount() {}

	handleItemClick = (e, { name }) => {
		this.setState({ activeItem: name }, () => {
			
		})
	}

	render() {
		const { activeItem, auth } = this.state
		const { settings } = this.props
		const { profilePage } = settings

		return (
			<Provider store={store}>
				<DisplayMetaTags
					page="profile"
					props={this.props}
					state={this.state}
				/>

				<div className="mainWrapper profilePage">
					<PageHeader
						activeItem="profile"
						authenticated={auth}
						backgroundColor={settings.header.backgroundColor}
						// content={BookingForm}
						items={settings.header.items}
						language={settings.language}
						languages={settings.languages}
						showMainContent={false}
						signInButton={settings.header.signInButton}
						signUpButton={settings.header.signUpButton}
						{...this.props}
					/>

					<Container className="mainContainer">
						<Menu pointing secondary>
							<Menu.Item
								active={activeItem === 'purchases'}
								name='purchases'
								onClick={this.handleItemClick}
							/>
							<Menu.Item
								active={activeItem === 'reviews'}
								name='reviews'
								onClick={this.handleItemClick}
							/>
							<Menu.Item
								active={activeItem === 'payment methods'}
								name='payment methods'
								onClick={this.handleItemClick}
							/>
						</Menu>
					</Container>

					<PageFooter footerData={settings.footer} history={this.props.history} />
				</div>
			</Provider>
		)
	}
}

Profile.propTypes = {
	settings: PropTypes.object
}

Profile.defaultProps = {}

const mapStateToProps = (state, ownProps) => {
	return {
		...state.app,
		...ownProps
	}
}

export default connect(mapStateToProps, {})(Profile)
