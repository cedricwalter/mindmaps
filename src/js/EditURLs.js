/**
 * Creates a new EditURLsView. This view renders a dialog where the user can
 * save the mind map.
 *
 * @constructor
 */
mindmaps.EditURLsView = function () {
    var self = this;

    var $dialog = $("#template-urls").tmpl().dialog({
        autoOpen: false,
        modal: true,
        zIndex: 5000,
        width: 550,
        close: function () {
            // remove dialog from DOM
            $(this).dialog("destroy");
            $(this).remove();
        }
    });

    var $directInputDiv = $("#urls-direct-input");
    var $directInputText = $("#urls-direct-input input");
    var $directInputButton = $("#urls-direct-input button");

    var $dropdownInputDiv = $("#urls-dropdown-input");
    var $dropdownInputSelect = $("#urls-dropdown-input select");
    var $dropdownInputButton = $("#urls-dropdown-input button");

    var $searchDropdownInputDiv = $("#urls-search-dropdown-input");
    var $searchDropdownInputText = $("#urls-search-dropdown-input input");
    var $searchDropdownInputSearchButton = $("#urls-search-dropdown-input .search");
    var $searchDropdownInputSelect = $("#urls-search-dropdown-input select");
    var $searchDropdownInputAddButton = $("#urls-search-dropdown-input .add");

    var $multiUrlDisplay = $("#template-urls-multi-url-display").tmpl();
    var $multiUrlList = $multiUrlDisplay.find(".url-list");
    var $multiUrlListBody = $multiUrlList.find("tbody");

    // Set up "Search" button (dropdown with search)
    $searchDropdownInputSearchButton.click(function () {
        self.searchQuerySubmitted($searchDropdownInputText.val());
    });

    // Pressing enter in search field should behave like "Search" click
    $searchDropdownInputText.keypress(function (e) {
        if (e.which === 13) {
            self.searchQuerySubmitted($searchDropdownInputText.val());
        }
    });

    if (mindmaps.Config.allowMultipleUrls) {
        // Multi-URL setup

        // Set up "Add" button (direct input)
        $directInputButton.click(function () {
            self.urlAdded($directInputText.val());
            $directInputText.val("");
        });

        // Pressing enter in text field should behave like "Add" click
        $directInputText.keypress(function (e) {
            if (e.which === 13) {
                self.urlAdded($directInputText.val());
                $directInputText.val("");
            }
        });

        // Set up "Add" button (dropdown)
        $dropdownInputButton.click(function () {
            self.urlAdded($dropdownInputSelect.val());
        });

        // Set up "Add" button (dropdown with search)
        $searchDropdownInputAddButton.click(function () {
            self.urlAdded($searchDropdownInputSelect.val());
        });
    }
    else {
        // Single-URL setup

        // Save any changes in the text field immediately.
        $directInputText.bind("change keyup", function () {
            self.singleUrlChanged($directInputText.val());
        });

        // Save URL that is selected in dropdown to node.
        $dropdownInputSelect.change(function () {
            self.singleUrlChanged($dropdownInputSelect.val());
        });

        // Save URL that is selected in dropdown to node.
        $searchDropdownInputSelect.change(function () {
            self.singleUrlChanged($searchDropdownInputSelect.val());
        });

        // Hide all buttons. They're only needed to multi-URL mode.
        $directInputButton.css({ "display": "none" });
        $dropdownInputButton.css({ "display": "none" });
        $searchDropdownInputAddButton.css({ "display": "none" });
    }

    $multiUrlListBody.delegate("a.delete", "click", function () {
        var t = $(this).tmplItem();
        self.urlRemoved(t.data.url);
    });

    this.setUrls = function (urls) {
        urls=urls||[]
        if (mindmaps.Config.allowMultipleUrls) {
            $multiUrlListBody.empty();

            if (urls.length === 0) {
                $multiUrlListBody.append("<tr><td>No URLs added yet.</td></tr>");
            }
            else {
                urls.forEach(function (url) {
                    $("#template-urls-table-item").tmpl({
                        "url": url
                    }).appendTo($multiUrlListBody);
                });
            }
        }
        else {
            $directInputText.val(urls[0]);
        }
    }

    function setGenericDropDownUrls(urls, nodeUrls, $select) {
        $select.empty();

        urls.urls.forEach(function (url) {
            var $option = $('<option value="' + url.url + '">' + url.label + '</option>');
            $select.append($option);
        });

        if (!mindmaps.Config.allowMultipleUrls) {
            var $option = $('<option value="">No URL selected.</option>');
            $select.prepend($option);

            $select.val(nodeUrls[0]);
        }
    }

    this.setDropDownUrls = function (urls, nodeUrls) {
        setGenericDropDownUrls(urls, nodeUrls, $dropdownInputSelect);
    }

    this.setSearchDropDownUrls = function (urls, nodeUrls) {
        setGenericDropDownUrls(urls, nodeUrls, $searchDropdownInputSelect);
    }

    this.showDropdownError = function (msg) {
        $dialog.find('.dropdown-error').text(msg);
    }

    this.showSearchDropdownError = function (msg) {
        $dialog.find('.search-dropdown-error').text(msg);
    }

    this.showDialog = function () {
        if (mindmaps.Config.allowMultipleUrls) {
            $dialog.append($multiUrlDisplay);
        }

        if (!mindmaps.Config.activateDirectUrlInput) {
            $directInputDiv.css({
                "display": "none"
            });
        }

        if (!mindmaps.Config.activateUrlsFromServerWithoutSearch) {
            $dropdownInputDiv.css({
                "display": "none"
            });
        }

        if (!mindmaps.Config.activateUrlsFromServerWithSearch) {
            $searchDropdownInputDiv.css({
                "display": "none"
            });
        }


        $dialog.dialog("open");
    };
};

/**
 * Creates a new EditURLsPresenter. The presenter can edit the URLs attached to
 * a node in various ways.
 *
 * @constructor
 * @param {mindmaps.EventBus} eventBus
 * @param {mindmaps.MindMapModel} mindmapModel
 * @param {mindmaps.EditURLsView} view
 */
mindmaps.EditURLsPresenter = function (eventBus, mindmapModel, view) {
    view.singleUrlChanged = function (url) {
        var action = new mindmaps.action.ChangeURLsAction(
            mindmapModel.selectedNode, url);
        mindmapModel.executeAction(action);
    }

    view.urlAdded = function (url) {
        var action = new mindmaps.action.AddURLsAction(
            mindmapModel.selectedNode, url);
        mindmapModel.executeAction(action);
    }

    view.urlRemoved = function (url) {
        var action = new mindmaps.action.RemoveURLsAction(
            mindmapModel.selectedNode, url);
        mindmapModel.executeAction(action);
    }

    view.searchQuerySubmitted = function (query) {
        var url = mindmaps.Config.urlServerAddress;
        url += "?q=" + query

        $.ajax({
            type: "GET",
            url: url
        }).done(function (json) {
                var urls = JSON.parse(json);
                view.setSearchDropDownUrls(urls, mindmapModel.selectedNode.getPluginData("url", "urls") || []);
            }).fail(function () {
                view.showSearchDropdownError("Error while requesting URLs from server.");
            });
    }

    eventBus.subscribe(mindmaps.Event.NODE_URLS_ADDED, function (node) {
        view.setUrls(mindmapModel.selectedNode.getPluginData("url", "urls") || []);
    });

    eventBus.subscribe(mindmaps.Event.NODE_URLS_REMOVED, function (node) {
        view.setUrls(mindmapModel.selectedNode.getPluginData("url", "urls") || []);
    });

    this.go = function () {
        if (mindmaps.Config.activateUrlsFromServerWithoutSearch) {
            $.ajax({
                type: "GET",
                url: mindmaps.Config.urlServerAddress
            }).done(function (json) {
                    var urls = JSON.parse(json);
                    view.setDropDownUrls(urls, mindmapModel.selectedNode.getPluginData("url", "urls") || []);
                }).fail(function () {
                    view.showDropdownError("Error while requesting URLs from server.");
                });
        }

        view.setUrls(mindmapModel.selectedNode.getPluginData("url", "urls") || [])
        view.showDialog();
    };
};


mindmaps.plugins["url"] = {
    startOrder: 1001,


    onUIInit: function (eventBus, mindmapModel) {


        function doEditURLs() {
            var presenter = new mindmaps.EditURLsPresenter(eventBus,
                mindmapModel, new mindmaps.EditURLsView());
            presenter.go();
        }

        mindmaps.EditURLsCommand = function () {
            this.id = "EDIT_URLS_COMMAND";
            this.label = "Edit URLs...";
            this.shortcut = [];
            this.description = "Open the edit URLs dialog";
        };
        mindmaps.EditURLsCommand.prototype = new mindmaps.Command();


        var editURLsCommand = mindmaps.ui.commandRegistry
            .get(mindmaps.EditURLsCommand);
        editURLsCommand.setHandler(doEditURLs);


        /**
         * Changes the URLs of a node.
         */

        mindmaps.action.ChangeURLsAction = function (node, url) {
            this.execute = function () {
                node.setPluginData("url", "urls", [ url ]);
            };

            this.event = [ mindmaps.Event.NODE_URLS_CHANGED, node ];
        }

        /**
         * Adds a URL to a note.
         */

        mindmaps.action.AddURLsAction = function (node, url) {
            this.execute = function () {
                if (url !== "") {
                    var urls = node.getPluginData("url", "urls") || []

                    urls.push(url);
                    node.setPluginData("url", "urls", urls)
                }
            };

            this.event = [ mindmaps.Event.NODE_URLS_ADDED, node ];
        }

        /**
         * Removes a URL from a note.
         */

        mindmaps.action.RemoveURLsAction = function (node, urlToRemove) {
            this.execute = function () {
                var urls = (node.getPluginData("url", "urls") || []).filter(function (url) {
                    return url !== urlToRemove;
                })
                node.setPluginData("url", "urls", urls)
            };

            this.event = [ mindmaps.Event.NODE_URLS_REMOVED, node ];
        }


        mindmaps.Event.NODE_URLS_CHANGED = "NodeURLsChangedEvent"

        mindmaps.Event.NODE_URLS_ADDED = "NodeURLsAddedEvent"

        mindmaps.Event.NODE_URLS_REMOVED = "NodeURLsRemovedEvent"

        eventBus.subscribe(mindmaps.Event.NODE_URLS_CHANGED, function (node) {
            mindmaps.ui.canvasView.updateNode(node);
        });

        eventBus.subscribe(mindmaps.Event.NODE_URLS_ADDED, function (node) {
            mindmaps.ui.canvasView.updateNode(node);
        });

        eventBus.subscribe(mindmaps.Event.NODE_URLS_REMOVED, function (node) {
            mindmaps.ui.canvasView.updateNode(node);
        });

    },


    onCreateNode: function (node) {
        var $url = $("<div>", {
            id: "node-urlIcon-" + node.id
        })
        var urls = node.getPluginData("url", "urls")
        if (urls && urls.length > 0)
            $url.append($('<i class="icon-link"></i>'))
        mindmaps.util.plugins.ui.addToPluginIcons($url, node)

    },
    onNodeUpdate: function (node) {
        var $url = $("#node-urlIcon-" + node.id)
        $url.empty()
        var urls = node.getPluginData("url", "urls")
        if (urls && urls.length > 0)
            $url.append($('<i class="icon-link"></i>'))
    },

    inspectorAdviser: {
        onInit: function ($inspectorTable) {
            var tr = '  <tr id="inspector-urls-row"> \
                        <td>URLs:</td> \
                        <td> \
                            <button id="inspector-button-urls" title="Open URL dialog" \
                            class="buttons-small buttons-less-padding">Edit URLs \
                            </button> \
                        </td> \
                    </tr>'
            $inspectorTable.append($(tr))
            var $openURLDialogButton = $("#inspector-button-urls", $inspectorTable);
            $openURLDialogButton.button()
            $openURLDialogButton.click(function () {
                var command = mindmaps.ui.commandRegistry.get(mindmaps.EditURLsCommand);
                command.execute();
            });

        },
        setControlsEnabled: function (enabled) {
            var $openURLDialogButton = $("#inspector-button-urls")
            var state = enabled ? "enable" : "disable";
            $openURLDialogButton.button(state);
        }

    }
}
