import { combineReducers } from "redux"
import app from "redux/reducers/app"
import bike from "redux/reducers/bike"
import bikes from "components/bikesList/v1/reducer"
import blogs from "components/blogsList/v1/reducer"
import cities from "components/citiesList/v1/reducer"
import city from "redux/reducers/city"
import library from "redux/reducers/library"
import order from "redux/reducers/order"
import orders from "components/ordersList/v1/reducer"
import payments from "components/paymentMethod/v1/reducer"
import reviews from "components/reviewsList/v1/reducer"
import store from "redux/reducers/store"
import stores from "components/storesList/v1/reducer"
import user from "components/authentication/v1/reducer"

export default combineReducers({
	app,
	bike,
	bikes,
	blogs,
	cities,
	city,
	library,
	order,
	orders,
	payments,
	reviews,
	store,
	stores,
	user
})