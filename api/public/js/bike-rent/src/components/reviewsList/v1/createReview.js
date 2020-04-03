import "./style.css"
import { Button, Form, Rating, TextArea } from "semantic-ui-react"
import React, { Component } from "react"
import PropTypes from "prop-types"

class CreateReview extends Component {
	constructor(props) {
		super(props)

		this.state = {
			disabled: true,
			msg: this.props.msg,
			rating: this.props.rating
		}
	}

	componentDidMount() {}

	onChangeMsg = (e, { value }) => this.setState({ disabled: value.length < 15, msg: value })

	onChangeRating = (e, { rating }) => this.setState({ rating: rating })

	render() {
		const { disabled, msg, rating } = this.state

		return (
			<div className="createReviewForm">
				<Form>
					<Form.Field>
						<label>Rating</label>
						<Rating
							defaultRating={rating}
							icon="star"
							maxRating={5}
							onRate={this.onChangeRating}
							size="huge"
							value={rating}
						/>
					</Form.Field>

					<Form.Field>
						<label>Review</label>
						<TextArea
							onChange={this.onChangeMsg}
							placeholder="Leave your thoughts"
							rows={6}
							value={msg}
						/>
					</Form.Field>

					<Button
						color="blue"
						content="Submit"
						disabled={disabled}
						fluid
						onClick={() => {
							this.props.callback(msg, rating)
						}}
					/>
				</Form>
			</div>
		)
	}
}

CreateReview.propTypes = {
	callback: PropTypes.func,
	msg: PropTypes.string,
	rating: PropTypes.string,
	store: PropTypes.shape({
		image: PropTypes.string,
		name: PropTypes.string
	})
}

CreateReview.defaultProps = {
	msg: "",
	rating: 3,
	store: {}
}

export default CreateReview
