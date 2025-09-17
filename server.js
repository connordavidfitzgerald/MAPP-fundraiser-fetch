import express from "express"
import puppeteer from "puppeteer"

const app = express()
const PORT = process.env.PORT || 3000

app.get("/", async (req, res) => {
    const url = "https://www.zeffy.com/fr-CA/ticketing/campagne-solidaire-fete-de-quartier-numerique-2026-ou-festival-mapp"

    let browser
    try {
        // Launch headless browser
        browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
});
        const page = await browser.newPage()

        console.log("➡️ Loading page...")
        await page.goto(url, { waitUntil: "networkidle2" }) // wait for JS to render

        // Wait for the element that contains the amount
        // Replace selector with the correct one after inspecting the page
        const selector = ".css-1bebzxt" // example class; update based on site
        await page.waitForSelector(selector, { timeout: 5000 })

        // Extract text content
        const amountText = await page.$eval(selector, el => el.textContent)
        console.log("💰 Raw amount text:", amountText)

        // Extract numeric value
        const match = amountText.match(/([\d\s]+)/)
        let amount = null
        if (match) {
            amount = parseInt(match[1].replace(/\s/g, ""), 10)
        }

        res.json({ amount })
    } catch (err) {
        console.error("❌ Error scraping page:", err)
        res.status(500).json({ error: "Failed to scrape fundraiser value" })
    } finally {
        if (browser) await browser.close()
    }
})

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`)
})
