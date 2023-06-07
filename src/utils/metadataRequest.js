import urlMetadata from "url-metadata";
import * as cheerio from "cheerio";

export async function getMetadata(link) {
  try {
    const meta = await urlMetadata(`https://cors-anywhere-api.onrender.com/${link}`, { includeResponseBody: true });
    const $ = cheerio.load(meta.responseBody);
    meta.myTitle = $("title").text();
    const icon = findLargestIcon(
      $('link[rel="icon"], link[rel="shortcut icon"]'),
      $
    );
    meta.myFavIcon = icon;
    delete meta.responseBody;
    return meta;
  } catch (error) {
    return null;
  }
}

function findLargestIcon(text, $) {
  let largestSize = 0;
  let largestFaviconLink = "";

  text.each((index, e) => {
    const size = parseInt($(e).attr("sizes"), 10);
    if (size > largestSize) {
      largestSize = size;
      largestFaviconLink = $(e).attr("href");
    }
  });
  return largestFaviconLink;
}
