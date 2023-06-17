# Node.js Hacker News Fetcher

![Command-line Output](/images/output.png)

A command-line Node.js application that fetches and displays the top stories from Hacker News in a clean, easy-to-read format. It supports customization options such as the number of stories to fetch and whether to display source URLs. Ideal for quick updates without leaving your terminal.

This project is a Node.js port of the [Go](https://github.com/amscotti/hacker_news) and [C#](https://github.com/amscotti/hn-top) versions. It is also compatible with the [Bun](https://bun.sh/) JavaScript runtime.

This project requires Node.js version 20+ as it utilizes the `fetch` API.

## Usage

The application supports the following command-line options:

```
Options:
  -n, --number      Number of top news to show             [number] [default: 5]
  -u, --sourceUrls  Show source urls                  [boolean] [default: false]
  -h, --help        Show help                                          [boolean]
  -v, --version     Show version number                                [boolean]
```

Example usage with options: 

Fetch and display the top 10 stories with their source URLs:

```bash
npm start -- -n 10 -u
```

## License

This project is licensed under the MIT License.

## Contributing

Pull requests are welcome.