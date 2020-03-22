<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class City extends CI_Controller {
	public function __construct() {
		parent:: __construct();

		$this->base_url = $this->config->base_url();

		$this->load->model('CityModel', 'city');
	}

	public function index() {
		set_time_limit(0);
		$this->city->insertLocation();
	}

	public function create() {
		$id = $this->input->post('id');
		$description = $this->input->post('description');
		$image = $this->input->post('image');

		if ($id < 1) {
			echo json_encode([
				'error' => 'You must select a city'
			]);
			exit;
		}

		if (empty($description)) {
			echo json_encode([
				'error' => 'You must provide a description'
			]);
			exit;
		}

		if (empty($image)) {
			echo json_encode([
				'error' => 'You must provide an image'
			]);
			exit;
		}

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
			'location_id' => $id
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

		$this->city->update($id, [
			'description' => $description,
			'image' => $image,
			'order' => $order
		]);

		echo json_encode([
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
		$q = $this->input->get('q');
		$lat = $this->input->get('lat');
		$lon = $this->input->get('lon');
		$page = $this->input->get('page');
		$limit = $this->input->get('limit');

		if ($limit === null) {
			$limit = 25;
		}

		$count = $this->city->search(
			$q,
			$lat,
			$lon,
			true,
			$page,
			$limit
		);

		$results = $this->city->search(
			$q,
			$lat,
			$lon,
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
			'results' => $results,
		], true);
	}
}
