// ==LICENSE-BEGIN==
// Copyright 2017 European Digital Reading Lab. All rights reserved.
// Licensed to the Readium Foundation under one or more contributor license agreements.
// Use of this source code is governed by a BSD-style license
// that can be found in the LICENSE file exposed on Github (readium) in the project repository.
// ==LICENSE-END==

import {
    IPropertyConverter,
    JSON as TAJSON,
    JsonValue,
} from "ta-json";

import { Contributor } from "./metadata-contributor";

export class JsonContributorConverter implements IPropertyConverter {
    public serialize(property: Contributor): JsonValue {
        // console.log("JsonContributorConverter.serialize()");

        return TAJSON.serialize(property);
    }

    public deserialize(value: JsonValue): Contributor {
        // console.log("JsonContributorConverter.deserialize()");

        // if (value instanceof Array) {
        //     return value.map((v) => {
        //         return this.deserialize(v);
        //     }) as Contributor[];
        // } else
        if (typeof value === "string") {
            const c = new Contributor();
            c.Name = value as string;
            return c;
        } else {
            return TAJSON.deserialize<Contributor>(value, Contributor);
        }
    }

    public collapseArrayWithSingleItem(): boolean {
        return true;
    }
}
