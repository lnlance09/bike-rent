<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Bike extends CI_Controller {
	public function __construct() {
		parent:: __construct();

		$this->base_url = $this->config->base_url();

		$this->load->model('BikeModel', 'bike');
	}

	public function index() {

	}

	public function search() {
		$page = $this->input->get('page');
		$limit = $this->input->get('limit');

		if ($limit === null) {
			$limit = 25;
		}

		$count = $this->bike->search(
			true,
			$page,
			$limit
		);

		$results = $this->bike->search(
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
