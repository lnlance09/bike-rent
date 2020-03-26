import { connect, Provider } from "react-redux"
import { Container, Header } from "semantic-ui-react"
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

		return (
			<Provider store={store}>
				<div className="mainWrapper bikesPage">
					<PageHeader
						activeItem="bikes"
						authenticated={auth}
						items={settings.header.items}
						language={settings.language}
						languages={settings.languages}
						showMainContent={false}
						signInButton={settings.header.signInButton}
						signUpButton={settings.header.signUpButton}
						{...this.props}
					/>

					<Container className="mainContainer">
						<Header size="huge">View our bikes</Header>

						<BikesList
							emptyMsgContent="There are no bikes available"
							history={this.props.history}
							key="bike"
							useCards={true}
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
