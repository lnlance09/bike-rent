import "./style.css"
// import { fetchData } from "./actions"
import { connect } from "react-redux"
// import { Divider } from "semantic-ui-react"
import React, { Component } from "react"
import PropTypes from "prop-types"

class AdminBikes extends Component {
	constructor(props) {
		super(props)

		this.state = {}
	}

	render() {
		return <div className="adminBikes"></div>
	}
}

AdminBikes.propTypes = {
	bearer: PropTypes.string
}

AdminBikes.defaultProps = {}

const mapStateToProps = (state, ownProps) => ({
	...state.app,
	...ownProps
})

export default connect(mapStateToProps, {
	// fetchData
})(AdminBikes)
