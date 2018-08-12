'use strict';

/* String */
String.prototype.contains = function (str, exactMatch) {
    exactMatch = exactMatch || false;
    return (!exactMatch) ? (this.indexOf(str) != -1) : (this.toLowerCase().indexOf(str.toLowerCase()) != -1);
};
String.prototype.startsWith = function (str) {
    return this.slice(0, str.length) == str;
};
String.prototype.endsWith = function (str) {
    return this.slice(-str.length) == str;
};
/* Array */
Array.prototype.ExactMatchExists = function (str) {
    for (var i = 0; i < this.length; i++) {
        if (str == this[i]) {
            return true;
        }
    }
    return false;
};
Array.prototype.MatchExists = function (str) {
    for (var i = 0; i < this.length; i++) {
        if (str == this[i]) {
            return i;
        }
    }
    return -1;
};
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};
Array.prototype.DeleteItem = function (index) {
    this.splice(index, 1);
};

var axis = (function (axis) {
    axis.isArray = function (value) {
        return value && typeof value === 'object' && value.constructor === Array;
    }
    axis.isString = function (value) {
        return typeof value === 'string' || value instanceof String;
    }
    axis.isDate = function (value) {
        return value instanceof Date;
    }
    axis.isObject = function (value) {
        return value && typeof value === 'object' && value.constructor === Object;
    }
    axis.isRegExp = function (value) {
        return value && typeof value === 'object' && value.constructor === RegExp;
    }
    axis.isFunction = function (value) {
        return typeof value === 'function';
    }
    axis.isBoolean = function (value) {
        return typeof value === 'boolean';
    }
    axis.isNumber = function (value) {
        // with Number.isFinite() you don't need any more logic. It's an es6 feature though so doesn't work in all browsers just yet.
        return typeof value === 'number' && isFinite(value);
    }
    axis.isNull = function (value) {
        return value === null;
    }
    axis.isUndefined = function (value) {
        return typeof value === 'undefined';
    }

    axis.isSymbol = function (value) {
        return typeof value === 'symbol';
    }

    return axis;
}(axis || {}));

var Utilities = (function (Utilities) {
    Utilities.Wait = function (show) {
        if (show) {
            $('#dcrmegProcessingDialog').show();
        } else {
            $('#dcrmegProcessingDialog').hide();
        }
    }
    Utilities.DisplayCrmAlertDialog = function (msg) {
        var alertOptions = { height: 190, width: 450 };
        window.parent.Xrm.Navigation.openAlertDialog({ text: msg }, alertOptions);
    }
    Utilities.GenerateUUID = function () {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
        return uuid;
    }
    Utilities.GenerateRandomLetters = function () {
        var text = '';
        var thislen = len || 10;
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        for (var i = 0; i < thislen; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    Utilities.AddCurlyBrace = function (str) {
        if (str.startsWith('{')) {
            return str;
        }
        return '{' + str + '}';
    }
    Utilities.LoadCSS = function (cssfile, appendtoparent) {
        var newScript = window.parent.document.createElement('link');
        newScript.type = 'text/css';
        newScript.rel = "stylesheet";
        newScript.href = (appendtoparent) ? '/WebResources/' + cssfile : cssfile;
        if (appendtoparent) {
            window.parent.document.head.appendChild(newScript);
        } else {
            document.head.appendChild(newScript);
        }
    }
    Utilities.LoadScript = function (jsfile, appendtoparent) {
        var newScript = window.parent.document.createElement('script');
        newScript.type = 'text/javascript';
        newScript.src = (appendtoparent) ? '/WebResources/' + jsfile: jsfile;
        if (appendtoparent) {
            window.parent.document.head.appendChild(newScript);
        } else {
            document.head.appendChild(newScript);
        }
    }
    Utilities.GetWebresourceParameters = function () {
        var passedParameters = null;

        try {
            var vals = null;
            if ((location) && (location.search) && (location.search.length > 0)) {
                vals = location.search.substr(1).split("&");
            } else if ((location) && (location.href)) {
                // fallback. Not all browsers are compliant
                var href = decodeURIComponent(location.href);
                if (href.contains('?')) {
                    var tmp = href.split('?');
                    vals = tmp[1].split('&');
                }
            }

            if (vals) {
                //var vals = location.search.substr(1).split("&");
                for (var i = 0; i < vals.length; i++) {
                    vals[i] = vals[i].split("=");
                    if (vals[i][0].toLowerCase() == "data" && vals[i][1] != "") {
                        passedParameters = decodeURIComponent(vals[i][1]);
                        //var userVals = decodeURIComponent(vals[i][1]).split(",");
                        //for (var j = 0; j < userVals.length; j++) {
                        //    passedParameters.push(userVals[j].split("=")[1].trim());
                        //}
                        break;
                    }
                    //else {
                    //    passedParameters[vals[i][0]] = vals[i][1];
                    //}
                }
            } else {
                console.log("No window parameters was passed.");
            }
        } catch (e) {
            console.log("Unable to retrieve Guid of the configuration from data parameter.\r\n" + e.message);
        }
        return passedParameters;
    }

    var _CurImageIndex = -1;
    Utilities.ImageIndex = function (index) {
        if (index != undefined) {
            _CurImageIndex = index;
        }
        return _CurImageIndex;
    }

    Utilities.SetEntityImageSuccess = function (result) {
        // Reload the page so the image is shown
        window.parent.location.reload(false);
    }
    Utilities.SetEntityImageFail = function (err) {
        Utilities.Wait();
        Utilities.DisplayCrmAlertDialog('Error. Unable to set entity image. [' + er.message + ']');
    }

    return Utilities;
})(Utilities || {});

var OptionsHelper = (function (OptionsHelper) {

    var _InternalOptions = {
        Images: [],
        Descriptions: [],
        Position: 0,
        FlyoutOverlay: null,
        FlyoutImageContainer: null,
        FlyoutImage: null,
        theme: 'pp_default',
        show_descriptions: true,
        overlay_gallery: true,
        //default_width: 500,
        //default_height: 470,
        //default_content_heigth: 430,
        counter_separator_label: '/',
        ChangePictureCallback: Utilities.ImageIndex
    };

    OptionsHelper.Options = function (op) {
        if (op) {
            if (op.Images) { _InternalOptions.Images = op.Images; }
            if (op.Descriptions) { _InternalOptions.Descriptions = op.Descriptions; }

            if (op.Position != undefined) { _InternalOptions.Position = op.Position; }
            if (op.FlyoutOverlay) { _InternalOptions.FlyoutOverlay = op.FlyoutOverlay; }
            if (op.FlyoutImageContainer) { _InternalOptions.FlyoutImageContainer = op.FlyoutImageContainer; }
            if (op.FlyoutImage) { _InternalOptions.FlyoutImage = op.FlyoutImage; }
            if (op.theme) { _InternalOptions.theme = op.theme; }

            if (op.show_descriptions != undefined) { _InternalOptions.show_descriptions = op.show_descriptions; }
            if (op.overlay_gallery != undefined) { _InternalOptions.overlay_gallery = op.overlay_gallery; }
            if (op.counter_separator_label) { _InternalOptions.counter_separator_label = op.counter_separator_label; }

            if (op.default_width) { _InternalOptions.default_width = op.default_width; }
            if (op.default_height) { _InternalOptions.default_height = op.default_height; }
        }
        return _InternalOptions;
    }

    OptionsHelper.UpdateFromConfigSucess = function (result) {
        if (result && result.length > 0) {
            var item = result[0];
            
            if (item.new_theme) {
                switch (item.new_theme) {
                    case 985960001:
                        _InternalOptions.theme = 'light_rounded';
                        break;
                    case 985960002:
                        _InternalOptions.theme = 'dark_rounded';
                        break;
                    case 985960003:
                        _InternalOptions.theme = 'light_square';
                        break;
                    case 985960004:
                        _InternalOptions.theme = 'dark_square';
                        break;
                    case 985960005:
                        _InternalOptions.theme = 'facebook';
                        break;
                }
            }
            if (item.mtools_showthumbnails != undefined) {
                _InternalOptions.overlay_gallery = item.mtools_showthumbnails;
            }
            if (item.mtools_showdescriptions != undefined) {
                _InternalOptions.show_descriptions = item.mtools_showdescriptions;
            }
            if (item.mtools_counterseperator != undefined) {
                _InternalOptions.counter_separator_label = item.mtools_counterseperator;
            }

            ImageLoaderHelper.GetImages({
                Guid: window.parent.Xrm.Page.data.entity.getId(),
                SuccessCallback: InitializeView
            });
        }
    }

    OptionsHelper.UpdateFromConfigFail = function (err) {
        console.log('Unable to retrieve configuration.' + err.message);
        Utilities.Wait();
        $('#maincontainer').hide();
        Utilities.DisplayCrmAlertDialog('Error. Unable to retreive image view configuration. [' + err.message + ']');
    }

    OptionsHelper.ResetImages = function () {
        _InternalOptions.Images = [];
        _InternalOptions.Descriptions = [];
    }

    return OptionsHelper;

})(OptionsHelper || {});

var ImageLoaderHelper = (function (ImageLoaderHelper) {

    ImageLoaderHelper.Fail = function (err) {
        console.log('No images are available for this record.\r\n' + err.message);
        Utilities.Wait();
    }

    ImageLoaderHelper.Success = function (result, hasMoreRecords, pagingCookie, passthroughObj) {
        if (result && result.length > 0) {
            var op = OptionsHelper.Options();

            for (var i = 0; i < result.length; i++) {
                var img = result[i];
                op.Descriptions.push((img.filename) ? img.filename : '');

                op.Images.push({
                    FileName: (img.filename) ? img.filename : null,
                    MimeType: (img.mimetype) ? img.mimetype : null,
                    Subject: (img.subject) ? img.subject : null,
                    DocumentBody: (img.documentbody) ? img.documentbody : null,
                    NoteText: (img.notetext) ? img.notetext : null
                });
            }
        }
        if (passthroughObj) {
            passthroughObj();
        }
    }

    ImageLoaderHelper.GetImages = function (op) {
        Utilities.Wait(true);
        Utilities.ImageIndex(-1);
        OptionsHelper.ResetImages();
        $('.noimagesfoundinner').hide();

        var searchfor = null;
        // op = {Guid: 'xxxx-xxxx', NoteText: 'some text', ImageType: 'jpeg', SuccessCallback}
        var fetch = '<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">' +
          '<entity name="annotation" >' +
            '<attribute name="annotationid" />' +
            '<attribute name="filename" />' +
            '<attribute name="subject" />' +
            '<attribute name="mimetype" />' +
            '<attribute name="documentbody" />' +
            '<attribute name="notetext" />' +
            '<attribute name="annotationid" />' +
            '<filter type="and" >' +
              '<condition attribute="objectid" operator="eq" value="' + Utilities.AddCurlyBrace(op.Guid) + '" />' +
              '<condition attribute="isdocument" operator="eq" value="1" />';

        if(op.NoteText) {
            searchfor = op.NoteText.replace('&', '&amp;').replace('<', "&lt;").replace('>', "&gt;");
            fetch += '<condition attribute="notetext" operator="like" value="%%' + searchfor + '%" />';
        }
        if (op.ImageType) {
            var tmp = op.ImageType.toLowerCase();
            if (tmp.match(/\b(jpg|jpeg|png|gif|svn|bmp)\b/gi)) {
                if (tmp.contains(',')) {
                    fetch += '<condition attribute="mimetype" operator="in">';
                    var arr = tmp.split(',');
                    for (var i = 0; i < arr.length; i++) {
                        fetch += '<value>image/' + arr[i] + '</value>';
                    }
                    fetch += '</condition>';
                } else {
                    fetch += '<condition attribute="mimetype" operator="eq" value="image/' + tmp + '" />';
                }
            }
        } else {
            fetch += '<condition attribute="mimetype" operator="begins-with" value="image/" />';
        }
        if (op.Filename) {
            searchfor = op.Filename.replace('&', '&amp;').replace('<', "&lt;").replace('>', "&gt;");
            fetch += '<condition attribute="filename" operator="like" value="%%' + searchfor + '%" />';
        }

        fetch += '</filter>' +
            '<order attribute="createdon" />' +
          '</entity>' +
        '</fetch>';
        SdkWebAPI.getFetchXml('annotations', fetch, ImageLoaderHelper.Success, ImageLoaderHelper.Fail, op.SuccessCallback);
    }

    return ImageLoaderHelper;
})(ImageLoaderHelper || {});

(function ($) {
    $.dynamicsImageViewer = { version: '1.1.0.2' };

    $.fn.dynamicsImageViewer = function (options) {
        // Window size
        var pp_windowHeight = $(window).height(),
            pp_windowWidth = $(window).width();
        $('.ctrlcontainer').width(pp_windowWidth - 15).height($(window).height() - 10);
        $('.ctrlfilter').width(pp_windowWidth - 15);

        var pp_default_setings = {
            animation_speed: 'fast', /* fast/slow/normal */
            opacity: 0.80, /* Value between 0 and 1 */
            show_descriptions: true, /* true/false */
            allow_resize: true, /* Resize the photos bigger than viewport. true/false */
            allow_expand: true, /* Allow the user to expand a resized image. true/false */
            default_width: $('.ctrlcontainer').width(),
            default_height: $('.ctrlcontainer').height() - 40,
            default_content_heigth: ($('.ctrlcontainer').height() - 80),
            counter_separator_label: '/', /* The separator for the gallery counter 1 "of" 2 */
            theme: 'pp_default', /*pp_default light_rounded dark_rounded light_square dark_square facebook */
            horizontal_padding: 20,
            overlay_gallery: true, /* If set to true, a gallery will overlay the fullscreen image on mouse over */
            overlay_gallery_max: 50, /* Maximum number of pictures in the overlay gallery */
            markup: '<div class="pp_pic_holder"> \
						<div class="pp_content_container"> \
							<div class="pp_left"> \
							<div class="pp_right"> \
								<div class="pp_content"> \
									<div class="pp_loaderIcon"></div> \
									<div class="pp_fade"> \
										<a href="#" class="pp_expand" title="Expand the image">Expand</a> \
										<div class="pp_hoverContainer"> \
											<a class="pp_next" href="#">next</a> \
											<a class="pp_previous" href="#">previous</a> \
										</div> \
										<div id="pp_full_res"></div> \
										<div class="pp_details"> \
											<div class="pp_nav"> \
												<a href="#" class="pp_arrow_previous">Previous</a> \
												<p class="currentTextHolder">0/0</p> \
												<a href="#" class="pp_arrow_next">Next</a> \
											</div> \
											<div class="pp_description"></div> \
										</div> \
									</div> \
								</div> \
							</div> \
							</div> \
						</div> \
					</div>',
            gallery_markup: '<div class="pp_gallery"> \
								<a href="#" class="pp_arrow_previous">Previous</a> \
								<div> \
									<ul> \
										{gallery} \
									</ul> \
								</div> \
								<a href="#" class="pp_arrow_next">Next</a> \
							</div>',
            image_markup: '<img id="fullResImage" src="{path}" />',
            inline_markup: '<div class="pp_inline">{content}</div>',
        };

        var pp_settings = jQuery.extend(pp_default_setings, options),

        pp_caller, pp_dimensions, pp_open,
		pp_contentHeight, pp_contentWidth, pp_containerHeight, pp_containerWidth,
		pp_set_position, pp_rel_index, pp_images, pp_descriptions,
        $pp_pic_holder, $pp_gallery, $pp_gallery_li, pp_isSet, pp_currentGalleryPage,
        pp_itemsPerPage, pp_itemWidth, pp_totalPage,
        pp_doresize = true, pp_scroll_pos = _get_scroll();

        /**
		* Initialize.
		*/
        $.dynamicsImageViewer.initialize = function (caller) {
            pp_images = pp_settings.Images;
            pp_isSet = (pp_images.length > 1) ? true : false;
            pp_descriptions = pp_settings.Descriptions ? pp_settings.Descriptions : $.makeArray("");
            pp_set_position = (pp_settings.Position != undefined) ? pp_settings.Position : 0;
            pp_rel_index = pp_set_position;
            _build_overlay(caller);

            if (caller) {
                $.dynamicsImageViewer.open();
            }
            return false;
        }


        $.dynamicsImageViewer.open = function (options) {
            if (options != undefined) {
                pp_settings = jQuery.extend(pp_default_setings, options);
                $.dynamicsImageViewer.initialize();
            }
            // Hide the next/previous links if on first or last images.
            _checkPosition($(pp_images).size()); 

            $('.pp_loaderIcon').show();

            // Display the current position
            $pp_pic_holder.find('.currentTextHolder').text((pp_set_position + 1) + pp_settings.counter_separator_label + $(pp_images).size());

            // Set the description
            if (pp_settings.show_descriptions && typeof pp_descriptions[pp_set_position] != 'undefined' && pp_descriptions[pp_set_position] != "") {
                $pp_pic_holder.find('.pp_description').show().html(unescape(pp_descriptions[pp_set_position]));
            } else {
                $pp_pic_holder.find('.pp_description').hide();
            }

            // Display the holder
            var imgPreloader = "",
            skipInjection = false;

            // Inject the proper content
            var imgPreloader = new Image();
            $pp_pic_holder.find('#pp_full_res')[0].innerHTML = pp_settings.image_markup.replace(/{path}/g, "data:" + pp_images[pp_set_position].MimeType + ";base64," + pp_images[pp_set_position].DocumentBody);

            imgPreloader.onload = function () {
                // Fit item to viewport
                pp_dimensions = _fitToViewport(imgPreloader.width, imgPreloader.height);
                _showContent();
            };

            imgPreloader.onerror = function () {
                console.error('Image cannot be loaded. Make sure the path is correct and image exist.');
                $.dynamicsImageViewer.close();
            };

            imgPreloader.src = "data:" + pp_images[pp_set_position].MimeType + ";base64," + pp_images[pp_set_position].DocumentBody;
            return false;
        };


        /**
		* @param direction {String} Direction of the paging, previous or next.
		*/
        $.dynamicsImageViewer.changePage = function (direction) {
            pp_currentGalleryPage = 0;

            if (direction == 'previous') {
                pp_set_position--;
                if (pp_set_position < 0) pp_set_position = $(pp_images).size() - 1;
            } else if (direction == 'next') {
                pp_set_position++;
                if (pp_set_position > $(pp_images).size() - 1) pp_set_position = 0;
            } else {
                pp_set_position = direction;
            };

            pp_rel_index = pp_set_position;
            // Allow the resizing of the images
            if (!pp_doresize) pp_doresize = true; 
            if (pp_settings.allow_expand) {
                $('.pp_contract').removeClass('pp_contract').addClass('pp_expand');
            }

            _hideContent(function () { $.dynamicsImageViewer.open(); });
        };


        /**
		* @param direction {String} Direction of the paging, previous or next.
		*/
        $.dynamicsImageViewer.changeGalleryPage = function (direction) {
            if (direction == 'next') {
                pp_currentGalleryPage++;

                if (pp_currentGalleryPage > pp_totalPage) pp_currentGalleryPage = 0;
            } else if (direction == 'previous') {
                pp_currentGalleryPage--;

                if (pp_currentGalleryPage < 0) pp_currentGalleryPage = pp_totalPage;
            } else {
                pp_currentGalleryPage = direction;
            };

            var slide_speed = (direction == 'next' || direction == 'previous') ? pp_settings.animation_speed : 0;

            var slide_to = pp_currentGalleryPage * (pp_itemsPerPage * pp_itemWidth);

            $pp_gallery.find('ul').animate({ left: -slide_to }, slide_speed);
        };


        /**
		* Close.
		*/
        $.dynamicsImageViewer.close = function () {
            $('div.pp_pic_holder,.pp_fade').remove();
            // No more need for the markup
            $(this).remove(); 
            $(window).off('scroll.dynamicsImageViewer');
            pp_doresize = true;
            pp_open = false;
            pp_settings = null;
        };

        /**
		* Set the proper sizes on the containers and animate the content in.
		*/
        function _showContent() {
            $('.pp_loaderIcon').hide();
            $pp_pic_holder.find('.pp_content').css({ 'width': pp_settings.default_width + 'px', "height": (pp_settings.default_height) + 'px' });
            // Show the nav
            if (pp_isSet) { $pp_pic_holder.find('.pp_hoverContainer').show(); } else { $pp_pic_holder.find('.pp_hoverContainer').hide(); }
            $pp_pic_holder.find('.pp_hoverContainer,#fullResImage').css({ 'width': pp_settings.default_width + 'px', "height": (pp_settings.default_content_heigth) + 'px' });
            $pp_pic_holder.find('.pp_fade').show();
            if (pp_settings.allow_expand) {
                $('a.pp_expand,a.pp_contract').show();
            }
            pp_open = true;

            if (pp_settings.ChangePictureCallback) {
                pp_settings.ChangePictureCallback(pp_set_position);
            }

            _insert_gallery();
        };

        /**
		* Hide the content
		*/
        function _hideContent(callback) {
            // Fade out the current picture
            $pp_pic_holder.find('.pp_fade').fadeOut(pp_settings.animation_speed, function () {
                $('.pp_loaderIcon').show();
                callback();
            });
        };

        /**
		* Check the item position in the gallery array, hide or show the navigation links
		* @param setCount {integer} The total number of items in the set
		*/
        function _checkPosition(setCount) {
            //$('.pp_nav').hide();
            (setCount > 1) ? $('.pp_nav').show() : $('.pp_nav').hide(); // Hide the bottom nav if it's not a set.
        };

        /**
		* Resize the item dimensions if it's bigger than the viewport
		* @param width {integer} Width of the item to be opened
		* @param height {integer} Height of the item to be opened
		* @return An array containin the "fitted" dimensions
		*/
        function _fitToViewport(width, height) {
            var resized = false;

            _getDimensions(width, height);
            return {

                width: pp_settings.default_width,
                height: pp_settings.default_content_heigth,
                containerHeight: Math.floor(pp_containerHeight),
                containerWidth: Math.floor(pp_containerWidth) + (pp_settings.horizontal_padding * 2),
                contentHeight: pp_settings.default_height,
                contentWidth: Math.floor(pp_contentWidth),
                resized: resized
            };
        };

        /**
		* Get the containers dimensions according to the item size
		* @param width {integer} Width of the item to be opened
		* @param height {integer} Height of the item to be opened
		*/
        function _getDimensions(width, height) {
            width = pp_settings.default_width;
            height = pp_settings.default_content_heigth;

            // Get the details height, to do so, I need to clone it since it's invisible
            var $pp_details = $pp_pic_holder.find('.pp_details');
            $pp_details.width(width);

            // Get the container size, to resize the holder to the right dimensions
            pp_contentHeight = pp_settings.default_height;
            pp_contentWidth = width;
            pp_containerHeight = pp_contentHeight;
            pp_containerWidth = width;
        }

        function _center_overlay() {
            if (pp_doresize && !axis.isUndefined($pp_pic_holder)) {
                pp_scroll_pos = _get_scroll();
            };
        };

        function _get_scroll() {
            if (self.pageYOffset) {
                return { scrollTop: self.pageYOffset, scrollLeft: self.pageXOffset };
            } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
                return { scrollTop: document.documentElement.scrollTop, scrollLeft: document.documentElement.scrollLeft };
            } else if (document.body) {// all other Explorers
                return { scrollTop: document.body.scrollTop, scrollLeft: document.body.scrollLeft };
            };
        };

        function _resize_overlay() {
            pp_windowHeight = $(window).height(), pp_windowWidth = $(window).width();
        };

        function _insert_gallery() {
            if (pp_isSet && pp_settings.overlay_gallery) {
                pp_itemWidth = 52 + 5; // 52 beign the thumb width, 5 being the right margin.
                var navWidth = (pp_settings.theme == "facebook" || pp_settings.theme == "pp_default") ? 50 : 30; // Define the arrow width depending on the theme

                pp_itemsPerPage = Math.floor((pp_dimensions['containerWidth'] - 100 - navWidth) / pp_itemWidth);
                pp_itemsPerPage = (pp_itemsPerPage < pp_images.length) ? pp_itemsPerPage : pp_images.length;
                pp_totalPage = Math.ceil(pp_images.length / pp_itemsPerPage) - 1;

                // Hide the nav in the case there's no need for links
                if (pp_totalPage == 0) {
                    navWidth = 0; // No nav means no width!
                    $pp_gallery.find('.pp_arrow_next,.pp_arrow_previous').hide();
                } else {
                    $pp_gallery.find('.pp_arrow_next,.pp_arrow_previous').show();
                };

                var galleryWidth = pp_itemsPerPage * pp_itemWidth;
                var fullGalleryWidth = pp_images.length * pp_itemWidth;

                // Set the proper width to the gallery items
                $pp_gallery
					.css('margin-left', -((galleryWidth / 2) + (navWidth / 2)))
					.find('div:first').width(galleryWidth + 5)
					.find('ul').width(fullGalleryWidth)
					.find('li.selected').removeClass('selected');

                var goToPage = (Math.floor(pp_set_position / pp_itemsPerPage) < pp_totalPage) ? Math.floor(pp_set_position / pp_itemsPerPage) : pp_totalPage;

                $.dynamicsImageViewer.changeGalleryPage(goToPage);

                $pp_gallery_li.filter(':eq(' + pp_set_position + ')').addClass('selected');
            } else {
                $pp_pic_holder.find('.pp_content').off('mouseenter mouseleave');
                // $pp_gallery.hide();
            }
        }

        function _build_overlay(caller) {
            if ((pp_caller == undefined) && (caller != undefined)) {
                pp_caller = caller;
            }
            // Inject the markup
            $(pp_caller[0]).append(pp_settings.markup); 
            // Set my global selectors
            $pp_pic_holder = $('.pp_pic_holder'); 

            // Inject the inline gallery!
            if (pp_isSet && pp_settings.overlay_gallery) {
                pp_currentGalleryPage = 0;
                var toInject = "";
                var classname = '';
                var img_src = '';
                for (var i = 0; i < pp_images.length; i++) {
                    if (!pp_images[i].FileName.match(/\b(jpg|jpeg|png|gif|svn|bmp)\b/gi)) {
                        classname = 'default';
                        img_src = '';
                    } else {
                        classname = '';
                        img_src = "data:" + pp_images[i].MimeType + ";base64," + pp_images[i].DocumentBody;
                    }
                    toInject += "<li class='" + classname + "'><a href='#'><img src='" + img_src + "' width='50' alt='" + pp_images[i].Subject + "' /></a></li>";
                };

                toInject = pp_settings.gallery_markup.replace(/{gallery}/g, toInject);

                $pp_pic_holder.find('#pp_full_res').after(toInject);

                $pp_gallery = $('.pp_pic_holder .pp_gallery');
                // Set the gallery selectors
                $pp_gallery_li = $pp_gallery.find('li'); 

                $pp_gallery.find('.pp_arrow_next').on('click', function () {
                    $.dynamicsImageViewer.changeGalleryPage('next');
                    return false;
                });

                $pp_gallery.find('.pp_arrow_previous').on('click', function () {
                    $.dynamicsImageViewer.changeGalleryPage('previous');
                    return false;
                });

                $pp_pic_holder.find('.pp_content').hover(
					function () {
					    $pp_pic_holder.find('.pp_gallery:not(.disabled)').fadeIn();
					},
					function () {
					    $pp_pic_holder.find('.pp_gallery:not(.disabled)').fadeOut();
					});
                // 52 begin the thumb width, 5 being the right margin.
                pp_itemWidth = 52 + 5; 
                $pp_gallery_li.each(function (i) {
                    $(this)
						.find('a')
						.on('click', function () {
						    $.dynamicsImageViewer.changePage(i);
						    return false;
						});
                });
            };
            // Set the proper theme
            $pp_pic_holder.attr('class', 'pp_pic_holder ' + pp_settings.theme); 

            if (pp_settings.allow_expand) {
                $('a.pp_expand').on('click', function (e) {
                    var src = "data:" + pp_images[pp_set_position].MimeType + ";base64," + pp_images[pp_set_position].DocumentBody;
                    var imgPreloader = new Image();
                    imgPreloader.src = src;

                    //$("<img>") // Create a new <img>
                    //  .attr("src", src)
                    //    .load(function () {
                    //        // Print to console
                    //        console.log("Width:  " + this.width);
                    //        console.log("Height: " + this.height);
                    //    });

                    pp_settings.FlyoutImage.attr('src', src);
                    pp_settings.FlyoutImageContainer.css({ 'width': (imgPreloader.width + 20) + 'px', 'height': (imgPreloader.height + 20) + 'px' });
                    pp_settings.FlyoutOverlay.show();

                    return false;
                });
            }

            $pp_pic_holder.find('.pp_previous, .pp_nav .pp_arrow_previous').on('click', function () {
                $.dynamicsImageViewer.changePage('previous');
                return false;
            });

            $pp_pic_holder.find('.pp_next, .pp_nav .pp_arrow_next').on('click', function () {
                $.dynamicsImageViewer.changePage('next');
                return false;
            });
            // Center it
            _center_overlay(); 
        };

        // initializa and open
        $.dynamicsImageViewer.initialize(this);

        return this;
    };

})(jQuery);

function ReInitializeView() {
    var op = OptionsHelper.Options();
    if (op.Images.length > 0) {
        $.dynamicsImageViewer.open(op);
    } else {
        $('.noimagesfoundinner').show();
    }
    Utilities.Wait();
}

function InitializeView() {
    var op = OptionsHelper.Options();
    if (op.Images.length == 0) {
        Utilities.Wait();
        $('#maincontainer').hide();
        $('.noimagesfound').show();
        return;
    }

    var cloned = $('.flyoutOverlay').clone();
    $(window.parent.document.body).append(cloned);

    // Filter images
    $('#filterimages').on('click', function (e) {
        $.dynamicsImageViewer.close();
        var obj = {
            Guid: window.parent.Xrm.Page.data.entity.getId(),
            SuccessCallback: ReInitializeView
        };
        // {Guid: 'xxxx-xxxx', NoteText: 'some text', ImageType: 'jpeg', SuccessCallback}
        if ($('#notetext').val()) {
            obj.NoteText = $('#notetext').val();
        }
        if ($('#noteimagetypes').val()) {
            obj.ImageType = $('#noteimagetypes').val();
        }
        if ($('#imagefilename').val()) {
            obj.Filename = $('#imagefilename').val();
        }
        ImageLoaderHelper.GetImages(obj);
        return false;
    });

    // Reset filter
    $('#resetfilterimages').on('click', function () {
        $('#notetext').val('');
        $('#noteimagetypes').val('');
        $('#imagefilename').val('');
        $.dynamicsImageViewer.close();
        var obj = {
            Guid: window.parent.Xrm.Page.data.entity.getId(),
            SuccessCallback: ReInitializeView
        };
        ImageLoaderHelper.GetImages(obj);
        return false;
    });

    // Set entity image
    $('#setentityimages').on('click', function () {
        var op = OptionsHelper.Options();
        var index = Utilities.ImageIndex();
        if (index < 0) {
            return false;
        }
        // Get current image index and set the content from Images structure
        Utilities.Wait(true);
        var entity = {
            entityimage: op.Images[index].DocumentBody
        };
        var uri = SdkWebAPI.GetUri(SdkWebAPI.GetEntitySetName(window.parent.Xrm.Page.data.entity.getEntityName()), window.parent.Xrm.Page.data.entity.getId());
        SdkWebAPI.update(uri, entity, Utilities.SetEntityImageSuccess, Utilities.SetEntityImageFail);
        return false;
    });

    // Initialize
    
    op.FlyoutOverlay = cloned;
    op.FlyoutImageContainer = cloned.find('.flyoutimagecontainer:first');
    op.FlyoutImage = cloned.find('.flyoutimage:first');

    op.FlyoutOverlay.on('click', function (e) {
        $(this).hide();
    });

    $("#maincontainer").dynamicsImageViewer(op);
    Utilities.Wait();
}

function InitializeCtrl() {
    // Get the ctrl configuration guid from parameters
    var configguid = Utilities.GetWebresourceParameters();

    if (configguid == null) {
        $('#maincontainer').hide();
        Utilities.DisplayCrmAlertDialog('Error. Unale to load image view. Configuration Guid is missing from form parameters.');
        return;
    }

    var fetch = '<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">' +
          '<entity name="mtools_dynamicsimageviewconfiguration">' +
            '<attribute name="mtools_dynamicsimageviewconfigurationid" />' +
            '<attribute name="mtools_name" />' +
            '<attribute name="new_theme" />' +
            '<attribute name="mtools_showthumbnails" />' +
            '<attribute name="mtools_showdescriptions" />' +
            '<attribute name="mtools_counterseperator" />' +
            '<order attribute="mtools_name" descending="false" />' +
            '<filter type="and">' +
              '<condition attribute="statecode" operator="eq" value="0" />' +
              '<condition attribute="mtools_dynamicsimageviewconfigurationid" operator="eq" uitype="mtools_dynamicsimageviewconfiguration" value="' + Utilities.AddCurlyBrace(configguid) + '" />' +
            '</filter>' +
          '</entity>' +
        '</fetch>';

    SdkWebAPI.getFetchXml('mtools_dynamicsimageviewconfigurations', fetch, OptionsHelper.UpdateFromConfigSucess, OptionsHelper.UpdateFromConfigFail);
}
