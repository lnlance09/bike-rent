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
}
