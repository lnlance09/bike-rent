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
		$signIn,
		$signUp
	) {
		$decode = $this->decodeSettings();
		$decode['header'] = [
			'backgroundColor' => $color,
			'items' => $listItems,
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

	public function updateHomePage(
		
	) {
		$decode = $this->decodeSettings();
		$decode['homePage'] = [
			'hero' => [
				'button' => [
					'basic' => '',
					'color' => 'green',
					'inverted' => false,
					'text' => ''
				],
				'img' => '',
				'subtitle' => '',
				'title' => ''
			],
			'firstSection' => [
				'button' => [
					'basic' => '',
					'color' => 'green',
					'inverted' => false,
					'link' => '',
					'text' => ''
				],
				'img' => '',
				'items' => [
					[
						'subtitle' => '',
						'title' => ''
					],
					[
						'subtitle' => '',
						'title' => ''
					]
				]
			],
			'secondSection' => [
				'leftItem' => [
					'subtitle' => '',
					'title' => ''
				],
				'rightItem' => [
					'subtitle' => '',
					'title' => ''
				]
			],
			'seo' => [
				'desciption' => '',
				'img' => '',
				'keywords' => [
					''
				],
				'title' => ''
			],
			'thirdSection' => [
				'divider' => [
					'color' => '',
					'text' => ''
				],
				'firstItem' => [
					'subtitle' => '',
					'title' => ''
				],
				'secondItem' => [
					'subtitle' => '',
					'title' => ''
				]
			]
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
		file_put_contents($this->configFile, $json);

		return $json;
	}
}
