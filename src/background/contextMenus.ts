import { notify } from "../common/notify";
import { getMutableStateSingleton } from "./backgroundState";

import { ALL_DOWNLOADABLE_PROTOCOLS, startsWithAnyProtocol } from "../common/apis/protocols";
import { addDownloadTasksAndPoll } from "./actions";


function toUrls({linkUrl, srcUrl, selectionText}:ContextMenusOnClickData) {
  
}

function clickHandler(data: ContextMenusOnClickData): void {
  const state = getMutableStateSingleton();

  if (data.linkUrl) {
    addDownloadTasksAndPoll(
      state.api,
      state.pollRequestManager,
      state.showNonErrorNotifications,
      [data.linkUrl],
    );
  }
  if (data.srcUrl) {
    addDownloadTasksAndPoll(
      state.api,
      state.pollRequestManager,
      state.showNonErrorNotifications,
      [data.srcUrl],
    );
  } 
  if (data.selectionText) {
    let urls = data.selectionText
      .split("\n")
      .map((url) => url.trim())
      // The cheapest of checks. Actual invalid URLs will be caught later.
      .filter((url) => startsWithAnyProtocol(url, ALL_DOWNLOADABLE_PROTOCOLS));

    if (urls.length == 0) {
      notify(
        browser.i18n.getMessage("Failed_to_add_download"),
        browser.i18n.getMessage("Selected_text_is_not_a_valid_URL"),
        "failure",
      );
      return;
    } 
      addDownloadTasksAndPoll(
        state.api,
        state.pollRequestManager,
        state.showNonErrorNotifications,
        urls,
      );
      return;
  } 
  notify(
    browser.i18n.getMessage("Failed_to_add_download"),
    browser.i18n.getMessage("URL_is_empty_or_missing"),
    "failure",
  );
}

export function initializeContextMenus() {
  browser.contextMenus.create({
    enabled: true,
    title: browser.i18n.getMessage("Download_with_DownloadStation"),
    contexts: ["link", "audio", "video", "image", "selection"],
    onclick: clickHandler);
}
