<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Settings extends CI_Controller {
	public function __construct() {
		parent:: __construct();

		$this->base_url = $this->config->base_url();

		$this->load->model('MediaModel', 'media');
		$this->load->model('SettingsModel', 'settings');

		$this->load->helper('validation');

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

	public function getEmail() {
		$key = $this->input->get('key');
		$type = $this->input->get('type');

		$url = 'https://bike-rent.s3-us-west-2.amazonaws.com/emails/'.$type.'.html';
		$email = @file_get_contents($url);

		$settings = $this->settings;
		$settings = new $settings();
		$decode = $settings->decodeSettings();
		$emails = $decode['emails'];
		$recipients = $emails[$key]['recipients'];

		echo json_encode([
			'email' => $email,
			'recipients' => $recipients,
			'error' => false
		]);
	}

	public function sendTestEmail() {
		$email = $this->input->post('email');
		$type = $this->input->post('type');

		validateEmail($email, 'A valid email is required');

		if (!in_array($type, $this->emails)) {
			echo json_encode([
				'error' => 'That email template does not exist'
			]);
			exit;
		}

		$email_template = $this->media->generateTemplate($type, EMAIL_TEMPLATE_DATA);
		$title = $email_template['title'];
		$msg = $email_template['msg'];
		$from = EMAIL_RECEIVERS;
		$to = [
			[
				'email' => $email,
				'name' => 'Admin Panel User'
			]
		];
		$mail = $this->media->sendEmail($title, $msg, $from, $to);

		if (!$mail) {
			echo json_encode([
				'error' => 'Something went wrong'
			]);
			exit;
		}

		echo json_encode([
			'error' => false
		]);
	}

	public function updateCss() {
		$css = $this->input->post('css');
		$user = $this->user;

		validateLoggedIn($user, 'You must be logged in');

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
		$key = $this->input->post('key');
		$recipients = $this->input->post('recipients');
		$type = $this->input->post('type');
		$user = $this->user;

		validateLoggedIn($user, 'You must be logged in');

		// Update the email template in S3
		$file = APPPATH.'third_party/'.$type.'.html';
		file_put_contents($file, $email);
		$this->media->addToS3('emails/'.$type.'.html', $file, true, true);

		if (empty($recipients)) {
			$recipients = [];
		} else {
			$recipients = $this->users->validateAdmins($recipients);
		}

		$settings = $this->settings;
		$settings = new $settings();
		$updatedEmail = $settings->updateEmailRecipients($key, $recipients);

		if (!$updatedEmail) {
			echo json_encode([
				'error' => 'There was an error updating the recipients'
			]);
			exit;
		}

		echo json_encode([
			'email' => $email,
			'error' => false,
			'recipients' => $recipients
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

		validateLoggedIn($user, 'You must be logged in to make changes');

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

	public function updateGeneralInfo() {
		$favicon = $this->input->post('favicon');
		$fbAppId = $this->input->post('fbAppId');
		$fbPageUrl = $this->input->post('fbPageUrl');
		$instagramScreenName = $this->input->post('instagramScreenName');
		$twitterScreenName = $this->input->post('twitterScreenName');
		$user = $this->user;

		validateLoggedIn($user, 'You must be logged in to make changes');

		$settings = $this->settings;
		$settings = new $settings();
		$header = $settings->updateGeneralInfo(
			$favicon,
			$fbAppId,
			$fbPageUrl,
			$instagramScreenName,
			$twitterScreenName
		);

		echo $header;
	}

	public function updateHeader() {
		$backgroundColor = $this->input->post('backgroundColor');
		$listItems = $this->input->post('listItems');
		$logo = $this->input->post('logo');
		$logoText = $this->input->post('logoText');
		$signInButton = $this->input->post('signInButton');
		$signUpButton = $this->input->post('signUpButton');
		$user = $this->user;

		validateLoggedIn($user, 'You must be logged in to make changes');

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
		$user = $this->user;

		validateLoggedIn($user, 'You must be logged in to make changes');
		validateEmptyField($languages, 'You must select at least one language');

		$settings = $this->settings;
		$settings = new $settings();
		$newLanguages = $settings->updateLanguages($languages);

		echo $newLanguages;
	}

	public function updatePage() {
		$data = $this->input->post('data');
		$page = $this->input->post('page');
		$user = $this->user;

		validateLoggedIn($user, 'You must be logged in to make changes');

		if (!in_array($page, $this->pages)) {
			echo json_encode([
				'error' => 'That page does not exist'
			]);
			exit;
		}

		$settings = $this->settings;
		$settings = new $settings();
		$filtered = $settings->filterPageData($page, $data);
		$newPage = $settings->updatePage($page, $data);

		echo $newPage;
	}

	public function updateSeo() {
		$page = $this->input->post('page');
		$seo = $this->input->post('seo');
		$user = $this->user;

		validateLoggedIn($user, 'You must be logged in to make changes');

		$settings = $this->settings;
		$settings = new $settings();
		$newSeo = $settings->updateSeo($page, $seo);

		echo $newSeo;
	}

	public function updateSitemap() {
		$sitemap = $this->input->post('sitemap');
		$user = $this->user;

		validateLoggedIn($user, 'You must be logged in to make changes');
		validateEmptyField($sitemap, 'Your sitemap cannot be empty');

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
		$user = $this->user;

		if (!in_array($theme, $this->themes)) {
			echo json_encode([
				'error' => 'This is not a valid theme'
			]);
			exit;
		}

		validateLoggedIn($user, 'You must be logged in to make changes');

		$settings = $this->settings;
		$settings = new $settings();
		$newTheme = $settings->updateTheme($theme);

		echo $newTheme;
	}
}
