from pathlib import Path
from playwright.sync_api import sync_playwright
import json
base=Path(__file__).parent
checks=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,channel="msedge")
    try:
        for width,height in [(1366,900),(390,844)]:
            page=browser.new_page(viewport={"width":width,"height":height})
            page.goto((base/"index.html").as_uri(),wait_until="load",timeout=15000)
            result={
                "width":width,
                "correct_title":"É Pra Você" in page.title(),
                "three_original_messages":page.locator("article.message").count()==3,
                "main_heading":"mensagem" in page.locator("h1").inner_text().lower(),
                "css_loaded":page.locator("body").evaluate("(el)=>getComputedStyle(el).fontFamily.includes('Segoe')"),
                "no_horizontal_overflow":page.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth"),
                "no_external_profile_claims":page.locator("a[href*='instagram.com'], a[href*='tiktok.com'], a[href*='youtube.com']").count()==0
            }
            page.screenshot(path=str(base/(("desktop" if width>900 else "mobile")+"_preview.png")),full_page=True)
            checks.append(result)
            page.close()
    finally:browser.close()
state=all(all(v for k,v in c.items() if k!="width") for c in checks)
print(json.dumps({"state":"BRAND_SITE_QA_PASS" if state else "BRAND_SITE_QA_FAIL","checks":checks},ensure_ascii=True))
if not state:raise SystemExit(1)
