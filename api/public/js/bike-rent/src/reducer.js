import { combineReducers } from "redux"
import app from "redux/reducers/app"
import bike from "redux/reducers/bike"
import bikes from "components/bikesList/v1/reducer"
import cities from "components/citiesList/v1/reducer"
import city from "redux/reducers/city"
import library from "redux/reducers/library"
import store from "redux/reducers/store"
import stores from "components/storesList/v1/reducer"
import user from "components/authentication/v1/reducer"

export default combineReducers({
	app,
	bike,
	bikes,
	cities,
	city,
	library,
	store,
	stores,
	user
})