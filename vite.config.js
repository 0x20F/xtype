import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const path = require('path');

export default defineConfig({
	resolve: {
		alias: {
			'components' : path.resolve(__dirname, 'src/app/components'),
			'pages': path.resolve(__dirname, 'src/app/pages'),
			'foundation': path.resolve(__dirname, 'src/app/foundation'),
			'support': path.resolve(__dirname, 'src/app/support'),
			'styles': path.resolve(__dirname, 'src/styles'),
			'assets': path.resolve(__dirname, 'src/assets')
		},
  	},
  	plugins: [react()],
})
