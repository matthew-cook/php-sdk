<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: text/plain");

require_once '../../lib/D2LAppContextFactory.php';

$scheme = "http";
$host = "localhost";
$port = 44444;

$courseID = "6613"; // change as needed
$folderID = "3"; // change as needed

$appID  = "G9nUpvbZQyiPrk3um2YAkQ";
$appKey = "ybZu7fm_JKJTFwKEHfoZ7Q";

$userID  = "BtWoncIJGJkA8L6Xd7MFsa";
$userKey = "7mWdsjBPYTjICmtOfCuq7W";

$apiRoute = "/d2l/api/le/1.1/".$courseID."/dropbox/folders/".$folderID."/submissions/mysubmissions/";

$id = uniqid();
$data = "--".$id."\n".
"Content-Type: application/json\r\n".
"\r\n".
"{\"HTML\": null, \"Text\": \"Test\"}\r\n".
"--".$id."\r\n".
"Content-Disposition: form-data; name=\"\"; filename=\"file.txt\"\r\n".
"Content-Type: application/octet-stream\r\n".
"\r\n".
"Hello, World! This is an example file.\r\n".
"--".$id."--";

$authContextFactory = new D2LAppContextFactory();
$authContext = $authContextFactory->createSecurityContext($appID, $appKey);
$hostSpec = new D2LHostSpec($host, $port, $scheme);
if($authContext == null) {
  die("auth context is null");
}

$opContext = $authContext->createUserContextFromHostSpec($hostSpec, $userID, $userKey);
if($opContext == null) {
  die("opContext is null");
}

$ch = curl_init();
$options = array(
              //   CURLOPT_PROXY => 'HOST_RUNNING_FIDDLER:8888',
                 CURLOPT_RETURNTRANSFER => true,
                 CURLOPT_CAINFO => getcwd().'/cacert.pem'
);
curl_setopt_array($ch, $options);

$uri = $opContext->createAuthenticatedUri($apiRoute, "POST");
curl_setopt($ch, CURLOPT_URL, $uri);
curl_setopt($ch, CURLOPT_HEADER, 1);

curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
  "Content-Type: multipart/mixed;boundary=".$id,
  "Content-Length: " . strlen($data))
);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

$response = curl_exec($ch);
$httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
$responseCode = $opContext->handleResult($response, $httpCode, $contentType);
$headers = substr($response, 0, curl_getinfo($ch, CURLINFO_HEADER_SIZE));
$body = substr($response, strlen($headers), strlen($response));

echo "\n";
echo "Authenticated URL created by user context: ".$uri."\n";
echo "\n";

echo "Response status: ".$httpCode."\n";
echo "Response headers: ".$headers."\n";
echo "Response body: ".$body."\n";
echo "\n";
