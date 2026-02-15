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
        imageUrl: 'web asset/products/diamond_studs.png',
        weight: '2.5g',
        purity: '18K Gold',
        images: ['web asset/products/diamond_studs.png']
    },
    'pearl-drops': {
        id: 'pearl-drops',
        name: 'Pearl Drops',
        category: 'Earrings',
        price: 28000,
        description: 'Elegant freshwater pearl drop earrings with gold accents. Timeless sophistication.',
        imageUrl: 'web asset/products/pearl_drops.png',
        weight: '3.2g',
        purity: '22K Gold',
        images: ['web asset/products/pearl_drops.png']
    },
    'gold-chandbalis': {
        id: 'gold-chandbalis',
        name: 'Gold Chandbalis',
        category: 'Earrings',
        price: 65000,
        description: 'Traditional South Indian chandbali earrings with intricate temple work and ruby accents.',
        imageUrl: 'web asset/products/gold_chandbalis.png',
        weight: '8.5g',
        purity: '22K Gold',
        images: ['web asset/products/gold_chandbalis.png']
    },
    'temple-jewelry': {
        id: 'temple-jewelry',
        name: 'Temple Jewelry Earrings',
        category: 'Earrings',
        price: 72000,
        description: 'Exquisite temple jewelry earrings featuring goddess motifs and traditional craftsmanship.',
        imageUrl: 'web asset/products/temple_jewelry.png',
        weight: '12.3g',
        purity: '22K Gold',
        images: ['web asset/products/temple_jewelry.png']
    },
    'champagne-gold-hoops': {
        id: 'champagne-gold-hoops',
        name: 'Champagne Gold Hoops',
        category: 'Earrings',
        price: 58000,
        description: 'Elegant 22K gold earrings with intricate filigree work and pearl accents. Handcrafted by master artisans.',
        imageUrl: 'web asset/products/champagne_gold_hoops.png',
        weight: '7.8g',
        purity: '22K Gold',
        collection: 'Heritage Collection',
        images: ['web asset/products/champagne_gold_hoops.png']
    },

    // ===== NECKLACES =====
    'gold-chain': {
        id: 'gold-chain',
        name: 'Gold Chain',
        category: 'Necklaces',
        price: 125000,
        description: 'Classic 22K gold chain with traditional design. Perfect for daily wear.',
        imageUrl: 'web asset/products/gold_chain.png',
        weight: '25.5g',
        purity: '22K Gold',
        images: ['web asset/products/gold_chain.png']
    },
    'diamond-tennis': {
        id: 'diamond-tennis',
        name: 'Diamond Tennis Necklace',
        category: 'Necklaces',
        price: 285000,
        description: 'Stunning diamond tennis necklace with brilliant-cut diamonds in platinum setting.',
        imageUrl: 'web asset/products/diamond_tennis.png',
        weight: '18.2g',
        purity: 'Platinum 950',
        images: ['web asset/products/diamond_tennis.png']
    },
    'rose-gold-heart': {
        id: 'rose-gold-heart',
        name: 'Rose Gold Heart Pendant',
        category: 'Necklaces',
        price: 42000,
        description: 'Delicate rose gold heart pendant with diamond accents. Perfect gift for loved ones.',
        imageUrl: 'web asset/products/rose_gold_pendant.png',
        weight: '4.5g',
        purity: '18K Rose Gold',
        images: ['web asset/products/rose_gold_pendant.png']
    },
    'crystal-choker': {
        id: 'crystal-choker',
        name: 'Crystal Choker',
        category: 'Necklaces',
        price: 38000,
        description: 'Modern crystal choker necklace with adjustable length. Contemporary elegance.',
        imageUrl: 'web asset/products/crystal_choker.png',
        weight: '12.8g',
        purity: '18K White Gold',
        images: ['web asset/products/crystal_choker.png']
    },
    'diamond-pendant': {
        id: 'diamond-pendant',
        name: 'Diamond Pendant',
        category: 'Necklaces',
        price: 95000,
        description: 'An intricate floral-inspired pendant adorned with round-cut diamonds. Elegance redefined.',
        imageUrl: 'web asset/products/diamond_necklace.png',
        weight: '8.5g',
        purity: '18K White Gold',
        collection: 'Heirloom Series',
        images: ['web asset/products/diamond_necklace.png']
    },

    // ===== RINGS =====
    'gold-band': {
        id: 'gold-band',
        name: 'Gold Band Ring',
        category: 'Rings',
        price: 32000,
        description: 'Classic gold band ring with textured finish. Timeless design.',
        imageUrl: 'web asset/products/gold_band.png',
        weight: '5.2g',
        purity: '22K Gold',
        images: ['web asset/products/gold_band.png']
    },
    'rose-gold-stack': {
        id: 'rose-gold-stack',
        name: 'Rose Gold Stack Rings',
        category: 'Rings',
        price: 48000,
        description: 'Set of three stackable rose gold rings with diamond accents. Mix and match.',
        imageUrl: 'web asset/products/rose_gold_pendant.png',
        weight: '6.8g',
        purity: '18K Rose Gold',
        images: ['web asset/products/rose_gold_pendant.png']
    },
    'sapphire-royal': {
        id: 'sapphire-royal',
        name: 'Sapphire Royal Ring',
        category: 'Rings',
        price: 185000,
        description: 'Magnificent blue sapphire surrounded by diamonds in platinum setting. Royal elegance.',
        imageUrl: 'web asset/products/diamond_solitaire.png',
        weight: '7.5g',
        purity: 'Platinum 950',
        images: ['web asset/products/diamond_solitaire.png']
    },
    'platinum-eternity': {
        id: 'platinum-eternity',
        name: 'Platinum Eternity Ring',
        category: 'Rings',
        price: 125000,
        description: 'Platinum eternity band with continuous diamond setting. Symbol of eternal love.',
        imageUrl: 'web asset/products/diamond_bangle_set.png',
        weight: '6.2g',
        purity: 'Platinum 950',
        images: ['web asset/products/diamond_bangle_set.png']
    },
    'diamond-solitaire': {
        id: 'diamond-solitaire',
        name: 'Diamond Solitaire Ring',
        category: 'Rings',
        price: 165000,
        description: 'A timeless classic featuring a brilliant-cut solitaire diamond on a platinum band.',
        imageUrl: 'web asset/products/diamond_solitaire.png',
        weight: '4.5g',
        purity: 'Platinum 950',
        collection: 'Engagement Series',
        images: ['web asset/products/diamond_solitaire.png']
    },

    // ===== BRACELETS =====
    'royal-bangle': {
        id: 'royal-bangle',
        name: 'Royal Bangle',
        category: 'Bracelets',
        price: 78000,
        description: 'Traditional gold bangle with intricate engraving. Heritage craftsmanship.',
        imageUrl: 'web asset/products/gold_bangle.png',
        weight: '15.5g',
        purity: '22K Gold',
        images: ['web asset/products/gold_bangle.png']
    },
    'luxury-charm': {
        id: 'luxury-charm',
        name: 'Luxury Charm Bracelet',
        category: 'Bracelets',
        price: 92000,
        description: 'Gold charm bracelet with customizable charms. Personal storytelling.',
        imageUrl: 'web asset/products/charm_bracelet.png',
        weight: '12.8g',
        purity: '18K Gold',
        images: ['web asset/products/charm_bracelet.png']
    },
    'hammered-cuff': {
        id: 'hammered-cuff',
        name: 'Hammered Cuff Bracelet',
        category: 'Bracelets',
        price: 68000,
        description: 'Modern hammered gold cuff with contemporary design. Bold statement piece.',
        imageUrl: 'web asset/products/gold_bangle.png',
        weight: '18.2g',
        purity: '18K Gold',
        images: ['web asset/products/gold_bangle.png']
    },
    'classic-tennis': {
        id: 'classic-tennis',
        name: 'Classic Tennis Bracelet',
        category: 'Bracelets',
        price: 195000,
        description: 'Diamond tennis bracelet with brilliant-cut stones. Timeless elegance.',
        imageUrl: 'web asset/products/diamond_tennis_bracelet_ar.png',
        weight: '14.5g',
        purity: '18K White Gold',
        images: ['web asset/products/diamond_tennis_bracelet_ar.png']
    },
    'platinum-weave': {
        id: 'platinum-weave',
        name: 'Platinum Weave Bracelet',
        category: 'Bracelets',
        price: 145000,
        description: 'An intricate interwoven design of platinum and brilliant diamonds creating a seamless flow of light.',
        imageUrl: 'web asset/products/diamond_bangle_set.png',
        weight: '22.3g',
        purity: 'Platinum 950',
        collection: 'Vogue Series',
        images: ['web asset/products/diamond_bangle_set.png']
    },

    // ===== BANGLES =====
    'classic-gold-bangle': {
        id: 'classic-gold-bangle',
        name: 'Classic Gold Bangle',
        category: 'Bangles',
        price: 85000,
        description: 'Traditional 22K gold bangle with smooth finish. Essential jewelry piece.',
        imageUrl: 'web asset/products/gold_bangle.png',
        weight: '18.5g',
        purity: '22K Gold',
        images: ['web asset/products/gold_bangle.png']
    },
    'diamond-pair-bangles': {
        id: 'diamond-pair-bangles',
        name: 'Diamond Pair Bangles',
        category: 'Bangles',
        price: 225000,
        description: 'Pair of diamond-studded bangles in white gold. Luxurious sparkle.',
        imageUrl: 'web asset/products/diamond_bangle_set.png',
        weight: '32.8g',
        purity: '18K White Gold',
        images: ['web asset/products/diamond_bangle_set.png']
    },
    'bridal-chooda': {
        id: 'bridal-chooda',
        name: 'Bridal Chooda Set',
        category: 'Bangles',
        price: 125000,
        description: 'Traditional bridal bangle set with red and white design. Wedding essential.',
        imageUrl: 'web asset/products/gold_bangle.png',
        weight: '45.5g',
        purity: '22K Gold',
        images: ['web asset/products/gold_bangle.png']
    },
    'hammered-cuff-bangle': {
        id: 'hammered-cuff-bangle',
        name: 'Hammered Cuff Bangle',
        category: 'Bangles',
        price: 72000,
        description: 'Modern hammered gold cuff bangle. Contemporary design.',
        imageUrl: 'web asset/products/gold_bangle.png',
        weight: '16.2g',
        purity: '18K Gold',
        images: ['web asset/products/gold_bangle.png']
    },
    'temple-masterpiece': {
        id: 'temple-masterpiece',
        name: 'Temple Masterpiece Bangle',
        category: 'Bangles',
        price: 185000,
        description: 'An exquisite antique gold bangle featuring intricate divine motifs, handcrafted for royalty.',
        imageUrl: 'web asset/products/gold_bangle.png',
        weight: '28.5g',
        purity: '22K Gold',
        collection: 'Heirloom Series',
        images: ['web asset/products/gold_bangle.png']
    },

    // ===== CHAINS =====
    'classic-rope-chain': {
        id: 'classic-rope-chain',
        name: 'Classic Rope Chain',
        category: 'Chains',
        price: 95000,
        description: 'Traditional 22K gold rope chain with intricate twisted design. Perfect for pendants or standalone wear.',
        imageUrl: 'web asset/products/gold_chain.png',
        weight: '22.5g',
        purity: '22K Gold',
        images: ['web asset/products/gold_chain.png']
    },
    'box-chain-platinum': {
        id: 'box-chain-platinum',
        name: 'Platinum Box Chain',
        category: 'Chains',
        price: 145000,
        description: 'Sleek platinum box chain with modern design. Durable and elegant for everyday luxury.',
        imageUrl: 'web asset/products/diamond_tennis.png',
        weight: '18.8g',
        purity: 'Platinum 950',
        images: ['web asset/products/diamond_tennis.png']
    },
    'figaro-gold-chain': {
        id: 'figaro-gold-chain',
        name: 'Figaro Gold Chain',
        category: 'Chains',
        price: 78000,
        description: 'Classic figaro pattern chain in 18K gold. Timeless Italian design.',
        imageUrl: 'web asset/products/gold_chain.png',
        weight: '16.2g',
        purity: '18K Gold',
        images: ['web asset/products/gold_chain.png']
    },
    'snake-chain-deluxe': {
        id: 'snake-chain-deluxe',
        name: 'Deluxe Snake Chain',
        category: 'Chains',
        price: 112000,
        description: 'Smooth snake chain in 22K gold with fluid movement. Contemporary elegance.',
        imageUrl: 'web asset/products/gold_chain.png',
        weight: '24.5g',
        purity: '22K Gold',
        images: ['web asset/products/gold_chain.png']
    },

    // ===== STATEMENT NECKLACES =====
    'layered-pearl-statement': {
        id: 'layered-pearl-statement',
        name: 'Layered Pearl Statement',
        category: 'Statement Necklaces',
        price: 185000,
        description: 'Multi-layered pearl necklace with gold accents. Bold and sophisticated statement piece.',
        imageUrl: 'web asset/products/diamond_necklace.png',
        weight: '45.8g',
        purity: '22K Gold',
        collection: 'Bridal Series',
        images: ['web asset/products/diamond_necklace.png']
    },
    'emerald-collar-necklace': {
        id: 'emerald-collar-necklace',
        name: 'Emerald Collar Necklace',
        category: 'Statement Necklaces',
        price: 425000,
        description: 'Stunning emerald and diamond collar necklace. Royal elegance for special occasions.',
        imageUrl: 'web asset/products/diamond_tennis.png',
        weight: '62.5g',
        purity: '18K White Gold',
        collection: 'Royal Collection',
        images: ['web asset/products/diamond_tennis.png']
    },
    'antique-temple-necklace': {
        id: 'antique-temple-necklace',
        name: 'Antique Temple Necklace',
        category: 'Statement Necklaces',
        price: 295000,
        description: 'Traditional temple jewelry necklace with goddess motifs and ruby accents. Heritage craftsmanship.',
        imageUrl: 'web asset/products/gold_chain.png',
        weight: '85.2g',
        purity: '22K Gold',
        collection: 'Heritage Collection',
        images: ['web asset/products/gold_chain.png']
    },
    'crystal-bib-necklace': {
        id: 'crystal-bib-necklace',
        name: 'Crystal Bib Necklace',
        category: 'Statement Necklaces',
        price: 165000,
        description: 'Modern crystal bib necklace with geometric design. Contemporary statement for evening wear.',
        imageUrl: 'web asset/products/crystal_choker.png',
        weight: '38.5g',
        purity: '18K White Gold',
        images: ['web asset/products/crystal_choker.png']
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
