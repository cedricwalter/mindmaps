/**
 * @namespace
 */
mindmaps.Config = (function() {
  /**
   * Public API
   * @scope mindmaps.Config
   */
  return {
    // The URL of the storage server used in ServerStorage.
      MindMapAddress: "../mm",
      MindMapListAddress:"../mms",

    // Methods of attaching URLs to a node. Deactive all to disallow attaching
    // URLs to nodes.
    activateDirectUrlInput: true,
      //TODO url from server is cool, think about how to use this.
    activateUrlsFromServerWithoutSearch: false,
    activateUrlsFromServerWithSearch: false,

    // Can multiple URLs be attached to a node?
    allowMultipleUrls: true,

    // Address of the URL server.
    urlServerAddress: "http://localhost:3001/"
  };
})();
