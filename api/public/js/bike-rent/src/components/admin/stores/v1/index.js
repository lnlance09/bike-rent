import "./style.css"
// import { fetchData } from "./actions"
import { connect } from "react-redux"
// import { Divider } from "semantic-ui-react"
import React, { Component } from "react"
import PropTypes from "prop-types"

class AdminStores extends Component {
	constructor(props) {
		super(props)

		this.state = {}
	}

	render() {
		return <div className="adminStores"></div>
	}
}

AdminStores.propTypes = {
	bearer: PropTypes.string
}

AdminStores.defaultProps = {}

const mapStateToProps = (state, ownProps) => ({
	...state.app,
	...ownProps
})

export default connect(mapStateToProps, {
	// fetchData
})(AdminStores)
