<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Home extends CI_Controller {
	public function __construct() {
		parent:: __construct();
		
		$this->baseUrl = $this->config->base_url();

		$this->load->model('MediaModel', 'media');
		$this->load->model('SettingsModel', 'settings');
	}

	public function index() {
		
	}

	public function sendContactMsg() {
		$msg = $this->input->post('msg');

		if (empty($msg)) {
			echo json_encode([
				'error' => 'You must leave a message'
			]);
			exit;
		}

		$message = "Someone from BikeRent.com has contacted you <br><br> Here's what they said: <br><br> ".$msg;
		$subject = 'Someone from BikeRent.com has contacted you';
		$from = EMAIL_RECEIVERS;
		$email = $this->media->sendEmail($subject, $message, $from, $from);

		if (!$email) {
			echo json_encode([
				'error' => 'Something went wrong.'
			]);
			exit;
		}

		echo json_encode([
			'error' => false
		]);
	}

	public function submitApplication() {
		$email = $this->input->post('email');
		$msg = $this->input->post('msg');
		$name = $this->input->post('name');

		if (empty($name)) {
			echo json_encode([
				'error' => 'You must provide your name'
			]);
			exit;
		}

		if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
			echo json_encode([
				'error' => 'A valid email is required'
			]);
			exit;
		}

		if (empty($msg)) {
			echo json_encode([
				'error' => 'You must leave a message'
			]);
			exit;
		}

		$this->settings->insertApplication($email, $msg, $name);

		$email_template = $this->media->generateTemplate('application-confirmation', [
			'name' => $name
		]);
		$title = $email_template['title'];
		$msg = $email_template['msg'];
		$from = EMAIL_RECEIVERS;
		$to = [
			[
				'email' => $email,
				'name' => $name
			]
		];
		$mail = $this->media->sendEmail($title, $msg, $from, $to);

		if (!$mail) {
			echo json_encode([
				'error' => 'Something went wrong.'
			]);
			exit;
		}

		echo json_encode([
			'error' => false
		]);
	}
}
