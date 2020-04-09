import "./style.css"
import _ from "lodash"
import { getReviews } from "redux/actions/app"
import { adjustTimezone } from "utils/dateFunctions"
import { fetchStores } from "utils/selectOptions"
import { connect } from "react-redux"
import {
	Button,
	Container,
	Form,
	Header,
	Message,
	Modal,
	Rating,
	Select,
	Table
} from "semantic-ui-react"
import React, { Component, Fragment } from "react"
import Moment from "react-moment"
import PropTypes from "prop-types"

class AdminReviews extends Component {
	constructor(props) {
		super(props)

		this.state = {
			column: "created_at",
			currentItem: {},
			data: this.props.reviews.results,
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
			this.props.getReviews({
				callback: data => this.setData(data),
				storeId: value
			})
		})
	}

	toggleModal = () => this.setState({ modalOpen: !this.state.modalOpen })

	render() {
		const { column, currentItem, data, direction, modalOpen, options, storeId } = this.state
		const { bearer, reviews } = this.props

		const ReviewModal = (
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
									onClick={() => {}}
									size="big"
								/>
							</Fragment>
						) : (
							<Fragment>
								<Header size="huge" textAlign="center">
									${currentItem.amount_before_tax} was refunded on{" "}
									<Moment
										date={adjustTimezone(currentItem.refund_date)}
										format="MMM Do Y, h:mm A"
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
			<div className="adminReviews">
				<Header size="huge">Reviews</Header>

				<Form size="big">
					<Select
						fluid
						onChange={this.setStore}
						options={options}
						placeholder="Select a store"
						value={storeId}
					/>
				</Form>

				{reviews.count > 0 ? (
					<Table celled selectable sortable striped structured>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell
									onClick={this.handleSort("date_created")}
									sorted={column === "date_created" ? direction : null}
								>
									Left On
								</Table.HeaderCell>
								<Table.HeaderCell
									onClick={this.handleSort("user_name")}
									sorted={column === "user_name" ? direction : null}
								>
									Left By
								</Table.HeaderCell>
								<Table.HeaderCell
									onClick={this.handleSort("store_name")}
									sorted={column === "store_name" ? direction : null}
								>
									Store
								</Table.HeaderCell>
								<Table.HeaderCell
									onClick={this.handleSort("rating")}
									sorted={column === "rating" ? direction : null}
								>
									Rating
								</Table.HeaderCell>
								<Table.HeaderCell>Comment</Table.HeaderCell>
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
													currentItem: item
													// modalOpen: true
												})
											}}
										>
											<Table.Cell>
												<Moment
													date={adjustTimezone(item.date_created)}
													format="MMM Do Y, h:mm A"
												/>
											</Table.Cell>
											<Table.Cell>{item.user_name}</Table.Cell>
											<Table.Cell>{item.store_name}</Table.Cell>
											<Table.Cell>
												<Rating
													disabled
													icon="star"
													maxRating={5}
													rating={parseInt(item.rating, 10)}
												/>
											</Table.Cell>
											<Table.Cell>{item.comment}</Table.Cell>
										</Table.Row>
									)
								})}
							</Fragment>
						</Table.Body>
					</Table>
				) : (
					<Message error header="No results" size="big" />
				)}

				{ReviewModal}
			</div>
		)
	}
}

AdminReviews.propTypes = {
	bearer: PropTypes.string,
	getReviews: PropTypes.func,
	reviews: PropTypes.shape({
		count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		hasMore: PropTypes.bool,
		loadingMore: PropTypes.bool,
		page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		results: PropTypes.arrayOf(
			PropTypes.shape({
				comment: PropTypes.string,
				date_created: PropTypes.string,
				id: PropTypes.string,
				rating: PropTypes.string,
				store_id: PropTypes.string,
				store_name: PropTypes.string,
				user_id: PropTypes.string,
				user_img: PropTypes.string,
				user_name: PropTypes.string
			})
		)
	})
}

AdminReviews.defaultProps = {
	getReviews,
	reviews: {
		count: "0",
		hasMore: false,
		loadingMore: false,
		page: 0,
		results: [{}, {}, {}, {}]
	}
}

const mapStateToProps = (state, ownProps) => ({
	...state.app.review,
	...ownProps
})

export default connect(mapStateToProps, {
	getReviews
})(AdminReviews)
