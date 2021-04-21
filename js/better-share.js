function betterShare() {
    var that = this;
    this.btnSelector = '.better-share';
    this.closeBtnSelector = '.close-btn';
    this.modalID = 'better-share-modal';
    if (!$(this.btnSelector).length) return;
    this.buttons = [{
        facebook: '<i class="fa fa-facebook fa-lg"></i>'
    }, {
        twitter: '<i class="fa fa-twitter fa-lg"></i>'
    }, {
        email: '<i class="fa fa-envelope-o fa-lg"></i>'
    }, {
        whatsapp: '<i class="fa fa-whatsapp fa-lg"></i>'
    }, {
        telegram: '<i class="fa fa-telegram fa-lg"></i>'
    }];

    this.buttonsHtml = '';
    this.getTitle = function() {
        if (this.button.data('share-title')) {
            return this.button.data('share-title');
        }
        if ($('head meta[property="og:title"]').length) {
            return $('head meta[property="og:title"]').first().attr('content');
        }
        return document.title;
    };

    this.getUrl = function() {
        if (this.button.data('share-url')) {
            return this.button.data('share-url');
        }
        if ($('head meta[property="og:url"]').length) {
            return $('head meta[property="og:url"]').first().attr('content');
        }
        return window.location.href;
    };

    this.getText = function() {
        if (this.button.data('share-description')) {
            return this.button.data('share-description');
        }
        if ($('head meta[property="og:description"]').length) {
            return $('head meta[property="og:description"]').first().attr('content');
        }
    };

    this.modalWidth = function() {
        return Math.min($(window).width() - 16, 550);
    }


    this.shareModal = function(close) {
        //create share modal html
        //social media icons
        var overlayID = this.modalID + '-overlay';
        $('#' + this.modalID).remove();
        $('body').removeClass(this.modalID + '-open');
        $('#' + overlayID).remove();

        if (typeof close == 'undefined') {
            if (!that.buttonsHtml) {
                $.each(this.buttons, function(index, data) {
                    for (key in data) {
                        if (data.hasOwnProperty(key)) {
                            var value = data[key];
                            that.buttonsHtml += '<button class="' + key + '-btn" data-for="' + key + '">' + value + '</button>';
                        }
                    }
                });

            }

            var div = '<div id="' + this.modalID + '" role="dialog"><button class="close-btn" aria-label="close share modal" data-for="close"></button>' +
                '<div class="better-share-buttons">' +
                that.buttonsHtml +
                '</div></div><div id="' + overlayID + '"></div>';
            $('body').addClass(this.modalID + '-open');

            $('body').append(div);
        }
    }

    this.openFaux = function() {
        this.shareModal();
    };

    this.close = function() {
        this.shareModal(1);
    };

    this.telegram = function() {
        window.open("https://t.me/share/url?url=" + this.getUrl(), 'share-telegram', 'width=' + this.modalWidth() + ',height=296');
    };

    this.whatsapp = function() {
        window.open("https://api.whatsapp.com/send?text=" + this.getUrl(), 'share-whatsapp', 'width=' + this.modalWidth() + ',height=296');
    };

    this.facebook = function() {
        window.open("https://www.facebook.com/sharer/sharer.php?u=" + this.getUrl(), 'share-facebook', 'width=' + this.modalWidth() + ',height=296');
    };

    this.twitter = function() {
        var params = this.getTitle();
        if (this.getText()) {
            params += ' / ' + this.getText();
        }
        params += "&url=" + this.getUrl();
        console.log(params);
        window.open(
            "https://twitter.com/intent/tweet?text=" + params, 'share-twitter', 'width=' + this.modalWidth() + ',height=235'
        );
    };

    this.email = function() {
        //check if share text exists
        var params = this.getUrl() + "&subject=" + this.getTitle();
        if (this.getText()) {
            params = this.getText() + '%0D%0A%0D%0A' + params;
        }

        window.open(
            "mailto:?&body=" + params, 'share-email'
        );
    };


    this.share = function() {
        if (navigator.share && navigator.userAgent.match(/SamsungBrowser/i) === null) {
            //web share API is supported
            navigator.share({
                    title: this.getTitle(),
                    text: this.getText(),
                    url: this.getUrl()
                }).then(() => {
                    console.log('Thanks for sharing!');
                })
                .catch(console.error);

        } else {
            this.openFaux();
            var overlayID = this.modalID + '-overlay';
            $('#' + this.modalID + ' button').on('click', function() {
                var action = $(this).data('for');
                if (action)
                    that[action]();

            });

            $("#" + overlayID).click(function() {
                if (!$(this).closest('#' + this.modalID).length) {
                    that.close();
                }
            });

        }
    };
    this._init = function() {

        $(this.btnSelector).on('click', function() {
            that.button = $(this);
            that.share();
        });
    };
    this._init();
}
$(function() {
    betterShare();
});