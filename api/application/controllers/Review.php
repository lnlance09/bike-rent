<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Review extends CI_Controller {
	public function __construct() {
		parent:: __construct();

		$this->base_url = $this->config->base_url();

		$this->load->model('ReviewModel', 'review');
		$this->load->model('StoreModel', 'store');
	}

	public function index() {

	}

	public function create() {
		$comment = $this->input->post('comment');
		$rating = (int)$this->input->post('rating');
		$storeId = $this->input->post('storeId');

		if (empty($comment)) {
			echo json_encode([
				'error' => 'You must provide a comment'
			]);
			exit;
		}

		if ($rating < 1 || $rating > 5) {
			echo json_encode([
				'error' => 'You must provide a valid rating'
			]);
			exit;
		}

		$storeExists = $this->store->checkIfExists($storeId);
		if (!$storeExists) {
			echo json_encode([
				'error' => 'That store does not exist'
			]);
			exit;
		}

		$user = $this->user;
		if (!$user) {
			echo json_encode([
				'error' => 'You must be logged in to create a review'
			]);
			exit;
		}

		$this->review->create([
			'comment' => $comment,
			'rating' => $rating,
			'store_id' => $storeId,
			'user_id' => $user->id
		]);

		echo json_encode([
			'error' => false
		]);
	}

	public function edit() {
		$id = $this->input->post('id');
		$comment = $this->input->post('comment');
		$rating = (int)$this->input->post('rating');

		if (empty($comment)) {
			echo json_encode([
				'error' => 'You must provide a comment'
			]);
			exit;
		}

		if ($rating < 1 || $rating > 5) {
			echo json_encode([
				'error' => 'You must provide a valid rating'
			]);
			exit;
		}

		$user = $this->user;
		if (!$user) {
			echo json_encode([
				'error' => 'You must be logged in to edit reviews'
			]);
			exit;
		}

		$review = $this->review->get($id);

		if (!$review) {
			echo json_encode([
				'error' => 'This review does not exist'
			]);
			exit;
		}

		if ($review['user_id'] != $user->id) {
			echo json_encode([
				'error' => 'You do not have permission to edit this review'
			]);
			exit;
		}

		$this->review->update($id, [
			'comment' => $comment,
			'rating' => $rating
		]);

		echo json_encode([
			'error' => false
		]);
	}

	public function get() {
		$id = $this->input->get('id');

		$review = $this->review->get($id);

		if (!$review) {
			echo json_encode([
				'error' => true,
				'review' => false
			]);
		}

		echo json_encode([
			'error' => false,
			'review' => $review
		]);
	}

	public function search() {
		$storeId = $this->input->get('storeId');
		$userId = $this->input->get('userId');
		$page = $this->input->get('page');
		$limit = $this->input->get('limit');

		if ($limit === null) {
			$limit = 25;
		}

		$count = $this->review->search(
			$storeId,
			$userId,
			true,
			$page,
			$limit
		);

		$results = $this->review->search(
			$storeId,
			$userId,
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
