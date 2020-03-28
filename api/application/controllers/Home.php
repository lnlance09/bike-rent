<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Home extends CI_Controller {
	public function __construct() {
		parent:: __construct();
		
		$this->baseUrl = $this->config->base_url();

		$this->load->library('My_PHPMailer');

		$this->load->model('MediaModel', 'media');
		$this->load->model('SettingsModel', 'settings');
	}

	public function index() {
		
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

		$msg = file_get_contents('https://bike-rent.s3-us-west-2.amazonaws.com/emails/application-confirmation.html');

		$mail = new PHPMailer();
		$mail->IsSMTP();
		$mail->SMTPAuth = true;
		$mail->SMTPSecure = 'ssl';
		$mail->Host = 'smtpout.secureserver.net';
		$mail->Port = 465;
		$mail->Username = 'admin@tpusa.pro';
		$mail->Password = 'Jl8RdSLz7DF8:PJ';
		$mail->SetFrom('admin@bikerent.com', 'BikeRent.com');
		$mail->Subject = 'Your application has been received';
		$mail->Body = $msg;
		$mail->AltBody = $msg;
		$mail->AddAddress('lnlance09@gmail.com', 'Lance Newman');

		if ($mail->Send()) {
			echo json_encode([
				'error' => false
			]);
			exit;
		}

		echo json_encode([
			'error' => 'Something went wrong.'
		]);
	}
}
