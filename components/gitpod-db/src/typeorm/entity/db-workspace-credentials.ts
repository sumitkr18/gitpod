/**
 * Copyright (c) 2023 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */

import { Entity, Column, PrimaryColumn } from "typeorm";

import { TypeORM } from "../typeorm";

@Entity()
// DBWorkspaceCredentials defines the DB model.
// on DB but not Typeorm: @Index("ind_lastModified", ["_lastModified"])   // DBSync
export class DBWorkspaceCredentials {
    @PrimaryColumn(TypeORM.WORKSPACE_ID_COLUMN_TYPE)
    workspaceId: string;

    @Column("varchar")
    ideCredentials: string;

    @Column()
    deleted?: boolean;
}
