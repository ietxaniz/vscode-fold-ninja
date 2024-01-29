## Fold Ninja

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/ietxaniz.fold-ninja)](https://img.shields.io/visual-studio-marketplace/v/ietxaniz.fold-ninja)
[![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/ietxaniz.fold-ninja)](https://img.shields.io/visual-studio-marketplace/i/ietxaniz.fold-ninja)
[![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/ietxaniz.fold-ninja)](https://img.shields.io/visual-studio-marketplace/r/ietxaniz.fold-ninja)
[![GitHub stars](https://img.shields.io/github/stars/ietxaniz/vscode-fold-ninja)](https://github.com/ietxaniz/vscode-fold-ninja/stargazers)

Fold Ninja is an extension for Visual Studio Code, designed to boost code readability and efficiency in code reviews. With a spectrum of working modes - from Compact for a streamlined code review experience to Expanded for scenarios requiring an untouched code view, and an Intermediate mode offering customizable folding behavior - Fold Ninja adapts to your diverse coding needs. It also has a Inactive mode that temporarily disables automatic folding actions.

The extension triggers folding or unfolding actions as you navigate between files, considering any changes since your last view.

Fold Ninja currently supports the Go language, TSX (React), typescript and C. Future updates aim to extend support to other popular programming languages such as C++, Rust, JavaScript, Python, and C#.


## Screenshots

### Go Error Handling with Fold Ninja

The images below demonstrate how Fold Ninja enhances code readability by folding verbose error handling in Go. The 'Before' image on the left shows the original code, while the 'After' image on the right illustrates how Fold Ninja neatly folds away less critical lines, reducing clutter without hiding any important parts of the code.

![Go Error Handling - Before and After using Fold Ninja](./doc/images/go-errors-comparison.png)

## Features and Usage

### Working Modes

Fold Ninja offers four distinct working modes to suit various coding scenarios:

1. **Inactive `{X}`**: In this mode, Fold Ninja is entirely inactive, allowing the code to be displayed in its original form, without any alterations.

2. **Compact `{...}`**: Ideal for code reviews, this mode folds away comments and specific code blocks (like error handling in Go) for a cleaner, more focused view. For example, in Go files, non-critical error handling lines are folded to emphasize the main logic.

To illustrate, consider this block of Go code:

~~~go
file, err := os.Open("file.go") // For read access.
if err != nil {
	log.Fatal(err)
}
data := make([]byte, 100)
count, err := file.Read(data)
if err != nil {
	log.Fatal(err)
}
fmt.Printf("read %d bytes: %q\n", count, data[:count])
~~~

In Compact mode, Fold Ninja folds away error handling lines, resulting in the following view:

~~~go
file, err := os.Open("file.go") // For read access.
data := make([]byte, 100)
count, err := file.Read(data)
fmt.Printf("read %d bytes: %q\n", count, data[:count])
~~~

3. **Intermediate `{.|.}`**: A balance between the Compact and Expanded modes. Currently, this mode folds the first significant block of text in a file, typically a lengthy comment or license information. This feature is useful for immediately focusing on the primary content of the file.

4. **Expanded `{<- ->}`**: Unfolds all sections of your code, providing a complete view with all details visible.

Each mode is designed to enhance your coding experience by adapting to different needs, from detailed reviews to a broad overview of the code.

### Switching Between Working Modes

Switching between the working modes in Fold Ninja is designed to be straightforward and user-friendly. Here's how you can easily navigate through the different modes:

- **Access the Menu**: Simply click on the Fold Ninja icon located in the lower part of the editor. This icon displays the current working mode for easy identification.
- **Select a Mode**: The menu that appears upon clicking the icon will list the following options for you to choose from:
  - **Switch to Inactive Mode**: Deactivate Fold Ninja, reverting your code to its original, unaltered state.
  - **Switch to Compact Mode**: Activate the mode that compacts your code by folding comments and certain code blocks for a streamlined view.
  - **Switch to Intermediate Mode**: Opt for a balanced view that folds the first significant block in your file, such as extensive comments or license information.
  - **Switch to Expanded Mode**: Fully expand all sections of your code for a comprehensive view.
- **Execute Commands**: In addition to switching modes, you can directly execute commands like expand, compact, or intermediate for the current view from the same menu.

This intuitive interface ensures that you can efficiently manage your code's visibility with minimal disruption to your workflow.

## Configuration Options

Fold Ninja offers a range of configuration options to tailor its functionality to your coding needs. Below are the settings available, along with their purpose and default values:

1. **Maximum Number of Bytes for Folding Calculations**:
   - Setting: `fold-ninja.maxNumberOfBytes`
   - Default: 1,000,000 bytes
   - Purpose: Sets the upper limit on the file size, in bytes, for which fold-ninja will perform folding calculations. This optimization ensures efficient performance, particularly for larger files.

2. **Fold Selection Matching**:
   - Setting: `fold-ninja.foldSelection`
   - Default: `false`
   - Purpose: This setting controls whether Fold Ninja will fold a region of code that partially contains the current selection (where the user is actively working). When set to `false`, it prevents the folding of such regions, ensuring that the user's active work area remains unfolded for a smoother coding experience. If set to `true`, Fold Ninja will fold all identified regions, regardless of the user's current focus in the file.

3. **Language-Specific Folding Settings**:
   - Setting: `fold-ninja.<language>-folded` and `fold-ninja.<language>-intermediate-folded`
   - Purpose: Specifies comma-separated tags for folding in specific programming languages. There are separate settings for 'compact' and 'intermediate' modes, allowing for customized folding behavior based on your preferences and the language syntax.

### Supported Languages and Customization Parameters

| Language | Customization Parameters                           | Supported Tags                                 |
|----------|----------------------------------------------------|----------------------------------------------|
| C       | `fold-ninja.x-folded`, `fold-ninja.c-intermediate-folded` | 'first-comment', 'comment', 'import', 'decl', 'func' |
| Go       | `fold-ninja.go-folded`, `fold-ninja.go-intermediate-folded` | 'first-comment', 'comment', 'err', 'import', 'decl', 'func' |
| tsx (react)| `fold-ninja.tsx-folded`, `fold-ninja.tsx-intermediate-folded` | 'first-comment', 'comment', 'import', 'decl', 'func', 'jsx', 'class' |
| typescript| `fold-ninja.typescript-folded`, `fold-ninja.typescript-intermediate-folded` | 'first-comment', 'comment', 'import', 'decl', 'func', 'class' |

More languages will be supported in future updates, each with their own customizable folding tags to suit the unique syntax and structure of the language.

## Demo video

![](./doc/fold-ninja-demo.gif)

## License

Fold Ninja is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.
