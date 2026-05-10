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
        
        # -> Click the Playground navigation link (element index 65) to open the playground page.
        # link "⚡
Playground"
        elem = page.locator("xpath=/html/body/nav/div/div/div/a[2]").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Select the first cipher (Base64) then enable Multi-Layer. After toggling Multi-Layer, stop and wait for the UI to reflect the added layer controls.
        # button "🔤
Base64
Standard Base64 encoding used a..."
        elem = page.locator("xpath=/html/body/main/div/div[3]/div/div/div[2]/button").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Select the first cipher (Base64) then enable Multi-Layer. After toggling Multi-Layer, stop and wait for the UI to reflect the added layer controls.
        # button "🔗 Multi-Layer
OFF"
        elem = page.locator("xpath=/html/body/main/div/div[3]/div/div/div[3]/button").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Click the '+ Add Layer' button to create a second cipher layer and wait for the new layer controls to appear.
        # button "+ Add Layer"
        elem = page.locator("xpath=/html/body/main/div/div[3]/div[2]/div/div/button").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Enter sample text into the Plain Text textarea (index 509), then click Encode (index 367) and check that the placeholder text 'Encoded output will appear here...' is replaced.
        # placeholder="Type your message here..."
        elem = page.locator("xpath=/html/body/main/div/div[3]/div[2]/div[2]/textarea").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Hello, multi-layer test")
        
        # -> Enter sample text into the Plain Text textarea (index 509), then click Encode (index 367) and check that the placeholder text 'Encoded output will appear here...' is replaced.
        # button "🔒 Encode"
        elem = page.locator("xpath=/html/body/main/div/div[2]/div/button").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        await asyncio.sleep(5)
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    