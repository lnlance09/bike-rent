import { connect, Provider } from "react-redux"
import { Link } from "react-router-dom"
import { Container } from "semantic-ui-react"
import PageFooter from "components/footer/v1/"
import PageHeader from "components/header/v1/"
import PropTypes from "prop-types"
import React, { Component } from "react"
import store from "store"

class Bikes extends Component {
	constructor(props) {
		super(props)

		const currentState = store.getState()
		const user = currentState.user
		const auth = user.authenticated
		const bearer = user.bearer

		this.state = {

		}
	}

	componentDidMount() {}

	render() {
		const { startDate } = this.state
		const {} = this.props

		return (
			<Provider store={store}>
				<div className="homePage">
					<PageHeader activeItem="bikes" {...this.props} />

					<PageFooter />
				</div>
			</Provider>
		)
	}
}

Bikes.propTypes = {}

Bikes.defaultProps = {}

const mapStateToProps = (state, ownProps) => {
	return {
		...state.Bikes,
		...ownProps
	}
}

export default connect(mapStateToProps, {})(Bikes)
