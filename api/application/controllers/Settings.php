<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Settings extends CI_Controller {
	public function __construct() {
		parent:: __construct();

		$this->base_url = $this->config->base_url();

		$this->load->model('MediaModel', 'media');
		$this->load->model('SettingsModel', 'settings');

		$this->emails = [
			'application-confirmation',
			'confirm-your-email',
			'order-confirmation',
			'refund'
		];

		$this->pages = [
			'aboutPage',
			'applyPage',
			'bikesPage',
			'checkoutPage',
			'citiesPage',
			'contactPage',
			'faqPage',
			'homePage',
			'partnersPage',
			'signinPage',
			'storesPage',
			'termsPage'
		];

		$this->themes = [
			'amazon',
			'bootstrap3',
			'cerulean',
			'chubby',
			'cosmo',
			'cyborg',
			'darkly',
			'flat',
			'flatly',
			'github',
			'journal',
			'litera',
			'lumen',
			'lux',
			'materia',
			'material',
			'minty',
			'pulse',
			'sandstone',
			'semantic',
			'simplex',
			'sketchy',
			'slate',
			'solar',
			'spacelab',
			'superhero',
			'twitter',
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

		$template = file_get_contents('https://bike-rent.s3-us-west-2.amazonaws.com/emails/'.$type.'.html');

		$title = 'Your application has been received';
		$msg = str_replace('{name}', '<b>USER</b>', $template);

		if ($email === 'confirm-your-email') {
			$title = 'Please confirm your email';
			$msg = str_replace('{verificationCode}', '<b>VERIFICATION_CODE</b>', $template);
		}

		if ($email === 'order-confirmation') {
			$title = 'Your order summary';
		}

		if ($email === 'refund') {
			$title = 'Your order has been refunded';
		}

		$from = EMAIL_RECEIVERS;
		$email = $this->media->sendEmail($title, $msg, $from);

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

	public function updateCss() {
		$css = $this->input->post('css');

		$user = $this->user;
		if (!$user) {
			echo json_encode([
				'error' => 'You must be logged in to make changes'
			]);
			exit;
		}

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

		$user = $this->user;
		if (!$user) {
			echo json_encode([
				'error' => 'You must be logged in to make changes'
			]);
			exit;
		}

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

		$user = $this->user;
		if (!$user) {
			echo json_encode([
				'error' => 'You must be logged in to make changes'
			]);
			exit;
		}

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
		$logo = $this->input->post('logo');
		$logoText = $this->input->post('logoText');
		$signInButton = $this->input->post('signInButton');
		$signUpButton = $this->input->post('signUpButton');

		$user = $this->user;
		if (!$user) {
			echo json_encode([
				'error' => 'You must be logged in to make changes'
			]);
			exit;
		}

		$settings = $this->settings;
		$settings = new $settings();
		$header = $settings->updateHeader(
			$backgroundColor,
			$listItems,
			$logo,
			$logoText,
			$signInButton,
			$signUpButton
		);

		echo $header;
	}

	public function updateLanguages() {
		$languages = $this->input->post('languages');

		if (empty($languages)) {
			echo json_encode([
				'error' => 'You must select at least one language'
			]);
			exit;
		}

		$user = $this->user;
		if (!$user) {
			echo json_encode([
				'error' => 'You must be logged in to make changes'
			]);
			exit;
		}

		$settings = $this->settings;
		$settings = new $settings();
		$newLanguages = $settings->updateLanguages($languages);

		echo $newLanguages;
	}

	public function updatePage() {
		$data = $this->input->post('data');
		$page = $this->input->post('page');

		$user = $this->user;
		if (!$user) {
			echo json_encode([
				'error' => 'You must be logged in to make changes'
			]);
			exit;
		}

		if (!in_array($page, $this->pages)) {
			echo json_encode([
				'error' => 'That page does not exist'
			]);
			exit;
		}

		$settings = $this->settings;
		$settings = new $settings();
		$filtered = $settings->filterPageData($page, $data);
		// FormatArray($data);
		// FormatArray($filtered);
		// die;

		$newPage = $settings->updatePage($page, $data);

		echo $newPage;
	}

	public function updateSeo() {
		$page = $this->input->post('page');
		$seo = $this->input->post('seo');

		$user = $this->user;
		if (!$user) {
			echo json_encode([
				'error' => 'You must be logged in to make changes'
			]);
			exit;
		}

		$settings = $this->settings;
		$settings = new $settings();
		$newSeo = $settings->updateSeo($page, $seo);

		echo $newSeo;
	}

	public function updateSitemap() {
		$sitemap = $this->input->post('sitemap');

		if (empty($sitemap)) {
			echo json_encode([
				'error' => 'Your sitemap cannot be empty'
			]);
			exit;
		}

		$user = $this->user;
		if (!$user) {
			echo json_encode([
				'error' => 'You must be logged in to make changes'
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

	public function updateTheme() {
		$theme = $this->input->post('theme');

		if (!in_array($theme, $this->themes)) {
			echo json_encode([
				'error' => 'This is not a valid theme'
			]);
			exit;
		}

		$user = $this->user;
		if (!$user) {
			echo json_encode([
				'error' => 'You must be logged in to make changes'
			]);
			exit;
		}

		$settings = $this->settings;
		$settings = new $settings();
		$newTheme = $settings->updateTheme($theme);

		echo $newTheme;
	}
}
