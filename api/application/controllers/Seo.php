<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Seo extends CI_Controller {
	public function __construct() {
		parent:: __construct();

		$this->base_url = $this->config->base_url();
	}

	public function index() {

		$this->load->view('sitemap', [
			
		]);
	}
}
