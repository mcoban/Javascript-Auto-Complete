/**
 * Created by muslum coban on 11/02/16.
 * uri: kodmark.com
 */


$(document).ready(function() {


    var kodmarkComplete = function(id) {

        var element = $('#' + id);
        var searchWrapper = element.wrap("<div id='searchWrapper'></div>");
        var sprite = $("<img class='loading-sprite' src='img/load.svg' />");
        var resultsWrapper = $("<div id='resultsWrapper'><ul></ul></div>");
        var max_results = 3;
        var result_count = 0;
        var min_char = 3;
        var top = element.outerHeight();
        var current_length = 0;


        element.after(sprite);
        sprite.after(resultsWrapper);
        resultsWrapper.width("100%");
        resultsWrapper.css("top", top + 5);


        resultsWrapper.on("mouseover", "li", function() {
            resultsWrapper.find(".hovered").removeClass("hovered");
            $(this).find("a").addClass("hovered");
            hovered_index = $(this).index();
        });


        var updownArrows = {
            up: 38,
            down: 40
        };
        var hovered_index = undefined;
        element.on("keyup", function(e) {

            if(element.val().length == 0 || e.keyCode == 27) {
                element.val("");
                current_length = 0;
                clearResults();
            }

            if(e.keyCode == updownArrows.down) {
                if(hovered_index==undefined)
                    hovered_index = -1;
                hovered_index++;
            }
            if(e.keyCode == updownArrows.up) {
                if(hovered_index==undefined)
                    hovered_index = 0;
                hovered_index--;
            }
            if(e.keyCode == updownArrows.down || e.keyCode == updownArrows.up) {
                resultsWrapper.find(".hovered").removeClass("hovered");
                resultsWrapper.find("li").eq(hovered_index % (result_count)).find("a").addClass("hovered");
                return;
            }
            if(e.keyCode == 13) {
                window.location.href = getURL();
            }


            if(element.val().length >= min_char && element.val().length != current_length) {
                sprite.show();
                current_length = element.val().length;
                $.get("data.json", function(data) {
                    clearResults();
                    var items = data.items;
                    var result_items = [];
                    element.val().split(" ").forEach(function(typed_keyword) {
                        if(typed_keyword != '') {
                            items.forEach(function(item) {
                                item.keywords.forEach(function(keyword) {
                                    if(keyword.search(typed_keyword.toLowerCase()) >= 0) {
                                        var point = typed_keyword.length / keyword.length;
                                        if(item.matched_keywords == undefined) {
                                            item.matched_keywords = 0;
                                        }
                                        if(point == 1) {
                                            item.matched_keywords++;
                                        }
                                        if(item.search_point == undefined) {
                                            item.search_point = 0;
                                        }
                                        item.search_point += (item.matched_keywords + 1) * point * 100;
                                        if(item.contains == undefined) {
                                            item.contains = true;
                                            result_items.push(item);
                                        }
                                    }
                                });
                            });
                        }
                    });
                    if(result_items.length > 0) {
                        result_items.sort(function(obj1, obj2) {
                            return obj2.search_point - obj1.search_point;
                        });
                        result_items.forEach(function(item) {
                            if(result_count <= max_results) {
                                result_count++;
                                resultsWrapper.find("ul").append("<li><a href='" + item.url + "'><img src='http://www.kodmark.com/wp-content/themes/rttheme/timthumb.php?src=" + item.thumb + "&w=60&zc=1' alt=''><span>" + item.name + "</span><div><small>" + item.categories + "</small></div></a></li>");
                            }
                        });
                    }
                    if(result_count > 0) {
                        resultsWrapper.show();
                        sprite.hide();
                    }
                });
            }
        });

        var clearResults = function() {
            resultsWrapper.find("li").remove();
            sprite.hide();
            resultsWrapper.hide();
            hovered_index = undefined;
            result_count = 0;
        };

        var getText = function() {
            return resultsWrapper.find(".hovered span").text();
        };

        var getURL = function() {
            return resultsWrapper.find(".hovered").attr("href");
        };

    };

    kodmarkComplete("search-box");

});