<?php
	function slugify($text) {
		$text = str_replace("'", '', $text);
		$text = str_replace('"', '', $text);
		$text = preg_replace('~[^\\pL\d]+~u', '-', $text);
		$text = trim($text, '-');
		$text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
		$text = strtolower($text);
		$text = preg_replace('~[^-\w]+~', '', $text);
		if (empty($text)) {
			return 'n-a';
		}

		return $text;
	}

	$base_url = 'https://tpusa.pro/';
	header('Content-type: application/xml');
	echo '<?xml version="1.0" encoding="UTF-8" ?>';
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc><?php echo $base_url; ?></loc> 
		<changefreq>daily</changefreq>
		<priority>1.0</priority>
	</url>

<?php
	for ($i=0;$i<count($reviews);$i++) {
		$id = $reviews[$i]['id'];
		$professor = slugify($reviews[$i]['professor_name']);
		$school = slugify($reviews[$i]['school_name']);
		$user = slugify($reviews[$i]['user_name']);
		$url = $base_url.'reviews/'.$professor.'-'.$school.'-'.$user.'-'.$id;
?>
	<url>
		<loc><?php echo $url; ?></loc>
		<changefreq>daily</changefreq>
		<priority>0.9</priority>
	</url>
<?php
	}
?>

<?php
	for ($i=0;$i<count($schools);$i++) {
		$id = $schools[$i]['id'];
		$school = slugify($schools[$i]['name']);
		$url = $base_url.'schools/'.$school.'-'.$id;
?>
	<url>
		<loc><?php echo $url; ?></loc>
		<changefreq>daily</changefreq>
		<priority>0.8</priority>
	</url>
<?php
	}
?>

	<url>
		<loc><?php echo $base_url; ?>reviews/create</loc> 
		<changefreq>daily</changefreq>
		<priority>0.8</priority>
	</url>

	<url>
		<loc><?php echo $base_url; ?>signin</loc>
		<changefreq>never</changefreq>
		<priority>0.6</priority>
	</url>

	<url>
		<loc><?php echo $base_url; ?>leaders/charlie-kirk</loc>
		<changefreq>never</changefreq>
		<priority>0.5</priority>
	</url>

	<url>
		<loc><?php echo $base_url; ?>leaders/anna-paulina-luna</loc>
		<changefreq>never</changefreq>
		<priority>0.5</priority>
	</url>

	<url>
		<loc><?php echo $base_url; ?>leaders/brandon-tatum</loc>
		<changefreq>never</changefreq>
		<priority>0.5</priority>
	</url>

	<url>
		<loc><?php echo $base_url; ?>leaders/rob-smith</loc>
		<changefreq>never</changefreq>
		<priority>0.5</priority>
	</url>

	<url>
		<loc><?php echo $base_url; ?>about</loc>
		<changefreq>never</changefreq>
		<priority>0.3</priority>
	</url>
</urlset>
