var ReferrerKiller = (function () {
    var URL_REDIRECTION = "https://www.google.com/url?q=", // You can use another service if you use https protocol no referrer will be sent.
        PUB = {},
        IE_GT_8 = (function () {
                /*- Detecting if it's IE greater than 8 -*/
                var trident,
                    match = navigator.userAgent.match(/Trident\/(\d)+/);
                if (null === match) {
                    return false;
                }
                trident = parseInt(match[1], 10);
                if (isNaN(trident)) {
                    return false;
                }
                return trident > 4;
        })();

    /**
     * Escapes double quotes in a string.
     *
     * @private
     * @param {string} str
     * @return {string}
     */
    function escapeDoubleQuotes(str) {
        return str.split('"').join('\\"');
    }
    
    /**
     * Given a html string returns an html node.
     *
     * @private
     * @param {string} html
     * @return {Node}
     */
    function htmlToNode(html) {
        var container = document.createElement('div');
        container.innerHTML = html;
        return container.firstChild;
    }
    
    /**
     * Converts object to html attributes string.
     *
     * @private
     * @param {object} obj
     * @return {string}
     */
    function objectToHtmlAttributes(obj) {
        var attributes = [],
            value;
        for (var name in obj) {
            value = obj[name];
            attributes.push(name + '="' + escapeDoubleQuotes(value) + '"');
        }
        return attributes.join(' ');
    }

    /**
     * It applies the hack to kill the referrer to some html.
     *
     * @public
     * @param {string} html.
     * @param {object} [iframeAttributes]
     * @return {string} html.
     */
    function htmlString(html, iframeAttributes) {
        var iframeAttributes  = iframeAttributes || {},
            defaultStyles = 'border:none; overflow:hidden; ',
            id;
        /*-- Setting default styles and letting the option to add more or overwrite them --*/
        if ('style' in iframeAttributes) {
            iframeAttributes.style =  defaultStyles + iframeAttributes.style;
        } else {
            iframeAttributes.style = defaultStyles;
        }
        id = '__referrer_killer_' + (new Date).getTime() + Math.floor(Math.random()*9999);
        /*-- Returning html with the hack wrapper --*/
        return '<iframe \
                style="border 1px solid #ff0000" \
                scrolling="no" \
                frameborder="no" \
                allowtransparency="true" ' +
            /*-- Adding style attribute --*/
            objectToHtmlAttributes( iframeAttributes ) +
            'id="' + id + '" ' +
            '	src="javascript:\'\
            <!doctype html>\
            <html>\
            <head>\
            <meta charset=\\\'utf-8\\\'>\
            <style>*{margin:0;padding:0;border:0;}</style>\
            </head>' +
            /*-- Function to adapt iframe's size to content's size --*/
            '<script>\
                 function resizeWindow() {\
                    var elems  = document.getElementsByTagName(\\\'*\\\'),\
                        width  = 0,\
                        height = 0,\
                        first  = document.body.firstChild,\
                        elem;\
                    if (first.offsetHeight && first.offsetWidth) {\
                        width = first.offsetWidth;\
                        height = first.offsetHeight;\
                    } else {\
                        for (var i in elems) {\
                                            elem = elems[i];\
                                            if (!elem.offsetWidth) {\
                                                continue;\
                                            }\
                                            width  = Math.max(elem.offsetWidth, width);\
                                            height = Math.max(elem.offsetHeight, height);\
                        }\
                    }\
                    var ifr = parent.document.getElementById(\\\'' + id + '\\\');\
                    ifr.height = height;\
                    ifr.width  = width;\
                }\
            </script>' +
            '<body onload=\\\'resizeWindow()\\\'>\' + decodeURIComponent(\'' +
            /*-- Content --*/
            encodeURIComponent(html) +
        '\') +\'</body></html>\'"></iframe>';
    }

    /*-- Public interface --*/
    var imageHtml = PUB.imageHtml = function (url, imgAttributesParam) {
        var imgAttributes = imgAttributesParam || {},
        /*-- Making sure this styles are applyed in the image but let the possibility to overwrite them --*/
            defaultStyles = 'border:none; margin: 0; padding: 0';
        if ('style' in imgAttributes) {
            imgAttributes.style = defaultStyles + imgAttributes.style;
        } else {
            imgAttributes.style = defaultStyles;
        }
        return htmlString('<img src="' + escapeDoubleQuotes(url) + '" ' + objectToHtmlAttributes(imgAttributes) + '/>');
    };
    
    var imageNode = PUB.imageNode = function (url, imgParams) {
        return htmlToNode(imageHtml(url, imgParams));
    };

    /*-- Exposing the module interface --*/
    return PUB;
})();
