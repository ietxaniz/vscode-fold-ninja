## Fold Ninja

Fold Ninja is a Visual Studio Code extension designed to streamline your code review process by allowing you to focus on what's most important. By simplifying the view of your code, it enhances readability, and supports a more effective and efficient analysis.

The primary goal of Fold Ninja is to reduce the noise that comes from excessive information in your code. It can automatically fold comments and verbose error management sections in Go files, offering a cleaner, more compact view of your code.

Whether you're trying to understand the core algorithm of a function without the distraction of error handling routines, or just trying to get a bird's eye view of a particularly complex piece of code, Fold Ninja is the tool you need. It offers three different folding states - Inactive, Compact, and Expanded, each designed to suit your varying requirements while analyzing or reviewing code.

## Features and Usage

### Fold Ninja Statuses

Fold Ninja operates in three different statuses designed to enhance your code navigation and review experience:

**1. Inactive `{X}`**

In this status, Fold Ninja is completely dormant and inactive. It allows your code to be displayed in its full, original form. The experience is akin to not having the extension installed at all, preserving the unaltered view of your codebase.

**2. Compact `{...}`**

Compact mode is where the power of Fold Ninja truly shines. In this active state, the extension effortlessly folds away verbose parts of your code. This includes comments across any language and error management blocks in Go files, making it versatile for a range of coding environments. The outcome? A more streamlined, focused, and comprehensible view of your code, regardless of the language you're working in.

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

Here, Fold Ninja folds away the error handling code, resulting in a more compact code view that places the primary logic front and center. This enhances the clarity of your code, making it quicker to review and easier to understand.


**3. Expanded `{<- ->}`**

The Expanded status unfolds any previously compacted sections. All parts of your code, including comments and error handling routines, are visible in this state.

### Switching Between Statuses

Transitioning between these statuses is as easy as a single click on the status bar item.

The status bar shows the current status of Fold Ninja in a visually intuitive way. Hovering over the status bar item will show a tooltip with the current status:

- `{X}` - Folding Ninja: inactive
- `{...}` - Folding Ninja: compact
- `{<- ->}` - Folding Ninja: expanded


### Demo video

![](./doc/fold-ninja-demo.gif)

## License

Fold Ninja is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.
