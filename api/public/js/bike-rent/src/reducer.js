import { combineReducers } from "redux"
import app from "redux/reducers/app"
import bike from "redux/reducers/bike"
import bikes from "components/secondary/lists/bikesList/v1/reducer"
import blogs from "components/secondary/lists/blogsList/v1/reducer"
import cities from "components/secondary/lists/citiesList/v1/reducer"
import city from "redux/reducers/city"
import library from "redux/reducers/library"
import order from "redux/reducers/order"
import orders from "components/secondary/lists/ordersList/v1/reducer"
import payments from "components/secondary/paymentMethod/v1/reducer"
import reviews from "components/secondary/lists/reviewsList/v1/reducer"
import store from "redux/reducers/store"
import stores from "components/secondary/lists/storesList/v1/reducer"
import user from "components/secondary/authentication/v1/reducer"

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