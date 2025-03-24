module.exports = {
  darkMode: ["class", "class"],
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./myapp/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	extend: {
  		boxShadow: {
  			square: '0 0 10px rgba(0, 0, 0, 0.3)'
  		},
  		keyframes: {
  			marquee: {
  				'0%': {
  					transform: 'translateX(0%)'
  				},
  				'100%': {
  					transform: 'translateX(-100%)'
  				}
  			}
  		},
  		animation: {
  			marquee: 'marquee 4s linear infinite'
  		},
  		spacing: {
  			'0.1': '1px',
  			'0.3': '3px',
  			'0.7': '7px'
  		},
  		backgroundImage: {
  			'mobile-app': 'url(images/image.png)'
  		},
  		fontFamily: {
  			Samarkan: [
  				'var(--font-samarkan)'
  			],
  			Lobster: [
  				'var(--font-lobster)'
  			],
  			Montserrat: [
  				'var(--font-montserrat)'
  			],
  			Nunito: [
  				'var(--font-nunito)'
  			],
  			Poppins: [
  				'var(--font-poppins)'
  			],
  			Dancing: [
  				'var(--font-dancing)'
  			],
  			Sen: [
  				'var(--font-sen)'
  			],
  			Roboto: [
  				'var(--font-roboto)'
  			]
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    require("@tailwindcss/typography"),
    function ({ addUtilities }) {
      addUtilities({
        ".break-inside-avoid": {
          breakInside: "avoid",
        },
      });
    },
      require("tailwindcss-animate")
],
};
