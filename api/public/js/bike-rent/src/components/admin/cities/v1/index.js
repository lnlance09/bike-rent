import "./style.css"
import { fetchLocations } from "utils/selectOptions"
import { addCity, editCity, toggleAddCityModal } from "redux/actions/app"
import { connect } from "react-redux"
import {
	Button,
	Divider,
	Dropdown,
	Form,
	Header,
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

class AdminCities extends Component {
	constructor(props) {
		super(props)

		this.state = {
			cityOptions: [],
			currentItem: false,
			descriptionVal: "",
			imageVal: "",
			modalOpen: false,
			newCityId: "",
			newDescription: "",
			newImage: "",
			orderVal: 0,
			q: "",
			visibleVal: ""
		}
	}

	async componentDidMount() {
		const cityOptions = await fetchLocations("")
		this.setState({ cityOptions })
	}

	onChangeDescription = (e, { value }) => this.setState({ descriptionVal: value })

	onChangeImage = (e, { value }) => this.setState({ imageVal: value })

	onChangeNewDescription = (e, { value }) => this.setState({ newDescription: value })

	onChangeNewImage = (e, { value }) => this.setState({ newImage: value })

	setActive = (i, description, image, visible) => {
		if (this.state.currentItem !== i) {
			this.setState({
				currentItem: i,
				descriptionVal: description,
				imageVal: image,
				visibleVal: visible
			})
		}
	}

	toggleVisibilty = (e, { value }) => this.setState({ visibleVal: value === "on" ? "1" : "0" })

	updateSearchTerm = e => {
		const q = e.target.value
		this.setState({ q }, async () => {
			const cityOptions = await fetchLocations(q)
			this.setState({ cityOptions })
		})
	}

	render() {
		const {
			cityOptions,
			currentItem,
			descriptionVal,
			imageVal,
			newCityId,
			newDescription,
			newImage,
			orderVal,
			visibleVal
		} = this.state
		const { bearer, cities, error, errorMsg, modalOpen } = this.props

		const AddCityModal = (
			<Modal
				centered={false}
				closeIcon
				onClose={() => this.props.toggleAddCityModal()}
				open={modalOpen}
			>
				<Modal.Header>Feature a new city</Modal.Header>
				<Modal.Content>
					<Form error={error}>
						<Form.Field>
							<Dropdown
								fluid
								onChange={(e, { value }) => this.setState({ newCityId: value })}
								onSearchChange={this.updateSearchTerm}
								options={cityOptions}
								placeholder="Select a city"
								search
								selection
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
					<Button negative onClick={() => this.props.toggleAddCityModal()}>
						Close
					</Button>
					<Button
						content="Add"
						onClick={() => {
							this.props.addCity({
								bearer,
								description: newDescription,
								id: newCityId,
								image: newImage
							})
						}}
						positive
					/>
				</Modal.Actions>
			</Modal>
		)

		return (
			<div className="adminCities">
				<Header size="huge">Cities</Header>

				<Button
					color="blue"
					content="Add a city"
					icon="add"
					onClick={() => this.props.toggleAddCityModal()}
				/>

				<Divider />

				{cities.count > 0 ? (
					<Item.Group divided relaxed>
						{cities.results.map((item, i) => {
							const { description, image, title, visible } = item
							const isActive = currentItem === i

							return (
								<Item key={`adminCity${i}`}>
									<Item.Image
										onError={i => (i.target.src = ImagePic)}
										rounded
										size="large"
										src={image}
									/>
									<Item.Content>
										<Item.Header as="h1">{title}</Item.Header>
										<Item.Description>
											<Form>
												<TextArea
													onChange={this.onChangeDescription}
													onClick={() =>
														this.setActive(
															i,
															description,
															image,
															visible
														)
													}
													placeholder="Enter a description"
													value={isActive ? descriptionVal : description}
												/>
												<Divider />
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
																visible
															)
														}
														value="off"
													/>
												</Form.Field>
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
															visible
														)
													}
													placeholder="Image"
													value={isActive ? imageVal : image}
												/>
												{isActive && (
													<Fragment>
														<Divider />
														<Button
															content="Update"
															fluid
															onClick={() => {
																this.props.editCity({
																	bearer,
																	description: descriptionVal,
																	id: item.id,
																	image: imageVal,
																	order: orderVal,
																	visible: visibleVal
																})
															}}
															positive
														/>
														{/*<Button content="Remove" fluid negative />*/}
													</Fragment>
												)}
											</Form>
										</Item.Description>
									</Item.Content>
								</Item>
							)
						})}
					</Item.Group>
				) : (
					<div></div>
				)}

				{AddCityModal}
			</div>
		)
	}
}

AdminCities.propTypes = {
	addCity: PropTypes.func,
	bearer: PropTypes.string,
	cities: PropTypes.object,
	editCity: PropTypes.func,
	error: PropTypes.bool,
	errorMsg: PropTypes.string,
	modalOpen: PropTypes.bool,
	toggleAddCityModal: PropTypes.func
}

AdminCities.defaultProps = {
	addCity,
	cities: {
		results: [{}, {}]
	},
	editCity,
	error: false,
	modalOpen: false,
	toggleAddCityModal
}

const mapStateToProps = (state, ownProps) => ({
	...state.app.city,
	...ownProps
})

export default connect(mapStateToProps, {
	addCity,
	editCity,
	toggleAddCityModal
})(AdminCities)
