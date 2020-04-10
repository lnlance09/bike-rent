<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Inventory extends CI_Controller {
	public function __construct() {
		parent:: __construct();

		$this->base_url = $this->config->base_url();

		$this->load->model('InventoryModel', 'inventory');
	}

	public function get() {

	}

	public function getAll() {
		$page = $this->input->get('page');
		$limit = $this->input->get('limit');
		$storeId = $this->input->get('storeId');

		if ($limit === null) {
			$limit = 25;
		}

		$count = $this->inventory->search(
			$storeId,
			true,
			$page,
			$limit
		);

		$results = $this->inventory->search(
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

	public function update() {
		$id = $this->input->post('id');
		$hourlyRate = $this->input->post('hourlyRate');
		$quantity = $this->input->post('quantity');

		$user = $this->user;
		if (!$user) {
			echo json_encode([
				'error' => 'You must be logged in to make changes'
			]);
			exit;
		}

		if (!is_numeric($hourlyRate)) {
			echo json_encode([
				'error' => 'You must provide a valid hourly rate'
			]);
			exit;
		}

		if (!is_numeric($quantity)) {
			echo json_encode([
				'error' => 'You must provide a valid quantity'
			]);
			exit;
		}

		$this->inventory->update($id, [
			'hourly_rate' => $hourlyRate,
			'quantity' => $quantity
		]);

		echo json_encode([
			'error' => false
		]);
	}
}
