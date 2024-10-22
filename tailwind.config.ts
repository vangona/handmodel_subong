import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

const config: Config = {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['dark'],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				xs: '480px',
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1400px'
			}
		},
		extend: {
			screens: {
				xs: '480px',
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1400px'
			},
			colors: {
				warmgray: {
					light: '#E8E2DD',
					DEFAULT: '#D6D1CB',
					dark: '#D1CCC6'
				},
				offwhite: '#F5F5F5', // off-white 색상 추가
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				primary: {
					DEFAULT: '#A8A29E',
					foreground: '#1F2937', // 어두운 회색 추가
				},
				secondary: {
					DEFAULT: '#D1D5DB',
					foreground: '#1F2937', // 어두운 회색 추가
				},
				accent: '#F3F4F6', // 아주 밝은 회색
				neutral: '#374151', // 어두운 회색
				'base-100': '#FFFFFF', // 기본 배경색
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: ['Pretendard', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
				serif: ['Jeju Myeongjo', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
				mono: ['Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
			}
		}
	},
	plugins: [daisyui],
	daisyui: {
		themes: [
			{
				mytheme: {
					primary: '#A8A29E',
					'primary-foreground': '#1F2937',
					secondary: '#D1D5DB',
					'secondary-foreground': '#1F2937', // DaisyUI 테마에도 추가
					accent: '#F3F4F6',
					neutral: '#374151',
					'base-100': '#FFFFFF',
				},
			},
			'light',
			'dark',
		],
	},
};

export default config;
