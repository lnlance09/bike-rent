/* eslint-disable react/no-direct-mutation-state */
import "./style.css"
import { submitHeaderForm } from "redux/actions/app"
import { connect } from "react-redux"
import { colorOptions } from "utils/selectOptions"
import { Button, Divider, Form, Header, Input, Radio, Select } from "semantic-ui-react"
import React, { Component } from "react"
import PropTypes from "prop-types"

class AdminHeader extends Component {
	constructor(props) {
		super(props)

		const { headerData } = this.props
		const { backgroundColor, items, logo, logoText, signInButton, signUpButton } = headerData

		this.state = {
			backgroundColor,
			listItems: items,
			logo,
			logoText,
			signInBasic: signInButton.basic,
			signInColor: signInButton.color,
			signInInverted: signInButton.inverted,
			signInText: signInButton.text,
			signUpBasic: signUpButton.basic,
			signUpColor: signUpButton.color,
			signUpInverted: signUpButton.inverted,
			signUpText: signUpButton.text
		}
	}

	componentDidMount() {
		this.setState({ colorOptions })
	}

	changeSignInText = (e, { value }) => this.setState({ signInText: value })

	handleItemLinkChange(e, index) {
		this.state.listItems[index].link = e.target.value
		this.setState({ listItems: this.state.listItems })
	}

	handleItemTextChange(e, index) {
		this.state.listItems[index].text = e.target.value
		this.setState({ listItems: this.state.listItems })
	}

	onChangeBackgroundColor = (e, { value }) => this.setState({ backgroundColor: value })

	onChangeLogo = (e, { value }) => this.setState({ logo: value })

	onChangeLogoText = (e, { value }) => this.setState({ logoText: value })

	onChangeSignInColor = (e, { value }) => this.setState({ signInColor: value })

	onChangeSignInText = (e, { value }) => this.setState({ signInText: value })

	onChangeSignUpColor = (e, { value }) => this.setState({ signUpColor: value })

	onChangeSignUpText = (e, { value }) => this.setState({ signUpText: value })

	toggleSignInBasic = (e, { value }) => this.setState({ signInBasic: value === "on" ? 1 : 0 })

	toggleSignInInverted = (e, { value }) =>
		this.setState({ signInInverted: value === "on" ? 1 : 0 })

	toggleSignUpBasic = (e, { value }) => this.setState({ signUpBasic: value === "on" ? 1 : 0 })

	toggleSignUpInverted = (e, { value }) =>
		this.setState({ signUpInverted: value === "on" ? 1 : 0 })

	render() {
		const { bearer } = this.props
		const {
			backgroundColor,
			colorOptions,
			listItems,
			logo,
			logoText,
			signInBasic,
			signInColor,
			signInInverted,
			signInText,
			signUpBasic,
			signUpColor,
			signUpInverted,
			signUpText
		} = this.state

		return (
			<div className="adminHeader">
				<Form>
					<Form.Field>
						<Header size="small">Logo</Header>
					</Form.Field>
					<Form.Field>
						<Input onChange={this.onChangeLogo} placeholder="Logo" value={logo} />
					</Form.Field>

					<Form.Field>
						<Header size="small">Site name</Header>
					</Form.Field>
					<Form.Field>
						<Input
							onChange={this.onChangeLogoText}
							placeholder="Site name"
							value={logoText}
						/>
					</Form.Field>

					<Form.Field>
						<Header size="small">Background Color</Header>
					</Form.Field>
					<Form.Field>
						<Select
							onChange={this.onChangeBackgroundColor}
							options={colorOptions}
							placeholder="Select a color"
							value={backgroundColor}
						/>
					</Form.Field>

					<Form.Field>
						<Header>List Items</Header>
					</Form.Field>

					{listItems.map((item, i) => (
						<Form.Group key={`headerListItem${i}`}>
							<Form.Field width={8}>
								<Input
									onChange={e => this.handleItemTextChange(e, i)}
									placeholder="Text"
									value={item.text}
								/>
							</Form.Field>
							<Form.Field width={8}>
								<Input
									icon="linkify"
									iconPosition="left"
									onChange={e => this.handleItemLinkChange(e, i)}
									placeholder="Url"
									value={item.link}
								/>
							</Form.Field>
						</Form.Group>
					))}

					<Divider hidden />

					<Form.Field>
						<Header>Sign In button</Header>
					</Form.Field>
					<Form.Group>
						<Form.Field>
							<label>
								<b>Basic</b>
							</label>
						</Form.Field>
						<Form.Field>
							<Radio
								checked={signInBasic}
								label="Yes"
								name="signInBasic"
								onChange={this.toggleSignInBasic}
								value="on"
							/>
						</Form.Field>
						<Form.Field>
							<Radio
								checked={!signInBasic}
								label="No"
								name="signInBasic"
								onChange={this.toggleSignInBasic}
								value="off"
							/>
						</Form.Field>
					</Form.Group>
					<Form.Group>
						<Form.Field>
							<label>
								<b>Inverted</b>
							</label>
						</Form.Field>
						<Form.Field>
							<Radio
								checked={signInInverted}
								label="Yes"
								name="signInInverted"
								onChange={this.toggleSignInInverted}
								value="on"
							/>
						</Form.Field>
						<Form.Field>
							<Radio
								checked={!signInInverted}
								label="No"
								name="signInInverted"
								onChange={this.toggleSignInInverted}
								value="off"
							/>
						</Form.Field>
					</Form.Group>
					<Form.Field>
						<label>Color</label>
						<Select
							onChange={this.onChangeSignInColor}
							options={colorOptions}
							placeholder="Select a color"
							value={signInColor}
						/>
					</Form.Field>
					<Form.Field>
						<label>Text</label>
						<Input
							onChange={this.onChangeSignInText}
							placeholder="Text"
							value={signInText}
						/>
					</Form.Field>

					<Divider hidden section />
					<Form.Field>
						<Header>Sign Up button</Header>
					</Form.Field>
					<Form.Group>
						<Form.Field>
							<label>
								<b>Basic</b>
							</label>
						</Form.Field>
						<Form.Field>
							<Radio
								checked={signUpBasic}
								label="Yes"
								name="signUpBasic"
								onChange={this.toggleSignUpBasic}
								value="on"
							/>
						</Form.Field>
						<Form.Field>
							<Radio
								checked={!signUpBasic}
								label="No"
								name="signUpBasic"
								onChange={this.toggleSignUpBasic}
								value="off"
							/>
						</Form.Field>
					</Form.Group>
					<Form.Group>
						<Form.Field>
							<label>
								<b>Inverted</b>
							</label>
						</Form.Field>
						<Form.Field>
							<Radio
								checked={signUpInverted}
								label="Yes"
								name="signUpInverted"
								onChange={this.toggleSignUpInverted}
								value="on"
							/>
						</Form.Field>
						<Form.Field>
							<Radio
								checked={!signUpInverted}
								label="No"
								name="signUpInverted"
								onChange={this.toggleSignUpInverted}
								value="off"
							/>
						</Form.Field>
					</Form.Group>
					<Form.Field>
						<label>Color</label>
						<Select
							onChange={this.onChangeSignUpColor}
							options={colorOptions}
							placeholder="Select a color"
							value={signUpColor}
						/>
					</Form.Field>
					<Form.Field>
						<label>Text</label>
						<Input
							onChange={this.onChangeSignUpText}
							placeholder="Text"
							value={signUpText}
						/>
					</Form.Field>
				</Form>

				<Divider />

				<Button
					color="blue"
					content="Submit"
					fluid
					onClick={() => {
						this.props.submitHeaderForm({
							backgroundColor,
							bearer,
							listItems,
							logo,
							logoText,
							signInButton: {
								signInBasic,
								signInColor,
								signInInverted,
								signInText
							},
							signUpButton: {
								signUpBasic,
								signUpColor,
								signUpInverted,
								signUpText
							}
						})
					}}
				/>
			</div>
		)
	}
}

AdminHeader.propTypes = {
	bearer: PropTypes.string,
	headerData: PropTypes.object,
	submitHeaderForm: PropTypes.func
}

AdminHeader.defaultProps = {
	submitHeaderForm
}

const mapStateToProps = (state, ownProps) => ({
	...state.app.header,
	...ownProps
})

export default connect(mapStateToProps, {
	submitHeaderForm
})(AdminHeader)
