
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					variant: 'hsl(var(--primary-variant))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// FPK University Custom Colors
				'fpk-purple': '#4C1D6B',  /* Darker purple */
				'fpk-amber': '#B45309',   /* Darker amber for better contrast */
				'fpk-card': '#FBF6F0',
				'fpk-orange': 'hsl(var(--fpk-orange))',
				
				// Enhanced Branding Colors
				'brand': {
					DEFAULT: 'hsl(var(--brand-accent))',
					600: 'hsl(var(--brand-accent-600))',
					700: 'hsl(var(--brand-accent-700))',
					foreground: 'hsl(var(--brand-contrast))',
					surface: 'hsl(var(--brand-surface))',
				},
				
				// Organization Tile Colors (dynamic)
				'org-tile': {
					DEFAULT: 'rgba(var(--org-tile-bg) / 0.65)',
					border: 'rgba(var(--org-tile-border) / 0.2)',
					text: 'rgb(var(--org-tile-text))',
				},
			},
			fontFamily: {
				// Accessibility fonts with proper fallbacks
				'opendyslexic': [
					'Atkinson Hyperlegible', 
					'Comic Sans MS', 
					'Trebuchet MS', 
					'Verdana', 
					'sans-serif'
				],
				'arial': [
					'Arial', 
					'Helvetica Neue', 
					'Helvetica', 
					'sans-serif'
				],
				'georgia': [
					'Georgia', 
					'Times New Roman', 
					'Times', 
					'serif'
				],
				'cursive': [
					'Dancing Script', 
					'Brush Script MT', 
					'cursive'
				],
				'elegant': [
					'Playfair Display', 
					'Georgia', 
					'serif'
				],
				'system': [
					'system-ui', 
					'-apple-system', 
					'BlinkMacSystemFont', 
					'Segoe UI', 
					'Roboto', 
					'Oxygen', 
					'Ubuntu', 
					'Cantarell', 
					'sans-serif'
				],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
