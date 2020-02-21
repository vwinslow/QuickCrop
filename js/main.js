/**
  const foo = async () => {
    const MODEL_URL = '/models'
 	console.log("here")
    var result = faceapi.loadFaceLandmarkTinyModel(MODEL_URL)
    await faceapi.loadTinyFaceDetectorModel('/models')
    await faceapi.loadFaceLandmarkTinyModel('/models')
    await result
    console.log(result)
    console.log("i loaded it?")
    const input = document.getElementById('image')
    detections2 = await faceapi.detectAllFaces(input, new faceapi.TinyFaceDetectorOptions())
    console.log(detections2[0])
    return detections2[0]
  }
  foo()
**/
const FILE_NAME_QUERY_PARAMETER = "fileName";
const IMAGE_URL_QUERY_PARAMETER = "imageUrl";
var filename;
$(function () {
  'use strict';

// 	 $image.cropper('destroy').attr('src', queryString).cropper(options);
  /**
  foo().then(
    res => $image.cropper('move', res._box.x, res._box.y) && console.log(res._box.x + " " + res._box.y)
  )
  **/
  var queryParams = getQueryParams();
  var console = window.console || { log: function () {} };
  var URL = window.URL || window.webkitURL;
  var $image = $('#image');
  var $download = $('#download');
  var $dataX = $('#dataX');
  var $dataY = $('#dataY');
  var $dataHeight = $('#dataHeight');
  var $dataWidth = $('#dataWidth');
  var $dataRotate = $('#dataRotate');
  var $dataScaleX = $('#dataScaleX');
  var $dataScaleY = $('#dataScaleY');
  var options = {
    aspectRatio: 3/4 ,
    preview: '.img-preview',
    crop: function (e) {
      $dataX.val(Math.round(e.detail.x));
      $dataY.val(Math.round(e.detail.y));
      $dataHeight.val(Math.round(e.detail.height));
      $dataWidth.val(Math.round(e.detail.width));
      $dataRotate.val(e.detail.rotate);
      $dataScaleX.val(e.detail.scaleX);
      $dataScaleY.val(e.detail.scaleY);
    }
  };
  var originalImageURL = $image.attr('src');
  var uploadedImageName = queryParams[0];
  var uploadedImageType = uploadedImageName.endsWith("jpg") || uploadedImageName.endsWith("jpeg") ?  'image/jpeg' : 'image/png';
  var uploadedImageURL;

  // Tooltip
  $('[data-toggle="tooltip"]').tooltip();

  // Cropper
  $image.on({
    ready: function (e) {
      console.log(e.type);
    },
    cropstart: function (e) {
      console.log(e.type, e.detail.action);
    },
    cropmove: function (e) {
      console.log(e.type, e.detail.action);
    },
    cropend: function (e) {
      console.log(e.type, e.detail.action);
    },
    crop: function (e) {
      console.log(e.type);
    },
    zoom: function (e) {
      console.log(e.type, e.detail.ratio);
    }
  }).cropper(options);

  // Buttons
  if (!$.isFunction(document.createElement('canvas').getContext)) {
    $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
  }

  if (typeof document.createElement('cropper').style.transition === 'undefined') {
    $('button[data-method="rotate"]').prop('disabled', true);
    $('button[data-method="scale"]').prop('disabled', true);
  }

  // Download
  if (typeof $download[0].download === 'undefined') {
    $download.addClass('disabled');
  }

  // Options
  $('.docs-toggles').on('change', 'input', function () {
    var $this = $(this);
    var name = $this.attr('name');
    var type = $this.prop('type');
    var cropBoxData;
    var canvasData;

    if (!$image.data('cropper')) {
      return;
    }

    if (type === 'checkbox') {
      options[name] = $this.prop('checked');
      cropBoxData = $image.cropper('getCropBoxData');
      canvasData = $image.cropper('getCanvasData');

      options.ready = function () {
        $image.cropper('setCropBoxData', cropBoxData);
        $image.cropper('setCanvasData', canvasData);
      };
    } else if (type === 'radio') {
      options[name] = $this.val();
    }

    $image.cropper('destroy').cropper(options);
  });

  // Methods
  $('.docs-buttons').on('click', '[data-method]', function () {
    var $this = $(this);
    var data = $this.data();
    var cropper = $image.data('cropper');
    var cropped;
    var $target;
    var result;

    if ($this.prop('disabled') || $this.hasClass('disabled')) {
      return;
    }

    if (cropper && data.method) {
      data = $.extend({}, data); // Clone a new one

      if (typeof data.target !== 'undefined') {
        $target = $(data.target);

        if (typeof data.option === 'undefined') {
          try {
            data.option = JSON.parse($target.val());
          } catch (e) {
            console.log(e.message);
          }
        }
      }

      cropped = cropper.cropped;

      switch (data.method) {
        case 'rotate':
          if (cropped && options.viewMode > 0) {
            $image.cropper('clear');
          }

          break;

        case 'getCroppedCanvas':
          if (uploadedImageType === 'image/jpeg') {
            if (!data.option) {
              data.option = {};
            }

            data.option.fillColor = '#fff';
          }

          break;
      }

      result = $image.cropper(data.method, data.option, data.secondOption);

      switch (data.method) {
        case 'rotate':
          if (cropped && options.viewMode > 0) {
            $image.cropper('crop');
          }

          break;

        case 'scaleX':
        case 'scaleY':
          $(this).data('option', -data.option);
          break;

        case 'getCroppedCanvas':
          if (result) {
            // Bootstrap's Modal
            $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);

            if (!$download.hasClass('disabled')) {
              download.download = uploadedImageName;
              var dataUrl = result.toDataURL(uploadedImageType);
              // $download.attr('href', dataUrl);
              $download.click(function() {
                $.ajax({
                  type: "POST",
                  url: "saveImage.php",
                  data: {
                    imgBase64: dataUrl,
                    name: "cropped_" + queryParams[0]
                  }
                }).done(function(o) {
                  console.log('saved');
                  // If you want the file to be visible in the browser
                  // - please modify the callback in javascript. All you
                  // need is to return the url to the file, you just saved
                  // and than put the image in your browser.
                });
              });
            }
          }

          break;

        case 'destroy':
          if (uploadedImageURL) {
            URL.revokeObjectURL(uploadedImageURL);
            uploadedImageURL = '';
            $image.attr('src', originalImageURL);
          }

          break;
      }

      if ($.isPlainObject(result) && $target) {
        try {
          $target.val(JSON.stringify(result));
        } catch (e) {
          console.log(e.message);
        }
      }
    }
  });

  // Keyboard
  $(document.body).on('keydown', function (e) {
    if (e.target !== this || !$image.data('cropper') || this.scrollTop > 300) {
      return;
    }

    switch (e.which) {
      case 37:
        e.preventDefault();
        $image.cropper('move', -1, 0);
        break;

      case 38:
        e.preventDefault();
        $image.cropper('move', 0, -1);
        break;

      case 39:
        e.preventDefault();
        $image.cropper('move', 1, 0);
        break;

      case 40:
        e.preventDefault();
        $image.cropper('move', 0, 1);
        break;
    }
  });

  // Import image
  var $inputImage = $('#inputImage');

  var xhr = new XMLHttpRequest();
  xhr.open("GET", queryParams[1]);
  xhr.responseType = "blob";
  xhr.onload = function(e) { 
      console.log(e)
      var urlCreator = window.URL || window.webkitURL;
      uploadedImageURL = URL.createObjectURL(this.response);
      $image.cropper('destroy').attr('src', uploadedImageURL).cropper(options);
      $inputImage.val('');
  }
  xhr.send();
});

/**
 * Looks for queryParams filename and image and returns them in that order.
 * @return array[filename, image], both strings.
 */
function getQueryParams() {
  var queryStringsString = self.location.search;
  var queryStrings = queryStringsString.split("?");
  if (queryStrings.length < 3 || !queryStringsString.includes("=")) {
    invalidArgs()
    throw "Invalid args"
  }
  var imageUrl;
  if (queryStrings[1].startsWith(FILE_NAME_QUERY_PARAMETER)) {
    filename = queryStrings[1].replace(FILE_NAME_QUERY_PARAMETER + "=", "");
    imageUrl = queryStrings[2].replace(IMAGE_URL_QUERY_PARAMETER + "=", "");
  } else {
    filename = queryStrings[2].replace(FILE_NAME_QUERY_PARAMETER + "=", "");
    imageUrl = queryStrings[1].replace(IMAGE_URL_QUERY_PARAMETER + "=", "");
  }
  console.log(filename)
  console.log(imageUrl)

  return [filename, imageUrl]
}

function invalidArgs() {
  alert("Warning: Query parameters filename and image need to be provided.");
}