<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Home extends CI_Controller {
	public function __construct() {
		parent:: __construct();
		
		$this->baseUrl = $this->config->base_url();

		$this->load->library('My_PHPMailer');
		$this->load->model('FakerModel', 'faker');
		$this->load->model('ReviewsModel', 'reviews');
	}

	public function insertUsers() {
		$this->faker->createUsers(500);
	}

	public function activity() {
		$id = $this->input->get('id');
		$page = $this->input->get('page');

		$limit = 20;
		$start = $page*$limit;

		$count = $this->reviews->search(null, null, null, false, true, null, $limit);
		$pages = ceil($count/$limit);

		$results = $this->reviews->search(null, null, $page, false, false, null, $limit);

		echo json_encode([
			'count' => (int)$count,
			'error' => false,
			'hasMore' => $page+1 < $pages,
			'page' => (int)$page,
			'pages' => $pages,
			'results' => !$results ? [] : $results
		]);
	}

	public function sendContactMsg() {
		$msg = $this->input->post('msg');

		if (empty($msg)) {
			echo json_encode([
				'error' => 'you must include a message'
			]);
			exit;
		}

		try {
			$mail = new PHPMailer();
			$mail->IsSMTP();
			$mail->SMTPAuth = true;

			/*
			$mail->SMTPSecure = 'tls';
			$mail->Host = 'smtp.office365.com';
			$mail->Port = 587;
			*/

			$mail->SMTPSecure = 'ssl';
			$mail->Host = 'smtpout.secureserver.net';
			$mail->Port = 465;

			/*
			$mail->SMTPSecure = 'tls';
			$mail->Host = 'email-smtp.us-east-1.amazonaws.com';
			$mail->Port = 587;
			
			$mail->Username = 'AKIA3KB7ZZF26RK5WXM6';
			$mail->Password = 'BB/EIpBu7Hl9TLAjd36mjVPRV82FYmC/74VgEXnTSVJH';
			*/

			$mail->Username = 'admin@tpusa.pro';
			$mail->Password = 'Jl8RdSLz7DF8:PJ';

			$mail->SetFrom('admin@tpusa.pro', 'TP USA Pro');
			$mail->Subject = 'Someone from TP USA Pro has contacted you';
			$mail->Body = $msg;
			$mail->AltBody = $msg;
			$mail->AddAddress('admin@tpusa.pro');
			$mail->AddAddress('charlie@tpusa.com', 'Charlie Kirk');
			$mail->Send();

			echo json_encode([
				'error' => false,
				'msg' => 'your message has been sent'
			]);
		} catch (phpmailerException $e) {
			echo json_encode([
				'error' => "An error occurred. {$e->errorMessage()}"
			]);
		} catch (Exception $e) {
			echo json_encode([
				'error' => "Email not sent. {$mail->ErrorInfo}"
			]);
		}
	}
}
