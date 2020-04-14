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
		const { circlePaint, height, lat, lng, markerId, markers, width, zoom } = this.props

		return (
			<Map
				center={[lng, lat]}
				containerStyle={{
					height,
					width
				}}
				style="mapbox://styles/mapbox/streets-v9" // eslint-disable-line
				zoom={[zoom]}
			>
				{markers.length > 0 &&
					markers.map((marker, i) => {
						if (
							markerId === "0" ||
							(parseInt(markerId, 10) > 1 && markerId === marker.id)
						) {
							const { id, lat, lon } = marker
							return (
								<Layer key={`marker${i}`} paint={circlePaint} type="circle">
									<Feature
										coordinates={[lon, lat]}
										onClick={() => this.props.onClickMarker(id, lat, lon)}
									/>
								</Layer>
							)
						}

						return null
					})}
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
	lat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	lng: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	markerId: PropTypes.string,
	markers: PropTypes.array,
	onClickMarker: PropTypes.func,
	width: PropTypes.string,
	zoom: PropTypes.number
}

MapBox.defaultProps = {
	circlePaint: {
		"circle-stroke-width": 4,
		"circle-radius": 10,
		"circle-blur": 0.15,
		"circle-color": "#3770C6",
		"circle-stroke-color": "white"
	},
	markerId: "0",
	markers: [],
	zoom: 10
}

export default MapBox
