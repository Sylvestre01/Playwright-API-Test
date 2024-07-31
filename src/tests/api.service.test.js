import { test, expect, } from '@playwright/test';
import fileReader from '../utility/read.config';
import Payloads from "../payload/payload";
import {describe} from "node:test";

let oPayload, createdId, totalPosts

describe('@Automated_API_Test',()=> {
    let filePath = './src/env.json'
    const jsonPayload = new Payloads()

    test('1. Read Total Number of Posts and Store in a Variable', async ({request}) => {
        const response = await request.get("/posts")
        const posts = await response.json();
        totalPosts = posts.length;
        console.log('Total number of posts:' + totalPosts);
    });

    test('2. Create a New Post and Store its ID', async ({request}) => {
        oPayload = jsonPayload.create_post()
        const response = await request.post("/posts", oPayload);
        const createdPost = await response.json();
        createdId = createdPost.id;
        fileReader.writeData(filePath, createdId);
        expect(response.status()).toBe(201);
        console.log('Created post ID:' + createdId);
    });

    test('3. Get Only the Created Post by ID', async ({request}) => {
        createdId = parseInt(fileReader.readData(filePath));
        const response = await request.get(`/posts/${createdId}`)
        const post = await response.json();
        console.log(`Post details: ${JSON.stringify(post)}`);
    });

    test('4. Replace Some Field in the Created Post with PATCH', async ({request}) => {
        oPayload = jsonPayload.update_post()
        createdId = parseInt(fileReader.readData(filePath));
        const response = await request.patch(`/posts/${createdId}`, oPayload)
        const updatedPost = await response.json();
        expect(updatedPost.title).toBe(oPayload.data.title);
        // Verify the update
        const verifyResponse = await request.get(`/posts/${createdId}`);
        const verifiedPost = await verifyResponse.json();
        console.log("updated post: " + verifiedPost.title)
    })

    test('5. delete the Created Post by its ID', async ({request}) => {
        createdId = parseInt(fileReader.readData(filePath));
        const response = await request.delete(`/posts/${createdId}`)
        expect(response.status()).toBe(200);
        // Verify deletion
        const verifyResponse = await request.get(`/posts/${createdId}`);
        expect(verifyResponse.status()).toBe(404);
    })

    test('6. Check the Number of Posts to Ensure Integrity', async ({request}) => {
        const response = await request.get("/posts")
        const posts = await response.json();
        const currentPostCount = posts.length;
        expect(currentPostCount).toBe(totalPosts);
        console.log('Current number of posts:' + currentPostCount);
    })
})