<?php
defined('BASEPATH') OR exit('No direct script access allowed');
date_default_timezone_set('UTC');

class Users extends CI_Controller {
	public function __construct() {
		parent:: __construct();

		$this->baseUrl = $this->config->base_url();

		$this->load->library('My_PHPMailer');

		$this->load->model('MediaModel', 'media');
		$this->load->model('UsersModel', 'users');
	}

	public function addPaymentMethod() {
		$cvc = $this->input->post('cvc');
		$email = $this->input->post('email');
		$emailRequired = $this->input->post('emailRequired');
		$expiry = $this->input->post('expiry');
		$name = $this->input->post('name');
		$number = $this->input->post('number');

		$user = $this->user;
		$user_id = $user ? $user->id : null;

		$cardType = checkCreditCard($number);
		if (!$cardType) {
			echo json_encode([
				'error' => 'Please enter a valid card number'
			]);
			exit;
		}

		if (empty($name)) {
			echo json_encode([
				'error' => 'Please enter a valid name'
			]);
			exit;
		}

		if (strlen($cvc) > 4 || strlen($cvc) < 3 || !is_numeric($cvc)) {
			echo json_encode([
				'error' => 'Please enter a valid CVC value'
			]);
			exit;
		}

		if (strlen($expiry) !== 4) {
			echo json_encode([
				'error' => 'Please enter a valid expiration date'
			]);
			exit;
		}

		$month = substr($expiry, 0, 2);
		$year = substr($expiry, 2);

		if ($month > 12 || $month < 1) {
			echo json_encode([
				'error' => 'Please enter a valid expiration month'
			]);
			exit;
		}

		if ($year < date('y')) {
			echo json_encode([
				'error' => 'This card has expired'
			]);
			exit;
		}

		if ($emailRequired && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
			echo json_encode([
				'error' => 'Please enter a valid email'
			]);
			exit;
		}

		if (!$user) {
			$_user = $this->users->userLookupByEmail($email);

			if (!$_user) {
				$register = $this->users->register([
					'email' => $email,
					'name' => $name,
					'password' => 'bikerentnyc',
					'username' => $this->users->generateUsername($name),
					'verification_code' => generateAlphaNumString(10)
				]);

				if ($register['error']) {
					echo json_encode([
						'error' => $register['msg']
					]);
					exit;
				}

				$user_id = $register['user']['id'];
			} else {
				$user_id = $_user['id'];
			}
		}

		$paymentId = $this->users->addPaymentMethod([
			'cvc' => $cvc,
			'exp_month' => $month,
			'exp_year' => $year,
			'name' => $name,
			'number' => $number,
			'type' => $cardType,
			'user_id' => $user_id
		]);

		echo json_encode([
			'error' => false,
			'paymentId' => $paymentId
		]);
	}

	public function changePassword() {
		$currentPassword = $this->input->post('current_password');
		$newPassword = $this->input->post('new_password');
		$confirmPassword = $this->input->post('confirm_password');

		$user = $this->user;
		if (!$user) {
			echo json_encode([
				'error' => 'You must be logged in to change your password'
			]);
			exit;
		}
		
		if (empty($currentPassword)) {
			echo json_encode([
				'error' => 'You must enter your current password'
			]);
			exit;
		}

		$exists = $this->users->getUserByCurrentPassword($user->id, $currentPassword);

		if (!$exists) {
			echo json_encode([
				'error' => 'Your current password is incorrect'
			]);
			exit;
		}

		if (strlen($newPassword) < 7) {
			echo json_encode([
				'error' => 'Your password must be at least 7 characters long'
			]);
			exit;
		}

		if ($newPassword !== $confirmPassword) {
			echo json_encode([
				'error' => 'Your passwords do not match'
			]);
			exit;
		}

		if ($newPassword === $currentPassword) {
			echo json_encode([
				'error' => 'Your password must be different than your old one'
			]);
			exit;
		}

		$this->users->updateUser($user->id, [
			'password' => sha1($newPassword),
		]);

		echo json_encode([
			'error' => false
		]);
	}

	public function changeProfilePic() {
		$user = $this->user;

		if (!$user) {
			echo json_encode([
				'error' => 'You must be logged in to change your picture'
			]);
			exit;
		}

		$this->load->library('upload', [
			'allowed_types' => 'jpg|jpeg|png',
			'file_ext_tolower' => true,
			'max_height' => 0,
			'max_size' => 25000,
			'max_width' => 0,
			'upload_path' => './public/img/users/'
		]);

		if (!$this->upload->do_upload('file')) {
			$data = $this->upload->display_errors();
			echo json_encode([
				'error' => $data
			]);
			exit;
		} 

		$data = $this->upload->data();
		$file = $data['file_name'];
		$path = $data['full_path'];

		if ($data['image_width'] !== $data['image_height']) {
			$original_path = $path;
			$path = './public/img/users/resized_'.$file;

			$this->load->library('image_lib', [
				'height' => 220,
				'maintain_ratio' => false,
				'new_image' => $path,
				'source_image' => $original_path,
				'width' => 220
			]);
			$this->image_lib->resize();
			$this->image_lib->clear();
			unlink($original_path);
		}

		$s3Path = 'users/'.$user->id.'_'.$file;
		$s3Link = $this->media->addToS3($s3Path, $path);

		$this->users->updateUser($user->id, [
			'img' => $s3Path
		]);

		echo json_encode([
			'error' => false,
			'img' => $s3Link
		]);
	}

	public function getAdmins() {
		$admins = $this->users->getAdmins();

		echo json_encode([
			'admins' => $admins,
			'error' => false
		]);
	}

	public function getInfo() {
		$username = $this->input->get('username');

		$select = "date_created, email_verified, u.id AS id, u.img AS img, u.name, username";
		$info = $this->users->getUserInfo($username, $select);

		if (!$info) {
			echo json_encode([
				'error' => 'That user does not exist'
			]);
			exit;
		}

		if (empty($info['bio'])) {
			$info['bio'] = $info['name']." does not have a bio yet";
		}

		echo json_encode([
			'error' => false,
			'user' => $info
		]);
	}

	public function getPaymentMethods() {
		$user = $this->user;
		if (!$user) {
			echo json_encode([
				'error' => 'You must login to view your payment methods'
			]);
			exit;
		}

		$methods = $this->users->getPaymentMethods($user->id);

		echo json_encode([
			'count' => empty($methods) ? 0 : count($methods),
			'error' => false,
			'results' => $methods
		]);
	}

	public function login() {
		$email = $this->input->post('email');
		$password = $this->input->post('password');

		if (empty($email)) {
			echo json_encode([
				'error' => 'Username or email is required'
			]);
			exit;
		}

		if (empty($password)) {
			echo json_encode([
				'error' => 'Password is required'
			]);
			exit;
		}

		$login = $this->users->login($email, $password);

		if (!$login) {
			echo json_encode([
				'error' => 'Incorrect login credentials'
			]);
			exit;
		}

		$user = $login[0];
		$user['emailVerified'] = $user['emailVerified'] === '1';
		$user['img'] = $user['img'] ? $user['img'] : null;

		echo json_encode([
			'error' => false,
			'user' => $user
		]);
	}

	public function lookUp() {
		$id = $this->input->get('id');
		$type = $this->input->get('type');

		$user = $this->users->userLookUp([
			'id' => $id,
			'type' => $type
		]);

		echo json_encode([
			'exists' => $user ? true : false
		]);
	}

	public function register() {
		$params = [
			'email' => $this->input->post('email'),
			'name' => $this->input->post('name'),
			'password' => $this->input->post('password'),
			'username' => $this->input->post('username'),
			'verification_code' => generateAlphaNumString(10)
		];

		if (!filter_var($params['email'], FILTER_VALIDATE_EMAIL)) {
			echo json_encode([
				'error' => 'A valid email is required'
			]);
			exit;
		}

		if (strlen($params['password']) < 7) {
			echo json_encode([
				'error' => 'Your password is not long enough'
			]);
			exit;
		}

		if (empty($params['name'])) {
			echo json_encode([
				'error' => 'A name is required'
			]);
			exit;
		}

		if (preg_match('/[\'^£$%&*()}{@#~?><>,|=_+¬-]/', $params['name'])) {
			echo json_encode([
				'error' => 'Your name cannot contain special characters'
			]);
			exit;
		}

		if (empty($params['username'])) {
			echo json_encode([
				'error' => 'A username is required'
			]);
			exit;
		}

		if (preg_match('/[\'^£$%&*()}{@#~?><>,|=_+¬-]/', $params['username'])
		|| strpos($params['username'], " ")) {
			echo json_encode([
				'error' => 'Your username cannot contain special characters or spaces'
			]);
			exit;
		}

		if (strlen($params['username']) > 18) {
			echo json_encode([
				'error' => 'Your username is too long'
			]);
			exit;
		}

		$register = $this->users->register($params);
		if ($register['error']) {
			echo json_encode([
				'error' => $register['msg']
			]);
			exit;
		}

		$email_template = $this->media->generateTemplate('confirm-your-email', [
			'name' => $params['name'],
			'verification_code' => $params['verification_code']
		]);
		$title = $email_template['title'];
		$msg = $email_template['msg'];
		$from = EMAIL_RECEIVERS;
		$to = [
			[
				'email' => $params['email'],
				'name' => $params['name']
			]
		];
		$mail = $this->media->sendEmail($title, $msg, $from, $to);

		if (!$mail) {
			echo json_encode([
				'error' => 'Something went wrong.'
			]);
			exit;
		}

		echo json_encode($register);
	}

	public function search() {
		$q = $this->input->get('q');
		$page = $this->input->get('page');

		$where = [];
		$limit = 20;
		$start = $page*$limit;

		$count = $this->users->search($q, $where, $page, true, $limit);
		$pages = ceil($count/$limit);

		$results = $this->users->search($q, $where, $page, false, $limit);

		echo json_encode([
			'count' => (int)$count,
			'error' => false,
			'hasMore' => $page+1 < $pages,
			'page' => (int)$page,
			'pages' => $pages,
			'results' => !$results ? [] : $results
		]);
	}

	public function setDefaultPaymentMethod() {
		$id = $this->input->post('id');

		$user = $this->user;
		if (!$user) {
			echo json_encode([
				'error' => 'You must login to edit payment methods'
			]);
			exit;
		}

		$method = $this->users->getPaymentMethod($id);

		if (!$method) {
			echo json_encode([
				'error' => 'This payment method does not exist'
			]);
			exit;
		}

		if ($method['user_id'] != $user->id) {
			echo json_encode([
				'error' => 'You do not have permission to edit this payment method'
			]);
			exit;
		}

		$this->users->setDefaultPaymentMethod($id, $user->id);

		echo json_encode([
			'error' => false
		]);
	}

	public function update() {
		$bio = $this->input->post('bio');

		$user = $this->user;
		if (!$user) {
			echo json_encode([
				'error' => 'You must login to update your account'
			]);
			exit;
		}

		$data = [];

		if (!empty($bio)) {
			$data['bio'] = $bio;
		}

		$this->users->updateUser($user->id, $data);

		echo json_encode([
			'data' => $data,
			'error' => false
		]);
	}

	public function verifyEmail() {
		$user = $this->user;

		if (!$user) {
			echo json_encode([
				'error' => 'You must login to verify your account'
			]);
			exit;
		}

		if ($this->input->post('code') !== $user->verificationCode) {
			echo json_encode([
				'error' => 'Incorrect verification code'
			]);
			exit;
		}

		$this->users->updateUser($user->id, [
			'email_verified' => 1
		]);
		$this->user->emailVerified = true;

		echo json_encode([
			'error' => false,
			'user' => $user
		]);
	}
}
