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
        
        # -> Open the Playground page by clicking the 'Playground' link (element index 67).
        # link "⚡
Playground"
        elem = page.locator("xpath=/html/body/nav/div/div/div/a[2]").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Select the Binary cipher by clicking its button (element index 127).
        # button "💻
Binary
Convert text to 1s and 0s — the..."
        elem = page.locator("xpath=/html/body/main/div/div[3]/div/div/div[2]/button[2]").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Ensure Binary cipher is selected by clicking the Binary button and wait for the UI to update to show Binary as the Active Cipher.
        # button "💻
Binary
Convert text to 1s and 0s — the..."
        elem = page.locator("xpath=/html/body/main/div/div[3]/div/div/div[2]/button[2]").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Select the Hexadecimal cipher, insert sample text, click Encode, and verify the encoded output replaces the placeholder text.
        # button "🔢
Hexadecimal
Encode into hex representa..."
        elem = page.locator("xpath=/html/body/main/div/div[3]/div/div/div[2]/button[3]").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Select the Hexadecimal cipher, insert sample text, click Encode, and verify the encoded output replaces the placeholder text.
        # button "📝 Sample Text"
        elem = page.locator("xpath=/html/body/main/div/div[3]/div[3]/div[4]/div/button[2]").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Click the Hexadecimal cipher button (index 137) and wait for the UI to update so that Active Cipher shows Hexadecimal.
        # button "🔢
Hexadecimal
Encode into hex representa..."
        elem = page.locator("xpath=/html/body/main/div/div[3]/div/div/div[2]/button[3]").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Click the Hexadecimal cipher button (index 137) to select it, then verify the UI updates so 'Active Cipher' shows Hexadecimal.
        # button "🔢
Hexadecimal
Encode into hex representa..."
        elem = page.locator("xpath=/html/body/main/div/div[3]/div/div/div[2]/button[3]").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Use a different approach to select a cipher: click the '🎲 Random Cipher' Quick Action to let the app pick an algorithm, then verify the Active Cipher updates before proceeding to fill sample text.
        # button "🎲 Random Cipher"
        elem = page.locator("xpath=/html/body/main/div/div[3]/div[3]/div[4]/div/button[3]").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Click '📝 Sample Text' (index 372) to populate the Plain Text area, then click '🔒 Encode' (index 96) to run the encoding, and check whether the Encoded Output area content changed from the placeholder text.
        # button "📝 Sample Text"
        elem = page.locator("xpath=/html/body/main/div/div[3]/div[3]/div[4]/div/button[2]").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Click '📝 Sample Text' (index 372) to populate the Plain Text area, then click '🔒 Encode' (index 96) to run the encoding, and check whether the Encoded Output area content changed from the placeholder text.
        # button "🔒 Encode"
        elem = page.locator("xpath=/html/body/main/div/div[2]/div/button").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Manually enter sample text into the Plain Text textarea and click the Encode button to see if the Encoded Output updates.
        # placeholder="Type your message here..."
        elem = page.locator("xpath=/html/body/main/div/div[3]/div[2]/div/textarea").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Hello World")
        
        # -> Manually enter sample text into the Plain Text textarea and click the Encode button to see if the Encoded Output updates.
        # button "🔒 Encode"
        elem = page.locator("xpath=/html/body/main/div/div[2]/div/button").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # --> Test failed (AST guard fallback)
        raise AssertionError("Test failed during agent run: " + "TEST FAILURE Selecting a cipher and encoding text did not work as expected \u2014 the active algorithm did not change and no encoded output was produced. Observations: - The Active Cipher display remained 'Base64' after multiple attempts to select Binary, Hexadecimal, and Random Cipher. - Clicking '\ud83d\udd12 Encode' left the Encoded Output area showing the placeholder 'Encoded output will appear here...'. -...")
        await asyncio.sleep(5)
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    