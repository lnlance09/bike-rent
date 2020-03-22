import { connect, Provider } from "react-redux"
import { getCities } from "redux/actions/city"
import { Container, Header } from "semantic-ui-react"
import React, { Component } from "react"
import CitiesList from "components/citiesList/v1/"
import PageFooter from "components/footer/v1/"
import PageHeader from "components/header/v1/"
import PropTypes from "prop-types"
import store from "store"

class Cities extends Component {
	constructor(props) {
		super(props)

		const params = this.props.match.params
		let { name } = params

		const currentState = store.getState()
		const user = currentState.user
		const auth = user.authenticated
		const bearer = user.bearer

		this.state = {
			auth,
			bearer,
			name
		}
	}

	componentDidMount() {}

	render() {
		const { settings } = this.props
		const { name } = this.state

		return (
			<Provider store={store}>
				<div className="homePage">
					<PageHeader activeItem="cities" {...this.props} />

					<Container className="mainContainer">
						{name ? (
							<div></div>
						) : (
							<div>
								<Header size="huge">Pick a city</Header>

								<CitiesList
									key="city"
									retrieveItems={() => this.props.getCities({})}
									useCards={true}
									{...this.props}
								/>
							</div>
						)}
					</Container>

					<PageFooter footerData={settings.footer} history={this.props.history} />
				</div>
			</Provider>
		)
	}
}

Cities.propTypes = {
	getCities: PropTypes.func,
	settings: PropTypes.object
}

Cities.defaultProps = {
	getCities
}

const mapStateToProps = (state, ownProps) => {
	return {
		...state.Admin,
		...ownProps
	}
}

export default connect(mapStateToProps, {
	getCities
})(Cities)
