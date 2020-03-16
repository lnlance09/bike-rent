<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class City extends CI_Controller {
	public function __construct() {
		parent:: __construct();

		$this->base_url = $this->config->base_url();

		$this->load->model('CityModel', 'city');
	}

	public function index() {
		set_time_limit(0);
		$this->city->insertLocation();
	}
}
