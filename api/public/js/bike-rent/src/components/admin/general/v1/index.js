import "./style.css"
import { submitGeneralInfo } from "redux/actions/app"
import { connect } from "react-redux"
import { Button, Divider, Form, Header, Input } from "semantic-ui-react"
import React, { Component } from "react"
import PropTypes from "prop-types"

class AdminGeneral extends Component {
	constructor(props) {
		super(props)

		const {
			favicon,
			fbAppId,
			fbPageUrl,
			instagramScreenName,
			twitterScreenName
		} = this.props.basic

		this.state = {
			favicon,
			fbAppId,
			fbPageUrl,
			instagramScreenName,
			twitterScreenName
		}
	}

	componentDidMount() {}

	onChangeFavicon = (e, { value }) => this.setState({ favicon: value })

	onChangeFbAppId = (e, { value }) => this.setState({ fbAppId: value })

	onChangeFbHandle = (e, { value }) => this.setState({ fbPageUrl: value })

	onChangeInstagramHandle = (e, { value }) => this.setState({ instagramScreenName: value })

	onChangeTwitterHandle = (e, { value }) => this.setState({ twitterScreenName: value })

	render() {
		const { bearer } = this.props
		const { favicon, fbAppId, fbPageUrl, instagramScreenName, twitterScreenName } = this.state

		return (
			<div className="adminGeneral">
				<Header size="huge">General</Header>

				<Form size="big">
					<Form.Field>
						<Header size="small">Favicon</Header>
					</Form.Field>
					<Form.Field>
						<Input
							onChange={this.onChangeFavicon}
							placeholder="Favicon"
							value={favicon}
						/>
					</Form.Field>

					<Form.Field>
						<Header size="small">Facebook App ID</Header>
					</Form.Field>
					<Form.Field>
						<Input
							icon="facebook f"
							iconPosition="left"
							onChange={this.onChangeFbAppId}
							placeholder="Facebook App ID"
							value={fbAppId}
						/>
					</Form.Field>

					<Form.Field>
						<Header size="small">Facebook Handle</Header>
					</Form.Field>
					<Form.Field>
						<Input
							icon="facebook f"
							iconPosition="left"
							onChange={this.onChangeFbHandle}
							placeholder="Facebook Handle"
							value={fbPageUrl}
						/>
					</Form.Field>

					<Form.Field>
						<Header size="small">Twitter Handle</Header>
					</Form.Field>
					<Form.Field>
						<Input
							icon="twitter"
							iconPosition="left"
							onChange={this.onChangeTwitterHandle}
							placeholder="Twitter Handle"
							value={twitterScreenName}
						/>
					</Form.Field>

					<Form.Field>
						<Header size="small">Instagram Handle</Header>
					</Form.Field>
					<Form.Field>
						<Input
							icon="instagram"
							iconPosition="left"
							onChange={this.onChangeInstagramHandle}
							placeholder="Instagram Handle"
							value={instagramScreenName}
						/>
					</Form.Field>
				</Form>

				<Divider />

				<Button
					color="blue"
					content="Submit"
					fluid
					onClick={() => {
						this.props.submitGeneralInfo({
							bearer,
							favicon,
							fbAppId,
							fbPageUrl,
							instagramScreenName,
							twitterScreenName
						})
					}}
				/>
			</div>
		)
	}
}

AdminGeneral.propTypes = {
	bearer: PropTypes.string,
	basic: PropTypes.shape({
		favicon: PropTypes.string,
		fbAppId: PropTypes.string,
		fbPageUrl: PropTypes.string,
		instagramScreenName: PropTypes.string,
		submitGeneralInfo: PropTypes.func,
		twitterScreenNam: PropTypes.string
	})
}

AdminGeneral.defaultProps = {
	basic: {},
	submitGeneralInfo
}

const mapStateToProps = (state, ownProps) => ({
	...state.app.general,
	...ownProps
})

export default connect(mapStateToProps, {
	submitGeneralInfo
})(AdminGeneral)
