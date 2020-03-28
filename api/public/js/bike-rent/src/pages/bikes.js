import { connect, Provider } from "react-redux"
import { Button, Container, Divider, Header } from "semantic-ui-react"
import React, { Component } from "react"
import BikesList from "components/bikesList/v1/"
import PageFooter from "components/footer/v1/"
import PageHeader from "components/header/v1/"
import PropTypes from "prop-types"
import store from "store"

class Bikes extends Component {
	constructor(props) {
		super(props)

		const currentState = store.getState()
		const user = currentState.user
		const auth = user.authenticated
		const bearer = user.bearer

		this.state = {
			auth,
			bearer
		}
	}

	componentDidMount() {}

	render() {
		const { auth } = this.state
		const { settings } = this.props
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
						<Header size="huge">{bikesPage.title}</Header>

						{bikesPage.useCards === "0" && <Divider />}

						<BikesList
							emptyMsgContent="There are no bikes available"
							extra={ctaButton.visible === "1" ? CtaButton : null}
							history={this.props.history}
							key="bike"
							useCards={bikesPage.useCards === "1"}
						/>
					</Container>

					<PageFooter footerData={settings.footer} history={this.props.history} />
				</div>
			</Provider>
		)
	}
}

Bikes.propTypes = {
	settings: PropTypes.object
}

Bikes.defaultProps = {}

const mapStateToProps = (state, ownProps) => {
	return {
		...state.app,
		...ownProps
	}
}

export default connect(mapStateToProps, {})(Bikes)
