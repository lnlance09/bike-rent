import { connect, Provider } from "react-redux"
import { changeProfilePic } from "components/authentication/v1/actions"
import { adjustTimezone } from "utils/dateFunctions"
import { DisplayMetaTags } from "utils/metaFunctions"
import { Container, Divider, Grid, Header, Icon, Menu } from "semantic-ui-react"
import React, { Component } from "react"
import ImageUpload from "components/imageUpload/v1/"
import Moment from "react-moment"
import PageFooter from "components/footer/v1/"
import PageHeader from "components/header/v1/"
import ReviewsList from "components/reviewsList/v1/"
import PropTypes from "prop-types"
import store from "store"

class Profile extends Component {
	constructor(props) {
		super(props)

		const params = this.props.match.params
		let { tab } = params

		const currentState = store.getState()
		const user = currentState.user
		const auth = user.authenticated
		const bearer = user.bearer
		const userId = auth ? user.data.user.id : null

		this.state = {
			activeItem: tab,
			auth,
			bearer,
			user,
			userId
		}
	}

	componentDidMount() {
		if (!this.state.auth) {
			this.props.history.push("/")
		}
	}

	handleItemClick = (e, { name }) => {
		this.setState({ activeItem: name }, () => {})
	}

	render() {
		const { activeItem, auth, bearer, user, userId } = this.state
		const { settings } = this.props
		const { profilePage } = settings

		return (
			<Provider store={store}>
				<DisplayMetaTags page="profile" props={this.props} state={this.state} />

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
						<Grid>
							<Grid.Column width={4}>
								<ImageUpload
									bearer={bearer}
									callback={(bearer, file) => {
										this.props.changeProfilePic({
											bearer,
											file
										})
									}}
									fluid
									imgSize="small"
									msg="Change your pic"
								/>
							</Grid.Column>
							<Grid.Column width={12}>
								<Header as="h1">
									{user.data.user.name}
									<Header.Subheader>
										<Icon name="clock outline" /> Joined{" "}
										<Moment
											date={adjustTimezone(user.data.user.dateCreated)}
											fromNow
											interval={60000}
										/>
									</Header.Subheader>
								</Header>
							</Grid.Column>
						</Grid>

						<Divider hidden />

						<Menu pointing secondary size="big">
							<Menu.Item
								active={activeItem === "purchases"}
								name="purchases"
								onClick={this.handleItemClick}
							/>
							<Menu.Item
								active={activeItem === "reviews"}
								name="reviews"
								onClick={this.handleItemClick}
							/>
							<Menu.Item
								active={activeItem === "payment methods"}
								name="payment methods"
								onClick={this.handleItemClick}
							/>
						</Menu>

						{activeItem === "reviews" && (
							<ReviewsList bearer={bearer} myId={userId} userId={userId} />
						)}
					</Container>

					<PageFooter footerData={settings.footer} history={this.props.history} />
				</div>
			</Provider>
		)
	}
}

Profile.propTypes = {
	changeProfilePic: PropTypes.func,
	settings: PropTypes.object
}

Profile.defaultProps = {
	changeProfilePic
}

const mapStateToProps = (state, ownProps) => {
	return {
		...state.app,
		...ownProps
	}
}

export default connect(mapStateToProps, {
	changeProfilePic
})(Profile)
