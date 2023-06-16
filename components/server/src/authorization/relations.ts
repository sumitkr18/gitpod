/**
 * Copyright (c) 2023 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */

import { v1 } from "@authzed/authzed-node";
import { RelationshipUpdate_Operation } from "@authzed/authzed-node/dist/src/v1";
import { Organization, Project } from "@gitpod/gitpod-protocol";

export const OBJECT_TYPE_PROJECT = "project";
export const OBJECT_TYPE_ORGANIZATION = "ogranization";

export function ref_project(project: Project): v1.ObjectReference {
    return v1.ObjectReference.create({
        objectType: OBJECT_TYPE_PROJECT,
        objectId: project.id,
    });
}

export function ref_org(org: Organization | string): v1.ObjectReference {
    let orgId;
    if (typeof org === "string") {
        orgId = org;
    } else {
        orgId = org.id;
    }
    return v1.ObjectReference.create({
        objectType: OBJECT_TYPE_ORGANIZATION,
        objectId: orgId,
    });
}

export function relation(subject: v1.ObjectReference, relation: string, object: v1.ObjectReference) {
    return v1.Relationship.create({
        subject: { object: subject },
        relation,
        resource: object,
    });
}

export function relationshipUpdates(...relations: v1.Relationship[]): v1.WriteRelationshipsRequest {
    return v1.WriteRelationshipsRequest.create({
        updates: relations.map((r) => ({ relationship: r, operation: RelationshipUpdate_Operation.CREATE })),
        optionalPreconditions: [],
    });
}
