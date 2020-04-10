<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Blog extends CI_Controller {
	public function __construct() {
		parent:: __construct();

		$this->base_url = $this->config->base_url();

		$this->load->model('BlogModel', 'blog');
		$this->load->model('CityModel', 'city');
	}

	public function create() {
		$cityId = $this->input->post('cityId');
		$entry = $this->input->post('entry');
		$title = $this->input->post('title');

		$user = $this->user;
		if (!$user) {
			echo json_encode([
				'error' => 'You must be logged in'
			]);
			exit;
		}

		if (empty($title)) {
			echo json_encode([
				'error' => 'You must provide a title'
			]);
			exit;
		}

		if (empty($entry)) {
			echo json_encode([
				'error' => 'The blog post cannot be empty'
			]);
			exit;
		}

		$city = $this->city->checkIfExists($cityId);
		if (!$city) {
			echo json_encode([
				'error' => 'That city does not exist'
			]);
			exit;
		}

		$this->blog->create([
			'city_id' => $cityId,
			'entry' => $entry,
			'title' => $title
		]);

		echo json_encode([
			'error' => false
		]);
	}

	public function delete() {
		$id = $this->input->post('id');

		$user = $this->user;
		if (!$user) {
			echo json_encode([
				'error' => 'You must be logged in'
			]);
			exit;
		}

		$this->blog->delete($id);

		echo json_encode([
			'error' => false
		]);
	}

	public function get() {

	}

	public function getAll() {

	}

	public function search() {
		$cityId = $this->input->get('cityId');
		$limit = $this->input->get('limit');
		$page = $this->input->get('page');

		if ($limit === null) {
			$limit = 25;
		}

		$count = $this->blog->search(
			$cityId,
			true,
			$page,
			$limit
		);

		$results = $this->blog->search(
			$cityId,
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

	public function update() {
		$cityId = $this->input->post('cityId');
		$entry = $this->input->post('entry');
		$id = $this->input->post('id');
		$title = $this->input->post('title');

		$user = $this->user;
		if (!$user) {
			echo json_encode([
				'error' => 'You must be logged in to make changes'
			]);
			exit;
		}

		if (empty($title)) {
			echo json_encode([
				'error' => 'You must provide a title'
			]);
			exit;
		}

		if (empty($entry)) {
			echo json_encode([
				'error' => 'The blog post cannot be empty'
			]);
			exit;
		}

		$city = $this->city->checkIfExists($cityId);
		if (!$city) {
			echo json_encode([
				'error' => 'That city does not exist'
			]);
			exit;
		}

		$this->blog->update($id, [
			'city_id' => $cityId,
			'date_updated' => date('Y-m-d H:i:s'),
			'entry' => $entry,
			'title' => $title
		]);

		echo json_encode([
			'error' => false
		]);
	}
}
