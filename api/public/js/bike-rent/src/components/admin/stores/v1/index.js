import "./style.css"
import { fetchCities, fetchBikes } from "utils/selectOptions"
import { addStore, editStore, toggleAddStoreModal } from "redux/actions/app"
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
import React, { Component } from "react"
import ImagePic from "images/images/image-square.png"
import PropTypes from "prop-types"

const StoreForm = ({
	bikeOptions,
	cityOptions,
	error,
	errorMsg,
	item,
	onChangeAddress,
	onChangeBikes,
	onChangeCity,
	onChangeClosingTime,
	onChangeDescription,
	onChangeImage,
	onChangeLatitude,
	onChangeLongitude,
	onChangeName,
	onChangeOpeningTime,
	onChangePhone,
	toggleVisibilty
}) => {
	const {
		address,
		bike_ids,
		closingTime,
		description,
		image,
		name,
		location_id,
		lon,
		lat,
		openingTime,
		phone,
		visible
	} = item

	const bikesValue = bike_ids === null ? [] : bike_ids.split("| ")

	return (
		<Form error={error}>
			<Form.Field>
				<label>Name</label>
				<Input fluid onChange={onChangeName} placeholder="Enter a name" value={name} />
			</Form.Field>

			<Form.Field>
				<label>Description</label>
				<TextArea
					onChange={onChangeDescription}
					placeholder="Enter a description"
					value={description}
				/>
			</Form.Field>

			<Form.Field>
				<label>Address</label>
				<Input fluid onChange={onChangeAddress} placeholder="Address" value={address} />
			</Form.Field>

			<Form.Field>
				<label>City</label>
				<Dropdown
					onChange={onChangeCity}
					options={cityOptions}
					placeholder="City"
					search
					selection
					value={location_id}
				/>
			</Form.Field>

			<Form.Group widths="equal">
				<Form.Field>
					<label>Latitude</label>
					<Input
						icon="map marker alternate"
						onChange={onChangeLatitude}
						placeholder="Latitude"
						value={lat}
					/>
				</Form.Field>
				<Form.Field>
					<label>Longitude</label>
					<Input
						icon="map marker alternate"
						onChange={onChangeLongitude}
						placeholder="Longitude"
						value={lon}
					/>
				</Form.Field>
			</Form.Group>

			<Form.Group widths="equal">
				<Form.Field>
					<label>Opening time</label>
					<Input
						icon="hourglass start"
						onChange={onChangeOpeningTime}
						placeholder="Opening time"
						value={openingTime}
					/>
				</Form.Field>
				<Form.Field>
					<label>Closing time</label>
					<Input
						icon="hourglass end"
						onChange={onChangeClosingTime}
						placeholder="Opening time"
						value={closingTime}
					/>
				</Form.Field>
			</Form.Group>

			<Form.Field>
				<label>Phone</label>
				<Input
					icon="phone"
					iconPosition="left"
					onChange={onChangePhone}
					placeholder="Phone number"
					value={phone}
				/>
			</Form.Field>

			<Form.Field>
				<label>Images</label>
				<Input
					fluid
					icon="image"
					iconPosition="left"
					onChange={onChangeImage}
					placeholder="Image"
					value={image}
				/>
			</Form.Field>

			<Form.Field>
				<label>Bikes available here</label>
				<Dropdown
					fluid
					multiple
					onChange={onChangeBikes}
					options={bikeOptions}
					placeholder="Bikes available here"
					search
					selection
					value={bikesValue}
				/>
			</Form.Field>

			<Form.Field>
				<label>
					<b>Visible</b>
				</label>
			</Form.Field>
			<Form.Field>
				<Radio
					checked={visible === "1"}
					label="Yes"
					name="visible"
					onChange={toggleVisibilty}
					value="on"
				/>
			</Form.Field>
			<Form.Field>
				<Radio
					checked={visible === "0"}
					label="No"
					name="visible"
					onChange={toggleVisibilty}
					value="off"
				/>
			</Form.Field>
			{error && <Message content={errorMsg} error={error} />}
		</Form>
	)
}

class AdminStores extends Component {
	constructor(props) {
		super(props)

		this.state = {
			address: "",
			bike_ids: null,
			bike_names: null,
			cityOptions: [],
			closingTime: "",
			description: "",
			id: "",
			image: "",
			location_id: "",
			lat: "",
			lon: "",
			name: "",
			phone: "",
			openingTime: "",
			order: 0,
			visible: "0"
		}
	}

	async componentDidMount() {
		const bikeOptions = await fetchBikes("")
		this.setState({ bikeOptions })

		const cityOptions = await fetchCities("")
		this.setState({ cityOptions })
	}

	onChangeAddress = (e, { value }) => this.setState({ address: value })

	onChangeBikes = (e, { value }) => {
		const newBikes = value.join("| ")
		this.setState({ bike_ids: newBikes })
	}

	onChangeCity = (e, { value }) => this.setState({ location_id: value })

	onChangeClosingTime = (e, { value }) => this.setState({ closingTime: value })

	onChangeDescription = (e, { value }) => this.setState({ description: value })

	onChangeImage = (e, { value }) => this.setState({ image: value })

	onChangeLatitude = (e, { value }) => this.setState({ lat: value })

	onChangeLongitude = (e, { value }) => this.setState({ lon: value })

	onChangeName = (e, { value }) => this.setState({ name: value })

	onChangeOpeningTime = (e, { value }) => this.setState({ openingTime: value })

	onChangePhone = (e, { value }) => this.setState({ phone: value })

	setActive = (item, reset) => {
		const {
			address,
			bike_ids,
			bike_names,
			closingTime,
			description,
			id,
			image,
			name,
			lat,
			location_id,
			lon,
			openingTime,
			phone,
			visible
		} = item

		let stateData = {
			address,
			bike_ids,
			bike_names,
			closingTime,
			description,
			id,
			image,
			isNew: false,
			lat,
			location_id,
			lon,
			name,
			openingTime,
			phone,
			visible
		}

		if (reset) {
			stateData = {
				address: "",
				bike_ids: null,
				bike_names: null,
				closingTime: "",
				description: "",
				id: "",
				image: "",
				isNew: true,
				location_id: "",
				lat: "",
				lon: "",
				name: "",
				phone: "",
				openingTime: "",
				order: 0,
				visible: 0
			}
		}

		this.setState(stateData, () => {
			this.props.toggleAddStoreModal()
		})
	}

	toggleVisibilty = (e, { value }) => this.setState({ visible: value === "on" ? "1" : "0" })

	render() {
		const {
			address,
			bikeOptions,
			bike_ids,
			bike_names,
			cityOptions,
			closingTime,
			description,
			id,
			image,
			isNew,
			location_id,
			lat,
			lon,
			name,
			openingTime,
			phone,
			visible
		} = this.state
		const { bearer, error, errorMsg, modalOpen, stores } = this.props

		const AddBikeModal = (
			<Modal
				centered={false}
				closeIcon
				onClose={() => this.props.toggleAddStoreModal()}
				open={modalOpen}
			>
				<Modal.Header>{isNew ? "Add a new store" : "Edit this store"}</Modal.Header>
				<Modal.Content>
					<StoreForm
						bikeOptions={bikeOptions}
						cityOptions={cityOptions}
						error={error}
						errorMsg={errorMsg}
						item={{
							address,
							bike_ids,
							bike_names,
							closingTime,
							description,
							image,
							lat,
							location_id,
							lon,
							name,
							openingTime,
							phone,
							visible
						}}
						onChangeAddress={this.onChangeAddress}
						onChangeBikes={this.onChangeBikes}
						onChangeCity={this.onChangeCity}
						onChangeClosingTime={this.onChangeClosingTime}
						onChangeDescription={this.onChangeDescription}
						onChangeImage={this.onChangeImage}
						onChangeLatitude={this.onChangeLatitude}
						onChangeLongitude={this.onChangeLongitude}
						onChangeName={this.onChangeName}
						onChangePhone={this.onChangePhone}
						onChangeOpeningTime={this.onChangeOpeningTime}
						toggleVisibilty={this.toggleVisibilty}
					/>
				</Modal.Content>
				<Modal.Actions>
					<Button negative onClick={() => this.props.toggleAddStoreModal()}>
						Close
					</Button>
					<Button
						content={isNew ? "Add" : "Edit"}
						onClick={() => {
							if (isNew) {
								this.props.addStore({
									address,
									bike_ids,
									bike_names,
									bearer,
									closingTime,
									description,
									image,
									lat,
									location_id,
									lon,
									name,
									openingTime,
									phone,
									visible
								})
							} else {
								this.props.editStore({
									address,
									bearer,
									bike_ids,
									bike_names,
									closingTime,
									description,
									id,
									image,
									lat,
									location_id,
									lon,
									name,
									openingTime,
									phone,
									visible
								})
							}
						}}
						positive
					/>
				</Modal.Actions>
			</Modal>
		)

		return (
			<div className="adminStores">
				<Header size="huge">Stores</Header>

				<Button
					color="blue"
					content="Add a store"
					icon="add"
					onClick={() => {
						this.setActive({}, true)
					}}
				/>

				<Divider />

				{stores.count > 0 ? (
					<Item.Group divided relaxed>
						{stores.results.map((item, i) => {
							const { description, image, name } = item
							return (
								<Item key={`adminStore${i}`}>
									<Item.Image
										onError={i => (i.target.src = ImagePic)}
										rounded
										size="large"
										src={image}
									/>
									<Item.Content>
										<Item.Header>{name}</Item.Header>
										<Item.Description>
											<p>{description}</p>
										</Item.Description>
										<Item.Extra>
											<Button
												basic
												color="green"
												content="Edit"
												icon="pencil"
												onClick={() => {
													this.setActive(item, false)
												}}
											/>
										</Item.Extra>
									</Item.Content>
								</Item>
							)
						})}
					</Item.Group>
				) : (
					<div></div>
				)}

				{AddBikeModal}
			</div>
		)
	}
}

AdminStores.propTypes = {
	addStore: PropTypes.func,
	bearer: PropTypes.string,
	editStore: PropTypes.func,
	error: PropTypes.bool,
	errorMsg: PropTypes.string,
	modalOpen: PropTypes.bool,
	stores: PropTypes.object,
	toggleAddStoreModal: PropTypes.func
}

AdminStores.defaultProps = {
	addStore,
	editStore,
	error: false,
	modalOpen: false,
	stores: {
		results: [{}, {}]
	},
	toggleAddStoreModal
}

const mapStateToProps = (state, ownProps) => ({
	...state.app.store,
	...ownProps
})

export default connect(mapStateToProps, {
	addStore,
	editStore,
	toggleAddStoreModal
})(AdminStores)
