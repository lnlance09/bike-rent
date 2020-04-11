<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Library extends CI_Controller {
	public function __construct() {
		parent:: __construct();

		$this->base_url = $this->config->base_url();

		$this->load->model('MediaModel', 'media');

		$this->load->helper('common_helper');
		$this->load->helper('validation');
	}

	public function index() {

	}

	public function addImage() {
		$user = $this->user;

		validateLoggedIn($user, 'You must be logged in to add a picture');

		$this->load->library('upload', [
			'allowed_types' => '*',
			'file_ext_tolower' => true,
			'max_height' => 0,
			'max_size' => 25000,
			'max_width' => 0,
			'upload_path' => './public/img/s3/'
		]);

		if (!$this->upload->do_upload('file')) {
			$this->output->set_status_header(403);
			$data = $this->upload->display_errors();
			echo json_encode([
				'error' => $data
			]);
			exit;
		} 

		$data = $this->upload->data();
		$file = $data['file_name'];
		$path = $data['full_path'];

		$s3Path = 'images/'.time().'_'.$file;
		$s3Link = $this->media->addToS3($s3Path, $path);

		echo json_encode([
			'error' => false,
			'img' => $s3Link
		]);
	}

	public function getImages() {
		$images = $this->media->listFolder('images');
		
		echo json_encode([
			'images' => $images
		]);
	}
}
