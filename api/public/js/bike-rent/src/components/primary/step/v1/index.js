import "./style.css"
import { Icon, Step } from "semantic-ui-react"
import React, { Component } from "react"
import PropTypes from "prop-types"

class StepProcess extends Component {
	render() {
		const { activeItem, index, noMargin, steps } = this.props

		return (
			<Step.Group
				className={`stepProcess ${noMargin ? "noMargin" : ""}`}
				stackable="tablet"
				widths={3}
			>
				{steps.map((step, i) => (
					<Step active={activeItem === step.name} disabled={i > index} key={step.name}>
						<Icon
							color={i >= index ? "black" : "green"}
							name={i >= index ? step.icon : "checkmark"}
						/>
						<Step.Content>
							<Step.Title>{step.title}</Step.Title>
							<Step.Description>{step.description}</Step.Description>
						</Step.Content>
					</Step>
				))}
			</Step.Group>
		)
	}
}

StepProcess.propTypes = {
	activeItem: PropTypes.string,
	index: PropTypes.number,
	noMargin: PropTypes.bool,
	steps: PropTypes.arrayOf(
		PropTypes.shape({
			description: PropTypes.string,
			icon: PropTypes.string,
			title: PropTypes.string
		})
	)
}

StepProcess.defaultProps = {
	activeItem: "store",
	index: 0,
	noMargin: true,
	steps: [
		{
			description: "Find a convenient location",
			icon: "building",
			name: "store",
			title: "Pick a store"
		},
		{
			description: "Find the bike that fits you",
			icon: "bicycle",
			name: "bike",
			title: "Pick a bike"
		},
		{
			description: "",
			icon: "credit card",
			name: "checkout",
			title: "Check out"
		}
	]
}

export default StepProcess
