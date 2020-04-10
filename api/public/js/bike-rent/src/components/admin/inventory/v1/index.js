import "./style.css"
import _ from "lodash"
import { editInventory, getInventory } from "redux/actions/app"
import { fetchStores } from "utils/selectOptions"
import { connect } from "react-redux"
import { Button, Form, Header, Input, Message, Modal, Select, Table } from "semantic-ui-react"
import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"

class AdminInventory extends Component {
	constructor(props) {
		super(props)

		this.state = {
			column: "created_at",
			currentItem: {},
			data: this.props.inventory.results,
			direction: null,
			hourlyRate: "",
			modalOpen: false,
			options: [],
			quantity: "",
			storeId: "1"
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

	onChangeHourlyRate = (e, { value }) => this.setState({ hourlyRate: value })

	onChangeQuantity = (e, { value }) => this.setState({ quantity: value })

	setData = data => this.setState({ data })

	setStore = (e, { value }) => {
		this.setState({ storeId: value }, () => {
			this.props.getInventory({
				callback: data => this.setData(data),
				storeId: value
			})
		})
	}

	toggleModal = () => this.setState({ modalOpen: !this.state.modalOpen })

	render() {
		const {
			column,
			currentItem,
			data,
			direction,
			hourlyRate,
			modalOpen,
			options,
			quantity,
			storeId
		} = this.state
		const { bearer, edit, inventory } = this.props

		const InventoryModal = (
			<Modal centered={false} closeIcon onClose={() => this.toggleModal()} open={modalOpen}>
				<Modal.Header size="huge">Edit this item</Modal.Header>
				<Modal.Content>
					<Form>
						<Form.Group widths="equal">
							<Form.Field>
								<label>Hourly Rate</label>
								<Input
									onChange={this.onChangeHourlyRate}
									placeholder="Hourly rate"
									value={hourlyRate}
								/>
							</Form.Field>
							<Form.Field>
								<label>Quantity</label>
								<Input
									onChange={this.onChangeQuantity}
									placeholder="Hourly rate"
									value={quantity}
								/>
							</Form.Field>
						</Form.Group>
					</Form>
					{edit.error && <Message content={edit.errorMsg} error />}
				</Modal.Content>
				<Modal.Actions>
					<Button
						color="green"
						content="Edit"
						onClick={() => {
							this.props.editInventory({
								bearer,
								callback: () => {
									this.toggleModal()
									this.props.getInventory({
										callback: data => this.setData(data),
										storeId
									})
								},
								hourlyRate,
								id: currentItem.id,
								quantity
							})
						}}
					/>
				</Modal.Actions>
			</Modal>
		)

		return (
			<div className="adminOrders">
				<Header size="huge">Inventory</Header>

				<Form size="big">
					<Select
						fluid
						onChange={this.setStore}
						options={options}
						placeholder="Select a store"
						value={storeId}
					/>
				</Form>

				{inventory.count > 0 ? (
					<Table celled selectable sortable striped structured>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell
									onClick={this.handleSort("created_at")}
									sorted={column === "created_at" ? direction : null}
								>
									Bike
								</Table.HeaderCell>
								<Table.HeaderCell
									onClick={this.handleSort("store_name")}
									sorted={column === "store_name" ? direction : null}
								>
									Hourly Rate
								</Table.HeaderCell>
								<Table.HeaderCell
									onClick={this.handleSort("is_refunded")}
									sorted={column === "is_refunded" ? direction : null}
								>
									Quantity currently available
								</Table.HeaderCell>
							</Table.Row>
						</Table.Header>

						<Table.Body>
							<Fragment>
								{data.map((item, i) => {
									return (
										<Table.Row
											active={item.id === currentItem.id}
											key={`itemRow${i}`}
											onClick={() => {
												this.setState({
													currentItem: item,
													hourlyRate: item.hourly_rate,
													modalOpen: true,
													quantity: item.quantity
												})
											}}
										>
											<Table.Cell>{item.name}</Table.Cell>
											<Table.Cell>${item.hourly_rate}</Table.Cell>
											<Table.Cell>{item.quantity}</Table.Cell>
										</Table.Row>
									)
								})}
							</Fragment>
						</Table.Body>
					</Table>
				) : (
					<Message error header="No results" size="big" />
				)}

				{InventoryModal}
			</div>
		)
	}
}

AdminInventory.propTypes = {
	bearer: PropTypes.string,
	edit: PropTypes.shape({
		error: PropTypes.bool,
		errorMsg: PropTypes.string
	}),
	editInventory: PropTypes.func,
	getInventory: PropTypes.func,
	inventory: PropTypes.shape({
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

AdminInventory.defaultProps = {
	edit: {
		error: false
	},
	editInventory,
	getInventory,
	inventory: {
		count: "0",
		hasMore: false,
		loadingMore: false,
		page: 0,
		results: [{}, {}, {}, {}]
	}
}

const mapStateToProps = (state, ownProps) => ({
	...state.app.inventory,
	...ownProps
})

export default connect(mapStateToProps, {
	editInventory,
	getInventory
})(AdminInventory)
