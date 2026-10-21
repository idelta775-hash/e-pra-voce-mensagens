"""É Pra Você interactive experience QA: 36 originals, 18 routes, accessible UI.
No external accounts, metrics or money simulated as real.
"""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright
ROOT=Path(r"D:\gpt\MENSAGENS_FOFAS_OS\public_e_pra_voce")
checks=[]
with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,channel="msedge")
  try:
    for w,h in [(1366,900),(390,844)]:
      page=browser.new_page(viewport={"width":w,"height":h})
      errors=[]
      page.on("pageerror",lambda error:errors.append(str(error)))
      page.goto((ROOT/"index.html").as_uri(),wait_until="load",timeout=19000)
      data=page.evaluate("""() => ({
          combinations:window.EPV_MESSAGES.length,
          texts:window.EPV_MESSAGES.flatMap(x=>x.variants).length,
          unique:new Set(window.EPV_MESSAGES.flatMap(x=>x.variants)).size,
          combinationsUnique:new Set(window.EPV_MESSAGES.map(x=>x.moment+'_'+x.feeling)).size,
          externalRequests:performance.getEntriesByType('resource').filter(x=>x.name.startsWith('http')).length
      })""")
      page.select_option("#moment-feeling","saudade")
      page.select_option("#moment-time","noite")
      page.click("#momento-form button[type=submit]")
      first=page.locator("#moment-text").inner_text()
      result_shown=page.locator("#moment-result").is_visible()
      first_unique="noite" in first.lower() or "lembrança" in first.lower() or "saudade" in first.lower()
      page.click("#moment-alternate")
      second=page.locator("#moment-text").inner_text()
      disabled=page.locator("#moment-alternate").is_disabled()
      overflows=page.evaluate("document.documentElement.scrollWidth>document.documentElement.clientWidth")
      ok=(data["combinations"]==18 and data["texts"]==36 and data["unique"]==36
          and data["combinationsUnique"]==18 and result_shown and first_unique
          and first!=second and disabled and not overflows and not errors)
      screenshot=ROOT/("mobile_momento_preview.png" if w==390 else "desktop_momento_preview.png")
      page.locator("#seu-momento").screenshot(path=str(screenshot))
      checks.append({"viewport":w,"messages":data["texts"],"unique":data["unique"],
                    "route_count":data["combinations"],"interaction":ok,
                    "horizontal_overflow":overflows,"errors":errors})
      page.close()
  finally:browser.close()
passed=all(c["interaction"] for c in checks)
print(json.dumps({"status":"EPV_INTERACTION_QA_PASS" if passed else "EPV_INTERACTION_QA_FAIL","checks":checks},ensure_ascii=True))
if not passed:raise SystemExit(1)
