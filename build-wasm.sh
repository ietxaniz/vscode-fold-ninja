#!/bin/bash
npx tree-sitter build-wasm node_modules/tree-sitter-go
npx tree-sitter build-wasm node_modules/tree-sitter-c
npx tree-sitter build-wasm node_modules/tree-sitter-typescript/tsx
npx tree-sitter build-wasm node_modules/tree-sitter-typescript/typescript
