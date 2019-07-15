// ==LICENSE-BEGIN==
// Copyright 2017 European Digital Reading Lab. All rights reserved.
// Licensed to the Readium Foundation under one or more contributor license agreements.
// Use of this source code is governed by a BSD-style license
// that can be found in the LICENSE file exposed on Github (readium) in the project repository.
// ==LICENSE-END==

import * as path from "path";

import { Publication } from "@models/publication";
import { PublicationParsePromise } from "@parser/publication-parser";
import { setLcpNativePluginPath } from "@r2-lcp-js/parser/epub/lcp";

import { JSON as TAJSON } from "ta-json";

import {
    initGlobalConverters_GENERIC,
    initGlobalConverters_SHARED,
} from "../init-globals";

initGlobalConverters_SHARED();
initGlobalConverters_GENERIC();

setLcpNativePluginPath(path.join(process.cwd(), "LCP", "lcp.node"));

export async function parseFilePath(filePath: string): Promise<Publication> {
    return await PublicationParsePromise(filePath);
}

export function serializePublication(publication: Publication) {
    return TAJSON.serialize(publication);
}
