<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Settings extends CI_Controller {
	public function __construct() {
		parent:: __construct();

		$this->base_url = $this->config->base_url();

		$this->load->library('My_PHPMailer');

		$this->load->model('MediaModel', 'media');
		$this->load->model('SettingsModel', 'settings');

		$this->emails = [
			'application-confirmation',
			'confirm-your-email',
			'order-confirmation',
			'refund'
		];

		$this->themes = [
			'cerulean',
			'cosmo',
			'cyborg',
			'darkly',
			'flatly',
			'journal',
			'litera',
			'lumen',
			'lux',
			'materia',
			'minty',
			'pulse',
			'sandstone',
			'simplex',
			'sketchy',
			'slate',
			'solar',
			'spacelab',
			'superhero',
			'united',
			'yeti'
		];
	}

	public function index() {
		$settings = $this->settings;
		$settings = new $settings();
		echo $settings->config;
	}

	public function sendTestEmail() {
		$email = $this->input->post('email');
		$type = $this->input->post('type');

		if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
			echo json_encode([
				'error' => 'A valid email is required'
			]);
			exit;
		}

		if (!in_array($type, $this->emails)) {
			echo json_encode([
				'error' => 'That email template does not exist'
			]);
			exit;
		}

		$title = 'Your application has been received';

		if ($email === 'confirm-your-email') {
			$title = 'Please confirm your email';
		}

		if ($email === 'order-confirmation') {
			$title = 'Your order summary';
		}

		if ($email === 'refund') {
			$title = 'Your order has been refunded';
		}

		$msg = file_get_contents('https://bike-rent.s3-us-west-2.amazonaws.com/emails/'.$type.'.html');

		$mail = new PHPMailer();
		$mail->IsSMTP();
		$mail->SMTPAuth = true;
		$mail->SMTPSecure = 'ssl';
		$mail->Host = 'smtpout.secureserver.net';
		$mail->Port = 465;
		$mail->Username = 'admin@tpusa.pro';
		$mail->Password = 'Jl8RdSLz7DF8:PJ';
		$mail->SetFrom('admin@bikerent.com', 'BikeRent.com');
		$mail->Subject = $title;
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

	public function updateBikePage() {
		$settings = $this->settings;
		$settings = new $settings();
		$decode = $settings->decodeSettings();

		print_r($decode);
	}

	public function updateCityPage() {
		$settings = $this->settings;
		$settings = new $settings();
		$decode = $settings->decodeSettings();

		print_r($decode);
	}

	public function updateCss() {
		$css = $this->input->post('css');

		$file = APPPATH.'third_party/style.css';
		file_put_contents($file, $css);
		$this->media->addToS3('css/style.css', $file, true, true);

		echo json_encode([
			'css' => $css,
			'error' => false
		]);
	}

	public function updateEmail() {
		$email = $this->input->post('email');
		$type = $this->input->post('type');

		$file = APPPATH.'third_party/'.$type.'.html';
		file_put_contents($file, $email);
		$this->media->addToS3('emails/'.$type.'.html', $file, true, true);

		echo json_encode([
			'email' => $email,
			'error' => false
		]);
	}

	public function updateFooter() {
		$inverted = $this->input->post('inverted');
		$listOneItems = $this->input->post('listOneItems');
		$listOneTitle = $this->input->post('listOneTitle');
		$listTwoItems = $this->input->post('listTwoItems');
		$listTwoTitle = $this->input->post('listTwoTitle');
		$subTitle = $this->input->post('subTitle');
		$title = $this->input->post('title');

		/*
		$user = $this->user;
		if (!$user) {
			echo json_encode([
				'error' => 'You must be logged in to make changes'
			]);
			exit;
		}
		*/

		$settings = $this->settings;
		$settings = new $settings();
		$footer = $settings->updateFooter(
			$listOneItems,
			$listOneTitle,
			$inverted,
			$listTwoItems,
			$listTwoTitle,
			$subTitle,
			$title
		);

		echo $footer;
	}

	public function updateHeader() {
		$backgroundColor = $this->input->post('backgroundColor');
		$listItems = $this->input->post('listItems');
		$signInButton = $this->input->post('signInButton');
		$signUpButton = $this->input->post('signUpButton');

		/*
		$user = $this->user;
		if (!$user) {
			echo json_encode([
				'error' => 'You must be logged in to make changes'
			]);
			exit;
		}
		*/

		$settings = $this->settings;
		$settings = new $settings();
		$header = $settings->updateHeader(
			$backgroundColor,
			$listItems,
			$signInButton,
			$signUpButton
		);

		echo $header;
	}

	public function updateHomePage() {
		$settings = $this->settings;
		$settings = new $settings();
		$decode = $settings->decodeSettings();

		print_r($decode);
	}

	public function updateLanguages() {
		$languages = $this->input->post('languages');

		if (empty($languages)) {
			echo json_encode([
				'error' => 'You must select at least one language'
			]);
			exit;
		}

		/*
		$user = $this->user;
		if (!$user) {
			echo json_encode([
				'error' => 'You must be logged in to make changes'
			]);
			exit;
		}
		*/

		$settings = $this->settings;
		$settings = new $settings();
		$newLanguages = $settings->updateLanguages($languages);

		echo $newLanguages;
	}

	public function updateTheme() {
		$theme = $this->input->post('theme');

		if (!in_array($theme, $this->themes)) {
			echo json_encode([
				'error' => 'This is not a valid theme'
			]);
			exit;
		}

		/*
		$user = $this->user;
		if (!$user) {
			echo json_encode([
				'error' => 'You must be logged in to make changes'
			]);
			exit;
		}
		*/

		$settings = $this->settings;
		$settings = new $settings();
		$newTheme = $settings->updateTheme($theme);

		echo $newTheme;
	}

	public function updateSitemap() {
		$sitemap = $this->input->post('sitemap');

		if (empty($sitemap)) {
			echo json_encode([
				'error' => 'Your sitemap cannot be empty'
			]);
			exit;
		}

		$file = APPPATH.'third_party/sitemap.xml';
		file_put_contents($file, $sitemap);
		$this->media->addToS3('sitemaps/sitemap.xml', $file, true, true);

		echo json_encode([
			'error' => false,
			'sitemap' => $sitemap
		]);
	}

	public function updateStoresPage() {
		$settings = $this->settings;
		$settings = new $settings();
		$decode = $settings->decodeSettings();

		print_r($decode);
	}
}
