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
        
        # -> Open the Learn page by clicking the 'Learn' link in the site navigation.
        # link "📚
Learn"
        elem = page.locator("xpath=/html/body/nav/div/div/div/a[5]").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Open the Caesar Cipher lesson by clicking the lesson heading (interactive element index 393).
        # "Caesar Cipher"
        elem = page.locator("xpath=/html/body/main/div/div[3]/div[4]/h3").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Open the Caesar lesson by clicking the Caesar heading (index 393) and wait for the lesson page or quiz controls to appear.
        # "Caesar Cipher"
        elem = page.locator("xpath=/html/body/main/div/div[3]/div[4]/h3").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Click the '📖 Lessons' button (element index 367) to ensure the lessons panel is active, then wait for the page to update and re-evaluate available lesson controls.
        # button "📖 Lessons"
        elem = page.locator("xpath=/html/body/main/div/div[2]/div/button").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Click the Caesar lesson card container (div index 392) to open the lesson, then wait for the lesson content or quiz controls to appear.
        # "🏛️"
        elem = page.locator("xpath=/html/body/main/div/div[3]/div[4]/div").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Click the Caesar lesson card container (element index 392) to open the lesson and wait for lesson content or quiz controls to appear.
        # "🏛️"
        elem = page.locator("xpath=/html/body/main/div/div[3]/div[4]/div").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Try a different element inside the Caesar lesson card (click the span at index 396) to open the lesson and wait for the UI to update.
        # "Classic"
        elem = page.locator("xpath=/html/body/main/div/div[3]/div[4]/div[2]/span").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Try opening a different lesson (Base64) by clicking its heading (index 372) and wait for the lesson content or quiz controls to appear.
        # "Base64 Encoding"
        elem = page.locator("xpath=/html/body/main/div/div[3]/div/h3").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Attempt to open a lesson using a different lesson heading (Base64) by clicking its h3 again, then wait for the page to update and check for lesson content or quiz controls.
        # "Base64 Encoding"
        elem = page.locator("xpath=/html/body/main/div/div[3]/div/h3").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Final action — this is where the agent failed
        # Error observed by agent: Navigation failed - site unavailable: http://localhost:3000/learn/caesar
        await page.goto("http://localhost:3000/learn/caesar")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # --> Test blocked (AST guard fallback)
        raise AssertionError("Test blocked during agent run: " + "TEST BLOCKED The lesson page could not be reached \u2014 the local development server returned an empty response and prevented the test from continuing. Observations: - Navigating to http://localhost:3000/learn/caesar displayed a browser error page: \"This page isn\u2019t working\" with the message 'localhost didn\u2019t send any data.' - The browser error code shown was: ERR_EMPTY_RESPONSE")
        await asyncio.sleep(5)
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    