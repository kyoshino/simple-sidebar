# simple-sidebar

A sample bootstrapped extension to add a Web panel sidebar.

## What's this?

The `window.sidebar.addPanel` function has been removed from [Firefox 23](https://developer.mozilla.org/en-US/docs/Site_Compatibility_for_Firefox_23). That means the ability to add a traditional sidebar panel is no longer available from Web content. Web publishers can still provide a sidebar either by the new [Social API](https://developer.mozilla.org/en-US/docs/Social_API) or a standalone [extension](https://developer.mozilla.org/en-US/docs/Extensions).

For the convenience of Web developers, I have made a restartless extension that simply adds a Web panel, like the legacy API. You can utilize this work to create your own sidebar Web panel.

## Fork, Customize, Pack

This is just a sample extension. First, you have to fork the project and modify the code.

* **`bootstrap.js`** contains the logic as you can see. Change the `basename` variable to your own. You don't have to touch the other part of the code.
* **`install.rdf`** contains the meta data. Modify the `id`, `name`, `description`, `version`, `creator`, `homepageURL` and `localized`  properties. You can remove the existing `localized` properties if you don't have any localization. See [Install Manifests](https://developer.mozilla.org/en-US/docs/Install_Manifests) for details.
* **`locales.json`** contains the localized strings as well as the sidebar URL. You can add or remove your own locales.

Once your customization is done, you can pack it. Archive those three files into a single ZIP file using your favorite archiver. Note that archiving the containing `source` directory will not work. Archive three *files*, then rename the ZIP file to an arbitrary name ending with a `xpi` file extension. That's it. Now you can drag and drop the XPI file onto your Firefox browser window to install. Hooray!

## Questions?

Drop a line to [Kohei](https://github.com/kyoshino).

## License

[MPL 2.0](http://www.mozilla.org/MPL/2.0/)

## Resources

* [Creating a Firefox sidebar](https://developer.mozilla.org/en-US/docs/Creating_a_Firefox_sidebar)
* [Creating a Firefox sidebar extension](https://developer.mozilla.org/en-US/docs/Creating_a_Firefox_sidebar_extension)
* [Bootstrapped extensions](https://developer.mozilla.org/en-US/docs/Extensions/Bootstrapped_extensions)
* [Mark Finkle’s Weblog » Bootstrap Jones – Adventures in Restartless Add-ons](http://starkravingfinkle.org/blog/2011/01/bootstrap-jones-adventures-in-restartless-add-ons/)
