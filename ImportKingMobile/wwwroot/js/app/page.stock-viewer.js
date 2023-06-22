+function () {
    $('input').change(function () {
        $('#result').html('');
    });

    // using ES5   (200 characters)
    var qd = {};
    if (location.search) location.search.substr(1).split("&").forEach(function (item) { var s = item.split("="), k = s[0], v = s[1] && decodeURIComponent(s[1]); (qd[k] = qd[k] || []).push(v) })

    // using ES6   (23 characters cooler)
    var qd = {};
    if (location.search) location.search.substr(1).split`&`.forEach(item => { let [k, v] = item.split`=`; v = v && decodeURIComponent(v); (qd[k] = qd[k] || []).push(v) })

    // as a function with reduce
    function getQueryParams() {
        return location.search
            ? location.search.substr(1).split`&`.reduce((qd, item) => { let [k, v] = item.split`=`; v = v && decodeURIComponent(v); (qd[k] = qd[k] || []).push(v); return qd }, {})
            : {}
    }

    var merchantName = '';
    var userType = 0;

    $.ajax({
        url: 'https://importking.mooo.com/api/Users/GetByEmail/' + userMail,
        success: function (data) {
            merchantName = data.merchantName;
            userType = data.userType;
        }
    });

    $('.app-content').progressBar();

    $.ajax({
        url: 'https://importking.mooo.com/api/Categories/Search',
        success: function (d) {
            //d.results = d.results.filter(e => e.text.toLowerCase().includes('testing') == false);
            $('#categories').select2({
                data: d.results,
                placeholder: 'Please select category'
            });

            var params = getQueryParams();
            if (params.hasOwnProperty('categoryId') && params.categoryId.length > 0) {
                var categoryId = params.categoryId[0];
                $('#categories').val(categoryId);
                $('#categories').trigger('change');
            }

            $('.app-content').progressBar('hide');
        }
    });

    $('#types').select2({
        data: [],
        placeholder: 'Please select type'
    });

    $('#colors').select2({
        data: [],
        placeholder: 'Please select color'
    });

    $('#categories').change(function () {        
        var categoryId = $(this).val();

        if (categoryId != '') {
            $('.app-content').progressBar();

            $.ajax({
                url: 'https://importking.mooo.com/api/Warehouses/0/Categories/' + categoryId + '/Types',
                success: function (data) {
                    var results = $.map(data, function (item) {
                        return {
                            id: item.typeId,
                            text: item.brand + ' ' + item.name
                        };
                    });

                    //results = results.filter(e => e.text.toLowerCase().includes('testing') == false);

                    results.unshift({ text: 'All types', id: 0 });

                    $('#types').select2({
                        data: results,
                        placeholder: 'Please select type'
                    });

                    $('.app-content').progressBar('hide');
                },
                fail: function () {
                    $('.app-content').progressBar('hide');
                    App.Alert.show('danger', 'Failed', 'Failed to load types');
                }
            });
        }
        else {
            $('#types').select2({
                data: [],
                placeholder: 'Please select type'
            });
        }
    });

    var formatData = function (data) {
        if (data.colorCode)
            return "<span class='color-code d-inline-block m-1 mr-1 float-left' style='background:" + data.colorCode + "'></span> <span class='align-middle'>" + data.text + "</span>";

        return "<span class='align-middle'>" + data.text + "</span>";
    }

    $('#types').change(function () {

        var categoryId = $('#categories').val();
        var typeId = $(this).val();

        if (categoryId != '' && typeId != '') {
            $('.app-content').progressBar();

            $.ajax({
                url: 'https://importking.mooo.com/api/Warehouses/0/Categories/' + categoryId + '/Types/' + typeId + '/Colors',
                success: function (data) {

                    var results = $.map(data, function (item) {
                        return {
                            id: item.colorId,
                            text: item.name.initCap(),
                            colorCode: item.colorCode
                        };
                    });

                    //results = results.filter(e => e.text.toLowerCase().includes('testing') == false);

                    results.unshift({ text: 'All colors', id: 0 });

                    $('#colors').select2({
                        data: results,
                        placeholder: 'Please select color',
                        templateResult: formatData,
                        templateSelection: formatData,
                        escapeMarkup: function (m) { return m; }
                    });

                    $('#colors').val(0);
                    $('#colors').trigger('change');

                    $('.app-content').progressBar('hide');
                },
                fail: function () {
                    $('.app-content').progressBar('hide');
                    App.Alert.show('danger', 'Failed', 'Failed to load colors');
                }
            });
        }
        else {
            $('#colors').select2({
                data: [],
                placeholder: 'Please select color'
            });
        }
    });

    var isCheckPhotos = false;

    $('#btnCheckStock').click(function () {
        isCheckPhotos = false;
        $('#searchForm').submit();
    });

    $('#btnCheckPhotos').click(function () {
        isCheckPhotos = true;
        $('#searchForm').submit();
    });

    function displayPhotos(data) {
        var items = '';
        var keyArray = [];
        var isImagesVideosAvailable = false;

        $.each(data.products, function (index, item) {
            var key = item.categoryName + '_' + item.brand + '_' + item.typeName;

            if (keyArray.indexOf(key) >= 0)
                return;

            keyArray.push(key);

            var commImages = item.productCommercialImages;
            var catalogImages = item.productCatalogImages;
            var commVideo = item.productCommercialVideos;
            var catalogVideo = item.productCatalogVideos;

            var commImagesStr = '';
            $.each(commImages, function (i, image) {
                isImagesVideosAvailable = true;
                var fn = image.fileName;
                var fnArr = fn.split('.');
                if (fnArr.length > 1)
                    fn = fnArr[0] + '-small.' + fnArr[1];
                if (fn)
                    commImagesStr += '<img class="prd-image rounded me-2 mb-2" src="https://importking.mooo.com/Uploads/' + fn + '">';
            });

            var catalogImagesStr = '';
            $.each(catalogImages, function (i, image) {
                isImagesVideosAvailable = true;
                var fn = image.fileName;
                var fnArr = fn.split('.');
                if (fnArr.length > 1)
                    fn = fnArr[0] + '-small.' + fnArr[1];
                if (fn)
                    catalogImagesStr += '<img class="prd-image rounded me-2 mb-2" src="https://importking.mooo.com/Uploads/' + fn + '">';
            });

            var commVideoStr = '';
            $.each(commVideo, function (i, video) {
                isImagesVideosAvailable = true;
                commVideoStr += '<iframe class="mb-1" width="100%" src="' + video.url + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>';
            });

            var catalogVideoStr = '';
            $.each(catalogVideo, function (i, video) {
                isImagesVideosAvailable = true;
                catalogVideoStr += '<iframe class="mb-1" width="100%" src="' + video.url + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>';
            });

            var $text = $('<div class="text mb-3"></div>');
            var title = '<h6 class="title">' + item.categoryName + ' ' + item.brand + ' ' + item.typeName + '</h6>';

            $text.html(title);

            if (commImagesStr) {
                var titleImage = '<div>Commercial Images</div>';
                var divImages = '<div class="image-container mb-1">' + commImagesStr + '<div><button class="btn btn-secondary btn-download w-100 btn-sm"><i class="material-icons md-cloud_download me-2"></i>Download</button></div>';
                $text.append(titleImage);
                $text.append(divImages);
            }

            if (catalogImagesStr) {
                var titleImage = '<div>Catalog Images</div>';
                var divImages = '<div class="image-container mb-1">' + catalogImagesStr + '<div><button class="btn btn-secondary btn-download w-100 btn-sm"><i class="material-icons md-cloud_download me-2"></i>Download</button></div>';
                $text.append(titleImage);
                $text.append(divImages);
            }

            if (catalogVideoStr) {
                var titleVideo = '<div>Commercial Videos</div>';
                var divVideo = '<div>' + catalogVideoStr + '</div>';
                $text.append(titleVideo);
                $text.append(divVideo);
            }

            if (commVideoStr) {
                var titleVideo = '<div>Catalog Videos</div>';
                var divVideo = '<div>' + commVideoStr + '</div>';
                $text.append(titleVideo);
                $text.append(divVideo);
            }

            if (commImagesStr || catalogImagesStr || commVideoStr || catalogVideoStr)
                items += $('<div></div>').html($text).html();
        });

        if (isImagesVideosAvailable) {
            $('#productList').html(items);
            $('#productList').show();
        }
        else {
            var div = '<div class="fw-bold fs-3 text-danger"><div><i class="material-icons md-highlight_off fs-2"></i></div>No Photos / Videos Available</div>';
            $('#result').html(div);
            $('#result').show();
        }

        $('iframe').each(function (index, item) {
            var w = $(item).width();
            var h = w / 1.7;
            $(item).height(h);
        });

        $('.prd-image').off('click').on('click', function () {
            var images = $(this).parent().find('img');

            var currentImgSrc = $(this).attr('src');
            currentImgSrc = currentImgSrc.replace('-small', '');

            var imageArray = [];
            var liArray = [];

            $.each(images, function (index, item) {
                var src = $(item).attr('src');
                src = src.replace('-small', '');

                var image = '';
                var li = '';

                if (src == currentImgSrc) {
                    image = '<div class="carousel-item active">' +
                        '<img src="' + src + '" class="d-block w-100" alt="...">' +
                        '</div>';

                    li = '<button type="button" data-bs-target="#productCarousel" data-bs-slide-to="' + index + '" class="active" aria-current="true"></button>';
                }
                else {
                    image = '<div class="carousel-item">' +
                        '<img src="' + src + '" class="d-block w-100" alt="...">' +
                        '</div>';

                    li = '<button type="button" data-bs-target="#productCarousel" data-bs-slide-to="' + index + '"></button>';
                }

                imageArray.push(image);
                liArray.push(li);
            });

            imageArray = imageArray.join('');
            liArray = liArray.join('');

            var carousel = '<div id="productCarousel" class="carousel slide" data-bs-ride="carousel">' +
                '<div class="carousel-indicators">' +
                liArray +
                '</div>' +
                '<div class="carousel-inner">' +
                imageArray +
                '</div>' +
                '<button class="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">' +
                '<span class="carousel-control-prev-icon" aria-hidden="true"></span>' +
                '<span class="visually-hidden">Previous</span>' +
                '</button>' +
                '<button class="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">' +
                '<span class="carousel-control-next-icon" aria-hidden="true"></span>' +
                '<span class="visually-hidden">Next</span>' +
                '</button>' +
                '</div>';

            var modal = new App.Modal();
            modal.show('Product Image', carousel, '', {
                'Download': function () {
                    var src = $('.carousel-item.active img').attr('src');
                    var fileName = src.split('/').pop();
                    var url = 'https://importking.mooo.com/api/Attachments?fileName=' + fileName + '&waterMarkString=' + merchantName;
                    window.open(url, '_blank');
                }
            });

            $('.carousel').carousel({
                interval: false
            });
        });

        $('.btn-download').off('click').on('click', function () {
            var imgs = $(this).parents('.image-container').find('img');
            $.each(imgs, function (i, item) {
                var fileName = $(item).attr('src').split('/').pop();
                fileName = fileName.replace('-small', '');
                var url = 'https://importking.mooo.com/api/Attachments?fileName=' + fileName + '&waterMarkString=' + merchantName;
                window.open(url, '_blank');
            });
        });
    }

    $('#searchForm').validate({
        rules: {
            categories: {
                required: true
            },
            types: {
                required: true
            }
        },
        submitHandler: function () {
            $form = $('#searchForm');
            $('#productList').hide();
            $('#result').hide();
            $('#spinner').show();

            var formData = App.Utils.getFormData($form);

            if (formData.colors && formData.colors != '0') {
                $.ajax({
                    url: 'https://importking.mooo.com/api/Catalogs?categoryId=' + formData.categories + '&typeId=' + formData.types + '&colorId=' + formData.colors + '&length=10&start=0',
                    method: 'GET',
                    dataType: 'JSON',
                    success: function (data) {
                        $('#spinner').hide();

                        if (isCheckPhotos) {
                            displayPhotos(data);
                        }
                        else {
                            if (data.products.length > 0 && data.products[0].stock > 0) {
                                var div = '';
                                if (userType == 3) {
                                    div = '<div class="fw-bold fs-3 text-success"><div class="badge badge-sm bg-primary me-2">' + data.products[0].stock + '</div><div><i class="material-icons md-check_circle_outline fs-2"></i></div>Stock Available</div>';
                                }
                                else {
                                    div = '<div class="fw-bold fs-3 text-success"><div><i class="material-icons md-check_circle_outline fs-2"></i></div>Stock Available</div>';
                                }
                                $('#result').html(div);
                            }
                            else {
                                var div = '<div class="fw-bold fs-3 text-danger"><div><i class="material-icons md-highlight_off fs-2"></i></div>Stock Not Available</div>';
                                $('#result').html(div);
                            }
                        }

                        $('#result').show();
                    }
                }).fail(function (xhr, status, error) {
                    $('#spinner').hide();
                });
            }
            else {
                $.ajax({
                    url: 'https://importking.mooo.com/api/Catalogs?categoryId=' + formData.categories + '&typeId=' + formData.types + '&length=100&start=0',
                    method: 'GET',
                    dataType: 'JSON',
                    success: function (data) {
                        $('#spinner').hide();
                        if (data.products.length > 0) {
                            if (isCheckPhotos) {
                                displayPhotos(data);
                            }
                            else {
                                var items = '';
                                $.each(data.products, function (index, item) {
                                    var icon = '<i class="material-icons md-highlight_off text-danger mr-0"></i>';
                                    if (item.stock > 0) {
                                        if (userType == 3) {                                            
                                            icon = '<div class="badge badge-sm bg-primary me-2">' + item.stock + '</div><i class="material-icons md-check_circle_outline text-success mr-0"></i>';
                                        }
                                        else {
                                            icon = '<i class="material-icons md-check_circle_outline text-success mr-0"></i>';
                                        }
                                    }
                                    var textClass = App.Utils.isHexLight(item.colorCode) ? 'text-dark' : 'text-light';

                                    var item = '<li class="nav-item">' +
                                        '<a class="icontext">' +
                                        '<div class="text">' +
                                        '<h6 class="title">' + item.categoryName + '</h6>' +
                                        '<div>' + item.brand + ' ' + item.typeName + '</div>' +
                                        '<span class="badge text-capitalize ' + textClass + '" style="background:' + item.colorCode + ';">' + item.colorName + '</span>' +
                                        '</div>' +
                                        icon +
                                        '</a>' +
                                        '</li>';

                                    items += item;
                                });

                                $('#productList').html(items);
                                $('#productList').show();
                            }
                        }
                        else {
                            var div = '<div class="fw-bold fs-3 text-danger"><div><i class="material-icons md-highlight_off fs-2"></i></div>Stock Not Available</div>';
                            $('#result').html(div);
                            $('#result').show();
                        }
                    }
                }).fail(function (xhr, status, error) {
                    $('#spinner').hide();
                });
            }
        }
    });
}();