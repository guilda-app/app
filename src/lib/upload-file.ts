"use client";

import axios from "axios";

export default async function(file: File) {
    try {
        const data = new FormData();
        data.append('file', file, file.name);

        let response = await axios.post("/api/upload", data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        let { fileName } = response.data;
        console.log(fileName);
        return `/api/upload/${fileName}`;
    } catch (e) {
        console.error(e);
    }
}