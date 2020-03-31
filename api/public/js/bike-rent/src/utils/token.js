import jwt from "jsonwebtoken"

export const defaultData = ({
	cart: {
		items: []
	},
	user: {}
})

export const parseJwt = () => {
	let localData = false
	jwt.verify(localStorage.getItem("jwtToken"), "secret", (err, decoded) => {
		if (decoded) {
			localData = {}
			localData = decoded.data
		}
	})
	return localData
}

export const setToken = data => {
	const token = jwt.sign({ data }, "secret", {
		expiresIn: 60 * 60 * 5
	})
	localStorage.setItem("jwtToken", token)
	return token
}
