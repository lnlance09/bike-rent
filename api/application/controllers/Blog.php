<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Blog extends CI_Controller {
	public function __construct() {
		parent:: __construct();

		$this->base_url = $this->config->base_url();

		$this->load->model('BlogModel', 'blog');
	}

	public function create() {
		$title = $this->input->post('title');
		$entry = $this->input->post('entry');
		$tags = $this->input->post('tags');

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

		$this->blog->create($title, $entry, $tags);
	}

	public function get() {

	}

	public function getAll() {

	}

	public function update() {

	}
}
