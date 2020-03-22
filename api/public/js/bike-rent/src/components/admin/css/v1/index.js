import "./style.css"
import { editCss } from "redux/actions/app"
import { connect } from "react-redux"
import { Button, Divider } from "semantic-ui-react"
import React, { Component } from "react"
import AceEditor from "react-ace"
import PropTypes from "prop-types"
import "ace-builds/src-noconflict/mode-css"
import "ace-builds/src-noconflict/theme-terminal"

class AdminCss extends Component {
	constructor(props) {
		super(props)

		this.state = {
			code: this.props.css
		}
	}

	render() {
		const { bearer } = this.props
		const { code } = this.state

		return (
			<div className="adminCss">
				<AceEditor
					highlightActiveLine
					fontSize={16}
					mode="css"
					name="cssEditor"
					onChange={code => this.setState({ code })}
					theme="terminal"
					value={code}
				/>
				<Divider />
				<Button
					color="blue"
					content="Update CSS"
					fluid
					onClick={() => {
						this.props.editCss({ bearer, css: code })
					}}
					size="big"
				/>
			</div>
		)
	}
}

AdminCss.propTypes = {
	bearer: PropTypes.string,
	css: PropTypes.string,
	editCss: PropTypes.func
}

AdminCss.defaultProps = {
	editCss
}

const mapStateToProps = (state, ownProps) => ({
	...state.app,
	...ownProps
})

export default connect(mapStateToProps, {
	editCss
})(AdminCss)
