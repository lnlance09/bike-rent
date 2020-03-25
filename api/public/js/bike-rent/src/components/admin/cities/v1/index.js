import "./style.css"
import { addCity, editCity, toggleAddCityModal } from "redux/actions/app"
import { connect } from "react-redux"
import {
	Button,
	Divider,
	Dropdown,
	Form,
	Input,
	Item,
	Message,
	Modal,
	TextArea
} from "semantic-ui-react"
import React, { Component, Fragment } from "react"
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
			q: ""
		}

		this.fetchLocations("")
	}

	// TODO - Replace this with one used in selectOptions
	fetchLocations(q) {
		return fetch(`${window.location.origin}/api/city/getLocations?q=${q}`, {
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(response => {
				if (response.ok) {
					response.json().then(data => {
						const cityOptions = data.locations
						this.setState({ cityOptions })
					})
				}
			})
			.catch(err => console.log(err))
	}

	onChangeDescription = (e, { value }) => this.setState({ descriptionVal: value })

	onChangeImage = (e, { value }) => this.setState({ imageVal: value })

	onChangeNewDescription = (e, { value }) => this.setState({ newDescription: value })

	onChangeNewImage = (e, { value }) => this.setState({ newImage: value })

	setActive = (i, description, image) => {
		this.setState({
			currentItem: i,
			descriptionVal: description,
			imageVal: image
		})
	}

	updateSearchTerm = e => {
		const q = e.target.value
		this.setState({ q }, () => {
			this.fetchLocations(q)
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
			orderVal
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
							const description = item.description
							const image = item.image
							const isActive = currentItem === i

							return (
								<Item key={`adminCity${i}`}>
									<Item.Image rounded size="large" src={item.image} />
									<Item.Content>
										<Item.Header as="h1">{item.title}</Item.Header>
										<Item.Description>
											<Form>
												<TextArea
													onChange={this.onChangeDescription}
													onClick={() =>
														this.setActive(i, description, image)
													}
													placeholder="Enter a description"
													value={isActive ? descriptionVal : description}
												/>
												<Divider />
												<Input
													fluid
													icon="image"
													iconPosition="left"
													onChange={this.onChangeImage}
													onClick={() =>
														this.setActive(i, description, image)
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
																	order: orderVal
																})
															}}
															positive
														/>
														<Divider />
														<Button content="Remove" fluid negative />
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
	...state.app,
	...ownProps
})

export default connect(mapStateToProps, {
	addCity,
	editCity,
	toggleAddCityModal
})(AdminCities)
