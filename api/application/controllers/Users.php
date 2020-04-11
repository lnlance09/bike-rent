<?php
defined('BASEPATH') OR exit('No direct script access allowed');
date_default_timezone_set('UTC');

class Users extends CI_Controller {
	public function __construct() {
		parent:: __construct();

		$this->baseUrl = $this->config->base_url();

		$this->load->library('My_PHPMailer');

		$this->load->model('MediaModel', 'media');
		$this->load->model('SettingsModel', 'settings');
		$this->load->model('UsersModel', 'users');

		$this->load->helper('validation');
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

		validateEmptyField($cardType, 'Please enter a valid card number');
		validateEmptyField($name, 'Please enter a valid name');
		validateCvc($cvc, 'Please enter a valid CVC value');
		validateExpDate($expiry, 'Please enter a valid expiration date');

		$month = substr($expiry, 0, 2);
		$year = substr($expiry, 2);

		if ($emailRequired) {
			validateEmail($email, 'Please enter a valid email');
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

		validateLoggedIn($user, 'You must be logged in to change your password');
		validateEmptyField($currentPassword, 'You must enter your current password');

		$exists = $this->users->getUserByCurrentPassword($user->id, $currentPassword);
		validateEmptyField($exists, 'Your current password is incorrect');
		validatePassword($newPassword, 'Your password must be at least 7 characters long');
		validateItemsMatch($newPassword, $confirmPassword, 'Your passwords do not match');
		validateItemsDifferent($newPassword, $currentPassword, 'Your password must be different than your old one');

		$this->users->updateUser($user->id, [
			'password' => sha1($newPassword),
		]);

		echo json_encode([
			'error' => false
		]);
	}

	public function changeProfilePic() {
		$user = $this->user;

		validateLoggedIn($user, 'You must be logged in to change your picture');

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
		validateEmptyField($info, 'That user does not exist');

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
		validateLoggedIn($user, 'You must login to view your payment methods');

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

		validateEmptyField($email, 'Username or email is required');
		validateEmptyField($password, 'Password is required');

		$login = $this->users->login($email, $password);
		validateEmptyField($login, 'Incorrect login credentials');

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

		validateEmail($params['email'], 'A valid email is required');
		validatePassword($params['password'], 'Your password is not long enough');
		validateEmptyField($params['name'], 'A name is required');
		validateName($params['name'], 'Your name cannot contain special characters');
		validateEmptyField($params['username'], 'A username is required');
		validateUsername($params['username'], 'Your username cannot contain special characters or spaces');

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
		$from = $this->settings->getEmailRecipients('confirmYourEmail');
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

		validateLoggedIn($user, 'You must login to edit payment methods');

		$method = $this->users->getPaymentMethod($id);
		validateEmptyField($method, 'This payment method does not exist');
		validateItemsMatch($method['user_id'], $user->id, 'You do not have permission to edit this payment method');

		$this->users->setDefaultPaymentMethod($id, $user->id);

		echo json_encode([
			'error' => false
		]);
	}

	public function update() {
		$bio = $this->input->post('bio');
		$user = $this->user;

		validateLoggedIn($user, 'You must login to update your account');

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
		$code = $this->input->post('code');
		$user = $this->user;

		validateLoggedIn($user, 'You must login to update your account');
		validateItemsMatch($code, $user->verificationCode, 'Incorrect verification code');

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
