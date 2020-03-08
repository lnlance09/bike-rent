<?php
	$uri = $_SERVER['REQUEST_URI'];
	$paths = explode('/', $uri);
	array_splice($paths, 0, 1);

	$base_url = "https://tpusa.pro/";
	$canonical_url = "https://tpusa.pro".$uri;
	$title = "Professor Watchlist";

	$description = "TP USA Pro is a project that was inspired by Turning Point USA's professor watchlist. It is meant to help document and combat leftist indoctrination on college campuses.";

	$keywords = [
		"professor watchlist",
		"leftism",
		"liberal professors",
		"Turning Point USA",
		"Charlie Kirk",
	];
	$html = "";

	$schema = false;
	$s3_path = "https://s3.amazonaws.com/dpusa1/";
	$img = $base_url."tpusa.jpg";
	$apple_icon = $base_url."icons/apple-touch-icon.png";

	$set = false;
	$author = false;
	$author_url = "";

	switch ($uri) {
		case "/signin":
			$title = "Sign In";
			$description = "Sign in to TP USA or create an account.";
			$set = true;
			break;

		case "/reviews/create":
			$title = "Review a Professor";
			$description = "Be a patriotic American and reviews a liberal professor today. They will be placed on TP USA's Watch list.";
			$set = true;
			break;

		case "/leaders/charlie-kirk":
			$title = "Charlie Kirk";
			$description = "Founder of Turning Point USA, Charlie Kirk, is one of the most ardent Conservative voices in America right now. He founded Turning Point USA in 2012 and it is now the largest grassroots network of College Conservatives in the country. His unwavering Commitment to Conservative Principles is what propelled him in to the lime light and he always remains firm in his convictions even if there is no evidence to support them. Charlie knows that contrary to mainstream opinion it is not logical consistency or intellectual honesty that cements ones reputation as a Conservative pundit - its faith.";
			$set = true;
			break;

		case "/leaders/candace-owens":
			$title = "Candace Owens";
			$description = "Candace Owens burst onto the scene in 2017 shortly after launching her Youtube channel and has since become one of the World’s most prominent black Conservatives. Her message is Profound yet very simple - left is bad and right is good. Candace’s ability to re hash the most common talking points with an almost Algorithmic predictability has earned her a spot in the front lines of the Culture War. Wielding her skin tone like a Gladiator wields a shield, Candace deflects every single charge of bigotry thats directed at her like a Pro by letting it be known that minorities can not be bigoted.";
			$set = true;
			break;

		case "/leaders/brandon-tatum":
			$title = "Brandon Tatum";
			$description = "Brandon Tatum is a four year veteran of the Tuscon Arizona Police Department. Brandon thoroughly enjoyed Protecting and Serving his community but it was not until the summer of 2017 that he had a Epiphany moment and came to the Realization that his true calling in life was to become a clothing salesman on Twitter. The rest is history. Since joining the Turning Point team, Brandon has made it his career to spread the Conservative Philosophy to anyone who is willing to listen. Brandons fiery speeches that are Delivered from the drivers seat of his car on Facebook capture of the Essence of what rugged Masculinity in the 21st century should be about - worshipping Authority and obeying the rules.";
			$set = true;
			break;

		case "/leaders/rob-smith":
			$title = "Rob Smith";
			$description = "Rob Smith is a Veteran who is both Gay AND Black and he is fed up with the Weaponization of Identity Politics. He is a Navy Veteran and like many of his colleagues at Turning Point, he has more than a few Immutable traits that really disrupt the Progressive agenda. Not only is Rob both obviously Gay and black, he is also a proud Veteran who dutifully served his Country. His unique ability to check of a whopping 3 boxes on the list of Oppressed groups places him in an Elite league of pundits that have made it there missions to crusade against the tragedy that is Identity politics.";
			$set = true;
			break;
	}

	if (!$set) {
		$mysqli = new mysqli("turning-point.cgyqtjcifq2g.us-east-1.rds.amazonaws.com:3306", "admin", "XZ6m17NmxhkB!DB", "turning_point");
		if ($mysqli->connect_errno) {
			printf("Connect failed: %s\n", $mysqli->connect_error);
			exit();
		}

		$id = $paths[1];

		switch ($paths[0]) {
			case "reviews":

				$exp = explode('-', $id);
				$id = end($exp);

				$id = $mysqli->real_escape_string($id);
				$sql = "SELECT r.description, r.date_created,
						p.name AS professor_name, p.id AS professor_id,
						s.name AS school_name, s.id AS school_id,
						u.name AS user_name, u.username AS user_username
						FROM reviews r
						INNER JOIN professors p ON r.professor_id = p.id
						INNER JOIN schools s ON p.school_id = s.id
						INNER JOIN users u ON r.user_id = u.id
						WHERE r.id = '".$id."'";
				$result = $mysqli->query($sql);

				if ($result->num_rows === 1) {
					while ($row = $result->fetch_assoc()) {
						$description = $row['description'];
						$date_created = $row['date_created'];

						$professor_name = $row['professor_name'];
						$professor_id = $row['professor_id'];

						$school_name = $row['school_name'];
						$school_id = $row['school_id'];

						$author = $row['user_name'];
						$author_url = $base_url.'users/'.$row['user_username'];

						$title = 'Review of '.$professor_name.', Professor at '.$school_name;
					}
					$result->close();

					$schema_keywords = [
						'Tag:'.$school_name,
						'Tag:'.$professor_name
					];

					$keywords[] = $school_name;
					$keywords[] = $professor_name;

					$schema = [
						"@context" => "http://schema.org",
						"@type" => "NewsArticle",
						"image" => $img,
						"url" => $canonical_url,
						"dateCreated" => $date_created,
						"datePublished" => $date_created,
						"dateModified" => $date_created,
						"headline" => $title,
						"name" => $title,
						"description" => $description,
						"identifier" => $id,
						"keywords" =>  $schema_keywords,
						"author" => [
							"@type" => "Person",
							"name" => $author,
							"url" => $author_url
						],
						"creator" => $author,
						"publisher" => [
							"@type" => "Organization",
							"name" => "TP USA Pro",
							"url" => $base_url,
							"logo" => [
								"@type" => "ImageObject",
								"url" => $img,
								"width" => "512",
								"height" => "512"
							]
						],
						"mainEntityOfPage" => $canonical_url
					];

					$html = '<div>
								<h1>
									'.$title.'
								</h1>

								<p>'.$description.'</p>

								<a href="'.$author_url.'">'.$author.'</a>

								<a href="'.$base_url.'professors/'.$professor_id.'">'.$professor_name.'</a>

							</div>';
				}
				break;

			case "schools":

				$exp = explode('-', $id);
				$id = end($exp);

				$id = $mysqli->real_escape_string($id);
				$sql = "SELECT img, name FROM schools
						WHERE id = '".$id."'";
				$result = $mysqli->query($sql);

				if ($result->num_rows === 1) {
					while ($row = $result->fetch_assoc()) {
						$school_img = $row['img'];
						$school_name = $row['name'];

						$title = $school_name.' Chapter';
					}
					$result->close();

					$description = $title;
					$keywords[] = $school_name;

					$html = '<div>
								<h1>
									'.$title.'
								</h1>

								<p>'.$description.'</p>
							</div>';
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

		<meta property="og:description" content="<?php echo htmlentities($description); ?>">
		<meta property="og:image" content="<?php echo $img; ?>">
		<meta property="og:image:height" content="<?php echo $height; ?>">
		<meta property="og:image:width" content="<?php echo $width; ?>">
		<meta property="og:site_name" content="TP USA Pro" />
		<meta property="og:title" content="<?php echo htmlentities($title); ?> - TP USA Pro">
		<meta property="og:type" content="website" />
		<meta property="og:url" content="<?php echo $canonical_url; ?>">

		<meta name="twitter:card" content="summary_large_image">
		<meta name="twitter:site" content="@tpusapro">
		<meta name="twitter:creator" content="@tpusapro">
		<meta name="twitter:title" content="<?php echo htmlentities($title); ?> - TP USA Pro">
		<meta name="twitter:description" content="<?php echo htmlentities($description); ?>">
		<meta name="twitter:image" content="<?php echo $img; ?>">

		<meta name="description" content="<?php echo htmlentities($description); ?>">
		<meta name="keywords" content="<?php echo implode(",", array_unique($keywords)); ?>">
		<meta name="title" content="<?php echo htmlentities($title); ?> - TP USA Pro">

<?php
	if ($author) {
?>
		<meta property="article:publisher" content="<?php echo $author; ?>">
		<meta property="article:author" content="<?php echo $author; ?>">
		<meta name="author" content="<?php echo $author; ?>">

		<link rel="publisher" href="<?php echo $base_url; ?>">
		<link rel="author" href="<?php echo $author_url; ?>">
<?php
	}
?>

		<link rel="canonical" href="<?php echo $canonical_url; ?>" />
		<link rel="home" href="<?php echo $base_url; ?>" />

		<link rel="stylesheet" type="text/css" href="/static/css/main.c6524b60.chunk.css">
		<link rel="manifest" href="/manifest.json">
		<link rel="shortcut icon" href="/favicon.ico?v=3">
		<link rel="apple-touch-icon" sizes="128x128" href="/favicon.ico?v=3">

		<title><?php echo $title; ?> - TP USA Pro</title>

<?php
	if ($schema) {
?>
		<script type="application/ld+json">
			<?php echo json_encode($schema); ?>
		</script>
<?php
	}
?>
	</head>

	<body>
		<noscript>
			You need to enable JavaScript to run this app.
		</noscript>

		<div id="root"></div>
		<div style="display: none;">
			<?php echo $html; ?>
		</div>
	</body>
	<script src="/static/js/2.091a881f.chunk.js"></script>
	<script src="/static/js/main.c36fc648.chunk.js"></script>
	<script src="/static/js/runtime-main.c2aea362.js"></script>

	<script>
		var sc_project=12158654;
		var sc_invisible=1;
		var sc_security="265125c2";
	</script>
	<script src="https://www.statcounter.com/counter/counter.js" async></script>
</html>
