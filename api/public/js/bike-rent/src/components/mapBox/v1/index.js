import "./style.css"
import { Icon } from "semantic-ui-react"
import React, { Component } from "react"
import GoogleMapReact from "google-map-react"
import ImagePic from "images/images/image-square.png"
import PropTypes from "prop-types"

class MapBox extends Component {
	render() {
		const { defaultCenter, key, lat, lng } = this.props

		return (
			<div className="googleMapsBox">
				<GoogleMapReact
					bootstrapURLKeys={{ key }}
					defaultCenter={defaultCenter}
					defaultZoom={11}
				>
					<Icon
						lat={lat}
						lng={lng}
						name="marker"
					/>
				</GoogleMapReact>
			</div>
		)
	}
}

MapBox.propTypes = {
	defaultCenter: PropTypes.shape({
		lat: PropTypes.number,
		lng: PropTypes.number
	}),
	key: PropTypes.string,
	lat: PropTypes.number,
	lng: PropTypes.number
}

MapBox.defaultProps = {
	defaultCenter: {}
}

export default MapBox
