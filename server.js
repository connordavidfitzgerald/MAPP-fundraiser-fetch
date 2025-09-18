import express from "express"
// Change this line to import from 'puppeteer-extra'
import puppeteer from "puppeteer-extra"
import StealthPlugin from "puppeteer-extra-plugin-stealth"

const app = express()
const PORT = process.env.PORT || 3000

// Use the stealth plugin before launching the browser
puppeteer.use(StealthPlugin())

app.get("/", async (req, res) => {
    const url = "https://www.zeffy.com/fr-CA/ticketing/campagne-solidaire-fete-de-quartier-numerique-2026-ou-festival-mapp"

    let browser
    try {
        // Launch headless browser using puppeteer-extra
        browser = await puppeteer.launch({
            const args = [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-infobars',
                '--window-position=0,0',
                '--ignore-certifcate-errors',
                '--ignore-certifcate-errors-spki-list',
                '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'
                ],
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        });
        const page = await browser.newPage()

        console.log("➡️ Loading page...")
        await page.goto(url, { waitUntil: "networkidle2" }) // wait for JS to render

        // Wait for the element that contains the amount
        // Replace selector with the correct one after inspecting the page
        const selector = ".css-1bebzxt" // example class; update based on site
        await page.waitForSelector(selector, { timeout: 0 })

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
