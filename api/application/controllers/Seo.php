<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Seo extends CI_Controller {
	public function __construct() {
		parent:: __construct();

		$this->base_url = $this->config->base_url();

		$this->load->model('ProfessorsModel', 'professors');
		$this->load->model('ReviewsModel', 'reviews');
		$this->load->model('SchoolsModel', 'schools');
		$this->load->model('UsersModel', 'users');
	}

	public function index() {
		// $professors = $this->professors->search(null, ['review_count' => '> 0'], 0, true, false);
		$reviews = $this->reviews->search(null, null, 0, true, false);
		$schools = $this->schools->search(null, null, 0, true, false, null);
		// $users = $this->users->getUsers();

		$this->load->view('sitemap', [
			'reviews' => $reviews,
			'schools' => array_slice($schools, 0, 50)
		]);
	}
}
