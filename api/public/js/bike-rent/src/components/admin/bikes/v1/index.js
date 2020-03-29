import "./style.css"
import { addBike, editBike, toggleAddBikeModal } from "redux/actions/app"
import { connect } from "react-redux"
import {
	Button,
	Divider,
	Form,
	Input,
	Item,
	Message,
	Modal,
	Radio,
	TextArea
} from "semantic-ui-react"
import React, { Component, Fragment } from "react"
import ImagePic from "images/images/image-square.png"
import PropTypes from "prop-types"

class AdminBikes extends Component {
	constructor(props) {
		super(props)

		this.state = {
			currentItem: false,
			descriptionVal: "",
			imageVal: "",
			modalOpen: false,
			nameVal: "",
			newName: "",
			newDescription: "",
			newImage: "",
			orderVal: 0,
			visibleVal: false
		}
	}

	onChangeDescription = (e, { value }) => this.setState({ descriptionVal: value })

	onChangeImage = (e, { value }) => this.setState({ imageVal: value })

	onChangeName = (e, { value }) => this.setState({ nameVal: value })

	onChangeNewDescription = (e, { value }) => this.setState({ newDescription: value })

	onChangeNewImage = (e, { value }) => this.setState({ newImage: value })

	onChangeNewName = (e, { value }) => this.setState({ newName: value })

	setActive = (i, description, image, name, visible) => {
		this.setState({
			currentItem: i,
			descriptionVal: description,
			imageVal: image,
			nameVal: name,
			visibleVal: visible
		})
	}

	toggleVisibilty = (e, { value }) => this.setState({ visibleVal: value === "on" ? "1" : "0" })

	render() {
		const {
			currentItem,
			descriptionVal,
			imageVal,
			nameVal,
			newDescription,
			newImage,
			newName,
			orderVal,
			visibleVal
		} = this.state
		const { bearer, bikes, error, errorMsg, modalOpen } = this.props

		const AddBikeModal = (
			<Modal
				centered={false}
				closeIcon
				onClose={() => this.props.toggleAddBikeModal()}
				open={modalOpen}
			>
				<Modal.Header>Add a new bike</Modal.Header>
				<Modal.Content>
					<Form error={error}>
						<Form.Field>
							<Input
								fluid
								onChange={this.onChangeNewName}
								placeholder="Name"
								value={newName}
							/>
						</Form.Field>
						<Form.Field>
							<TextArea
								onChange={this.onChangeNewDescription}
								placeholder="Enter a description"
								value={newDescription}
							/>
						</Form.Field>
						<Form.Field>
							<Input
								fluid
								icon="image"
								iconPosition="left"
								onChange={this.onChangeNewImage}
								placeholder="Image"
								value={newImage}
							/>
						</Form.Field>
						<Message content={errorMsg} error />
					</Form>
				</Modal.Content>
				<Modal.Actions>
					<Button negative onClick={() => this.props.toggleAddBikeModal()}>
						Close
					</Button>
					<Button
						content="Add"
						onClick={() => {
							this.props.addBike({
								bearer,
								description: newDescription,
								name: newName,
								image: newImage
							})
						}}
						positive
					/>
				</Modal.Actions>
			</Modal>
		)

		return (
			<div className="adminBikes">
				<Button
					color="blue"
					content="Add a bike"
					icon="add"
					onClick={() => this.props.toggleAddBikeModal()}
				/>

				<Divider />

				{bikes.count > 0 && (
					<Item.Group divided relaxed>
						{bikes.results.map((item, i) => {
							const { description, image, name, visible } = item
							const isActive = currentItem === i

							return (
								<Item key={`adminBike${i}`}>
									<Item.Image
										onError={i => (i.target.src = ImagePic)}
										rounded
										size="large"
										src={image}
									/>
									<Item.Content>
										<Item.Header as="h1">{name}</Item.Header>
										<Item.Description>
											<Form>
												<Form.Field>
													<Input
														fluid
														onChange={this.onChangeName}
														onClick={() =>
															this.setActive(
																i,
																description,
																image,
																name,
																visible
															)
														}
														placeholder="Enter a name"
														value={isActive ? nameVal : name}
													/>
												</Form.Field>
												<Form.Field>
													<TextArea
														onChange={this.onChangeDescription}
														onClick={() =>
															this.setActive(
																i,
																description,
																image,
																name,
																visible
															)
														}
														placeholder="Enter a description"
														value={
															isActive ? descriptionVal : description
														}
													/>
												</Form.Field>
												<Divider />
												<Form.Field>
													<Input
														fluid
														icon="image"
														iconPosition="left"
														onChange={this.onChangeImage}
														onClick={() =>
															this.setActive(
																i,
																description,
																image,
																name,
																visible
															)
														}
														placeholder="Image"
														value={isActive ? imageVal : image}
													/>
												</Form.Field>
												<Form.Field>
													<label>
														<b>Visible</b>
													</label>
												</Form.Field>
												<Form.Field>
													<Radio
														checked={
															isActive
																? visibleVal === "1"
																: visible === "1"
														}
														label="Yes"
														name="visible"
														onChange={this.toggleVisibilty}
														onClick={() =>
															this.setActive(
																i,
																description,
																image,
																name,
																visible
															)
														}
														value="on"
													/>
												</Form.Field>
												<Form.Field>
													<Radio
														checked={
															isActive
																? visibleVal === "0"
																: visible === "0"
														}
														label="No"
														name="visible"
														onChange={this.toggleVisibilty}
														onClick={() =>
															this.setActive(
																i,
																description,
																image,
																name,
																visible
															)
														}
														value="off"
													/>
												</Form.Field>
												{isActive && (
													<Fragment>
														<Divider />
														<Button
															content="Update"
															fluid
															onClick={() => {
																this.props.editBike({
																	bearer,
																	description: descriptionVal,
																	id: item.id,
																	image: imageVal,
																	name: nameVal,
																	order: orderVal,
																	visible: visibleVal
																})
															}}
															positive
														/>
													</Fragment>
												)}
											</Form>
										</Item.Description>
									</Item.Content>
								</Item>
							)
						})}
					</Item.Group>
				)}

				{AddBikeModal}
			</div>
		)
	}
}

AdminBikes.propTypes = {
	addBike: PropTypes.func,
	bearer: PropTypes.string,
	bikes: PropTypes.shape({
		count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		hasMore: PropTypes.bool,
		loadingMore: PropTypes.bool,
		page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		results: PropTypes.arrayOf(
			PropTypes.shape({
				date_created: PropTypes.string,
				date_updated: PropTypes.string,
				entry: PropTypes.string,
				title: PropTypes.string
			})
		)
	}),
	editBike: PropTypes.func,
	error: PropTypes.bool,
	errorMsg: PropTypes.string,
	modalOpen: PropTypes.bool,
	toggleAddBikeModal: PropTypes.func
}

AdminBikes.defaultProps = {
	addBike,
	bikes: {
		count: "0",
		hasMore: false,
		loadingMore: false,
		page: 0,
		results: [{}, {}, {}, {}]
	},
	editBike,
	error: false,
	modalOpen: false,
	toggleAddBikeModal
}

const mapStateToProps = (state, ownProps) => ({
	...state.app.bike,
	...ownProps
})

export default connect(mapStateToProps, {
	addBike,
	editBike,
	toggleAddBikeModal
})(AdminBikes)
