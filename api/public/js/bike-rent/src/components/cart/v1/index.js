import "./style.css"
import { formatPlural } from "utils/textFunctions"
import { Button, Divider, List } from "semantic-ui-react"
import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"

class Cart extends Component {
	render() {
		const { editable, items, showCheckoutBtn, showPrices, size, taxRate } = this.props
		let subtotal = 0
		let tax = 0
		let total = 0

		if (items.length > 0) {
			subtotal = items.map(item => item.hours * item.bike.hourlyRate).reduce((a, b) => a + b)
			tax = (subtotal * taxRate).toFixed(2)
			total = parseFloat(subtotal) + parseFloat(tax)
		}

		return (
			<div className="cart">
				<List relaxed="very" size={size} verticalAlign="middle">
					{items.map((item, i) => {
						const { hours, index, bike } = item
						return (
							<List.Item key={`cartItem${i}`}>
								{editable && (
									<List.Content floated="right">
										<Button.Group floated="right">
											<Button
												basic
												icon="plus"
												onClick={() => this.props.addItemHour(index, item)}
											/>
											<Button
												basic
												icon="minus"
												onClick={() =>
													this.props.removeItemHour(index, item)
												}
											/>
											<Button
												basic
												icon="trash"
												onClick={() => this.props.removeItem(index)}
											/>
										</Button.Group>
									</List.Content>
								)}
								{showPrices && (
									<List.Content floated="right">
										${hours * bike.hourlyRate}
									</List.Content>
								)}
								<List.Content>
									<List.Header>{bike.name}</List.Header>
									<List.Description>{bike.description} </List.Description>
									<List.Description>
										{hours} {formatPlural(hours, "hour")}
									</List.Description>
								</List.Content>
							</List.Item>
						)
					})}

					{showPrices && (
						<Fragment>
							<List.Item>
								<List.Content floated="right">${subtotal}</List.Content>
								<List.Content>
									<List.Header>Subtotal</List.Header>
								</List.Content>
							</List.Item>

							<List.Item>
								<List.Content floated="right">${tax}</List.Content>
								<List.Content>
									<List.Header>Tax</List.Header>
								</List.Content>
							</List.Item>

							<List.Item>
								<List.Content floated="right">${total}</List.Content>
								<List.Content>
									<List.Header>Total</List.Header>
								</List.Content>
							</List.Item>
						</Fragment>
					)}
				</List>

				{showCheckoutBtn && (
					<Fragment>
						<Divider />
						<Button
							color="blue"
							content="Checkout"
							fluid
							onClick={() => this.props.history.push("/checkout")}
						/>
					</Fragment>
				)}
			</div>
		)
	}
}

Cart.propTypes = {
	editable: PropTypes.bool,
	items: PropTypes.arrayOf(PropTypes.shape({})),
	showCheckoutBtn: PropTypes.bool,
	showPrices: PropTypes.bool,
	size: PropTypes.string,
	taxRate: PropTypes.string
}

Cart.defaultProps = {
	editable: true,
	items: [],
	showCheckoutBtn: false,
	showPrices: true,
	size: "big",
	taxRate: "0.0875"
}

export default Cart
