#!/usr/bin/env python3
"""Prepare share previews, accessible UI symbols and SEO metadata for Five Stones.
Preview is the safe default. Only --publish --base https://APPROVED-DOMAIN/ enables indexing.
"""
import argparse, html, json, re, os, pathlib, urllib.parse as url
from PIL import Image, ImageOps, ImageDraw, ImageFont
ROOT=pathlib.Path(__file__).resolve().parents[1]
os.chdir(ROOT)
parser=argparse.ArgumentParser()
parser.add_argument('--base',default='https://atrezzostudiosv-spec.github.io/Five-Stones-Safety/')
parser.add_argument('--publish',action='store_true')
args=parser.parse_args()
BASE=args.base.rstrip('/')+'/'
if args.publish and 'github.io' in BASE: raise SystemExit('Do not index the design preview.')
ASSETS=ROOT/'assets'/'seo'
ASSETS.mkdir(parents=True,exist_ok=True)

# Generate permanent local raster assets from the existing site media, not remote screenshots.
def font(size,bold=False):
    return ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans'+('-Bold' if bold else '')+'.ttf',size)
def contain(src,size):
    return ImageOps.contain(src,size,Image.Resampling.LANCZOS)
ink='#102e30'; gold='#ffc321'; paper='#fffefa'
im=Image.new('RGB',(1200,630),ink)
photo=Image.open(ROOT/'assets/images/classroom-discussion.webp').convert('RGB')
photo=ImageOps.fit(photo,(520,630),Image.Resampling.LANCZOS,centering=(.59,.50))
im.paste(photo,(680,0))
# Feather the image at the editorial divide without darkening the whole photograph.
d=ImageDraw.Draw(im,'RGBA')
for x in range(680,770):
    alpha=round(150*(770-x)/90)
    d.line((x,0,x,630),fill=(16,46,48,alpha))
d.rectangle((0,0,680,7),fill=gold)
d.rounded_rectangle((54,42,340,135),radius=3,fill=paper)
logo=Image.open(ROOT/'assets/images/logo-dark.png').convert('RGBA')
# Remove generous original transparent/near-white margins before fitting.
bg=Image.new('RGBA',logo.size,'white');bg.alpha_composite(logo)
rgb=bg.convert('RGB'); diff=ImageOps.invert(rgb.convert('L')).point(lambda a:255 if a>45 else 0)
bbox=diff.getbbox()
if bbox: rgb=rgb.crop(bbox)
brand=contain(rgb,(250,69))
im.paste(brand,(54+(286-brand.width)//2,42+(93-brand.height)//2))
d=ImageDraw.Draw(im)
d.text((57,176),'COMPREHENSIVE SCHOOL SAFETY',font=font(15,True),fill='#b4d8d0')
d.text((54,225),'One system.',font=font(66,True),fill=paper)
d.text((54,308),'Every',font=font(70,True),fill=gold)
d.text((54,388),'emergency.',font=font(70,True),fill=gold)
d.line((58,505,620,505),fill='#496967',width=1)
d.text((57,533),'CENTEGIX safety platform',font=font(21,True),fill=paper)
d.text((57,566),'Implementation  /  Training  /  Support',font=font(18),fill='#b4d8d0')
im.save(ASSETS/'five-stones-social.jpg',quality=90,optimize=True,progressive=False)
# Use the existing brand favicon artwork rather than an emoji or recreated logo.
icon=Image.open(ROOT/'assets/images/icon-brand.png').convert('RGBA')
def icon_at(n):
    tile=Image.new('RGB',(n,n),paper)
    art=contain(icon,(round(n*.88),round(n*.88)))
    tile.paste(art,((n-art.width)//2,(n-art.height)//2),art)
    return tile
for n in [32,48,180,192,512]:
    name='apple-touch-icon.png' if n==180 else 'icon-'+str(n)+'.png'
    icon_at(n).save(ASSETS/name,optimize=True)
icon_at(48).save(ROOT/'favicon.ico',sizes=[(16,16),(32,32),(48,48)])

def esc(s):return html.escape(str(s),quote=True)
def clean(s):return re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>',' ',s))).strip()
def tag_slug(x):
    x=url.unquote_plus(x).lower().replace("'","-")
    return re.sub(r'[^a-z0-9]+','-',x).strip('-')
ALIASES={'home/index.html':'index.html','texasschools/index.html':'index.html','contact-1/index.html':'contact/index.html','request-demo/index.html':'contactus/index.html','resources-legacy/index.html':'school-safety-security/index.html'}
def canonical_path(p):
    p=ALIASES.get(p,p)
    if p.startswith('school-safety-security/tag/'):
        p='school-safety-security/tag/'+tag_slug(p.split('/')[2])+'/index.html'
    return p
def route(p):return BASE+url.quote(p.removesuffix('index.html'),safe='/')
# All real pages, not sample component HTML.
pages=sorted(p for p in ROOT.rglob('index.html') if not any(x in p.relative_to(ROOT).parts for x in ['components','node_modules','artifacts','.git']))
names={p.relative_to(ROOT).as_posix() for p in pages}
assert len(pages)==77, f'Unexpected route count {len(pages)}'
for p in names: assert canonical_path(p) in names, (p,canonical_path(p))
icons={
'↗':'<path d="M5 19 19 5M7 5h12v12"/>',
'→':'<path d="M4 12h16m-6-6 6 6-6 6"/>',
'←':'<path d="M20 12H4m6-6-6 6 6 6"/>',
'↑':'<path d="M12 20V4m-6 6 6-6 6 6"/>',
'↓':'<path d="M12 4v16m-6-6 6 6 6-6"/>',
'●':'<circle cx="12" cy="12" r="8" fill="currentColor" stroke="none"/>',
'▶':'<path d="m8 5 12 7-12 7Z" fill="currentColor" stroke="none"/>',
'Ⅱ':'<path d="M9 5v14m6-14v14" stroke-width="2.8"/>',
'✓':'<path d="m5 12 5 5L19 7"/>',
'✕':'<path d="m6 6 12 12M18 6 6 18"/>',
'✖':'<path d="m6 6 12 12M18 6 6 18"/>',
'✗':'<path d="m6 6 12 12M18 6 6 18"/>',
'✔':'<path d="m5 12 5 5L19 7"/>',
'➜':'<path d="M4 12h16m-6-6 6 6-6 6"/>',
'★':'<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" fill="currentColor" stroke="none"/>',
}
def svg(symbol,extra=''):
    return '<svg class="fss-ui-icon '+extra+'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+icons[symbol]+'</svg>'
def replace_ui(s):
    # Only visible text, never attributes, script, actual content URLs or imported component source.
    blocks=re.split(r'(<script\b[^>]*>[\s\S]*?</script>|<style\b[^>]*>[\s\S]*?</style>|<!--[\s\S]*?-->|<[^>]+>)',s,flags=re.I)
    for i in range(0,len(blocks),2):
        t=blocks[i]
        for sym in icons:
            t=t.replace(sym,svg(sym))
        # Copyright is a text symbol, not an emoji. Explicit text variation.
        t=t.replace('©','&copy;&#xfe0e;')
        blocks[i]=t
    return ''.join(blocks)
def metadata(s,p):
    depth=len(pathlib.PurePosixPath(p).parts)-1
    rel='../'*depth
    title_m=re.search(r'<title>(.*?)</title>',s,re.S|re.I)
    desc_m=re.search(r'<meta name="description" content="([^"]*)"\s*/?>',s,re.I)
    title=clean(title_m.group(1)) if title_m else 'Five Stones Safety'
    desc=clean(desc_m.group(1)) if desc_m else ''
    if p=='index.html':
        title='School Safety & CENTEGIX CrisisAlert | Five Stones Safety'
        desc='Five Stones Safety helps school districts plan, implement and support the CENTEGIX Safety Platform, from wearable emergency alerts to staff training and ongoing service.'
    elif p in ['contactus/index.html','request-demo/index.html','contact-1/index.html']:
        desc='Explore a demonstration of CENTEGIX CrisisAlert and the Five Stones Safety approach to school safety implementation, training and support.'
    elif p=='techsupport/index.html':
        desc='Find technical support for Five Stones Safety and CENTEGIX school safety systems, including service and troubleshooting assistance.'
    elif p.startswith('school-safety-security/tag/'):
        topic=tag_slug(p.split('/')[2]).replace('-',' ').title()
        if topic=='Spat':topic='SPAT'
        if topic=='Centegix':topic='CENTEGIX'
        if topic=='Alyssa S Law':topic="Alyssa’s Law"
        title=topic+' | School Safety Insights | Five Stones Safety'
        desc='Explore Five Stones Safety articles and insights on '+topic+' for K–12 school districts and safety leaders.'
    if not desc:
        desc='Explore '+title.split('|')[0].strip()+' from Five Stones Safety, supporting school district emergency preparedness.'
    canonical=route(canonical_path(p)); is_alias=p!=canonical_path(p)
    robots='index,follow,max-image-preview:large' if args.publish and not is_alias and '/tag/' not in p and not p.startswith('resources/document/') else 'noindex,follow'
    is_article=p.startswith('school-safety-security/') and '/tag/' not in p and p!='school-safety-security/index.html'
    s=re.sub(r'<!-- FSS-SEO BEGIN -->[\s\S]*?<!-- FSS-SEO END -->','',s)
    s=re.sub(r'<title>[\s\S]*?</title>',f'<title>{esc(title)}</title>',s,count=1,flags=re.I)
    s=re.sub(r'<meta name="description"[^>]*>',f'<meta name="description" content="{esc(desc)}">',s,count=1,flags=re.I)
    s=re.sub(r'<meta name="robots"[^>]*>',f'<meta name="robots" content="{robots}">',s,count=1,flags=re.I)
    s=re.sub(r'<link rel="(?:icon|shortcut icon|apple-touch-icon)"[^>]*>','',s,flags=re.I)
    s=re.sub(r'<link rel="canonical"[^>]*>','',s,flags=re.I)
    image=BASE+'assets/seo/five-stones-social.jpg'
    schema={'@context':'https://schema.org','@graph':[
      {'@type':'Organization','@id':'https://fivestonessafety.com/#organization','name':'Five Stones Safety, LLC','url':'https://fivestonessafety.com/','logo':BASE+'assets/images/logo-dark.png','telephone':'+1-972-567-3643','address':{'@type':'PostalAddress','postOfficeBoxNumber':'665','addressLocality':'Argyle','addressRegion':'TX','postalCode':'76226','addressCountry':'US'}},
      {'@type':'WebSite','@id':BASE+'#website','url':BASE,'name':'Five Stones Safety','publisher':{'@id':'https://fivestonessafety.com/#organization'},'inLanguage':'en-US'},
      {'@type':'WebPage','@id':canonical+'#webpage','url':canonical,'name':title,'description':desc,'isPartOf':{'@id':BASE+'#website'},'inLanguage':'en-US','primaryImageOfPage':{'@type':'ImageObject','url':image,'width':1200,'height':630}}
    ]}
    # Do not invent authors, publication dates, reviews or ratings. Use WebPage schema
    # even for article routes until article metadata is formally verified.
    meta=f'''
<!-- FSS-SEO BEGIN -->
<link rel="canonical" href="{esc(canonical)}">
<link rel="icon" type="image/png" sizes="32x32" href="{rel}assets/seo/icon-32.png">
<link rel="icon" type="image/png" sizes="48x48" href="{rel}assets/seo/icon-48.png">
<link rel="shortcut icon" href="{rel}favicon.ico">
<link rel="apple-touch-icon" sizes="180x180" href="{rel}assets/seo/apple-touch-icon.png">
<meta name="application-name" content="Five Stones Safety">
<meta name="apple-mobile-web-app-title" content="Five Stones Safety">
<meta property="og:locale" content="en_US">
<meta property="og:site_name" content="Five Stones Safety">
<meta property="og:type" content="{'article' if is_article else 'website'}">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{esc(canonical)}">
<meta property="og:image" content="{esc(image)}">
<meta property="og:image:secure_url" content="{esc(image)}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Five Stones Safety — One system. Every emergency. School safety technology, implementation, training and support.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{esc(title)}">
<meta name="twitter:description" content="{esc(desc)}">
<meta name="twitter:image" content="{esc(image)}">
<meta name="twitter:image:alt" content="Five Stones Safety — One system. Every emergency.">
<script type="application/ld+json">{json.dumps(schema,ensure_ascii=True,separators=(',',':')).replace('<','\\u003c')}</script>
<!-- FSS-SEO END -->
'''
    s=s.replace('</head>',meta+'</head>',1)
    return s,title,desc,canonical,robots
report=[]
for page in pages:
    p=page.relative_to(ROOT).as_posix()
    s=page.read_text(encoding='utf8')
    s,title,desc,canonical,robots=metadata(s,p)
    s=replace_ui(s)
    # Existing quote toggle gets both vector icons; JS only switches visibility.
    s=re.sub(r'(<button[^>]*data-quote-toggle[^>]*><span[^>]*>)[\s\S]*?(</span></button>)',lambda m:m.group(1)+svg('Ⅱ','fss-ui-pause')+svg('▶','fss-ui-play')+m.group(2),s)
    page.write_text(s,encoding='utf8')
    report.append({'path':p,'title':title,'description':desc,'canonical':canonical,'robots':robots})
# Update the existing carousel, not the library runtime.
js_path=ROOT/'assets/site.js';js=js_path.read_text()
js=js.replace("toggle.querySelector('span').textContent=paused?'▶':'Ⅱ'","toggle.setAttribute('data-quote-paused',String(paused))")
js_path.write_text(js)
css_path=ROOT/'assets/site.css';css=css_path.read_text()
marker='/* FSS vector UI icons: no platform-dependent emoji glyphs. */'
if marker not in css:
    css+='\n'+marker+'''
.fss-ui-icon{display:inline-block;width:1em;height:1em;min-width:1em;vertical-align:-.12em;flex-shrink:0;overflow:visible;color:inherit}
.header-cta .fss-ui-icon,.btn .fss-ui-icon,.inline-arrow .fss-ui-icon{width:1.12em;height:1.12em}
.footer-mark .fss-ui-icon{width:.25em;height:.25em;vertical-align:.12em}
[data-quote-toggle] .fss-ui-play{display:none}
[data-quote-toggle][data-quote-paused="true"] .fss-ui-play{display:inline-block}
[data-quote-toggle][data-quote-paused="true"] .fss-ui-pause{display:none}
.quote-controls .fss-ui-icon{width:20px;height:20px}
.atz-svc .atz-svc__checks li::before{content:"";display:inline-block;width:.8em;height:.8em;background:currentColor;color:var(--atz-svc-accent);clip-path:polygon(14% 47%,39% 73%,87% 16%,100% 29%,40% 100%,0 60%);flex-shrink:0}
'''
css_path.write_text(css)
# The vendor stylesheet is loaded after site.css in Home; use a scoped higher-specificity rule.
# Keep public robots allowing crawl of noindex/social metadata; no disallow.
(ROOT/'robots.txt').write_text('User-agent: *\nAllow: /\n'+('Sitemap: '+BASE+'sitemap.xml\n' if args.publish else '# Preview: pages carry noindex; no sitemap advertised.\n'))
unique=sorted({x['canonical'] for x in report if x['path']==canonical_path(x['path'])})
index_candidates=[x for x in unique if '/tag/' not in x and '/resources/document/' not in x]
sitemap='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join('  <url><loc>'+esc(x)+'</loc></url>\n' for x in index_candidates)+'</urlset>\n'
(ROOT/'seo').mkdir(exist_ok=True)
(ROOT/'seo'/'sitemap-preview.xml').write_text(sitemap)
if args.publish:(ROOT/'sitemap.xml').write_text(sitemap)
# audit actual internal route/file coverage, including fragments and media references.
from html.parser import HTMLParser
class LinkParser(HTMLParser):
    def __init__(self):super().__init__();self.links=[];self.ids=set();self.h1=0;self.images=[]
    def handle_starttag(self,tag,attrs):
        d=dict(attrs)
        if d.get('id'):self.ids.add(d['id'])
        if tag=='h1':self.h1+=1
        if tag=='img':self.images.append(d)
        for k in ['href','src']:
            if d.get(k) and tag!='script':self.links.append((tag,k,d[k]))
parsed={}
for p in pages:
    q=LinkParser();q.feed(p.read_text());parsed[p.relative_to(ROOT).as_posix()]=q
broken=[];missing_alt=[];headings=[]
for p,q in parsed.items():
    if q.h1!=1:headings.append({'path':p,'h1':q.h1})
    for im in q.images:
        if 'alt' not in im:missing_alt.append({'page':p,'src':im.get('src','')})
    for tag,k,target in q.links:
        u=url.urlsplit(target)
        if u.scheme or u.netloc or target.startswith('//'):continue
        raw=u.path
        if not raw and not u.fragment:continue
        candidates=[]
        if raw:
            for val in [url.unquote(raw),raw]:
                candidate=(ROOT/pathlib.PurePosixPath(p).parent/val).resolve() if not val.startswith('/') else (ROOT/val.lstrip('/')).resolve()
                if candidate.is_dir():candidate=candidate/'index.html'
                candidates.append(candidate)
        else:candidates=[ROOT/p]
        found=next((x for x in candidates if x.is_file()),None)
        if not found:broken.append({'page':p,'target':target,'reason':'missing local path'})
        elif u.fragment and found.suffix=='.html':
            key=found.relative_to(ROOT).as_posix()
            if key in parsed and url.unquote(u.fragment) not in parsed[key].ids:broken.append({'page':p,'target':target,'reason':'missing anchor'})
summary={'mode':'production' if args.publish else 'preview-noindex','pages':len(report),'canonical_urls':len(unique),'aliases':len(report)-len(unique),'production_index_candidates':len(index_candidates),'production_index_policy':'Canonical primary pages and full articles only; tag archives, PDF wrappers and aliases remain noindex until expanded or justified. Preview pages are all noindex.','image':'1200x630 JPEG','favicon_sizes':[16,32,48,180,192,512],'missing_local_links':broken,'missing_alt':missing_alt,'h1_issues':headings,'routes':report}
(ROOT/'seo'/'audit.json').write_text(json.dumps(summary,indent=2,ensure_ascii=False)+'\n')
print(json.dumps({k:v for k,v in summary.items() if k!='routes'},ensure_ascii=False))
assert Image.open(ASSETS/'five-stones-social.jpg').size==(1200,630)
assert Image.open(ASSETS/'apple-touch-icon.png').size==(180,180)
assert all('og:image' in p.read_text() and 'apple-touch-icon' in p.read_text() for p in pages)
