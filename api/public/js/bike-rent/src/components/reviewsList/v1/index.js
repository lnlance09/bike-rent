import "./style.css"
import { adjustTimezone } from "utils/dateFunctions"
import { getReviews, toggleLoading } from "./actions"
import { deleteReview, editReview } from "redux/actions/store"
import { connect, Provider } from "react-redux"
import {
	Button,
	Comment,
	Header,
	Icon,
	Modal,
	Rating,
	Segment,
	Visibility
} from "semantic-ui-react"
import React, { Component } from "react"
import CreateReview from "./createReview"
import ImagePic from "images/avatar/small/nan.jpg"
import LazyLoad from "components/lazyLoad/v1/"
import Moment from "react-moment"
import PropTypes from "prop-types"
import store from "store"

class ReviewsList extends Component {
	constructor(props) {
		super(props)

		this.state = {
			currentItem: {},
			deleteModalOpen: false,
			editModalOpen: false,
			loadingMore: false
		}
	}

	componentDidMount() {
		const { storeId, userId } = this.props
		this.props.getReviews({
			page: 0,
			storeId,
			userId,
			visible: 1
		})
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

	setCurrentItem = item => this.setState({ currentItem: item })

	toggleDeleteModal = () => this.setState({ deleteModalOpen: !this.state.deleteModalOpen })

	toggleEditModal = () => this.setState({ editModalOpen: !this.state.editModalOpen })

	render() {
		const { currentItem, deleteModalOpen, editModalOpen } = this.state
		const { bearer, emptyMsgContent, myId, results, showStore, storeId, userId } = this.props

		const DeleteModal = (
			<Modal
				centered={false}
				closeIcon
				onClose={() => this.toggleDeleteModal()}
				open={deleteModalOpen}
			>
				<Modal.Header>Delete your review</Modal.Header>
				<Modal.Content>
					<Modal.Description>
						<p>Are you sure you want to delete this review?</p>
					</Modal.Description>
				</Modal.Content>
				<Modal.Actions>
					<Button negative onClick={() => this.toggleDeleteModal()}>
						Cancel
					</Button>
					<Button
						onClick={() => {
							this.props.deleteReview({
								bearer,
								callback: () => {
									this.toggleDeleteModal()
									this.props.getReviews({
										page: 0,
										storeId,
										userId,
										visible: 1
									})
								},
								id: currentItem.id
							})
						}}
						positive
					>
						Delete
					</Button>
				</Modal.Actions>
			</Modal>
		)

		const EditModal = (
			<Modal
				centered={false}
				closeIcon
				onClose={() => this.toggleEditModal()}
				open={editModalOpen}
			>
				<Modal.Header>Edit your review</Modal.Header>
				<Modal.Content>
					<Modal.Description>
						<CreateReview
							callback={(comment, rating) => {
								this.props.editReview({
									bearer,
									callback: () => {
										this.toggleEditModal()
										this.props.getReviews({
											page: 0,
											storeId,
											userId,
											visible: 1
										})
									},
									comment,
									id: currentItem.id,
									rating
								})
							}}
							msg={currentItem.comment}
							rating={currentItem.rating}
						/>
					</Modal.Description>
				</Modal.Content>
			</Modal>
		)

		const RenderItems = ({ props }) => {
			return results.map((result, i) => {
				if (result.id) {
					const {
						comment,
						date_created,
						rating,
						store_id,
						store_name,
						user_id,
						user_img,
						user_name
					} = result
					return (
						<Comment>
							<Comment.Avatar
								onError={i => (i.target.src = ImagePic)}
								src={user_img === null ? ImagePic : user_img}
							/>
							<Comment.Content>
								<Comment.Author>
									{user_name}
									<Comment.Metadata>
										<Moment
											date={adjustTimezone(date_created)}
											fromNow
											interval={60000}
										/>
										<Rating
											defaultRating={parseInt(rating, 10)}
											disabled
											icon="star"
											maxRating={5}
										/>
									</Comment.Metadata>
								</Comment.Author>
								<Comment.Text>{comment}</Comment.Text>
								{user_id === myId && (
									<Comment.Actions>
										<Comment.Action
											as="a"
											onClick={() => {
												this.setCurrentItem(result)
												this.toggleEditModal()
											}}
										>
											Edit
										</Comment.Action>
										<Comment.Action
											as="a"
											onClick={() => {
												this.setCurrentItem(result)
												this.toggleDeleteModal()
											}}
										>
											Delete
										</Comment.Action>
										{showStore && (
											<Comment.Action
												as="a"
												onClick={() => {
													this.props.history.push(`/stores/${store_id}`)
												}}
											>
												<Icon color="green" name="arrow right" />{" "}
												{store_name}
											</Comment.Action>
										)}
									</Comment.Actions>
								)}
							</Comment.Content>
						</Comment>
					)
				}

				return <LazyLoad card={false} key={`review${i}`} segment />
			})
		}

		return (
			<Provider store={store}>
				<div className="reviewsList">
					{results.length > 0 ? (
						<Visibility
							className="listWrapper"
							continuous
							onBottomVisible={this.loadMore}
						>
							<Comment.Group size="large">
								<RenderItems props={this.props} />
							</Comment.Group>
						</Visibility>
					) : (
						<div className="emptyContainer">
							<Segment placeholder>
								<Header>{emptyMsgContent}</Header>
							</Segment>
						</div>
					)}
				</div>

				{DeleteModal}
				{EditModal}
			</Provider>
		)
	}
}

ReviewsList.propTypes = {
	bearer: PropTypes.string,
	count: PropTypes.string,
	deleteReview: PropTypes.func,
	editReview: PropTypes.func,
	emptyMsgContent: PropTypes.string,
	getReviews: PropTypes.func,
	hasMore: PropTypes.bool,
	loadingMore: PropTypes.bool,
	myId: PropTypes.string,
	page: PropTypes.number,
	results: PropTypes.array,
	showStore: PropTypes.bool,
	storeId: PropTypes.string,
	toggleLoading: PropTypes.func,
	userId: PropTypes.string
}

ReviewsList.defaultProps = {
	count: 10,
	deleteReview,
	editReview,
	emptyMsgContent: "There are no reviews",
	getReviews,
	loadingMore: false,
	page: 0,
	results: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
	showStore: false,
	toggleLoading
}

const mapStateToProps = (state, ownProps) => ({
	...state.reviews,
	...ownProps
})

export default connect(mapStateToProps, {
	deleteReview,
	editReview,
	getReviews,
	toggleLoading
})(ReviewsList)
