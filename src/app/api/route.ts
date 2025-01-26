import { NextResponse } from "next/server";

export async function GET() {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>API Endpoints</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    margin: 20px;
                    padding: 0;
                    background-color: #f4f4f9;
                }
                h1 {
                    color: #333;
                }
                p {
                    margin: 10px 0;
                }
                a {
                    color: #0070f3;
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <h1>Click-kar API - healthcheck : Good</h1>
            <p>Our frontend and backend both are built with Next.js.</p>
            <p>This endpoint provides details about the available API endpoints and their functionalities:</p>
            <ul>
                <li><strong>/signin</strong>: Sign in to access the API.</li>
                <li><strong>/signup</strong>: Register as a new user.</li>
                <li><strong>/getTasks</strong>: Get all your tasks.</li>
                <li><strong>/createTaks</strong>: create a new task</li>
                <li><strong>/updateTaks</strong>: update a task</li>
                <li><strong>/deleteTaks</strong>: delete a task</li>
            </ul>
            <p><strong>Note:</strong> You must sign in to access the API functionalities.</p>
            <p>For more information, feel free to explore the codebase on <a href="https://github.com/your-repo" target="_blank">GitHub</a>.</p>
        </body>
        </html>
    `;

    return new NextResponse(htmlContent, {
        headers: { "Content-Type": "text/html" },
    });
}
