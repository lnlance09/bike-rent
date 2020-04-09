<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Store extends CI_Controller {
	public function __construct() {
		parent:: __construct();

		$this->base_url = $this->config->base_url();

		$this->load->model('StoreModel', 'store');
	}

	public function index() {

	}

	public function create() {
		$address = $this->input->post('address');
		$bike_ids = $this->input->post('bike_ids');
		$bike_names = $this->input->post('bike_names');
		$city = $this->input->post('city');
		$closingTime = $this->input->post('closingTime');
		$description = $this->input->post('description');
		$image = $this->input->post('image');
		$lat = $this->input->post('lat');
		$lon = $this->input->post('lon');
		$name = $this->input->post('name');
		$openingTime = $this->input->post('openingTime');
		$phone = $this->input->post('phone');
		$state = $this->input->post('state');
		$visible = (int)$this->input->post('visible');

		if (empty($name)) {
			echo json_encode([
				'error' => 'You must provide a name'
			]);
			exit;
		}

		if (empty($description)) {
			echo json_encode([
				'error' => 'You must provide a description'
			]);
			exit;
		}

		if (empty($lat)) {
			$lat = '40.73590000';
		}

		if (empty($lon)) {
			$lon = '-73.99110000';
		}

		$store_id = $this->store->create([
			'address' => $address,
			'city' => $city,
			'closing_time' => $closingTime,
			'description' => $description,
			'image' => $image,
			'lat' => $lat,
			'lon' => $lon,
			'name' => $name,
			'opening_time' => $openingTime,
			'phone_number' => $phone,
			'state' => $state,
			'visible' => $visible
		]);

		$this->store->updateInventory($store_id, explode('| ', $bike_ids));

		echo json_encode([
			'error' => false
		]);
	}

	public function edit() {
		$address = $this->input->post('address');
		$bike_ids = $this->input->post('bike_ids');
		$bike_names = $this->input->post('bike_names');
		$city = $this->input->post('city');
		$closingTime = $this->input->post('closingTime');
		$description = $this->input->post('description');
		$id = $this->input->post('id');
		$image = $this->input->post('image');
		$lat = $this->input->post('lat');
		$lon = $this->input->post('lon');
		$name = $this->input->post('name');
		$openingTime = $this->input->post('openingTime');
		$phone = $this->input->post('phone');
		$state = $this->input->post('state');
		$visible = (int)$this->input->post('visible');

		if (empty($name)) {
			echo json_encode([
				'error' => 'You must provide a name'
			]);
			exit;
		}

		if (empty($description)) {
			echo json_encode([
				'error' => 'You must provide a description'
			]);
			exit;
		}

		if (empty($lat)) {
			$lat = '40.73590000';
		}

		if (empty($lon)) {
			$lon = '-73.99110000';
		}

		$this->store->update($id, [
			'address' => $address,
			'city' => $city,
			'closing_time' => $closingTime,
			'description' => $description,
			'image' => $image,
			'lat' => $lat,
			'lon' => $lon,
			'name' => $name,
			'opening_time' => $openingTime,
			'phone_number' => $phone,
			'state' => $state,
			'visible' => $visible
		]);

		$this->store->updateInventory($id, explode('| ', $bike_ids));

		echo json_encode([
			'error' => false
		]);
	}

	public function get() {
		$id = $this->input->get('id');

		$store = $this->store->get($id);

		if (!$store) {
			echo json_encode([
				'error' => true,
				'store' => false
			]);
		}

		$reviewCount = $this->store->getReviews($id, true);
		$avgRating = $this->store->getReviews($id, false, 0, 0, true);

		$store['reviewCount'] = $reviewCount;
		$store['avgRating'] = $avgRating;

		echo json_encode([
			'error' => false,
			'store' => $store
		]);
	}

	public function getBikes() {
		$bike_id = (int)$this->input->get('bikeId');
		$store_id = (int)$this->input->get('storeId');
		$page = $this->input->get('page');
		$limit = $this->input->get('limit');

		$count = $this->store->getBikes(
			$store_id,
			$bike_id,
			true,
			$page,
			$limit
		);

		$results = $this->store->getBikes(
			$store_id,
			$bike_id,
			false,
			$page,
			$limit
		);

		if ($count > 0) {
			$count = count($results);
			$pages = ceil($count/$limit);
			$has_more = $page+1 < $pages ? true : false;
		} else {
			$count = 0;
			$pages = 0;
			$has_more = false;
		}

		echo json_encode([
			'count' => $count,
			'pagination' => [
				'hasMore' => $has_more,
				'nextPage' => $page+1,
				'pages' => $pages
			],
			'results' => $results
		], true);
	}

	public function getImages() {
		$id = $this->input->get('id');
		$page = $this->input->get('page');
		$limit = $this->input->get('limit');

		$count = $this->store->getImages(
			$id,
			true,
			$page,
			$limit
		);

		$results = $this->store->getImages(
			$id,
			true,
			$page,
			$limit
		);

		$pages = ceil($count/$limit);
		$has_more = $page+1 < $pages ? true : false;

		echo json_encode([
			'count' => count($results),
			'pagination' => [
				'hasMore' => $has_more,
				'nextPage' => $page+1,
			],
			'results' => $results
		], true);
	}

	public function getReviews() {
		$id = $this->input->get('id');
		$page = $this->input->get('page');
		$limit = $this->input->get('limit');

		$count = $this->store->getReviews(
			$id,
			true,
			$page,
			$limit
		);

		$results = $this->store->getReviews(
			$id,
			true,
			$page,
			$limit
		);

		$pages = ceil($count/$limit);
		$has_more = $page+1 < $pages ? true : false;

		echo json_encode([
			'count' => count($results),
			'pagination' => [
				'hasMore' => $has_more,
				'nextPage' => $page+1,
			],
			'results' => $results
		], true);
	}

	public function getStores() {
		$stores = $this->store->getStores();

		echo json_encode([
			'error' => false,
			'stores' => $stores
		]);
	}

	public function search() {
		$cityId = $this->input->get('cityId');
		$lat = $this->input->get('lat');
		$lon = $this->input->get('lon');
		$radius = $this->input->get('radius');
		$page = $this->input->get('page');
		$limit = $this->input->get('limit');
		$storeId = $this->input->get('storeId');

		if ($limit === null) {
			$limit = 25;
		}

		$count = $this->store->search(
			$radius,
			$lat,
			$lon,
			$cityId,
			$storeId,
			true,
			$page,
			$limit
		);

		$results = $this->store->search(
			$radius,
			$lat,
			$lon,
			$cityId,
			$storeId,
			false,
			$page,
			$limit
		);

		$pages = ceil($count/$limit);
		$has_more = $page+1 < $pages ? true : false;

		echo json_encode([
			'count' => count($results),
			'pagination' => [
				'hasMore' => $has_more,
				'nextPage' => $page+1,
			],
			'results' => $results
		], true);
	}
}
