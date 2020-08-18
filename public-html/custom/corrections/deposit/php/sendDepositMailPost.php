<?php
// Be carefull this script uses the pear Mail, Mail_mime and net_smtp packages
//mail = new PHPMailer;
include('Mail.php');
include('Mail/mime.php');
// error
// -1: default error code
//  0: success
//  1: json file not created
//  2: json mail not sent
//  3: thank you mail not sent
//
$err=-1;
//define time zone
date_default_timezone_set('America/Vancouver');
$headers = getallheaders();
if ($headers["Content-Type"] == "application/json;charset=UTF-8")
    $_POST = json_decode(file_get_contents("php://input"), true) ?: [];
// get the post Parameters
$userName=$_POST['userName'];
$userEmail=$_POST['userEmail'];
$doi=$_POST["DOI"];
$orgArray=$_POST["orgArray"];
$compArray=$_POST["compArray"];


// create the json file and write in the correct directory
$file='../json/'.date('YmdHis', time()).'_deposit_'.$userName.'.json';
$fp = fopen($file, 'w');
if(!$fp)
{
  $err=1;
}
else{
  fwrite($fp, json_encode($_POST));
//	  fwrite($fp, 'abcererw');
  fclose($fp);
}

// build mail content generic fields
$c_dt='Submission date/time: '.date('m/d/Y h:i:s A', time());
$c_aut='Submitted by: '.$userName;
$c_end="This an automated email sent from npatlas.org";
$h='<head><style> table,th,td,tr {border: 1px solid black; border-collapse: collapse; text-align: justify;}</style></head>';

//  content

$h_sb= 'New article submited by '.$userName.' the '.date('m/d/Y ', time()).' at '.date('h:i:s A', time());

$c_doi=
  "<tr>".
    "<th colspan=2>Reference DOI</th>".
    "<td colspan=2>".$doi."</td>".
  "</tr>";

$c_comp_cont="";
for($i=0;$i<sizeof($compArray);$i++)
{
  $c_comp_cont.="<tr>".
  "<th>".strval($i+1)."</th>".
  "<td>".$compArray[$i]["name"]."</td>".
  "<td colspan=2>".$compArray[$i]["smiles"]."</td>".
  "</tr>";
}
$c_comp=
  "<tr>".
    '<th colspan=4 >Compound(s)</th>'.
  "</tr>".
  "<tr>".
    "<th>#</th>".
    "<th>Name</th>".
    "<th colspan=2>SMILES</th>".
  "</tr>".
  $c_comp_cont;


$c_org_cont="";
for($i=0;$i<sizeof($orgArray);$i++)
{
  $c_org_cont.="<tr>".
  "<th>".strval($i+1)."</th>".
  "<td>".$orgArray[$i]["type"]."</td>".
  "<td>".$orgArray[$i]["genus"]."</td>".
  "<td >".$orgArray[$i]["species"]."</td>".
  "</tr>";
}
$c_org=
  "<tr>".
    '<th colspan=4>Producing Organism(s)</th>'.
  "</tr>".
  "<tr>".
    "<th>#</th>".
    "<th>Type</th>".
    "<th>Name</th>".
    "<th colspan=2>SMILES</th>".
  "</tr>".
  $c_org_cont;


$c_dta="<table >".$c_doi.$c_comp.$c_org."</table>";


// assemble the mail sent to us
$crlf = "\n";

$text = $c_dt.$crlf.$c_aut.$crlf.$c_end;
$html = '<html>'.$h.'<body>'.$c_dt.'<br>'.$c_aut.'<br>'.'Deposit submitted : <br>'.$c_dta.'<br>'.$c_end.'</body></html>';

$headers['From']    = 'deposits@npatlas.org';
$headers['Subject']= $h_sb;

//assemble the mail for us
$mime = new Mail_mime(array('eol' => $crlf));

$mime->setTXTBody($text);
$mime->setHTMLBody($html);
$mime->addAttachment($file, 'text/plain');

$body = $mime->get();
$headers = $mime->headers($headers);

// define the params for the smtp server
$recipients = 'submitted_deposits@npatlas.org';
$smtp_params = array ('host' => 'mailgate.sfu.ca','auth' => false);


// Create the mail object using the Mail::factory method
$mail_object = Mail::factory('smtp', $smtp_params);

// send the mail
$mail=$mail_object->send($recipients, $headers, $body);

//check if the mail has been sent or not
if (PEAR::isError($mail)) {
  $err=2;
 } else {
   $err=0;
 }

 // //assemble the mail for the user

 $text="Hi, \n \n Thank you for your input. We are working hard on improving the quality and the accuracy of the Natural Products Atlas and community feedback is very important for us.\n\nThe NP Atlas team \n".$c_end;
 $html='<html>'.$h.'<body>'."Hi, <br> <br> Thank you for your input. We are working hard on improving the quality and the accuracy of the Natural Products Atlas and community feedback is very important for us.".
 "<br><br>For you information, you submitted the following article: <br><br>".
 $c_dta. "<br><br> The NP Atlas team <br> <br>".$c_end.'</body></html>';

 $headers['From']    = 'deposits@npatlas.org';
 $headers['Subject']= 'Thank you for your feedback';

 $mime = new Mail_mime(array('eol' => $crlf));

 $mime->setTXTBody($text);
 $mime->setHTMLBody($html);

 $body = $mime->get();
 $headers = $mime->headers($headers);

 // define the params for the smtp server
 $recipients = $userEmail;
 $smtp_params = array ('host' => 'mailgate.sfu.ca', 'auth' => false);

 // Create the mail object using the Mail::factory method
 $mail_object = Mail::factory('smtp', $smtp_params);

 // send the mail
 $mail=$mail_object->send($recipients, $headers, $body);

 //check if the mail has been sent or not
 if (PEAR::isError($mail)) {
   $err=3;
  } else {
    $err=0;
  }
echo json_encode($err);

 ?>
