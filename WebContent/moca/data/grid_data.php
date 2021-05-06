<?php require $_SERVER["DOCUMENT_ROOT"]."/moca/data/JSON.php"; ?>
<?php
header('Content-Type: application/json; charset=UTF-8');

$json = new Services_JSON();
    $member1 = array("name" => "김세창", "height" => "180cm", "weight" => "75kg", "age" => "048", "nation" => "00K", "position" => "대표");
    $member2 = array("name" => "남태우", "height" => "182cm", "weight" => "-", "age" => "043", "nation" => "00A", "position" => "이사");
    $member3 = array("name" => "김태균", "height" => "174cm", "weight" => "76kg", "age" => "032", "nation" => "00B", "position" => "과장");
    $member4 = array("name" => "성혜진", "height" => "164cm", "weight" => "46kg", "age" => "028", "nation" => "00B", "position" => "대리");
    $member5 = array("name" => "홍은아", "height" => "160cm", "weight" => "40kg", "age" => "044", "nation" => "00A", "position" => "부장");
    $member6 = array("name" => "김주희", "height" => "161cm", "weight" => "52kg", "age" => "032", "nation" => "00B", "position" => "대리");
    $member7 = array("name" => "김세진", "height" => "180cm", "weight" => "75kg", "age" => "048", "nation" => "00K", "position" => "부장");
    $member8 = array("name" => "김현", "height" => "182cm", "weight" => "-", "age" => "043", "nation" => "00A", "position" => "과장");
    $member9 = array("name" => "이경범", "height" => "174cm", "weight" => "76kg", "age" => "032", "nation" => "00B", "position" => "과장");
    $member10 = array("name" => "이재욱", "height" => "164cm", "weight" => "46kg", "age" => "028", "nation" => "00A", "position" => "대리");
    $member11 = array("name" => "홍세림", "height" => "160cm", "weight" => "40kg", "age" => "044", "nation" => "00A", "position" => "부장");
    $member12 = array("name" => "한승철", "height" => "161cm", "weight" => "52kg", "age" => "032", "nation" => "00B", "position" => "대리"); 
    
    $member21 = array("name" => "김세창", "height" => "180cm", "weight" => "75kg", "age" => "048", "nation" => "00K", "position" => "대표");
    $member22 = array("name" => "남태우", "height" => "182cm", "weight" => "-", "age" => "043", "nation" => "00A", "position" => "이사");
    $member23 = array("name" => "김태균", "height" => "174cm", "weight" => "76kg", "age" => "032", "nation" => "00B", "position" => "과장");
    $member24 = array("name" => "성혜진", "height" => "164cm", "weight" => "46kg", "age" => "028", "nation" => "00B", "position" => "대리");
    $member25 = array("name" => "홍은아", "height" => "160cm", "weight" => "40kg", "age" => "044", "nation" => "00A", "position" => "부장");
    $member26 = array("name" => "김주희", "height" => "161cm", "weight" => "52kg", "age" => "032", "nation" => "00B", "position" => "대리");
    $member27 = array("name" => "김세진", "height" => "180cm", "weight" => "75kg", "age" => "048", "nation" => "00K", "position" => "부장");
    $member28 = array("name" => "김현", "height" => "182cm", "weight" => "-", "age" => "043", "nation" => "00A", "position" => "과장");
    $member29 = array("name" => "이경범", "height" => "174cm", "weight" => "76kg", "age" => "032", "nation" => "00B", "position" => "과장");
    $member30 = array("name" => "이재욱", "height" => "164cm", "weight" => "46kg", "age" => "028", "nation" => "00A", "position" => "대리");
    $member31 = array("name" => "김세창2", "height" => "180cm", "weight" => "75kg", "age" => "048", "nation" => "00K", "position" => "대표");
    $member32 = array("name" => "남태우2", "height" => "182cm", "weight" => "-", "age" => "043", "nation" => "00A", "position" => "이사");
    $member33 = array("name" => "김태균2", "height" => "174cm", "weight" => "76kg", "age" => "032", "nation" => "00B", "position" => "과장");
    $member34 = array("name" => "성혜진2", "height" => "164cm", "weight" => "46kg", "age" => "028", "nation" => "00B", "position" => "대리");
    $member35 = array("name" => "홍은아2", "height" => "160cm", "weight" => "40kg", "age" => "044", "nation" => "00A", "position" => "부장");
    $member36 = array("name" => "김주희2", "height" => "161cm", "weight" => "52kg", "age" => "032", "nation" => "00B", "position" => "대리");
    $member37 = array("name" => "김세진2", "height" => "180cm", "weight" => "75kg", "age" => "048", "nation" => "00K", "position" => "부장");
    $member38 = array("name" => "김현", "height" => "182cm", "weight" => "-", "age" => "043", "nation" => "00A", "position" => "과장");
    $member39 = array("name" => "이경범", "height" => "174cm", "weight" => "76kg", "age" => "032", "nation" => "00B", "position" => "과장");
    $member40 = array("name" => "이재욱", "height" => "164cm", "weight" => "46kg", "age" => "028", "nation" => "00A", "position" => "대리");
    $member41 = array("name" => "홍세림", "height" => "160cm", "weight" => "40kg", "age" => "044", "nation" => "00A", "position" => "부장");
    $member42 = array("name" => "한승철", "height" => "161cm", "weight" => "52kg", "age" => "032", "nation" => "00B", "position" => "대리"); 
    $member43 = array("name" => "김태균", "height" => "174cm", "weight" => "76kg", "age" => "032", "nation" => "00B", "position" => "과장");
    $member44 = array("name" => "성혜진", "height" => "164cm", "weight" => "46kg", "age" => "028", "nation" => "00B", "position" => "대리");
    $member45 = array("name" => "홍은아3", "height" => "160cm", "weight" => "40kg", "age" => "044", "nation" => "00A", "position" => "부장");
    $member46 = array("name" => "김주희3", "height" => "161cm", "weight" => "52kg", "age" => "032", "nation" => "00B", "position" => "대리");
    $member47 = array("name" => "김세진3", "height" => "180cm", "weight" => "75kg", "age" => "048", "nation" => "00K", "position" => "부장");
    $member48 = array("name" => "김현", "height" => "182cm", "weight" => "-", "age" => "043", "nation" => "00A", "position" => "과장");
    $member49 = array("name" => "이경범", "height" => "174cm", "weight" => "76kg", "age" => "032", "nation" => "00B", "position" => "과장");
    $member50 = array("name" => "이재욱4", "height" => "164cm", "weight" => "46kg", "age" => "028", "nation" => "00A", "position" => "대리");
    $member51 = array("name" => "홍세림4", "height" => "160cm", "weight" => "40kg", "age" => "044", "nation" => "00A", "position" => "부장");
    $member52 = array("name" => "한승철4", "height" => "161cm", "weight" => "52kg", "age" => "032", "nation" => "00B", "position" => "대리");   
    
    // 3명의 정보를 memberData변수에 저장
    $memberData = array($member1, $member2, $member3, $member4, $member5, $member6,$member7, $member8, $member9, $member10, $member11, $member12,$member21, $member22, $member23, $member24, $member25, $member26,$member27, $member28, $member29, $member30, $member31, $member32, $member33, $member34, $member35, $member36, $member37, $member38, $member39, $member40, $member41, $member42, $member43, $member44, $member45, $member46, $member47, $member48, $member49, $member50, $member51, $member52);
	$output = $json->encode($memberData);

?>
<?php print $output; ?>
