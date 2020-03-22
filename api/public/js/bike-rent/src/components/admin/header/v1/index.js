import "./style.css"
// import { fetchData } from "./actions"
import { connect } from "react-redux"
import { Divider } from "semantic-ui-react"
import React, { Component } from "react"
import PropTypes from "prop-types"

class AdminHeader extends Component {
	constructor(props) {
		super(props)

		this.state = {}
	}

	render() {
		const { bearer } = this.props

		return <div className="adminCss"></div>
	}
}

AdminHeader.propTypes = {
	bearer: PropTypes.string
}

AdminHeader.defaultProps = {}

const mapStateToProps = (state, ownProps) => ({
	...state.app,
	...ownProps
})

export default connect(mapStateToProps, {
	// fetchData
})(AdminHeader)
