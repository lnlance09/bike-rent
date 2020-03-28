import "./style.css"
import React, { Component } from "react"
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl"
import PropTypes from "prop-types"

const Map = ReactMapboxGl({
	accessToken:
		"pk.eyJ1IjoibG5sYW5jZTA5IiwiYSI6ImNrOGM0bXNwZDBkMDgzbW4yanExOWV3d3UifQ.-d8NKcr5Iry-6bIYpq53EA"
})

class MapBox extends Component {
	render() {
		const { circlePaint, height, lat, lng, width } = this.props

		return (
			<Map
				center={[lng, lat]}
				containerStyle={{
					height,
					width
				}}
				style="mapbox://styles/mapbox/streets-v9"
				zoom={[12]}
			>
				<Layer type="circle" paint={circlePaint}>
					<Feature coordinates={[lng, lat]} />
				</Layer>
			</Map>
		)
	}
}

MapBox.propTypes = {
	circlePaint: PropTypes.shape({
		"circle-stroke-width": PropTypes.number,
		"circle-radius": PropTypes.number,
		"circle-blur": PropTypes.number,
		"circle-color": PropTypes.string,
		"circle-stroke-color": PropTypes.string
	}),
	height: PropTypes.string,
	lat: PropTypes.number,
	lng: PropTypes.number,
	width: PropTypes.string
}

MapBox.defaultProps = {
	circlePaint: {
		"circle-stroke-width": 4,
		"circle-radius": 10,
		"circle-blur": 0.15,
		"circle-color": "#3770C6",
		"circle-stroke-color": "white"
	}
}

export default MapBox
