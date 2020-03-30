<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Seo extends CI_Controller {
	public function __construct() {
		parent:: __construct();

		$this->base_url = $this->config->base_url();
	}

	public function index() {
		$sitemap = file_get_contents('https://bike-rent.s3-us-west-2.amazonaws.com/sitemaps/sitemap.xml');
		header('Content-type: application/xml');
		echo $sitemap;
	}
}
