# Changelog

All notable changes to "Fold Ninja" extension will be documented in this file.

## [0.1.8] - 2023-11-13

### Changed

- Add transparency to icon.

## [0.1.7] - 2023-11-13

### Changed

- Add transparency to icon.

## [0.1.6] - 2023-11-13

### Added

- New icon for the "Fold Ninja" extension to improve visibility and brand recognition in the marketplace.

### Changed

- Updated the extension version to 0.1.6 to reflect new changes and enhancements.

## [0.1.4] - 2023-11-04

### Changes

- Add support for older vscode versions. Now works from v1.67.

## [0.1.3] - 2023-10-13

### Fixed

- Improved code folding functionality in Go files to correctly handle adjacent error handling blocks. Closes issue #1.

### Changes

- Updated the folding detection logic to utilize a counter for opening and closing braces, ensuring a more accurate representation of code structures.

## [0.1.2] - 2023-08-02

### Fixed

- Preserved scroll position after folding operations. The extension now remembers the topmost visible line before it performs the fold operation and restores the view to focus on the same line afterward, improving user experience.
- Enhanced robustness by adding a check to ensure the editor's **visibleRanges** property contains at least one item before accessing it.

## [0.1.1] - 2023-08-02

### Fixed

- Ensured correct cursor positioning after folding operation

## [0.1.0] - 2023-07-31

### Added

- Initial release of "Fold Ninja"
- Folding feature with three different states (Inactive, Compact, Expanded)
- Configuration options for folding states
- Visual indicators in status bar for different folding states
- Tooltip functionality to explain status bar indicators
- Demo videos in README.md
- Keywords in package.json for marketplace discoverability
- License (MIT) file
