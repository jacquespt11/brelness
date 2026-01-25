import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useReservationStore } from '../state/reservationStore';
import Logo from '../components/ui/Logo';
import ProductCard from '../components/catalog/ProductCard';
import CategoryFilter from '../components/catalog/CategoryFilter';
import type { Product } from '../types/reservation';
import { ArrowLeft, Search, Filter, Home } from 'lucide-react';

const CatalogPage = () => {
  const navigate = useNavigate();
  const products = useReservationStore((state) => state.products);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [showFilters, setShowFilters] = useState(false);

  // Calcul dynamique des catégories à partir des produits
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((product: Product) => product.category))
    );

    const categoryMap: Record<string, { label: string; icon: string }> = {
      'soin_visage': { label: 'Soin visage', icon: '✨' },
      'maquillage': { label: 'Maquillage', icon: '💄' },
      'parfum': { label: 'Parfums', icon: '🌸' },
      'soin_corps': { label: 'Soin corps', icon: '🧴' },
      'soin_cheveux': { label: 'Soin cheveux', icon: '🧖‍♀️' },
    };

    return [
      { id: 'all', label: 'Tous les produits', icon: '🌟' },
      ...uniqueCategories.map(category => ({
        id: category,
        label: categoryMap[category]?.label || category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' '),
        icon: categoryMap[category]?.icon || '🌟'
      }))
    ];
  }, [products]);

  // Calcul des prix min/max pour le filtre
  const priceStats = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 100 };
    const prices = products.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [products]);

  // Filtrage des produits avec typage explicite
  const filteredProducts = useMemo(() =>
    products.filter((product: Product) => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesCategory && matchesSearch && matchesPrice;
    }),
    [products, selectedCategory, searchQuery, priceRange]
  );

  // Statistiques de filtrage
  const stats = useMemo(() => ({
    totalProducts: products.length,
    filteredProducts: filteredProducts.length,
    categoriesCount: categories.length - 1,
    averagePrice: filteredProducts.length > 0
      ? (filteredProducts.reduce((sum, p) => sum + p.price, 0) / filteredProducts.length).toFixed(2)
      : '0.00'
  }), [products, filteredProducts, categories]);

  const handleProductClick = (productId: string) => {
    navigate(`/reserve/${productId}`);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPriceRange([0, 200]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header amélioré avec logo et navigation */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo et navigation */}
            <div className="flex items-center space-x-6">
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group"
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5 group-hover:stroke-purple-500 transition-colors" />
                <span className="font-medium hidden sm:inline">Accueil</span>
              </motion.button>

              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 hidden md:block" />

              <div className="flex items-center space-x-3">
                <Logo size="md" animated={false} />
                <div className="hidden md:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Cosmetic Reservations
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Catalogue produits
                  </p>
                </div>
              </div>
            </div>

            {/* Titre principal (mobile) */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden text-center flex-1"
            >
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Catalogue
              </h1>
            </motion.div>

            {/* Actions rapides */}
            <div className="flex items-center space-x-4">
              {/* Bouton accueil */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
              >
                <Home className="w-4 h-4" />
                <span>Accueil</span>
              </motion.button>

              {/* Bouton filtre mobile */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <main className="py-8">
        <div className="container mx-auto px-4 lg:px-8">
          {/* En-tête amélioré */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8 lg:mb-12"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-4">
                Découvrez notre <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">catalogue</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Explorez notre sélection exclusive de produits cosmétiques premium.
                Trouvez le produit parfait pour vos besoins.
              </p>
            </div>

            {/* Barre de recherche principale */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un produit, une marque, une catégorie..."
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white shadow-lg hover:shadow-xl transition-all"
                />
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ✕
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar des filtres */}
            <motion.aside
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={`lg:block ${showFilters ? 'block' : 'hidden'}`}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
                {/* En-tête filtres */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <Filter className="w-5 h-5 text-purple-600" />
                    Filtres
                  </h2>
                  <button
                    onClick={handleResetFilters}
                    className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                  >
                    Réinitialiser
                  </button>
                </div>

                {/* Filtres par catégorie */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Catégories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center w-full p-3 rounded-lg transition-all ${selectedCategory === category.id
                          ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                          }`}
                      >
                        <span className="mr-3 text-lg">{category.icon}</span>
                        <span className="font-medium">{category.label}</span>
                        <span className="ml-auto text-sm opacity-70">
                          {category.id === 'all'
                            ? products.length
                            : products.filter(p => p.category === category.id).length}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtre par prix */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Prix : {priceRange[0]}€ - {priceRange[1]}€
                  </h3>
                  <div className="px-2">
                    <input
                      type="range"
                      min={priceStats.min}
                      max={priceStats.max}
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="range"
                      min={priceStats.min}
                      max={priceStats.max}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                    <span>{priceStats.min}€</span>
                    <span>{priceStats.max}€</span>
                  </div>
                </div>

                {/* Statistiques */}
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Vue d'ensemble
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Produits totaux</span>
                      <span className="font-bold">{stats.totalProducts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Produits filtrés</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">{stats.filteredProducts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Prix moyen</span>
                      <span className="font-bold">{stats.averagePrice}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Catégories</span>
                      <span className="font-bold">{stats.categoriesCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>

            {/* Contenu principal */}
            <div className="lg:col-span-3">
              {/* En-tête résultats */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                      Nos produits
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
                      {selectedCategory !== 'all' && ` dans "${categories.find(c => c.id === selectedCategory)?.label}"`}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>Trier par :</span>
                      <select className="bg-transparent border-none focus:outline-none">
                        <option>Popularité</option>
                        <option>Prix croissant</option>
                        <option>Prix décroissant</option>
                        <option>Nom A-Z</option>
                      </select>
                    </div>

                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg"
                    >
                      <Filter className="w-4 h-4" />
                      <span>Filtres</span>
                    </button>
                  </div>
                </div>

                {/* Catégories rapides (mobile) */}
                <div className="lg:hidden mb-6">
                  <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                  />
                </div>
              </div>

              {/* Grille de produits */}
              {filteredProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
                >
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    Aucun produit trouvé
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    Aucun produit ne correspond à vos critères de recherche.
                    Essayez de modifier vos filtres ou votre recherche.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    Réinitialiser les filtres
                  </button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {filteredProducts.map((product: Product, index: number) => (
                    <motion.div
                      key={product.id}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ProductCard
                        product={product}
                        onClick={() => handleProductClick(product.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {filteredProducts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-12 flex justify-center"
                >
                  <div className="flex items-center space-x-2">
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
                      ←
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      1
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
                      2
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
                      3
                    </button>
                    <span className="px-2 text-gray-500">...</span>
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
                      →
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Section CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-16 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-purple-900/20 rounded-2xl p-8 lg:p-12"
          >
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-4">
                Vous ne trouvez pas ce que vous cherchez ?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Notre équipe d'experts est disponible pour vous aider à trouver
                le produit parfait adapté à vos besoins spécifiques.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/add')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Demander un produit spécifique
                </button>
                <a
                  href="tel:0123456789"
                  className="px-6 py-3 border-2 border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400 font-medium rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                >
                  📞 Nous contacter
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CatalogPage;