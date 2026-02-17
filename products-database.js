// ===== PRODUCT DATABASE =====
// Comprehensive product catalog for all categories

const PRODUCTS = {
    // ===== EARRINGS =====
    'diamond-studs': {
        id: 'diamond-studs',
        name: 'Diamond Studs',
        category: 'Earrings',
        price: 45000,
        description: 'Classic diamond studs featuring brilliant-cut diamonds set in 18K white gold. Perfect for everyday elegance.',
        imageUrl: '/web_assets/products/diamond_studs.png',
        weight: '2.5g',
        purity: '18K Gold',
        images: ['/web_assets/products/diamond_studs.png']
    },
    'pearl-drops': {
        id: 'pearl-drops',
        name: 'Pearl Drops',
        category: 'Earrings',
        price: 28000,
        description: 'Elegant freshwater pearl drop earrings with gold accents. Timeless sophistication.',
        imageUrl: '/web_assets/products/pearl_drops.png',
        weight: '3.2g',
        purity: '22K Gold',
        images: ['/web_assets/products/pearl_drops.png']
    },
    'gold-chandbalis': {
        id: 'gold-chandbalis',
        name: 'Gold Chandbalis',
        category: 'Earrings',
        price: 65000,
        description: 'Traditional South Indian chandbali earrings with intricate temple work and ruby accents.',
        imageUrl: '/web_assets/products/gold_chandbalis.png',
        weight: '8.5g',
        purity: '22K Gold',
        images: ['/web_assets/products/gold_chandbalis.png']
    },
    'temple-jewelry': {
        id: 'temple-jewelry',
        name: 'Temple Jewelry Earrings',
        category: 'Earrings',
        price: 72000,
        description: 'Exquisite temple jewelry earrings featuring goddess motifs and traditional craftsmanship.',
        imageUrl: '/web_assets/products/temple_jewelry.png',
        weight: '12.3g',
        purity: '22K Gold',
        images: ['/web_assets/products/temple_jewelry.png']
    },
    'champagne-gold-hoops': {
        id: 'champagne-gold-hoops',
        name: 'Champagne Gold Hoops',
        category: 'Earrings',
        price: 58000,
        description: 'Elegant 22K gold earrings with intricate filigree work and pearl accents. Handcrafted by master artisans.',
        imageUrl: '/web_assets/products/champagne_gold_hoops.png',
        weight: '7.8g',
        purity: '22K Gold',
        collection: 'Heritage Collection',
        images: ['/web_assets/products/champagne_gold_hoops.png']
    },
    'ruby-drops': {
        id: 'ruby-drops',
        name: 'Ruby Drop Earrings',
        category: 'Earrings',
        price: 82000,
        description: 'Exquisite ruby drop earrings set in 18K gold with diamond accents. Vibrant red gemstones.',
        imageUrl: '/web_assets/products/pearl_drops.png',
        weight: '6.5g',
        purity: '18K Gold',
        images: ['/web_assets/products/pearl_drops.png']
    },
    'emerald-studs': {
        id: 'emerald-studs',
        name: 'Emerald Studs',
        category: 'Earrings',
        price: 95000,
        description: 'Brilliant emerald studs surrounded by diamonds in platinum setting. Luxurious green sparkle.',
        imageUrl: '/web_assets/products/diamond_studs.png',
        weight: '4.8g',
        purity: 'Platinum 950',
        images: ['/web_assets/products/diamond_studs.png']
    },
    'sapphire-danglers': {
        id: 'sapphire-danglers',
        name: 'Sapphire Dangler Earrings',
        category: 'Earrings',
        price: 105000,
        description: 'Elegant sapphire dangler earrings with cascading design. Royal blue gemstones in white gold.',
        imageUrl: '/web_assets/products/pearl_drops.png',
        weight: '8.2g',
        purity: '18K White Gold',
        images: ['/web_assets/products/pearl_drops.png']
    },
    'platinum-hoops': {
        id: 'platinum-hoops',
        name: 'Platinum Hoop Earrings',
        category: 'Earrings',
        price: 125000,
        description: 'Modern platinum hoops with diamond pavé setting. Contemporary luxury.',
        imageUrl: '/web_assets/products/champagne_gold_hoops.png',
        weight: '9.5g',
        purity: 'Platinum 950',
        images: ['/web_assets/products/champagne_gold_hoops.png']
    },
    'antique-jhumkas': {
        id: 'antique-jhumkas',
        name: 'Antique Gold Jhumkas',
        category: 'Earrings',
        price: 68000,
        description: 'Traditional antique gold jhumkas with intricate filigree work. Heritage Indian craftsmanship.',
        imageUrl: '/web_assets/products/gold_chandbalis.png',
        weight: '11.5g',
        purity: '22K Gold',
        collection: 'Heritage Collection',
        images: ['/web_assets/products/gold_chandbalis.png']
    },

    // ===== NECKLACES =====
    'gold-chain': {
        id: 'gold-chain',
        name: 'Gold Chain',
        category: 'Necklaces',
        price: 125000,
        description: 'Classic 22K gold chain with traditional design. Perfect for daily wear.',
        imageUrl: '/web_assets/products/gold_chain.png',
        weight: '25.5g',
        purity: '22K Gold',
        images: ['/web_assets/products/gold_chain.png']
    },
    'diamond-tennis': {
        id: 'diamond-tennis',
        name: 'Diamond Tennis Necklace',
        category: 'Necklaces',
        price: 285000,
        description: 'Stunning diamond tennis necklace with brilliant-cut diamonds in platinum setting.',
        imageUrl: '/web_assets/products/diamond_tennis.png',
        weight: '18.2g',
        purity: 'Platinum 950',
        images: ['/web_assets/products/diamond_tennis.png']
    },
    'rose-gold-heart': {
        id: 'rose-gold-heart',
        name: 'Rose Gold Heart Pendant',
        category: 'Necklaces',
        price: 42000,
        description: 'Delicate rose gold heart pendant with diamond accents. Perfect gift for loved ones.',
        imageUrl: '/web_assets/products/rose_gold_pendant.png',
        weight: '4.5g',
        purity: '18K Rose Gold',
        images: ['/web_assets/products/rose_gold_pendant.png']
    },
    'crystal-choker': {
        id: 'crystal-choker',
        name: 'Crystal Choker',
        category: 'Necklaces',
        price: 38000,
        description: 'Modern crystal choker necklace with adjustable length. Contemporary elegance.',
        imageUrl: '/web_assets/products/crystal_choker.png',
        weight: '12.8g',
        purity: '18K White Gold',
        images: ['/web_assets/products/crystal_choker.png']
    },
    'diamond-pendant': {
        id: 'diamond-pendant',
        name: 'Diamond Pendant',
        category: 'Necklaces',
        price: 95000,
        description: 'An intricate floral-inspired pendant adorned with round-cut diamonds. Elegance redefined.',
        imageUrl: '/web_assets/products/diamond_necklace.png',
        weight: '8.5g',
        purity: '18K White Gold',
        collection: 'Heirloom Series',
        images: ['/web_assets/products/diamond_necklace.png']
    },
    'kundan-set': {
        id: 'kundan-set',
        name: 'Kundan Necklace Set',
        category: 'Necklaces',
        price: 195000,
        description: 'Traditional Kundan necklace with uncut diamonds and gemstones. Royal Rajasthani craftsmanship.',
        imageUrl: '/web_assets/products/gold_chain.png',
        weight: '52.5g',
        purity: '22K Gold',
        collection: 'Royal Collection',
        images: ['/web_assets/products/gold_chain.png']
    },
    'polki-necklace': {
        id: 'polki-necklace',
        name: 'Polki Diamond Necklace',
        category: 'Necklaces',
        price: 325000,
        description: 'Exquisite polki diamond necklace with traditional design. Uncut diamond brilliance.',
        imageUrl: '/web_assets/products/diamond_tennis.png',
        weight: '48.8g',
        purity: '22K Gold',
        collection: 'Heritage Collection',
        images: ['/web_assets/products/diamond_tennis.png']
    },
    'emerald-choker-necklace': {
        id: 'emerald-choker-necklace',
        name: 'Emerald Choker Necklace',
        category: 'Necklaces',
        price: 285000,
        description: 'Stunning emerald choker with diamond accents. Perfect for special occasions.',
        imageUrl: '/web_assets/products/crystal_choker.png',
        weight: '38.5g',
        purity: '18K White Gold',
        images: ['/web_assets/products/crystal_choker.png']
    },
    'ruby-pendant-necklace': {
        id: 'ruby-pendant-necklace',
        name: 'Ruby Pendant Necklace',
        category: 'Necklaces',
        price: '155000',
        description: 'Elegant ruby pendant necklace with diamond halo. Vibrant red centerpiece.',
        imageUrl: '/web_assets/products/rose_gold_pendant.png',
        weight: '12.5g',
        purity: '18K Rose Gold',
        images: ['/web_assets/products/rose_gold_pendant.png']
    },
    'pearl-strand-necklace': {
        id: 'pearl-strand-necklace',
        name: 'Pearl Strand Necklace',
        category: 'Necklaces',
        price: 85000,
        description: 'Classic pearl strand necklace with gold clasp. Timeless elegance.',
        imageUrl: '/web_assets/products/rose_gold_pendant.png',
        weight: '28.5g',
        purity: '18K Gold',
        images: ['/web_assets/products/rose_gold_pendant.png']
    },

    // ===== RINGS =====
    'gold-band': {
        id: 'gold-band',
        name: 'Gold Band Ring',
        category: 'Rings',
        price: 32000,
        description: 'Classic gold band ring with textured finish. Timeless design.',
        imageUrl: '/web_assets/products/gold_band.png',
        weight: '5.2g',
        purity: '22K Gold',
        images: ['/web_assets/products/gold_band.png']
    },
    'rose-gold-stack': {
        id: 'rose-gold-stack',
        name: 'Rose Gold Stack Rings',
        category: 'Rings',
        price: 48000,
        description: 'Set of three stackable rose gold rings with diamond accents. Mix and match.',
        imageUrl: '/web_assets/products/rose_gold_pendant.png',
        weight: '6.8g',
        purity: '18K Rose Gold',
        images: ['/web_assets/products/rose_gold_pendant.png']
    },
    'sapphire-royal': {
        id: 'sapphire-royal',
        name: 'Sapphire Royal Ring',
        category: 'Rings',
        price: 185000,
        description: 'Magnificent blue sapphire surrounded by diamonds in platinum setting. Royal elegance.',
        imageUrl: '/web_assets/products/diamond_solitaire.png',
        weight: '7.5g',
        purity: 'Platinum 950',
        images: ['/web_assets/products/diamond_solitaire.png']
    },
    'platinum-eternity': {
        id: 'platinum-eternity',
        name: 'Platinum Eternity Ring',
        category: 'Rings',
        price: 125000,
        description: 'Platinum eternity band with continuous diamond setting. Symbol of eternal love.',
        imageUrl: '/web_assets/products/diamond_bangle_set.png',
        weight: '6.2g',
        purity: 'Platinum 950',
        images: ['/web_assets/products/diamond_bangle_set.png']
    },
    'diamond-solitaire': {
        id: 'diamond-solitaire',
        name: 'Diamond Solitaire Ring',
        category: 'Rings',
        price: 165000,
        description: 'A timeless classic featuring a brilliant-cut solitaire diamond on a platinum band.',
        imageUrl: '/web_assets/products/diamond_solitaire.png',
        weight: '4.5g',
        purity: 'Platinum 950',
        collection: 'Engagement Series',
        images: ['/web_assets/products/diamond_solitaire.png']
    },
    'emerald-ring': {
        id: 'emerald-ring',
        name: 'Emerald Cocktail Ring',
        category: 'Rings',
        price: 215000,
        description: 'Stunning emerald cocktail ring with diamond halo. Statement piece for special occasions.',
        imageUrl: '/web_assets/products/diamond_solitaire.png',
        weight: '8.5g',
        purity: '18K White Gold',
        images: ['/web_assets/products/diamond_solitaire.png']
    },
    'ruby-band-ring': {
        id: 'ruby-band-ring',
        name: 'Ruby Band Ring',
        category: 'Rings',
        price: 145000,
        description: 'Elegant ruby band ring with channel-set stones. Vibrant red brilliance.',
        imageUrl: '/web_assets/products/rose_gold_pendant.png',
        weight: '6.8g',
        purity: '18K Rose Gold',
        images: ['/web_assets/products/rose_gold_pendant.png']
    },
    'pearl-ring': {
        id: 'pearl-ring',
        name: 'Pearl Solitaire Ring',
        category: 'Rings',
        price: 55000,
        description: 'Classic pearl solitaire ring with gold band. Timeless elegance.',
        imageUrl: '/web_assets/products/rose_gold_pendant.png',
        weight: '4.2g',
        purity: '18K Gold',
        images: ['/web_assets/products/rose_gold_pendant.png']
    },
    'antique-ring': {
        id: 'antique-ring',
        name: 'Antique Gold Ring',
        category: 'Rings',
        price: 78000,
        description: 'Traditional antique gold ring with intricate engraving. Heritage design.',
        imageUrl: '/web_assets/products/gold_band.png',
        weight: '7.5g',
        purity: '22K Gold',
        collection: 'Heritage Collection',
        images: ['/web_assets/products/gold_band.png']
    },
    'cocktail-ring': {
        id: 'cocktail-ring',
        name: 'Diamond Cocktail Ring',
        category: 'Rings',
        price: 285000,
        description: 'Dazzling diamond cocktail ring with multi-stone design. Bold statement piece.',
        imageUrl: '/web_assets/products/diamond_solitaire.png',
        weight: '9.8g',
        purity: 'Platinum 950',
        images: ['/web_assets/products/diamond_solitaire.png']
    },

    // ===== BRACELETS =====
    'royal-bangle': {
        id: 'royal-bangle',
        name: 'Royal Bangle',
        category: 'Bracelets',
        price: 78000,
        description: 'Traditional gold bangle with intricate engraving. Heritage craftsmanship.',
        imageUrl: '/web_assets/products/gold_bangle.png',
        weight: '15.5g',
        purity: '22K Gold',
        images: ['/web_assets/products/gold_bangle.png']
    },
    'luxury-charm': {
        id: 'luxury-charm',
        name: 'Luxury Charm Bracelet',
        category: 'Bracelets',
        price: 92000,
        description: 'Gold charm bracelet with customizable charms. Personal storytelling.',
        imageUrl: '/web_assets/products/charm_bracelet.png',
        weight: '12.8g',
        purity: '18K Gold',
        images: ['/web_assets/products/charm_bracelet.png']
    },
    'hammered-cuff': {
        id: 'hammered-cuff',
        name: 'Hammered Cuff Bracelet',
        category: 'Bracelets',
        price: 68000,
        description: 'Modern hammered gold cuff with contemporary design. Bold statement piece.',
        imageUrl: '/web_assets/products/gold_bangle.png',
        weight: '18.2g',
        purity: '18K Gold',
        images: ['/web_assets/products/gold_bangle.png']
    },
    'classic-tennis': {
        id: 'classic-tennis',
        name: 'Classic Tennis Bracelet',
        category: 'Bracelets',
        price: 195000,
        description: 'Diamond tennis bracelet with brilliant-cut stones. Timeless elegance.',
        imageUrl: '/web_assets/products/diamond_tennis_bracelet_ar.png',
        weight: '14.5g',
        purity: '18K White Gold',
        images: ['/web_assets/products/diamond_tennis_bracelet_ar.png']
    },
    'platinum-weave': {
        id: 'platinum-weave',
        name: 'Platinum Weave Bracelet',
        category: 'Bracelets',
        price: 145000,
        description: 'An intricate interwoven design of platinum and brilliant diamonds creating a seamless flow of light.',
        imageUrl: '/web_assets/products/diamond_bangle_set.png',
        weight: '22.3g',
        purity: 'Platinum 950',
        collection: 'Vogue Series',
        images: ['/web_assets/products/diamond_bangle_set.png']
    },
    'pearl-bracelet': {
        id: 'pearl-bracelet',
        name: 'Pearl Bracelet',
        category: 'Bracelets',
        price: 68000,
        description: 'Elegant pearl bracelet with gold spacers. Classic sophistication.',
        imageUrl: '/web_assets/products/charm_bracelet.png',
        weight: '15.5g',
        purity: '18K Gold',
        images: ['/web_assets/products/charm_bracelet.png']
    },
    'ruby-bracelet': {
        id: 'ruby-bracelet',
        name: 'Ruby Tennis Bracelet',
        category: 'Bracelets',
        price: 225000,
        description: 'Stunning ruby tennis bracelet with diamond accents. Vibrant red brilliance.',
        imageUrl: '/web_assets/products/diamond_tennis_bracelet_ar.png',
        weight: '16.8g',
        purity: '18K White Gold',
        images: ['/web_assets/products/diamond_tennis_bracelet_ar.png']
    },
    'emerald-bangle-bracelet': {
        id: 'emerald-bangle-bracelet',
        name: 'Emerald Bangle Bracelet',
        category: 'Bracelets',
        price: 185000,
        description: 'Exquisite emerald bangle bracelet with intricate design. Luxurious green gemstones.',
        imageUrl: '/web_assets/products/gold_bangle.png',
        weight: '22.5g',
        purity: '18K Gold',
        images: ['/web_assets/products/gold_bangle.png']
    },
    'link-bracelet': {
        id: 'link-bracelet',
        name: 'Gold Link Bracelet',
        category: 'Bracelets',
        price: 95000,
        description: 'Classic gold link bracelet with polished finish. Timeless design.',
        imageUrl: '/web_assets/products/charm_bracelet.png',
        weight: '18.2g',
        purity: '22K Gold',
        images: ['/web_assets/products/charm_bracelet.png']
    },
    'chain-bracelet': {
        id: 'chain-bracelet',
        name: 'Diamond Chain Bracelet',
        category: 'Bracelets',
        price: 165000,
        description: 'Modern diamond chain bracelet with contemporary design. Elegant sparkle.',
        imageUrl: '/web_assets/products/diamond_tennis_bracelet_ar.png',
        weight: '12.8g',
        purity: 'Platinum 950',
        images: ['/web_assets/products/diamond_tennis_bracelet_ar.png']
    },

    // ===== BANGLES =====
    'classic-gold-bangle': {
        id: 'classic-gold-bangle',
        name: 'Classic Gold Bangle',
        category: 'Bangles',
        price: 85000,
        description: 'Traditional 22K gold bangle with smooth finish. Essential jewelry piece.',
        imageUrl: '/web_assets/products/gold_bangle.png',
        weight: '18.5g',
        purity: '22K Gold',
        images: ['/web_assets/products/gold_bangle.png']
    },
    'diamond-pair-bangles': {
        id: 'diamond-pair-bangles',
        name: 'Diamond Pair Bangles',
        category: 'Bangles',
        price: 225000,
        description: 'Pair of diamond-studded bangles in white gold. Luxurious sparkle.',
        imageUrl: '/web_assets/products/diamond_bangle_set.png',
        weight: '32.8g',
        purity: '18K White Gold',
        images: ['/web_assets/products/diamond_bangle_set.png']
    },
    'bridal-chooda': {
        id: 'bridal-chooda',
        name: 'Bridal Chooda Set',
        category: 'Bangles',
        price: 125000,
        description: 'Traditional bridal bangle set with red and white design. Wedding essential.',
        imageUrl: '/web_assets/products/gold_bangle.png',
        weight: '45.5g',
        purity: '22K Gold',
        images: ['/web_assets/products/gold_bangle.png']
    },
    'hammered-cuff-bangle': {
        id: 'hammered-cuff-bangle',
        name: 'Hammered Cuff Bangle',
        category: 'Bangles',
        price: 72000,
        description: 'Modern hammered gold cuff bangle. Contemporary design.',
        imageUrl: '/web_assets/products/gold_bangle.png',
        weight: '16.2g',
        purity: '18K Gold',
        images: ['/web_assets/products/gold_bangle.png']
    },
    'temple-masterpiece': {
        id: 'temple-masterpiece',
        name: 'Temple Masterpiece Bangle',
        category: 'Bangles',
        price: 185000,
        description: 'An exquisite antique gold bangle featuring intricate divine motifs, handcrafted for royalty.',
        imageUrl: '/web_assets/products/gold_bangle.png',
        weight: '28.5g',
        purity: '22K Gold',
        collection: 'Heirloom Series',
        images: ['/web_assets/products/gold_bangle.png']
    },
    'kundan-bangles': {
        id: 'kundan-bangles',
        name: 'Kundan Bangle Set',
        category: 'Bangles',
        price: 195000,
        description: 'Traditional Kundan bangle set with uncut diamonds. Royal Rajasthani craftsmanship.',
        imageUrl: '/web_assets/products/diamond_bangle_set.png',
        weight: '42.5g',
        purity: '22K Gold',
        collection: 'Royal Collection',
        images: ['/web_assets/products/diamond_bangle_set.png']
    },
    'polki-bangle-set': {
        id: 'polki-bangle-set',
        name: 'Polki Bangle Set',
        category: 'Bangles',
        price: 285000,
        description: 'Exquisite polki bangle set with traditional design. Uncut diamond brilliance.',
        imageUrl: '/web_assets/products/diamond_bangle_set.png',
        weight: '48.8g',
        purity: '22K Gold',
        collection: 'Heritage Collection',
        images: ['/web_assets/products/diamond_bangle_set.png']
    },
    'meenakari-bangles': {
        id: 'meenakari-bangles',
        name: 'Meenakari Enamel Bangles',
        category: 'Bangles',
        price: 145000,
        description: 'Colorful meenakari enamel bangles with intricate patterns. Traditional artistry.',
        imageUrl: '/web_assets/products/gold_bangle.png',
        weight: '38.5g',
        purity: '22K Gold',
        images: ['/web_assets/products/gold_bangle.png']
    },
    'stone-bangles': {
        id: 'stone-bangles',
        name: 'Precious Stone Bangles',
        category: 'Bangles',
        price: 265000,
        description: 'Luxurious bangles with precious stones and diamonds. Multi-color brilliance.',
        imageUrl: '/web_assets/products/diamond_bangle_set.png',
        weight: '45.2g',
        purity: '18K Gold',
        images: ['/web_assets/products/diamond_bangle_set.png']
    },
    'designer-bangle-set': {
        id: 'designer-bangle-set',
        name: 'Designer Bangle Set',
        category: 'Bangles',
        price: 175000,
        description: 'Contemporary designer bangle set with modern aesthetics. Fashion-forward elegance.',
        imageUrl: '/web_assets/products/gold_bangle.png',
        weight: '35.8g',
        purity: '18K Gold',
        images: ['/web_assets/products/gold_bangle.png']
    },

    // ===== CHAINS =====
    'classic-rope-chain': {
        id: 'classic-rope-chain',
        name: 'Classic Rope Chain',
        category: 'Chains',
        price: 95000,
        description: 'Traditional 22K gold rope chain with intricate twisted design. Perfect for pendants or standalone wear.',
        imageUrl: '/web_assets/products/gold_chain.png',
        weight: '22.5g',
        purity: '22K Gold',
        images: ['/web_assets/products/gold_chain.png']
    },
    'box-chain-platinum': {
        id: 'box-chain-platinum',
        name: 'Platinum Box Chain',
        category: 'Chains',
        price: 145000,
        description: 'Sleek platinum box chain with modern design. Durable and elegant for everyday luxury.',
        imageUrl: '/web_assets/products/diamond_tennis.png',
        weight: '18.8g',
        purity: 'Platinum 950',
        images: ['/web_assets/products/diamond_tennis.png']
    },
    'figaro-gold-chain': {
        id: 'figaro-gold-chain',
        name: 'Figaro Gold Chain',
        category: 'Chains',
        price: 78000,
        description: 'Classic figaro pattern chain in 18K gold. Timeless Italian design.',
        imageUrl: '/web_assets/products/gold_chain.png',
        weight: '16.2g',
        purity: '18K Gold',
        images: ['/web_assets/products/gold_chain.png']
    },
    'snake-chain-deluxe': {
        id: 'snake-chain-deluxe',
        name: 'Deluxe Snake Chain',
        category: 'Chains',
        price: 112000,
        description: 'Smooth snake chain in 22K gold with fluid movement. Contemporary elegance.',
        imageUrl: '/web_assets/products/gold_chain.png',
        weight: '24.5g',
        purity: '22K Gold',
        images: ['/web_assets/products/gold_chain.png']
    },
    'wheat-chain': {
        id: 'wheat-chain',
        name: 'Wheat Gold Chain',
        category: 'Chains',
        price: 105000,
        description: 'Elegant wheat pattern chain in 22K gold. Classic Italian design.',
        imageUrl: '/web_assets/products/gold_chain.png',
        weight: '26.5g',
        purity: '22K Gold',
        images: ['/web_assets/products/gold_chain.png']
    },
    'curb-chain': {
        id: 'curb-chain',
        name: 'Curb Link Chain',
        category: 'Chains',
        price: 88000,
        description: 'Bold curb link chain in 18K gold. Modern masculine design.',
        imageUrl: '/web_assets/products/gold_chain.png',
        weight: '32.5g',
        purity: '18K Gold',
        images: ['/web_assets/products/gold_chain.png']
    },
    'singapore-chain': {
        id: 'singapore-chain',
        name: 'Singapore Chain',
        category: 'Chains',
        price: 72000,
        description: 'Delicate Singapore chain with diamond-cut links. Sparkling elegance.',
        imageUrl: '/web_assets/products/gold_chain.png',
        weight: '14.5g',
        purity: '18K Gold',
        images: ['/web_assets/products/gold_chain.png']
    },
    'franco-chain': {
        id: 'franco-chain',
        name: 'Franco Chain',
        category: 'Chains',
        price: 125000,
        description: 'Luxurious franco chain in platinum. Contemporary sophistication.',
        imageUrl: '/web_assets/products/diamond_tennis.png',
        weight: '28.8g',
        purity: 'Platinum 950',
        images: ['/web_assets/products/diamond_tennis.png']
    },
    'mariner-chain': {
        id: 'mariner-chain',
        name: 'Mariner Link Chain',
        category: 'Chains',
        price: 98000,
        description: 'Classic mariner link chain in 22K gold. Nautical-inspired design.',
        imageUrl: '/web_assets/products/gold_chain.png',
        weight: '24.2g',
        purity: '22K Gold',
        images: ['/web_assets/products/gold_chain.png']
    },
    'cable-chain': {
        id: 'cable-chain',
        name: 'Cable Chain',
        category: 'Chains',
        price: 65000,
        description: 'Simple cable chain in 18K gold. Versatile and timeless.',
        imageUrl: '/web_assets/products/gold_chain.png',
        weight: '16.5g',
        purity: '18K Gold',
        images: ['/web_assets/products/gold_chain.png']
    },

    // ===== STATEMENT NECKLACES =====
    'layered-pearl-statement': {
        id: 'layered-pearl-statement',
        name: 'Layered Pearl Statement',
        category: 'Statement Necklaces',
        price: 185000,
        description: 'Multi-layered pearl necklace with gold accents. Bold and sophisticated statement piece.',
        imageUrl: '/web_assets/products/diamond_necklace.png',
        weight: '45.8g',
        purity: '22K Gold',
        collection: 'Bridal Series',
        images: ['/web_assets/products/diamond_necklace.png']
    },
    'emerald-collar-necklace': {
        id: 'emerald-collar-necklace',
        name: 'Emerald Collar Necklace',
        category: 'Statement Necklaces',
        price: 425000,
        description: 'Stunning emerald and diamond collar necklace. Royal elegance for special occasions.',
        imageUrl: '/web_assets/products/diamond_tennis.png',
        weight: '62.5g',
        purity: '18K White Gold',
        collection: 'Royal Collection',
        images: ['/web_assets/products/diamond_tennis.png']
    },
    'antique-temple-necklace': {
        id: 'antique-temple-necklace',
        name: 'Antique Temple Necklace',
        category: 'Statement Necklaces',
        price: 295000,
        description: 'Traditional temple jewelry necklace with goddess motifs and ruby accents. Heritage craftsmanship.',
        imageUrl: '/web_assets/products/gold_chain.png',
        weight: '85.2g',
        purity: '22K Gold',
        collection: 'Heritage Collection',
        images: ['/web_assets/products/gold_chain.png']
    },
    'crystal-bib-necklace': {
        id: 'crystal-bib-necklace',
        name: 'Crystal Bib Necklace',
        category: 'Statement Necklaces',
        price: 165000,
        description: 'Modern crystal bib necklace with geometric design. Contemporary statement for evening wear.',
        imageUrl: '/web_assets/products/crystal_choker.png',
        weight: '38.5g',
        purity: '18K White Gold',
        images: ['/web_assets/products/crystal_choker.png']
    },
    'kundan-haar': {
        id: 'kundan-haar',
        name: 'Kundan Haar Necklace',
        category: 'Statement Necklaces',
        price: 385000,
        description: 'Grand Kundan haar with uncut diamonds and precious stones. Royal bridal statement.',
        imageUrl: '/web_assets/products/gold_chain.png',
        weight: '95.5g',
        purity: '22K Gold',
        collection: 'Bridal Series',
        images: ['/web_assets/products/gold_chain.png']
    },
    'polki-statement-set': {
        id: 'polki-statement-set',
        name: 'Polki Statement Set',
        category: 'Statement Necklaces',
        price: 485000,
        description: 'Magnificent polki statement necklace with traditional design. Museum-quality craftsmanship.',
        imageUrl: '/web_assets/products/diamond_tennis.png',
        weight: '108.8g',
        purity: '22K Gold',
        collection: 'Royal Collection',
        images: ['/web_assets/products/diamond_tennis.png']
    },
    'meenakari-necklace': {
        id: 'meenakari-necklace',
        name: 'Meenakari Statement Necklace',
        category: 'Statement Necklaces',
        price: 225000,
        description: 'Colorful meenakari enamel necklace with intricate patterns. Traditional Rajasthani art.',
        imageUrl: '/web_assets/products/gold_chain.png',
        weight: '68.5g',
        purity: '22K Gold',
        collection: 'Heritage Collection',
        images: ['/web_assets/products/gold_chain.png']
    },
    'jadau-set': {
        id: 'jadau-set',
        name: 'Jadau Necklace Set',
        category: 'Statement Necklaces',
        price: 425000,
        description: 'Exquisite jadau necklace with gemstone setting. Royal Mughal craftsmanship.',
        imageUrl: '/web_assets/products/diamond_necklace.png',
        weight: '92.5g',
        purity: '22K Gold',
        collection: 'Royal Collection',
        images: ['/web_assets/products/diamond_necklace.png']
    },
    'bridal-statement-set': {
        id: 'bridal-statement-set',
        name: 'Bridal Statement Set',
        category: 'Statement Necklaces',
        price: 525000,
        description: 'Grand bridal necklace set with diamonds and precious stones. Complete wedding elegance.',
        imageUrl: '/web_assets/products/diamond_tennis.png',
        weight: '125.8g',
        purity: '22K Gold',
        collection: 'Bridal Series',
        images: ['/web_assets/products/diamond_tennis.png']
    },
    'royal-collar-necklace': {
        id: 'royal-collar-necklace',
        name: 'Royal Collar Necklace',
        category: 'Statement Necklaces',
        price: 565000,
        description: 'Magnificent royal collar necklace with diamonds and sapphires. Ultimate luxury statement.',
        imageUrl: '/web_assets/products/diamond_tennis.png',
        weight: '145.2g',
        purity: 'Platinum 950',
        collection: 'Royal Collection',
        images: ['/web_assets/products/diamond_tennis.png']
    }
};

// Helper function to get product by ID
function getProduct(productId) {
    return PRODUCTS[productId] || null;
}

// Helper function to get products by category
function getProductsByCategory(category) {
    return Object.values(PRODUCTS).filter(p => p.category === category);
}
