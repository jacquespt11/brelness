import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    animated?: boolean;
    showText?: boolean;
}

const Logo = ({ size = 'md', animated = true, showText = false }: LogoProps) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    const logoVariants: Variants = {
        initial: { rotate: 0, scale: 0.8 },
        animate: {
            rotate: 360,
            scale: 1,
            transition: {
                rotate: {
                    duration: 1.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 3,
                },
                scale: {
                    duration: 0.5,
                    ease: "backOut"
                }
            }
        },
        hover: {
            rotate: [0, -10, 10, -5, 5, 0],
            transition: {
                duration: 0.6,
                ease: "easeInOut"
            }
        }
    };

    return (
        <Link
            to="/"
            className="flex items-center space-x-3 group"
            aria-label="Retour à l'accueil"
        >
            <motion.div
                initial={animated ? "initial" : false}
                animate={animated ? "animate" : false}
                whileHover="hover"
                variants={logoVariants}
                className={`${sizeClasses[size]} relative group cursor-pointer`}
            >
                {/* Logo principal avec dégradé */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300" />

                {/* Logo overlay avec motif */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl" />

                {/* Étoile centrale */}
                <div className="absolute inset-2 flex items-center justify-center">
                    <svg
                        viewBox="0 0 24 24"
                        className="w-full h-full drop-shadow-lg"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <motion.path
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{
                                duration: 1.5,
                                ease: "easeInOut",
                                delay: 0.2
                            }}
                            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="rgba(255,255,255,0.9)"
                        />
                    </svg>
                </div>

                {/* Effet de brillance animé */}
                <motion.div
                    animate={{
                        x: [0, 8, 0],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-white/30 to-transparent rounded-tl-xl"
                />

                {/* Effet de halo au survol */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 0.4, scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-br from-purple-400/40 to-pink-400/40 rounded-xl blur-md"
                />
            </motion.div>

            {/* Texte du logo optionnel */}
            {showText && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="hidden md:block"
                >
                    <div className="flex flex-col">
                        <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Cosmetic Reservations
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Gestion de réservations
                        </span>
                    </div>
                </motion.div>
            )}
        </Link>
    );
};

export default Logo;