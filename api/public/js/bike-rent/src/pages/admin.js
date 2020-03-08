import { connect, Provider } from "react-redux"
import { Link } from "react-router-dom"
import {
	Button,
	Container,
	Divider,
	Form,
	Grid,
	Header,
	Icon,
	Image,
	Input,
	List,
	Message,
	Segment,
	Select,
	TextArea
} from "semantic-ui-react"
import PageFooter from "components/footer/v1/"
import PageHeader from "components/header/v1/"
import PropTypes from "prop-types"
import React, { Component } from "react"
import store from "store"

class Admin extends Component {
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
					<PageHeader {...this.props} />

					<PageFooter />
				</div>
			</Provider>
		)
	}
}

Admin.propTypes = {}

Admin.defaultProps = {}

const mapStateToProps = (state, ownProps) => {
	return {
		...state.Admin,
		...ownProps
	}
}

export default connect(mapStateToProps, {})(Admin)