import "./style.css"
import { Icon } from "semantic-ui-react"
import React, { Component } from "react"
import GoogleMapReact from "google-map-react"
import PropTypes from "prop-types"

const MapMarker = ({ lat, lng }) => {
	return <Icon lat={lat} lng={lng} name="marker" />
}

class MapBox extends Component {
	render() {
		const { apiKey, defaultCenter, lat, lng } = this.props

		return (
			<div className="googleMapsBox">
				<GoogleMapReact
					bootstrapURLKeys={{ key: apiKey }}
					defaultCenter={defaultCenter}
					defaultZoom={11}
				>
					<MapMarker lat={lat} lng={lng} />
				</GoogleMapReact>
			</div>
		)
	}
}

MapBox.propTypes = {
	apiKey: PropTypes.string,
	defaultCenter: PropTypes.shape({
		lat: PropTypes.number,
		lng: PropTypes.number
	}),
	lat: PropTypes.number,
	lng: PropTypes.number
}

MapBox.defaultProps = {
	defaultCenter: {}
}

export default MapBox
