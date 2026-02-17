#!/usr/bin/env python3
"""Generate catalog page HTML for all remaining categories"""

# Category data: frame_num, category_name, frame_id, background_image
categories = [
    (16, "NECKLACES", "frame16", "6.jpeg", 4, [
        ("Gold Chain", "gold_chain.png"),
        ("Diamond Tennis", "diamond_tennis.png"),
        ("Rose Gold Heart", "rose_gold_pendant.png"),
        ("Crystal Choker", "crystal_choker.png"),
        ("Diamond Pendant", "diamond_necklace.png"),
        ("Kundan Set", "gold_chain.png"),
        ("Polki Necklace", "diamond_tennis.png"),
        ("Emerald Choker", "crystal_choker.png"),
        ("Ruby Pendant", "rose_gold_pendant.png"),
        ("Pearl Strand", "rose_gold_pendant.png"),
    ]),
    (17, "RINGS", "frame17", "7.jpeg", 5, [
        ("Gold Band", "gold_band.png"),
        ("Rose Gold Stack", "rose_gold_pendant.png"),
        ("Sapphire Royal", "diamond_solitaire.png"),
        ("Platinum Eternity", "diamond_solitaire.png"),
        ("Diamond Solitaire", "diamond_solitaire.png"),
        ("Emerald Ring", "diamond_solitaire.png"),
        ("Ruby Band", "rose_gold_pendant.png"),
        ("Pearl Ring", "rose_gold_pendant.png"),
        ("Antique Ring", "gold_band.png"),
        ("Cocktail Ring", "diamond_solitaire.png"),
    ]),
    (18, "BRACELETS", "frame18", "8.jpeg", 6, [
        ("Royal Bangle", "gold_bangle.png"),
        ("Luxury Charm", "charm_bracelet.png"),
        ("Hammered Cuff", "gold_bangle.png"),
        ("Classic Tennis", "diamond_tennis_bracelet_ar.png"),
        ("Platinum Weave", "diamond_bangle_set.png"),
        ("Pearl Bracelet", "charm_bracelet.png"),
        ("Ruby Bracelet", "diamond_tennis_bracelet_ar.png"),
        ("Emerald Bangle", "gold_bangle.png"),
        ("Link Bracelet", "charm_bracelet.png"),
        ("Chain Bracelet", "diamond_tennis_bracelet_ar.png"),
    ]),
    (19, "BANGLES", "frame19", "9.jpeg", 7, [
        ("Classic Gold Bangle", "gold_bangle.png"),
        ("Diamond Pair", "diamond_bangle_set.png"),
        ("Bridal Chooda", "diamond_bangle_set.png"),
        ("Hammered Cuff", "gold_bangle.png"),
        ("Temple Masterpiece", "gold_bangle.png"),
        ("Kundan Bangles", "diamond_bangle_set.png"),
        ("Polki Set", "diamond_bangle_set.png"),
        ("Meenakari Bangles", "gold_bangle.png"),
        ("Stone Bangles", "diamond_bangle_set.png"),
        ("Designer Set", "gold_bangle.png"),
    ]),
    (20, "CHAINS", "frame20", "10.jpeg", 8, [
        ("Classic Rope Chain", "gold_chain.png"),
        ("Box Chain", "diamond_tennis.png"),
        ("Figaro Chain", "gold_chain.png"),
        ("Snake Chain", "gold_chain.png"),
        ("Wheat Chain", "gold_chain.png"),
        ("Curb Chain", "gold_chain.png"),
        ("Singapore Chain", "gold_chain.png"),
        ("Franco Chain", "diamond_tennis.png"),
        ("Mariner Chain", "gold_chain.png"),
        ("Cable Chain", "gold_chain.png"),
    ]),
    (21, "STATEMENT NECKLACES", "frame21", "11.jpeg", 9, [
        ("Layered Pearl", "gold_chain.png"),
        ("Emerald Collar", "crystal_choker.png"),
        ("Antique Temple", "gold_chain.png"),
        ("Crystal Bib", "crystal_choker.png"),
        ("Kundan Haar", "gold_chain.png"),
        ("Polki Set", "diamond_tennis.png"),
        ("Meenakari Necklace", "gold_chain.png"),
        ("Jadau Set", "diamond_necklace.png"),
        ("Bridal Set", "diamond_tennis.png"),
        ("Royal Collar", "diamond_tennis.png"),
    ]),
]

html_output = ""

for frame_num, cat_name, frame_id, bg_image, back_frame, products in categories:
    html = f'''
    <!-- Frame {frame_num}: All {cat_name.title()} Catalog -->
    <div class="frame" id="{frame_id}" data-frame="{frame_num}">
        <img src="web_assets/{bg_image}" alt="All {cat_name.title()}" class="frame-image">
        
        <div class="product-showcase">
            <div class="showcase-heading">
                <h1>ALL {cat_name}</h1>
                <p>Complete collection - 10 exquisite pieces</p>
            </div>

            <div class="product-grid catalog-grid">
'''
    
    for product_name, product_image in products:
        html += f'''                <div class="grid-item">
                    <button class="btn-like-grid" onclick="toggleLike(this)">❤</button>
                    <div class="grid-image">
                        <img src="web_assets/products/{product_image}" alt="{product_name}">
                    </div>
                    <p>{product_name}</p>
                </div>
'''
    
    html += f'''            </div>

            <button class="btn-see-all" onclick="goToFrame({back_frame})">← Back to {cat_name.title()}</button>
        </div>
    </div>
'''
    
    html_output += html

print(html_output)
