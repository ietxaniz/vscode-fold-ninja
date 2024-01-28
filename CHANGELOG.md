# Changelog

All notable changes to "Fold Ninja" extension will be documented in this file.

## [0.4.5] - 2024-01-20

### Added
- Updated documentation to include 'Before and After' screenshots demonstrating the extension's impact on Go code readability.
- Created standardized issue templates for GitHub to streamline feature requests and bug reporting processes.

### Notes
- The documentation update aims to provide clearer visual examples of Fold Ninja's functionality.
- The new issue templates are designed to facilitate more structured and efficient feedback and requests from users.

## [0.4.4] - 2024-01-20

### Added
- Integration of language parsers based on tree-sitter (https://tree-sitter.github.io/tree-sitter/) for enhanced syntax analysis and folding accuracy.
- Implementation of FoldingRangeProvider for Go, enabling real-time computation of folding ranges as you type.
- Custom Go language parser and support for custom Go folding tags, allowing for tailored folding behavior in Go files.

### Removed
- Folding Calculation Modes, streamlining the extension's functionality and focusing on real-time updates.

### Notes
- This release marks a significant update with a focus on improving the experience for Go developers, laying the groundwork for future language support.

## [0.4.3] - 2024-01-20

- Minor improvements and bug fixes.

## [0.4.2] - 2024-01-20

- Minor improvements and bug fixes.

## [0.4.1] - 2024-01-20

- Internal optimizations and minor adjustments.

## [0.4.0] - 2024-01-20

- Configuration settings for folding calculation limits, enabling performance optimization.
- Folding Calculation Modes: Intense (for real-time updates) and On-Demand (for folding calculations initiated by user actions).

### Changed

- Refactored the code to improve efficiency and adaptability.
- Enhanced algorithm for more accurate folding in various programming languages.
- Complete rewrite of folding logic.

## [0.3.0] - 2024-01-18

### Added
- New 'Collapse First Block' feature `{.1.}`, enabling automatic collapsing of the first significant block or comment in a file. Ideal for files starting with extensive comments or licensing information.
- Extended support to include additional programming languages such as C++, C#, Go, Rust, JavaScript, TypeScript, and Python, enhancing the extension's versatility across different coding environments.

### Changed
- Improved algorithm for more accurate and efficient folding behavior in supported languages.

### Notes
- Invitation for community contributions to support more languages. Guidelines provided for contributors to submit example files and specify comment/string patterns in new languages.

## [0.2.1] - 2024-01-17

### Added

- Implementation of SHA1 hash-based change detection for active files to optimize performance.
- Event-driven architecture for unfold and fold actions, triggered by file change or user command.
- Singleton pattern for status management to ensure consistent state across the extension.

### Changed

- Enhanced fold and unfold logic to work selectively based on the file content changes.
- Optimizations for better memory management and efficient file change detection.

### Fixed

- Minor bug fixes and performance improvements in code folding logic.

## [0.2.0] - 2024-01-14

### Added

- New menu options to provide users with more control over code folding: 
  - "Collapse": Instantly fold all sections.
  - "Expand": Unfold all sections.
  - "Change status to Collapsing": Automatically collapse certain sections.
  - "Change status to Expanding": Automatically expand all sections.
  - "Change status to Inactive": Deactivate the extension.
- Demo video updated to showcase new functionalities.

### Changed

- Improved user interaction by allowing direct selection of folding states from a new menu in the status bar.
- Enhanced flexibility in code folding by enabling users to quickly switch between states without navigating through each status sequentially.


## [0.1.9] - 2023-11-13

### Changed

- Resize icon.

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
