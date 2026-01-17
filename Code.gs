
function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Golden Shoto Karate Academy | Student Portal')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Inclusion helper if you decide to split files later
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
