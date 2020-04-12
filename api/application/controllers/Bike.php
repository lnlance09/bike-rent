<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Bike extends CI_Controller {
	public function __construct() {
		parent:: __construct();

		$this->base_url = $this->config->base_url();

		$this->load->model('BikeModel', 'bike');
		$this->load->model('StoreModel', 'store');

		$this->load->helper('validation');
	}

	public function create() {
		$description = $this->input->post('description');
		$image = $this->input->post('image');
		$name = $this->input->post('name');

		$user = $this->user;

		validateLoggedIn($user, 'You must be logged in');
		validateEmptyField($name, 'You must provide a name');
		validateEmptyField($description, 'You must provide a description');
		validateEmptyField($image, 'You must provide an image');

		$this->bike->create([
			'description' => $description,
			'image' => $image,
			'name' => $name
		]);

		echo json_encode([
			'error' => false
		]);
	}

	public function edit() {
		$id = $this->input->post('id');
		$description = $this->input->post('description');
		$image = $this->input->post('image');
		$name = $this->input->post('name');
		$visible = $this->input->post('visible');
		$user = $this->user;

		validateLoggedIn($user, 'You must be logged in');
		validateEmptyField($name, 'You must provide a name');
		validateEmptyField($description, 'You must provide a description');
		validateEmptyField($image, 'You must provide an image');

		$this->bike->update($id, [
			'description' => $description,
			'image' => $image,
			'name' => $name,
			'visible' => $visible
		]);

		echo json_encode([
			'error' => false
		]);
	}

	public function get() {
		$id = $this->input->get('id');

		$bike = $this->bike->get($id);
		validateEmptyField($bike, 'That bike does not exist');

		$page = 0;
		$limit = 25;
		$store_count = $this->store->getBikes(
			null,
			$id,
			true,
			$page,
			$limit
		);

		$results = $this->store->getBikes(
			null,
			$id,
			false,
			$page,
			$limit
		);

		echo json_encode([
			'bike' => $bike,
			'error' => false,
			'results' => $results,
			'store_count' => (int)$store_count
		]);
	}

	public function getBikes() {
		$bikes = $this->bike->getBikes();

		echo json_encode([
			'bikes' => $bikes,
			'error' => false
		]);
	}

	public function search() {
		$page = $this->input->get('page');
		$limit = $this->input->get('limit');
		$showHidden = (int)$this->input->get('showHidden');

		if ($limit === null) {
			$limit = 25;
		}

		$count = $this->bike->search(
			$showHidden,
			true,
			$page,
			$limit
		);

		$results = $this->bike->search(
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
				'pages' => $pages
			],
			'results' => $results,
		], true);
	}
}
