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
		$description = $this->input->post('description');
		$image = $this->input->post('image');
		$location_id = $this->input->post('location_id');

		if (empty($address)) {
			echo json_encode([
				'error' => 'You must provide an address'
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

		if ($location_id < 1) {
			echo json_encode([
				'error' => 'You must select a city'
			]);
			exit;
		}

		$this->store->create([
			'address' => $address,
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

		$this->store->update($id, [
			'address' => $address,
			'description' => $description,
			'image' => $image,
			'order' => $order
		]);

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

		echo json_encode([
			'error' => false,
			'store' => $store
		]);
	}

	public function getBikes() {
		$id = $this->input->get('id');
		$page = $this->input->get('page');
		$limit = $this->input->get('limit');

		$count = $this->store->getBikes(
			$id,
			true,
			$page,
			$limit
		);

		$results = $this->store->getBikes(
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

	public function search() {
		$lat = $this->input->get('lat');
		$lon = $this->input->get('lon');
		$radius = $this->input->get('radius');
		$page = $this->input->get('page');
		$limit = $this->input->get('limit');

		if ($limit === null) {
			$limit = 25;
		}

		$count = $this->store->search(
			$radius,
			$lat,
			$lon,
			true,
			$page,
			$limit
		);

		$results = $this->store->search(
			$radius,
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
			'results' => $results
		], true);
	}
}
