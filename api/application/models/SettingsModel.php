<?php
class SettingsModel extends CI_Model {
	public function __construct() {
		parent:: __construct();

		$this->configFile = APPPATH.'third_party/settings.json';
		$this->config = file_get_contents(APPPATH.'third_party/settings.json');
	}

	public function decodeSettings() {
		return @json_decode($this->config, true);
	}

	public function filterPageData($page, $data) {
		$allowed = ['content', 'description', 'hero', 'title', 'useHeroImage'];

		switch ($page) {
			case 'applyPage':
				$allowed[] = 'ctaButton';
				break;

			case 'bikesPage':
			case 'citiesPage':
			case 'storesPage':
				$allowed[] = 'ctaButton';
				$allowed[] = 'useCards';
				break;

			case 'contactPage':
				$allowed[] = 'placeholderText';
				$allowed[] = 'toastMsg';
				break;

			case 'signinPage':
				$allowed[] = 'signInButton';
				break;
		}

		$filtered = filterArray($data, $allowed);
		return $filtered;
	}

	public function insertApplication($email, $msg, $name) {
		$this->db->insert('applications', [
			'email' => $email,
			'msg' => $msg,
			'name' => $name
		]);
	}

	public function updateFooter(
		$listOneItems,
		$listOneTitle,
		$inverted,
		$listTwoItems,
		$listTwoTitle,
		$subTitle,
		$title
	) {
		$decode = $this->decodeSettings();
		$decode['footer'] = [
			'firstList' => [
				'items' => $listOneItems,
				'title' => $listOneTitle
			],
			'inverted' => (int)$inverted,
			'secondList' => [
				'items' => $listTwoItems,
				'title' => $listTwoTitle
			],
			'subtitle' => $subTitle,
			'title' => $title
		];

		$json = json_encode($decode, JSON_PRETTY_PRINT);
		file_put_contents($this->configFile, $json);

		return $json;
	}

	public function updateHeader(
		$color,
		$listItems,
		$logo,
		$logoText,
		$signIn,
		$signUp
	) {
		$decode = $this->decodeSettings();
		$decode['header'] = [
			'backgroundColor' => $color,
			'items' => $listItems,
			'logo' => $logo,
			'logoText' => $logoText,
			'signInButton' => [
				'basic' => (int)$signIn['signInBasic'],
				'color' => $signIn['signInColor'],
				'inverted' => (int)$signIn['signInInverted'],
				'text' => $signIn['signInText']
			],
			'signUpButton' => [
				'basic' => (int)$signUp['signUpBasic'],
				'color' => $signUp['signUpColor'],
				'inverted' => (int)$signUp['signUpInverted'],
				'text' => $signUp['signUpText']
			],
		];

		$json = json_encode($decode, JSON_PRETTY_PRINT);
		file_put_contents($this->configFile, $json);

		return $json;
	}

	public function updateLanguages($languages) {
		$decode = $this->decodeSettings();
		$decode['languages'] = $languages;
		$json = json_encode($decode, JSON_PRETTY_PRINT);
		file_put_contents($this->configFile, $json);

		return $json;
	}

	public function updatePage($page, $data) {
		$decode = $this->decodeSettings();
		$seo = $decode[$page]['seo'];
		$decode[$page] = $data;
		$decode[$page]['seo'] = $seo;

		$json = json_encode($decode, JSON_PRETTY_PRINT);
		file_put_contents($this->configFile, $json);

		return $json;
	}

	public function updateSeo($page, $seo) {
		$decode = $this->decodeSettings();
		$decode[$page]['seo'] = $seo;
		$json = json_encode($decode, JSON_PRETTY_PRINT);
		file_put_contents($this->configFile, $json);

		return $json;
	}

	public function updateTheme($theme) {
		$decode = $this->decodeSettings();
		$decode['theme'] = $theme;
		$json = json_encode($decode, JSON_PRETTY_PRINT);
		file_put_contents($this->configFile, $json) or die('cant');

		return $json;
	}
}
