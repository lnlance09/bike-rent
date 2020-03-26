import "./style.css"
// import { fetchData } from "./actions"
import { connect } from "react-redux"
import { Divider, Form, Header, Input, Radio, Select } from "semantic-ui-react"
import { colorOptions } from "utils/selectOptions"
import React, { Component } from "react"
import PropTypes from "prop-types"

class Stores extends Component {
	constructor(props) {
		super(props)

		this.state = {
			addToCartBasic: false,
			addToCartColor: false,
			addToCartInverted: false,
			addToCartText: "",
			aboutTitle: "",
			activeTab: "",
			tabOptions: [
				{ key: "bicycles", text: "Bicycles", value: "bicycles" },
				{ key: "accessories", text: "Accessories", value: "accessories" },
				{ key: "reviews", text: "Reviews", value: "reviews" }
			]
		}
	}

	onChangeAddToCartBasic = (e, { value }) => this.setState({ addToCartBasic: value })

	onChangeAddToCartColor = (e, { value }) => this.setState({ addToCartColor: value })

	onChangeAddToCartInverted = (e, { value }) => this.setState({ addToCartInverted: value })

	onChangeAddToCartText = (e, { value }) => this.setState({ addToCartInverted: value })

	render() {
		// const { bearer } = this.props
		const {
			aboutTitle,
			activeTab,
			addToCartBasic,
			addToCartColor,
			addToCartInverted,
			addToCartText,
			tabOptions
		} = this.state

		return (
			<div className="adminStores">
				<Header size="huge">Individual Store Page</Header>
				<Form>
					<Form.Field>
						<Input
							onChange={(e, { value }) => this.setState({ aboutTitle: value })}
							placeholder="About title"
							value={aboutTitle}
						/>
					</Form.Field>
					<Form.Field>
						<Select
							onChange={(e, { value }) => this.setState({ activeTab: value })}
							options={tabOptions}
							placeholder="Default active tab"
							value={activeTab}
						/>
					</Form.Field>
					<Form.Field>
						<Select
							onChange={(e, { value }) => this.setState({ activeTab: value })}
							options={tabOptions}
							placeholder="Items per row"
							value={activeTab}
						/>
					</Form.Field>

					<Divider hidden />

					<Form.Field>
						<Header>Add to cart button</Header>
					</Form.Field>
					<Form.Field>
						<Header size="small">Basic</Header>
					</Form.Field>
					<Form.Group>
						<Form.Field>
							<Radio
								checked={addToCartBasic}
								label="Yes"
								name="basic"
								onChange={this.toggleAddToCartBasic}
								value={true}
							/>
						</Form.Field>
						<Form.Field>
							<Radio
								checked={!addToCartBasic}
								label="No"
								name="basic"
								onChange={this.toggleAddToCartBasic}
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
								checked={addToCartInverted}
								label="Yes"
								name="basic"
								onChange={this.toggleAddToCartInverted}
								value={true}
							/>
						</Form.Field>
						<Form.Field>
							<Radio
								checked={!addToCartInverted}
								label="No"
								name="basic"
								onChange={this.toggleAddToCartInverted}
								value={false}
							/>
						</Form.Field>
					</Form.Group>
					<Form.Field>
						<Header size="small">Color</Header>
					</Form.Field>
					<Form.Field>
						<Select
							onChange={this.onChangeAddToCartColor}
							options={colorOptions}
							placeholder="Select a color"
							value={addToCartColor}
						/>
					</Form.Field>
					<Form.Field>
						<Header size="small">Text</Header>
					</Form.Field>
					<Form.Field>
						<Input
							onChange={this.onChangeAddToCartText}
							placeholder="Text"
							value={addToCartText}
						/>
					</Form.Field>
				</Form>
			</div>
		)
	}
}

Stores.propTypes = {
	bearer: PropTypes.string,
	type: PropTypes.string
}

Stores.defaultProps = {}

const mapStateToProps = (state, ownProps) => ({
	...state.app,
	...ownProps
})

export default connect(mapStateToProps, {
	// fetchData
})(Stores)
