module.exports = {

"[project]/.next-internal/server/app/api/scrape/route/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/src/app/api/scrape/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
const GOOGLE_SHEET_URL = ("TURBOPACK compile-time value", "https://script.google.com/macros/s/AKfycbw7kjTDedMz5PDRzG_O6Wwd3npqLpy0z4oxK8I7bQRZbsAv_0oOHpK-CgZU1Ukhhw67rA/exec") || '';
async function GET(request) {
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
    }
    try {
        console.log('Fetching fresh job data from Google Sheet...');
        const response = await fetch(GOOGLE_SHEET_URL, {
            next: {
                revalidate: 300
            } // Re-fetch every 5 minutes
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch from Google Sheet: ${response.statusText}`);
        }
        const result = await response.json();
        // The Apps Script returns { data: [...] }, so we access result.data
        const jobData = result.data;
        if (!Array.isArray(jobData)) {
            throw new Error("Fetched data is not in the expected format. Expected an object with a 'data' array.");
        }
        // The first row is headers, remove it before mapping
        const jobRows = jobData.slice(1);
        const jobs = jobRows.map((item, index)=>{
            const postedDate = item['Posted Date'] ? new Date(item['Posted Date']) : new Date();
            return {
                id: `${item['Apply URL'] || 'job'}-${index}`,
                title: item['Title'] || 'N/A',
                company: item['Company'] || 'N/A',
                location: item['Location'] || 'N/A',
                experience: item['Experience'] || 'N/A',
                salary: item['Salary'] || 'Not Disclosed',
                companyUrl: item['Company URL'] || '#',
                applyLink: item['Apply URL'] || '#',
                date: postedDate.toLocaleDateString(),
                description: item['description'] || '',
                experienceLevel: 'N/A',
                contractType: item['Contract Type'] || 'N/A',
                workType: item['Work Type'] || 'N/A'
            };
        });
        console.log(`Successfully fetched ${jobs.length} jobs.`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(jobs);
    } catch (error) {
        console.error('Google Sheet API Error:', error);
        // Return empty array on error to prevent crashing the frontend
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json([], {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__315a1c6f._.js.map