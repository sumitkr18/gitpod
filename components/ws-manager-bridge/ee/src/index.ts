/**
 * Copyright (c) 2022 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */

require("reflect-metadata");

import { Container } from "inversify";
import { containerModuleEE } from "./container-module";
import { start } from "../../src/main";
import { containerModule } from "../../src/container-module";
import { dbContainerModule } from "@gitpod/gitpod-db/lib/container-module";

const container = new Container();
container.load(containerModule);
container.load(containerModuleEE);
container.load(dbContainerModule());

start(container);
