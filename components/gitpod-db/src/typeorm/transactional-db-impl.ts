/**
 * Copyright (c) 2023 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */

import { EntityManager } from "typeorm";
import { TypeORM } from "./typeorm";
import { inject, interfaces } from "inversify";

export interface TransactionalDB<DB> {
    transaction<R>(code: (db: DB, dbFactory: DBFactory) => Promise<R>): Promise<R>;
    createTransactionalDB(transactionalEM: EntityManager): DB;
}

export const TransactionalDBFactory = Symbol("TransactionalDBFactory");
export class TransactionalDBFactoryImpl {
    constructor(protected readonly container: interfaces.Container) {}

    getDB<DB extends TransactionalDB<DB>>(
        serviceIdentifier: interfaces.ServiceIdentifier<DB>,
        transactionalEM: EntityManager,
    ): DB {
        const db = this.container.get(serviceIdentifier);
        return db.createTransactionalDB(transactionalEM);
    }
}
type DBFactory = <DB extends TransactionalDB<DB>>(serviceIdentifier: interfaces.ServiceIdentifier<DB>) => DB;

export abstract class TransactionalDBImpl<DB> implements TransactionalDB<DB> {
    @inject(TypeORM) protected readonly typeorm: TypeORM;
    @inject(TransactionalDBFactory) protected readonly dbFactory: TransactionalDBFactoryImpl;

    constructor(
        protected transactionalEM: EntityManager | undefined, // will be undefined when constructed with inversify, which is inteded
    ) {}

    protected async getEntityManager(): Promise<EntityManager> {
        if (this.transactionalEM) {
            return this.transactionalEM;
        }
        return (await this.typeorm.getConnection()).manager;
    }

    async transaction<R>(code: (db: DB, factory: DBFactory) => Promise<R>): Promise<R> {
        const manager = await this.getEntityManager();
        return await manager.transaction(async (manager) => {
            // Provide clients with an option to get hold of other DBImpls based on this connection/EntityManager
            const factory: DBFactory = <D extends TransactionalDB<D>>(
                serviceIdentifier: interfaces.ServiceIdentifier<D>,
            ) => {
                return this.dbFactory.getDB(serviceIdentifier, manager);
            };
            return await code(this.createTransactionalDB(manager), factory);
        });
    }

    public abstract createTransactionalDB(transactionalEM: EntityManager): DB;
}
