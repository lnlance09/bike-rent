import "./style.css"
import _ from "lodash"
import { createRefund, getOrders } from "redux/actions/app"
import { fetchStores } from "utils/selectOptions"
import { connect } from "react-redux"
import { adjustTimezone } from "utils/dateFunctions"
import { Button, Container, Form, Header, Message, Modal, Select, Table } from "semantic-ui-react"
import React, { Component, Fragment } from "react"
import Moment from "react-moment"
import PropTypes from "prop-types"

class AdminOrders extends Component {
	constructor(props) {
		super(props)

		this.state = {
			column: "created_at",
			currentItem: {},
			data: this.props.orders.results,
			direction: null,
			modalOpen: false,
			options: [],
			storeId: ""
		}
	}

	async componentDidMount() {
		const options = await fetchStores("")
		this.setState({ options })
	}

	handleSort = clickedColumn => () => {
		const { column, data, direction } = this.state
		if (column !== clickedColumn) {
			this.setState({
				column: clickedColumn,
				data: _.sortBy(data, [clickedColumn]),
				direction: "ascending"
			})
			return
		}

		this.setState({
			data: data.reverse(),
			direction: direction === "ascending" ? "descending" : "ascending"
		})
	}

	setData = data => this.setState({ data })

	setStore = (e, { value }) => {
		this.setState({ storeId: value }, () => {
			this.props.getOrders({
				callback: data => this.setData(data),
				storeId: value
			})
		})
	}

	toggleModal = () => this.setState({ modalOpen: !this.state.modalOpen })

	render() {
		const { column, currentItem, data, direction, modalOpen, options, storeId } = this.state
		const { bearer, orders } = this.props

		const OrderModal = (
			<Modal centered={false} closeIcon onClose={() => this.toggleModal()} open={modalOpen}>
				<Modal.Content>
					<Container textAlign="center">
						{currentItem.is_refunded === "0" ? (
							<Fragment>
								<Header size="huge" textAlign="center">
									${currentItem.amount_before_tax} will be refunded.
								</Header>
								<Button
									color="green"
									content="Issue Refund"
									onClick={() => {
										this.props.createRefund({
											bearer,
											callback: () => {
												this.toggleModal()
												this.props.getOrders({
													callback: data => this.setData(data),
													storeId
												})
											},
											id: currentItem.id
										})
									}}
									size="big"
								/>
							</Fragment>
						) : (
							<Fragment>
								<Header size="huge" textAlign="center">
									${currentItem.amount_before_tax} was refunded on{" "}
									<Moment
										date={adjustTimezone(currentItem.refund_date)}
										format="MMM Do Y, h:mm a"
									/>
									.
								</Header>
							</Fragment>
						)}
					</Container>
				</Modal.Content>
			</Modal>
		)

		return (
			<div className="adminOrders">
				<Form size="big">
					<Select
						fluid
						onChange={this.setStore}
						options={options}
						placeholder="Select a store"
						value={storeId}
					/>
				</Form>

				{orders.count > 0 ? (
					<Table celled selectable sortable striped structured>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell
									sorted={column === "created_at" ? direction : null}
									onClick={this.handleSort("created_at")}
									rowSpan="2"
								>
									Date
								</Table.HeaderCell>
								<Table.HeaderCell
									sorted={column === "store_name" ? direction : null}
									onClick={this.handleSort("store_name")}
									rowSpan="2"
								>
									Store
								</Table.HeaderCell>
								<Table.HeaderCell
									sorted={column === "is_refunded" ? direction : null}
									onClick={this.handleSort("is_refunded")}
									rowSpan="2"
								>
									Refunded
								</Table.HeaderCell>
								<Table.HeaderCell colSpan="3">Totals</Table.HeaderCell>
							</Table.Row>

							<Table.Row>
								<Table.HeaderCell
									sorted={column === "amount_before_tax" ? direction : null}
									onClick={this.handleSort("amount_before_tax")}
								>
									Subtotal
								</Table.HeaderCell>
								<Table.HeaderCell
									sorted={column === "amount_after_tax" ? direction : null}
									onClick={this.handleSort("amount_after_tax")}
								>
									Total
								</Table.HeaderCell>
								<Table.HeaderCell
									sorted={column === "tax" ? direction : null}
									onClick={this.handleSort("tax")}
								>
									Tax
								</Table.HeaderCell>
							</Table.Row>
						</Table.Header>

						<Table.Body>
							<Fragment>
								{data.map((item, i) => {
									const refunded = item.is_refunded === "1"
									return (
										<Table.Row
											active={item.id === currentItem.id}
											error={refunded}
											onClick={() => {
												this.setState({
													currentItem: item,
													modalOpen: true
												})
											}}
										>
											<Table.Cell>
												<Moment
													date={adjustTimezone(item.created_at)}
													format="MMM Do Y, h:mm a"
												/>
											</Table.Cell>
											<Table.Cell>{item.store_name}</Table.Cell>
											<Table.Cell>{refunded ? "Yes" : "No"}</Table.Cell>
											<Table.Cell>${item.amount_before_tax}</Table.Cell>
											<Table.Cell>${item.amount_after_tax}</Table.Cell>
											<Table.Cell>${item.tax}</Table.Cell>
										</Table.Row>
									)
								})}
							</Fragment>
						</Table.Body>
					</Table>
				) : (
					<Message error header="No results" size="big" />
				)}

				{OrderModal}
			</div>
		)
	}
}

AdminOrders.propTypes = {
	bearer: PropTypes.string,
	createRefund: PropTypes.func,
	getOrders: PropTypes.func,
	orders: PropTypes.shape({
		count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		hasMore: PropTypes.bool,
		loadingMore: PropTypes.bool,
		page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		results: PropTypes.arrayOf(
			PropTypes.shape({
				amount_after_tax: PropTypes.string,
				amount_before_tax: PropTypes.string,
				created_at: PropTypes.string,
				bike_id: PropTypes.string,
				id: PropTypes.string,
				hourly_rate: PropTypes.string,
				image: PropTypes.string,
				is_refunded: PropTypes.string,
				name: PropTypes.string,
				number: PropTypes.string,
				refund_date: PropTypes.string,
				store_id: PropTypes.string,
				store_name: PropTypes.string,
				tax: PropTypes.string
			})
		)
	})
}

AdminOrders.defaultProps = {
	createRefund,
	getOrders,
	orders: {
		count: "0",
		hasMore: false,
		loadingMore: false,
		page: 0,
		results: [{}, {}, {}, {}]
	}
}

const mapStateToProps = (state, ownProps) => ({
	...state.app.order,
	...ownProps
})

export default connect(mapStateToProps, {
	createRefund,
	getOrders
})(AdminOrders)
