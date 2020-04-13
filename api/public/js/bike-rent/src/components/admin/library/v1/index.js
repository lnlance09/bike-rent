import "./style.css"
import { addImageToLibrary, getImages, toggleAddImageModal } from "redux/actions/library"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { toast } from "react-toastify"
import { connect } from "react-redux"
import {
	Button,
	Divider,
	Form,
	Grid,
	Header,
	Image,
	Input,
	Modal,
	Placeholder
} from "semantic-ui-react"
import React, { Component, Fragment } from "react"
import ImagePic from "images/images/image-square.png"
import ImageUpload from "components/imageUpload/v1/"
import PropTypes from "prop-types"

toast.configure({
	autoClose: 4000,
	draggable: false
})

class AdminLibrary extends Component {
	constructor(props) {
		super(props)

		this.state = {
			currentImg: false,
			loading: false
		}
	}

	componentDidMount() {
		this.props.getImages()
	}

	toggleLoading = () => this.setState({ loading: !this.state.loading })

	render() {
		const { baseUrl, bearer, images, modalOpen, s3Url } = this.props
		const { currentImg, loading } = this.state

		const AddImgModal = (
			<Modal
				centered={false}
				closeIcon
				onClose={() => this.props.toggleAddImageModal()}
				open={modalOpen}
			>
				{!currentImg && <Modal.Header>Add a photo</Modal.Header>}

				<Modal.Content>
					<Grid>
						{!currentImg ? (
							<ImageUpload
								bearer={bearer}
								callback={(bearer, file) => {
									this.props.addImageToLibrary({
										bearer,
										file
									})
									this.toggleLoading()
								}}
								fluid={false}
							/>
						) : (
							<Fragment>
								<Grid.Column width={6}>
									<Image
										bordered
										onError={i => (i.target.src = ImagePic)}
										rounded
										size="medium"
										src={`${baseUrl}${currentImg}`}
									/>
								</Grid.Column>
								<Grid.Column width={10}>
									<Form>
										<Form.Field>
											<label>Public URL</label>
										</Form.Field>
										<Form.Field>
											<CopyToClipboard
												onCopy={() => toast.success("Copied to clipboard")}
												text={`${baseUrl}${currentImg}`}
											>
												<Input
													className="copyToClipboard"
													fluid
													icon="copy"
													readonly
													value={`${baseUrl}${currentImg}`}
												/>
											</CopyToClipboard>
										</Form.Field>

										<Form.Field>
											<label>S3 URL</label>
										</Form.Field>

										<Form.Field>
											<CopyToClipboard
												onCopy={() => toast.success("Copied to clipboard")}
												text={`${s3Url}${currentImg}`}
											>
												<Input
													className="copyToClipboard"
													fluid
													icon="copy"
													readonly
													value={`${s3Url}${currentImg}`}
												/>
											</CopyToClipboard>
										</Form.Field>
									</Form>
								</Grid.Column>
							</Fragment>
						)}
					</Grid>
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
				<Header size="huge">Image Library</Header>

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
										bordered
										className="libraryImg"
										fluid
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

				{AddImgModal}
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
