import {defineConfig} from "vitest/config";

export default defineConfig({
    test: {
        coverage: {
            provider: 'istanbul',
            enabled: true,
            reporter: ['text', 'html'],
        },
        projects: [
            'packages/*',
            {
                extends: true,
                test: {
                    include: ['tests-e2e/**/*.spec.ts'],
                    name: 'e2e',
                }
            },
            {
                extends: true,
                test: {
                    include: ['tests-integration/**/*.spec.ts'],
                    name: 'integration',
                }
            },
            {
                extends: true,
                test: {
                    include: ['tests-component/**/*.spec.ts'],
                    name: 'component',
                }
            },
            {
                extends: true,
                test: {
                    include: ['tests-unit/**/*.spec.ts'],
                    name: 'unit',
                }
            }
        ]
    },
});
