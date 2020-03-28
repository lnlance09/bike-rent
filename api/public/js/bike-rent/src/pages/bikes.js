import { connect, Provider } from "react-redux"
import { getBike } from "redux/actions/bike"
import { Button, Container, Divider, Header, Image } from "semantic-ui-react"
import React, { Component, Fragment } from "react"
import BikesList from "components/bikesList/v1/"
import ImagePic from "images/images/image-square.png"
import MapBox from "components/mapBox/v1/"
import PageFooter from "components/footer/v1/"
import PageHeader from "components/header/v1/"
import PropTypes from "prop-types"
import store from "store"
import StoresList from "components/storesList/v1/"

class Bikes extends Component {
	constructor(props) {
		super(props)

		const params = this.props.match.params
		let { id } = params

		const currentState = store.getState()
		const user = currentState.user
		const auth = user.authenticated
		const bearer = user.bearer

		this.state = {
			auth,
			bearer,
			id
		}
	}

	async componentDidMount() {
		const { id } = this.state
		if (id) {
			this.props.getBike({ id })
		}
	}

	render() {
		const { auth, id } = this.state
		const { bike, settings } = this.props
		const { bikesPage } = settings
		const { ctaButton } = bikesPage

		const CtaButton = (
			<Button
				basic={ctaButton.basic === "1"}
				color={ctaButton.color}
				content={ctaButton.text}
				inverted={ctaButton.inverted === "1"}
				fluid
			/>
		)

		const SingleBike = props => {
			const { description, image, name } = props.bike

			return (
				<Container textAlign="center">
					<Image
						centered
						onError={i => (i.target.src = ImagePic)}
						rounded
						size="large"
						src={image}
					/>

					<Divider hidden />

					<Header size="huge">{name}</Header>
					<p>{description}</p>

					<Divider hidden />

					<MapBox
						apiKey="AIzaSyD0Hd-I0mmRVa3WxTy-lpNJ-xAyDqWWTxM"
						defaultCenter={{
							lat: 59.95,
							lng: 30.33
						}}
						height="300px"
						lat={59.955413}
						lng={30.337844}
						width="100%"
					/>

					<Header size="huge">Available in {bike.storeCount} stores</Header>

					<Divider hidden />

					<Container textAlign="left">
						<StoresList
							bikeId={id}
							history={this.props.history}
							key="store"
							storesByBike
							useCards={true}
						/>
					</Container>
				</Container>
			)
		}

		return (
			<Provider store={store}>
				<div className="mainWrapper bikesPage">
					<PageHeader
						activeItem="bikes"
						authenticated={auth}
						backgroundColor={settings.header.backgroundColor}
						backgroundImage={bikesPage.hero.img}
						headerOne={bikesPage.hero.headerOne}
						headerTwo={bikesPage.hero.headerTwo}
						items={settings.header.items}
						language={settings.language}
						languages={settings.languages}
						showMainContent={bikesPage.useHeroImage === "1"}
						signInButton={settings.header.signInButton}
						signUpButton={settings.header.signUpButton}
						{...this.props}
					/>

					<Container className="mainContainer">
						{id ? (
							SingleBike(this.props)
						) : (
							<Fragment>
								<Header size="huge">{bikesPage.title}</Header>

								{bikesPage.useCards === "0" && <Divider />}

								<BikesList
									emptyMsgContent="There are no bikes available"
									extra={ctaButton.visible === "1" ? CtaButton : null}
									history={this.props.history}
									key="bike"
									useCards={bikesPage.useCards === "1"}
								/>
							</Fragment>
						)}
					</Container>

					<PageFooter footerData={settings.footer} history={this.props.history} />
				</div>
			</Provider>
		)
	}
}

Bikes.propTypes = {
	bike: PropTypes.shape({
		description: PropTypes.string,
		image: PropTypes.string,
		name: PropTypes.string
	}),
	getBike: PropTypes.func,
	settings: PropTypes.object,
	storeCount: PropTypes.number
}

Bikes.defaultProps = {
	bike: {},
	getBike
}

const mapStateToProps = (state, ownProps) => {
	return {
		...state.bike,
		...ownProps
	}
}

export default connect(mapStateToProps, {
	getBike
})(Bikes)
