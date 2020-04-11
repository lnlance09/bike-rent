<?php
class MediaModel extends CI_Model {
	public function __construct() {
		parent:: __construct();

		$this->load->library('aws');
		$this->load->library('My_PHPMailer');
	}

	public function addToS3($key, $file, $remove = true, $update = false) {
		$exists = $this->existsInS3($key);
		if (!$exists) {
			$this->aws->upload($key, $file);
		}

		if ($exists && $update) {
			$this->aws->del($key);
			$this->aws->upload($key, $file);
		}

		if ($remove && file_exists($file)) {
			unlink($file);
		}

		return S3_PATH.$key;
	}

	public function existsInS3($file) {
		return $this->aws->exist($file);
	}

	public function generateTemplate($type, $data) {
		$title = 'Your application has been received';
		$msg = file_get_contents('https://bike-rent.s3-us-west-2.amazonaws.com/emails/'.$type.'.html');

		if ($type === 'application-confirmation') {
			$title = 'Your application has been received';

			$msg = str_replace('{NAME}', $data['name'], $msg);
		}

		if ($type === 'confirm-your-email') {
			$title = 'Please confirm your email';

			$msg = str_replace('{NAME}', $data['name'], $msg);
			$msg = str_replace('{VERIFICATION_CODE}', $data['verification_code'], $msg);
		}

		if ($type === 'order-confirmation') {
			$title = 'Your order summary';

			$msg = str_replace('<!-- DO NOT DELETE THIS. IT IS FOR INCLUDED EACH OF THE ORDER ITEMS -->', $data['items'], $msg);
			$msg = str_replace('{CARD_NUMBER}', $data['card_number'], $msg);
			$msg = str_replace('{CARD_TYPE}', $data['card_type'], $msg);
			$msg = str_replace('{CONFIRMATION_NUMBER}', $data['confirmation_number'], $msg);
			$msg = str_replace('{EXP_MONTH}', $data['exp_month'], $msg);
			$msg = str_replace('{EXP_YEAR}', $data['exp_year'], $msg);
			$msg = str_replace('{SUBTOTAL}', $data['subtotal'], $msg);
			$msg = str_replace('{TAX_PRICE}', $data['tax_price'], $msg);
			$msg = str_replace('{TOTAL}', $data['total'], $msg);
		}

		if ($type === 'refund') {
			$title = 'Your order has been refunded';
		}

		return [
			'msg' => $msg,
			'title' => $title
		];
	}

	public function listFolder($folder) {
		$objects = $this->aws->listObjects($folder);
		return array_slice($objects['Contents'], 1);
	}

	public function renameS3Object($src, $target, $delete = false) {
		$this->aws->copyFile($src, $target);

		if ($delete) {
			$this->aws->del($src);
		}
	}

	public function sendEmail($subject, $msg, $from, $to) {
		$mail = new PHPMailer();
		$mail->IsSMTP();
		$mail->SMTPAuth = true;
		// $mail->SMTPDebug = 2;
		$mail->SMTPSecure = 'ssl';
		$mail->Host = 'smtpout.secureserver.net';
		$mail->Port = 465;
		$mail->Username = 'admin@tpusa.pro';
		$mail->Password = 'Jl8RdSLz7DF8:PJ';
		$mail->SetFrom('admin@bikerent.com', 'BikeRent.com');
		$mail->Subject = $subject;
		$mail->Body = $msg;
		$mail->AltBody = $msg;

		for ($i=0;$i<count($to);$i++) {
			$mail->AddAddress($to[$i]['email'], $to[$i]['name']);
		}

		for ($i=0;$i<count($from);$i++) {
			$mail->AddBCC($from[$i]['email'], $from[$i]['name']);
		}

		if ($mail->Send()) {
			return true;
		}

		return false;
	}
}
