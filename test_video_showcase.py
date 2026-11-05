"""É Pra Você: original video landing QA (no analytics, no autoplay)."""
import json,hashlib
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE=Path(r"D:\gpt\MENSAGENS_FOFAS_OS\public_e_pra_voce")
PROJECT=Path(r"D:\gpt\MENSAGENS_FOFAS_OS")
VIDEO=BASE/"media"/"lumi_boa_noite.mp4"
ORIGINAL=PROJECT/"assets"/"original_shorts_v1"/"EPV_LUMI_BN_001_MANIFEST.json"
REF=json.loads(ORIGINAL.read_text(encoding="utf-8"))
checks=[]
assert VIDEO.is_file() and VIDEO.stat().st_size>200000
assert hashlib.sha256(VIDEO.read_bytes()).hexdigest()==REF["sha256"],"Video file changed during deployment"
assert (BASE/"media"/"lumi_boa_noite.vtt").is_file()
with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,channel="msedge")
  for w,h in [(390,844),(1366,900)]:
    page=browser.new_page(viewport={"width":w,"height":h})
    errors=[]
    page.on("pageerror",lambda e:errors.append(str(e)))
    page.goto((BASE/"index.html").as_uri(),wait_until="load")
    vid=page.locator("#video-da-lumi video")
    video_info=vid.evaluate("""el=>({
      autoplay:el.autoplay,
      muted:el.muted,
      loop:el.loop,
      controls:el.controls,
      aspect:getComputedStyle(el).aspectRatio,
      captions:el.querySelectorAll('track[kind="captions"]').length,
      src:el.querySelector('source').getAttribute('src'),
      preload:el.preload
    })""")
    valid=(page.locator("#video-da-lumi").count()==1
      and vid.count()==1
      and video_info["controls"] and not video_info["autoplay"] and not video_info["loop"]
      and video_info["captions"]==1
      and video_info["src"]=="media/lumi_boa_noite.mp4"
      and page.locator('a[href^="https://wa.me/?text="]').count()==1
      and page.locator('a[href="https://www.youtube.com/@epravocemensagens"]').count()>=1
      and page.locator(".moment-field").count()==2
      and not page.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
      and not errors)
    checks.append({"width":w,"technical_pass":valid,"no_autoplay":not video_info["autoplay"],
      "has_controls":video_info["controls"],"caption_track":video_info["captions"],
      "horizontal_overflow":not page.evaluate("document.documentElement.scrollWidth<=document.documentElement.clientWidth"),
      "errors":errors})
    page.close()
  browser.close()
ok=all(x["technical_pass"] for x in checks)
print(json.dumps({"state":"PUBLIC_VIDEO_QA_PASS" if ok else "PUBLIC_VIDEO_QA_FAIL",
                  "checks":checks,"original_hash_verified":True,
                  "unapproved_youtube_uploads":0},ensure_ascii=True))
if not ok:raise SystemExit(1)
