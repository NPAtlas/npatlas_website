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
$json=json_decode($_POST['correctionsJSON']);// json string containing the
$username=$_POST['userName'];
$useremail=$_POST['userEmail'];
$structurePicture=$_POST['structurePicture'];
// create the json file and write in the correct directory
$file='../json/'.date('YmdHis', time()).'_'.$json->correctionTypeRadio.'_'.$username.'.json';
$fp = fopen($file, 'w');
if(!$fp)
{
  $err=1;
}
else{
  fwrite($fp, json_encode($json));
  fclose($fp);
}

// build mail content generic fields
$c_dt='Submission date/time: '.date('m/d/Y h:i:s A', time());
$c_aut='Submitted by: '.$username;
$c_end="This an automated email sent from npatlas.org";
$h='<head><style> table,th,td,tr {border: 1px solid black; border-collapse: collapse; text-align: justify;}</style></head>';

// conditionnal content
if($json->correctionTypeRadio == 'missingCompound' ) // missingCompound
{
  $h_sb= 'Missing compound correction submited by '.$username.' the '.date('m/d/Y ', time()).' at '.date('h:i:s A', time());

  $c_dta=
  "<table>".
  "  <tr>".
  "    <th>Correction type</th>".
  "    <td>Missing compound</td>".
  "  </tr>".
  "  <tr>".
  "    <th>Compound name</th>".
  "    <td>".$json->compoundName."</td>".
  "    </tr>".
  "  <tr>".
  "    <th>Compound formula</th>".
  "    <td>".$json->compoundFormula."</td>".
  "  </tr>".
  "  <tr>".
  "    <th>Compound SMILES/Inchi</th>".
  "    <td>".$json->compoundStructure."</td>".
  "  </tr>".
  "  <tr>".
  "    <th>Proposed compound structure</th>".
  "    <td>"."<img alt='No structure'  src='data:image/png;base64,".$structurePicture."'></td>".
  "  </tr>".
  "  <tr>".
  "    <th>Reference DOI or citation</th>".
  "    <td>".$json->correctCitation."</td>".
  "  </tr>".
  "    <th>Other information</th>".
  "    <td>".$json->otherInfo."</td>".
  "  </tr>".
  "</table>";
}
elseif ($json->correctionTypeRadio == 'incorrectStructure') {
  $h_sb= 'Incorrect structure correction submited by '.$username.' the '.date('m/d/Y ', time()).' at '.date('h:i:s A', time());
  $c_dta=
  "<table>".
    "<tr>".
      "<th>Correction type</th>".
      "<td>Incorrect structure</td>".
    "</tr>".
    "<tr>".
      "<th>Our mistake</th>".
      "<td>".$json->correctCompNameRadio."</td>".
    "</tr>".
    "<tr>".
      "<th>NPA ID</th>".
      "<td>".$json->npaid."</td>".
    "</tr>".
    "<tr>".
      "<th>Compound SMILES/Inchi</th>".
      "<td>".$json->compoundStructure."</td>".
    "</tr>".
    "<tr>".
      "<th>Proposed compound structure</th>".
      "<td>"."<img alt='No structure'  src='data:image/png;base64,".$structurePicture."'></td>".
    "</tr>".
    "<tr>".
      "<th>Reference DOI or citation</th>".
      "<td>".$json->correctCitation."</td>".
    "</tr>".
    "<tr>".
      "<th>Other information</th>".
      "<td>".$json->otherInfo."</td>".
    "</tr>".
  "</table>";

}
elseif ($json->correctionTypeRadio == 'incorrectCompName') {

  $h_sb= 'Incorrect compound name correction submited by '.$username.' the '.date('m/d/Y ', time()).' at '.date('h:i:s A', time());
  $c_dta=
  "<table>".
    "<tr>".
      "<th>orrection type</th>".
      "<td>Incorrect compound name</td>".
    "</tr>".
    "<tr>".
      "<th>Our mistake</th>".
      "<td>".$json->correctCompNameRadio."</td>".
    "</tr>".
    "<tr>".
      "<th>NPA ID</th>".
      "<td>".$json->npaid."</td>".
    "</tr>".
    "<tr>".
      "<th>Incorrect compound name</th>".
      "<td>".$json->inCorrectCompoundName."</td>".
    "</tr>".
    "<tr>".
      "<th>Correct compound name</th>".
      "<td>".$json->correctCompName."</td>".
    "</tr>".
    "<tr>".
      "<th>Reference DOI or citation</th>".
      "<td>".$json->correctCitation."</td>".
    "</tr>".
  "</table>";

}
elseif ($json->correctionTypeRadio == 'incorrectRefer') {
  $h_sb= 'Incorrect reference correction submited by '.$username.' the '.date('m/d/Y ', time()).' at '.date('h:i:s A', time());
  $c_dta=
  "<table'>".
    "<tr>".
      "<th>Correction type</th>".
      "<td>Incorrect reference</td>".
    "</tr>".
    "<tr>".
      "<th>Our mistake</th>".
      "<td>".$json->correctReferRadio."</td>".
    "</tr>".
    "<tr>".
      "<th>NPA ID</th>".
      "<td>".$json->npaid."</td>".
    "</tr>".
    "<tr>".
      "<th>Correct reference DOI or citation</th>".
      "<td>".$json->correctCitation."</td>".
    "</tr>".
  "</table>" ;
}
elseif ($json->correctionTypeRadio == 'incorrectTax') {
  $h_sb= 'Incorrect taxonomy correction submited by '.$username.' the '.date('m/d/Y ', time()).' at '.date('h:i:s A', time());
  $c_dta=
  "<table >".
    "<tr>".
      "<th>Correction type</th>".
      "<td>Incorrect taxonomy</td>".
    "</tr>".
    "<tr>".
      "<th>Our mistake</th>".
      "<td>".$json->correctTaxRadio."</td>".
    "</tr>".
    "<tr>".
      "<th>NPA ID</th>".
      "<td>".$json->npaid."</td>".
    "</tr>".
    "<tr>".
      "<th>Correct reference DOI or citation</th>".
      "<td>".$json->correctCitation."</td>".
    "</tr>".
  "</table>";
}

// assemble the mail sent to us
$crlf = "\n";

$text = $c_dt.$crlf.$c_aut.$crlf.$c_end;
$html = '<html>'.$h.'<body>'.$c_dt.'<br>'.$c_aut.'<br>'.' Correction submitted : <br>'.$c_dta.'<br>'.$c_end.'</body></html>';

$headers['From']    = 'corrections@npatlas.org';
$headers['Subject']= $h_sb;

//assemble the mail for us
$mime = new Mail_mime(array('eol' => $crlf));

$mime->setTXTBody($text);
$mime->setHTMLBody($html);
$mime->addAttachment($file, 'text/plain');

$body = $mime->get();
$headers = $mime->headers($headers);

// define the params for the smtp server
$recipients = 'submitted_corrections@npatlas.org';
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
 "<br><br>For you information, you submitted the following corrections: <br><br>".
 $c_dta. "<br><br> The NP Atlas team <br> <br>".$c_end.'</body></html>';

 $headers['From']    = 'corrections@npatlas.org';
 $headers['Subject']= 'Thank you for your feedback';

 $mime = new Mail_mime(array('eol' => $crlf));

 $mime->setTXTBody($text);
 $mime->setHTMLBody($html);

 $body = $mime->get();
 $headers = $mime->headers($headers);

 // define the params for the smtp server
 $recipients = $useremail;
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
