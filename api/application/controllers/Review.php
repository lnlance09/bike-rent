<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Review extends CI_Controller {
	public function __construct() {
		parent:: __construct();

		$this->base_url = $this->config->base_url();

		$this->load->model('ReviewModel', 'review');
		$this->load->model('StoreModel', 'store');

		$this->load->helper('validation');
	}

	public function create() {
		$comment = $this->input->post('comment');
		$rating = (int)$this->input->post('rating');
		$storeId = $this->input->post('storeId');
		$user = $this->user;

		validateLoggedIn($user, 'You must be logged in');
		validateEmptyField($comment, 'You must provide a comment');
		validateRating($rating, 'You must provide a valid rating');

		$storeExists = $this->store->checkIfExists($storeId);
		validateEmptyField($storeExists, 'That store does not exist');

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

	public function delete() {
		$id = $this->input->post('id');
		$user = $this->user;

		validateLoggedIn($user, 'You must be logged in to delete reviews');

		$review = $this->review->get($id);
		validateEmptyField($review, 'This review does not exist');
		validateItemsMatch($review['user_id'], $user->id, 'You do not have permission to delete this review');

		$this->review->delete($id);

		echo json_encode([
			'error' => false
		]);
	}

	public function edit() {
		$id = $this->input->post('id');
		$comment = $this->input->post('comment');
		$rating = (int)$this->input->post('rating');
		$user = $this->user;

		validateLoggedIn($user, 'You must be logged in to edit reviews');
		validateEmptyField($comment, 'You must provide a comment');
		validateRating($rating, 'You must provide a valid rating');

		$review = $this->review->get($id);
		validateEmptyField($review, 'This review does not exist');
		validateItemsMatch($review['user_id'], $user->id, 'You do not have permission to edit this review');

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
