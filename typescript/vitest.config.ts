import {defineConfig} from "vitest/config";

export default defineConfig({
    test: {
        coverage: {
            provider: 'istanbul',
            enabled: true,
            reporter: ['text', 'html'],
        },
    },
});
