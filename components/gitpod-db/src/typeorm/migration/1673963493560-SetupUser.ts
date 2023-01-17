/**
 * Copyright (c) 2023 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */

import { MigrationInterface, QueryRunner } from "typeorm";
import { BUILTIN_INSTLLATION_SETUP_USER_ID } from "../../user-db";

export class SetupUser1673963493560 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT IGNORE INTO d_b_user (id, creationDate, avatarUrl, name, fullName) VALUES ('${BUILTIN_INSTLLATION_SETUP_USER_ID}', '${new Date().toISOString()}', '', 'builtin-installation-setup-user', '')`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
