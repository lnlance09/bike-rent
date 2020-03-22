import "./style.css"
// import { fetchData } from "./actions"
import { connect } from "react-redux"
import { Divider } from "semantic-ui-react"
import React, { Component } from "react"
import PropTypes from "prop-types"

class AdminOrders extends Component {
	constructor(props) {
		super(props)

		this.state = {}
	}

	render() {
		const { bearer } = this.props

		return <div className="adminCss"></div>
	}
}

AdminOrders.propTypes = {
	bearer: PropTypes.string
}

AdminOrders.defaultProps = {}

const mapStateToProps = (state, ownProps) => ({
	...state.app,
	...ownProps
})

export default connect(mapStateToProps, {
	// fetchData
})(AdminOrders)
