import { combineReducers } from "redux"
import app from "redux/reducers/app"
import bike from "redux/reducers/bike"
import city from "redux/reducers/city"
import library from "redux/reducers/library"
import user from "components/authentication/v1/reducer"

export default combineReducers({
	app,
	bike,
	city,
	library,
	user
})