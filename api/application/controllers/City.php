<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class City extends CI_Controller {
	public function __construct() {
		parent:: __construct();

		$this->base_url = $this->config->base_url();

		$this->load->model('CityModel', 'city');
		$this->load->model('StoreModel', 'store');

		$this->load->helper('validation');
	}

	public function index() {
		set_time_limit(0);
		// $this->city->insertLocation();
	}

	public function create() {
		$id = $this->input->post('id');
		$description = $this->input->post('description');
		$image = $this->input->post('image');
		$user = $this->user;

		$city = $this->city->getLocation($id);

		validateLoggedIn($user, 'You must be logged in');
		validateEmptyField($city, 'This city does not exist');
		validateEmptyField($description, 'You must provide a description');
		validateEmptyField($image, 'You must provide an image');

		$exists = $this->city->checkIfExists($id);
		if ($exists) {
			echo json_encode([
				'error' => 'This city has already been featured'
			]);
			exit;
		}

		$this->city->create([
			'description' => $description,
			'image' => $image,
			'location_id' => $id,
			'slug' => slugify($city['city'])
		]);

		echo json_encode([
			'error' => false
		]);
	}

	public function edit() {
		$id = $this->input->post('id');
		$description = $this->input->post('description');
		$image = $this->input->post('image');
		$order = $this->input->post('order');
		$visible = $this->input->post('visible');
		$user = $this->user;
		
		validateLoggedIn($user, 'You must be logged in');
		validateEmptyField($description, 'You must provide a description');
		validateEmptyField($image, 'You must provide an image');

		$this->city->update($id, [
			'description' => $description,
			'image' => $image,
			'order' => $order,
			'visible' => $visible
		]);

		echo json_encode([
			'error' => false
		]);
	}

	public function get() {
		$id = $this->input->get('id');

		$city = $this->city->get($id);

		if (!$city) {
			echo json_encode([
				'city' => false,
				'error' => true
			]);
			exit;
		}

		$page = 0;
		$limit = 25;
		$store_count = $this->store->search(
			$id,
			null,
			false,
			true
		);

		$results = $this->store->search(
			$id,
			null,
			false,
			false
		);

		echo json_encode([
			'city' => $city,
			'error' => false,
			'results' => $results,
			'store_count' => (int)$store_count
		]);
	}

	public function getCities() {
		$cities = $this->city->getFeaturedCities();

		echo json_encode([
			'cities' => $cities,
			'error' => false
		]);
	}

	public function getLocations() {
		$q = $this->input->get('q');
		$locations = $this->city->getLocations($q);

		echo json_encode([
			'error' => false,
			'locations' => $locations
		]);
	}

	public function search() {
		$page = $this->input->get('page');
		$limit = $this->input->get('limit');
		$showHidden = (int)$this->input->get('showHidden');

		if ($limit === null) {
			$limit = 25;
		}

		$count = $this->city->search(
			$showHidden,
			true,
			$page,
			$limit
		);

		$results = $this->city->search(
			$showHidden,
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
			],
			'results' => $results,
		], true);
	}
}
