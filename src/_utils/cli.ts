// ==LICENSE-BEGIN==
// Copyright 2017 European Digital Reading Lab. All rights reserved.
// Licensed to the Readium Foundation under one or more contributor license agreements.
// Use of this source code is governed by a BSD-style license
// that can be found in the LICENSE file exposed on Github (readium) in the project repository.
// ==LICENSE-END==

import * as fs from "fs";
import * as path from "path";
import * as util from "util";

import { Publication } from "@models/publication";
import { PublicationParsePromise } from "@parser/publication-parser";
import { setLcpNativePluginPath } from "@r2-lcp-js/parser/epub/lcp";

import {
    initGlobalConverters_GENERIC,
    initGlobalConverters_SHARED,
} from "../init-globals";

// import { initGlobalConverters_OPDS } from "@opds/init-globals";

// initGlobalConverters_OPDS();
initGlobalConverters_SHARED();
initGlobalConverters_GENERIC();

setLcpNativePluginPath(path.join(process.cwd(), "LCP", "lcp.node"));

console.log("process.cwd():");
console.log(process.cwd());

console.log("__dirname: ");
console.log(__dirname);

const args = process.argv.slice(2);
console.log("args:");
console.log(args);

if (!args[0]) {
    console.log("FILEPATH ARGUMENT IS MISSING.");
    process.exit(1);
}
const argPath = args[0].trim();
let filePath = argPath;
console.log(filePath);
if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, argPath);
    console.log(filePath);
    if (!fs.existsSync(filePath)) {
        filePath = path.join(process.cwd(), argPath);
        console.log(filePath);
        if (!fs.existsSync(filePath)) {
            console.log("FILEPATH DOES NOT EXIST.");
            process.exit(1);
        }
    }
}

const stats = fs.lstatSync(filePath);
if (!stats.isFile() && !stats.isDirectory()) {
    console.log("FILEPATH MUST BE FILE OR DIRECTORY.");
    process.exit(1);
}

const fileName = path.basename(filePath);
const ext = path.extname(fileName).toLowerCase();

// tslint:disable-next-line:no-floating-promises
(async () => {

    let publication: Publication;
    try {
        publication = await PublicationParsePromise(filePath);
    } catch (err) {
        console.log("== Publication Parser: reject");
        console.log(err);
        return;
    }
    console.log("== Publication Parser: resolve: " + publication.Links);

    const isEPUB = /\.epub[3]?$/.test(ext) || fs.existsSync(path.join(filePath, "META-INF", "container.xml"));
    if (isEPUB) {
        dumpPublication(publication);
    } else if (ext === ".cbz") {
        dumpPublication(publication);
    }
})();

export function dumpPublication(publication: Publication) {

    console.log("#### RAW OBJECT:");

    // breakLength: 100  maxArrayLength: undefined
    console.log(util.inspect(publication,
        { showHidden: false, depth: 1000, colors: true, customInspect: true }));

    // console.log("#### RAW JSON:");
    // const publicationJsonObj = JSON.serialize(publication);
    // console.log(publicationJsonObj);

    // console.log("#### PRETTY JSON:");
    // const publicationJsonStr = global.JSON.stringify(publicationJsonObj, null, "  ");
    // console.log(publicationJsonStr);

    // console.log("#### CANONICAL JSON:");
    // const publicationJsonStrCanonical = JSON.stringify(sortObject(publicationJsonObj));
    // console.log(publicationJsonStrCanonical);
}
