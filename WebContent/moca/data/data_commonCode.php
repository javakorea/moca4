<?php require $_SERVER["DOCUMENT_ROOT"]."/moca/data/JSON.php"; ?>
<?php
	header('Content-Type: application/json; charset=UTF-8');

	$json = new Services_JSON();
    $nation1 = array("cd" => "00A", "nm" => "미국");
    $nation2 = array("cd" => "00B", "nm" => "영국");
    $nation3 = array("cd" => "00K", "nm" => "한국");
    $nationData = array($nation1, $nation2, $nation3);
    
    $addr1 = array("cd" => "001", "nm" => "서울");
    $addr2 = array("cd" => "002", "nm" => "경기");
    $addr3 = array("cd" => "003", "nm" => "제주");
    $addrData = array($addr1, $addr2, $addr3);
    
    $age1 = array("cd" => "030", "nm" => "30세");
    $age2 = array("cd" => "031", "nm" => "31세");
    $age3 = array("cd" => "032", "nm" => "32세");
    $age4 = array("cd" => "033", "nm" => "33세");
    $age5 = array("cd" => "034", "nm" => "34세");
    $age6 = array("cd" => "035", "nm" => "35세");
    $age7 = array("cd" => "036", "nm" => "36세");
    $age8 = array("cd" => "037", "nm" => "37세");
    $age9 = array("cd" => "038", "nm" => "38세");
    $age10 = array("cd" => "039", "nm" => "39세");
    $age11 = array("cd" => "040", "nm" => "40세");
    $age12 = array("cd" => "041", "nm" => "41세");
    $age13 = array("cd" => "042", "nm" => "42세");
    $age14 = array("cd" => "043", "nm" => "43세");
    $age15 = array("cd" => "044", "nm" => "44세");
    $age16 = array("cd" => "045", "nm" => "45세");
    $age17 = array("cd" => "046", "nm" => "46세");
    $age18 = array("cd" => "047", "nm" => "47세");
    $age19 = array("cd" => "048", "nm" => "48세");
    $age20 = array("cd" => "049", "nm" => "49세");
    
    $ageData = array($age1, $age2, $age3, $age4, $age5, $age6, $age7, $age8, $age9, $age10, $age11, $age12, $age13, $age14, $age15, $age16, $age17, $age18, $age19, $age20);
    
    $board_field1 = array("cd" => "title", "nm" => "제 목");
    $board_field2 = array("cd" => "content", "nm" => "내 용");
    $board_field3 = array("cd" => "name", "nm" => "글쓴이");
    $fieldData = array($board_field1, $board_field2, $board_field3);
    
    
    $commonCode = array("grd_1.nation"=>$nationData,"cmb_1"=>$nationData, "addr"=>$addrData, "grd_1.age"=>$ageData, "field"=>$fieldData);
	$output = $json->encode($commonCode);
?>
<?php print $output; ?>
