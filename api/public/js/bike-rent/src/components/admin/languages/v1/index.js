import "./style.css"
import { setLanguages } from "redux/actions/app"
import { connect } from "react-redux"
import { Button, Checkbox, Divider, Form } from "semantic-ui-react"
import React, { Component, Fragment } from "react"
import languages from "languages.json"
import PropTypes from "prop-types"

class AdminLanguages extends Component {
	constructor(props) {
		super(props)

		this.state = {
			selectedLanguages: this.props.languages
		}
	}

	componentDidMount() {}

	handleClick = (e, { value }) => {
		const index = this.state.selectedLanguages.indexOf(value)
		let selectedLanguages = [...this.state.selectedLanguages]

		if (index === -1) {
			selectedLanguages = [...this.state.selectedLanguages, value]
		} else {
			selectedLanguages = this.state.selectedLanguages.filter(i => i !== value)
		}

		this.setState({ selectedLanguages })
	}

	render() {
		const { selectedLanguages } = this.state
		const { bearer } = this.props

		return (
			<div className="adminLanguages">
				{languages.length > 0 && (
					<div>
						<Form>
							{languages.map((item, i) => (
								<Form.Field>
									<Checkbox
										checked={selectedLanguages.indexOf(item.alpha2) !== -1}
										label={item.English}
										onClick={this.handleClick}
										value={item.alpha2}
									/>
								</Form.Field>
							))}
						</Form>
						<Divider />
						<Button
							color="green"
							content="Update"
							onClick={() => {
								this.props.setLanguages({
									bearer,
									languages: selectedLanguages
								})
							}}
							size="big"
						/>
					</div>
				)}
			</div>
		)
	}
}

AdminLanguages.propTypes = {
	bearer: PropTypes.string,
	languages: PropTypes.array,
	setLanguages: PropTypes.func
}

AdminLanguages.defaultProps = {
	languages: [],
	setLanguages
}

const mapStateToProps = (state, ownProps) => ({
	...state.app,
	...ownProps
})

export default connect(mapStateToProps, {
	setLanguages
})(AdminLanguages)
