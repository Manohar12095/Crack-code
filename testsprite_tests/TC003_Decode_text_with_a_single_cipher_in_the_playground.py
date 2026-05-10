import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        pw = await async_api.async_playwright().start()
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )
        context = await browser.new_context()
        context.set_default_timeout(15000)
        page = await context.new_page()
        # -> navigate
        await page.goto("http://localhost:3000")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Click the 'Playground' link to open the playground page and load the playground UI.
        # link "⚡
Playground"
        elem = page.locator("xpath=/html/body/nav/div/div/div/a[2]").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Click the 'Decode' mode button to switch the playground into decode mode (element index 98).
        # button "🔓 Decode"
        elem = page.locator("xpath=/html/body/main/div/div[2]/div/button[2]").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Fill the sample Base64 ciphertext into the input, submit the transformation, then verify the decoded output contains 'Hello world'.
        # placeholder="Type your message here..."
        elem = page.locator("xpath=/html/body/main/div/div[3]/div[2]/div/textarea").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("SGVsbG8gd29ybGQ=")
        
        # -> Fill the sample Base64 ciphertext into the input, submit the transformation, then verify the decoded output contains 'Hello world'.
        # button "⇅"
        elem = page.locator("xpath=/html/body/main/div/div[3]/div[2]/div[2]/button").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Click the playground 'Run/Submit' button to perform the decode, wait for the UI to update, then search the page for the expected decoded text 'Hello world'.
        # button "⇅"
        elem = page.locator("xpath=/html/body/main/div/div[3]/div[2]/div[2]/button").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Click the Run/Submit button, wait for the UI to update, then search the page for the decoded text 'Hello world'.
        # button "⇅"
        elem = page.locator("xpath=/html/body/main/div/div[3]/div[2]/div[2]/button").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # --> Test failed (AST guard fallback)
        raise AssertionError("Test failed during agent run: " + "TEST FAILURE Decoding did not produce the expected output \u2014 the decoded text 'Hello world' was not displayed in the playground output area. Observations: - The input textarea contains 'SGVsbG8gd29ybGQ=' (Base64) and Decode mode is active. - The Active Cipher is shown as Base64. - The encoded output area still shows the placeholder text 'Encoded output will appear here...' after multiple run att...")
        await asyncio.sleep(5)
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    