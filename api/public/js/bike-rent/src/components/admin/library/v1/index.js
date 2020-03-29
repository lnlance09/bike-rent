import "./style.css"
import { addImageToLibrary, getImages, toggleAddImageModal } from "redux/actions/library"
import { connect } from "react-redux"
import {
	Button,
	Dimmer,
	Divider,
	Grid,
	Header,
	Icon,
	Image,
	Modal,
	Placeholder
} from "semantic-ui-react"
import React, { Component, Fragment } from "react"
import Dropzone from "react-dropzone"
import ImagePic from "images/images/image-square.png"
import PropTypes from "prop-types"

class AdminLibrary extends Component {
	constructor(props) {
		super(props)

		this.state = {
			active: true,
			currentImg: false,
			files: [],
			inverted: true,
			loading: false
		}

		this.onDrop = this.onDrop.bind(this)
	}

	componentDidMount() {
		this.props.getImages()
	}

	onDrop(files) {
		this.setState({ files })
		if (files.length > 0) {
			this.props.addImageToLibrary({
				bearer: this.props.bearer,
				file: files[0]
			})
			this.toggleLoading()
		}
	}

	toggleDimmer = () => this.setState({ active: this.state.active })

	toggleLoading = () => this.setState({ loading: !this.state.loading })

	render() {
		const { baseUrl, images, modalOpen, s3Url } = this.props
		const { active, currentImg, inverted, loading } = this.state

		const content = (
			<Dropzone onDrop={this.onDrop}>
				{({ getRootProps, getInputProps }) => (
					<section>
						<div {...getRootProps()}>
							<input {...getInputProps()} />
							<Header as="h2">Select a picture</Header>
							<Button className="changePicBtn" color="blue" icon>
								<Icon name="image" />
							</Button>
						</div>
					</section>
				)}
			</Dropzone>
		)

		const AddImgModal = (
			<Modal
				centered={false}
				closeIcon
				onClose={() => this.props.toggleAddImageModal()}
				open={modalOpen}
			>
				{!currentImg && <Modal.Header>Add a photo</Modal.Header>}

				<Modal.Content image>
					{!currentImg ? (
						<Fragment>
							<Dimmer.Dimmable
								as={Image}
								dimmed={active}
								dimmer={{ active, content, inverted }}
								onError={i => (i.target.src = ImagePic)}
								onMouseEnter={this.toggleDimmer}
								onMouseLeave={this.toggleDimmer}
								rounded
								size="medium"
								src={ImagePic}
							/>
						</Fragment>
					) : (
						<Fragment>
							<Image
								onError={i => (i.target.src = ImagePic)}
								rounded
								size="medium"
								src={`${baseUrl}${currentImg}`}
							/>
							<Modal.Description>
								<p>
									<b>Public Url:</b>{" "}
									<a
										href={`${baseUrl}${currentImg}`}
										rel="noopener noreferrer"
										target="_blank"
									>
										{baseUrl}
										{currentImg}
									</a>
								</p>
								<p>
									<b>S3 Url:</b>{" "}
									<a
										href={`${s3Url}${currentImg}`}
										rel="noopener noreferrer"
										target="_blank"
									>
										{s3Url}
										{currentImg}
									</a>
								</p>
							</Modal.Description>
						</Fragment>
					)}
				</Modal.Content>
				<Modal.Actions>
					<Button negative onClick={() => this.props.toggleAddImageModal()}>
						Close
					</Button>
					{!currentImg && <Button positive content="Add" loading={loading} />}
				</Modal.Actions>
			</Modal>
		)

		return (
			<div className="adminLibrary">
				{AddImgModal}

				<Button
					color="blue"
					content="Add image"
					icon="image"
					onClick={() => {
						this.setState(
							{
								currentImg: false,
								loading: false
							},
							() => this.props.toggleAddImageModal()
						)
					}}
				/>

				<Divider />

				<Grid columns={4}>
					{images.map((item, i) => {
						const imgUrl = `${baseUrl}${item.Key}`
						return (
							<Grid.Column>
								{item.Key ? (
									<Image
										className="libraryImg"
										onClick={() => {
											this.setState(
												{
													currentImg: item.Key
												},
												() => this.props.toggleAddImageModal()
											)
										}}
										onError={i => (i.target.src = ImagePic)}
										rounded
										src={imgUrl}
										wrapped
									/>
								) : (
									<Placeholder>
										<Placeholder.Image square />
									</Placeholder>
								)}
							</Grid.Column>
						)
					})}
				</Grid>
			</div>
		)
	}
}

AdminLibrary.propTypes = {
	addImageToLibrary: PropTypes.func,
	baseUrl: PropTypes.string,
	bearer: PropTypes.string,
	getImages: PropTypes.func,
	images: PropTypes.array,
	modalOpen: PropTypes.bool,
	s3Url: PropTypes.string,
	toggleAddImageModal: PropTypes.func
}

AdminLibrary.defaultProps = {
	addImageToLibrary,
	baseUrl: "https://bike-rent.s3-us-west-2.amazonaws.com/",
	getImages,
	images: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
	modalOpen: false,
	s3Url: "https://s3.console.aws.amazon.com/s3/object/bike-rent/",
	toggleAddImageModal
}

const mapStateToProps = (state, ownProps) => ({
	...state.library,
	...ownProps
})

export default connect(mapStateToProps, {
	addImageToLibrary,
	getImages,
	toggleAddImageModal
})(AdminLibrary)
