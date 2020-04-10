<?php
	$uri = $_SERVER['REQUEST_URI'];
	$paths = explode('/', $uri);
	array_splice($paths, 0, 1);

	$set = false;
	$base_url = "http://ec2-54-189-130-245.us-west-2.compute.amazonaws.com/";
	$canonical_url = substr($base_url, 0, -1).$uri;
	$settings = file_get_contents($base_url."api/settings/");
	$settings = @json_decode($settings, true);

	$basic = $settings['basic'];
	$favicon = $basic['favicon'];
	$fb_app_id = $basic['fbAppId'];
	$fb_screenname = $basic['fbPageUrl'];
	$instagram_screenname = $basic['instagramScreenName'];
	$twitter_screenname = $basic['twitterScreenName'];

	switch ($uri) {
		case "/":
		case "/about":
		case "/apply":
		case "/bikes":
		case "/checkout":
		case "/cities":
		case "/contact":
		case "/faq":
		case "/home":
		case "/partners":
		case "/signin":
		case "/stores":
		case "/terms":

			$page_name = substr($uri, 1);
			$data = $settings[$page_name.'Page']['seo'];
			$title = $data['title'];
			$description = $data['description'];
			$img = $data['image'];
			$keywords = $data['keywords'];
			$set = true;
			break;
	}

	if (!$set) {
		$mysqli = new mysqli("bike-rent.cni5l9jtlymn.us-west-2.rds.amazonaws.com:3306", "admin", "7,C35-K4ns9SC2e", "bike-rent");
		if ($mysqli->connect_errno) {
			printf("Connect failed: %s\n", $mysqli->connect_error);
			exit();
		}

		$id = $paths[1];

		switch ($paths[0]) {
			case "bikes":

				$exp = explode("-", $id);
				$id = end($exp);

				$id = $mysqli->real_escape_string($id);
				$sql = "SELECT description, image, name
						FROM bikes WHERE id = '".$id."'";
				$result = $mysqli->query($sql);

				if ($result->num_rows === 1) {
					while ($row = $result->fetch_assoc()) {
						$description = $row['description'];
						$img = $row['image'];
						$title = $row['name'];
					}
					$result->close();
				}
				break;

			case "cities":

				$exp = explode("-", $id);
				$id = end($exp);

				$id = $mysqli->real_escape_string($id);
				$sql = "SELECT fl.description, fl.image, l.city
						FROM featured_locations fl
						INNER JOIN locations l ON fl.location_id = l.id
						WHERE l.id = '".$id."'";
				$result = $mysqli->query($sql);

				if ($result->num_rows === 1) {
					while ($row = $result->fetch_assoc()) {
						$description = $row['description'];
						$img = $row['image'];
						$title = $row['city'];
					}
					$result->close();
				}
				break;

			case "stores":

				$exp = explode("-", $id);
				$id = end($exp);

				$id = $mysqli->real_escape_string($id);
				$sql = "SELECT description, image, name
						FROM stores
						WHERE id = '".$id."'";
				$result = $mysqli->query($sql);

				if ($result->num_rows === 1) {
					while ($row = $result->fetch_assoc()) {
						$description = $row['description'];
						$img = $row['image'];
						$title = $row['name'];
					}
					$result->close();
				}
				break;
		}

		$mysqli->close();
	}

	list($width, $height) = getimagesize($img);
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf8mb4">
		<meta name="google-site-verification" content="PfYLnMfHys7h6fIgyMXaUllTBKb72zaQSsSakoCWqXs" />

		<meta name="viewport" content="width=device-width, user-scalable=0">
		<meta name="theme-color" content="#d50042">

		<meta property="fb:app_id" content="<?php echo $fb_app_id; ?>">
		<meta property="og:description" content="<?php echo htmlentities($description); ?>">
		<meta property="og:image" content="<?php echo $img; ?>">
		<meta property="og:image:height" content="<?php echo $height; ?>">
		<meta property="og:image:width" content="<?php echo $width; ?>">
		<meta property="og:site_name" content="BikeRent.com" />
		<meta property="og:title" content="<?php echo htmlentities($title); ?>">
		<meta property="og:type" content="website" />
		<meta property="og:url" content="<?php echo $canonical_url; ?>">

		<meta name="twitter:card" content="summary_large_image">
		<meta name="twitter:site" content="@<?php echo $twitter_screenname; ?>">
		<meta name="twitter:creator" content="@<?php echo $twitter_screenname; ?>">
		<meta name="twitter:title" content="<?php echo htmlentities($title); ?>">
		<meta name="twitter:description" content="<?php echo htmlentities($description); ?>">
		<meta name="twitter:image" content="<?php echo $img; ?>">

		<meta name="description" content="<?php echo htmlentities($description); ?>">
		<meta name="keywords" content="<?php echo $keywords; ?>">
		<meta name="title" content="<?php echo htmlentities($title); ?>">

		<link rel="canonical" href="<?php echo $canonical_url; ?>" />
		<link rel="home" href="<?php echo $base_url; ?>" />

		<link rel="stylesheet" type="text/css" href="/static/css/main.ed2ddb43.chunk.css">
		<link rel="stylesheet" type="text/css" href="/static/css/2.ec813231.chunk.css">
		<link rel="manifest" href="/manifest.json">
		<link rel="shortcut icon" href="<?php echo $basic['favicon'].'?v='.time(); ?>">
		<link rel="apple-touch-icon" sizes="128x128" href="<?php echo $basic['favicon'].'?v='.time(); ?>">

		<title><?php echo $title; ?></title>
	</head>

	<body>
		<noscript>
			You need to enable JavaScript to run this app.
		</noscript>

		<div id="root"></div>
		<div style="display: none;">
			
		</div>
	</body>
	<script src="/static/js/2.afb2d1a3.chunk.js"></script>
	<script src="/static/js/main.66f6cd16.chunk.js"></script>
	<script src="/static/js/runtime-main.ea387562.js"></script>

	<!--
	<script>
		var sc_project=12158654;
		var sc_invisible=1;
		var sc_security="265125c2";
	</script>
	<script src="https://www.statcounter.com/counter/counter.js" async></script>
	-->
</html>
