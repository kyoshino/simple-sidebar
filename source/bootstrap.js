/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

const Cc = Components.classes,
      Ci = Components.interfaces,
      Cu = Components.utils;

// Load JavaScript code modules
Cu.import('resource://gre/modules/Services.jsm');
Cu.import('resource://gre/modules/NetUtil.jsm');

/**
 * Core
 */

// This variable should be modified in a derivative work
let basename = 'simple-sidebar',
    baseuri;

function init (window) {
  if (!window) {
    return;
  }

  load_locales(window);
}

function init_delay (window) {
  // Add all the corresponding elements to the current browser window
  add_elements(window);
}

function add_elements (window) {
  let doc = window.document,
      keyset = doc.getElementById('mainKeyset'),
      bcset = doc.getElementById('mainBroadcasterSet'),
      menupopup = doc.getElementById('viewSidebarMenu'),
      prefix = basename + '-';

  // key
  if (keyset) {
    let key = doc.createElement('key');
    key.setAttribute('id', prefix + 'key');
    key.setAttribute('command', prefix + 'broadcaster');
    key.setAttribute('key', str['shortcut-key']);
    key.setAttribute('modifiers', str['shortcut-modifiers']);
    keyset.appendChild(key);
    // Sometimes the keyboard shortcut doesn't work.
    // Reload the keyset to activate the key. (A workaround from Bug 832984)
    keyset.parentElement.appendChild(keyset);
  }

  // broadcaster
  if (bcset) {
    let bc = doc.createElement('broadcaster');
    bc.setAttribute('id', prefix + 'broadcaster');
    bc.setAttribute('label', str['menu-label']);
    bc.setAttribute('autoCheck', 'false');
    bc.setAttribute('type', 'checkbox');
    bc.setAttribute('group', 'sidebar');
    bc.setAttribute('sidebarurl', str['sidebar-url']);
    bc.setAttribute('sidebartitle', str['sidebar-title']);
    bc.setAttribute('accesskey', str['menu-accesskey']);
    bc.setAttribute('oncommand', 'toggleSidebar("' + prefix + 'broadcaster")');
    bcset.appendChild(bc);
  }

  // menuitem
  if (menupopup) {
    let mi = doc.createElement('menuitem');
    mi.setAttribute('id', prefix + 'menuitem');
    mi.setAttribute('key', prefix + 'key');
    mi.setAttribute('observes', prefix + 'broadcaster');
    menupopup.appendChild(mi);
  }
}

function uninit (window) {
  if (!window) {
    return;
  }

  // Remove all the corresponding elements from the current browser window
  remove_elements(window);
}

function remove_elements (window) {
  let elements = window.document.querySelectorAll('[id^="' + basename + '"]');
  for (let element of elements) {
    element.parentElement.removeChild(element);
  }
}

/**
 * L10N Support
 */

let str;

function load_locales (window) {
  // Load the l10n resource asynchronously
  NetUtil.asyncFetch(baseuri.spec + 'locales.json', function (stream, status) {
    if (!Components.isSuccessCode(status)) {
      return;
    }

    let data,
        locale;

    try {
      // Parse the content as JSON
      data = Cc['@mozilla.org/dom/json;1'].createInstance(Ci.nsIJSON)
              .decodeFromStream(stream, stream.available());
    } catch (ex) {}

    if (!data) {
      return;
    }

    try {
      // Check the browser locale
      locale = Services.prefs.getCharPref('general.useragent.locale');
    } catch (ex) {}

    // Find the localized strings based on the locale
    if (locale && data[locale]) {
      str = data[locale];
    } else if (locale.match(/^([a-z]+)\-/) && data[RegExp.$1]) {
      // Try to find the fr strings if the brower locale is fr-FR.
      // The same to ja-JP-mac, which should match ja.
      str = data[RegExp.$1];
    } else if (data['en-US']) {
      // Then fallback to en-US
      str = data['en-US'];
    } else {
      return;
    }

    // Now we can add something to the browser window
    init_delay(window);
  });
}

/**
 * Bootstrap
 */

let win_listener = {
  onOpenWindow: function (window) {
    // Wait for the window to finish loading
    window = window.QueryInterface(Ci.nsIInterfaceRequestor)
              .getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
    window.addEventListener('load', function listener () {
      window.removeEventListener('load', listener, false);
      init(window);
    });
  },
  onCloseWindow: function (window) {},
  onWindowTitleChange: function (window, title) {}
};

function startup (data, reason) {
  baseuri = data.resourceURI;

  let wm = Services.wm,
      enumerator = wm.getEnumerator('navigator:browser');

  // Load into any existing windows
  while (enumerator.hasMoreElements()) {
    init(enumerator.getNext().QueryInterface(Ci.nsIDOMWindow));
  }

  // Load into any new windows
  wm.addListener(win_listener);
}

function shutdown (data, reason) {
  if (reason === APP_SHUTDOWN) {
    return;
  }

  let wm = Services.wm,
      enumerator = wm.getEnumerator('navigator:browser');

  wm.removeListener(win_listener);

  while (enumerator.hasMoreElements()) {
    uninit(enumerator.getNext().QueryInterface(Ci.nsIDOMWindow));
  }
}

function install (data, reason) {}

function uninstall (data, reason) {}
