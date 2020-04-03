import "./style.css"
import { Button, Dimmer, Header, Icon, Image } from "semantic-ui-react"
import React, { Component } from "react"
import Dropzone from "react-dropzone"
import ImagePic from "images/images/image-square.png"
import PropTypes from "prop-types"

class ImageUpload extends Component {
	constructor(props) {
		super(props)

		this.state = {
			active: false,
			files: [],
			inverted: true
		}
	}

	onDrop = files => {
		const { bearer } = this.props
		this.setState({ files }, () => {
			if (files.length > 0) {
				this.props.callback(bearer, files[0])
			}
		})
	}

	toggleDimmer = () => this.setState({ active: !this.state.active })

	render() {
		const { active, inverted } = this.state
		const { fluid, headerSize, img, imgSize, msg } = this.props

		const content = (
			<Dropzone onDrop={this.onDrop}>
				{({ getRootProps, getInputProps }) => (
					<section>
						<div {...getRootProps()}>
							<input {...getInputProps()} />
							<Header size={headerSize}>{msg}</Header>
							<Button className="changePicBtn" color="blue" icon>
								<Icon name="image" />
							</Button>
						</div>
					</section>
				)}
			</Dropzone>
		)

		return (
			<div className="imageUpload">
				<Dimmer.Dimmable
					as={Image}
					dimmed={active}
					dimmer={{ active, content, inverted }}
					fluid={fluid}
					onError={i => (i.target.src = ImagePic)}
					onMouseEnter={this.toggleDimmer}
					onMouseLeave={this.toggleDimmer}
					rounded
					size={fluid ? null : imgSize}
					src={img ? img : ImagePic}
				/>
			</div>
		)
	}
}

ImageUpload.propTypes = {
	bearer: PropTypes.string,
	callback: PropTypes.func,
	fluid: PropTypes.bool,
	headerSize: PropTypes.string,
	img: PropTypes.string,
	imgSize: PropTypes.string,
	msg: PropTypes.string
}

ImageUpload.defaultProps = {
	fluid: false,
	headerSize: "medium",
	imgSize: "medium",
	msg: "Select a picture"
}

export default ImageUpload
