<?php
define("SAVE_DIRECTORY", "supp/");

if (!empty($_POST['imgBase64']) and !empty($_POST['name'])) {
    $data = $_POST['imgBase64'];
    $name = $_POST['name'];

    // Validation, to prevent directory traversal we should not allow ../
    if (strpos($name, '../') !== false) {
        http_response_code(400);
        echo "There was an issue.";
        return;
    }

    save_base64($data, $name);
} else {
    http_response_code(400);
}

function save_base64($base64_string, $output_file)
{
    // open the output file for writing
    $ifp = fopen(SAVE_DIRECTORY . $output_file, 'wb');

    // split the string on commas
    // $data[ 0 ] == "data:image/png;base64"
    // $data[ 1 ] == <actual base64 string>
    $data = explode(',', $base64_string);

    // we could add validation here with ensuring count( $data ) > 1
    fwrite($ifp, base64_decode($data[1]));

    // clean up the file resource
    fclose($ifp);

    return $output_file;
}