#!/bin/bash
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

cd $(dirname $0)
cd ../source/
7z a -tzip -xr\!.DS_Store simple-sidebar.xpi
mv simple-sidebar.xpi ../bundles/
