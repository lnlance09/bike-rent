import "./style.css"
import { adjustTimezone } from "utils/dateFunctions"
import { getOrders, toggleLoading } from "./actions"
import { connect, Provider } from "react-redux"
import { Button, Card, Header, Item, Modal, Segment, Visibility } from "semantic-ui-react"
import React, { Component, Fragment } from "react"
import LazyLoad from "components/lazyLoad/v1/"
import Moment from "react-moment"
import PropTypes from "prop-types"
import ResultItem from "components/item/v1/"
import store from "store"

class OrdersList extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loadingMore: false,
			modalOpen: false
		}
	}

	componentDidMount() {
		const { storeId, userId } = this.props
		this.props.getOrders({ page: 0, storeId, userId })
	}

	componentDidUpdate(prevProps) {
		if (prevProps !== this.props) {
			// this.props.retrieveItems()
		}
	}

	loadMore = () => {
		if (this.props.hasMore && !this.props.loadingMore) {
			// const newPage = parseInt(this.props.page + 1, 10)
		}
	}

	toggleModal = () => this.setState({ modalOpen: !this.state.modalOpen })

	render() {
		const { modalOpen } = this.state
		const { emptyMsgContent, itemsPerRow, results, useCards } = this.props

		const OrderDetailsModal = (
			<Modal centered={false} closeIcon onClose={() => this.toggleModal()} open={modalOpen}>
				<Modal.Header>About this purchase</Modal.Header>
				<Modal.Content>
					<Modal.Description></Modal.Description>
				</Modal.Content>
			</Modal>
		)

		const RenderItems = ({ props }) => {
			return props.results.map((result, i) => {
				const {
					amount_after_tax,
					created_at,
					id,
					is_refunded,
					refund_date,
					store_img,
					store_name
				} = result
				const description = <p>${amount_after_tax}</p>
				let extra = (
					<Fragment>
						<Button
							basic
							color="blue"
							compact
							content="See details"
							onClick={() => {
								this.toggleModal()
							}}
							size="small"
						/>
						<Button
							basic={is_refunded === "1" ? false : true}
							color="red"
							compact
							content={is_refunded === "1" ? "Refunded" : "Get a refund"}
							size="small"
						/>
					</Fragment>
				)
				const meta = (
					<p>
						<Moment date={adjustTimezone(created_at)} fromNow interval={60000} />
					</p>
				)

				if (id) {
					return (
						<ResultItem
							description={description}
							extra={extra}
							history={props.history}
							id={`${props.key}${i}`}
							img={store_img}
							key={`order${i}`}
							meta={meta}
							redirect={false}
							title={store_name}
							url={null}
							useCard={useCards}
						/>
					)
				}

				return <LazyLoad card={useCards} key={`${props.key}${i}`} segment={!useCards} />
			})
		}

		return (
			<Provider store={store}>
				<div className="ordersList">
					{results.length > 0 ? (
						<div>
							<Visibility
								className="listWrapper"
								continuous
								onBottomVisible={this.loadMore}
							>
								{useCards ? (
									<Card.Group itemsPerRow={itemsPerRow} stackable>
										<RenderItems props={this.props} />
									</Card.Group>
								) : (
									<Item.Group divided>
										<RenderItems props={this.props} />
									</Item.Group>
								)}
							</Visibility>
						</div>
					) : (
						<div className="emptyContainer">
							<Segment placeholder>
								<Header icon>{emptyMsgContent}</Header>
							</Segment>
						</div>
					)}

					{OrderDetailsModal}
				</div>
			</Provider>
		)
	}
}

OrdersList.propTypes = {
	count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	emptyMsgContent: PropTypes.string,
	extra: PropTypes.func,
	getOrders: PropTypes.func,
	hasMore: PropTypes.bool,
	history: PropTypes.object,
	itemsPerRow: PropTypes.number,
	key: PropTypes.string,
	loadingMore: PropTypes.bool,
	page: PropTypes.number,
	results: PropTypes.arrayOf(
		PropTypes.shape({
			amount_after_tax: PropTypes.string,
			amount_before_tax: PropTypes.string,
			bike_id: PropTypes.string,
			created_at: PropTypes.string,
			hourly_rate: PropTypes.string,
			id: PropTypes.string,
			image: PropTypes.string,
			is_refunded: PropTypes.string,
			name: PropTypes.string,
			number: PropTypes.string,
			refund_date: PropTypes.string,
			store_id: PropTypes.string,
			store_img: PropTypes.string,
			store_name: PropTypes.string,
			tax: PropTypes.string
		})
	),
	showPics: PropTypes.bool,
	storeId: PropTypes.string,
	toggleLoading: PropTypes.func,
	useCards: PropTypes.bool,
	useInternally: PropTypes.bool,
	userId: PropTypes.string
}

OrdersList.defaultProps = {
	count: 10,
	emptyMsgContent: "There are no orders",
	getOrders,
	itemsPerRow: 3,
	loadingMore: false,
	page: 0,
	results: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
	showPics: true,
	store: {},
	toggleLoading,
	useCards: true,
	useInternally: true
}

const mapStateToProps = (state, ownProps) => ({
	...state.orders,
	...ownProps
})

export default connect(mapStateToProps, {
	getOrders,
	toggleLoading
})(OrdersList)
