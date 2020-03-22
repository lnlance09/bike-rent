import * as constants from "../constants"
import request from "request"

export const addImageToLibrary = ({ bearer, file }) => dispatch => {
	const fr = new FileReader()
	fr.onload = event => {
		request.post(
			`${window.location.origin}/api/library/addImage`,
			{
				headers: {
					Authorization: bearer,
					"Content-Type": "multipart/form-data",
					enctype: "multipart/form-data"
				},
				json: true,
				multipart: {
					chunked: false,
					data: [
						{
							"Content-Disposition": `form-data; name="file"; filename="${file.name}"`,
							body: event.target.result
						}
					]
				}
			},
			function(err, response, body) {
				if (!body.error) {
					dispatch(getImages())
				}

				/*
				dispatch({
					payload: body,
					type: constants.ADD_IMAGE
				})
				*/
			}
		)
	}
	fr.readAsArrayBuffer(file)
}

export const getImages = () => dispatch => {
	request.get(
		`${window.location.origin}/api/library/getImages`,
		{
			json: true
		},
		function(err, response, body) {
			dispatch({
				payload: body,
				type: constants.GET_IMAGES
			})
		}
	)
}
