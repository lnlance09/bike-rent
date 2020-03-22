import "./style.css"
import { submitHeaderForm } from "redux/actions/app"
import { connect } from "react-redux"
import { colorOptions, pageOptions } from "utils/selectOptions"
import { Button, Divider, Form, Header, Input, Radio, Select } from "semantic-ui-react"
import React, { Component } from "react"
import PropTypes from "prop-types"

class AdminHeader extends Component {
	constructor(props) {
		super(props)

		const { headerData } = this.props

		this.state = {
			listItems: headerData.items,
			signInBasic: false,
			signInColor: "red",
			signInInverted: false,
			signInText: "",
			signUpBasic: false,
			signUpColor: "red",
			signUpInverted: false,
			signUpText: ""
		}
	}

	componentDidMount() {
		this.setState({
			colorOptions,
			pageOptions
		})
	}

	changeSignInText = (e, { value }) => this.setState({ signInText: value })

	toggleBasic = (e, { value }) => this.setState({ basic: value })

	render() {
		const { bearer } = this.props
		const {
			colorOptions,
			listItems,
			pageOptions,
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
						<Header>List Items</Header>
					</Form.Field>

					<Divider hidden />

					{listItems.map((item, i) => (
						<Form.Group key={`headerListItem${i}`}>
							<Form.Field width={1}>
								<Button
									color="red"
									icon="close"
									onClick={() => this.handleFirstRemove(i)}
								/>
							</Form.Field>
							<Form.Field width={8}>
								<Input
									onChange={e => this.handleFirstChange(e, i)}
									placeholder="Text"
									value={item.text}
								/>
							</Form.Field>
							<Form.Field width={7}>
								<Select
									options={[
										{ key: "about", value: "about", text: "About" },
										{ key: "contact", value: "contact", text: "Contact" }
									]}
									placeholder="Links to"
								/>
							</Form.Field>
						</Form.Group>
					))}

					<Divider hidden />

					<Form.Field>
						<Header>Sign In button</Header>
					</Form.Field>
					<Divider hidden />
					<Form.Field>
						<Header size="small">Basic</Header>
					</Form.Field>
					<Form.Group>
						<Form.Field>
							<Radio
								checked={signInBasic}
								label="Yes"
								name="basic"
								onChange={this.toggleSignInBasic}
								value={true}
							/>
						</Form.Field>
						<Form.Field>
							<Radio
								checked={!signInBasic}
								label="No"
								name="basic"
								onChange={this.toggleSignInBasic}
								value={false}
							/>
						</Form.Field>
					</Form.Group>
					<Form.Field>
						<Header size="small">Inverted</Header>
					</Form.Field>
					<Form.Group>
						<Form.Field>
							<Radio
								checked={signInInverted}
								label="Yes"
								name="basic"
								onChange={this.toggleSignInInverted}
								value={true}
							/>
						</Form.Field>
						<Form.Field>
							<Radio
								checked={!signInInverted}
								label="No"
								name="basic"
								onChange={this.toggleSignInInverted}
								value={false}
							/>
						</Form.Field>
					</Form.Group>
					<Form.Field>
						<Header size="small">Color</Header>
					</Form.Field>
					<Form.Field>
						<Select
							onChange={this.onChangeSignInColor}
							options={colorOptions}
							placeholder="Select a color"
							value={signInColor}
						/>
					</Form.Field>
					<Form.Field>
						<Header size="small">Text</Header>
					</Form.Field>
					<Form.Field>
						<Input
							onChange={this.changeSignInText}
							placeholder="Text"
							value={signInText}
						/>
					</Form.Field>

					<Divider hidden section />
					<Form.Field>
						<Header>Sign Up button</Header>
					</Form.Field>
					<Divider hidden />
					<Form.Field>
						<Header size="small">Basic</Header>
					</Form.Field>
					<Form.Group>
						<Form.Field>
							<Radio
								checked={signUpBasic}
								label="Yes"
								name="basic"
								onChange={this.toggleSignUpBasic}
								value={true}
							/>
						</Form.Field>
						<Form.Field>
							<Radio
								checked={!signInBasic}
								label="No"
								name="basic"
								onChange={this.toggleSignUpBasic}
								value={false}
							/>
						</Form.Field>
					</Form.Group>
					<Form.Field>
						<Header size="small">Inverted</Header>
					</Form.Field>
					<Form.Group>
						<Form.Field>
							<Radio
								checked={signUpInverted}
								label="Yes"
								name="basic"
								onChange={this.toggleSignUpInverted}
								value={true}
							/>
						</Form.Field>
						<Form.Field>
							<Radio
								checked={!signUpInverted}
								label="No"
								name="basic"
								onChange={this.toggleSignUpInverted}
								value={false}
							/>
						</Form.Field>
					</Form.Group>
					<Form.Field>
						<Header size="small">Color</Header>
					</Form.Field>
					<Form.Field>
						<Select
							onChange={this.onChangeSignUpColor}
							options={colorOptions}
							placeholder="Select a color"
							value={signUpColor}
						/>
					</Form.Field>
					<Form.Field>
						<Header size="small">Text</Header>
					</Form.Field>
					<Form.Field>
						<Input
							onChange={this.changeSignUpText}
							placeholder="Text"
							value={signUpText}
						/>
					</Form.Field>
				</Form>

				<Button color="blue" content="Submit" fluid />
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
	...state.app,
	...ownProps
})

export default connect(mapStateToProps, {
	submitHeaderForm
})(AdminHeader)
