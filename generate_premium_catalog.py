#!/usr/bin/env python3
"""Generate premium catalog page HTML for Frames 16-21"""

# Category data: frame_num, category_name, back_frame, products with prices
categories = [
    (16, "NECKLACES", 4, [
        ("Gold Chain", "gold_chain.png", "₹35,000"),
        ("Diamond Tennis", "diamond_tennis.png", "₹85,000"),
        ("Rose Gold Heart", "rose_gold_pendant.png", "₹42,000"),
        ("Crystal Choker", "crystal_choker.png", "₹38,000"),
        ("Diamond Pendant", "diamond_necklace.png", "₹95,000"),
        ("Kundan Set", "gold_chain.png", "₹68,000"),
        ("Polki Necklace", "diamond_tennis.png", "₹125,000"),
        ("Emerald Choker", "crystal_choker.png", "₹78,000"),
        ("Ruby Pendant", "rose_gold_pendant.png", "₹88,000"),
        ("Pearl Strand", "rose_gold_pendant.png", "₹45,000"),
    ]),
    (17, "RINGS", 5, [
        ("Gold Band", "gold_band.png", "₹25,000"),
        ("Rose Gold Stack", "rose_gold_pendant.png", "₹32,000"),
        ("Sapphire Royal", "diamond_solitaire.png", "₹125,000"),
        ("Platinum Eternity", "diamond_solitaire.png", "₹145,000"),
        ("Diamond Solitaire", "diamond_solitaire.png", "₹185,000"),
        ("Emerald Ring", "diamond_solitaire.png", "₹95,000"),
        ("Ruby Band", "rose_gold_pendant.png", "₹78,000"),
        ("Pearl Ring", "rose_gold_pendant.png", "₹35,000"),
        ("Antique Ring", "gold_band.png", "₹48,000"),
        ("Cocktail Ring", "diamond_solitaire.png", "₹165,000"),
    ]),
    (18, "BRACELETS", 6, [
        ("Royal Bangle", "gold_bangle.png", "₹45,000"),
        ("Luxury Charm", "charm_bracelet.png", "₹38,000"),
        ("Hammered Cuff", "gold_bangle.png", "₹42,000"),
        ("Classic Tennis", "diamond_tennis_bracelet_ar.png", "₹125,000"),
        ("Platinum Weave", "diamond_bangle_set.png", "₹165,000"),
        ("Pearl Bracelet", "charm_bracelet.png", "₹35,000"),
        ("Ruby Bracelet", "diamond_tennis_bracelet_ar.png", "₹95,000"),
        ("Emerald Bangle", "gold_bangle.png", "₹78,000"),
        ("Link Bracelet", "charm_bracelet.png", "₹32,000"),
        ("Chain Bracelet", "diamond_tennis_bracelet_ar.png", "₹88,000"),
    ]),
    (19, "BANGLES", 7, [
        ("Classic Gold Bangle", "gold_bangle.png", "₹35,000"),
        ("Diamond Pair", "diamond_bangle_set.png", "₹125,000"),
        ("Bridal Chooda", "diamond_bangle_set.png", "₹185,000"),
        ("Hammered Cuff", "gold_bangle.png", "₹42,000"),
        ("Temple Masterpiece", "gold_bangle.png", "₹68,000"),
        ("Kundan Bangles", "diamond_bangle_set.png", "₹95,000"),
        ("Polki Set", "diamond_bangle_set.png", "₹145,000"),
        ("Meenakari Bangles", "gold_bangle.png", "₹78,000"),
        ("Stone Bangles", "diamond_bangle_set.png", "₹88,000"),
        ("Designer Set", "gold_bangle.png", "₹52,000"),
    ]),
    (20, "CHAINS", 8, [
        ("Classic Rope Chain", "gold_chain.png", "₹28,000"),
        ("Box Chain", "diamond_tennis.png", "₹32,000"),
        ("Figaro Chain", "gold_chain.png", "₹25,000"),
        ("Snake Chain", "gold_chain.png", "₹30,000"),
        ("Wheat Chain", "gold_chain.png", "₹35,000"),
        ("Curb Chain", "gold_chain.png", "₹28,000"),
        ("Singapore Chain", "gold_chain.png", "₹32,000"),
        ("Franco Chain", "diamond_tennis.png", "₹38,000"),
        ("Mariner Chain", "gold_chain.png", "₹30,000"),
        ("Cable Chain", "gold_chain.png", "₹25,000"),
    ]),
    (21, "STATEMENT NECKLACES", 9, [
        ("Layered Pearl", "gold_chain.png", "₹65,000"),
        ("Emerald Collar", "crystal_choker.png", "₹125,000"),
        ("Antique Temple", "gold_chain.png", "₹95,000"),
        ("Crystal Bib", "crystal_choker.png", "₹78,000"),
        ("Kundan Haar", "gold_chain.png", "₹145,000"),
        ("Polki Set", "diamond_tennis.png", "₹185,000"),
        ("Meenakari Necklace", "gold_chain.png", "₹105,000"),
        ("Jadau Set", "diamond_necklace.png", "₹225,000"),
        ("Bridal Set", "diamond_tennis.png", "₹285,000"),
        ("Royal Collar", "diamond_tennis.png", "₹195,000"),
    ]),
]

html_output = ""

for frame_num, cat_name, back_frame, products in categories:
    product_id_start = (frame_num - 15) * 10  # Calculate starting product ID
    
    html = f'''    <!-- Frame {frame_num}: All {cat_name.title()} Catalog -->
    <div class="frame catalog-page" id="frame{frame_num}" data-frame="{frame_num}">
        <!-- Gold particles canvas will be injected here by JS -->
        
        <div class="catalog-container">
            <button class="catalog-back-btn" onclick="goToFrame({back_frame})">← Back to {cat_name.title()}</button>
            
            <div class="catalog-header">
                <h1 class="catalog-title">ALL {cat_name}</h1>
                <p class="catalog-subtitle">Complete collection - 10 exquisite pieces</p>
            </div>

            <div class="catalog-product-grid">
'''
    
    for idx, (product_name, product_image, price) in enumerate(products):
        product_id = product_id_start + idx
        html += f'''                <div class="catalog-product-card" onclick="goToProduct({product_id})">
                    <button class="btn-like-catalog" onclick="event.stopPropagation(); toggleLike(this)">❤</button>
                    <div class="catalog-product-image">
                        <img src="web asset/products/{product_image}" alt="{product_name}">
                    </div>
                    <h3>{product_name}</h3>
                    <p class="catalog-product-price">{price}</p>
                </div>
'''
    
    html += f'''            </div>
        </div>
    </div>

'''
    
    html_output += html

print(html_output)
